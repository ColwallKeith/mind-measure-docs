# Security Dashboard - Expert Rebuild Plan

## Philosophy: Real Security, Not Security Theater

**Core Principle:** Track only what we can measure, alert on what matters, remediate what's broken.

---

## Part 1: Real Security Metrics for Mind Measure

### Category A: Authentication & Access Control
**Why it matters:** Students and staff are authenticating with sensitive mental health data.

**Metrics to track:**
1. **Failed Login Attempts** (last 24h, 7d, 30d)
   - Count, source IPs, targeted accounts
   - Alert threshold: >5 failures from same IP in 10 minutes
   
2. **Active Sessions**
   - Current concurrent sessions
   - Unusual device/location patterns
   - Sessions without recent activity
   
3. **MFA Enrollment Rate**
   - % of users with MFA enabled
   - Target: >80% for admin, >50% for students
   
4. **Privileged Actions**
   - Admin logins, data exports, CMS changes
   - Who, what, when tracking

**Data sources:**
- `audit_logs` table (action, user_id, ip_address, created_at)
- Cognito sign-in logs (via AWS API)
- Active Cognito sessions (via AWS API)

---

### Category B: Data Access Patterns
**Why it matters:** Detect unauthorized access or data exfiltration.

**Metrics to track:**
1. **Wellbeing Report Generations** (last 7d)
   - Who generated, for which student, when
   - Alert: >10 reports by single user in 1 hour (potential bulk export)
   
2. **Profile Access Events**
   - Student accessing another student's data (should be impossible)
   - Admin viewing student profiles (legitimate but logged)
   
3. **API Request Patterns**
   - Failed API calls by endpoint
   - 401/403 errors (unauthorized access attempts)
   - Unusual traffic spikes

**Data sources:**
- `audit_logs` table (action = 'report_generated', 'profile_viewed')
- API gateway logs (CloudWatch or Vercel logs)
- Database query logs

---

### Category C: System Integrity
**Why it matters:** Prevent exploits and maintain platform reliability.

**Metrics to track:**
1. **Dependency Vulnerabilities**
   - Critical/High/Medium npm vulnerabilities
   - Last scan date
   - Auto-scanned on every deployment
   
2. **Database Health**
   - Connection pool status
   - Query error rate
   - Long-running queries (>5 seconds)
   
3. **Failed API Requests**
   - 500 errors by endpoint (potential attacks or bugs)
   - Rate limit triggers
   - CORS violations

**Data sources:**
- `npm audit --json` output (run in CI/CD, store in `security_incidents`)
- Database connection metrics (RDS API)
- Vercel logs or CloudWatch

---

### Category D: Incident Response
**Why it matters:** Measure how quickly we detect and fix security issues.

**Metrics to track:**
1. **Open Security Incidents**
   - By severity (Critical/High/Medium/Low)
   - Age of oldest unresolved incident
   
2. **Mean Time to Detect (MTTD)**
   - How long from incident occurrence to detection
   - Target: <1 hour for critical
   
3. **Mean Time to Respond (MTTR)**
   - How long from detection to remediation
   - Target: <4 hours for critical

**Data sources:**
- `security_incidents` table (id, severity, status, detected_at, resolved_at)

---

### Category E: Compliance Evidence
**Why it matters:** Demonstrate security to universities and regulators.

**Metrics to track:**
1. **Encryption Status**
   - Aurora: Encrypted at rest? (AWS RDS API)
   - S3: Default encryption enabled? (AWS S3 API)
   - TLS: All connections HTTPS? (config check)
   
2. **Backup Status**
   - Last backup timestamp
   - Backup restoration tested? (manual check)
   
3. **Audit Log Retention**
   - Logs older than 90 days archived?
   - Retention policy enforced?
   
4. **Access Control**
   - Role-based access working?
   - Admin accounts reviewed in last 90 days?

**Data sources:**
- AWS RDS DescribeDBInstances API
- AWS S3 GetBucketEncryption API
- `audit_logs` table metadata
- Manual compliance checklist

---

## Part 2: Alert System

### Critical Alerts (Immediate Action, SMS + Email)
1. **Suspected Data Breach**
   - >50 failed login attempts in 5 minutes
   - Bulk data export (>100 reports in 1 hour)
   - Admin account compromised (login from new country)
   
2. **System Compromise**
   - Database credentials exposed in logs
   - Unauthorized admin account created
   - Critical npm vulnerability in production

### High Alerts (Email + Dashboard Badge)
3. **Suspicious Activity**
   - 10+ failed logins from single IP
   - Student accessing another student's data
   - API abuse (rate limit exceeded)
   
4. **Compliance Risk**
   - Backup failed
   - Encryption disabled on S3 bucket
   - Audit logs not generated for 24h

### Medium Alerts (Dashboard Badge Only)
5. **Maintenance Needed**
   - High/Medium npm vulnerability
   - MFA enrollment <50%
   - >100 open Low severity incidents

---

## Part 3: Database Schema

### Table: `audit_logs`
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL, -- 'login', 'report_generated', 'profile_viewed', etc.
  resource_type TEXT, -- 'report', 'profile', 'university'
  resource_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB, -- Flexible additional context
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
```

### Table: `security_incidents`
```sql
CREATE TABLE security_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- 'vulnerability', 'failed_login', 'data_breach_attempt'
  severity TEXT NOT NULL, -- 'critical', 'high', 'medium', 'low'
  status TEXT DEFAULT 'open', -- 'open', 'investigating', 'resolved', 'false_positive'
  title TEXT NOT NULL,
  description TEXT,
  affected_resource TEXT,
  detected_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  assigned_to TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_security_incidents_status ON security_incidents(status);
CREATE INDEX idx_security_incidents_severity ON security_incidents(severity);
CREATE INDEX idx_security_incidents_detected_at ON security_incidents(detected_at DESC);
```

### Table: `security_alerts`
```sql
CREATE TABLE security_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES security_incidents(id),
  alert_level TEXT NOT NULL, -- 'critical', 'high', 'medium'
  channel TEXT NOT NULL, -- 'sms', 'email', 'dashboard'
  recipient TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT NOW(),
  acknowledged_at TIMESTAMP,
  acknowledged_by TEXT
);
```

---

## Part 4: Security Dashboard UI Layout

### Overview Panel (Top)
```
┌─────────────────────────────────────────────────────────────┐
│ Security Health Score: 87/100          🟢 Good              │
│ Last Updated: 2 minutes ago           [Refresh] [Configure] │
└─────────────────────────────────────────────────────────────┘
```

### Real-Time Alerts (If any)
```
┌─────────────────────────────────────────────────────────────┐
│ 🔴 CRITICAL (1)                                              │
│ • 15 failed login attempts from 203.0.113.5 in last 5 min   │
│   [Investigate] [Block IP] [Dismiss]                         │
│                                                              │
│ 🟠 HIGH (2)                                                  │
│ • MFA enrollment below 50% (currently 38%)                   │
│ • 3 high-severity npm vulnerabilities detected               │
└─────────────────────────────────────────────────────────────┘
```

### Key Metrics Grid
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Failed      │ Active      │ MFA         │ Open        │
│ Logins      │ Sessions    │ Enrollment  │ Incidents   │
│             │             │             │             │
│    23       │    12       │    47%      │    3        │
│ last 24h    │ current     │ target 80%  │ 1 critical  │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### Tabs
- **Access Control** - Logins, sessions, MFA status
- **Data Access** - Report generations, profile views, API usage
- **Vulnerabilities** - npm audit results, system issues
- **Incidents** - Open incidents, MTTD/MTTR metrics
- **Compliance** - Encryption status, backup status, audit logs

---

## Part 5: Implementation Priority

### Phase 1: Foundation (Week 1)
- [ ] Create/verify database tables exist
- [ ] Implement audit logging for key actions (login, report generation, data export)
- [ ] Build basic Security Dashboard UI showing real metrics
- [ ] Add prominent warnings for any metric that's not yet real

### Phase 2: Detection (Week 2)
- [ ] Implement failed login tracking
- [ ] Set up npm audit scanning on deployment
- [ ] Create security_incidents from audit results
- [ ] Build alert thresholds

### Phase 3: Response (Week 3)
- [ ] Implement alert notification system (email for now)
- [ ] Build incident management UI
- [ ] Add IP blocking capability
- [ ] Document incident response playbook

### Phase 4: Compliance (Week 4)
- [ ] Implement AWS API checks (encryption status)
- [ ] Build compliance checklist
- [ ] Add backup monitoring
- [ ] Create quarterly security review process

---

## Part 6: What We DON'T Track (and why)

**SOC 2 Compliance:** Requires professional external audit. Don't claim it unless audited.

**Penetration Testing Results:** Need to hire external pentesters. Budget for annual test.

**User Behavior Analytics:** Too complex for current scale. Add when >10k active users.

**Network Intrusion Detection:** Vercel handles infrastructure. Trust their security.

---

## Success Criteria

Before launching this dashboard:
- [ ] Zero fake/hardcoded metrics shown
- [ ] Every displayed number queries real database/API
- [ ] Clear labels: "Real-time", "Last 24h", "Not Configured"
- [ ] At least 5 real metrics working
- [ ] At least 1 alert rule active
- [ ] Incident creation working (manual or automated)
- [ ] Security team can actually USE this dashboard to improve security

---

**Next Step:** Start with Phase 1 - build the foundation tables and basic UI.
