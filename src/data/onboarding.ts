export type OnboardingTaskStatus =
  | "Ready"
  | "In progress"
  | "Blocked"
  | "Complete";

export type OnboardingTask = {
  id: string;
  title: string;
  category:
    | "Profile"
    | "Document"
    | "Compliance"
    | "IT"
    | "Facilities"
    | "Manager"
    | "Learning";
  owner: string;
  ownerType: "New hire" | "People Ops" | "Manager" | "IT" | "Facilities";
  due: string;
  status: OnboardingTaskStatus;
  required: boolean;
  description: string;
  dependency?: string;
  evidence?: string;
};

export type NewHireRecord = {
  id: string;
  candidateId: string;
  applicationId: string;
  preHireId: string;
  pendingWorkerId: string;
  employeeId: string | null;
  name: string;
  initials: string;
  role: string;
  department: string;
  manager: string;
  location: string;
  startDate: string;
  startDateShort: string;
  plan: string;
  stage: "Transition" | "Preboarding" | "Day one" | "First 30 days" | "Complete";
  progress: number;
  risk: "On track" | "Watch" | "At risk";
  portalStatus: "Invited" | "Activated" | "Locked" | "Not invited";
  hrisStatus: "Not sent" | "Pending" | "Correction required" | "Validated" | "Worker created";
  owner: string;
  blocker: string | null;
  tasksComplete: number;
  tasksTotal: number;
  documentsSigned: number;
  documentsTotal: number;
};

export type OnboardingTemplate = {
  id: string;
  name: string;
  version: number;
  status: "Published" | "Draft" | "Retiring";
  population: string;
  owner: string;
  activePlans: number;
  completionRate: number;
  stages: Array<{ name: string; offset: string; tasks: string[] }>;
};

export type OnboardingException = {
  id: string;
  newHireId: string;
  newHire: string;
  type: string;
  severity: "Blocker" | "High" | "Medium";
  owner: string;
  due: string;
  ageHours: number;
  state: "Open" | "Investigating" | "Waiting";
  safeImpact: string;
  nextAction: string;
};

export type ProvisioningRequest = {
  id: string;
  newHireId: string;
  newHire: string;
  function: "IT" | "Facilities" | "Manager";
  item: string;
  owner: string;
  due: string;
  status: "Queued" | "In progress" | "Blocked" | "Ready" | "Delivered";
  dependency: string;
};

export type NewHireDocument = {
  id: string;
  title: string;
  type: "E-signature" | "Form" | "Upload" | "Read and acknowledge";
  version: string;
  status: "Complete" | "Ready" | "Blocked";
  due: string;
  retention: string;
  description: string;
};

export const flagshipNewHire: NewHireRecord = {
  id: "NHR-DEMO-001",
  candidateId: "PER-DEMO-001",
  applicationId: "APP-DEMO-001",
  preHireId: "PHR-DEMO-001",
  pendingWorkerId: "PWR-DEMO-001",
  employeeId: null,
  name: "Maya Chen",
  initials: "MC",
  role: "Senior Product Designer",
  department: "Product & Research",
  manager: "Marcus Johnson",
  location: "Oakland, CA · Remote",
  startDate: "September 15, 2026",
  startDateShort: "Sep 15",
  plan: "US Remote Employee · Product v3",
  stage: "Preboarding",
  progress: 63,
  risk: "At risk",
  portalStatus: "Activated",
  hrisStatus: "Correction required",
  owner: "Priya Nair",
  blocker: "HRIS work-location code requires correction",
  tasksComplete: 5,
  tasksTotal: 8,
  documentsSigned: 2,
  documentsTotal: 4,
};

const people = [
  ["Liam Patel", "LP"], ["Sofia Ramirez", "SR"], ["Noah Williams", "NW"],
  ["Ava Thompson", "AT"], ["Ethan Kim", "EK"], ["Isabella Rossi", "IR"],
  ["Lucas Martin", "LM"], ["Mia Anderson", "MA"], ["Oliver Nguyen", "ON"],
  ["Amelia Brown", "AB"], ["Elijah Davis", "ED"], ["Harper Wilson", "HW"],
  ["James Taylor", "JT"], ["Evelyn Moore", "EM"], ["Henry Jackson", "HJ"],
  ["Luna White", "LW"], ["Alexander Harris", "AH"], ["Camila Clark", "CC"],
  ["Daniel Lewis", "DL"], ["Gianna Walker", "GW"], ["Mateo Hall", "MH"],
  ["Chloe Allen", "CA"], ["Sebastian Young", "SY"], ["Nora King", "NK"],
  ["Jack Wright", "JW"], ["Layla Scott", "LS"], ["Leo Green", "LG"],
  ["Aria Baker", "AB"], ["Julian Adams", "JA"], ["Zoey Nelson", "ZN"],
  ["Wyatt Carter", "WC"], ["Mila Mitchell", "MM"], ["David Perez", "DP"],
  ["Riley Roberts", "RR"], ["Isaac Turner", "IT"],
] as const;

const roles = [
  ["Data Platform Engineer", "Engineering", "Elena Garcia"],
  ["Customer Success Manager", "Customer Experience", "Priya Shah"],
  ["Recruiting Operations Partner", "People Operations", "Alex Rivera"],
  ["Product Marketing Manager", "Marketing", "Nina Patel"],
  ["Financial Analyst", "Finance", "Owen Brooks"],
  ["Security Engineer", "Security", "Ben Carter"],
] as const;

const stages: NewHireRecord["stage"][] = [
  "Transition", "Preboarding", "Preboarding", "Day one", "First 30 days", "Complete",
];

export const newHireRecords: NewHireRecord[] = [
  flagshipNewHire,
  ...people.map(([name, initials], index) => {
    const sequence = index + 2;
    const [role, department, manager] = roles[index % roles.length];
    const stage = stages[index % stages.length];
    const progress = [12, 31, 48, 72, 86, 100][index % 6];
    const hasBlocker = index % 7 === 0 || index % 11 === 0;
    return {
      id: `NHR-DEMO-${String(sequence).padStart(3, "0")}`,
      candidateId: `PER-DEMO-${String(sequence).padStart(3, "0")}`,
      applicationId: `APP-DEMO-${String(sequence).padStart(3, "0")}`,
      preHireId: `PHR-DEMO-${String(sequence).padStart(3, "0")}`,
      pendingWorkerId: `PWR-DEMO-${String(sequence).padStart(3, "0")}`,
      employeeId: stage === "Complete" ? `EMP-DEMO-${String(sequence).padStart(3, "0")}` : null,
      name,
      initials,
      role,
      department,
      manager,
      location: index % 3 === 0 ? "Austin, TX · Hybrid" : index % 3 === 1 ? "New York, NY · Office" : "California · Remote",
      startDate: `September ${16 + (index % 12)}, 2026`,
      startDateShort: `Sep ${16 + (index % 12)}`,
      plan: index % 3 === 0 ? "US Hybrid Employee v4" : index % 3 === 1 ? "US Office Employee v6" : "US Remote Employee v5",
      stage,
      progress,
      risk: hasBlocker ? "At risk" : index % 5 === 0 ? "Watch" : "On track",
      portalStatus: index % 9 === 0 ? "Not invited" : index % 8 === 0 ? "Locked" : index % 3 === 0 ? "Invited" : "Activated",
      hrisStatus: stage === "Complete" ? "Worker created" : hasBlocker ? "Correction required" : progress > 70 ? "Validated" : index % 3 === 0 ? "Pending" : "Not sent",
      owner: index % 2 === 0 ? "Priya Nair" : "Alex Rivera",
      blocker: hasBlocker ? (index % 2 === 0 ? "Legal-name validation is waiting on new-hire correction" : "Cost-center mapping was rejected by HRIS") : null,
      tasksComplete: Math.round(progress / 12.5),
      tasksTotal: 8,
      documentsSigned: Math.min(4, Math.floor(progress / 25)),
      documentsTotal: 4,
    } satisfies NewHireRecord;
  }),
];

export const flagshipOnboardingTasks: OnboardingTask[] = [
  {
    id: "OBT-DEMO-001", title: "Confirm personal information", category: "Profile",
    owner: "Maya Chen", ownerType: "New hire", due: "Sep 2", status: "In progress", required: true,
    description: "Review the minimum personal details that will transfer to the worker record.", evidence: "Profile submission v2",
  },
  {
    id: "OBT-DEMO-002", title: "Review and sign invention agreement", category: "Document",
    owner: "Maya Chen", ownerType: "New hire", due: "Sep 3", status: "Ready", required: true,
    description: "Open the version-pinned document and complete the simulated signature step.", evidence: "Signature envelope ENV-DEMO-001",
  },
  {
    id: "OBT-DEMO-003", title: "Correct pending-worker work location", category: "Compliance",
    owner: "Owen Brooks", ownerType: "People Ops", due: "Today", status: "Blocked", required: true,
    description: "Resolve the rejected HRIS location mapping before worker conversion can continue.", dependency: "HRIS location reference data",
  },
  {
    id: "OBT-DEMO-004", title: "Provision design applications", category: "IT",
    owner: "IT provisioning queue", ownerType: "IT", due: "Sep 10", status: "In progress", required: true,
    description: "Prepare approved role-based application access without exposing credentials.", dependency: "Validated pending worker",
  },
  {
    id: "OBT-DEMO-005", title: "Publish first-week plan", category: "Manager",
    owner: "Marcus Johnson", ownerType: "Manager", due: "Sep 8", status: "Complete", required: true,
    description: "Confirm the manager, buddy, meetings and first-week learning objectives.", evidence: "Manager plan v3",
  },
  {
    id: "OBT-DEMO-006", title: "Complete federal and state tax forms", category: "Compliance",
    owner: "Maya Chen", ownerType: "New hire", due: "Sep 5", status: "Ready", required: true,
    description: "Complete jurisdiction-specific forms in a private, purpose-limited flow.", dependency: "Personal information confirmed",
  },
  {
    id: "OBT-DEMO-007", title: "Prepare equipment shipment", category: "IT",
    owner: "IT provisioning queue", ownerType: "IT", due: "Sep 9", status: "Ready", required: true,
    description: "Ship the approved device bundle after address verification.", dependency: "Shipping address verified",
  },
  {
    id: "OBT-DEMO-008", title: "Confirm orientation and buddy", category: "Manager",
    owner: "Marcus Johnson", ownerType: "Manager", due: "Sep 11", status: "Ready", required: true,
    description: "Confirm the day-one agenda, buddy and first check-in.", dependency: "First-week plan published",
  },
];

export const onboardingIdentityChain = [
  { label: "Candidate", id: "PER-DEMO-001", state: "Reviewed identity", tone: "success" as const },
  { label: "Accepted application", id: "APP-DEMO-001", state: "Offer accepted", tone: "success" as const },
  { label: "Pre-hire", id: "PHR-DEMO-001", state: "Preboarding active", tone: "info" as const },
  { label: "Pending worker", id: "PWR-DEMO-001", state: "Correction required", tone: "warning" as const },
  { label: "Employee", id: "Not created", state: "After validated conversion", tone: "neutral" as const },
];

const baseStages = [
  { name: "Immediately after acceptance", offset: "T-30 to T-21", tasks: ["Create pre-hire", "Send portal invitation", "Validate worker payload"] },
  { name: "Personal and compliance", offset: "T-21 to T-10", tasks: ["Confirm personal details", "Complete forms", "Sign documents"] },
  { name: "Provisioning", offset: "T-14 to T-2", tasks: ["Manager plan", "Accounts and equipment", "Facilities access"] },
  { name: "Day one", offset: "T+0", tasks: ["Orientation", "Manager welcome", "Equipment check"] },
  { name: "First 30 days", offset: "T+1 to T+30", tasks: ["Learning plan", "Check-ins", "Experience survey"] },
];

export const onboardingTemplates: OnboardingTemplate[] = [
  ["ONT-001", "US Remote Employee", 5, "Published", "US · remote · employee", "Nina Patel", 18, 91],
  ["ONT-002", "US Office Employee", 6, "Published", "US · office · employee", "Nina Patel", 12, 94],
  ["ONT-003", "US Hybrid Employee", 4, "Published", "US · hybrid · employee", "Priya Nair", 9, 88],
  ["ONT-004", "People Manager Addendum", 3, "Published", "New people managers", "Marcus Johnson", 4, 86],
  ["ONT-005", "Engineering Access Addendum", 7, "Published", "Engineering and Security", "Ben Carter", 7, 89],
  ["ONT-006", "International Employer-of-Record", 2, "Draft", "Approved EOR countries", "Aisha Rahman", 0, 0],
  ["ONT-007", "Fixed-term Worker", 3, "Published", "US fixed-term", "Owen Brooks", 3, 83],
  ["ONT-008", "Legacy US Employee", 9, "Retiring", "Assigned plans only", "Nina Patel", 2, 78],
].map(([id, name, version, status, population, owner, activePlans, completionRate], index) => ({
  id: String(id), name: String(name), version: Number(version), status: status as OnboardingTemplate["status"],
  population: String(population), owner: String(owner), activePlans: Number(activePlans), completionRate: Number(completionRate),
  stages: baseStages.map((stage, stageIndex) => ({ ...stage, tasks: stage.tasks.map((task) => index === 4 && stageIndex === 2 ? `${task} · privileged access` : task) })),
}));

const exceptionTypes = [
  "HRIS field rejection", "Missing required form", "Identity mismatch", "Start-date change",
  "Provisioning dependency", "Portal access", "Document expiry", "Manager task overdue",
] as const;

export const onboardingExceptions: OnboardingException[] = Array.from({ length: 18 }, (_, index) => {
  const hire = newHireRecords[(index * 2) % newHireRecords.length];
  const severity = index % 6 === 0 ? "Blocker" : index % 3 === 0 ? "High" : "Medium";
  return {
    id: `OBX-DEMO-${String(index + 1).padStart(3, "0")}`,
    newHireId: hire.id, newHire: hire.name, type: exceptionTypes[index % exceptionTypes.length], severity,
    owner: index % 4 === 0 ? "Owen Brooks" : index % 4 === 1 ? "Priya Nair" : index % 4 === 2 ? "IT queue" : hire.manager,
    due: index < 4 ? "Today" : `Sep ${2 + (index % 11)}`,
    ageHours: 4 + index * 3,
    state: index % 3 === 0 ? "Investigating" : index % 3 === 1 ? "Waiting" : "Open",
    safeImpact: severity === "Blocker" ? "Worker conversion cannot proceed" : "Plan may miss its target date",
    nextAction: index % 2 === 0 ? "Correct source value and replay safely" : "Contact owner with minimum necessary context",
  };
});

const provisioningItems = [
  ["IT", "Laptop and security baseline", "Endpoint operations"],
  ["IT", "Role-based application bundle", "Identity operations"],
  ["Facilities", "Building and floor access", "Workplace operations"],
  ["Facilities", "Desk or remote equipment", "Workplace operations"],
  ["Manager", "First-week schedule", "Hiring manager"],
  ["Manager", "Buddy and learning plan", "Hiring manager"],
] as const;

export const provisioningRequests: ProvisioningRequest[] = Array.from({ length: 72 }, (_, index) => {
  const hire = newHireRecords[index % newHireRecords.length];
  const [fn, item, owner] = provisioningItems[index % provisioningItems.length];
  const statuses: ProvisioningRequest["status"][] = ["Queued", "In progress", "Ready", "Blocked", "Delivered"];
  const status = statuses[(index + Math.floor(index / 7)) % statuses.length];
  return {
    id: `PRV-DEMO-${String(index + 1).padStart(3, "0")}`,
    newHireId: hire.id, newHire: hire.name, function: fn, item,
    owner: owner === "Hiring manager" ? hire.manager : owner,
    due: `Sep ${5 + (index % 14)}`, status,
    dependency: status === "Blocked" ? (index % 2 ? "Validated pending-worker record" : "New-hire address confirmation") : "Dependencies satisfied",
  };
});

export const newHireDocuments: NewHireDocument[] = [
  { id: "DOC-NH-001", title: "Offer acknowledgement", type: "Read and acknowledge", version: "v4 · accepted offer", status: "Complete", due: "Complete", retention: "Employment record · 7 years", description: "Candidate-safe copy of the accepted offer terms." },
  { id: "DOC-NH-002", title: "Confidential information and inventions agreement", type: "E-signature", version: "US-CA v7", status: "Ready", due: "Sep 3", retention: "Employment + 7 years", description: "Version-pinned agreement with envelope evidence and signer receipt." },
  { id: "DOC-NH-003", title: "Federal tax withholding", type: "Form", version: "2026 W-4", status: "Ready", due: "Sep 5", retention: "Payroll policy", description: "Private tax form; People Ops sees completion, not entered values." },
  { id: "DOC-NH-004", title: "California withholding", type: "Form", version: "2026 DE 4", status: "Blocked", due: "Sep 5", retention: "Payroll policy", description: "Unlocks after the work-location correction is validated." },
  { id: "DOC-NH-005", title: "Employment eligibility evidence", type: "Upload", version: "I-9 workflow v3", status: "Ready", due: "Sep 16", retention: "Legally required schedule", description: "Secure upload and authorized reviewer flow; raw evidence is restricted." },
  { id: "DOC-NH-006", title: "Employee handbook", type: "Read and acknowledge", version: "August 2026", status: "Complete", due: "Complete", retention: "Employment record", description: "Accessible handbook copy with acknowledgement timestamp." },
];

export const onboardingSummary = {
  activeNewHires: newHireRecords.filter((record) => record.stage !== "Complete").length,
  starting14Days: newHireRecords.filter((_, index) => index % 2 === 0).length,
  atRisk: newHireRecords.filter((record) => record.risk === "At risk").length,
  openExceptions: onboardingExceptions.length,
  blockedProvisioning: provisioningRequests.filter((request) => request.status === "Blocked").length,
  averageProgress: Math.round(newHireRecords.reduce((sum, record) => sum + record.progress, 0) / newHireRecords.length),
};
