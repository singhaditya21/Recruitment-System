# Recruitment System — Product Requirements Document

| Field | Value |
| --- | --- |
| Status | Draft v0.1 |
| Last updated | August 22, 2026 |
| Product owner | Aditya Singh |
| Initial market | San Francisco–based employer hiring in the United States |
| Primary timezone | America/Los_Angeles |
| Currency | USD |
| Deployment target | GitHub Pages frontend with a separate secure backend |

## 1. Executive summary

Recruitment System is an end-to-end applicant tracking system (ATS) for a San Francisco–based company. It gives HR and hiring teams one structured place to create and publish jobs, collect applications, screen candidates, run assessments, schedule interviews, capture evidence-based feedback, make decisions, issue offers, and retain a complete audit trail. Candidates get a clear, accessible experience from job discovery through application status and offer response.

The first release is a single-company product, not a multi-tenant SaaS platform. It should feel modern, calm, inclusive, and trustworthy. The system must reduce hiring coordination work without turning consequential hiring decisions over to opaque automation.

## 2. Problem statement

Recruiting data is often fragmented across email, spreadsheets, calendars, shared drives, messaging tools, and interviewer notes. This causes:

- Slow requisition and offer approvals.
- Inconsistent candidate screening and interview evaluation.
- Duplicate or stale candidate records.
- Missed interviews, feedback, and follow-ups.
- Poor visibility into pipeline health and hiring bottlenecks.
- Candidate communications that are late or inconsistent.
- Sensitive hiring information being shared too broadly.
- Weak auditability and avoidable compliance risk.

## 3. Product vision

Enable a hiring team to run a fair, structured, human-led recruitment process from approved headcount to accepted offer, while giving every candidate timely information, control over their data, and a respectful experience.

## 4. Goals and success measures

### 4.1 Product goals

1. Provide one system of record for jobs, candidates, applications, interviews, evaluations, decisions, and offers.
2. Make the next action, owner, and deadline visible for every active application.
3. Standardize screening, assessments, interviews, and scorecards around job-related criteria.
4. Automate routine coordination and notifications while preserving human hiring decisions.
5. Provide a polished candidate experience optimized for mobile, accessibility, and transparency.
6. Build privacy, security, San Francisco/California hiring guardrails, and audit history into core workflows.

### 4.2 MVP success metrics

| Metric | Definition | Initial target |
| --- | --- | --- |
| Application completion rate | Submitted applications / started applications | At least 70% |
| Time to first review | Median time from submission to first HR action | Under 2 business days |
| Interview feedback SLA | Scorecards submitted within 24 hours / completed interviews | At least 90% |
| Candidate communication SLA | Stage-changing messages sent within 1 business day | At least 95% |
| Scheduling cycle time | Median time from interview request to confirmed schedule | Under 2 business days |
| Offer acceptance rate | Accepted offers / offers sent | Baseline first; target after two quarters |
| Process completeness | Hires with complete approvals, scorecards, and audit history | 100% |
| Accessibility | Critical WCAG 2.2 AA violations in release QA | 0 |
| Security | Critical or high-severity open findings at release | 0 |

Metrics must be segmented only where privacy thresholds are met. Voluntary demographic data must never be exposed to hiring decision-makers.

## 5. Users and roles

| Role | Primary needs | Default access |
| --- | --- | --- |
| Candidate | Find jobs, apply, provide availability, complete assessments, track status, respond to offers, manage privacy requests | Own profile and applications only |
| Recruiter | Manage jobs and pipelines, screen candidates, coordinate communication, progress candidates | Assigned jobs and candidates |
| Recruiting coordinator | Schedule interviews, manage logistics and reminders | Scheduling and candidate contact data for assigned jobs |
| Hiring manager | Define requirements, review candidates, approve stages, lead decisions | Their jobs and candidate packets |
| Interviewer | Review interview kit, conduct interview, submit scorecard | Minimum candidate information for assigned interviews |
| Offer approver | Review compensation and offer terms | Offer packet and necessary candidate data |
| HR administrator | Configure organization, workflows, permissions, templates, retention, and integrations | Full administrative access |
| Compliance auditor | Review immutable history, access logs, reports, and retention actions | Read-only, scoped audit access |

Permission checks must be enforced by the backend, not only hidden in the user interface.

## 6. Key journeys

### 6.1 Recruiter: open and publish a job

1. Create a requisition from a template or blank form.
2. Enter title, department, location, workplace type, employment type, headcount, hiring manager, description, qualifications, compensation range, and target dates.
3. Select a structured hiring plan with screening criteria, assessments, interview rounds, competencies, and scorecards.
4. Route the requisition for required approvals.
5. Publish the approved job to the public careers portal.
6. Share or copy a trackable job link.

### 6.2 Candidate: apply for a job

1. Browse and filter open jobs without creating an account.
2. View a job page with responsibilities, qualifications, compensation, location/workplace type, hiring process, accommodations contact, and privacy notice.
3. Start an application using email verification or a secure magic link.
4. Upload a resume and enter only job-relevant information.
5. Answer job-specific screening questions and optionally provide voluntary demographic information in a separate protected flow.
6. Review, consent, and submit.
7. Receive confirmation, a status link, and a copy of submitted answers.

### 6.3 Hiring team: evaluate a candidate

1. Recruiter reviews the submitted application against the job rubric.
2. Candidate advances to phone screen, assessment, or interview plan.
3. Coordinator collects availability and confirms interviews in Pacific Time with timezone conversion for candidates.
4. Interviewers receive role-specific kits and submit independent scorecards before debrief.
5. Hiring manager runs a debrief using submitted evidence.
6. Authorized user records the decision and rationale; the candidate receives an appropriate communication.

### 6.4 HR: make and close an offer

1. Recruiter prepares an offer from an approved template.
2. Compensation and other terms route through configured approval rules.
3. Candidate receives a secure offer link and can accept, decline, or ask a question.
4. If required, background or reference steps occur only in their legally permitted stage and with appropriate consent.
5. Accepted offer converts the application to hired and triggers a handoff package.
6. The job closes automatically when approved headcount is filled, subject to recruiter confirmation.

## 7. Scope

### 7.1 MVP: required end-to-end capabilities

#### Organization and access

- Single employer account with San Francisco headquarters profile.
- Role-based access control and least-privilege defaults.
- HR user authentication, verified email, password reset, and MFA support.
- Invite, deactivate, and role-change flows.
- Audit trail for sign-ins, permission changes, exports, and sensitive record access.

#### Requisitions and jobs

- Draft, approval requested, approved, published, paused, closed, and archived states.
- Requisition ID, owner, hiring manager, department, headcount, reason, target start date, and approval history.
- Job title, rich description, responsibilities, minimum/preferred qualifications, location, workplace type, employment type, compensation range, currency, benefits summary, and application deadline.
- Reusable job, approval, interview-plan, and message templates.
- Public job preview before publishing.
- Publish/unpublish controls and shareable canonical URL.
- Search and filters for title, department, location, workplace type, and employment type.
- Required compensation range for every California-fillable job as a product guardrail.
- No salary-history question in any system template.

#### Candidate profiles and applications

- Candidate profile with preferred name, legal name only when necessary, email, phone, location, work authorization response, links, skills, employment history, education, and resume.
- Multiple applications may reference one candidate profile without merging unrelated people automatically.
- Resume upload with file type/size validation, malware scanning, private storage, and signed download URLs.
- Autosave and resume-later application flow.
- Configurable screening questions with validation and required/optional controls.
- Duplicate warning based on verified contact identifiers, followed by human review.
- Candidate source and campaign attribution.
- Candidate withdrawal and data-rights request entry points.
- Immutable submitted-answer snapshot so later template edits do not rewrite history.

#### Pipeline and workflow

- Configurable pipeline per job, created from an organization template.
- Default stages: New, Recruiter Review, Screening, Assessment, Interviews, Debrief, Offer, and Hired.
- Terminal dispositions: Rejected, Withdrawn, Position Closed, Duplicate, and Hired.
- Drag-and-drop and explicit stage-change action, with the same server-side validation.
- Bulk actions limited to low-risk operations; rejection always requires a reason and communication review.
- Stage owner, due date, SLA indicator, last activity, and next action.
- Application timeline containing every stage, message, interview, assessment, decision, and actor.
- Rejection reasons drawn from a controlled, job-related list with optional restricted notes.
- Talent-pool tagging only with appropriate notice/consent and retention policy.

#### Screening and assessments

- Structured recruiter screen form with anchored rubric.
- Assessment types: secure instructions/file submission, structured questionnaire, and approved external-provider link.
- Due date, reminder, submission state, accommodation path, rubric, evaluator assignment, and scored result.
- Assessment template versioning; an active candidate remains on the version assigned.
- Optional blinded review that suppresses selected identity fields where operationally feasible.
- Human review required for every recommendation; no automated final rejection, advancement, ranking, or hiring decision in MVP.

#### Interview lifecycle

- Interview plan composed of ordered rounds and sessions.
- Each session includes duration, mode, location/video link, interviewers, competencies, questions, and scorecard.
- Candidate availability collection and timezone-aware scheduling.
- Confirmation, reschedule, cancellation, and reminder messages.
- Calendar invitation file in MVP; direct Google/Microsoft calendar integration may follow.
- Interviewer conflict warning and assignment acknowledgement.
- Structured scorecards with anchored 1–4 ratings, evidence notes, and final recommendation.
- Interviewers cannot see other scorecards until they submit their own or the debrief begins.
- Scorecard lock after submission, with an attributed amendment workflow.
- Debrief view showing evidence by competency, missing feedback, risks, and decision record.
- Accommodation requests routed separately to authorized HR staff; interviewers see only approved logistics they need.

#### Communications

- Transactional email templates for confirmation, scheduling, reminders, assessment, stage updates, rejection, offer, and withdrawal.
- Merge-field validation and preview before send.
- Send now or schedule in the candidate’s timezone.
- Central communication log with delivery status and actor.
- Candidate replies route to the responsible recruiter or a configured recruiting inbox.
- Manual review required for sensitive messages; no autonomous generative sending.

#### Offers and closeout

- Offer fields: title, manager, location/workplace type, start date, base compensation, variable compensation, equity text, benefits summary, contingencies, expiration, and internal notes.
- Template-based offer document generation.
- Configurable approval chain with timestamped approvals and change invalidation.
- Secure candidate link to view, download, accept, decline, or ask a question.
- Acceptance captures signer, timestamp, document version, and consent evidence.
- Conditional-offer flag that gates background-check workflow.
- Hired handoff export for downstream HR onboarding; onboarding itself is out of MVP.

#### Reporting and operations

- Dashboard: open jobs, active candidates, overdue actions, upcoming interviews, pending feedback, pending approvals, and offers.
- Funnel conversion by job and stage.
- Time to first review, time in stage, time to fill, time to hire, interviewer feedback SLA, source performance, and offer acceptance.
- Export permissions, export reason, watermark/metadata, and audit event.
- Configurable minimum cohort size for demographic reports.
- Data-quality warnings for missing owners, stale stages, incomplete scorecards, and unclosed jobs.

### 7.2 Post-MVP candidates

- Direct Google Workspace and Microsoft 365 calendar integrations.
- Job-board syndication and inbound source integrations.
- E-signature provider integration.
- Background-check provider integration after legal and security review.
- Employee referral portal and agency portal.
- Advanced recruiting CRM, campaigns, events, and evergreen talent communities.
- Interviewer training and certification tracking.
- Headcount planning and finance-system integration.
- Offer benchmarking and compensation-band integration.
- Multilingual candidate experience.
- Multi-brand, multi-country, and multi-tenant support.
- Validated decision-support features with bias, accessibility, explainability, and human-oversight controls.

### 7.3 Explicitly out of scope for MVP

- Payroll, benefits enrollment, performance management, and employee onboarding.
- Autonomous AI screening, inferred personality, emotion recognition, face/voice analysis, or hidden candidate scoring.
- Scraping candidate data from third-party sites.
- Storing authentication secrets, resumes, candidate data, or offer documents in the Git repository or GitHub Pages build.
- Publicly exposing the HR workspace or backend data.
- Multi-company SaaS billing and tenant administration.

## 8. Application state model

The system separates workflow stage from terminal disposition so reporting does not confuse “where the candidate is” with “how the application ended.”

```text
Draft application
  -> Submitted
  -> New
  -> Recruiter Review
  -> Screening
  -> Assessment (optional)
  -> Interviews (one or more rounds)
  -> Debrief
  -> Offer
  -> Hired

From any active stage:
  -> Rejected
  -> Withdrawn
  -> Position Closed
  -> Duplicate
```

Rules:

- Every stage transition records actor, timestamp, source stage, destination stage, and reason where required.
- Reopening a terminal application requires elevated permission and an audit reason.
- Job closure does not silently reject active applicants; HR must select and review communications.
- A candidate may have multiple applications with separate state histories.
- Configurable stages must map to stable reporting categories.

## 9. Functional requirements and acceptance criteria

### 9.1 Job publishing

- Given an approved requisition with all required fields, an authorized recruiter can publish it and see the public page within five minutes.
- A California-fillable job cannot publish without a numeric pay range, currency, pay period, location/workplace type, and hiring process summary.
- A user without publish permission cannot publish even by calling the API directly.
- Unpublishing removes the job from search while preserving its canonical record and applicants.

### 9.2 Application

- A candidate can complete the primary application on a mobile viewport using keyboard and assistive technology.
- Progress autosaves without storing an uploaded resume in public browser storage.
- Submission creates a timestamped answer snapshot and sends a confirmation.
- Required validation errors identify the affected field and do not erase other answers.
- Voluntary demographic questions are clearly optional and stored separately from hiring review data.

### 9.3 Pipeline

- Moving a candidate updates the timeline, stage owner, SLA, and permitted automation exactly once.
- Rejection requires an approved disposition reason and a reviewed candidate communication.
- Users can filter by job, stage, owner, source, tag, date, and overdue status.
- Unauthorized users cannot retrieve hidden fields through search, export, or direct URLs.

### 9.4 Interviews

- A candidate sees interview time in both their local timezone and Pacific Time.
- Double-booking and missing-video-link warnings appear before confirmation.
- Interviewers can submit only assigned scorecards.
- Other interviewer ratings remain hidden until independent feedback is submitted or debrief is opened.
- A decision cannot be finalized while required scorecards are missing unless an authorized user records an override reason.

### 9.5 Offers

- An offer cannot be sent until required approvals match the current offer version.
- Any compensation or material-term change invalidates prior approvals.
- Candidate acceptance is bound to an immutable document version.
- Only users with explicit compensation access can view compensation fields or offer documents.

### 9.6 Audit and privacy

- Sensitive reads, writes, downloads, exports, permission changes, and retention actions create audit events.
- Audit events capture actor, action, target, timestamp, request context, and result without logging secrets or excessive PII.
- A data request can be located, verified, assigned, fulfilled, and closed with an evidence trail.
- A legal hold prevents normal deletion and records who placed or released the hold.

## 10. Candidate experience principles

1. **Clarity:** Show the role, pay range, work arrangement, steps, expected timing, and current status in plain language.
2. **Respect:** Ask only for information needed at the current stage and never ask candidates to repeat stored information unnecessarily.
3. **Access:** Provide a visible accommodations route on job, application, assessment, and interview screens.
4. **Agency:** Allow candidates to withdraw, correct contact details, manage communication preferences, and request access/deletion subject to applicable retention obligations.
5. **Responsiveness:** Acknowledge every submission and major scheduling or status change.
6. **Fairness:** Use the same documented, job-related rubric for candidates in the same process; preserve human accountability.

## 11. San Francisco and California requirements

These are product guardrails, not a substitute for employment counsel. Before production use, counsel must confirm the employer’s size, industry, government-contract status, hiring locations, retention schedule, notices, and exact workflows.

- **Pay transparency:** Require the salary or hourly range on every job that may be filled in California. Do not collect salary history. California’s Labor Commissioner states that employers with at least 15 employees must include a pay scale in covered postings and interprets this to include positions that may be filled in California, in person or remotely. [California Equal Pay Act FAQ](https://www.dir.ca.gov/dlse/California_Equal_Pay_Act.htm)
- **Fair chance:** Do not ask about conviction history or expose a background-check step before a conditional offer. Include individualized-assessment and preliminary/final notice workflows before adverse action when applicable. San Francisco’s ordinance applies to covered employers with five or more employees, and California has a related Fair Chance Act. [SF Fair Chance materials](https://www.sf.gov/resource--2023--citywide-labor-law-videos) · [California Fair Chance Act](https://calcivilrights.ca.gov/fair-chance-act/)
- **Privacy notice:** Present a versioned notice at or before collection, record acknowledgement/version, inventory data uses and recipients, and support applicable access, correction, deletion, restriction, and opt-out workflows. The effective-2026 CCPA text expressly illustrates that covered businesses collecting job-applicant data must provide a Notice at Collection. [CCPA effective January 1, 2026](https://cppa.ca.gov/regulations/pdf/ccpa_statute_eff_20260101.pdf)
- **Record retention:** Make retention configurable by record class, default California employment records to at least four years from record creation or employment action (whichever is later), and support legal holds. Counsel must validate longer obligations and deletion exceptions. [California CRD legislative summary for SB 807](https://calcivilrights.ca.gov/wp-content/uploads/sites/32/2021/12/2021-Legislative-Summary.pdf)
- **Nondiscrimination:** Use job-related criteria, consistent workflows, structured evidence, and access-controlled aggregate monitoring. California protects applicants from discrimination by covered employers, and federal selection procedures can create liability through intentional discrimination or unjustified disparate impact. [California CRD employment guidance](https://calcivilrights.ca.gov/Employment/) · [EEOC selection-procedure guidance](https://www.eeoc.gov/laws/guidance/employment-tests-and-selection-procedures)
- **Disability and accommodations:** Do not ask disability-related or medical questions before a conditional offer except as legally permitted. Store accommodation/medical information separately and confidentially, and provide an accessible request process. [EEOC applicant guidance](https://www.eeoc.gov/disability-discrimination-and-employment-decisions)
- **Accessibility:** Design and test the candidate and HR experiences against WCAG 2.2 AA, including keyboard use, focus visibility, target size, error handling, accessible authentication, and reduced-motion support. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

## 12. Security, privacy, and trust requirements

### 12.1 Data classification

| Class | Examples | Handling |
| --- | --- | --- |
| Public | Published jobs, employer brand content | May be served by GitHub Pages |
| Internal | Interview plans, templates, aggregate operational metrics | Authenticated and role-scoped |
| Confidential | Candidate profiles, resumes, scorecards, messages, references | Encrypted, least privilege, audited |
| Highly restricted | Demographics, accommodations/medical data, background results, offers/compensation, identity documents | Segregated access, enhanced audit, no routine export |

### 12.2 Mandatory controls

- TLS in transit and provider-managed encryption at rest.
- MFA support for HR users; MFA required for administrators before production.
- Server-enforced RBAC and row-level authorization.
- Short-lived signed URLs for private files.
- Secure, HTTP-only session handling where architecture permits; no secrets in browser code.
- Malware scanning and content-type verification for uploads.
- Rate limiting, bot protection, and abuse monitoring on public forms.
- CSRF, XSS, injection, broken-access-control, and insecure-direct-object-reference protections.
- Dependency, secret, and static application security scanning in CI.
- Encrypted backups with tested restoration and documented recovery targets.
- Environment separation for development, test, and production.
- Vendor inventory and data-processing review before enabling any integration.
- Incident response runbook with candidate notification assessment.
- No PII, resumes, API keys, service-role keys, or production exports in Git history, GitHub Issues, Actions logs, or Pages artifacts.

## 13. Technical architecture

### 13.1 Hosting boundary

GitHub Pages is a static hosting service for HTML, CSS, and JavaScript. It will host the frontend application and public assets only. Authentication, authorization, database access, file storage, messaging, audit logs, scheduled jobs, and all trusted business logic must run on separate managed services. [GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

### 13.2 Proposed starting stack

| Layer | Proposed choice | Notes |
| --- | --- | --- |
| Frontend | React, TypeScript, Vite | Static build compatible with GitHub Pages |
| Styling | CSS design tokens and accessible component primitives | Avoid locking core UI to a proprietary theme |
| Routing | Client router configured for `/Recruitment-System/` | Must handle GitHub Pages base path and direct navigation |
| Hosting | GitHub Pages via GitHub Actions | Preview URL: `https://singhaditya21.github.io/Recruitment-System/` |
| Backend | Managed PostgreSQL, authentication, private object storage, and serverless functions | Provider selection requires an architecture decision record |
| Email | Transactional email provider invoked only from backend | Domain authentication and delivery events required |
| Files | Private object storage with signed URLs and malware scanning | Never commit or publish candidate files |
| Observability | Privacy-filtered application logs, error tracking, metrics, and audit events | No resume contents or sensitive form values in telemetry |

### 13.3 Frontend applications

The MVP may ship as one SPA with strict route guards, but it has two conceptual surfaces:

- **Careers and candidate portal:** public job search/details plus authenticated application/status/offer routes.
- **HR workspace:** authenticated dashboard, jobs, candidates, interviews, scorecards, reports, offers, settings, and audit routes.

Public static bundles are inspectable by anyone. Therefore, hiding a route or configuration in the frontend is never an access-control mechanism.

### 13.4 Core entities

- Organization, User, Role, Permission, Team, Department.
- Requisition, Approval, Job, JobLocation, HiringPlan, PipelineStage.
- Candidate, CandidateIdentity, Application, ApplicationAnswer, ConsentRecord.
- Resume/FileAsset, TalentPool, Tag, Source.
- Screen, Assessment, AssessmentSubmission, Rubric, Competency.
- InterviewPlan, InterviewRound, InterviewSession, InterviewerAssignment, Scorecard.
- Decision, Disposition, Offer, OfferVersion, OfferApproval, OfferResponse.
- Message, MessageTemplate, DeliveryEvent, Notification.
- AccommodationRequest, PrivacyRequest, RetentionRule, LegalHold.
- AuditEvent and IntegrationEvent.

Every mutable business record should include stable ID, organization ID, created/updated timestamps, creator/updater, version, and soft-delete or lifecycle status where appropriate.

## 14. Design direction

### 14.1 Brand and visual language

- San Francisco character without clichés: confident typography, generous whitespace, fog/charcoal neutrals, bay blue, and one warm accent.
- Professional enough for HR operations; warm and plainspoken for candidates.
- Mobile-first candidate flows and dense-but-readable desktop operations views.
- Avoid decorative animations in task flows; honor reduced-motion preferences.
- Use inclusive imagery only when authentic assets are available; do not fabricate employee representation.

### 14.2 Initial information architecture

**Candidate navigation**

- Open roles
- Job detail
- Apply
- My applications
- Interview/assessment task
- Offer
- Privacy and accommodations

**HR navigation**

- Overview
- Jobs
- Candidates
- Interviews
- Offers
- Reports
- Templates
- Settings
- Audit

## 15. Analytics and instrumentation

Track events such as job viewed, application started, step completed, application submitted, stage changed, assessment assigned/submitted, interview requested/confirmed/completed, scorecard submitted, decision recorded, offer sent/viewed/responded, and candidate withdrawn.

Rules:

- Use opaque internal IDs in analytics; do not send resumes, free-text notes, names, emails, answers, demographic values, or offer terms.
- Document an owner and business purpose for every event.
- Define funnel denominators and stage mappings before dashboard implementation.
- Separate operational analytics from protected demographic reporting.
- Suppress small cohorts and restrict demographic reports to authorized users.

## 16. Non-functional requirements

| Area | Requirement |
| --- | --- |
| Availability | Target 99.9% monthly availability for backend production services after MVP |
| Performance | Public job pages interactive within 3 seconds at p75 on a typical mobile connection; common HR views within 2 seconds after authentication |
| Scalability | Initial target: 100 open jobs, 100,000 candidate/application records, and 100 concurrent HR users without redesign |
| Reliability | Idempotent stage transitions and message sends; retryable integration events; no duplicate offer or rejection messages |
| Recovery | Initial RPO 24 hours and RTO 8 hours; improve before enterprise use |
| Accessibility | WCAG 2.2 AA release gate with automated and manual testing |
| Browser support | Current and previous major versions of Chrome, Edge, Firefox, and Safari; current mobile Safari and Chrome |
| Auditability | All consequential hiring actions attributable to an authenticated user or named system rule |
| Localization | English/US first, but store timezones, locale-aware dates, and currency explicitly |

## 17. Release plan

### Phase 0 — Product and architecture foundation

- Approve PRD assumptions and MVP boundary.
- Choose product name and employer branding.
- Select backend/auth/storage/email providers through short architecture decision records.
- Define threat model, data map, retention schedule, and legal notice requirements.
- Create design tokens, navigation shell, component standards, CI, and GitHub Pages deployment.

### Phase 1 — Public careers and application

- Job listing/detail pages.
- Job management and publishing.
- Candidate application, resume upload, privacy notice, confirmation, and status access.

### Phase 2 — Core ATS pipeline

- Candidate profiles, pipeline board/list, stage rules, tasks, dispositions, communications, and audit timeline.

### Phase 3 — Assessments and interviews

- Hiring plans, assessment assignments, availability, scheduling, interview kits, scorecards, reminders, and debrief.

### Phase 4 — Offers and reporting

- Offer versioning/approvals/response, closeout, dashboards, funnel metrics, retention operations, and admin settings.

### Phase 5 — Production hardening

- Accessibility audit, penetration test, recovery test, privacy/security review, employment-counsel review, pilot, instrumentation validation, and launch readiness.

## 18. MVP launch gates

- All P0 flows pass end-to-end tests using non-production test identities.
- No critical/high security findings and no secrets or PII in repository/build artifacts.
- Server-side authorization tests cover every protected object and action.
- WCAG 2.2 AA automated checks pass and manual keyboard/screen-reader testing is complete.
- Pay-range, salary-history, fair-chance, accommodations, privacy-notice, retention, and adverse-action workflows are reviewed by qualified counsel.
- Email domain authentication and suppression/bounce handling are verified.
- Backup restore and incident-response tabletop exercises are completed.
- Audit history can reconstruct a sampled hire and rejection from submission through decision.
- Candidate-facing privacy, accommodations, and support contacts are live and monitored.
- Pilot HR users complete role-based training and approve workflow usability.

## 19. Risks and mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Treating GitHub Pages as a backend | Public exposure of secrets or candidate data | Static frontend only; all trust decisions and data live behind authenticated backend services |
| Over-broad permissions | Sensitive hiring data exposed internally | Least privilege, field-level restrictions, access reviews, audit alerts |
| Inconsistent evaluations | Biased or low-quality decisions | Structured plans, anchored rubrics, independent scorecards, evidence-based debrief |
| Automated bias | Discriminatory outcomes and loss of trust | No autonomous decisions in MVP; human review, documented criteria, impact monitoring |
| Candidate drop-off | Lost applicants | Mobile-first short forms, autosave, progress, plain language, accessible support |
| Communication mistakes | Candidate harm and brand damage | Preview, approvals for sensitive templates, idempotency, delivery logs, cancel window where feasible |
| Retention conflict | Premature deletion or over-retention | Record-class rules, legal holds, verified privacy workflows, counsel-approved schedule |
| Integration failure | Missed interviews or messages | Delivery states, retries, reconciliation views, clear manual fallback |
| Scope expansion | Delayed usable release | Single employer, English/US, email-first integrations, explicit post-MVP list |

## 20. Open decisions

The following decisions should be resolved before or during Phase 0, but they do not block approval of the product direction:

1. Final product and employer brand name, logo, domain, and careers-site copy.
2. Employer size, industry, government-contractor status, and initial hiring jurisdictions.
3. Backend/auth/storage provider and data residency requirements.
4. Transactional email sender/domain and reply-routing model.
5. Candidate authentication: passwordless only or optional password/social sign-in.
6. Whether MVP includes direct calendar integration or downloadable calendar invitations only.
7. Whether e-signature and background checks are MVP requirements or controlled manual handoffs.
8. Required requisition and offer approval chains and compensation visibility rules.
9. Final application fields, voluntary demographic form, notices, and retention schedule after counsel review.
10. Initial design system, product name, and SF brand expression.

## 21. Definition of v1 product approval

This PRD is approved when the product owner confirms:

- The single-employer, U.S.-first scope.
- The roles and end-to-end workflow.
- The MVP versus post-MVP boundary.
- GitHub Pages as static frontend hosting with a separate secure backend.
- Human-led decisions and prohibition on autonomous candidate selection in MVP.
- The Phase 0 open decisions and named owners for resolving them.

## 22. Change log

| Version | Date | Summary |
| --- | --- | --- |
| 0.1 | August 22, 2026 | Initial end-to-end PRD for a San Francisco–based company recruitment system |
