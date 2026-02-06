# Mind Measure Demo Testing Checklist

**Pre-Demo Testing Protocol for University of Worcester**

---

## **🔧 Technical Infrastructure Tests**

### **AWS Services Status**
- [ ] **Lambda Functions**: All 4 functions responding (analyze-text, analyze-audio, analyze-visual, calculate-mind-measure)
- [ ] **RDS Aurora**: Database connectivity and query performance
- [ ] **Cognito**: User authentication and JWT token generation
- [ ] **S3**: File storage and retrieval for university assets
- [ ] **Rekognition**: Face detection and emotion analysis
- [ ] **CloudWatch**: Logging and monitoring active

### **API Endpoints Health Check**
```bash
# Test these endpoints before demo:
curl -I https://api.mindmeasure.co.uk/health
curl -I https://4xg1jsjh7k.execute-api.eu-west-2.amazonaws.com/dev/analyze-text
curl -I https://admin.mindmeasure.co.uk/api/database/select
```

### **Domain Resolution**
- [ ] `mobile.mindmeasure.app` → Mobile app (Capacitor only)
- [ ] `admin.mindmeasure.co.uk` → Admin dashboard (Web only)
- [ ] `api.mindmeasure.co.uk` → API endpoints
- [ ] SSL certificates valid and not expiring

---

## **📱 Mobile App Testing (iOS & Android)**

### **Installation & Launch**
- [ ] **iOS**: App installs from TestFlight/App Store
- [ ] **Android**: App installs from Play Store/APK
- [ ] App launches without crashes
- [ ] University of Worcester branding displays correctly
- [ ] No console errors in development mode

### **Authentication Flow**
- [ ] **Registration**: New user can create account
- [ ] **Email Confirmation**: Confirmation emails sent and processed
- [ ] **Sign In**: Existing users can sign in
- [ ] **Password Reset**: Forgot password flow works
- [ ] **Auto-Assignment**: Users automatically assigned to Worcester
- [ ] **JWT Tokens**: Authentication tokens generated and validated

### **Baseline Assessment**
- [ ] **Permissions**: Camera and microphone permissions granted
- [ ] **ElevenLabs Widget**: Loads without errors
- [ ] **Conversation Flow**: 6-question script executes correctly
- [ ] **Audio Capture**: Voice analysis data collected
- [ ] **Visual Capture**: Camera frames captured for Rekognition
- [ ] **Transcript Capture**: Conversation text extracted
- [ ] **Assessment Completion**: Process completes without hanging

### **Data Pipeline Validation**
- [ ] **Text Analysis**: Lambda function processes transcript
- [ ] **Audio Analysis**: Lambda function processes voice data
- [ ] **Visual Analysis**: Lambda function processes camera frames
- [ ] **Score Calculation**: Fusion algorithm generates valid score (not 0)
- [ ] **Database Storage**: All data saved to correct tables
- [ ] **Profile Update**: User marked as baseline_established

### **Dashboard Display**
- [ ] **Score Display**: Real calculated score shown (not placeholder)
- [ ] **University Branding**: Worcester logo and colors
- [ ] **Personalization**: User's name displayed correctly
- [ ] **Time-based Greeting**: "Good morning/afternoon/evening"
- [ ] **Post-Baseline View**: Appropriate content for first-time users
- [ ] **Navigation**: Check-in and help buttons functional

---

## **💻 Admin Dashboard Testing**

### **Access & Authentication**
- [ ] **Admin Login**: `admin@worcester.ac.uk` account works
- [ ] **University Scoping**: Dashboard shows only Worcester data
- [ ] **Role Permissions**: Appropriate access levels enforced
- [ ] **Session Management**: Secure session handling

### **Dashboard Functionality**
- [ ] **Student Metrics**: Real data from test assessments
- [ ] **Analytics Charts**: Data visualization working
- [ ] **Real-time Updates**: New assessments appear promptly
- [ ] **Export Functions**: Data export capabilities
- [ ] **Filtering**: Date ranges and demographic filters

### **Content Management System**
- [ ] **University Profile**: Worcester details editable
- [ ] **Emergency Contacts**: Can add/edit/remove contacts
- [ ] **Mental Health Services**: Service directory management
- [ ] **Branding**: Logo upload and color customization
- [ ] **Content Publishing**: Changes appear in mobile app

### **User Management**
- [ ] **Add Users**: Can invite new admin users
- [ ] **Role Assignment**: Different permission levels
- [ ] **User Status**: Active/inactive user management
- [ ] **Audit Logs**: User action tracking

---

## **🔒 Security & Privacy Testing**

### **Data Protection**
- [ ] **Encryption**: All data encrypted in transit and at rest
- [ ] **Access Controls**: Proper authentication required
- [ ] **Data Isolation**: University data properly scoped
- [ ] **Audit Logging**: All actions logged for compliance
- [ ] **Data Retention**: Automatic cleanup policies active

### **Privacy Compliance**
- [ ] **Consent Management**: Clear privacy consent flow
- [ ] **Data Minimization**: Only necessary data collected
- [ ] **Right to Deletion**: User data deletion capability
- [ ] **Data Portability**: User data export available
- [ ] **Anonymization**: Analytics properly anonymized

---

## **⚡ Performance Testing**

### **Response Times**
- [ ] **App Launch**: < 3 seconds on mobile
- [ ] **Authentication**: < 2 seconds for login
- [ ] **Assessment Loading**: < 5 seconds for widget
- [ ] **Score Calculation**: < 30 seconds for complete pipeline
- [ ] **Dashboard Loading**: < 5 seconds for admin interface

### **Concurrent Users**
- [ ] **Multiple Assessments**: System handles 5+ simultaneous users
- [ ] **Database Performance**: No timeouts under load
- [ ] **Lambda Scaling**: Functions scale automatically
- [ ] **Memory Usage**: No memory leaks in long sessions

---

## **🎯 Demo-Specific Tests**

### **Demo Account Preparation**
- [ ] **Demo Student Account**: `demo.student@worcester.ac.uk` ready
- [ ] **Clean State**: No previous assessment data
- [ ] **Admin Account**: `admin@worcester.ac.uk` configured
- [ ] **Test Data**: Sample analytics data populated

### **Demo Flow Rehearsal**
- [ ] **Complete Assessment**: Full baseline assessment (5+ minutes)
- [ ] **Score Generation**: Real score calculated and displayed
- [ ] **Dashboard Navigation**: All admin features accessible
- [ ] **Error Handling**: Graceful error recovery
- [ ] **Timing**: Demo completes within 15-20 minutes

### **Backup Preparations**
- [ ] **Offline Materials**: Screenshots and videos ready
- [ ] **Alternative Devices**: Backup phones/tablets available
- [ ] **Network Alternatives**: Mobile hotspot ready
- [ ] **Demo Script**: Printed copy available

---

## **📊 Success Criteria**

### **Critical Must-Pass Tests**
1. **Authentication**: 100% success rate for login/registration
2. **Assessment Completion**: Baseline assessment completes without errors
3. **Score Calculation**: Non-zero, realistic scores generated
4. **Dashboard Display**: Real data appears correctly
5. **University Branding**: Worcester identity consistent throughout

### **Important Should-Pass Tests**
1. **Performance**: All operations complete within target times
2. **Multi-modal Analysis**: Audio, visual, and text analysis working
3. **Real-time Updates**: Dashboard reflects new assessments
4. **Mobile Responsiveness**: Works on various screen sizes
5. **Error Recovery**: System handles edge cases gracefully

### **Nice-to-Have Tests**
1. **Advanced Analytics**: Detailed trend analysis
2. **Export Functions**: Data export in multiple formats
3. **Customization**: Extensive branding options
4. **Integration**: SSO and SIS integration demos

---

## **🚨 Pre-Demo Final Checklist (Day of Demo)**

### **2 Hours Before Demo**
- [ ] Run complete test suite
- [ ] Verify all accounts and passwords
- [ ] Check network connectivity at demo location
- [ ] Prepare backup devices and materials
- [ ] Clear browser caches and app data

### **30 Minutes Before Demo**
- [ ] Final system health check
- [ ] Test demo accounts one more time
- [ ] Verify presentation materials loaded
- [ ] Check audio/video equipment
- [ ] Confirm attendee list and requirements

### **5 Minutes Before Demo**
- [ ] All devices charged and connected
- [ ] Demo accounts logged in and ready
- [ ] Backup materials accessible
- [ ] Emergency contact information available
- [ ] Confidence level: HIGH ✅

---

## **📝 Test Results Log**

### **Test Run #1 - [Date/Time]**
**Tester**: ________________  
**Environment**: ________________  
**Overall Status**: ⚪ PASS / ⚪ FAIL / ⚪ PARTIAL

**Critical Issues Found**:
- [ ] None
- [ ] Issue 1: ________________
- [ ] Issue 2: ________________

**Resolution Status**:
- [ ] All issues resolved
- [ ] Issues documented for post-demo fix
- [ ] Demo-blocking issues present

### **Test Run #2 - [Date/Time]**
**Tester**: ________________  
**Environment**: ________________  
**Overall Status**: ⚪ PASS / ⚪ FAIL / ⚪ PARTIAL

**Critical Issues Found**:
- [ ] None
- [ ] Issue 1: ________________
- [ ] Issue 2: ________________

**Resolution Status**:
- [ ] All issues resolved
- [ ] Issues documented for post-demo fix
- [ ] Demo-blocking issues present

---

**Final Demo Readiness**: ⚪ GO / ⚪ NO-GO  
**Sign-off**: ________________ **Date**: ________________





