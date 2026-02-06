# Wellbeing Report Testing Guide

## ✅ Complete Flow Test

### Prerequisites:
1. ✅ Database migration run (`wellbeing_reports` table created)
2. ✅ Core deployed to `admin.mindmeasure.co.uk`
3. ✅ Mobile deployed to `mobile.mindmeasure.app`

---

## 🧪 Test Scenario

### Step 1: Complete Baseline Today
1. Open mobile app (TestFlight or `mobile.mindmeasure.app`)
2. Navigate to Profile → "Export Wellbeing Report"
3. **Expected:** Modal shows "Baseline Assessment Required"
4. Click "Start Baseline Assessment"
5. Complete full baseline assessment
6. **Expected:** Baseline saved to `fusion_outputs` with today's date

### Step 2: Generate Report
1. Return to Profile → "Export Wellbeing Report"
2. **Expected:** Baseline check passes, export modal shows
3. Select period (14, 30, or 90 days)
4. Click "Email Report to Me"
5. **Expected:** 
   - Success message
   - "We've sent an email with a link to view your report"

### Step 3: Check Email
1. Check inbox for email from `noreply@mindmeasure.co.uk`
2. **Expected Email Contains:**
   - Subject: "Your [X]-Day Mind Measure Wellbeing Report is Ready"
   - Body with report highlights
   - Blue CTA button "View My Report"
   - Link format: `https://admin.mindmeasure.co.uk/report/[reportId]`

### Step 4: View Report (Mobile)
1. Click email link on phone
2. **Expected:**
   - Report loads in mobile-optimized view
   - Card-based check-ins
   - Scrollable graph
   - Single column layout
   - All data populated correctly

### Step 5: View Report (Desktop)
1. Open same link on laptop/desktop
2. **Expected:**
   - Report loads in A4 format (centered, 210mm)
   - Table-based check-ins
   - Full graph visible
   - Two-column cards for stressors/positives

### Step 6: Print to PDF
1. Click "PDF" button (desktop view)
2. **Expected:**
   - Browser print dialog opens
   - Print preview shows 3 pages
   - Colors preserved
   - No navigation/back button in print view
3. Save as PDF
4. **Expected:** Professional 3-page document

### Step 7: Share Link
1. Click "Share Link" button
2. **Expected:**
   - URL copied to clipboard
   - Toast/notification confirms
3. Open link in incognito/private window
4. **Expected:** Report still loads (public link)

---

## 🔍 What to Verify

### Data Accuracy:
- [ ] Student name correct
- [ ] University: "University of Worcester"
- [ ] Course and year populated
- [ ] Date range matches selected period
- [ ] Wellbeing score accurate
- [ ] PHQ-2/GAD-2 from **most recent baseline**
- [ ] Top stressors ranked correctly
- [ ] Top positives ranked correctly
- [ ] Check-ins = ONLY check-ins (NOT baselines)
- [ ] Graph shows correct number of data points

### UI/UX:
- [ ] Mobile: Cards stack vertically
- [ ] Desktop: A4 centered layout
- [ ] Graph responsive and readable
- [ ] Print CSS removes navigation
- [ ] Colors match Mind Measure brand
- [ ] British English throughout
- [ ] DD/MM/YY date format

### Functionality:
- [ ] Back button works (mobile)
- [ ] PDF button opens print dialog
- [ ] Share button copies URL
- [ ] Report accessible via direct URL
- [ ] Expired reports show error (test after 90 days)
- [ ] Invalid reportId shows "Not Found"

---

## 🐛 Common Issues & Fixes

### "Baseline Required" Modal Won't Go Away
**Cause:** No baseline completed today  
**Fix:** Complete baseline assessment first

### Report Shows 0 Check-ins
**Cause:** Date range filter too restrictive  
**Fix:** Select longer period (30 or 90 days)

### PHQ-2/GAD-2 Show 0
**Cause:** No baseline assessment completed  
**Fix:** Complete baseline first (includes clinical screening)

### Email Not Received
**Check:**
1. Spam folder
2. AWS SES sending limits
3. Email address correct in profile
4. Check Vercel logs: `npx vercel logs admin.mindmeasure.co.uk`

### Report URL Returns 404
**Check:**
1. Database table `wellbeing_reports` exists
2. Report ID in database: `SELECT * FROM wellbeing_reports WHERE id = '[reportId]';`
3. Vercel deployment successful
4. API endpoint `/api/reports/[reportId]` deployed

### AI Executive Summary is Generic
**Check:**
1. AWS Bedrock credentials in Vercel environment
2. Check logs for Bedrock errors
3. Fallback text used if AI fails (by design)

---

## 📊 Database Verification

```sql
-- Check if report was stored
SELECT 
  id,
  user_id,
  created_at,
  expires_at,
  accessed_count,
  jsonb_pretty(report_data) 
FROM wellbeing_reports 
ORDER BY created_at DESC 
LIMIT 1;

-- Check baseline today
SELECT 
  id,
  created_at::date as date,
  (analysis->>'assessment_type') as type,
  (analysis->'clinical_scores') as scores
FROM fusion_outputs 
WHERE user_id = '[your-user-id]'
  AND created_at::date = CURRENT_DATE
ORDER BY created_at DESC;

-- Check check-ins in period
SELECT 
  COUNT(*) as total_checkins,
  COUNT(CASE WHEN (analysis->>'assessment_type') = 'baseline' THEN 1 END) as baselines,
  COUNT(CASE WHEN (analysis->>'assessment_type') != 'baseline' OR analysis->>'assessment_type' IS NULL THEN 1 END) as regular_checkins
FROM fusion_outputs 
WHERE user_id = '[your-user-id]'
  AND created_at >= NOW() - INTERVAL '30 days';
```

---

## ✅ Success Criteria

All these must pass:
- [x] Baseline requirement enforced
- [x] Report generated with unique URL
- [x] Email sent with link
- [x] Report viewable on mobile
- [x] Report viewable on desktop
- [x] PDF generation works
- [x] Share link works
- [x] Data accurate (check-ins only, correct baseline)
- [x] AI summary generated
- [x] 90-day expiry enforced
- [x] Access count tracked

---

## 📝 Test Results

**Date Tested:** ___________  
**Tested By:** ___________  
**Version:** Core ccb8da3f | Mobile 100cbdb0  

**Results:**
- [ ] PASS - All tests successful
- [ ] FAIL - Issues found (see below)

**Issues Found:**
1. 
2. 
3. 

**Notes:**

