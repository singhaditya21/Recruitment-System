import { describe, expect, it } from "vitest";
import routes from "../../artifacts/v0.9/routes.json";
import transitions from "../../artifacts/v0.9/transitions.json";
import automations from "../../artifacts/v0.9/automations.json";
import interfaces from "../../artifacts/v0.9/interfaces.json";
import scenarios from "../../artifacts/v0.9/scenarios.json";
import traceability from "../../artifacts/v0.9/traceability.json";
import accessibility from "../../artifacts/v0.9/content-accessibility.json";
import { scenarioStates } from "../data/fixtures";

describe("v0.9 executable artifacts", () => {
  it("keeps every screen traced to scenarios, requirements, tests and accessibility", () => {
    expect(routes.routes).toHaveLength(12);
    expect(traceability.rows).toHaveLength(12);
    expect(accessibility.screens).toHaveLength(12);
    const traceIds = traceability.rows.map((row) => row.screenId);
    const accessibilityIds = accessibility.screens.map((row) => row.id);
    for (const route of routes.routes) {
      expect(traceIds).toContain(route.id);
      expect(accessibilityIds).toContain(route.id);
      expect(route.requirements.length).toBeGreaterThan(0);
      expect(route.states.length).toBeGreaterThanOrEqual(4);
    }
  });

  it("keeps the governed registries finite", () => {
    expect(transitions.transitions.map((item) => item.id)).toEqual(Array.from({ length: 15 }, (_, index) => `TRN-${String(index + 1).padStart(3, "0")}`));
    expect(automations.rules).toHaveLength(15);
    expect(interfaces.operations).toHaveLength(15);
    expect(scenarios.scenarios).toHaveLength(12);
  });

  it("makes every interface stub incapable of external writes", () => {
    expect(interfaces.operations.every((operation) => operation.writes === false)).toBe(true);
    expect(new Set(interfaces.operations.map((operation) => operation.prototype))).toEqual(new Set(["fixture-read", "disabled-stub", "memory-only", "simulation-only"]));
  });
});

describe("v1.5 canonical scenario graph", () => {
  it("defines a coherent projection for every inherited scenario", () => {
    expect(Object.keys(scenarioStates)).toHaveLength(12);
    for (const state of Object.values(scenarioStates)) {
      if (state.missingScorecards > 0) {
        expect(state.decisionState).toBe("Blocked");
        expect(state.offerState).toBe("Not started");
      }
      if (state.offerState === "Accepted") expect(state.openingReserved).toBe(1);
      else expect(state.openingReserved).toBe(0);
      if (state.handoffState === "Reconciliation failed") {
        expect(state.offerState).toBe("Accepted");
        expect(state.openingFilled).toBe(0);
      }
      if (state.policyBlocked) expect(state.decisionState).toBe("Blocked");
    }
  });
});
