export type Tone = "success" | "warning" | "danger" | "info" | "neutral";

export const prototypeMeta = {
  employer: "Harbor & Pine Labs",
  candidate: "Maya Chen",
  release: "v1.3-wireframe",
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

export const actionItems = [
  { id: "WORK-101", label: "Scorecard overdue", subject: "Maya Chen · Senior Product Designer", owner: "You", age: "6h overdue", tone: "danger" as Tone, why: "Required interview evidence is missing; decision readiness is blocked.", source: "Scorecard assignment v2 · fresh 3 min ago" },
  { id: "WORK-102", label: "Candidate waiting", subject: "Noah Williams · Recruiting Operations Partner", owner: "Recruiting queue", age: "18h waiting", tone: "warning" as Tone, why: "Availability was received and no coordinator has proposed a session.", source: "Availability v1 · fresh 7 min ago" },
  { id: "WORK-103", label: "Message failed", subject: "Confirmation bounce · APP-DEMO-009", owner: "Ops queue", age: "2 retries", tone: "danger" as Tone, why: "Delivery failed twice; automatic retry is exhausted and manual contact is owned.", source: "Message attempt 3 · fresh 1 min ago" },
  { id: "WORK-104", label: "Approval due", subject: "Offer v4 · Product Designer", owner: "Avery Patel", age: "Due in 4h", tone: "info" as Tone, why: "The current immutable offer version needs one final human approval.", source: "Approval policy v2 · fresh 4 min ago" },
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
