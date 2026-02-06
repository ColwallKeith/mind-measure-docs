# BUILD PIPELINE
**Purpose:** Safe build and deployment process for mobile app

## 🏗️ **BUILD PIPELINE OVERVIEW**

### **Development Flow:**
1. **Develop in Core** - All changes made here
2. **Test in Core** - Ensure everything works
3. **Port to Mobile** - Safe porting process
4. **Test Mobile** - Verify mobile works
5. **Deploy Mobile** - Deploy to app stores

## 🔄 **BUILD STAGES**

### **Stage 1: Core Development**
```bash
# Work on core project
cd mind-measure-core
npm run dev

# Make changes
# Test functionality
# Verify database connections
# Test assessment flow
```

### **Stage 2: Core Testing**
```bash
# Test core project
npm run build
npm run test  # if tests exist

# Verify:
# - All components render
# - Database operations work
# - Assessment system works
# - Voice functionality works
```

### **Stage 3: Safe Porting**
```bash
# Port single component
./port-component.sh ComponentName

# OR port everything
./port-full-sync.sh
```

### **Stage 4: Mobile Testing**
```bash
# Test mobile project
cd ../mind-measure-mobile
npm run build
npm run test  # if tests exist

# Verify:
# - Mobile app builds
# - All screens render
# - Database connections work
# - Assessment flow works
```

### **Stage 5: Mobile Deployment**
```bash
# Deploy mobile app
npm run build
npx cap sync
npx cap run ios
npx cap run android
```

## 🛡️ **SAFETY CHECKS**

### **Before Any Port:**
- [ ] Core project builds successfully
- [ ] Core project tests pass
- [ ] All functionality works in core
- [ ] Mobile project backed up
- [ ] Port script ready

### **After Any Port:**
- [ ] Mobile project builds successfully
- [ ] Mobile project tests pass
- [ ] All screens render correctly
- [ ] Database operations work
- [ ] Assessment flow works
- [ ] Voice functionality works

## 🚨 **EMERGENCY PROCEDURES**

### **If Core Breaks:**
1. **STOP** - Don't port anything
2. **FIX** - Address core issues
3. **TEST** - Verify core works
4. **THEN** - Proceed with porting

### **If Mobile Breaks:**
1. **STOP** - Don't make more changes
2. **RESTORE** - Use latest backup
3. **VERIFY** - Ensure mobile works
4. **ANALYZE** - What went wrong
5. **FIX** - Address the issue
6. **RETEST** - Verify fix works

## 📊 **BUILD MONITORING**

### **Build Status Dashboard:**
```markdown
# BUILD STATUS - YYYY-MM-DD

## Core Project
- [ ] Builds successfully
- [ ] Tests pass
- [ ] Database works
- [ ] Assessment works
- [ ] Voice works

## Mobile Project
- [ ] Builds successfully
- [ ] Tests pass
- [ ] All screens render
- [ ] Database works
- [ ] Assessment works
- [ ] Voice works

## Deployment
- [ ] Mobile app ready
- [ ] App store ready
- [ ] Production ready
```

## 🔧 **AUTOMATED SCRIPTS**

### **Daily Build Check:**
```bash
#!/bin/bash
# daily-build-check.sh

echo "🔍 Daily build check starting..."

# Check core project
cd mind-measure-core
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Core project builds successfully"
else
    echo "❌ Core project build failed"
    exit 1
fi

# Check mobile project
cd ../mind-measure-mobile
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Mobile project builds successfully"
else
    echo "❌ Mobile project build failed"
    exit 1
fi

echo "✅ All builds successful!"
```

### **Pre-Deployment Check:**
```bash
#!/bin/bash
# pre-deployment-check.sh

echo "🚀 Pre-deployment check starting..."

# Check core project
cd mind-measure-core
npm run build
npm run test  # if tests exist

# Check mobile project
cd ../mind-measure-mobile
npm run build
npm run test  # if tests exist

# Check database connections
# Check assessment flow
# Check voice functionality

echo "✅ Ready for deployment!"
```

## 📋 **DEPLOYMENT CHECKLIST**

### **Before Deployment:**
- [ ] Core project builds and tests pass
- [ ] Mobile project builds and tests pass
- [ ] All functionality works
- [ ] Database connections stable
- [ ] Assessment system functional
- [ ] Voice functionality works
- [ ] UI renders correctly
- [ ] User management works

### **During Deployment:**
- [ ] Deploy to staging first
- [ ] Test staging thoroughly
- [ ] Deploy to production
- [ ] Monitor deployment
- [ ] Verify production works

### **After Deployment:**
- [ ] Monitor app performance
- [ ] Check error logs
- [ ] Verify user feedback
- [ ] Monitor database usage
- [ ] Check assessment accuracy

## 🎯 **SUCCESS METRICS**

- ✅ **Zero build failures**
- ✅ **All tests pass**
- ✅ **Mobile app always works**
- ✅ **Database always connected**
- ✅ **Assessment system functional**
- ✅ **Voice functionality works**
- ✅ **UI always renders**
- ✅ **User management works**

## 📞 **ESCALATION**

If builds fail:
1. **Check logs** - What went wrong
2. **Restore backup** - Use working version
3. **Fix issue** - Address the problem
4. **Retest** - Verify fix works
5. **Deploy** - Deploy working version
6. **Document** - What happened and why
