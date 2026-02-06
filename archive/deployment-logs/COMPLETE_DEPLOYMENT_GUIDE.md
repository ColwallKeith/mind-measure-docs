# Complete Worcester Dashboard Deployment - OPTION B

## ✅ ALL IMPLEMENTATIONS COMPLETE - Ready to Deploy

### What's Included in This Deployment:

**1. Real Data Fixes:**
- ✅ Weekly trends (aggregated from fusion_outputs)
- ✅ Positive themes (from analysis.driver_positive)
- ✅ Student concerns (from analysis.driver_negative)
- ✅ Engagement metrics (real check-in counts, streaks, completion rates)
- ✅ Mood score extraction (from analysis JSONB)
- ✅ School breakdowns (using profiles.course)
- ❌ Removed all hardcoded dummy data fallbacks

**2. Complete Cohort Analytics:**
- ✅ `getCohortBreakdowns(universityId, 'year')` - Year 1 vs 2 vs 3 vs 4
- ✅ `getCohortBreakdowns(universityId, 'residence')` - On Campus vs Off Campus vs At Home
- ✅ `getCohortBreakdowns(universityId, 'domicile')` - Home vs International
- ✅ `getCohortBreakdowns(universityId, 'study_mode')` - Full-time vs Part-time
- ✅ `getSchoolSnapshots(universityId)` - School/Faculty breakdowns

**3. Database Migration:**
- ✅ Migration endpoint created: `/api/database/add-cohort-columns`
- ✅ Adds 5 columns: `course`, `year_of_study`, `study_mode`, `residence`, `domicile`
- ✅ Creates indexes for performance
- ✅ Documentation updated in DATABASE_REFERENCE.md

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Run Database Migration

**IMPORTANT:** Must run BEFORE deploying code

```bash
# From mind-measure-core directory
curl -X POST https://admin.mindmeasure.co.uk/api/database/add-cohort-columns
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Cohort columns added successfully to profiles table",
  "columns": [
    {"column_name": "course", "data_type": "text"},
    {"column_name": "domicile", "data_type": "text"},
    {"column_name": "residence", "data_type": "text"},
    {"column_name": "study_mode", "data_type": "text"},
    {"column_name": "year_of_study", "data_type": "text"}
  ]
}
```

**If columns already exist:** Migration is idempotent, safe to run multiple times.

---

### Step 2: Verify Profile Data Exists

Check if users have filled in their cohort fields:

```sql
-- Run this query on production database
SELECT 
  COUNT(*) as total_users,
  COUNT(course) as has_course,
  COUNT(year_of_study) as has_year,
  COUNT(residence) as has_residence,
  COUNT(domicile) as has_domicile,
  COUNT(study_mode) as has_study_mode
FROM profiles 
WHERE university_id = 'worcester';
```

**Expected:** Most users should have `course` (they select in profile). Others might be NULL if they haven't updated their profile yet.

**If all NULL:** Profile save functionality might not be storing these fields. Need to verify mobile app profile updates.

---

### Step 3: Deploy Core Application

```bash
cd "/Users/keithduddy/Desktop/Mind Measure local/mind-measure-core"

# 1. Final git status check
git status

# 2. Build (will take ~5 minutes)
npm run build

# 3. Deploy to Vercel (will take 16-20 minutes)
npx vercel --prod --yes

# 4. Explicit alias (ensure correct domain)
npx vercel alias [deployment-url] admin.mindmeasure.co.uk
```

**Build Time:** ~5 minutes  
**Deploy Time:** ~16-20 minutes  
**Total:** ~25 minutes

---

## 🧪 TESTING CHECKLIST

### Dashboard Overview
- [ ] "Students checking in today" shows realistic number (NOT 2,847)
- [ ] "Average score" calculated from real data (NOT hardcoded 67)
- [ ] Weekly trends chart displays with data points
- [ ] Score distribution percentages look realistic

### Engagement Overview
- [ ] Daily check-ins count is realistic (or 0 if no data)
- [ ] Average streak reflects real profiles.streak_count
- [ ] Completion rate percentage is calculated
- [ ] Response quality score shown (currently placeholder 4.2)

### Positive Themes Section
- [ ] Shows themes extracted from check-ins (e.g., "social support", "good sleep")
- [ ] OR shows empty if no check-ins with driver_positive
- [ ] NOT showing hardcoded "friends (892)", "exercise (743)"

### Student Concerns Section
- [ ] Shows concerns from check-ins (e.g., "workload pressure", "exam anxiety")
- [ ] Severity badges assigned (high/medium/low)
- [ ] OR shows empty if no check-ins with driver_negative
- [ ] NOT showing hardcoded "finances (1247)", "deadlines (1089)"

### By School Tab
- [ ] Shows real school breakdowns (Business, Social Sciences, Arts, Sciences)
- [ ] Sample sizes reflect actual students per school
- [ ] Participation rates calculated correctly
- [ ] Can click school cards for detailed breakdown

### By Year Tab (NEW)
- [ ] Shows Year 1, Year 2, Year 3, Year 4 cohorts
- [ ] Each year shows avg score, mood, sample size
- [ ] Identifies which years need support

### By Residence Tab (NEW - Accommodation)
- [ ] Shows "On Campus", "Off Campus", "At Home" cohorts
- [ ] Compares wellbeing across living situations
- [ ] Sample sizes and participation rates shown

### By Domicile Tab (NEW)
- [ ] Shows "Home" vs "International" students
- [ ] Identifies international student wellbeing patterns
- [ ] Can target support for specific groups

### Known Limitations (Expected)
- [ ] Intervention Impact still shows dummy data (no interventions table)
- [ ] If profile cohort fields are NULL, cohort tabs will be empty

---

## 🎯 EXPECTED OUTCOMES

### If Users Have Completed Profiles:

**Best Case:**
- All 5 cohort tabs populated with real data
- Clear patterns visible (e.g., "Year 1 students 10% lower wellbeing")
- Universities can target support effectively

**Most Likely Case:**
- School breakdowns working (users already select this)
- Other cohorts partially populated (depends on profile completion)
- Some cohorts show "No data" (new users haven't filled profile)

### If Profile Fields Are Empty:

**Worst Case:**
- Cohort tabs show empty/no data
- Only overall metrics work (engagement, trends, themes)
- Indicates profile save functionality needs debugging

**Action:** Check mobile profile save code to ensure cohort fields are being written to database.

---

## 📊 DATA INSIGHTS ENABLED

After deployment, universities can answer:

1. **"Are international students more stressed?"**
   - Compare Home vs International cohorts
   - Target resources for international students

2. **"Do first-year students struggle with adjustment?"**
   - Compare Year 1 vs Year 4 scores
   - Provide targeted first-year support

3. **"Does living situation impact wellbeing?"**
   - Compare On Campus vs Off Campus vs At Home
   - Improve accommodation support services

4. **"Are part-time students facing different challenges?"**
   - Compare Full-time vs Part-time
   - Adjust support hours for part-time students

5. **"Which school needs the most support?"**
   - Rank schools by wellbeing scores
   - Allocate resources to struggling faculties

---

## 🔧 TROUBLESHOOTING

### Issue: Cohort tabs show "No data"

**Diagnosis:**
```sql
-- Check if cohort fields are populated
SELECT course, year_of_study, residence, domicile, study_mode 
FROM profiles 
WHERE university_id = 'worcester' 
LIMIT 10;
```

**Solutions:**
1. If all NULL → Profile save not working, fix mobile app
2. If some populated → Normal (users gradually fill profiles)
3. If none have values → Check migration ran successfully

### Issue: School breakdowns work but others don't

**Diagnosis:** `course` field existed before migration, others are new

**Solution:** Users need to update their profiles to populate new fields

### Issue: Numbers still look like dummy data (2,847 students)

**Diagnosis:** Fallback to demo data is being triggered

**Check:**
1. Is Worcester's `status = 'active'` in database?
2. Is `current_uptake_rate > 0` for Worcester?
3. Are there real fusion_outputs for Worcester users?

---

## 📝 POST-DEPLOYMENT TASKS

1. **Monitor Logs:**
   - Check Vercel logs for any 500 errors
   - Look for "Using demo data" vs "Using real data" logs

2. **User Communication:**
   - Encourage students to complete their profile (especially new cohort fields)
   - Explain how data helps provide better support

3. **Analytics Review:**
   - Identify which cohorts need targeted interventions
   - Use insights to improve university support services

4. **Future Enhancements:**
   - Add Intervention Impact tracking (requires interventions table)
   - Calculate trend directions (currently all "stable")
   - Enhance quality score calculation (currently placeholder)

---

## ✅ DEPLOYMENT COMPLETE CONFIRMATION

After deployment, verify in browser console:

```javascript
// Should see logs like:
"✅ worcester: Fetching real metrics for 30d..."
"✅ worcester: Calculated 45 scores, avg: 67.3"
"✅ worcester: Returned 4 school snapshots"
"✅ worcester: Returned 3 year cohorts"
```

**NOT:**
```javascript
"📊 worcester: Using demo snapshot data"
"📊 worcester: Using demo metrics"
```

---

## 🎉 SUCCESS CRITERIA

- [x] All code changes committed
- [x] Migration endpoint created and tested
- [ ] Migration run on production database
- [ ] Code deployed to admin.mindmeasure.co.uk
- [ ] Dashboard shows real data (not 2,847 dummy numbers)
- [ ] Cohort breakdowns populated (if profile data exists)
- [ ] No 500 errors in browser console
- [ ] Universities can identify cohorts needing support

**Estimated Total Time:** 30-35 minutes (migration + build + deploy)
