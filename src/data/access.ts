import type { AnalyticsApplication } from "./analytics";
import {
  applicationRecords,
  assignmentRecords,
  interviewRecords,
  jobs,
  type ApplicationRecord,
} from "./fixtures";
import type { ObjectContract, ObjectDataPoint } from "./objectCatalog";
import type {
  AssignmentRecord,
  CandidateRecord,
  InterviewRecord,
  JobRecord,
} from "./coreRecords";

export type DataScope = {
  population: string;
  identity: "full" | "masked" | "none";
  contact: "full" | "masked" | "none";
  decisionEvidence: "full" | "assigned-only" | "summary" | "none";
  compensation: "full" | "band-only" | "none";
  accommodation: "logistics-only" | "restricted" | "none";
  privacy: "full" | "case-status" | "none";
  integrity: "full" | "case-status" | "none";
  export: "governed" | "aggregate-only" | "none";
};

export const roleDataScopes: Record<string, DataScope> = {
  Recruiter: {
    population: "Owned and team-assigned requisitions/applications",
    identity: "full",
    contact: "full",
    decisionEvidence: "summary",
    compensation: "band-only",
    accommodation: "logistics-only",
    privacy: "case-status",
    integrity: "case-status",
    export: "governed",
  },
  "Recruiting Coordinator": {
    population: "Applications requiring scheduling or communication",
    identity: "full",
    contact: "full",
    decisionEvidence: "none",
    compensation: "none",
    accommodation: "logistics-only",
    privacy: "none",
    integrity: "none",
    export: "aggregate-only",
  },
  "Hiring Manager": {
    population: "Applications for managed requisitions",
    identity: "full",
    contact: "masked",
    decisionEvidence: "summary",
    compensation: "band-only",
    accommodation: "logistics-only",
    privacy: "none",
    integrity: "case-status",
    export: "aggregate-only",
  },
  Interviewer: {
    population: "Only assigned interview sessions and scorecards",
    identity: "masked",
    contact: "none",
    decisionEvidence: "assigned-only",
    compensation: "none",
    accommodation: "logistics-only",
    privacy: "none",
    integrity: "none",
    export: "none",
  },
  "Offer Approver": {
    population: "Only current offer approval subjects",
    identity: "masked",
    contact: "none",
    decisionEvidence: "summary",
    compensation: "full",
    accommodation: "none",
    privacy: "none",
    integrity: "case-status",
    export: "none",
  },
  "Candidate Support": {
    population: "Owned service-recovery and communication cases",
    identity: "full",
    contact: "full",
    decisionEvidence: "none",
    compensation: "none",
    accommodation: "logistics-only",
    privacy: "case-status",
    integrity: "none",
    export: "none",
  },
  "Application Integrity Reviewer": {
    population: "Assigned integrity cases",
    identity: "masked",
    contact: "none",
    decisionEvidence: "none",
    compensation: "none",
    accommodation: "none",
    privacy: "none",
    integrity: "full",
    export: "none",
  },
  "Configuration Admin": {
    population: "Configuration and synthetic impact projections",
    identity: "none",
    contact: "none",
    decisionEvidence: "none",
    compensation: "none",
    accommodation: "none",
    privacy: "none",
    integrity: "none",
    export: "aggregate-only",
  },
  "Platform Admin": {
    population: "Platform, integration, and minimized troubleshooting facts",
    identity: "masked",
    contact: "none",
    decisionEvidence: "none",
    compensation: "none",
    accommodation: "none",
    privacy: "case-status",
    integrity: "case-status",
    export: "aggregate-only",
  },
  "Privacy & Legal": {
    population: "Verified privacy/policy scopes and minimized hiring context",
    identity: "full",
    contact: "masked",
    decisionEvidence: "summary",
    compensation: "band-only",
    accommodation: "restricted",
    privacy: "full",
    integrity: "case-status",
    export: "governed",
  },
  "HRIS Operator": {
    population: "Accepted-offer and handoff subjects",
    identity: "full",
    contact: "masked",
    decisionEvidence: "none",
    compensation: "full",
    accommodation: "logistics-only",
    privacy: "none",
    integrity: "none",
    export: "none",
  },
  Auditor: {
    population: "Read-only evidence across approved audit scope",
    identity: "masked",
    contact: "none",
    decisionEvidence: "summary",
    compensation: "band-only",
    accommodation: "restricted",
    privacy: "case-status",
    integrity: "case-status",
    export: "governed",
  },
};

const anchorApplicationIdsByRole: Record<string, string[]> = {
  Recruiter: applicationRecords.map((row) => row.id),
  "Recruiting Coordinator": ["APP-DEMO-001", "APP-DEMO-004", "APP-DEMO-009"],
  "Hiring Manager": [
    "APP-DEMO-001",
    "APP-DEMO-006",
    "APP-DEMO-009",
    "APP-DEMO-011",
  ],
  Interviewer: ["APP-DEMO-001"],
  "Offer Approver": ["APP-DEMO-011"],
  "Candidate Support": ["APP-DEMO-004", "APP-DEMO-009"],
  "Application Integrity Reviewer": ["APP-DEMO-009"],
  "Configuration Admin": [],
  "Platform Admin": ["APP-DEMO-009"],
  "Privacy & Legal": ["APP-DEMO-001", "APP-DEMO-009"],
  "HRIS Operator": ["APP-DEMO-001", "APP-DEMO-011"],
  Auditor: applicationRecords.map((row) => row.id),
};

export function visibleApplicationsForRole(role: string): ApplicationRecord[] {
  return visibleApplications(role, applicationRecords);
}

export function visibleApplications(
  role: string,
  records: ApplicationRecord[],
): ApplicationRecord[] {
  const anchors = new Set(anchorApplicationIdsByRole[role] ?? []);
  if (["Recruiter", "Auditor"].includes(role)) return records;
  const inStableSample = (id: string, divisor: number) =>
    [...id].reduce((total, character) => total + character.charCodeAt(0), 0) %
      divisor ===
    0;
  return records.filter((row) => {
    if (anchors.has(row.id)) return true;
    if (role === "Recruiting Coordinator")
      return ["Scheduling", "Interviews", "Debrief"].includes(row.stage);
    if (role === "Hiring Manager")
      return ["JOB-DEMO-001", "JOB-DEMO-003"].includes(row.jobId) ||
        inStableSample(row.jobId, 4);
    if (role === "Offer Approver") return row.stage === "Offer";
    if (role === "Candidate Support")
      return (
        ["Scheduling", "Withdrawn"].includes(row.stage) &&
        inStableSample(row.id, 3)
      );
    if (role === "Application Integrity Reviewer")
      return row.stage === "Screening" && inStableSample(row.id, 7);
    if (role === "Platform Admin") return inStableSample(row.id, 17);
    if (role === "Privacy & Legal") return inStableSample(row.id, 11);
    if (role === "HRIS Operator") return ["Offer", "Hired"].includes(row.stage);
    return false;
  });
}

export function visibleJobsForRole(role: string) {
  return visibleJobs(role, jobs as unknown as JobRecord[], applicationRecords);
}

export function visibleJobs(
  role: string,
  records: JobRecord[],
  applications: ApplicationRecord[],
) {
  const applicationJobIds = new Set(
    visibleApplications(role, applications).map((row) => row.jobId),
  );
  if (
    [
      "Recruiter",
      "Configuration Admin",
      "Platform Admin",
      "Privacy & Legal",
      "Auditor",
    ].includes(role)
  )
    return records;
  return records.filter((row) => applicationJobIds.has(row.id));
}

export function visibleInterviewsForRole(role: string) {
  return visibleInterviews(
    role,
    interviewRecords as unknown as InterviewRecord[],
    applicationRecords,
  );
}

export function visibleInterviews(
  role: string,
  records: InterviewRecord[],
  applications: ApplicationRecord[],
) {
  if (role === "Interviewer")
    return records.filter((row) => row.interviewer === "Jordan Lee");
  const ids = new Set(visibleApplications(role, applications).map((row) => row.id));
  return records.filter((row) => ids.has(row.applicationId));
}

export function visibleAssignmentsForRole(role: string) {
  return visibleAssignments(
    role,
    assignmentRecords as unknown as AssignmentRecord[],
    applicationRecords,
  );
}

export function visibleAssignments(
  role: string,
  records: AssignmentRecord[],
  applications: ApplicationRecord[],
) {
  if (role === "Interviewer")
    return records.filter((row) => row.interviewer === "Jordan Lee");
  const ids = new Set(visibleApplications(role, applications).map((row) => row.id));
  return records.filter((row) => ids.has(row.applicationId));
}

export function visibleCandidates(
  role: string,
  candidates: CandidateRecord[],
  applications: ApplicationRecord[],
) {
  if (role === "Recruiter" || role === "Auditor") return candidates;
  const candidateIds = new Set(
    visibleApplications(role, applications).map((row) => row.candidateId),
  );
  return candidates.filter((candidate) => candidateIds.has(candidate.id));
}

export type CoreRecordKind = "job" | "candidate" | "application";

export const coreRecordPermissions: Record<
  CoreRecordKind,
  { create: string[]; edit: string[] }
> = {
  job: {
    create: ["Recruiter", "Hiring Manager"],
    edit: ["Recruiter", "Hiring Manager"],
  },
  candidate: { create: ["Recruiter"], edit: ["Recruiter"] },
  application: {
    create: ["Recruiter"],
    edit: ["Recruiter", "Recruiting Coordinator"],
  },
};

export function canManageCoreRecord(
  role: string,
  kind: CoreRecordKind,
  action: "create" | "edit",
) {
  return coreRecordPermissions[kind][action].includes(role);
}

export function displayCandidateForRole(
  role: string,
  record: { id: string; candidate: string },
) {
  const scope = roleDataScopes[role];
  if (!scope || scope.identity === "none")
    return `Restricted subject · ${record.id}`;
  if (scope.identity === "masked")
    return `${record.candidate.split(" ")[0]} ${record.candidate.split(" ")[1]?.slice(0, 1) ?? ""}. · ${record.id}`;
  return record.candidate;
}

export function analyticsRowsForRole(
  role: string,
  rows: AnalyticsApplication[],
) {
  if (["Recruiter", "Auditor"].includes(role)) return rows;
  const predicates: Record<
    string,
    (row: AnalyticsApplication, index: number) => boolean
  > = {
    "Recruiting Coordinator": (row) =>
      ["Scheduling", "Interviews", "Debrief"].includes(row.stage) ||
      ["Queued", "Failed"].includes(row.messageState),
    "Hiring Manager": (row) =>
      ["JOB-DEMO-001", "JOB-DEMO-003"].includes(row.jobId),
    Interviewer: (row, index) =>
      row.jobId === "JOB-DEMO-001" && index % 4 === 0,
    "Offer Approver": (row) => row.offerState !== "Not started",
    "Candidate Support": (row) =>
      ["Queued", "Failed"].includes(row.messageState),
    "Application Integrity Reviewer": (row) => row.integrityState !== "None",
    "Configuration Admin": (row) => row.automationState !== "Manual",
    "Platform Admin": (row) =>
      row.automationState === "Failed" ||
      row.messageState === "Failed" ||
      row.handoffState === "Failed",
    "Privacy & Legal": (row) =>
      row.privacyState !== "None" || row.integrityState !== "None",
    "HRIS Operator": (row) =>
      row.handoffState !== "Not ready" || row.offerState === "Accepted",
  };
  const predicate = predicates[role] ?? (() => false);
  return rows.filter(predicate);
}

export function canReadObject(role: string, object: ObjectContract) {
  return role === "Auditor" || object.personas.includes(role);
}

export function canCreateObject(role: string, object: ObjectContract) {
  if (!canReadObject(role, object) || role === "Auditor") return false;
  return object.dataPoints.some((field) => field.writeRoles.includes(role));
}

export function fieldAccessForRole(role: string, field: ObjectDataPoint) {
  return {
    read: field.readRoles.includes(role) || role === "Auditor",
    write: field.writeRoles.includes(role) && role !== "Auditor",
  };
}
