import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  businessUseCases,
  getBusinessUseCase,
  type BusinessUseCase,
  type DemoStep,
  type DemoVariant,
} from "../data/demoJourneys";
import { usePrototype } from "./PrototypeContext";

export type DemoReceipt = {
  id: string;
  useCaseId: string;
  stepId: string;
  actor: string;
  action: string;
  outcome: string;
  dataStore: string;
  variant: DemoVariant;
  at: string;
};

type DemoContextValue = {
  activeUseCase: BusinessUseCase | null;
  activeUseCaseId: string | null;
  activeStep: DemoStep | null;
  demoStepIndex: number;
  demoVariant: DemoVariant;
  completedStepIds: string[];
  receipts: DemoReceipt[];
  presenterOpen: boolean;
  launchUseCase: (id: string, variant?: DemoVariant) => void;
  setDemoVariant: (variant: DemoVariant) => void;
  goToStep: (index: number) => string | null;
  completeCurrentStep: () => string | null;
  restartUseCase: () => string | null;
  closeDemo: () => void;
  setPresenterOpen: (open: boolean) => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

function syntheticTime(sequence: number) {
  return `Demo T+${String(Math.max(0, sequence - 1) * 2).padStart(2, "0")}m`;
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const prototype = usePrototype();
  const [activeUseCaseId, setActiveUseCaseId] = useState<string | null>(null);
  const [demoStepIndex, setDemoStepIndex] = useState(0);
  const [demoVariant, setDemoVariantState] = useState<DemoVariant>("happy");
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);
  const [receipts, setReceipts] = useState<DemoReceipt[]>([]);
  const [presenterOpen, setPresenterOpen] = useState(false);
  const activeUseCase = getBusinessUseCase(activeUseCaseId ?? undefined) ?? null;
  const activeStep = activeUseCase?.steps[demoStepIndex] ?? null;

  const seedLaunchReceipt = (
    useCase: BusinessUseCase,
    variant: DemoVariant,
    sequence: number,
  ): DemoReceipt => ({
    id: `DRE-${String(sequence).padStart(3, "0")}`,
    useCaseId: useCase.id,
    stepId: "LAUNCH",
    actor: "Demo facilitator",
    action: `Loaded ${useCase.code} deterministic scenario`,
    outcome:
      variant === "happy"
        ? "Happy-path seed and checkpoints ready"
        : "Exception-path seed and recovery evidence ready",
    dataStore: "Browser-memory demo ledger",
    variant,
    at: syntheticTime(sequence),
  });

  const launchUseCase = (id: string, variant: DemoVariant = "happy") => {
    const useCase = getBusinessUseCase(id) ?? businessUseCases[0];
    prototype.resetPrototype();
    prototype.setScenarioId(useCase.scenarioId);
    const firstPersona = useCase.steps.find((item) => item.personaId)?.personaId;
    if (firstPersona) prototype.setPersonaId(firstPersona);
    setActiveUseCaseId(useCase.id);
    setDemoStepIndex(0);
    setDemoVariantState(variant);
    setCompletedStepIds([]);
    setReceipts((current) => [
      ...current,
      seedLaunchReceipt(useCase, variant, current.length + 1),
    ]);
    setPresenterOpen(true);
    prototype.announce(
      `${useCase.code} loaded with deterministic ${variant === "happy" ? "happy-path" : "exception-path"} fixtures. No external writes are possible.`,
    );
  };

  const applyEffect = (step: DemoStep) => {
    if (step.effect === "availability")
      prototype.shareAvailability(
        `${step.id} availability handoff recorded; recruiter and coordinator projections now share the same synthetic state.`,
      );
    if (step.effect === "scorecard")
      prototype.resolveScorecard(
        `${step.id} independent scorecard receipt recorded; decision readiness was recalculated.`,
      );
    if (step.effect === "offer")
      prototype.approveOffer(
        `${step.id} offer version approved; the candidate-safe response task is now available.`,
      );
    if (step.effect === "onboarding-task")
      prototype.completeOnboardingTask(
        "OBT-DEMO-001",
        `${step.id} onboarding task completed with synthetic evidence.`,
      );
    if (step.effect === "document")
      prototype.completeDocument(
        "DOC-NH-002",
        `${step.id} document completion retained in the shared onboarding projection.`,
      );
    if (step.effect === "provisioning")
      prototype.completeProvisioning(
        "PRV-DEMO-001",
        `${step.id} fulfilment receipt recorded; readiness projections can now reconcile it.`,
      );
    if (step.effect === "pending-worker")
      prototype.correctPendingWorker(
        `${step.id} pending-worker correction revalidated with the same synthetic business key.`,
      );
  };

  const goToStep = (index: number) => {
    if (!activeUseCase) return null;
    const bounded = Math.max(0, Math.min(index, activeUseCase.steps.length - 1));
    const target = activeUseCase.steps[bounded];
    setDemoStepIndex(bounded);
    if (target.personaId) prototype.setPersonaId(target.personaId);
    setPresenterOpen(true);
    return target.route;
  };

  const completeCurrentStep = () => {
    if (!activeUseCase || !activeStep) return null;
    applyEffect(activeStep);
    setCompletedStepIds((current) =>
      current.includes(activeStep.id) ? current : [...current, activeStep.id],
    );
    setReceipts((current) => [
      ...current,
      {
        id: `DRE-${String(current.length + 1).padStart(3, "0")}`,
        useCaseId: activeUseCase.id,
        stepId: activeStep.id,
        actor: activeStep.actor,
        action: activeStep.process,
        outcome:
          demoVariant === "happy" ? activeStep.receipt : activeStep.exception,
        dataStore: activeStep.store,
        variant: demoVariant,
        at: syntheticTime(current.length + 1),
      },
    ]);
    const nextIndex = demoStepIndex + 1;
    if (nextIndex >= activeUseCase.steps.length) {
      prototype.announce(
        `${activeUseCase.code} complete. ${activeUseCase.outcome}`,
      );
      return null;
    }
    const nextStep = activeUseCase.steps[nextIndex];
    setDemoStepIndex(nextIndex);
    if (nextStep.personaId) prototype.setPersonaId(nextStep.personaId);
    return nextStep.route;
  };

  const restartUseCase = () => {
    if (!activeUseCase) return null;
    launchUseCase(activeUseCase.id, demoVariant);
    return activeUseCase.steps[0]?.route ?? null;
  };

  const setDemoVariant = (variant: DemoVariant) => {
    setDemoVariantState(variant);
    if (activeUseCase) {
      prototype.resetPrototype();
      prototype.setScenarioId(activeUseCase.scenarioId);
      const firstPersona = activeUseCase.steps.find(
        (item) => item.personaId,
      )?.personaId;
      if (firstPersona) prototype.setPersonaId(firstPersona);
      setCompletedStepIds([]);
      setDemoStepIndex(0);
      prototype.announce(
        `${activeUseCase.code} switched to ${variant === "happy" ? "happy" : "exception and recovery"} mode.`,
      );
    }
  };

  const closeDemo = () => {
    setActiveUseCaseId(null);
    setDemoStepIndex(0);
    setCompletedStepIds([]);
    setPresenterOpen(false);
  };

  const value = useMemo<DemoContextValue>(
    () => ({
      activeUseCase,
      activeUseCaseId,
      activeStep,
      demoStepIndex,
      demoVariant,
      completedStepIds,
      receipts,
      presenterOpen,
      launchUseCase,
      setDemoVariant,
      goToStep,
      completeCurrentStep,
      restartUseCase,
      closeDemo,
      setPresenterOpen,
    }),
    [
      activeStep,
      activeUseCase,
      activeUseCaseId,
      completedStepIds,
      demoStepIndex,
      demoVariant,
      presenterOpen,
      receipts,
    ],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useDemo must be used inside DemoProvider");
  return context;
}
