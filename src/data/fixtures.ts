export type Tone = "success" | "warning" | "danger" | "info" | "neutral";

export const prototypeMeta = {
  employer: "Harbor & Pine Labs",
  candidate: "Maya Chen",
  release: "v1.4-wireframe",
  generatedAt: "2026-08-27T09:30:00.000Z",
  fictional: true,
} as const;

export const demoPersonas = [
  { id: "USR-REC-001", name: "Alex Rivera", initials: "AR", role: "Recruiter", access: "Recruiting workspace" },
  { id: "USR-COO-001", name: "Priya Nair", initials: "PN", role: "Recruiting Coordinator", access: "Scheduling & communications" },
  { id: "USR-HM-001", name: "Marcus Johnson", initials: "MJ", role: "Hiring Manager", access: "Requisition & decision" },
  { id: "USR-INT-001", name: "Jordan Lee", initials: "JL", role: "Interviewer", access: "Assigned interviews only" },
  { id: "USR-APR-001", name: "Elena Garcia", initials: "EG", role: "Offer Approver", access: "Offer approvals" },
  { id: "USR-SUP-001", name: "Sam Wilson", initials: "SW", role: "Candidate Support", access: "Minimized candidate context" },
  { id: "USR-INTG-001", name: "Zoe Bennett", initials: "ZB", role: "Application Integrity Reviewer", access: "Restricted integrity cases" },
  { id: "USR-CFG-001", name: "Nina Patel", initials: "NP", role: "Configuration Admin", access: "Workflow configuration" },
  { id: "USR-ADM-001", name: "Ben Carter", initials: "BC", role: "Platform Admin", access: "System administration" },
  { id: "USR-PRV-001", name: "Aisha Rahman", initials: "AR", role: "Privacy & Legal", access: "Restricted governance" },
  { id: "USR-HRI-001", name: "Owen Brooks", initials: "OB", role: "HRIS Operator", access: "Handoff reconciliation" },
  { id: "USR-AUD-001", name: "Mei Lin", initials: "ML", role: "Auditor", access: "Read-only evidence" },
] as const;

export const jobs = [
  {
    id: "JOB-DEMO-001",
    publicId: "product-designer-remote-demo",
    title: "Senior Product Designer",
    team: "Product & Research",
    location: "California · Remote",
    workplace: "Remote",
    type: "Full time",
    pay: "$148,000–$176,000 USD",
    status: "Published",
    posted: "12 days ago",
    version: "Posting v3 · Policy v2",
    summary: "Shape accessible, trustworthy tools for teams doing complex work.",
    requirements: ["6+ years in product design", "Evidence-led systems thinking", "Accessible interaction design", "Cross-functional facilitation"],
  },
  {
    id: "JOB-DEMO-002",
    publicId: "recruiting-operations-demo",
    title: "Recruiting Operations Partner",
    team: "People Operations",
    location: "San Francisco, CA · Hybrid",
    workplace: "Hybrid",
    type: "Full time",
    pay: "$112,000–$138,000 USD",
    status: "Published",
    posted: "5 days ago",
    version: "Posting v1 · Policy v2",
    summary: "Build clear, humane and measurable recruiting operations.",
    requirements: ["4+ years in recruiting operations", "Workflow design experience", "Strong data judgment", "Candidate-centered communication"],
  },
  {
    id: "JOB-DEMO-003",
    publicId: "data-platform-demo",
    title: "Staff Data Platform Engineer",
    team: "Engineering",
    location: "California · Remote",
    workplace: "Remote",
    type: "Full time",
    pay: "$184,000–$224,000 USD",
    status: "Published",
    posted: "2 days ago",
    version: "Posting v2 · Policy v2",
    summary: "Design durable data foundations with privacy and observability built in.",
    requirements: ["8+ years in data engineering", "Distributed-systems experience", "Privacy-aware data design", "Technical leadership"],
  },
] as const;

export const syntheticCandidate = {
  id: "PER-DEMO-001",
  name: "Maya Chen",
  email: "maya.chen@example.test",
  phone: "+1 415 555 0136",
  location: "Oakland, CA",
  resume: "maya-chen-synthetic-resume.pdf",
  experience: "7 years",
} as const;

export const candidateApplications = [
  {
    id: "APP-DEMO-001",
    jobTitle: "Senior Product Designer",
    safeStatus: "Interview scheduling",
    tone: "warning" as Tone,
    nextAction: "Share your availability by Aug 29",
    updated: "Updated today at 10:20 AM",
    detail: "The team would like to arrange a conversation. No internal evaluation is shown here.",
  },
  {
    id: "APP-DEMO-002",
    jobTitle: "Design Systems Lead",
    safeStatus: "Under review",
    tone: "info" as Tone,
    nextAction: "No action needed",
    updated: "Updated Aug 22",
    detail: "Your application is with our team. We will contact you when there is an update.",
  },
] as const;

export type HrScreenKey = "actions" | "job" | "application" | "interview" | "scorecard" | "decision" | "automations" | "governance";

export const personaOperatingModels: Record<string, { screens: HrScreenKey[]; focus: string; queue: string }> = {
  "USR-REC-001": { screens: ["actions", "job", "application", "interview", "scorecard", "decision"], focus: "Candidate progress and evidence readiness", queue: "Recruiter queue" },
  "USR-COO-001": { screens: ["actions", "application", "interview"], focus: "Scheduling, messages and candidate wait time", queue: "Coordination queue" },
  "USR-HM-001": { screens: ["actions", "job", "application", "scorecard", "decision"], focus: "Hiring plan, debrief and human decision", queue: "Hiring manager queue" },
  "USR-INT-001": { screens: ["actions", "interview", "scorecard"], focus: "Assigned interviews and independent evidence", queue: "My assignments" },
  "USR-APR-001": { screens: ["actions", "decision"], focus: "Immutable offer approval", queue: "Approval queue" },
  "USR-SUP-001": { screens: ["actions", "application"], focus: "Candidate-safe support and communications", queue: "Support queue" },
  "USR-INTG-001": { screens: ["actions", "application", "governance"], focus: "Restricted integrity cases", queue: "Integrity queue" },
  "USR-CFG-001": { screens: ["actions", "automations", "governance"], focus: "Versioned workflow configuration", queue: "Configuration queue" },
  "USR-ADM-001": { screens: ["actions", "automations", "governance"], focus: "Platform health and access", queue: "Platform queue" },
  "USR-PRV-001": { screens: ["actions", "governance"], focus: "Privacy requests and policy gates", queue: "Privacy queue" },
  "USR-HRI-001": { screens: ["actions", "decision", "automations"], focus: "Handoff reconciliation", queue: "HRIS queue" },
  "USR-AUD-001": { screens: ["actions", "automations", "governance"], focus: "Read-only evidence and control review", queue: "Audit view" },
};

export type ApplicationRecord = {
  id: string;
  candidateId: string;
  candidate: string;
  initials: string;
  jobId: string;
  job: string;
  stage: string;
  owner: string;
  stageAge: string;
  updated: string;
  tone: Tone;
  version: string;
  nextInternalAction: string;
};

export const applicationRecords: ApplicationRecord[] = [
  { id: "APP-DEMO-001", candidateId: "PER-DEMO-001", candidate: "Maya Chen", initials: "MC", jobId: "JOB-DEMO-001", job: "Senior Product Designer", stage: "Interviews", owner: "Alex Rivera", stageAge: "3 days", updated: "10:20 AM", tone: "warning", version: "v5", nextInternalAction: "Collect Jordan Lee’s scorecard" },
  { id: "APP-DEMO-004", candidateId: "PER-DEMO-004", candidate: "Noah Williams", initials: "NW", jobId: "JOB-DEMO-002", job: "Recruiting Operations Partner", stage: "Scheduling", owner: "Priya Nair", stageAge: "18 hours", updated: "9:48 AM", tone: "info", version: "v3", nextInternalAction: "Propose an interview slot" },
  { id: "APP-DEMO-006", candidateId: "PER-DEMO-006", candidate: "Sofia Martinez", initials: "SM", jobId: "JOB-DEMO-003", job: "Staff Data Platform Engineer", stage: "Recruiter review", owner: "Alex Rivera", stageAge: "1 day", updated: "9:31 AM", tone: "neutral", version: "v2", nextInternalAction: "Complete structured review" },
  { id: "APP-DEMO-009", candidateId: "PER-DEMO-009", candidate: "Ethan Okafor", initials: "EO", jobId: "JOB-DEMO-001", job: "Senior Product Designer", stage: "Screening", owner: "Ops queue", stageAge: "2 days", updated: "8:52 AM", tone: "danger", version: "v4", nextInternalAction: "Resolve failed confirmation" },
  { id: "APP-DEMO-011", candidateId: "PER-DEMO-011", candidate: "Leila Haddad", initials: "LH", jobId: "JOB-DEMO-003", job: "Staff Data Platform Engineer", stage: "Offer approval", owner: "Elena Garcia", stageAge: "6 hours", updated: "Yesterday", tone: "success", version: "v7", nextInternalAction: "Approve offer version 4" },
];

export const interviewRecords = [
  { id: "INT-DEMO-001", applicationId: "APP-DEMO-001", candidate: "Maya Chen", job: "Senior Product Designer", type: "Portfolio review", interviewer: "Jordan Lee", time: "Aug 27 · 11:00 AM PT", state: "Complete", tone: "success" as Tone },
  { id: "INT-DEMO-004", applicationId: "APP-DEMO-004", candidate: "Noah Williams", job: "Recruiting Operations Partner", type: "Recruiter screen", interviewer: "Alex Rivera", time: "Awaiting proposal", state: "Needs scheduling", tone: "warning" as Tone },
  { id: "INT-DEMO-006", applicationId: "APP-DEMO-006", candidate: "Sofia Martinez", job: "Staff Data Platform Engineer", type: "Technical screen", interviewer: "Ravi Shah", time: "Aug 27 · 1:30 PM PT", state: "Confirmed", tone: "info" as Tone },
  { id: "INT-DEMO-009", applicationId: "APP-DEMO-009", candidate: "Ethan Okafor", job: "Senior Product Designer", type: "Hiring manager", interviewer: "Marcus Johnson", time: "Aug 27 · 3:00 PM PT", state: "Confirmed", tone: "info" as Tone },
] as const;

export const assignmentRecords = [
  { id: "ASN-DEMO-001", interviewId: "INT-DEMO-001", applicationId: "APP-DEMO-001", candidate: "Maya Chen", job: "Senior Product Designer", interviewer: "Jordan Lee", state: "Overdue", due: "Today · 4:00 PM", tone: "danger" as Tone },
  { id: "ASN-DEMO-006", interviewId: "INT-DEMO-006", applicationId: "APP-DEMO-006", candidate: "Sofia Martinez", job: "Staff Data Platform Engineer", interviewer: "Ravi Shah", state: "Not started", due: "Tomorrow · 10:00 AM", tone: "warning" as Tone },
  { id: "ASN-DEMO-009", interviewId: "INT-DEMO-009", applicationId: "APP-DEMO-009", candidate: "Ethan Okafor", job: "Senior Product Designer", interviewer: "Marcus Johnson", state: "Submitted", due: "Submitted 8:40 AM", tone: "success" as Tone },
] as const;

export type ScenarioState = {
  id: string;
  candidateLabel: string;
  candidateStatus: string;
  candidateDetail: string;
  candidateNextAction: string;
  applicationStage: string;
  missingScorecards: number;
  interviewState: "Complete" | "Conflict";
  decisionState: "Blocked" | "Ready for decision" | "Offer approval" | "Ready for hire" | "Closed";
  offerState: "Not started" | "Pending approval" | "Accepted";
  handoffState: "Not started" | "Pending acknowledgement" | "Reconciliation failed";
  openingReserved: number;
  openingFilled: number;
  policyBlocked: boolean;
};

const baselineScenario: ScenarioState = {
  id: "SCN-005",
  candidateLabel: "Interview update pending",
  candidateStatus: "Interview complete — update pending",
  candidateDetail: "Your interview is complete. The team is finishing its process; internal evaluation is never shown here.",
  candidateNextAction: "No action needed — expect an update by Aug 29",
  applicationStage: "Interviews",
  missingScorecards: 1,
  interviewState: "Complete",
  decisionState: "Blocked",
  offerState: "Not started",
  handoffState: "Not started",
  openingReserved: 0,
  openingFilled: 0,
  policyBlocked: false,
};

export const scenarioStates: Record<string, ScenarioState> = {
  "SCN-001": { ...baselineScenario, id: "SCN-001", candidateLabel: "Team review complete", candidateStatus: "Team review complete", candidateDetail: "Your interviews are complete and the team is preparing its next human-led step.", candidateNextAction: "No action needed — expect an update by Aug 29", applicationStage: "Debrief", missingScorecards: 0, decisionState: "Ready for decision" },
  "SCN-002": { ...baselineScenario, id: "SCN-002", candidateLabel: "Application closed", candidateStatus: "Application closed", candidateDetail: "The team has completed this application process. Candidate support remains available for process questions.", candidateNextAction: "No action needed", applicationStage: "Closed", missingScorecards: 0, decisionState: "Closed" },
  "SCN-003": { ...baselineScenario, id: "SCN-003", candidateLabel: "Application withdrawn", candidateStatus: "Withdrawn", candidateDetail: "This synthetic application was withdrawn and optional future work was cancelled while history was preserved.", candidateNextAction: "None", applicationStage: "Withdrawn", missingScorecards: 0, decisionState: "Closed" },
  "SCN-004": { ...baselineScenario, id: "SCN-004", candidateLabel: "Choose interview availability", candidateStatus: "Interview scheduling", candidateDetail: "The team would like to arrange a conversation. No internal scheduling conflict is shown here.", candidateNextAction: "Share your availability by Aug 29", interviewState: "Conflict" },
  "SCN-005": baselineScenario,
  "SCN-006": { ...baselineScenario, id: "SCN-006", candidateLabel: "Offer update available", candidateStatus: "Offer update available", candidateDetail: "A revised synthetic offer is ready for your review. The earlier version remains preserved but is no longer current.", candidateNextAction: "Review revised offer version 4", applicationStage: "Offer", missingScorecards: 0, decisionState: "Offer approval", offerState: "Pending approval" },
  "SCN-007": { ...baselineScenario, id: "SCN-007", candidateLabel: "Offer accepted", candidateStatus: "Offer accepted", candidateDetail: "Your synthetic offer response is recorded. The team is completing the hiring handoff.", candidateNextAction: "Complete the fictional pre-hire checklist", applicationStage: "Handoff", missingScorecards: 0, decisionState: "Ready for hire", offerState: "Accepted", handoffState: "Reconciliation failed", openingReserved: 1 },
  "SCN-008": { ...baselineScenario, id: "SCN-008", candidateLabel: "Application received", candidateStatus: "Application received", candidateDetail: "Your application is active while the team completes a routine record check.", candidateNextAction: "No action needed", applicationStage: "Recruiter review", missingScorecards: 0, decisionState: "Blocked" },
  "SCN-009": { ...baselineScenario, id: "SCN-009", candidateLabel: "Contact update needed", candidateStatus: "Action needed", candidateDetail: "We could not confirm delivery of a process message. Your application remains active.", candidateNextAction: "Preview candidate support", applicationStage: "Screening", missingScorecards: 0, decisionState: "Blocked" },
  "SCN-010": { ...baselineScenario, id: "SCN-010", candidateLabel: "Interview update pending", candidateStatus: "Interview update pending", candidateDetail: "Your interview record is being reconciled. No action is required while the team confirms the current update.", candidateNextAction: "No action needed", missingScorecards: 0, decisionState: "Blocked" },
  "SCN-011": { ...baselineScenario, id: "SCN-011", candidateLabel: "Application progress demo", candidateStatus: "Interview complete — update pending", candidateDetail: "Your interview is complete. Internal access checks never change the candidate information shown here.", candidateNextAction: "No action needed", missingScorecards: 0, decisionState: "Ready for decision" },
  "SCN-012": { ...baselineScenario, id: "SCN-012", candidateLabel: "Job details under review", candidateStatus: "Application received", candidateDetail: "Your application remains active while the team reviews a job-location detail.", candidateNextAction: "No action needed", applicationStage: "Recruiter review", missingScorecards: 0, decisionState: "Blocked", interviewState: "Complete", policyBlocked: true },
};

export function resolveScenarioState(id: string): ScenarioState {
  return scenarioStates[id] ?? { ...baselineScenario, id, candidateLabel: "Application progress demo" };
}

export const actionItems = [
  { id: "WORK-101", label: "Scorecard overdue", subject: "Maya Chen · Senior Product Designer", owner: "You", age: "6h overdue", tone: "danger" as Tone, why: "Required interview evidence is missing; decision readiness is blocked.", source: "Scorecard assignment v2 · fresh 3 min ago" },
  { id: "WORK-102", label: "Candidate waiting", subject: "Noah Williams · Recruiting Operations Partner", owner: "Recruiting queue", age: "18h waiting", tone: "warning" as Tone, why: "Availability was received and no coordinator has proposed a session.", source: "Availability v1 · fresh 7 min ago" },
  { id: "WORK-103", label: "Message failed", subject: "Confirmation bounce · APP-DEMO-009", owner: "Ops queue", age: "2 retries", tone: "danger" as Tone, why: "Delivery failed twice; automatic retry is exhausted and manual contact is owned.", source: "Message attempt 3 · fresh 1 min ago" },
  { id: "WORK-104", label: "Approval due", subject: "Leila Haddad · Staff Data Platform Engineer", owner: "Elena Garcia", age: "Due in 4h", tone: "info" as Tone, why: "The current immutable offer version needs one final human approval.", source: "Approval policy v2 · fresh 4 min ago" },
  { id: "WORK-105", label: "Handoff failed", subject: "Maya Chen · HAND-DEMO-01", owner: "HRIS queue", age: "2 attempts", tone: "danger" as Tone, why: "The accepted offer is reserved but the exact handoff version has not been acknowledged.", source: "Handoff attempt 2 · fresh 1 min ago" },
] as const;

export const recentApplications = [
  { id: "APP-DEMO-001", candidate: "Maya Chen", job: "Senior Product Designer", stage: "Interviews", owner: "Alex Rivera", updated: "10:20 AM", tone: "warning" as Tone },
  { id: "APP-DEMO-004", candidate: "Noah Williams", job: "Recruiting Operations Partner", stage: "Scheduling", owner: "Priya Nair", updated: "9:48 AM", tone: "info" as Tone },
  { id: "APP-DEMO-006", candidate: "Sofia Martinez", job: "Staff Data Platform Engineer", stage: "Recruiter review", owner: "Alex Rivera", updated: "9:31 AM", tone: "neutral" as Tone },
  { id: "APP-DEMO-009", candidate: "Ethan Okafor", job: "Senior Product Designer", stage: "Message failed", owner: "Ops queue", updated: "8:52 AM", tone: "danger" as Tone },
  { id: "APP-DEMO-011", candidate: "Leila Haddad", job: "Staff Data Platform Engineer", stage: "Offer approval", owner: "Elena Garcia", updated: "Yesterday", tone: "success" as Tone },
] as const;

export const todaySessions = [
  { time: "9:30 AM", candidate: "Noah Williams", interview: "Recruiter screen", interviewer: "Alex Rivera", state: "Complete" },
  { time: "11:00 AM", candidate: "Maya Chen", interview: "Portfolio review", interviewer: "Jordan Lee", state: "Conflict" },
  { time: "1:30 PM", candidate: "Sofia Martinez", interview: "Technical screen", interviewer: "Ravi Shah", state: "Confirmed" },
  { time: "3:00 PM", candidate: "Ethan Okafor", interview: "Hiring manager", interviewer: "Marcus Johnson", state: "Confirmed" },
] as const;

export const privacyRequests = [
  { id: "PRV-DEMO-014", person: "Taylor Kim", type: "Access", received: "Aug 24", due: "Sep 22", owner: "Aisha Rahman", state: "Identity review" },
  { id: "PRV-DEMO-012", person: "Jamie Brooks", type: "Deletion", received: "Aug 20", due: "Sep 18", owner: "Privacy queue", state: "Legal hold check" },
  { id: "PRV-DEMO-009", person: "Morgan Diaz", type: "Correction", received: "Aug 18", due: "Sep 16", owner: "Sam Wilson", state: "In progress" },
] as const;

export const pipeline = [
  { stage: "New", count: 14, change: "+3" },
  { stage: "Review", count: 9, change: "−1" },
  { stage: "Screen", count: 5, change: "+1" },
  { stage: "Interview", count: 4, change: "0" },
  { stage: "Offer", count: 1, change: "+1" },
] as const;

export const scorecard = [
  { competency: "Systems thinking", evidence: "Connected fragmented workflow evidence into a coherent model.", rating: "Strong evidence" },
  { competency: "Accessible design", evidence: "Explained keyboard and error-recovery decisions with measured outcomes.", rating: "Strong evidence" },
  { competency: "Collaboration", evidence: "Example covered disagreement, but outcome evidence needs clarification.", rating: "Mixed evidence" },
] as const;

export const automationRuns = [
  { id: "RUN-402", rule: "AUT-008 · Scorecard reminder", state: "Succeeded", tone: "success" as Tone, key: "ASN-18:2026-08-25T08:00:reminder", attempts: "1 attempt" },
  { id: "RUN-403", rule: "AUT-014 · Communication eligibility", state: "Suppressed", tone: "neutral" as Tone, key: "PER-09:EVD-7:eligibility", attempts: "Policy guard" },
  { id: "RUN-404", rule: "AUT-015 · Integration reconciliation", state: "Needs review", tone: "danger" as Tone, key: "calendar:evt-demo-18:project", attempts: "Duplicate ignored · conflict retained" },
] as const;

export const auditEvents = [
  { time: "10:26:14", actor: "Recruiter demo user", event: "Viewed application safe context", outcome: "Allowed", ref: "EVT-DEMO-108" },
  { time: "10:22:03", actor: "Automation simulator", event: "Suppressed stale reminder", outcome: "No side effect", ref: "EVT-DEMO-107" },
  { time: "10:18:51", actor: "Support demo user", event: "Requested restricted export", outcome: "Denied safely", ref: "EVT-DEMO-106" },
] as const;
