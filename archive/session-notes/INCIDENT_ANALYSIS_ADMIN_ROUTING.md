# 🚨 CRITICAL INCIDENT ANALYSIS: Admin Routing Failure

## 📋 **INCIDENT SUMMARY**

**Date**: September 29, 2025  
**Impact**: CRITICAL - Admin portal completely inaccessible  
**Duration**: ~2 weeks (until October 11, 2025)  
**Affected Systems**: All admin functionality at `admin.mindmeasure.co.uk`

## 🔍 **ROOT CAUSE ANALYSIS**

### **The Breaking Change**
**Commit**: `326ca522` - "🔧 Fix mobile app 404 error - Load student App instead of admin Router"

```diff
- createRoot(document.getElementById("root")!).render(<Router />);
+ createRoot(document.getElementById("root")!).render(<App />);
```

### **What Went Wrong**

1. **Single Build Process**: The codebase uses one build that serves both admin and mobile
2. **No Environment Detection**: No logic to determine which interface to serve
3. **Tunnel Vision**: Focus on fixing mobile 404 led to breaking admin completely
4. **No Testing**: Change was deployed without testing admin access
5. **No Monitoring**: Issue went undetected for 2 weeks

### **Systemic Issues**

1. **Architecture Confusion**: 
   - Documentation shows conflicting domain names (`cms.mindmeasure.co.uk` vs `admin.mindmeasure.co.uk`)
   - No clear separation between mobile and admin builds

2. **Deployment Process**:
   - Single deployment serves multiple domains
   - No domain-specific routing logic
   - No post-deployment verification

3. **Testing Gaps**:
   - No automated tests for critical user journeys
   - No smoke tests after deployment
   - No monitoring alerts for broken functionality

## 🛡️ **IMMEDIATE SAFEGUARDS IMPLEMENTED**

### **1. Domain-Based Routing**
```typescript
// Explicit domain detection in main.tsx
const isAdminDomain = window.location.hostname === 'admin.mindmeasure.co.uk' ||
                     window.location.hostname === 'localhost' ||
                     window.location.hostname === '127.0.0.1';

createRoot(document.getElementById("root")!).render(
  isAdminDomain ? <Router /> : <App />
);
```

### **2. Debug Logging**
```typescript
console.log('🌐 Domain detection:', {
  hostname: window.location.hostname,
  isAdminDomain,
  rendering: isAdminDomain ? 'Admin Router' : 'Mobile App'
});
```

## 🔒 **COMPREHENSIVE SAFEGUARDS TO PREVENT RECURRENCE**

### **1. Automated Testing Suite**

#### **A. Smoke Tests**
```javascript
// tests/smoke/admin-access.spec.js
describe('Admin Access Smoke Tests', () => {
  test('admin.mindmeasure.co.uk serves admin interface', async () => {
    await page.goto('https://admin.mindmeasure.co.uk');
    await expect(page).toHaveURL(/sign-in|superuser-login|university/);
    await expect(page.locator('text=Mind Measure')).toBeVisible();
  });

  test('admin routes are accessible', async () => {
    const routes = ['/sign-in', '/superuser-login', '/university', '/cms'];
    for (const route of routes) {
      await page.goto(`https://admin.mindmeasure.co.uk${route}`);
      await expect(page).not.toHaveURL(/404|error/);
    }
  });
});
```

#### **B. Cross-Domain Tests**
```javascript
// tests/smoke/domain-routing.spec.js
describe('Domain Routing Tests', () => {
  test('admin domain serves admin interface', async () => {
    await page.goto('https://admin.mindmeasure.co.uk');
    const consoleMessages = [];
    page.on('console', msg => consoleMessages.push(msg.text()));
    await page.waitForTimeout(1000);
    expect(consoleMessages.some(msg => msg.includes('Admin Router'))).toBe(true);
  });

  test('mobile domain serves mobile app', async () => {
    await page.goto('https://mobile.mindmeasure.app');
    const consoleMessages = [];
    page.on('console', msg => consoleMessages.push(msg.text()));
    await page.waitForTimeout(1000);
    expect(consoleMessages.some(msg => msg.includes('Mobile App'))).toBe(true);
  });
});
```

### **2. Pre-Deployment Checks**

#### **A. Git Pre-Commit Hook**
```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "🔍 Running pre-commit checks..."

# Check if main.tsx was modified
if git diff --cached --name-only | grep -q "src/main.tsx"; then
  echo "⚠️  main.tsx modified - running critical path tests..."
  
  # Ensure both Router and App are imported
  if ! grep -q "import.*Router" src/main.tsx; then
    echo "❌ CRITICAL: Router import missing from main.tsx"
    exit 1
  fi
  
  if ! grep -q "import.*App" src/main.tsx; then
    echo "❌ CRITICAL: App import missing from main.tsx"
    exit 1
  fi
  
  # Ensure domain detection logic exists
  if ! grep -q "isAdminDomain\|hostname" src/main.tsx; then
    echo "❌ CRITICAL: Domain detection logic missing from main.tsx"
    exit 1
  fi
  
  echo "✅ main.tsx critical checks passed"
fi

echo "✅ Pre-commit checks completed"
```

#### **B. Build Verification**
```javascript
// scripts/verify-build.js
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying build integrity...');

// Check that both Router and App are in the build
const indexJs = fs.readFileSync(path.join('dist', 'assets', 'index-*.js'), 'utf8');

if (!indexJs.includes('Router') || !indexJs.includes('App')) {
  console.error('❌ CRITICAL: Build missing Router or App components');
  process.exit(1);
}

if (!indexJs.includes('hostname') || !indexJs.includes('isAdminDomain')) {
  console.error('❌ CRITICAL: Build missing domain detection logic');
  process.exit(1);
}

console.log('✅ Build verification passed');
```

### **3. Deployment Pipeline Safeguards**

#### **A. GitHub Actions Workflow**
```yaml
# .github/workflows/deploy-verification.yml
name: Deployment Verification

on:
  push:
    branches: [main]

jobs:
  verify-deployment:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build and verify
        run: |
          npm ci
          npm run build
          node scripts/verify-build.js
          
      - name: Deploy to staging
        run: npx vercel --prod
        
      - name: Wait for deployment
        run: sleep 30
        
      - name: Smoke test admin access
        run: |
          curl -f https://admin.mindmeasure.co.uk/sign-in || exit 1
          curl -f https://admin.mindmeasure.co.uk/superuser-login || exit 1
          
      - name: Smoke test mobile access
        run: |
          curl -f https://mobile.mindmeasure.app || exit 1
```

### **4. Monitoring & Alerting**

#### **A. Health Check Endpoints**
```typescript
// src/health/admin-health.ts
export const AdminHealthCheck = () => {
  useEffect(() => {
    // Report successful admin load
    if (window.location.hostname === 'admin.mindmeasure.co.uk') {
      fetch('/api/health/admin-loaded', { method: 'POST' });
    }
  }, []);
  
  return null;
};
```

#### **B. Uptime Monitoring**
```javascript
// monitoring/uptime-check.js
const checks = [
  'https://admin.mindmeasure.co.uk/sign-in',
  'https://admin.mindmeasure.co.uk/superuser-login',
  'https://admin.mindmeasure.co.uk/university',
  'https://mobile.mindmeasure.app'
];

setInterval(async () => {
  for (const url of checks) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        alert(`🚨 CRITICAL: ${url} is down (${response.status})`);
      }
    } catch (error) {
      alert(`🚨 CRITICAL: ${url} is unreachable`);
    }
  }
}, 60000); // Check every minute
```

### **5. Documentation Safeguards**

#### **A. Architecture Decision Record**
```markdown
# ADR-001: Domain-Based Routing in main.tsx

## Status: ACTIVE

## Context
Single build serves both admin and mobile interfaces on different domains.

## Decision
Use hostname detection in main.tsx to route to correct interface.

## Consequences
- NEVER modify main.tsx without domain routing logic
- ALWAYS test both admin and mobile access after changes
- ALWAYS run smoke tests before deployment

## Critical Rules
1. main.tsx MUST import both Router and App
2. main.tsx MUST have domain detection logic
3. Changes to main.tsx require manual verification
```

#### **B. Deployment Checklist**
```markdown
## 🚨 CRITICAL DEPLOYMENT CHECKLIST

Before ANY deployment:

- [ ] ✅ Both Router and App imported in main.tsx
- [ ] ✅ Domain detection logic present
- [ ] ✅ Build verification script passes
- [ ] ✅ Smoke tests pass locally
- [ ] ✅ Admin routes accessible at admin.mindmeasure.co.uk
- [ ] ✅ Mobile app works via Capacitor
- [ ] ✅ Console logs show correct routing

After deployment:
- [ ] ✅ Wait 60 seconds for propagation
- [ ] ✅ Manually test admin.mindmeasure.co.uk/sign-in
- [ ] ✅ Manually test admin.mindmeasure.co.uk/superuser-login
- [ ] ✅ Check browser console for domain detection logs
```

## 📊 **PROCESS IMPROVEMENTS**

### **1. Code Review Requirements**
- Any changes to `main.tsx` require 2 approvals
- Changes must include test results
- Must include deployment verification screenshots

### **2. Staging Environment**
- Create `staging.admin.mindmeasure.co.uk` for testing
- All changes tested in staging before production
- Automated promotion only after smoke tests pass

### **3. Rollback Procedures**
- Immediate rollback capability via Vercel
- Emergency contact list for critical issues
- Automated alerts for admin portal downtime

## 🎯 **SUCCESS METRICS**

- **Zero admin portal downtime** due to routing issues
- **100% smoke test coverage** for critical paths
- **< 5 minute detection time** for routing failures
- **< 1 minute rollback time** for critical issues

## 📝 **LESSONS LEARNED**

1. **Single point of failure**: main.tsx is critical infrastructure
2. **Testing gaps**: Manual testing insufficient for critical paths
3. **Monitoring blind spots**: No alerts for broken functionality
4. **Documentation confusion**: Conflicting domain information
5. **Process gaps**: No verification of admin access post-deployment

This incident analysis ensures this type of critical routing failure can never happen again.
