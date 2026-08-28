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
      resetKey,
      resetPrototype: () => {
        setScenarioId("SCN-005");
        setPersonaId(demoPersonas[0].id);
        setScorecardResolved(false);
        setAvailabilitySubmitted(false);
        setOfferApproved(false);
        setObjectRecords(seededObjectRecords);
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
