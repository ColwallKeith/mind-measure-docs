# 🚨 CRITICAL DEPLOYMENT CHECKLIST

## ⚠️ BEFORE ANY DEPLOYMENT

**MANDATORY CHECKS - NO EXCEPTIONS:**

### 1. Code Verification
- [ ] ✅ `main.tsx` imports both `Router` and `App`
- [ ] ✅ `main.tsx` has domain detection logic (`isAdminDomain`)
- [ ] ✅ `main.tsx` renders conditionally based on domain
- [ ] ✅ No hardcoded interface selection (must be dynamic)

### 2. Build Verification  
- [ ] ✅ `npm run build` succeeds without errors
- [ ] ✅ `node scripts/verify-build.js` passes
- [ ] ✅ Both Router and App found in build output

### 3. Local Testing
- [ ] ✅ `localhost:5173` shows admin interface
- [ ] ✅ Admin routes work: `/sign-in`, `/superuser-login`, `/university`
- [ ] ✅ Browser console shows correct domain detection logs

## 🚀 DEPLOYMENT PROCESS

### 4. Deploy
```bash
npm run build
node scripts/verify-build.js  # MUST PASS
git add . && git commit -m "..."
git push origin main
npx vercel --prod
```

### 5. Post-Deployment Verification (CRITICAL)
**Wait 60 seconds for propagation, then:**

- [ ] ✅ `https://admin.mindmeasure.co.uk/sign-in` loads admin interface
- [ ] ✅ `https://admin.mindmeasure.co.uk/superuser-login` loads admin interface  
- [ ] ✅ `https://admin.mindmeasure.co.uk/university` loads admin interface
- [ ] ✅ Browser console shows "Admin Router" in domain detection logs
- [ ] ✅ Mobile app still works via Capacitor

## 🚨 ROLLBACK PROCEDURE

**If ANY check fails:**

1. **Immediate rollback:**
   ```bash
   # In Vercel dashboard: Deployments → Previous → Promote
   # OR via CLI:
   vercel rollback
   ```

2. **Verify rollback:**
   - Test admin routes again
   - Confirm admin interface loads

3. **Fix locally before redeploying**

## 🛡️ SAFEGUARDS IN PLACE

- **Pre-commit hook**: `scripts/pre-commit-critical-check.sh`
- **Build verification**: `scripts/verify-build.js`  
- **GitHub Actions**: `.github/workflows/critical-path-verification.yml`
- **Domain detection**: Automatic routing in `main.tsx`

## 📞 EMERGENCY CONTACTS

**If admin portal is down:**
- Immediate Vercel rollback
- Check GitHub Actions logs
- Verify domain detection in browser console

## 🎯 SUCCESS CRITERIA

- ✅ Admin interface accessible at `admin.mindmeasure.co.uk`
- ✅ All admin routes functional
- ✅ Mobile app unaffected
- ✅ Domain detection working correctly
- ✅ No 404 errors or wrong interfaces

---

**🔒 REMEMBER: The admin portal is CRITICAL INFRASTRUCTURE**  
**Any changes to `main.tsx` require extra caution and verification**
