# CMS Rebuild Plan - Match Mobile App Exactly

## Critical Understanding

**The mobile app UI is CORRECT and FINAL.**
**The CMS must be built to OUTPUT exactly what the mobile app expects.**
**DO NOT change the mobile app structure.**

---

## 1. Help Resources (Already Works?)

### Mobile App Structure:
```typescript
{
  emergency_contacts: [
    { name, phone, description, priority, icon }
  ],
  local_resources: [
    { name, phone, address, hours, website }
  ],
  national_resources: [
    { name, phone, description, website }
  ]
}
```

### Current CMS:
- Worcester CMS → Support tab → EmergencyResourcesManager
- Stores in `universities` table as JSONB
- Already has the right structure

### Status: ✅ WORKING - No changes needed

---

## 2. Wellbeing Content Articles

### Mobile App Expects:
```typescript
interface ContentArticle {
  id: string;
  category: 'Anxiety' | 'Sleep' | 'Stress' | 'Relationships' | 'Exercise' | 'Study';
  title: string;
  description: string;  // Short excerpt
  readTime: number;     // Minutes
  isNew: boolean;       // Published < 7 days ago
  thumbnail: string;    // Image URL
  fullContent: string;  // PLAIN TEXT with \n\n for paragraphs
  author: string;       // "Dr Sarah Mitchell, Clinical Psychologist"
  publishDate: string;  // "4 January 2026"
}
```

### Current CMS Problem:
- Uses `category_id` (UUID) instead of category name
- Stores `content` as TipTap JSON instead of plain text
- No `readTime` field
- Uses rich text editor (wrong format)

### Required CMS Changes:

**Content Manager UI Must Have:**
1. **Category Dropdown** → 'Anxiety', 'Sleep', 'Stress', 'Relationships', 'Exercise', 'Study'
   - Store as **string** not UUID
2. **Plain Text Editor** → Textarea, not TipTap rich text
   - Markdown support optional
   - NO JSON structure
3. **Auto-calculate Read Time** → count words / 200
4. **Image Upload** → Single featured image
5. **Author Field** → Text input (name + title)
6. **Publish Date** → Auto-set on publish

**Database Schema:**
```sql
CREATE TABLE mobile_content_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id text REFERENCES universities(id),
  category text NOT NULL, -- 'Anxiety', 'Sleep', etc.
  title text NOT NULL,
  description text, -- Short excerpt
  full_content text NOT NULL, -- Plain text with \n\n
  thumbnail text, -- Image URL
  author text, -- "Dr Sarah Mitchell, Clinical Psychologist"
  published_at timestamptz,
  is_featured boolean DEFAULT false,
  status text DEFAULT 'draft', -- draft, published
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

---

## 3. University Messages (Nudges)

### Mobile App Expects:
```typescript
interface UniversityMessage {
  id: string;
  type: 'wellbeing' | 'nudge' | 'announcement' | 'reminder' | 'emergency';
  title: string;
  body: string;
  ctaText?: string;  // Button text
  ctaLink?: string;  // Optional URL
  timestamp: string; // "Posted today", "2 hours ago"
}
```

### Required CMS:

**Nudges Manager UI Must Have:**
1. **Type Selector** → wellbeing, nudge, announcement, reminder, emergency
2. **Title** → Text input
3. **Body** → Textarea (plain text, maybe 280 char limit like Twitter)
4. **CTA** → Optional button text + link
5. **Scheduling** → Start/end dates
6. **Targeting** → Optional filters (year, course, residence)

**Database Schema:**
```sql
CREATE TABLE mobile_nudges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id text REFERENCES universities(id),
  type text NOT NULL, -- 'wellbeing', 'nudge', 'announcement', 'reminder', 'emergency'
  title text NOT NULL,
  body text NOT NULL,
  cta_text text,
  cta_link text,
  icon text, -- Optional emoji or icon name
  priority integer DEFAULT 0,
  start_date timestamptz,
  end_date timestamptz,
  target_years text[], -- ['1', '2', '3']
  target_courses text[],
  target_residences text[],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE mobile_nudge_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  nudge_id uuid REFERENCES mobile_nudges(id),
  action text NOT NULL, -- 'shown', 'dismissed', 'cta_clicked'
  created_at timestamptz DEFAULT now()
);
```

---

## Implementation Steps

### Step 1: Create New Tables (Clean Slate)
- `mobile_content_articles` → For wellbeing content
- `mobile_nudges` → For university messages
- `mobile_nudge_interactions` → Track dismissals

### Step 2: Build Simple CMS Components

**ContentManager (New):**
- List view: Show all articles for university
- Create/Edit form:
  - Category dropdown (6 options)
  - Title input
  - Description textarea (short)
  - Full Content textarea (plain text, large)
  - Thumbnail upload
  - Author input
  - Publish button
- Preview: Show how it looks in mobile app

**NudgesManager (New):**
- List view: Show all nudges for university
- Create/Edit form:
  - Type dropdown (5 options)
  - Title input
  - Body textarea (280 char limit)
  - CTA text + link (optional)
  - Icon picker (optional)
  - Date range picker
  - Targeting (optional checkboxes)
- Preview: Show how it looks on mobile dashboard

### Step 3: Create Mobile API Endpoints

**GET /api/mobile/content**
- Returns array of `ContentArticle` in exact mobile format
- Calculates `readTime` from word count
- Calculates `isNew` from publish date
- Filters by `status = 'published'`

**GET /api/mobile/nudges**
- Returns next nudge for user
- Checks dismissals
- Applies targeting rules
- Formats timestamp ("Posted today")

**POST /api/mobile/nudges/dismiss**
- Records user dismissed nudge

### Step 4: Update Mobile App (Minimal Changes)
- Replace hardcoded articles with API call
- Replace hardcoded messages with API call
- Keep UI exactly the same

---

## What NOT To Do

❌ Don't use TipTap or rich text editors
❌ Don't use category relationships (UUID foreign keys)
❌ Don't use complex content schemas
❌ Don't change mobile app structure
❌ Don't try to be clever - match the screenshots EXACTLY

## What TO Do

✅ Use plain text (textarea)
✅ Use category as string ('Anxiety', 'Sleep')
✅ Store content exactly as mobile expects
✅ Build CMS around mobile app, not the other way around
✅ Make it simple and obvious

---

## Next Actions

1. **Review this plan with Keith** - Confirm this matches screenshots
2. **Create migration** - New tables only
3. **Build ContentManager component** - Simple forms
4. **Build NudgesManager component** - Simple forms  
5. **Create mobile APIs** - Match exact structure
6. **Test end-to-end** - CMS → Database → API → Mobile

---

**The golden rule: The mobile app screenshots are the spec. The CMS exists to populate those screens.**
