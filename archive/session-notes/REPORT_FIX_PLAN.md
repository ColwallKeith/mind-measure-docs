# Report Generation Fix Plan

## Problem
Current report only shows mood scores. Missing:
- PHQ-2/GAD-2 scores
- Transcript snippets  
- Top stressors/positives (themes)
- AI executive summary (likely working but no data to summarize)

## Root Cause Analysis

### 1. Data Structure Mismatch
**Working version used:**
```javascript
theme.type === 'stressor'  // or 'positive'
theme.label               // the actual theme text
```

**Current version incorrectly uses:**
```javascript
theme.sentiment === 'negative'  // WRONG
theme.theme                     // WRONG
```

### 2. Database Schema
Looking at the working code, `analysis.key_themes` structure is:
```json
{
  "key_themes": [
    { "type": "stressor", "label": "Academic pressure" },
    { "type": "positive", "label": "Social support" }
  ]
}
```

### 3. Transcript Extraction
The logic looks correct but needs verification that:
- Transcripts exist in `assessment_transcripts` table
- `fusion_output_id` matches check-in IDs
- Format is "User: <text>\nAgent: <text>"

## Fix Strategy

### Step 1: Fix Theme Extraction (HIGH PRIORITY)
**File:** `api/reports/[reportId].ts`
**Lines:** ~120-130

Change from:
```typescript
positives: analysis?.key_themes?.filter((t: any) => t.sentiment === 'positive').map((t: any) => t.theme) || [],
negatives: analysis?.key_themes?.filter((t: any) => t.sentiment === 'negative').map((t: any) => t.theme) || [],
```

To:
```typescript
positives: analysis?.key_themes?.filter((t: any) => t.type === 'positive').map((t: any) => t.label) || [],
negatives: analysis?.key_themes?.filter((t: any) => t.type === 'stressor').map((t: any) => t.label) || [],
```

### Step 2: Verify PHQ-2/GAD-2 Path
The current code looks correct:
```typescript
avgPhq2 = (ba.phq2_q1 || 0) + (ba.phq2_q2 || 0);
avgGad2 = (ba.gad2_q1 || 0) + (ba.gad2_q2 || 0);
```

**But need to verify:**
- Are these fields actually in the baseline `analysis` JSON?
- Check one baseline record in database to confirm structure

### Step 3: Verify Transcript Format
Current code assumes:
```
User: <response text>
Agent: <question text>
```

**Need to verify:**
- Is this the actual format in `assessment_transcripts.transcript`?
- Or is it stored differently (e.g., JSON array, different case)?

## Testing Plan (NO DEPLOYMENTS)

### 1. Database Query Test
Run locally to check data structure:
```sql
-- Check baseline structure
SELECT analysis FROM fusion_outputs 
WHERE user_id = '<your-test-user-id>' 
AND analysis::text LIKE '%baseline%' 
LIMIT 1;

-- Check check-in themes
SELECT analysis->'key_themes' as themes FROM fusion_outputs 
WHERE user_id = '<your-test-user-id>' 
AND analysis::text LIKE '%checkin%' 
LIMIT 3;

-- Check transcript format
SELECT transcript FROM assessment_transcripts 
WHERE fusion_output_id IN (
  SELECT id FROM fusion_outputs 
  WHERE user_id = '<your-test-user-id>' LIMIT 1
);
```

### 2. Code Review
Read the current `[reportId].ts` carefully and compare line-by-line with working version from commit `a9e1e3f3`

## Implementation (SINGLE DEPLOYMENT)

Once data structure is confirmed:

1. Fix theme extraction (`type` and `label` instead of `sentiment` and `theme`)
2. Add fallback for missing themes (empty array, not crash)
3. Add fallback for missing transcripts (empty array, not crash)
4. Remove excessive logging once confirmed working
5. Test locally if possible (or use Vercel preview deployment, NOT production)
6. Single production deployment after confirmation

## Expected Outcome

Report should show:
- ✅ Mood scores (already working)
- ✅ PHQ-2/GAD-2 scores (if baseline has these fields)
- ✅ Top 5 stressors
- ✅ Top 5 positives  
- ✅ Transcript snippets (if transcripts exist)
- ✅ AI executive summary with real data

## Rollback Plan

If still broken after fix:
- Revert to commit `a9e1e3f3` (last known working version)
- Re-enable `/api/database/select` endpoint with security
- Use that working codebase as reference
