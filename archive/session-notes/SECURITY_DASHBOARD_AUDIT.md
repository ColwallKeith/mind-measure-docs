# Security Dashboard Audit - Real vs Fake Data

**Date:** 2026-01-14  
**Issue:** Security tab shows dummy data instead of real metrics, creating false sense of security

## Current State Analysis

### What's FAKE (Hardcoded):
1. **Vulnerability counts** - Line 112: `{ critical: 0, high: 2, medium: 5, low: 12 }` hardcoded fallback
2. **Compliance status** - Line 113: `{ hipaa: 'compliant', gdpr: 'compliant', soc2: 'partial' }` hardcoded
3. **Encryption status** - Line 194: Assumes 'active' if AWS is working (not actually checked)
4. **Overall security score** - Calculated from fake vulnerability counts

### What's ATTEMPTING to be Real (but may fail silently):
1. **Audit logs count** - Queries `audit_logs` table (exists in migrations)
2. **Security incidents** - Queries `security_incidents` table (exists in migrations)
3. **MFA enrollment** - Queries `profiles.mfa_enabled` field
4. **Recent events** - Queries audit logs

### Critical Problems:

#### 1. Silent Fallback to Fake Data
- If database query fails, it shows hardcoded "compliant" status
- User sees green checkmarks when system might be insecure
- No warning that data is fake

#### 2. Tables May Not Exist in Production
- `audit_logs` table exists in migrations but may not be in Aurora
- `security_incidents` table exists in migrations but may not be in Aurora
- `profiles.mfa_enabled` column may not exist

#### 3. Services Are Disabled
```typescript
const vulnerabilityService = null; // createVulnerabilityService...
const complianceService = null; // createComplianceAutomationService...
const incidentService = null; // createIncidentResponseService...
```
These services exist but are commented out - why?

#### 4. No Real Security Scanning
- "Last Security Scan" just shows when last incident was created
- No actual vulnerability scanning happening
- No compliance checks running

## What SHOULD Be Happening

### Real Metrics to Implement:

#### 1. Audit Logs (Partially Real)
- ✅ Query `audit_logs` table
- ❌ Table may not exist in production
- ❌ No audit log generation happening
- **Fix:** Ensure table exists, implement audit logging across all sensitive operations

#### 2. MFA Enrollment (Partially Real)
- ✅ Query `profiles.mfa_enabled`
- ❌ Column may not exist
- ❌ No MFA actually implemented in Cognito
- **Fix:** Add MFA to Cognito, add column to profiles, track enrollment

#### 3. Vulnerabilities (100% Fake)
- ❌ Hardcoded counts
- ❌ No actual vulnerability scanning
- **Fix:** 
  - Implement real dependency scanning (npm audit, Snyk)
  - Store results in `security_incidents` table
  - Auto-scan on deployment

#### 4. Compliance Status (100% Fake)
- ❌ Hardcoded to "compliant"
- ❌ No actual compliance checks
- **Fix:**
  - HIPAA: Check encryption at rest, audit logs, access controls, BAA signed
  - GDPR: Check data residency, consent tracking, right to erasure
  - SOC 2: Check access logs, change management, incident response

#### 5. Encryption Status (Fake)
- ❌ Assumes "active" with no verification
- **Fix:** 
  - Check Aurora encryption status via AWS API
  - Check S3 bucket encryption
  - Check Cognito MFA enrollment

## Immediate Actions Required

### Phase 1: Stop Lying (Today)
1. Add prominent warning banner: "⚠️ Security metrics are placeholder data"
2. Show only metrics we can VERIFY are real:
   - Audit logs count (if table exists)
   - MFA enrollment (if column exists)
3. Mark everything else as "Not Configured" instead of showing fake good scores

### Phase 2: Verify Database Schema (Today)
1. Run diagnostic query to check which tables/columns actually exist:
   - `audit_logs` table
   - `security_incidents` table
   - `profiles.mfa_enabled` column
2. Run migrations if tables missing
3. Update SecurityDashboard to only query existing tables

### Phase 3: Implement Real Metrics (This Week)
1. **Audit Logging**
   - Instrument all auth events (login, logout, MFA, password changes)
   - Instrument all data access (user queries, reports generated, exports)
   - Store in `audit_logs` table
   
2. **MFA Status**
   - Add `mfa_enabled` to profiles table
   - Sync with Cognito MFA status
   - Show real enrollment percentage

3. **Vulnerability Scanning**
   - Run `npm audit` in CI/CD pipeline
   - Store results in `security_incidents` table
   - Show real critical/high/medium/low counts
   - Auto-create GitHub issues for critical vulns

4. **Encryption Verification**
   - Query AWS RDS API for Aurora encryption status
   - Query S3 API for bucket encryption
   - Show real status, not assumption

### Phase 4: Real Compliance Checks (Next Sprint)
1. **HIPAA Compliance Check**
   - Verify BAA signed with AWS (manual check, document date)
   - Check encryption at rest (Aurora, S3) - API query
   - Check audit logs enabled and retained - database query
   - Check access controls configured - Cognito/IAM query
   - Status: Pass all = "Compliant", Some fail = "Partial", Many fail = "Non-Compliant"

2. **GDPR Compliance Check**
   - Verify data residency (eu-west-2) - hardcoded check
   - Check consent tracking implemented - database schema check
   - Check data export functionality exists - code check
   - Check data deletion functionality exists - code check

3. **SOC 2 Compliance** (Requires Professional Audit)
   - This cannot be self-assessed
   - Either: Show "Not Audited" or remove claim
   - Or: Pay for real SOC 2 Type II audit

## Files to Update

1. **SecurityDashboard.tsx**
   - Add warning banner for fake data
   - Remove fake fallbacks
   - Only show metrics we can verify
   - Add "Configure Security Monitoring" setup flow

2. **Database Schema**
   - Verify `audit_logs` table exists
   - Verify `security_incidents` table exists
   - Add `profiles.mfa_enabled` if missing

3. **Audit Logger Service**
   - Actually USE the AuditLogger service (lines 87-91)
   - Instrument auth events
   - Instrument data access events

4. **New: Security Scanner Service**
   - Create service to run npm audit
   - Parse results into `security_incidents`
   - Run on deployment via GitHub Actions

## Acceptance Criteria

Before claiming security dashboard is "functioning":

- [ ] No hardcoded fallback data shown to users
- [ ] Clear distinction between real metrics and placeholders
- [ ] All displayed metrics query actual database tables that exist
- [ ] Audit logging active for all sensitive operations
- [ ] MFA enrollment shows real Cognito status
- [ ] Vulnerability counts from real npm audit results
- [ ] Encryption status from real AWS API queries
- [ ] Compliance status based on verifiable checks, not assumptions
- [ ] Warning if any metric cannot be verified

## Priority

**CRITICAL** - This is a security issue, not just a UI bug. Showing fake compliance status could:
- Give false confidence to stakeholders
- Violate trust with university partners
- Create legal liability if breach occurs and we claimed "compliant"
- Block real security improvements because metrics look good

---

**Next Step:** Run Phase 1 immediately - add warning banner and remove fake data.
