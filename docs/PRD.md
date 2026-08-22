# Recruitment System — Product Requirements Document

| Field | Value |
| --- | --- |
| Status | Draft v0.2 |
| Last updated | August 22, 2026 |
| Product owner | Aditya Singh |
| Initial market | San Francisco–based employer hiring in the United States |
| Primary timezone | America/Los_Angeles |
| Currency | USD |
| Prototype deployment | Public GitHub Pages demonstration using synthetic data only |
| Pilot/production deployment | Approved application host with a separate secure backend; provider TBD |

## 1. Executive summary

Recruitment System is an end-to-end applicant tracking system (ATS) for a San Francisco–based company. It gives HR and hiring teams one structured place to create and publish jobs, collect applications, screen candidates, run assessments, schedule interviews, capture evidence-based feedback, make decisions, issue offers, and retain a complete audit trail. Candidates get a clear, accessible experience from job discovery through application status and offer response.

The first release is a single-company product, not a multi-tenant SaaS platform. It should feel modern, calm, inclusive, and trustworthy. The system must reduce hiring coordination work without turning consequential hiring decisions over to opaque automation.

Development starts with a public GitHub Pages prototype containing synthetic demonstration data and no functioning collection of candidate information. Before a pilot handles real identities, applications, resumes, evaluations, or offers, the frontend must move to an approved production application host. GitHub Pages remains a project showcase and deployment preview, not the production recruitment system.

### 1.1 Decisions introduced in v0.2

- Separate prototype, pilot, and production release definitions.
- Restrict GitHub Pages to public, synthetic-data demonstrations.
- Define a smaller P0 pilot workflow and move enhancements into P1/P2.
- Add default permission and decision-right matrices.
- Add candidate, workflow, and integration exception handling.
- Add background-check/adverse-action, privacy-request, and data-lifecycle requirements.
- Add job-search discovery, production operations, ownership, and rollout requirements.

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

### 3.1 Operating assumptions requiring validation

The system will be designed against the following working assumptions. They are product defaults, not legal conclusions. The product owner must replace every `Unconfirmed` entry before a real-candidate pilot.

| Assumption | Working position | Validation state |
| --- | --- | --- |
| Employer model | One private-sector employer headquartered in San Francisco | Unconfirmed |
| Employer legal name and address | Not yet supplied | Unconfirmed |
| Employee count | Unknown; product applies conservative California safeguards regardless of threshold | Unconfirmed |
| Initial hiring jurisdictions | California roles plus U.S. applicants for authorized remote roles | Unconfirmed |
| Hiring volume | Design for up to 100 open jobs and 100 hires per year initially | Unconfirmed |
| Worker types | Regular full-time and part-time employees first | Unconfirmed |
| Internal applicants | Supported after the external-candidate pilot | Unconfirmed |
| Staffing agencies | Controlled agency access is post-pilot | Unconfirmed |
| Federal-contractor status | Treat as not established; OFCCP requirements require separate review if applicable | Unconfirmed |
| Background checks | Manual controlled handoff in pilot; provider integration later | Unconfirmed |
| E-signature | Secure recorded acceptance in pilot; provider integration later | Unconfirmed |
| Languages | English/US first | Confirmed product assumption |
| Hiring decisions | Human-owned; no autonomous ranking, rejection, advancement, or selection | Confirmed product principle |

Changes to employer size, jurisdictions, federal-contractor status, industry, or worker types trigger a documented compliance and scope review.

## 4. Goals and success measures

### 4.1 Product goals

1. Provide one system of record for jobs, candidates, applications, interviews, evaluations, decisions, and offers.
2. Make the next action, owner, and deadline visible for every active application.
3. Standardize screening, assessments, interviews, and scorecards around job-related criteria.
4. Automate routine coordination and notifications while preserving human hiring decisions.
5. Provide a polished candidate experience optimized for mobile, accessibility, and transparency.
6. Build privacy, security, San Francisco/California hiring guardrails, and audit history into core workflows.

### 4.2 Pilot and v1 success metrics

| Metric | Definition | Initial target | Accountable owner |
| --- | --- | --- | --- |
| Application completion rate | Submitted applications / started applications | At least 70% | Product owner |
| Time to first review | Median time from submission to first HR action | Under 2 business days | Recruiting operations |
| Interview feedback SLA | Scorecards submitted within 24 hours / completed interviews | At least 90% | Hiring manager |
| Candidate communication SLA | Stage-changing messages sent within 1 business day | At least 95% | Recruiting operations |
| Scheduling cycle time | Median time from interview request to confirmed schedule | Under 2 business days | Recruiting coordinator |
| Offer acceptance rate | Accepted offers / offers sent | Baseline first; target after two quarters | Head of HR |
| Process completeness | Hires with complete approvals, scorecards, and audit history | 100% | HR administrator |
| Accessibility | Critical WCAG 2.2 AA violations in release QA | 0 | Product and engineering |
| Security | Critical or high-severity open findings at release | 0 | Security owner |

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

### 5.1 Default decision and permission matrix

`Manage` includes create/update actions. `Scoped` means only assigned jobs, applications, or interviews. Backend policy is authoritative.

| Action | Recruiter | Coordinator | Hiring manager | Interviewer | Offer approver | HR admin | Auditor |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Create/edit requisition | Manage | No | Manage own | No | No | Manage | View |
| Approve requisition | No | No | Approve own | No | No | Configure/override | View |
| Publish/close job | Manage approved | No | Request | No | No | Manage | View |
| View candidate application | Scoped | Logistics fields | Scoped | Interview packet only | Offer packet only | Manage | Restricted view |
| Move pipeline stage | Scoped | Scheduling stages | Recommend/approve | No | No | Manage/override | View |
| Schedule interview | Manage | Manage | View | Assigned view | No | Manage | View metadata |
| Submit scorecard | No | No | If assigned | Own assignment | No | If assigned | View after decision |
| View other scorecards | After submit/debrief | No | After submit/debrief | After submit/debrief | No | Manage | View after decision |
| Reject/close application | Manage with reason | No | Approve/perform if configured | Recommend only | No | Manage/override | View |
| View compensation | If assigned and authorized | No | If authorized | No | Manage assigned | Configure/manage | Restricted view |
| Draft offer | Manage | No | Recommend | No | No | Manage | View after close |
| Approve offer | No | No | If approval rule assigns | No | Approve assigned | Configure/override | View |
| Export candidate data | Restricted | No | No by default | No | No | Approve/export | Approved audit export |
| Manage users/roles | No | No | No | No | No | Manage | View history |
| Configure retention/legal hold | No | No | No | No | No | Manage with dual control | View |
| View audit log | Own actions | Own actions | Scoped | Own actions | Own actions | Manage | Read-only |

Access to voluntary demographics, accommodation/medical information, background results, privacy-request identity evidence, and raw security logs requires separate named entitlements. Ordinary recruiter, hiring-manager, interviewer, offer-approver, or general HR-administrator status does not grant those entitlements automatically.

### 5.2 Decision governance

- Every requisition, rejection, stage override, offer approval, offer withdrawal/rescission, export, record merge, and legal-hold action has a named accountable role.
- Overrides require a reason and elevated permission; the system never silently bypasses a required approval or scorecard.
- The product owner approves organization-wide policy. HR owns hiring-process policy. Legal/privacy owns regulated notices and retention. Security owns access and incident controls. Engineering owns implementation and reliability.
- No user may approve their own access escalation. Production administrator access is reviewed at least quarterly.

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

### 7.1 Release definitions

| Release | Data allowed | Purpose | Exit condition |
| --- | --- | --- | --- |
| Pages prototype | Synthetic data only; no candidate submissions, authentication, uploads, or production integrations | Validate information architecture, visual direction, responsive behavior, and core journeys | Product owner approves flows and visual direction |
| Pilot MVP (P0) | Real data on approved production hosting and backend only | Run a controlled end-to-end hiring process with a small HR team and limited number of jobs | Pilot launch gates pass and owners accept operations |
| Production v1 (P1) | Real data | Add operational scale, automation, configuration, and core integrations | Production launch gates and service ownership pass |
| Later (P2) | Real data subject to feature review | Expand channels, automation, markets, and enterprise capabilities | Separate approval per initiative |

Priority meanings:

- **P0:** Required for the controlled pilot; the pilot cannot launch without it.
- **P1:** Required for production v1 but may use an approved manual process during pilot.
- **P2:** Valuable later; not part of the committed v1 release.

### 7.2 Prioritized release backlog

| ID | Capability | Priority | Pilot implementation |
| --- | --- | --- | --- |
| RS-001 | Secure HR identity, MFA, invite/deactivation, and backend RBAC | P0 | Approved application host and auth provider |
| RS-002 | Requisition creation, single approval, job publishing, pause, close, and archive | P0 | One configurable approval step |
| RS-003 | Public job search/detail with pay range, workplace type, accommodations, privacy, and canonical URL | P0 | Production careers surface; synthetic version on Pages |
| RS-004 | Candidate application, verified email/magic link, autosave, private resume upload, consent snapshot, and confirmation | P0 | One configurable application template per job |
| RS-005 | Candidate/application record, list view, fixed pilot pipeline, owner, due date, timeline, and disposition | P0 | List view first; board is P1 |
| RS-006 | Manual recruiter screen using a versioned job-related rubric | P0 | No automated ranking or decisioning |
| RS-007 | Interview plan, candidate availability, manual scheduling, calendar file, independent scorecards, and debrief | P0 | Direct calendar integration is P1 |
| RS-008 | Reviewed transactional email for confirmation, scheduling, reminders, status, and rejection | P0 | Send through backend email provider |
| RS-009 | Human decision, rejection reason, override controls, and candidate communication | P0 | Required evidence and audit history |
| RS-010 | Offer draft, one approval chain, immutable version, secure view, and accept/decline response | P0 | E-signature integration is P1 |
| RS-011 | Privacy notice, accommodation channel, restricted fields, audit events, retention rules, legal hold, and data-request case | P0 | Counsel-approved templates required |
| RS-012 | Operational dashboard for open jobs, active candidates, overdue tasks, interviews, missing scorecards, and offers | P0 | No advanced demographic reporting |
| RS-013 | Structured assessments and evaluator workflow | P1 | Approved manual/external handoff in pilot |
| RS-014 | Direct calendar integration and automated rescheduling | P1 | Calendar files and manual confirmation in pilot |
| RS-015 | Configurable pipeline builder, reusable templates, board view, and controlled bulk actions | P1 | Fixed templates in pilot |
| RS-016 | Reference-check workflow plus e-signature and background-check provider integrations | P1 | Controlled manual handoffs in pilot |
| RS-017 | Advanced funnel, source, SLA, cohort-protected demographic, and data-quality reporting | P1 | P0 operational dashboard only |
| RS-018 | Duplicate merge, talent pools, campaigns, referrals, internal applicants, and agency access | P1 | Duplicate warning with manual review in pilot |
| RS-019 | Job-board syndication and inbound integration | P1 | Canonical job links in pilot |
| RS-020 | Multi-brand, multi-country, multi-language, and multi-tenant capabilities | P2 | Out of v1 |
| RS-021 | Validated explainable decision support with impact monitoring | P2 | No automated decision support in P0/P1 |

Every product story, design screen, test case, release note, and material change should reference at least one `RS-###` requirement. A P0 item may be removed or materially weakened only through an approved PRD change that records owner, rationale, affected risks, and revised launch gate.

### 7.3 Detailed v1 functional backlog

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
- Human review required for every recommendation; no automated final rejection, advancement, ranking, or hiring decision in pilot/v1.

#### Interview lifecycle

- Interview plan composed of ordered rounds and sessions.
- Each session includes duration, mode, location/video link, interviewers, competencies, questions, and scorecard.
- Candidate availability collection and timezone-aware scheduling.
- Confirmation, reschedule, cancellation, and reminder messages.
- Calendar invitation file in pilot; direct Google/Microsoft calendar integration is P1.
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

#### Reference checks

- P1 structured reference-check workflow with candidate notice/consent, referee identity and relationship, invitation/expiry/reminder state, job-related questionnaire, completion status, and restricted reviewer notes.
- Referee contact details and responses are restricted, used only for the approved purpose, and retained under the approved schedule.
- The hiring team receives only the approved decision-relevant summary; raw responses are not broadly exposed.
- Pilot uses a documented manual handoff and records completion/status without placing unapproved reference content in email or general notes.

#### Offers and closeout

- Offer fields: title, manager, location/workplace type, start date, base compensation, variable compensation, equity text, benefits summary, contingencies, expiration, and internal notes.
- Template-based offer document generation.
- Configurable approval chain with timestamped approvals and change invalidation.
- Secure candidate link to view, download, accept, decline, or ask a question.
- Acceptance captures signer, timestamp, document version, and consent evidence.
- Conditional-offer flag that gates background-check workflow.
- Hired handoff export for downstream HR onboarding; onboarding itself is out of pilot/v1.

#### Reporting and operations

- Dashboard: open jobs, active candidates, overdue actions, upcoming interviews, pending feedback, pending approvals, and offers.
- Funnel conversion by job and stage.
- Time to first review, time in stage, time to fill, time to hire, interviewer feedback SLA, source performance, and offer acceptance.
- Export permissions, export reason, watermark/metadata, and audit event.
- Configurable minimum cohort size for demographic reports.
- Data-quality warnings for missing owners, stale stages, incomplete scorecards, and unclosed jobs.

### 7.4 Additional P1/P2 candidates

- **P1:** Direct Google Workspace and Microsoft 365 calendar integrations.
- **P1:** Job-board syndication and inbound source integrations.
- **P1:** E-signature provider integration.
- **P1:** Background-check provider integration after legal and security review.
- **P1:** Employee referral portal and agency portal.
- **P2:** Advanced recruiting CRM, campaigns, events, and evergreen talent communities.
- **P2:** Interviewer training and certification tracking.
- **P2:** Headcount planning and finance-system integration.
- **P2:** Offer benchmarking and compensation-band integration.
- **P2:** Multilingual candidate experience.
- **P2:** Multi-brand, multi-country, and multi-tenant support.
- **P2:** Validated decision-support features with bias, accessibility, explainability, and human-oversight controls.

### 7.5 Explicitly out of scope for pilot and v1

- Payroll, benefits enrollment, performance management, and employee onboarding.
- Autonomous AI screening, inferred personality, emotion recognition, face/voice analysis, or hidden candidate scoring.
- Scraping candidate data from third-party sites.
- Storing authentication secrets, resumes, candidate data, or offer documents in the Git repository or GitHub Pages build.
- Publicly exposing the production HR workspace or any backend data.
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

### 8.1 Required exception handling

| Scenario | Required behavior |
| --- | --- |
| Suspected duplicate | Warn the recruiter; never auto-merge. An authorized user compares records, selects the surviving identity, records the reason, and preserves both application histories. |
| Candidate applies to multiple jobs | Maintain one candidate identity where verified, but separate applications, permissions, scorecards, dispositions, and communications. |
| Candidate changes email | Verify the new address, preserve the former identifier in restricted history, and invalidate outstanding magic links as appropriate. |
| Candidate withdraws | Record the withdrawal timestamp and optional reason, cancel pending tasks/interviews, notify owners, and retain records under the applicable schedule. |
| Candidate wants to reapply | Create a new application snapshot; do not reactivate or rewrite the former application. |
| Job is paused | Hide new-application actions if configured, retain active applicants, stop nonessential automation, and show HR an action list. |
| Job is canceled or closed with active applicants | Require disposition review and communication selection for every active application; no silent bulk rejection. |
| Pipeline stage is skipped | Require permission and a reason; record which required tasks were waived. |
| Interviewer is unavailable or conflicts | Reassign or reschedule with candidate notification; never expose internal conflict details. |
| Candidate/interviewer no-show | Record who was absent, offer an authorized reschedule path, and avoid automatic rejection. |
| Required scorecard is late | Send reminders and block final decision unless an authorized user records an override. |
| Scorecard needs correction | Preserve the submitted version and add an attributed amendment; do not overwrite history. |
| Candidate requests accommodation | Route to restricted HR handling, pause affected deadlines where appropriate, and disclose only approved logistical instructions. |
| Message delivery fails | Retry safely, surface failure to the owner, prevent duplicate sends, and provide a manual contact path. |
| Integration is unavailable | Queue retryable work, show degraded state, and provide a documented manual fallback without losing the source action. |
| Offer terms change | Create a new immutable offer version and invalidate previous approvals and acceptance links. |
| Offer is withdrawn or rescinded | Require elevated permission, documented reason, counsel-approved communication, and complete audit history. |
| Candidate accepts after expiration | Do not auto-hire; route to recruiter review and offer reissue if approved. |
| User leaves the company | Deactivate access immediately, preserve attributed history, reassign owned work, and revoke active sessions. |
| Privacy deletion conflicts with retention/legal hold | Suspend deletion of affected records, document the legal basis and scope, delete eligible data, and communicate the outcome through the approved process. |

Internal candidates, staffing-agency submissions, employee referrals, and former-employee rehires require dedicated visibility and conflict rules before their P1 activation.

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

### 9.7 Identity, session, and recovery

- HR users must verify identity, enroll required MFA, and receive only backend-enforced permissions assigned by an administrator.
- Candidate access links must be single-purpose, short-lived, revocable, rate-limited, and unusable after sensitive identity changes.
- Candidate email changes require verification; HR-assisted recovery requires an approved identity-check process and an audit event.
- Deactivated HR users lose active sessions and API access promptly while their historical actions remain attributed.
- Authentication, authorization, and account-recovery errors must not reveal whether unrelated candidate or employee identities exist.

### 9.8 Communications and integrations

- Every outbound message has an idempotency key, template version, intended recipient, actor/rule, delivery state, and retry history.
- A failed or bounced time-sensitive message creates an owner task and visible fallback action.
- Candidate replies attach to the correct application or enter a reviewed exception queue when matching is uncertain.
- Integration retries cannot repeat the source business action, duplicate an interview, or send a duplicate offer/rejection.
- Disabling an integration stops new work safely without deleting synchronized business records or audit evidence.

### 9.9 Background-check and adverse-action handoff

- The workflow cannot begin before a recorded conditional offer unless counsel has documented a role-specific legal exception.
- The system records the candidate’s standalone disclosure/authorization version and timestamp before any provider order or manual handoff.
- Raw reports and sensitive results are restricted to specifically authorized HR users and are not exposed to interviewers.
- A potentially adverse result opens a controlled review containing the applicable individualized assessment, evidence, notices, response/dispute tracking, final review, and final communication.
- Waiting periods and notice templates are configurable and approved by counsel; no adverse action may finalize while the response window or a timely dispute is open.
- Provider identity, report/version, notices, delivery evidence, candidate response, decision-maker, rationale, and final action remain auditable under the approved retention schedule.

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
- **Background reports:** When a third-party consumer report informs a decision, require the approved disclosure/authorization and pre-adverse/final-adverse workflows, including required report and rights materials. State and local requirements may add steps. [FTC and EEOC background-check guidance](https://www.ftc.gov/business-guidance/resources/background-checks-what-employers-need-know)
- **Work authorization:** Ask only standardized, counsel-approved questions about current U.S. work authorization and future sponsorship. Do not request citizenship details or Form I-9 documents during application; employment verification is a post-acceptance/hire process. [DOJ IER hiring guidance](https://www.justice.gov/crt/iers-frequently-asked-questions-faqs) · [USCIS employer responsibility](https://www.uscis.gov/sites/default/files/document/foia/Employer_Responsibility.pdf)
- **Federal contractor/EEO reporting:** If federal-contractor or reporting thresholds apply, add approved Internet Applicant, demographic self-identification, disposition, outreach, and recordkeeping requirements before launch. [U.S. DOL applicant recordkeeping guidance](https://www.dol.gov/sites/dolgov/files/ofccp/CAGuides/files/Applicant-Recordkeeping-FAQ-WEB_080119_CONTR508c.pdf)
- **Accessibility:** Design and test the candidate and HR experiences against WCAG 2.2 AA, including keyboard use, focus visibility, target size, error handling, accessible authentication, and reduced-motion support. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

## 12. Security, privacy, and trust requirements

### 12.1 Data classification

| Class | Examples | Handling |
| --- | --- | --- |
| Public | Published jobs, employer brand content | Synthetic prototype may be served by GitHub Pages; production content uses approved hosting |
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

### 12.3 Data lifecycle and retention baseline

The following is a product baseline pending counsel and privacy approval. “Deletion” includes primary records, indexes, derived search documents, caches, files, and downstream vendor copies; encrypted backups expire through the documented backup lifecycle.

| Record class | Proposed baseline | Access/deletion notes |
| --- | --- | --- |
| Unsubmitted application draft | Delete 30 days after last activity | Candidate receives expiry notice where practical |
| Candidate profile, submitted application, resume, answers, notes, scorecards, decision, and hiring communication | At least four years from record creation or employment action, whichever is later, for California baseline | Legal hold and longer applicable duties override; delete/deidentify after schedule |
| Offer, approvals, acceptance/decline, and conditional-offer evidence | Same approved employment-record schedule | Compensation-restricted; immutable versions |
| Background workflow records and reports | Minimum required by approved employment/background-check schedule | Highly restricted; avoid retaining raw report longer than necessary where law permits |
| Voluntary demographic data | Separate from decision data; retain only for approved reporting/recordkeeping period | Cohort controls; never visible to decision-makers |
| Accommodation/medical information | Separate restricted record for the minimum approved period | Disclose only necessary logistics; confidential handling |
| Privacy notices, consent/acknowledgement, and data requests | Underlying-record period or longer where required to prove compliance | Immutable notice version and fulfillment evidence |
| Audit events | Six years proposed, subject to security/legal approval | Append-only logical model; tightly controlled access |
| Security/session logs | One year proposed unless incident/legal hold requires longer | Minimize identifiers and exclude content fields |
| Deleted-record backups | Expire within 35 days proposed | Restoration process must reapply deletion tombstones |

Retention jobs must support preview, dual-control approval for destructive batches, retry/reconciliation, deletion evidence, and legal-hold exclusion. No production deletion policy is enabled until its owner and counsel approve it.

### 12.4 Candidate privacy-request workflow

1. Receive request through candidate portal or monitored privacy contact.
2. Verify identity proportionately without collecting unnecessary new data.
3. Locate records across primary services, files, logs, and enabled subprocessors.
4. Identify applicable retention, legal-hold, security, and other approved exceptions.
5. Produce a human-reviewed export, correction, deletion/deidentification, or reasoned response as applicable.
6. Propagate approved actions to subprocessors and verify completion.
7. Notify the requester and close the case with timestamps, actors, scope, and evidence.

Request deadlines, extension rules, appeal routes, and templates are configurable policy values approved before pilot; they are not hardcoded in frontend logic.

## 13. Technical architecture

### 13.1 Hosting boundary

GitHub Pages is limited to a public project prototype using synthetic data. It must not collect candidate data, accept uploads, provide real authentication, display production records, or call production services. Pages sites are publicly available even when their source repository is private, and GitHub states that Pages should not be used for sensitive transactions or as commercial SaaS hosting. [GitHub Pages visibility](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/creating-a-github-pages-site-with-jekyll) · [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)

The pilot and production frontend require an approved application host supporting the organization’s security, availability, custom-domain, deployment, observability, and incident-response requirements. Authentication, authorization, database access, file storage, messaging, audit logs, scheduled jobs, and all trusted business logic run on approved backend services.

### 13.2 Proposed starting stack

| Layer | Proposed choice | Notes |
| --- | --- | --- |
| Frontend | React, TypeScript, Vite | Shared UI code may build both prototype and production applications |
| Styling | CSS design tokens and accessible component primitives | Avoid locking core UI to a proprietary theme |
| Prototype routing | Client router configured for `/Recruitment-System/` | Must handle GitHub Pages base path and direct navigation |
| Prototype hosting | GitHub Pages via GitHub Actions | Public synthetic demo: `https://singhaditya21.github.io/Recruitment-System/` |
| Pilot/production hosting | Approved application host, provider TBD | Custom domain, secure delivery controls, rollbacks, previews, and service ownership required |
| Backend | Managed PostgreSQL, authentication, private object storage, and serverless functions | Provider selection requires an architecture decision record |
| Email | Transactional email provider invoked only from backend | Domain authentication and delivery events required |
| Files | Private object storage with signed URLs and malware scanning | Never commit or publish candidate files |
| Observability | Privacy-filtered application logs, error tracking, metrics, and audit events | No resume contents or sensitive form values in telemetry |

### 13.3 Frontend applications

The synthetic prototype may present nonfunctional versions of both surfaces for usability review. The pilot may ship as one production-hosted SPA with strict route guards, but it has two conceptual surfaces:

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

### 13.5 Environments and data boundaries

| Environment | Purpose | Data policy |
| --- | --- | --- |
| Local | Developer implementation and unit testing | Generated synthetic fixtures only |
| Pages prototype | Public product demonstration | Generated synthetic fixtures only; no write-capable production API |
| Test/staging | Integration, accessibility, security, and end-to-end verification | Synthetic or formally deidentified test data only |
| Pilot/production | Authorized hiring operations | Real candidate data under approved access, retention, monitoring, and incident controls |

- Each environment uses separate projects, credentials, storage, email configuration, and callback URLs.
- Production secrets exist only in approved secret stores and server-side runtimes.
- Production data is never copied to local, Pages, pull-request previews, or test environments.
- Database changes require reviewed migrations, backward-compatible rollout where practical, and tested rollback or recovery procedures.
- Prototype builds fail if secret scanning or artifact inspection detects likely credentials or prohibited production data.

### 13.6 Job discovery and indexing

- Each open production job has one crawlable canonical URL with visible content matching its structured data.
- Job detail pages emit valid `JobPosting` JSON-LD containing required fields and applicable recommended fields, including title, description, dates, hiring organization, location/remote eligibility, employment type, and compensation.
- Job-list pages do not incorrectly present a single-job `JobPosting` schema.
- Production provides a sitemap, accurate `lastmod`, canonical tags, robots rules, and search-console ownership.
- Closed/expired jobs promptly remove job structured data or return the approved `404`/`410` behavior; `validThrough` is accurate.
- Candidate application, status, assessment, offer, HR, and token-bearing pages are excluded from indexing and never appear in sitemaps.
- Publishing and closing a job triggers a reliable indexing update or a visible reconciliation task.
- Structured-data validation and expired-job tests are release gates. [Google JobPosting guidance](https://developers.google.com/search/docs/appearance/structured-data/job-posting)

### 13.7 Integration acceptance contract

Before any external integration is enabled, its architecture decision or specification must identify:

- Business purpose, accountable owner, provider, contract/service plan, and approved environments.
- Data fields sent and received, source of truth, sync direction, identity matching, and field-level permissions.
- Authentication method, minimum scopes, secret rotation, webhook verification, network restrictions, and administrator access.
- Trigger, idempotency key, ordering behavior, rate limits, retry/backoff, timeout, and duplicate prevention.
- Delivery states, reconciliation query/report, outage behavior, manual fallback, and disable/rollback steps.
- Privacy role, subprocessors, retention/deletion propagation, data-location commitments, and incident notification terms.
- Audit events, monitoring, alert owner, support escalation, test fixtures, and production acceptance evidence.

An integration cannot become the only path for a P0 action until its failure and reconciliation flows have passed end-to-end testing.

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

### 14.3 P0 screen inventory

**Pages prototype**

- Careers landing, job search/list, job detail, application walkthrough, confirmation, candidate-status mock, HR overview mock, pipeline mock, candidate detail mock, interview scorecard mock, and offer mock.
- All calls to action that would collect real data are visibly labeled as demonstration-only and use generated fixtures.

**Pilot candidate surface**

- Careers landing, job search/list, job detail, privacy notice, application steps, resume upload, review/submit, confirmation, magic-link request, application status, withdrawal, availability, interview details, offer view/response, accommodations contact, privacy request, expired/invalid link, and support/error pages.

**Pilot HR surface**

- Sign-in/MFA/recovery, overview, requisition/job list, job editor/preview/approval, candidate list, candidate application/timeline, recruiter screen, pipeline action, interview plan/schedule, interviewer packet, scorecard, debrief, decision/disposition, offer draft/approval, communication preview/log, restricted privacy/accommodation case, users/roles, retention/legal hold, and audit view.

### 14.4 Required interface states

Every P0 screen specifies and tests:

- First-use empty state with a safe primary action.
- Loading or skeleton state that preserves layout and communicates progress accessibly.
- Inline validation and submission-error state that preserves entered data.
- Authorization-denied state that does not leak resource existence or sensitive metadata.
- Expired-session/link state with a safe recovery path.
- Network, service, integration, and file-processing failure states with retry or owned fallback.
- Partial/degraded state when noncritical data is unavailable.
- Confirmation/success state showing what happened and what happens next.
- Keyboard focus order, visible focus, zoom/reflow, screen-reader names/status messages, reduced motion, and color-independent meaning.
- Mobile behavior for candidate screens and minimum supported desktop behavior for HR operational screens.

Candidate-facing language must be maintained in a versioned content inventory with owner, reading-level review, template purpose, and legal-review flag where applicable.

## 15. Analytics and instrumentation

Track events such as job viewed, application started, step completed, application submitted, stage changed, assessment assigned/submitted, interview requested/confirmed/completed, scorecard submitted, decision recorded, offer sent/viewed/responded, and candidate withdrawn.

Rules:

- Use opaque internal IDs in analytics; do not send resumes, free-text notes, names, emails, answers, demographic values, or offer terms.
- Document an owner and business purpose for every event.
- Define funnel denominators and stage mappings before dashboard implementation.
- Separate operational analytics from protected demographic reporting.
- Suppress small cohorts and restrict demographic reports to authorized users.

### 15.1 Instrumentation contract

Every approved event definition includes event name/version, business purpose, trigger, source service, actor type, opaque organization/job/application identifiers where permitted, event timestamp, schema owner, retention class, and downstream metrics. Schema validation rejects unexpected free text or prohibited personal data.

The analytics specification must define before pilot:

- Exact start/submission and stage-entry/stage-exit events used in each funnel denominator.
- Treatment of duplicates, withdrawals, reopened applications, canceled jobs, and multiple applications.
- Business-hours calendar and timezone used for SLA metrics.
- Metric owner, alert threshold, minimum cohort size, and review cadence.
- Reconciliation between event-derived metrics and source-of-record database counts.
- Counsel-approved method for monitoring selection-rate differences without exposing individual demographic attributes to decision-makers.
- A documented response process for a possible adverse-impact signal; analytics never automatically changes an individual decision.

## 16. Non-functional requirements

| Area | Requirement |
| --- | --- |
| Availability | Target 99.9% monthly availability for pilot/production backend services |
| Performance | Public job pages interactive within 3 seconds at p75 on a typical mobile connection; common HR views within 2 seconds after authentication |
| Scalability | Initial target: 100 open jobs, 100,000 candidate/application records, and 100 concurrent HR users without redesign |
| Reliability | Idempotent stage transitions and message sends; retryable integration events; no duplicate offer or rejection messages |
| Recovery | Initial RPO 24 hours and RTO 8 hours; improve before enterprise use |
| Accessibility | WCAG 2.2 AA release gate with automated and manual testing |
| Browser support | Current and previous major versions of Chrome, Edge, Firefox, and Safari; current mobile Safari and Chrome |
| Auditability | All consequential hiring actions attributable to an authenticated user or named system rule |
| Localization | English/US first, but store timezones, locale-aware dates, and currency explicitly |

## 17. Release plan

### Phase 0 — Product, policy, and architecture foundation

- Approve PRD assumptions, P0/P1/P2 boundary, and decision owners.
- Choose product name and employer branding.
- Select production frontend host, backend/auth/storage, email, and observability providers through architecture decision records.
- Define threat model, data map, retention schedule, and legal notice requirements.
- Approve permission, requisition, disposition, offer, background, privacy, and accommodation policies.

### Phase 1 — Synthetic GitHub Pages prototype

- Create design tokens, accessible component standards, navigation shell, representative screens, CI, and Pages deployment.
- Demonstrate P0 candidate and HR journeys with generated fixtures only.
- Test responsive behavior, navigation, content hierarchy, accessibility foundations, and stakeholder comprehension.
- Do not enable authentication, form submission, file upload, production APIs, or real integrations.

### Phase 2 — Secure pilot foundation

- Provision separated test and pilot environments on approved application/backend hosts.
- Implement HR identity/MFA, backend RBAC, audit foundation, secrets, monitoring, backups, and deployment rollback.
- Complete data-flow, authorization, threat-model, vendor, and logging reviews.

### Phase 3 — P0 careers and application

- Implement RS-002 through RS-004: requisitions/jobs, crawlable production job pages, candidate identity/application, private resume handling, privacy notice, confirmation, and status access.
- Validate job discovery, structured data, application accessibility, abuse controls, and message delivery.

### Phase 4 — P0 ATS, interviews, decisions, and offers

- Implement RS-005 through RS-010: application list/timeline, recruiter screen, fixed pipeline, interviews, scorecards, debrief, communication, decisions, dispositions, and offer workflow.
- Exercise exception paths, permission boundaries, versioning, and idempotency.

### Phase 5 — P0 privacy, operations, and controlled pilot

- Implement RS-011 and RS-012: restricted records, data-request case, retention/legal hold, audit coverage, and operational dashboard.
- Complete accessibility, security, backup/restore, incident, legal, privacy, email, and operational-readiness gates.
- Run a time-boxed pilot with named HR users, limited jobs, daily support coverage, and weekly issue review.

### Phase 6 — Production v1 expansion

- Prioritize and implement approved P1 requirements RS-013 through RS-019 based on pilot evidence.
- Repeat applicable launch gates for each new integration and regulated workflow.

### 17.1 Delivery and operational ownership

| Area | Accountable role | Required artifact/service |
| --- | --- | --- |
| Product scope and acceptance | Product owner | Prioritized backlog, acceptance sign-off, change log |
| Recruiting workflow | Head of HR / recruiting operations | Approved job, interview, decision, and offer policies |
| Legal and privacy | Qualified counsel/privacy owner | Notices, retention schedule, regulated workflows, request process |
| Security | Named security owner | Threat model, access review, incident plan, vendor review |
| Engineering | Engineering owner | Architecture decisions, implementation, CI/CD, reliability, recovery |
| Accessibility and content | Product/design owner | Screen inventory, content inventory, accessibility evidence |
| Candidate support | Recruiting operations | Monitored contact, response SLA, escalation and outage scripts |
| Production operations | Engineering and HR operations | Monitoring, on-call/escalation, runbooks, status communication |

No role is considered staffed merely because it appears in this table; a named person or approved provider must accept each responsibility before pilot.

### 17.2 Pilot operating model

- Limit the initial pilot to named HR users, a documented maximum number of open jobs, and approved candidate cohorts.
- Provide a monitored candidate-support address during stated Pacific Time support hours and an after-hours path for urgent interview/offer issues.
- Review access, failed messages, overdue tasks, integration failures, privacy cases, and audit alerts on an assigned cadence.
- Use feature flags or configuration to disable incomplete P1 capabilities.
- Maintain migration/import reconciliation for any spreadsheet-sourced jobs or candidates; no silent partial import.
- Publish incident, degradation, and recovery communications through approved templates.
- Define rollback criteria, pilot suspension authority, and candidate communication steps before first real submission.
- Hold weekly pilot reviews covering defects, accessibility, data quality, support themes, metrics, and scope decisions.

## 18. Launch gates

### 18.1 Pages prototype gates

- Repository and built artifacts contain no secrets, production endpoints with privileged access, real candidate data, resumes, or offer documents.
- Every data-entry interaction is synthetic/nonfunctional or writes only to an isolated synthetic demonstration service explicitly approved for public use.
- The site visibly identifies itself as a product prototype and does not misrepresent real employment opportunities.
- Core prototype screens pass baseline automated accessibility and responsive checks.
- Deployment uses GitHub Actions with reproducible build and rollback instructions.

### 18.2 Real-candidate pilot gates

- All P0 flows pass end-to-end tests using non-production test identities.
- The frontend is no longer hosted on GitHub Pages and uses approved pilot/production hosting.
- No critical/high security findings and no secrets or PII in repository/build artifacts.
- Server-side authorization tests cover every protected object and action.
- WCAG 2.2 AA automated checks pass and manual keyboard/screen-reader testing is complete.
- Pay-range, salary-history, fair-chance, accommodations, privacy-notice, retention, and adverse-action workflows are reviewed by qualified counsel.
- Email domain authentication and suppression/bounce handling are verified.
- Backup restore and incident-response tabletop exercises are completed.
- Audit history can reconstruct a sampled hire and rejection from submission through decision.
- Candidate-facing privacy, accommodations, and support contacts are live and monitored.
- Pilot HR users complete role-based training and approve workflow usability.
- Every operating assumption marked `Unconfirmed` has been resolved or explicitly accepted by the accountable owner with documented impact.
- Every area in the delivery-ownership table has a named, accepting owner.

## 19. Risks and mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Using GitHub Pages for the live system | Public exposure, sensitive-transaction risk, and hosting-policy conflict | Synthetic public prototype only; real-candidate surfaces use approved production hosting |
| Over-broad permissions | Sensitive hiring data exposed internally | Least privilege, field-level restrictions, access reviews, audit alerts |
| Inconsistent evaluations | Biased or low-quality decisions | Structured plans, anchored rubrics, independent scorecards, evidence-based debrief |
| Automated bias | Discriminatory outcomes and loss of trust | No autonomous decisions in pilot/v1; human review, documented criteria, impact monitoring |
| Candidate drop-off | Lost applicants | Mobile-first short forms, autosave, progress, plain language, accessible support |
| Communication mistakes | Candidate harm and brand damage | Preview, approvals for sensitive templates, idempotency, delivery logs, cancel window where feasible |
| Retention conflict | Premature deletion or over-retention | Record-class rules, legal holds, verified privacy workflows, counsel-approved schedule |
| Integration failure | Missed interviews or messages | Delivery states, retries, reconciliation views, clear manual fallback |
| Scope expansion | Delayed usable release | Single employer, English/US, explicit P0/P1/P2 IDs, controlled change approval |

## 20. Open decisions

Open decisions do not block the synthetic prototype unless noted, but every item marked “Before pilot” blocks real-candidate collection.

| ID | Decision | Accountable owner | Required by | Status |
| --- | --- | --- | --- | --- |
| OD-01 | Employer legal name/address, employee count, industry, jurisdictions, hiring volume, worker types, and federal-contractor status | Product owner / HR | Before pilot | Open |
| OD-02 | Final product/employer brand, logo, public domain, support contacts, and careers copy | Product owner | Prototype content approval | Open |
| OD-03 | Pilot/production frontend host and custom-domain model | Engineering/security | Before pilot build | Open |
| OD-04 | Backend, authentication, database, storage, malware scanning, email, and observability providers | Engineering/security | Before pilot build | Open |
| OD-05 | Candidate passwordless identity/recovery policy and HR SSO/MFA policy | Security/HR | Before pilot build | Open |
| OD-06 | Final requisition, stage override, disposition, export, merge, offer, compensation, legal-hold, and administrator permissions | HR/legal/security | Before pilot | Open |
| OD-07 | Application fields, sponsorship questions, demographic form, privacy notices, accommodation process, retention schedule, and request SLAs | HR/legal/privacy | Before pilot | Open |
| OD-08 | Calendar, reference-check, e-signature, background-check, job-board, and onboarding handoffs for pilot versus P1 | Product owner / HR | Before corresponding build | Open |
| OD-09 | Pilot size, support hours, named operators, success period, suspension criteria, and production rollout | Product owner / operations | Before pilot | Open |
| OD-10 | Final design system and SF brand expression | Product/design | Prototype content approval | Open |
| OD-11 | Delivery budget, service plans, vendor procurement, and ongoing operating cost owner | Product owner | Before provider commitment | Open |

## 21. Definition of v1 product approval

This PRD is approved when the product owner confirms:

- The single-employer, U.S.-first scope.
- The roles and end-to-end workflow.
- The prototype/P0/P1/P2 boundary and numbered release backlog.
- GitHub Pages as a public synthetic-data prototype only, with approved hosting required for real candidate data.
- Human-led decisions and prohibition on autonomous candidate selection in pilot/v1.
- Default decision rights, exception behavior, data-lifecycle baseline, and regulated-workflow requirements.
- The Phase 0 open decisions, accountable roles, milestones, and named owners for resolving them.

## 22. Change log

| Version | Date | Summary |
| --- | --- | --- |
| 0.2 | August 22, 2026 | Added hosting correction, operating assumptions, prioritized releases, permission governance, exception flows, regulated workflows, data lifecycle, SEO, operations, and launch gates |
| 0.1 | August 22, 2026 | Initial end-to-end PRD for a San Francisco–based company recruitment system |
