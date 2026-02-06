# 📚 Mind Measure Docs Separation Plan

## ✅ **COMPLETED: Main Repository Cleanup**

### What Was Done:
- ✅ Removed entire `docs/` directory from main repository
- ✅ Cleaned up `vercel.json` to remove docs references
- ✅ Removed `.vercelignore` (no longer needed)
- ✅ Removed temporary `docs.html` page
- ✅ Main app now builds cleanly without conflicts

### Result:
- **Main Repository**: Now contains ONLY the Vite application
- **Clean Deployment**: `app.mindmeasure.co.uk` deploys only the main app
- **No Conflicts**: No more dual deployment issues

---

## 🎯 **NEXT STEPS: Create Separate Docs Repository**

### Step 1: Create New Repository
```bash
# Create new repository on GitHub: mind-measure-docs
# Clone locally and set up structure
```

### Step 2: Repository Structure
```
mind-measure-docs/
├── package.json          # Next.js + Nextra dependencies
├── next.config.mjs        # Nextra configuration
├── theme.config.tsx       # Nextra theme config
├── vercel.json           # Vercel deployment config
├── pages/                # Documentation pages
│   ├── _meta.json
│   ├── index.mdx
│   ├── architecture.mdx
│   ├── deployment.mdx
│   └── ...
├── public/               # Static assets
└── README.md
```

### Step 3: Deployment Configuration

**vercel.json for docs:**
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": "out"
}
```

**package.json scripts:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

### Step 4: Vercel Deployment
1. **Create new Vercel project** for `mind-measure-docs`
2. **Connect to GitHub** repository
3. **Configure domain**: `mindmeasuredocs.vercel.app`
4. **Set environment variables** if needed

---

## 🔗 **Integration Strategy**

### Cross-Linking:
- **Main App** → **Docs**: Link to `https://mindmeasuredocs.vercel.app`
- **Docs** → **Main App**: Link to `https://app.mindmeasure.co.uk`

### Navigation Integration:
- Add docs link in main app header/footer
- Add "Back to App" link in docs navigation
- Consistent branding and styling

---

## 📋 **Implementation Checklist**

### Phase 1: Repository Setup
- [ ] Create `mind-measure-docs` GitHub repository
- [ ] Set up Next.js + Nextra configuration
- [ ] Move documentation content from backup
- [ ] Test local build and development

### Phase 2: Deployment Setup
- [ ] Create Vercel project for docs
- [ ] Configure automatic deployments
- [ ] Set up custom domain if needed
- [ ] Test production deployment

### Phase 3: Integration
- [ ] Add docs links in main application
- [ ] Update navigation and cross-references
- [ ] Test end-to-end user experience
- [ ] Update README files in both repositories

---

## 🎯 **Benefits of This Approach**

### ✅ **Clean Separation:**
- Each repository has single responsibility
- No deployment conflicts
- Independent versioning and releases

### ✅ **Better Maintenance:**
- Docs can be updated independently
- Different teams can manage different repositories
- Cleaner CI/CD pipelines

### ✅ **Scalability:**
- Easy to add more documentation sites
- Can have different deployment strategies
- Better performance optimization per use case

---

## 🚀 **Current Status**

### ✅ **Main App (mind-measure-core):**
- **Repository**: Clean, docs-free
- **Deployment**: `app.mindmeasure.co.uk`
- **Status**: ✅ Ready for production

### 📋 **Docs (mind-measure-docs):**
- **Repository**: ⏳ To be created
- **Deployment**: ⏳ To be set up
- **Status**: 🔄 Next phase

---

## 🎯 **Immediate Next Action**

**Ready to create the separate docs repository and set up independent deployment.**

This approach provides:
- ✅ Clean architecture
- ✅ No deployment conflicts  
- ✅ Independent maintenance
- ✅ Professional separation of concerns

The main application is now clean and ready for production use!
