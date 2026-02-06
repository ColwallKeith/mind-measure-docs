# Batch Deployment Fix List - Fix All, Deploy Once

**Current State:** 19.5 minute deployments, bloated codebase, fake data in dashboards
**Goal:** Fix multiple issues in one batch, test locally, deploy ONCE

---

## BATCH 1: Critical Fixes (Deploy Today)

### 1. ✅ Already Fixed (In Current Branch)
- [x] Fixed `api/database/select.ts` - `import type` for @vercel/node
- [x] Added `national_resources` column to universities table
- [x] Fixed HelpPage university lookup (hardcode Worcester)
- [x] Expanded DATABASE_REFERENCE.md
- [x] Created pre-deploy-check.sh script

### 2. Security Dashboard - Remove Fake Data
**Files:** `src/components/SecurityDashboard.tsx`

**Changes:**
```typescript
// Line 112-113: Remove hardcoded fallbacks
// BEFORE:
vulnerabilityService ? loadVulnerabilityStats(vulnerabilityService) : Promise.resolve({ critical: 0, high: 2, medium: 5, low: 12 }),
complianceService ? loadComplianceStats(complianceService) : Promise.resolve({ hipaa: 'compliant', gdpr: 'compliant', soc2: 'partial' }),

// AFTER:
Promise.resolve({ critical: 0, high: 0, medium: 0, low: 0 }), // Real data when services implemented
Promise.resolve({ hipaa: 'not_configured', gdpr: 'not_configured', soc2: 'not_configured' }),
```

**Add warning banner:**
```tsx
<Alert variant="warning" className="mb-4">
  <AlertTriangle className="h-4 w-4" />
  <AlertTitle>Security Monitoring In Development</AlertTitle>
  <AlertDescription>
    Security metrics are currently being configured. Vulnerability scanning and compliance checks will be available in the next release.
  </AlertDescription>
</Alert>
```

### 3. Scan for ALL Incorrect @vercel/node Imports
**Run:** `./scripts/fix-vercel-imports.sh` (if any found)

### 4. Remove Unused Dependencies (Major Bloat Reduction)

**Check bundle size:**
```bash
cd /Users/keithduddy/Desktop/Mind\ Measure\ local/mind-measure-core
npm run build 2>&1 | grep "dist/assets" | grep kB
```

**Common bloat culprits to check:**
- Large chart libraries not being used
- Duplicate AWS SDK packages
- Unused UI component libraries
- Development dependencies in production build

**Action:** List all dependencies, identify unused ones:
```bash
npx depcheck
npx webpack-bundle-analyzer dist/stats.json # if build produces stats
```

### 5. Database Reference - Add Security Tables
**File:** `DATABASE_REFERENCE.md`

Add section documenting:
- `audit_logs` table structure
- `security_incidents` table structure  
- `security_scans` table structure
- Note which tables exist vs planned

### 6. Commit Message Consolidation
**Single commit with ALL changes:**
```
fix: Batch deployment fixes - security dashboard, imports, database docs

- Remove fake security metrics, add "not configured" states
- Fix all @vercel/node imports across codebase
- Add security tables to DATABASE_REFERENCE.md
- Update SecurityDashboard with development warning
- Remove unused dependencies (list them)

Reduces deployment time and fixes Worcester login issue.
```

---

## BATCH 2: Codebase Bloat Analysis (Do Before Next Deployment)

### Investigation Needed

1. **Bundle Analysis**
   ```bash
   npm run build -- --analyze
   # Identify largest chunks
   ```

2. **Dependency Audit**
   ```bash
   npx depcheck # Find unused dependencies
   npm ls --depth=0 # List all top-level deps
   ```

3. **Code Splitting Opportunities**
   - Admin routes vs public routes
   - Security dashboard lazy loaded
   - Chart libraries on-demand

4. **Remove Old/Unused Files**
   ```bash
   # Find files not imported anywhere
   npx unimported
   
   # Find duplicate code
   npx jscpd src/
   ```

### Specific Suspects (Based on build output)

From your build logs, large chunks:
- `dist/assets/index-BnbFRVdf.js` - 1,248 kB (HUGE!)
- `dist/assets/charts-Be6l9TYf.js` - 431 kB
- `dist/assets/react-vendor-BZNu72Oh.js` - 141 kB

**Questions:**
- Is the 1.2MB main bundle loading everything upfront?
- Are charts needed on every page or just analytics?
- Can we split vendor chunks better?

### Quick Wins for Build Speed

1. **Enable Turbopack/SWC** (if using Next.js)
2. **Disable source maps in production** (if enabled)
3. **Use persistent cache**
4. **Parallelize builds** (if multi-package)

---

## BATCH 3: Other Fake Data Areas (Audit & Document)

### Areas to Audit for Dummy Data

1. **Analytics Dashboard**
   - User growth charts
   - Engagement metrics
   - Conversion rates

2. **Cost Tracking**
   - AWS cost breakdowns
   - Usage by service
   - Budget alerts

3. **University Metrics**
   - Student enrollment
   - Assessment completion rates
   - Wellbeing trends

4. **System Health**
   - API response times
   - Error rates
   - Uptime percentage

**Action:** Create `DASHBOARD_AUDIT.md` listing ALL fake data areas

---

## Testing Protocol (Before BATCH 1 Deployment)

### Local Tests

1. **Build succeeds:**
   ```bash
   npm run build
   # Must complete without errors
   ```

2. **Pre-deploy check passes:**
   ```bash
   ./scripts/pre-deploy-check.sh
   # All checks must pass
   ```

3. **Manual verification:**
   - SecurityDashboard shows warning banner
   - No hardcoded "compliant" statuses visible
   - Worcester login works locally (if testable)

### Commit Checklist

- [ ] All fixes applied
- [ ] Build successful locally
- [ ] Pre-deploy script passes
- [ ] Git status clean (all changes committed)
- [ ] Descriptive commit message
- [ ] Push to GitHub

### Deployment Checklist

- [ ] ONE deployment command: `npx vercel --prod --yes`
- [ ] Wait full 19.5 minutes (no interruptions)
- [ ] Verify deployment URL works
- [ ] Alias to production domain
- [ ] Test Worcester login
- [ ] Test security dashboard shows warning
- [ ] Monitor for any errors

---

## Timeline

**Today (After Current Deployment Completes):**
1. Apply BATCH 1 fixes (30 mins)
2. Test locally (15 mins)
3. Commit and deploy ONCE (20 mins + 19.5 min deploy)
4. Total: ~1.5 hours for all fixes

**Tomorrow:**
1. BATCH 2 - Investigate bloat (2 hours)
2. Create optimization plan
3. Don't deploy until all optimizations ready

**This Week:**
1. BATCH 3 - Audit all dashboards
2. Document fake vs real data
3. Prioritize what to implement

---

## Success Metrics

**Immediate (BATCH 1):**
- Worcester login works ✅
- Help page shows national resources ✅
- Security dashboard honest about configuration status ✅
- No more @vercel/node crashes ✅

**Medium Term (BATCH 2):**
- Deployment time reduced to < 10 minutes ✅
- Build size < 500 KB main bundle ✅
- Clear code splitting strategy ✅

**Long Term (BATCH 3):**
- All dashboards show real data or clear "not configured" ✅
- No fake compliance claims ✅
- Automated testing catches fake data ✅

---

**Next Action:** Apply BATCH 1 fixes now, deploy once when current deployment completes.
