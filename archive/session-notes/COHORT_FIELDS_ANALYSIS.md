# Cohort Fields - Missing Columns Analysis

## Current Situation

**UI Collects:**
- `course` → Faculty/School (Business, Social Sciences, Arts, Sciences) ✅ EXISTS
- `yearOfStudy` → Year of Study (Year 1, 2, 3, 4) ❓ UNKNOWN
- `studyMode` → Study Mode (Full-time, Part-time) ❓ UNKNOWN  
- `residence` → Residence (On Campus, Off Campus, At Home) ❓ UNKNOWN
- `domicile` → Domicile (Home, International) ❓ UNKNOWN

**DATABASE_REFERENCE.md lists:**
- `profiles` columns: `user_id`, `first_name`, `last_name`, `course`, `year_of_study`, `university_id`

**Dashboard Filters Expect:**
- Faculty ✅
- Year ❓
- Domicile ❓
- Residence ❓

## Problem

The mobile profile form collects these 5 cohort fields, but most likely only `course` is actually being saved to the database.

## Solution

Add missing columns to `profiles` table:

```sql
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS year_of_study TEXT,
ADD COLUMN IF NOT EXISTS study_mode TEXT,
ADD COLUMN IF NOT EXISTS residence TEXT,
ADD COLUMN IF NOT EXISTS domicile TEXT;
```

## Dashboard Breakdowns We Can Then Provide

Once these columns exist:

1. **By School/Faculty** ✅ Already implemented (uses `course`)
2. **By Year** → Group by `year_of_study` (Year 1, 2, 3, 4)
3. **By Residence** → Group by `residence` (On Campus, Off Campus, At Home)
4. **By Domicile** → Group by `domicile` (Home, International)
5. **By Study Mode** → Group by `study_mode` (Full-time, Part-time)

## Implementation Priority

1. **FIRST:** Create migration to add columns
2. **SECOND:** Verify profile save functionality stores these fields
3. **THIRD:** Implement dashboard breakdowns for each cohort type
4. **FOURTH:** Update DATABASE_REFERENCE.md

## Example Dashboard Functions

```typescript
async getYearBreakdowns(universityId: string): Promise<Array<{
  year: string;
  avgScore: number;
  sampleSize: number;
  participationRate: number;
}>>

async getResidenceBreakdowns(universityId: string): Promise<Array<{
  residenceType: string;
  avgScore: number;
  sampleSize: number;
  notes: string; // e.g., "On Campus students show 8% higher wellbeing"
}>>

async getDomicileBreakdowns(universityId: string): Promise<Array<{
  domicileType: string; // 'Home' or 'International'
  avgScore: number;
  sampleSize: number;
  avgMoodScore: number;
}>>
```

## User Value

This enables universities to identify cohorts that need targeted support:
- International students struggling with isolation
- Year 1 students with lower engagement  
- Off-campus students missing community
- Part-time students with different stressors

## Next Steps

1. Create `/api/database/add-cohort-columns.ts` endpoint
2. Run migration on production database
3. Test that profile saves actually write to these columns
4. Implement breakdown functions similar to `getSchoolSnapshots()`
