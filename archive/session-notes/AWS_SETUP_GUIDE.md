# AWS Setup Guide for Mind Measure

## 🚀 Complete AWS Configuration Guide

### **Step 1: Create AWS Account**
1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Click "Create AWS Account"
3. Complete registration (requires credit card for verification)
4. Choose "Basic Support Plan" (free)

### **Step 2: Create IAM User (Security Best Practice)**
1. Go to AWS Console → IAM → Users
2. Click "Add User"
3. Username: `mindmeasure-app`
4. Access type: ✅ Programmatic access
5. Attach policies:
   - `AmazonCognitoPowerUser`
   - `AmazonRDSFullAccess`
   - `AmazonS3FullAccess`
   - `AWSLambdaFullAccess`
6. **SAVE THE ACCESS KEYS** (you'll need these!)

### **Step 3: Set Up AWS Cognito**

#### **3A: Create User Pool**
1. AWS Console → Cognito → User Pools
2. Click "Create User Pool"
3. **Step 1 - Configure sign-in experience:**
   - Sign-in options: ✅ Email
   - User name requirements: Email address
4. **Step 2 - Configure security requirements:**
   - Password policy: Default
   - Multi-factor authentication: Optional (recommended: SMS)
5. **Step 3 - Configure sign-up experience:**
   - Self-service sign-up: ✅ Enable
   - Required attributes: ✅ Email, ✅ Given name, ✅ Family name
6. **Step 4 - Configure message delivery:**
   - Email provider: Send email with Cognito (for testing)
7. **Step 5 - Integrate your app:**
   - User pool name: `mindmeasure-users`
   - App client name: `mindmeasure-web`
   - Client secret: ❌ Don't generate (web apps don't need this)
8. **Review and Create**

**📝 SAVE THESE VALUES:**
- User Pool ID (e.g., `us-east-1_AbCdEfGhI`)
- App Client ID (e.g., `1a2b3c4d5e6f7g8h9i0j1k2l3m`)

#### **3B: Create Identity Pool**
1. AWS Console → Cognito → Identity Pools
2. Click "Create Identity Pool"
3. Identity pool name: `mindmeasure_identity`
4. Authentication providers:
   - Cognito User Pool ID: [your user pool ID]
   - App client ID: [your app client ID]
5. Create Pool

**📝 SAVE THIS VALUE:**
- Identity Pool ID (e.g., `us-east-1:12345678-1234-1234-1234-123456789012`)

### **Step 4: Set Up Aurora Serverless v2**

1. AWS Console → RDS → Create Database
2. **Engine options:**
   - Engine type: Aurora (MySQL Compatible) or Aurora (PostgreSQL Compatible)
   - Choose PostgreSQL for Mind Measure
3. **Templates:** Serverless
4. **Settings:**
   - DB cluster identifier: `mindmeasure-db`
   - Master username: `mindmeasure`
   - Master password: [create strong password]
5. **Serverless v2 scaling configuration:**
   - Minimum: 0.5 ACUs
   - Maximum: 1 ACU (for development)
6. **Connectivity:**
   - Public access: Yes (for development)
   - VPC security group: Create new
7. **Additional configuration:**
   - Initial database name: `mindmeasure`
8. Create Database

**📝 SAVE THESE VALUES:**
- Endpoint: `mindmeasure-db.cluster-xxxxx.us-east-1.rds.amazonaws.com`
- Port: `5432`
- Database name: `mindmeasure`
- Username: `mindmeasure`
- Password: [your password]

### **Step 5: Set Up S3 Bucket**

1. AWS Console → S3 → Create Bucket
2. **Bucket name:** `mindmeasure-assets-[random-suffix]` (must be globally unique)
3. **Region:** Same as your other services (e.g., us-east-1)
4. **Block Public Access:** Keep defaults (block all public access)
5. **Bucket Versioning:** Disabled
6. **Default encryption:** Amazon S3 managed keys (SSE-S3)
7. Create Bucket

**📝 SAVE THIS VALUE:**
- Bucket name: `mindmeasure-assets-[your-suffix]`

### **Step 6: Configure CORS for S3 (Important!)**

1. Go to your S3 bucket
2. Permissions tab → CORS
3. Add this configuration:

```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["http://localhost:3000", "https://app.mindmeasure.co.uk"],
        "ExposeHeaders": ["ETag"]
    }
]
```

### **Step 7: Set Up Environment Variables**

Create a `.env.local` file in your project root:

```bash
# AWS Configuration
VITE_AWS_REGION=us-east-1
VITE_AWS_ACCESS_KEY_ID=AKIA...your-access-key
VITE_AWS_SECRET_ACCESS_KEY=your-secret-key

# AWS Cognito
VITE_AWS_COGNITO_USER_POOL_ID=us-east-1_AbCdEfGhI
VITE_AWS_COGNITO_CLIENT_ID=1a2b3c4d5e6f7g8h9i0j1k2l3m
VITE_AWS_COGNITO_IDENTITY_POOL_ID=us-east-1:12345678-1234-1234-1234-123456789012

# Database
VITE_DATABASE_URL=postgresql://mindmeasure:your-password@mindmeasure-db.cluster-xxxxx.us-east-1.rds.amazonaws.com:5432/mindmeasure
VITE_BACKEND_PROVIDER=aurora-serverless

# S3
VITE_AWS_S3_BUCKET=mindmeasure-assets-your-suffix

# API
VITE_API_URL=http://localhost:3000
VITE_APP_URL=http://localhost:3000
```

## 🧪 **Testing Your Setup**

### **Test 1: Database Connection**
```bash
npm run dev
# Visit http://localhost:3000
# Check browser console for database connection logs
```

### **Test 2: User Registration**
1. Go to registration page
2. Create a test account
3. Check AWS Cognito console for the new user
4. Check your email for verification

### **Test 3: File Upload**
1. Try uploading an audio file during assessment
2. Check S3 bucket for uploaded files

## 💰 **Cost Estimation**

**Development/Testing (per month):**
- Cognito: ~$0 (50,000 MAUs free)
- Aurora Serverless v2: ~$10-30 (depends on usage)
- S3: ~$1-5 (depends on storage)
- **Total: ~$15-40/month**

**Production (per month for 1000 active users):**
- Cognito: ~$5
- Aurora Serverless v2: ~$50-100
- S3: ~$10-20
- **Total: ~$65-125/month**

## 🔒 **Security Best Practices**

1. **Never commit credentials to Git**
2. **Use IAM roles in production** (not access keys)
3. **Enable MFA on your AWS account**
4. **Regularly rotate access keys**
5. **Use least privilege principle** for IAM policies

## 🚨 **Common Issues**

### **Issue: "Access Denied" errors**
- Check IAM permissions
- Verify region consistency
- Check security group settings for RDS

### **Issue: "CORS errors" in browser**
- Configure S3 CORS policy
- Check allowed origins

### **Issue: "Database connection failed"**
- Verify RDS is publicly accessible
- Check security group allows port 5432
- Verify connection string format

## 📞 **Need Help?**

If you encounter issues:
1. Check AWS CloudWatch logs
2. Enable debug logging in the app
3. Verify all environment variables are set
4. Test each service individually

## 🎯 **Next Steps After Setup**

1. Run the health check: `curl http://localhost:3000/api/database/health-check`
2. Set up database tables: `curl -X POST http://localhost:3000/api/database/setup-tables`
3. Test user registration flow
4. Deploy to production (Vercel recommended)

---

**🎉 Once complete, you'll have a fully functional AWS-powered Mind Measure application!**

