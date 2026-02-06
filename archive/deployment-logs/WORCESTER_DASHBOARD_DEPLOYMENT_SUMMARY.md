# Worcester Dashboard - Complete Deployment Package

## Overview
This deployment fixes all identified issues with the Worcester University dashboard, including data accuracy, UI polish, and transparency about demo data.

---

## Part 1: School Breakdown Fixes (From Earlier)

### Issue: School cards not picking up students
**Root Cause:** Code was using `profiles.course` but users have `profiles.school = "Business"` while CMS has "Worcester Business School"

**Fix:** Implemented fuzzy matching for school names
- `profiles.school` now compared with both `cmsSchool.name` and `cmsSchool.shortName`
- Handles variations like "Business" vs "Worcester Business School"

**File:** `src/services/UniversityDataService.ts` - `getSchoolSnapshots()`

---

## Part 2: Cohort Analytics (From Earlier)

### Issue: Missing profile fields for cohort breakdowns
**Root Cause:** `year_of_study`, `study_mode`, `residence`, `domicile` collected in UI but not in DB

**Fix:** 
1. Migration endpoint created: `/api/database/add-cohort-columns.ts`
2. New breakdown functions implemented:
   - `getBreakdownByYear()`
   - `getBreakdownByResidence()`
   - `getBreakdownByDomicile()`
   - `getBreakdownByStudyMode()`

**Files:**
- `src/services/UniversityDataService.ts`
- `api/database/add-cohort-columns.ts`

---

## Part 3: Dashboard Polish (New Fixes)

### Fix 1: Sample Size = Unique Students ✅
**Issue:** "450 students checked in today" (showing total check-ins, not unique users)

**Fix:**
```typescript
const uniqueUsers = new Set(todayData.map((row: any) => row.user_id));
sampleSize: uniqueUsers.size;  // NOT todayData.length
```

**File:** `src/services/UniversityDataService.ts` - `getTodaySnapshot()`

---

### Fix 2: School Card "No Data" State ✅
**Issue:** Schools with 0 students showing red (concerning) - looks bad

**Fix:** Lilac "No Data Yet" state
- New color: `bg-purple-200 text-purple-900`
- Custom UI: User icon + "No Data Yet" message
- Clear distinction from red "concerning" schools

**File:** `src/components/CurrentWellbeingSnapshot.tsx`

---

### Fix 3: Floating Point Display ✅
**Issue:** "+0.7000000000000028 vs last week"

**Status:** Already fixed (was implemented earlier)
```typescript
weekChange: Math.round(weekChange * 10) / 10
monthChange: Math.round(monthChange * 10) / 10
```

---

### Fix 4: "Demo Data" Badges ✅
**Issue:** Intervention Impact and This Week's State of Play showing dummy data without labels

**Fix:** Amber badges on both cards
```tsx
<Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
  Demo Data
</Badge>
```

**Files:**
- `src/components/WellbeingInsights.tsx` - Intervention Impact
- `src/components/AISummary.tsx` - This Week's State of Play

---

## Deployment Steps

### Step 1: Run Migration (If Not Already Done)
```bash
curl -X POST https://admin.mindmeasure.co.uk/api/database/add-cohort-columns
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Cohort columns added successfully to profiles table",
  "columns": [
    {"column_name": "course", "data_type": "character varying"},
    {"column_name": "year_of_study", "data_type": "character varying"},
    {"column_name": "study_mode", "data_type": "character varying"},
    {"column_name": "residence", "data_type": "text"},
    {"column_name": "domicile", "data_type": "character varying"}
  ]
}
```

---

### Step 2: Build and Deploy
```bash
cd /Users/keithduddy/Desktop/Mind\ Measure\ local/mind-measure-core

# Build
npm run build

# Deploy to Vercel
npx vercel --prod --yes

# Set alias (after deployment completes)
npx vercel alias [deployment-url] admin.mindmeasure.co.uk
```

**Expected Build Time:** 5-6 minutes  
**Expected Deployment Time:** 3-4 minutes  
**Total:** ~10 minutes

---

## Testing Checklist

After deployment, verify:

### University-Wide Score Card
- [ ] "Students checked in today" shows realistic number (1-2, not 450)
- [ ] "vs Last Week" shows "+0.7" not "+0.7000000000000028"
- [ ] "vs Last Month" shows clean decimal (e.g., "+1.2")

### School Breakdown Cards
- [ ] Keith Duddy (Business School, Postgraduate, Distance Learning) appears in Business School card
- [ ] Schools with no students show lilac color + "No Data Yet" message
- [ ] Schools with students show correct colors:
  - Green (80-100) = Excellent
  - Blue (60-79) = Good
  - Amber (40-59) = Moderate
  - Red (0-39) = Concerning

### Demo Data Badges
- [ ] "Intervention Impact Tracking" has amber "Demo Data" badge
- [ ] "This Week's State of Play" has amber "Demo Data" badge

### Cohort Analytics (If tab exists)
- [ ] Breakdown by Year shows Keith Duddy in "Postgraduate"
- [ ] Breakdown by Study Mode shows Keith in "Distance Learning"
- [ ] Breakdown by Residence shows Keith's accommodation
- [ ] Breakdown by Domicile shows Keith's domicile status

---

## Files Changed

### Core Data Service
- `src/services/UniversityDataService.ts`
  - Fixed sample size (unique users)
  - Added school name fuzzy matching
  - Implemented cohort breakdown functions

### UI Components
- `src/components/CurrentWellbeingSnapshot.tsx`
  - Added lilac "No Data" state for school cards
  - Fixed school card rendering logic

- `src/components/WellbeingInsights.tsx`
  - Added "Demo Data" badge to Intervention Impact

- `src/components/AISummary.tsx`
  - Added "Demo Data" badge to This Week's State of Play

### Database Migration
- `api/database/add-cohort-columns.ts`
  - New endpoint to add missing profile fields

---

## Documentation Created
- `DASHBOARD_ISSUES_FIX_PLAN.md` - Original issue analysis
- `DASHBOARD_ISSUES_FIXED.md` - Fix implementation summary
- `WORCESTER_DASHBOARD_DEPLOYMENT_SUMMARY.md` - This complete deployment guide

---

## Known Limitations

### Not Fixed (Lower Priority)
- **Detailed Breakdown Modal:** Clicking school cards still shows dummy data in the modal
  - **Decision:** Leave for next batch
  - **Options:** Remove modal, implement real data, or add "Demo Data" badge

---

## Success Criteria

✅ Worcester dashboard shows **real data** for:
- Today's snapshot (unique student count)
- School breakdowns (actual students by school)
- Engagement metrics
- Weekly trends
- Top themes (positive & concerns)
- Cohort breakdowns (year, residence, domicile, study mode)

✅ **UI Polish:**
- No floating point display bugs
- Clear "No Data" states (lilac, not red)
- Transparent demo data labels

✅ **LSE remains demo model:**
- LSE continues to show realistic demo data
- Worcester is the working production model

---

## Post-Deployment

After successful deployment and testing, consider:

1. **Remove all "email domain restrictions"** from UniversityDataService - already done ✅
2. **Add more test users** to verify cohort breakdowns
3. **Implement real mood score** from `conversation_insights` table
4. **Phase out LSE demo** or clearly label it as "Demo University"

---

## Support

If issues arise after deployment:
1. Check CloudWatch logs for API errors
2. Verify migration ran successfully (query `profiles` table for new columns)
3. Test API endpoints directly:
   - `GET /api/database/select?table=profiles&columns=user_id,school,year_of_study,study_mode`
4. Check browser console for frontend errors

---

**Deployment Package Ready** ✅  
All code changes are linter-clean and ready to deploy.
