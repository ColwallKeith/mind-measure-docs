# Clinical Tier Partnership Model

**Status:** Proposed  
**Date:** January 2026  
**Priority:** Medium  
**Timeline:** 12-24 months

---

## Executive Summary

Expand Mind Measure from a wellness-only platform to a two-tier model that includes a **Clinical Partnership Tier** for universities. This tier would enable administration of full diagnostic assessments (PHQ-9, GAD-7) under the clinical governance of university counseling services, positioning Mind Measure as care coordination infrastructure rather than a consumer wellness app.

---

## Problem/Opportunity

### Current Limitations (Wellness-Only Model):
- **PHQ-2/GAD-2 are screening tools only** - Limited clinical value, don't provide diagnostic detail
- **Reports lack depth** for GPs/therapists - Clinicians want PHQ-9 (0-27) and GAD-7 (0-21) scores
- **Can't cross clinical threshold** - Adding diagnostic tools as self-service creates significant liability, duty of care, and regulatory issues

### Opportunity:
- **University counseling services are overwhelmed** - Long wait times, reactive care model
- **Need for proactive identification** - Catch students deteriorating before crisis
- **Lack of longitudinal data** - Therapists only see students in sessions, no daily mood data
- **Revenue expansion** - Clinical tier commands premium pricing vs wellness-only
- **Competitive moat** - Integration with institutional care is hard to replicate

---

## Proposed Solution

### Two-Tier Service Model:

#### **Tier 1: Student Self-Service (Current)**
- PHQ-2/GAD-2 screening
- Daily wellness check-ins
- Self-managed reports
- Personal wellbeing journal

#### **Tier 2: Clinical Partnership (New)**
- PHQ-9/GAD-7 assessments
- University therapist oversight
- Crisis detection & alerts
- Clinical governance by university
- Integration with student records

### How It Works:

**Student Flow:**
1. Student requests report with "enhanced clinical scores"
2. App notifies university counseling service
3. Student completes PHQ-9/GAD-7 via conversational interface (Jodie)
4. Scores automatically flagged to therapist dashboard
5. Therapist reviews within 24 hours, triages if needed
6. Report generated with clinical sign-off

**Therapist Dashboard (in Core):**
- Queue of students awaiting review
- Crisis alerts (PHQ-9 Q9 > 0, total > 20)
- Longitudinal trend data
- Direct contact/referral actions
- Audit trail for compliance

**Legal Structure:**
- **University counseling service** holds all clinical responsibility
- **Mind Measure** provides platform only (data processor)
- Service agreement clearly delineates duties
- Crisis response protocols owned by university

---

## Benefits & Risks

### Benefits:

**For Universities:**
- Early identification of deteriorating students
- Smart triage (focus resources on high-risk cases)
- Longitudinal data clinicians don't normally have
- Demonstrate proactive duty of care
- Better resource allocation
- Outcomes data for funding justification

**For Mind Measure:**
- Higher revenue per student (premium tier)
- Stickier university relationships (embedded in clinical workflow)
- Competitive differentiation
- Scale clinical value without holding clinical liability
- Clear path to becoming infrastructure layer for university mental health

**For Students:**
- Faster access to help (proactive identification)
- No additional cost (university-funded)
- Seamless care coordination
- Richer data for clinicians treating them

### Risks:

**Regulatory:**
- Potential classification as medical device (MHRA)
- Need for clinical safety case (DCB0129/DCB0160)
- DSPT compliance (NHS Data Security)
- More complex data protection requirements

**Legal:**
- Service agreement complexity
- Liability boundaries must be crystal clear
- Professional indemnity insurance considerations
- Crisis response protocol failures

**Business:**
- Long sales cycles (clinical governance committees)
- Requires mature university relationships
- Significant product development investment
- Pilot may reveal workflow mismatches

**Operational:**
- 24/7 crisis response capability (university must provide)
- Integration complexity (student records systems vary)
- Training burden (therapists need onboarding)
- Support escalation (clinical questions)

---

## Requirements

### Technical:
- PHQ-9/GAD-7 conversation design (ElevenLabs agent)
- Therapist dashboard in Core (queue, alerts, review workflow)
- Real-time alert system (SMS, email, push to dashboard)
- Crisis detection logic
- Student records system integration APIs
- Enhanced audit logging (clinical-grade)
- Role-based access control (therapist vs admin)

### Regulatory:
- Legal review of service agreement templates
- Clinical governance framework documentation
- ISO 27001 certification (if not already)
- NHS Data Security and Protection Toolkit (DSPT)
- Clinical safety case (DCB0129, DCB0160)
- MHRA medical device assessment (likely Class I or IIa)

### Business:
- Partnership with 1-2 pilot universities
- Clinical advisory board (validate workflows)
- Professional liability insurance upgrade
- Sales materials for clinical decision-makers
- Case studies demonstrating outcomes
- Pricing model (cost-plus vs value-based)

### Operational:
- Therapist onboarding/training program
- Support escalation process for clinical queries
- Crisis protocol documentation
- SLA definition (alert response times)

---

## Estimated Timeline

### Phase 1: Groundwork (0-6 months)
- Build strong relationships with university counseling services
- Shadow therapists, understand workflows
- Gather feedback on existing PHQ-2/GAD-2 reports
- Initial legal/regulatory consultation

### Phase 2: Regulatory Foundation (6-12 months)
- Clinical governance framework
- Legal templates
- ISO 27001 / DSPT if needed
- Clinical safety case
- Insurance review

### Phase 3: Product Build (12-18 months)
- PHQ-9/GAD-7 conversation design
- Therapist dashboard
- Alert system
- Integration APIs
- Pilot testing (internal)

### Phase 4: Pilot (18-24 months)
- Partner with 1-2 universities
- Small cohort (100-200 students)
- Validate crisis protocols
- Iterate based on therapist feedback
- Measure outcomes

### Phase 5: Scale (24+ months)
- Offer to all university partners
- Build case studies
- Expand to NHS trusts, private therapy networks

---

## Dependencies

### Must Have Before Starting:
1. **Strong university relationships** - At least 3-5 universities using wellness tier successfully
2. **Positive feedback from counseling services** - They see value in current reports
3. **Financial runway** - 18-24 month investment before revenue
4. **Legal/regulatory counsel** - Expert in medical device regulation, clinical governance
5. **Clinical advisory board** - 2-3 qualified mental health professionals to validate approach

### Nice to Have:
- Existing integrations with student records systems
- Crisis line partnership (Samaritres, Crisis Text Line)
- Insurance broker experienced with healthtech
- Pilot university eager to innovate

---

## Competitive Landscape

**Direct Competitors (Consumer Therapy Platforms):**
- BetterHelp, Talkspace - Consumer-focused, generic matching, expensive
- No institutional integration

**Indirect Competitors (University Platforms):**
- Uwill, TimelyCare - Therapy marketplace for universities
- Don't have longitudinal wellness tracking
- Separate from daily student life

**Mind Measure Advantage:**
- Students already using it (baseline + check-ins = engagement)
- Longitudinal data therapists don't have elsewhere
- Seamless integration (not a separate platform)
- Population health analytics for institutions
- Lower cost (care coordination vs providing care)

---

## Open Questions

1. **Regulatory Classification:** Would this trigger medical device status? (Needs MHRA consultation)
2. **Crisis Response:** Can universities provide 24/7 coverage or need third-party partnership?
3. **Integration Standards:** Is there a common API across university student records systems?
4. **Pricing:** What's the incremental value to universities? (Need willingness-to-pay research)
5. **Therapist Adoption:** Will therapists actually use dashboard or see as admin burden?
6. **Student Consent:** How granular should consent be? (Share scores vs full longitudinal data)

---

## Next Steps (When Ready to Revisit)

1. **Validation Calls** - Interview 5-10 university counseling directors
2. **Regulatory Workshop** - Half-day session with MHRA consultant
3. **Legal Review** - Have solicitor review concept, flag issues
4. **Financial Model** - Detailed P&L for clinical tier (dev costs, pricing, margins)
5. **Pilot Agreement** - Draft service agreement template
6. **Product Requirements** - Detailed specs for therapist dashboard MVP

---

## Related Documents

- Current wellbeing reports architecture: `/mind-measure-core/build/CURSOR_HANDOVER/`
- PHQ-2/GAD-2 scoring logic: `/mind-measure-mobile-final/src/utils/baselineScoring.ts`
- Baseline assessment implementation: `/mind-measure-mobile-final/src/components/mobile/BaselineAssessmentSDK.tsx`

---

## Discussion History

- **2026-01-12:** Initial proposal during report generation debugging session. Discussed liability risks, regulatory concerns, and strategic value. Decision: Document for future, stay wellness-focused now.

---

**Status Update Log:**

| Date | Status | Notes |
|------|--------|-------|
| 2026-01-12 | Proposed | Initial documentation. Awaiting university relationship maturity and regulatory consultation. |
