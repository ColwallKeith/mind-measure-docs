# Task List for Composer - Documentation Cleanup

**Date**: November 28, 2025  
**Objective**: Update all Mind Measure documentation to reflect AWS architecture, remove Supabase references, reorganize menu  
**Location**: `/Users/keithduddy/Desktop/Mind Measure local/mind-measure-docs/pages/`  
**Estimated Time**: 30-60 minutes with Composer

---

## ✅ Pre-Work Completed (by Sonnet 4.5)

- ✅ Created `development-guide.mdx` (comprehensive deployment guide)
- ✅ Renamed `development.mdx` → `coding-standards.mdx`
- ✅ Assessment Engine deployed to AWS
- ✅ Audit completed - all issues identified

---

## 🎯 COMPOSER PROMPT (Copy & Paste This)

```
I need to systematically update all Mind Measure documentation in:
/Users/keithduddy/Desktop/Mind Measure local/mind-measure-docs/pages/

CONTEXT:
- Platform migrated from Supabase to AWS (completed Nov 2025)
- Assessment Engine deployed Nov 28, 2025
- Database: Aurora Serverless v2 (mindmeasure-aurora.cluster-cz8c8wq4k3ak.eu-west-2.rds.amazonaws.com)
- Auth: AWS Cognito (eu-west-2_ClAG4fQXR)
- Assessment Engine API: https://ej3hig3gwl.execute-api.eu-west-2.amazonaws.com/v1/

TASKS:

1. BATCH FIND & REPLACE across all .mdx files:
   - "Supabase Auth" → "AWS Cognito"
   - "Supabase PostgreSQL" → "AWS Aurora Serverless v2"
   - "Supabase Storage" → "AWS S3"
   - "Supabase Edge Functions" → "AWS Lambda"
   - Remove all Supabase import statements
   - Update environment variables (SUPABASE_* → AWS_*/DB_*)

2. UPDATE THESE FILES WITH MAJOR CHANGES:

   a) coding-standards.mdx
      - Remove Supabase prerequisite (line 35)
      - Replace Edge Function section (lines 161-196) with Lambda examples
      - Update integrations list (line 299) to AWS services

   b) cms-technical.mdx
      - CHECK: Is CMS still used? If not, mark as DEPRECATED
      - If used: Complete rewrite of backend section
      - Replace all Supabase code examples with Aurora/Cognito
      - Update env vars (lines 590-596)
      - Remove Supabase CLI commands (lines 780-786)

   c) database.mdx
      - Remove ALL RLS content (Row Level Security is Supabase-specific)
      - Add Aurora Serverless v2 patterns
      - Document both schemas: 'public' and 'assessment_engine'
      - Show connection from Vercel API and Lambda

   d) architecture.mdx
      - Add Assessment Engine to system diagram
      - Update all architecture diagrams
      - Document current stack (Aurora, Cognito, Lambda, S3)
      - Remove Supabase references

   e) deployment.mdx
      - Add mobile app deployment (Vercel)
      - Add Assessment Engine deployment (CDK)
      - Add database migration steps
      - Remove Supabase deployment

   f) mobile.mdx
      - Update Technology Stack section
      - Add Assessment Engine integration
      - Show Vercel API connection pattern
      - Update authentication flow (Cognito)

   g) api-documentation.mdx
      - Document Vercel API endpoints (/api/database/*)
      - Document Assessment Engine API
      - Show Cognito JWT authentication
      - Add request/response examples

   h) backend.mdx
      - Review and update (or merge into architecture if redundant)

   i) playbooks.mdx
      - Remove Supabase CLI commands (line 91)
      - Add AWS CLI equivalents

3. ADD COMPLETION BANNERS to:
   - adr/001-aws-migration.mdx
   - adr/002-lambda-architecture.mdx  
   - aws-migration-compliance.mdx

   Banner text:
   > Migration Status: COMPLETED - November 2025
   > This document describes the migration from Supabase to AWS.
   > The migration is complete and the platform now runs entirely on AWS.

4. REORGANIZE _meta.json into logical sections:

{
  "index": "Overview",
  "architecture": "System Architecture",
  "methodology": "Assessment Methodology",
  "mobile": "Mobile App",
  "backend": "Backend Services",
  "database": "Database",
  "api-documentation": "API Reference",
  "authentication-aws": "AWS Authentication",
  "aurora-serverless-v2": "Aurora Serverless v2",
  "aws-migration-compliance": "AWS Migration",
  "admin-ui": "Admin Dashboard",
  "cms-user-guide": "CMS User Guide",
  "cms-technical": "CMS Technical",
  "medical-grade-security": "Security Overview",
  "phase2-advanced-security": "Advanced Security",
  "phase3-final-security": "Final Security Phase",
  "privacy": "Privacy & Legal",
  "development-guide": "Development Guide",
  "deployment": "Deployment",
  "coding-standards": "Coding Standards",
  "testing-panel-guide": "Testing Guide",
  "playbooks": "Playbooks",
  "adr": "Architecture Decisions",
  "documentation-workflow": "Documentation Workflow"
}

5. TEST & DEPLOY:
   npm run build
   npx vercel --prod

REFERENCE MATERIALS:
- Assessment Engine details: /Users/keithduddy/Desktop/Mind Measure local/mind-measure-core/assessment-engine/
- Current architecture: See DEPLOYMENT_SUMMARY.md
- Development guide: See development-guide.mdx (just created)

WORK SYSTEMATICALLY:
- Show me list of changes before applying
- Ask about cms-technical.mdx (keep or deprecate?)
- Update one file at a time
- Deploy after all changes complete
```

---

## Key Decisions Needed

Before Composer starts, decide:

1. **CMS Technical Documentation** (`cms-technical.mdx`)
   - Option A: Keep and completely rewrite for AWS
   - Option B: Mark as DEPRECATED if CMS not actively used
   - **Which do you prefer?**

2. **Backend.mdx**
   - Option A: Keep as separate doc
   - Option B: Merge into architecture.mdx
   - **Which do you prefer?**

3. **Security Phases** (3 separate docs)
   - Option A: Keep as 3 separate phase documents
   - Option B: Consolidate into one "Security Implementation" doc
   - **Which do you prefer?**

---

## ✅ Ready for Composer

**Files**: `COMPOSER_TASK_LIST.md` created with complete prompt

**Next Steps**:
1. Answer the 3 decisions above (or tell Composer to decide)
2. Switch to Composer agent in Cursor
3. Paste the prompt from this file
4. Let it work through systematically
5. Review changes, approve, deploy

**Estimated Time**: 30-60 minutes total

---

**Ready to switch to Composer?** 🚀


