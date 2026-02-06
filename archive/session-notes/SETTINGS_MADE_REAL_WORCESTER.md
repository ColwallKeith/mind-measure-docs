# University Settings - Made Real for Worcester

**Date:** 2026-01-16  
**Status:** ✅ COMPLETE - Ready for deployment

---

## What Was Done

### ✅ 1. Created Worcester Settings Initialization API

**File:** `api/cms/initialize-worcester-settings.ts`

**Endpoint:** `GET/POST /api/cms/initialize-worcester-settings`

**Real Worcester Settings:**

#### Institutional Terminology
- Academic Unit: **"School"** (not Faculty)
- Sub-unit: **"Course"** (not Department)
- This matches Worcester's actual structure

#### Leadership Roles & Titles
1. **Vice-Chancellor** (Executive) - Full university access, can export
2. **Pro-Vice-Chancellor** (Senior) - Full university access, can export
3. **Head of School** (Unit) - School-level only, can export
4. **Course Leader** (Subunit) - Course-level only, no export

#### Features
- ✅ Notifications
- ✅ Analytics Dashboard
- ✅ Crisis Detection
- ❌ Peer Support (not yet implemented)
- ✅ Resource Sharing

#### Privacy & Data
- **7 years** data retention (2555 days) - UK university standard
- **1 year** anonymization period (365 days)
- ✅ GDPR-compliant data export
- ✅ Consent required

#### Notifications
- ✅ Email notifications
- ❌ SMS (not yet implemented)
- ✅ Push notifications
- ✅ Emergency alerts

#### Integrations
- ❌ SSO (future implementation)
- API keys: To be added by Worcester admin

---

### ✅ 2. Updated Superuser Control Panel

**File:** `src/components/SuperuserControlPanel.tsx`

**Changes:**
- "Settings" button now functional for Worcester
- Calls initialization API
- Shows confirmation dialog
- Displays success/error feedback

**User Flow:**
1. Superuser → Universities tab
2. Find "University of Worcester" card
3. Click "Settings" button
4. Confirm initialization
5. Settings populated ✅

---

### ✅ 3. Created Comprehensive Documentation

**File:** `docs/UNIVERSITY_SETTINGS_GUIDE.md`

**Covers:**
- Complete settings structure explanation
- Worcester-specific values
- How to use (for admins, superusers, developers)
- Impact on reports, dashboards, CMS
- Technical implementation details
- Future enhancements

---

## Why This Matters

### Before
- Settings tab existed but used generic defaults
- No Worcester-specific terminology
- Leadership roles were placeholders
- No easy way to populate settings

### After
- ✅ Real Worcester institutional structure
- ✅ "Schools" not "Faculties" throughout dashboards
- ✅ "Vice-Chancellor", "Head of School" in reports
- ✅ One-click initialization from Superuser panel
- ✅ Settings persist in database

---

## How It Works

### Database Storage
```sql
-- Settings stored in universities.settings (JSONB)
UPDATE universities 
SET settings = '{...worcester settings...}'
WHERE id = 'worcester';
```

### API Flow
```
1. Superuser clicks "Settings" button
2. POST /api/cms/initialize-worcester-settings
3. API checks if Worcester exists
4. Merges new settings with existing (preserves custom values)
5. Updates universities.settings column
6. Returns success + full settings object
```

### Frontend Access
```tsx
// Settings tab in CMS
<UniversitySettingsTab universityId="worcester" />

// Loads from universities.settings
// Displays all 6 sections:
// - Features, Privacy, Notifications, Integrations, Terminology, Leadership
```

---

## Impact on Other Features

### 1. Reports
Leadership titles now appear correctly:
- "Report for Vice-Chancellor" (not "Executive")
- "Report for Head of School" (not "Unit Head")

### 2. Dashboards
Terminology is consistent:
- "School Breakdown" (not "Faculty Breakdown")
- "Course Comparison" (not "Department Comparison")

### 3. CMS
Forms use Worcester's terms:
- "School" labels and inputs
- "Course" dropdowns and filters

### 4. Permissions
Leadership roles control data access:
- Vice-Chancellor: All data ✅
- Head of School: Their school only 🔒
- Course Leader: Their course only 🔒🔒

---

## Testing Checklist

After deployment:

### Via Superuser Panel
- [ ] Navigate to Superuser → Universities
- [ ] Find Worcester card
- [ ] Click "Settings" button
- [ ] Confirm initialization
- [ ] See "✅ Worcester settings initialized successfully!"
- [ ] Check console for API response

### Via CMS Settings Tab
- [ ] Navigate to Worcester CMS → Settings
- [ ] See "School" (not "Faculty") in terminology
- [ ] See 4 leadership roles with correct titles
- [ ] See features toggles (Notifications ON, Peer Support OFF)
- [ ] See 7 years retention, 1 year anonymization
- [ ] Click "Save Settings"
- [ ] See success message

### In Database
```sql
SELECT 
  id, 
  name, 
  settings->'terminology' as terminology,
  settings->'leadershipRoles' as roles
FROM universities 
WHERE id = 'worcester';
```

Should return:
- terminology: `{"academicUnitSingular":"School"...}`
- roles: `[{"title":"Vice-Chancellor"...}]`

---

## Files Changed

1. ✅ `api/cms/initialize-worcester-settings.ts` - NEW
2. ✅ `src/components/SuperuserControlPanel.tsx` - UPDATED
3. ✅ `docs/UNIVERSITY_SETTINGS_GUIDE.md` - NEW

**No changes to:**
- `UniversitySettingsTab.tsx` (already correct)
- Database schema (settings column already exists)
- Mobile app (reads from database)

---

## Next Steps (Optional)

### Now
1. Deploy these changes
2. Initialize Worcester settings via Superuser panel
3. Verify in CMS Settings tab

### Future
1. Add SSO integration for Worcester (Azure AD)
2. Implement SMS notifications (optional premium)
3. Add more leadership roles if needed (e.g., "Dean of Students")
4. Create settings for other universities (LSE, etc.)

---

## Notes

- **Settings are flexible** - Worcester admin can modify via CMS
- **Defaults are sensible** - 7yr retention, GDPR-compliant
- **Terminology matters** - Reports/dashboards will use "School" everywhere
- **Roles are important** - They control who sees what data
- **One-time setup** - Initialize once, Worcester admin maintains

---

## Status

✅ **READY FOR DEPLOYMENT**

All code complete, linted, documented. No database migrations needed (settings column already exists). Can deploy alongside CMS wiring updates.
