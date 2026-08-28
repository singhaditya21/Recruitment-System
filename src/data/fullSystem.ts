export type JourneyStatus = "Draft" | "Ready" | "Active" | "Blocked" | "Complete" | "Cancelled";

export type CandidateTaskDetail = {
  id: string;
  purpose: string;
  instructions: string[];
  inputs: { label: string; type: "text" | "select" | "textarea" | "checkbox"; options?: string[] }[];
  consent: string;
  support: string;
  failure: string;
  recovery: string;
};

export const candidateTaskDetails: CandidateTaskDetail[] = [
  { id: "CTK-001", purpose: "Demonstrate product reasoning through a bounded work sample.", instructions: ["Review the accessible brief", "Choose a 60-minute window", "Submit the prepared synthetic response", "Receive a completion receipt"], inputs: [{ label: "Preferred assessment window", type: "select", options: ["Today · 2:00 PM PT", "Tomorrow · 10:00 AM PT", "Request another window"] }, { label: "Accessibility or format preference", type: "select", options: ["Standard accessible web format", "Extended time", "Screen-reader optimized", "Request private support"] }], consent: "ASSESS-NOTICE-v4 · task-only processing", support: "Assessment support is separated from hiring evidence.", failure: "Provider unavailable or invitation expired", recovery: "Keep the task unstarted and issue a version-bound replacement" },
  { id: "CTK-002", purpose: "Collect candidate-authorized professional references.", instructions: ["Review the reference notice", "Add or replace up to two references", "Choose reminder permission", "Track provider-safe completion"], inputs: [{ label: "Reference relationship", type: "select", options: ["Former manager", "Peer", "Client or partner"] }, { label: "Reference email fixture", type: "text" }, { label: "Allow one reminder", type: "checkbox" }], consent: "REFERENCE-NOTICE-v3 · named-recipient authority", support: "A reference can be replaced without revealing submitted content.", failure: "Reference declines, email bounces or authority expires", recovery: "Cancel the old invitation and create a new reference slot" },
  { id: "CTK-003", purpose: "Review the background-check notice before any provider request.", instructions: ["Read the jurisdiction-specific notice", "Review categories and rights", "Choose consent or private support", "Receive an authorization receipt"], inputs: [{ label: "Notice format", type: "select", options: ["Accessible HTML", "Large print preview", "Spanish preview"] }, { label: "I reviewed the disclosure and authorization", type: "checkbox" }], consent: "NOTICE-BGC-US-CA-v7 · explicit authorization required", support: "Private correction and accessibility routes are available before consent.", failure: "Identity mismatch, provider failure or withdrawn authorization", recovery: "Pause the check, retain the last safe state and open an owned correction case" },
  { id: "CTK-004", purpose: "Review pre-adverse information and exercise correction rights.", instructions: ["Open the candidate-safe report summary", "Review rights and response deadline", "Submit a correction or dispute", "Track the paused decision"], inputs: [{ label: "Response", type: "select", options: ["I need more time", "Information is incorrect", "Identity does not match", "No correction"] }, { label: "Correction details", type: "textarea" }], consent: "NOTICE-PAA-US-CA-v5 · response window protected", support: "The hiring decision remains paused throughout the response window.", failure: "Notice delivery failure or report version changes", recovery: "Invalidate the old response link and reissue the complete current notice set" },
  { id: "CTK-005", purpose: "Review the completed structured work-sample receipt.", instructions: ["View task version", "Review completion timestamp", "Request accessibility support", "Retain candidate-safe receipt"], inputs: [], consent: "ASSESS-NOTICE-v4", support: "Provider scores and internal review remain excluded.", failure: "Receipt mismatch", recovery: "Reconcile by task business key without producing another assessment" },
  { id: "CTK-006", purpose: "Replace an expired analytics exercise window safely.", instructions: ["Review expired invitation", "Choose a replacement window", "Confirm notice version", "Receive a new link receipt"], inputs: [{ label: "Replacement reason", type: "select", options: ["Link expired", "Accessibility support", "Technical interruption"] }, { label: "Preferred replacement window", type: "select", options: ["Next business day", "Within three business days", "Ask coordinator"] }], consent: "ASSESS-NOTICE-v4 · replacement preserves attempt count", support: "The expired link cannot submit or produce a score.", failure: "Repeated expiry or no remaining attempt", recovery: "Escalate to a human coordinator with the prior attempt history" },
];

export type RecruitingEventAdmin = {
  id: string; name: string; type: string; date: string; locale: string; capacity: number; registered: number; checkedIn: number; waitlist: number; status: JourneyStatus; owner: string; channel: string; failure: string;
};

export const recruitingEventAdmin: RecruitingEventAdmin[] = Array.from({ length: 12 }, (_, index) => ({
  id: `REV-DEMO-${String(index + 1).padStart(3, "0")}`,
  name: ["Design systems roundtable", "Data platform open house", "Early-career studio", "Security community meetup"][index % 4] + (index > 3 ? ` · ${Math.floor(index / 4) + 1}` : ""),
  type: ["Community", "Open house", "Campus", "Hiring event"][index % 4],
  date: `Sep ${4 + index}, 2026 · ${index % 2 ? "10:00 AM" : "4:00 PM"} PT`,
  locale: ["en-US", "es-US", "en-GB", "en-IN"][index % 4],
  capacity: 80 + index * 20,
  registered: 54 + index * 17,
  checkedIn: index < 3 ? 31 + index * 9 : 0,
  waitlist: index % 3 === 0 ? 14 + index : 0,
  status: (["Active", "Ready", "Draft", "Complete", "Blocked"] as JourneyStatus[])[index % 5],
  owner: ["Priya Nair", "Alex Rivera", "Jordan Lee"][index % 3],
  channel: ["Public careers", "Campus QR", "Talent community", "Partner invitation"][index % 4],
  failure: ["None", "Capacity reached", "Venue confirmation pending", "Check-in reconciliation required"][index % 4],
}));

export type HighVolumeCohort = { id: string; campaignId: string; name: string; applications: number; capacity: number; ready: number; exceptions: number; owner: string; state: JourneyStatus; nextAction: string };
export const highVolumeCohorts: HighVolumeCohort[] = Array.from({ length: 48 }, (_, index) => ({
  id: `COH-DEMO-${String(index + 1).padStart(3, "0")}`,
  campaignId: `HVC-${String((index % 8) + 1).padStart(3, "0")}`,
  name: ["West cohort", "East cohort", "International cohort", "Accessibility-supported cohort", "Overflow review", "Late applicant review"][index % 6],
  applications: 60 + (index * 37) % 440,
  capacity: 45 + (index % 6) * 25,
  ready: 22 + (index * 11) % 80,
  exceptions: (index * 7) % 19,
  owner: ["Priya Nair", "Alex Rivera", "Jordan Lee", "Morgan Reyes"][index % 4],
  state: (["Draft", "Ready", "Active", "Blocked", "Complete"] as JourneyStatus[])[index % 5],
  nextAction: ["Validate eligibility snapshot", "Release bounded invitations", "Resolve capacity exceptions", "Reconcile attendance", "Close cohort with evidence"][index % 5],
}));

export type AgencyAssignment = { id: string; agency: string; job: string; openings: number; fee: string; start: string; end: string; regions: string; submissions: number; status: JourneyStatus; owner: string; termsVersion: string };
export const agencyAssignments: AgencyAssignment[] = Array.from({ length: 12 }, (_, index) => ({
  id: `AGA-DEMO-${String(index + 1).padStart(3, "0")}`,
  agency: ["Northstar Product Search", "Synthetic Engineering Partners", "Beacon People Advisory", "Atlas Finance Talent"][index % 4],
  job: ["Senior Product Designer", "Staff Data Platform Engineer", "Recruiting Operations Partner", "Security Engineer"][index % 4],
  openings: 1 + index % 4,
  fee: `${18 + index % 5}% first-year base`,
  start: `2026-08-${String(10 + index).padStart(2, "0")}`,
  end: `2026-1${index % 3}-${String(10 + index).padStart(2, "0")}`,
  regions: ["US-CA · Remote", "US · UK", "US-NY", "IN-KA · SG"][index % 4],
  submissions: 3 + (index * 5) % 17,
  status: (["Active", "Ready", "Draft", "Blocked", "Complete"] as JourneyStatus[])[index % 5],
  owner: ["Alex Rivera", "Priya Nair", "Morgan Reyes"][index % 3],
  termsVersion: `AGENCY-TERMS-v${3 + index % 4}`,
}));

export type ReferrerCase = { id: string; candidate: string; job: string; permission: string; relationship: string; status: JourneyStatus; reward: string; milestone: string; dispute: string };
export const referrerCases: ReferrerCase[] = Array.from({ length: 16 }, (_, index) => ({
  id: `REF-PORTAL-${String(index + 1).padStart(3, "0")}`,
  candidate: ["Maya Chen", "Noah Williams", "Sofia Rodriguez", "Liam Patel"][index % 4],
  job: ["Senior Product Designer", "Staff Data Platform Engineer", "Recruiting Operations Partner", "Security Engineer"][index % 4],
  permission: index % 5 === 0 ? "Awaiting candidate permission" : "Candidate permission recorded",
  relationship: ["Former colleague", "Professional community", "Previous manager", "University peer"][index % 4],
  status: (["Draft", "Ready", "Active", "Blocked", "Complete"] as JourneyStatus[])[index % 5],
  reward: index % 3 === 1 ? "$0 · policy exclusion" : `$${1000 + (index % 4) * 500}`,
  milestone: ["Permission", "Application created", "Start confirmed", "Retention window"][index % 4],
  dispute: index % 7 === 0 ? "Reward eligibility review" : "None",
}));

export type FacilitiesRequest = { id: string; newHire: string; site: string; item: string; due: string; dependency: string; status: JourneyStatus; accessLevel: string; cancellation: string };
export const facilitiesRequests: FacilitiesRequest[] = Array.from({ length: 24 }, (_, index) => ({
  id: `FAC-DEMO-${String(index + 1).padStart(3, "0")}`,
  newHire: ["Maya Chen", "Noah Williams", "Sofia Rodriguez", "Liam Patel", "Ava Thompson", "Ethan Kim"][index % 6],
  site: ["San Francisco HQ", "Austin office", "London office", "Remote"][index % 4],
  item: ["Building badge", "Accessible desk", "Parking permit", "Locker assignment", "Visitor access", "Equipment storage"][index % 6],
  due: `Sep ${2 + index % 20}`,
  dependency: index % 5 === 0 ? "Start-date confirmation" : "Approved worker and site",
  status: (["Draft", "Ready", "Active", "Blocked", "Complete", "Cancelled"] as JourneyStatus[])[index % 6],
  accessLevel: ["Business hours", "Standard office", "Visitor only", "No physical access"][index % 4],
  cancellation: "Revoke badge/site assignment and reconcile destination receipt",
}));

export type ManagerRecruitingItem = { id: string; job: string; type: "Requisition" | "Pipeline" | "Interview plan" | "Debrief" | "Decision"; candidate: string; due: string; status: JourneyStatus; blockers: string; evidence: string };
export const managerRecruitingItems: ManagerRecruitingItem[] = Array.from({ length: 20 }, (_, index) => ({
  id: `MGR-REC-${String(index + 1).padStart(3, "0")}`,
  job: ["Senior Product Designer", "Staff Data Platform Engineer", "Recruiting Operations Partner"][index % 3],
  type: (["Requisition", "Pipeline", "Interview plan", "Debrief", "Decision"] as const)[index % 5],
  candidate: index % 5 < 2 ? "Not applicable" : ["Maya Chen", "Noah Williams", "Sofia Rodriguez"][index % 3],
  due: ["Today", "Tomorrow", "Sep 3", "Sep 5"][index % 4],
  status: (["Draft", "Ready", "Active", "Blocked", "Complete"] as JourneyStatus[])[index % 5],
  blockers: index % 4 === 0 ? "Missing scorecard or approval" : "None",
  evidence: ["Headcount and outcomes", "Stage aging and capacity", "Competency coverage", "Independent scorecards", "Decision rationale"][index % 5],
}));

export type InterviewerPortalItem = { id: string; candidate: string; job: string; session: string; timezone: string; focus: string; status: JourneyStatus; conflict: string; scorecardVersion: string };
export const interviewerPortalItems: InterviewerPortalItem[] = Array.from({ length: 12 }, (_, index) => ({
  id: `IVP-DEMO-${String(index + 1).padStart(3, "0")}`,
  candidate: ["Maya Chen", "Restricted candidate", "Sofia Rodriguez", "Liam Patel"][index % 4],
  job: ["Senior Product Designer", "Staff Data Platform Engineer", "Recruiting Operations Partner"][index % 3],
  session: `Sep ${2 + index} · ${9 + index % 5}:00 AM PT`,
  timezone: "America/Los_Angeles",
  focus: ["Product thinking", "Technical systems", "Collaboration", "Role craft"][index % 4],
  status: (["Ready", "Active", "Blocked", "Complete"] as JourneyStatus[])[index % 4],
  conflict: index % 5 === 0 ? "Potential prior relationship" : "None declared",
  scorecardVersion: `SCORECARD-v${4 + index % 3}`,
}));

export type BuddyPlan = { id: string; newHire: string; buddy: string; start: string; location: string; goals: string[]; checkIns: number; status: JourneyStatus };
export const buddyPlans: BuddyPlan[] = Array.from({ length: 12 }, (_, index) => ({
  id: `BDY-DEMO-${String(index + 1).padStart(3, "0")}`,
  newHire: ["Maya Chen", "Noah Williams", "Sofia Rodriguez", "Liam Patel"][index % 4],
  buddy: ["Avery Brooks", "Taylor Morgan", "Jordan Lee", "Priya Shah"][index % 4],
  start: `Sep ${10 + index}`,
  location: ["Remote", "San Francisco", "Austin", "London"][index % 4],
  goals: ["Team context", "Working agreements", "First-week connection", "Accessibility check-in"],
  checkIns: 2 + index % 4,
  status: (["Ready", "Active", "Blocked", "Complete"] as JourneyStatus[])[index % 4],
}));

export type MobilityOpportunity = { id: string; title: string; team: string; location: string; eligibility: string; interestState: JourneyStatus; managerVisibility: string; skills: string[]; closing: string };
export const mobilityOpportunities: MobilityOpportunity[] = Array.from({ length: 18 }, (_, index) => ({
  id: `MOB-DEMO-${String(index + 1).padStart(3, "0")}`,
  title: ["Senior Product Designer", "Design Systems Lead", "Product Operations Manager", "Staff Researcher", "Accessibility Program Lead", "Data Product Manager"][index % 6],
  team: ["Product Design", "Platform", "Operations", "Research"][index % 4],
  location: ["Remote · US", "San Francisco · Hybrid", "London · Hybrid", "Austin · Hybrid"][index % 4],
  eligibility: index % 5 === 0 ? "Review tenure exception" : "Eligible to express interest",
  interestState: (["Draft", "Ready", "Active", "Blocked", "Complete"] as JourneyStatus[])[index % 5],
  managerVisibility: ["Private until submitted", "Employee chooses disclosure", "Manager notified after consent"][index % 3],
  skills: ["Product strategy", "Systems thinking", "Inclusive design"],
  closing: `Sep ${8 + index % 18}`,
}));

export type BenefitElection = { id: string; country: string; plan: string; coverage: string; effective: string; deadline: string; status: JourneyStatus; evidence: string };
export const benefitElections: BenefitElection[] = Array.from({ length: 12 }, (_, index) => ({
  id: `BEN-DEMO-${String(index + 1).padStart(3, "0")}`,
  country: ["United States", "United Kingdom", "India", "Canada"][index % 4],
  plan: ["Medical", "Dental", "Retirement", "Life and disability"][index % 4],
  coverage: ["Employee", "Employee + partner", "Family", "Waive with reason"][index % 4],
  effective: "First day of employment",
  deadline: `Sep ${12 + index}`,
  status: (["Draft", "Ready", "Active", "Blocked", "Complete"] as JourneyStatus[])[index % 5],
  evidence: `BEN-PACK-${["US", "GB", "IN", "CA"][index % 4]}-v${3 + index % 4}`,
}));

export type LearningEnrollment = { id: string; title: string; type: string; due: string; duration: string; accessibility: string; status: JourneyStatus; prerequisite: string };
export const learningEnrollments: LearningEnrollment[] = Array.from({ length: 16 }, (_, index) => ({
  id: `LRN-DEMO-${String(index + 1).padStart(3, "0")}`,
  title: ["Welcome to Harbor & Pine", "Security and privacy", "Inclusive collaboration", "Product foundations", "Manager essentials", "Country workplace policy", "Responsible AI", "Customer context"][index % 8],
  type: ["Self-paced", "Live session", "Manager-led", "Cohort workshop"][index % 4],
  due: `Day ${1 + (index % 6) * 15}`,
  duration: `${20 + (index % 4) * 15} minutes`,
  accessibility: "Transcript, captions and keyboard-complete alternative",
  status: (["Draft", "Ready", "Active", "Blocked", "Complete"] as JourneyStatus[])[index % 5],
  prerequisite: index % 4 === 0 ? "Identity activated" : "None",
}));

export type TransitionCase = { id: string; person: string; type: "Rehire" | "Crossboarding" | "Relocation" | "Contingent" | "Offboarding" | "Rescission" | "Delayed start" | "No show"; effective: string; owner: string; status: JourneyStatus; affected: string[]; nextAction: string; failure: string };
export const transitionCases: TransitionCase[] = Array.from({ length: 32 }, (_, index) => ({
  id: `TRN-DEMO-${String(index + 1).padStart(3, "0")}`,
  person: ["Maya Chen", "Noah Williams", "Sofia Rodriguez", "Liam Patel", "Ava Thompson", "Ethan Kim", "Isabella Rossi", "Lucas Martin"][index % 8],
  type: (["Rehire", "Crossboarding", "Relocation", "Contingent", "Offboarding", "Rescission", "Delayed start", "No show"] as const)[index % 8],
  effective: `2026-09-${String(1 + index % 27).padStart(2, "0")}`,
  owner: ["People Operations", "HRIS Operations", "Recruiter", "Manager", "IT Operations"][index % 5],
  status: (["Draft", "Ready", "Active", "Blocked", "Complete", "Cancelled"] as JourneyStatus[])[index % 6],
  affected: ["Identity", "Tasks", "Documents", "Payroll", "Benefits", "Access", "Facilities"].slice(0, 3 + index % 5),
  nextAction: ["Confirm effective relationship", "Run impact preview", "Approve compensating work", "Reconcile destinations"][index % 4],
  failure: ["None", "Conflicting worker identity", "Destination unavailable", "Effective-date conflict"][index % 4],
}));

export type AdminUser = { id: string; name: string; role: string; status: JourneyStatus; scope: string; lastAccess: string; mfa: string; temporaryUntil: string };
export const adminUsers: AdminUser[] = Array.from({ length: 20 }, (_, index) => ({
  id: `USR-ADM-${String(index + 1).padStart(3, "0")}`,
  name: ["Alex Rivera", "Priya Nair", "Marcus Johnson", "Jordan Lee", "Elena Garcia", "Sam Wilson", "Zoe Bennett", "Nina Patel", "Ben Carter", "Aisha Rahman"][index % 10],
  role: ["Recruiter", "Coordinator", "Hiring Manager", "Interviewer", "Approver", "Support", "Integrity Reviewer", "Configuration Admin", "Platform Admin", "Privacy & Legal"][index % 10],
  status: (["Active", "Ready", "Blocked", "Cancelled"] as JourneyStatus[])[index % 4],
  scope: ["Assigned portfolio", "Owned work", "Direct reports", "Purpose-limited evidence"][index % 4],
  lastAccess: `${1 + index % 12} hours ago`,
  mfa: index % 5 === 0 ? "Recovery required" : "Enforced · verified",
  temporaryUntil: index % 6 === 0 ? "Sep 15 · 5:00 PM" : "Not temporary",
}));

export type NotificationItem = { id: string; title: string; category: string; priority: "Critical" | "High" | "Normal"; target: string; due: string; read: boolean; context: string };
export const notificationItems: NotificationItem[] = Array.from({ length: 24 }, (_, index) => ({
  id: `NTF-DEMO-${String(index + 1).padStart(3, "0")}`,
  title: ["Scorecard overdue", "Candidate waiting", "Integration reconciliation", "Offer approval due", "Start-date exception", "Privacy request due"][index % 6],
  category: ["Interview", "Candidate", "Integration", "Offer", "Onboarding", "Privacy"][index % 6],
  priority: (["Critical", "High", "Normal"] as const)[index % 3],
  target: ["/hr/assignments/ASN-DEMO-001", "/hr/applications/APP-DEMO-001", "/hr/platform/integrations", "/hr/decisions/APP-DEMO-001", "/hr/onboarding/exceptions", "/admin/privacy-requests"][index % 6],
  due: ["Now", "Today", "Tomorrow", "Sep 3"][index % 4],
  read: index % 4 === 0,
  context: "Minimum-necessary deep link; authorization is rechecked at destination.",
}));

export type ContentTemplate = { id: string; name: string; channel: string; locale: string; audience: string; version: number; status: JourneyStatus; effective: string; owner: string; variables: string[] };
export const contentTemplates: ContentTemplate[] = Array.from({ length: 24 }, (_, index) => ({
  id: `CNT-DEMO-${String(index + 1).padStart(3, "0")}`,
  name: ["Application confirmation", "Interview invitation", "Offer ready", "Background notice", "Pre-adverse notice", "Onboarding welcome"][index % 6],
  channel: ["Email", "Portal", "SMS", "Accessible document"][index % 4],
  locale: ["en-US", "es-US", "en-GB", "en-IN", "fr-CA", "de-DE"][index % 6],
  audience: ["Candidate", "New hire", "Manager", "Agency"][index % 4],
  version: 1 + index % 8,
  status: (["Draft", "Ready", "Active", "Blocked", "Complete"] as JourneyStatus[])[index % 5],
  effective: `2026-09-${String(1 + index % 27).padStart(2, "0")}`,
  owner: ["Candidate Experience", "Legal", "People Operations", "Talent Brand"][index % 4],
  variables: ["recipient_name", "job_title", "local_datetime", "support_route"],
}));

export type IntegrationConfig = { id: string; name: string; provider: string; direction: string; authState: string; mappingVersion: string; lastReconciled: string; queue: number; status: JourneyStatus; failure: string };
export const integrationConfigs: IntegrationConfig[] = Array.from({ length: 16 }, (_, index) => ({
  id: `ICG-DEMO-${String(index + 1).padStart(3, "0")}`,
  name: ["HRIS pending worker", "Identity governance", "ITSM provisioning", "Calendar", "E-signature", "Job distributor", "Background provider", "Assessment provider"][index % 8],
  provider: `Synthetic provider ${1 + index % 5}`,
  direction: ["Outbound + receipt", "Bidirectional", "Inbound events", "Projection only"][index % 4],
  authState: index % 5 === 0 ? "Credential rotation due" : "Synthetic credential healthy",
  mappingVersion: `MAP-v${2 + index % 6}`,
  lastReconciled: `${3 + index * 2} min ago`,
  queue: (index * 3) % 11,
  status: (["Active", "Ready", "Blocked", "Complete"] as JourneyStatus[])[index % 4],
  failure: ["None", "Schema mismatch", "Provider timeout", "Duplicate event"][index % 4],
}));

export type ImportRun = { id: string; type: string; file: string; rows: number; valid: number; warnings: number; errors: number; status: JourneyStatus; owner: string; rollback: string };
export const importRuns: ImportRun[] = Array.from({ length: 12 }, (_, index) => ({
  id: `IMP-DEMO-${String(index + 1).padStart(3, "0")}`,
  type: ["Jobs", "Candidates", "Applications", "Agencies", "Historical interviews", "Onboarding plans"][index % 6],
  file: `synthetic-${["jobs", "candidates", "applications", "agencies", "interviews", "onboarding"][index % 6]}-${index + 1}.csv`,
  rows: 120 + index * 83,
  valid: 100 + index * 71,
  warnings: 8 + index % 17,
  errors: 2 + index % 9,
  status: (["Draft", "Ready", "Active", "Blocked", "Complete"] as JourneyStatus[])[index % 5],
  owner: ["Data Operations", "HRIS Operations", "Recruiting Operations"][index % 3],
  rollback: "Batch-scoped inverse plan retained until reconciliation approval",
}));

export const fullSystemCounts = {
  candidateTaskDetails: candidateTaskDetails.length,
  recruitingEvents: recruitingEventAdmin.length,
  highVolumeCohorts: highVolumeCohorts.length,
  agencyAssignments: agencyAssignments.length,
  referrerCases: referrerCases.length,
  facilitiesRequests: facilitiesRequests.length,
  managerRecruitingItems: managerRecruitingItems.length,
  interviewerItems: interviewerPortalItems.length,
  buddyPlans: buddyPlans.length,
  mobilityOpportunities: mobilityOpportunities.length,
  benefitElections: benefitElections.length,
  learningEnrollments: learningEnrollments.length,
  transitionCases: transitionCases.length,
  adminUsers: adminUsers.length,
  notifications: notificationItems.length,
  contentTemplates: contentTemplates.length,
  integrations: integrationConfigs.length,
  importRuns: importRuns.length,
};
