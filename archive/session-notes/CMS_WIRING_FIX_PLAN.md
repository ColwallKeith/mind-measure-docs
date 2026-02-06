# CMS WIRING FIX - Complete Plan

## Problem Statement

The mobile app's Help Page, Content, and Nudges are not loading data from the CMS even though:
1. CMS admin panel in `mind-measure-core` allows editing
2. Database tables exist and are being populated
3. Mobile app has code to fetch the data

## Root Cause

All three features use the `/api/database/select` endpoint which:
- ❌ Is currently working (verified during security sprint)
- ✅ Has JWT auth, table allow list, user scoping
- ❌ But may not be including all required fields in the query

## Three Features to Fix

### 1. Help/Support Resources
**Current State:** HelpPage fetches from database but may get incomplete data
**Files Involved:**
- Mobile: `/mind-measure-mobile-final/src/components/mobile/HelpPage.tsx` (lines 102-188)
- Database table: `universities.emergency_contacts`, `universities.local_resources`, `universities.national_resources`

**What It Does:**
```typescript
// Line 102-104
const { data: universityData } = await backendService.database.select('universities', {
  filters: { name: 'University of Worcester' }
});
```

**Problem:** May not be selecting all JSONB fields properly

### 2. Content (Help Articles)
**Current State:** Articles may exist but not showing in mobile app
**Files Involved:**
- Mobile: `/mind-measure-mobile-final/src/features/mobile/data.ts` (lines 64-81, 120-136)
- Database tables: `content_articles`, `content_categories`

**What It Does:**
```typescript
// Lines 65-81
const { data: articles } = await backendService.database.select('content_articles')
  .select('id, title, slug, excerpt, content, featured_image, is_featured, view_count, published_at, category:content_categories(name, slug, color, icon)')
  .eq('university_id', profile.university_id)
  .eq('status', 'published')
  .order('is_featured', { ascending: false })
  .order('published_at', { ascending: false});
```

**Problem:** This uses Supabase-style `.select()` syntax which may not work with `/api/database/select`

### 3. Nudges
**Current State:** Hooks exist but Edge Function may not be deployed/working
**Files Involved:**
- Mobile: `/mind-measure-core/src/hooks/useNudges.ts` (lines 18-19)
- Edge Function: `/mind-measure-core/supabase/functions/nudges/index.ts`

**What It Does:**
```typescript
// Line 18-19
const { data, error } = await backendService.functions.invoke('nudges', {
  body: { action: 'show', driver_keys: driverKeys }
})
```

**Problem:** Supabase Edge Functions may not be deployed/configured

## Solution Plan (NO CODE YET)

### Option A: Fix `/api/database/select` to support complex queries
- ✅ Pros: Single endpoint, consistent
- ❌ Cons: Complex, risky, may break existing functionality

### Option B: Create dedicated API endpoints
- ✅ Pros: Clean, testable, explicit
- ❌ Cons: More endpoints to maintain

### Recommended: Option B (Dedicated Endpoints)

## Implementation Plan

### Step 1: Create `/api/mobile/university-resources.ts`
**Purpose:** Fetch all help resources for a university
**Input:** JWT token (extract user_id → university_id)
**Output:**
```json
{
  "emergency_contacts": [...],
  "local_resources": [...],
  "national_resources": [...]
}
```

### Step 2: Create `/api/mobile/content-articles.ts`
**Purpose:** Fetch published content articles for user's university
**Input:** JWT token, optional query params (category, featured)
**Output:**
```json
{
  "articles": [
    {
      "id": "...",
      "title": "...",
      "slug": "...",
      "excerpt": "...",
      "content": "...",
      "featured_image": "...",
      "is_featured": true,
      "view_count": 42,
      "published_at": "2026-01-17",
      "category": {
        "name": "...",
        "slug": "...",
        "color": "...",
        "icon": "..."
      }
    }
  ]
}
```

### Step 3: Create `/api/mobile/nudges.ts`
**Purpose:** Show/snooze/dismiss nudges
**Input:** JWT token, action, driver_keys/nudge_key
**Output:**
```json
{
  "key": "...",
  "text": "...",
  "driver_key": "..."
}
```

### Step 4: Update Mobile App Data Layer
**File:** `/mind-measure-mobile-final/src/features/mobile/data.ts`
**Changes:**
- Replace `backendService.database.select()` calls with direct fetch to new endpoints
- Add error handling and fallbacks

### Step 5: Update HelpPage
**File:** `/mind-measure-mobile-final/src/components/mobile/HelpPage.tsx`
**Changes:**
- Replace `backendService.database.select('universities')` with `/api/mobile/university-resources`

### Step 6: Update useNudges Hook
**File:** `/mind-measure-mobile-final/src/hooks/useNudges.ts`
**Changes:**
- Replace `backendService.functions.invoke('nudges')` with `/api/mobile/nudges`

## Files to Create (mind-measure-core):
1. `/api/mobile/university-resources.ts` - NEW
2. `/api/mobile/content-articles.ts` - NEW
3. `/api/mobile/nudges.ts` - NEW

## Files to Modify (mind-measure-mobile-final):
1. `/src/components/mobile/HelpPage.tsx` - Update data fetching
2. `/src/features/mobile/data.ts` - Update getUserUniversityProfile, getHelpArticles
3. `/src/hooks/useNudges.ts` - Update to use REST API instead of Edge Function

## Testing Plan

### 1. Test Help Resources
- Open mobile app → Navigate to Help
- Should see Worcester emergency contacts, local resources, national resources
- Add new resource in CMS → Refresh mobile app → Should appear

### 2. Test Content Articles
- Create article in CMS (Content tab)
- Publish article
- Open mobile app → Should see article in help section

### 3. Test Nudges
- Trigger nudge conditions
- Should see nudge appear
- Snooze → Should not appear again for X days
- Dismiss → Should never appear again

## Deployment Strategy

### Core (API Endpoints):
1. Create all 3 API endpoints
2. Test locally with curl/Postman
3. **ONE** deployment to mind-measure-core (18 minutes)
4. Verify endpoints work: `curl https://admin.mindmeasure.co.uk/api/mobile/university-resources -H "Authorization: Bearer $TOKEN"`

### Mobile:
1. Update all mobile files
2. Test locally
3. **ONE** deployment to mind-measure-mobile-final
4. Test on device

## Success Criteria

✅ Help resources load from CMS (not hardcoded)
✅ Content articles appear in mobile app when published in CMS
✅ Nudges work (show/snooze/dismiss)
✅ Refresh mobile app shows latest CMS data
✅ No more hardcoded/fallback data

## STOP - Awaiting Approval

**Before proceeding, confirm:**
1. Is this approach correct?
2. Should we create dedicated endpoints or fix `/api/database/select`?
3. Any other considerations?

**Once approved, I will:**
1. Create ALL files
2. Build locally
3. Ask for deployment approval
4. **ONE** deployment to core
5. **ONE** deployment to mobile
