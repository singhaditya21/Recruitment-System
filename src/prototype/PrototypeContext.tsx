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
import { objectCatalog } from "../data/objectCatalog";
import {
  type AssignmentRecord,
  type CandidateRecord,
  type InterviewRecord,
  type JobRecord,
} from "../data/coreRecords";
import {
  createCanonicalApplication,
  createCanonicalCandidate,
  createCanonicalJob,
  projectApplications,
  projectAssignments,
  projectCandidates,
  projectInterviews,
  projectJobs,
  seededCanonicalCoreStore,
  updateCanonicalApplication,
  updateCanonicalCandidate,
  updateCanonicalJob,
  type CanonicalCoreStore,
} from "../data/canonicalRuntime";
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
  completedOnboardingTaskIds: string[];
  completeOnboardingTask: (id: string, message?: string) => void;
  signedDocumentIds: string[];
  completeDocument: (id: string, message?: string) => void;
  resolvedOnboardingExceptionIds: string[];
  resolveOnboardingException: (id: string, message?: string) => void;
  completedProvisioningIds: string[];
  completeProvisioning: (id: string, message?: string) => void;
  pendingWorkerCorrected: boolean;
  correctPendingWorker: (message?: string) => void;
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
  const [completedOnboardingTaskIds, setCompletedOnboardingTaskIds] = useState([
    "OBT-DEMO-005",
  ]);
  const [signedDocumentIds, setSignedDocumentIds] = useState([
    "DOC-NH-001",
    "DOC-NH-006",
  ]);
  const [resolvedOnboardingExceptionIds, setResolvedOnboardingExceptionIds] =
    useState<string[]>([]);
  const [completedProvisioningIds, setCompletedProvisioningIds] = useState<
    string[]
  >([]);
  const [pendingWorkerCorrected, setPendingWorkerCorrected] = useState(false);
  const [objectRecords, setObjectRecords] =
    useState<ObjectRecord[]>(seededObjectRecords);
  const [canonicalCoreStore, setCanonicalCoreStore] =
    useState<CanonicalCoreStore>(seededCanonicalCoreStore);
  const [resetKey, setResetKey] = useState(0);
  const scenario =
    scenarioArtifact.scenarios.find((item) => item.id === scenarioId) ??
    scenarioArtifact.scenarios[0];
  const persona =
    demoPersonas.find((item) => item.id === personaId) ?? demoPersonas[0];
  const jobRecords = useMemo(
    () => projectJobs(canonicalCoreStore),
    [canonicalCoreStore],
  );
  const candidateRecords = useMemo(
    () => projectCandidates(canonicalCoreStore),
    [canonicalCoreStore],
  );
  const applicationRecords = useMemo(
    () => projectApplications(canonicalCoreStore),
    [canonicalCoreStore],
  );
  const interviewRecords = useMemo(
    () => projectInterviews(canonicalCoreStore),
    [canonicalCoreStore],
  );
  const assignmentRecords = useMemo(
    () => projectAssignments(canonicalCoreStore),
    [canonicalCoreStore],
  );
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
      completedOnboardingTaskIds,
      completeOnboardingTask: (
        id: string,
        message = `${id} completed in browser memory with synthetic evidence.`,
      ) => {
        setCompletedOnboardingTaskIds((current) =>
          current.includes(id) ? current : [...current, id],
        );
        setNotice(message);
      },
      signedDocumentIds,
      completeDocument: (
        id: string,
        message = `${id} completed in browser memory. No real signature or document was transmitted.`,
      ) => {
        setSignedDocumentIds((current) =>
          current.includes(id) ? current : [...current, id],
        );
        setNotice(message);
      },
      resolvedOnboardingExceptionIds,
      resolveOnboardingException: (
        id: string,
        message = `${id} resolved in browser memory with a synthetic audit event.`,
      ) => {
        setResolvedOnboardingExceptionIds((current) =>
          current.includes(id) ? current : [...current, id],
        );
        setNotice(message);
      },
      completedProvisioningIds,
      completeProvisioning: (
        id: string,
        message = `${id} marked delivered in browser memory. No provider request was sent.`,
      ) => {
        setCompletedProvisioningIds((current) =>
          current.includes(id) ? current : [...current, id],
        );
        setNotice(message);
      },
      pendingWorkerCorrected,
      correctPendingWorker: (
        message = "Pending-worker location corrected and revalidated in browser memory. No HRIS retry was executed.",
      ) => {
        setPendingWorkerCorrected(true);
        setCompletedOnboardingTaskIds((current) =>
          current.includes("OBT-DEMO-003")
            ? current
            : [...current, "OBT-DEMO-003"],
        );
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
            security: {
              organizationId: "ORG-DEMO-001",
              ownerUserId: persona.id,
              assignedUserIds: [persona.id],
              assignedRoles: [persona.role],
              purposeCodes:
                objectCatalog.find((object) => object.id === objectId)
                  ?.dataGroups ?? [],
              validFrom: "2026-08-28T00:00:00.000Z",
              validTo: null,
              restrictedEntitlements: [],
            },
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
      interviewRecords,
      assignmentRecords,
      createJob: (input: Omit<JobRecord, "id" | "version" | "posted">) => {
        const sequence =
          jobRecords.filter((record) => record.id.startsWith("JOB-MEM-")).length +
          1;
        const id = `JOB-MEM-${String(sequence).padStart(3, "0")}`;
        setCanonicalCoreStore((store) =>
          createCanonicalJob(store, id, input),
        );
        setNotice(
          `${id} created as an in-memory ${input.status.toLowerCase()} requisition. No public posting or Salesforce record was created.`,
        );
        return id;
      },
      updateJob: (
        id: string,
        input: Omit<JobRecord, "id" | "version" | "posted">,
      ) => {
        setCanonicalCoreStore((store) =>
          updateCanonicalJob(store, id, input),
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
        setCanonicalCoreStore((store) =>
          createCanonicalCandidate(store, id, input),
        );
        setNotice(
          `${id} candidate identity created in memory. No application was created automatically.`,
        );
        return id;
      },
      updateCandidate: (
        id: string,
        input: Omit<CandidateRecord, "id" | "initials" | "updated">,
      ) => {
        setCanonicalCoreStore((store) =>
          updateCanonicalCandidate(store, id, input),
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
        const sequence =
          applicationRecords.filter((record) => record.id.startsWith("APP-MEM-"))
            .length + 1;
        const id = `APP-MEM-${String(sequence).padStart(3, "0")}`;
        setCanonicalCoreStore((store) =>
          createCanonicalApplication(store, id, input),
        );
        setNotice(
          `${id} linked ${input.candidateId} to ${input.jobId} through the canonical application junction in memory.`,
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
        setCanonicalCoreStore((store) =>
          updateCanonicalApplication(store, id, input),
        );
        setNotice(`${id} updated in canonical memory; stage changes append an immutable event.`);
      },
      resetKey,
      resetPrototype: () => {
        setScenarioId("SCN-005");
        setPersonaId(demoPersonas[0].id);
        setScorecardResolved(false);
        setAvailabilitySubmitted(false);
        setOfferApproved(false);
        setCompletedOnboardingTaskIds(["OBT-DEMO-005"]);
        setSignedDocumentIds(["DOC-NH-001", "DOC-NH-006"]);
        setResolvedOnboardingExceptionIds([]);
        setCompletedProvisioningIds([]);
        setPendingWorkerCorrected(false);
        setObjectRecords(seededObjectRecords);
        setCanonicalCoreStore(seededCanonicalCoreStore);
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
      interviewRecords,
      assignmentRecords,
      offerApproved,
      completedOnboardingTaskIds,
      signedDocumentIds,
      resolvedOnboardingExceptionIds,
      completedProvisioningIds,
      pendingWorkerCorrected,
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
