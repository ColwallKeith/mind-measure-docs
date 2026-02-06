# Mind Measure Overview Dashboard Audit

## Executive Summary

This audit reviews the current state of the university Overview dashboard, identifying what's working, what needs fixing, and opportunities for better utilizing the data we're collecting from students.

---

## Current Dashboard Components

### 1. **Cohort Filters** ✅ WORKING
- **Status**: Functional
- **Filters**: Faculty, Year, Domicile, Residence
- **Data Source**: Universities table (faculties, schools, halls)
- **Issues**: None identified

### 2. **Mind Measure Score Trend** ⚠️ NEEDS FIXING
- **Status**: Partially working
- **Current Metrics**:
  - 7-day rolling average trend
  - Current score with change indicator
  - Weekly trend data
- **CRITICAL ISSUE - Wellbeing Zones Inconsistency**:
  - **Dashboard shows 3 zones**:
    - Green ≥60 (Good wellbeing)
    - Amber 45-59 (At-risk)
    - Red <45 (Concerning)
  - **Individual results use 4 categories**:
    - Excellent ≥80 (Green)
    - **Good ≥60 (BLUE)** ← MISSING FROM DASHBOARD
    - Moderate ≥40 (Yellow)
    - Needs Attention <40 (Red)
- **Recommendation**: Standardize to 4-zone system everywhere

### 3. **Current Distribution (Pie Chart)** ⚠️ NEEDS FIXING
- **Status**: Partially working
- **Current**: Shows 3 zones (Green/Amber/Red)
- **Should show**: 4 zones including Blue for "Good" (60-79)
- **Data Source**: `fusion_outputs` table, `score` column

### 4. **Engagement Metrics** ✅ WORKING
- **Status**: Functional with real data
- **Metrics Displayed**:
  - Daily Active Check-ins (from `assessment_sessions`)
  - Median Streak (consecutive check-in days)
  - Completion Rate (full check-in %)
  - Response Quality (1-5 scale)
  - Engagement Health Score (composite metric)
- **Data Sources**:
  - `assessment_sessions` table
  - `profiles` table (streak_count)
  - `fusion_outputs` table (qc_overall for quality)

### 5. **Positive Themes & Student Concerns** ⚠️ PARTIALLY WORKING
- **Status**: UI ready, data needs better wiring
- **What's Working**:
  - Beautiful two-column layout
  - Trend indicators
  - Severity badges for concerns
- **Data Source**: `conversation_insights` table → `topics` JSONB
- **Current Issue**: Needs sentiment classification
- **Available Data We're Not Using**:
  - `drivers` JSONB in `fusion_outputs` (positive/negative keywords)
  - `emotional_themes` in `session_insights`
  - Topics from baseline assessments
- **Recommendation**: Parse `drivers` JSON to extract positive/negative keywords with counts

### 6. **Baseline Assessment Journey** ⚠️ NEEDS ATTENTION
- **Status**: Shows basic completion stats
- **Current Metrics**:
  - % of students who completed baseline
  - Average time to complete
  - Completion trend
- **Data Source**: `assessment_sessions` where `assessment_type = 'baseline'`
- **Missing Opportunities**:
  - PHQ-2 / GAD-2 score distributions
  - Baseline score vs current score comparison
  - Risk categorization from baseline

### 7. **Intervention Impact** ❌ NOT IMPLEMENTED
- **Status**: Component exists but placeholder data only
- **Purpose**: Show effectiveness of wellbeing interventions
- **Required**: Needs intervention tracking system
- **Recommendation**: Defer until intervention features are built

### 8. **AI Summary** ❌ PLACEHOLDER ONLY
- **Status**: Component exists but not functional
- **Purpose**: AI-generated insights about university wellbeing
- **Recommendation**: Implement using Claude with weekly data summaries

---

## Critical Issues to Fix

### Priority 1: Wellbeing Zones Standardization

**Problem**: Inconsistent categorization across the platform
- Dashboard uses 3 zones
- Individual results use 4 categories
- Database uses baseline-relative categories

**Solution**: Adopt a **4-zone** system universally:

```
Excellent (80-100):  Green   #0BA66D
Good (60-79):        Blue    #3B82F6  ← CURRENTLY MISSING
Moderate (40-59):    Amber   #F4A742
Concerning (0-39):   Red     #EB5757
```

**Affected Components**:
- `TrendCharts.tsx` - Zone legend
- `TrendCharts.tsx` - Distribution pie chart
- `getBandColor()` and `getBandName()` functions
- Any reporting templates

### Priority 2: Topics/Drivers Data Wiring

**Problem**: Rich data exists but isn't being displayed

**Available Data**:
```sql
-- fusion_outputs table
drivers: {
  "positive": ["friends", "exercise", "motivated"],
  "negative": ["stress", "deadlines", "anxiety"]
}

-- conversation_insights table
topics: ["academic pressure", "social connections", "sleep"]
emotional_themes: {...}
```

**Solution**: Create aggregation query:
```sql
SELECT 
  keyword,
  sentiment,
  COUNT(*) as mention_count,
  university_id
FROM (
  SELECT 
    jsonb_array_elements_text(drivers->'positive') as keyword,
    'positive' as sentiment,
    f.university_id
  FROM fusion_outputs f
  UNION ALL
  SELECT 
    jsonb_array_elements_text(drivers->'negative') as keyword,
    'negative' as sentiment,
    f.university_id
  FROM fusion_outputs f
) subquery
GROUP BY keyword, sentiment, university_id
ORDER BY mention_count DESC
LIMIT 10;
```

---

## Untapped Metrics (Data We Collect But Don't Display)

### 1. **Demographic Wellbeing Breakdowns** 🆕
**Available Data**:
- `profiles`: year_of_study, living_situation, domicile, gender, is_first_generation
- `fusion_outputs`: score

**Potential Metrics**:
- Average score by year of study
- First-generation vs continuing-generation students
- International vs home students
- On-campus vs off-campus residents
- Trends by demographic over time

**Visualization**: Small multiples or comparison bars

---

### 2. **PHQ-2 & GAD-2 Clinical Scores** 🆕
**Available Data**:
- `validated_scale_responses` table
- `session_measures` table

**Potential Metrics**:
- Distribution of PHQ-2 scores (depression screening)
- Distribution of GAD-2 scores (anxiety screening)
- Correlation with Mind Measure scores
- % of students scoring above clinical threshold
- Trend over time

**Clinical Value**: HIGH - these are validated instruments

---

### 3. **Multimodal Confidence Scores** 🆕
**Available Data**:
- `fusion_outputs`: p_worse_audio, p_worse_visual, p_worse_text
- `fusion_outputs`: uncertainty

**Potential Metrics**:
- Average data quality by modality
- % of assessments with high uncertainty
- Modality contribution breakdown (which signals matter most)

**Use Case**: Data quality monitoring, research insights

---

### 4. **Conversation Quality Metrics** 🆕
**Available Data**:
- `assessment_sessions`: duration (created_at to created_at_end)
- `fusion_outputs`: qc_overall
- Response word counts (from transcript)

**Potential Metrics**:
- Average conversation duration
- % of conversations rated "reliable" quality
- Engagement depth score
- Time of day patterns

---

### 5. **Longitudinal Individual Tracking** 🆕
**Available Data**:
- `fusion_outputs`: score over time per user_id
- `feature_baselines`: personal baselines

**Potential Metrics**:
- % of students improving vs declining vs stable
- Average change from baseline
- Recovery time after dips
- Predictive alerts (3 consecutive declining scores)

**Privacy Note**: Show aggregate only, not individuals

---

### 6. **Academic Structure Insights** 🆕
**Available Data**:
- `profiles`: school, faculty, department
- `universities`: academic structure

**Potential Metrics**:
- Wellbeing scores by school/faculty
- Comparison across departments
- Spot outliers (unusually low/high)

**Use Case**: Targeted interventions by academic unit

---

### 7. **Baseline vs Current Comparison** 🆕
**Available Data**:
- First assessment (baseline) score
- Current check-in scores

**Potential Metrics**:
- % above their baseline
- % below their baseline
- Average deviation from baseline
- Population drift over semester

**Insight**: Shows whether population is improving or declining

---

### 8. **Response Patterns** 🆕
**Available Data**:
- Check-in timestamps
- Day of week, time of day

**Potential Metrics**:
- Peak check-in times (heatmap)
- Weekend vs weekday patterns
- Term-time vs vacation engagement

**Use Case**: Optimize intervention timing

---

## Proposed New Dashboard Layout

### Top Section (Existing - Keep)
1. Cohort Filters

### Main Metrics Row (Fix + Enhance)
2. **Mind Measure Score Trend** (Fix 4-zone system)
3. **Current Distribution** (Add blue zone)

### Engagement Row (Existing - Keep)
4. **Engagement Metrics** (4 tiles)

### Insights Row (Fix + Add)
5. **Positive Themes** (Wire up drivers data)
6. **Student Concerns** (Wire up drivers data)

### Clinical & Demographic Row (NEW)
7. **PHQ-2/GAD-2 Distribution** (New widget)
8. **Demographic Comparison** (New widget - e.g., scores by year)

### Baseline Row (Enhance)
9. **Baseline Journey** (Enhance with score changes)

### Bottom Row
10. **AI Weekly Summary** (Implement with Claude)

---

## Implementation Priority

### Phase 1 (Critical Fixes) - 1-2 days
1. ✅ Fix 4-zone wellbeing system everywhere
2. ✅ Wire up Positive Themes from `drivers` JSON
3. ✅ Wire up Student Concerns from `drivers` JSON
4. ✅ Update Current Distribution pie chart to 4 zones

### Phase 2 (Quick Wins) - 2-3 days
5. ✅ Add PHQ-2/GAD-2 distribution widget
6. ✅ Add demographic breakdown widget (scores by year/living situation)
7. ✅ Enhance Baseline Journey with score comparisons

### Phase 3 (Advanced Analytics) - 1 week
8. ✅ Implement longitudinal tracking (improving vs declining %)
9. ✅ Add school/faculty comparison view
10. ✅ Create conversation quality metrics widget

### Phase 4 (AI & Automation) - 1 week
11. ✅ Implement AI Weekly Summary with Claude
12. ✅ Add predictive alerts for at-risk students
13. ✅ Create automated insights generation

---

## Data Quality Considerations

### Wellbeing Zones
- **Green/Excellent**: Students thriving, minimal intervention needed
- **Blue/Good**: Students doing well, maintain support
- **Amber/Moderate**: Students at risk, proactive outreach recommended
- **Red/Concerning**: Students struggling, immediate support needed

### Demo Data vs Real Data
- Current dashboard has robust demo data fallback
- Need to ensure real data follows same structure
- Add "Using demo data" indicator when live data unavailable

---

## Questions for Stakeholders

1. **Wellbeing Zones**: Confirm 4-zone system (Green/Blue/Amber/Red) is preferred?
2. **Clinical Scores**: Should PHQ-2/GAD-2 scores be visible to all staff or restricted?
3. **Demographic Data**: Privacy concerns with showing demographic breakdowns?
4. **School Comparisons**: Should schools be able to see each other's data or only their own?
5. **AI Summary**: Tone preference - clinical/formal vs conversational?

---

## Technical Debt

1. **UniversityDataService**: Currently uses demo data fallback - need to ensure real queries work
2. **Cohort Filtering**: Currently passed but not applied to data queries
3. **Time Range**: Currently passed but not fully implemented in all widgets
4. **Caching**: No caching of aggregated metrics - consider Redis for performance

---

## Conclusion

The Overview dashboard has a **strong foundation** with good UI/UX, but suffers from:
1. ✅ Inconsistent wellbeing zone definitions
2. ✅ Underutilized rich data (drivers, PHQ/GAD scores, demographics)
3. ✅ Missing clinical insights (PHQ-2/GAD-2)
4. ✅ No longitudinal comparisons (baseline vs current)

**Biggest Win**: Fixing the 4-zone system and wiring up the drivers data will immediately make the dashboard more accurate and valuable.

**Biggest Opportunity**: Adding PHQ-2/GAD-2 clinical scores and demographic comparisons will provide actionable insights for targeted interventions.

