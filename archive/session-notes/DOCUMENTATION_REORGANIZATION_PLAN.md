# Documentation Reorganization Plan

## Current Menu Order (What We'll Work Through)

1. Overview ✓ (Keep - landing page)
2. Architecture - UPDATE
3. Mobile App - UPDATE
4. Backend - UPDATE (or merge into Architecture?)
5. Database & RLS - UPDATE (remove RLS, Aurora patterns)
6. Assessment Methodology ✓ (Keep - non-technical)
7. AWS Authentication Guide - REVIEW
8. AWS Migration & Compliance - ADD BANNER "Completed Nov 2025"
9. Deployment - UPDATE heavily
10. Privacy & Legal ✓ (Keep - review for data storage mentions)
11. Development Guide ✓ (Just created - accurate)
12. Coding Standards - UPDATE (in progress)
13. ADRs - ADD BANNERS
14. Playbooks - UPDATE (remove Supabase commands)
15. Admin UI - REVIEW
16. API Documentation - UPDATE
17. CMS User Guide ✓ (Keep if still relevant)
18. CMS Technical Documentation - MAJOR UPDATE or REMOVE?
19. Aurora Serverless v2 - REVIEW
20. Testing Panel Guide - REVIEW
21. Medical-Grade Security - REVIEW
22. Phase 2: Advanced Security - REVIEW
23. Phase 3: Final Security - REVIEW
24. Documentation Workflow ✓ (Keep - process doc)

---

## Proposed New Structure (Organized by Section)

```json
{
  "index": "Overview",
  
  "_platform": {
    "type": "separator",
    "title": "Platform Architecture"
  },
  "architecture": "System Architecture",
  "methodology": "Assessment Methodology",
  
  "_mobile": {
    "type": "separator", 
    "title": "Mobile Application"
  },
  "mobile": "Mobile App Guide",
  "assessment-engine": "Assessment Engine",
  
  "_backend": {
    "type": "separator",
    "title": "Backend & Infrastructure"
  },
  "backend": "Backend Services",
  "database": "Database (Aurora)",
  "api-documentation": "API Reference",
  
  "_aws": {
    "type": "separator",
    "title": "AWS Services"
  },
  "authentication-aws": "Authentication (Cognito)",
  "aurora-serverless-v2": "Aurora Serverless v2",
  "aws-migration-compliance": "AWS Migration (Completed)",
  
  "_admin": {
    "type": "separator",
    "title": "Admin & CMS"
  },
  "admin-ui": "Admin Dashboard",
  "cms-user-guide": "CMS User Guide",
  "cms-technical": "CMS Technical Docs",
  
  "_security": {
    "type": "separator",
    "title": "Security & Compliance"
  },
  "medical-grade-security": "Medical-Grade Security",
  "phase2-advanced-security": "Phase 2: Advanced Security",
  "phase3-final-security": "Phase 3: Final Security",
  "privacy": "Privacy & Legal",
  
  "_development": {
    "type": "separator",
    "title": "Development"
  },
  "development-guide": "Development Guide",
  "deployment": "Deployment",
  "coding-standards": "Coding Standards",
  "testing-panel-guide": "Testing Guide",
  "playbooks": "Playbooks",
  
  "_reference": {
    "type": "separator",
    "title": "Reference"
  },
  "adr": "Architecture Decisions",
  "documentation-workflow": "Documentation Guide"
}
```

---

## Files to REMOVE or MERGE

### Candidates for Removal:
1. **CMS Technical Documentation** - If CMS is being deprecated or this is completely outdated
2. **Database & RLS** - "RLS" is Supabase-specific, rename to just "Database"

### Merge Opportunities:
1. **Backend** → Could merge into **Architecture** if it's small
2. **AWS Authentication** + **Aurora** → Could be subsections of "AWS Services"
3. **Phase 2/3 Security** → Could consolidate into one "Advanced Security" doc

---

## Work Plan

### Phase 1: Review & Decide (First Pass)
Work through each file in current menu order and:
- ✓ Keep as-is
- ↻ Update in place
- → Merge into another doc
- ✗ Mark for deletion

### Phase 2: Update Content
Update each file systematically

### Phase 3: Reorganize Menu
Implement new grouped structure

---

## Decision Points for You

1. **CMS Documentation** - Is the CMS still actively used? Keep or remove?
2. **Backend.mdx** - Keep separate or merge into Architecture?
3. **Security Phases** - Keep as 3 separate docs or consolidate?
4. **Assessment Engine** - Should it have its own top-level entry?

Let me know your preferences and we'll proceed!


