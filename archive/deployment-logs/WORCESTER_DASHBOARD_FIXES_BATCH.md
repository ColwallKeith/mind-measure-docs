# Worcester Dashboard Fixes - Complete Batch

## Summary
Worcester dashboard is showing dummy data because `UniversityDataService.ts` is returning empty arrays and hardcoded values. This document outlines ALL fixes to deploy in ONE batch.

---

## Fix 1: School Snapshots Issue

###Problem:
- `getSchoolSnapshots()` tries to query `profiles.school` column
- This column DOESN'T EXIST in profiles table
- Resulted in empty results

### Solution:
- `profiles` table has `university_id`, `course`, and `year_of_study` but NOT `school`
- For now, return empty array (no school breakdown available)
- OR: Use `course` as a proxy for "school" if we can map courses to schools
- **DECISION NEEDED**: Do we have school/faculty data in profiles? If not, this feature cannot work.

---

## Fix 2: Weekly Trends (Empty Array)

### Problem:
Line 549 of `UniversityDataService.ts` returns `weeklyTrends: []`

### Solution:
Implement `getWeeklyTrends()` function:
```typescript
private async getWeeklyTrends(
  userIds: string[], 
  weeks: number = 12
): Promise<Array<{week: string; date: string; score: number; activeUsers: number}>> {
  // 1. Get last N weeks of fusion_outputs
  // 2. Group by week (Sunday-Saturday)
  // 3. Calculate average final_score per week
  // 4. Count unique user_ids per week
  // 5. Return chronological array
}
```

---

## Fix 3: Positive Themes & Concern Topics (Empty Arrays)

### Problem:
Lines 557-558 of `UniversityDataService.ts` return `positiveThemes: []` and `concernTopics: []`

### Solution:
Extract themes from `fusion_outputs.analysis`:
- **Positive themes**: `analysis->driver_positive` (array of strings)
- **Concerns**: `analysis->driver_negative` (array of strings)

```typescript
private async getTopThemes(
  fusionData: any[], 
  field: 'driver_positive' | 'driver_negative',
  limit: number = 8
): Promise<Topic[]> {
  // 1. Extract all themes from analysis[field]
  // 2. Count frequency of each theme
  // 3. Calculate trend (compare current period vs previous period)
  // 4. Sort by frequency, take top N
  // 5. Return array of {keyword, count, trend, trendValue}
}
```

---

## Fix 4: Engagement Metrics (Using Defaults)

### Problem:
`EngagementMetrics.tsx` shows:
- Daily Check-ins: 2,847 (default, line 128)
- Average Streak: 8.2 (default, line 129)
- Completion Rate: 73% (default, line 130)
- Response Quality: 4.2/5 (default, line 131)

### Solution:
`getUniversityMetrics()` DOES calculate these, but they may be returning 0 due to:
1. No `assessment_sessions` data in database
2. Date filtering removing all data
3. Wrong status values (expecting 'completed' but getting something else)

**Debug needed**:
- Check if `assessment_sessions` table has data for Worcester users
- Check what `status` values exist
- Verify `streak_count` in profiles isn't all 0

---

## Fix 5: InterventionImpact (Hardcoded Data)

### Problem:
`WellbeingInsights.tsx` shows hardcoded interventions (lines 16-50)

### Solution:
- There is NO `interventions` table in database
- Return empty array (no interventions configured)
- Update component to show "No interventions tracked yet" instead of dummy data

---

## Fix 6: Mood Score Calculation

### Problem:
- Lines 305 and 442 of `UniversityDataService.ts` have:
  ```typescript
  avgMoodScore: 6.5, // TODO: Get from conversation_insights
  ```
- But mood_score is in `fusion_outputs.analysis->>'mood_score'` for check-ins

### Solution:
**ALREADY FIXED** in latest commit (mood_score extraction from analysis JSONB)

---

## Implementation Plan

### Step 1: Add Missing Helper Functions to UniversityDataService

```typescript
// Add after getDateRange() function (around line 590)

private async getWeeklyTrends(
  userIds: string[], 
  weeks: number = 12
): Promise<Array<{week: string; date: string; score: number; activeUsers: number}>> {
  // Implementation here
}

private async getTopThemes(
  fusionData: any[], 
  field: 'driver_positive' | 'driver_negative',
  limit: number = 8
): Promise<Array<{
  keyword: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  severity?: 'high' | 'medium' | 'low';
}>> {
  // Implementation here
}
```

### Step 2: Update getUniversityMetrics() to Call These Functions

Change lines 549, 557-558 from:
```typescript
weeklyTrends: [],
topTopics: [],
positiveThemes: [],
concernTopics: []
```

To:
```typescript
weeklyTrends: await this.getWeeklyTrends(userIds, 12),
topTopics: [], // Not implemented (would need analysis.themes frequency)
positiveThemes: await this.getTopThemes(fusion, 'driver_positive', 8),
concernTopics: await this.getTopThemes(fusion, 'driver_negative', 8)
```

### Step 3: Fix getSchoolSnapshots()

Option A (if no school data):
```typescript
// Line 326, return immediately:
console.log('❌ School-level data not available - profiles.school column does not exist');
return [];
```

Option B (if we want to use `course` as proxy):
```typescript
// Query profiles.course instead of profiles.school
// Group by course name
```

### Step 4: Remove Hardcoded Fallbacks

Search for all locations that default to demo data and replace with:
```typescript
// OLD:
const engagementData = metricsData?.engagementMetrics || {
  dailyCheckins: 2847,
  averageStreak: 8.2,
  completionRate: 73,
  qualityScore: 4.2
};

// NEW:
const engagementData = metricsData?.engagementMetrics || {
  dailyCheckins: 0,
  averageStreak: 0,
  completionRate: 0,
  qualityScore: 0
};
```

---

## Testing Checklist

After deployment, verify:
1. ✅ Engagement Overview shows real numbers (not 2,847)
2. ✅ Weekly trends chart displays (not empty)
3. ✅ Positive themes list populated (not defaults)
4. ✅ Student concerns list populated (not defaults)
5. ✅ School snapshots either empty OR showing real data
6. ✅ Intervention Impact shows "No interventions yet" (not dummy workshops)

---

## Files to Modify

1. `/src/services/UniversityDataService.ts` - Add helper functions, update getUniversityMetrics()
2. `/src/components/EngagementMetrics.tsx` - Remove hardcoded defaults (lines 128-131)
3. `/src/components/WellbeingInsights.tsx` - Remove hardcoded interventions (lines 16-50), show empty state
4. (Optional) `/src/components/TopTopics.tsx` - Remove hardcoded defaults (lines 20-40)

---

## Estimated Impact
- Build time: 16-20 minutes
- Risk: MEDIUM (complex data transformations)
- Testing time: 10 minutes
- **TOTAL: ~35 minutes for complete fix**
