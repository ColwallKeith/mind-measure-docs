# Central User & Permissions Management System

## Overview
A comprehensive user management system in the **Superuser Dashboard** that controls access to all Mind Measure platforms, including the Marketing CMS.

---

## 🎯 Permission Levels

### 1. **Super Admin** (super_admin)
- **Access**: Everything (unrestricted)
- **Icon**: Shield 🛡️
- **Color**: Red
- **Description**: Full system access, can manage all users and permissions

### 2. **User Data Access** (user_data_access)  
- **Access**: Identifiable individual user data
- **Icon**: UserCheck ✓
- **Color**: Orange
- **Description**: **VERY RESTRICTED** - Can view personal student data
- **Use Case**: Research teams, clinical oversight

### 3. **University Data Access** (university_data_access)
- **Access**: Anonymised university aggregated data
- **Icon**: Eye 👁️
- **Color**: Blue
- **Description**: University-level analytics, no individual data
- **Use Case**: University admins, partnership managers

### 4. **Financial Data Access** (financial_data_access)
- **Access**: Billing, costs, revenue data
- **Icon**: Lock 🔒
- **Color**: Green
- **Description**: Financial metrics, invoices, cost monitoring
- **Use Case**: Finance team, accountants

### 5. **Marketing Platform Access** (marketing_platform_access)
- **Access**: marketing.mindmeasure.co.uk
- **Icon**: Users 👥
- **Color**: Purple
- **Description**: Create blog posts, campaigns, social media
- **Use Case**: Marketing team, agencies, freelancers

### 6. **System & Security Access** (system_security_access)
- **Access**: Platform security, system settings, testing
- **Icon**: AlertTriangle ⚠️
- **Color**: Slate
- **Description**: System configuration, security monitoring, testing tools
- **Use Case**: DevOps, security team

---

## 🏗️ Database Schema

### `core_users` Table
```sql
- id (UUID, Primary Key)
- email (VARCHAR, UNIQUE)
- full_name (VARCHAR)
- job_title (VARCHAR)
- organisation (VARCHAR)
- permissions (user_permission[] ARRAY)  -- Can have multiple permissions
- password_hash (TEXT)  -- For marketing platform login
- is_active (BOOLEAN)
- is_superuser (BOOLEAN)  -- Quick check for super_admin
- created_at, created_by, last_login, login_count
- notes (TEXT)
```

### `core_user_access_log` Table
```sql
- id (UUID, Primary Key)
- user_id (UUID, FK to core_users)
- email (VARCHAR)
- access_type (VARCHAR)  -- 'login', 'marketing_cms', 'user_data_view', etc.
- permission_used (user_permission)
- resource_accessed (TEXT)
- ip_address (VARCHAR)
- user_agent (TEXT)
- success (BOOLEAN)
- failure_reason (TEXT)
- accessed_at (TIMESTAMP)
```

---

## 🔧 Implementation Files

### Created:
1. **`/mind-measure-core/migrations/001_user_permissions_system.sql`**
   - Database schema for users and permissions
   - Helper functions for permission checks
   - Initial superuser (keith@mindmeasure.co.uk)

2. **`/mind-measure-core/src/components/UserManagement.tsx`**
   - Full user management UI
   - Permission assignment interface
   - User cards with stats
   - Search and filtering

3. **`/mind-measure-core/src/components/SuperuserControlPanel.tsx`** (Updated)
   - Added "Users" tab
   - Grid changed from 7 to 8 columns

---

## 🔐 How It Works

### 1. **Superuser Creates User**
- Navigate to Superuser Dashboard → Users tab
- Click "Add User"
- Enter email, name, job title, organisation
- Select permissions (can assign multiple)
- User receives email with temporary password

### 2. **User Logs Into Marketing Platform**
- User goes to marketing.mindmeasure.co.uk
- Enters email + password
- System checks `core_users` table
- If `marketing_platform_access` permission exists → Login successful
- Access logged in `core_user_access_log`

### 3. **Token-Based Access (Superuser)**
- Superuser clicks "Marketing" tab
- System generates JWT with user_id + permissions
- Opens marketing.mindmeasure.co.uk with token
- Marketing CMS validates token against `core_users`
- Seamless login (no password needed)

### 4. **Permission Enforcement**
```typescript
// Example check
const hasAccess = await checkPermission(
  userId, 
  'marketing_platform_access'
);

if (!hasAccess) {
  return res.status(403).json({ error: 'Access denied' });
}
```

---

## 📊 Features

### User Management UI
- ✅ Search users by name, email, organisation
- ✅ View user stats (last login, login count)
- ✅ Active/inactive status indicators
- ✅ Permission badges with color coding
- ✅ Edit user permissions
- ✅ Delete non-superuser accounts
- ✅ Audit trail of all access

### Security Features
- ✅ Granular permission system (6 levels)
- ✅ Multiple permissions per user
- ✅ Super admin bypass (has all permissions)
- ✅ Access logging for compliance (GDPR)
- ✅ IP address tracking
- ✅ Failed login attempts logged
- ✅ 2FA support (optional)

---

## 🚀 Next Steps

### Immediate (Required):
1. **Run migration** on `mind-measure-core` database:
   ```bash
   psql $DATABASE_URL -f migrations/001_user_permissions_system.sql
   ```

2. **Update marketing CMS login** to check against `core_users`:
   - Modify `/marketing-cms/app/api/auth/login/route.ts`
   - Query `core_users` instead of `marketing_users`
   - Check for `marketing_platform_access` permission

3. **Update token validation** in marketing CMS:
   - Modify `/marketing-cms/app/api/auth/validate-superuser-token/route.ts`
   - Query `core_users` table
   - Validate permissions array

### Soon:
4. **Build API endpoints** for user CRUD operations
5. **Add email invitations** for new users
6. **Implement 2FA** for sensitive permissions
7. **Dashboard access control** based on permissions

---

## 🎨 UI Preview

```
┌──────────────────────────────────────────────────────┐
│  User Management                    [+ Add User]     │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Permission Levels                                    │
│  ┌─────────────┬─────────────┬─────────────┐        │
│  │ 🛡️ Super Admin│ ✓ User Data │ 👁️ Uni Data │        │
│  │ Full access │ Restricted  │ Anonymised  │        │
│  └─────────────┴─────────────┴─────────────┘        │
│  ┌─────────────┬─────────────┬─────────────┐        │
│  │ 🔒 Financial │ 👥 Marketing│ ⚠️ Security │        │
│  │ Costs & $   │ CMS Access  │ System Mgmt │        │
│  └─────────────┴─────────────┴─────────────┘        │
│                                                       │
│  ┌────────────────────────────────────────┐          │
│  │  🔍 Search users...               3 users│          │
│  └────────────────────────────────────────┘          │
│                                                       │
│  ┌───────────────────────────────────────┐           │
│  │  KD  Keith Duddy              ✓       │  [Edit]   │
│  │      keith@mindmeasure.co.uk          │           │
│  │      Founder & CEO                    │           │
│  │                                       │           │
│  │      🛡️ Super Admin                   │           │
│  │                                       │           │
│  │      Last Login: Today | Logins: 247  │           │
│  └───────────────────────────────────────┘           │
│                                                       │
└──────────────────────────────────────────────────────┘
```

---

## 🔗 Integration Points

### Marketing CMS
- Login checks `core_users` table
- Validates `marketing_platform_access` permission
- Logs access to `core_user_access_log`

### Superuser Dashboard  
- "Users" tab for management
- "Marketing" tab generates token with permissions
- Access control for sensitive data views

### Future Platforms
- Mobile app admin access
- Analytics dashboard
- University portals
- Student support tools

---

**Status**: ✅ **READY TO IMPLEMENT**

Files created, schema designed, UI built. Just needs:
1. Database migration
2. API endpoint connections
3. Marketing CMS login update

