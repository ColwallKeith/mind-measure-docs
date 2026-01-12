# Repository Cleanup Plan - Docs & Core

**Date:** 2026-01-12  
**Goal:** Remove outdated content, organize current documentation, clean up Core repo bloat

---

## Part 1: mind-measure-docs Cleanup

### Issues Identified:

1. **Duplicate files at root and in subdirectories:**
   - `pages/api-documentation.mdx` + `pages/api-reference/api-documentation.mdx`
   - `pages/medical-grade-security.mdx` + `pages/security/medical-grade-security.mdx`
   - `pages/phase2-advanced-security.mdx` + `pages/security/phase2-advanced-security.mdx`
   - `pages/coding-standards.mdx` + `pages/operations/coding-standards.mdx`
   - Many more...

2. **Empty placeholder directories:**
   - `pages/architecture-infrastructure/` (empty)
   - `pages/cms-admin/` (empty)
   - `pages/core-platform/` (empty)
   - `pages/getting-started/` (empty)
   - `pages/security-compliance/` (empty)
   - `pages/reference/` (empty)

3. **Outdated/historical content:**
   - `pages/mobile-development/` - Old mobile dev logs
   - `pages/assessment-engine/` - Old assessment engine docs (now in future-development)
   - Various postmortems and implementation-complete docs

4. **Scattered content that should be consolidated:**
   - Multiple authentication docs
   - Multiple security docs
   - Multiple AWS migration docs

---

### Proposed Structure (Clean):

```
mind-measure-docs/
├── pages/
│   ├── index.mdx                          # Overview
│   │
│   ├── quick-start/                       # Getting started
│   │   ├── index.mdx
│   │   ├── setup.mdx
│   │   └── first-deployment.mdx
│   │
│   ├── architecture/                      # System architecture
│   │   ├── overview.mdx
│   │   ├── mobile-app.mdx
│   │   ├── admin-dashboard.mdx
│   │   ├── database.mdx
│   │   └── aws-infrastructure.mdx
│   │
│   ├── development/                       # Development guides
│   │   ├── coding-standards.mdx
│   │   ├── development-protocol.mdx
│   │   ├── testing-qa.mdx
│   │   └── deployment.mdx
│   │
│   ├── assessment/                        # Assessment system
│   │   ├── overview.mdx
│   │   ├── baseline-assessment.mdx
│   │   ├── checkin-assessment.mdx
│   │   ├── scoring-algorithm.mdx
│   │   └── clinical-scores.mdx
│   │
│   ├── admin/                             # Admin dashboard
│   │   ├── overview.mdx
│   │   ├── cms-user-guide.mdx
│   │   ├── cms-technical.mdx
│   │   └── ai-insights.mdx
│   │
│   ├── api-reference/                     # API documentation
│   │   ├── authentication.mdx
│   │   ├── database-api.mdx
│   │   └── reports-api.mdx
│   │
│   ├── security/                          # Security & compliance
│   │   ├── authentication.mdx
│   │   ├── privacy.mdx
│   │   └── aws-compliance.mdx
│   │
│   ├── adr/                               # Architecture Decision Records
│   │   ├── 001-aws-migration.mdx
│   │   ├── 002-lambda-architecture.mdx
│   │   ├── 003-elevenlabs-sdk-migration.mdx
│   │   └── 004-baseline-component-split.mdx
│   │
│   ├── operations/                        # Operational guides
│   │   ├── playbooks.mdx
│   │   └── monitoring.mdx
│   │
│   ├── marketing-sites/                   # Marketing site docs
│   │   ├── index.mdx
│   │   ├── architecture.mdx
│   │   ├── deployment.mdx
│   │   └── cms-enhancement.mdx
│   │
│   ├── historical/                        # Archive (rarely accessed)
│   │   └── [old implementation docs]
│   │
│   └── contributing/                      # Contribution guidelines
│       ├── how-to-add-documentation.mdx
│       └── documentation-workflow.mdx
│
└── future-development/                    # Future features
    ├── README.md
    └── 2026-01-clinical-tier-partnership.md
```

---

### Files to DELETE:

**Root-level duplicates (keep organized versions in subdirectories):**
- `pages/api-documentation.mdx` ✓ (keep in api-reference/)
- `pages/medical-grade-security.mdx` ✓ (keep in security/)
- `pages/phase2-advanced-security.mdx` ✓ (keep in security/)
- `pages/phase3-final-security.mdx` ✓ (keep in security/)
- `pages/coding-standards.mdx` ✓ (keep in operations/)
- `pages/playbooks.mdx` ✓ (keep in operations/)
- `pages/authentication-aws.mdx` ✓ (keep in security/)
- `pages/privacy.mdx` ✓ (keep in security/)
- `pages/cms-technical.mdx` ✓ (keep in admin/)
- `pages/cms-user-guide.mdx` ✓ (keep in admin/)
- `pages/database.mdx` ✓ (keep in architecture/)
- `pages/architecture.mdx` ✓ (keep in architecture/)
- `pages/mobile.mdx` ✓ (keep in architecture/)
- `pages/backend.mdx` ✓ (keep in architecture/)
- `pages/deployment.mdx` ✓ (keep in development/)
- `pages/testing-qa.mdx` ✓ (keep in development/)
- `pages/development-guide.mdx` ✓ (consolidate into development/)
- `pages/admin-ui.mdx` ✓ (move to admin/)
- `pages/api.mdx` ✓ (consolidate into api-reference/)
- `pages/adr.mdx` ✓ (just an index, remove)
- `pages/methodology.mdx` ✓ (move to assessment/)
- `pages/aurora-serverless-v2.mdx` ✓ (move to architecture/)
- `pages/aws-migration-compliance.mdx` ✓ (move to security/)
- `pages/documentation-workflow.mdx` ✓ (keep in contributing/)
- `pages/how-to-add-documentation.mdx` ✓ (keep in contributing/)
- `pages/testing-panel-guide.mdx` ✓ (move to development/)

**Empty directories:**
- `pages/architecture-infrastructure/`
- `pages/cms-admin/`
- `pages/core-platform/`
- `pages/getting-started/`
- `pages/security-compliance/`
- `pages/reference/`

**Outdated/historical content to ARCHIVE:**
- `pages/mobile-development/` → move to `pages/historical/mobile-development/`
- `pages/assessment-engine/` → DELETE (now in future-development if needed)

**Backup files:**
- `pages/_meta.json.backup`

---

## Part 2: mind-measure-core Cleanup

### Issues Identified:

1. **Mobile app artifacts (shouldn't be in Core):**
   - `ios/` - 153 MB
   - `android/` - 69 MB
   - `apps/` - 66 MB

2. **Assessment engine (1.9 GB, separate project):**
   - `assessment-engine/`

3. **Build artifacts that should be gitignored:**
   - `Admin Dashboards/` - 11 MB (old admin folder?)
   - `BACKUP_20250909_114508/` - 2.3 MB
   - `aws/lambda/.serverless/` - deployment packages
   - Large PDFs in `public/`

4. **Missing .gitignore entries**

---

### Actions:

#### 1. Update `.gitignore`:

```gitignore
# Build artifacts
.vercel
node_modules/
dist/
build/
.vite/
*.tsbuildinfo

# Environment files
.env
.env.local
.env.production
.env.development
.env.test
.env.vercel
.env.vercel.local
.env.production.local

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Mobile app artifacts (shouldn't be in Core)
ios/
android/
apps/

# Assessment engine (separate project)
assessment-engine/

# AWS deployment artifacts
aws/lambda/.serverless/
aws/**/*.zip

# Large static assets
*.pdf
public/**/*.pdf

# Old backups
BACKUP_*/
Admin Dashboards/

# Archive/build artifacts
*.xcarchive/
archive.plist

# Test coverage
coverage/
.nyc_output/
```

#### 2. Remove from git:

```bash
cd "/Users/keithduddy/Desktop/Mind Measure local/mind-measure-core"

# Remove mobile artifacts
git rm -r ios/
git rm -r android/
git rm -r apps/

# Remove assessment engine
git rm -r assessment-engine/

# Remove old admin folder
git rm -r "Admin Dashboards/"

# Remove backups
git rm -r BACKUP_*/

# Remove large PDFs
git rm public/*.pdf
git rm public/**/*.pdf 2>/dev/null || true

# Remove AWS deployment artifacts
git rm -r aws/lambda/.serverless/ 2>/dev/null || true

# Commit cleanup
git commit -m "Clean up repository: remove mobile artifacts, assessment engine, and large binaries"
```

#### 3. Clean git history (OPTIONAL - Advanced):

Use BFG Repo-Cleaner or `git filter-repo` to remove large files from history:
- Would reduce repo size significantly
- Requires force-push (coordinate with team)
- Can break existing clones

---

## Execution Order:

### Phase 1: Docs Cleanup (Safe, no history rewrite)
1. Create new organized structure
2. Move files to correct locations
3. Delete duplicates
4. Update `_meta.json` files
5. Test navigation
6. Commit

### Phase 2: Core .gitignore Update (Safe)
1. Update `.gitignore`
2. Commit

### Phase 3: Core File Removal (Removes from HEAD, safe)
1. Remove mobile/assessment artifacts
2. Commit
3. Push

### Phase 4: History Cleanup (OPTIONAL, requires coordination)
1. Backup repository
2. Use BFG or git-filter-repo
3. Force push
4. Team re-clones

---

## Estimated Impact:

### Docs:
- **Before:** 52 top-level files/dirs (many duplicates)
- **After:** ~10 organized directories, clear hierarchy
- **Size:** Minimal change (~275 KB)
- **Benefit:** Much easier to navigate and maintain

### Core:
- **Before:** 297 MB archive, 4,637 files
- **After:** ~8-15 MB archive, ~500-800 files
- **Size Reduction:** 95%+ for exports
- **Benefit:** Faster clones, cleaner codebase, faster CI/CD

---

## Next Steps:

1. **Review this plan** - Confirm we're not deleting anything critical
2. **Execute Docs cleanup** - Reorganize documentation
3. **Execute Core cleanup** - Remove bloat from repository
4. **Update export command** - Document clean export process
5. **Document in CHANGELOG** - Record what was cleaned up

---

## Rollback Plan:

All changes are in git, so rollback is simple:
```bash
git reset --hard HEAD~1  # Undo last commit
git push origin main --force  # If already pushed
```

For history cleanup (Phase 4), keep backup:
```bash
git clone --mirror <repo-url> backup-$(date +%Y%m%d)
```
