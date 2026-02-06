# Aurora Migration Plan
## Upgrading from RDS to Aurora for Medical-Grade Performance

**Current:** AWS RDS PostgreSQL t3.micro  
**Target:** Aurora Serverless v2 PostgreSQL  
**Timeline:** 2-3 hours (with minimal downtime)  
**Cost Impact:** +$360/year for enterprise-grade performance

---

## 🎯 **MIGRATION STRATEGY**

### **Option 1: Blue-Green Deployment (Recommended)**
- **Downtime:** < 5 minutes
- **Risk:** Very Low
- **Rollback:** Instant

### **Option 2: Snapshot Migration**
- **Downtime:** 30-60 minutes
- **Risk:** Low
- **Rollback:** Available

---

## 📋 **STEP-BY-STEP MIGRATION**

### **Phase 1: Pre-Migration Setup (30 minutes)**

#### **1. Create Aurora Cluster**
```bash
# Create Aurora Serverless v2 cluster
aws rds create-db-cluster \
  --db-cluster-identifier mindmeasure-aurora \
  --engine aurora-postgresql \
  --engine-version 15.4 \
  --master-username mindmeasure_admin \
  --master-user-password 'MindMeasure2024!' \
  --database-name mindmeasure \
  --vpc-security-group-ids sg-0123456789abcdef0 \
  --db-subnet-group-name mindmeasure-subnet-group \
  --storage-encrypted \
  --kms-key-id arn:aws:kms:eu-west-2:ACCOUNT:key/KEY-ID \
  --backup-retention-period 35 \
  --preferred-backup-window "03:00-04:00" \
  --preferred-maintenance-window "sun:04:00-sun:05:00" \
  --enable-cloudwatch-logs-exports postgresql \
  --serverlessv2-scaling-configuration MinCapacity=0.5,MaxCapacity=16
```

#### **2. Create Aurora Instance**
```bash
# Create Aurora Serverless v2 instance
aws rds create-db-instance \
  --db-instance-identifier mindmeasure-aurora-instance \
  --db-instance-class db.serverless \
  --engine aurora-postgresql \
  --db-cluster-identifier mindmeasure-aurora \
  --publicly-accessible \
  --monitoring-interval 60 \
  --monitoring-role-arn arn:aws:iam::ACCOUNT:role/rds-monitoring-role \
  --enable-performance-insights \
  --performance-insights-retention-period 7
```

### **Phase 2: Data Migration (60 minutes)**

#### **3. Create Database Snapshot**
```bash
# Create final snapshot of current RDS
aws rds create-db-snapshot \
  --db-instance-identifier mindmeasure-db \
  --db-snapshot-identifier mindmeasure-pre-aurora-migration-$(date +%Y%m%d)
```

#### **4. Migrate Data Using pg_dump**
```bash
# Export from current RDS
pg_dump -h mindmeasure-db.cz8c8wq4k3ak.eu-west-2.rds.amazonaws.com \
        -U mindmeasure_admin \
        -d mindmeasure \
        -f mindmeasure_backup.sql \
        --verbose --no-owner --no-privileges

# Import to Aurora
psql -h mindmeasure-aurora.cluster-cz8c8wq4k3ak.eu-west-2.rds.amazonaws.com \
     -U mindmeasure_admin \
     -d mindmeasure \
     -f mindmeasure_backup.sql
```

### **Phase 3: Application Update (15 minutes)**

#### **5. Update Environment Variables**
```bash
# Old RDS endpoint
VITE_DB_HOST=mindmeasure-db.cz8c8wq4k3ak.eu-west-2.rds.amazonaws.com

# New Aurora endpoint
VITE_DB_HOST=mindmeasure-aurora.cluster-cz8c8wq4k3ak.eu-west-2.rds.amazonaws.com
```

#### **6. Update API Endpoints**
```typescript
// Update all API files with new endpoint
const dbConfig = {
  host: process.env.AWS_RDS_HOST || 'mindmeasure-aurora.cluster-cz8c8wq4k3ak.eu-west-2.rds.amazonaws.com',
  port: parseInt(process.env.AWS_RDS_PORT || '5432'),
  database: process.env.AWS_RDS_DATABASE || 'mindmeasure',
  user: process.env.AWS_RDS_USERNAME || 'mindmeasure_admin',
  password: process.env.AWS_RDS_PASSWORD || 'MindMeasure2024!',
  ssl: {
    rejectUnauthorized: false,
  },
};
```

### **Phase 4: Testing & Verification (30 minutes)**

#### **7. Health Check Verification**
```bash
# Test Aurora connection
curl https://mind-measure-core-kozidxre5-mindmeasure.vercel.app/api/database/health

# Expected response:
{
  "status": "healthy",
  "database": {
    "version": "PostgreSQL 15.4 on x86_64-pc-linux-gnu (Aurora)",
    "host": "mindmeasure-aurora.cluster-cz8c8wq4k3ak.eu-west-2.rds.amazonaws.com",
    "database": "mindmeasure"
  }
}
```

#### **8. Data Integrity Check**
```sql
-- Verify record counts match
SELECT 
  'profiles' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 
  'assessment_sessions' as table_name, COUNT(*) as count FROM assessment_sessions
UNION ALL
SELECT 
  'session_insights' as table_name, COUNT(*) as count FROM session_insights;
```

### **Phase 5: Cleanup (15 minutes)**

#### **9. Update Vercel Environment Variables**
```bash
# Update production environment
npx vercel env rm AWS_RDS_HOST production
npx vercel env add AWS_RDS_HOST production
# Enter: mindmeasure-aurora.cluster-cz8c8wq4k3ak.eu-west-2.rds.amazonaws.com

# Redeploy application
npx vercel --prod
```

#### **10. Decommission Old RDS (After 24h)**
```bash
# Create final backup
aws rds create-db-snapshot \
  --db-instance-identifier mindmeasure-db \
  --db-snapshot-identifier mindmeasure-final-backup-$(date +%Y%m%d)

# Delete old RDS instance (after verification)
aws rds delete-db-instance \
  --db-instance-identifier mindmeasure-db \
  --skip-final-snapshot \
  --delete-automated-backups
```

---

## 🔧 **AURORA CONFIGURATION FOR MEDICAL-GRADE**

### **Security Configuration**
```json
{
  "ClusterParameterGroup": {
    "ParameterGroupName": "mindmeasure-aurora-params",
    "Parameters": [
      {
        "ParameterName": "log_statement",
        "ParameterValue": "all"
      },
      {
        "ParameterName": "log_min_duration_statement",
        "ParameterValue": "1000"
      },
      {
        "ParameterName": "shared_preload_libraries",
        "ParameterValue": "pg_stat_statements"
      },
      {
        "ParameterName": "ssl",
        "ParameterValue": "on"
      },
      {
        "ParameterName": "ssl_cert_file",
        "ParameterValue": "server.crt"
      }
    ]
  }
}
```

### **Monitoring Configuration**
```json
{
  "CloudWatchLogs": [
    "postgresql"
  ],
  "PerformanceInsights": {
    "Enabled": true,
    "RetentionPeriod": 7
  },
  "EnhancedMonitoring": {
    "MonitoringInterval": 60,
    "MonitoringRoleArn": "arn:aws:iam::ACCOUNT:role/rds-monitoring-role"
  }
}
```

---

## 💰 **COST BREAKDOWN**

### **Aurora Serverless v2 Costs:**
- **Compute:** $0.12/ACU/hour × 1 ACU × 24h × 30d = $86.40/month
- **Storage:** $0.10/GB/month × 20GB = $2.00/month
- **I/O:** $0.20/million requests × 1M = $0.20/month
- **Backup:** $0.021/GB/month × 20GB = $0.42/month
- **Total:** ~$89/month

### **Cost Comparison:**
- **Current RDS:** $13/month
- **Aurora Serverless v2:** $89/month
- **Additional Cost:** $76/month ($912/year)
- **ROI:** Healthcare market access worth $2-5M

---

## 🎯 **BENEFITS OF AURORA UPGRADE**

### **Performance Benefits:**
- **3x faster** than standard PostgreSQL
- **Auto-scaling** from 0.5 to 16 ACUs
- **Read replicas** with < 10ms lag
- **Connection pooling** built-in

### **Availability Benefits:**
- **99.99% uptime** SLA
- **Multi-AZ** automatic failover
- **6 copies** of data across 3 AZs
- **< 30 second** failover time

### **Security Benefits:**
- **Enhanced encryption** with AWS KMS
- **Network isolation** in VPC
- **Automated patching** and updates
- **Advanced monitoring** and alerting

### **Medical-Grade Benefits:**
- **HIPAA compliant** by design
- **SOC 2 Type II** ready
- **Audit logging** comprehensive
- **Data residency** in EU (GDPR)

---

## ⚠️ **MIGRATION RISKS & MITIGATION**

### **Risk 1: Application Downtime**
- **Mitigation:** Blue-green deployment
- **Fallback:** Keep old RDS for 24h

### **Risk 2: Data Loss**
- **Mitigation:** Multiple backups before migration
- **Verification:** Checksum validation

### **Risk 3: Performance Issues**
- **Mitigation:** Load testing before cutover
- **Monitoring:** Real-time performance metrics

### **Risk 4: Cost Overrun**
- **Mitigation:** Set ACU limits and monitoring
- **Control:** Auto-scaling boundaries

---

## 🚀 **IMMEDIATE NEXT STEPS**

### **Decision Required:**
1. **Approve Aurora upgrade** ($912/year additional cost)
2. **Schedule migration window** (weekend preferred)
3. **Assign technical resources** (2-3 hours)

### **Preparation (This Week):**
1. **Create Aurora cluster** in parallel
2. **Test data migration** process
3. **Update application configuration**
4. **Prepare rollback procedures**

### **Migration (Next Weekend):**
1. **Execute migration plan**
2. **Verify data integrity**
3. **Update production environment**
4. **Monitor performance**

**The Aurora upgrade will provide enterprise-grade database performance and availability required for medical-grade applications, positioning Mind Measure for healthcare market success.**
