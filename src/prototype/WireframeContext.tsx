import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  countryVariants,
  errorScenarios,
  getP0Feature,
  p0Features,
  type P0Feature,
} from "../data/useCaseWorkbench";
import { usePrototype } from "./PrototypeContext";

export type FeatureStatus = "ready" | "complete" | "blocked" | "recovered" | "cancelled";
export type FeatureAction = "primary" | "exception" | "recover" | "cancel";

export type FeatureRuntimeState = {
  featureId: string;
  status: FeatureStatus;
  version: number;
  stateLabel: string;
  previousStateLabel: string;
  lastEventId: string | null;
  updatedAt: string;
};

export type DomainEvent = {
  id: string;
  receiptId: string;
  featureId: string;
  useCaseId: string;
  recordId: string;
  actor: string;
  action: string;
  reason: string;
  previousState: string;
  currentState: string;
  eventName: string;
  object: string;
  store: string;
  downstreamEffect: string;
  correlationKey: string;
  outcome: FeatureStatus;
  at: string;
};

export type Handoff = {
  id: string;
  featureId: string;
  useCaseId: string;
  recordId: string;
  from: string;
  to: string;
  subject: string;
  context: string;
  status: "Open" | "Acknowledged";
  createdAt: string;
};

export type Checkpoint = {
  id: string;
  useCaseId: string;
  label: string;
  eventCount: number;
  snapshot: Record<string, FeatureRuntimeState>;
  createdAt: string;
};

export type DemoFeedback = {
  id: string;
  useCaseId: string;
  category: string;
  observation: string;
  persona: string;
  screen: string;
  at: string;
};

export type RehearsalStatus = {
  status: "Not run" | "Pass" | "Fail";
  issueClass: "None" | "Polish" | "Stitching" | "Wireframe gap" | "Production only";
  keyboard: boolean;
  screenReader: boolean;
  mobile: boolean;
  readability: boolean;
};

export type SavedReport = {
  id: string;
  name: string;
  metricVersion: string;
  roleScope: string;
  delivery: "Saved" | "Scheduled preview" | "Export preview";
  createdAt: string;
};

type WireframeContextValue = {
  featureStates: Record<string, FeatureRuntimeState>;
  events: DomainEvent[];
  handoffs: Handoff[];
  checkpoints: Checkpoint[];
  bookmarks: string[];
  feedback: DemoFeedback[];
  rehearsal: Record<string, RehearsalStatus>;
  savedReports: SavedReport[];
  selectedCountryId: string;
  selectedErrorId: string;
  selectedPersona: string;
  setSelectedCountryId: (id: string) => void;
  setSelectedErrorId: (id: string) => void;
  setSelectedPersona: (id: string) => void;
  executeFeature: (featureId: string, action: FeatureAction, reason?: string) => void;
  acknowledgeHandoff: (id: string) => void;
  saveCheckpoint: (useCaseId: string, label?: string) => void;
  restoreCheckpoint: (id: string) => void;
  toggleBookmark: (useCaseId: string) => void;
  addFeedback: (input: Omit<DemoFeedback, "id" | "at">) => void;
  updateRehearsal: (useCaseId: string, update: Partial<RehearsalStatus>) => void;
  createReport: (delivery: SavedReport["delivery"]) => void;
  resetWireframe: () => void;
};

const WireframeContext = createContext<WireframeContextValue | null>(null);

const defaultFeatureStates = () =>
  Object.fromEntries(
    p0Features.map((feature) => [
      feature.id,
      {
        featureId: feature.id,
        status: "ready" as const,
        version: 1,
        stateLabel: feature.fromState,
        previousStateLabel: "Seeded baseline",
        lastEventId: null,
        updatedAt: "Demo T+00m",
      },
    ]),
  );

const defaultRehearsal = () =>
  Object.fromEntries(
    Array.from({ length: 12 }, (_, index) => [
      `uc-${String(index + 1).padStart(2, "0")}`,
      {
        status: "Not run" as const,
        issueClass: "None" as const,
        keyboard: false,
        screenReader: false,
        mobile: false,
        readability: false,
      },
    ]),
  );

function syntheticTime(sequence: number) {
  return `Demo T+${String(sequence * 2).padStart(2, "0")}m`;
}

function targetState(feature: P0Feature, action: FeatureAction) {
  if (action === "primary") return { status: "complete" as const, label: feature.toState };
  if (action === "exception") return { status: "blocked" as const, label: feature.exception };
  if (action === "recover") return { status: "recovered" as const, label: `${feature.toState} · recovered` };
  return { status: "cancelled" as const, label: "Cancelled with downstream impact assessed" };
}

function actionLabel(feature: P0Feature, action: FeatureAction) {
  if (action === "primary") return feature.primaryAction;
  if (action === "exception") return feature.exceptionAction;
  if (action === "recover") return feature.recoveryAction;
  return feature.cancelAction;
}

function eventName(feature: P0Feature, action: FeatureAction) {
  if (action === "primary") return feature.event;
  if (action === "exception") return `${feature.event}Failed`;
  if (action === "recover") return `${feature.event}Recovered`;
  return `${feature.event}Cancelled`;
}

function requisitionApprovalStep(
  current: FeatureRuntimeState,
  persona: string,
) {
  if (current.stateLabel === "Draft v3" && persona === "Hiring Manager")
    return {
      status: "ready" as const,
      label: "Submitted v3 · Finance review",
      event: "RequisitionSubmitted",
      handoff: "Finance Approver receives exact version v3",
      to: "Finance Approver",
    };
  if (
    current.stateLabel === "Submitted v3 · Finance review" &&
    persona === "Finance Approver"
  )
    return {
      status: "ready" as const,
      label: "Finance approved v3 · Compensation review",
      event: "FinanceApprovalRecorded",
      handoff: "Compensation Approver receives Finance-approved version v3",
      to: "Compensation Approver",
    };
  if (
    current.stateLabel === "Finance approved v3 · Compensation review" &&
    persona === "Compensation Approver"
  )
    return {
      status: "complete" as const,
      label: "Approved v4",
      event: "RequisitionApproved",
      handoff: "Recruiter receives approved demand",
      to: "Recruiter",
    };
  return null;
}

export function WireframeProvider({ children }: { children: ReactNode }) {
  const prototype = usePrototype();
  const sequence = useRef(0);
  const [featureStates, setFeatureStates] = useState<Record<string, FeatureRuntimeState>>(defaultFeatureStates);
  const [events, setEvents] = useState<DomainEvent[]>([]);
  const [handoffs, setHandoffs] = useState<Handoff[]>([]);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<DemoFeedback[]>([]);
  const [rehearsal, setRehearsal] = useState<Record<string, RehearsalStatus>>(defaultRehearsal);
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState(countryVariants[0].id);
  const [selectedErrorId, setSelectedErrorId] = useState(errorScenarios[0].id);
  const [selectedPersona, setSelectedPersona] = useState("Hiring Manager");

  const applyExistingProjection = (featureId: string, action: FeatureAction) => {
    if (action !== "primary" && action !== "recover") return;
    if (featureId === "WF-P0-09") prototype.shareAvailability("Interview scheduling and capacity state reconciled across candidate and coordinator routes.");
    if (featureId === "WF-P0-10") prototype.resolveScorecard("Structured debrief evidence completed; decision readiness recalculated across routes.");
    if (featureId === "WF-P0-12") prototype.approveOffer("Offer workbench approved the current synthetic version and exposed the candidate response task.");
    if (featureId === "WF-P0-13") prototype.correctPendingWorker("PendingWorker mapping corrected and reconciled with the same synthetic business key.");
    if (featureId === "WF-P0-14") {
      prototype.completeOnboardingTask("OBT-DEMO-001", "Dependency-aware onboarding task reconciled in shared state.");
      prototype.completeProvisioning("PRV-DEMO-001", "Provisioning evidence reconciled into day-one readiness.");
    }
    if (featureId === "WF-P0-04") {
      const job = prototype.jobRecords.find((item) => item.id === "JOB-DEMO-001");
      if (job)
        prototype.updateJob(job.id, {
          title: "Senior Product Designer",
          publicId: job.publicId,
          team: job.team,
          location: job.location,
          workplace: job.workplace,
          type: job.type,
          pay: job.pay,
          status: "Published",
          summary: job.summary,
          requirements: job.requirements,
          owner: job.owner,
        });
    }
  };

  const executeFeature = (featureId: string, action: FeatureAction, reason = "Demonstration action") => {
    const feature = getP0Feature(featureId);
    if (!feature) return;
    sequence.current += 1;
    const number = sequence.current;
    const current = featureStates[featureId];
    const approvalStep =
      featureId === "WF-P0-03" && action === "primary"
        ? requisitionApprovalStep(current, selectedPersona)
        : null;
    if (featureId === "WF-P0-03" && action === "primary" && !approvalStep) {
      prototype.announce(
        `The current ${selectedPersona} cannot perform the next exact-version approval step.`,
      );
      return;
    }
    const next = approvalStep ?? targetState(feature, action);
    const id = `EVT-V32-${String(number).padStart(4, "0")}`;
    const receiptId = `RCT-V32-${String(number).padStart(4, "0")}`;
    const at = syntheticTime(number);
    const useCaseId = feature.useCaseIds[0];
    const event: DomainEvent = {
      id,
      receiptId,
      featureId,
      useCaseId,
      recordId: feature.recordId,
      actor: selectedPersona || feature.actor,
      action: actionLabel(feature, action),
      reason,
      previousState: current.stateLabel,
      currentState: next.label,
      eventName: approvalStep?.event ?? eventName(feature, action),
      object: feature.object,
      store: feature.store,
      downstreamEffect:
        action === "exception"
          ? `Recovery work assigned: ${feature.recoveryAction}`
          : action === "cancel"
            ? "Pending effects cancelled; completed effects assessed for compensation"
          : approvalStep?.handoff ?? feature.handoff,
      correlationKey: `${feature.recordId}|${featureId}|v${current.version + 1}`,
      outcome: next.status,
      at,
    };
    setFeatureStates((states) => ({
      ...states,
      [featureId]: {
        featureId,
        status: next.status,
        version: current.version + 1,
        previousStateLabel: current.stateLabel,
        stateLabel: next.label,
        lastEventId: id,
        updatedAt: at,
      },
    }));
    setEvents((items) => [...items, event]);
    setHandoffs((items) => [
      ...items,
      {
        id: `HOF-V32-${String(number).padStart(4, "0")}`,
        featureId,
        useCaseId,
        recordId: feature.recordId,
        from: selectedPersona || feature.actor,
        to:
          action === "exception"
            ? "Recovery owner"
            : approvalStep?.to ?? feature.handoff.split(" receives ")[0],
        subject:
          action === "exception"
            ? feature.recoveryAction
            : approvalStep?.handoff ?? feature.handoff,
        context: `${event.eventName} · ${event.correlationKey}`,
        status: "Open",
        createdAt: at,
      },
    ]);
    applyExistingProjection(featureId, action);
    prototype.announce(`${receiptId}: ${event.action}. ${event.currentState}. No external effect was executed.`);
  };

  const acknowledgeHandoff = (id: string) => {
    setHandoffs((items) => items.map((item) => item.id === id ? { ...item, status: "Acknowledged" } : item));
    prototype.announce(`${id} acknowledged in browser memory.`);
  };

  const saveCheckpoint = (useCaseId: string, label = "Presenter checkpoint") => {
    sequence.current += 1;
    const number = sequence.current;
    setCheckpoints((items) => [
      ...items,
      {
        id: `CHK-V32-${String(number).padStart(3, "0")}`,
        useCaseId,
        label,
        eventCount: events.length,
        snapshot: structuredClone(featureStates),
        createdAt: syntheticTime(number),
      },
    ]);
    prototype.announce(`Checkpoint saved for ${useCaseId}.`);
  };

  const restoreCheckpoint = (id: string) => {
    const checkpoint = checkpoints.find((item) => item.id === id);
    if (!checkpoint) return;
    setFeatureStates(structuredClone(checkpoint.snapshot));
    prototype.announce(`${checkpoint.id} restored. Later receipts remain visible as history.`);
  };

  const toggleBookmark = (useCaseId: string) => {
    setBookmarks((items) => items.includes(useCaseId) ? items.filter((item) => item !== useCaseId) : [...items, useCaseId]);
  };

  const addFeedback = (input: Omit<DemoFeedback, "id" | "at">) => {
    sequence.current += 1;
    const number = sequence.current;
    setFeedback((items) => [...items, { ...input, id: `FDB-V32-${String(number).padStart(3, "0")}`, at: syntheticTime(number) }]);
    prototype.announce("Synthetic demo feedback recorded without personal data.");
  };

  const updateRehearsal = (useCaseId: string, update: Partial<RehearsalStatus>) => {
    setRehearsal((items) => ({ ...items, [useCaseId]: { ...items[useCaseId], ...update } }));
  };

  const createReport = (delivery: SavedReport["delivery"]) => {
    sequence.current += 1;
    const number = sequence.current;
    const report: SavedReport = {
      id: `RPT-V32-${String(number).padStart(3, "0")}`,
      name: "Recruitment and onboarding control scorecard",
      metricVersion: "MET-V32-01",
      roleScope: selectedPersona,
      delivery,
      createdAt: syntheticTime(number),
    };
    setSavedReports((items) => [...items, report]);
    prototype.announce(`${delivery} created for ${report.id}; no file, email or subscription was delivered.`);
  };

  const resetWireframe = () => {
    sequence.current = 0;
    setFeatureStates(defaultFeatureStates());
    setEvents([]);
    setHandoffs([]);
    setCheckpoints([]);
    setBookmarks([]);
    setFeedback([]);
    setRehearsal(defaultRehearsal());
    setSavedReports([]);
    setSelectedCountryId(countryVariants[0].id);
    setSelectedErrorId(errorScenarios[0].id);
    setSelectedPersona("Hiring Manager");
    prototype.resetPrototype();
    prototype.announce("v3.2 wireframe reset to its deterministic cross-route baseline.");
  };

  const value = useMemo<WireframeContextValue>(() => ({
    featureStates,
    events,
    handoffs,
    checkpoints,
    bookmarks,
    feedback,
    rehearsal,
    savedReports,
    selectedCountryId,
    selectedErrorId,
    selectedPersona,
    setSelectedCountryId,
    setSelectedErrorId,
    setSelectedPersona,
    executeFeature,
    acknowledgeHandoff,
    saveCheckpoint,
    restoreCheckpoint,
    toggleBookmark,
    addFeedback,
    updateRehearsal,
    createReport,
    resetWireframe,
  }), [featureStates, events, handoffs, checkpoints, bookmarks, feedback, rehearsal, savedReports, selectedCountryId, selectedErrorId, selectedPersona]);

  return <WireframeContext.Provider value={value}>{children}</WireframeContext.Provider>;
}

export function useWireframe() {
  const context = useContext(WireframeContext);
  if (!context) throw new Error("useWireframe must be used inside WireframeProvider");
  return context;
}
