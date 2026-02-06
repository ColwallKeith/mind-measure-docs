# CRITICAL PRIVACY FIX - Settings Cleanup

**Date:** 2026-01-16  
**Priority:** 🚨 CRITICAL - Legal Compliance

---

## What Was Wrong

### 1. ❌ "Crisis Detection" Toggle
**Issue:** Implied automated surveillance of students' mental health without clear purpose or consent framework.

**Why This Is Dangerous:**
- Suggests algorithmic monitoring of student wellbeing
- No transparency about what triggers "detection"
- No clear protocol for who sees what when "crisis detected"
- Privacy implications unclear
- Could create liability if university "detects" crisis but doesn't act
- Could breach GDPR if data used for purposes beyond stated consent

**Reality:** Mind Measure doesn't actually do automated crisis detection that alerts staff. The proactive engagement system shows recommendations TO THE STUDENT ONLY (e.g., "Contact crisis helpline").

### 2. ❌ "Allow Data Export" Toggle
**Issue:** Suggested universities could disable a fundamental GDPR right.

**Why This Is Illegal:**
- **GDPR Article 15** (Right of Access): Students MUST be able to access their data
- **GDPR Article 20** (Data Portability): Students MUST be able to export their data
- This is not optional or negotiable
- Universities cannot "toggle" legal rights
- The data belongs to the student, not the university

---

## What Was Fixed

### ✅ Removed "Crisis Detection"
**From Features Section:**
- ~~Enable Crisis Detection - Automatic detection of at-risk students~~
- Now only: Notifications, Analytics, Peer Support, Resource Sharing

**Reasoning:** 
- If Mind Measure implements crisis detection in future, it needs:
  - Clear purpose limitation
  - Explicit consent mechanism
  - Transparent methodology
  - Data Protection Impact Assessment (DPIA)
  - Clear protocols for staff notification
- This should NOT be a simple on/off toggle

### ✅ Removed "Allow Data Export"
**From Privacy Section:**
- ~~Allow Data Export - Students can request their data~~
- Added instead: **Legal notice** explaining data export is a right

**New UI:**
```
Privacy Settings:
- Data Retention Days: 2555 (7 years)
- Anonymise After Days: 365 (1 year)
- Require Consent: ✓

ℹ️ Note: Students have the legal right to access and export 
their data under GDPR Article 15 & 20. This cannot be disabled.
```

---

## Files Changed

1. ✅ `src/components/institutional/cms/UniversitySettingsTab.tsx`
   - Removed `enable_crisis_detection` from interface
   - Removed `allow_data_export` from interface
   - Removed UI toggles for both
   - Added GDPR legal notice

2. ✅ `api/cms/initialize-worcester-settings.ts`
   - Removed `enable_crisis_detection: true`
   - Removed `allow_data_export: true`
   - Worcester settings now GDPR-compliant

---

## What Universities CAN Control (Correctly)

### ✅ Legitimate Settings:

**Features:**
- ✅ **Notifications** - Universities can choose to use push notifications
- ✅ **Analytics** - Universities can opt into dashboards
- ✅ **Peer Support** - Optional feature (not yet implemented)
- ✅ **Resource Sharing** - Universities can share mental health resources

**Privacy:**
- ✅ **Data Retention Period** - How long to keep data (within legal minimums)
- ✅ **Anonymisation Period** - When to strip identifiers (GDPR Article 5)
- ✅ **Require Consent** - Whether explicit consent required before use

**These are legitimate operational choices.**

### ❌ What Universities CANNOT Control:

- ❌ **Data Export Rights** - GDPR Article 15 & 20 (mandatory)
- ❌ **Data Access Rights** - GDPR Article 15 (mandatory)
- ❌ **Data Rectification** - GDPR Article 16 (mandatory)
- ❌ **Data Erasure** - GDPR Article 17 "Right to be Forgotten" (mandatory)
- ❌ **Data Portability** - GDPR Article 20 (mandatory)
- ❌ **Object to Processing** - GDPR Article 21 (mandatory)

**These are legal rights that belong to data subjects (students).**

---

## Impact on Existing Deployments

### Before This Fix:
- Worcester settings had `enable_crisis_detection: true`
- Worcester settings had `allow_data_export: true`
- UI suggested these were optional features

### After This Fix:
- Crisis detection removed from settings schema
- Data export removed from settings schema
- Legal notice added explaining data export is a right
- Worcester initialization script updated

### Migration:
**No database migration needed** - these were just UI/config values, not enforced logic.

---

## What About Actual Crisis Support?

### Current Reality:
Mind Measure's "proactive engagement" system:
1. Analyzes student's OWN check-in history
2. Identifies patterns (declining mood, crisis language)
3. Shows recommendations **TO THE STUDENT** only
4. Examples:
   - "It's been 5 days since your last check-in"
   - "I'm concerned about what you've shared. Help is available."
   - Shows crisis helpline numbers

**This is NOT surveillance. This is personalized support TO the student.**

### If True Crisis Detection Is Needed:
Must implement:
1. **Clear Purpose** - Why detect? What happens when detected?
2. **Legal Basis** - Consent? Legitimate interest? Vital interest?
3. **DPIA Required** - Data Protection Impact Assessment
4. **Transparency** - Students must know what triggers alerts
5. **Staff Protocols** - Who sees what? What actions taken?
6. **Opt-Out Rights** - Can students decline crisis monitoring?
7. **Audit Trail** - Log all detections and actions

**This is complex and requires legal review. Not a simple toggle.**

---

## Legal References

### GDPR Articles Violated by "Allow Data Export" Toggle:

**Article 15 - Right of Access:**
> "The data subject shall have the right to obtain from the controller confirmation as to whether or not personal data concerning him or her are being processed..."

**Article 20 - Right to Data Portability:**
> "The data subject shall have the right to receive the personal data concerning him or her... in a structured, commonly used and machine-readable format..."

**Article 12 - Transparent Information:**
> "The controller shall take appropriate measures to provide any information... in a concise, transparent, intelligible and easily accessible form..."

### UK GDPR & DPA 2018:
Same rights apply post-Brexit for UK universities.

---

## Testing After Deployment

### Verify Removal:
1. Navigate to Worcester CMS → Settings
2. **Should NOT see:** "Crisis Detection" toggle
3. **Should NOT see:** "Allow Data Export" toggle
4. **Should see:** Blue notice box explaining data export is a legal right

### Verify Worcester Initialization:
1. Superuser → Universities → Worcester → "Settings"
2. Initialize settings
3. Check database:
```sql
SELECT settings->'features' as features, 
       settings->'privacy' as privacy
FROM universities 
WHERE id = 'worcester';
```

4. Should NOT contain `enable_crisis_detection` or `allow_data_export`

---

## Lessons Learned

### ❌ Never Create UI That Suggests:
- Universities can disable legal rights
- Privacy is optional or negotiable
- Data belongs to institutions not individuals

### ✅ Always Ask:
- Is this a legal right or a feature?
- Can institutions opt out under GDPR/DPA?
- Would a regulator approve this toggle?
- Does this pass the "BBC News headline test"?

### 🎯 Design Principle:
**"Privacy by Design, not Privacy by Permission"**

Legal requirements should be baked into the system, not presented as optional settings.

---

## Status

✅ **FIXED AND COMMITTED**  
✅ **Ready for deployment**  
✅ **GDPR-compliant**  

This was a critical fix. Thank you for catching it.
