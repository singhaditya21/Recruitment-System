export type LifecycleType =
  | "Stateful business record"
  | "Versioned configuration"
  | "Append-only evidence"
  | "Derived snapshot / projection"
  | "Reference / master data";

export type ObjectDataPoint = {
  id: string;
  key: string;
  label: string;
  type: string;
  category: "Business" | "Governance";
  requiredWhen: string;
  source: string;
  classification: string;
  qualityRule: string;
  readRoles: string[];
  writeRoles: string[];
  sampleValue: string;
};

export type ObjectContract = {
  id: string;
  name: string;
  domain: string;
  lifecycleType: LifecycleType;
  states: string[];
  grain: string;
  sourceOfTruth: string;
  owner: string;
  classification: string;
  retention: string;
  dataGroups: string[];
  personas: string[];
  relationships: string[];
  commands: string[];
  dataQuality: string[];
  dataPoints: ObjectDataPoint[];
};

const dat = (...numbers: number[]) =>
  numbers.map((number) => `DAT-${String(number).padStart(3, "0")}`);
const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index);

const domains = [
  {
    name: "Organization and access",
    objects: [
      "Organization",
      "User",
      "Role",
      "Permission",
      "Team",
      "Department",
    ],
    dataGroups: dat(16, 48),
    owner: "Identity, security and HR configuration",
    source: "Approved workforce identity and organization configuration",
    classification: "Internal / restricted by entitlement",
    retention: "Active relationship plus approved security and audit period",
    personas: [
      "Configuration Admin",
      "Platform Admin",
      "Privacy & Legal",
      "Auditor",
    ],
    relationships: [
      "Organization is the root boundary",
      "Users receive effective-dated role, team and permission assignments",
    ],
  },
  {
    name: "Requisition, opening, posting and workflow",
    objects: [
      "Requisition",
      "RequisitionApproval",
      "PositionOpening",
      "JobPosting",
      "JobPostingVersion",
      "JobLocation",
      "HiringPlan/Version",
      "CompetencyCoverage",
      "ProcessTemplate/Version",
      "StageDefinition/Mapping",
      "TransitionContract",
      "DecisionReadinessSnapshot",
      "OperationalViewDefinition",
    ],
    dataGroups: dat(...range(9, 16), 23, 24, 28, 34, 45, 47),
    owner: "Recruiting operations and hiring owner",
    source: "Authorized HR configuration, hiring kickoff and policy evaluation",
    classification: "Internal; approved posting projection may be public",
    retention:
      "Version history retained through every linked application lifecycle",
    personas: [
      "Recruiter",
      "Hiring Manager",
      "Configuration Admin",
      "Privacy & Legal",
      "Auditor",
    ],
    relationships: [
      "Requisition authorizes openings and postings",
      "Approved hiring-plan and process versions are pinned to applications",
    ],
  },
  {
    name: "Candidate, identity and application",
    objects: [
      "Candidate",
      "CandidateIdentity",
      "Application",
      "ApplicationAttempt",
      "ApplicationTemplateVersion",
      "QuestionDefinition",
      "ApplicationAnswer",
      "Consent/AuthorizationRecord",
    ],
    dataGroups: dat(...range(1, 8), 17, 18, 19, 21, 22, 28),
    owner: "Candidate identity and recruiting operations",
    source: "Candidate, identity service and canonical transition service",
    classification: "Confidential; own or assigned-purpose access",
    retention:
      "Candidate/application schedule with purpose-specific correction and deletion behavior",
    personas: [
      "Candidate",
      "Recruiter",
      "Hiring Manager",
      "Candidate Support",
      "Privacy & Legal",
      "Auditor",
    ],
    relationships: [
      "Candidate may own multiple independent applications",
      "Application binds one candidate, requisition and immutable attempt context",
    ],
  },
  {
    name: "Files, source and deferred talent engagement",
    objects: [
      "Resume/FileAsset",
      "SavedJob",
      "JobAlert",
      "TalentPool",
      "TalentPoolMembership",
      "Tag",
      "Source",
      "SourceAttribution",
      "Referral",
      "AgencySubmission",
    ],
    dataGroups: dat(7, 20, 21, 22, 36, 46, 47),
    owner: "Candidate operations, file service and approved talent operations",
    source: "Candidate, approved partner attribution and private file service",
    classification:
      "Confidential; file content remains outside the public wireframe",
    retention:
      "Purpose-specific expiry, quarantine, deletion and provider reconciliation",
    personas: [
      "Candidate",
      "Recruiter",
      "Candidate Support",
      "Platform Admin",
      "Privacy & Legal",
      "Auditor",
    ],
    relationships: [
      "File metadata references one approved purpose and parent",
      "Talent-engagement records remain P1 and purpose separated",
    ],
  },
  {
    name: "Screening and assessment",
    objects: [
      "Screen",
      "AssessmentDefinition/Version",
      "AssessmentAssignment",
      "AssessmentSubmission",
      "Rubric/Version",
      "Competency",
    ],
    dataGroups: dat(13, 14, 17, 18, 19, 20, 25, 33, 34, 35),
    owner: "Hiring plan owner and assigned evaluator",
    source: "Approved plan/rubric and human-entered job-related evidence",
    classification: "Confidential hiring evidence",
    retention:
      "Pinned definition and immutable evidence retained with the application decision record",
    personas: [
      "Recruiter",
      "Hiring Manager",
      "Interviewer",
      "Privacy & Legal",
      "Auditor",
    ],
    relationships: [
      "Assignments pin approved definition and rubric versions",
      "Submissions never directly advance or reject a candidate",
    ],
  },
  {
    name: "Interview and scheduling",
    objects: [
      "InterviewPlan",
      "InterviewRound",
      "AvailabilityWindow",
      "SchedulingRequest",
      "InterviewSession",
      "InterviewerRoleSlot",
      "InterviewerPool/Membership",
      "InterviewerQualification",
      "SchedulingConstraint/Proposal",
      "RoomResource",
      "CalendarProjection",
      "InterviewerAssignment",
      "Scorecard",
    ],
    dataGroups: dat(16, 24, ...range(29, 33), 36, 43, 44, 46),
    owner: "Recruiting coordination and evidence owner",
    source:
      "Candidate availability, qualified interviewer configuration and canonical session service",
    classification:
      "Confidential logistics and hiring evidence, separately permissioned",
    retention:
      "Availability expires by purpose; session and evidence history follows the application",
    personas: [
      "Candidate",
      "Recruiting Coordinator",
      "Recruiter",
      "Hiring Manager",
      "Interviewer",
      "Auditor",
    ],
    relationships: [
      "Scheduling request may create one canonical interview session",
      "Session assignments independently own scorecards",
    ],
  },
  {
    name: "Decision, approval, offer and hire",
    objects: [
      "Decision",
      "Disposition",
      "ApprovalPolicy/Version/Process/Step",
      "ApprovalAttempt/Decision",
      "Offer",
      "OfferVersion",
      "OfferApproval",
      "OfferResponse",
      "ContingencyCase",
      "OpeningReservation",
      "HireHandoff",
    ],
    dataGroups: dat(25, 28, 34, 35, ...range(37, 42), 45, 46, 48),
    owner: "Authorized hiring decision, offer and HR operations owners",
    source: "Human decision, approved offer workflow and reconciled HR handoff",
    classification: "Highly restricted decision and compensation data",
    retention:
      "Immutable versions and consequential evidence retained under employment-record policy",
    personas: [
      "Recruiter",
      "Hiring Manager",
      "Offer Approver",
      "HRIS Operator",
      "Privacy & Legal",
      "Auditor",
    ],
    relationships: [
      "Decision, offer approval, response, reservation, contingency, handoff and Hired remain distinct",
      "One active offer and reservation per application",
    ],
  },
  {
    name: "Work, automation and communication",
    objects: [
      "RecruitingWorkItem",
      "Task/EventProjection",
      "AutomationRule/Version",
      "AutomationExecution/Action",
      "Message",
      "MessageTemplate",
      "DeliveryEvent",
      "Notification",
      "CommunicationPreference/Suppression",
    ],
    dataGroups: dat(7, 23, 24, 28, 36, 43, 44, 46, 47, 48),
    owner: "Recruiting operations, messaging and automation owners",
    source: "Canonical business events and approved versioned rules/templates",
    classification:
      "Internal/confidential with candidate-safe message projection",
    retention:
      "Operational evidence retained by purpose; payloads and bodies minimized",
    personas: [
      "Candidate",
      "Recruiter",
      "Recruiting Coordinator",
      "Configuration Admin",
      "Platform Admin",
      "Auditor",
    ],
    relationships: [
      "Work items and messages point to authoritative business facts",
      "Automation actions use stable idempotency keys and reconciliation",
    ],
  },
  {
    name: "Jurisdiction and selection-procedure governance",
    objects: [
      "JurisdictionRule",
      "PolicyEvaluationSnapshot",
      "AutomatedDecisionSystemRegistry",
      "SelectionProcedureVersion",
    ],
    dataGroups: dat(18, 22, 34, 35, 41, 45, 46, 47),
    owner: "Privacy, legal and selection-procedure control owners",
    source:
      "Approved effective-dated policy and reviewed provider/system facts",
    classification:
      "Restricted governance data; safe blocker only to general users",
    retention:
      "Immutable action snapshots plus effective configuration history",
    personas: [
      "Privacy & Legal",
      "Configuration Admin",
      "Platform Admin",
      "Auditor",
    ],
    relationships: [
      "Policy snapshots bind employer, job, person/action and rule versions",
      "Unknown or conflicting applicability blocks the governed action",
    ],
  },
  {
    name: "Experience, service recovery and integrity",
    objects: [
      "CandidateExperienceSurvey/Version/Response",
      "ServiceRecoveryCase",
      "ApplicationIntegrityCase",
    ],
    dataGroups: dat(26, 27, 36, 46, 47),
    owner: "Candidate support, research and restricted integrity operations",
    source:
      "Candidate response, support case and minimized reviewed integrity evidence",
    classification:
      "Restricted and separated from active hiring decision-makers",
    retention:
      "Purpose-specific survey/case schedule with appeal and false-positive evidence",
    personas: [
      "Candidate",
      "Candidate Support",
      "Application Integrity Reviewer",
      "Privacy & Legal",
      "Auditor",
    ],
    relationships: [
      "Experience feedback cannot change application outcome",
      "Integrity signals require human review and redress before any employment action",
    ],
  },
  {
    name: "Accommodation, privacy and lifecycle",
    objects: [
      "AccommodationRequest",
      "PrivacyRequest",
      "RetentionRule",
      "LegalHold",
    ],
    dataGroups: dat(8, 22, 27, 41, 45, 46),
    owner: "Restricted HR, privacy and legal operations",
    source:
      "Candidate request, effective law/policy and verified execution evidence",
    classification:
      "Highly restricted; routine evaluators receive logistics or safe blocker only",
    retention:
      "Applicable request/hold schedule with provider and backup reconciliation",
    personas: [
      "Candidate",
      "Candidate Support",
      "Privacy & Legal",
      "Platform Admin",
      "Auditor",
    ],
    relationships: [
      "Request identity evidence is separated from hiring evidence",
      "Legal hold suspends only affected destructive actions",
    ],
  },
  {
    name: "Audit and integration",
    objects: [
      "AuditEvent",
      "IntegrationSubscription",
      "IntegrationEvent",
      "DeliveryAttempt",
      "ReconciliationCheckpoint",
    ],
    dataGroups: dat(36, ...range(42, 48)),
    owner: "Platform, integration, security and audit operations",
    source:
      "Registered interfaces, canonical services and consequential business actions",
    classification: "Internal/restricted; payload and copied content minimized",
    retention:
      "Append-oriented evidence with archive, checkpoint and legal-hold behavior",
    personas: [
      "Platform Admin",
      "Configuration Admin",
      "HRIS Operator",
      "Privacy & Legal",
      "Auditor",
    ],
    relationships: [
      "Events are transport evidence, never business truth",
      "Checkpoints reconcile provider and canonical versions before completion",
    ],
  },
] as const;

const explicitStates: Record<string, string[]> = {
  Organization: ["Proposed", "Active", "Suspended", "Offboarding", "Archived"],
  User: ["Invited", "Active", "Suspended", "Deactivated", "Archived"],
  Requisition: [
    "Draft",
    "Pending approval",
    "Approved",
    "Open",
    "On hold",
    "Filled",
    "Canceled",
    "Archived",
  ],
  PositionOpening: [
    "Proposed",
    "Approved",
    "Open",
    "Reserved",
    "Frozen",
    "Filled",
    "Canceled",
  ],
  JobPosting: [
    "Draft",
    "Scheduled",
    "Published",
    "Paused",
    "Expired",
    "Unpublished",
    "Closed",
    "Archived",
  ],
  "HiringPlan/Version": [
    "Draft",
    "Validation failed",
    "Ready for review",
    "Approved",
    "Active",
    "Superseded",
    "Retired",
  ],
  Candidate: [
    "Unverified",
    "Verified",
    "Duplicate review",
    "Restricted",
    "Archived",
  ],
  CandidateIdentity: [
    "Pending verification",
    "Verified",
    "Superseded",
    "Revoked",
  ],
  Application: [
    "Draft",
    "Submitted",
    "Active",
    "Terminal",
    "Reopened by exception",
    "Archived",
  ],
  ApplicationAttempt: [
    "Started",
    "Saved",
    "Submitted",
    "Abandoned",
    "Withdrawn",
    "Expired",
  ],
  "Resume/FileAsset": [
    "Initiated",
    "Uploaded",
    "Scanning",
    "Clean",
    "Quarantined",
    "Rejected",
    "Superseded",
    "Deleted",
  ],
  AssessmentAssignment: [
    "Draft",
    "Assigned",
    "Started",
    "Submitted",
    "Under review",
    "Completed",
    "Expired",
    "Canceled",
  ],
  AvailabilityWindow: [
    "Draft",
    "Active",
    "Used",
    "Expired",
    "Revoked",
    "Superseded",
  ],
  SchedulingRequest: [
    "Draft",
    "Sent",
    "Opened",
    "Availability submitted",
    "Booked",
    "Expired",
    "Canceled",
    "Superseded",
    "Failed",
  ],
  InterviewSession: [
    "Draft",
    "Availability pending",
    "Proposed",
    "Tentative",
    "Confirmed",
    "Completed",
    "Rescheduled",
    "Canceled",
    "No-show",
  ],
  InterviewerAssignment: [
    "Assigned",
    "Acknowledged",
    "Declined",
    "Reassigned",
    "Evidence due",
    "Completed",
    "Waived",
    "Expired",
  ],
  Scorecard: [
    "Draft",
    "Saved",
    "Submitted",
    "Locked",
    "Amendment requested",
    "Amended",
    "Superseded",
  ],
  Decision: [
    "Draft",
    "Ready",
    "Recorded",
    "Corrected",
    "Superseded",
    "Voided by authorized exception",
  ],
  Disposition: [
    "Proposed",
    "Recorded",
    "Communication pending",
    "Communicated",
    "Corrected",
    "Reopened by exception",
  ],
  Offer: [
    "Draft",
    "Pending approval",
    "Approved",
    "Extended",
    "Viewed",
    "Accepted",
    "Declined",
    "Expired",
    "Withdrawn",
    "Rescinded",
    "Superseded",
  ],
  OfferVersion: [
    "Draft",
    "Submitted",
    "Approved",
    "Actionable",
    "Superseded",
    "Expired",
    "Withdrawn",
  ],
  OfferResponse: [
    "Available",
    "Viewed",
    "Accepted",
    "Declined",
    "Expired",
    "Invalidated",
    "Reconciled",
  ],
  ContingencyCase: [
    "Not required",
    "Awaiting authorization",
    "Ordered",
    "Pending",
    "Review required",
    "Cleared",
    "Failed",
    "Waived",
    "Canceled",
  ],
  OpeningReservation: [
    "Requested",
    "Acquired",
    "Conflict",
    "Released",
    "Expired",
    "Converted to fill",
  ],
  HireHandoff: [
    "Not ready",
    "Ready",
    "Queued",
    "Sent",
    "Acknowledged",
    "Completed",
    "Failed",
    "Correction required",
    "Canceled",
  ],
  RecruitingWorkItem: [
    "Open",
    "In progress",
    "Blocked",
    "Completed",
    "Canceled",
    "Superseded",
  ],
  Message: [
    "Draft",
    "Eligibility checked",
    "Scheduled",
    "Queued",
    "Sent",
    "Delivered",
    "Failed",
    "Suppressed",
    "Canceled",
    "Replied",
    "Expired",
  ],
  PrivacyRequest: [
    "Received",
    "Identity verification",
    "Scoped",
    "Review",
    "Approved",
    "Executing",
    "Reconciling",
    "Completed",
    "Denied",
    "Closed",
  ],
  AccommodationRequest: [
    "Received",
    "Triage",
    "Information needed",
    "Approved",
    "Alternative provided",
    "Implemented",
    "Closed",
    "Withdrawn",
  ],
  IntegrationEvent: [
    "Received",
    "Rejected",
    "Accepted",
    "Processing",
    "Applied",
    "Reconciled",
    "Retry scheduled",
    "Dead letter",
    "Ignored duplicate",
  ],
};

function lifecycleTypeFor(name: string): LifecycleType {
  if (
    [
      "DecisionReadinessSnapshot",
      "OperationalViewDefinition",
      "SchedulingConstraint/Proposal",
      "CalendarProjection",
      "Task/EventProjection",
      "Notification",
      "PolicyEvaluationSnapshot",
      "ReconciliationCheckpoint",
    ].includes(name)
  )
    return "Derived snapshot / projection";
  if (
    [
      "ApplicationAnswer",
      "AssessmentSubmission",
      "ApprovalAttempt/Decision",
      "OfferApproval",
      "OfferResponse",
      "DeliveryEvent",
      "AuditEvent",
      "IntegrationEvent",
      "DeliveryAttempt",
    ].includes(name)
  )
    return "Append-only evidence";
  if (
    name.includes("Version") ||
    name.includes("Definition") ||
    name.includes("Template") ||
    [
      "Role",
      "Permission",
      "CompetencyCoverage",
      "TransitionContract",
      "JurisdictionRule",
      "AutomatedDecisionSystemRegistry",
      "RetentionRule",
    ].includes(name)
  )
    return "Versioned configuration";
  if (
    [
      "Organization",
      "Team",
      "Department",
      "JobLocation",
      "Tag",
      "Source",
      "Competency",
      "InterviewerPool/Membership",
      "InterviewerQualification",
      "RoomResource",
      "CommunicationPreference/Suppression",
      "IntegrationSubscription",
    ].includes(name)
  )
    return "Reference / master data";
  return "Stateful business record";
}

function statesFor(name: string, type: LifecycleType) {
  if (explicitStates[name]) return explicitStates[name];
  if (type === "Versioned configuration")
    return [
      "Draft",
      "Validation failed",
      "In review",
      "Approved",
      "Active",
      "Superseded",
      "Retired",
    ];
  if (type === "Append-only evidence")
    return [
      "Created",
      "Validated",
      "Applied",
      "Corrected by compensating record",
      "Retained",
      "Archived",
    ];
  if (type === "Derived snapshot / projection")
    return [
      "Pending",
      "Current",
      "Stale",
      "Invalidated",
      "Recalculated",
      "Archived",
    ];
  if (type === "Reference / master data")
    return ["Proposed", "Active", "Inactive", "Retired"];
  return [
    "Draft",
    "Open",
    "In progress",
    "Blocked",
    "Completed",
    "Canceled",
    "Archived",
  ];
}

function commandsFor(type: LifecycleType) {
  if (type === "Versioned configuration")
    return [
      "Create draft",
      "Validate",
      "Submit for review",
      "Approve",
      "Activate",
      "Supersede",
      "Retire",
    ];
  if (type === "Append-only evidence")
    return [
      "Create",
      "Validate",
      "Apply once",
      "Correct with compensating record",
      "Archive",
    ];
  if (type === "Derived snapshot / projection")
    return ["Calculate", "Invalidate", "Recalculate", "Reconcile", "Archive"];
  if (type === "Reference / master data")
    return [
      "Create",
      "Activate",
      "Update nonmaterial attributes",
      "Deactivate",
      "Retire",
    ];
  return [
    "Create",
    "Update while permitted",
    "Transition",
    "Block/unblock",
    "Cancel",
    "Correct by version",
    "Archive",
  ];
}

type FieldTemplate = readonly [
  key: string,
  label: string,
  type: string,
  requiredWhen: string,
  qualityRule: string,
  sampleValue: string,
];

const domainBusinessFields: Record<string, FieldTemplate[]> = {
  "Organization and access": [
    [
      "display_name",
      "Display name",
      "Text (160)",
      "Create",
      "Must be normalized and nonblank",
      "Harbor & Pine demo",
    ],
    [
      "authority_scope",
      "Authority scope",
      "Controlled enum",
      "Activation",
      "Must resolve to one approved organization boundary",
      "US recruiting sandbox",
    ],
    [
      "effective_from",
      "Effective from",
      "Date",
      "Activation",
      "Cannot be after effective-to",
      "2026-08-01",
    ],
    [
      "effective_to",
      "Effective to",
      "Date",
      "When time bounded",
      "Cannot precede effective-from",
      "2027-07-31",
    ],
    [
      "access_review_due",
      "Access review due",
      "Date",
      "Active privileged record",
      "Must follow the approved review cadence",
      "2026-11-30",
    ],
    [
      "separation_of_duties",
      "Separation-of-duties class",
      "Controlled enum",
      "Privileged record",
      "Conflicting grants must be rejected",
      "Recruiting operations",
    ],
  ],
  "Requisition, opening, posting and workflow": [
    [
      "business_title",
      "Business title",
      "Text (160)",
      "Create",
      "Must be candidate-safe when projected publicly",
      "Senior Product Designer",
    ],
    [
      "headcount",
      "Approved headcount",
      "Integer",
      "Approval",
      "Must be positive and reconcile to openings",
      "1",
    ],
    [
      "work_location",
      "Work location and mode",
      "Structured location",
      "Approval",
      "Jurisdiction must be determinable before publication",
      "California · Remote",
    ],
    [
      "compensation_band",
      "Approved compensation band",
      "Currency range",
      "Approval",
      "Minimum cannot exceed maximum",
      "$148,000–$176,000 USD",
    ],
    [
      "target_start_date",
      "Target start date",
      "Date",
      "Approval",
      "Must be inside the hiring-plan window",
      "2026-10-15",
    ],
    [
      "approval_policy",
      "Approval policy/version",
      "Version reference",
      "Submission",
      "Must be current and effective for employer and job scope",
      "REQ-APPROVAL-v2",
    ],
  ],
  "Candidate, identity and application": [
    [
      "candidate_reference",
      "Candidate reference",
      "Reference",
      "Create",
      "Must resolve inside the authorized purpose",
      "PER-DEMO-001",
    ],
    [
      "requisition_reference",
      "Requisition reference",
      "Reference",
      "Submission",
      "Must be open and accept applications",
      "REQ-DEMO-001",
    ],
    [
      "submission_channel",
      "Submission channel",
      "Controlled enum",
      "Submission",
      "Must be registered and purpose approved",
      "Careers site",
    ],
    [
      "current_stage",
      "Current application stage",
      "Controlled enum",
      "Active application",
      "Must match the latest accepted transition",
      "Interviews",
    ],
    [
      "contact_preference",
      "Contact preference",
      "Controlled enum",
      "When messaging is eligible",
      "Must honor the current suppression state",
      "Email",
    ],
    [
      "correction_status",
      "Correction/duplicate status",
      "Controlled enum",
      "When identity conflict exists",
      "Must retain merge and correction evidence",
      "No conflict",
    ],
  ],
  "Files, source and deferred talent engagement": [
    [
      "purpose_code",
      "Purpose code",
      "Controlled reference",
      "Create",
      "Must be active for the parent and subject",
      "Application evidence",
    ],
    [
      "content_or_source_type",
      "Content/source type",
      "Controlled enum",
      "Create",
      "Must use the registered vocabulary",
      "Resume",
    ],
    [
      "provider_reference",
      "Provider/reference",
      "Text (160)",
      "When externally supplied",
      "Must not expose a public provider URL",
      "Fixture file service",
    ],
    [
      "consent_basis",
      "Consent or authority basis",
      "Controlled reference",
      "Before activation",
      "Must be current and revocable where applicable",
      "Candidate submission",
    ],
    [
      "expiry_at",
      "Purpose expiry",
      "Datetime",
      "When time bounded",
      "Must drive deactivation or deletion work",
      "2027-08-28T12:00:00Z",
    ],
    [
      "scan_or_validation_state",
      "Scan/validation state",
      "Controlled enum",
      "Before use",
      "Unsafe or unknown content must remain blocked",
      "Clean",
    ],
  ],
  "Screening and assessment": [
    [
      "application_reference",
      "Application reference",
      "Reference",
      "Assignment",
      "Must resolve to an active application",
      "APP-DEMO-001",
    ],
    [
      "definition_version",
      "Definition/rubric version",
      "Version reference",
      "Assignment",
      "Must be approved and pinned",
      "ASSESS-v3",
    ],
    [
      "due_at",
      "Due at",
      "Datetime + timezone",
      "Assignment",
      "Timezone and accommodation changes must be preserved",
      "2026-09-02T17:00:00-07:00",
    ],
    [
      "completion_state",
      "Completion state",
      "Controlled enum",
      "Every active assignment",
      "Must reconcile to submission evidence",
      "Assigned",
    ],
    [
      "evidence_summary",
      "Job-related evidence summary",
      "Long text",
      "Human review",
      "Must exclude protected-class inference",
      "Synthetic structured evidence",
    ],
    [
      "accommodation_status",
      "Accommodation-safe status",
      "Controlled enum",
      "When requested",
      "Evaluator sees only the logistics needed to act",
      "No adjustment required",
    ],
  ],
  "Interview and scheduling": [
    [
      "application_reference",
      "Application reference",
      "Reference",
      "Create",
      "Must resolve to an active interview plan",
      "APP-DEMO-001",
    ],
    [
      "session_or_assignment_type",
      "Session/assignment type",
      "Controlled enum",
      "Create",
      "Must exist in the approved plan",
      "Portfolio review",
    ],
    [
      "start_at",
      "Start at",
      "Datetime + timezone",
      "Confirmation",
      "Candidate and organizer timezone projections must reconcile",
      "2026-08-27T11:00:00-07:00",
    ],
    [
      "duration_minutes",
      "Duration",
      "Integer minutes",
      "Confirmation",
      "Must be positive and policy compliant",
      "60",
    ],
    [
      "participant_or_pool",
      "Participant/pool reference",
      "Reference",
      "Assignment",
      "Must be qualified, available and conflict checked",
      "USR-INT-001",
    ],
    [
      "attendance_or_evidence_state",
      "Attendance/evidence state",
      "Controlled enum",
      "After session",
      "Attendance and scorecard state remain independent",
      "Completed · evidence due",
    ],
  ],
  "Decision, approval, offer and hire": [
    [
      "application_reference",
      "Application reference",
      "Reference",
      "Create",
      "Must resolve to decision-ready current application version",
      "APP-DEMO-011",
    ],
    [
      "subject_version",
      "Consequential subject version",
      "Version reference",
      "Approval/action",
      "Must be current and immutable during approval",
      "OFFER-v4",
    ],
    [
      "decision_or_response",
      "Decision/response",
      "Controlled enum",
      "Consequential action",
      "Must be actor-authorized and reason bounded",
      "Pending approval",
    ],
    [
      "compensation_or_opening",
      "Compensation/opening reference",
      "Restricted reference",
      "Offer/hire action",
      "Must stay within approved requisition and opening",
      "OPEN-DEMO-001",
    ],
    [
      "effective_or_start_date",
      "Effective/start date",
      "Date",
      "Offer/hire action",
      "Must be policy valid and consistent with the current offer",
      "2026-09-22",
    ],
    [
      "acknowledgement_state",
      "Acknowledgement/reconciliation state",
      "Controlled enum",
      "External handoff",
      "Hired requires acknowledgement of the exact payload",
      "Pending acknowledgement",
    ],
  ],
  "Work, automation and communication": [
    [
      "trigger_or_purpose",
      "Trigger/purpose",
      "Controlled reference",
      "Create",
      "Must map to an approved event and purpose",
      "Scorecard due",
    ],
    [
      "subject_reference",
      "Subject/reference",
      "Reference",
      "Create",
      "Must resolve to an authorized business fact",
      "ASN-DEMO-001",
    ],
    [
      "recipient_or_owner",
      "Recipient/owner",
      "Reference",
      "Actionable record",
      "Must be currently authorized and contact eligible",
      "Recruiter queue",
    ],
    [
      "template_or_rule_version",
      "Template/rule version",
      "Version reference",
      "Execution",
      "Must be approved and pinned",
      "AUT-008-v3",
    ],
    [
      "delivery_or_execution_state",
      "Delivery/execution state",
      "Controlled enum",
      "Every attempt",
      "Must reconcile retries, suppression and terminal result",
      "Succeeded",
    ],
    [
      "idempotency_key",
      "Idempotency key",
      "Opaque text",
      "Every side-effect attempt",
      "The same semantic effect must apply at most once",
      "ASN-DEMO-001:v3:reminder",
    ],
  ],
  "Jurisdiction and selection-procedure governance": [
    [
      "jurisdiction_scope",
      "Jurisdiction scope",
      "Controlled reference",
      "Activation",
      "Must resolve employer, work and candidate location facts",
      "California",
    ],
    [
      "procedure_or_system",
      "Procedure/system reference",
      "Reference",
      "Create",
      "Must exist in the reviewed registry",
      "SEL-PROC-v2",
    ],
    [
      "applicability_result",
      "Applicability result",
      "Controlled enum",
      "Evaluation",
      "Unknown or conflict must block the governed action",
      "Allowed",
    ],
    [
      "effective_from",
      "Effective from",
      "Date",
      "Activation",
      "Must be within the legal/policy version window",
      "2026-08-01",
    ],
    [
      "review_owner",
      "Review owner",
      "User/queue reference",
      "Unknown/conflict",
      "Blocked cases cannot be unowned",
      "Privacy & Legal",
    ],
    [
      "notice_or_assurance",
      "Notice/assurance reference",
      "Reference",
      "Consequential use",
      "Must be satisfied before the governed action",
      "NOTICE-v2",
    ],
  ],
  "Experience, service recovery and integrity": [
    [
      "subject_reference",
      "Candidate/application reference",
      "Restricted reference",
      "Create",
      "Must be purpose-scoped and access separated",
      "APP-DEMO-009",
    ],
    [
      "case_or_response_type",
      "Case/response type",
      "Controlled enum",
      "Create",
      "Must use the approved taxonomy",
      "Delivery recovery",
    ],
    [
      "reported_at",
      "Reported at",
      "Datetime + timezone",
      "Create",
      "Cannot be future dated",
      "2026-08-28T09:00:00-07:00",
    ],
    [
      "severity_or_rating",
      "Severity/rating",
      "Controlled value",
      "Triage/response",
      "Scale and eligibility must be explicit",
      "High",
    ],
    [
      "resolution_or_redress",
      "Resolution/redress state",
      "Controlled enum",
      "Active case",
      "Adverse signals require human review and appeal",
      "In review",
    ],
    [
      "decision_separation",
      "Decision-separation control",
      "Boolean",
      "Every active record",
      "Feedback and unverified signals cannot alter hiring state",
      "true",
    ],
  ],
  "Accommodation, privacy and lifecycle": [
    [
      "requester_or_subject",
      "Requester/subject reference",
      "Restricted reference",
      "Create",
      "Identity proof stays outside routine hiring views",
      "PER-DEMO-014",
    ],
    [
      "request_type",
      "Request type",
      "Controlled enum",
      "Create",
      "Must use the effective jurisdiction vocabulary",
      "Access",
    ],
    [
      "verification_state",
      "Verification state",
      "Controlled enum",
      "Before execution",
      "No destructive or disclosure action before verification",
      "Identity review",
    ],
    [
      "due_at",
      "Due at",
      "Date",
      "After scope calculation",
      "Must use the applicable calendar and extension rules",
      "2026-09-22",
    ],
    [
      "execution_scope",
      "Execution/provider scope",
      "Structured list",
      "Approval",
      "Must reconcile every authoritative processor",
      "Recruitment records",
    ],
    [
      "hold_or_exception",
      "Hold/exception reference",
      "Restricted reference",
      "Before deletion",
      "Only the affected scope may be suspended",
      "No legal hold",
    ],
  ],
  "Audit and integration": [
    [
      "interface_or_event_type",
      "Interface/event type",
      "Controlled reference",
      "Create",
      "Must exist in the registered contract",
      "ApplicationSubmitted.v1",
    ],
    [
      "aggregate_reference",
      "Aggregate reference/version",
      "Reference + version",
      "Create",
      "Must identify one canonical aggregate version",
      "APP-DEMO-001:v5",
    ],
    [
      "correlation_reference",
      "Correlation/trace reference",
      "Opaque text",
      "Create",
      "Must be stable across retries and minimized",
      "CORR-DEMO-101",
    ],
    [
      "attempt_or_sequence",
      "Attempt/sequence",
      "Integer",
      "Every delivery",
      "Must increase monotonically inside the subscription",
      "1",
    ],
    [
      "result_or_checkpoint",
      "Result/checkpoint",
      "Controlled enum",
      "Every processing step",
      "Must distinguish accepted, applied, reconciled and failed",
      "Reconciled",
    ],
    [
      "next_retry_or_recovery",
      "Next retry/recovery",
      "Datetime or work reference",
      "Recoverable failure",
      "Terminal failure must create owned work",
      "Not required",
    ],
  ],
};

function dataPointsFor(
  objectId: string,
  objectName: string,
  domain: string,
  type: LifecycleType,
  classification: string,
  source: string,
  personas: readonly string[],
): ObjectDataPoint[] {
  const shared = [
    [
      "stable_id",
      "Stable opaque identifier",
      "ID",
      "Create",
      source,
      "Must be unique, nonsequential and immutable",
    ],
    [
      "parent_reference",
      "Authoritative parent/reference",
      "Reference",
      "Create when relationship applies",
      source,
      "Must resolve to an authorized non-orphan record",
    ],
    [
      "lifecycle_state",
      "Lifecycle state",
      "Controlled enum",
      "Every active record",
      "Canonical service",
      "Must be one allowed state and follow the transition matrix",
    ],
    [
      "business_version",
      "Business/concurrency version",
      "Integer or opaque token",
      "Create and every mutation",
      "Canonical service",
      "Must increase exactly once per accepted mutation",
    ],
    [
      "source_provenance",
      "Source system, channel and actor",
      "Structured provenance",
      "Create",
      source,
      "Actor, authority and source cannot be blank or inferred from display text",
    ],
    [
      "effective_time",
      "Occurred/effective and observed time",
      "ISO datetime + timezone",
      "Create or activation",
      source,
      "Timezone and occurred-versus-observed semantics must be explicit",
    ],
    [
      "classification",
      "Data classification and purpose",
      "Controlled enum",
      "Create",
      "Policy service",
      "Must map to an approved DAT purpose and field-access policy",
    ],
    [
      "retention_class",
      "Retention, hold and archive class",
      "Controlled reference",
      "Create",
      "Privacy lifecycle service",
      "Must have an effective rule and legal-hold behavior",
    ],
    [
      "owner_or_service",
      "Accountable owner or creating service",
      "User/queue/service reference",
      "When actionable",
      source,
      "Active records cannot be unowned when an action or SLA exists",
    ],
    [
      "evidence_fingerprint",
      "Evidence/source fingerprint",
      "SHA-256 or deterministic hash",
      type === "Reference / master data"
        ? "Material change"
        : "Consequential state",
      "Canonical service",
      "Must change when any declared material input changes",
    ],
  ] as const;
  const readers = [...new Set([...personas, "Auditor"])];
  const writers = personas.filter((role) => role !== "Auditor");
  const governanceWriters = writers.filter((role) =>
    [
      "Configuration Admin",
      "Platform Admin",
      "Privacy & Legal",
      "HRIS Operator",
    ].includes(role),
  );
  const governance = shared.map(
    (
      [key, label, fieldType, requiredWhen, fieldSource, qualityRule],
      index,
    ) => ({
      id: `FLD-${objectId.slice(4)}-${String(index + 1).padStart(2, "0")}`,
      key,
      label,
      type: fieldType,
      category: "Governance" as const,
      requiredWhen,
      source: fieldSource,
      classification,
      qualityRule,
      readRoles: readers,
      writeRoles: ["lifecycle_state", "owner_or_service"].includes(key)
        ? writers
        : governanceWriters,
      sampleValue:
        key === "stable_id"
          ? `${objectId.replace("OBJ", "REC")}-001`
          : key === "lifecycle_state"
            ? statesFor(objectName, type)[0]
            : key === "business_version"
              ? "1"
              : key === "effective_time"
                ? "2026-08-28T12:00:00Z"
                : key === "classification"
                  ? classification
                  : key === "retention_class"
                    ? "RET-v1"
                    : key === "evidence_fingerprint"
                      ? "sha256:fixture…01"
                      : "Synthetic governed value",
    }),
  );
  const business = (domainBusinessFields[domain] ?? []).map(
    (
      [key, label, fieldType, requiredWhen, qualityRule, sampleValue],
      index,
    ) => ({
      id: `FLD-${objectId.slice(4)}-${String(index + shared.length + 1).padStart(2, "0")}`,
      key,
      label,
      type: fieldType,
      category: "Business" as const,
      requiredWhen,
      source,
      classification,
      qualityRule,
      readRoles: readers,
      writeRoles: writers,
      sampleValue,
    }),
  );
  return [...business, ...governance];
}

function relationshipsFor(name: string, fallbacks: readonly string[]) {
  const special: Record<string, string[]> = {
    CandidateIdentity: [
      "Many identity subjects may verify one Candidate",
      "Revocation never deletes the Candidate or its applications",
    ],
    Application: [
      "Exactly one Candidate and one Requisition",
      "One originating posting version when submitted through the portal",
    ],
    ApplicationAttempt: [
      "Exactly one Application aggregate",
      "Attempt number is immutable and unique within candidate/requisition policy",
    ],
    InterviewSession: [
      "Exactly one Application and one interview-plan activity",
      "Former-session relation preserves reschedule lineage",
    ],
    Scorecard: [
      "Exactly one InterviewerAssignment",
      "Original submitted version remains after amendment",
    ],
    OfferVersion: [
      "Exactly one Offer and Application",
      "Only one version may be current and actionable",
    ],
    OpeningReservation: [
      "Exactly one current OfferVersion, Application and PositionOpening",
      "At most one active reservation per opening and application",
    ],
    HireHandoff: [
      "Exactly one Application, accepted OfferVersion and PositionOpening",
      "Only acknowledged exact payload may complete and fill",
    ],
    RecruitingWorkItem: [
      "Exactly one authoritative source fact/rule and typed related record",
      "Task/Event may project it but never replace its state",
    ],
    Message: [
      "One registered COM purpose and related business version",
      "Recipient, template and eligibility versions are pinned at send",
    ],
    PrivacyRequest: [
      "One verified candidate/requester scope with many system execution targets",
      "Request identity evidence remains outside hiring views",
    ],
    IntegrationEvent: [
      "One registered subscription and aggregate version",
      "May trigger many idempotent actions but applies each effect once",
    ],
  };
  return special[name] ?? [...fallbacks];
}

function dataQualityFor(type: LifecycleType) {
  const rules = [
    "Stable ID, owner/source and DAT mapping are present",
    "Relationships are authorized and non-orphaned",
    "Classification, retention and legal-hold rule are effective",
  ];
  if (type === "Versioned configuration")
    rules.push(
      "Exactly one effective active version exists for the selected scope",
    );
  if (type === "Append-only evidence")
    rules.push(
      "Corrections preserve the original and use a compensating record",
    );
  if (type === "Derived snapshot / projection")
    rules.push(
      "Source fingerprint, calculation time and freshness reconcile to canonical facts",
    );
  if (type === "Stateful business record")
    rules.push(
      "State/version combination is reachable through an allowed transition",
    );
  return rules;
}

let objectIndex = 0;
export const objectCatalog: ObjectContract[] = domains.flatMap((domain) =>
  domain.objects.map((name) => {
    objectIndex += 1;
    const id = `OBJ-${String(objectIndex).padStart(3, "0")}`;
    const lifecycleType = lifecycleTypeFor(name);
    return {
      id,
      name,
      domain: domain.name,
      lifecycleType,
      states: statesFor(name, lifecycleType),
      grain: `One ${name} record per authorized business purpose and parent grain`,
      sourceOfTruth: domain.source,
      owner: domain.owner,
      classification: domain.classification,
      retention: domain.retention,
      dataGroups: [...domain.dataGroups],
      personas: [...domain.personas],
      relationships: relationshipsFor(name, domain.relationships),
      commands: commandsFor(lifecycleType),
      dataQuality: dataQualityFor(lifecycleType),
      dataPoints: dataPointsFor(
        id,
        name,
        domain.name,
        lifecycleType,
        domain.classification,
        domain.source,
        domain.personas,
      ),
    };
  }),
);

export const objectDomains = domains.map((domain) => domain.name);
export const lifecycleTypes: LifecycleType[] = [
  "Stateful business record",
  "Versioned configuration",
  "Append-only evidence",
  "Derived snapshot / projection",
  "Reference / master data",
];
export const objectCatalogSummary = {
  families: objectCatalog.length,
  expandedConcepts: 111,
  logicalDataGroups: new Set(objectCatalog.flatMap((item) => item.dataGroups))
    .size,
  minimumDataPoints: objectCatalog.reduce(
    (sum, item) => sum + item.dataPoints.length,
    0,
  ),
  businessDataPoints: objectCatalog.reduce(
    (sum, item) =>
      sum +
      item.dataPoints.filter((field) => field.category === "Business").length,
    0,
  ),
  governanceDataPoints: objectCatalog.reduce(
    (sum, item) =>
      sum +
      item.dataPoints.filter((field) => field.category === "Governance").length,
    0,
  ),
  lifecycleClassified: objectCatalog.filter((item) => item.states.length > 0)
    .length,
  commandClassified: objectCatalog.filter((item) => item.commands.length > 0)
    .length,
  relationshipClassified: objectCatalog.filter(
    (item) => item.relationships.length > 0,
  ).length,
};
