# Marketing CMS - Ready for Testing! 🚀

**Date**: December 16, 2024  
**Status**: ✅ READY TO TEST

---

## ✅ Migration Complete

The database migration has been successfully executed on Aurora:

### Tables Created:
- ✅ `marketing_blog_posts` (0 posts)
- ✅ `marketing_categories` (5 categories)
- ✅ `marketing_tags` (0 tags)
- ✅ `marketing_blog_categories` (junction table)
- ✅ `marketing_blog_tags` (junction table)
- ✅ `marketing_media` (0 media files)

### Default Categories:
1. Mental Health
2. Student Life
3. Research
4. University Support
5. Resources

---

## ✅ Dependencies Installed

- ✅ `aws-jwt-verify` - Cognito authentication
- ✅ `formidable` - File upload handling
- ✅ `@types/formidable` - TypeScript types

---

## 🧪 How to Test

### Step 1: Deploy to Vercel

The code is ready to deploy. Push to your repository:

```bash
cd /Users/keithduddy/Desktop/Mind\ Measure\ local/mind-measure-core
git add .
git commit -m "feat: Marketing CMS Phase 1 - Complete

- Database schema with 6 tables
- Admin API endpoints (CRUD)
- Public API endpoints (read-only)
- Superuser UI (dashboard & editor)
- Multi-site targeting
- SEO fields
- Publishing workflow"
git push origin main
```

Vercel will automatically deploy.

---

### Step 2: Access the CMS

Once deployed, navigate to:

```
https://admin.mindmeasure.co.uk/superuser/marketing-cms
```

**Login Requirements:**
- Must be authenticated with Cognito
- Must have "Superuser" role in Cognito groups

---

### Step 3: Create Your First Blog Post

1. **Click "New Blog Post"**
2. **Fill in the form:**
   - Title: "Welcome to Mind Measure Blog"
   - Excerpt: "Introducing our new blog for mental health insights"
   - Content: Write a few paragraphs (plain text for now)
   - Select target sites: ✓ University, ✓ Student
   - Author Name: Your name
   - SEO Title: Same as title
   - SEO Description: Same as excerpt

3. **Click "Publish"**

4. **Verify it appears in the list**
   - Should show status: "Published"
   - Should show target sites badges
   - Should show published date

---

## 📡 API Endpoints Available

### Admin API (Superuser Only)

**Create Post:**
```bash
POST https://admin.mindmeasure.co.uk/api/marketing-cms/blog-posts/create
Headers: Authorization: Bearer YOUR_COGNITO_TOKEN
Body: {
  "title": "Test Post",
  "content": { "type": "doc", "content": [] },
  "status": "draft"
}
```

**List Posts:**
```bash
GET https://admin.mindmeasure.co.uk/api/marketing-cms/blog-posts/list
Headers: Authorization: Bearer YOUR_COGNITO_TOKEN
```

**Get Single Post:**
```bash
GET https://admin.mindmeasure.co.uk/api/marketing-cms/blog-posts/:id
Headers: Authorization: Bearer YOUR_COGNITO_TOKEN
```

**Update Post:**
```bash
PUT https://admin.mindmeasure.co.uk/api/marketing-cms/blog-posts/:id
Headers: Authorization: Bearer YOUR_COGNITO_TOKEN
Body: { "title": "Updated Title" }
```

**Delete Post:**
```bash
DELETE https://admin.mindmeasure.co.uk/api/marketing-cms/blog-posts/:id
Headers: Authorization: Bearer YOUR_COGNITO_TOKEN
```

---

### Public API (No Auth Required)

**Get Published Posts:**
```bash
GET https://admin.mindmeasure.co.uk/api/marketing/blog-posts?site=university&limit=10
```

**Get Single Post by Slug:**
```bash
GET https://admin.mindmeasure.co.uk/api/marketing/blog-posts?slug=your-post-slug
```

**Get Categories:**
```bash
GET https://admin.mindmeasure.co.uk/api/marketing/categories
```

---

## 🧪 Testing Checklist

### Database ✅
- [x] Tables created successfully
- [x] Default categories seeded
- [x] Indexes created
- [x] Triggers set up

### Admin API
- [ ] Create blog post via API
- [ ] List blog posts via API
- [ ] Get single post via API
- [ ] Update post via API
- [ ] Delete post via API
- [ ] Authentication works (Cognito token)
- [ ] Superuser role check works

### Public API
- [ ] Get published posts
- [ ] Get post by slug
- [ ] Get categories
- [ ] Unpublished posts NOT returned
- [ ] View count increments

### Admin UI
- [ ] Navigate to `/superuser/marketing-cms`
- [ ] See dashboard with stats
- [ ] Click "New Blog Post"
- [ ] Create and save draft
- [ ] Publish post
- [ ] See post in list
- [ ] Edit post
- [ ] Delete post
- [ ] Search posts
- [ ] Filter by status
- [ ] Target sites checkboxes work
- [ ] Featured post toggle works
- [ ] SEO fields save correctly

---

## 🎯 Known Limitations

### Phase 1 (Current)
- ✅ Plain text content only (no rich text yet)
- ✅ No media upload UI (API exists, UI pending)
- ✅ No category management UI (categories are seeded)
- ✅ No tag management UI (can't create tags yet)
- ✅ No preview before publish
- ✅ No autosave
- ✅ No version history

### Phase 2 (Next)
- 🔄 Tiptap rich text editor
- 🔄 Media library UI
- 🔄 Category & tag management
- 🔄 Live preview
- 🔄 Autosave every 5 seconds
- 🔄 Marketing site integration (Astro)

---

## 🐛 Troubleshooting

### If APIs return 401 Unauthorized:
1. Check Cognito token in localStorage (`idToken`)
2. Verify token is valid (not expired)
3. Check user has "Superuser" group in Cognito

### If APIs return 403 Forbidden:
1. User is authenticated but not a superuser
2. Add user to "Superuser" group in Cognito

### If tables don't exist:
1. Re-run migration: `npx tsx scripts/run-migration.ts`
2. Check Aurora connection
3. Verify database credentials

### If UI doesn't load:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify route exists in Next.js app router

---

## 📊 Current Stats

| Metric | Value |
|--------|-------|
| Database Tables | 6 |
| API Endpoints | 7 |
| UI Pages | 3 |
| Default Categories | 5 |
| Blog Posts | 0 (ready to create!) |
| Dependencies Installed | ✅ |
| Migration Status | ✅ Complete |

---

## 🚀 Next Steps

1. **Test the UI** - Create your first blog post
2. **Test the APIs** - Use Postman to verify endpoints
3. **Add Navigation** - Add "Marketing CMS" link to admin nav
4. **Phase 2** - Install Tiptap for rich text editing
5. **Marketing Sites** - Integrate with Astro sites

---

## 💡 Quick Tips

### Getting Cognito Token:
```javascript
// In browser console on admin.mindmeasure.co.uk
localStorage.getItem('idToken')
```

### Testing with curl:
```bash
TOKEN="your-token-here"
curl -H "Authorization: Bearer $TOKEN" \
     https://admin.mindmeasure.co.uk/api/marketing-cms/blog-posts/list
```

### Checking Database:
```bash
psql -h mindmeasure-aurora.cluster-cz8c8wq4k3ak.eu-west-2.rds.amazonaws.com \
     -U mindmeasure_admin \
     -d mindmeasure \
     -c "SELECT * FROM marketing_blog_posts;"
```

---

## ✅ Status: READY TO TEST!

Everything is set up and ready. Create your first blog post and see the Marketing CMS in action! 🎉

