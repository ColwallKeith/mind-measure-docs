# iOS Testing Checklist - Mind Measure Worcester Demo

## 📱 **PRE-TESTING VERIFICATION**

### ✅ **Completed Setup**
- [x] **Vercel Deployment**: `mobile.mindmeasure.app` working (200 OK)
- [x] **Environment Variables**: Consistent Cognito configuration
- [x] **Authentication Service**: AmplifyAuth aligned with AuthContext
- [x] **Capacitor Sync**: Web assets copied to iOS (`npx cap sync`)
- [x] **Xcode Project**: Opened successfully
- [x] **Configuration**: Using local assets (no server URL)

---

## 🎯 **TESTING SEQUENCE**

### **1. Device Connection & Build**
- [ ] **Connect Keith's iPhone** to Mac via USB
- [ ] **Select Device** in Xcode (Keith's iPhone)
- [ ] **Build & Run** the app (`⌘+R` or Play button)
- [ ] **Verify Installation** on device

### **2. App Launch & Architecture**
- [ ] **App Opens** without errors
- [ ] **Shows Mobile Interface** (not admin portal)
- [ ] **University of Worcester Branding** visible
- [ ] **No Console Errors** in Xcode logs

### **3. Authentication Flow**
- [ ] **Sign Up** with test email works
- [ ] **Email Confirmation** process works
- [ ] **Sign In** with confirmed account works
- [ ] **AWS Cognito** authentication successful

### **4. Baseline Assessment**
- [ ] **ElevenLabs Widget** loads correctly
- [ ] **Microphone Permission** requested and granted
- [ ] **Camera Permission** requested and granted
- [ ] **Jodie Voice** plays correctly
- [ ] **6-Question Script** follows exactly
- [ ] **User Responses** captured properly

### **5. Lambda Function Integration**
- [ ] **JWT Token** passed to Lambda functions
- [ ] **Audio Analysis** Lambda invoked
- [ ] **Visual Analysis** Lambda invoked  
- [ ] **Text Analysis** Lambda invoked
- [ ] **Mind Measure Calculation** Lambda invoked
- [ ] **No Authentication Errors** in logs

### **6. Dashboard Display**
- [ ] **Post-Baseline Dashboard** shows correctly
- [ ] **Score Displayed** (not 0 or error)
- [ ] **Greeting Shows Correct Time** (Good morning/afternoon/evening Keith)
- [ ] **Name Capitalized** correctly (Keith)
- [ ] **Subheading Correct**: "This is your baseline score, we use this to benchmark your future check-ins"
- [ ] **No Conversation Summary** visible (post-baseline view)
- [ ] **Recent Activity**: "Baseline Assessment Completed"

### **7. University Branding**
- [ ] **University of Worcester Logo** displayed
- [ ] **Correct Colors** (#1e40af primary)
- [ ] **Support Information** shows Worcester details
- [ ] **No Other Universities** visible

---

## 🔧 **TROUBLESHOOTING GUIDE**

### **Common Issues & Solutions**

#### **App Won't Build**
```bash
# Clean and rebuild
npx cap clean ios
npx cap sync
npx cap open ios
```

#### **Authentication Errors**
- Check Xcode console for Cognito errors
- Verify environment variables in build
- Confirm User Pool ID: `eu-west-2_ClAG4fQXR`

#### **Lambda Function Failures**
- Check for JWT token in requests
- Verify HIPAA endpoints: `https://l58pu5wb07.execute-api.eu-west-2.amazonaws.com/prod`
- Look for CORS or authentication errors

#### **ElevenLabs Issues**
- Verify microphone permissions granted
- Check Agent ID: `agent_9301k22s8e94f7qs5e704ez02npe`
- Ensure network connectivity

#### **Dashboard Data Issues**
- Check Lambda function logs in AWS CloudWatch
- Verify database connection to Aurora
- Confirm Keith's profile exists with `university_id: 'worcester'`

---

## 📊 **SUCCESS CRITERIA**

### **✅ Complete Success**
- App builds and runs without errors
- Authentication flow works end-to-end
- Baseline assessment completes successfully
- Score is calculated and displayed correctly
- Dashboard shows proper post-baseline view
- All Lambda functions execute successfully

### **⚠️ Partial Success**
- App runs but has minor UI issues
- Authentication works but dashboard has data issues
- Assessment completes but score calculation fails

### **❌ Failure**
- App won't build or crashes on launch
- Authentication completely fails
- ElevenLabs widget won't load
- Lambda functions return authentication errors

---

## 🎯 **NEXT STEPS AFTER TESTING**

### **If Successful**
1. **Mark TODO Complete**: iOS sync and testing ✅
2. **Update Demo Script**: Confirm all features working
3. **Prepare for Demo**: University of Worcester ready
4. **Document Results**: Create testing summary

### **If Issues Found**
1. **Log Specific Errors**: Capture console output
2. **Identify Root Cause**: Authentication, Lambda, or UI
3. **Apply Targeted Fixes**: Based on error type
4. **Re-test**: Verify fixes work

---

## 📱 **DEVICE REQUIREMENTS**

- **Keith's iPhone** connected via USB
- **iOS Development Certificate** active
- **Xcode** with proper provisioning profile
- **Network Connection** for API calls
- **Microphone/Camera Permissions** available

---

**Ready for testing! Connect Keith's iPhone and run the app in Xcode.**





