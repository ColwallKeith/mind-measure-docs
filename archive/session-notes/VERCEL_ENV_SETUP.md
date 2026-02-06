# Vercel Environment Variables Setup

## Required AWS Environment Variables

The following environment variables need to be set in Vercel for the AWS backend to work properly:

### Database Configuration
```bash
VITE_BACKEND_PROVIDER=aurora-serverless
VITE_DB_HOST=mindmeasure-aurora.cluster-cz8c8wq4k3ak.eu-west-2.rds.amazonaws.com
VITE_DB_PORT=5432
VITE_DB_NAME=mindmeasure
VITE_DB_USERNAME=mindmeasure_admin
VITE_DB_PASSWORD=MindMeasure2024!
```

### AWS Configuration
```bash
VITE_AWS_REGION=eu-west-2
VITE_AWS_ACCESS_KEY_ID=[NEEDS TO BE SET]
VITE_AWS_SECRET_ACCESS_KEY=[NEEDS TO BE SET]
```

### AWS Cognito Configuration
```bash
VITE_AWS_COGNITO_USER_POOL_ID=eu-west-2_ClAG4fQXR
VITE_AWS_COGNITO_CLIENT_ID=7vu03ppv6alkpphs1ksopll8us
```

### AWS S3 Configuration
```bash
VITE_AWS_S3_BUCKET_NAME=mindmeasure-user-content-459338929203
VITE_AWS_S3_REGION=eu-west-2
```

## How to Set in Vercel

1. Go to Vercel Dashboard
2. Select the mind-measure-core project
3. Go to Settings > Environment Variables
4. Add each variable above for the Production environment

## Current Status

✅ **Fallback values added** - System won't crash if env vars are missing
✅ **Robust error handling** - AWS services degrade gracefully
⚠️ **AWS credentials missing** - Need to set VITE_AWS_ACCESS_KEY_ID and VITE_AWS_SECRET_ACCESS_KEY

## Testing

After setting the environment variables, the system should:
1. Use AWS Aurora Serverless v2 as the database
2. Use AWS Cognito for authentication
3. Use AWS S3 for file storage
4. Fall back gracefully if any service is unavailable

## Verification

Check the browser console for:
- "🌐 Using Aurora Serverless v2 Browser Service with API endpoints"
- No "AWS Cognito requires userPoolId and clientId" errors
- Successful database initialization
