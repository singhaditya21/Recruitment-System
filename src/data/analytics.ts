import { seededCanonicalCoreStore } from "./canonicalRuntime";

export type AnalyticsApplication = {
  id: string;
  applicationId: string;
  sourceEventId: string;
  aggregateVersion: number;
  sourceObservedAt: string;
  restatementVersion: number;
  candidate: string;
  jobId: string;
  job: string;
  department: string;
  location: "Remote" | "Hybrid";
  source: "Careers site" | "Referral" | "Agency" | "Sourced";
  stage:
    | "Recruiter review"
    | "Screening"
    | "Scheduling"
    | "Interviews"
    | "Debrief"
    | "Offer"
    | "Hired"
    | "Rejected"
    | "Withdrawn";
  owner: string;
  daysAgo: number;
  stageAgeDays: number;
  slaDays: number;
  interviewState:
    | "Not required"
    | "Needs scheduling"
    | "Confirmed"
    | "Complete";
  scorecardsSubmitted: number;
  scorecardsRequired: number;
  offerState:
    | "Not started"
    | "Pending approval"
    | "Extended"
    | "Accepted"
    | "Declined";
  experienceEligible: boolean;
  experienceRating: number | null;
  messageState: "Delivered" | "Queued" | "Failed" | "Suppressed";
  automationState: "Succeeded" | "Suppressed" | "Failed" | "Manual";
  privacyState: "None" | "Open" | "Due soon" | "Overdue";
  integrityState: "None" | "Review" | "Cleared";
  handoffState: "Not ready" | "Ready" | "Reconciled" | "Failed";
};

const ownerNames: Record<string, string> = {
  "USR-REC-001": "Alex Rivera",
  "USR-COO-001": "Priya Nair",
  "USR-HM-001": "Marcus Johnson",
};
const slaByStage: Record<AnalyticsApplication["stage"], number> = {
  "Recruiter review": 3,
  Screening: 3,
  Scheduling: 2,
  Interviews: 5,
  Debrief: 2,
  Offer: 3,
  Hired: 7,
  Rejected: 7,
  Withdrawn: 7,
};

const requisitionById = new Map(
  seededCanonicalCoreStore.requisitions.map((requisition) => [
    requisition.id,
    requisition,
  ]),
);
const stageEventByApplication = new Map(
  seededCanonicalCoreStore.applicationStageEvents.map((event) => [
    event.applicationId,
    event,
  ]),
);

// The 324-row contract-complete cohort is a governed projection of the same
// canonical application aggregates used by the operational wireframe. It is
// no longer a separately invented business population.
export const analyticsApplications: AnalyticsApplication[] =
  seededCanonicalCoreStore.applications
    .filter((application) => application.analyticsCohort)
    .map((application, index) => {
      const requisition = requisitionById.get(application.requisitionId);
      const stageEvent = stageEventByApplication.get(application.id);
      if (!requisition || !stageEvent || application.analyticsWindowDays === null)
        throw new Error(`Incomplete analytics lineage for ${application.id}`);
      const stage = stageEvent.destinationStage as AnalyticsApplication["stage"];
      const source = application.sourceCode as AnalyticsApplication["source"];
      const stageAgeDays = Math.max(
        0,
        Math.round(
          (new Date("2026-08-28T12:00:00.000Z").getTime() -
            new Date(stageEvent.occurredAt).getTime()) /
            86_400_000,
        ),
      );
      const interviewState: AnalyticsApplication["interviewState"] = [
        "Scheduling",
        "Interviews",
        "Debrief",
        "Offer",
        "Hired",
      ].includes(stage)
        ? stage === "Scheduling"
          ? "Needs scheduling"
          : stage === "Interviews"
            ? index % 3 === 0
              ? "Confirmed"
              : "Complete"
            : "Complete"
        : "Not required";
      const offerState: AnalyticsApplication["offerState"] =
        stage === "Offer"
          ? index % 2 === 0
            ? "Pending approval"
            : "Extended"
          : stage === "Hired"
            ? "Accepted"
            : stage === "Rejected" && index % 2 === 0
              ? "Declined"
              : "Not started";
      return {
        id: `ANA-APP-${String(index + 1).padStart(3, "0")}`,
        applicationId: application.id,
        sourceEventId: stageEvent.id,
        aggregateVersion: stageEvent.aggregateVersion,
        sourceObservedAt: stageEvent.occurredAt,
        restatementVersion: 1,
        candidate: `Synthetic subject · ${application.candidateId}`,
        jobId: requisition.postingId,
        job: requisition.title,
        department: requisition.departmentName,
        location:
          requisition.workplaceMode === "Hybrid" ? "Hybrid" : "Remote",
        source,
        stage,
        owner: ownerNames[application.ownerId] ?? "Ops queue",
        daysAgo: application.analyticsWindowDays,
        stageAgeDays,
        slaDays: slaByStage[stage],
        interviewState,
        scorecardsSubmitted:
          interviewState === "Complete" ? (index % 4 === 0 ? 2 : 3) : 0,
        scorecardsRequired: interviewState === "Not required" ? 0 : 3,
        offerState,
        experienceEligible: index % 5 !== 0,
        experienceRating:
          index % 5 === 0 || index % 4 === 0
            ? null
            : index % 9 === 0
              ? 2
              : 3 + (index % 3),
        messageState:
          index % 13 === 0
            ? "Failed"
            : index % 7 === 0
              ? "Queued"
              : index % 11 === 0
                ? "Suppressed"
                : "Delivered",
        automationState:
          index % 17 === 0
            ? "Failed"
            : index % 8 === 0
              ? "Suppressed"
              : index % 6 === 0
                ? "Manual"
                : "Succeeded",
        privacyState:
          index % 23 === 0
            ? "Overdue"
            : index % 17 === 0
              ? "Due soon"
              : index % 13 === 0
                ? "Open"
                : "None",
        integrityState:
          index % 19 === 0
            ? "Review"
            : index % 11 === 0
              ? "Cleared"
              : "None",
        handoffState:
          stage === "Hired"
            ? "Reconciled"
            : stage === "Offer" && index % 3 === 0
              ? "Ready"
              : stage === "Offer" && index % 5 === 0
                ? "Failed"
                : "Not ready",
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
  primaryBreakdown:
    | "stage"
    | "source"
    | "owner"
    | "interviewState"
    | "offerState"
    | "experienceRating"
    | "automationState"
    | "privacyState"
    | "handoffState"
    | "domain"
    | "lifecycleType";
};

export const dashboardCatalog: DashboardDefinition[] = [
  {
    id: "talent-overview",
    name: "Talent acquisition overview",
    shortName: "Overview",
    purpose: "Recurring operating review",
    question: "Is the recruiting portfolio moving safely and on time?",
    roles: ["Recruiter", "Hiring Manager"],
    metricKeys: [
      "application_volume",
      "active_applications",
      "stage_sla_rate",
      "hires",
      "candidate_experience",
    ],
    primaryBreakdown: "stage",
  },
  {
    id: "pipeline",
    name: "Pipeline and conversion",
    shortName: "Pipeline",
    purpose: "Funnel diagnosis",
    question: "Where does candidate flow slow, stop or convert?",
    roles: ["Recruiter", "Hiring Manager"],
    metricKeys: [
      "active_applications",
      "stage_sla_rate",
      "evidence_readiness",
      "offer_acceptance",
    ],
    primaryBreakdown: "stage",
  },
  {
    id: "sourcing",
    name: "Source and channel effectiveness",
    shortName: "Sources",
    purpose: "Channel review",
    question:
      "Which approved sources create qualified progress without becoming a ranking signal?",
    roles: ["Recruiter", "Hiring Manager"],
    metricKeys: [
      "application_volume",
      "source_to_hire",
      "candidate_experience",
    ],
    primaryBreakdown: "source",
  },
  {
    id: "recruiter-operations",
    name: "Recruiter workload and SLA",
    shortName: "Recruiter ops",
    purpose: "Daily queue management",
    question: "Who owns delayed work and what needs intervention?",
    roles: ["Recruiter", "Recruiting Coordinator"],
    metricKeys: [
      "active_applications",
      "stage_sla_rate",
      "median_stage_age",
      "message_delivery",
    ],
    primaryBreakdown: "owner",
  },
  {
    id: "scheduling",
    name: "Scheduling capacity and reliability",
    shortName: "Scheduling",
    purpose: "Coordination review",
    question:
      "Can the team schedule valid sessions without avoidable candidate delay?",
    roles: ["Recruiting Coordinator", "Recruiter", "Interviewer"],
    metricKeys: [
      "schedule_confirmation",
      "stage_sla_rate",
      "median_stage_age",
      "message_delivery",
    ],
    primaryBreakdown: "interviewState",
  },
  {
    id: "interview-quality",
    name: "Interview and evidence quality",
    shortName: "Evidence",
    purpose: "Structured-hiring guardrail",
    question: "Is required independent evidence complete before decisions?",
    roles: ["Interviewer", "Hiring Manager", "Recruiter"],
    metricKeys: [
      "evidence_readiness",
      "stage_sla_rate",
      "candidate_experience",
    ],
    primaryBreakdown: "interviewState",
  },
  {
    id: "offers-handoff",
    name: "Offers, openings and handoff",
    shortName: "Offers",
    purpose: "Offer and hire control",
    question: "Are approved offers, reservations and hire handoffs reconciled?",
    roles: ["Offer Approver", "HRIS Operator", "Recruiter", "Hiring Manager"],
    metricKeys: [
      "offer_acceptance",
      "hires",
      "handoff_reconciliation",
      "stage_sla_rate",
    ],
    primaryBreakdown: "offerState",
  },
  {
    id: "candidate-experience",
    name: "Candidate experience and communication",
    shortName: "Experience",
    purpose: "Experience and service review",
    question: "Are candidates informed, supported and able to recover?",
    roles: ["Candidate Support", "Recruiting Coordinator", "Recruiter"],
    metricKeys: [
      "candidate_experience",
      "message_delivery",
      "privacy_sla",
      "stage_sla_rate",
    ],
    primaryBreakdown: "experienceRating",
  },
  {
    id: "automation-health",
    name: "Automation and integration health",
    shortName: "Automation",
    purpose: "Control-plane operations",
    question:
      "Are fixture rules and projections succeeding without duplicate effects?",
    roles: ["Configuration Admin", "Platform Admin", "HRIS Operator"],
    metricKeys: [
      "automation_success",
      "message_delivery",
      "handoff_reconciliation",
    ],
    primaryBreakdown: "automationState",
  },
  {
    id: "privacy-compliance",
    name: "Privacy, integrity and policy",
    shortName: "Compliance",
    purpose: "Restricted control review",
    question: "Which regulated or restricted obligations require owned action?",
    roles: [
      "Privacy & Legal",
      "Application Integrity Reviewer",
      "Platform Admin",
    ],
    metricKeys: ["privacy_sla", "stage_sla_rate", "automation_success"],
    primaryBreakdown: "privacyState",
  },
  {
    id: "data-readiness",
    name: "Canonical data-model readiness",
    shortName: "Data contract",
    purpose: "Solution-design readiness",
    question:
      "Does every navigation family resolve to atomic concepts with complete field, relationship and transition contracts?",
    roles: ["Configuration Admin", "Platform Admin", "Privacy & Legal"],
    metricKeys: [
      "object_coverage",
      "data_group_coverage",
      "data_point_coverage",
      "quality_coverage",
    ],
    primaryBreakdown: "lifecycleType",
  },
];

export const metricDefinitions: Record<
  string,
  {
    label: string;
    definition: string;
    grain: string;
    direction: "up" | "down" | "neutral";
  }
> = {
  application_volume: {
    label: "Applications",
    definition:
      "Count of synthetic application attempts observed inside the selected rolling window after global filters.",
    grain: "One application attempt",
    direction: "neutral",
  },
  active_applications: {
    label: "Active applications",
    definition:
      "Filtered applications whose current stage is not Hired, Rejected or Withdrawn.",
    grain: "One current application",
    direction: "neutral",
  },
  stage_sla_rate: {
    label: "Within stage SLA",
    definition:
      "Active filtered applications with stage age less than or equal to the configured stage SLA, divided by active filtered applications.",
    grain: "One current active application",
    direction: "up",
  },
  median_stage_age: {
    label: "Median stage age",
    definition:
      "Median whole days in the current stage for active filtered applications.",
    grain: "One current active application",
    direction: "down",
  },
  evidence_readiness: {
    label: "Evidence complete",
    definition:
      "Filtered applications with required interview scorecards where submitted scorecards equal required scorecards.",
    grain: "One application at an interview decision point",
    direction: "up",
  },
  schedule_confirmation: {
    label: "Sessions confirmed",
    definition:
      "Filtered interview-relevant applications in Confirmed or Complete state divided by all interview-relevant applications.",
    grain: "One application interview context",
    direction: "up",
  },
  offer_acceptance: {
    label: "Offer acceptance",
    definition:
      "Accepted offer fixtures divided by accepted plus declined offer fixtures; pending and merely extended offers are excluded.",
    grain: "One terminal offer response",
    direction: "up",
  },
  hires: {
    label: "Reconciled hires",
    definition:
      "Filtered applications in Hired stage with a Reconciled handoff fixture.",
    grain: "One completed hire handoff",
    direction: "up",
  },
  candidate_experience: {
    label: "Candidate experience",
    definition:
      "Average rating among eligible synthetic survey subjects who submitted a response. Nonresponse is excluded and shown in the denominator context; feedback is separated from hiring decisions.",
    grain: "One submitted eligible synthetic response",
    direction: "up",
  },
  message_delivery: {
    label: "Message delivery",
    definition:
      "Delivered message fixtures divided by delivered, queued and failed fixtures; suppressed messages are excluded from delivery eligibility.",
    grain: "One eligible message",
    direction: "up",
  },
  automation_success: {
    label: "Automation success",
    definition:
      "Succeeded fixture executions divided by succeeded plus failed executions; suppressed and manual records are shown separately.",
    grain: "One eligible automation execution",
    direction: "up",
  },
  privacy_sla: {
    label: "Privacy cases on time",
    definition:
      "Open or due-soon privacy fixtures divided by all active privacy fixtures. Overdue fixtures fail the rate.",
    grain: "One active privacy case",
    direction: "up",
  },
  handoff_reconciliation: {
    label: "Handoffs reconciled",
    definition:
      "Reconciled handoff fixtures divided by reconciled plus failed handoff fixtures. Not-ready records are excluded.",
    grain: "One attempted hire handoff",
    direction: "up",
  },
  source_to_hire: {
    label: "Source-to-hire",
    definition:
      "Filtered reconciled hires divided by filtered application attempts. Source is a diagnostic dimension, never a candidate quality signal.",
    grain: "Application source cohort",
    direction: "up",
  },
  object_coverage: {
    label: "Atomic decomposition coverage",
    definition:
      "Filtered navigation families resolving to at least one independently governed atomic concept divided by filtered navigation families.",
    grain: "One navigation family",
    direction: "up",
  },
  data_group_coverage: {
    label: "Atomic concepts in scope",
    definition:
      "Canonical atomic concepts resolved from the filtered navigation families; supporting concepts remain attached to their governing family.",
    grain: "One atomic concept",
    direction: "up",
  },
  data_point_coverage: {
    label: "Atomic field-contract coverage",
    definition:
      "Atomic concepts with all 13 governance/provenance fields and at least three object-specific business fields divided by filtered atomic concepts.",
    grain: "One atomic concept",
    direction: "up",
  },
  quality_coverage: {
    label: "Relationship and lifecycle coverage",
    definition:
      "Atomic concepts with at least one structured relationship and one guarded transition contract divided by filtered atomic concepts.",
    grain: "One atomic concept",
    direction: "up",
  },
};

export const analyticsSource = {
  id: "SRC-ANALYTICS-CANONICAL-v1.9",
  name: "Canonical synthetic recruitment analytics projection",
  path: "src/data/analytics.ts → analyticsApplications",
  grain:
    "One canonical synthetic application attempt with source-event and aggregate-version lineage",
  freshness: "Fixture snapshot · Aug 28, 2026 · 9:30 AM PT",
  exclusions:
    "No real candidates, demographic attributes, compensation details, raw message content or production events. Experience nonresponse is explicit.",
};
