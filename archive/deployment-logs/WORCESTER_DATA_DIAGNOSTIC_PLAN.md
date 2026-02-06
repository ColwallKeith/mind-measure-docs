# Worcester Real Data Check - Diagnostic Plan

Before implementing fixes, we need to know what real data exists.

## Questions to Answer:

1. **Do `assessment_sessions` exist for Worcester users?**
   - If no → `dailyCheckins`, `completionRate` will be 0
   - What `status` values exist? ('completed', 'in_progress', 'pending'?)

2. **Do `profiles.streak_count` have real values?**
   - If all 0 → `averageStreak` will be 0

3. **Do `fusion_outputs` have `analysis.driver_positive` and `analysis.driver_negative`?**
   - If empty → themes will be empty

4. **Does `profiles` table have a `school` or `faculty` column?**
   - If no → school snapshots cannot work

## Diagnostic Approach:

We could create a diagnostic endpoint `/api/debug/worcester-data-audit` that returns:
```json
{
  "users": {
    "total": 5,
    "with_streak": 2,
    "with_school_assignment": 0
  },
  "sessions": {
    "total": 150,
    "last_24h": 2,
    "statuses": {"completed": 140, "in_progress": 10}
  },
  "fusion_outputs": {
    "total": 145,
    "with_driver_positive": 120,
    "with_driver_negative": 130,
    "sample_positive_themes": ["Social support", "Good sleep", ...],
    "sample_negative_themes": ["Workload pressure", "Exam anxiety", ...]
  }
}
```

This would tell us EXACTLY what real data we have before writing transformations.

**DECISION NEEDED**: Should I create this diagnostic endpoint first, or proceed with the implementation assuming check-ins exist?
