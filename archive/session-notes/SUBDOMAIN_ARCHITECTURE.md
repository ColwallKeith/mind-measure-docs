# Mind Measure Subdomain Architecture

## 🏗️ **Current Domain Structure**

### **Perfect Domain Division:**
- **`.app` domain** → Student-facing mobile application
- **`.co.uk` domain** → Admin/institutional management platform

This creates excellent separation between:
- **Students** use `mobile.mindmeasure.app` 
- **University staff** use `cms.mindmeasure.co.uk`
- **Public marketing** uses `mindmeasure.app`

### **Primary Domains:**
```
mobile.mindmeasure.app              # Mobile app (existing deployment)
mindmeasure.app                     # Public content & marketing
cms.mindmeasure.co.uk             # Admin platform (current deployment)
```

### **Future Expansion:**
```
api.mindmeasure.co.uk               # API endpoints (if needed)
docs.mindmeasure.co.uk              # Public documentation
status.mindmeasure.co.uk            # System status page
```

## 🎯 **Current Deployment: Admin Subdomain**

### **Why cms.mindmeasure.co.uk?**

**🔒 Security Benefits:**
- **Origin Isolation** - Admin completely separate from public mobile app
- **CSP Policies** - Different security headers for admin vs mobile
- **Cookie Isolation** - Admin sessions can't interfere with mobile sessions
- **Attack Surface** - Compromise of one doesn't affect the other

**👥 User Experience:**
- **Professional URLs** - Universities see clean `cms.mindmeasure.co.uk/cms`
- **Clear Context** - Staff know they're in admin mode
- **Bookmarking** - Easy to bookmark admin-specific pages
- **Branding** - Distinct admin identity

**🚀 Technical Advantages:**
- **Independent Deployment** - Admin can be updated without affecting mobile
- **Scaling** - Different performance optimization for admin vs mobile
- **Analytics** - Clean separation of admin vs student usage data
- **CDN Configuration** - Different caching strategies

## 📊 **URL Structure**

### **Admin Platform (cms.mindmeasure.co.uk):**
```
https://cms.mindmeasure.co.uk/                    # Admin dashboard
├── /sign-in                                        # Admin authentication
├── /institutional-login                            # University staff login
├── /superuser-login                               # Superuser login
├── /cms                                           # Content management system
├── /university                                    # University dashboard
├── /superuser                                     # Superuser control panel
└── /demo                                          # Feature demonstration
```

### **Mobile App (mobile.mindmeasure.app - Existing):**
```
https://mobile.mindmeasure.app/                    # Mobile app entry
├── /auth                                          # Student authentication
├── /dashboard                                     # Student dashboard
├── /conversation                                  # AI conversation
├── /emergency                                     # Emergency contacts
├── /resources                                     # University resources
├── /profile                                       # Student profile
├── /about                                         # Public information
├── /privacy                                       # Privacy policy
└── /terms                                         # Terms of service
```

## 🛠️ **Implementation Details**

### **DNS Configuration:**
```dns
# Main domain
A       @              76.76.19.61          # Future mobile app
CNAME   www            cname.vercel-dns.com

# Admin subdomain  
CNAME   admin          cname.vercel-dns.com # Current admin platform

# Future subdomains
CNAME   api            api-server.domain.com
CNAME   docs           docs-site.domain.com
CNAME   status         status-page.domain.com
```

### **Vercel Projects:**
```
mind-measure-admin     → cms.mindmeasure.co.uk
mind-measure-mobile    → mobile.mindmeasure.app (existing)
mind-measure-public    → mindmeasure.app (marketing site)
mind-measure-docs      → docs.mindmeasure.co.uk (future)
```

### **Environment Variables:**
```bash
# Admin Platform
VITE_SUPABASE_URL=https://admin-project.supabase.co
VITE_SUPABASE_ANON_KEY=admin-anon-key
VITE_APP_URL=https://cms.mindmeasure.co.uk

# Mobile App (Existing)
VITE_SUPABASE_URL=https://mobile-project.supabase.co
VITE_SUPABASE_ANON_KEY=mobile-anon-key
VITE_APP_URL=https://mobile.mindmeasure.app
```

## 🔐 **Security Considerations**

### **Cross-Origin Policies:**
- **Admin Platform**: Strict CSP, no external scripts except Supabase
- **Mobile App**: More permissive for ElevenLabs, AWS services
- **API Endpoints**: CORS configured for specific origins only

### **Authentication Isolation:**
- **Admin**: `@mindmeasure.co.uk` domain-based authentication
- **Mobile**: Student authentication with university verification
- **No Cross-Contamination**: Separate session stores

### **Data Access:**
- **Admin**: Full CMS access, university management
- **Mobile**: Student data only, university-specific content
- **RLS Policies**: Different policies for admin vs mobile users

## 📈 **Analytics & Monitoring**

### **Separate Tracking:**
```javascript
// Admin Platform
gtag('config', 'GA-ADMIN-ID', {
  custom_map: { dimension1: 'admin_platform' }
});

// Mobile App  
gtag('config', 'GA-MOBILE-ID', {
  custom_map: { dimension1: 'mobile_app' }
});
```

### **Performance Monitoring:**
- **Admin**: Focus on CMS performance, file upload speeds
- **Mobile**: Focus on conversation loading, mobile performance

## 🚀 **Deployment Strategy**

### **Current (Phase 1):**
1. Deploy admin platform to `cms.mindmeasure.co.uk`
2. Configure DNS for admin subdomain
3. Test all admin functionality
4. Go live with university staff

### **Integration (Phase 2):**
1. Connect existing mobile app at `mindmeasure.app`
2. Integrate with admin-created content from CMS
3. Update mobile app to pull university data from admin platform
4. Test cross-domain content delivery
5. Launch integrated experience

## 🎯 **Benefits Summary**

**For Universities:**
- Professional admin URLs (`cms.mindmeasure.co.uk/cms`)
- Clear separation between staff and student interfaces
- Dedicated admin performance optimization

**For Students:**
- Clean mobile app URL (`mindmeasure.co.uk`)
- Mobile-optimized experience
- No confusion with admin interfaces

**For Development:**
- Independent deployment cycles
- Separate error tracking and monitoring
- Clear architectural boundaries
- Easier scaling and optimization

## 📋 **Migration Checklist**

- [x] Update `vercel.json` for admin subdomain
- [x] Update deployment documentation
- [x] Update production checklist
- [x] Configure environment variables
- [ ] Set up DNS records for admin subdomain
- [ ] Deploy to cms.mindmeasure.co.uk
- [ ] Test all admin functionality
- [ ] Update any hardcoded URLs in code

**This subdomain architecture provides the best foundation for a professional, scalable, and secure Mind Measure platform.** 🏗️
