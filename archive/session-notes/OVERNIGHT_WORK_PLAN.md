# Overnight Work Plan - Complete Batch Fix

**Goal:** Wake up to a fully tested, deployable batch with all fixes

---

## 1. Investigate Why Current Fix Didn't Work

**Check:**
- [ ] Verify `api/database/select.ts` actually has `import type` in deployed code
- [ ] Check if there are OTHER files importing it that still have wrong imports
- [ ] Look for any other `@vercel/node` imports across ALL api files
- [ ] Check if there's a caching issue with Vercel
- [ ] Review build logs for any import errors

**Action:** Run comprehensive scan and fix ALL import issues

---

## 2. Prepare Complete BATCH 1 (All Fixes in One Commit)

### A. Fix ALL @vercel/node Imports
- [ ] Run `./scripts/fix-vercel-imports.sh` on both repos
- [ ] Manually verify every api/ file
- [ ] Check shared lib files (_lib/)
- [ ] Verify no dynamic imports of these types

### B. Fix Security Dashboard
- [ ] Remove all hardcoded fallback data
- [ ] Replace fake "compliant" with "not_configured"
- [ ] Add development warning banner
- [ ] Make it clear what's real vs planned
- [ ] Remove unused security service imports

### C. Database Documentation
- [ ] Add security tables to DATABASE_REFERENCE.md
- [ ] Document which tables exist vs planned
- [ ] Add audit_logs structure
- [ ] Add security_incidents structure

### D. Remove Unused Dependencies (Bloat Reduction)
- [ ] Run `npx depcheck` on both repos
- [ ] List all unused dependencies
- [ ] Remove safe ones (not peer deps)
- [ ] Document which were removed

### E. Code Cleanup
- [ ] Remove commented-out code in SecurityDashboard
- [ ] Remove unused imports
- [ ] Remove duplicate code
- [ ] Clean up console.logs

---

## 3. Audit Entire Admin Dashboard for Fake Data

**Check each component:**
- [ ] SecurityDashboard.tsx - ✅ Already identified
- [ ] Analytics/Reports dashboard
- [ ] User metrics/growth charts
- [ ] Cost tracking dashboard
- [ ] System health metrics
- [ ] University metrics
- [ ] Any charts/graphs showing data

**Create:** `FAKE_DATA_AUDIT.md` listing:
- Component name
- What data is fake
- What data is real
- Priority to fix (Critical/High/Medium/Low)
- Estimated effort

---

## 4. Create Starter Implementation for Phase 1 (Audit Trail)

**DO NOT DEPLOY - Just prepare code:**

### A. Database Migration
- [ ] Create `20260115000001_audit_trail_phase1.sql`
- [ ] Create audit_logs table with proper indexes
- [ ] Add comments explaining each field
- [ ] Include rollback script

### B. Audit Logger API
- [ ] Create `api/security/audit-log.ts`
- [ ] Implement POST endpoint
- [ ] Add authentication
- [ ] Add rate limiting
- [ ] Add tests (if time)

### C. Audit Logger Client
- [ ] Create `src/services/AuditLogger.ts`
- [ ] Simple client to call API
- [ ] Batch logging support
- [ ] Error handling

### D. Instrument 3 Critical Endpoints
- [ ] `api/reports/generate.ts` - Log report generation
- [ ] `api/database/select.ts` - Log data access
- [ ] Login flow - Log auth events

**Mark as:** READY TO REVIEW (don't commit yet)

---

## 5. Investigate Build Bloat

### A. Bundle Analysis
- [ ] Run `npm run build` and capture output
- [ ] List all chunks >100KB
- [ ] Identify largest dependencies
- [ ] Check for duplicates

### B. Dependency Audit
- [ ] Run `npx depcheck` (unused deps)
- [ ] Run `npm ls` to see dependency tree
- [ ] Check for duplicate versions of same package
- [ ] List all dependencies >1MB

### C. Code Splitting Opportunities
- [ ] Identify routes that could be lazy loaded
- [ ] Find components only used in specific routes
- [ ] Check if chart libraries are tree-shakeable
- [ ] Look for dynamic imports opportunities

### D. Create Optimization Plan
**Document:**
- Current bundle size breakdown
- Top 10 largest dependencies
- Unused dependencies (safe to remove)
- Code splitting recommendations
- Expected savings from each change

**Create:** `BUILD_OPTIMIZATION_PLAN.md`

---

## 6. Scan for Other Systemic Issues

### A. Database Field Name Issues
- [ ] Search codebase for all database queries
- [ ] Check against DATABASE_REFERENCE.md
- [ ] List any mismatches
- [ ] Create fixes

### B. Environment Variable Issues
- [ ] List all `process.env` usages
- [ ] Check if all are documented
- [ ] Verify no hardcoded fallbacks
- [ ] Check for missing vars

### C. Error Handling Issues
- [ ] Find API endpoints with no try/catch
- [ ] Find silent failures (catch without log)
- [ ] Find user-facing errors with technical messages
- [ ] Create list to fix

### D. Security Issues
- [ ] Find any remaining hardcoded credentials
- [ ] Check for exposed API keys
- [ ] Look for SQL injection risks
- [ ] Check for XSS vulnerabilities

**Create:** `SYSTEMIC_ISSUES_AUDIT.md`

---

## 7. Documentation Updates

### A. Update DATABASE_REFERENCE.md
- [ ] Add all security tables
- [ ] Add universities table details (already done)
- [ ] Add common query patterns
- [ ] Add troubleshooting section

### B. Create DEPLOYMENT_CHECKLIST.md
- [ ] Pre-deployment steps
- [ ] Build verification
- [ ] Test steps
- [ ] Post-deployment verification
- [ ] Rollback procedure

### C. Update README.md
- [ ] Add security monitoring section
- [ ] Document notification channels
- [ ] Add troubleshooting section
- [ ] Update quick start guide

---

## 8. Testing Preparation

### A. Create Test Plan
- [ ] List all critical flows to test
- [ ] Create test data scenarios
- [ ] Document expected outcomes
- [ ] Create rollback criteria

### B. Manual Test Scripts
- [ ] Worcester login test
- [ ] Help page national resources test
- [ ] Security dashboard load test
- [ ] Report generation test

### C. Automated Tests (if time)
- [ ] Pre-deploy check improvements
- [ ] API endpoint smoke tests
- [ ] Database migration tests

---

## 9. Git Organization

### A. Clean Up Branches
- [ ] Check for old branches
- [ ] Document what needs to be merged
- [ ] Check for uncommitted work

### B. Prepare BATCH 1 Commit
- [ ] Stage all fixes
- [ ] Write comprehensive commit message
- [ ] Create detailed description
- [ ] List all files changed and why

**DO NOT PUSH YET - Wait for approval**

---

## 10. Create Morning Briefing Document

**Create:** `MORNING_BRIEFING.md` with:

### What Was Done
- Complete list of all fixes applied
- All audits completed
- All documentation created
- All code prepared

### What's Ready to Deploy
- BATCH 1 changes (with commit ready)
- Estimated deploy time
- Test plan
- Rollback plan

### What Was Discovered
- Root cause of Worcester login issue
- All fake data locations
- Build bloat analysis
- Other systemic issues

### Recommended Next Steps
1. Review BATCH 1 changes
2. Approve deployment
3. Test after deployment
4. Then proceed with Phase 1 (audit trail)

### Questions for You
- List any decisions needed
- List any unclear requirements
- List any risks identified

---

## Success Criteria

Wake up to:
- ✅ Complete understanding of why Worcester login failed
- ✅ All fixes prepared and tested locally
- ✅ Comprehensive audit of all fake data
- ✅ Build optimization plan
- ✅ Phase 1 implementation ready for review
- ✅ Clear morning briefing with recommendations
- ✅ ONE commit ready to deploy (pending approval)

**Estimated Time:** 6-8 hours of work
**Risk:** None - no deployments, no database changes, just preparation

---

**Starting work now...**
