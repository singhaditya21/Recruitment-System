export type AnalyticsApplication = {
  id: string;
  candidate: string;
  jobId: string;
  job: string;
  department: string;
  location: "Remote" | "Hybrid";
  source: "Careers site" | "Referral" | "Agency" | "Sourced";
  stage: "Recruiter review" | "Screening" | "Scheduling" | "Interviews" | "Debrief" | "Offer" | "Hired" | "Rejected" | "Withdrawn";
  owner: string;
  daysAgo: number;
  stageAgeDays: number;
  slaDays: number;
  interviewState: "Not required" | "Needs scheduling" | "Confirmed" | "Complete";
  scorecardsSubmitted: number;
  scorecardsRequired: number;
  offerState: "Not started" | "Pending approval" | "Extended" | "Accepted" | "Declined";
  experienceRating: number;
  messageState: "Delivered" | "Queued" | "Failed" | "Suppressed";
  automationState: "Succeeded" | "Suppressed" | "Failed" | "Manual";
  privacyState: "None" | "Open" | "Due soon" | "Overdue";
  integrityState: "None" | "Review" | "Cleared";
  handoffState: "Not ready" | "Ready" | "Reconciled" | "Failed";
};

const jobs = [
  { id: "JOB-DEMO-001", title: "Senior Product Designer", department: "Product & Research", location: "Remote" as const },
  { id: "JOB-DEMO-002", title: "Recruiting Operations Partner", department: "People Operations", location: "Hybrid" as const },
  { id: "JOB-DEMO-003", title: "Staff Data Platform Engineer", department: "Engineering", location: "Remote" as const },
];
const stages: AnalyticsApplication["stage"][] = ["Recruiter review", "Screening", "Scheduling", "Interviews", "Debrief", "Offer", "Hired", "Rejected", "Withdrawn"];
const sources: AnalyticsApplication["source"][] = ["Careers site", "Referral", "Agency", "Sourced"];
const owners = ["Alex Rivera", "Priya Nair", "Marcus Johnson", "Ops queue"];
const slaByStage: Record<AnalyticsApplication["stage"], number> = { "Recruiter review": 3, Screening: 3, Scheduling: 2, Interviews: 5, Debrief: 2, Offer: 3, Hired: 7, Rejected: 7, Withdrawn: 7 };

export const analyticsApplications: AnalyticsApplication[] = Array.from({ length: 48 }, (_, index) => {
  const job = jobs[index % jobs.length];
  const stage = stages[(index * 5 + Math.floor(index / 4)) % stages.length];
  const stageAgeDays = (index * 3) % 11;
  const interviewState: AnalyticsApplication["interviewState"] = ["Scheduling", "Interviews", "Debrief", "Offer", "Hired"].includes(stage)
    ? stage === "Scheduling" ? "Needs scheduling" : stage === "Interviews" ? (index % 3 === 0 ? "Confirmed" : "Complete") : "Complete"
    : "Not required";
  const offerState: AnalyticsApplication["offerState"] = stage === "Offer"
    ? index % 2 === 0 ? "Pending approval" : "Extended"
    : stage === "Hired" ? "Accepted"
    : stage === "Rejected" && index % 2 === 0 ? "Declined" : "Not started";
  return {
    id: `ANA-APP-${String(index + 1).padStart(3, "0")}`,
    candidate: `Synthetic candidate ${String(index + 1).padStart(2, "0")}`,
    jobId: job.id,
    job: job.title,
    department: job.department,
    location: job.location,
    source: sources[(index * 3) % sources.length],
    stage,
    owner: owners[index % owners.length],
    daysAgo: (index * 7 + index % 5) % 90,
    stageAgeDays,
    slaDays: slaByStage[stage],
    interviewState,
    scorecardsSubmitted: interviewState === "Complete" ? (index % 4 === 0 ? 2 : 3) : interviewState === "Confirmed" ? 0 : 0,
    scorecardsRequired: interviewState === "Not required" ? 0 : 3,
    offerState,
    experienceRating: index % 9 === 0 ? 2 : 3 + (index % 3),
    messageState: index % 13 === 0 ? "Failed" : index % 7 === 0 ? "Queued" : index % 11 === 0 ? "Suppressed" : "Delivered",
    automationState: index % 17 === 0 ? "Failed" : index % 8 === 0 ? "Suppressed" : index % 6 === 0 ? "Manual" : "Succeeded",
    privacyState: index % 23 === 0 ? "Overdue" : index % 17 === 0 ? "Due soon" : index % 13 === 0 ? "Open" : "None",
    integrityState: index % 19 === 0 ? "Review" : index % 11 === 0 ? "Cleared" : "None",
    handoffState: stage === "Hired" ? "Reconciled" : stage === "Offer" && index % 3 === 0 ? "Ready" : stage === "Offer" && index % 5 === 0 ? "Failed" : "Not ready",
  };
});

export type DashboardDefinition = {
  id: string;
  name: string;
  shortName: string;
  purpose: string;
  question: string;
  roles: string[];
  metricKeys: string[];
  primaryBreakdown: "stage" | "source" | "owner" | "interviewState" | "offerState" | "experienceRating" | "automationState" | "privacyState" | "handoffState";
};

export const dashboardCatalog: DashboardDefinition[] = [
  { id: "talent-overview", name: "Talent acquisition overview", shortName: "Overview", purpose: "Recurring operating review", question: "Is the recruiting portfolio moving safely and on time?", roles: ["Recruiter", "Hiring Manager"], metricKeys: ["application_volume", "active_applications", "stage_sla_rate", "hires", "candidate_experience"], primaryBreakdown: "stage" },
  { id: "pipeline", name: "Pipeline and conversion", shortName: "Pipeline", purpose: "Funnel diagnosis", question: "Where does candidate flow slow, stop or convert?", roles: ["Recruiter", "Hiring Manager"], metricKeys: ["active_applications", "stage_sla_rate", "evidence_readiness", "offer_acceptance"], primaryBreakdown: "stage" },
  { id: "sourcing", name: "Source and channel effectiveness", shortName: "Sources", purpose: "Channel review", question: "Which approved sources create qualified progress without becoming a ranking signal?", roles: ["Recruiter", "Hiring Manager"], metricKeys: ["application_volume", "source_to_hire", "candidate_experience"], primaryBreakdown: "source" },
  { id: "recruiter-operations", name: "Recruiter workload and SLA", shortName: "Recruiter ops", purpose: "Daily queue management", question: "Who owns delayed work and what needs intervention?", roles: ["Recruiter", "Recruiting Coordinator"], metricKeys: ["active_applications", "stage_sla_rate", "median_stage_age", "message_delivery"], primaryBreakdown: "owner" },
  { id: "scheduling", name: "Scheduling capacity and reliability", shortName: "Scheduling", purpose: "Coordination review", question: "Can the team schedule valid sessions without avoidable candidate delay?", roles: ["Recruiting Coordinator", "Recruiter", "Interviewer"], metricKeys: ["schedule_confirmation", "stage_sla_rate", "median_stage_age", "message_delivery"], primaryBreakdown: "interviewState" },
  { id: "interview-quality", name: "Interview and evidence quality", shortName: "Evidence", purpose: "Structured-hiring guardrail", question: "Is required independent evidence complete before decisions?", roles: ["Interviewer", "Hiring Manager", "Recruiter"], metricKeys: ["evidence_readiness", "stage_sla_rate", "candidate_experience"], primaryBreakdown: "interviewState" },
  { id: "offers-handoff", name: "Offers, openings and handoff", shortName: "Offers", purpose: "Offer and hire control", question: "Are approved offers, reservations and hire handoffs reconciled?", roles: ["Offer Approver", "HRIS Operator", "Recruiter", "Hiring Manager"], metricKeys: ["offer_acceptance", "hires", "handoff_reconciliation", "stage_sla_rate"], primaryBreakdown: "offerState" },
  { id: "candidate-experience", name: "Candidate experience and communication", shortName: "Experience", purpose: "Experience and service review", question: "Are candidates informed, supported and able to recover?", roles: ["Candidate Support", "Recruiting Coordinator", "Recruiter"], metricKeys: ["candidate_experience", "message_delivery", "privacy_sla", "stage_sla_rate"], primaryBreakdown: "experienceRating" },
  { id: "automation-health", name: "Automation and integration health", shortName: "Automation", purpose: "Control-plane operations", question: "Are fixture rules and projections succeeding without duplicate effects?", roles: ["Configuration Admin", "Platform Admin", "HRIS Operator"], metricKeys: ["automation_success", "message_delivery", "handoff_reconciliation"], primaryBreakdown: "automationState" },
  { id: "privacy-compliance", name: "Privacy, integrity and policy", shortName: "Compliance", purpose: "Restricted control review", question: "Which regulated or restricted obligations require owned action?", roles: ["Privacy & Legal", "Application Integrity Reviewer", "Platform Admin"], metricKeys: ["privacy_sla", "stage_sla_rate", "automation_success"], primaryBreakdown: "privacyState" },
  { id: "data-readiness", name: "Object and data contract readiness", shortName: "Data contract", purpose: "Solution-design readiness", question: "Does every logical object have lifecycle, data, relationship and command coverage?", roles: ["Configuration Admin", "Platform Admin", "Privacy & Legal"], metricKeys: ["object_coverage", "data_group_coverage", "data_point_coverage", "quality_coverage"], primaryBreakdown: "stage" },
];

export const metricDefinitions: Record<string, { label: string; definition: string; grain: string; direction: "up" | "down" | "neutral" }> = {
  application_volume: { label: "Applications", definition: "Count of synthetic application attempts observed inside the selected rolling window after global filters.", grain: "One application attempt", direction: "neutral" },
  active_applications: { label: "Active applications", definition: "Filtered applications whose current stage is not Hired, Rejected or Withdrawn.", grain: "One current application", direction: "neutral" },
  stage_sla_rate: { label: "Within stage SLA", definition: "Active filtered applications with stage age less than or equal to the configured stage SLA, divided by active filtered applications.", grain: "One current active application", direction: "up" },
  median_stage_age: { label: "Median stage age", definition: "Median whole days in the current stage for active filtered applications.", grain: "One current active application", direction: "down" },
  evidence_readiness: { label: "Evidence complete", definition: "Filtered applications with required interview scorecards where submitted scorecards equal required scorecards.", grain: "One application at an interview decision point", direction: "up" },
  schedule_confirmation: { label: "Sessions confirmed", definition: "Filtered interview-relevant applications in Confirmed or Complete state divided by all interview-relevant applications.", grain: "One application interview context", direction: "up" },
  offer_acceptance: { label: "Offer acceptance", definition: "Accepted offer fixtures divided by accepted plus declined offer fixtures; pending and merely extended offers are excluded.", grain: "One terminal offer response", direction: "up" },
  hires: { label: "Reconciled hires", definition: "Filtered applications in Hired stage with a Reconciled handoff fixture.", grain: "One completed hire handoff", direction: "up" },
  candidate_experience: { label: "Candidate experience", definition: "Average synthetic experience response on a 1–5 scale. This feedback is separated from hiring decisions.", grain: "One eligible synthetic response", direction: "up" },
  message_delivery: { label: "Message delivery", definition: "Delivered message fixtures divided by delivered, queued and failed fixtures; suppressed messages are excluded from delivery eligibility.", grain: "One eligible message", direction: "up" },
  automation_success: { label: "Automation success", definition: "Succeeded fixture executions divided by succeeded plus failed executions; suppressed and manual records are shown separately.", grain: "One eligible automation execution", direction: "up" },
  privacy_sla: { label: "Privacy cases on time", definition: "Open or due-soon privacy fixtures divided by all active privacy fixtures. Overdue fixtures fail the rate.", grain: "One active privacy case", direction: "up" },
  handoff_reconciliation: { label: "Handoffs reconciled", definition: "Reconciled handoff fixtures divided by reconciled plus failed handoff fixtures. Not-ready records are excluded.", grain: "One attempted hire handoff", direction: "up" },
  source_to_hire: { label: "Source-to-hire", definition: "Filtered reconciled hires divided by filtered application attempts. Source is a diagnostic dimension, never a candidate quality signal.", grain: "Application source cohort", direction: "up" },
  object_coverage: { label: "Object lifecycle coverage", definition: "Logical object families with an assigned lifecycle classification and state set divided by all 92 families.", grain: "One logical object family", direction: "up" },
  data_group_coverage: { label: "DAT-group coverage", definition: "Normative DAT groups mapped to at least one logical object family divided by all 48 groups.", grain: "One DAT group", direction: "up" },
  data_point_coverage: { label: "Minimum data-point coverage", definition: "Logical object families with the ten mandatory governance/provenance data points divided by all logical families.", grain: "One logical object family", direction: "up" },
  quality_coverage: { label: "Quality-rule coverage", definition: "Logical object families with relationship, lifecycle and data-quality controls divided by all logical families.", grain: "One logical object family", direction: "up" },
};

export const analyticsSource = {
  id: "SRC-ANALYTICS-FIXTURE-v1.6",
  name: "Deterministic synthetic recruitment analytics snapshot",
  path: "src/data/analytics.ts → analyticsApplications",
  grain: "One synthetic application attempt with current operational projections",
  freshness: "Fixture snapshot · Aug 28, 2026 · 9:30 AM PT",
  exclusions: "No real candidates, demographic attributes, compensation details, raw message content or production events",
};
