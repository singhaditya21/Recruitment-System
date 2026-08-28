import {
  applicationRecords as anchorApplications,
  interviewRecords as anchorInterviews,
  assignmentRecords as anchorAssignments,
  jobs as anchorJobs,
  syntheticCandidate,
  type ApplicationRecord,
  type Tone,
} from "./fixtures";

export type JobRecord = {
  id: string;
  publicId: string;
  title: string;
  team: string;
  location: string;
  workplace: string;
  type: string;
  pay: string;
  status: string;
  posted: string;
  version: string;
  summary: string;
  requirements: string[];
  owner: string;
};

export type CandidateRecord = {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  location: string;
  timezone: string;
  source: string;
  consent: string;
  status: string;
  owner: string;
  updated: string;
};

export type InterviewRecord = {
  id: string;
  applicationId: string;
  candidate: string;
  job: string;
  type: string;
  interviewer: string;
  time: string;
  state: string;
  tone: Tone;
};

export type AssignmentRecord = {
  id: string;
  interviewId: string;
  applicationId: string;
  candidate: string;
  job: string;
  interviewer: string;
  state: string;
  due: string;
  tone: Tone;
};

const owners = ["Alex Rivera", "Priya Nair", "Marcus Johnson"];
const teams = [
  "Product & Research",
  "Engineering",
  "People Operations",
  "Customer Experience",
  "Security & Trust",
  "Finance & Strategy",
];
const locations = [
  "California · Remote",
  "San Francisco, CA · Hybrid",
  "New York, NY · Hybrid",
  "Austin, TX · Hybrid",
  "United States · Remote",
  "London, UK · Hybrid",
];
const titles = [
  "Product Manager",
  "Software Engineer",
  "Research Operations Lead",
  "Customer Success Partner",
  "Security Analyst",
  "Financial Systems Manager",
  "Product Designer",
  "Data Engineer",
  "Recruiting Partner",
  "Technical Program Manager",
  "Privacy Operations Specialist",
  "Business Operations Analyst",
];

const anchoredJobs: JobRecord[] = anchorJobs.map((job, index) => ({
  ...job,
  requirements: [...job.requirements],
  owner: owners[index % owners.length],
}));

const generatedJobs: JobRecord[] = Array.from({ length: 45 }, (_, index) => {
  const number = index + 1;
  const team = teams[index % teams.length];
  const title = `${index % 4 === 0 ? "Senior " : ""}${titles[index % titles.length]}${index >= titles.length ? ` ${Math.floor(index / titles.length) + 1}` : ""}`;
  const workplace = index % 3 === 0 ? "Remote" : "Hybrid";
  const status = ["Published", "Published", "Draft", "Approved", "Paused"][
    index % 5
  ];
  return {
    id: `JOB-SEED-${String(number).padStart(3, "0")}`,
    publicId: `synthetic-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${number}`,
    title,
    team,
    location: locations[index % locations.length],
    workplace,
    type: index % 7 === 0 ? "Contract" : "Full time",
    pay: `$${95 + (index % 10) * 9},000–$${125 + (index % 10) * 10},000 USD`,
    status,
    posted: status === "Published" ? `${(index % 27) + 1} days ago` : "Not public",
    version: `Posting v${(index % 4) + 1} · Policy v2`,
    summary: `A synthetic ${team.toLowerCase()} role used to exercise dense recruiting operations, filters and governance states.`,
    requirements: [
      "Structured evidence relevant to the role",
      "Clear cross-functional communication",
      "Accessible and inclusive working practices",
      "Sound judgment with sensitive information",
    ],
    owner: owners[index % owners.length],
  };
});

export const seededJobs: JobRecord[] = [...anchoredJobs, ...generatedJobs];

const anchorCandidateRows = [
  {
    id: syntheticCandidate.id,
    name: syntheticCandidate.name,
    email: syntheticCandidate.email,
    phone: syntheticCandidate.phone,
    location: syntheticCandidate.location,
  },
  {
    id: "PER-DEMO-004",
    name: "Noah Williams",
    email: "noah.williams@example.test",
    phone: "+1 415 555 0104",
    location: "San Francisco, CA",
  },
  {
    id: "PER-DEMO-006",
    name: "Sofia Martinez",
    email: "sofia.martinez@example.test",
    phone: "+1 415 555 0106",
    location: "San Jose, CA",
  },
  {
    id: "PER-DEMO-009",
    name: "Ethan Okafor",
    email: "ethan.okafor@example.test",
    phone: "+1 415 555 0109",
    location: "Oakland, CA",
  },
  {
    id: "PER-DEMO-011",
    name: "Leila Haddad",
    email: "leila.haddad@example.test",
    phone: "+1 415 555 0111",
    location: "Berkeley, CA",
  },
] as const;

const firstNames = [
  "Avery",
  "Riley",
  "Taylor",
  "Morgan",
  "Cameron",
  "Parker",
  "Quinn",
  "Rowan",
  "Skyler",
  "Emerson",
  "Finley",
  "Sage",
];
const lastNames = [
  "Anderson",
  "Bennett",
  "Campbell",
  "Diaz",
  "Evans",
  "Foster",
  "Gupta",
  "Hughes",
  "Ivanov",
  "Jones",
  "Kim",
  "Lopez",
  "Miller",
  "Nguyen",
  "Owens",
  "Patel",
  "Reed",
  "Singh",
];

const anchoredCandidates: CandidateRecord[] = anchorCandidateRows.map(
  (candidate, index) => ({
    ...candidate,
    initials: candidate.name
      .split(" ")
      .map((part) => part[0])
      .join(""),
    timezone: "America/Los_Angeles",
    source: ["Careers site", "Referral", "Agency"][index % 3],
    consent: "Candidate notice v2 · acknowledged",
    status: "Active",
    owner: owners[index % owners.length],
    updated: "Today · fixture anchor",
  }),
);

const generatedCandidates: CandidateRecord[] = Array.from(
  { length: 315 },
  (_, index) => {
    const number = index + 1;
    const name = `${firstNames[index % firstNames.length]} ${lastNames[index % lastNames.length]} ${String(number).padStart(3, "0")}`;
    return {
      id: `PER-SEED-${String(number).padStart(3, "0")}`,
      name,
      initials: `${firstNames[index % firstNames.length][0]}${lastNames[index % lastNames.length][0]}`,
      email: `synthetic.candidate.${String(number).padStart(3, "0")}@example.test`,
      phone: `+1 555 01${String(number).padStart(4, "0")}`,
      location: locations[index % locations.length].replace(" · Hybrid", ""),
      timezone: index % 5 === 0 ? "Europe/London" : "America/Los_Angeles",
      source: ["Careers site", "Referral", "Agency", "Sourced"][index % 4],
      consent: "Candidate notice v2 · acknowledged",
      status: index % 19 === 0 ? "Archived" : "Active",
      owner: owners[index % owners.length],
      updated: `${(index % 28) + 1} days ago`,
    };
  },
);

export const seededCandidates: CandidateRecord[] = [
  ...anchoredCandidates,
  ...generatedCandidates,
];

const applicationStages = [
  "Recruiter review",
  "Screening",
  "Scheduling",
  "Interviews",
  "Debrief",
  "Offer",
  "Hired",
  "Rejected",
  "Withdrawn",
];

const generatedApplications: ApplicationRecord[] = Array.from(
  { length: 635 },
  (_, index) => {
    const number = index + 1;
    const candidate = generatedCandidates[index % generatedCandidates.length];
    const job = seededJobs[index % seededJobs.length];
    const stage = applicationStages[index % applicationStages.length];
    const tone: Tone =
      stage === "Hired"
        ? "success"
        : stage === "Scheduling" || stage === "Interviews"
          ? "warning"
          : stage === "Rejected" || stage === "Withdrawn"
            ? "neutral"
            : "info";
    return {
      id: `APP-SEED-${String(number).padStart(3, "0")}`,
      candidateId: candidate.id,
      candidate: candidate.name,
      initials: candidate.initials,
      jobId: job.id,
      job: job.title,
      stage,
      owner: owners[index % owners.length],
      stageAge: `${(index % 12) + 1} ${index % 4 === 0 ? "hours" : "days"}`,
      updated: `${(index % 28) + 1} days ago`,
      tone,
      version: `v${(index % 8) + 1}`,
      nextInternalAction:
        stage === "Scheduling"
          ? "Propose an interview slot"
          : stage === "Interviews"
            ? "Collect structured evidence"
            : stage === "Offer"
              ? "Review offer approvals"
              : "Complete the next governed stage action",
    };
  },
);

export const seededApplications: ApplicationRecord[] = [
  ...anchorApplications.map((record) => ({ ...record })),
  ...generatedApplications,
];

const generatedInterviews: InterviewRecord[] = Array.from(
  { length: 188 },
  (_, index) => {
    const application = generatedApplications[index];
    const interviewer = ["Jordan Lee", "Ravi Shah", "Marcus Johnson"][
      index % 3
    ];
    const state = ["Confirmed", "Needs scheduling", "Complete", "Conflict"][
      index % 4
    ];
    return {
      id: `INT-SEED-${String(index + 1).padStart(3, "0")}`,
      applicationId: application.id,
      candidate: application.candidate,
      job: application.job,
      type: ["Recruiter screen", "Structured interview", "Portfolio review"][
        index % 3
      ],
      interviewer,
      time:
        state === "Needs scheduling"
          ? "Awaiting proposal"
          : `Sep ${(index % 28) + 1} · ${(index % 8) + 9}:00 AM PT`,
      state,
      tone:
        state === "Complete"
          ? "success"
          : state === "Conflict"
            ? "danger"
            : state === "Needs scheduling"
              ? "warning"
              : "info",
    };
  },
);

export const seededInterviews: InterviewRecord[] = [
  ...anchorInterviews.map((record) => ({ ...record })),
  ...generatedInterviews,
];

const generatedAssignments: AssignmentRecord[] = Array.from(
  { length: 157 },
  (_, index) => {
    const interview = generatedInterviews[index];
    const state = ["Not started", "In progress", "Submitted", "Overdue"][
      index % 4
    ];
    return {
      id: `ASN-SEED-${String(index + 1).padStart(3, "0")}`,
      interviewId: interview.id,
      applicationId: interview.applicationId,
      candidate: interview.candidate,
      job: interview.job,
      interviewer: interview.interviewer,
      state,
      due: state === "Submitted" ? "Submitted · fixture" : `Due in ${(index % 8) + 1}h`,
      tone:
        state === "Submitted"
          ? "success"
          : state === "Overdue"
            ? "danger"
            : "warning",
    };
  },
);

export const seededAssignments: AssignmentRecord[] = [
  ...anchorAssignments.map((record) => ({ ...record })),
  ...generatedAssignments,
];

export const coreSeedSummary = {
  jobs: seededJobs.length,
  candidates: seededCandidates.length,
  applications: seededApplications.length,
  interviews: seededInterviews.length,
  assignments: seededAssignments.length,
  total: seededJobs.length +
    seededCandidates.length +
    seededApplications.length +
    seededInterviews.length +
    seededAssignments.length,
} as const;
