export type CandidateTask = {
  id: string;
  kind: "Assessment" | "Reference" | "Background check" | "Adverse-action notice";
  title: string;
  application: string;
  state: "Ready" | "In progress" | "Complete" | "Expired" | "Needs support" | "Dispute open";
  due: string;
  providerSafeStatus: string;
  nextAction: string;
  noticeVersion: string;
};

export type ScreeningCase = {
  id: string;
  kind: "Assessment" | "Reference" | "Background" | "Adverse action";
  candidate: string;
  application: string;
  job: string;
  state: "Invited" | "In progress" | "Review" | "Clear" | "Blocked" | "Pre-adverse notice" | "Dispute" | "Closed";
  owner: string;
  due: string;
  jurisdiction: string;
  consent: string;
  version: string;
  nextAction: string;
  restricted: boolean;
};

export type SavedJob = {
  id: string;
  publicId: string;
  title: string;
  location: string;
  workplace: string;
  savedAt: string;
  state: "Open" | "Closing soon" | "Closed";
};

export type JobAlert = {
  id: string;
  name: string;
  criteria: string;
  cadence: "Daily" | "Weekly" | "Paused";
  channel: "Email" | "Email + SMS";
  locale: string;
  lastResult: string;
};

export type EventRegistration = {
  id: string;
  eventId: string;
  event: string;
  attendee: string;
  state: "Registered" | "Waitlisted" | "Checked in" | "Cancelled" | "No show";
  accessibility: "None requested" | "Private support route";
  authority: string;
  source: string;
};

export type ReferralReward = {
  id: string;
  referralId: string;
  referrer: string;
  candidate: string;
  job: string;
  eligibility: "Eligible" | "Ineligible" | "Review required";
  milestone: "Submitted" | "Started" | "Retention met" | "Cancelled";
  amount: string;
  state: "Pending" | "Approved" | "Paid" | "Denied" | "Disputed";
  reason: string;
};

export type AgencySubmission = {
  id: string;
  agency: string;
  assignment: string;
  candidate: string;
  job: string;
  ownershipWindow: string;
  fee: string;
  state: "Draft" | "Validation" | "Accepted" | "Duplicate" | "Ownership review" | "Withdrawn" | "Expired";
  duplicateOf: string;
  nextAction: string;
};

export type HighVolumeCampaign = {
  id: string;
  name: string;
  model: "Evergreen" | "Campus cohort" | "Hiring event" | "Seasonal";
  jobs: number;
  applicants: number;
  stage: string;
  capacity: string;
  automation: string;
  exceptions: number;
  state: "Planning" | "Open" | "Paused" | "Complete";
  owner: string;
};

export type LocaleVariant = {
  id: string;
  country: string;
  locale: string;
  language: string;
  workerType: string;
  noticePack: string;
  formPack: string;
  payDisplay: string;
  signature: string;
  reviewState: "Approved demo" | "Legal review" | "Incomplete";
};

export type RecoveryScenario = {
  id: string;
  journey: string;
  failure: string;
  safeState: string;
  recovery: string;
  owner: string;
  state: "Open" | "Recovering" | "Resolved" | "Cancelled";
  attempts: number;
  idempotencyKey: string;
};

export const candidateTasks: CandidateTask[] = ([
  ["CTK-001", "Assessment", "Complete product reasoning exercise", "APP-DEMO-001", "Ready", "Sep 4 · 5:00 PM PT", "Invitation ready · provider not contacted", "Review access needs and begin", "NOTICE-ASSESS-v4"],
  ["CTK-002", "Reference", "Invite two professional references", "APP-DEMO-001", "In progress", "Sep 7 · 5:00 PM PT", "One of two fictional references complete", "Send a reminder or replace reference", "NOTICE-REF-v3"],
  ["CTK-003", "Background check", "Review background-check notice", "APP-DEMO-001", "Needs support", "Sep 10 · 5:00 PM PT", "Consent not submitted; support case open", "Continue through private support", "NOTICE-BGC-US-CA-v7"],
  ["CTK-004", "Adverse-action notice", "Review pre-adverse-action information", "APP-DEMO-009", "Dispute open", "Sep 12 · 5:00 PM PT", "Response window open; decision paused", "Review report and submit correction", "NOTICE-PAA-US-CA-v5"],
  ["CTK-005", "Assessment", "Structured work sample", "APP-DEMO-004", "Complete", "Completed Aug 25", "Completed · receipt reconciled", "No action", "NOTICE-ASSESS-v4"],
  ["CTK-006", "Assessment", "Analytics exercise", "APP-DEMO-011", "Expired", "Expired Aug 26", "Access link expired; no score produced", "Request a new window", "NOTICE-ASSESS-v4"],
] as const).map(([id, kind, title, application, state, due, providerSafeStatus, nextAction, noticeVersion]) => ({ id, kind, title, application, state, due, providerSafeStatus, nextAction, noticeVersion }));

const candidateNames = ["Maya Chen", "Noah Williams", "Sofia Rodriguez", "Liam Patel", "Ava Thompson", "Ethan Kim", "Isabella Rossi", "Lucas Martin"];
const caseKinds: ScreeningCase["kind"][] = ["Assessment", "Reference", "Background", "Adverse action"];
const caseStates: ScreeningCase["state"][] = ["Invited", "In progress", "Review", "Clear", "Blocked", "Pre-adverse notice", "Dispute", "Closed"];

export const screeningCases: ScreeningCase[] = Array.from({ length: 32 }, (_, index) => {
  const kind = caseKinds[index % caseKinds.length];
  const state = caseStates[index % caseStates.length];
  return {
    id: `SCR-DEMO-${String(index + 1).padStart(3, "0")}`,
    kind,
    candidate: candidateNames[index % candidateNames.length],
    application: `APP-DEMO-${String((index % 12) + 1).padStart(3, "0")}`,
    job: ["Senior Product Designer", "Staff Data Platform Engineer", "Recruiting Operations Partner", "Security Engineer"][index % 4],
    state,
    owner: ["Alex Rivera", "Priya Nair", "Jordan Lee", "Morgan Reyes"][index % 4],
    due: state === "Closed" || state === "Clear" ? "Complete" : `Sep ${2 + (index % 18)}`,
    jurisdiction: ["US-CA", "US-NY", "UK-GB", "IN-KA"][index % 4],
    consent: kind === "Background" || kind === "Adverse action" ? "Version-bound notice required" : "Task notice acknowledged",
    version: `${kind.replace(" ", "-").toUpperCase()}-v${3 + (index % 5)}`,
    nextAction: state === "Blocked" ? "Resolve identity/provider mismatch" : state === "Dispute" ? "Pause decision and review correction" : state === "Pre-adverse notice" ? "Hold decision through response window" : state === "Closed" || state === "Clear" ? "No action" : "Complete owned review",
    restricted: kind === "Background" || kind === "Adverse action",
  };
});

export const savedJobs: SavedJob[] = [
  ["SVJ-001", "senior-product-designer", "Senior Product Designer", "California · Remote", "Remote", "Aug 27", "Open"],
  ["SVJ-002", "staff-data-platform-engineer", "Staff Data Platform Engineer", "US · Remote", "Remote", "Aug 24", "Open"],
  ["SVJ-003", "recruiting-operations-partner", "Recruiting Operations Partner", "San Francisco, CA", "Hybrid", "Aug 20", "Closing soon"],
  ["SVJ-004", "security-engineer", "Security Engineer", "Austin, TX", "Hybrid", "Aug 14", "Closed"],
].map(([id, publicId, title, location, workplace, savedAt, state]) => ({ id, publicId, title, location, workplace, savedAt, state: state as SavedJob["state"] }));

export const jobAlerts: JobAlert[] = [
  { id: "JAL-001", name: "Product design · remote", criteria: "Design · Staff/Senior · US remote", cadence: "Weekly", channel: "Email", locale: "en-US", lastResult: "3 matching fictional roles" },
  { id: "JAL-002", name: "Accessibility leadership", criteria: "Accessibility · Product or Engineering", cadence: "Daily", channel: "Email", locale: "en-US", lastResult: "No new matches" },
  { id: "JAL-003", name: "San Francisco hybrid", criteria: "All functions · San Francisco hybrid", cadence: "Paused", channel: "Email + SMS", locale: "en-US", lastResult: "Paused by candidate" },
];

export const eventRegistrations: EventRegistration[] = Array.from({ length: 36 }, (_, index) => ({
  id: `ERG-DEMO-${String(index + 1).padStart(3, "0")}`,
  eventId: `EVT-DEMO-${String((index % 12) + 1).padStart(3, "0")}`,
  event: ["Design systems roundtable", "Data platform open house", "Early-career studio", "Security community meetup"][index % 4],
  attendee: candidateNames[index % candidateNames.length],
  state: (["Registered", "Waitlisted", "Checked in", "Cancelled", "No show"] as const)[index % 5],
  accessibility: index % 7 === 0 ? "Private support route" : "None requested",
  authority: "Event-specific updates · expires 30 days after event",
  source: index % 3 === 0 ? "Public event page" : index % 3 === 1 ? "QR check-in" : "Community invitation",
}));

export const referralRewards: ReferralReward[] = Array.from({ length: 24 }, (_, index) => ({
  id: `RWD-DEMO-${String(index + 1).padStart(3, "0")}`,
  referralId: `REF-DEMO-${String(index + 1).padStart(3, "0")}`,
  referrer: ["Taylor Morgan", "Jordan Lee", "Marcus Johnson", "Priya Shah"][index % 4],
  candidate: candidateNames[index % candidateNames.length],
  job: ["Senior Product Designer", "Staff Data Platform Engineer", "Recruiting Operations Partner", "Security Engineer"][index % 4],
  eligibility: (["Eligible", "Ineligible", "Review required"] as const)[index % 3],
  milestone: (["Submitted", "Started", "Retention met", "Cancelled"] as const)[index % 4],
  amount: index % 3 === 1 ? "$0" : `$${1000 + (index % 4) * 500}`,
  state: (["Pending", "Approved", "Paid", "Denied", "Disputed"] as const)[index % 5],
  reason: index % 3 === 1 ? "Policy exclusion or prior ownership" : "Policy REF-US-v4",
}));

export const agencySubmissions: AgencySubmission[] = Array.from({ length: 32 }, (_, index) => {
  const state = (["Draft", "Validation", "Accepted", "Duplicate", "Ownership review", "Withdrawn", "Expired"] as const)[index % 7];
  return {
    id: `AGS-DEMO-${String(index + 1).padStart(3, "0")}`,
    agency: ["Northstar Product Search", "Synthetic Engineering Partners", "Beacon People Advisory", "Atlas Finance Talent"][index % 4],
    assignment: `AGA-DEMO-${String((index % 12) + 1).padStart(3, "0")}`,
    candidate: candidateNames[index % candidateNames.length],
    job: ["Senior Product Designer", "Staff Data Platform Engineer", "Recruiting Operations Partner", "Security Engineer"][index % 4],
    ownershipWindow: state === "Expired" ? "Expired Aug 27" : `Through Oct ${1 + (index % 20)}`,
    fee: `${18 + (index % 5)}% first-year base`,
    state,
    duplicateOf: state === "Duplicate" || state === "Ownership review" ? `CAN-DEMO-${String((index % 8) + 1).padStart(3, "0")}` : "None",
    nextAction: state === "Duplicate" ? "Review existing candidate without exposing owner" : state === "Ownership review" ? "Resolve evidence and fee claim" : state === "Validation" ? "Complete notice and source fields" : state === "Draft" ? "Submit candidate with notice evidence" : "No action",
  };
});

export const highVolumeCampaigns: HighVolumeCampaign[] = [
  ["HVC-001", "2027 product internship", "Campus cohort", 4, 1840, "Structured screen", "12 review pods · 280/week", "Rule-based invitations with human override", 34, "Open", "Priya Nair"],
  ["HVC-002", "Customer support evergreen", "Evergreen", 3, 3260, "Availability screen", "6 cohorts/month", "Eligibility and scheduling only", 71, "Open", "Alex Rivera"],
  ["HVC-003", "Austin engineering day", "Hiring event", 6, 620, "Event interview", "96 interview slots", "Slot and reminder orchestration", 18, "Planning", "Jordan Lee"],
  ["HVC-004", "Holiday operations", "Seasonal", 8, 4780, "Document review", "450 starts/week", "Document completeness, no candidate ranking", 126, "Paused", "Morgan Reyes"],
  ["HVC-005", "Graduate data rotation", "Campus cohort", 5, 1120, "Assessment", "180 assessments/week", "Version-bound invitation and expiry", 42, "Open", "Priya Nair"],
  ["HVC-006", "Security talent community", "Evergreen", 2, 740, "Recruiter review", "80 reviews/week", "Consent-scoped nurture", 9, "Planning", "Jordan Lee"],
  ["HVC-007", "Retail launch team", "Hiring event", 12, 5880, "Eligibility screen", "700 reviews/week", "Deterministic criteria and exception queue", 215, "Complete", "Alex Rivera"],
  ["HVC-008", "Finance operations returnship", "Seasonal", 3, 360, "Structured screen", "45 reviews/week", "Cohort routing with human review", 12, "Open", "Owen Brooks"],
].map(([id, name, model, jobs, applicants, stage, capacity, automation, exceptions, state, owner]) => ({ id: String(id), name: String(name), model: model as HighVolumeCampaign["model"], jobs: Number(jobs), applicants: Number(applicants), stage: String(stage), capacity: String(capacity), automation: String(automation), exceptions: Number(exceptions), state: state as HighVolumeCampaign["state"], owner: String(owner) }));

export const localeVariants: LocaleVariant[] = [
  ["LOC-001", "United States", "en-US", "English", "Regular employee", "NOTICE-US-v8", "FORM-US-v6", "Annual USD range", "E-sign supported", "Approved demo"],
  ["LOC-002", "United States", "es-US", "Spanish", "Regular employee", "NOTICE-US-ES-v3", "FORM-US-ES-v2", "Annual USD range", "E-sign supported", "Legal review"],
  ["LOC-003", "United Kingdom", "en-GB", "English", "Regular employee", "NOTICE-GB-v4", "FORM-GB-v5", "Annual GBP range", "E-sign supported", "Approved demo"],
  ["LOC-004", "India", "en-IN", "English", "Regular employee", "NOTICE-IN-v5", "FORM-IN-v4", "Annual INR range", "E-sign supported", "Legal review"],
  ["LOC-005", "Canada", "en-CA", "English", "Regular employee", "NOTICE-CA-v4", "FORM-CA-v4", "Annual CAD range", "E-sign supported", "Approved demo"],
  ["LOC-006", "Canada", "fr-CA", "French", "Regular employee", "NOTICE-CA-FR-v2", "FORM-CA-FR-v2", "Annual CAD range", "E-sign supported", "Incomplete"],
  ["LOC-007", "Germany", "de-DE", "German", "Regular employee", "NOTICE-DE-v2", "FORM-DE-v3", "Annual EUR range", "Qualified signature review", "Legal review"],
  ["LOC-008", "Singapore", "en-SG", "English", "Regular employee", "NOTICE-SG-v3", "FORM-SG-v3", "Monthly SGD range", "E-sign supported", "Approved demo"],
  ["LOC-009", "Australia", "en-AU", "English", "Regular employee", "NOTICE-AU-v3", "FORM-AU-v3", "Annual AUD range", "E-sign supported", "Approved demo"],
  ["LOC-010", "United States", "en-US", "English", "Contingent worker", "NOTICE-US-CW-v3", "FORM-US-CW-v3", "Hourly USD range", "Contract signature", "Legal review"],
  ["LOC-011", "United Kingdom", "en-GB", "English", "Intern", "NOTICE-GB-INT-v2", "FORM-GB-INT-v2", "Hourly GBP range", "Guardian rule not assumed", "Incomplete"],
  ["LOC-012", "India", "hi-IN", "Hindi", "Regular employee", "NOTICE-IN-HI-v1", "FORM-IN-HI-v1", "Annual INR range", "E-sign supported", "Incomplete"],
].map(([id, country, locale, language, workerType, noticePack, formPack, payDisplay, signature, reviewState]) => ({ id, country, locale, language, workerType, noticePack, formPack, payDisplay, signature, reviewState: reviewState as LocaleVariant["reviewState"] }));

const recoveryJourneys = ["Application", "Assessment", "Interview", "Offer", "Background check", "Event registration", "Referral", "Agency submission", "Pending worker", "Provisioning", "E-signature", "Onboarding plan"];
export const recoveryScenarios: RecoveryScenario[] = Array.from({ length: 24 }, (_, index) => ({
  id: `RCV-DEMO-${String(index + 1).padStart(3, "0")}`,
  journey: recoveryJourneys[index % recoveryJourneys.length],
  failure: ["Expired link", "Provider unavailable", "Duplicate command", "Stale version", "Validation rejected", "Candidate cancelled", "No capacity", "Permission changed"][index % 8],
  safeState: ["No effect committed", "Original state retained", "Decision paused", "Owned exception created"][index % 4],
  recovery: ["Issue version-bound replacement", "Retry with same business key", "Reconcile provider state", "Cancel downstream work", "Correct fields and replay", "Escalate for human review"][index % 6],
  owner: ["Recruiting Coordinator", "Recruiter", "HRIS Operator", "Platform Admin", "Privacy & Legal", "IT Operations"][index % 6],
  state: (["Open", "Recovering", "Resolved", "Cancelled"] as const)[index % 4],
  attempts: index % 4,
  idempotencyKey: `idem_demo_${String(9001 + index)}`,
}));

export const lifecycleDepthSummary = {
  candidateTasks: candidateTasks.length,
  screeningCases: screeningCases.length,
  savedJobs: savedJobs.length,
  jobAlerts: jobAlerts.length,
  eventRegistrations: eventRegistrations.length,
  referralRewards: referralRewards.length,
  agencySubmissions: agencySubmissions.length,
  highVolumeCampaigns: highVolumeCampaigns.length,
  localeVariants: localeVariants.length,
  recoveryScenarios: recoveryScenarios.length,
};
