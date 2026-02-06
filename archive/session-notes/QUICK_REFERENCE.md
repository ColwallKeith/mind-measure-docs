# QUICK REFERENCE - Development Protocol

## 🎯 BEFORE ANY WORK
1. Read `DEVELOPMENT_PROTOCOL.md`
2. Check API health: `curl https://mobile.mindmeasure.app/api/database/health`
3. Set production environment variables
4. Verify current deployment works

## 🚀 STANDARD BUILD & DEPLOY
```bash
export VITE_API_BASE_URL=https://mobile.mindmeasure.app/api
export VITE_AWS_REGION=eu-west-2
export VITE_AWS_COGNITO_USER_POOL_ID=eu-west-2_ClAG4fQXR
export VITE_AWS_COGNITO_CLIENT_ID=7vu03ppv6alkpphs1ksopll8us
export VITE_BACKEND_PROVIDER=aurora-serverless

npm run build
npx vercel --prod
npx vercel alias mobile.mindmeasure.app
npx cap sync
npx cap run ios
```

## 🌐 DOMAINS
- Mobile App: `mobile.mindmeasure.app` (iOS/Android only)
- Admin: `admin.mindmeasure.co.uk` (Web only)
- Marketing: `mindmeasure.co.uk` (Web only)

## 🔐 AUTH
- Pool: `eu-west-2_ClAG4fQXR`
- Client: `7vu03ppv6alkpphs1ksopll8us`
- Region: `eu-west-2`

## ❌ NEVER
- Use localhost:3000
- Mix mobile/admin interfaces
- Skip deployment steps
- Test locally without production verification
