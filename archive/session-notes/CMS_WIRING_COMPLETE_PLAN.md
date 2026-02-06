# CMS WIRING - COMPLETE IMPLEMENTATION PLAN

## DISCOVERED DESIGN

### 1. Wellbeing/Content Button (Bottom Nav)
**Current:** Shows hardcoded articles in `ContentPage.tsx`
**Design:** Beautiful card-based layout with:
- Categories: Anxiety, Sleep, Stress, Relationships, Exercise, Study
- Each article has: thumbnail image, title, description, read time, author, full content
- Filter buttons for categories
- "isNew" badge for recent articles
- Opens full article in `ArticleDetailPage.tsx`

**CMS Table:** `content_articles` with `content_categories`

### 2. Messages from Your University (Dashboard)
**Current:** Shows hardcoded messages in `MobileDashboard.tsx` (lines 664-735)
**Design:** Single message card that randomly rotates, showing:
- Type icons: nudge 🎉, wellbeing 💚, announcement 📢, reminder ⏰, emergency 🚨
- Title
- Body text
- Optional CTA button ("Register Now", "Book Appointment", etc.)
- Timestamp ("Posted today", "2 hours ago")
- Dismissible

**CMS Table:** `nudges` table

### 3. Help Resources
**Current:** Fetches from database but may have issues
**Tables:** `universities.emergency_contacts`, `universities.local_resources`, `universities.national_resources`

---

## DATABASE SCHEMA AUDIT

### Content System (Already Exists)

```sql
-- content_categories table
CREATE TABLE content_categories (
  id UUID PRIMARY KEY,
  university_id UUID REFERENCES universities(id),
  name TEXT, -- "Anxiety", "Sleep", "Stress", etc.
  slug TEXT, -- "anxiety", "sleep"
  color TEXT, -- "#FF5733" for UI
  icon TEXT, -- "brain", "moon", "heart"
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- content_articles table
CREATE TABLE content_articles (
  id UUID PRIMARY KEY,
  university_id UUID REFERENCES universities(id),
  category_id UUID REFERENCES content_categories(id),
  title TEXT,
  slug TEXT,
  excerpt TEXT, -- Short description
  content JSONB, -- TipTap editor JSON
  featured_image TEXT, -- URL
  author TEXT,
  is_featured BOOLEAN,
  status TEXT, -- 'draft', 'published', 'archived'
  view_count INTEGER DEFAULT 0,
  published_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Nudges System (Needs Creation)

```sql
-- nudges table (TO CREATE)
CREATE TABLE nudges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID REFERENCES universities(id),
  type TEXT CHECK (type IN ('nudge', 'announcement', 'reminder', 'emergency', 'wellbeing')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  cta_text TEXT, -- Optional button text
  cta_url TEXT, -- Optional button link
  icon TEXT, -- Emoji or icon name
  priority INTEGER DEFAULT 0, -- Higher = more likely to show
  is_active BOOLEAN DEFAULT true,
  start_date DATE,
  end_date DATE,
  target_audience JSONB, -- { "years": [1, 2], "courses": ["Psychology"], "residences": ["on-campus"] }
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- nudge_interactions (tracking dismissals)
CREATE TABLE nudge_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nudge_id UUID REFERENCES nudges(id),
  user_id UUID REFERENCES auth.users(id),
  action TEXT CHECK (action IN ('shown', 'dismissed', 'cta_clicked')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_nudge_interactions_user ON nudge_interactions(user_id, nudge_id);
CREATE INDEX idx_nudges_active ON nudges(is_active, start_date, end_date);
```

---

## API ENDPOINTS TO CREATE

### 1. `/api/mobile/university-resources.ts` ✅ (Already Planned)
**Purpose:** Fetch help resources
**Auth:** JWT required
**Logic:**
1. Extract user_id from JWT
2. Get user's university_id from profiles
3. Query universities table for:
   - emergency_contacts (JSONB array)
   - local_resources (JSONB array)
   - national_resources (JSONB array)
4. Return all three arrays

**Response:**
```json
{
  "emergency_contacts": [...],
  "local_resources": [...],
  "national_resources": [...]
}
```

### 2. `/api/mobile/content-articles.ts` ✅ (Already Planned)
**Purpose:** Fetch published content articles
**Auth:** JWT required
**Query Params:** `?category=sleep&featured=true`
**Logic:**
1. Extract user_id from JWT
2. Get user's university_id from profiles
3. Query content_articles:
   - WHERE university_id = user's university
   - AND status = 'published'
   - AND published_at <= NOW()
   - JOIN content_categories for category info
   - ORDER BY is_featured DESC, published_at DESC
4. Return articles with category info

**Response:**
```json
{
  "articles": [
    {
      "id": "...",
      "title": "The 5-4-3-2-1 Grounding Technique",
      "slug": "5-4-3-2-1-grounding-technique",
      "excerpt": "When feeling overwhelmed...",
      "content": {...}, // TipTap JSON
      "featured_image": "https://...",
      "author": "Dr Sarah Mitchell",
      "is_featured": true,
      "is_new": true, // if published within last 7 days
      "read_time": 3, // calculated from content
      "published_at": "2026-01-04T10:00:00Z",
      "category": {
        "name": "Anxiety",
        "slug": "anxiety",
        "color": "#FF5733",
        "icon": "brain"
      }
    }
  ]
}
```

### 3. `/api/mobile/nudges.ts` ✅ NEW!
**Purpose:** Get next nudge to show user
**Auth:** JWT required
**Logic:**
1. Extract user_id from JWT
2. Get user's university_id and profile data (year, course, residence)
3. Find active nudges:
   - WHERE university_id = user's university
   - AND is_active = true
   - AND (start_date IS NULL OR start_date <= TODAY)
   - AND (end_date IS NULL OR end_date >= TODAY)
   - AND NOT EXISTS in nudge_interactions WHERE user_id = user AND action = 'dismissed'
   - AND target_audience matches user (if specified)
4. Pick one randomly (weighted by priority)
5. Record 'shown' interaction
6. Return nudge

**Response:**
```json
{
  "id": "...",
  "type": "wellbeing",
  "title": "World Mental Health Day 🌍",
  "body": "Join us this Thursday...",
  "cta_text": "Register Now",
  "cta_url": "https://...",
  "timestamp": "Posted today"
}
```

**POST** `/api/mobile/nudges` - Dismiss nudge
**Body:** `{ "nudge_id": "...", "action": "dismissed" }`

---

## CMS UI TO CREATE/VERIFY

### 1. Content Management (Verify Exists)
**Location:** `mind-measure-core/src/components/institutional/cms/ContentManager.tsx`
**Features Needed:**
- ✅ TipTap rich text editor
- ✅ Image upload for featured_image
- ✅ Category selection dropdown
- ✅ Author field
- ✅ Publish/Draft toggle
- ✅ Featured toggle
- ✅ Preview mode

### 2. Nudges Management (CREATE NEW)
**Location:** `mind-measure-core/src/components/institutional/cms/NudgesManager.tsx`
**UI Design:**
```
┌─────────────────────────────────────────────┐
│ Nudges & University Messages                │
├─────────────────────────────────────────────┤
│  [+ Create Nudge]           [Filter ▼]      │
├─────────────────────────────────────────────┤
│ ┌───────────────────────────────────────┐   │
│ │ 🎉 You're on a streak!                │   │
│ │ Type: Nudge | Active | 23 shown       │   │
│ │ Created: Jan 15, 2026                 │   │
│ │ [Edit] [Deactivate] [Analytics]       │   │
│ └───────────────────────────────────────┘   │
│                                             │
│ ┌───────────────────────────────────────┐   │
│ │ 📢 Extended Counselling Hours         │   │
│ │ Type: Announcement | Active | 45 shown│   │
│ │ Created: Jan 14, 2026                 │   │
│ │ [Edit] [Deactivate] [Analytics]       │   │
│ └───────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

**Create/Edit Form:**
```
┌─────────────────────────────────────────────┐
│ Create New Message                          │
├─────────────────────────────────────────────┤
│ Type: [Nudge ▼]                             │
│ Title: [____________________________]       │
│ Body:  [____________________________]       │
│        [____________________________]       │
│ Icon:  [🎉] [Optional]                      │
│                                             │
│ Call to Action (Optional):                  │
│ Button Text: [Register Now__________]       │
│ Button URL:  [https://_______________]      │
│                                             │
│ Scheduling:                                 │
│ Start Date: [Jan 15, 2026] [Optional]      │
│ End Date:   [Jan 30, 2026] [Optional]      │
│                                             │
│ Target Audience (Optional):                 │
│ Years: [☑ All] [ ] 1 [ ] 2 [ ] 3 [ ] 4      │
│ Courses: [Add course filter...]             │
│ Residence: [☑ All] [ ] On-Campus [ ] Off   │
│                                             │
│ Priority: [●●●○○] Normal                    │
│                                             │
│ Status: [☑ Active] [ ] Draft                │
│                                             │
│ [Cancel] [Save Draft] [Publish]             │
└─────────────────────────────────────────────┘
```

---

## MOBILE APP CHANGES

### 1. ContentPage.tsx
**Current:** Hardcoded articles array (lines 30-930)
**Change:** Fetch from `/api/mobile/content-articles`

```typescript
// BEFORE (line 30):
const articles: ContentArticle[] = [hardcoded...];

// AFTER:
const [articles, setArticles] = useState<ContentArticle[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadArticles();
}, [activeFilter]);

const loadArticles = async () => {
  try {
    setLoading(true);
    const token = await getAuthToken();
    const url = activeFilter === 'All' 
      ? '/api/mobile/content-articles'
      : `/api/mobile/content-articles?category=${activeFilter.toLowerCase()}`;
    
    const response = await fetch(`https://admin.mindmeasure.co.uk${url}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setArticles(data.articles);
  } catch (error) {
    console.error('Failed to load articles:', error);
  } finally {
    setLoading(false);
  }
};
```

### 2. MobileDashboard.tsx
**Current:** Hardcoded messages array (lines 667-707)
**Change:** Fetch from `/api/mobile/nudges`

```typescript
// BEFORE (line 667):
const sampleMessages = [hardcoded...];

// AFTER:
const [currentNudge, setCurrentNudge] = useState<any>(null);

useEffect(() => {
  loadNudge();
}, []);

const loadNudge = async () => {
  try {
    const token = await getAuthToken();
    const response = await fetch('https://admin.mindmeasure.co.uk/api/mobile/nudges', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setCurrentNudge(data);
  } catch (error) {
    console.error('Failed to load nudge:', error);
  }
};

const dismissNudge = async (nudgeId: string) => {
  try {
    const token = await getAuthToken();
    await fetch('https://admin.mindmeasure.co.uk/api/mobile/nudges', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nudge_id: nudgeId, action: 'dismissed' })
    });
    setCurrentNudge(null);
  } catch (error) {
    console.error('Failed to dismiss nudge:', error);
  }
};
```

### 3. HelpPage.tsx
**Current:** Already fetches from database but may have issues
**Change:** Update to use new dedicated endpoint

```typescript
// BEFORE (line 102):
const { data: universityData } = await backendService.database.select('universities', {
  filters: { name: 'University of Worcester' }
});

// AFTER:
const response = await fetch('https://admin.mindmeasure.co.uk/api/mobile/university-resources', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const data = await response.json();
setEmergencyResources(data.emergency_contacts.map(mapToResource));
setLocalSupport(data.local_resources.map(mapToLocalSupport));
setNationalResources(data.national_resources.map(mapToResource));
```

---

## IMPLEMENTATION CHECKLIST

### Phase 1: Database (mind-measure-core)
- [ ] Create migration: `supabase/migrations/20260117000003_nudges_system.sql`
  - [ ] Create `nudges` table
  - [ ] Create `nudge_interactions` table
  - [ ] Add indexes

### Phase 2: API Endpoints (mind-measure-core)
- [ ] Create `/api/mobile/university-resources.ts`
- [ ] Create `/api/mobile/content-articles.ts`
- [ ] Create `/api/mobile/nudges.ts` (GET and POST)

### Phase 3: CMS UI (mind-measure-core)
- [ ] Verify ContentManager exists and works
- [ ] Create NudgesManager.tsx
- [ ] Add "Nudges" tab to University CMS

### Phase 4: Mobile App (mind-measure-mobile-final)
- [ ] Update `ContentPage.tsx` to fetch from API
- [ ] Update `MobileDashboard.tsx` to fetch nudges from API
- [ ] Update `HelpPage.tsx` to use new endpoint

### Phase 5: Testing
- [ ] Create test article in CMS → See in mobile app
- [ ] Create test nudge in CMS → See on dashboard
- [ ] Edit help resources in CMS → See in help page
- [ ] Test dismissing nudge
- [ ] Test filtering articles by category

---

## DEPLOYMENT PLAN

### Deployment 1: Core (API + CMS)
**Files to create/modify:**
1. Migration SQL (nudges)
2. 3 API endpoints
3. NudgesManager.tsx component
4. Update UniversityCMS.tsx to add Nudges tab

**Commands:**
```bash
cd mind-measure-core
npm run build  # Verify locally
# Wait for approval
npx vercel --prod --yes
npx vercel alias admin.mindmeasure.co.uk
```

**Duration:** 18 minutes

### Deployment 2: Mobile App
**Files to modify:**
1. ContentPage.tsx
2. MobileDashboard.tsx
3. HelpPage.tsx

**Commands:**
```bash
cd mind-measure-mobile-final
npm run build  # Verify locally
# Wait for approval
npx vercel --prod --yes
npx vercel alias mobile.mindmeasure.app
```

**Duration:** ~18 minutes

**Total Time:** ~36 minutes (TWO deployments, can't avoid)

---

## SUCCESS CRITERIA

✅ University admin can create articles in CMS → Students see them in Wellbeing tab
✅ University admin can create nudges in CMS → Students see them on dashboard
✅ University admin can edit help resources → Students see updated resources
✅ Articles support: images, categories, rich text, author attribution
✅ Nudges support: types, CTAs, scheduling, audience targeting
✅ Help resources dynamically load from database
✅ Students can dismiss nudges (not shown again)
✅ All dummy/hardcoded content replaced with CMS-driven content

---

## AWAITING APPROVAL

Ready to proceed? This plan ensures the beautiful mobile UI design you have is fully powered by the CMS with zero hardcoded content.
