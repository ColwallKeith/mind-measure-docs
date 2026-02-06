# Worcester Dashboard Data Gaps - Must Be Fixed

## Current Status
Worcester dashboard is showing mostly DUMMY DATA, not real data from the database.

## Components Using Dummy Data (Must Be Fixed)

### 1. EngagementMetrics Component
**Location**: `src/components/EngagementMetrics.tsx`

**Current Dummy Values**:
- Daily Check-Ins: Defaults to 2,847 (line 128)
- Average Streak: Defaults to 8.2 (line 129)
- Completion Rate: Defaults to 73% (line 130)
- Response Quality: Defaults to 4.2/5 (line 131)
- Sparkline data: Using hardcoded week data (lines 9-17)

**What Should Be Real**:
- `dailyCheckins`: Count of `assessment_sessions` with `status='completed'` in last 24 hours
- `averageStreak`: Average of `profiles.streak_count` for all Worcester users
- `completionRate`: % of sessions completed vs initiated
- `qualityScore`: Should be derived from actual data (maybe average mood_score or transcript word count)
- Sparkline: Should show last 7 days of real check-ins

**Current Code Issue**:
`UniversityDataService.getUniversityMetrics()` returns these values, but sparkline calculation fails because `weeklyTrends` is empty array (line 549).

---

### 2. TopTopics Component (Positive Themes & Student Concerns)
**Location**: `src/components/TopTopics.tsx`

**Current Dummy Values**:
```typescript
defaultPositiveTopics: ["friends" (892), "exercise" (743), "progress" (621), ...]
defaultConcernTopics: ["finances" (1247), "deadlines" (1089), "placement" (892), ...]
```

**What Should Be Real**:
- Extract from `fusion_outputs.analysis->driver_positive` (positive themes)
- Extract from `fusion_outputs.analysis->driver_negative` (concerns/stressors)
- Count frequency of each theme across all check-ins
- Calculate trend (compare last 7 days vs previous 7 days)

**Current Code Issue**:
`UniversityDataService.getUniversityMetrics()` returns empty arrays for:
- `positiveThemes: []` (line 557)
- `concernTopics: []` (line 558)

---

### 3. InterventionImpact Component
**Location**: `src/components/WellbeingInsights.tsx`

**Current Dummy Values**:
```typescript
interventionData = [
  { name: "Sleep Hygiene Workshop", participants: 156, beforeScore: 54, afterScore: 62, ... },
  { name: "Financial Wellness Program", participants: 234, beforeScore: 51, afterScore: 58, ... },
  ...
]
```

**What Should Be Real**:
- This data doesn't exist in current database schema
- Need to track interventions (campaigns, workshops, resources pushed)
- Compare scores before/after intervention dates
- FOR NOW: Should return empty array (no interventions configured)

---

### 4. MindMeasureChart Component (Weekly Trends)
**Location**: `src/components/TrendCharts.tsx`

**Current Issue**:
`weeklyTrends` is returned as empty array (line 549 of UniversityDataService), causing chart to show demo data.

**What Should Be Real**:
- Group `fusion_outputs` by week for last 12 weeks
- Calculate average `final_score` per week
- Count unique active users per week
- Return as `[{ week: 'W1', date: '2024-01-08', score: 67, activeUsers: 45 }, ...]`

---

### 5. School-Level Snapshots
**Location**: Dashboard tab "By School"

**Current Issue**:
- Only showing one school (Business School) with aggregated average
- Not picking up individual user's school assignments
- "Detailed breakdown" modal showing fictitious data

**Root Causes**:
1. `profiles.school` field might not be set for users
2. School names in `profiles.school` might not match `universities.schools[].name`
3. Detailed breakdown modal might be using different data source

---

## Fixes Required in UniversityDataService

### Fix 1: Implement `getWeeklyTrends()`
**New function needed**:
```typescript
private async getWeeklyTrends(userIds: string[], weeks: number = 12): Promise<Array<{
  week: string;
  date: string;
  score: number;
  activeUsers: number;
}>> {
  // Group fusion_outputs by week
  // Calculate average score per week
  // Count unique users per week
}
```

**Called from**: `getUniversityMetrics()` line 549

---

### Fix 2: Implement `getPositiveThemes()` and `getConcernTopics()`
**New functions needed**:
```typescript
private async getPositiveThemes(userIds: string[], startDate: string, endDate: string): Promise<Topic[]> {
  // Query fusion_outputs.analysis->driver_positive
  // Count frequency of each theme
  // Calculate trends (compare to previous period)
  // Return top 8 themes
}

private async getConcernTopics(userIds: string[], startDate: string, endDate: string): Promise<Topic[]> {
  // Query fusion_outputs.analysis->driver_negative
  // Count frequency of each stressor
  // Calculate trends
  // Assign severity based on frequency
  // Return top 8 concerns
}
```

**Called from**: `getUniversityMetrics()` lines 557-558

---

### Fix 3: Fix School Assignment Logic
**Issue**: `getSchoolSnapshots()` might not be matching user schools correctly

**Debug needed**:
1. What values are in `profiles.school` for Worcester users?
2. What values are in `universities.schools[].name` for Worcester?
3. Are they matching exactly (case-sensitive)?

**Potential fix**: Normalize school names (trim, lowercase) before comparison

---

### Fix 4: Remove Dummy Data Fallbacks
**Current behavior**: When real data fails, falls back to demo data

**New behavior**: 
- Show `0` or "No data" if no real data available
- Log clearly: "No data available for X metric"
- Don't show fake numbers

---

## Priority Order (Most Critical First)

1. **Engagement Metrics (dailyCheckins, activeToday)** - User reports "2,847 students checking in today" but only 1-2 real users
2. **School Snapshots** - "Business school showing average but only user posting is in business school"
3. **Positive Themes & Concerns** - Completely fake data
4. **Weekly Trends** - Empty data causing chart issues
5. **Intervention Impact** - Should be empty (no interventions configured)

---

## Next Steps

1. Read DATABASE_REFERENCE.md to confirm exact field names
2. Implement helper functions for themes/concerns extraction
3. Implement weeklyTrends calculation
4. Test with Worcester's actual user data
5. Remove all demo fallbacks for Worcester
6. Keep LSE as demo-only (status='planning')
