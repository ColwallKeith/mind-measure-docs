# CORE PROJECT CLEANUP PLAN
**Purpose:** Remove legacy frontend code that's causing conflicts and cluttering the project

## 🎯 **CLEANUP STRATEGY**

### **Phase 1: Quick Wins (Remove Obvious Legacy)**
- Remove all Worcester-specific components
- Remove old admin dashboards
- Remove demo/test components
- Remove legacy CSS files

### **Phase 2: Institutional Cleanup**
- Remove old university dashboard components
- Keep only the clean institutional dashboard code
- Remove duplicate/conflicting CSS

### **Phase 3: Mobile Focus**
- Keep only mobile components and hooks
- Remove web-app specific components
- Clean up unused services

## 🗑️ **FILES TO REMOVE (Phase 1)**

### **Worcester Legacy (Remove All)**
```
src/pages/WorcesterDashboard.tsx
src/pages/WorcesterDashboard.css
src/pages/WorcesterHelp.tsx
src/pages/WorcesterLanding.tsx
src/components/institutional/WorcesterDashboard.tsx
```

### **Old Admin Dashboards (Remove All)**
```
src/pages/AdminAssets.tsx
src/pages/AdminDashboard.tsx
src/pages/BootstrapAdmin.tsx
src/pages/NoDatabaseBootstrapAdmin.tsx
src/pages/SimpleBootstrapAdmin.tsx
src/components/AdminNav.tsx
src/components/ProtectedAdminRoute.tsx
```

### **Demo/Test Components (Remove All)**
```
src/pages/DemoPage.tsx
src/pages/MobileDemoPage.tsx
src/components/DemoConversation.tsx
src/components/WorkingDemoConversation.tsx
src/components/TestComponent.tsx
src/components/PollyTest.tsx
src/components/GPTCapabilityTest.tsx
```

### **Legacy CSS (Remove All)**
```
src/pages/WorcesterDashboard.css
src/pages/InstitutionalDashboardOriginal.css
src/components/institutional/original/styles/globals.css
```

## 🔄 **FILES TO KEEP (Core Functionality)**

### **Mobile Components (Keep All)**
```
src/components/mobile/          # All mobile components
src/hooks/                      # All mobile hooks
src/pages/Mobile*               # Mobile pages
```

### **Institutional Dashboard (Keep Clean Version)**
```
src/pages/InstitutionalDashboard.tsx
src/pages/InstitutionalDashboard.css
src/components/institutional/InstitutionalDashboardComponents.tsx
src/components/institutional/InstitutionalOnboarding.tsx
src/components/institutional/InstitutionalRouter.tsx
```

### **SuperUser Portal (Keep Clean Version)**
```
src/pages/SuperUserPortal.tsx
src/components/institutional/SuperUserPortal.tsx
```

### **Core Services (Keep All)**
```
src/services/                   # All backend services
src/integrations/              # All integrations
src/types/                     # All types
src/data/                      # All data
```

## 🚀 **CLEANUP SCRIPT**

Let me create a safe cleanup script that removes the legacy code:

```bash
#!/bin/bash
# cleanup-legacy.sh - Safe cleanup of legacy code

echo "🧹 Starting legacy code cleanup..."

# Create backup
BACKUP_DIR="BACKUP_$(date +%Y%m%d_%H%M%S)"
echo "📦 Creating backup: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"
cp -r src/ "$BACKUP_DIR/"

# Remove Worcester legacy
echo "🗑️ Removing Worcester legacy..."
rm -f src/pages/WorcesterDashboard.tsx
rm -f src/pages/WorcesterDashboard.css
rm -f src/pages/WorcesterHelp.tsx
rm -f src/pages/WorcesterLanding.tsx
rm -f src/components/institutional/WorcesterDashboard.tsx

# Remove old admin dashboards
echo "🗑️ Removing old admin dashboards..."
rm -f src/pages/AdminAssets.tsx
rm -f src/pages/AdminDashboard.tsx
rm -f src/pages/BootstrapAdmin.tsx
rm -f src/pages/NoDatabaseBootstrapAdmin.tsx
rm -f src/pages/SimpleBootstrapAdmin.tsx
rm -f src/components/AdminNav.tsx
rm -f src/components/ProtectedAdminRoute.tsx

# Remove demo/test components
echo "🗑️ Removing demo/test components..."
rm -f src/pages/DemoPage.tsx
rm -f src/pages/MobileDemoPage.tsx
rm -f src/components/DemoConversation.tsx
rm -f src/components/WorkingDemoConversation.tsx
rm -f src/components/TestComponent.tsx
rm -f src/components/PollyTest.tsx
rm -f src/components/GPTCapabilityTest.tsx

# Remove legacy CSS
echo "🗑️ Removing legacy CSS..."
rm -f src/pages/InstitutionalDashboardOriginal.css
rm -rf src/components/institutional/original/

# Test build
echo "🔨 Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Cleanup completed successfully!"
    echo "📦 Backup available at: $BACKUP_DIR"
    echo "🚀 Core project is now clean and focused"
else
    echo "❌ Cleanup failed, restoring backup..."
    rm -rf src/
    mv "$BACKUP_DIR/src" ./
    rm -rf "$BACKUP_DIR"
    echo "🔄 Project restored to previous state"
    exit 1
fi
```

## 📊 **EXPECTED RESULTS**

After cleanup:
- **~50% fewer files** in components
- **No CSS conflicts** between legacy and modern
- **Cleaner build process** without unused code
- **Focused on mobile** and institutional dashboards
- **Easier to maintain** and debug

## 🎯 **NEXT STEPS**

1. **Run cleanup script** - Remove legacy code
2. **Test build** - Ensure everything still works
3. **Restore dashboards** - Add back clean institutional/superuser code
4. **Focus on mobile** - Get mobile app fully functional
5. **Clean development** - No more CSS conflicts or legacy issues

**This will make the core project much more manageable and focused! 🎉**
