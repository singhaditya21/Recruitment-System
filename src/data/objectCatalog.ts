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
  requiredWhen: string;
  source: string;
  classification: string;
  qualityRule: string;
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

const dat = (...numbers: number[]) => numbers.map((number) => `DAT-${String(number).padStart(3, "0")}`);
const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, index) => start + index);

const domains = [
  {
    name: "Organization and access",
    objects: ["Organization", "User", "Role", "Permission", "Team", "Department"],
    dataGroups: dat(16, 48),
    owner: "Identity, security and HR configuration",
    source: "Approved workforce identity and organization configuration",
    classification: "Internal / restricted by entitlement",
    retention: "Active relationship plus approved security and audit period",
    personas: ["Configuration Admin", "Platform Admin", "Privacy & Legal", "Auditor"],
    relationships: ["Organization is the root boundary", "Users receive effective-dated role, team and permission assignments"],
  },
  {
    name: "Requisition, opening, posting and workflow",
    objects: ["Requisition", "RequisitionApproval", "PositionOpening", "JobPosting", "JobPostingVersion", "JobLocation", "HiringPlan/Version", "CompetencyCoverage", "ProcessTemplate/Version", "StageDefinition/Mapping", "TransitionContract", "DecisionReadinessSnapshot", "OperationalViewDefinition"],
    dataGroups: dat(...range(9, 16), 23, 24, 28, 34, 45, 47),
    owner: "Recruiting operations and hiring owner",
    source: "Authorized HR configuration, hiring kickoff and policy evaluation",
    classification: "Internal; approved posting projection may be public",
    retention: "Version history retained through every linked application lifecycle",
    personas: ["Recruiter", "Hiring Manager", "Configuration Admin", "Privacy & Legal", "Auditor"],
    relationships: ["Requisition authorizes openings and postings", "Approved hiring-plan and process versions are pinned to applications"],
  },
  {
    name: "Candidate, identity and application",
    objects: ["Candidate", "CandidateIdentity", "Application", "ApplicationAttempt", "ApplicationTemplateVersion", "QuestionDefinition", "ApplicationAnswer", "Consent/AuthorizationRecord"],
    dataGroups: dat(...range(1, 8), 17, 18, 19, 21, 22, 28),
    owner: "Candidate identity and recruiting operations",
    source: "Candidate, identity service and canonical transition service",
    classification: "Confidential; own or assigned-purpose access",
    retention: "Candidate/application schedule with purpose-specific correction and deletion behavior",
    personas: ["Candidate", "Recruiter", "Hiring Manager", "Candidate Support", "Privacy & Legal", "Auditor"],
    relationships: ["Candidate may own multiple independent applications", "Application binds one candidate, requisition and immutable attempt context"],
  },
  {
    name: "Files, source and deferred talent engagement",
    objects: ["Resume/FileAsset", "SavedJob", "JobAlert", "TalentPool", "TalentPoolMembership", "Tag", "Source", "SourceAttribution", "Referral", "AgencySubmission"],
    dataGroups: dat(7, 20, 21, 22, 36, 46, 47),
    owner: "Candidate operations, file service and approved talent operations",
    source: "Candidate, approved partner attribution and private file service",
    classification: "Confidential; file content remains outside the public wireframe",
    retention: "Purpose-specific expiry, quarantine, deletion and provider reconciliation",
    personas: ["Candidate", "Recruiter", "Candidate Support", "Platform Admin", "Privacy & Legal", "Auditor"],
    relationships: ["File metadata references one approved purpose and parent", "Talent-engagement records remain P1 and purpose separated"],
  },
  {
    name: "Screening and assessment",
    objects: ["Screen", "AssessmentDefinition/Version", "AssessmentAssignment", "AssessmentSubmission", "Rubric/Version", "Competency"],
    dataGroups: dat(13, 14, 17, 18, 19, 20, 25, 33, 34, 35),
    owner: "Hiring plan owner and assigned evaluator",
    source: "Approved plan/rubric and human-entered job-related evidence",
    classification: "Confidential hiring evidence",
    retention: "Pinned definition and immutable evidence retained with the application decision record",
    personas: ["Recruiter", "Hiring Manager", "Interviewer", "Privacy & Legal", "Auditor"],
    relationships: ["Assignments pin approved definition and rubric versions", "Submissions never directly advance or reject a candidate"],
  },
  {
    name: "Interview and scheduling",
    objects: ["InterviewPlan", "InterviewRound", "AvailabilityWindow", "SchedulingRequest", "InterviewSession", "InterviewerRoleSlot", "InterviewerPool/Membership", "InterviewerQualification", "SchedulingConstraint/Proposal", "RoomResource", "CalendarProjection", "InterviewerAssignment", "Scorecard"],
    dataGroups: dat(16, 24, ...range(29, 33), 36, 43, 44, 46),
    owner: "Recruiting coordination and evidence owner",
    source: "Candidate availability, qualified interviewer configuration and canonical session service",
    classification: "Confidential logistics and hiring evidence, separately permissioned",
    retention: "Availability expires by purpose; session and evidence history follows the application",
    personas: ["Candidate", "Recruiting Coordinator", "Recruiter", "Hiring Manager", "Interviewer", "Auditor"],
    relationships: ["Scheduling request may create one canonical interview session", "Session assignments independently own scorecards"],
  },
  {
    name: "Decision, approval, offer and hire",
    objects: ["Decision", "Disposition", "ApprovalPolicy/Version/Process/Step", "ApprovalAttempt/Decision", "Offer", "OfferVersion", "OfferApproval", "OfferResponse", "ContingencyCase", "OpeningReservation", "HireHandoff"],
    dataGroups: dat(25, 28, 34, 35, ...range(37, 42), 45, 46, 48),
    owner: "Authorized hiring decision, offer and HR operations owners",
    source: "Human decision, approved offer workflow and reconciled HR handoff",
    classification: "Highly restricted decision and compensation data",
    retention: "Immutable versions and consequential evidence retained under employment-record policy",
    personas: ["Recruiter", "Hiring Manager", "Offer Approver", "HRIS Operator", "Privacy & Legal", "Auditor"],
    relationships: ["Decision, offer approval, response, reservation, contingency, handoff and Hired remain distinct", "One active offer and reservation per application"],
  },
  {
    name: "Work, automation and communication",
    objects: ["RecruitingWorkItem", "Task/EventProjection", "AutomationRule/Version", "AutomationExecution/Action", "Message", "MessageTemplate", "DeliveryEvent", "Notification", "CommunicationPreference/Suppression"],
    dataGroups: dat(7, 23, 24, 28, 36, 43, 44, 46, 47, 48),
    owner: "Recruiting operations, messaging and automation owners",
    source: "Canonical business events and approved versioned rules/templates",
    classification: "Internal/confidential with candidate-safe message projection",
    retention: "Operational evidence retained by purpose; payloads and bodies minimized",
    personas: ["Candidate", "Recruiter", "Recruiting Coordinator", "Configuration Admin", "Platform Admin", "Auditor"],
    relationships: ["Work items and messages point to authoritative business facts", "Automation actions use stable idempotency keys and reconciliation"],
  },
  {
    name: "Jurisdiction and selection-procedure governance",
    objects: ["JurisdictionRule", "PolicyEvaluationSnapshot", "AutomatedDecisionSystemRegistry", "SelectionProcedureVersion"],
    dataGroups: dat(18, 22, 34, 35, 41, 45, 46, 47),
    owner: "Privacy, legal and selection-procedure control owners",
    source: "Approved effective-dated policy and reviewed provider/system facts",
    classification: "Restricted governance data; safe blocker only to general users",
    retention: "Immutable action snapshots plus effective configuration history",
    personas: ["Privacy & Legal", "Configuration Admin", "Platform Admin", "Auditor"],
    relationships: ["Policy snapshots bind employer, job, person/action and rule versions", "Unknown or conflicting applicability blocks the governed action"],
  },
  {
    name: "Experience, service recovery and integrity",
    objects: ["CandidateExperienceSurvey/Version/Response", "ServiceRecoveryCase", "ApplicationIntegrityCase"],
    dataGroups: dat(26, 27, 36, 46, 47),
    owner: "Candidate support, research and restricted integrity operations",
    source: "Candidate response, support case and minimized reviewed integrity evidence",
    classification: "Restricted and separated from active hiring decision-makers",
    retention: "Purpose-specific survey/case schedule with appeal and false-positive evidence",
    personas: ["Candidate", "Candidate Support", "Application Integrity Reviewer", "Privacy & Legal", "Auditor"],
    relationships: ["Experience feedback cannot change application outcome", "Integrity signals require human review and redress before any employment action"],
  },
  {
    name: "Accommodation, privacy and lifecycle",
    objects: ["AccommodationRequest", "PrivacyRequest", "RetentionRule", "LegalHold"],
    dataGroups: dat(8, 22, 27, 41, 45, 46),
    owner: "Restricted HR, privacy and legal operations",
    source: "Candidate request, effective law/policy and verified execution evidence",
    classification: "Highly restricted; routine evaluators receive logistics or safe blocker only",
    retention: "Applicable request/hold schedule with provider and backup reconciliation",
    personas: ["Candidate", "Candidate Support", "Privacy & Legal", "Platform Admin", "Auditor"],
    relationships: ["Request identity evidence is separated from hiring evidence", "Legal hold suspends only affected destructive actions"],
  },
  {
    name: "Audit and integration",
    objects: ["AuditEvent", "IntegrationSubscription", "IntegrationEvent", "DeliveryAttempt", "ReconciliationCheckpoint"],
    dataGroups: dat(36, ...range(42, 48)),
    owner: "Platform, integration, security and audit operations",
    source: "Registered interfaces, canonical services and consequential business actions",
    classification: "Internal/restricted; payload and copied content minimized",
    retention: "Append-oriented evidence with archive, checkpoint and legal-hold behavior",
    personas: ["Platform Admin", "Configuration Admin", "HRIS Operator", "Privacy & Legal", "Auditor"],
    relationships: ["Events are transport evidence, never business truth", "Checkpoints reconcile provider and canonical versions before completion"],
  },
] as const;

const explicitStates: Record<string, string[]> = {
  Organization: ["Proposed", "Active", "Suspended", "Offboarding", "Archived"],
  User: ["Invited", "Active", "Suspended", "Deactivated", "Archived"],
  Requisition: ["Draft", "Pending approval", "Approved", "Open", "On hold", "Filled", "Canceled", "Archived"],
  PositionOpening: ["Proposed", "Approved", "Open", "Reserved", "Frozen", "Filled", "Canceled"],
  JobPosting: ["Draft", "Scheduled", "Published", "Paused", "Expired", "Unpublished", "Closed", "Archived"],
  "HiringPlan/Version": ["Draft", "Validation failed", "Ready for review", "Approved", "Active", "Superseded", "Retired"],
  Candidate: ["Unverified", "Verified", "Duplicate review", "Restricted", "Archived"],
  CandidateIdentity: ["Pending verification", "Verified", "Superseded", "Revoked"],
  Application: ["Draft", "Submitted", "Active", "Terminal", "Reopened by exception", "Archived"],
  ApplicationAttempt: ["Started", "Saved", "Submitted", "Abandoned", "Withdrawn", "Expired"],
  "Resume/FileAsset": ["Initiated", "Uploaded", "Scanning", "Clean", "Quarantined", "Rejected", "Superseded", "Deleted"],
  AssessmentAssignment: ["Draft", "Assigned", "Started", "Submitted", "Under review", "Completed", "Expired", "Canceled"],
  AvailabilityWindow: ["Draft", "Active", "Used", "Expired", "Revoked", "Superseded"],
  SchedulingRequest: ["Draft", "Sent", "Opened", "Availability submitted", "Booked", "Expired", "Canceled", "Superseded", "Failed"],
  InterviewSession: ["Draft", "Availability pending", "Proposed", "Tentative", "Confirmed", "Completed", "Rescheduled", "Canceled", "No-show"],
  InterviewerAssignment: ["Assigned", "Acknowledged", "Declined", "Reassigned", "Evidence due", "Completed", "Waived", "Expired"],
  Scorecard: ["Draft", "Saved", "Submitted", "Locked", "Amendment requested", "Amended", "Superseded"],
  Decision: ["Draft", "Ready", "Recorded", "Corrected", "Superseded", "Voided by authorized exception"],
  Disposition: ["Proposed", "Recorded", "Communication pending", "Communicated", "Corrected", "Reopened by exception"],
  Offer: ["Draft", "Pending approval", "Approved", "Extended", "Viewed", "Accepted", "Declined", "Expired", "Withdrawn", "Rescinded", "Superseded"],
  OfferVersion: ["Draft", "Submitted", "Approved", "Actionable", "Superseded", "Expired", "Withdrawn"],
  OfferResponse: ["Available", "Viewed", "Accepted", "Declined", "Expired", "Invalidated", "Reconciled"],
  ContingencyCase: ["Not required", "Awaiting authorization", "Ordered", "Pending", "Review required", "Cleared", "Failed", "Waived", "Canceled"],
  OpeningReservation: ["Requested", "Acquired", "Conflict", "Released", "Expired", "Converted to fill"],
  HireHandoff: ["Not ready", "Ready", "Queued", "Sent", "Acknowledged", "Completed", "Failed", "Correction required", "Canceled"],
  RecruitingWorkItem: ["Open", "In progress", "Blocked", "Completed", "Canceled", "Superseded"],
  Message: ["Draft", "Eligibility checked", "Scheduled", "Queued", "Sent", "Delivered", "Failed", "Suppressed", "Canceled", "Replied", "Expired"],
  PrivacyRequest: ["Received", "Identity verification", "Scoped", "Review", "Approved", "Executing", "Reconciling", "Completed", "Denied", "Closed"],
  AccommodationRequest: ["Received", "Triage", "Information needed", "Approved", "Alternative provided", "Implemented", "Closed", "Withdrawn"],
  IntegrationEvent: ["Received", "Rejected", "Accepted", "Processing", "Applied", "Reconciled", "Retry scheduled", "Dead letter", "Ignored duplicate"],
};

function lifecycleTypeFor(name: string): LifecycleType {
  if (["DecisionReadinessSnapshot", "OperationalViewDefinition", "SchedulingConstraint/Proposal", "CalendarProjection", "Task/EventProjection", "Notification", "PolicyEvaluationSnapshot", "ReconciliationCheckpoint"].includes(name)) return "Derived snapshot / projection";
  if (["ApplicationAnswer", "AssessmentSubmission", "ApprovalAttempt/Decision", "OfferApproval", "OfferResponse", "DeliveryEvent", "AuditEvent", "IntegrationEvent", "DeliveryAttempt"].includes(name)) return "Append-only evidence";
  if (name.includes("Version") || name.includes("Definition") || name.includes("Template") || ["Role", "Permission", "CompetencyCoverage", "TransitionContract", "JurisdictionRule", "AutomatedDecisionSystemRegistry", "RetentionRule"].includes(name)) return "Versioned configuration";
  if (["Organization", "Team", "Department", "JobLocation", "Tag", "Source", "Competency", "InterviewerPool/Membership", "InterviewerQualification", "RoomResource", "CommunicationPreference/Suppression", "IntegrationSubscription"].includes(name)) return "Reference / master data";
  return "Stateful business record";
}

function statesFor(name: string, type: LifecycleType) {
  if (explicitStates[name]) return explicitStates[name];
  if (type === "Versioned configuration") return ["Draft", "Validation failed", "In review", "Approved", "Active", "Superseded", "Retired"];
  if (type === "Append-only evidence") return ["Created", "Validated", "Applied", "Corrected by compensating record", "Retained", "Archived"];
  if (type === "Derived snapshot / projection") return ["Pending", "Current", "Stale", "Invalidated", "Recalculated", "Archived"];
  if (type === "Reference / master data") return ["Proposed", "Active", "Inactive", "Retired"];
  return ["Draft", "Open", "In progress", "Blocked", "Completed", "Canceled", "Archived"];
}

function commandsFor(type: LifecycleType) {
  if (type === "Versioned configuration") return ["Create draft", "Validate", "Submit for review", "Approve", "Activate", "Supersede", "Retire"];
  if (type === "Append-only evidence") return ["Create", "Validate", "Apply once", "Correct with compensating record", "Archive"];
  if (type === "Derived snapshot / projection") return ["Calculate", "Invalidate", "Recalculate", "Reconcile", "Archive"];
  if (type === "Reference / master data") return ["Create", "Activate", "Update nonmaterial attributes", "Deactivate", "Retire"];
  return ["Create", "Update while permitted", "Transition", "Block/unblock", "Cancel", "Correct by version", "Archive"];
}

function dataPointsFor(objectId: string, type: LifecycleType, classification: string, source: string): ObjectDataPoint[] {
  const shared = [
    ["stable_id", "Stable opaque identifier", "ID", "Create", source, "Must be unique, nonsequential and immutable"],
    ["parent_reference", "Authoritative parent/reference", "Reference", "Create when relationship applies", source, "Must resolve to an authorized non-orphan record"],
    ["lifecycle_state", "Lifecycle state", "Controlled enum", "Every active record", "Canonical service", "Must be one allowed state and follow the transition matrix"],
    ["business_version", "Business/concurrency version", "Integer or opaque token", "Create and every mutation", "Canonical service", "Must increase exactly once per accepted mutation"],
    ["source_provenance", "Source system, channel and actor", "Structured provenance", "Create", source, "Actor, authority and source cannot be blank or inferred from display text"],
    ["effective_time", "Occurred/effective and observed time", "ISO datetime + timezone", "Create or activation", source, "Timezone and occurred-versus-observed semantics must be explicit"],
    ["classification", "Data classification and purpose", "Controlled enum", "Create", "Policy service", "Must map to an approved DAT purpose and field-access policy"],
    ["retention_class", "Retention, hold and archive class", "Controlled reference", "Create", "Privacy lifecycle service", "Must have an effective rule and legal-hold behavior"],
    ["owner_or_service", "Accountable owner or creating service", "User/queue/service reference", "When actionable", source, "Active records cannot be unowned when an action or SLA exists"],
    ["evidence_fingerprint", "Evidence/source fingerprint", "SHA-256 or deterministic hash", type === "Reference / master data" ? "Material change" : "Consequential state", "Canonical service", "Must change when any declared material input changes"],
  ] as const;
  return shared.map(([key, label, fieldType, requiredWhen, fieldSource, qualityRule], index) => ({
    id: `FLD-${objectId.slice(4)}-${String(index + 1).padStart(2, "0")}`,
    key,
    label,
    type: fieldType,
    requiredWhen,
    source: fieldSource,
    classification,
    qualityRule,
  }));
}

function relationshipsFor(name: string, fallbacks: readonly string[]) {
  const special: Record<string, string[]> = {
    CandidateIdentity: ["Many identity subjects may verify one Candidate", "Revocation never deletes the Candidate or its applications"],
    Application: ["Exactly one Candidate and one Requisition", "One originating posting version when submitted through the portal"],
    ApplicationAttempt: ["Exactly one Application aggregate", "Attempt number is immutable and unique within candidate/requisition policy"],
    InterviewSession: ["Exactly one Application and one interview-plan activity", "Former-session relation preserves reschedule lineage"],
    Scorecard: ["Exactly one InterviewerAssignment", "Original submitted version remains after amendment"],
    OfferVersion: ["Exactly one Offer and Application", "Only one version may be current and actionable"],
    OpeningReservation: ["Exactly one current OfferVersion, Application and PositionOpening", "At most one active reservation per opening and application"],
    HireHandoff: ["Exactly one Application, accepted OfferVersion and PositionOpening", "Only acknowledged exact payload may complete and fill"],
    RecruitingWorkItem: ["Exactly one authoritative source fact/rule and typed related record", "Task/Event may project it but never replace its state"],
    Message: ["One registered COM purpose and related business version", "Recipient, template and eligibility versions are pinned at send"],
    PrivacyRequest: ["One verified candidate/requester scope with many system execution targets", "Request identity evidence remains outside hiring views"],
    IntegrationEvent: ["One registered subscription and aggregate version", "May trigger many idempotent actions but applies each effect once"],
  };
  return special[name] ?? [...fallbacks];
}

function dataQualityFor(type: LifecycleType) {
  const rules = ["Stable ID, owner/source and DAT mapping are present", "Relationships are authorized and non-orphaned", "Classification, retention and legal-hold rule are effective"];
  if (type === "Versioned configuration") rules.push("Exactly one effective active version exists for the selected scope");
  if (type === "Append-only evidence") rules.push("Corrections preserve the original and use a compensating record");
  if (type === "Derived snapshot / projection") rules.push("Source fingerprint, calculation time and freshness reconcile to canonical facts");
  if (type === "Stateful business record") rules.push("State/version combination is reachable through an allowed transition");
  return rules;
}

let objectIndex = 0;
export const objectCatalog: ObjectContract[] = domains.flatMap((domain) => domain.objects.map((name) => {
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
    dataPoints: dataPointsFor(id, lifecycleType, domain.classification, domain.source),
  };
}));

export const objectDomains = domains.map((domain) => domain.name);
export const lifecycleTypes: LifecycleType[] = ["Stateful business record", "Versioned configuration", "Append-only evidence", "Derived snapshot / projection", "Reference / master data"];
export const objectCatalogSummary = {
  families: objectCatalog.length,
  expandedConcepts: 111,
  logicalDataGroups: new Set(objectCatalog.flatMap((item) => item.dataGroups)).size,
  minimumDataPoints: objectCatalog.reduce((sum, item) => sum + item.dataPoints.length, 0),
  lifecycleClassified: objectCatalog.filter((item) => item.states.length > 0).length,
  commandClassified: objectCatalog.filter((item) => item.commands.length > 0).length,
  relationshipClassified: objectCatalog.filter((item) => item.relationships.length > 0).length,
};
