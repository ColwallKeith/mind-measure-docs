# AWS Connection Plan - Proper Integration

## 🎯 **Objective**
Connect the Mind Measure system to AWS Aurora Serverless v2 properly, eliminating dummy data and using real AWS services.

## 🔍 **Current Status**
- ✅ AWS configuration with fallback values in BackendServiceFactory
- ✅ API endpoints created for database operations
- ✅ Services configured to try real AWS first, fallback to mock
- ⚠️ API endpoints returning 500 errors (connection issues)
- ⚠️ System falling back to demo data

## 📋 **Step-by-Step Connection Process**

### **Step 1: Test Aurora Connection**
```bash
# Test the database health check endpoint
curl https://app.mindmeasure.co.uk/api/database/health-check
```
**Expected Result**: Connection details and any error messages

### **Step 2: Set Up Database Tables**
```bash
# Create required tables in Aurora
curl -X POST https://app.mindmeasure.co.uk/api/database/setup-tables
```
**Expected Result**: Tables created successfully

### **Step 3: Verify Environment Variables**
Check Vercel environment variables are set:
- `AWS_AURORA_HOST` or fallback to hardcoded value
- `AWS_AURORA_DATABASE` = mindmeasure
- `AWS_AURORA_USERNAME` = mindmeasure_admin  
- `AWS_AURORA_PASSWORD` = MindMeasure2024!

### **Step 4: Test Database Operations**
```bash
# Test select operation
curl -X POST https://app.mindmeasure.co.uk/api/database/select \
  -H "Content-Type: application/json" \
  -d '{"table": "universities", "options": {"columns": "*"}}'
```

### **Step 5: Monitor System Behavior**
- Check console logs for "Attempting to create real CostTrackingService..."
- Check for "Database query failed, using demo data:" messages
- Verify data is coming from Aurora, not demo data

## 🔧 **Troubleshooting Guide**

### **If Health Check Fails:**
1. **Connection Timeout**: Aurora Serverless might be paused
2. **Authentication Error**: Check credentials
3. **Network Error**: Check security groups/VPC settings
4. **DNS Error**: Check hostname resolution

### **If Tables Don't Exist:**
1. Run the setup-tables endpoint
2. Check Aurora Serverless is in available state
3. Verify database name is correct

### **If API Calls Still Fail:**
1. Check Vercel function logs
2. Verify Aurora Serverless scaling settings
3. Check connection pooling settings

## 🚀 **Success Criteria**

### **System Should Show:**
- ✅ "🌐 Using Aurora Serverless v2 Browser Service with API endpoints"
- ✅ "Connected to Aurora successfully" in health check
- ✅ Real university data from database
- ✅ Real cost tracking data
- ❌ No "using demo data" messages (except for planned universities)

### **Data Flow:**
1. **Frontend** → AWSBrowserService
2. **AWSBrowserService** → API endpoints (/api/database/*)
3. **API endpoints** → Aurora Serverless v2
4. **Aurora** → Real data back to frontend

## 📊 **Monitoring**

### **Console Messages to Watch:**
- "Attempting to create real CostTrackingService..."
- "Database service not available, using demo data" (should not appear)
- "Database query failed, using demo data:" (should not appear)
- API endpoint success/failure messages

### **Test URLs After Deployment:**
- Health Check: `https://app.mindmeasure.co.uk/api/database/health-check`
- Setup Tables: `https://app.mindmeasure.co.uk/api/database/setup-tables`
- Main App: `https://app.mindmeasure.co.uk`

## 🎯 **Next Steps**
1. Wait for deployment (2-3 minutes)
2. Test health check endpoint
3. Set up database tables if needed
4. Verify real data is flowing through system
5. Remove any remaining mock/demo data usage

**Goal**: Complete AWS integration with Aurora Serverless v2 as the primary data source.
