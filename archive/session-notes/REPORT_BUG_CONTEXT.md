# Report Generation Bug - Context for Code Review

## Problem Summary

**What's broken:** Report generation endpoint returns 500 error on OPTIONS preflight request, preventing CORS from working.

**Error in mobile app console:**
```
Preflight response is not successful. Status code: 500
Fetch API cannot load https://admin.mindmeasure.co.uk/api/reports/generate due to access control checks.
```

**When it broke:** After implementing security hardening (JWT authentication, CORS restrictions, removing hardcoded passwords)

**What worked before:** This morning (UK time) the endpoint was working but had 3 bugs:
1. Wrong report period (always 14 days even when 30 requested)
2. PHQ-2/GAD-2 scores showing as 0
3. Transcript snippets missing

## Architecture

### Mobile App → Core API
- **Mobile:** `mind-measure-mobile-final` deployed to `mobile.mindmeasure.app`
- **Core:** `mind-measure-core` deployed to `admin.mindmeasure.co.uk`
- **Flow:** Mobile app calls `https://admin.mindmeasure.co.uk/api/reports/generate` (POST)

### Key Files

**Core Repo (`mind-measure-core`):**
- `api/reports/generate.ts` - Main endpoint (currently simplified to debug)
- `api/reports/_shared.ts` - Report data generation logic (imports AWS SDK, pg)
- `api/_lib/auth-middleware.ts` - Cognito JWT verification
- `api/_lib/cors-config.ts` - CORS configuration
- `api/_lib/db-config.ts` - Database connection config

**Mobile Repo (`mind-measure-mobile-final`):**
- `src/components/mobile/MobileProfile.tsx` - Calls report API with JWT token

## What We've Tried

1. ✅ **Moved AWS SDK client initialization from module level to function level** (BedrockClient, SESClient)
2. ✅ **Temporarily disabled authentication** on generate.ts
3. ✅ **Simplified CORS** back to wildcard (`Access-Control-Allow-Origin: *`)
4. ✅ **Removed all imports** from generate.ts (current state) to isolate the crash

## Current State

The `generate.ts` endpoint is now completely minimal (no AWS SDK, no pg, no auth) - just handles OPTIONS and returns a test response. This should help identify if:
- The crash is in generate.ts itself, OR
- The crash is in Vercel's serverless function initialization

## Environment Variables (Vercel - mind-measure-core project)

Required for report generation:
- `DB_PASSWORD` ✅ Set (rotated today after removing hardcoded passwords)
- `DB_HOST` ✅ Set
- `DB_NAME` ✅ Set
- `DB_USERNAME` ✅ Set
- `AWS_ACCESS_KEY_ID` ✅ Set
- `AWS_SECRET_ACCESS_KEY` ✅ Set
- `AWS_REGION` ✅ Set (eu-west-2)

## Timeline

- **This morning:** Report generation working but with 3 data bugs
- **~12 hours ago:** Implemented security hardening (remove hardcoded passwords, add JWT auth, restrict CORS)
- **~8 hours ago:** Report endpoint started returning 500 on OPTIONS preflight
- **~6 hours ago:** Tried moving AWS SDK initialization, disabling auth, simplifying CORS - all failed
- **Now:** Simplified endpoint to absolute minimum to isolate crash

## Question for Code Review

**Why does a Vercel serverless function return 500 on OPTIONS preflight, even when the handler explicitly handles OPTIONS and returns 200?**

The function crashes **before** the handler runs, suggesting something at module initialization level is failing.

## Deployment Info

- **Framework:** Vite + React (frontend), Vercel Serverless Functions (API)
- **Database:** Aurora PostgreSQL (RDS, eu-west-2)
- **Auth:** AWS Cognito
- **Email:** AWS SES
- **AI:** AWS Bedrock (Claude 3 Haiku)

## Repos

- **Core:** https://github.com/ColwallKeith/mind-measure-core
- **Mobile:** https://github.com/ColwallKeith/mind-measure-mobile-final

## Next Steps

1. Deploy the minimal `generate.ts` and test if OPTIONS still returns 500
2. If minimal version works, add functionality back piece by piece to find the breaking import
3. If minimal version still fails, investigate Vercel project configuration or environment
