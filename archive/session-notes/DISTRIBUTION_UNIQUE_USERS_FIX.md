# Distribution & Insight Label Fixes

## Issues Fixed ✅

### 1. ✅ Distribution Now Counts Unique Users (Not Check-ins)

**Problem:** Distribution percentages were counting ALL check-ins, including multiple from the same user. If a user did 3 check-ins, they were counted 3 times.

**Impact:**
- Inconsistent with "Students checked in today" metric (which counts unique users)
- Inflated distribution numbers if active users check in multiple times
- Misleading percentages (e.g., "83% Good" meant 83% of check-ins, not 83% of students)

**Fix:** Both distribution calculations now use **most recent check-in per user**:

#### Fix 1A: `getTodaySnapshot()` (24h window)
**File:** `src/services/UniversityDataService.ts` - Lines 260-280

```typescript
// Get most recent check-in per user in last 24h
const userLatestCheckins = new Map<string, any>();
todayData.forEach((row: any) => {
  const existing = userLatestCheckins.get(row.user_id);
  if (!existing || new Date(row.created_at) > new Date(existing.created_at)) {
    userLatestCheckins.set(row.user_id, row);
  }
});

const uniqueCheckins = Array.from(userLatestCheckins.values());
const scores = uniqueCheckins.map((row: any) => row.final_score).filter((s: any) => s != null);

// Distribution based on unique users (one check-in per user)
const distribution = {
  excellent: Math.round((scores.filter((s: number) => s >= 80).length / scores.length) * 100),
  good: Math.round((scores.filter((s: number) => s >= 60 && s < 80).length / scores.length) * 100),
  moderate: Math.round((scores.filter((s: number) => s >= 40 && s < 60).length / scores.length) * 100),
  concerning: Math.round((scores.filter((s: number) => s < 40).length / scores.length) * 100)
};
```

**Used by:** `CurrentWellbeingSnapshot.tsx` - Today's Wellbeing Snapshot card

---

#### Fix 1B: `getUniversityMetrics()` (timeRange window)
**File:** `src/services/UniversityDataService.ts` - Lines 662-697

```typescript
// Get unique users - most recent check-in per user in timeRange
const userLatestCheckins = new Map<string, any>();
fusion.forEach((row: any) => {
  const existing = userLatestCheckins.get(row.user_id);
  if (!existing || new Date(row.created_at) > new Date(existing.created_at)) {
    userLatestCheckins.set(row.user_id, row);
  }
});

const uniqueCheckins = Array.from(userLatestCheckins.values());

// Calculate metrics based on unique check-ins (one per user)
const scores = uniqueCheckins.map((f: any) => f.final_score).filter((s: any) => s != null);

// Calculate distribution based on unique users (one check-in per user)
const distribution = {
  excellent: Math.round((scores.filter((s: number) => s >= 80).length / Math.max(scores.length, 1)) * 100),
  good: Math.round((scores.filter((s: number) => s >= 60 && s < 80).length / Math.max(scores.length, 1)) * 100),
  moderate: Math.round((scores.filter((s: number) => s >= 40 && s < 60).length / Math.max(scores.length, 1)) * 100),
  concerning: Math.round((scores.filter((s: number) => s < 40).length / Math.max(scores.length, 1)) * 100)
};
```

**Used by:** `TrendCharts.tsx` - MindMeasureChart (Current Distribution donut chart)

---

### 2. ✅ "Weekly Insight" Now Dynamic Based on TimeRange

**Problem:** Label always said "Weekly Insight" and "+4% increase in Green zone students this week", even when showing 30-day or 90-day data.

**Fix:** Label now changes based on the `timeRange` prop:
- `timeRange='7d'` → "This Week" + "this week"
- `timeRange='30d'` → "This Month" + "this month"
- `timeRange='90d'` → "This Quarter" + "this quarter"

**File:** `src/components/TrendCharts.tsx` - Lines 305-312

```tsx
<div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
  <div className="text-sm font-medium text-green-900 mb-1">
    {timeRange === '7d' ? 'This Week' : timeRange === '30d' ? 'This Month' : 'This Quarter'}
  </div>
  <p className="text-sm text-green-800">
    +4% increase in Green zone students {timeRange === '7d' ? 'this week' : timeRange === '30d' ? 'this month' : 'this quarter'}
  </p>
</div>
```

**Note:** The "+4% increase" text is still hardcoded demo data. In future, this should calculate real trend.

---

## What This Means

### Before Fix:
- **Sample Size:** "2 students checked in today"
- **Distribution:** Based on 3 check-ins (if one user did 2)
- **Result:** Mismatch - 2 students but 3 data points in distribution

### After Fix:
- **Sample Size:** "2 students checked in today"
- **Distribution:** Based on 2 check-ins (most recent per user)
- **Result:** Consistent - 2 students = 2 data points in distribution

---

## Example Scenario

**Before:**
- Keith does 2 check-ins today: Score 70 (Good), Score 65 (Good)
- Sarah does 1 check-in today: Score 45 (Moderate)
- **Distribution:** Good: 67% (2/3), Moderate: 33% (1/3)
- **Sample Size:** 2 students
- **Issue:** 67% looks like 2 students are Good, but it's really just Keith's 2 check-ins

**After:**
- Keith's most recent: Score 65 (Good)
- Sarah's most recent: Score 45 (Moderate)
- **Distribution:** Good: 50% (1/2), Moderate: 50% (1/2)
- **Sample Size:** 2 students
- **Correct:** 50% of students (1 of 2) are Good, 50% are Moderate

---

## Files Changed

1. **`src/services/UniversityDataService.ts`**
   - `getTodaySnapshot()` - Now filters to unique users before calculating distribution
   - `getUniversityMetrics()` - Now filters to unique users before calculating distribution

2. **`src/components/TrendCharts.tsx`**
   - Dynamic insight label based on `timeRange` prop

---

## Testing Checklist

After deployment:

- [ ] Distribution percentages match unique student count (not inflated by multiple check-ins)
- [ ] If sample size = 2, distribution should have max 2 students across all categories
- [ ] "Weekly Insight" label changes when switching between 7d/30d/90d time ranges
- [ ] Distribution in "Today's Wellbeing Snapshot" is consistent with "Students checked in today"
- [ ] Distribution in "Current Distribution" (donut chart) matches the selected time range

---

## Ready to Deploy

All changes complete and linter-clean. These can be deployed together with the earlier dashboard fixes (school cards, demo badges, sample size unique users).
