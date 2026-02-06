# MOBILE COMPONENTS AUDIT
**Created:** $(date)
**Purpose:** Document all mobile-specific components in core project for safe porting

## 📱 **MOBILE COMPONENTS (33 files)**

### **Core Mobile Components**
- `MobileAppStructure.tsx` - Main app structure
- `MobileAppWrapper.tsx` - App wrapper with context
- `MobileLandingPage.tsx` - Landing page
- `MobileDashboard.tsx` - Main dashboard
- `MobileProfile.tsx` - User profile
- `MobileSettings.tsx` - App settings
- `MobileBuddies.tsx` - Buddy system
- `MobileCheckin.tsx` - Check-in flow
- `MobileConversation.tsx` - Voice conversations

### **Assessment Components**
- `BaselineAssessment.tsx` - Initial assessment
- `BaselineWelcome.tsx` - Welcome screen
- `BaselineWelcomeScreen.tsx` - Welcome screen variant
- `CheckinAssessment.tsx` - Regular check-ins
- `AssessmentBaseline.tsx` - Baseline flow
- `AssessmentCheckin.tsx` - Check-in flow
- `AssessmentReport.tsx` - Results display

### **Onboarding & Registration**
- `NewUserOnboarding.tsx` - New user flow
- `RegistrationScreen.tsx` - User registration
- `UniversityRegistration.tsx` - University signup
- `WelcomeBack.tsx` - Returning user
- `ReturningSplashScreen.tsx` - Splash screen
- `PrivacyTerms.tsx` - Privacy/terms

### **Dashboard & Insights**
- `InsightsSection.tsx` - User insights
- `ScoreCard.tsx` - Score display
- `ScoreHero.tsx` - Score hero section
- `WeeklySummary.tsx` - Weekly reports
- `TrendRangeToggle.tsx` - Trend controls

### **Social Features**
- `BuddyOfferModal.tsx` - Buddy invitations
- `NudgeCard.tsx` - Nudge notifications
- `NudgesBanner.tsx` - Nudge banner
- `StreakChip.tsx` - Streak display
- `TopicsChips.tsx` - Topic tags

### **Help & Support**
- `HelpPage.tsx` - Help system
- `EmergencyHelp.tsx` - Emergency support
- `UniversityResources.tsx` - University resources

## 🎣 **MOBILE HOOKS (22 files)**

### **Assessment Hooks**
- `useAdaptiveAssessment.ts` - Adaptive assessment logic
- `useBaselineConversation.ts` - Baseline conversation
- `useCheckinConversation.ts` - Check-in conversation
- `useSessionScoring.ts` - Session scoring
- `useSessionFeatures.ts` - Session features

### **Voice & Audio**
- `useVoiceMode.ts` - Voice mode management
- `useVoiceRouter.ts` - Voice routing
- `useElevenLabsEvents.ts` - ElevenLabs integration
- `useRekognitionSampler.ts` - AWS Rekognition

### **User Management**
- `useUserRole.ts` - User role management
- `useUserPreferences.ts` - User preferences
- `useUserAssessmentHistory.ts` - Assessment history
- `useUniversityData.ts` - University data

### **Dashboard & Data**
- `useDashboardData.ts` - Dashboard data
- `useSummary.ts` - Summary generation
- `useNudges.ts` - Nudge system
- `useProactiveEngagement.ts` - Proactive engagement

### **Technical Hooks**
- `use-mobile.tsx` - Mobile detection
- `use-toast.ts` - Toast notifications
- `usePWA.ts` - PWA functionality
- `useResumeLastSession.ts` - Session resumption
- `useCostTracking.ts` - Cost tracking

## 📄 **MOBILE PAGES (2 files)**

### **Mobile-Specific Pages**
- `MobileDemoPage.tsx` - Demo page
- `MobileLanding.tsx` - Mobile landing

## 🔧 **MOBILE SERVICES**

### **Database Services**
- `SupabaseService.ts` - Database operations
- `AWSService.ts` - AWS services
- `BackendServiceFactory.ts` - Service factory

### **Integrations**
- `supabase/client.ts` - Supabase client
- `supabase/types.ts` - Type definitions
- `supabase/capacitor-storage.ts` - Capacitor storage

## 🎨 **MOBILE UI COMPONENTS**

### **Charts & Visualizations**
- `TrendChartMobile.tsx` - Mobile trend charts
- `TrendSparkline.tsx` - Sparkline charts

### **Assessment UI**
- `MoodScale.tsx` - Mood rating scale
- `ValidatedScaleComponent.tsx` - Validated scales
- `SwipeableAssessmentItem.tsx` - Swipeable items

### **Voice & Audio**
- `VoiceAssessment.tsx` - Voice assessment
- `CheckinVoiceAssessment.tsx` - Check-in voice
- `CheckinVoiceAssessmentEL.tsx` - ElevenLabs voice
- `AudioWaveform.tsx` - Audio visualization

### **Navigation & Layout**
- `BottomNav.tsx` - Bottom navigation
- `NavigationMenu.tsx` - Navigation menu
- `PageHeader.tsx` - Page headers
- `Section.tsx` - Page sections

## 📊 **DEPENDENCIES TO PORT**

### **Critical Dependencies**
- **Supabase integration** - Database connection
- **ElevenLabs integration** - Voice processing
- **AWS services** - Rekognition, Polly
- **Assessment system** - Core scoring logic
- **User management** - Authentication, roles
- **University system** - Institution management

### **Data Flow**
- **Assessment data** - Baseline → Check-in → Reports
- **User preferences** - Settings, notifications
- **University data** - Institution-specific content
- **Buddy system** - Social features
- **Nudge system** - Proactive engagement

## 🚨 **CRITICAL COMPONENTS**

### **Must Port (Core Functionality)**
1. `MobileAppStructure.tsx` - App structure
2. `MobileDashboard.tsx` - Main dashboard
3. `BaselineAssessment.tsx` - Initial assessment
4. `CheckinAssessment.tsx` - Regular check-ins
5. `useSessionScoring.ts` - Scoring logic
6. `useVoiceMode.ts` - Voice functionality
7. `SupabaseService.ts` - Database operations

### **Important (User Experience)**
1. `MobileProfile.tsx` - User profile
2. `MobileSettings.tsx` - Settings
3. `MobileBuddies.tsx` - Social features
4. `useNudges.ts` - Nudge system
5. `WeeklySummary.tsx` - Reports

### **Nice to Have (Enhancements)**
1. `NudgeCard.tsx` - Notifications
2. `StreakChip.tsx` - Gamification
3. `TopicsChips.tsx` - Topic tags
4. `EmergencyHelp.tsx` - Emergency support

## 🔄 **SYNC STRATEGY**

### **Phase 1: Core Components**
- Port essential mobile components
- Set up database connections
- Implement basic assessment flow

### **Phase 2: User Experience**
- Port user management
- Implement settings and preferences
- Add social features

### **Phase 3: Advanced Features**
- Port voice functionality
- Implement nudge system
- Add reporting and insights

### **Phase 4: Polish**
- Port UI enhancements
- Add emergency features
- Implement advanced analytics
