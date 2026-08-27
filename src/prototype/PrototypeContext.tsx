import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import scenarioArtifact from "../../artifacts/v0.9/scenarios.json";

type Scenario = (typeof scenarioArtifact.scenarios)[number];

type PrototypeContextValue = {
  scenario: Scenario;
  scenarios: Scenario[];
  setScenarioId: (id: string) => void;
  resetKey: number;
  resetPrototype: () => void;
};

const PrototypeContext = createContext<PrototypeContextValue | null>(null);

export function PrototypeProvider({ children }: { children: ReactNode }) {
  const [scenarioId, setScenarioId] = useState("SCN-005");
  const [resetKey, setResetKey] = useState(0);
  const scenario = scenarioArtifact.scenarios.find((item) => item.id === scenarioId) ?? scenarioArtifact.scenarios[0];

  const value = useMemo(
    () => ({
      scenario,
      scenarios: scenarioArtifact.scenarios,
      setScenarioId,
      resetKey,
      resetPrototype: () => setResetKey((key) => key + 1),
    }),
    [scenario, resetKey],
  );

  return <PrototypeContext.Provider value={value}>{children}</PrototypeContext.Provider>;
}

export function usePrototype() {
  const context = useContext(PrototypeContext);
  if (!context) throw new Error("usePrototype must be used inside PrototypeProvider");
  return context;
}
