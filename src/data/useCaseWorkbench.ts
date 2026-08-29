export type WireframePriority = "P0" | "P1" | "P2";

export type DataField = {
  label: string;
  value: string;
  classification: "Public" | "Internal" | "Confidential" | "Restricted";
};

export type LevelTwoProcess = {
  id: string;
  sequence: number;
  actor: string;
  title: string;
  route: string;
  action: string;
  input: string;
  output: string;
  object: string;
  event: string;
  store: string;
  guard: string;
  denial: string;
  recovery: string;
  featureId?: string;
};

export type WireframeUseCase = {
  id: string;
  code: string;
  title: string;
  trigger: string;
  outcome: string;
  recordId: string;
  actors: string[];
  processes: LevelTwoProcess[];
};

export type P0Feature = {
  id: string;
  useCaseIds: string[];
  title: string;
  route: string;
  actor: string;
  recordId: string;
  primaryAction: string;
  cancelAction: string;
  exceptionAction: string;
  recoveryAction: string;
  fromState: string;
  toState: string;
  object: string;
  event: string;
  store: string;
  handoff: string;
  guard: string;
  exception: string;
  metric: string;
  talkTrack: string;
  communication: string;
  fields: DataField[];
};

export type BacklogFeature = {
  id: string;
  priority: WireframePriority;
  title: string;
  acceptance: string;
  surface: string;
};

const p = (
  id: string,
  sequence: number,
  actor: string,
  title: string,
  route: string,
  action: string,
  input: string,
  output: string,
  object: string,
  event: string,
  store: string,
  guard: string,
  denial: string,
  recovery: string,
  featureId?: string,
): LevelTwoProcess => ({
  id,
  sequence,
  actor,
  title,
  route,
  action,
  input,
  output,
  object,
  event,
  store,
  guard,
  denial,
  recovery,
  featureId,
});

export const wireframeUseCases: WireframeUseCase[] = [
  {
    id: "uc-01",
    code: "UC-01",
    title: "Hiring demand to published job",
    trigger: "A manager identifies an approved hiring need.",
    outcome: "A reconciled public posting is bound to approved demand and individual openings.",
    recordId: "REQ-DEMO-001",
    actors: ["Hiring Manager", "Recruiter", "Finance Approver", "Compensation Approver", "Candidate"],
    processes: [
      p("UC01-P01", 1, "Hiring Manager", "Capture governed demand", "/manager/recruiting", "Create requisition draft", "Workforce plan, position, location, openings and target date", "Versioned requisition draft", "Requisition", "RequisitionDrafted", "Workforce demand ledger", "Current plan and manager relationship", "Unavailable headcount or duplicate demand", "Return to draft with the conflicting plan line", "WF-P0-03"),
      p("UC01-P02", 2, "Hiring Manager", "Submit exact version", "/manager/recruiting/REQ-DEMO-001", "Submit for approval", "Requisition version and justification", "Approval work items", "ApprovalStep", "RequisitionSubmitted", "Approval ledger", "Complete budget, level and compensation evidence", "Incomplete or stale version", "Correct only failed fields and resubmit", "WF-P0-03"),
      p("UC01-P03", 3, "Approvers", "Approve or return", "/hr/jobs/JOB-DEMO-001", "Record attributed decision", "Current requisition version and policy", "Approved or returned demand", "ApprovalDecision", "RequisitionApproved", "Approval ledger", "No self-approval and all required roles", "Separation-of-duty conflict", "Reassign approver or return with reason", "WF-P0-03"),
      p("UC01-P04", 4, "Recruiter", "Create job and openings", "/hr/jobs/JOB-DEMO-001/edit", "Configure hiring plan", "Approved demand and job-family defaults", "Job plus two open positions", "Job, Opening", "JobConfigured", "Recruiting ledger", "Opening count equals approved demand", "Opening or content mismatch", "Reconcile grains before readiness", "WF-P0-04"),
      p("UC01-P05", 5, "Recruiter", "Publish immutable posting version", "/hr/jobs/JOB-DEMO-001", "Run readiness and publish", "Candidate content, locale, pay and channel rules", "Posting version and deliveries", "JobPostingVersion", "JobPostingVersionPublished", "Distribution ledger", "All readiness rules pass", "Missing pay, locale or approval evidence", "Correct, republish or withdraw without overwriting history", "WF-P0-04"),
    ],
  },
  {
    id: "uc-02",
    code: "UC-02",
    title: "Talent campaign or event to consented applicant",
    trigger: "Talent marketing defines an audience or recruiting event.",
    outcome: "A consented application retains its campaign, event and source-touch lineage.",
    recordId: "CAM-DEMO-001",
    actors: ["Talent Marketer", "Campus Recruiter", "Candidate", "Recruiting Coordinator"],
    processes: [
      p("UC02-P01", 1, "Talent Marketer", "Build eligible audience", "/hr/talent", "Apply segment rules", "Community, skills, location, consent and exclusions", "Eligible and suppressed population snapshot", "AudienceSnapshot", "AudienceBuilt", "Recruiting CRM", "Current purpose and consent", "Expired authority or suppression", "Exclude row with visible reason", "WF-P0-05"),
      p("UC02-P02", 2, "Campus Recruiter", "Configure event and campaign", "/hr/events/REV-DEMO-001", "Bind event to campaign", "Capacity, locale, channel and registration policy", "Versioned event invitation", "CareerEvent", "CampaignActivated", "Campaign ledger", "Approved content and capacity", "Unapproved content version", "Return to content owner", "WF-P0-05"),
      p("UC02-P03", 3, "Candidate", "Register with consent", "/events/EVT-DEMO-001", "Register or join waitlist", "Contact, consent version and source token", "Registration or waitlist position", "EventRegistration", "EventRegistered", "Relationship ledger", "Capacity and consent are current", "Capacity reached or consent withdrawn", "Waitlist, cancel or request support", "WF-P0-05"),
      p("UC02-P04", 4, "Candidate", "Start attributed application", "/careers/jobs/product-designer-remote-demo", "Follow source-bound job link", "Campaign, event and posting-version token", "Draft application with immutable source touch", "SourceTouch, Application", "ApplicationStarted", "Application ledger", "Published posting remains effective", "Stale or withdrawn posting", "Offer current alternatives without losing source history", "WF-P0-05"),
    ],
  },
  {
    id: "uc-03",
    code: "UC-03",
    title: "Candidate application and identity resolution",
    trigger: "A candidate starts a version-bound job application.",
    outcome: "A valid application is linked to the correct candidate identity with governed provenance.",
    recordId: "APP-DEMO-001",
    actors: ["Candidate", "Recruiter", "Candidate Support", "Privacy Reviewer"],
    processes: [
      p("UC03-P01", 1, "Candidate", "Create recoverable draft", "/apply/product-designer-remote-demo/profile", "Save profile and consent", "Profile, answers, consent and document metadata", "Versioned application draft", "ApplicationDraft", "ApplicationDrafted", "Application ledger", "Current notice and eligible posting", "Required consent or eligibility missing", "Preserve draft and explain exact blocker", "WF-P0-06"),
      p("UC03-P02", 2, "Identity Reviewer", "Resolve possible duplicate", "/hr/candidates/PER-DEMO-001", "Compare provenance and propose match", "Identity signals and field sources", "Safe match, new identity or review case", "CandidateIdentity", "DuplicateReviewCompleted", "Identity ledger", "Minimum-necessary evidence and authority", "Ambiguous match or restricted source", "Keep identities separate and escalate", "WF-P0-06"),
      p("UC03-P03", 3, "Candidate", "Submit exact versions", "/apply/product-designer-remote-demo/review", "Validate and submit", "Posting version, answers and notice versions", "Immutable application attempt", "Application", "ApplicationSubmitted", "Application ledger", "All sections valid and no stale terms", "Changed posting or invalid answer", "Review changed sections and resubmit", "WF-P0-06"),
      p("UC03-P04", 4, "Candidate Support", "Correct or withdraw", "/my-applications/APP-DEMO-001", "Request governed change", "Candidate-safe record and reason", "Correction or withdrawal work item", "ApplicationChangeRequest", "ApplicationChangeRequested", "Case ledger", "Requester relationship and allowed field", "Consequential or restricted change", "Route to attributed reviewer with downstream impact", "WF-P0-06"),
    ],
  },
  {
    id: "uc-04",
    code: "UC-04",
    title: "Referral or agency submission to validated application",
    trigger: "An employee or assigned agency proposes a candidate for a job.",
    outcome: "A permission-bound source relationship converts into a separate application only after validation.",
    recordId: "SUB-DEMO-001",
    actors: ["Employee Referrer", "Agency User", "Candidate", "Recruiter", "Partner Administrator"],
    processes: [
      p("UC04-P01", 1, "Partner", "Capture authority and assignment", "/agency/submissions/new", "Prepare submission", "Job scope, candidate permission, assignment and ownership claim", "Submission in validation", "AgencySubmission", "PartnerSubmissionCreated", "Partner ledger", "Effective assignment and candidate authority", "Expired assignment or missing notice", "Return safely without revealing another owner", "WF-P0-07"),
      p("UC04-P02", 2, "Recruiter", "Validate duplicate and ownership", "/hr/agency-assignments/AGA-DEMO-001", "Run privacy-safe validation", "Submission, assignment and identity signals", "Accepted, returned or disputed relationship", "SourceRelationship", "SourceValidated", "Ownership ledger", "Current assignment and minimum-necessary match", "Duplicate, ownership conflict or scope mismatch", "Open dispute workbench and preserve evaluation isolation", "WF-P0-06"),
      p("UC04-P03", 3, "Recruiter", "Convert to application", "/hr/applications/new", "Create controlled application", "Validated relationship, candidate and job", "Separate application with source lineage", "Application", "PartnerSubmissionConverted", "Application ledger", "No active candidate-job application exists", "Duplicate active application", "Link source touch without creating a duplicate", "WF-P0-07"),
      p("UC04-P04", 4, "Partner Administrator", "Track fee or reward milestone", "/referrer/REF-DEMO-001", "Review eligibility and dispute", "Policy version and candidate-safe milestone", "Approved, pending or disputed reward", "RewardMilestone", "RewardEligibilityEvaluated", "Reward ledger", "Policy and employment relationship are current", "Policy exclusion or disputed ownership", "Human review without changing candidate evaluation", "WF-P0-07"),
    ],
  },
  {
    id: "uc-05",
    code: "UC-05",
    title: "High-volume or campus campaign to managed cohort",
    trigger: "A bounded high-volume recruiting program is approved.",
    outcome: "A capacity-controlled cohort has explained membership, owned exceptions and reconciled evidence.",
    recordId: "HVC-001",
    actors: ["Volume Recruiter", "Coordinator", "Event Staff", "Candidate", "Interviewer"],
    processes: [
      p("UC05-P01", 1, "Volume Recruiter", "Version the program", "/hr/high-volume/HVC-001", "Define population and owners", "Jobs, stages, dates, capacity and criteria", "Program version", "HighVolumeCampaign", "ProgramVersioned", "Program ledger", "Bounded population and human-owned decisions", "Unbounded or ranking rule", "Remove prohibited rule and reapprove", "WF-P0-08"),
      p("UC05-P02", 2, "Coordinator", "Plan human capacity", "/hr/high-volume/HVC-001/planning", "Simulate capacity", "Candidate volume, slots and reviewer workload", "Cohort capacity plan", "CapacityPlan", "CapacityPlanned", "Planning ledger", "Capacity covers required human work", "Oversubscribed session or reviewer", "Split cohort or add approved capacity", "WF-P0-08"),
      p("UC05-P03", 3, "Coordinator", "Preview bounded batch", "/hr/high-volume/HVC-001/cohorts/COH-DEMO-001", "Explain selection and suppression", "Versioned population and deterministic criteria", "Selected, suppressed and exception rows", "CohortSnapshot", "BatchPreviewed", "Cohort ledger", "Every row has an explanation", "Stale population or rule conflict", "Refresh snapshot and preserve prior comparison", "WF-P0-08"),
      p("UC05-P04", 4, "Coordinator", "Confirm, cancel or retry", "/hr/recovery/RCV-DEMO-001", "Create bounded work", "Approved batch and idempotency key", "Invitations or tasks plus per-row receipts", "BatchExecution", "BatchExecuted", "Execution ledger", "No autonomous advancement or rejection", "Partial provider failure", "Retry failed rows without duplicating successes", "WF-P0-08"),
      p("UC05-P05", 5, "Volume Recruiter", "Reconcile cohort outcome", "/hr/high-volume/HVC-001/analytics", "Inspect conversion and exceptions", "Cohort, attendance, evidence and work receipts", "Denominator-bound metrics and drill-through", "CohortMetric", "CohortReconciled", "Analytics store", "Metric grain and population are explicit", "Zero denominator or stale evidence", "Show N/A and restatement reason", "WF-P0-08"),
    ],
  },
  {
    id: "uc-06",
    code: "UC-06",
    title: "Candidate availability to completed interview",
    trigger: "An application reaches an authorized interview-scheduling milestone.",
    outcome: "A versioned interview session completes with an eligible panel and due scorecards.",
    recordId: "INT-DEMO-001",
    actors: ["Candidate", "Coordinator", "Interviewer", "Hiring Manager", "Candidate Support"],
    processes: [
      p("UC06-P01", 1, "Candidate", "Submit constraints", "/my-applications/APP-DEMO-001", "Share availability", "Timezone, windows, blackout dates and private support", "Versioned availability", "AvailabilityWindow", "AvailabilitySubmitted", "Scheduling store", "Window is current and support data is separated", "Expired window or inaccessible slot", "Request new window without exposing private reason", "WF-P0-09"),
      p("UC06-P02", 2, "Coordinator", "Build session and panel", "/hr/interviews/INT-DEMO-001", "Overlay availability and capacity", "Plan, duration, panel pool, conflicts and workload", "Conflict-free session draft", "InterviewSession", "InterviewScheduled", "Interview ledger", "Eligible panel and no conflicts", "Timezone, conflict or capacity failure", "Select substitute or alternate slot", "WF-P0-09"),
      p("UC06-P03", 3, "Candidate", "Confirm or reschedule", "/my-applications/APP-DEMO-001", "Respond to exact invitation", "Session version and candidate constraints", "Confirmed, reschedule or cancellation request", "InterviewResponse", "InterviewConfirmed", "Scheduling store", "Response targets current session version", "Superseded invitation", "Open current version and preserve history", "WF-P0-09"),
      p("UC06-P04", 4, "Interviewer", "Declare conflict or complete", "/interviewer/ASN-DEMO-001", "Open minimum-necessary brief", "Assignment, rubric and session version", "Completed session and due scorecard", "InterviewAssignment", "InterviewCompleted", "Evidence ledger", "Assignment active and purpose current", "Day-of absence or conflict", "Activate substitute and regenerate due work", "WF-P0-09"),
    ],
  },
  {
    id: "uc-07",
    code: "UC-07",
    title: "Structured evidence to human hiring decision",
    trigger: "Required interview sessions complete and scorecard work becomes due.",
    outcome: "An authorized human records an attributed decision using independent, versioned evidence.",
    recordId: "APP-DEMO-001",
    actors: ["Interviewer", "Recruiter", "Hiring Manager", "Decision Owner"],
    processes: [
      p("UC07-P01", 1, "Interviewer", "Submit independent scorecard", "/hr/assignments/ASN-DEMO-001", "Rate rubric and cite evidence", "Rubric version, observations and confidence", "Locked scorecard version", "Scorecard", "ScorecardSubmitted", "Evidence ledger", "Assigned interviewer and completed session", "Missing evidence or peer influence", "Return for independent completion", "WF-P0-10"),
      p("UC07-P02", 2, "Recruiter", "Inspect evidence coverage", "/hr/assignments", "Reconcile competencies and missing work", "Plan requirements, sessions and scorecards", "Coverage map and blockers", "EvidenceCoverage", "DecisionReadinessCalculated", "Decision ledger", "Required evidence complete", "Missing, late or conflicted evidence", "Reopen assignment or record approved exception", "WF-P0-10"),
      p("UC07-P03", 3, "Hiring Manager", "Run structured debrief", "/hr/decisions/APP-DEMO-001", "Compare evidence and conflicts", "Independent scorecards and criterion coverage", "Debrief conclusion without ranking", "Debrief", "DebriefCompleted", "Decision ledger", "Evidence remains attributed and amendments visible", "Consensus pressure or prohibited attribute", "Pause and escalate to process reviewer", "WF-P0-10"),
      p("UC07-P04", 4, "Decision Owner", "Record human decision", "/hr/decisions/APP-DEMO-001", "Select outcome and rationale", "Debrief, opening and authority", "Attributed decision and candidate-safe status", "HiringDecision", "HiringDecisionRecorded", "Decision ledger", "Human authority and current evidence", "Unauthorized or stale decision", "Reopen to current version with audit trail", "WF-P0-10"),
    ],
  },
  {
    id: "uc-08",
    code: "UC-08",
    title: "Assessment or background check to governed outcome",
    trigger: "A versioned assessment or screening task is assigned at an authorized stage.",
    outcome: "A correctable, human-reviewed outcome preserves notice, response windows and redress.",
    recordId: "CTK-004",
    actors: ["Candidate", "Recruiter", "Screening Reviewer", "Candidate Support"],
    processes: [
      p("UC08-P01", 1, "Candidate", "Review notice and consent", "/my-tasks/CTK-004", "Acknowledge current notice", "Purpose, provider, data, rights and expiry", "Notice and consent receipt", "CandidateTask", "ScreeningConsentRecorded", "Regulated case ledger", "Current approved notice and optional support", "Expired or declined consent", "Pause case and provide support/alternative", "WF-P0-11"),
      p("UC08-P02", 2, "Screening Coordinator", "Prepare provider request", "/hr/cases/CASE-DEMO-001", "Validate minimum data and send preview", "Task, consent and provider contract", "Prepared request and correlation key", "ProviderRequest", "ScreeningRequestPrepared", "Integration ledger", "Required data only and current consent", "Mapping or provider failure", "Correct mapping and replay same business key", "WF-P0-11"),
      p("UC08-P03", 3, "Candidate", "Correct or dispute", "/my-tasks/CTK-004", "Submit protected response", "Notice, report summary and supporting metadata", "Dispute and decision pause", "ScreeningDispute", "ScreeningDisputed", "Regulated case ledger", "Response window remains open", "Late or incomplete response", "Human extension or support review", "WF-P0-11"),
      p("UC08-P04", 4, "Screening Reviewer", "Record governed outcome", "/hr/cases/CASE-DEMO-001", "Review separated evidence", "Provider result, dispute and policy snapshot", "Human outcome and candidate-safe status", "ScreeningOutcome", "ScreeningOutcomeRecorded", "Outcome ledger", "Protected window closed and dispute resolved", "Unresolved dispute or restricted evidence", "Keep hiring decision paused and reopen case", "WF-P0-11"),
    ],
  },
  {
    id: "uc-09",
    code: "UC-09",
    title: "Hiring decision to accepted offer",
    trigger: "An authorized human decision selects the offer path.",
    outcome: "A version-bound candidate response reserves an opening and creates an eligible pre-hire handoff.",
    recordId: "OFF-DEMO-001",
    actors: ["Recruiter", "Hiring Manager", "Offer Approver", "Candidate", "People Operations"],
    processes: [
      p("UC09-P01", 1, "Recruiter", "Compose versioned offer", "/hr/decisions/APP-DEMO-001", "Build terms and contingencies", "Decision, opening, compensation, dates and documents", "Validated offer draft", "OfferVersion", "OfferVersionCreated", "Offer ledger", "Authorized decision and available opening", "Policy or compensation variance", "Revise terms or request exception", "WF-P0-12"),
      p("UC09-P02", 2, "Offer Approver", "Approve exact version", "/hr/decisions/APP-DEMO-001", "Approve, return or deny", "Offer version, policy diff and separation of duty", "Approval timeline", "OfferApproval", "OfferApproved", "Approval ledger", "All required approvers and current version", "Self-approval or superseded terms", "Return to author and invalidate old candidate link", "WF-P0-12"),
      p("UC09-P03", 3, "Candidate", "Respond to exact version", "/my-applications/APP-DEMO-001", "Accept, decline or ask question", "Candidate-safe terms and material-change acknowledgement", "Version-bound response", "OfferResponse", "OfferAccepted", "Offer ledger", "Offer current and unexpired", "Expired, revoked or superseded offer", "Open current status and support thread", "WF-P0-12"),
      p("UC09-P04", 4, "People Operations", "Reserve and hand off", "/hr/onboarding", "Validate contingencies and create PreHire", "Acceptance, opening and contingency states", "Opening reservation and PreHire", "PreHire", "PreHireCreated", "Handoff ledger", "Acceptance effective and blockers resolved", "Contingency incomplete or duplicate handoff", "Hold, release opening or reconcile existing PreHire", "WF-P0-12"),
    ],
  },
  {
    id: "uc-10",
    code: "UC-10",
    title: "Accepted candidate to validated pending worker",
    trigger: "An accepted application becomes eligible for controlled onboarding handoff.",
    outcome: "Candidate, application, PreHire and PendingWorker remain linked, correctable and reconciled.",
    recordId: "NHR-DEMO-001",
    actors: ["People Operations", "HRIS Operator", "Configuration Admin", "New Hire"],
    processes: [
      p("UC10-P01", 1, "People Operations", "Confirm identity lineage", "/hr/onboarding/new-hires/NHR-DEMO-001", "Review source versions", "Candidate, application, offer and PreHire", "Eligible handoff projection", "PreHire", "PreHireValidated", "Handoff ledger", "One lineage and no unresolved identity conflict", "Duplicate or inconsistent identity", "Correct at authoritative source and restage", "WF-P0-13"),
      p("UC10-P02", 2, "Configuration Admin", "Assign approved template", "/hr/onboarding/templates", "Test population and pin version", "Population, locale, worker type and start date", "Version-pinned onboarding plan", "OnboardingPlan", "OnboardingPlanAssigned", "Onboarding ledger", "Active approved template matches population", "No approved locale/worker template", "Route to configuration approval", "WF-P0-13"),
      p("UC10-P03", 3, "HRIS Operator", "Map and validate worker", "/hr/platform/hris", "Compare source and destination fields", "PreHire, mapping version and destination contract", "Staged PendingWorker", "PendingWorker", "PendingWorkerStaged", "HRIS staging ledger", "Required fields, code mapping and effective date valid", "Mapping or identity conflict", "Correct exact field and replay same idempotency key", "WF-P0-13"),
      p("UC10-P04", 4, "New Hire", "Activate purpose-limited identity", "/preboarding", "Accept invitation and review profile", "Invite version, expiry and portal-safe worker projection", "Active new-hire session", "PortalIdentity", "NewHireIdentityActivated", "Identity ledger", "Invitation current and handoff reconciled", "Expired invite or mismatched identity", "Recover through purpose-limited verification", "WF-P0-13"),
    ],
  },
  {
    id: "uc-11",
    code: "UC-11",
    title: "Pre-hire to day-one readiness",
    trigger: "A version-pinned onboarding plan generates cross-functional work.",
    outcome: "Day-one readiness is derived from reconciled new-hire, manager, IT and facilities evidence.",
    recordId: "NHR-DEMO-001",
    actors: ["New Hire", "People Operations", "Manager", "IT", "Facilities"],
    processes: [
      p("UC11-P01", 1, "People Operations", "Generate dependency-aware plan", "/hr/onboarding/new-hires/NHR-DEMO-001", "Assign plan and owners", "Template version, start date, dependencies and roles", "Cross-functional tasks and critical path", "OnboardingPlan", "OnboardingTasksGenerated", "Onboarding ledger", "Owners and prerequisites resolve", "Missing owner or circular dependency", "Repair dependency graph before activation", "WF-P0-14"),
      p("UC11-P02", 2, "New Hire", "Complete private work", "/preboarding/tasks", "Submit forms and documents", "Task package, notice and version", "Completion or correction receipt", "OnboardingTask", "NewHireTaskCompleted", "Private evidence store", "Required fields valid and package current", "Rejected, expired or incomplete package", "Correct only failed fields and resubmit", "WF-P0-14"),
      p("UC11-P03", 3, "Manager", "Complete manager readiness", "/manager/new-hires/NHR-DEMO-001", "Confirm agenda, goals and buddy", "Manager tasks and upstream dependencies", "Manager readiness evidence", "ManagerTask", "ManagerReadinessConfirmed", "Onboarding ledger", "Manager relationship active", "Manager absent or task overdue", "Delegate with reason and preserve accountability", "WF-P0-14"),
      p("UC11-P04", 4, "IT and Facilities", "Fulfil access and workplace", "/it/requests/PRV-DEMO-001", "Complete or retry requests", "Role bundle, equipment, site and accommodations", "Provisioning and facilities receipts", "ProvisioningRequest", "ProvisioningReconciled", "Fulfilment ledger", "Approved access bundle and location", "Partial failure or changed start date", "Cancel/revoke and regenerate dependent work", "WF-P0-14"),
      p("UC11-P05", 5, "People Operations", "Reconcile critical path", "/hr/onboarding/analytics", "Inspect blockers and evidence", "All task/effect receipts and exceptions", "Ready or explicitly blocked projection", "ReadinessProjection", "DayOneReadinessCalculated", "Analytics store", "Every critical dependency has valid evidence", "Zero eligible population or unresolved blocker", "Show N/A or route blocker to accountable owner", "WF-P0-14"),
    ],
  },
  {
    id: "uc-12",
    code: "UC-12",
    title: "Day one through day 90 and worker transitions",
    trigger: "The worker starts or an effective relationship change is proposed.",
    outcome: "Milestones and transition effects remain effective-dated, reversible and reconciled.",
    recordId: "TRN-DEMO-001",
    actors: ["Employee", "Manager", "Buddy", "People Operations", "HRIS", "IT", "Facilities"],
    processes: [
      p("UC12-P01", 1, "Employee", "Complete day-one and 30/60/90 milestones", "/preboarding/journey", "Record progress and support needs", "Plan, reflections and milestone dates", "Milestone evidence", "WorkerJourney", "WorkerMilestoneCompleted", "Journey ledger", "Purpose and relationship remain current", "Missed milestone or private support need", "Escalate without exposing private content", "WF-P0-15"),
      p("UC12-P02", 2, "People Operations", "Propose effective-dated transition", "/hr/transitions/new", "Select transition and reason", "Worker, effective date, reason and attachments metadata", "Transition draft", "WorkerTransition", "WorkerTransitionProposed", "Lifecycle ledger", "Supported type and current worker state", "Conflicting or retroactive change", "Correct effective date or open exception", "WF-P0-15"),
      p("UC12-P03", 3, "Approvers", "Preview impact and approve", "/hr/transitions/TRN-DEMO-001/impact", "Compare before and after", "Identity, payroll, benefits, access, tasks and facilities impacts", "Approved execution plan", "TransitionImpact", "WorkerTransitionApproved", "Lifecycle ledger", "All impact owners and policy approvals present", "Missing downstream owner or policy conflict", "Return with affected dependencies", "WF-P0-15"),
      p("UC12-P04", 4, "System Owners", "Execute or compensate", "/hr/transitions/TRN-DEMO-001", "Create downstream work", "Approved plan and idempotency keys", "Per-destination effects and receipts", "TransitionExecution", "TransitionExecuted", "Effect ledger", "Current version and safe execution order", "Partial success or cancellation", "Run inverse work and surface unrecoverable warnings", "WF-P0-15"),
      p("UC12-P05", 5, "People Operations", "Reconcile final state", "/hr/transitions/TRN-DEMO-001/impact", "Compare expected and observed", "Destination receipts and compensating work", "Closed, blocked or restated outcome", "TransitionReconciliation", "TransitionReconciled", "Analytics store", "All required destinations agree", "Orphaned or inconsistent effect", "Assign owner, retry or accept bounded risk", "WF-P0-15"),
    ],
  },
];

const f = (
  id: string,
  useCaseIds: string[],
  title: string,
  route: string,
  actor: string,
  recordId: string,
  primaryAction: string,
  cancelAction: string,
  exceptionAction: string,
  recoveryAction: string,
  fromState: string,
  toState: string,
  object: string,
  event: string,
  store: string,
  handoff: string,
  guard: string,
  exception: string,
  metric: string,
  talkTrack: string,
  communication: string,
  fields: DataField[],
): P0Feature => ({ id, useCaseIds, title, route, actor, recordId, primaryAction, cancelAction, exceptionAction, recoveryAction, fromState, toState, object, event, store, handoff, guard, exception, metric, talkTrack, communication, fields });

const publicField = (label: string, value: string): DataField => ({ label, value, classification: "Public" });
const internalField = (label: string, value: string): DataField => ({ label, value, classification: "Internal" });
const confidentialField = (label: string, value: string): DataField => ({ label, value, classification: "Confidential" });
const restrictedField = (label: string, value: string): DataField => ({ label, value, classification: "Restricted" });

export const p0Features: P0Feature[] = [
  f("WF-P0-03", ["uc-01"], "Requisition and multi-step approval workbench", "/manager/recruiting/REQ-DEMO-001", "Hiring Manager", "REQ-DEMO-001", "Submit exact requisition version", "Withdraw pending request", "Simulate approval return", "Correct and resubmit", "Draft v3", "Approved v4", "Requisition + ApprovalStep", "RequisitionApproved", "Workforce demand ledger", "Recruiter receives approved demand", "Headcount, budget, compensation and separation-of-duty checks pass", "Finance return: cost-center evidence is stale", "Approval cycle time and returned-step rate", "Show that the job begins with controlled demand—not an ungoverned job form.", "Approval request preview to Finance and Compensation", [internalField("Workforce plan", "FY27 Product expansion"), internalField("Position", "Senior Product Designer"), internalField("Openings", "2"), confidentialField("Budget", "$410,000 approved envelope"), confidentialField("Compensation band", "$168,000–$196,000"), internalField("Target start", "November 16, 2026")]),
  f("WF-P0-04", ["uc-01"], "Job, opening, posting and publication lineage", "/hr/jobs/JOB-DEMO-001", "Recruiter", "JOB-DEMO-001", "Publish posting version 7", "Withdraw current channel delivery", "Simulate channel mismatch", "Reconcile failed channel", "Ready for publication", "Published and reconciled", "Job + Opening + PostingVersion + Distribution", "JobPostingVersionPublished", "Distribution ledger", "Candidate sees immutable posting v7", "Approved demand, pay, locale and content readiness are current", "LinkedIn delivery retained stale posting v6", "Publication readiness and channel reconciliation", "Make every grain visible: one job, two openings, one posting and four channel deliveries.", "Publication preview to Careers, LinkedIn, Indeed and agency partners", [internalField("Requisition", "REQ-DEMO-001 · Approved v4"), internalField("Job", "JOB-DEMO-001 · Senior Product Designer"), internalField("Openings", "OPN-001, OPN-002 · Open"), publicField("Posting", "PST-DEMO-001 · English (US)"), publicField("Posting version", "v7 · effective Aug 28"), internalField("Channels", "Careers, LinkedIn, Indeed, Agency")]),
  f("WF-P0-05", ["uc-02"], "Audience, consent and source-attribution builder", "/hr/talent/campaigns", "Talent Marketer", "AUD-DEMO-001", "Activate eligible audience snapshot", "Cancel scheduled outreach", "Expire consent for selected rows", "Re-evaluate suppression", "Draft population", "Activated · 184 eligible", "AudienceSnapshot + SourceTouch", "AudienceActivated", "Recruiting CRM", "Event team receives consented audience", "Purpose, consent, suppression and effective-date rules pass per row", "27 records suppressed; 4 have expired authority", "Eligible, suppressed and attributed conversion rates", "Demonstrate who is included, who is excluded and why—before any message preview.", "Localized event invitation preview; 27 suppressed recipients excluded", [internalField("Community", "Design leaders — Bay Area"), confidentialField("Population", "215 prospects"), confidentialField("Eligible", "184"), restrictedField("Suppressed", "27 · consent/retention"), internalField("Event", "EVT-DEMO-001"), internalField("Source token", "SRC-CAM-2026-08-PD")]),
  f("WF-P0-06", ["uc-03", "uc-04"], "Candidate duplicate resolution and governed correction", "/hr/candidates/PER-DEMO-001", "Identity Reviewer", "DUP-DEMO-001", "Approve safe field-level match", "Keep identities separate", "Simulate ambiguous match", "Resolve with authoritative source", "Review required", "Matched with provenance", "CandidateIdentity + ApplicationChangeRequest", "DuplicateResolved", "Identity ledger", "Recruiter receives corrected identity projection", "Minimum-necessary signals agree and restricted evidence stays separated", "Email matches but name and source ownership conflict", "Duplicate-review accuracy and correction turnaround", "Show that identity resolution never silently merges applications, consent or partner ownership.", "Candidate-safe correction receipt preview", [confidentialField("Identity A", "PER-DEMO-001 · Jordan Lee"), confidentialField("Identity B", "PER-DUP-004 · J. Lee"), restrictedField("Match signals", "Verified email, phone suffix"), internalField("Applications", "3 retained separately"), restrictedField("Consent sources", "Direct + event registration"), internalField("Proposed resolution", "Link aliases; preserve source records")]),
  f("WF-P0-07", ["uc-04"], "Referral and agency validation and conversion", "/hr/agency-assignments/AGA-DEMO-001", "Partner Administrator", "SUB-DEMO-001", "Validate and convert submission", "Return submission to partner", "Simulate ownership dispute", "Resolve scope and convert", "In validation", "Application created", "AgencySubmission + SourceRelationship + Application", "PartnerSubmissionConverted", "Partner ledger", "Recruiter receives APP-PARTNER-001", "Assignment, candidate authority, duplicate and ownership windows pass", "Existing ownership claim is privacy-protected and disputed", "Partner conversion, returns and dispute age", "Validate the commercial relationship without exposing or influencing candidate evaluation.", "Partner receipt preview with candidate-safe milestone only", [internalField("Assignment", "AGA-DEMO-001 · Active"), internalField("Job scope", "JOB-DEMO-001"), confidentialField("Candidate permission", "Recorded · expires Sep 12"), internalField("Ownership window", "90 days"), restrictedField("Duplicate result", "Possible match · owner hidden"), confidentialField("Fee policy", "18% on eligible start")]),
  f("WF-P0-08", ["uc-05"], "High-volume batch preview, undo and partial-failure board", "/hr/high-volume/HVC-001/cohorts/COH-DEMO-001", "Volume Coordinator", "BAT-DEMO-001", "Confirm bounded batch of 96", "Cancel 12 pending rows", "Simulate 7 delivery failures", "Retry failed rows idempotently", "Previewed", "89 delivered · 7 recoverable", "CohortSnapshot + BatchExecution", "BatchExecuted", "Execution ledger", "Event staff receives owned check-in work", "Every selected and suppressed row is explained; no ranking or disposition", "Seven provider failures after 89 successful deliveries", "Batch success, suppression, cancellation and duplicate prevention", "Show the exact population and effect before confirm, then prove partial retry cannot duplicate success.", "96 invitation previews; 14 suppressed; no message actually sent", [internalField("Program", "HVC-001 · Fall campus"), confidentialField("Population snapshot", "110 candidates"), confidentialField("Selected", "96"), restrictedField("Suppressed", "14 · explained"), internalField("Capacity", "12 sessions × 8"), internalField("Idempotency key", "BAT-HVC001-V05")]),
  f("WF-P0-09", ["uc-06"], "Visual interview scheduling and panel capacity", "/hr/interviews/INT-DEMO-001", "Recruiting Coordinator", "INT-DEMO-001", "Confirm session and panel", "Cancel current version", "Simulate interviewer conflict", "Substitute eligible interviewer", "Draft v2", "Confirmed v3", "InterviewSession + Assignment", "InterviewScheduled", "Scheduling ledger", "Candidate and panel receive current invitation preview", "Timezone, availability, workload, conflicts and accommodations reconcile", "Primary interviewer becomes unavailable on day of session", "Time-to-schedule, reschedules and panel capacity", "Overlay candidate constraints and panel capacity so coordination decisions are explainable.", "Attendee-specific calendar preview; no calendar event created", [confidentialField("Candidate availability", "Tue–Thu 09:00–13:00 PT"), internalField("Panel pool", "8 eligible interviewers"), internalField("Selected panel", "3 · workload balanced"), restrictedField("Accommodation", "Private coordinator channel"), internalField("Session", "Sep 3 · 10:30 PT · 60 min"), internalField("Conflicts", "0 current · 1 simulated")]),
  f("WF-P0-10", ["uc-07"], "Evidence coverage and structured debrief", "/hr/decisions/APP-DEMO-001", "Hiring Manager", "DEB-DEMO-001", "Record attributed human decision", "Reopen debrief", "Simulate missing evidence", "Collect amendment and reconvene", "Ready for debrief", "Human decision recorded", "Scorecard + EvidenceCoverage + Debrief + Decision", "HiringDecisionRecorded", "Decision ledger", "Offer owner receives authorized decision", "Independent scorecards, competency coverage and authority are complete", "System-design evidence missing; one scorecard amended late", "Evidence completeness, debrief age and amendment rate", "Bring evidence, coverage, conflicts and human rationale together without candidate ranking.", "Candidate-safe decision update preview", [internalField("Interview plan", "IP-DEMO-004 · v3"), confidentialField("Scorecards", "4/4 submitted and locked"), confidentialField("Competency coverage", "6/6 covered"), restrictedField("Conflict flags", "0 active"), confidentialField("Debrief conclusion", "Proceed to offer"), internalField("Decision owner", "Maya Chen")]),
  f("WF-P0-11", ["uc-08"], "Regulated screening and adverse-action timeline", "/hr/cases/CASE-DEMO-001", "Screening Reviewer", "CASE-DEMO-001", "Record governed human outcome", "Cancel provider request", "Open candidate dispute", "Resolve dispute and resume", "Decision paused", "Cleared after human review", "ScreeningCase + Notice + Dispute + Outcome", "ScreeningOutcomeRecorded", "Regulated case ledger", "Decision owner receives minimum outcome only", "Notice, consent, response clock, dispute and evidence separation all pass", "Candidate disputes an identity mismatch during protected window", "Response-window compliance and correction turnaround", "Keep notice, provider status, protected response, dispute and human outcome in one traceable case.", "Notice, rights and support preview; no regulated message sent", [restrictedField("Notice version", "BG-US-CA-v5 · acknowledged"), restrictedField("Provider status", "Report returned · review required"), confidentialField("Response clock", "3 business days remaining"), restrictedField("Dispute", "Identity mismatch · open"), restrictedField("Decision effect", "Paused"), internalField("Reviewer", "Screening Ops West")]),
  f("WF-P0-12", ["uc-09"], "Offer composer, version comparison and contingency board", "/hr/decisions/APP-DEMO-001", "Offer Owner", "OFF-DEMO-001", "Approve and release offer v4", "Revoke current offer", "Simulate compensation return", "Revise and reapprove v5", "Draft v4", "Released v4", "OfferVersion + Approval + OpeningReservation", "OfferReleased", "Offer ledger", "Candidate receives exact-version response task", "Decision, pay policy, approvals, opening and contingencies are current", "Compensation approver returns equity term", "Offer approval time, version churn and acceptance", "Show the full terms diff, who approved the exact version and what happens to the opening.", "Candidate offer preview with expiry and questions; no e-sign request", [confidentialField("Base salary", "$182,000 USD"), confidentialField("Equity", "8,500 RSUs · returned scenario 9,200"), internalField("Start date", "November 16, 2026"), internalField("Offer version", "v4 · 2 approvers"), internalField("Opening", "OPN-001 · reservable"), restrictedField("Contingencies", "Background review · pending")]),
  f("WF-P0-13", ["uc-10"], "PreHire and PendingWorker mapping and reconciliation", "/hr/onboarding/new-hires/NHR-DEMO-001", "HRIS Operator", "PWH-DEMO-001", "Stage and reconcile worker", "Cancel staged worker", "Simulate location-code rejection", "Correct mapping and replay", "Staged with 1 error", "Reconciled", "PreHire + PendingWorker + MappingAttempt + PortalIdentity", "PendingWorkerReconciled", "HRIS staging ledger", "New hire receives purpose-limited invitation", "Identity lineage, mapping version, required fields and idempotency pass", "Destination rejects SF-CA-HYBRID location code", "First-pass validation, retries and reconciliation age", "Compare source and destination fields and make correction/replay visible without mutating candidate identity.", "New-hire invitation preview; no identity account created", [confidentialField("PreHire", "PRE-DEMO-001 · source offer v4"), confidentialField("PendingWorker", "PWH-DEMO-001 · staged"), internalField("Mapping", "MAP-HRIS-012 · v8"), internalField("Business key", "PRE-DEMO-001|2026-11-16"), internalField("Location source", "SF-HYBRID"), internalField("Destination result", "SF-CA-HYBRID invalid")]),
  f("WF-P0-14", ["uc-11"], "Dependency-aware onboarding readiness", "/hr/onboarding/analytics", "People Operations", "RDY-DEMO-001", "Recalculate day-one readiness", "Waive noncritical task", "Simulate IT fulfilment failure", "Retry fulfilment and reconcile", "Blocked · 2 critical items", "Ready · evidence reconciled", "OnboardingPlan + Task + ProvisioningReceipt + ReadinessProjection", "DayOneReadinessCalculated", "Onboarding evidence ledger", "Manager and new hire see updated critical path", "Every critical dependency has a current completion/effect receipt", "Laptop shipment and directory account are partially fulfilled", "Critical-path readiness, overdue work and exception age", "Readiness is derived from evidence across people, IT and facilities—not a manually selected green status.", "Cross-role reminder previews; no messages or tickets sent", [internalField("Plan", "OBP-DEMO-001 · template v6"), internalField("Critical tasks", "9 total · 7 reconciled"), internalField("New-hire tasks", "4/4"), internalField("Manager tasks", "2/2"), confidentialField("IT/Facilities", "1/3 blocked"), internalField("Day-one readiness", "78% · critical blocker")]),
  f("WF-P0-15", ["uc-12"], "Worker-transition execution and compensating-work graph", "/hr/transitions/TRN-DEMO-001/impact", "People Operations", "TRN-DEMO-001", "Approve and execute transition", "Cancel before effective date", "Simulate partial downstream success", "Run compensating work", "Impact preview", "Reconciled with compensation", "WorkerTransition + Effect + CompensatingWork", "WorkerTransitionReconciled", "Lifecycle effect ledger", "HRIS, IT, facilities and benefits owners receive ordered work", "Impact owners, approvals, effective date and safe execution order pass", "HRIS succeeded but access and benefits failed", "Transition completion, partial failures and compensation age", "Show before/after state, ordered effects and explicit inverse work when only part of the transition succeeds.", "Effective-date and owner previews; no downstream system changed", [confidentialField("Transition", "Crossboard to Product Design"), internalField("Effective date", "December 1, 2026"), confidentialField("Before", "Recruiting Ops · SF"), confidentialField("After", "Product Design · Remote CA"), internalField("Downstream effects", "HRIS, IGA, benefits, facilities"), restrictedField("Partial state", "HRIS success · 3 effects pending")]),
];

export const globalP0Features: BacklogFeature[] = [
  { id: "WF-P0-01", priority: "P0", title: "Shared cross-route business state", acceptance: "Every action changes the same record, downstream handoff, timeline and KPI until deterministic reset.", surface: "Domain ledger, action receipts and all workbenches" },
  { id: "WF-P0-02", priority: "P0", title: "Screen/action-level data-flow diagrams", acceptance: "Every process exposes route, actor, action, input, output, object, event, store, guard, denial and recovery.", surface: "Use-case DFD and process inspector" },
];

export const p1Features: BacklogFeature[] = [
  { id: "WF-P1-01", priority: "P1", title: "Universal record lineage viewer", acceptance: "Related grains and versions remain distinct from requisition through worker transition.", surface: "Lineage tab" },
  { id: "WF-P1-02", priority: "P1", title: "Universal state-change receipt and diff", acceptance: "Each mutation shows previous/current state, actor, reason, event, effects and correlation key.", surface: "Receipt and audit tab" },
  { id: "WF-P1-03", priority: "P1", title: "Cross-persona handoff inbox", acceptance: "The next actor receives the exact work item and minimum required context.", surface: "Handoff center" },
  { id: "WF-P1-04", priority: "P1", title: "Communication preview and suppression center", acceptance: "Audience, locale, content version, suppressed rows and cancellation state are visible.", surface: "Communication tab" },
  { id: "WF-P1-05", priority: "P1", title: "Rule explanation drawer", acceptance: "Every guarded action explains passes, failures and recovery without restricted disclosure.", surface: "Rules tab" },
  { id: "WF-P1-06", priority: "P1", title: "Complete activity and audit timeline", acceptance: "UI actions, events, integration attempts, communication and metric restatements correlate.", surface: "Audit tab" },
  { id: "WF-P1-07", priority: "P1", title: "Dashboard causality and reconciliation", acceptance: "Action receipts update governed KPIs and drill-through with explicit denominator semantics.", surface: "Control center" },
  { id: "WF-P1-08", priority: "P1", title: "Persona row, field and purpose inspection", acceptance: "Allowed, masked, denied and expired states apply to navigation, rows, fields and actions.", surface: "Access inspector" },
  { id: "WF-P1-09", priority: "P1", title: "Country and worker-type variants", acceptance: "Content, rules, fields and tasks compare side by side with approval blockers.", surface: "Variant selector" },
  { id: "WF-P1-10", priority: "P1", title: "Complete error and recovery states", acceptance: "Happy, empty, validation, stale, duplicate, permission, provider-failure, cancellation and retry states execute.", surface: "Scenario laboratory" },
  { id: "WF-P1-11", priority: "P1", title: "Governed reports and delivery", acceptance: "Save, schedule, subscribe and export previews retain role scope and metric version.", surface: "Report center" },
  { id: "WF-P1-12", priority: "P1", title: "Accessibility and moderated-demo evidence", acceptance: "Keyboard, screen reader, mobile, readability and facilitator observations are recorded per journey.", surface: "Rehearsal and feedback" },
];

export const p2Features: BacklogFeature[] = [
  { id: "WF-P2-01", priority: "P2", title: "10, 30 and 60-minute runbooks", acceptance: "Audience and duration produce exact steps and optional skips.", surface: "Scenario laboratory" },
  { id: "WF-P2-02", priority: "P2", title: "Named scenario and record catalogue", acceptance: "Each scenario identifies state, persona, prerequisite and reset result.", surface: "Scenario laboratory" },
  { id: "WF-P2-03", priority: "P2", title: "Checkpoints and bookmarks", acceptance: "Presenters can save and restore deterministic workflow positions.", surface: "Use-case workbench" },
  { id: "WF-P2-04", priority: "P2", title: "Happy and exception comparison", acceptance: "State and receipt differences are visible side by side.", surface: "Use-case workbench" },
  { id: "WF-P2-05", priority: "P2", title: "Print/export-ready DFD brief", acceptance: "A presentation-safe brief includes actors, screens, objects, rules and boundaries.", surface: "Use-case workbench" },
  { id: "WF-P2-06", priority: "P2", title: "On-screen talk track and outcome", acceptance: "Every workbench shows business message, action, expected state and verification question.", surface: "Presenter panel" },
  { id: "WF-P2-07", priority: "P2", title: "Rehearsal status and issue classification", acceptance: "Each use case records not-run, pass or fail plus finding class.", surface: "Scenario laboratory" },
  { id: "WF-P2-08", priority: "P2", title: "Demo feedback capture", acceptance: "Feedback is linked to use case, step, persona and screen without real personal data.", surface: "Feedback panel" },
];

export const completeV32Backlog = [...globalP0Features, ...p0Features.map((feature) => ({ id: feature.id, priority: "P0" as const, title: feature.title, acceptance: feature.guard, surface: feature.route })), ...p1Features, ...p2Features];

export const getWireframeUseCase = (id?: string) => wireframeUseCases.find((item) => item.id === id);
export const getP0Feature = (id?: string) => p0Features.find((item) => item.id === id);

export const countryVariants = [
  { id: "us-ca", label: "United States · California", notice: "California pay transparency, adverse-action and privacy pack", workerTypes: "Regular employee, intern", approval: "Approved synthetic pack v5" },
  { id: "in-ka", label: "India · Karnataka", notice: "India consent, identity and onboarding pack", workerTypes: "Regular employee, contractor", approval: "Review-required synthetic pack v2" },
  { id: "gb", label: "United Kingdom", notice: "UK right-to-work, privacy and offer pack", workerTypes: "Employee, fixed-term", approval: "Approved synthetic pack v4" },
  { id: "de", label: "Germany", notice: "Germany works-council, privacy and document pack", workerTypes: "Employee, apprentice", approval: "Blocked pending synthetic approval" },
];

export const errorScenarios = [
  { id: "happy", label: "Happy path", effect: "All guards pass and the next actor receives reconciled work." },
  { id: "empty", label: "No eligible rows", effect: "Population is empty; ratios show N/A and no action is created." },
  { id: "validation", label: "Validation failure", effect: "Action remains draft and exact fields receive repair guidance." },
  { id: "stale", label: "Stale version", effect: "Mutation is denied until the reviewer compares and reloads current state." },
  { id: "duplicate", label: "Duplicate request", effect: "Idempotency prevents a second effect and links the prior receipt." },
  { id: "denied", label: "Permission denied", effect: "Route, row, field and action denial is recorded with policy version." },
  { id: "provider", label: "Provider partial failure", effect: "Successful rows remain complete; only failed rows enter recovery." },
  { id: "cancelled", label: "Cancellation", effect: "Pending effects cancel; completed effects create explicit inverse work." },
  { id: "retry", label: "Recovery retry", effect: "The same business key retries without duplicating completed effects." },
];

export const runbooks = [
  { id: "10", label: "10-minute executive", useCaseIds: ["uc-01", "uc-07", "uc-09", "uc-11"], guidance: "Show governed demand, human evidence, offer control and day-one readiness." },
  { id: "30", label: "30-minute product", useCaseIds: ["uc-01", "uc-03", "uc-06", "uc-07", "uc-09", "uc-10", "uc-11"], guidance: "Follow one candidate from demand through reconciled onboarding." },
  { id: "60", label: "60-minute full platform", useCaseIds: wireframeUseCases.map((useCase) => useCase.id), guidance: "Cover all 12 use cases, exception recovery and control evidence." },
];
