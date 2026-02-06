# Mind Measure Security Requirements - Healthcare Data Protection

**Context:** Mental health platform handling sensitive patient data (PHQ/GAD scores, conversation transcripts, wellbeing trends)

**Regulatory Requirements:** HIPAA (US), GDPR (EU), NHS Data Security Standards (UK)

---

## What We Actually Need to Monitor

### 1. **Data Access Audit Trail** (HIPAA Critical)

**Why:** Must track every access to patient data for HIPAA compliance and breach investigation

**Metrics:**
- Who accessed which patient's data?
- When and from where (IP/location)?
- What did they do (view, export, modify)?
- Any unusual access patterns?

**Alerts:**
- ⚠️ Admin accessing patient data outside working hours
- 🚨 Bulk data export (>100 records)
- 🚨 Same patient accessed by multiple users in short time
- 🚨 Deleted/modified audit log entries (tampering attempt)

**Data Sources:**
- `audit_logs` table tracking all data access
- API request logs (who called which endpoints)
- Database query logs (for direct DB access)

**Dashboard View:**
```
┌─────────────────────────────────────────────┐
│ Data Access in Last 24 Hours               │
├─────────────────────────────────────────────┤
│ Total Accesses:        324                  │
│ Unique Patients:       87                   │
│ Unique Staff:          12                   │
│ Reports Generated:     45                   │
│ Data Exports:          2    [View Details]  │
│                                             │
│ 🚨 1 Alert: Off-hours access by admin      │
│    keith@mindmeasure.co.uk at 2:34 AM      │
│    Accessed 23 patient records              │
│    [Investigate] [Mark Reviewed]            │
└─────────────────────────────────────────────┘
```

---

### 2. **Authentication Security** (Breach Prevention)

**Why:** Compromised admin accounts = full patient data breach

**Metrics:**
- Failed login attempts (brute force detection)
- Successful logins from new locations/devices
- Password changes and resets
- MFA enrollment rate
- Session hijacking indicators

**Alerts:**
- 🚨 5+ failed logins for same account in 10 minutes
- ⚠️ Login from new country (especially high-risk countries)
- ⚠️ Login from TOR/VPN exit node
- 🚨 Admin account without MFA (should be 0)
- ⚠️ Password not changed in 90+ days (for admin accounts)

**Data Sources:**
- Cognito auth events (via CloudWatch)
- `audit_logs` for auth events
- IP geolocation service

**Dashboard View:**
```
┌─────────────────────────────────────────────┐
│ Authentication Health                       │
├─────────────────────────────────────────────┤
│ Active Admin Accounts:     8                │
│ MFA Enrolled:              6 (75%)          │
│ 🚨 2 admins without MFA                     │
│                                             │
│ Last 24 Hours:                              │
│ - Successful Logins:       45               │
│ - Failed Logins:           12               │
│ - New Device Logins:       3  [Review]      │
│                                             │
│ 🚨 Critical: Brute force detected           │
│    IP: 192.168.1.100 (23 failed attempts)   │
│    [Block IP] [Notify User]                 │
└─────────────────────────────────────────────┘
```

---

### 3. **Data Breach Detection** (NHS DSP Toolkit Critical)

**Why:** Must detect and report breaches within 72 hours (GDPR requirement)

**Metrics:**
- Unauthorized data exports
- API responses containing patient data to unauthorized IPs
- Database dumps or backups accessed
- S3 bucket permission changes
- Unusual data transfer volumes

**Alerts:**
- 🚨 Report generated for user other than themselves (privacy violation)
- 🚨 Database backup downloaded
- 🚨 S3 bucket made public
- 🚨 API endpoint returning >1000 records in single request
- 🚨 Data export outside EU region (GDPR violation)

**Data Sources:**
- S3 CloudTrail logs
- API Gateway request logs
- Database audit logs
- Network traffic monitoring

**Dashboard View:**
```
┌─────────────────────────────────────────────┐
│ Data Protection Status                      │
├─────────────────────────────────────────────┤
│ Potential Breaches (Last 7 Days): 0 ✅      │
│ Data Exports Reviewed:             2 ✅      │
│ Unreviewed Exports:                0        │
│                                             │
│ Encryption Status:                          │
│ ✅ Aurora: AES-256 (verified)               │
│ ✅ S3 Buckets: AES-256 (all 3)              │
│ ✅ Backups: Encrypted                       │
│                                             │
│ GDPR Compliance:                            │
│ ✅ Data in EU region (eu-west-2)            │
│ ✅ Data retention policy active             │
│ ⚠️  Right to erasure - 2 pending requests   │
└─────────────────────────────────────────────┘
```

---

### 4. **Vulnerability Management** (Proactive Security)

**Why:** Prevent breaches before they happen

**Metrics:**
- Critical/High CVEs in dependencies
- Outdated packages with known vulnerabilities
- Time since last security scan
- Patch deployment time (detection → fix → deployed)

**Alerts:**
- 🚨 Critical CVE detected (CVSS 9.0+)
- 🚨 Critical CVE >24 hours old (not patched)
- ⚠️ High severity CVE detected
- ⚠️ Dependencies >6 months old

**Data Sources:**
- npm audit (daily GitHub Action)
- Snyk or Dependabot
- AWS Inspector (infrastructure scanning)

**Dashboard View:**
```
┌─────────────────────────────────────────────┐
│ Vulnerability Status                        │
├─────────────────────────────────────────────┤
│ Last Scan: 6 hours ago                      │
│                                             │
│ Open Vulnerabilities:                       │
│ 🚨 Critical: 0                              │
│ ⚠️  High:     2  [View Details]             │
│    Medium:   5                              │
│    Low:      12                             │
│                                             │
│ ⚠️ 2 High Severity Issues:                  │
│                                             │
│ 1. jsonwebtoken@8.5.1 (CVE-2022-23529)      │
│    Severity: HIGH (7.6)                     │
│    Detected: 3 days ago                     │
│    Fix: Upgrade to 9.0.0                    │
│    [Create Fix PR] [Snooze]                 │
│                                             │
│ 2. axios@0.21.1 (CVE-2021-3749)             │
│    Severity: HIGH (7.5)                     │
│    Detected: 1 day ago                      │
│    Fix: Upgrade to 0.21.2                   │
│    [Auto-Fix] [View Details]                │
└─────────────────────────────────────────────┘
```

---

### 5. **Compliance Dashboard** (Audit Readiness)

**Why:** NHS/university contracts require regular compliance reports

**Metrics:**
- Audit log retention (must keep 6 years for NHS)
- Data subject requests status (GDPR 30-day deadline)
- Consent tracking
- BAA/DPA status with vendors
- Training completion (staff HIPAA training)

**Alerts:**
- 🚨 Audit logs approaching retention limit (storage full)
- 🚨 GDPR data request >25 days old (5 days to deadline)
- ⚠️ Staff member without security training
- ⚠️ Vendor DPA expires in 30 days

**Dashboard View:**
```
┌─────────────────────────────────────────────┐
│ Compliance Status                           │
├─────────────────────────────────────────────┤
│ HIPAA Compliance:          ✅ COMPLIANT      │
│ ├─ Encryption at rest:     ✅               │
│ ├─ Audit logs active:      ✅               │
│ ├─ Access controls:        ✅               │
│ ├─ BAA with AWS:           ✅ (expires 2027)│
│ └─ Staff training:         ⚠️  75% complete │
│                                             │
│ GDPR Compliance:           ⚠️  PARTIAL       │
│ ├─ EU data residency:      ✅               │
│ ├─ Consent tracking:       ✅               │
│ ├─ Right to access:        ✅               │
│ ├─ Right to erasure:       ⚠️  2 pending    │
│ └─ DPO assigned:           ❌ Not assigned  │
│                                             │
│ NHS DSP Toolkit:           ⚠️  IN PROGRESS  │
│ └─ Checklist: 23/36 items complete          │
│    [Continue Assessment]                    │
└─────────────────────────────────────────────┘
```

---

## Alert Priority System

### 🚨 CRITICAL (Immediate Action Required)
- Potential data breach detected
- Critical vulnerability (CVSS 9.0+) not patched >24h
- Audit log tampering
- Bulk data export by unauthorized user
- Brute force attack in progress

**Action:** SMS + Email + WhatsApp to on-call admin

### ⚠️ HIGH (Review Within 4 Hours)
- Failed login attempts approaching threshold
- High severity vulnerability detected
- Off-hours admin data access
- MFA not enrolled for admin account
- GDPR request approaching deadline

**Action:** Email + WhatsApp notification

### ℹ️ MEDIUM (Review Within 24 Hours)
- New device login
- Password change requested
- Medium severity vulnerability
- Unusual access pattern

**Action:** Email notification, dashboard badge

### ✅ LOW (Informational)
- Regular audit log events
- Low severity vulnerabilities
- Routine data access

**Action:** Dashboard display only

---

## Technical Implementation

### Phase 1: Core Audit Trail (Week 1)
```
Priority: 🚨 CRITICAL
Effort: 3 days

✅ Create audit_logs table
✅ Instrument all patient data access
✅ Create audit log viewer
✅ Set up retention policy
```

### Phase 2: Authentication Monitoring (Week 1-2)
```
Priority: 🚨 CRITICAL
Effort: 4 days

✅ Capture Cognito events via CloudWatch
✅ Failed login detection
✅ MFA enrollment tracking
✅ Session monitoring
```

### Phase 3: Automated Vulnerability Scanning (Week 2)
```
Priority: ⚠️ HIGH
Effort: 2 days

✅ GitHub Actions npm audit daily
✅ Store results in security_incidents
✅ Auto-create fix PRs for critical CVEs
✅ Slack notifications
```

### Phase 4: Data Breach Detection (Week 3)
```
Priority: 🚨 CRITICAL
Effort: 5 days

✅ S3 CloudTrail monitoring
✅ API Gateway logging
✅ Unusual export detection
✅ Geographic anomaly detection
```

### Phase 5: Compliance Automation (Week 4)
```
Priority: ⚠️ HIGH
Effort: 3 days

✅ Encryption status verification
✅ GDPR request tracking
✅ Automated compliance checks
✅ Generate audit reports
```

---

## Notification Channels

### SMS (Critical Only)
- Twilio integration
- On-call rotation (PagerDuty style)
- Cost: ~$0.01/message

### WhatsApp (Critical + High)
- Twilio WhatsApp Business API
- Rich formatting with action buttons
- Thread for investigation notes
- Cost: ~$0.005/message

### Email
- AWS SES
- Security team mailing list
- Individual alerts for assigned issues

### Dashboard
- Real-time WebSocket updates
- Alert badge in header
- Sound/visual notification

---

## Database Schema (Simplified)

```sql
-- Core audit trail
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    user_id UUID,
    user_email TEXT,
    action TEXT NOT NULL, -- 'view_patient', 'export_report', 'login', etc.
    resource_type TEXT, -- 'patient', 'report', 'user'
    resource_id TEXT,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    INDEX idx_timestamp (timestamp DESC),
    INDEX idx_user (user_id, timestamp DESC),
    INDEX idx_action (action, timestamp DESC)
);

-- Security incidents (CVEs, breaches, etc.)
CREATE TABLE security_incidents (
    id UUID PRIMARY KEY,
    severity TEXT CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    status TEXT CHECK (status IN ('open', 'investigating', 'resolved')),
    title TEXT NOT NULL,
    description TEXT,
    source TEXT, -- 'npm_audit', 'manual', 'automated_scan'
    cve_id TEXT,
    detected_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    assigned_to UUID,
    INDEX idx_severity_status (severity, status)
);

-- Alert tracking
CREATE TABLE security_alerts (
    id UUID PRIMARY KEY,
    incident_id UUID REFERENCES security_incidents(id),
    priority TEXT CHECK (priority IN ('critical', 'high', 'medium', 'low')),
    message TEXT,
    notified_via TEXT[], -- ['sms', 'email', 'whatsapp']
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by UUID,
    created_at TIMESTAMPTZ
);
```

---

## Success Metrics

**Security:**
- Zero undetected data breaches
- <24h to patch critical CVEs
- 100% audit log coverage for patient data
- 100% admin MFA enrollment

**Compliance:**
- Pass HIPAA audit
- Pass NHS DSP Toolkit assessment
- GDPR requests handled within 30 days
- 6-year audit log retention

**Operations:**
- <5 false positive alerts per week
- <1 hour average alert response time
- 95% alert acknowledgment rate

---

**Next Steps:**
1. Review and approve this requirements doc
2. Delete current fake SecurityDashboard.tsx
3. Build new dashboard based on these requirements
4. Implement Phase 1 (audit trail) first
5. Add phases incrementally with testing

This is what we ACTUALLY need, not generic enterprise security theater.
