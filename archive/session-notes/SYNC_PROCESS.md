# SAFE SYNC PROCESS
**Purpose:** Safely port updates from core project to mobile project without breaking anything

## 🛡️ **SAFETY RULES**

### **NEVER DO THESE:**
- ❌ **Never work directly** on mobile project
- ❌ **Never modify** mobile project files
- ❌ **Never deploy** mobile without testing
- ❌ **Never port** untested code
- ❌ **Never skip** backup steps

### **ALWAYS DO THESE:**
- ✅ **Always work** on core project first
- ✅ **Always test** in core before porting
- ✅ **Always backup** mobile project before changes
- ✅ **Always verify** mobile project still works
- ✅ **Always document** what was changed

## 🔄 **SYNC WORKFLOW**

### **Step 1: Development in Core**
1. **Work on core project** - make changes here
2. **Test thoroughly** - ensure everything works
3. **Document changes** - what was modified
4. **Create backup** - backup mobile project

### **Step 2: Safe Porting**
1. **Identify changes** - what needs to be ported
2. **Create port script** - automated porting
3. **Test in isolation** - verify mobile still works
4. **Deploy carefully** - with rollback plan

### **Step 3: Verification**
1. **Test mobile app** - ensure functionality works
2. **Check database** - verify connections work
3. **Test assessment** - ensure scoring works
4. **Verify UI** - check all screens work

## 📋 **PORTING CHECKLIST**

### **Before Porting:**
- [ ] Core project changes tested and working
- [ ] Mobile project backed up
- [ ] Changes documented
- [ ] Port script created
- [ ] Rollback plan ready

### **During Porting:**
- [ ] Port one component at a time
- [ ] Test after each port
- [ ] Verify database connections
- [ ] Check UI rendering
- [ ] Test core functionality

### **After Porting:**
- [ ] Mobile app builds successfully
- [ ] All screens render correctly
- [ ] Database operations work
- [ ] Assessment flow works
- [ ] Voice functionality works
- [ ] User management works

## 🚨 **EMERGENCY PROCEDURES**

### **If Mobile Breaks:**
1. **STOP** - Don't make more changes
2. **RESTORE** - Use latest backup
3. **VERIFY** - Ensure mobile works
4. **ANALYZE** - What went wrong
5. **FIX** - Address the issue
6. **RETEST** - Verify fix works

### **If Core Breaks:**
1. **STOP** - Don't port anything
2. **FIX** - Address core issues first
3. **TEST** - Ensure core works
4. **THEN** - Proceed with porting

## 📁 **FILE ORGANIZATION**

### **Core Project Structure:**
```
mind-measure-core/
├── src/
│   ├── components/mobile/     # Mobile components
│   ├── hooks/                # Mobile hooks
│   ├── pages/                # Mobile pages
│   └── services/             # Backend services
├── MOBILE_COMPONENTS_AUDIT.md
└── SYNC_PROCESS.md
```

### **Mobile Project Structure:**
```
mind-measure-mobile/
├── src/
│   ├── components/           # Ported components
│   ├── hooks/               # Ported hooks
│   ├── pages/               # Ported pages
│   └── services/            # Ported services
├── BACKUP_YYYYMMDD_HHMMSS/  # Backups
└── PORT_LOG.md             # Porting log
```

## 🔧 **PORTING SCRIPTS**

### **Component Port Script:**
```bash
#!/bin/bash
# Port a single component from core to mobile

COMPONENT=$1
if [ -z "$COMPONENT" ]; then
    echo "Usage: ./port-component.sh ComponentName"
    exit 1
fi

echo "🔄 Porting $COMPONENT..."

# Create backup
BACKUP_DIR="BACKUP_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r src/ "$BACKUP_DIR/"

# Port component
cp "../mind-measure-core/src/components/mobile/$COMPONENT.tsx" "src/components/"
cp "../mind-measure-core/src/hooks/use$COMPONENT.ts" "src/hooks/" 2>/dev/null || true

# Test build
npm run build
if [ $? -eq 0 ]; then
    echo "✅ $COMPONENT ported successfully"
else
    echo "❌ Port failed, restoring backup"
    rm -rf src/
    mv "$BACKUP_DIR/src" ./
    rm -rf "$BACKUP_DIR"
    exit 1
fi
```

### **Full Sync Script:**
```bash
#!/bin/bash
# Full sync from core to mobile

echo "🔄 Starting full sync..."

# Create backup
BACKUP_DIR="BACKUP_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r src/ "$BACKUP_DIR/"

# Port all mobile components
cp -r "../mind-measure-core/src/components/mobile/"* "src/components/"
cp -r "../mind-measure-core/src/hooks/"* "src/hooks/"
cp -r "../mind-measure-core/src/pages/Mobile"* "src/pages/"

# Test build
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Full sync completed successfully"
    echo "📦 Backup available at: $BACKUP_DIR"
else
    echo "❌ Sync failed, restoring backup"
    rm -rf src/
    mv "$BACKUP_DIR/src" ./
    rm -rf "$BACKUP_DIR"
    exit 1
fi
```

## 📊 **MONITORING**

### **Port Log Template:**
```markdown
# PORT LOG - YYYY-MM-DD

## Changes Ported
- [ ] ComponentName.tsx
- [ ] HookName.ts
- [ ] PageName.tsx

## Issues Encountered
- Issue 1: Description
- Issue 2: Description

## Resolution
- Issue 1: How it was fixed
- Issue 2: How it was fixed

## Testing Results
- [ ] Mobile app builds
- [ ] All screens render
- [ ] Database works
- [ ] Assessment works
- [ ] Voice works

## Next Steps
- What to port next
- Any follow-up needed
```

## 🎯 **SUCCESS METRICS**

- ✅ **Zero mobile app breakages**
- ✅ **All ports successful**
- ✅ **Mobile app always builds**
- ✅ **All functionality works**
- ✅ **Database connections stable**
- ✅ **Assessment system functional**
