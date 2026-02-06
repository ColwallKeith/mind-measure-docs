# Security Monitoring Implementation Plan

**Goal:** Replace all fake security dashboard data with real, functional security monitoring

## Database Schema Verification & Setup

### Step 1: Create Diagnostic Script
**File:** `scripts/verify-security-schema.sh`

```bash
#!/bin/bash
# Verify which security tables/columns exist in production database

echo "🔍 Verifying Security Database Schema"
echo "======================================"

# Check for audit_logs table
# Check for security_incidents table  
# Check for profiles.mfa_enabled column
# Check for encryption status tracking
# Output report of what exists vs what's missing
```

### Step 2: Create Missing Tables Migration
**File:** `supabase/migrations/20260114000002_security_monitoring_tables.sql`

```sql
-- Audit Logs (may already exist, but ensure correct schema)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    email TEXT,
    event_type TEXT NOT NULL, -- 'auth.login', 'auth.logout', 'data.access', 'admin.action', etc.
    event_action TEXT NOT NULL, -- 'login_success', 'login_failed', 'mfa_enabled', 'report_generated', etc.
    ip_address INET,
    user_agent TEXT,
    resource_type TEXT, -- 'user', 'report', 'university', etc.
    resource_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Security Incidents (vulnerability tracking)
CREATE TABLE IF NOT EXISTS security_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
    source TEXT, -- 'npm_audit', 'manual', 'aws_inspector', etc.
    affected_component TEXT,
    cve_id TEXT, -- If from npm audit
    remediation TEXT,
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    assigned_to TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_security_incidents_severity ON security_incidents(severity);
CREATE INDEX idx_security_incidents_status ON security_incidents(status);
CREATE INDEX idx_security_incidents_created_at ON security_incidents(created_at DESC);

-- Add MFA tracking to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS mfa_enrolled_at TIMESTAMPTZ;

-- Security scan history
CREATE TABLE IF NOT EXISTS security_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scan_type TEXT NOT NULL, -- 'dependency', 'infrastructure', 'compliance'
    status TEXT NOT NULL, -- 'running', 'completed', 'failed'
    findings_summary JSONB, -- { critical: 0, high: 2, medium: 5, low: 12 }
    scan_duration_ms INTEGER,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX idx_security_scans_scan_type ON security_scans(scan_type);
CREATE INDEX idx_security_scans_started_at ON security_scans(started_at DESC);
```

## Implementation Phases

### Phase 1: Audit Logging Infrastructure (Week 1)

#### 1.1 Audit Logger API Endpoint
**File:** `api/security/audit-log.ts`

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from 'pg';
import { getSecureDbConfig } from '../_lib/db-config';
import { requireAuth } from '../_lib/auth-middleware';

interface AuditLogEntry {
  user_id?: string;
  email?: string;
  event_type: string;
  event_action: string;
  ip_address?: string;
  user_agent?: string;
  resource_type?: string;
  resource_id?: string;
  metadata?: any;
}

export default requireAuth(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const entry: AuditLogEntry = req.body;
  
  // Extract IP and user agent from request
  const ip_address = entry.ip_address || req.headers['x-forwarded-for'] || req.socket?.remoteAddress;
  const user_agent = entry.user_agent || req.headers['user-agent'];
  
  const client = new Client(getSecureDbConfig());
  
  try {
    await client.connect();
    
    await client.query(`
      INSERT INTO audit_logs (
        user_id, email, event_type, event_action, 
        ip_address, user_agent, resource_type, resource_id, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      entry.user_id,
      entry.email,
      entry.event_type,
      entry.event_action,
      ip_address,
      user_agent,
      entry.resource_type,
      entry.resource_id,
      JSON.stringify(entry.metadata || {})
    ]);
    
    return res.status(201).json({ success: true });
    
  } catch (error: any) {
    console.error('Audit log error:', error);
    return res.status(500).json({ error: error.message });
  } finally {
    await client.end();
  }
});
```

#### 1.2 Instrument Auth Events
**Files to update:**
- `api/auth/login.ts` - Log successful/failed logins
- `api/auth/logout.ts` - Log logouts
- `api/auth/mfa-enable.ts` - Log MFA enrollment

**Pattern:**
```typescript
await fetch('/api/security/audit-log', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: userId,
    email: userEmail,
    event_type: 'auth.login',
    event_action: 'login_success',
    metadata: { method: 'cognito' }
  })
});
```

#### 1.3 Instrument Data Access
**Files to update:**
- `api/reports/generate.ts` - Log report generation
- `api/database/select.ts` - Log sensitive table queries
- `api/assessments/history.ts` - Log user data access

### Phase 2: Real-Time Security Metrics (Week 1)

#### 2.1 Security Metrics API
**File:** `api/security/metrics.ts`

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Client } from 'pg';
import { getSecureDbConfig } from '../_lib/db-config';
import { requireAuth } from '../_lib/auth-middleware';
import { requireRole } from '../_lib/role-middleware';

export default requireAuth(requireRole(['superuser'], async (req: VercelRequest, res: VercelResponse) => {
  const client = new Client(getSecureDbConfig());
  
  try {
    await client.connect();
    
    // Query REAL metrics from database
    
    // 1. Audit logs count (last 30 days)
    const auditResult = await client.query(`
      SELECT COUNT(*) as total,
             COUNT(*) FILTER (WHERE event_type = 'auth.login') as logins,
             COUNT(*) FILTER (WHERE event_type = 'data.access') as data_access
      FROM audit_logs
      WHERE created_at > NOW() - INTERVAL '30 days'
    `);
    
    // 2. Security incidents (open)
    const incidentsResult = await client.query(`
      SELECT 
        COUNT(*) FILTER (WHERE severity = 'critical' AND status = 'open') as critical,
        COUNT(*) FILTER (WHERE severity = 'high' AND status = 'open') as high,
        COUNT(*) FILTER (WHERE severity = 'medium' AND status = 'open') as medium,
        COUNT(*) FILTER (WHERE severity = 'low' AND status = 'open') as low
      FROM security_incidents
    `);
    
    // 3. MFA enrollment
    const mfaResult = await client.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE mfa_enabled = true) as mfa_enabled_users
      FROM profiles
    `);
    
    // 4. Last security scan
    const scanResult = await client.query(`
      SELECT started_at, scan_type, findings_summary
      FROM security_scans
      ORDER BY started_at DESC
      LIMIT 1
    `);
    
    // 5. Check Aurora encryption (via environment flag or AWS API call)
    const encryptionStatus = process.env.AURORA_ENCRYPTION_ENABLED === 'true' ? 'active' : 'unknown';
    
    // Calculate overall security score
    const incidents = incidentsResult.rows[0];
    const vulnPenalty = (incidents.critical * 10) + (incidents.high * 5) + (incidents.medium * 2) + (incidents.low * 1);
    const mfaPercentage = Math.round((mfaResult.rows[0].mfa_enabled_users / mfaResult.rows[0].total_users) * 100);
    const mfaBonus = mfaPercentage > 80 ? 5 : 0;
    const overallScore = Math.max(60, Math.min(100, 100 - vulnPenalty + mfaBonus));
    
    return res.status(200).json({
      success: true,
      metrics: {
        overallScore,
        mfaEnabled: mfaPercentage,
        encryptionStatus,
        auditLogsCount: parseInt(auditResult.rows[0].total),
        vulnerabilities: incidents,
        lastSecurityScan: scanResult.rows[0]?.started_at || 'Never',
        complianceStatus: {
          hipaa: calculateHipaaCompliance(encryptionStatus, auditResult.rows[0].total, incidents),
          gdpr: calculateGdprCompliance(),
          soc2: 'not_audited' // Be honest
        }
      },
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Security metrics error:', error);
    return res.status(500).json({ error: error.message });
  } finally {
    await client.end();
  }
}));

function calculateHipaaCompliance(encryption: string, auditLogs: number, vulns: any): string {
  // Real HIPAA compliance check
  const checks = {
    encryption: encryption === 'active',
    auditLogs: auditLogs > 0,
    noCriticalVulns: vulns.critical === 0,
    noHighVulns: vulns.high === 0
  };
  
  const passedChecks = Object.values(checks).filter(Boolean).length;
  
  if (passedChecks === 4) return 'compliant';
  if (passedChecks >= 2) return 'partial';
  return 'non-compliant';
}

function calculateGdprCompliance(): string {
  // Check: Data in EU region (eu-west-2)
  const euRegion = process.env.AWS_REGION === 'eu-west-2';
  
  // TODO: Check consent tracking exists
  // TODO: Check data export functionality exists
  // TODO: Check data deletion functionality exists
  
  return euRegion ? 'partial' : 'non-compliant';
}
```

#### 2.2 Update SecurityDashboard to use real API
**File:** `src/components/SecurityDashboard.tsx`

Replace lines 79-127 with:
```typescript
const loadSecurityMetrics = async () => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await fetch('/api/security/metrics', {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to load metrics: ${response.statusText}`);
    }
    
    const data = await response.json();
    setMetrics(data.metrics);
    
  } catch (err: any) {
    console.error('Error loading security metrics:', err);
    setError(err.message);
    
    // NO FAKE FALLBACK - show error instead
    
  } finally {
    setLoading(false);
  }
};
```

### Phase 3: Automated Vulnerability Scanning (Week 2)

#### 3.1 GitHub Actions Workflow
**File:** `.github/workflows/security-scan.yml`

```yaml
name: Security Scan

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM
  workflow_dispatch:

jobs:
  npm-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Run npm audit
        id: audit
        run: |
          npm audit --json > audit-results.json || true
          
      - name: Parse and store results
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          node scripts/process-npm-audit.js audit-results.json
```

#### 3.2 Audit Results Processor
**File:** `scripts/process-npm-audit.js`

```javascript
const { Client } = require('pg');
const fs = require('fs');

async function processAuditResults(resultsFile) {
  const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  
  await client.connect();
  
  try {
    // Record scan
    const scanResult = await client.query(`
      INSERT INTO security_scans (scan_type, status, findings_summary, completed_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id
    `, [
      'dependency',
      'completed',
      JSON.stringify({
        critical: results.metadata.vulnerabilities.critical || 0,
        high: results.metadata.vulnerabilities.high || 0,
        medium: results.metadata.vulnerabilities.moderate || 0,
        low: results.metadata.vulnerabilities.low || 0
      })
    ]);
    
    // Create incidents for critical/high vulns
    for (const [name, vuln] of Object.entries(results.vulnerabilities)) {
      if (vuln.severity === 'critical' || vuln.severity === 'high') {
        await client.query(`
          INSERT INTO security_incidents (
            title, description, severity, status, source, 
            affected_component, cve_id, remediation
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT DO NOTHING
        `, [
          `${vuln.severity.toUpperCase()} vulnerability in ${name}`,
          vuln.overview,
          vuln.severity,
          'open',
          'npm_audit',
          name,
          vuln.cves?.[0],
          vuln.recommendation
        ]);
      }
    }
    
    console.log('✅ Audit results processed');
    
  } finally {
    await client.end();
  }
}

processAuditResults(process.argv[2]);
```

### Phase 4: MFA Implementation (Week 2)

#### 4.1 Enable MFA in Cognito
**Manual Steps:**
1. AWS Console → Cognito → User Pool → MFA settings
2. Enable TOTP MFA
3. Make it optional initially (force later)

#### 4.2 MFA Enrollment API
**File:** `api/auth/mfa-enable.ts`

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { CognitoIdentityProviderClient, AssociateSoftwareTokenCommand } from '@aws-sdk/client-cognito-identity-provider';
import { requireAuth } from '../_lib/auth-middleware';

export default requireAuth(async (req: VercelRequest, res: VercelResponse) => {
  // Implementation for MFA enrollment
  // 1. Call Cognito AssociateSoftwareToken
  // 2. Return QR code for Google Authenticator
  // 3. Update profiles.mfa_enabled = true
  // 4. Log audit event
});
```

## Testing Plan

### 1. Database Schema Test
```bash
./scripts/verify-security-schema.sh
# Should show all tables exist with correct columns
```

### 2. Audit Logging Test
```bash
# Login to admin → Check audit_logs table has entry
# Generate report → Check audit_logs table has entry
# Access user data → Check audit_logs table has entry
```

### 3. Security Metrics Test
```bash
curl -H "Authorization: Bearer $TOKEN" \
  https://admin.mindmeasure.co.uk/api/security/metrics
# Should return real data, not hardcoded values
```

### 4. Vulnerability Scan Test
```bash
# Trigger GitHub Action manually
# Check security_incidents table populated
# Check SecurityDashboard shows real counts
```

## Success Criteria

- [ ] All database tables exist in production
- [ ] Audit logging active for all auth and data access events
- [ ] SecurityDashboard queries real database, no hardcoded fallbacks
- [ ] Daily vulnerability scans running automatically
- [ ] Critical/high vulns create incidents automatically
- [ ] MFA enrollment tracked in profiles table
- [ ] Encryption status verified from AWS (not assumed)
- [ ] Compliance checks based on verifiable criteria
- [ ] Dashboard shows "Loading..." or "Error" instead of fake data when query fails
- [ ] All security services (AuditLogger, etc.) actually being used

## Deployment Strategy

**Week 1:**
- Deploy schema migration
- Deploy audit logging API
- Instrument 5 most critical endpoints
- Deploy real metrics API
- Update SecurityDashboard to use real API

**Week 2:**  
- Add GitHub Actions vulnerability scanning
- Implement MFA enrollment
- Instrument remaining endpoints
- Add encryption status verification

**Week 3:**
- Polish and bug fixes
- Documentation
- Enable for production use

## Files to Create/Update

### New Files:
- `scripts/verify-security-schema.sh`
- `scripts/process-npm-audit.js`
- `supabase/migrations/20260114000002_security_monitoring_tables.sql`
- `api/security/audit-log.ts`
- `api/security/metrics.ts`
- `api/auth/mfa-enable.ts`
- `.github/workflows/security-scan.yml`

### Files to Update:
- `src/components/SecurityDashboard.tsx` - Remove fake data, use real API
- `api/auth/login.ts` - Add audit logging
- `api/reports/generate.ts` - Add audit logging
- All sensitive endpoints - Add audit logging
- `DATABASE_REFERENCE.md` - Add security tables documentation

---

**Estimated Effort:** 2-3 weeks to fully implement real security monitoring
**Priority:** HIGH - Currently showing false security status
