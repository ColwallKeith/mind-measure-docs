# Worcester Dashboard Fixes - January 15, 2026

## Problems Identified

The Worcester admin dashboard was completely non-functional with real data. The logs revealed 4 critical errors:

### 1. Invalid Timestamp Filter Syntax
**Error:** `invalid input syntax for type timestamp with time zone: "gte.2026-01-14T14:45:37.845Z"`

**Root Cause:** The code was constructing filter strings like `gte.2026-01-14...` and passing them as values to `/api/database/select`, which expects simple key-value pairs, not PostgREST operators.

**Example of broken code:**
```typescript
filters: {
  created_at: `gte.${new Date().toISOString()}` // ❌ WRONG
}
```

**Fix:** Fetch all data and filter in-memory using Date objects:
```typescript
// Fetch all data
const { data: allData } = await this.databaseService.select('fusion_outputs', {
  columns: 'final_score, created_at, user_id',
  filters: {} // ✅ No date filters in API call
});

// Filter in-memory
const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
const todayData = allData.filter((row: any) => new Date(row.created_at) >= oneDayAgo);
```

### 2. Non-Existent Column: `check_in_id`
**Error:** `column "check_in_id" does not exist`

**Root Cause:** The code was querying for `check_in_id` from `fusion_outputs` table, but that column doesn't exist. The table has `id`, `user_id`, `created_at`, `final_score`, `drivers`, etc., but NO `check_in_id`.

**Example of broken code:**
```typescript
const { data } = await this.databaseService.select('fusion_outputs', {
  columns: 'final_score, user_id, check_in_id' // ❌ check_in_id doesn't exist
});
```

**Fix:** Removed all references to `check_in_id` from `fusion_outputs` queries.

### 3. "No Users Found" Despite Users Existing
**Error:** Console showed 2 users returned (`keith@mindmeasure.co.uk`, `keith@dicestudio.com`), but then "No users found for university: worcester, falling back to demo data"

**Root Cause:** The `getUniversityUsers()` method had a hardcoded `universityDomains` map:
```typescript
private universityDomains = {
  'worcs.ac.uk': 'worcester',
  'worcester.ac.uk': 'worcester',
  'lse.ac.uk': 'lse',
  'student.lse.ac.uk': 'lse',
};
```

Since test emails like `mindmeasure.co.uk` and `dicestudio.com` weren't in this map, they were filtered out.

**Fix:** **Temporarily removed ALL email domain filtering** - ALL users are now assigned to Worcester:
```typescript
private async getUniversityUsers(universityId: string): Promise<any[]> {
  console.log(`🔍 Fetching ALL users for university: ${universityId} (email filtering DISABLED)`);

  const { data, error } = await this.databaseService.select('profiles', {
    columns: 'user_id, email',
    filters: {} // ✅ Get ALL users
  });

  console.log(`✅ Found ${data.length} users (ALL assigned to ${universityId})`);
  return data; // ✅ Return ALL users
}
```

### 4. Incorrect Column Name: `score` vs `final_score`
**Root Cause:** Several queries were looking for `score` column in `fusion_outputs`, but the actual column name is `final_score`.

**Fix:** Changed all references from `score` to `final_score`.

---

## Solution Summary

I completely rewrote `UniversityDataService.ts` with the following changes:

1. ✅ **Removed email domain filtering** - ALL users assigned to Worcester (temporary fix for testing)
2. ✅ **Fixed ALL timestamp filters** - Changed from invalid PostgREST-style strings to in-memory Date filtering
3. ✅ **Removed ALL `check_in_id` references** - Used correct column names
4. ✅ **Changed `score` → `final_score`** - Used correct column name throughout
5. ✅ **Simplified date range queries** - All date filtering now done in-memory after fetching data

---

## Files Changed

- `src/services/UniversityDataService.ts` (complete rewrite, -1094 lines, +168 lines)

---

## How to Test

1. Log into Worcester admin dashboard: https://admin.mindmeasure.co.uk/worcester
2. Dashboard should load without 500 errors
3. "Today's Snapshot" card should show real data (not demo data)
4. Console should show:
   - `✅ Found X users (ALL assigned to worcester)`
   - No "invalid input syntax" errors
   - No "column check_in_id does not exist" errors
   - No "No users found" fallback messages

---

## Remaining Issues

1. **Worcester CMS Support tab still crashes** - The `phone` → `phones` data migration hasn't been run yet on production database
2. **School-level snapshots disabled** - `getSchoolSnapshots()` returns empty array (needs refactoring)
3. **Most detailed metrics simplified** - Weekly trends, engagement metrics, topics, themes all need proper implementation with in-memory filtering

---

## Next Steps

1. Run the Worcester contact data migration: `POST /api/database/migrate-worcester-contacts`
2. Implement proper in-memory filtering for all detailed metrics functions
3. Add back email domain filtering once testing is complete
4. Create a proper `/api/database` endpoint that supports PostgREST-style filters (or document that it doesn't)
