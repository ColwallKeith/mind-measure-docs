# Settings Simplified - Honest UI

**Date:** 2026-01-16  
**Philosophy:** Only show settings that actually do something

---

## What Was Removed ❌

### 1. Features Section (Non-functional)
- ~~Enable Notifications~~ - Not checked anywhere in code
- ~~Enable Analytics~~ - Dashboard always shows, toggle does nothing
- ~~Enable Peer Support~~ - Not implemented
- ~~Enable Resource Sharing~~ - Resources always available

### 2. Privacy Section (Not Enforced)
- ~~Data Retention Days~~ - Stored but not enforced
- ~~Anonymise After Days~~ - No anonymization job exists
- ~~Require Consent~~ - Consent screen always shows

### 3. Notification Channels (Not Implemented)
- ~~Email Notifications~~ - Not implemented
- ~~SMS Notifications~~ - Not implemented
- ~~Push Notifications~~ - Not implemented
- ~~Emergency Alerts~~ - Not implemented

### 4. Integrations (Don't Exist)
- ~~SSO Enabled~~ - No SSO integration
- ~~SSO Provider~~ - No providers configured
- ~~API Key Analytics~~ - No analytics service
- ~~API Key Notifications~~ - No notification service

**Reality:** These were all cosmetic toggles that made universities think they could control things that don't exist or aren't wired up yet.

---

## What Was Kept ✅

### 1. Terminology (Actually Used)
- **Academic Unit Singular/Plural** - Used in:
  - Dashboard labels ("School Breakdown" vs "Faculty Breakdown")
  - Report headers
  - CMS section names
  - Filter dropdowns

**Example:** Worcester uses "School", Oxford uses "Faculty"

### 2. Leadership Roles (Actually Used)
- **Role Titles** - Used in:
  - Report generation ("Report for Vice-Chancellor")
  - Access control (future)
  - Email templates
  
- **Permissions:**
  - `canViewAllData` - Determines report scope
  - `canExportData` - Controls export button visibility

**Example:** Worcester's Vice-Chancellor sees all schools, Head of School sees only theirs

---

## New UI (Simple & Honest)

```
╔═══════════════════════════════════════════╗
║  University Settings - University of      ║
║  Worcester                                ║
╠═══════════════════════════════════════════╣
║                                           ║
║  📖 INSTITUTIONAL TERMINOLOGY             ║
║  ────────────────────────────────────     ║
║  These terms appear in dashboards and     ║
║  reports.                                 ║
║                                           ║
║  Academic Unit (Singular): [School    ]   ║
║  Academic Unit (Plural):   [Schools   ]   ║
║  Sub-unit (Singular):      [Course    ]   ║
║  Sub-unit (Plural):        [Courses   ]   ║
║                                           ║
║  👥 LEADERSHIP ROLES & TITLES             ║
║  ────────────────────────────────────     ║
║  These roles appear in reports and        ║
║  determine access levels.                 ║
║                                           ║
║  ┌─────────────────────────────────────┐ ║
║  │ EXECUTIVE LEVEL                     │ ║
║  │ Title: [Vice-Chancellor         ]   │ ║
║  │ Description: [Head of University ]  │ ║
║  │ ☑ Can view all university data      │ ║
║  │ ☑ Can export data                   │ ║
║  └─────────────────────────────────────┘ ║
║                                           ║
║  ┌─────────────────────────────────────┐ ║
║  │ SENIOR LEADERSHIP                   │ ║
║  │ Title: [Pro-Vice-Chancellor     ]   │ ║
║  │ ...                                 │ ║
║  └─────────────────────────────────────┘ ║
║                                           ║
║  [+ Add Role]                             ║
║                                           ║
║  ────────────────────────────────────     ║
║                    [💾 Save Settings]     ║
╚═══════════════════════════════════════════╝
```

**That's it.** No fake toggles. No misleading options.

---

## Comparison

### Before (Bloated):
- 30+ settings
- 5 sections
- 600+ lines of code
- Lots of fake toggles
- Universities confused about what works

### After (Honest):
- 8 settings (4 terminology + 4 default roles)
- 2 sections
- 350 lines of code
- Only real settings
- Clear what actually matters

---

## Files Changed

1. ✅ `src/components/institutional/cms/UniversitySettingsTab.tsx` - Completely rewritten
2. ✅ `api/cms/initialize-worcester-settings.ts` - Simplified to match
3. 📦 `src/components/institutional/cms/UniversitySettingsTab-OLD.tsx` - Preserved for reference

---

## Impact

### Positive:
- ✅ **Honest UI** - Only shows what actually works
- ✅ **Less Confusion** - Universities won't try to "enable" non-existent features
- ✅ **Faster Load** - Simpler component
- ✅ **Easier Maintenance** - Less code to maintain
- ✅ **Clear Purpose** - Settings that matter are prominent

### Negative:
- None - the removed settings didn't do anything anyway

---

## Future: When Features Become Real

### If SSO Gets Implemented:
Add back to settings:
```typescript
integrations: {
  sso_enabled: boolean;
  sso_provider: string;
  sso_config: object;
}
```

### If Notification System Gets Implemented:
Add back to settings:
```typescript
notifications: {
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
}
```

### If Privacy Features Get Enforced:
Add back to settings:
```typescript
privacy: {
  data_retention_days: number;
  anonymise_after_days: number;
}
```

**But ONLY when the backend actually checks these settings.**

---

## Testing After Deployment

### Verify Simplified UI:
1. Navigate to Worcester CMS → Settings
2. **Should see:** Only 2 sections (Terminology + Leadership)
3. **Should NOT see:** Features, Privacy, Notifications, Integrations
4. Verify terminology fields pre-populated: "School", "Schools", "Course", "Courses"
5. Verify 4 leadership roles: Vice-Chancellor, Pro-Vice-Chancellor, Head of School, Course Leader

### Verify Initialization API:
```bash
curl -X POST https://admin.mindmeasure.co.uk/api/cms/initialize-worcester-settings \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Should return only `terminology` and `leadershipRoles` in settings.

### Verify Database:
```sql
SELECT settings FROM universities WHERE id = 'worcester';
```

Should show minimal structure:
```json
{
  "terminology": {
    "academicUnitSingular": "School",
    "academicUnitPlural": "Schools",
    "subUnitSingular": "Course",
    "subUnitPlural": "Courses"
  },
  "leadershipRoles": [...]
}
```

No `features`, `privacy`, `notifications`, or `integrations` keys.

---

## Lessons Learned

### ❌ Don't Create Settings For:
- Features not yet implemented
- Values not checked by any code
- External services not integrated
- Policies not enforced

### ✅ Only Create Settings For:
- Values actually used in UI rendering
- Permissions actually enforced
- Customizations that affect user experience
- Configuration that changes behavior

### 🎯 Golden Rule:
**"If toggling this setting does nothing, don't show the toggle."**

---

## Developer Notes

### How Terminology Is Used:
```typescript
// In dashboard components
const unitLabel = settings.terminology.academicUnitPlural; // "Schools"
<h2>{unitLabel} Breakdown</h2>

// In report generation
const roleTitle = settings.leadershipRoles.find(r => r.level === 'executive').title;
const reportTitle = `Report for ${roleTitle}`; // "Report for Vice-Chancellor"
```

### How Leadership Roles Are Used:
```typescript
// In report access control (future)
const user = getCurrentUser();
const role = settings.leadershipRoles.find(r => r.title === user.role);

if (role.canViewAllData) {
  // Show all schools
} else {
  // Show only user's school
}

if (role.canExportData) {
  // Show export button
}
```

---

## Status

✅ **COMPLETE**  
✅ **Committed**  
✅ **Ready for deployment**  
✅ **Honest UI achieved**

This is what settings should look like: **Simple, honest, functional.**
