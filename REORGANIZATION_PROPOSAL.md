# Documentation Reorganization Proposal

**Date**: December 16, 2024  
**Status**: Proposed - Awaiting Approval

---

## Problems with Current Structure

### 1. Security Scattered
- Authentication in `architecture-infrastructure/`
- Security phases in `security-compliance/`
- Privacy in `security-compliance/`
- AWS security in `security-compliance/`
- **Result**: Hard to find all security docs

### 2. Historical Docs Mixed with Current
- AWS migration docs (completed months ago)
- Legacy Supabase docs (no longer relevant)
- Postmortems (historical records)
- Implementation complete docs (outdated)
- **Result**: Confusing what's current vs historical

### 3. Unclear Naming
- "architecture-infrastructure" - too technical
- "core-platform" - too vague
- "getting-started" - mixes different concerns
- **Result**: Not intuitive for new users

### 4. Poor Grouping
- Mobile Development separate from Mobile App docs
- Deployment split across multiple sections
- API docs isolated from backend docs

---

## Proposed New Structure

### User-Centric Organization

```
docs.mindmeasure.co.uk/
├── 🏠 Overview
│
├── 🚀 Quick Start                    # NEW - Essential for new users
│   ├── Getting Started
│   ├── Development Setup
│   ├── Your First Deployment
│   └── Common Workflows
│
├── 🏗️ Platform Architecture          # RENAMED - Clearer
│   ├── System Overview
│   ├── Domain Structure
│   ├── Database (Aurora)
│   ├── Backend Services
│   └── Infrastructure
│
├── 📱 Mobile Application              # CONSOLIDATED
│   ├── Overview
│   ├── Development Guide
│   ├── Deployment
│   ├── Testing
│   ├── Safeguards
│   └── Rollback Procedures
│
├── 🎨 Marketing Sites                 # EXISTING - Keep
│   ├── Overview
│   ├── Architecture
│   ├── Contact Forms
│   ├── CMS Management
│   ├── Figma Workflow
│   └── Deployment
│
├── 🧠 Assessment System               # RENAMED - Clearer
│   ├── Overview
│   ├── Baseline Assessment
│   ├── Check-in Assessment
│   ├── Scoring Algorithm
│   ├── Audio Analysis
│   ├── Text Analysis
│   └── Visual Features
│
├── 💻 Admin Dashboard                 # NEW - Consolidated
│   ├── Overview
│   ├── User Interface
│   ├── AI Insights
│   ├── CMS Administration
│   ├── User Guide
│   └── Technical Documentation
│
├── 🔐 Security & Privacy              # CONSOLIDATED - All security here
│   ├── Overview
│   ├── Authentication (AWS Cognito)
│   ├── Medical-Grade Security
│   ├── HIPAA Compliance
│   ├── Data Encryption
│   ├── Privacy Policy
│   └── Security Phases (1, 2, 3)
│
├── 📡 API Reference                   # EXPANDED
│   ├── Overview
│   ├── Mobile API
│   ├── Admin API
│   ├── Assessment API
│   └── Authentication
│
├── 🔧 Operations                      # EXPANDED
│   ├── Deployment Procedures
│   ├── Monitoring
│   ├── Troubleshooting
│   ├── Playbooks
│   └── Incident Response
│
├── 📋 Architecture Decisions          # EXISTING - Keep
│   ├── ADR-001: AWS Migration
│   ├── ADR-002: Lambda Architecture
│   ├── ADR-003: ElevenLabs SDK
│   └── ADR-004: Baseline Component Split
│
├── 📚 Historical Records              # NEW - Archive old docs
│   ├── AWS Migration (2024)
│   │   ├── Migration Guide
│   │   ├── Compliance
│   │   └── ADR-001
│   ├── Supabase → Aurora Migration
│   │   └── Legacy CMS Documentation
│   ├── Mobile App Rebuild
│   │   ├── Postmortem (Dec 8, 2025)
│   │   └── Implementation Complete
│   └── Methodology Evolution
│
└── 🤝 Contributing                    # EXISTING - Keep
    ├── Documentation Workflow
    └── How to Add Documentation
```

---

## Detailed Changes

### Create: Quick Start
**Purpose**: New users need clear entry point

**Contents**:
- Getting started guide (from current getting-started/)
- Development setup
- First deployment walkthrough
- Common workflows

### Rename: Platform Architecture
**From**: architecture-infrastructure  
**To**: Platform Architecture  
**Why**: Clearer, less jargon

**Contents**:
- System overview
- Domain structure (admin, mobile, marketing, docs)
- Database architecture
- Backend services
- Infrastructure details

### Consolidate: Mobile Application
**Combine**:
- core-platform/mobile.mdx
- mobile-development/* (5 files)

**Result**: All mobile docs in one place

### Consolidate: Admin Dashboard
**Combine**:
- core-platform/admin-ui.mdx
- core-platform/ai-insights.mdx
- cms-admin/* (3 files)

**Result**: All admin docs in one place

### Consolidate: Security & Privacy
**Combine**:
- architecture-infrastructure/authentication-aws.mdx
- security-compliance/* (5 files)

**Result**: All security docs in ONE section

**Organization**:
```
security/
├── overview.mdx                 # Security overview
├── authentication.mdx           # AWS Cognito (moved from architecture)
├── medical-grade-security.mdx   # Core security practices
├── hipaa-compliance.mdx         # HIPAA requirements
├── data-encryption.mdx          # Encryption at rest/transit
├── privacy.mdx                  # Privacy policy
└── security-phases.mdx          # Phases 1, 2, 3 consolidated
```

### Create: Historical Records
**Purpose**: Archive completed migrations and old docs

**Contents**:
- AWS Migration (completed 2024)
  - aws-migration-compliance.mdx
  - ADR-001 (cross-reference)
- Supabase Migration (completed)
  - cms-technical-legacy-supabase.mdx
- Mobile App Rebuild
  - postmortem-2025-12-08.mdx
  - implementation-complete.mdx
- Old methodology docs

### Expand: Operations
**Current**: 1 file (playbooks.mdx)  
**Proposed**: Comprehensive operations section

**Add**:
- Deployment procedures
- Monitoring guides
- Troubleshooting
- Incident response

### Expand: API Reference
**Current**: 1 file (api-documentation.mdx)  
**Proposed**: Complete API documentation

**Add**:
- Mobile API endpoints
- Admin API endpoints
- Assessment API
- Authentication flows

---

## File Moves Required

### Security Consolidation (6 moves)
```bash
# Move authentication to security
mv architecture-infrastructure/authentication-aws.mdx security/authentication.mdx

# Rename and consolidate security phases
mv security-compliance/medical-grade-security.mdx security/medical-grade-security.mdx
mv security-compliance/privacy.mdx security/privacy.mdx
mv security-compliance/aws-migration-compliance.mdx historical/aws-migration/compliance.mdx

# Consolidate security phases into one doc
# Create security/security-phases.mdx combining:
# - phase2-advanced-security.mdx
# - phase3-final-security.mdx
```

### Historical Archive (5 moves)
```bash
# Create historical folder
mkdir -p historical/aws-migration
mkdir -p historical/supabase-migration
mkdir -p historical/mobile-rebuild

# Move historical docs
mv security-compliance/aws-migration-compliance.mdx historical/aws-migration/
mv cms-admin/cms-technical-legacy-supabase.mdx historical/supabase-migration/
mv mobile-development/postmortem-2025-12-08.mdx historical/mobile-rebuild/
mv mobile-development/implementation-complete.mdx historical/mobile-rebuild/
```

### Mobile Consolidation (5 moves)
```bash
# Consolidate mobile docs
mv core-platform/mobile.mdx mobile/overview.mdx
mv mobile-development/development-safeguards.mdx mobile/
mv mobile-development/rollback-checklist.mdx mobile/
mv mobile-development/testing-setup.mdx mobile/
# Keep development-guide in mobile/
```

### Admin Consolidation (5 moves)
```bash
# Consolidate admin docs
mv core-platform/admin-ui.mdx admin/overview.mdx
mv core-platform/ai-insights.mdx admin/
mv cms-admin/cms-user-guide.mdx admin/
mv cms-admin/cms-technical.mdx admin/
```

### Architecture Rename (1 folder)
```bash
# Rename for clarity
mv architecture-infrastructure/ architecture/
```

---

## New Navigation (_meta.json)

```json
{
  "index": "🏠 Overview",
  "quick-start": "🚀 Quick Start",
  "architecture": "🏗️ Platform Architecture",
  "mobile": "📱 Mobile Application",
  "admin": "💻 Admin Dashboard",
  "marketing-sites": "🎨 Marketing Sites",
  "assessment": "🧠 Assessment System",
  "security": "🔐 Security & Privacy",
  "api": "📡 API Reference",
  "operations": "🔧 Operations",
  "adr": "📋 Architecture Decisions",
  "historical": "📚 Historical Records",
  "contributing": "🤝 Contributing"
}
```

---

## Benefits

### For New Users
- ✅ Clear "Quick Start" entry point
- ✅ Intuitive section names
- ✅ No confusion with historical docs

### For Developers
- ✅ All security docs in one place
- ✅ Mobile docs consolidated
- ✅ Admin docs consolidated
- ✅ API docs expanded and clear

### For Maintenance
- ✅ Historical docs archived (not deleted)
- ✅ Easier to update (logical grouping)
- ✅ Clear what's current vs legacy

### For Navigation
- ✅ Shorter sidebar (fewer top-level items)
- ✅ More logical grouping
- ✅ Better user flow

---

## Before vs After

### Before (Current - After First Cleanup)
```
13 top-level sections
- Getting Started (mixed content)
- Architecture (too technical name)
- Core Platform (vague)
- Assessment Engine ✓
- Mobile Development (separate from mobile)
- Marketing Sites ✓
- CMS Administration (should be in admin)
- Security & Compliance (missing auth)
- API Reference (incomplete)
- Architecture Decisions ✓
- Operations (1 file only)
- Contributing ✓
```

### After (Proposed)
```
13 top-level sections (same number, better organized)
- Overview ✓
- Quick Start (NEW - essential)
- Platform Architecture (clearer)
- Mobile Application (consolidated)
- Admin Dashboard (consolidated)
- Marketing Sites ✓
- Assessment System (clearer)
- Security & Privacy (COMPLETE - includes auth)
- API Reference (expanded)
- Operations (expanded)
- Architecture Decisions ✓
- Historical Records (NEW - archive)
- Contributing ✓
```

---

## Implementation Plan

### Phase 1: Create New Folders (Low Risk)
1. Create `quick-start/`
2. Create `historical/` with subfolders
3. Create `security/`
4. Create `mobile/`
5. Create `admin/`
6. Rename `architecture-infrastructure/` → `architecture/`
7. Rename `assessment-engine/` → `assessment/`

### Phase 2: Move Files (Medium Risk)
1. Move security files to `security/`
2. Move historical files to `historical/`
3. Move mobile files to `mobile/`
4. Move admin files to `admin/`
5. Create new overview files

### Phase 3: Update Navigation (Low Risk)
1. Update `pages/_meta.json`
2. Update folder `_meta.json` files
3. Create new section index pages

### Phase 4: Consolidate (Medium Risk)
1. Merge security phases into one doc
2. Create Quick Start guide
3. Expand API Reference
4. Expand Operations

### Phase 5: Test & Deploy (Critical)
1. Test all links locally
2. Fix broken internal links
3. Verify navigation works
4. Deploy to production
5. Monitor for issues

---

## Risk Assessment

**Low Risk**:
- All files preserved (moved, not deleted)
- Git allows easy rollback
- Can test locally first
- Historical docs archived (not lost)

**Medium Risk**:
- Internal links might break (need updating)
- Bookmarks will change
- Search engines need time to recrawl

**Mitigation**:
- Create redirects for old URLs
- Update all internal links
- Test thoroughly before deploying
- Keep backup branch

---

## Estimated Time

- **Phase 1**: 30 minutes (create folders)
- **Phase 2**: 1 hour (move files)
- **Phase 3**: 30 minutes (update navigation)
- **Phase 4**: 2 hours (consolidate content)
- **Phase 5**: 1 hour (test and deploy)

**Total**: ~5 hours of work

---

## Recommendation

**Execute this reorganization** because:
1. Current structure is confusing
2. Security scattered across sections
3. Historical docs mixed with current
4. Poor user experience
5. Hard to maintain

**Best approach**:
1. Review and approve this plan
2. Execute in phases over 1-2 days
3. Test thoroughly at each phase
4. Deploy when confident

---

**Status**: Awaiting Approval  
**Next Step**: Get user approval to proceed





