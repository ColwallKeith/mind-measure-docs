# University CMS Design Brief
## Mind Measure Institutional Content Management System

---

## 🎯 **Project Overview**

We need to design a comprehensive University Content Management System (CMS) that allows institutional administrators to input, manage, and customize key information for their student populations. This system will be integrated into the Mind Measure admin dashboard and accessible through the institutional login portal.

---

## 📊 **Current Database Schema Status**

### ✅ **EXISTING TABLES & INFRASTRUCTURE:**

#### **1. Universities Table** (`public.universities`)
**Comprehensive data structure already implemented with:**

**Basic Information:**
- University name, short name, website
- Primary/secondary colors for branding
- Contact email, phone, address, postcode
- Logo uploads (standard & dark mode)

**Student Demographics:**
- Total students, undergraduate, postgraduate
- International students, mature students
- Gender breakdown (male, female, non-binary)
- Students over 25

**Academic Structure (JSONB):**
- Faculties, schools, departments
- Flexible hierarchical structure

**Accommodation:**
- Student halls information

**Support Resources (JSONB):**
- Local resources
- Mental health services  
- **Emergency contacts** ⚠️
- Crisis support information

**Mind Measure Integration:**
- Launch dates, uptake rates
- Custom welcome messages
- Integration contact details

#### **2. Institutions Table** (`public.institutions`)
**Additional CMS features:**
- Domain management
- Admin user management
- Local help resources (JSONB)
- Report building configuration
- Branding customization
- Institutional settings

#### **3. Supporting Tables:**
- `institutional_users` - Staff access management
- `institutional_metrics` - Cross-institutional analytics
- `profiles` & `memberships` - User management

---

## 🎨 **Design Requirements**

### **1. CMS Dashboard Interface**

#### **Multi-Step Onboarding Form:**
Based on existing `UniversityOnboardingData` structure:

**Step 1: Basic Information**
- University name, short name, website
- Contact details (email, phone, address)
- Primary/secondary brand colors
- Logo upload (standard & dark variants)

**Step 2: Student Demographics**
- Total student population
- Breakdown by level (UG/PG), age, gender
- International student numbers
- Mature student statistics

**Step 3: Academic Structure**
- Faculty management (add/edit/remove)
- School/department hierarchy
- Dynamic form for organizational structure

**Step 4: Accommodation**
- Student halls information
- Capacity, contact details
- Location data

**Step 5: Support Resources** ⭐ **CRITICAL SECTION**
- **Emergency contacts** (24/7 services, primary contacts)
- Mental health services directory
- Local crisis support resources
- University counseling services
- External support organizations

**Step 6: Mind Measure Integration**
- Launch planning
- Target uptake rates
- Custom welcome messages
- Integration contact details

**Step 7: Branding & Customization**
- Advanced branding options
- Custom color schemes
- Logo management

### **2. Emergency Resources Management** 🚨

**Priority Features:**
- **24/7 Emergency Hotlines** (Samaritans, Crisis Text Line, etc.)
- **University-specific crisis contacts**
- **Local mental health services**
- **Campus security/safety contacts**
- **Medical emergency numbers**
- **International student support** (for diverse populations)

**Interface Requirements:**
- Quick add/edit emergency contacts
- Priority ordering (most critical first)
- Verification status indicators
- Contact testing functionality
- Bulk import from CSV/Excel

### **3. Help & Advice Content Management**

**Content Types:**
- **Crisis intervention guides**
- **Self-help resources**
- **Study support materials**
- **Wellbeing tips & strategies**
- **University-specific policies**
- **Local community resources**

**Content Editor:**
- Rich text editor with formatting
- Image/video upload capabilities
- Link management
- Content versioning
- Preview functionality

### **4. User Experience Design**

**Dashboard Layout:**
- Clean, institutional aesthetic
- University branding integration
- Mobile-responsive design
- Accessibility compliance (WCAG 2.1)

**Navigation:**
- Tabbed interface for different sections
- Progress indicators for multi-step forms
- Save draft functionality
- Bulk edit capabilities

**Data Validation:**
- Real-time form validation
- Required field indicators
- Format checking (phone numbers, emails, URLs)
- Duplicate detection

---

## 🛠 **Technical Integration Points**

### **Existing Components to Leverage:**
- `UniversityCMS.tsx` - Main CMS interface
- `InstitutionalLogin.tsx` - University-branded authentication
- `UniversityProfile` TypeScript interfaces
- Supabase RLS policies for data security

### **API Endpoints:**
- University data CRUD operations
- File upload for logos/images
- Bulk import/export functionality
- Real-time collaboration features

---

## 🎯 **User Personas**

### **Primary Users:**
1. **University Administrators** - Setting up initial configuration
2. **Student Services Staff** - Managing support resources
3. **IT Administrators** - Technical integration
4. **Mental Health Coordinators** - Crisis resource management

### **Use Cases:**
- **Initial university onboarding** (comprehensive setup)
- **Regular content updates** (emergency contacts, resources)
- **Crisis response preparation** (rapid resource deployment)
- **Branding updates** (seasonal/campaign changes)
- **Analytics review** (uptake rates, usage statistics)

---

## 📱 **Platform Requirements**

### **Access Methods:**
- Web-based CMS (primary)
- Mobile-responsive for emergency updates
- Tablet-optimized for presentations

### **Integration Requirements:**
- Single Sign-On (SSO) compatibility
- University directory integration
- Export to student apps/portals
- API access for third-party systems

---

## 🔒 **Security & Compliance**

### **Data Protection:**
- GDPR compliance for EU institutions
- FERPA compliance for US institutions
- Role-based access control
- Audit logging for all changes
- Data encryption at rest and in transit

### **Emergency Contact Verification:**
- Contact validation workflows
- Regular verification reminders
- Backup contact requirements
- Crisis escalation procedures

---

## 📈 **Success Metrics**

### **Adoption Metrics:**
- Time to complete initial setup
- Frequency of content updates
- User satisfaction scores
- Support ticket reduction

### **Impact Metrics:**
- Student engagement with resources
- Crisis response effectiveness
- Resource utilization rates
- Cross-institutional best practice sharing

---

## 🚀 **Implementation Priority**

### **Phase 1: Core CMS** (Immediate)
- Basic university information management
- Emergency contact management
- Simple content editing

### **Phase 2: Enhanced Features** (Next Sprint)
- Advanced branding customization
- Bulk import/export
- Content versioning

### **Phase 3: Advanced Analytics** (Future)
- Usage analytics dashboard
- Cross-institutional benchmarking
- Predictive insights

---

## 💡 **Design Inspiration**

**Reference Platforms:**
- WordPress admin (content management)
- Shopify admin (clean, functional design)
- Notion (flexible content structure)
- University websites (institutional branding)

**Key Design Principles:**
- **Institutional professionalism**
- **Crisis-ready accessibility**
- **Scalable content architecture**
- **Multi-university flexibility**

---

**Status:** ✅ Database schema complete, ready for UI/UX design
**Timeline:** Design phase can begin immediately
**Technical Support:** Full backend infrastructure already implemented
