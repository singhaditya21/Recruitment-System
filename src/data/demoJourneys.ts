export type DemoVariant = "happy" | "exception";

export type DemoEffect =
  | "availability"
  | "scorecard"
  | "offer"
  | "onboarding-task"
  | "document"
  | "provisioning"
  | "pending-worker";

export type DemoStep = {
  id: string;
  actor: string;
  personaId?: string;
  route: string;
  process: string;
  instruction: string;
  dataIn: string;
  dataOut: string;
  store: string;
  receipt: string;
  exception: string;
  effect?: DemoEffect;
};

export type JourneyUnitSeed = {
  title: string;
  actor: string;
  route: string;
  outcome: string;
};

export type JourneyUnit = JourneyUnitSeed & {
  id: string;
  useCaseId: string;
  useCaseTitle: string;
};

export type BusinessUseCase = {
  id: string;
  code: string;
  title: string;
  domain: string;
  audience: string;
  duration: string;
  objective: string;
  outcome: string;
  scenarioId: string;
  actors: string[];
  objects: string[];
  dataStores: string[];
  communications: string[];
  journeyUnits: JourneyUnitSeed[];
  steps: DemoStep[];
};

const step = (
  id: string,
  actor: string,
  personaId: string | undefined,
  route: string,
  process: string,
  instruction: string,
  dataIn: string,
  dataOut: string,
  store: string,
  receipt: string,
  exception: string,
  effect?: DemoEffect,
): DemoStep => ({
  id,
  actor,
  personaId,
  route,
  process,
  instruction,
  dataIn,
  dataOut,
  store,
  receipt,
  exception,
  effect,
});

const unit = (
  title: string,
  actor: string,
  route: string,
  outcome: string,
): JourneyUnitSeed => ({ title, actor, route, outcome });

export const businessUseCases: BusinessUseCase[] = [
  {
    id: "candidate-attraction",
    code: "DFD-01",
    title: "Candidate attraction, events and account access",
    domain: "Attract",
    audience: "Candidate experience, marketing and recruiting operations",
    duration: "12 minutes",
    objective:
      "Turn anonymous interest into consented, recoverable candidate relationships without silently creating an application.",
    outcome:
      "The candidate has saved context, an alert or event registration, and a safe authenticated continuation.",
    scenarioId: "SCN-001",
    actors: ["Candidate", "Recruiting marketing", "Candidate identity service"],
    objects: ["Job", "JobPostingVersion", "SavedJob", "JobAlert", "CareerEvent", "EventRegistration", "PortalSession"],
    dataStores: ["Public job projection", "Candidate relationship store", "Consent and session ledger"],
    communications: ["Alert confirmation email", "Event ticket", "Magic-link preview"],
    journeyUnits: [
      unit("Search and filter jobs", "Candidate", "/careers", "A shortlist based on explicit filters"),
      unit("Review job details and requirements", "Candidate", "/careers/jobs/product-designer-remote-demo", "Versioned role and pay context"),
      unit("Save and remove jobs", "Candidate", "/saved-jobs", "A reversible saved-job relationship"),
      unit("Create, edit, pause and resume alerts", "Candidate", "/job-alerts", "A consented alert subscription"),
      unit("Discover and register for events", "Candidate", "/events", "A capacity-aware registration"),
      unit("Waitlist, cancel and manage capacity", "Candidate", "/events/EVT-DEMO-001", "A safe registration state transition"),
      unit("Use tickets, calendar entries and feedback", "Candidate", "/events/EVT-DEMO-001/ticket", "A candidate-safe event receipt"),
      unit("Sign in and recover an account", "Candidate", "/sign-in", "A purpose-limited portal session"),
    ],
    steps: [
      step("A-01", "Candidate", undefined, "/careers", "Discover opportunity", "Search by role, location and workplace", "Search criteria", "Rank-neutral matching jobs", "Public job projection", "Search state retained in the current session", "No eligible jobs returns a guided empty state"),
      step("A-02", "Candidate", undefined, "/careers/jobs/product-designer-remote-demo", "Evaluate and save", "Review the exact published version and save the role", "JobPostingVersion v3", "SavedJob relationship", "Candidate relationship store", "Saved-job receipt with source posting version", "Withdrawn posting stays visible but cannot accept an application"),
      step("A-03", "Candidate", undefined, "/job-alerts/new", "Create governed alert", "Choose criteria, cadence, locale and channel authority", "Criteria + consent + locale", "JobAlert JAL-MEM-001", "Candidate relationship store", "Alert confirmation preview", "Missing consent blocks activation"),
      step("A-04", "Candidate", undefined, "/events/EVT-DEMO-001", "Register for event", "Register, join a waitlist or cancel safely", "Event capacity + candidate authority", "EventRegistration", "Event operations store", "Ticket or waitlist receipt", "Capacity reached routes to a waitlist without overbooking"),
      step("A-05", "Candidate", undefined, "/sign-in", "Create candidate-safe session", "Request and verify a synthetic magic link", "Verified email fixture", "Purpose-limited PortalSession", "Consent and session ledger", "MAGIC-MEM-001 with expiry", "Expired links preserve the intended destination and start recovery"),
    ],
  },
  {
    id: "application-self-service",
    code: "DFD-02",
    title: "Candidate application and self-service",
    domain: "Apply",
    audience: "Candidates, recruiters and candidate support",
    duration: "15 minutes",
    objective:
      "Create a version-bound application while keeping candidate identity, preferences, documents and support independently governed.",
    outcome:
      "A submitted application has visible provenance, a candidate-safe status and recoverable next actions.",
    scenarioId: "SCN-002",
    actors: ["Candidate", "Recruiter", "Recruiting coordinator", "Candidate support"],
    objects: ["Candidate", "CandidateIdentifier", "ConsentRecord", "Application", "ApplicationStageEvent", "Document", "SupportCase"],
    dataStores: ["Candidate identity store", "Application ledger", "Private document service"],
    communications: ["Application confirmation", "Availability request", "Support-thread preview"],
    journeyUnits: [
      unit("Start, save, resume and submit an application", "Candidate", "/apply/product-designer-remote-demo", "A version-bound application"),
      unit("Create or correct candidate identity", "Candidate", "/my-applications/APP-DEMO-001", "Corrected identity with provenance"),
      unit("Track status and timeline", "Candidate", "/my-applications", "Candidate-safe progress"),
      unit("Submit availability and accommodation preferences", "Candidate", "/my-applications/APP-DEMO-001", "A coordinator-visible availability window"),
      unit("Manage messages, documents and preferences", "Candidate", "/my-applications/APP-DEMO-001", "Purpose-scoped communication and evidence"),
      unit("Open and track support", "Candidate support", "/support/new", "An owned support case"),
      unit("Submit and monitor a privacy request", "Candidate", "/privacy-requests/new", "A due-dated privacy request"),
    ],
    steps: [
      step("B-01", "Candidate", undefined, "/apply/product-designer-remote-demo", "Start application", "Begin against the displayed posting version", "Candidate draft + Posting v7", "Application draft", "Application ledger", "Draft continuation key", "Stale posting version requires candidate review before submit"),
      step("B-02", "Candidate", undefined, "/apply/product-designer-remote-demo", "Validate and submit", "Complete required fields, consent and review", "Profile + answers + consent", "Submitted Application", "Application ledger", "APP-DEMO-001 submission receipt", "Validation errors retain every safe answer"),
      step("B-03", "Recruiter", "USR-REC-001", "/hr/applications/APP-DEMO-001", "Triage application", "Review source, stage, ownership and next action", "Application + candidate projection", "Owned work item", "Recruiting operational store", "Assignment and stage event", "Duplicate identity pauses merge but not the application"),
      step("B-04", "Candidate", undefined, "/my-applications/APP-DEMO-001", "Share availability", "Submit timezone-aware availability and accommodation channel", "Scheduling request", "Availability window", "Scheduling store", "Coordinator-visible availability receipt", "No suitable slot opens a human coordinator task", "availability"),
      step("B-05", "Candidate support", "USR-SUP-001", "/support/new", "Resolve self-service issue", "Create a minimum-necessary case and return to the application", "Candidate-safe issue summary", "SupportCase + response", "Support case store", "Case ID and protected thread", "Restricted evidence is never copied into the case"),
    ],
  },
  {
    id: "screening-regulatory",
    code: "DFD-03",
    title: "Assessments, references and regulated screening",
    domain: "Evaluate",
    audience: "Candidates, integrity reviewers, privacy and recruiting",
    duration: "18 minutes",
    objective:
      "Collect bounded evidence and provide notice, accessibility, correction and human-review safeguards.",
    outcome:
      "Evidence is provider-safe, versioned and reviewable without automating a consequential hiring decision.",
    scenarioId: "SCN-003",
    actors: ["Candidate", "Reference", "Assessment provider", "Background provider", "Integrity reviewer"],
    objects: ["CandidateTask", "AssessmentCase", "ReferenceRequest", "BackgroundCase", "NoticeVersion", "DisputeCase"],
    dataStores: ["Candidate task ledger", "Restricted evidence vault", "Human decision audit"],
    communications: ["Assessment invitation", "Reference request", "Background notice", "Pre-adverse notice"],
    journeyUnits: [
      unit("Complete or replace an assessment", "Candidate", "/my-tasks/CTK-001", "A bounded assessment receipt"),
      unit("Request and replace references", "Candidate", "/my-tasks/CTK-002", "Authorized reference slots"),
      unit("Review background notice and authorize", "Candidate", "/my-tasks/CTK-003", "Version-bound authorization"),
      unit("Correct or dispute pre-adverse information", "Candidate", "/my-tasks/CTK-004", "A protected response window"),
      unit("Perform regulated human review and recovery", "Integrity reviewer", "/hr/cases", "An attributed human outcome"),
    ],
    steps: [
      step("C-01", "Candidate", undefined, "/my-tasks/CTK-001", "Complete assessment task", "Review notice, accessibility and window before starting", "Task version + preferences", "Provider-safe completion receipt", "Candidate task ledger", "Attempt and version receipt", "Provider outage keeps the task unstarted and issues a replacement"),
      step("C-02", "Candidate", undefined, "/my-tasks/CTK-002", "Authorize references", "Add, replace or cancel named reference invitations", "Reference identity + reminder authority", "ReferenceRequest", "Candidate task ledger", "Invitation status without reference content", "Bounce or decline cancels the old slot before replacement"),
      step("C-03", "Candidate", undefined, "/my-tasks/CTK-003", "Authorize background check", "Review jurisdiction notice and choose consent or support", "NOTICE-BGC-US-CA-v7", "Authorization receipt", "Restricted evidence vault", "Consent version and timestamp", "Identity mismatch pauses provider initiation"),
      step("C-04", "Candidate", undefined, "/my-tasks/CTK-004", "Exercise correction rights", "Review report summary, deadline and submit a correction", "Current report + rights notice", "DisputeCase", "Restricted evidence vault", "Paused-decision receipt", "A changed report version invalidates the old response link"),
      step("C-05", "Integrity reviewer", "USR-INTG-001", "/hr/cases", "Record human outcome", "Review minimum necessary evidence and close with rationale", "Case + redress history", "Attributed human outcome", "Human decision audit", "Audit event and candidate-safe status", "Unauthorized personas receive a safe denial"),
    ],
  },
  {
    id: "requisition-job",
    code: "DFD-04",
    title: "Requisition, job, opening and publication",
    domain: "Plan",
    audience: "Hiring managers, recruiters, finance and approvers",
    duration: "15 minutes",
    objective:
      "Translate approved demand into a governed job, opening and public posting without conflating their lifecycle states.",
    outcome:
      "A versioned posting is published against approved headcount with a complete hiring and interview plan.",
    scenarioId: "SCN-004",
    actors: ["Hiring manager", "Recruiter", "Finance approver", "Job distribution service"],
    objects: ["Requisition", "Job", "Opening", "JobPostingVersion", "HiringPlan", "InterviewPlan", "Approval"],
    dataStores: ["Workforce demand ledger", "Recruiting configuration", "Distribution ledger"],
    communications: ["Approval request", "Posting preview", "Distribution reconciliation"],
    journeyUnits: [
      unit("Create and edit requisitions, jobs and postings", "Recruiter", "/hr/jobs/new", "A governed draft job"),
      unit("Complete approval and readiness checks", "Hiring manager", "/manager/recruiting/REQ-DEMO-001", "Approved demand and readiness"),
      unit("Configure competencies and interview plan", "Recruiter", "/hr/jobs/JOB-DEMO-001", "A versioned hiring plan"),
      unit("Publish, distribute, version or withdraw", "Recruiter", "/hr/jobs/JOB-DEMO-001", "Reconciled channel postings"),
      unit("Manage openings and headcount", "Hiring manager", "/hr/jobs/JOB-DEMO-001", "Reserved and filled openings"),
    ],
    steps: [
      step("D-01", "Hiring manager", "USR-HM-001", "/manager/recruiting/REQ-DEMO-001", "Request hiring demand", "Provide business need, location, level and headcount", "Workforce plan + budget reference", "Requisition draft", "Workforce demand ledger", "REQ-DEMO-001 created", "Missing budget or duplicate demand blocks submission"),
      step("D-02", "Finance approver", "USR-APR-001", "/hr/jobs/JOB-DEMO-001", "Approve demand", "Review headcount, compensation band and effective dates", "Requisition + policy version", "Approval decision", "Workforce demand ledger", "Attributed approval receipt", "Returned approval preserves the draft and reason"),
      step("D-03", "Recruiter", "USR-REC-001", "/hr/jobs/JOB-DEMO-001/edit", "Configure hiring plan", "Set competencies, team, interview plan and candidate commitments", "Approved requisition", "Job + HiringPlan", "Recruiting configuration", "Readiness checklist", "Missing competency coverage blocks publication"),
      step("D-04", "Recruiter", "USR-REC-001", "/hr/jobs/JOB-DEMO-001", "Publish posting version", "Review candidate-facing content and release an immutable version", "Job + approved content", "JobPostingVersion v3", "Distribution ledger", "Publication receipt", "Stale content or locale pack blocks publish"),
      step("D-05", "Job distribution service", "USR-CFG-001", "/hr/platform/integrations", "Reconcile channels", "Preview provider deliveries and failures", "Posting version + channel contracts", "Distribution status", "Distribution ledger", "Per-channel reconciliation evidence", "Failed channels retry with the same business key"),
    ],
  },
  {
    id: "recruiting-operations",
    code: "DFD-05",
    title: "Candidate and application operations",
    domain: "Operate",
    audience: "Recruiters, coordinators and candidate support",
    duration: "15 minutes",
    objective:
      "Coordinate identities, applications, ownership, stage changes and communication from one governed action center.",
    outcome:
      "Every stage change is attributable, explainable and visible in owned operational work.",
    scenarioId: "SCN-005",
    actors: ["Recruiter", "Recruiting coordinator", "Candidate support", "Automation operator"],
    objects: ["Candidate", "Application", "ApplicationStageEvent", "WorkItem", "Activity", "Document", "AutomationRun"],
    dataStores: ["Canonical candidate store", "Application ledger", "Operational work projection"],
    communications: ["Candidate update preview", "Coordinator task", "Automation recovery notice"],
    journeyUnits: [
      unit("Create candidates and manage duplicates", "Recruiter", "/hr/candidates/new", "A canonical candidate identity"),
      unit("Create candidate-to-job application junction", "Recruiter", "/hr/applications/new", "A separate application record"),
      unit("Conduct screening and stage transitions", "Recruiter", "/hr/applications/APP-DEMO-001", "An immutable stage event"),
      unit("Work queues, ownership and SLAs", "Recruiter", "/hr/action-center", "An owned next action"),
      unit("Add communications, activities and documents", "Recruiting coordinator", "/hr/applications/APP-DEMO-001", "A governed activity timeline"),
      unit("Simulate and recover automations", "Automation operator", "/hr/automations", "An idempotent run receipt"),
    ],
    steps: [
      step("E-01", "Recruiter", "USR-REC-001", "/hr/candidates/new", "Create candidate identity", "Capture minimum identity, source and consent provenance", "Identity attributes + authority", "Candidate", "Canonical candidate store", "Candidate ID without an automatic application", "Potential duplicates route to review rather than silent merge"),
      step("E-02", "Recruiter", "USR-REC-001", "/hr/applications/new", "Create application junction", "Choose candidate, job, owner and initial stage", "Candidate ID + Job ID", "Application", "Application ledger", "Application ID and initial stage event", "Duplicate candidate-job pair is rejected safely"),
      step("E-03", "Recruiter", "USR-REC-001", "/hr/applications/APP-DEMO-001", "Advance with reason", "Review evidence readiness and record a human stage change", "Application + evidence state", "ApplicationStageEvent", "Application ledger", "Previous/current state and actor", "Missing evidence creates a blocker instead of advancing"),
      step("E-04", "Recruiting coordinator", "USR-COO-001", "/hr/action-center", "Coordinate owned work", "Triage waiting candidates, scheduling and SLA items", "Role-scoped work projection", "Owned next action", "Operational work projection", "Queue ownership receipt", "Permission changes remove the row and preserve audit evidence"),
      step("E-05", "Automation operator", "USR-CFG-001", "/hr/automations", "Simulate and reconcile", "Preview eligibility, collision, effect and replay contract", "Rule version + business key", "AutomationRun", "Automation ledger", "No-write simulation receipt", "Failure retries cannot create a duplicate effect"),
    ],
  },
  {
    id: "interview-offer",
    code: "DFD-06",
    title: "Interviews, decisions, offers and hire handoff",
    domain: "Select",
    audience: "Candidates, interviewers, hiring managers, recruiters and approvers",
    duration: "20 minutes",
    objective:
      "Coordinate scheduling, independent evidence, human decision, controlled offer versioning and accepted-candidate handoff.",
    outcome:
      "An accepted offer reserves an opening and creates a traceable pre-hire handoff without overwriting candidate history.",
    scenarioId: "SCN-006",
    actors: ["Candidate", "Coordinator", "Interviewer", "Hiring manager", "Offer approver", "HRIS operator"],
    objects: ["InterviewSession", "InterviewerAssignment", "Scorecard", "Decision", "OfferVersion", "OpeningReservation", "PreHire"],
    dataStores: ["Scheduling ledger", "Independent evidence store", "Offer and handoff ledger"],
    communications: ["Calendar invitation", "Interview reminder", "Offer package", "Handoff receipt"],
    journeyUnits: [
      unit("Schedule, reschedule and cancel interviews", "Coordinator", "/hr/interviews/INT-DEMO-001", "A versioned session"),
      unit("Brief interviewers and manage conflicts", "Interviewer", "/interviewer/IVP-DEMO-001", "A conflict-safe assignment"),
      unit("Complete scorecards and debrief", "Interviewer", "/hr/assignments/ASN-DEMO-001", "Independent structured evidence"),
      unit("Check readiness and record human decision", "Hiring manager", "/hr/decisions/APP-DEMO-001", "An attributed decision"),
      unit("Version, approve, send and respond to offer", "Offer approver", "/hr/decisions/APP-DEMO-001", "A version-bound response"),
      unit("Reserve opening and hand off hire", "HRIS operator", "/hr/onboarding", "A linked pre-hire"),
    ],
    steps: [
      step("F-01", "Candidate", undefined, "/my-applications/APP-DEMO-001", "Share scheduling constraints", "Provide timezone, windows and private accommodation channel", "Availability request", "Availability window", "Scheduling ledger", "Candidate-safe availability receipt", "No common slot opens coordinator work", "availability"),
      step("F-02", "Recruiting coordinator", "USR-COO-001", "/hr/interviews/INT-DEMO-001", "Create interview version", "Match panel capacity and send a synthetic calendar preview", "Availability + panel plan", "InterviewSession", "Scheduling ledger", "Calendar version and attendee list", "Conflict or provider failure keeps the prior version authoritative"),
      step("F-03", "Interviewer", "USR-INT-001", "/hr/assignments/ASN-DEMO-001", "Submit independent scorecard", "Review briefing, declare conflict and submit structured evidence", "Assignment + competency rubric", "Scorecard", "Independent evidence store", "Immutable submission receipt", "Late edits create a new version and cannot reveal peer feedback", "scorecard"),
      step("F-04", "Hiring manager", "USR-HM-001", "/hr/decisions/APP-DEMO-001", "Record human decision", "Confirm complete evidence and record rationale", "Scorecards + opening state", "Decision", "Offer and handoff ledger", "Human-decision audit event", "Missing evidence keeps readiness blocked"),
      step("F-05", "Offer approver", "USR-APR-001", "/hr/decisions/APP-DEMO-001", "Approve offer version", "Review compensation, contingencies and approval policy", "Decision + OfferVersion v4", "Approved offer task", "Offer and handoff ledger", "Candidate-safe offer preview", "A stale or changed offer invalidates the prior approval", "offer"),
      step("F-06", "HRIS operator", "USR-HRI-001", "/hr/onboarding", "Create hire handoff", "Reserve the opening and create a linked pre-hire", "Accepted offer + candidate identity", "PreHire + reservation", "Offer and handoff ledger", "Idempotent handoff receipt", "Reconciliation failure retains accepted-offer truth"),
    ],
  },
  {
    id: "talent-scale",
    code: "DFD-07",
    title: "Talent channels and recruiting at scale",
    domain: "Engage",
    audience: "Talent marketing, campus, agency, referral and mobility teams",
    duration: "20 minutes",
    objective:
      "Operate prospect communities, campaigns, events and partner channels with consent, capacity and ownership controls.",
    outcome:
      "Channel activity creates governed relationships and work without automatically ranking or rejecting people.",
    scenarioId: "SCN-007",
    actors: ["Talent marketer", "Campus recruiter", "Agency", "Referrer", "Employee", "Recruiter"],
    objects: ["Prospect", "TalentCommunity", "Campaign", "CareerEvent", "HighVolumeCohort", "AgencySubmission", "Referral", "InternalOpportunity"],
    dataStores: ["Recruiting CRM", "Channel and ownership ledger", "Cohort operations store"],
    communications: ["Campaign preview", "Cohort invitation", "Referral milestone", "Agency validation response"],
    journeyUnits: [
      unit("Manage talent CRM", "Talent marketer", "/hr/talent", "A purpose-scoped prospect relationship"),
      unit("Operate campaigns and communities", "Talent marketer", "/hr/talent/campaigns", "A governed audience snapshot"),
      unit("Run recruiting events", "Campus recruiter", "/hr/events/REV-DEMO-001", "Capacity and attendance evidence"),
      unit("Run high-volume and campus cohorts", "Campus recruiter", "/hr/high-volume/HVC-001", "A bounded cohort operation"),
      unit("Manage agency assignments and ownership", "Agency", "/agency/assignments/AGA-DEMO-001", "A validated partner submission"),
      unit("Process referrals and rewards", "Referrer", "/referrer", "A permission-bound referral"),
      unit("Manage confidential internal mobility", "Employee", "/mobility", "A policy-governed expression of interest"),
      unit("Configure country and locale packs", "Configuration admin", "/hr/locales/LOC-001", "An approved experience variant"),
    ],
    steps: [
      step("G-01", "Talent marketer", "USR-REC-001", "/hr/talent", "Build governed audience", "Select purpose, authority, expiry and suppression rules", "Prospect relationships", "Audience snapshot", "Recruiting CRM", "Eligible and suppressed counts", "Expired authority suppresses contact"),
      step("G-02", "Campus recruiter", "USR-COO-001", "/hr/high-volume/HVC-001/planning", "Plan bounded cohort", "Set deterministic criteria, capacity and exception owners", "Applications + campaign version", "HighVolumeCohort", "Cohort operations store", "Eligibility snapshot", "Capacity overflow becomes owned work"),
      step("G-03", "Agency", undefined, "/agency/submissions/new", "Validate partner submission", "Check assignment, candidate authority, duplicate and ownership window", "Assignment + candidate notice", "AgencySubmission", "Channel and ownership ledger", "Safe validation receipt", "A duplicate never reveals the other owner"),
      step("G-04", "Referrer", undefined, "/referrer/new", "Submit permission-bound referral", "Capture relationship, permission and policy version", "Candidate permission + job", "Referral", "Channel and ownership ledger", "Referral milestone receipt", "Reward disputes do not change candidate review"),
      step("G-05", "Employee", undefined, "/mobility/MOB-DEMO-001/interest", "Express confidential interest", "Review eligibility and choose manager-disclosure milestone", "Employee profile + opportunity", "InternalApplication", "Recruiting CRM", "Private interest receipt", "Policy exception routes to human review"),
    ],
  },
  {
    id: "onboarding",
    code: "DFD-08",
    title: "Accepted candidate through day 90 onboarding",
    domain: "Onboard",
    audience: "New hires, people operations, managers and HRIS",
    duration: "22 minutes",
    objective:
      "Maintain identity lineage while assigning versioned onboarding work, private documents, benefits, learning and milestone experiences.",
    outcome:
      "A ready worker reaches day one with governed evidence and a continuous 30/60/90-day plan.",
    scenarioId: "SCN-008",
    actors: ["New hire", "People operations", "Manager", "HRIS operator", "Benefits and learning services"],
    objects: ["PreHire", "PendingWorker", "OnboardingTemplateVersion", "OnboardingPlan", "OnboardingTask", "DocumentPackage", "BenefitElection", "LearningEnrollment"],
    dataStores: ["Onboarding plan ledger", "Private document service", "HRIS staging ledger"],
    communications: ["Welcome invitation", "Task reminder", "Signature preview", "Day-one agenda"],
    journeyUnits: [
      unit("Transition candidate to pre-hire and worker", "HRIS operator", "/hr/onboarding", "Preserved identity lineage"),
      unit("Create programs and templates", "Configuration admin", "/hr/onboarding/templates", "An immutable template version"),
      unit("Assign onboarding plan", "People operations", "/hr/onboarding/new-hires/NHR-DEMO-001", "A version-pinned plan"),
      unit("Complete tasks, forms, documents and signatures", "New hire", "/preboarding/tasks", "Completion evidence"),
      unit("Correct new-hire profile", "New hire", "/preboarding/profile", "A governed correction submission"),
      unit("Review and elect benefits", "New hire", "/preboarding/benefits/BEN-DEMO-001", "A synthetic election receipt"),
      unit("Complete learning", "New hire", "/preboarding/learning/LRN-DEMO-001", "Learning progress evidence"),
      unit("Complete day-one and 30/60/90 milestones", "New hire", "/preboarding/journey", "A continuous milestone plan"),
      unit("Use country-specific help and privacy", "New hire", "/preboarding/country/LOC-001", "Localized governed experience"),
    ],
    steps: [
      step("H-01", "People operations", "USR-REC-001", "/hr/onboarding/new-hires/NHR-DEMO-001", "Assign versioned plan", "Select population rule, template version, start date and owners", "PreHire + TemplateVersion", "OnboardingPlan", "Onboarding plan ledger", "Generated tasks and dependencies", "Unapproved locale pack blocks assignment"),
      step("H-02", "New hire", undefined, "/preboarding/tasks", "Complete private onboarding work", "Review tasks and submit a synthetic form/document", "Task definition + notice", "Completion evidence", "Private document service", "Task and document receipt", "Validation failure preserves the draft without exposing values", "document"),
      step("H-03", "New hire", undefined, "/preboarding/benefits/BEN-DEMO-001", "Make benefits election", "Review effective plan evidence and submit a synthetic choice", "Country plan + enrollment window", "BenefitElection", "Private document service", "Election saved receipt", "Closed window routes to benefits support"),
      step("H-04", "HRIS operator", "USR-HRI-001", "/hr/onboarding", "Correct pending worker", "Resolve destination mapping and revalidate", "PreHire + mapping error", "Corrected PendingWorker", "HRIS staging ledger", "Reconciliation receipt", "Retry uses the same worker business key", "pending-worker"),
      step("H-05", "New hire", undefined, "/preboarding/journey", "Continue through day 90", "Review day one, learning, manager and buddy milestones", "OnboardingPlan + completions", "Milestone progress", "Onboarding plan ledger", "Journey progress and next action", "Delayed start recalculates dependent dates"),
    ],
  },
  {
    id: "portals-fulfilment",
    code: "DFD-09",
    title: "Manager, partner and fulfilment portals",
    domain: "Fulfil",
    audience: "Managers, IT, facilities, interviewers, buddies, agencies, referrers and employees",
    duration: "18 minutes",
    objective:
      "Give every downstream actor a least-privilege queue, required context, action and evidence receipt.",
    outcome:
      "Readiness work is completed by the responsible function and reconciled without exposing unrelated candidate or employee data.",
    scenarioId: "SCN-009",
    actors: ["Manager", "IT", "Facilities", "Interviewer", "Buddy", "Agency", "Referrer", "Employee"],
    objects: ["ManagerTask", "ProvisioningRequest", "FacilityAccessRequest", "InterviewerAssignment", "BuddyAssignment", "AgencyAssignment", "Referral", "InternalApplication"],
    dataStores: ["Role-scoped work projection", "Provisioning ledger", "Relationship and access ledger"],
    communications: ["Manager reminder", "IT fulfilment receipt", "Facilities readiness notice", "Buddy check-in"],
    journeyUnits: [
      unit("Manager readiness and check-ins", "Manager", "/manager/new-hires/NHR-DEMO-001", "Manager commitments"),
      unit("Manager recruiting and review", "Manager", "/manager/recruiting", "Relationship-scoped recruiting decisions"),
      unit("IT account and equipment fulfilment", "IT", "/it", "Reconciled IT delivery"),
      unit("Facilities and physical access fulfilment", "Facilities", "/facilities", "Revocable workplace readiness"),
      unit("Interviewer assignment portal", "Interviewer", "/interviewer", "Independent assigned evidence"),
      unit("Buddy goals and escalation", "Buddy", "/buddy", "Relationship-safe check-ins"),
      unit("Agency assignment portal", "Agency", "/agency/assignments", "Partner-scoped work"),
      unit("Referrer status portal", "Referrer", "/referrer", "Policy-safe milestone visibility"),
      unit("Employee mobility portal", "Employee", "/mobility", "Private career exploration"),
    ],
    steps: [
      step("I-01", "Manager", "USR-HM-001", "/manager/new-hires/NHR-DEMO-001", "Complete manager readiness", "Confirm goals, agenda, check-ins and buddy introduction", "Manager-safe plan projection", "ManagerTask completions", "Role-scoped work projection", "Manager readiness receipt", "Private new-hire data remains hidden"),
      step("I-02", "IT", undefined, "/it", "Fulfil account and equipment", "Open only IT requests and record destination evidence", "Approved role bundle + due date", "ProvisioningRequest outcome", "Provisioning ledger", "Asset/account reconciliation receipt", "Blocked dependencies prevent false completion", "provisioning"),
      step("I-03", "Facilities", undefined, "/facilities", "Prepare site access", "Assign badge, desk or accessible workplace resource", "Site + start date + access profile", "FacilityAccessRequest outcome", "Provisioning ledger", "Revocable access receipt", "Cancelled starts generate revocation work"),
      step("I-04", "Buddy", undefined, "/buddy", "Complete relationship check-in", "Review connection goals and escalate only operational concerns", "BuddyAssignment + milestone", "Buddy check-in", "Relationship and access ledger", "Check-in receipt", "Sensitive concerns route privately to People Operations"),
      step("I-05", "People operations", "USR-COO-001", "/hr/onboarding/provisioning", "Reconcile readiness", "Compare all function outcomes against day-one requirements", "Manager + IT + facilities outcomes", "Readiness projection", "Role-scoped work projection", "Cross-function readiness receipt", "Unreconciled effects remain visible as owned exceptions"),
    ],
  },
  {
    id: "worker-lifecycle",
    code: "DFD-10",
    title: "Worker lifecycle transitions and compensating work",
    domain: "Transition",
    audience: "People operations, HRIS, managers, IT and facilities",
    duration: "18 minutes",
    objective:
      "Preview effective-dated worker changes and generate reversible, accountable work across downstream functions.",
    outcome:
      "Every transition has impact, approval, compensation, cancellation and reconciliation evidence.",
    scenarioId: "SCN-010",
    actors: ["People operations", "HRIS operator", "Manager", "IT", "Facilities"],
    objects: ["WorkerTransition", "EffectiveRelationship", "StartDateChange", "NoShowCase", "RevocationRequest", "TransitionAudit"],
    dataStores: ["Worker lifecycle ledger", "Destination work queues", "Immutable audit archive"],
    communications: ["Impact notice", "Manager action", "Revocation request", "Reconciliation summary"],
    journeyUnits: [
      unit("Rehire", "People operations", "/hr/transitions/TRN-DEMO-001", "Reactivated effective relationship"),
      unit("Crossboarding", "People operations", "/hr/transitions/TRN-DEMO-002", "Changed internal relationship"),
      unit("Relocation", "People operations", "/hr/transitions/TRN-DEMO-003", "Country/site transition work"),
      unit("Contingent conversion", "HRIS operator", "/hr/transitions/TRN-DEMO-004", "New worker relationship"),
      unit("Offboarding", "People operations", "/hr/transitions/TRN-DEMO-005", "Coordinated access and asset closure"),
      unit("Offer rescission", "Recruiter", "/hr/transitions/TRN-DEMO-006", "Cancelled pre-hire and compensation"),
      unit("Delayed start", "People operations", "/hr/transitions/TRN-DEMO-007", "Recalculated dependent work"),
      unit("New-hire no-show", "Manager", "/hr/transitions/TRN-DEMO-008", "Investigated day-one outcome"),
    ],
    steps: [
      step("J-01", "People operations", "USR-REC-001", "/hr/transitions/new", "Propose effective transition", "Choose type, effective date, reason and source relationship", "Worker relationship + policy", "WorkerTransition draft", "Worker lifecycle ledger", "Transition business key", "Conflicting effective dates block submission"),
      step("J-02", "HRIS operator", "USR-HRI-001", "/hr/transitions/TRN-DEMO-001/impact", "Run impact preview", "Inspect identity, tasks, payroll, benefits, access and facilities effects", "Transition draft + destination state", "Impact set", "Destination work queues", "Before/after impact receipt", "Unavailable destinations remain explicit rather than assumed"),
      step("J-03", "Manager", "USR-HM-001", "/manager", "Approve accountable work", "Confirm operational outcome and manager-owned actions", "Minimum-necessary impact", "Approval + manager tasks", "Worker lifecycle ledger", "Attributed approval", "Denied approval returns the transition with reason"),
      step("J-04", "IT", undefined, "/it", "Execute compensating work", "Create, change or revoke access and assets", "Approved transition + effective date", "Destination effect", "Destination work queues", "Effect and revocation receipt", "Partial failure keeps successful effects and creates recovery work"),
      step("J-05", "HRIS operator", "USR-HRI-001", "/hr/transitions/TRN-DEMO-001", "Reconcile destinations", "Compare expected and observed effects before closing", "Impact set + destination receipts", "Transition outcome", "Immutable audit archive", "Complete reconciliation ledger", "Cancellation creates inverse work rather than deleting history"),
    ],
  },
  {
    id: "admin-control",
    code: "DFD-11",
    title: "Administration, identity and integration control",
    domain: "Govern",
    audience: "Platform admins, configuration admins, privacy, security and auditors",
    duration: "20 minutes",
    objective:
      "Govern users, access, content, integrations, imports, privacy and session policy with versioned approvals and safe recovery.",
    outcome:
      "Every privileged change is scoped, reviewable, testable, reversible and represented by audit evidence.",
    scenarioId: "SCN-011",
    actors: ["Platform admin", "Configuration admin", "Privacy and legal", "Access approver", "Auditor"],
    objects: ["User", "AccessRequest", "IdentityPolicy", "ContentTemplateVersion", "IntegrationConnection", "ImportRun", "PrivacyRequest", "AuditEvent"],
    dataStores: ["Identity control plane", "Configuration ledger", "Immutable audit archive"],
    communications: ["Access decision", "Content preview", "Integration test receipt", "Privacy milestone"],
    journeyUnits: [
      unit("Create, edit, suspend and revoke users", "Platform admin", "/admin/users", "Effective user access"),
      unit("Approve, return and deny access", "Access approver", "/admin/access-requests", "An attributed access decision"),
      unit("Configure SSO, MFA, session and break-glass", "Platform admin", "/admin/identity", "Versioned identity policy"),
      unit("Manage notifications and deep links", "Configuration admin", "/admin/notifications", "Permission-rechecked notification"),
      unit("Version and localize content", "Configuration admin", "/admin/content", "Approved communication version"),
      unit("Configure integrations, mapping and credentials", "Platform admin", "/admin/integrations/ICG-DEMO-001", "Tested synthetic connection"),
      unit("Stage, validate, correct and roll back imports", "Platform admin", "/admin/imports", "A governed import preview"),
      unit("Execute privacy, governance and audit operations", "Privacy and legal", "/admin/privacy-requests", "A due-dated governed response"),
    ],
    steps: [
      step("K-01", "Platform admin", "USR-ADM-001", "/admin/users", "Manage effective user access", "Create or change role, scope, dates and MFA requirement", "User + access policy", "Effective assignment", "Identity control plane", "Access change receipt", "Direct role changes outside policy create an access request"),
      step("K-02", "Access approver", "USR-ADM-001", "/admin/access-requests", "Decide access request", "Review purpose, population, duration and segregation rules", "AccessRequest + policy", "Approval, return or denial", "Identity control plane", "Attributed decision evidence", "Expired or conflicting requests deny safely"),
      step("K-03", "Configuration admin", "USR-CFG-001", "/admin/content", "Approve content version", "Preview channel, locale, audience and effective window", "Template draft + legal evidence", "ContentTemplateVersion", "Configuration ledger", "Approved immutable version", "Missing locale or approval blocks activation"),
      step("K-04", "Platform admin", "USR-ADM-001", "/admin/integrations/ICG-DEMO-001", "Test integration contract", "Validate mapping, credential reference and synthetic payload", "Connection version + mapping", "Test receipt", "Configuration ledger", "No-write provider test result", "Failure preserves active version and opens recovery"),
      step("K-05", "Privacy and legal", "USR-PRV-001", "/admin/privacy-requests", "Execute governed privacy work", "Verify identity, scope stores, approve actions and evidence completion", "PrivacyRequest + data map", "Governed response", "Immutable audit archive", "Request milestone and evidence receipt", "Legal hold or identity mismatch pauses execution"),
    ],
  },
  {
    id: "analytics-recovery",
    code: "DFD-12",
    title: "Analytics, reporting, data readiness and recovery",
    domain: "Improve",
    audience: "Executives, recruiting operations, data stewards, auditors and service owners",
    duration: "15 minutes",
    objective:
      "Connect governed operational facts to reconciled metrics, drill-through evidence and owned recovery work.",
    outcome:
      "Decision-makers can explain a metric, inspect its denominator and lineage, act on exceptions and verify recovery.",
    scenarioId: "SCN-012",
    actors: ["Executive", "Recruiting operations", "Data steward", "Automation operator", "Auditor"],
    objects: ["MetricDefinition", "ReportDefinition", "ReportRun", "DashboardSnapshot", "DataQualityIssue", "RecoveryCase", "AutomationRun"],
    dataStores: ["Semantic metric layer", "Report delivery ledger", "Recovery and audit ledger"],
    communications: ["Scheduled report preview", "Subscription notification", "Recovery completion receipt"],
    journeyUnits: [
      unit("Explore dashboards and drill-through", "Executive", "/hr/analytics", "Explainable filtered metrics"),
      unit("Build, save, schedule and export reports", "Recruiting operations", "/hr/reports", "A versioned report definition"),
      unit("Review data readiness and object model", "Data steward", "/hr/objects", "Traceable data contracts"),
      unit("Analyze volume and onboarding progress", "Recruiting operations", "/hr/onboarding/analytics", "Operational outcome views"),
      unit("Investigate failures and recover safely", "Automation operator", "/hr/recovery/RCV-DEMO-001", "A reconciled recovery case"),
    ],
    steps: [
      step("L-01", "Executive", "USR-HM-001", "/hr/analytics", "Inspect governed KPI", "Choose population, period, stage and demographic guardrails", "MetricDefinition + canonical facts", "Filtered KPI result", "Semantic metric layer", "Numerator, denominator and freshness", "Zero-eligible denominators display N/A"),
      step("L-02", "Recruiting operations", "USR-REC-001", "/hr/reports", "Build operational report", "Select approved dimensions, measures and row scope", "Semantic fields + role scope", "ReportDefinition", "Report delivery ledger", "Saved report version", "Restricted fields remain unavailable to the builder"),
      step("L-03", "Data steward", "USR-AUD-001", "/hr/objects", "Trace metric lineage", "Inspect object grain, fields, relationship and source freshness", "Metric contract", "Lineage and readiness result", "Semantic metric layer", "Source-to-chart reconciliation", "Unreconciled data is labelled and excluded"),
      step("L-04", "Automation operator", "USR-CFG-001", "/hr/recovery/RCV-DEMO-001", "Recover failed effect", "Review business key, attempts, safe state and owner", "RecoveryCase + effect history", "Reconciled effect", "Recovery and audit ledger", "Idempotent recovery receipt", "Repeated failure escalates without duplicate action"),
      step("L-05", "Auditor", "USR-AUD-001", "/hr/governance", "Verify evidence chain", "Compare action, state change, metric restatement and delivery history", "Audit events + report runs", "Evidence conclusion", "Recovery and audit ledger", "Read-only evidence package", "Missing evidence keeps the claim unapproved"),
    ],
  },
];

let journeySequence = 0;
export const journeyCatalog: JourneyUnit[] = businessUseCases.flatMap((useCase) =>
  useCase.journeyUnits.map((journey) => {
    journeySequence += 1;
    return {
      ...journey,
      id: `JRN-${String(journeySequence).padStart(3, "0")}`,
      useCaseId: useCase.id,
      useCaseTitle: useCase.title,
    };
  }),
);

export const demoPacks = [
  { id: "executive", title: "Executive overview", audience: "Leadership", duration: "10–12 min", purpose: "Demand, pipeline, bottlenecks, hiring outcomes and onboarding readiness", useCaseIds: ["requisition-job", "recruiting-operations", "interview-offer", "onboarding", "analytics-recovery"] },
  { id: "recruiter", title: "Recruiter workday", audience: "Recruiting teams", duration: "25 min", purpose: "Requisition through accepted offer", useCaseIds: ["requisition-job", "recruiting-operations", "interview-offer"] },
  { id: "candidate", title: "Candidate experience", audience: "Candidates and product", duration: "15 min", purpose: "Discovery, application, scheduling, checks and offer", useCaseIds: ["candidate-attraction", "application-self-service", "screening-regulatory", "interview-offer"] },
  { id: "new-hire", title: "New-hire onboarding", audience: "HR and People Operations", duration: "20 min", purpose: "Accepted offer through day 90", useCaseIds: ["onboarding", "portals-fulfilment", "worker-lifecycle"] },
  { id: "volume", title: "High-volume recruiting", audience: "Campus and volume teams", duration: "15 min", purpose: "Campaign, event, cohort, capacity and bounded progression", useCaseIds: ["talent-scale", "screening-regulatory", "analytics-recovery"] },
  { id: "ecosystem", title: "Hiring ecosystem", audience: "Managers, IT and facilities", duration: "15 min", purpose: "Decisions, readiness, provisioning and reconciliation", useCaseIds: ["interview-offer", "portals-fulfilment", "worker-lifecycle"] },
  { id: "partners", title: "Partner channels", audience: "Agencies, referrers and talent teams", duration: "15 min", purpose: "Agency, referral, CRM and internal mobility", useCaseIds: ["talent-scale", "portals-fulfilment"] },
  { id: "governance", title: "Governance and recovery", audience: "Security, legal, admin and audit", duration: "20 min", purpose: "Identity, privacy, integration, reporting and failure recovery", useCaseIds: ["admin-control", "analytics-recovery", "screening-regulatory"] },
] as const;

export const demoJourneySummary = {
  businessUseCases: businessUseCases.length,
  journeyUnits: journeyCatalog.length,
  demoPacks: demoPacks.length,
  actorPersonas: 13,
  participatingEntities: new Set(
    businessUseCases.flatMap((useCase) => useCase.actors),
  ).size,
  steps: businessUseCases.reduce((sum, useCase) => sum + useCase.steps.length, 0),
};

export function getBusinessUseCase(id: string | undefined) {
  return businessUseCases.find((useCase) => useCase.id === id);
}
