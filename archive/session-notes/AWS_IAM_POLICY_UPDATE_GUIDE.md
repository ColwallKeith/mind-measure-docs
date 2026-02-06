# AWS IAM Policy Update Guide for Vercel

## 🎯 **Problem**
Vercel's AWS credentials are getting "Access Denied" when trying to upload files to S3 buckets. This means the IAM policy attached to Vercel's AWS user/role needs to be updated.

## 🔍 **Step 1: Identify Vercel's AWS Credentials**

### Option A: Check Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project: `mind-measure-core`
3. Go to **Settings** → **Environment Variables**
4. Look for these variables:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY` 
   - `AWS_REGION`
   - `AWS_SESSION_TOKEN` (if using temporary credentials)

### Option B: Check via Vercel CLI
```bash
# Install Vercel CLI if not installed
npm install -g vercel

# Login to Vercel
vercel login

# Check environment variables
vercel env ls --scope=production
```

## 🔧 **Step 2: Update IAM Policy in AWS Console**

### 2.1 Login to AWS Console
1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Navigate to **IAM** service
3. Go to **Users** (if using IAM user) or **Roles** (if using IAM role)

### 2.2 Find the Correct User/Role
- Look for a user/role that matches the `AWS_ACCESS_KEY_ID` from Vercel
- Common names might be: `vercel-user`, `mindmeasure-deploy`, `s3-upload-user`, etc.

### 2.3 Update the Policy
1. Click on the user/role name
2. Go to **Permissions** tab
3. Find the policy that grants S3 access (might be inline or managed)
4. Click **Edit policy**

## 📋 **Step 3: Required IAM Policy**

Replace the existing S3 permissions with this comprehensive policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListAllBuckets",
      "Effect": "Allow",
      "Action": [
        "s3:ListAllMyBuckets",
        "s3:GetBucketLocation"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ListMindMeasureBuckets",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetBucketLocation",
        "s3:GetBucketCors",
        "s3:GetBucketVersioning"
      ],
      "Resource": [
        "arn:aws:s3:::mindmeasure-user-content-459338929203",
        "arn:aws:s3:::mindmeasure-*"
      ]
    },
    {
      "Sid": "ManageMindMeasureObjects",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:GetObjectVersion",
        "s3:PutObjectAcl",
        "s3:GetObjectAcl"
      ],
      "Resource": [
        "arn:aws:s3:::mindmeasure-user-content-459338929203/*",
        "arn:aws:s3:::mindmeasure-*/*"
      ]
    },
    {
      "Sid": "CreateUniversityBuckets",
      "Effect": "Allow",
      "Action": [
        "s3:CreateBucket",
        "s3:PutBucketCors",
        "s3:PutBucketVersioning",
        "s3:PutEncryptionConfiguration",
        "s3:PutPublicAccessBlock"
      ],
      "Resource": "arn:aws:s3:::mindmeasure-*",
      "Condition": {
        "StringEquals": {
          "s3:x-amz-bucket-region": "eu-west-2"
        }
      }
    }
  ]
}
```

## 🚀 **Step 4: Alternative - Create New IAM User**

If you can't find the existing user/role, create a new one:

### 4.1 Create IAM User
1. In AWS Console → IAM → Users
2. Click **Create user**
3. Name: `mindmeasure-vercel-user`
4. Select **Programmatic access**

### 4.2 Attach Policy
1. Choose **Attach policies directly**
2. Click **Create policy**
3. Use **JSON** tab and paste the policy above
4. Name it: `MindMeasureS3FullAccess`
5. Attach to the user

### 4.3 Get Credentials
1. After creating user, download the CSV with:
   - Access Key ID
   - Secret Access Key
2. Update these in Vercel environment variables

## 🔧 **Step 5: Update Vercel Environment Variables**

### Via Vercel Dashboard:
1. Go to project Settings → Environment Variables
2. Update or add:
   ```
   AWS_ACCESS_KEY_ID=AKIA...
   AWS_SECRET_ACCESS_KEY=...
   AWS_REGION=eu-west-2
   AWS_S3_BUCKET_NAME=mindmeasure-user-content-459338929203
   ```

### Via Vercel CLI:
```bash
vercel env add AWS_ACCESS_KEY_ID production
vercel env add AWS_SECRET_ACCESS_KEY production
vercel env add AWS_REGION production
```

## 🧪 **Step 6: Test the Fix**

After updating the IAM policy and Vercel environment variables:

1. **Redeploy** your Vercel project to pick up new environment variables
2. **Test file upload** in the CMS
3. **Check Vercel function logs** for any remaining errors

### Test Command:
```bash
curl -X POST "https://admin.mindmeasure.co.uk/api/storage/upload" \
  -F "file=@/path/to/test-file.txt" \
  -F "filePath=test/upload-test.txt" \
  -F "bucket=mindmeasure-user-content-459338929203"
```

## 🔍 **Troubleshooting**

### Still Getting "Access Denied"?
1. **Check region**: Ensure IAM policy and buckets are in same region (`eu-west-2`)
2. **Check bucket names**: Verify exact bucket names in policy
3. **Check credentials**: Ensure Vercel is using the updated credentials
4. **Check policy syntax**: Validate JSON syntax in AWS policy validator

### Common Issues:
- **Wrong bucket ARN**: Make sure ARNs match exact bucket names
- **Missing permissions**: Ensure both bucket and object permissions are included
- **Region mismatch**: Policy and buckets must be in same region
- **Cached credentials**: Redeploy Vercel project after updating env vars

## 📞 **Need Help?**

If you're still having issues:
1. **Check AWS CloudTrail** for detailed error logs
2. **Use AWS Policy Simulator** to test permissions
3. **Contact AWS Support** for IAM-specific issues

---

## 🎯 **Quick Summary**

1. ✅ Find Vercel's AWS credentials in dashboard
2. ✅ Update IAM policy in AWS Console with the JSON above
3. ✅ Ensure policy includes `mindmeasure-*` bucket pattern
4. ✅ Redeploy Vercel project
5. ✅ Test file uploads in CMS

This should resolve the "Access Denied" errors and enable university-specific file uploads! 🚀
