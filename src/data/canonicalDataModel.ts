import { objectCatalog, type ObjectContract } from "./objectCatalog";

export type ConceptKind =
  | "Canonical entity"
  | "Child entity"
  | "Junction"
  | "Immutable version"
  | "Append-only event"
  | "Derived snapshot"
  | "Configuration metadata"
  | "External reference"
  | "Read-model projection";

export type PersistenceTarget =
  | "Salesforce standard/platform"
  | "Salesforce custom object"
  | "Salesforce custom metadata"
  | "External private file service"
  | "Event stream and audit archive"
  | "BFF read model"
  | "Embedded value object";

export type FieldDataType =
  | "ID"
  | "Text"
  | "Long text"
  | "Integer"
  | "Decimal"
  | "Boolean"
  | "Date"
  | "Datetime"
  | "Controlled enum"
  | "Reference"
  | "Version reference"
  | "Currency"
  | "JSON"
  | "Hash"
  | "Email"
  | "Phone"
  | "Timezone"
  | "Locale"
  | "Country code";

export type AtomicFieldContract = {
  id: string;
  conceptId: string;
  key: string;
  label: string;
  category: "Business" | "Governance";
  dataType: FieldDataType;
  businessDefinition: string;
  nullable: boolean;
  nullMeaning: string;
  requiredWhen: string;
  defaultValue: string | number | boolean | null;
  allowedValues: string[];
  unit: string | null;
  source: string;
  authority: string;
  provenance: "Captured" | "Authoritative" | "Copied snapshot" | "Derived";
  classification: string;
  encryption: "Required" | "Evaluate" | "Not required";
  masking: string;
  readRoles: string[];
  writeRoles: string[];
  validation: string;
  retentionClass: string;
  legalHoldBehavior: string;
  history: string;
  indexed: boolean;
  uniqueGroup: string | null;
  referenceTarget: string | null;
  effectiveDated: boolean;
  salesforceField: string;
  apiField: string;
  reportingUse: string;
};

export type AtomicConceptContract = {
  id: string;
  name: string;
  familyId: string;
  familyName: string;
  domain: string;
  inherited: boolean;
  kind: ConceptKind;
  grain: string;
  persistenceTarget: PersistenceTarget;
  physicalDisposition: string;
  proposedApiName: string;
  approvalStatus: "Proposed — accountable approval required";
  systemOfRecord: string;
  owner: string;
  tenantScoped: boolean;
  classification: string;
  retention: string;
  fields: AtomicFieldContract[];
  stateVocabulary: string[];
};

export type Cardinality =
  | "one-to-one"
  | "one-to-zero-or-one"
  | "one-to-many"
  | "many-to-one"
  | "many-to-many-through-junction";

export type RelationshipContract = {
  id: string;
  from: string;
  field: string;
  to: string;
  cardinality: Cardinality;
  required: boolean;
  deleteBehavior: "Protect" | "Restrict while active" | "Archive child" | "Controlled cascade";
  ownership: "Independent" | "Inherited access" | "Junction controlled" | "Projection only";
  temporalRule: string;
  invariant: string;
};

export type InvariantContract = {
  id: string;
  name: string;
  severity: "Blocker" | "High";
  expression: string;
  enforcement: string[];
  evidence: string;
};

export type TransitionContract = {
  id: string;
  concept: string;
  from: string;
  to: string;
  command: string;
  permission: string;
  guard: string;
  reasonRequired: boolean;
  sideEffects: string[];
  candidateCommunication: string;
  event: string;
  idempotencyScope: string;
  failureRecovery: string;
};

export type DomainEventContract = {
  name: string;
  version: number;
  aggregate: string;
  semanticTrigger: string;
  requiredFields: string[];
  prohibitedFields: string[];
  consumers: string[];
  retention: string;
};

export type RoleSecurityPolicy = {
  role: string;
  purposes: string[];
  rowRelationships: string[];
  fieldEntitlements: string[];
  deniedCategories: string[];
  temporalRule: string;
  exportPolicy: string;
  breakGlass: string;
};

export type AnalyticsContract = {
  name: string;
  kind: "Fact" | "Dimension";
  grain: string;
  sourceEvents: string[];
  keys: string[];
  measures: string[];
  lateArrivalRule: string;
  restatementRule: string;
  security: string;
};

type FieldSeed = readonly [
  key: string,
  dataType: FieldDataType,
  requiredWhen?: string,
];

const expansionByFamily: Record<string, string[]> = {
  "HiringPlan/Version": ["HiringPlan", "HiringPlanVersion"],
  "ProcessTemplate/Version": ["ProcessTemplate", "ProcessTemplateVersion"],
  "StageDefinition/Mapping": ["StageDefinition", "StageMapping"],
  "Consent/AuthorizationRecord": ["Consent", "AuthorizationRecord"],
  "Resume/FileAsset": ["Resume", "FileAsset"],
  "AssessmentDefinition/Version": ["AssessmentDefinition", "AssessmentVersion"],
  "Rubric/Version": ["Rubric", "RubricVersion"],
  "InterviewerPool/Membership": ["InterviewerPool", "InterviewerPoolMembership"],
  "SchedulingConstraint/Proposal": ["SchedulingConstraint", "SchedulingProposal"],
  "ApprovalPolicy/Version/Process/Step": [
    "ApprovalPolicy",
    "ApprovalPolicyVersion",
    "ApprovalProcess",
    "ApprovalStep",
  ],
  "ApprovalAttempt/Decision": ["ApprovalAttempt", "ApprovalDecision"],
  "Task/EventProjection": ["Task", "EventProjection"],
  "AutomationRule/Version": ["AutomationRule", "AutomationRuleVersion"],
  "AutomationExecution/Action": ["AutomationExecution", "AutomationAction"],
  "CommunicationPreference/Suppression": ["CommunicationPreference", "Suppression"],
  "CandidateExperienceSurvey/Version/Response": [
    "CandidateExperienceSurvey",
    "CandidateExperienceSurveyVersion",
    "CandidateExperienceSurveyResponse",
  ],
};

const supportingConceptFamilies: Record<string, string> = {
  HiringTeamMembership: "Team",
  PostingChannel: "JobPosting",
  ApplicationSubmission: "ApplicationAttempt",
  ApplicationStageEvent: "Application",
  ScorecardResponse: "Scorecard",
  ReferenceCheck: "ContingencyCase",
  BackgroundCheck: "ContingencyCase",
  AdverseActionCase: "ContingencyCase",
  RestrictedHRCase: "AccommodationRequest",
  RetentionExecution: "RetentionRule",
  AccessGrant: "Permission",
  DelegationGrant: "Permission",
  BreakGlassGrant: "Permission",
  CandidateIdentifier: "CandidateIdentity",
  CandidateDuplicateCase: "CandidateIdentity",
  DataQualityIssue: "AuditEvent",
  SchemaVersion: "IntegrationSubscription",
  MigrationMapping: "IntegrationSubscription",
};

const businessFieldSeeds: Record<string, FieldSeed[]> = {
  Organization: [["legal_name", "Text"], ["organization_code", "Text"], ["controller_country", "Country code"], ["operating_status", "Controlled enum"]],
  User: [["workforce_subject_id", "Text"], ["display_name", "Text"], ["primary_email", "Email"], ["identity_status", "Controlled enum"]],
  Role: [["role_code", "Text"], ["role_name", "Text"], ["authority_scope", "Controlled enum"], ["review_cadence_days", "Integer"]],
  Permission: [["permission_code", "Text"], ["resource", "Text"], ["action", "Controlled enum"], ["restricted_entitlement", "Boolean"]],
  Team: [["team_name", "Text"], ["team_type", "Controlled enum"], ["manager_id", "Reference"], ["effective_from", "Date"]],
  Department: [["department_code", "Text"], ["department_name", "Text"], ["cost_center_code", "Text"], ["parent_department_id", "Reference", "When nested"]],
  Requisition: [["business_title", "Text"], ["business_reason", "Long text"], ["department_id", "Reference"], ["hiring_manager_id", "Reference"], ["approved_headcount", "Integer"], ["target_start_date", "Date"]],
  RequisitionApproval: [["requisition_id", "Reference"], ["subject_version", "Version reference"], ["approver_id", "Reference"], ["decision", "Controlled enum", "On response"], ["decided_at", "Datetime", "On response"]],
  PositionOpening: [["requisition_id", "Reference"], ["opening_number", "Integer"], ["budget_reference", "Text"], ["opening_status", "Controlled enum"], ["filled_application_id", "Reference", "When filled"]],
  JobPosting: [["requisition_id", "Reference"], ["canonical_slug", "Text"], ["current_version_id", "Version reference"], ["publication_state", "Controlled enum"], ["expires_at", "Datetime", "When time bounded"]],
  JobPostingVersion: [["job_posting_id", "Reference"], ["version_number", "Integer"], ["candidate_safe_title", "Text"], ["description_html", "Long text"], ["compensation_min", "Currency"], ["compensation_max", "Currency"], ["currency_code", "Text"]],
  JobLocation: [["requisition_id", "Reference"], ["country_code", "Country code"], ["region_code", "Text"], ["city", "Text"], ["workplace_mode", "Controlled enum"], ["timezone", "Timezone"]],
  HiringPlan: [["requisition_id", "Reference"], ["current_version_id", "Version reference"], ["readiness_state", "Controlled enum"], ["plan_owner_id", "Reference"]],
  HiringPlanVersion: [["hiring_plan_id", "Reference"], ["version_number", "Integer"], ["business_outcomes", "JSON"], ["evidence_coverage", "JSON"], ["approved_at", "Datetime", "When approved"]],
  CompetencyCoverage: [["hiring_plan_version_id", "Version reference"], ["competency_id", "Reference"], ["evidence_source", "Controlled enum"], ["required_count", "Integer"]],
  ProcessTemplate: [["template_code", "Text"], ["template_name", "Text"], ["current_version_id", "Version reference"], ["template_scope", "Controlled enum"]],
  ProcessTemplateVersion: [["process_template_id", "Reference"], ["version_number", "Integer"], ["effective_from", "Datetime"], ["stage_sequence", "JSON"], ["approval_state", "Controlled enum"]],
  StageDefinition: [["process_template_version_id", "Version reference"], ["stage_code", "Text"], ["stage_label", "Text"], ["sequence_number", "Integer"], ["milestone", "Controlled enum"]],
  StageMapping: [["stage_definition_id", "Reference"], ["candidate_status_code", "Text"], ["reporting_phase", "Controlled enum"], ["effective_from", "Datetime"]],
  TransitionContract: [["source_stage_id", "Reference"], ["destination_stage_id", "Reference"], ["required_permission", "Text"], ["guard_expression", "JSON"], ["side_effect_plan", "JSON"], ["recovery_policy", "JSON"]],
  DecisionReadinessSnapshot: [["application_id", "Reference"], ["plan_version_id", "Version reference"], ["readiness_result", "Controlled enum"], ["blockers", "JSON"], ["calculated_at", "Datetime"], ["source_fingerprint", "Hash"]],
  OperationalViewDefinition: [["view_code", "Text"], ["persona_code", "Text"], ["filter_contract", "JSON"], ["sort_contract", "JSON"], ["column_contract", "JSON"]],
  Candidate: [["preferred_name", "Text"], ["legal_name", "Text", "When legally required"], ["locale", "Locale"], ["timezone", "Timezone"], ["duplicate_review_state", "Controlled enum"]],
  CandidateIdentity: [["candidate_id", "Reference"], ["provider", "Text"], ["provider_subject", "Text"], ["verification_state", "Controlled enum"], ["verified_at", "Datetime", "When verified"], ["revoked_at", "Datetime", "When revoked"]],
  Application: [["candidate_id", "Reference"], ["requisition_id", "Reference"], ["originating_posting_version_id", "Version reference", "Portal submission"], ["attempt_number", "Integer"], ["process_template_version_id", "Version reference"], ["owner_id", "Reference"], ["submitted_at", "Datetime", "When submitted"], ["terminal_disposition_id", "Reference", "When terminal"]],
  ApplicationAttempt: [["application_id", "Reference"], ["attempt_number", "Integer"], ["started_at", "Datetime"], ["submission_id", "Reference", "When submitted"], ["attempt_state", "Controlled enum"]],
  ApplicationTemplateVersion: [["template_code", "Text"], ["version_number", "Integer"], ["question_sequence", "JSON"], ["effective_from", "Datetime"], ["notice_version", "Version reference"]],
  QuestionDefinition: [["application_template_version_id", "Version reference"], ["question_code", "Text"], ["candidate_prompt", "Long text"], ["answer_type", "Controlled enum"], ["conditional_rule", "JSON", "When conditional"]],
  ApplicationAnswer: [["submission_id", "Reference"], ["question_definition_id", "Reference"], ["answer_value", "JSON"], ["answer_hash", "Hash"], ["answered_at", "Datetime"]],
  Consent: [["candidate_id", "Reference"], ["purpose_code", "Text"], ["notice_version", "Version reference"], ["choice", "Controlled enum"], ["captured_at", "Datetime"], ["revoked_at", "Datetime", "When revoked"]],
  AuthorizationRecord: [["candidate_id", "Reference"], ["authorization_type", "Controlled enum"], ["policy_version", "Version reference"], ["evidence_reference", "Text"], ["authorized_at", "Datetime"], ["expires_at", "Datetime", "When expiring"]],
  Resume: [["candidate_id", "Reference"], ["application_id", "Reference", "When application scoped"], ["file_asset_id", "Reference"], ["resume_version", "Integer"], ["candidate_confirmed_at", "Datetime"]],
  FileAsset: [["provider_key", "Text"], ["file_hash", "Hash"], ["mime_type", "Text"], ["size_bytes", "Integer"], ["scan_state", "Controlled enum"], ["file_version", "Integer"]],
  SavedJob: [["candidate_id", "Reference"], ["job_posting_id", "Reference"], ["saved_at", "Datetime"], ["expires_at", "Datetime", "When expiring"]],
  JobAlert: [["candidate_id", "Reference"], ["criteria", "JSON"], ["cadence", "Controlled enum"], ["channel", "Controlled enum"], ["next_run_at", "Datetime"]],
  TalentPool: [["pool_name", "Text"], ["purpose_code", "Text"], ["owner_id", "Reference"], ["membership_expiry_days", "Integer"]],
  TalentPoolMembership: [["talent_pool_id", "Reference"], ["candidate_id", "Reference"], ["authority_basis", "Text"], ["joined_at", "Datetime"], ["expires_at", "Datetime"]],
  Tag: [["tag_code", "Text"], ["tag_label", "Text"], ["tag_scope", "Controlled enum"], ["decision_use_allowed", "Boolean"]],
  Source: [["source_code", "Text"], ["source_name", "Text"], ["source_category", "Controlled enum"], ["active_from", "Date"]],
  SourceAttribution: [["application_id", "Reference"], ["source_id", "Reference"], ["campaign_code", "Text", "When supplied"], ["attribution_order", "Integer"], ["captured_at", "Datetime"]],
  Referral: [["candidate_id", "Reference"], ["requisition_id", "Reference"], ["referrer_id", "Reference"], ["relationship_disclosure", "Text"], ["referred_at", "Datetime"]],
  AgencySubmission: [["candidate_id", "Reference"], ["requisition_id", "Reference"], ["agency_reference", "Text"], ["supplier_submission_id", "Text"], ["submitted_at", "Datetime"]],
  Screen: [["application_id", "Reference"], ["rubric_version_id", "Version reference"], ["screener_id", "Reference"], ["evidence_summary", "Long text"], ["screen_outcome", "Controlled enum"], ["submitted_at", "Datetime"]],
  AssessmentDefinition: [["assessment_code", "Text"], ["assessment_name", "Text"], ["purpose", "Long text"], ["provider_reference", "Text", "When external"]],
  AssessmentVersion: [["assessment_definition_id", "Reference"], ["version_number", "Integer"], ["instructions", "Long text"], ["rubric_version_id", "Version reference"], ["approved_at", "Datetime"]],
  AssessmentAssignment: [["application_id", "Reference"], ["assessment_version_id", "Version reference"], ["due_at", "Datetime"], ["accommodation_safe_state", "Controlled enum"], ["assignment_state", "Controlled enum"]],
  AssessmentSubmission: [["assessment_assignment_id", "Reference"], ["submitted_at", "Datetime"], ["provider_result_reference", "Text", "When external"], ["evidence_summary", "Long text"], ["review_state", "Controlled enum"]],
  Rubric: [["rubric_code", "Text"], ["rubric_name", "Text"], ["owner_id", "Reference"], ["current_version_id", "Version reference"]],
  RubricVersion: [["rubric_id", "Reference"], ["version_number", "Integer"], ["criteria", "JSON"], ["rating_anchors", "JSON"], ["approved_at", "Datetime"]],
  Competency: [["competency_code", "Text"], ["competency_name", "Text"], ["job_related_definition", "Long text"], ["evidence_guidance", "Long text"]],
  InterviewPlan: [["application_id", "Reference"], ["hiring_plan_version_id", "Version reference"], ["plan_state", "Controlled enum"], ["current_round_id", "Reference", "When active"]],
  InterviewRound: [["interview_plan_id", "Reference"], ["round_code", "Text"], ["sequence_number", "Integer"], ["entry_criteria", "JSON"], ["exit_criteria", "JSON"]],
  AvailabilityWindow: [["subject_id", "Reference"], ["start_at", "Datetime"], ["end_at", "Datetime"], ["timezone", "Timezone"], ["availability_state", "Controlled enum"]],
  SchedulingRequest: [["application_id", "Reference"], ["request_type", "Controlled enum"], ["token_hash", "Hash", "Candidate self-schedule"], ["valid_until", "Datetime"], ["request_state", "Controlled enum"]],
  InterviewSession: [["application_id", "Reference"], ["interview_round_id", "Reference"], ["session_type", "Controlled enum"], ["start_at", "Datetime", "When confirmed"], ["duration_minutes", "Integer"], ["session_state", "Controlled enum"]],
  InterviewerRoleSlot: [["interview_round_id", "Reference"], ["role_code", "Text"], ["required_count", "Integer"], ["qualification_rule", "JSON"]],
  InterviewerPool: [["pool_name", "Text"], ["role_code", "Text"], ["load_policy", "JSON"], ["owner_id", "Reference"]],
  InterviewerPoolMembership: [["interviewer_pool_id", "Reference"], ["user_id", "Reference"], ["effective_from", "Datetime"], ["effective_to", "Datetime", "When time bounded"]],
  InterviewerQualification: [["user_id", "Reference"], ["qualification_code", "Text"], ["valid_from", "Datetime"], ["valid_until", "Datetime"], ["evidence_reference", "Text"]],
  SchedulingConstraint: [["constraint_code", "Text"], ["constraint_type", "Controlled enum"], ["constraint_expression", "JSON"], ["hard_constraint", "Boolean"], ["effective_from", "Datetime"]],
  SchedulingProposal: [["scheduling_request_id", "Reference"], ["participant_ids", "JSON"], ["start_at", "Datetime"], ["valid_until", "Datetime"], ["validity_explanation", "Long text"]],
  RoomResource: [["resource_code", "Text"], ["resource_name", "Text"], ["timezone", "Timezone"], ["capacity", "Integer"], ["availability_source", "Text"]],
  CalendarProjection: [["interview_session_id", "Reference"], ["provider_event_id", "Text"], ["provider_version", "Text"], ["invite_hash", "Hash"], ["sync_state", "Controlled enum"]],
  InterviewerAssignment: [["interview_session_id", "Reference"], ["user_id", "Reference"], ["role_slot_id", "Reference"], ["access_starts_at", "Datetime"], ["access_ends_at", "Datetime"], ["assignment_state", "Controlled enum"]],
  Scorecard: [["interviewer_assignment_id", "Reference"], ["rubric_version_id", "Version reference"], ["recommendation", "Controlled enum", "On submission"], ["submitted_at", "Datetime", "On submission"], ["locked_at", "Datetime", "On submission"]],
  Decision: [["application_id", "Reference"], ["readiness_snapshot_id", "Reference"], ["decision_maker_id", "Reference"], ["outcome", "Controlled enum"], ["rationale", "Long text"], ["decided_at", "Datetime"]],
  Disposition: [["application_id", "Reference"], ["disposition_code", "Text"], ["reason_code", "Text"], ["candidate_safe_status", "Text"], ["effective_at", "Datetime"]],
  ApprovalPolicy: [["policy_code", "Text"], ["policy_name", "Text"], ["subject_type", "Controlled enum"], ["current_version_id", "Version reference"]],
  ApprovalPolicyVersion: [["approval_policy_id", "Reference"], ["version_number", "Integer"], ["scope_expression", "JSON"], ["effective_from", "Datetime"], ["effective_to", "Datetime", "When superseded"]],
  ApprovalProcess: [["approval_policy_version_id", "Version reference"], ["process_code", "Text"], ["selection_priority", "Integer"], ["quorum_rule", "JSON"]],
  ApprovalStep: [["approval_process_id", "Reference"], ["sequence_number", "Integer"], ["approver_selector", "JSON"], ["decision_rule", "Controlled enum"], ["due_duration_hours", "Integer"]],
  ApprovalAttempt: [["subject_id", "Reference"], ["subject_version", "Version reference"], ["approval_process_id", "Reference"], ["subject_fingerprint", "Hash"], ["attempt_state", "Controlled enum"]],
  ApprovalDecision: [["approval_attempt_id", "Reference"], ["approval_step_id", "Reference"], ["approver_id", "Reference"], ["decision", "Controlled enum"], ["reason", "Long text", "On reject/send back"], ["decided_at", "Datetime"]],
  Offer: [["application_id", "Reference"], ["offer_number", "Integer"], ["current_version_id", "Version reference"], ["offer_state", "Controlled enum"]],
  OfferVersion: [["offer_id", "Reference"], ["version_number", "Integer"], ["title", "Text"], ["compensation_components", "JSON"], ["currency_code", "Text"], ["start_date", "Date"], ["expires_at", "Datetime"], ["document_hash", "Hash"]],
  OfferApproval: [["offer_version_id", "Version reference"], ["approval_attempt_id", "Reference"], ["approval_state", "Controlled enum"], ["completed_at", "Datetime", "When completed"]],
  OfferResponse: [["offer_version_id", "Version reference"], ["candidate_id", "Reference"], ["response", "Controlled enum"], ["responded_at", "Datetime"], ["response_evidence_hash", "Hash"]],
  ContingencyCase: [["application_id", "Reference"], ["case_type", "Controlled enum"], ["policy_evaluation_id", "Reference"], ["case_state", "Controlled enum"], ["due_at", "Datetime"], ["resolution", "Controlled enum", "On resolution"]],
  OpeningReservation: [["position_opening_id", "Reference"], ["application_id", "Reference"], ["offer_version_id", "Version reference"], ["reservation_state", "Controlled enum"], ["expires_at", "Datetime"]],
  HireHandoff: [["application_id", "Reference"], ["position_opening_id", "Reference"], ["offer_version_id", "Version reference"], ["payload_hash", "Hash"], ["destination_system", "Text"], ["acknowledgement_state", "Controlled enum"]],
  RecruitingWorkItem: [["subject_id", "Reference"], ["work_type", "Controlled enum"], ["owner_id", "Reference"], ["due_at", "Datetime"], ["sla_state", "Controlled enum"], ["work_state", "Controlled enum"]],
  Task: [["work_item_id", "Reference"], ["salesforce_task_id", "Text"], ["projection_state", "Controlled enum"], ["projected_at", "Datetime"]],
  EventProjection: [["interview_session_id", "Reference"], ["salesforce_event_id", "Text"], ["projection_version", "Integer"], ["projection_state", "Controlled enum"]],
  AutomationRule: [["rule_code", "Text"], ["rule_name", "Text"], ["purpose", "Long text"], ["current_version_id", "Version reference"]],
  AutomationRuleVersion: [["automation_rule_id", "Reference"], ["version_number", "Integer"], ["trigger_event", "Text"], ["condition_tree", "JSON"], ["action_plan", "JSON"], ["effective_from", "Datetime"]],
  AutomationExecution: [["automation_rule_version_id", "Version reference"], ["trigger_event_id", "Text"], ["target_id", "Reference"], ["idempotency_key", "Text"], ["execution_state", "Controlled enum"], ["planned_at", "Datetime"]],
  AutomationAction: [["automation_execution_id", "Reference"], ["ordinal", "Integer"], ["action_type", "Controlled enum"], ["side_effect_key", "Text"], ["action_state", "Controlled enum"], ["result_reference", "Text", "When completed"]],
  Message: [["application_id", "Reference"], ["purpose_code", "Text"], ["recipient_reference", "Reference"], ["template_version", "Version reference"], ["channel", "Controlled enum"], ["send_state", "Controlled enum"]],
  MessageTemplate: [["template_code", "Text"], ["purpose_code", "Text"], ["locale", "Locale"], ["version_number", "Integer"], ["content_hash", "Hash"]],
  DeliveryEvent: [["message_id", "Reference"], ["provider_event_id", "Text"], ["event_type", "Controlled enum"], ["occurred_at", "Datetime"], ["provider_status", "Text"]],
  Notification: [["user_id", "Reference"], ["work_item_id", "Reference"], ["notification_type", "Controlled enum"], ["delivered_at", "Datetime", "When delivered"], ["read_at", "Datetime", "When read"]],
  CommunicationPreference: [["candidate_id", "Reference"], ["purpose_code", "Text"], ["channel", "Controlled enum"], ["preference", "Controlled enum"], ["effective_from", "Datetime"]],
  Suppression: [["candidate_id", "Reference"], ["purpose_code", "Text"], ["channel", "Controlled enum"], ["suppression_reason", "Controlled enum"], ["effective_from", "Datetime"], ["effective_to", "Datetime", "When released"]],
  JurisdictionRule: [["rule_code", "Text"], ["jurisdiction_scope", "JSON"], ["action_type", "Controlled enum"], ["rule_expression", "JSON"], ["effective_from", "Datetime"], ["effective_to", "Datetime", "When superseded"]],
  PolicyEvaluationSnapshot: [["subject_id", "Reference"], ["action_type", "Controlled enum"], ["matched_rule_versions", "JSON"], ["evaluation_result", "Controlled enum"], ["evaluated_at", "Datetime"], ["facts_hash", "Hash"]],
  AutomatedDecisionSystemRegistry: [["system_code", "Text"], ["provider", "Text"], ["purpose", "Long text"], ["input_categories", "JSON"], ["approval_state", "Controlled enum"], ["kill_switch_state", "Controlled enum"]],
  SelectionProcedureVersion: [["procedure_code", "Text"], ["version_number", "Integer"], ["job_related_purpose", "Long text"], ["validation_evidence", "Text"], ["effective_from", "Datetime"], ["approval_state", "Controlled enum"]],
  CandidateExperienceSurvey: [["survey_code", "Text"], ["purpose", "Long text"], ["current_version_id", "Version reference"], ["eligibility_rule", "JSON"]],
  CandidateExperienceSurveyVersion: [["survey_id", "Reference"], ["version_number", "Integer"], ["question_set", "JSON"], ["effective_from", "Datetime"], ["consent_text_version", "Version reference"]],
  CandidateExperienceSurveyResponse: [["survey_version_id", "Version reference"], ["application_id", "Reference"], ["pseudonymous_subject", "Text"], ["rating", "Integer"], ["free_text_reference", "Text", "When supplied"], ["submitted_at", "Datetime"]],
  ServiceRecoveryCase: [["application_id", "Reference"], ["survey_response_id", "Reference", "When survey triggered"], ["case_type", "Controlled enum"], ["owner_id", "Reference"], ["case_state", "Controlled enum"], ["closed_at", "Datetime", "When closed"]],
  ApplicationIntegrityCase: [["application_id", "Reference"], ["signal_provenance", "JSON"], ["reviewer_id", "Reference"], ["review_state", "Controlled enum"], ["redress_state", "Controlled enum"], ["human_outcome", "Controlled enum", "On closure"]],
  AccommodationRequest: [["candidate_id", "Reference"], ["application_id", "Reference", "When application scoped"], ["request_type", "Controlled enum"], ["logistics_projection", "Text"], ["restricted_case_id", "Reference"], ["request_state", "Controlled enum"]],
  PrivacyRequest: [["candidate_id", "Reference"], ["request_type", "Controlled enum"], ["verification_state", "Controlled enum"], ["execution_scope", "JSON"], ["due_at", "Datetime"], ["request_state", "Controlled enum"]],
  RetentionRule: [["rule_code", "Text"], ["record_scope", "JSON"], ["retention_duration_days", "Integer"], ["trigger_event", "Text"], ["action", "Controlled enum"], ["effective_from", "Datetime"]],
  LegalHold: [["subject_scope", "JSON"], ["hold_reason", "Long text"], ["authorized_by_id", "Reference"], ["effective_from", "Datetime"], ["released_at", "Datetime", "When released"]],
  AuditEvent: [["actor_id", "Reference"], ["actor_type", "Controlled enum"], ["target_id", "Reference"], ["action", "Text"], ["result", "Controlled enum"], ["correlation_id", "Text"], ["occurred_at", "Datetime"]],
  IntegrationSubscription: [["interface_code", "Text"], ["provider", "Text"], ["event_types", "JSON"], ["schema_version", "Text"], ["subscription_state", "Controlled enum"]],
  IntegrationEvent: [["subscription_id", "Reference"], ["external_event_id", "Text"], ["aggregate_id", "Reference"], ["aggregate_version", "Integer"], ["payload_hash", "Hash"], ["processing_state", "Controlled enum"]],
  DeliveryAttempt: [["integration_event_id", "Reference"], ["attempt_number", "Integer"], ["idempotency_key", "Text"], ["started_at", "Datetime"], ["result", "Controlled enum"], ["next_retry_at", "Datetime", "On retry"]],
  ReconciliationCheckpoint: [["subscription_id", "Reference"], ["checkpoint_position", "Text"], ["aggregate_version", "Integer"], ["reconciliation_state", "Controlled enum"], ["reconciled_at", "Datetime"]],
  HiringTeamMembership: [["requisition_id", "Reference"], ["user_id", "Reference"], ["responsibility", "Controlled enum"], ["access_level", "Controlled enum"], ["effective_from", "Datetime"], ["effective_to", "Datetime", "When revoked"]],
  PostingChannel: [["job_posting_id", "Reference"], ["channel_code", "Text"], ["external_posting_id", "Text", "When published"], ["publication_state", "Controlled enum"], ["last_reconciled_at", "Datetime"]],
  ApplicationSubmission: [["application_attempt_id", "Reference"], ["template_version_id", "Version reference"], ["submitted_at", "Datetime"], ["submission_hash", "Hash"], ["request_context", "JSON"]],
  ApplicationStageEvent: [["application_id", "Reference"], ["transition_contract_id", "Reference"], ["source_stage_id", "Reference"], ["destination_stage_id", "Reference"], ["actor_id", "Reference"], ["occurred_at", "Datetime"], ["reason_code", "Text", "When required"]],
  ScorecardResponse: [["scorecard_id", "Reference"], ["criterion_id", "Reference"], ["rating", "Decimal"], ["evidence", "Long text"], ["response_version", "Integer"]],
  ReferenceCheck: [["application_id", "Reference"], ["authorization_record_id", "Reference"], ["referee_reference", "Text"], ["request_state", "Controlled enum"], ["restricted_summary", "Long text", "On completion"]],
  BackgroundCheck: [["application_id", "Reference"], ["authorization_record_id", "Reference"], ["provider_reference", "Text"], ["policy_evaluation_id", "Reference"], ["check_state", "Controlled enum"], ["restricted_result", "Controlled enum", "On result"]],
  AdverseActionCase: [["background_check_id", "Reference"], ["policy_evaluation_id", "Reference"], ["notice_state", "Controlled enum"], ["waiting_period_ends_at", "Datetime"], ["dispute_state", "Controlled enum"], ["final_action", "Controlled enum", "On completion"]],
  RestrictedHRCase: [["candidate_id", "Reference"], ["application_id", "Reference", "When application scoped"], ["case_type", "Controlled enum"], ["restricted_owner_id", "Reference"], ["safe_blocker_state", "Controlled enum"], ["case_state", "Controlled enum"]],
  RetentionExecution: [["retention_rule_id", "Reference"], ["subject_scope", "JSON"], ["preview_hash", "Hash"], ["approved_by_id", "Reference"], ["execution_state", "Controlled enum"], ["reconciled_at", "Datetime", "When completed"]],
  AccessGrant: [["user_id", "Reference"], ["resource_scope", "JSON"], ["permission_code", "Text"], ["purpose_code", "Text"], ["valid_from", "Datetime"], ["valid_to", "Datetime", "When time bounded"]],
  DelegationGrant: [["delegator_id", "Reference"], ["delegate_id", "Reference"], ["authority_scope", "JSON"], ["valid_from", "Datetime"], ["valid_to", "Datetime"], ["delegation_state", "Controlled enum"]],
  BreakGlassGrant: [["user_id", "Reference"], ["incident_reference", "Text"], ["resource_scope", "JSON"], ["approved_by_id", "Reference"], ["expires_at", "Datetime"], ["review_state", "Controlled enum"]],
  CandidateIdentifier: [["candidate_id", "Reference"], ["identifier_type", "Controlled enum"], ["normalized_hash", "Hash"], ["verification_method", "Controlled enum"], ["verified_at", "Datetime", "When verified"], ["revoked_at", "Datetime", "When revoked"]],
  CandidateDuplicateCase: [["candidate_id", "Reference"], ["possible_duplicate_id", "Reference"], ["match_evidence", "JSON"], ["reviewer_id", "Reference"], ["review_state", "Controlled enum"], ["resolution", "Controlled enum", "On completion"]],
  DataQualityIssue: [["rule_code", "Text"], ["subject_id", "Reference"], ["quality_dimension", "Controlled enum"], ["severity", "Controlled enum"], ["detected_at", "Datetime"], ["issue_state", "Controlled enum"]],
  SchemaVersion: [["interface_code", "Text"], ["version_number", "Integer"], ["schema_hash", "Hash"], ["compatibility_mode", "Controlled enum"], ["effective_from", "Datetime"]],
  MigrationMapping: [["migration_source_system", "Text"], ["source_field", "Text"], ["target_concept", "Text"], ["target_field", "Text"], ["transform_rule", "JSON"], ["mapping_version", "Integer"]],
};

const grainOverrides: Record<string, string> = {
  Organization: "One legal employer or controller boundary",
  Requisition: "One approved request to recruit for one business need and headcount envelope",
  PositionOpening: "One individually reservable and fillable approved headcount unit",
  JobPosting: "One channel-independent public posting identity for one requisition",
  JobPostingVersion: "One immutable candidate-visible content version of one job posting",
  Candidate: "One reviewed person identity independent of every application",
  CandidateIdentity: "One external identity-provider subject bound to one candidate",
  CandidateIdentifier: "One normalized, verified identifier for one candidate and identifier type",
  CandidateDuplicateCase: "One human-reviewed possible-candidate pair",
  Application: "One candidate-to-requisition application aggregate for one immutable attempt policy",
  ApplicationAttempt: "One numbered attempt inside one candidate-and-requisition application history",
  ApplicationSubmission: "One immutable submitted snapshot for one application attempt",
  ApplicationAnswer: "One immutable answer to one versioned question in one submission",
  ApplicationStageEvent: "One accepted stage transition for one application aggregate version",
  InterviewSession: "One canonical scheduled or completed interview activity for one application and plan round",
  InterviewerAssignment: "One interviewer in one role slot for one interview session and access window",
  Scorecard: "One independently submitted evaluator scorecard for one interviewer assignment",
  ScorecardResponse: "One anchored criterion response within one scorecard version",
  Offer: "One offer aggregate for one application",
  OfferVersion: "One immutable set of offer terms and document hash",
  OpeningReservation: "One time-bounded claim by one accepted offer version on one position opening",
  HireHandoff: "One idempotent HR destination transfer for one application, offer version and opening",
  HiringTeamMembership: "One effective-dated user responsibility and access assignment for one requisition",
  AccessGrant: "One effective-dated permission and purpose grant to one user and resource scope",
  DelegationGrant: "One time-bounded transfer of a defined authority scope from one user to another",
  BreakGlassGrant: "One incident-bound, expiring emergency access grant with independent approval",
  ApplicationStageEventFact: "One accepted application stage event",
};

function labelFor(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function apiToken(name: string) {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").replace(/[^A-Za-z0-9]+/g, "_");
}

function apiField(key: string) {
  return `${key.replace(/(^|_)([a-z])/g, (_, __, letter: string) => letter.toUpperCase())}__c`;
}

function inferKind(name: string): ConceptKind {
  if (/Version$/.test(name)) return "Immutable version";
  if (/Snapshot$/.test(name)) return "Derived snapshot";
  if (/Projection$|Notification$/.test(name)) return "Read-model projection";
  if (/FileAsset$/.test(name)) return "External reference";
  if (/Event$|Attempt$|Answer$|Response$|Consent$|AuthorizationRecord$|AuditEvent$|Submission$/.test(name)) return "Append-only event";
  if (/Membership$|Assignment$|Attribution$|Reservation$|Coverage$|Grant$|Mapping$|Approval$/.test(name)) return "Junction";
  if (/Definition$|Template$|Rule$|Policy$|Competency$|Role$|Permission$|Tag$|Source$|SchemaVersion$|MigrationMapping$/.test(name)) return "Configuration metadata";
  if (/Round$|Step$|Location$|Opening$|Check$|Case$|Execution$|Action$/.test(name)) return "Child entity";
  return "Canonical entity";
}

function inferPersistence(name: string, kind: ConceptKind): PersistenceTarget {
  if (["Organization", "User", "Role", "Permission", "Task", "EventProjection"].includes(name)) return "Salesforce standard/platform";
  if (name === "FileAsset") return "External private file service";
  if (kind === "Read-model projection") return "BFF read model";
  if (["JurisdictionRule", "OperationalViewDefinition", "SchemaVersion", "MigrationMapping"].includes(name)) return "Salesforce custom metadata";
  if (["AuditEvent", "IntegrationEvent", "DeliveryAttempt", "ApplicationStageEvent", "DeliveryEvent"].includes(name)) return "Event stream and audit archive";
  return "Salesforce custom object";
}

function provenanceFor(kind: ConceptKind): AtomicFieldContract["provenance"] {
  if (kind === "Derived snapshot" || kind === "Read-model projection") return "Derived";
  if (kind === "Immutable version" || kind === "Append-only event") return "Copied snapshot";
  return "Authoritative";
}

const commonFieldSeeds: FieldSeed[] = [
  ["id", "ID"],
  ["organization_id", "Reference"],
  ["lifecycle_state", "Controlled enum"],
  ["business_version", "Integer"],
  ["created_at", "Datetime"],
  ["created_by", "Reference"],
  ["updated_at", "Datetime"],
  ["updated_by", "Reference"],
  ["source_system", "Text"],
  ["classification", "Controlled enum"],
  ["retention_class", "Controlled enum"],
  ["legal_hold_state", "Controlled enum"],
  ["evidence_fingerprint", "Hash"],
];

const referenceTargets: Record<string, string> = {
  organization_id: "Organization",
  candidate_id: "Candidate",
  requisition_id: "Requisition",
  application_id: "Application",
  job_posting_id: "JobPosting",
  position_opening_id: "PositionOpening",
  interview_session_id: "InterviewSession",
  interviewer_assignment_id: "InterviewerAssignment",
  offer_id: "Offer",
  offer_version_id: "OfferVersion",
  approval_attempt_id: "ApprovalAttempt",
  automation_execution_id: "AutomationExecution",
  message_id: "Message",
  user_id: "User",
};

function makeFields(concept: Omit<AtomicConceptContract, "fields" | "stateVocabulary">, seeds: FieldSeed[]) {
  return [...commonFieldSeeds, ...seeds].map(([key, dataType, requiredWhen = "Create"], index): AtomicFieldContract => {
    const sensitive =
      /email|phone|legal_name|compensation|evidence|answer|rationale|result|identity|background|accommodation|privacy|integrity|free_text|payload/.test(
        key,
      ) || /restricted/i.test(concept.classification);
    const immutable = concept.kind === "Immutable version" || concept.kind === "Append-only event";
    const referenceTarget = referenceTargets[key] ?? null;
    return {
      id: `AFLD-${concept.id.slice(4)}-${String(index + 1).padStart(2, "0")}`,
      conceptId: concept.id,
      key,
      label: labelFor(key),
      category: index < commonFieldSeeds.length ? "Governance" : "Business",
      dataType,
      businessDefinition: `${labelFor(key)} for one ${concept.name} at the declared grain; display text is never authoritative.`,
      nullable: requiredWhen !== "Create",
      nullMeaning: requiredWhen === "Create" ? "Not permitted" : `Not yet applicable until: ${requiredWhen}`,
      requiredWhen,
      defaultValue: null,
      allowedValues: dataType === "Controlled enum" ? ["Draft", "Active", "Completed", "Canceled", "Superseded"] : [],
      unit: dataType === "Currency" ? "Minor currency units plus ISO-4217 currency" : /minutes/.test(key) ? "Minutes" : /days/.test(key) ? "Days" : null,
      source: concept.systemOfRecord,
      authority: concept.owner,
      provenance: provenanceFor(concept.kind),
      classification: sensitive ? "Restricted / purpose limited" : concept.classification,
      encryption: sensitive ? "Required" : dataType === "Long text" || dataType === "JSON" ? "Evaluate" : "Not required",
      masking: sensitive ? "Mask outside the named entitlement and record purpose" : "No additional masking beyond row access",
      readRoles: concept.inherited ? objectCatalog.find((item) => item.id === concept.familyId)?.personas.slice() ?? [] : objectCatalog.find((item) => item.id === concept.familyId)?.personas.slice() ?? [],
      writeRoles: immutable ? [] : (objectCatalog.find((item) => item.id === concept.familyId)?.personas ?? []).filter((role) => role !== "Candidate" && role !== "Auditor"),
      validation: referenceTarget ? `Must resolve to an authorized ${referenceTarget} in the same organization` : dataType === "Datetime" ? "ISO-8601 with explicit timezone; future values allowed only by field purpose" : dataType === "Currency" ? "Nonnegative integer minor units with a separately governed currency code" : dataType === "Hash" ? "Deterministic SHA-256 or approved stronger digest" : "Must conform to the declared type, vocabulary and required condition",
      retentionClass: concept.retention,
      legalHoldBehavior: "A matching active legal hold blocks destructive lifecycle actions only for the affected scope",
      history: immutable ? "Append-only; correction creates a superseding record" : "Consequential changes emit an immutable business event with prior/current version",
      indexed: dataType === "ID" || dataType === "Reference" || /state|code|_at$|version/.test(key),
      uniqueGroup: key === "id" ? `${concept.name}.primary` : concept.name === "Application" && ["organization_id", "candidate_id", "requisition_id", "attempt_number"].includes(key) ? "Application.attempt" : null,
      referenceTarget,
      effectiveDated: /effective_|valid_|expires_|revoked_|superseded_/.test(key),
      salesforceField: key === "id" ? "Id" : apiField(key),
      apiField: key,
      reportingUse: sensitive ? "Excluded from general analytics; approved minimized derived category only" : "Eligible only through a documented fact/dimension lineage",
    };
  });
}

function statesForConcept(name: string, family: ObjectContract, kind: ConceptKind) {
  if (kind === "Immutable version" || kind === "Configuration metadata") return ["Draft", "In review", "Approved", "Effective", "Superseded", "Retired"];
  if (kind === "Append-only event") return ["Recorded", "Validated", "Accepted", "Superseded", "Archived"];
  if (kind === "Derived snapshot" || kind === "Read-model projection") return ["Pending", "Current", "Stale", "Rebuilding", "Superseded"];
  return [...family.states];
}

const inheritedConceptRows = objectCatalog.flatMap((family) =>
  (expansionByFamily[family.name] ?? [family.name]).map((name) => ({ name, family, inherited: true })),
);
const supportingConceptRows = Object.entries(supportingConceptFamilies).map(([name, familyName]) => {
  const family = objectCatalog.find((item) => item.name === familyName);
  if (!family) throw new Error(`Missing family mapping for supporting concept ${name}`);
  return { name, family, inherited: false };
});

export const atomicConcepts: AtomicConceptContract[] = [...inheritedConceptRows, ...supportingConceptRows].map((row, index) => {
  const id = `CON-${String(index + 1).padStart(3, "0")}`;
  const kind = inferKind(row.name);
  const persistenceTarget = inferPersistence(row.name, kind);
  const base = {
    id,
    name: row.name,
    familyId: row.family.id,
    familyName: row.family.name,
    domain: row.family.domain,
    inherited: row.inherited,
    kind,
    grain: grainOverrides[row.name] ?? `One ${labelFor(apiToken(row.name)).toLowerCase()} record for one organization and its explicit authoritative parent`,
    persistenceTarget,
    physicalDisposition: persistenceTarget === "BFF read model" ? "Rebuildable projection; never canonical business truth" : persistenceTarget === "External private file service" ? "Opaque Salesforce file reference plus private provider object" : persistenceTarget === "Event stream and audit archive" ? "Short operational ledger plus durable append-only archive" : `Proposed ${persistenceTarget.toLowerCase()} disposition; standard-versus-custom review remains accountable`,
    proposedApiName: persistenceTarget === "Salesforce standard/platform" ? ({ Organization: "Organization", User: "User", Role: "UserRole", Permission: "PermissionSet", Task: "Task", EventProjection: "Event" }[row.name] ?? apiToken(row.name)) : persistenceTarget === "Salesforce custom metadata" ? `${apiToken(row.name)}__mdt` : persistenceTarget === "BFF read model" ? `read.${apiToken(row.name).toLowerCase()}` : `${apiToken(row.name)}__c`,
    approvalStatus: "Proposed — accountable approval required" as const,
    systemOfRecord: row.family.sourceOfTruth,
    owner: row.family.owner,
    tenantScoped: row.name !== "Organization",
    classification: row.family.classification,
    retention: row.family.retention,
  };
  const seeds = businessFieldSeeds[row.name];
  if (!seeds) throw new Error(`Missing object-specific field blueprint for ${row.name}`);
  return {
    ...base,
    fields: makeFields(base, seeds),
    stateVocabulary: statesForConcept(row.name, row.family, kind),
  };
});

type RelationshipSeed = Omit<RelationshipContract, "id">;
type RelationshipTuple = readonly [
  string,
  string,
  string,
  Cardinality,
  boolean,
  RelationshipContract["deleteBehavior"],
  RelationshipContract["ownership"],
  string,
  string,
];
const relationshipSeeds: RelationshipSeed[] = ([
  ["Requisition", "department_id", "Department", "many-to-one", true, "Protect", "Independent", "Department must be effective at submission", "Every requisition belongs to one department"],
  ["Requisition", "hiring_manager_id", "User", "many-to-one", true, "Protect", "Independent", "Manager must be active at submission and decision", "A requisition has one accountable hiring manager"],
  ["PositionOpening", "requisition_id", "Requisition", "many-to-one", true, "Protect", "Inherited access", "Opening cannot predate requisition approval", "Approved headcount equals authorized openings"],
  ["JobPosting", "requisition_id", "Requisition", "many-to-one", true, "Protect", "Inherited access", "Requisition must be approved", "Posting cannot authorize headcount"],
  ["JobPostingVersion", "job_posting_id", "JobPosting", "many-to-one", true, "Protect", "Inherited access", "Version becomes immutable on approval", "Exactly one current published version per posting"],
  ["PostingChannel", "job_posting_id", "JobPosting", "many-to-one", true, "Archive child", "Projection only", "Channel state reconciles to current posting version", "Delivery is not publication truth"],
  ["HiringPlan", "requisition_id", "Requisition", "one-to-one", true, "Protect", "Inherited access", "Plan precedes publication", "One current plan aggregate per requisition"],
  ["HiringPlanVersion", "hiring_plan_id", "HiringPlan", "many-to-one", true, "Protect", "Inherited access", "Application pins the effective approved version", "Used versions never mutate"],
  ["HiringTeamMembership", "requisition_id", "Requisition", "many-to-one", true, "Archive child", "Junction controlled", "Membership must be effective when access is evaluated", "Shares derive from current effective membership"],
  ["CandidateIdentity", "candidate_id", "Candidate", "many-to-one", true, "Protect", "Inherited access", "Identity may be revoked without deleting candidate", "Identity subjects are unique per provider"],
  ["CandidateIdentifier", "candidate_id", "Candidate", "many-to-one", true, "Protect", "Inherited access", "Only verified identifiers participate in matching", "No automatic candidate merge"],
  ["CandidateDuplicateCase", "candidate_id", "Candidate", "many-to-one", true, "Protect", "Independent", "Both candidate records remain until human resolution", "Merge and split lineage is immutable"],
  ["Application", "candidate_id", "Candidate", "many-to-one", true, "Protect", "Independent", "Candidate must exist at attempt creation", "Exactly one candidate per application"],
  ["Application", "requisition_id", "Requisition", "many-to-one", true, "Protect", "Inherited access", "Requisition must accept the attempt or approved manual intake", "Exactly one requisition per application"],
  ["ApplicationAttempt", "application_id", "Application", "many-to-one", true, "Protect", "Inherited access", "Attempt number is immutable", "Attempt key is unique within candidate and requisition"],
  ["ApplicationSubmission", "application_attempt_id", "ApplicationAttempt", "one-to-zero-or-one", true, "Protect", "Inherited access", "Only a valid draft attempt may submit", "One immutable submission per attempt"],
  ["ApplicationAnswer", "submission_id", "ApplicationSubmission", "many-to-one", true, "Protect", "Inherited access", "Question version is pinned at submission", "Later template changes never rewrite answers"],
  ["ApplicationStageEvent", "application_id", "Application", "many-to-one", true, "Protect", "Inherited access", "Expected aggregate version and transition contract must match", "Current stage derives from accepted events"],
  ["DecisionReadinessSnapshot", "application_id", "Application", "many-to-one", true, "Archive child", "Inherited access", "Fingerprint must match current material facts", "Readiness cannot be edited directly"],
  ["AssessmentAssignment", "application_id", "Application", "many-to-one", true, "Protect", "Inherited access", "Definition and rubric versions are pinned", "Assessment output never directly changes disposition"],
  ["InterviewSession", "application_id", "Application", "many-to-one", true, "Protect", "Inherited access", "Session belongs to the pinned interview plan", "Calendar events remain projections"],
  ["InterviewerAssignment", "interview_session_id", "InterviewSession", "many-to-one", true, "Protect", "Junction controlled", "Qualification and access window must be current", "Assignment owns independent scorecard access"],
  ["Scorecard", "interviewer_assignment_id", "InterviewerAssignment", "one-to-zero-or-one", true, "Protect", "Inherited access", "Assignment must be current at submission", "One current scorecard per assignment; amendments append"],
  ["ScorecardResponse", "scorecard_id", "Scorecard", "many-to-one", true, "Protect", "Inherited access", "Criterion belongs to pinned rubric version", "Responses do not expose other evaluators before debrief"],
  ["Decision", "application_id", "Application", "many-to-one", true, "Protect", "Inherited access", "Current readiness snapshot and human authority required", "Automation never creates hiring outcome"],
  ["Offer", "application_id", "Application", "many-to-one", true, "Protect", "Inherited access", "Human decision must permit an offer", "At most one active offer per application"],
  ["OfferVersion", "offer_id", "Offer", "many-to-one", true, "Protect", "Inherited access", "Material change supersedes approval", "Offer version is immutable after approval request"],
  ["OfferResponse", "offer_version_id", "OfferVersion", "one-to-zero-or-one", true, "Protect", "Inherited access", "Only current approved extended version may be answered", "Response identity and timestamp are immutable"],
  ["OpeningReservation", "position_opening_id", "PositionOpening", "many-to-one", true, "Protect", "Junction controlled", "Accepted current offer required", "At most one active reservation per opening"],
  ["OpeningReservation", "offer_version_id", "OfferVersion", "one-to-one", true, "Protect", "Junction controlled", "Offer must remain accepted and current", "At most one reservation per accepted offer version"],
  ["HireHandoff", "application_id", "Application", "one-to-zero-or-one", true, "Protect", "Independent", "Accepted offer, reservation and contingencies must be current", "Hired requires exact destination acknowledgement"],
  ["ReferenceCheck", "application_id", "Application", "many-to-one", true, "Protect", "Independent", "Current authorization is required", "Restricted summary is separately entitled"],
  ["BackgroundCheck", "application_id", "Application", "many-to-one", true, "Protect", "Independent", "Policy evaluation and authorization must be current", "Provider result never directly sets disposition"],
  ["AdverseActionCase", "background_check_id", "BackgroundCheck", "one-to-zero-or-one", true, "Protect", "Independent", "Applicable notice and waiting period are version bound", "Final action requires attributed human review"],
  ["RecruitingWorkItem", "subject_id", "Application", "many-to-one", false, "Archive child", "Inherited access", "Typed subject must exist and be authorized", "Work state is not business state"],
  ["AutomationExecution", "target_id", "Application", "many-to-one", false, "Archive child", "Independent", "Target version and purpose are rechecked at execution", "One semantic effect per idempotency key"],
  ["AutomationAction", "automation_execution_id", "AutomationExecution", "many-to-one", true, "Protect", "Inherited access", "Execution must authorize action ordinal", "Completed effects are compensated, never erased"],
  ["Message", "application_id", "Application", "many-to-one", true, "Archive child", "Inherited access", "Purpose and recipient eligibility are rechecked before send", "Message cannot make a business outcome true"],
  ["DeliveryEvent", "message_id", "Message", "many-to-one", true, "Protect", "Projection only", "Provider occurrence and receipt time are preserved", "Delivery event is not business completion"],
  ["PrivacyRequest", "candidate_id", "Candidate", "many-to-one", true, "Protect", "Independent", "Requester identity must be verified before execution", "Hiring evaluators receive only a safe blocker"],
  ["RetentionExecution", "retention_rule_id", "RetentionRule", "many-to-one", true, "Protect", "Independent", "Preview, approval, hold check and provider reconciliation are required", "Destructive execution is dual controlled"],
  ["IntegrationEvent", "subscription_id", "IntegrationSubscription", "many-to-one", true, "Protect", "Independent", "Signature, schema and replay checks precede acceptance", "Transport order cannot determine business truth"],
  ["DeliveryAttempt", "integration_event_id", "IntegrationEvent", "many-to-one", true, "Protect", "Inherited access", "Attempts reuse the semantic idempotency key", "Retry cannot duplicate the business effect"],
  ["AccessGrant", "user_id", "User", "many-to-one", true, "Protect", "Independent", "Grant must be effective and purpose valid", "Permission is additive and expires deterministically"],
  ["DelegationGrant", "delegate_id", "User", "many-to-one", true, "Protect", "Independent", "Delegation cannot exceed delegator authority", "Delegation never hides the acting user"],
  ["BreakGlassGrant", "user_id", "User", "many-to-one", true, "Protect", "Independent", "Incident, approval and expiry are mandatory", "Every use emits high-priority audit evidence"],
  ["DataQualityIssue", "subject_id", "AuditEvent", "many-to-one", false, "Archive child", "Independent", "Detected subject is recorded without copying restricted content", "P0 issue blocks consequential action"],
] satisfies RelationshipTuple[]).map(([from, field, to, cardinality, required, deleteBehavior, ownership, temporalRule, invariant]) => ({ from, field, to, cardinality, required, deleteBehavior, ownership, temporalRule, invariant }));

const tenantRelationships: RelationshipSeed[] = atomicConcepts
  .filter((concept) => concept.tenantScoped && concept.persistenceTarget !== "BFF read model")
  .map((concept) => ({
    from: concept.name,
    field: "organization_id",
    to: "Organization",
    cardinality: "many-to-one",
    required: true,
    deleteBehavior: "Protect",
    ownership: "Independent",
    temporalRule: "Organization must be active at record creation and consequential action",
    invariant: "Cross-organization references and reads are prohibited",
  }));

export const relationshipContracts: RelationshipContract[] = [...tenantRelationships, ...relationshipSeeds].map((row, index) => ({
  id: `REL-${String(index + 1).padStart(3, "0")}`,
  ...row,
}));

type InvariantTuple = readonly [string, string, InvariantContract["severity"], string, string[], string];
export const invariantContracts: InvariantContract[] = ([
  ["INV-DM-001", "Application attempt uniqueness", "Blocker", "unique(organization_id, candidate_id, requisition_id, attempt_number)", ["database unique key", "domain service", "migration quarantine"], "property and concurrent-create tests"],
  ["INV-DM-002", "Current stage from events", "Blocker", "Application.current_stage = fold(accepted ApplicationStageEvent by aggregate_version)", ["transition service", "reconciliation job"], "event-fold and out-of-order tests"],
  ["INV-DM-003", "One active offer", "Blocker", "count(active Offer where application_id)=0..1", ["partial unique constraint", "offer service"], "concurrent-offer property test"],
  ["INV-DM-004", "One active reservation", "Blocker", "count(active OpeningReservation by application_id)=0..1 and by position_opening_id=0..1", ["transactional constraint", "reservation service"], "concurrent-reservation test"],
  ["INV-DM-005", "Hired proof chain", "Blocker", "Hired => accepted offer version + active reservation + cleared contingencies + acknowledged exact handoff", ["hire service", "database transaction", "reconciliation"], "no-direct-hired and rollback tests"],
  ["INV-DM-006", "Scorecard assignment", "High", "submitted Scorecard references one current InterviewerAssignment and pinned RubricVersion", ["scorecard service", "foreign keys"], "expired-access and amendment tests"],
  ["INV-DM-007", "Protected deletion", "Blocker", "retained evidence and legal-hold scope cannot be cascade deleted", ["restrict foreign keys", "retention service"], "delete and hold tests"],
  ["INV-DM-008", "Immutable version pinning", "High", "used configuration version never mutates and every consequential record pins its version", ["activation service", "immutable storage policy"], "material-change fingerprint tests"],
  ["INV-DM-009", "Idempotent side effects", "Blocker", "unique(provider, semantic_action, aggregate_id, aggregate_version, idempotency_key)", ["outbox", "integration worker", "reconciliation"], "retry/replay/reorder tests"],
  ["INV-DM-010", "Candidate identity review", "Blocker", "duplicate signal never merges Candidate without attributed human resolution", ["identity service", "restricted case workflow"], "false-positive and split/merge tests"],
  ["INV-DM-011", "Purpose-bound access", "Blocker", "allow = object permission AND field entitlement AND record relationship AND purpose AND temporal validity", ["Salesforce sharing/FLS", "BFF authorization", "audit"], "negative persona/row/field tests"],
  ["INV-DM-012", "Analytics lineage", "High", "every fact row references canonical event_id and aggregate_version; corrections restate, never silently overwrite", ["semantic layer", "restatement ledger"], "source-to-dashboard reconciliation tests"],
  ["INV-DM-013", "Sensitive-data separation", "Blocker", "routine hiring roles cannot read restricted compensation, accommodation, privacy, integrity, background or survey text", ["separate objects", "field entitlements", "masked projections"], "negative disclosure tests"],
  ["INV-DM-014", "Event audit completeness", "High", "consequential mutation emits actor, authority, target/version, result, reason, correlation and causation", ["transactional outbox", "business audit ledger"], "mutation-to-event completeness test"],
  ["INV-DM-015", "Reference vocabulary", "High", "country, currency, timezone, stage, source and reason values resolve to versioned reference data", ["validation service", "metadata deployment"], "accepted-value and effective-date tests"],
] satisfies InvariantTuple[]).map(([id, name, severity, expression, enforcement, evidence]) => ({ id, name, severity, expression, enforcement, evidence }));

function transitionGuard(name: string, from: string, to: string) {
  if (name === "Application") return "Current Application aggregate version, pinned process version, allowed TransitionContract, required evidence, policy snapshot and human permission must all be valid";
  if (name === "Offer") return "Current immutable OfferVersion, material fingerprint and required approval state must be valid";
  if (name === "HireHandoff") return "Accepted OfferVersion, active OpeningReservation, cleared ContingencyCase set and exact destination schema must be valid";
  return `Current ${name} version, effective configuration, actor permission and declared prerequisites must be valid`;
}

export const transitionContracts: TransitionContract[] = atomicConcepts.flatMap((concept) =>
  concept.stateVocabulary.slice(0, -1).map((from, index) => {
    const to = concept.stateVocabulary[index + 1];
    return {
      concept: concept.name,
      from,
      to,
      command: `Advance ${concept.name}`,
      permission: `${concept.name}.transition`,
      guard: transitionGuard(concept.name, from, to),
      reasonRequired: /Canceled|Rejected|Superseded|Retired|Archived/.test(to),
      sideEffects: ["Append business audit event", "Recalculate derived work and projections", "Reconcile affected analytics lineage"],
      candidateCommunication: ["Application", "InterviewSession", "Offer", "HireHandoff"].includes(concept.name) ? "Evaluate current candidate-safe communication purpose and template; do not disclose internal state" : "None unless an approved communication purpose explicitly maps this transition",
      event: ["Application", "Offer", "HireHandoff"].includes(concept.name) ? `${concept.name}StateChanged.v1` : "AggregateStateChanged.v1",
      idempotencyScope: `${concept.name}:{id}:{expectedVersion}:${from}:${to}`,
      failureRecovery: "No partial state; return prior committed version, create owned work for exhausted recoverable side effects, and reconcile with the same idempotency key",
    };
  }),
).map((row, index) => ({ id: `DTR-${String(index + 1).padStart(4, "0")}`, ...row }));

const eventEnvelope = ["event_id", "event_name", "schema_version", "organization_id", "aggregate_type", "aggregate_id", "aggregate_version", "actor_id", "actor_type", "authority_reference", "occurred_at", "observed_at", "correlation_id", "causation_id", "idempotency_key", "payload_hash"];
type EventTuple = readonly [string, number, string, string, string[], string[], string[], string];
export const domainEventCatalog: DomainEventContract[] = ([
  ["AggregateStateChanged", 1, "Any stateful aggregate", "Accepted guarded state transition", ["from_state", "to_state", "reason_code"], ["candidate_name", "message_body", "secret"], ["business audit", "work projection", "analytics"], "Event retention plus archive policy"],
  ["RequisitionApproved", 1, "Requisition", "Final current-version approval accepted", ["approval_attempt_id", "subject_fingerprint"], ["approval_comment", "compensation_detail"], ["publication readiness", "audit"], "Employment-record policy"],
  ["JobPostingPublished", 1, "JobPosting", "Approved posting version becomes public", ["posting_version_id", "channel_ids", "policy_evaluation_id"], ["internal_budget", "approver_comment"], ["careers projection", "search index", "analytics"], "Posting and audit policy"],
  ["ApplicationSubmitted", 1, "Application", "Immutable submission committed", ["application_attempt_id", "submission_id", "template_version_id", "notice_version"], ["answer_text", "resume_content", "network_address"], ["receipt message", "review work", "analytics"], "Application policy"],
  ["ApplicationStateChanged", 1, "Application", "Accepted ApplicationStageEvent", ["transition_contract_id", "source_stage_id", "destination_stage_id"], ["candidate_name", "internal_free_text"], ["readiness", "work", "candidate-safe mapping", "analytics"], "Application policy"],
  ["InterviewScheduled", 1, "InterviewSession", "Canonical session confirmed", ["session_id", "start_at", "timezone", "participant_assignment_ids"], ["candidate_contact", "calendar_payload"], ["calendar projection", "message", "analytics"], "Interview policy"],
  ["ScorecardSubmitted", 1, "Scorecard", "Independent scorecard locked", ["assignment_id", "rubric_version_id", "scorecard_version"], ["evidence_text", "other_scorecards"], ["readiness", "debrief work", "analytics"], "Decision-evidence policy"],
  ["HumanDecisionRecorded", 1, "Decision", "Authorized human decision committed", ["readiness_snapshot_id", "outcome", "decision_maker_id"], ["rationale_text", "protected_data"], ["disposition/offer work", "audit", "analytics"], "Decision policy"],
  ["OfferStateChanged", 1, "Offer", "Guarded offer lifecycle transition", ["offer_version_id", "approval_attempt_id", "state"], ["compensation_components", "document_body"], ["candidate task", "reservation service", "analytics"], "Offer policy"],
  ["OpeningReserved", 1, "OpeningReservation", "Accepted offer reserves an available opening", ["position_opening_id", "offer_version_id", "expires_at"], ["compensation", "candidate_contact"], ["headcount ledger", "handoff readiness", "analytics"], "Employment-record policy"],
  ["HireHandoffStateChanged", 1, "HireHandoff", "Destination delivery or acknowledgement changes", ["payload_hash", "destination_system", "acknowledgement_state"], ["payload", "candidate_contact"], ["opening fill service", "work", "audit", "analytics"], "Employment and integration policy"],
  ["PrivacyRequestChanged", 1, "PrivacyRequest", "Verified request reaches a controlled state", ["request_type", "execution_scope_hash", "state"], ["identity_evidence", "export_payload"], ["retention service", "provider reconciliation", "audit"], "Privacy-request policy"],
  ["IntegrationEffectReconciled", 1, "IntegrationEvent", "Canonical and destination versions match", ["subscription_id", "checkpoint_id", "result"], ["payload", "secret", "candidate_content"], ["operations", "audit", "SLO analytics"], "Integration audit policy"],
] satisfies EventTuple[]).map(([name, version, aggregate, semanticTrigger, requiredFields, prohibitedFields, consumers, retention]) => ({ name, version, aggregate, semanticTrigger, requiredFields: [...eventEnvelope, ...requiredFields], prohibitedFields, consumers, retention }));

type RolePolicyTuple = readonly [string, string[], string[], string[], string[], string, string, string];
export const roleSecurityPolicies: RoleSecurityPolicy[] = ([
  ["Candidate", ["own application", "own communication", "own privacy"], ["candidate subject equals authenticated portal subject"], ["own identity", "own candidate-safe status", "own offer response"], ["internal stage", "scorecards", "decision rationale", "integrity/background detail"], "Portal token/session and record purpose must be current", "Own-data controlled export only", "Not permitted"],
  ["Recruiter", ["recruiting operations", "candidate communication"], ["requisition owner or effective hiring-team member", "application owner"], ["candidate identity", "application facts", "summary evidence", "compensation band"], ["restricted accommodation detail", "privacy identity proof", "background result"], "Membership and assignment must be current", "Governed purpose-bound export", "Incident-only named grant"],
  ["Recruiting Coordinator", ["scheduling", "candidate logistics"], ["assigned scheduling work or effective requisition membership"], ["contact logistics", "availability", "session state"], ["decision evidence", "compensation", "privacy/integrity detail"], "Assignment ends after session plus approved grace period", "Aggregate only", "Incident-only named grant"],
  ["Hiring Manager", ["managed requisition", "human decision"], ["hiring manager or effective hiring-team member"], ["candidate identity", "summary evidence", "band-only compensation"], ["contact detail beyond need", "accommodation detail", "privacy case"], "Membership and decision authority must be current", "Aggregate only", "Incident-only named grant"],
  ["Interviewer", ["assigned interview", "independent scorecard"], ["current InterviewerAssignment"], ["candidate-safe briefing", "own scorecard"], ["other feedback before debrief", "offer", "contact", "restricted cases"], "Access starts and ends with assignment window", "None", "Not permitted"],
  ["Offer Approver", ["current offer approval"], ["current ApprovalStep assignment or valid delegation"], ["offer version", "full entitled compensation", "summary decision evidence"], ["accommodation", "privacy", "unrelated applications"], "Attempt, delegation and subject fingerprint must be current", "None", "Incident-only named grant"],
  ["Candidate Support", ["service recovery", "candidate-safe communication"], ["assigned ServiceRecoveryCase or communication work"], ["contact", "message delivery", "safe case status"], ["decision evidence", "compensation", "integrity evidence"], "Case assignment and purpose must be current", "None", "Incident-only named grant"],
  ["Application Integrity Reviewer", ["assigned integrity review"], ["current restricted ApplicationIntegrityCase assignment"], ["minimized identity", "signal evidence", "redress"], ["offer", "compensation", "unrelated hiring evidence"], "Assignment ends at case closure", "None", "Incident-only named grant"],
  ["Configuration Admin", ["configuration lifecycle", "impact simulation"], ["configuration ownership or approved change assignment"], ["metadata", "synthetic impact"], ["candidate identity", "contact", "decision evidence"], "Change authority and separation of duties must be current", "Aggregate only", "Dual-approved incident grant"],
  ["Platform Admin", ["platform operations", "minimized troubleshooting"], ["owned operational work or active incident grant"], ["metadata", "hashed references", "safe failure status"], ["candidate content", "compensation", "decision evidence"], "Standing broad business-row access is prohibited", "Aggregate only", "Time-bound dual-approved grant"],
  ["Privacy & Legal", ["verified privacy request", "policy evaluation", "legal hold"], ["assigned restricted case or policy scope"], ["verified identity", "restricted request scope", "policy facts"], ["unrelated hiring evidence", "unneeded message content"], "Purpose, case and jurisdiction must be current", "Governed legal/privacy export", "Time-bound dual-approved grant"],
  ["HRIS Operator", ["accepted offer handoff", "reconciliation"], ["current HireHandoff or contingency work"], ["identity needed for handoff", "approved compensation", "destination mapping"], ["scorecards", "decision rationale", "privacy/integrity cases"], "Access ends after reconciled handoff plus approved support window", "None", "Incident-only named grant"],
  ["Auditor", ["approved audit scope"], ["effective AuditScope grant naming objects, fields, dates and purpose"], ["immutable audit evidence", "masked business context"], ["unscoped candidate identity", "message/file content", "standing compensation detail"], "Scope and review window must be current", "Governed evidence export", "Read-only, time-bound, independently approved"],
] satisfies RolePolicyTuple[]).map(([role, purposes, rowRelationships, fieldEntitlements, deniedCategories, temporalRule, exportPolicy, breakGlass]) => ({ role, purposes, rowRelationships, fieldEntitlements, deniedCategories, temporalRule, exportPolicy, breakGlass }));

type AnalyticsTuple = readonly [string, AnalyticsContract["kind"], string, string[], string[], string[], string, string, string];
export const analyticsContracts: AnalyticsContract[] = ([
  ["ApplicationFact", "Fact", "One submitted application attempt", ["ApplicationSubmitted", "ApplicationStateChanged"], ["application_id", "candidate_safe_id", "requisition_id", "submission_date_key", "source_key"], ["application_count", "current_stage_age_business_minutes"], "Retain occurred and observed time; provisional recent windows are labeled", "Stage corrections append a restatement linked to prior fact version", "Candidate identity excluded; row scope follows requisition purpose"],
  ["ApplicationStageEventFact", "Fact", "One accepted application stage transition", ["ApplicationStateChanged"], ["stage_event_id", "application_id", "from_stage_key", "to_stage_key", "occurred_date_key"], ["elapsed_business_minutes", "sla_breach_count"], "Late events are ordered by aggregate version, not arrival", "Recompute affected intervals and publish restatement reason", "No rationale or candidate content"],
  ["InterviewSessionFact", "Fact", "One canonical interview session version", ["InterviewScheduled", "AggregateStateChanged"], ["session_id", "application_id", "interview_type_key", "date_key"], ["scheduling_cycle_minutes", "reschedule_count", "no_show_count"], "Provider lag is separate from canonical confirmation", "Superseded sessions remain with lineage", "Participant identity minimized"],
  ["ScorecardCompletionFact", "Fact", "One required interviewer assignment", ["ScorecardSubmitted"], ["assignment_id", "application_id", "rubric_version_id", "date_key"], ["required_count", "submitted_count", "completion_minutes"], "Submission occurrence drives completion", "Amendment does not rewrite original completion", "Ratings/evidence excluded from general analytics"],
  ["OfferEventFact", "Fact", "One offer lifecycle event", ["OfferStateChanged", "OpeningReserved"], ["offer_id", "offer_version_id", "application_id", "date_key"], ["offer_count", "response_minutes", "accepted_count"], "Provider delivery time is not extension time", "Material supersession closes prior interval", "Compensation excluded unless separate entitled dataset"],
  ["CommunicationDeliveryFact", "Fact", "One message delivery attempt/result", ["AggregateStateChanged"], ["message_id", "purpose_key", "channel_key", "date_key"], ["eligible_count", "accepted_count", "failed_count", "delivery_minutes"], "Late provider events update delivery state with observed time", "Wrong-recipient/duplicate remains a guardrail event", "No recipient or content"],
  ["AutomationExecutionFact", "Fact", "One automation action execution", ["AggregateStateChanged", "IntegrationEffectReconciled"], ["execution_id", "rule_version_id", "action_type_key", "date_key"], ["attempt_count", "success_count", "suppression_count", "recovery_minutes"], "Retry attempts share one semantic action", "Replay never increments business outcome counts", "Target IDs pseudonymized"],
  ["WorkItemSLAFact", "Fact", "One governed work-item lifecycle", ["AggregateStateChanged"], ["work_item_id", "work_type_key", "owner_role_key", "date_key"], ["open_count", "completed_count", "business_minutes", "breach_count"], "Business calendar version is pinned", "Reassignment does not reset elapsed time", "No candidate merit attributes"],
  ["RequisitionDimension", "Dimension", "One effective requisition version", ["RequisitionApproved", "JobPostingPublished"], ["requisition_key", "department_key", "location_key"], ["approved_openings", "target_days"], "Effective dates select version at event occurrence", "Type-2 row for material changes", "Compensation band separated"],
  ["StageDimension", "Dimension", "One effective stable stage mapping version", ["AggregateStateChanged"], ["stage_key", "process_version_id", "milestone_key"], ["sequence_number"], "Version pinned to application event", "Never rewrite prior stage labels/milestones", "Public status text stored separately"],
  ["SourceDimension", "Dimension", "One governed acquisition source", ["ApplicationSubmitted"], ["source_key", "source_category_key"], [], "Unknown source receives owned quality issue", "Mapping corrections restate attributed facts", "No referrer identity in general analytics"],
  ["DateTimeDimension", "Dimension", "One reporting date/hour/calendar combination", [], ["date_key", "timezone_key", "business_calendar_version"], ["is_business_minute"], "Timezone and calendar version are explicit", "Calendar corrections restate affected metrics", "Nonpersonal reference data"],
] satisfies AnalyticsTuple[]).map(([name, kind, grain, sourceEvents, keys, measures, lateArrivalRule, restatementRule, security]) => ({ name, kind, grain, sourceEvents, keys, measures, lateArrivalRule, restatementRule, security }));

export const referenceDataContracts = [
  ["Country", "ISO-3166 plus approved operating jurisdiction metadata"],
  ["Currency", "ISO-4217 code, minor-unit precision and effective status"],
  ["Timezone", "IANA timezone identifier and version"],
  ["Locale", "BCP-47 language/locale identifier"],
  ["WorkplaceMode", "Remote, hybrid, onsite and approved localized labels"],
  ["WorkerType", "Employment/engagement vocabulary with employer scope"],
  ["JobLevel", "Versioned job architecture level and family"],
  ["Source", "Stable acquisition source and category"],
  ["DispositionReason", "Stable terminal reason, candidate-safe mapping and reporting grouping"],
  ["WorkflowPhaseState", "Stable milestone/phase/state taxonomy independent of display labels"],
  ["BusinessCalendar", "Timezone, working intervals, holidays and version"],
  ["DataClassification", "Purpose, sensitivity, entitlement and handling rules"],
] as const;

export const dataQualityContracts = [
  ["DQ-001", "Primary-key uniqueness", "Blocker", "Every persisted concept ID is non-null and unique"],
  ["DQ-002", "Application attempt uniqueness", "Blocker", "Composite attempt key has zero duplicates"],
  ["DQ-003", "Foreign-key integrity", "Blocker", "Required references have zero orphans and no cross-organization targets"],
  ["DQ-004", "State reachability", "Blocker", "Current state folds from accepted transitions"],
  ["DQ-005", "Version pinning", "High", "Consequential records reference approved effective immutable versions"],
  ["DQ-006", "Temporal validity", "High", "valid_from <= occurred_at < valid_to and timestamps include timezone"],
  ["DQ-007", "Reference validity", "High", "Controlled values resolve to effective reference versions"],
  ["DQ-008", "Provenance completeness", "Blocker", "Source, actor, authority, occurred time, aggregate version and fingerprint are present"],
  ["DQ-009", "Sensitive-field minimization", "Blocker", "Restricted content is absent from general projections, analytics and events"],
  ["DQ-010", "Idempotency uniqueness", "Blocker", "Semantic side-effect keys have zero duplicate applied results"],
  ["DQ-011", "Projection reconciliation", "High", "Calendar, message, analytics and UI projections match canonical aggregate version"],
  ["DQ-012", "Freshness", "High", "Operational and analytical lag remains within declared SLO or is labeled stale"],
  ["DQ-013", "Volume and skew", "High", "Parent, owner, share and event volumes remain within tested thresholds"],
  ["DQ-014", "Retention completeness", "Blocker", "Every record has an effective retention class and hold behavior"],
  ["DQ-015", "Migration reconciliation", "Blocker", "Source counts, keys, financial/headcount invariants and hashes reconcile before cutover"],
].map(([id, name, severity, rule]) => ({ id, name, severity, rule, automation: "Stable contract test plus monitored exception work item" }));

export const scaleLifecycleContracts = [
  { area: "Application and stage events", expectedVolume: "High; partition/archive by organization and occurred time", indexes: ["organization + requisition + current state", "candidate + requisition + attempt", "application + aggregate version"], archive: "Retain operational summary; archive immutable history under retention/hold policy" },
  { area: "Interview and scorecard evidence", expectedVolume: "Medium/high child volume per application", indexes: ["application + session state", "assignment user + access window", "scorecard assignment unique"], archive: "Preserve decision evidence and amendments" },
  { area: "Messages, automation and integrations", expectedVolume: "Very high append/attempt volume", indexes: ["idempotency key unique", "state + next retry", "subscription + checkpoint"], archive: "Short operational window plus durable minimized archive" },
  { area: "Sharing and ownership", expectedVolume: "Derived share growth follows hiring-team and assignment membership", indexes: ["user + effective window", "requisition + responsibility", "restricted entitlement + scope"], archive: "Revoke expired shares; preserve grant/audit evidence" },
  { area: "Migration and cutover", expectedVolume: "Full source population plus quarantine", indexes: ["source external ID unique", "mapping version", "quarantine reason"], archive: "Immutable reconciliation report, rollback checkpoint and source freeze evidence" },
];

export const canonicalDataModelSummary = {
  navigationFamilies: objectCatalog.length,
  inheritedAtomicConcepts: inheritedConceptRows.length,
  supportingConcepts: supportingConceptRows.length,
  atomicConcepts: atomicConcepts.length,
  atomicFields: atomicConcepts.reduce((sum, concept) => sum + concept.fields.length, 0),
  governanceFields: atomicConcepts.reduce((sum, concept) => sum + concept.fields.filter((field) => field.category === "Governance").length, 0),
  businessFields: atomicConcepts.reduce((sum, concept) => sum + concept.fields.filter((field) => field.category === "Business").length, 0),
  relationships: relationshipContracts.length,
  invariants: invariantContracts.length,
  transitions: transitionContracts.length,
  events: domainEventCatalog.length,
  rolePolicies: roleSecurityPolicies.length,
  analyticsContracts: analyticsContracts.length,
  referenceDatasets: referenceDataContracts.length,
  qualityRules: dataQualityContracts.length,
  physicalObjectsApproved: 0,
} as const;

export function conceptsForFamily(familyId: string) {
  return atomicConcepts.filter((concept) => concept.familyId === familyId);
}

export function relationshipsForConcept(name: string) {
  return relationshipContracts.filter((relationship) => relationship.from === name || relationship.to === name);
}

export function transitionsForConcept(name: string) {
  return transitionContracts.filter((transition) => transition.concept === name);
}

export function assertCanonicalDataModel() {
  const issues: string[] = [];
  if (inheritedConceptRows.length !== 111) issues.push(`Expected 111 inherited concepts, found ${inheritedConceptRows.length}`);
  const conceptNames = new Set<string>();
  for (const concept of atomicConcepts) {
    if (conceptNames.has(concept.name)) issues.push(`Duplicate concept name ${concept.name}`);
    conceptNames.add(concept.name);
    if (!concept.grain || /authorized business purpose and parent grain/.test(concept.grain)) issues.push(`${concept.name} has an unresolved grain`);
    if (concept.fields.filter((field) => field.category === "Business").length < 3) issues.push(`${concept.name} needs at least three object-specific business fields`);
    if (!relationshipContracts.some((relationship) => relationship.from === concept.name) && concept.name !== "Organization" && concept.persistenceTarget !== "BFF read model") issues.push(`${concept.name} has no outbound relationship`);
    const fieldKeys = concept.fields.map((field) => field.key);
    if (new Set(fieldKeys).size !== fieldKeys.length) issues.push(`${concept.name} has duplicate field keys`);
  }
  for (const relationship of relationshipContracts) {
    if (!conceptNames.has(relationship.from)) issues.push(`${relationship.id} has unknown source ${relationship.from}`);
    if (!conceptNames.has(relationship.to)) issues.push(`${relationship.id} has unknown target ${relationship.to}`);
  }
  return issues;
}
