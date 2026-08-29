# Recruitment System v3.2 — Use Case–Screen–Action–DFD–Feature Matrix

Status: Implemented synthetic wireframe contract. All 35 identified updates are represented in the v3.2 browser-memory release; this status does not claim production identity, persistence, provider delivery, legal approval or external effects.

## 1. Purpose

The v3.1 Demo Journey Studio proves route breadth and provides 12 level-one business data-flow diagrams. v3.2 converts those broad diagrams into outcome-driven product use cases that can be executed screen by screen through shared state, 52 action-level DFD processes and 13 seeded P0 workbenches.

Every use case is defined through six linked contracts:

1. business trigger and measurable outcome;
2. actors, authority and prerequisites;
3. exact wireframe screens and actions;
4. input, process, output, object, event and store data flow;
5. happy, denial, exception, cancellation and recovery paths;
6. features that are executable now, require deeper wireframes or belong only to production implementation.

## 2. Status notation

| Status | Meaning |
| --- | --- |
| `E — Executable` | A reviewer can open the route, perform a visible action and receive a browser-memory result |
| `V — Visible` | The route and data are visible, but the action is a preview, facilitator handoff or shallow local state |
| `D — Deepen` | A current feature needs additional states, rules, connections or evidence to demonstrate the use case credibly |
| `N — New wireframe` | A new bespoke screen, panel or interaction is required |
| `P — Production only` | Real authentication, persistence, provider delivery, legal approval or integration; not required for the GitHub Pages wireframe |

DFD notation:

`External entity → named input → business process → named output/event → logical data store → downstream entity`

The stores named below are logical product boundaries, not approved Salesforce or database objects.

The `Current` column in each screen/action table records the inherited v3.1 baseline used to identify the gap. The corresponding `Required feature treatment` is implemented in v3.2 through the connected use-case workbench, level-two DFD and cross-cutting control surfaces; it is retained here to preserve before/after traceability.

## 3. Portfolio summary

| ID | Business use case | Trigger | Final business outcome | Primary wireframe surfaces |
| --- | --- | --- | --- | --- |
| `UC-01` | Hiring demand to published job | Manager identifies approved hiring need | Reconciled public posting against approved headcount/openings | Manager recruiting, Jobs, Platform, Careers |
| `UC-02` | Talent campaign or event to applicant | Talent team identifies an audience or event | Consented, source-attributed application | Talent CRM, Events, Careers, Application |
| `UC-03` | Candidate application and identity resolution | Candidate starts an application | Valid submitted application linked to a governed candidate identity | Candidate application/hub, Candidates, Applications |
| `UC-04` | Referral or agency submission to validated application | Partner proposes a candidate for an assigned job | Accepted source relationship and separate application | Referrer, Agency, Candidate/Application operations |
| `UC-05` | High-volume/campus campaign to managed cohort | Volume program is approved | Capacity-controlled cohort with owned exceptions and conversion evidence | High-volume planning, events, cohorts, analytics |
| `UC-06` | Candidate availability to completed interview | Candidate reaches interview scheduling | Completed versioned session with assignments and due scorecards | Candidate hub, Interviews, Interviewer portal, Scorecards |
| `UC-07` | Structured evidence to hiring decision | Required interview evidence is submitted | Attributed human decision with candidate-safe outcome | Scorecards, Debrief/Decision, Application timeline |
| `UC-08` | Assessment/background check to governed outcome | Versioned candidate task is assigned | Correctable, human-reviewed regulated outcome | Candidate tasks/support, Screening cases, Decisions |
| `UC-09` | Hiring decision to accepted offer | Authorized human selects offer path | Version-bound candidate response and reserved opening | Decision/offer, Candidate hub, Onboarding handoff |
| `UC-10` | Accepted candidate to validated pending worker | Offer acceptance is effective | Linked PreHire/PendingWorker with reconciled onboarding assignment | Onboarding, Templates, Platform integration, New-hire portal |
| `UC-11` | Pre-hire to day-one readiness | Onboarding plan is assigned | New hire, manager, IT and facilities ready or explicitly blocked | New-hire, Manager, IT, Facilities, Onboarding analytics |
| `UC-12` | Day one through day 90 and worker transitions | Worker starts or effective relationship changes | Continuous milestones and reconciled transition/compensating work | Journey, Manager/Buddy, Transitions, Analytics |

## 4. Detailed use-case matrix

### UC-01 — Hiring demand to published job

Business contract: A hiring manager requests one or more openings. Budget, level, compensation and approval policies must be satisfied before a recruiter can publish an immutable candidate-facing posting version.

Actors: Hiring Manager, Recruiter, Headcount/Finance Approver, Compensation Approver, Configuration Admin.

Prerequisites: workforce-plan reference, position or job family, hiring manager, location, worker type, target start date and approval policy.

#### Screen and action contract

| Sequence | Actor | Screen / route | Input data | Product action | Output / event | Current | Required feature treatment |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 1 | Hiring Manager | Manager recruiting `/manager/recruiting` | Business need, position, location, openings, target date | Start requisition and select demand source | `RequisitionDrafted` | `V` | `D`: replace generic manager item with a requisition wizard and demand-lineage panel |
| 2 | Hiring Manager | Requisition detail `/manager/recruiting/:itemId` | Budget/headcount references and justification | Submit for governed approval | `RequisitionSubmitted` | `V` | `N`: approval timeline, return/revise loop and comments |
| 3 | Approvers | Job/requisition workspace `/hr/jobs/:jobId` | Current version, headcount, compensation band | Approve, return or deny exact version | `RequisitionApproved/Returned/Denied` | `V` | `N`: multi-step approval workbench with separation of duties |
| 4 | Recruiter | New/Edit job `/hr/jobs/new`, `/hr/jobs/:jobId/edit` | Approved demand, competencies, team, interview plan | Create Job, Opening and hiring-plan projection | `JobConfigured` | `E` | `D`: expose Job versus Requisition, Opening, Posting and PostingVersion lineage |
| 5 | Recruiter | Job detail `/hr/jobs/:jobId` | Candidate content, locale/pay policy and readiness facts | Run readiness, preview and publish | `JobPostingVersionPublished` | `V` | `D`: field-level readiness failures, side-by-side version preview and rollback/withdraw |
| 6 | Configuration Admin | Platform/integration `/hr/platform/*` | Posting version and channel contracts | Preview delivery, retry and reconcile channels | `DistributionPublished/Failed/Reconciled` | `V` | `D`: channel-specific status, external ID, last crawl and removal evidence |
| 7 | Candidate | Job detail `/careers/jobs/:publicId` | Published version | Review job or start application | `JobViewed/ApplicationStarted` | `E` | Preserve exact posting version and source context through application |

#### DFD contract

`Hiring Manager → demand and justification → Requisition Process → approved demand → Workforce Demand Ledger → job/opening configuration → Recruiting Store → posting version → Distribution Process → Distribution Ledger → Careers Site`

| Process | Reads | Writes | Guard / decision | Exception and recovery |
| --- | --- | --- | --- | --- |
| Demand capture | Position, plan, budget, organization | Requisition draft/version | Manager relationship and valid workforce reference | Duplicate or unavailable headcount returns to draft |
| Approval | Requisition version, policy, compensation | Approval decisions and current state | Required approvers, no self-approval, current version | Returned version retains reason and restarts only affected steps |
| Job configuration | Approved requisition, job family, competencies | Job, openings, hiring plan, interview plan | Opening count and locale/pay completeness | Missing readiness facts block publication |
| Publication | Approved candidate content and locale pack | Immutable posting version | Current content, approval and effective window | Withdraw or supersede; never overwrite published history |
| Distribution | Posting version and channel mapping | Per-channel delivery/reconciliation | Active channel contract and idempotency key | Retry failed channel without duplicating successful deliveries |

Feature status: core Job CRUD and careers routes are executable; approval depth, demand lineage, publication readiness and channel reconciliation require deeper wireframes. Real workforce, compensation and distribution connections are production-only.

### UC-02 — Talent campaign or event to consented applicant

Business contract: A purpose-bound audience is engaged through a campaign or event. A responding person becomes an attributed candidate/application only after consent and application submission.

Actors: Talent Marketer, Campus Recruiter, Prospect/Candidate, Recruiting Coordinator.

#### Screen and action contract

| Sequence | Actor | Screen / route | Product action | Data effect | Current | Required feature treatment |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Talent Marketer | Talent CRM `/hr/talent` | Create/select community and prospect population | Audience definition and membership snapshot | `V` | `N`: query/segment builder with inclusion, exclusion and estimated counts |
| 2 | Talent Marketer | Campaign view `/hr/talent/:talentView` | Apply purpose, consent, expiry and suppression | Eligible/suppressed audience snapshot | `V` | `D`: row-level suppression reasons and authority-expiry preview |
| 3 | Talent/Campus | Event operations `/hr/events/new`, `/hr/events/:eventId` | Configure capacity, locale, channel, ticket and waitlist policy | CareerEvent version | `E/V` | `D`: campaign-event linkage and reusable registration-form builder |
| 4 | Candidate | Public events `/events/:eventId` | Register, waitlist, cancel or request support | EventRegistration state/event | `E` | Add source/campaign visibility and explicit consent receipt |
| 5 | Event Staff | Check-in `/hr/events/:eventId/check-in` | Check in, correct attendance or reconcile duplicate ticket | Attendance event | `E` | `D`: offline/duplicate/late-arrival recovery and batch check-in evidence |
| 6 | Candidate | Careers/job `/careers/jobs/:publicId` | Follow attributed job link and start application | SourceTouch and draft application | `E` | `D`: display why the opportunity was recommended and preserve touch lineage |
| 7 | Recruiter | Application `/hr/applications/:id` | Review source/campaign/event attribution | Application source timeline | `V` | `N`: source-touch timeline and campaign-to-application conversion drill-through |

#### DFD contract

`Talent Marketer → population rules → Audience Builder → Recruiting CRM → campaign/event content → Engagement Process → Registration Store → attributed job link → Application Process → Application Ledger`

Key rules: no campaign creates an application; expired authority suppresses outreach; cancellation releases capacity; a prospect and candidate may relate but must not be silently merged; conversion metrics use immutable source-touch records.

Feature status: CRM, events and registration exist; segmentation, suppression explanation, touch attribution and conversion lineage need new/deeper wireframes. Real message delivery and marketing providers are production-only.

### UC-03 — Candidate application and identity resolution

Business contract: A candidate completes a recoverable, accessible, version-bound application while the platform manages identity, consent, documents and duplicates separately from the application itself.

Actors: Candidate, Recruiter, Candidate Support, Privacy/Legal.

#### Screen and action contract

| Sequence | Screen / route | Candidate or operator action | Data effect | Current | Required feature treatment |
| ---: | --- | --- | --- | --- | --- |
| 1 | Job detail `/careers/jobs/:publicId` | Review exact version, eligibility and application expectations | Posting context bound to draft | `E` | Add application closing/country eligibility explanations and stale-version warning |
| 2 | Application `/apply/:publicId/*` | Create draft, profile, experience, answers, consent and documents | Candidate draft, consent, document metadata | `E` | `D`: conditional questions, multi-job profile reuse, autosave state and field provenance |
| 3 | Application review | Validate and submit exact answer/posting versions | Application and initial stage event | `E` | `D`: validation summary by section and explicit changed-since-start review |
| 4 | Candidate hub `/my-applications/:id` | Track timeline, messages, tasks, withdraw or correct | Candidate-safe state and request events | `E/V` | `N`: governed withdrawal and application-correction flows with downstream impacts |
| 5 | Candidate identity `/hr/candidates/:id` | Review identity and possible duplicates | Identity review/merge proposal | `V` | `N`: duplicate-resolution workbench with field provenance and merge boundaries |
| 6 | Application `/hr/applications/:id` | Assign owner, screen and advance with reason | Work item and immutable stage event | `E` | `D`: reason codes, required evidence and candidate-communication preview per transition |
| 7 | Support/privacy `/support/*`, `/privacy-requests/*` | Request support, correction, access or deletion | Purpose-limited case/request | `E` | Link requests to exact fields/stores without exposing internal evidence |

#### DFD contract

`Candidate → profile/answers/consent → Application Form → Candidate Identity Store + Private Document Store → duplicate review → Application Ledger → Recruiter Work Queue → candidate-safe timeline`

Key rules: Candidate and Application remain distinct; one candidate can have multiple applications; candidate-job uniqueness is checked; a posting version is retained; corrections append provenance; withdrawal never deletes the record or audit history.

Feature status: the application and core objects are executable; dynamic forms, profile reuse, duplicate resolution and governed correction/withdrawal require deeper wireframes. Durable drafts, private file handling and candidate identity are production-only.

### UC-04 — Referral or agency submission to validated application

Business contract: A source partner can propose a candidate only with current job scope and candidate authority. Duplicate and ownership checks cannot reveal another owner or silently affect evaluation.

Actors: Employee Referrer, Agency User, Candidate, Recruiter, Agency/Reward Administrator.

#### Screen and action contract

| Sequence | Screen / route | Action | Data effect | Current | Required feature treatment |
| ---: | --- | --- | --- | --- | --- |
| 1 | Referral `/referrer/new` | Select job, relationship and candidate permission | Referral draft/permission state | `E` | `D`: invitation-to-consent continuation and permission expiry |
| 2 | Agency assignment `/agency/assignments/:id` | Review active job, region, dates, fee and notice | Effective submission scope | `E` | Add assignment capacity, exclusions and version comparison |
| 3 | Agency submission `/agency/submissions/new` | Submit candidate, authority and ownership evidence | AgencySubmission in validation | `E` | `D`: structured validation results and candidate-notice receipt |
| 4 | Partner operations `/hr/agency-assignments/:id` | Accept, return, expire or dispute source relationship | Ownership/fee decision | `V` | `N`: recruiting-side validation and commercial dispute workbench |
| 5 | Candidate identity `/hr/candidates/:id` | Perform privacy-safe duplicate review | Safe match or new identity | `V` | Reuse UC-03 duplicate-resolution workbench without revealing existing owner |
| 6 | Application `/hr/applications/new` | Create separate application after validation | Application + SourceAttribution | `E` | `D`: controlled conversion action and immutable source lineage |
| 7 | Referral/agency detail | Track policy-safe milestones, fee or reward | Reward/Fee milestone events | `E/V` | `D`: configurable eligibility calculation, approval and payment/dispute timeline |

#### DFD contract

`Referrer/Agency → authority and assignment → Submission Validation → Ownership Ledger → privacy-safe identity match → Candidate Store → controlled conversion → Application Ledger → Reward/Fee Ledger`

Feature status: partner portals and validations are visible/executable; permission continuation, recruiting validation, conversion, ownership clock and reward/fee calculation need depth. Real partner SSO and payment are production-only.

### UC-05 — High-volume or campus campaign to managed cohort

Business contract: A versioned program organizes large candidate populations into capacity-controlled cohorts. Bulk actions create work or invitations only; they do not rank, reject or advance candidates autonomously.

Actors: Campus/Volume Recruiter, Coordinator, Event Staff, Candidate, Interviewer/Assessor.

#### Screen and action contract

| Sequence | Screen / route | Action | Data effect | Current | Required feature treatment |
| ---: | --- | --- | --- | --- | --- |
| 1 | High-volume program `/hr/high-volume/:campaignId` | Define jobs, stages, population and owners | Campaign/program version | `E/V` | `D`: reusable program template and explicit population snapshot |
| 2 | Planning `/hr/high-volume/:campaignId/planning` | Model capacity, eligibility and exception owners | Cohort plan and capacity forecast | `E` | `D`: adjustable capacity simulator and reviewer workload impact |
| 3 | Cohort `/hr/high-volume/:campaignId/cohorts/:cohortId` | Preview eligible, suppressed and exception rows | Versioned cohort snapshot | `E` | `D`: row-level inclusion explanations and controlled selection overrides |
| 4 | Bounded bulk action | Prepare invitations/tasks and confirm | Work items/invitations with idempotency keys | `E` | `D`: complete batch preview, cancel/undo and partial-failure handling |
| 5 | Event/check-in `/hr/events/:eventId/check-in` | Check in and reconcile attendance | Attendance records/events | `E` | Link attendance to cohort/applications and exception owners |
| 6 | Human evidence | Complete assigned assessment/interview | Scorecard/task receipts | `V` | `N`: cohort evidence-completion board without aggregate candidate ranking |
| 7 | Analytics `/hr/high-volume/:campaignId/analytics` | Review volume, capacity, conversion and exceptions | Cohort metrics and drill-through | `E` | `D`: denominator definitions, cohort comparison and action-to-metric causality |

#### DFD contract

`Applications → deterministic criteria → Cohort Builder → Cohort Store → capacity-aware invitation → Work/Scheduling Store → attendance/human evidence → Cohort Analytics`

Feature status: planning, cohorts, bulk preview and analytics exist; program templates, row explanations, undo/partial failure, evidence board and metric causality require deeper wireframes. Bulk messaging and calendar providers are production-only.

### UC-06 — Candidate availability to completed interview

Business contract: Candidate constraints, interviewer capacity, interview-plan rules, conflicts and accommodations produce a versioned session that can be rescheduled, cancelled or completed safely.

Actors: Candidate, Recruiting Coordinator, Interviewer, Hiring Manager, Candidate Support.

#### Screen and action contract

| Sequence | Screen / route | Action | Data effect | Current | Required feature treatment |
| ---: | --- | --- | --- | --- | --- |
| 1 | Candidate hub `/my-applications/:id` | Submit timezone-aware availability and private support path | Availability window/preferences | `E` | Add recurring windows, blackout dates and expiry |
| 2 | Interview workspace `/hr/interviews/:id` | Select plan, session type, duration and panel | InterviewSession draft | `E/V` | `N`: visual scheduling board with candidate/panel/timezone availability overlay |
| 3 | Panel assignment | Check eligibility, workload and conflicts | Interviewer assignments | `V` | `N`: interviewer pool/rotation, conflict and capacity selector |
| 4 | Calendar preview | Send synthetic invitation and reminder | CalendarEvent version/preview | `V` | `D`: attendee-specific status, delivery preview and provider-failure state |
| 5 | Candidate response | Confirm, reschedule, cancel or request accommodation | Session state and coordinator work | `E` | Show impact before changing current confirmed version |
| 6 | Interviewer portal `/interviewer/:assignmentId` | Review brief, declare conflict and join/complete | Conflict and session events | `E` | Add substitute-interviewer and day-of failure recovery |
| 7 | Scorecard queue `/hr/assignments/:id` | Expose assigned scorecard and due time | Scorecard work item | `E` | Tie due date and rubric version to completed session version |

#### DFD contract

`Candidate → availability/accommodation channel → Scheduling Store → panel selection → Interview Session Store → calendar preview → Candidate/Interviewer responses → completed session → Scorecard Queue`

Feature status: availability, interview details and portals exist; scheduling board, pool selection, version impact and day-of recovery need new/deeper wireframes. Real calendar/video delivery is production-only.

### UC-07 — Structured evidence to human hiring decision

Business contract: Independent, versioned interview evidence is completed before an authorized person records a hiring decision. Readiness indicators may explain blockers but cannot recommend or select a candidate.

Actors: Interviewer, Hiring Manager, Recruiter, Integrity Reviewer, Auditor.

#### Screen and action contract

| Sequence | Screen / route | Action | Data effect | Current | Required feature treatment |
| ---: | --- | --- | --- | --- | --- |
| 1 | Interviewer portal `/interviewer/:id` | Review rubric, declare conflict and submit evidence | Versioned scorecard | `E` | Add autosave, evidence examples, confidence and post-submit amendment reason |
| 2 | Scorecard `/hr/assignments/:id` | Verify immutable submission and peer-blind state | Assignment/scorecard receipt | `E` | `D`: explicit lock, amendment/version timeline and conflict substitution |
| 3 | Readiness `/hr/decisions/:applicationId` | Calculate missing evidence and competency coverage | DecisionReadiness projection | `E` | `D`: evidence coverage map and rule-level blocker explanations |
| 4 | Debrief | Compare structured evidence after release | Debrief record and questions | `V` | `N`: dedicated debrief workspace with released evidence, notes and unresolved conflicts |
| 5 | Human decision | Record outcome, rationale and opening impact | Decision event | `E/V` | `D`: decision reason taxonomy, authority, confirmation and correction path |
| 6 | Candidate/application timeline | Publish candidate-safe status and next action | Candidate-safe status event | `E` | `D`: content preview and communication timing control |
| 7 | Governance/analytics | Audit evidence completeness and process outcomes | Audit/metric projection | `E/V` | Add decision-to-metric lineage and exception drill-through |

#### DFD contract

`Interviewers → independent evidence → Scorecard Store → readiness calculation → Debrief Process → authorized human decision → Decision Ledger → candidate-safe status + analytics/audit`

Feature status: scorecards and decision readiness are executable; amendment/version controls, evidence map, debrief workspace and decision correction require depth. Durable evidence isolation is production-only.

### UC-08 — Assessment/background check to governed outcome

Business contract: Every consequential screening journey binds the correct notice and authority, provides accessibility/support and redress, and requires attributed human review.

Actors: Candidate, Candidate Support, Assessment/Reference/Background Provider, Integrity Reviewer, Privacy/Legal.

#### Screen and action contract

| Sequence | Screen / route | Action | Data effect | Current | Required feature treatment |
| ---: | --- | --- | --- | --- | --- |
| 1 | Candidate task `/my-tasks/:taskId` | Review notice, purpose, accessibility and deadline | Notice-view event | `E` | `D`: jurisdiction/effective-policy explanation and complete notice history |
| 2 | Candidate action | Start/complete assessment, add reference or authorize check | Task submission/authorization | `E` | `D`: provider status timeline and candidate-controlled withdrawal where permitted |
| 3 | Support `/support/new` | Request format, accessibility, correction or private help | Purpose-limited support case | `E` | Direct task-to-case lineage with safe context selection |
| 4 | Provider/recovery | Receive status or prepare retry/replacement | Provider-safe effect history | `V` | `N`: provider-event and retry/reconciliation timeline |
| 5 | Pre-adverse task | Review current information, rights and response window | Dispute/correction response | `E` | `D`: visible protected countdown, extension and delivery-version handling |
| 6 | Regulated case `/hr/cases/:caseId` | Review minimum evidence and candidate redress | Human review state | `E` | `D`: separated evidence, notice, decision-pause and redress tabs |
| 7 | Human outcome | Close with rationale and candidate-safe result | Attributed outcome/audit event | `E/V` | Add authority confirmation and outcome correction/reopen path |

#### DFD contract

`Candidate → notice/consent/access needs → Candidate Task Store → provider request/status → Restricted Evidence Store → correction/dispute → Human Review → Regulated Outcome Ledger → decision/candidate-safe status`

Feature status: bespoke task/case journeys exist; policy history, provider event timeline, response clock, evidence separation and reopen paths need depth. Providers, approved legal content and restricted storage are production-only.

### UC-09 — Hiring decision to accepted offer

Business contract: A current human decision produces a versioned offer. Required approvals apply to the exact version; candidate response affects the opening and creates a controlled pre-hire handoff.

Actors: Recruiter, Hiring Manager, Compensation/Offer Approver, Candidate, HRIS Operator.

#### Screen and action contract

| Sequence | Screen / route | Action | Data effect | Current | Required feature treatment |
| ---: | --- | --- | --- | --- | --- |
| 1 | Decision `/hr/decisions/:applicationId` | Start offer from authorized decision | Offer draft linked to decision/opening | `E/V` | `N`: dedicated offer builder with terms, contingencies and comparison |
| 2 | Offer builder | Validate pay, currency, dates, policy and documents | OfferVersion | `V` | `N`: compensation scenario panel, policy explanations and version diff |
| 3 | Approval | Approve, return or deny current offer version | Approval steps/events | `E` | `D`: multi-approver timeline, separation of duty, return-to-author and expiry |
| 4 | Candidate hub `/my-applications/:id` | Review exact offer, questions and documents | View/question events | `E` | `D`: offer-question thread and explicit material-change acknowledgement |
| 5 | Candidate response | Accept, decline or request clarification | Version-bound response | `E` | Add expiry, partial completion and revoked/superseded-link states |
| 6 | Opening/contingency | Reserve opening and track conditions | OpeningReservation and ContingencyCase | `V` | `N`: opening/contingency panel with release, expiry and rescission impacts |
| 7 | Handoff `/hr/onboarding` | Create linked PreHire once eligible | PreHire and handoff event | `E/V` | Expose idempotency, prerequisites and reconciliation receipt |

#### DFD contract

`Human Decision → offer terms → Offer Builder → Offer Version Store → exact-version approval → Approval Ledger → Candidate Response → Offer Ledger → opening reservation/contingencies → PreHire Handoff`

Feature status: approval, response and handoff are executable; offer builder, compensation/version comparison, candidate questions, contingencies and opening reservation require new/deeper wireframes. E-signature and compensation providers are production-only.

### UC-10 — Accepted candidate to validated pending worker

Business contract: Candidate, Application, PreHire, PendingWorker and Employee remain separately identifiable. Onboarding and HRIS handoff are versioned, correctable and idempotent.

Actors: Recruiter, People Operations, HRIS Operator, Configuration Admin, New Hire.

#### Screen and action contract

| Sequence | Screen / route | Action | Data effect | Current | Required feature treatment |
| ---: | --- | --- | --- | --- | --- |
| 1 | Onboarding new hire `/hr/onboarding/new-hires/:id` | Review offer/application/identity lineage | PreHire readiness projection | `E` | `D`: interactive lineage with source versions and allowed corrections |
| 2 | Templates `/hr/onboarding/templates` | Select population, locale and approved version | TemplateVersion selection | `E/V` | `D`: rule tester, effective dating and active-plan impact preview |
| 3 | Plan assignment | Assign owner, start date and version-pinned plan | OnboardingPlan/tasks | `E` | Add before/after generated task preview and conflict explanations |
| 4 | HRIS staging | Map PreHire fields to PendingWorker contract | Staged PendingWorker | `V` | `N`: side-by-side mapping and field-level validation workbench |
| 5 | Correction/retry | Correct mapping or identity conflict and replay | Corrected worker version/effect attempt | `E/V` | `D`: attempt history, idempotency key, owner and destination response |
| 6 | Identity invitation | Activate purpose-limited new-hire portal account | Portal account/session state | `V` | `N`: invitation, expiry, recovery and conversion-to-employee identity lifecycle |
| 7 | New-hire portal `/preboarding` | Open assigned plan and safe profile | Portal-safe onboarding projection | `E` | Display data provenance and correction status for worker-facing fields |

#### DFD contract

`Accepted Application → identity/offer facts → PreHire Store → template assignment → Onboarding Plan Store → HRIS mapping/validation → PendingWorker Store → reconciliation → New-Hire Identity/Portal`

Feature status: lineage, templates, plan assignment and correction exist; mapping workbench, attempt ledger and portal identity lifecycle require new/deeper wireframes. HRIS and IdP execution are production-only.

### UC-11 — Pre-hire to day-one readiness

Business contract: A version-pinned onboarding plan generates dependency-aware work for the new hire, manager, IT and facilities. Readiness requires reconciled evidence rather than manually asserted completion.

Actors: New Hire, People Operations, Manager, IT, Facilities, Benefits/Learning Owners.

#### Screen and action contract

| Sequence | Screen / route | Action | Data effect | Current | Required feature treatment |
| ---: | --- | --- | --- | --- | --- |
| 1 | New-hire home/tasks `/preboarding`, `/preboarding/tasks` | Review plan, due work and blockers | Portal task projection | `E` | `D`: dependency explanation, stage progress and cross-task correction status |
| 2 | Forms/documents `/preboarding/tasks/:id`, `/preboarding/documents` | Complete form, upload/evidence or synthetic signature | Submission/signature metadata | `E` | `D`: package/version view, reject/correct/expire/void and complete receipt history |
| 3 | Benefits/learning | Elect benefit and complete learning | Election/enrollment events | `E` | Add prerequisite, closed-window, waiver and provider-reconciliation states |
| 4 | Manager `/manager/new-hires/:id` | Confirm goals, agenda, buddy and check-ins | ManagerTask events | `E` | `D`: dependencies, delegation, overdue escalation and help-case lineage |
| 5 | IT `/it/requests/:id` | Fulfil/retry/cancel account or equipment | Provisioning effect/receipt | `E` | `D`: role/access bundle diff, asset/shipment timeline and revocation proof |
| 6 | Facilities `/facilities/requests/:id` | Prepare/revoke badge, desk or site access | Facilities effect/receipt | `E` | Add accessible-workplace handling and site-provider reconciliation |
| 7 | Exceptions `/hr/onboarding/exceptions` | Own, escalate, waive or resolve blocker | Exception state/evidence | `E` | `D`: dependency impact, SLA timeline, accepted-risk approval and reopen |
| 8 | Analytics `/hr/onboarding/analytics` | Reconcile completeness, critical path and readiness | Readiness metric/drill-through | `E` | `D`: causal refresh after actions, critical-path explanation and N/A semantics |

#### DFD contract

`Onboarding Plan → dependency/task generation → New-Hire/Manager/IT/Facilities Queues → private submissions + fulfilment effects → Evidence/Provisioning Stores → exception reconciliation → Day-One Readiness Projection`

Feature status: all actor portals are executable; dependency visualization, package lifecycle, delegation/escalation, fulfilment depth and causal readiness require deeper wireframes. Real document, signature, benefit, LMS, ITSM, IGA and facilities effects are production-only.

### UC-12 — Day one through day 90 and worker transitions

Business contract: Day-one and 30/60/90 milestones continue the same worker journey. Effective-dated transitions create impact previews, accountable downstream work and compensating/reversal actions.

Actors: Employee/New Hire, Manager, Buddy, People Operations, HRIS, IT, Facilities.

#### Screen and action contract

| Sequence | Screen / route | Action | Data effect | Current | Required feature treatment |
| ---: | --- | --- | --- | --- | --- |
| 1 | Day one `/preboarding/day-one` | Review agenda, contacts, access and help | DayOne milestone events | `E` | Add live readiness dependencies and day-of exception actions |
| 2 | Journey `/preboarding/journey` | Complete 30/60/90 activities and check-ins | Milestone progress | `E` | `D`: employee reflection, private support and experience survey flows |
| 3 | Manager/Buddy portals | Complete check-ins, goals and escalation | Manager/Buddy evidence | `E` | Add missed-check-in escalation, reassignment and relationship end |
| 4 | Transition `/hr/transitions/new` | Propose rehire/crossboard/relocate/convert/offboard/rescind/delay/no-show | WorkerTransition draft | `E` | `D`: policy-specific form variants, reason taxonomy and attachments metadata |
| 5 | Impact `/hr/transitions/:id/impact` | Preview identity, payroll, benefits, access, tasks and facility effects | Versioned impact set | `E` | `D`: before/after comparison, dependencies and owner/due-date generation |
| 6 | Approval and execution | Approve and create downstream work | Destination requests/effects | `V` | `N`: transition approval, execution plan and partial-success control board |
| 7 | Cancellation/compensation | Cancel, reverse or revoke affected effects | Compensating work events | `V` | `N`: explicit inverse-work graph, current safe state and unrecoverable warnings |
| 8 | Reconciliation/analytics | Compare expected/observed state and close | Transition outcome and metrics | `V` | `D`: destination receipt comparison, restatement and audit conclusion |

#### DFD contract

`Employee/Manager/Buddy → milestone evidence → Journey Store → transition proposal → Worker Lifecycle Ledger → impact/approval → Destination Work Queues → effect/reversal receipts → reconciliation and outcome analytics`

Feature status: milestones, portals and transition types exist; experience depth, approval/execution, inverse work and destination reconciliation need new/deeper wireframes. HRIS/payroll/benefits/access providers are production-only.

## 5. Cross-cutting control matrix

These controls must appear inside every relevant use case rather than living only on Administration or Governance pages.

| Control | Required visible data | Required action states | Required evidence |
| --- | --- | --- | --- |
| Identity and authorization | Current persona, relationship/scope, purpose, effective window, restricted groups | Allowed, denied, delegated, temporarily elevated, expired | Policy/version, actor, reason and denial audit |
| Data privacy and retention | Consent/notice version, classification, purpose, residency, retention, legal hold | Correct, export preview, restrict, delete preview, hold, deny | Store coverage, excluded data, reviewer and execution receipt |
| Integration and recovery | Contract version, mapping, business/idempotency key, attempt, provider status, owner | Test, stage, send-preview, retry, replay, cancel, reconcile | Source event, destination reference, current safe state and duplicate prevention |
| Analytics and reporting | Metric version, grain, population, numerator, denominator, freshness, security | Filter, drill, compare, save, schedule-preview, export-preview, restate | Query/definition version, source lineage, empty/N/A handling and delivery audit |
| Communication | Audience, channel, locale, template/version, authority, scheduled time | Preview, approve, suppress, cancel, resend-preview | Content version, recipient count, suppression result and delivery preview |
| Audit and change history | Previous/current version, actor, reason, related object/event | Inspect, compare, filter, export-preview | Immutable event reference and correlation/business key |

## 6. Implemented wireframe updates

All 35 items below are implemented in the synthetic v3.2 release. `P0` actions share one browser-memory domain ledger and create a versioned diff, event, receipt, downstream handoff and metric consequence. `P1` controls are available across the use-case tabs and control-center routes. `P2` capabilities are available through runbooks, scenarios, checkpoints, comparison, print, talk-track, rehearsal and feedback surfaces. Production-only boundaries in section 7 remain unchanged.

### P0 — Required for credible end-to-end demonstrations

| ID | Update | Use cases | Main routes/surfaces | Acceptance contract |
| --- | --- | --- | --- | --- |
| `WF-P0-01` | Shared cross-route business state, not presenter receipts alone | All | Global demo context and all journey routes | A completed action changes the same record, downstream queue, timeline and KPI across personas until deterministic reset |
| `WF-P0-02` | Level-two DFD mode tied to screens/actions/events | All | `/demo/flows/:useCaseId` | Every DFD process expands to route, action, inputs, outputs, objects, event, guard, denial and recovery |
| `WF-P0-03` | Requisition and multi-step approval workbench | UC-01 | Manager recruiting, Jobs | Submit/return/revise/approve/deny exact versions with headcount, compensation and audit evidence |
| `WF-P0-04` | Job/opening/posting lineage and publication readiness | UC-01 | Job detail/edit, Platform, Careers | Reviewer can distinguish grains, see blockers, preview version, publish/withdraw and reconcile every channel |
| `WF-P0-05` | Audience, consent and source-attribution builder | UC-02 | Talent CRM, campaigns, events, applications | Inclusion/exclusion, authority, suppression and conversion lineage are inspectable to row level |
| `WF-P0-06` | Candidate duplicate-resolution and governed correction/withdrawal | UC-03/04 | Candidates, Applications, Candidate hub | Safe match, field provenance, merge proposal, deny, correct and withdraw effects are demonstrable |
| `WF-P0-07` | Referral/agency recruiting-side validation and ownership conversion | UC-04 | Partner portals, agency operations, application creation | Submission becomes an application only after authority, assignment, duplicate and ownership validation |
| `WF-P0-08` | High-volume batch preview, undo and partial-failure board | UC-05 | Planning, cohort, recovery | Every selected/suppressed row is explained; confirm creates bounded work; cancellation/retry cannot duplicate effects |
| `WF-P0-09` | Visual interview scheduling and panel-capacity workbench | UC-06 | Interviews, candidate hub, interviewer portal | Timezone, availability, conflicts, workload, accommodation, reschedule and substitute-interviewer states are connected |
| `WF-P0-10` | Evidence coverage and structured debrief workspace | UC-07 | Scorecards, Decisions | Independent evidence, locks/amendments, competency coverage, missing evidence, conflicts and human decision are visible together |
| `WF-P0-11` | Regulated screening case timeline | UC-08 | Candidate tasks/support, Cases | Notice, consent, provider status, protected response window, dispute, decision pause, human outcome and reopen are one traceable flow |
| `WF-P0-12` | Offer builder, version comparison, approval and contingency board | UC-09 | Decisions, Candidate hub, Onboarding | Terms, policy, version diff, approval, candidate questions/response, opening and contingencies reconcile |
| `WF-P0-13` | PreHire/PendingWorker identity and mapping workbench | UC-10 | Onboarding, Platform, New-hire | Source lineage, field mapping, validation, correction, attempt history, identity invite and reconciliation are demonstrable |
| `WF-P0-14` | Dependency-aware onboarding readiness | UC-11 | New-hire, manager, IT, facilities, onboarding operations | Task/effect completion updates critical path, exceptions and readiness with evidence rather than manual status |
| `WF-P0-15` | Transition approval, execution and compensating-work graph | UC-12 | Transitions, role portals, analytics | Impact, approval, downstream actions, partial failure, cancellation/inverse work and reconciliation remain connected |

### P1 — Required for depth, trust and operational realism

| ID | Update | Applies to | Acceptance contract |
| --- | --- | --- | --- |
| `WF-P1-01` | Universal record lineage viewer | All | Shows related business grains and versions from requisition through employee/transition without conflating objects |
| `WF-P1-02` | Universal state-change receipt/diff | All mutations | Shows previous/current state, actor, reason, event, downstream effects and correlation key |
| `WF-P1-03` | Cross-persona handoff inbox | All | Next actor receives the exact work item and minimum required context after each upstream action |
| `WF-P1-04` | Communication preview and suppression center | UC-01–11 | Shows channel, audience, content/locale version, authority, suppressed rows and scheduled/cancelled state |
| `WF-P1-05` | Rule explanation drawer | All guarded actions | Explains which policy/rule passed or failed and how to recover without exposing restricted evidence |
| `WF-P1-06` | Complete object activity and audit timeline | All | Correlates UI action, event, integration attempt, communication and metric restatement |
| `WF-P1-07` | Dashboard causality and reconciliation | UC-02/05/07/11/12 | Transactional actions visibly change governed KPIs, queues and drill-through rows using consistent filters/denominators |
| `WF-P1-08` | Persona row/field/purpose inspection | All internal/partner portals | Demonstrates allowed, masked, denied and expired access at navigation, row, field and action level |
| `WF-P1-09` | Country/worker-type variant preview | UC-01/03/08/09/10/11/12 | Side-by-side content, data, rule and task differences with approval/effective-state blockers |
| `WF-P1-10` | Complete empty, stale, duplicate, denial, cancellation and recovery states | All | Every use case has executable happy, no-data, validation, stale, conflict, permission, provider-failure and retry states |
| `WF-P1-11` | Report/report-delivery contract tied to use cases | All | Save, schedule-preview, subscribe-preview, export-preview and delivery audit retain role scope and metric version |
| `WF-P1-12` | Manual accessibility and moderated-demo evidence hooks | All | Each journey records keyboard, screen-reader, mobile, readability and facilitator/user observations |

### P2 — Demo facilitation and presentation improvements

| ID | Update | Acceptance contract |
| --- | --- | --- |
| `WF-P2-01` | 10/30/60-minute runbooks inside Demo Studio | Presenter can choose audience/time and receive the exact ordered steps and optional skips |
| `WF-P2-02` | Named scenario/record catalogue | Every demo identifies start record, state, persona, prerequisite and reset result |
| `WF-P2-03` | Checkpoints and bookmarks | Presenter can save/return to a deterministic step without navigating manually |
| `WF-P2-04` | Compare happy and exception paths | DFD and receipt views compare data/state differences side by side |
| `WF-P2-05` | Print/export-ready DFD and use-case brief | One presentation-safe page includes actors, flow, screens, objects, rules, exceptions and boundaries |
| `WF-P2-06` | On-screen talk track and expected outcome | Presenter sees business message, action, expected state and verification question per step |
| `WF-P2-07` | Rehearsal status and issue classification | Each journey records not-run/pass/fail and classifies findings as polish, stitching, wireframe gap or production-only |
| `WF-P2-08` | Demo feedback capture | Reviewer comments are associated with use case, step, persona and screen without creating real user data |

## 7. What should not be added to the GitHub Pages wireframe

The following remain explicit production requirements and should be represented only by safe previews, contracts and receipts:

- real authentication, SSO, MFA, account recovery or authorization;
- real candidate, employee, document, assessment or background data;
- persistent database or event storage;
- actual email, SMS, calendar or notification delivery;
- real e-signature, background, assessment or reference-provider calls;
- HRIS, payroll, benefits, LMS, ITSM, identity-governance or facilities effects;
- real credentials, secrets, payment/reward transfers or job-board publication;
- legal approval of notices, adverse-action, benefits, employment or country content.

## 8. Wireframe definition of done

A use case is wireframe-complete only when a reviewer can:

1. launch a deterministic record and persona;
2. understand the trigger, prerequisites and expected outcome;
3. perform every material action on the named route;
4. see validation, permission and business-rule explanations;
5. follow the same record across actor handoffs;
6. inspect object, version, event and downstream data changes;
7. exercise at least one exception, cancellation and recovery path;
8. verify an action receipt, audit event and dashboard/queue consequence;
9. reset and replay the use case without stale browser state;
10. distinguish synthetic wireframe evidence from production-only requirements.

All 27 substantive P0/P1 updates and eight P2 demonstration updates are implemented in v3.2. Completion here means executable synthetic wireframe behavior and automated evidence—not production service readiness, accountable manual accessibility approval or pilot authorization.
