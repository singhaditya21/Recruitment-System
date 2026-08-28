export type SavedReportDefinition = {
  id: string;
  name: string;
  description: string;
  dataset: string;
  dimensions: string[];
  measures: string[];
  roles: string[];
  owner: string;
  visibility: "Private" | "Team" | "Governed audience";
  freshness: string;
  status: "Certified" | "Draft";
};

export const savedReportDefinitions: SavedReportDefinition[] = [
  {
    id: "RPT-001",
    name: "Weekly talent operating review",
    description:
      "Pipeline, SLA, evidence, offer and handoff guardrails for the recruiting operating review.",
    dataset: "Application current-state projection",
    dimensions: ["Week", "Job", "Stage"],
    measures: ["Applications", "Within-stage SLA", "Reconciled hires"],
    roles: ["Recruiter", "Hiring Manager", "Auditor"],
    owner: "Recruiting operations",
    visibility: "Governed audience",
    freshness: "Fixture snapshot · 28 Aug 2026",
    status: "Certified",
  },
  {
    id: "RPT-002",
    name: "Scheduling recovery queue",
    description:
      "Interview contexts that need scheduling, confirmation or delivery recovery.",
    dataset: "Interview and message projection",
    dimensions: ["Coordinator", "Interview state"],
    measures: ["Eligible sessions", "Confirmed sessions", "Median wait"],
    roles: ["Recruiter", "Recruiting Coordinator", "Auditor"],
    owner: "Coordination operations",
    visibility: "Team",
    freshness: "Fixture snapshot · 28 Aug 2026",
    status: "Certified",
  },
  {
    id: "RPT-003",
    name: "Offer and handoff control",
    description:
      "Approved offer versions, responses, opening reservations and exact handoff acknowledgement.",
    dataset: "Offer/handoff projection",
    dimensions: ["Offer state", "Handoff state"],
    measures: ["Responded offers", "Acceptance", "Reconciled handoffs"],
    roles: [
      "Recruiter",
      "Hiring Manager",
      "Offer Approver",
      "HRIS Operator",
      "Auditor",
    ],
    owner: "People operations",
    visibility: "Governed audience",
    freshness: "Fixture snapshot · 28 Aug 2026",
    status: "Certified",
  },
  {
    id: "RPT-004",
    name: "Privacy obligation register",
    description:
      "Verified request scope, due date, ownership and provider reconciliation without hiring evidence.",
    dataset: "Privacy case projection",
    dimensions: ["Request type", "State", "Owner"],
    measures: ["Active cases", "On-time cases", "Overdue cases"],
    roles: ["Privacy & Legal", "Platform Admin", "Auditor"],
    owner: "Privacy operations",
    visibility: "Governed audience",
    freshness: "Fixture snapshot · 28 Aug 2026",
    status: "Certified",
  },
  {
    id: "RPT-005",
    name: "Automation recovery evidence",
    description:
      "Eligible, suppressed, failed, replayed and reconciled rule executions.",
    dataset: "Automation execution ledger",
    dimensions: ["Rule", "Execution state"],
    measures: ["Eligible runs", "Success", "Owned failures"],
    roles: [
      "Configuration Admin",
      "Platform Admin",
      "HRIS Operator",
      "Auditor",
    ],
    owner: "Platform operations",
    visibility: "Team",
    freshness: "Fixture snapshot · 28 Aug 2026",
    status: "Certified",
  },
  {
    id: "RPT-006",
    name: "Candidate communication service",
    description:
      "Delivery eligibility, candidate wait and service-recovery outcomes separated from selection decisions.",
    dataset: "Message and service projection",
    dimensions: ["Channel", "Delivery state"],
    measures: ["Eligible messages", "Delivery", "Waiting candidates"],
    roles: [
      "Recruiter",
      "Recruiting Coordinator",
      "Candidate Support",
      "Auditor",
    ],
    owner: "Candidate operations",
    visibility: "Team",
    freshness: "Fixture snapshot · 28 Aug 2026",
    status: "Draft",
  },
];

export const reportSchedules = [
  {
    id: "SCH-001",
    reportId: "RPT-001",
    cadence: "Monday · 8:00 AM PT",
    audience: "Recruiting operating review",
    format: "Accessible web link",
    state: "Active",
    nextRun: "31 Aug · 8:00 AM PT",
  },
  {
    id: "SCH-002",
    reportId: "RPT-003",
    cadence: "Weekdays · 4:00 PM PT",
    audience: "Offer control owners",
    format: "Restricted CSV",
    state: "Approval required",
    nextRun: "Pending recipient reauthorization",
  },
  {
    id: "SCH-003",
    reportId: "RPT-004",
    cadence: "Daily · 9:00 AM local",
    audience: "Privacy case owners",
    format: "Accessible web link",
    state: "Active",
    nextRun: "29 Aug · 9:00 AM local",
  },
] as const;

export const reportDeliveries = [
  {
    id: "DLV-101",
    reportId: "RPT-001",
    recipient: "Recruiting operating review",
    channel: "Authenticated link",
    state: "Delivered",
    watermark: "Synthetic · expires in 7 days",
    at: "25 Aug · 8:02 AM PT",
  },
  {
    id: "DLV-102",
    reportId: "RPT-003",
    recipient: "Offer control owners",
    channel: "Restricted CSV",
    state: "Revoked",
    watermark: "Synthetic · revoked",
    at: "27 Aug · 4:03 PM PT",
  },
  {
    id: "DLV-103",
    reportId: "RPT-004",
    recipient: "Privacy case owners",
    channel: "Authenticated link",
    state: "Delivered",
    watermark: "Restricted synthetic",
    at: "28 Aug · 9:01 AM local",
  },
  {
    id: "DLV-104",
    reportId: "RPT-002",
    recipient: "Coordination operations",
    channel: "Authenticated link",
    state: "Recipient denied",
    watermark: "No content disclosed",
    at: "28 Aug · 9:12 AM PT",
  },
] as const;

export const reportTargets = [
  {
    metric: "Within-stage SLA",
    target: "≥ 85%",
    type: "Operating target",
    owner: "Recruiting operations",
    status: "Provisional — needs pilot baseline",
  },
  {
    metric: "Evidence complete",
    target: "100% before decision",
    type: "Hard guardrail",
    owner: "Hiring governance",
    status: "Normative",
  },
  {
    metric: "Message delivery",
    target: "≥ 98% of eligible",
    type: "Reliability target",
    owner: "Candidate operations",
    status: "Provisional — needs provider baseline",
  },
  {
    metric: "Handoff reconciliation",
    target: "100% exact acknowledgement",
    type: "Hard guardrail",
    owner: "HRIS operations",
    status: "Normative",
  },
] as const;

export const reportRestatements = [
  {
    id: "RST-001",
    reportId: "RPT-001",
    period: "18–24 Aug",
    reason: "Late synthetic stage projection",
    effect: "+1 active application; SLA denominator +1",
    state: "Published with annotation",
  },
  {
    id: "RST-002",
    reportId: "RPT-003",
    period: "25 Aug",
    reason: "Duplicate handoff attempt suppressed",
    effect: "No business-count change",
    state: "Reconciled",
  },
  {
    id: "RST-003",
    reportId: "RPT-002",
    period: "27 Aug",
    reason: "Timezone label correction",
    effect: "No metric change",
    state: "Published with annotation",
  },
] as const;
