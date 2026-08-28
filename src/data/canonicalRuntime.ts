import {
  seededApplications,
  seededAssignments,
  seededCandidates,
  seededInterviews,
  seededJobs,
  type AssignmentRecord,
  type CandidateRecord,
  type InterviewRecord,
  type JobRecord,
} from "./coreRecords";
import { demoPersonas, type ApplicationRecord, type Tone } from "./fixtures";

export type Money = {
  minimumMinor: number;
  maximumMinor: number;
  currency: string;
};

export type CanonicalRequisition = {
  id: string;
  organizationId: string;
  postingId: string;
  publicId: string;
  title: string;
  departmentName: string;
  locationText: string;
  workplaceMode: string;
  workerType: string;
  compensation: Money;
  state: string;
  publishedAt: string | null;
  businessVersion: number;
  policyVersion: string;
  summary: string;
  requirements: string[];
  ownerId: string;
  updatedAt: string;
};

export type CanonicalCandidate = {
  id: string;
  organizationId: string;
  preferredName: string;
  locale: string;
  timezone: string;
  locationText: string;
  sourceCode: string;
  state: string;
  ownerId: string;
  updatedAt: string;
  businessVersion: number;
};

export type CanonicalCandidateIdentifier = {
  id: string;
  organizationId: string;
  candidateId: string;
  type: "Email" | "Phone";
  value: string;
  normalizedValue: string;
  verificationState: "Verified fixture";
  verifiedAt: string;
};

export type CanonicalConsent = {
  id: string;
  organizationId: string;
  candidateId: string;
  purposeCode: "Recruitment application";
  noticeVersion: string;
  choice: "Acknowledged";
  capturedAt: string;
};

export type CanonicalApplication = {
  id: string;
  organizationId: string;
  candidateId: string;
  requisitionId: string;
  originatingPostingId: string;
  attemptNumber: number;
  processTemplateVersionId: string;
  ownerId: string;
  submittedAt: string;
  sourceCode: string;
  businessVersion: number;
  tone: Tone;
  analyticsCohort: boolean;
  analyticsWindowDays: number | null;
};

export type CanonicalApplicationStageEvent = {
  id: string;
  organizationId: string;
  applicationId: string;
  aggregateVersion: number;
  sourceStage: string | null;
  destinationStage: string;
  occurredAt: string;
  actorId: string;
  transitionContractId: string;
};

export type CanonicalWorkItem = {
  id: string;
  organizationId: string;
  applicationId: string;
  ownerId: string;
  workType: "Next governed application action";
  instruction: string;
  state: "Open";
  dueAt: string;
};

export type CanonicalInterviewSession = {
  id: string;
  organizationId: string;
  applicationId: string;
  sessionType: string;
  startAt: string | null;
  durationMinutes: number;
  timezone: string;
  state: string;
  tone: Tone;
};

export type CanonicalInterviewerAssignment = {
  id: string;
  organizationId: string;
  interviewSessionId: string;
  applicationId: string;
  interviewerId: string;
  state: string;
  dueAt: string | null;
  tone: Tone;
  accessStartsAt: string;
  accessEndsAt: string;
};

export type CanonicalCoreStore = {
  organization: {
    id: string;
    legalName: string;
  };
  requisitions: CanonicalRequisition[];
  candidates: CanonicalCandidate[];
  candidateIdentifiers: CanonicalCandidateIdentifier[];
  consents: CanonicalConsent[];
  applications: CanonicalApplication[];
  applicationStageEvents: CanonicalApplicationStageEvent[];
  workItems: CanonicalWorkItem[];
  interviewSessions: CanonicalInterviewSession[];
  interviewerAssignments: CanonicalInterviewerAssignment[];
};

const fixtureNow = new Date("2026-08-28T12:00:00.000Z");
const organizationId = "ORG-DEMO-001";

const userIdByName = Object.fromEntries(
  demoPersonas.map((persona) => [persona.name, persona.id]),
) as Record<string, string>;

const userNameById = Object.fromEntries(
  demoPersonas.map((persona) => [persona.id, persona.name]),
) as Record<string, string>;

function ownerId(name: string) {
  return userIdByName[name] ?? "USR-REC-001";
}

function requisitionId(jobId: string) {
  return jobId.replace(/^JOB-/, "REQ-");
}

function postingId(requisition: string) {
  return requisition.replace(/^REQ-/, "JOB-");
}

function daysBefore(days: number) {
  const value = new Date(fixtureNow);
  value.setUTCDate(value.getUTCDate() - days);
  return value.toISOString();
}

function hoursBefore(hours: number) {
  const value = new Date(fixtureNow);
  value.setUTCHours(value.getUTCHours() - hours);
  return value.toISOString();
}

function relativeDate(label: string) {
  if (/Now|Today/.test(label)) return fixtureNow.toISOString();
  if (/Yesterday/.test(label)) return daysBefore(1);
  const count = Number(label.match(/\d+/)?.[0] ?? 0);
  return /hour/.test(label) ? hoursBefore(count) : daysBefore(count);
}

function moneyFromDisplay(value: string): Money {
  const amounts = [...value.matchAll(/\$([\d,]+)/g)].map((match) =>
    Number(match[1].replace(/,/g, "")) * 100,
  );
  return {
    minimumMinor: amounts[0] ?? 0,
    maximumMinor: amounts[1] ?? amounts[0] ?? 0,
    currency: value.match(/\b[A-Z]{3}\b/)?.[0] ?? "USD",
  };
}

function payDisplay(money: Money) {
  const format = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: money.currency,
      maximumFractionDigits: 0,
    }).format(amount / 100);
  return `${format(money.minimumMinor)}–${format(money.maximumMinor)} ${money.currency}`;
}

function analyticsPosition(applicationId: string) {
  const number = Number(applicationId.match(/^APP-SEED-(\d+)$/)?.[1] ?? 0);
  if (!number || number > 324) return null;
  const index = number - 1;
  return {
    windowDays: [2, 14, 60][index % 3],
  };
}

export function normalizeCoreRecords(input: {
  jobs: JobRecord[];
  candidates: CandidateRecord[];
  applications: ApplicationRecord[];
  interviews: InterviewRecord[];
  assignments: AssignmentRecord[];
}): CanonicalCoreStore {
  const candidates = input.candidates.map(
    (candidate): CanonicalCandidate => ({
      id: candidate.id,
      organizationId,
      preferredName: candidate.name,
      locale: "en-US",
      timezone: candidate.timezone,
      locationText: candidate.location,
      sourceCode: candidate.source,
      state: candidate.status,
      ownerId: ownerId(candidate.owner),
      updatedAt: relativeDate(candidate.updated),
      businessVersion: 1,
    }),
  );
  const candidateById = new Map(candidates.map((candidate) => [candidate.id, candidate]));
  const requisitions = input.jobs.map((job): CanonicalRequisition => {
    const versionNumber = Number(job.version.match(/v(\d+)/)?.[1] ?? 1);
    return {
      id: requisitionId(job.id),
      organizationId,
      postingId: job.id,
      publicId: job.publicId,
      title: job.title,
      departmentName: job.team,
      locationText: job.location,
      workplaceMode: job.workplace,
      workerType: job.type,
      compensation: moneyFromDisplay(job.pay),
      state: job.status,
      publishedAt: job.posted === "Not public" ? null : relativeDate(job.posted),
      businessVersion: versionNumber,
      policyVersion: job.version.match(/Policy v\d+/)?.[0] ?? "Policy pending",
      summary: job.summary,
      requirements: [...job.requirements],
      ownerId: ownerId(job.owner),
      updatedAt: fixtureNow.toISOString(),
    };
  });
  const requisitionByPosting = new Map(
    requisitions.map((requisition) => [requisition.postingId, requisition]),
  );
  const candidateIdentifiers = input.candidates.flatMap(
    (candidate): CanonicalCandidateIdentifier[] => [
      {
        id: `CID-${candidate.id}-EMAIL`,
        organizationId,
        candidateId: candidate.id,
        type: "Email",
        value: candidate.email,
        normalizedValue: candidate.email.trim().toLowerCase(),
        verificationState: "Verified fixture",
        verifiedAt: daysBefore(30),
      },
      {
        id: `CID-${candidate.id}-PHONE`,
        organizationId,
        candidateId: candidate.id,
        type: "Phone",
        value: candidate.phone,
        normalizedValue: candidate.phone.replace(/\D/g, ""),
        verificationState: "Verified fixture",
        verifiedAt: daysBefore(30),
      },
    ],
  );
  const consents = input.candidates.map(
    (candidate): CanonicalConsent => ({
      id: `CNS-${candidate.id}-001`,
      organizationId,
      candidateId: candidate.id,
      purposeCode: "Recruitment application",
      noticeVersion: candidate.consent.match(/v\d+/)?.[0] ?? "v2",
      choice: "Acknowledged",
      capturedAt: daysBefore(30),
    }),
  );
  const attemptCountByCandidateRequisition = new Map<string, number>();
  const applications = input.applications.map(
    (application): CanonicalApplication => {
      const requisition = requisitionByPosting.get(application.jobId);
      const candidate = candidateById.get(application.candidateId);
      if (!requisition || !candidate)
        throw new Error(`Cannot normalize orphan application ${application.id}`);
      const position = analyticsPosition(application.id);
      const attemptKey = `${candidate.id}:${requisition.id}`;
      const attemptNumber =
        (attemptCountByCandidateRequisition.get(attemptKey) ?? 0) + 1;
      attemptCountByCandidateRequisition.set(attemptKey, attemptNumber);
      return {
        id: application.id,
        organizationId,
        candidateId: candidate.id,
        requisitionId: requisition.id,
        originatingPostingId: requisition.postingId,
        attemptNumber,
        processTemplateVersionId: "PTV-DEMO-002",
        ownerId: ownerId(application.owner),
        submittedAt: relativeDate(application.updated),
        sourceCode: candidate.sourceCode,
        businessVersion: Number(application.version.replace("v", "")) || 1,
        tone: application.tone,
        analyticsCohort: Boolean(position),
        analyticsWindowDays: position?.windowDays ?? null,
      };
    },
  );
  const applicationById = new Map(applications.map((application) => [application.id, application]));
  const applicationStageEvents = input.applications.map(
    (application): CanonicalApplicationStageEvent => {
      const canonical = applicationById.get(application.id);
      if (!canonical) throw new Error(`Missing normalized application ${application.id}`);
      return {
        id: `ASE-${application.id}-001`,
        organizationId,
        applicationId: application.id,
        aggregateVersion: canonical.businessVersion,
        sourceStage: null,
        destinationStage: application.stage,
        occurredAt: relativeDate(application.stageAge),
        actorId: canonical.ownerId,
        transitionContractId: "TRN-APPLICATION-SEED",
      };
    },
  );
  const workItems = input.applications.map(
    (application): CanonicalWorkItem => ({
      id: `WIT-${application.id}-001`,
      organizationId,
      applicationId: application.id,
      ownerId: ownerId(application.owner),
      workType: "Next governed application action",
      instruction: application.nextInternalAction,
      state: "Open",
      dueAt: hoursBefore(-24),
    }),
  );
  const interviewSessions = input.interviews.map(
    (interview, index): CanonicalInterviewSession => ({
      id: interview.id,
      organizationId,
      applicationId: interview.applicationId,
      sessionType: interview.type,
      startAt:
        interview.state === "Needs scheduling"
          ? null
          : new Date(
              Date.UTC(2026, 8, (index % 28) + 1, (index % 8) + 16),
            ).toISOString(),
      durationMinutes: 60,
      timezone: "America/Los_Angeles",
      state: interview.state,
      tone: interview.tone,
    }),
  );
  const interviewById = new Map(interviewSessions.map((interview) => [interview.id, interview]));
  const interviewerAssignments = input.assignments.map(
    (assignment, index): CanonicalInterviewerAssignment => {
      const interview = interviewById.get(assignment.interviewId);
      if (!interview)
        throw new Error(`Cannot normalize orphan assignment ${assignment.id}`);
      return {
        id: assignment.id,
        organizationId,
        interviewSessionId: interview.id,
        applicationId: interview.applicationId,
        interviewerId: ownerId(assignment.interviewer),
        state: assignment.state,
        dueAt:
          assignment.state === "Submitted"
            ? null
            : new Date(fixtureNow.getTime() + ((index % 8) + 1) * 3_600_000).toISOString(),
        tone: assignment.tone,
        accessStartsAt: daysBefore(7),
        accessEndsAt: daysBefore(-7),
      };
    },
  );
  return {
    organization: { id: organizationId, legalName: "Harbor & Pine Labs" },
    requisitions,
    candidates,
    candidateIdentifiers,
    consents,
    applications,
    applicationStageEvents,
    workItems,
    interviewSessions,
    interviewerAssignments,
  };
}

export const seededCanonicalCoreStore = normalizeCoreRecords({
  jobs: seededJobs,
  candidates: seededCandidates,
  applications: seededApplications,
  interviews: seededInterviews,
  assignments: seededAssignments,
});

export function createCanonicalJob(
  store: CanonicalCoreStore,
  id: string,
  input: Omit<JobRecord, "id" | "version" | "posted">,
): CanonicalCoreStore {
  const requisition: CanonicalRequisition = {
    id: requisitionId(id),
    organizationId: store.organization.id,
    postingId: id,
    publicId: input.publicId,
    title: input.title,
    departmentName: input.team,
    locationText: input.location,
    workplaceMode: input.workplace,
    workerType: input.type,
    compensation: moneyFromDisplay(input.pay),
    state: "Draft",
    publishedAt: null,
    businessVersion: 1,
    policyVersion: "Policy pending",
    summary: input.summary,
    requirements: [...input.requirements],
    ownerId: ownerId(input.owner),
    updatedAt: fixtureNow.toISOString(),
  };
  return { ...store, requisitions: [requisition, ...store.requisitions] };
}

export function updateCanonicalJob(
  store: CanonicalCoreStore,
  id: string,
  input: Omit<JobRecord, "id" | "version" | "posted">,
): CanonicalCoreStore {
  return {
    ...store,
    requisitions: store.requisitions.map((requisition) =>
      requisition.postingId === id
        ? {
            ...requisition,
            publicId: input.publicId,
            title: input.title,
            departmentName: input.team,
            locationText: input.location,
            workplaceMode: input.workplace,
            workerType: input.type,
            compensation: moneyFromDisplay(input.pay),
            state: input.status,
            publishedAt:
              input.status === "Published"
                ? requisition.publishedAt ?? fixtureNow.toISOString()
                : null,
            businessVersion: requisition.businessVersion + 1,
            summary: input.summary,
            requirements: [...input.requirements],
            ownerId: ownerId(input.owner),
            updatedAt: fixtureNow.toISOString(),
          }
        : requisition,
    ),
  };
}

export function createCanonicalCandidate(
  store: CanonicalCoreStore,
  id: string,
  input: Omit<CandidateRecord, "id" | "initials" | "updated">,
): CanonicalCoreStore {
  const normalizedEmail = input.email.trim().toLowerCase();
  if (
    store.candidateIdentifiers.some(
      (identifier) =>
        identifier.type === "Email" &&
        identifier.normalizedValue === normalizedEmail,
    )
  )
    throw new Error("A verified candidate identifier already exists; open a duplicate-review case instead of auto-merging.");
  const candidate: CanonicalCandidate = {
    id,
    organizationId: store.organization.id,
    preferredName: input.name,
    locale: "en-US",
    timezone: input.timezone,
    locationText: input.location,
    sourceCode: input.source,
    state: input.status,
    ownerId: ownerId(input.owner),
    updatedAt: fixtureNow.toISOString(),
    businessVersion: 1,
  };
  const identifiers: CanonicalCandidateIdentifier[] = [
    {
      id: `CID-${id}-EMAIL`,
      organizationId: store.organization.id,
      candidateId: id,
      type: "Email",
      value: input.email,
      normalizedValue: normalizedEmail,
      verificationState: "Verified fixture",
      verifiedAt: fixtureNow.toISOString(),
    },
    {
      id: `CID-${id}-PHONE`,
      organizationId: store.organization.id,
      candidateId: id,
      type: "Phone",
      value: input.phone,
      normalizedValue: input.phone.replace(/\D/g, ""),
      verificationState: "Verified fixture",
      verifiedAt: fixtureNow.toISOString(),
    },
  ];
  const consent: CanonicalConsent = {
    id: `CNS-${id}-001`,
    organizationId: store.organization.id,
    candidateId: id,
    purposeCode: "Recruitment application",
    noticeVersion: input.consent.match(/v\d+/)?.[0] ?? "v2",
    choice: "Acknowledged",
    capturedAt: fixtureNow.toISOString(),
  };
  return {
    ...store,
    candidates: [candidate, ...store.candidates],
    candidateIdentifiers: [...identifiers, ...store.candidateIdentifiers],
    consents: [consent, ...store.consents],
  };
}

export function updateCanonicalCandidate(
  store: CanonicalCoreStore,
  id: string,
  input: Omit<CandidateRecord, "id" | "initials" | "updated">,
): CanonicalCoreStore {
  const normalizedEmail = input.email.trim().toLowerCase();
  if (
    store.candidateIdentifiers.some(
      (identifier) =>
        identifier.candidateId !== id &&
        identifier.type === "Email" &&
        identifier.normalizedValue === normalizedEmail,
    )
  )
    throw new Error("Another verified candidate identifier exists; use the duplicate-review workflow.");
  return {
    ...store,
    candidates: store.candidates.map((candidate) =>
      candidate.id === id
        ? {
            ...candidate,
            preferredName: input.name,
            timezone: input.timezone,
            locationText: input.location,
            sourceCode: input.source,
            state: input.status,
            ownerId: ownerId(input.owner),
            updatedAt: fixtureNow.toISOString(),
            businessVersion: candidate.businessVersion + 1,
          }
        : candidate,
    ),
    candidateIdentifiers: store.candidateIdentifiers.map((identifier) =>
      identifier.candidateId !== id
        ? identifier
        : identifier.type === "Email"
          ? {
              ...identifier,
              value: input.email,
              normalizedValue: normalizedEmail,
            }
          : {
              ...identifier,
              value: input.phone,
              normalizedValue: input.phone.replace(/\D/g, ""),
            },
    ),
  };
}

export function createCanonicalApplication(
  store: CanonicalCoreStore,
  id: string,
  input: {
    candidateId: string;
    jobId: string;
    stage: string;
    owner: string;
    nextInternalAction: string;
  },
): CanonicalCoreStore {
  const candidate = store.candidates.find((record) => record.id === input.candidateId);
  const requisition = store.requisitions.find((record) => record.postingId === input.jobId);
  if (!candidate || !requisition) throw new Error("Candidate and requisition are required.");
  if (
    store.applications.some(
      (application) =>
        application.candidateId === candidate.id &&
        application.requisitionId === requisition.id,
    )
  )
    throw new Error("An application attempt already exists for this candidate and requisition.");
  const application: CanonicalApplication = {
    id,
    organizationId: store.organization.id,
    candidateId: candidate.id,
    requisitionId: requisition.id,
    originatingPostingId: requisition.postingId,
    attemptNumber: 1,
    processTemplateVersionId: "PTV-DEMO-002",
    ownerId: ownerId(input.owner),
    submittedAt: fixtureNow.toISOString(),
    sourceCode: candidate.sourceCode,
    businessVersion: 1,
    tone: "info",
    analyticsCohort: false,
    analyticsWindowDays: null,
  };
  const event: CanonicalApplicationStageEvent = {
    id: `ASE-${id}-001`,
    organizationId: store.organization.id,
    applicationId: id,
    aggregateVersion: 1,
    sourceStage: null,
    destinationStage: input.stage,
    occurredAt: fixtureNow.toISOString(),
    actorId: ownerId(input.owner),
    transitionContractId: "TRN-APPLICATION-CREATE",
  };
  const work: CanonicalWorkItem = {
    id: `WIT-${id}-001`,
    organizationId: store.organization.id,
    applicationId: id,
    ownerId: ownerId(input.owner),
    workType: "Next governed application action",
    instruction: input.nextInternalAction,
    state: "Open",
    dueAt: new Date(fixtureNow.getTime() + 86_400_000).toISOString(),
  };
  return {
    ...store,
    applications: [application, ...store.applications],
    applicationStageEvents: [event, ...store.applicationStageEvents],
    workItems: [work, ...store.workItems],
  };
}

export function updateCanonicalApplication(
  store: CanonicalCoreStore,
  id: string,
  input: {
    candidateId: string;
    jobId: string;
    stage: string;
    owner: string;
    nextInternalAction: string;
  },
): CanonicalCoreStore {
  const application = store.applications.find((record) => record.id === id);
  if (!application) throw new Error(`Application ${id} was not found.`);
  const currentEvent = store.applicationStageEvents
    .filter((event) => event.applicationId === id)
    .sort((left, right) => right.aggregateVersion - left.aggregateVersion)[0];
  const nextVersion = application.businessVersion + 1;
  const stageChanged = currentEvent?.destinationStage !== input.stage;
  return {
    ...store,
    applications: store.applications.map((record) =>
      record.id === id
        ? {
            ...record,
            ownerId: ownerId(input.owner),
            businessVersion: nextVersion,
          }
        : record,
    ),
    applicationStageEvents: stageChanged
      ? [
          ...store.applicationStageEvents,
          {
            id: `ASE-${id}-${String(nextVersion).padStart(3, "0")}`,
            organizationId: store.organization.id,
            applicationId: id,
            aggregateVersion: nextVersion,
            sourceStage: currentEvent?.destinationStage ?? null,
            destinationStage: input.stage,
            occurredAt: fixtureNow.toISOString(),
            actorId: ownerId(input.owner),
            transitionContractId: "TRN-APPLICATION-UPDATE",
          },
        ]
      : store.applicationStageEvents,
    workItems: store.workItems.map((work) =>
      work.applicationId === id
        ? {
            ...work,
            ownerId: ownerId(input.owner),
            instruction: input.nextInternalAction,
          }
        : work,
    ),
  };
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function relativeLabel(value: string | null) {
  if (!value) return "Not public";
  const days = Math.round((fixtureNow.getTime() - new Date(value).getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  return `${days} days ago`;
}

export function projectJobs(store: CanonicalCoreStore): JobRecord[] {
  return store.requisitions.map((requisition) => ({
    id: requisition.postingId,
    publicId: requisition.publicId,
    title: requisition.title,
    team: requisition.departmentName,
    location: requisition.locationText,
    workplace: requisition.workplaceMode,
    type: requisition.workerType,
    pay: payDisplay(requisition.compensation),
    status: requisition.state,
    posted: relativeLabel(requisition.publishedAt),
    version: `Posting v${requisition.businessVersion} · ${requisition.policyVersion}`,
    summary: requisition.summary,
    requirements: [...requisition.requirements],
    owner: userNameById[requisition.ownerId] ?? "Recruiting queue",
  }));
}

export function projectCandidates(store: CanonicalCoreStore): CandidateRecord[] {
  const identifiersByCandidate = new Map<string, CanonicalCandidateIdentifier[]>();
  for (const identifier of store.candidateIdentifiers) {
    const current = identifiersByCandidate.get(identifier.candidateId) ?? [];
    current.push(identifier);
    identifiersByCandidate.set(identifier.candidateId, current);
  }
  const consentByCandidate = new Map(store.consents.map((consent) => [consent.candidateId, consent]));
  return store.candidates.map((candidate) => {
    const identifiers = identifiersByCandidate.get(candidate.id) ?? [];
    const consent = consentByCandidate.get(candidate.id);
    return {
      id: candidate.id,
      name: candidate.preferredName,
      initials: initials(candidate.preferredName),
      email: identifiers.find((identifier) => identifier.type === "Email")?.value ?? "missing@example.test",
      phone: identifiers.find((identifier) => identifier.type === "Phone")?.value ?? "Not provided",
      location: candidate.locationText,
      timezone: candidate.timezone,
      source: candidate.sourceCode,
      consent: consent ? `Candidate notice ${consent.noticeVersion} · acknowledged` : "No current consent",
      status: candidate.state,
      owner: userNameById[candidate.ownerId] ?? "Recruiting queue",
      updated: relativeLabel(candidate.updatedAt),
    };
  });
}

export function projectApplications(store: CanonicalCoreStore): ApplicationRecord[] {
  const candidateById = new Map(store.candidates.map((candidate) => [candidate.id, candidate]));
  const requisitionById = new Map(store.requisitions.map((requisition) => [requisition.id, requisition]));
  const latestStageByApplication = new Map<string, CanonicalApplicationStageEvent>();
  for (const event of store.applicationStageEvents) {
    const current = latestStageByApplication.get(event.applicationId);
    if (!current || current.aggregateVersion <= event.aggregateVersion)
      latestStageByApplication.set(event.applicationId, event);
  }
  const workByApplication = new Map(store.workItems.map((work) => [work.applicationId, work]));
  return store.applications.map((application) => {
    const candidate = candidateById.get(application.candidateId);
    const requisition = requisitionById.get(application.requisitionId);
    const stageEvent = latestStageByApplication.get(application.id);
    const work = workByApplication.get(application.id);
    if (!candidate || !requisition || !stageEvent || !work)
      throw new Error(`Cannot project incomplete canonical application ${application.id}`);
    const stageAgeDays = Math.max(
      0,
      Math.round(
        (fixtureNow.getTime() - new Date(stageEvent.occurredAt).getTime()) /
          86_400_000,
      ),
    );
    return {
      id: application.id,
      candidateId: candidate.id,
      candidate: candidate.preferredName,
      initials: initials(candidate.preferredName),
      jobId: requisition.postingId,
      job: requisition.title,
      stage: stageEvent.destinationStage,
      owner: userNameById[application.ownerId] ?? "Recruiting queue",
      stageAge: `${stageAgeDays} days`,
      updated: relativeLabel(application.submittedAt),
      tone: application.tone,
      version: `v${application.businessVersion}`,
      nextInternalAction: work.instruction,
    };
  });
}

export function projectInterviews(store: CanonicalCoreStore): InterviewRecord[] {
  const applicationById = new Map(projectApplications(store).map((application) => [application.id, application]));
  const firstAssignmentByInterview = new Map<string, CanonicalInterviewerAssignment>();
  for (const assignment of store.interviewerAssignments)
    if (!firstAssignmentByInterview.has(assignment.interviewSessionId))
      firstAssignmentByInterview.set(assignment.interviewSessionId, assignment);
  return store.interviewSessions.map((interview) => {
    const application = applicationById.get(interview.applicationId);
    const assignment = firstAssignmentByInterview.get(interview.id);
    if (!application) throw new Error(`Cannot project orphan interview ${interview.id}`);
    return {
      id: interview.id,
      applicationId: application.id,
      candidate: application.candidate,
      job: application.job,
      type: interview.sessionType,
      interviewer: assignment ? userNameById[assignment.interviewerId] ?? "Qualified pool" : "Qualified pool",
      time: interview.startAt
        ? new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            timeZone: interview.timezone,
          }).format(new Date(interview.startAt))
        : "Awaiting proposal",
      state: interview.state,
      tone: interview.tone,
    };
  });
}

export function projectAssignments(store: CanonicalCoreStore): AssignmentRecord[] {
  const interviewById = new Map(projectInterviews(store).map((interview) => [interview.id, interview]));
  return store.interviewerAssignments.map((assignment) => {
    const interview = interviewById.get(assignment.interviewSessionId);
    if (!interview) throw new Error(`Cannot project orphan assignment ${assignment.id}`);
    return {
      id: assignment.id,
      interviewId: interview.id,
      applicationId: assignment.applicationId,
      candidate: interview.candidate,
      job: interview.job,
      interviewer: userNameById[assignment.interviewerId] ?? "Qualified pool",
      state: assignment.state,
      due: assignment.dueAt ? `Due ${relativeLabel(assignment.dueAt)}` : "Submitted · fixture",
      tone: assignment.tone,
    };
  });
}

export function validateCanonicalCoreStore(store: CanonicalCoreStore) {
  const issues: string[] = [];
  const unique = (name: string, ids: string[]) => {
    if (new Set(ids).size !== ids.length) issues.push(`${name} IDs are not unique`);
  };
  unique("Requisition", store.requisitions.map((row) => row.id));
  unique("Candidate", store.candidates.map((row) => row.id));
  unique("CandidateIdentifier", store.candidateIdentifiers.map((row) => row.id));
  unique("Application", store.applications.map((row) => row.id));
  unique("ApplicationStageEvent", store.applicationStageEvents.map((row) => row.id));
  unique("InterviewSession", store.interviewSessions.map((row) => row.id));
  unique("InterviewerAssignment", store.interviewerAssignments.map((row) => row.id));
  const candidateIds = new Set(store.candidates.map((row) => row.id));
  const requisitionIds = new Set(store.requisitions.map((row) => row.id));
  const applicationIds = new Set(store.applications.map((row) => row.id));
  const interviewIds = new Set(store.interviewSessions.map((row) => row.id));
  for (const application of store.applications) {
    if (!candidateIds.has(application.candidateId)) issues.push(`${application.id} has an orphan candidate`);
    if (!requisitionIds.has(application.requisitionId)) issues.push(`${application.id} has an orphan requisition`);
  }
  for (const event of store.applicationStageEvents)
    if (!applicationIds.has(event.applicationId)) issues.push(`${event.id} has an orphan application`);
  for (const interview of store.interviewSessions)
    if (!applicationIds.has(interview.applicationId)) issues.push(`${interview.id} has an orphan application`);
  for (const assignment of store.interviewerAssignments) {
    if (!interviewIds.has(assignment.interviewSessionId)) issues.push(`${assignment.id} has an orphan interview`);
    if (!applicationIds.has(assignment.applicationId)) issues.push(`${assignment.id} has an orphan application`);
  }
  const attemptKeys = store.applications.map(
    (application) =>
      `${application.organizationId}:${application.candidateId}:${application.requisitionId}:${application.attemptNumber}`,
  );
  if (new Set(attemptKeys).size !== attemptKeys.length)
    issues.push("Application attempt composite keys are not unique");
  const normalizedIdentifiers = store.candidateIdentifiers.map(
    (identifier) => `${identifier.type}:${identifier.normalizedValue}`,
  );
  if (new Set(normalizedIdentifiers).size !== normalizedIdentifiers.length)
    issues.push("Verified candidate identifiers are duplicated without a duplicate case");
  if (store.applications.filter((application) => application.analyticsCohort).length !== 324)
    issues.push("Canonical analytics cohort must contain 324 applications");
  return issues;
}

export const canonicalCoreSummary = {
  requisitions: seededCanonicalCoreStore.requisitions.length,
  candidates: seededCanonicalCoreStore.candidates.length,
  candidateIdentifiers: seededCanonicalCoreStore.candidateIdentifiers.length,
  consents: seededCanonicalCoreStore.consents.length,
  applications: seededCanonicalCoreStore.applications.length,
  applicationStageEvents: seededCanonicalCoreStore.applicationStageEvents.length,
  workItems: seededCanonicalCoreStore.workItems.length,
  interviews: seededCanonicalCoreStore.interviewSessions.length,
  assignments: seededCanonicalCoreStore.interviewerAssignments.length,
  issues: validateCanonicalCoreStore(seededCanonicalCoreStore).length,
} as const;

export { postingId, requisitionId };
