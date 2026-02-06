# Dashboard Issues - Batch Fix

## Issues to Address:

### 1. ❌ "450 students checked in today" - Wrong Count
**Location:** `CurrentWellbeingSnapshot.tsx` line 303  
**Problem:** Shows `universityData.sampleSize` which comes from `getTodaySnapshot()`. This is counting ALL check-ins in last 24h, not unique students.

**Fix:** Change to count unique `user_id` values, not total check-ins.

```typescript
// In getTodaySnapshot():
const uniqueUsers = new Set(todayData.map((row: any) => row.user_id));
sampleSize: uniqueUsers.size  // NOT todayData.length
```

---

### 2. ❌ School Cards Show Red 0.0 (Need "No Data" State)
**Location:** School breakdown cards  
**Problem:** Schools with `avgMindMeasureScore: 0` show red (concerning) when they should show lilac "No data yet"

**Fix:** Add special handling for score === 0:

```typescript
// Color logic:
if (sampleSize === 0 || avgScore === 0) {
  return 'bg-purple-100'; // Lilac for no data
} else if (avgScore >= 80) {
  return 'bg-green-500'; // Green for excellent
} else if (avgScore >= 60) {
  return 'bg-blue-500'; // Blue for good
}...
```

---

### 3. ❌ "+0.7000000000000028 vs last week" - Floating Point Bug
**Location:** Trend cards in `CurrentWellbeingSnapshot.tsx`  
**Problem:** JavaScript floating point precision

**Fix:** Round to 1 decimal place:

```typescript
weekChange: Math.round(weekChange * 10) / 10  // NOT just weekChange
monthChange: Math.round(monthChange * 10) / 10
```

---

### 4. ❌ Intervention Impact & This Week's State of Play - Need "Demo Data" Label
**Location:** `WellbeingInsights.tsx` (InterventionImpact component)  
**Problem:** Shows dummy data without indicating it's not real

**Fix:** Add prominent badge:

```tsx
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Intervention Impact Tracking</CardTitle>
      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
        Demo Data
      </Badge>
    </div>
  </CardHeader>
  ...
</Card>
```

---

### 5. ❌ Detailed Breakdown Cards Have Dummy Data
**Location:** School detail modal  
**Problem:** Clicking school cards shows fictitious data

**Fix:** Either:
- **Option A:** Remove detailed breakdown modal entirely until real data
- **Option B:** Replace with real data from `getCohortBreakdowns()`
- **Option C:** Show "Demo Data" badge in modal

---

## Implementation Priority:

1. **HIGH:** Floating point fix (easy, looks broken)
2. **HIGH:** Sample size = unique users (wrong number)
3. **HIGH:** School card "No data" state (all red looks bad)
4. **MEDIUM:** Demo data labels (transparency)
5. **LOW:** Detailed breakdown cards (less visible)

---

## Code Changes Needed:

### File 1: `src/services/UniversityDataService.ts`

**getTodaySnapshot():**
```typescript
// Line ~253 - Change from:
const sampleSize = scores.length;

// To:
const uniqueUsers = new Set(todayData.map((row: any) => row.user_id));
const sampleSize = uniqueUsers.size;
```

**getTodaySnapshot() - Floating point fix:**
```typescript
// Lines ~298-299 - Already has Math.round, but check precision:
weekChange: Math.round(weekChange * 10) / 10,
monthChange: Math.round(monthChange * 10) / 10
```

---

### File 2: School Card Color Logic

Need to find where school cards are rendered and add:

```typescript
const getSchoolColor = (score: number, sampleSize: number) => {
  if (sampleSize === 0 || score === 0) {
    return 'bg-purple-100 border-purple-300'; // Lilac - no data
  }
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-blue-500';
  if (score >= 40) return 'bg-amber-500';
  return 'bg-red-500';
};
```

---

### File 3: `src/components/WellbeingInsights.tsx`

Add demo badge to InterventionImpact:

```tsx
import { Badge } from "./ui/badge";

// In InterventionImpact component header:
<CardHeader>
  <div className="flex items-center justify-between">
    <div>
      <CardTitle>Intervention Impact Tracking</CardTitle>
      <CardDescription>Before/after wellbeing comparisons</CardDescription>
    </div>
    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 shrink-0">
      Demo Data
    </Badge>
  </div>
</CardHeader>
```

---

## Testing Checklist:

After fixes:
- [ ] "Students checked in today" shows realistic number (1-2, not 450)
- [ ] "vs Last Week" shows "+0.7" not "+0.7000000000000028"
- [ ] Schools with no data show lilac color, not red
- [ ] Schools with data show correct color (green/blue/amber/red)
- [ ] "Intervention Impact" has visible "Demo Data" badge
- [ ] "This Week's State of Play" has visible "Demo Data" badge (if applicable)
