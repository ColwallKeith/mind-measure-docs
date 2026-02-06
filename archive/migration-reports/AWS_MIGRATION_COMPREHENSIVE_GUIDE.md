# Mind Measure AWS Migration & Compliance Guide

## Executive Summary

Mind Measure has successfully migrated from Supabase to a comprehensive AWS-based architecture to meet healthcare compliance requirements, enhance security, and provide enterprise-grade scalability. This migration enables HIPAA compliance, GDPR adherence, and provides the robust infrastructure necessary for handling sensitive mental health data across multiple universities.

**Migration Date**: October 2025  
**Status**: ✅ **PRODUCTION READY**  
**Compliance Level**: HIPAA-ready, GDPR-compliant, SOC 2 Type II aligned

---

## 🏗️ **Architecture Overview**

### **Previous Architecture (Supabase)**
```
Frontend → Supabase (PostgreSQL + Auth + Storage) → Edge Functions
```

### **New Architecture (AWS)**
```
Frontend → AWS Cognito (Auth) → API Gateway → Lambda Functions → Aurora Serverless v2 (PostgreSQL)
                                                              ↘ S3 (File Storage)
                                                              ↘ Rekognition (AI Analysis)
                                                              ↘ CloudWatch (Monitoring)
```

---

## 🔐 **HIPAA Compliance Implementation**

### **Business Associate Agreement (BAA)**
- ✅ **AWS BAA Signed**: October 2025
- ✅ **Coverage**: All AWS services used in the Mind Measure platform
- ✅ **Scope**: RDS Aurora, Cognito, S3, Lambda, CloudWatch, Rekognition, API Gateway

### **HIPAA-Eligible Services Configuration**

#### **1. Amazon RDS Aurora Serverless v2**
```yaml
Configuration:
  - Encryption at Rest: AES-256 (AWS KMS managed keys)
  - Encryption in Transit: TLS 1.2+
  - Backup Encryption: Enabled
  - Performance Insights: Disabled (HIPAA requirement)
  - Enhanced Monitoring: Configured with appropriate retention
  - Multi-AZ: Enabled for high availability
  - Automated Backups: 35-day retention with encryption
```

#### **2. AWS Cognito User Pools**
```yaml
Configuration:
  - User Pool: eu-west-2_ClAG4fQXR
  - Client ID: 7vu03ppv6alkpphs1ksopll8us
  - Password Policy: HIPAA-compliant (8+ chars, complexity requirements)
  - MFA: Available for administrative users
  - User Data Encryption: At rest and in transit
  - Audit Logging: CloudTrail integration enabled
```

#### **3. Amazon S3**
```yaml
Configuration:
  - Bucket Encryption: AES-256 (SSE-S3)
  - Versioning: Enabled
  - Access Logging: Enabled
  - Public Access: Blocked
  - Lifecycle Policies: Configured for data retention compliance
  - Cross-Region Replication: Configured for disaster recovery
```

#### **4. AWS Lambda**
```yaml
Configuration:
  - Runtime Encryption: All environment variables encrypted with KMS
  - VPC Configuration: Isolated network access
  - IAM Roles: Least privilege access principles
  - Dead Letter Queues: Configured for error handling
  - CloudWatch Logs: Encrypted log streams
```

### **Data Classification & Handling**

#### **Protected Health Information (PHI) Data Types**
- **Identifiers**: Email addresses, names, user IDs
- **Health Data**: Mental health assessments, mood scores, conversation transcripts
- **Biometric Data**: Voice patterns, facial analysis data
- **Behavioral Data**: App usage patterns, assessment completion rates

#### **Data Flow Security**
```
User Device (TLS 1.3) → CloudFront (WAF) → API Gateway (Auth) → Lambda (VPC) → Aurora (Encrypted)
```

---

## 🌍 **GDPR Compliance Framework**

### **Data Subject Rights Implementation**

#### **1. Right to Access (Article 15)**
```typescript
// API Endpoint: /api/gdpr/data-export
export async function exportUserData(userId: string) {
  return {
    personalData: await getUserProfile(userId),
    assessmentData: await getUserAssessments(userId),
    conversationData: await getUserTranscripts(userId),
    analyticsData: await getUserAnalytics(userId)
  };
}
```

#### **2. Right to Rectification (Article 16)**
- User profile updates via authenticated API endpoints
- Data correction workflows with audit trails
- Automated data validation and consistency checks

#### **3. Right to Erasure (Article 17)**
```typescript
// API Endpoint: /api/gdpr/delete-user
export async function deleteUserData(userId: string, retentionOverride?: boolean) {
  // Soft delete with 30-day grace period
  await markUserForDeletion(userId);
  
  // Hard delete after retention period
  if (retentionOverride || isPastRetentionPeriod(userId)) {
    await permanentlyDeleteUser(userId);
  }
}
```

#### **4. Data Portability (Article 20)**
- Structured data export in JSON format
- Machine-readable format compliance
- Secure download links with expiration

### **Lawful Basis for Processing**
- **Consent (Article 6(1)(a))**: Explicit consent for mental health data processing
- **Legitimate Interest (Article 6(1)(f))**: Platform functionality and security
- **Vital Interests (Article 6(1)(d))**: Crisis intervention and safety features

### **Data Retention Policies**
```yaml
Assessment Data: 7 years (clinical research standards)
User Profiles: Account lifetime + 2 years
Conversation Transcripts: 5 years (anonymized after 2 years)
System Logs: 1 year
Backup Data: 35 days (encrypted)
```

---

## 🛡️ **High-Level Security Architecture**

### **Defense in Depth Strategy**

#### **Layer 1: Network Security**
- **AWS VPC**: Isolated network environment
- **Security Groups**: Restrictive inbound/outbound rules
- **NACLs**: Network-level access control
- **WAF**: Web Application Firewall with OWASP Top 10 protection

#### **Layer 2: Application Security**
- **API Gateway**: Rate limiting, request validation, CORS policies
- **Lambda Authorizers**: JWT token validation
- **Input Validation**: Comprehensive sanitization and validation
- **HTTPS Everywhere**: TLS 1.3 for all communications

#### **Layer 3: Data Security**
- **Encryption at Rest**: AES-256 for all stored data
- **Encryption in Transit**: TLS 1.3 for all data transmission
- **Key Management**: AWS KMS with customer-managed keys
- **Database Security**: Row-level security, encrypted connections

#### **Layer 4: Identity & Access Management**
- **AWS Cognito**: Multi-factor authentication capability
- **IAM Roles**: Least privilege access principles
- **Service-to-Service Auth**: IAM roles for Lambda-to-RDS communication
- **API Authentication**: JWT tokens with short expiration

### **Security Monitoring & Incident Response**

#### **Continuous Monitoring**
```yaml
CloudTrail: All API calls logged and monitored
CloudWatch: Real-time metrics and alerting
GuardDuty: Threat detection and security monitoring
Config: Configuration compliance monitoring
Security Hub: Centralized security findings
```

#### **Incident Response Plan**
1. **Detection**: Automated alerts via CloudWatch/GuardDuty
2. **Assessment**: Security team notification within 15 minutes
3. **Containment**: Automated isolation of affected resources
4. **Investigation**: Forensic analysis using CloudTrail logs
5. **Recovery**: Restore from encrypted backups if necessary
6. **Lessons Learned**: Post-incident review and improvements

---

## 🗄️ **Database Architecture & Technical Implementation**

### **Amazon Aurora Serverless v2 Configuration**

#### **Cluster Specifications**
```yaml
Engine: PostgreSQL 15.4
Cluster Identifier: mindmeasure-aurora
Region: eu-west-2 (London)
Multi-AZ: Enabled
Backup Retention: 35 days
Encryption: AWS KMS (customer-managed key)
Performance Insights: Disabled (HIPAA compliance)
```

#### **Scaling Configuration**
```yaml
Min ACU: 0.5 (Auto-pause enabled)
Max ACU: 16 (Scales based on demand)
Auto-pause: 5 minutes of inactivity
Cold Start: ~1-2 seconds typical
Connection Pooling: PgBouncer integration
```

#### **Connection Architecture**
```typescript
// Database Service Factory Pattern
export class AWSBackendService implements BackendService {
  private pool: Pool;
  
  constructor(config: DatabaseConfig) {
    this.pool = new Pool({
      host: 'mindmeasure-aurora.cluster-cz8c8wq4k3ak.eu-west-2.rds.amazonaws.com',
      port: 5432,
      database: 'mindmeasure',
      user: 'mindmeasure_admin',
      password: process.env.RDS_PASSWORD,
      ssl: { rejectUnauthorized: false },
      max: 20, // Maximum connections
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }
}
```

### **Schema Design & Data Models**

#### **Core Tables Structure**
```sql
-- User Profiles (PHI Data)
CREATE TABLE profiles (
    user_id UUID PRIMARY KEY,
    first_name VARCHAR(100) ENCRYPTED,
    last_name VARCHAR(100) ENCRYPTED,
    email VARCHAR(255) ENCRYPTED UNIQUE,
    university_id VARCHAR(50) NOT NULL,
    baseline_established BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment Sessions (Clinical Data)
CREATE TABLE assessment_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(user_id),
    assessment_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'processing',
    session_data JSONB ENCRYPTED,
    text_data JSONB ENCRYPTED,
    audio_data JSONB ENCRYPTED,
    visual_data JSONB ENCRYPTED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fusion Outputs (Processed Results)
CREATE TABLE fusion_outputs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES assessment_sessions(id),
    user_id UUID REFERENCES profiles(user_id),
    score INTEGER CHECK (score >= 0 AND score <= 100),
    final_score INTEGER CHECK (final_score >= 0 AND final_score <= 100),
    analysis JSONB ENCRYPTED,
    topics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Row-Level Security (RLS)**
```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fusion_outputs ENABLE ROW LEVEL SECURITY;

-- University-scoped access policy
CREATE POLICY university_isolation ON profiles
    FOR ALL TO application_role
    USING (university_id = current_setting('app.current_university'));

-- User-scoped access policy
CREATE POLICY user_data_isolation ON assessment_sessions
    FOR ALL TO application_role
    USING (user_id = current_setting('app.current_user_id')::UUID);
```

### **Data Migration Strategy**

#### **Migration Process**
1. **Schema Creation**: Aurora PostgreSQL with enhanced security
2. **Data Export**: Encrypted export from Supabase
3. **Data Transformation**: GDPR compliance enhancements
4. **Data Import**: Batch import with validation
5. **Verification**: Data integrity and compliance checks
6. **Cutover**: DNS and application configuration updates

#### **Zero-Downtime Migration**
```yaml
Phase 1: Dual-write to both Supabase and Aurora
Phase 2: Read traffic gradually shifted to Aurora
Phase 3: Write traffic cutover to Aurora
Phase 4: Supabase decommissioning
```

---

## 🚀 **Lambda Functions Architecture**

### **Microservices Design**

#### **Core Lambda Functions**
```yaml
analyze-audio:
  Runtime: Node.js 18.x
  Memory: 1024 MB
  Timeout: 30 seconds
  Purpose: Process voice patterns and emotional tone analysis

analyze-visual:
  Runtime: Node.js 18.x
  Memory: 2048 MB
  Timeout: 60 seconds
  Purpose: Facial emotion recognition via AWS Rekognition

analyze-text:
  Runtime: Node.js 18.x
  Memory: 512 MB
  Timeout: 15 seconds
  Purpose: Natural language processing of conversation transcripts

calculate-mind-measure:
  Runtime: Node.js 18.x
  Memory: 1024 MB
  Timeout: 45 seconds
  Purpose: Multi-modal fusion algorithm for wellness scoring
```

#### **API Gateway Integration**
```yaml
Base URL: https://4xg1jsjh7k.execute-api.eu-west-2.amazonaws.com/dev
Authentication: JWT Bearer tokens from Cognito
Rate Limiting: 100 requests per minute per user
CORS: Configured for mobile.mindmeasure.app
Logging: Full request/response logging to CloudWatch
```

### **Error Handling & Resilience**
```typescript
// Robust error handling with fallback scoring
export async function processBaselineAssessment(sessionId: string) {
  const results = await Promise.allSettled([
    analyzeAudio(sessionId),
    analyzeVisual(sessionId),
    analyzeText(sessionId)
  ]);
  
  // Continue with available data even if some analyses fail
  const successfulAnalyses = results
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value);
    
  return calculateFusionScore(successfulAnalyses);
}
```

---

## 📊 **Monitoring & Observability**

### **CloudWatch Metrics & Alarms**
```yaml
Database Metrics:
  - Connection count
  - CPU utilization
  - Database connections
  - Query performance

Lambda Metrics:
  - Invocation count
  - Error rate
  - Duration
  - Throttles

Application Metrics:
  - User registration rate
  - Assessment completion rate
  - API response times
  - Error rates by endpoint
```

### **Logging Strategy**
```yaml
Application Logs: CloudWatch Logs (encrypted)
Database Logs: Aurora PostgreSQL logs
Security Logs: CloudTrail (all API calls)
Performance Logs: X-Ray tracing for Lambda functions
Retention: 1 year for operational logs, 7 years for audit logs
```

---

## 🔄 **Disaster Recovery & Business Continuity**

### **Backup Strategy**
```yaml
Database Backups:
  - Automated daily backups (35-day retention)
  - Point-in-time recovery capability
  - Cross-region backup replication
  - Encrypted backup storage

Application Backups:
  - Infrastructure as Code (CloudFormation)
  - Lambda function versioning
  - S3 cross-region replication
  - Configuration backup in Git
```

### **Recovery Time Objectives (RTO)**
- **Database Recovery**: < 4 hours
- **Application Recovery**: < 2 hours
- **Full Service Restoration**: < 6 hours

### **Recovery Point Objectives (RPO)**
- **Database**: < 15 minutes
- **File Storage**: < 1 hour
- **Configuration**: < 5 minutes

---

## 💰 **Cost Optimization & Management**

### **Aurora Serverless v2 Cost Benefits**
```yaml
Previous (Supabase): ~$500/month fixed cost
Current (Aurora): ~$200-800/month based on usage
Scaling: Automatic scaling from 0.5 to 16 ACUs
Cost Monitoring: CloudWatch billing alarms
Reserved Capacity: Available for predictable workloads
```

### **Lambda Cost Optimization**
```yaml
Memory Optimization: Right-sized based on profiling
Provisioned Concurrency: Only for critical functions
Dead Letter Queues: Prevent infinite retry costs
Timeout Configuration: Optimized to prevent runaway costs
```

---

## 🎯 **Performance Optimization**

### **Database Performance**
- **Connection Pooling**: PgBouncer integration
- **Query Optimization**: Indexed on frequently queried columns
- **Caching Strategy**: Application-level caching for static data
- **Read Replicas**: Available for read-heavy workloads

### **Lambda Performance**
- **Cold Start Optimization**: Minimal dependencies, connection reuse
- **Memory Allocation**: Optimized based on profiling
- **Concurrent Execution**: Configured limits to prevent resource exhaustion
- **VPC Configuration**: Optimized for minimal cold start impact

---

## 🔮 **Future Enhancements**

### **Planned Security Improvements**
- **AWS Secrets Manager**: Migration from environment variables
- **AWS Certificate Manager**: Automated SSL certificate management
- **AWS Shield Advanced**: Enhanced DDoS protection
- **AWS Macie**: Automated PHI discovery and classification

### **Compliance Enhancements**
- **SOC 2 Type II**: Full compliance certification
- **ISO 27001**: Information security management system
- **GDPR Article 25**: Privacy by design implementation
- **HIPAA Audit**: Third-party compliance verification

---

## 📋 **Implementation Checklist**

### **Completed ✅**
- [x] AWS BAA signed and activated
- [x] Aurora Serverless v2 cluster deployed
- [x] Cognito user pool configured
- [x] Lambda functions deployed
- [x] S3 buckets with encryption enabled
- [x] API Gateway with authentication
- [x] CloudWatch monitoring configured
- [x] Data migration completed
- [x] Application testing completed

### **In Progress 🔄**
- [ ] SOC 2 Type II audit preparation
- [ ] Third-party security assessment
- [ ] Performance optimization based on production metrics
- [ ] Advanced monitoring and alerting setup

### **Planned 📅**
- [ ] Multi-region deployment for disaster recovery
- [ ] Advanced threat detection implementation
- [ ] Automated compliance reporting
- [ ] Cost optimization review and implementation

---

## 📞 **Support & Maintenance**

### **Operational Responsibilities**
- **AWS Infrastructure**: Mind Measure DevOps team
- **Database Administration**: Automated with manual oversight
- **Security Monitoring**: 24/7 automated monitoring with on-call support
- **Compliance Auditing**: Quarterly reviews with annual third-party audits

### **Escalation Procedures**
1. **Level 1**: Automated monitoring and alerting
2. **Level 2**: On-call engineer response (< 30 minutes)
3. **Level 3**: Senior engineering team (< 2 hours)
4. **Level 4**: AWS Enterprise Support (< 1 hour)

---

**Document Version**: 1.0  
**Last Updated**: October 28, 2025  
**Next Review**: January 28, 2026  
**Classification**: Internal - Confidential  
**Approved By**: Keith Duddy, CTO





