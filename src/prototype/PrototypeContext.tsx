import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import scenarioArtifact from "../../artifacts/v0.9/scenarios.json";
import {
  demoPersonas,
  resolveScenarioState,
  type ScenarioState,
} from "../data/fixtures";
import {
  seededObjectRecords,
  type ObjectRecord,
} from "../data/objectWorkspace";
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
} from "../data/coreRecords";
import type { ApplicationRecord } from "../data/fixtures";

type Scenario = (typeof scenarioArtifact.scenarios)[number];

type PrototypeContextValue = {
  scenario: Scenario;
  scenarios: Scenario[];
  setScenarioId: (id: string) => void;
  scenarioState: ScenarioState;
  personaId: string;
  persona: (typeof demoPersonas)[number];
  setPersonaId: (id: string) => void;
  notice: string | null;
  announce: (message: string) => void;
  clearNotice: () => void;
  scorecardResolved: boolean;
  resolveScorecard: (message?: string) => void;
  availabilitySubmitted: boolean;
  shareAvailability: (message?: string) => void;
  offerApproved: boolean;
  approveOffer: (message?: string) => void;
  objectRecords: ObjectRecord[];
  createObjectRecord: (
    objectId: string,
    label: string,
    values: Record<string, string>,
  ) => string;
  updateObjectRecord: (
    recordId: string,
    label: string,
    values: Record<string, string>,
  ) => void;
  jobRecords: JobRecord[];
  candidateRecords: CandidateRecord[];
  applicationRecords: ApplicationRecord[];
  interviewRecords: InterviewRecord[];
  assignmentRecords: AssignmentRecord[];
  createJob: (input: Omit<JobRecord, "id" | "version" | "posted">) => string;
  updateJob: (id: string, input: Omit<JobRecord, "id" | "version" | "posted">) => void;
  createCandidate: (
    input: Omit<CandidateRecord, "id" | "initials" | "updated">,
  ) => string;
  updateCandidate: (
    id: string,
    input: Omit<CandidateRecord, "id" | "initials" | "updated">,
  ) => void;
  createApplication: (input: {
    candidateId: string;
    jobId: string;
    stage: string;
    owner: string;
    nextInternalAction: string;
  }) => string;
  updateApplication: (
    id: string,
    input: {
      candidateId: string;
      jobId: string;
      stage: string;
      owner: string;
      nextInternalAction: string;
    },
  ) => void;
  resetKey: number;
  resetPrototype: () => void;
};

const PrototypeContext = createContext<PrototypeContextValue | null>(null);

export function PrototypeProvider({ children }: { children: ReactNode }) {
  const [scenarioId, setScenarioId] = useState("SCN-005");
  const [personaId, setPersonaId] = useState<string>(demoPersonas[0].id);
  const [notice, setNotice] = useState<string | null>(null);
  const [scorecardResolved, setScorecardResolved] = useState(false);
  const [availabilitySubmitted, setAvailabilitySubmitted] = useState(false);
  const [offerApproved, setOfferApproved] = useState(false);
  const [objectRecords, setObjectRecords] =
    useState<ObjectRecord[]>(seededObjectRecords);
  const [jobRecords, setJobRecords] = useState<JobRecord[]>(seededJobs);
  const [candidateRecords, setCandidateRecords] =
    useState<CandidateRecord[]>(seededCandidates);
  const [applicationRecords, setApplicationRecords] =
    useState<ApplicationRecord[]>(seededApplications);
  const [resetKey, setResetKey] = useState(0);
  const scenario =
    scenarioArtifact.scenarios.find((item) => item.id === scenarioId) ??
    scenarioArtifact.scenarios[0];
  const persona =
    demoPersonas.find((item) => item.id === personaId) ?? demoPersonas[0];
  const rawScenarioState = resolveScenarioState(scenario.id);
  const scenarioState =
    scorecardResolved && rawScenarioState.id === "SCN-005"
      ? {
          ...rawScenarioState,
          missingScorecards: 0,
          applicationStage: "Debrief",
          decisionState: "Ready for decision" as const,
        }
      : rawScenarioState;

  const value = useMemo(
    () => ({
      scenario,
      scenarioState,
      scenarios: scenarioArtifact.scenarios,
      setScenarioId: (id: string) => {
        setScenarioId(id);
        setScorecardResolved(false);
        setAvailabilitySubmitted(false);
        setOfferApproved(false);
        setNotice(null);
      },
      personaId,
      persona,
      setPersonaId,
      notice,
      announce: setNotice,
      clearNotice: () => setNotice(null),
      scorecardResolved,
      resolveScorecard: (
        message = "Scorecard submitted in memory. Application readiness is now recalculated.",
      ) => {
        setScorecardResolved(true);
        setNotice(message);
      },
      availabilitySubmitted,
      shareAvailability: (
        message = "Availability saved in memory. The coordinator workspace now shows the submitted window.",
      ) => {
        setAvailabilitySubmitted(true);
        setNotice(message);
      },
      offerApproved,
      approveOffer: (
        message = "Offer version 4 approved in memory. The candidate-safe offer task is now available.",
      ) => {
        setOfferApproved(true);
        setNotice(message);
      },
      objectRecords,
      createObjectRecord: (
        objectId: string,
        label: string,
        values: Record<string, string>,
      ) => {
        const objectRows = objectRecords.filter(
          (record) => record.objectId === objectId,
        );
        const id = `${objectId.replace("OBJ", "REC")}-${String(objectRows.length + 1).padStart(3, "0")}`;
        setObjectRecords((records) => [
          ...records,
          {
            id,
            objectId,
            label,
            state: values.lifecycle_state || "Draft",
            owner: persona.name,
            version: 1,
            updatedAt: "Now · in-memory fixture",
            values: {
              ...values,
              stable_id: id,
              business_version: "1",
              owner_or_service: persona.name,
            },
            history: [
              {
                at: "Now",
                actor: persona.name,
                action: "Created synthetic record in memory",
                version: 1,
              },
            ],
          },
        ]);
        setNotice(
          `${id} created in memory. No Salesforce record or external side effect was created.`,
        );
        return id;
      },
      updateObjectRecord: (
        recordId: string,
        label: string,
        values: Record<string, string>,
      ) => {
        setObjectRecords((records) =>
          records.map((record) =>
            record.id === recordId
              ? {
                  ...record,
                  label,
                  state: values.lifecycle_state || record.state,
                  version: record.version + 1,
                  updatedAt: "Now · in-memory fixture",
                  values: {
                    ...record.values,
                    ...values,
                    stable_id: record.id,
                    business_version: String(record.version + 1),
                  },
                  history: [
                    ...record.history,
                    {
                      at: "Now",
                      actor: persona.name,
                      action: "Updated permitted synthetic fields",
                      version: record.version + 1,
                    },
                  ],
                }
              : record,
          ),
        );
        setNotice(
          `${recordId} updated in memory with optimistic version control.`,
        );
      },
      jobRecords,
      candidateRecords,
      applicationRecords,
      interviewRecords: seededInterviews,
      assignmentRecords: seededAssignments,
      createJob: (input: Omit<JobRecord, "id" | "version" | "posted">) => {
        const sequence =
          jobRecords.filter((record) => record.id.startsWith("JOB-MEM-")).length +
          1;
        const id = `JOB-MEM-${String(sequence).padStart(3, "0")}`;
        setJobRecords((records) => [
          {
            ...input,
            id,
            version: "Posting v1 · Policy pending",
            posted: input.status === "Published" ? "Now · in-memory fixture" : "Not public",
          },
          ...records,
        ]);
        setNotice(
          `${id} created as an in-memory ${input.status.toLowerCase()} requisition. No public posting or Salesforce record was created.`,
        );
        return id;
      },
      updateJob: (
        id: string,
        input: Omit<JobRecord, "id" | "version" | "posted">,
      ) => {
        setJobRecords((records) =>
          records.map((record) =>
            record.id === id
              ? {
                  ...record,
                  ...input,
                  version: `Posting v${Number(record.version.match(/v(\d+)/)?.[1] ?? 1) + 1} · in-memory`,
                  posted:
                    input.status === "Published"
                      ? record.posted === "Not public"
                        ? "Now · in-memory fixture"
                        : record.posted
                      : "Not public",
                }
              : record,
          ),
        );
        setNotice(`${id} updated in memory. Publication still requires the governed preview action.`);
      },
      createCandidate: (
        input: Omit<CandidateRecord, "id" | "initials" | "updated">,
      ) => {
        const sequence =
          candidateRecords.filter((record) => record.id.startsWith("PER-MEM-"))
            .length + 1;
        const id = `PER-MEM-${String(sequence).padStart(3, "0")}`;
        const initials = input.name
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase() ?? "")
          .join("");
        setCandidateRecords((records) => [
          { ...input, id, initials, updated: "Now · in-memory fixture" },
          ...records,
        ]);
        setNotice(
          `${id} candidate identity created in memory. No application was created automatically.`,
        );
        return id;
      },
      updateCandidate: (
        id: string,
        input: Omit<CandidateRecord, "id" | "initials" | "updated">,
      ) => {
        setCandidateRecords((records) =>
          records.map((record) =>
            record.id === id
              ? {
                  ...record,
                  ...input,
                  initials: input.name
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase() ?? "")
                    .join(""),
                  updated: "Now · in-memory fixture",
                }
              : record,
          ),
        );
        setNotice(`${id} candidate identity updated in memory with consent provenance preserved.`);
      },
      createApplication: (input: {
        candidateId: string;
        jobId: string;
        stage: string;
        owner: string;
        nextInternalAction: string;
      }) => {
        const candidate = candidateRecords.find((record) => record.id === input.candidateId);
        const job = jobRecords.find((record) => record.id === input.jobId);
        if (!candidate || !job) throw new Error("Candidate and job are required.");
        const sequence =
          applicationRecords.filter((record) => record.id.startsWith("APP-MEM-"))
            .length + 1;
        const id = `APP-MEM-${String(sequence).padStart(3, "0")}`;
        setApplicationRecords((records) => [
          {
            id,
            candidateId: candidate.id,
            candidate: candidate.name,
            initials: candidate.initials,
            jobId: job.id,
            job: job.title,
            stage: input.stage,
            owner: input.owner,
            stageAge: "0 hours",
            updated: "Now",
            tone: "info",
            version: "v1",
            nextInternalAction: input.nextInternalAction,
          },
          ...records,
        ]);
        setNotice(
          `${id} linked ${candidate.id} to ${job.id} in memory. The candidate identity and requisition remain separate records.`,
        );
        return id;
      },
      updateApplication: (
        id: string,
        input: {
          candidateId: string;
          jobId: string;
          stage: string;
          owner: string;
          nextInternalAction: string;
        },
      ) => {
        const candidate = candidateRecords.find((record) => record.id === input.candidateId);
        const job = jobRecords.find((record) => record.id === input.jobId);
        if (!candidate || !job) throw new Error("Candidate and job are required.");
        setApplicationRecords((records) =>
          records.map((record) =>
            record.id === id
              ? {
                  ...record,
                  candidateId: candidate.id,
                  candidate: candidate.name,
                  initials: candidate.initials,
                  jobId: job.id,
                  job: job.title,
                  stage: input.stage,
                  owner: input.owner,
                  nextInternalAction: input.nextInternalAction,
                  updated: "Now",
                  version: `v${Number(record.version.replace("v", "")) + 1}`,
                }
              : record,
          ),
        );
        setNotice(`${id} updated in memory; stage and reference history remain synthetic.`);
      },
      resetKey,
      resetPrototype: () => {
        setScenarioId("SCN-005");
        setPersonaId(demoPersonas[0].id);
        setScorecardResolved(false);
        setAvailabilitySubmitted(false);
        setOfferApproved(false);
        setObjectRecords(seededObjectRecords);
        setJobRecords(seededJobs);
        setCandidateRecords(seededCandidates);
        setApplicationRecords(seededApplications);
        setNotice(
          "Prototype reset to the coherent missing-scorecard scenario.",
        );
        setResetKey((key) => key + 1);
      },
    }),
    [
      availabilitySubmitted,
      notice,
      objectRecords,
      jobRecords,
      candidateRecords,
      applicationRecords,
      offerApproved,
      persona,
      personaId,
      resetKey,
      scenario,
      scenarioState,
      scorecardResolved,
    ],
  );

  return (
    <PrototypeContext.Provider value={value}>
      {children}
    </PrototypeContext.Provider>
  );
}

export function usePrototype() {
  const context = useContext(PrototypeContext);
  if (!context)
    throw new Error("usePrototype must be used inside PrototypeProvider");
  return context;
}
