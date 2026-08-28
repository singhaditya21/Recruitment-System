import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "../App";
import {
  flagshipOnboardingTasks,
  newHireDocuments,
  newHireRecords,
  onboardingExceptions,
  onboardingTemplates,
  provisioningRequests,
} from "../data/onboarding";
import {
  internalOpportunities,
  jobDistributions,
  prospects,
  talentCampaigns,
  talentCommunities,
} from "../data/talentGrowth";
import {
  lifecycleModelSummary,
  lifecycleObjectContracts,
} from "../data/lifecyclePlatform";

function open(hash: string) {
  window.location.hash = hash;
  return render(<App />);
}

describe("v2.0 full lifecycle contracts", () => {
  it("reconciles onboarding, talent and lifecycle-extension seed counts", () => {
    expect({
      newHires: newHireRecords.length,
      templates: onboardingTemplates.length,
      flagshipTasks: flagshipOnboardingTasks.length,
      exceptions: onboardingExceptions.length,
      provisioning: provisioningRequests.length,
      documents: newHireDocuments.length,
      prospects: prospects.length,
      communities: talentCommunities.length,
      campaigns: talentCampaigns.length,
      distributions: jobDistributions.length,
      opportunities: internalOpportunities.length,
    }).toEqual({
      newHires: 36,
      templates: 8,
      flagshipTasks: 8,
      exceptions: 18,
      provisioning: 72,
      documents: 6,
      prospects: 120,
      communities: 8,
      campaigns: 6,
      distributions: 24,
      opportunities: 8,
    });
  });

  it("defines every lifecycle extension object with unique grain, key fields and states", () => {
    expect(lifecycleModelSummary).toEqual({
      objects: 46,
      onboardingObjects: 28,
      talentObjects: 7,
      mobilityObjects: 3,
      platformObjects: 8,
      keyDataPoints: 186,
      lifecycleStates: 238,
    });
    expect(new Set(lifecycleObjectContracts.map((object) => object.id)).size).toBe(46);
    expect(new Set(lifecycleObjectContracts.map((object) => object.name)).size).toBe(46);
    expect(
      lifecycleObjectContracts.every(
        (object) => object.grain && object.parent && object.keyFields.length >= 4 && object.states.length >= 4,
      ),
    ).toBe(true);
  });
});

describe("v2.0 onboarding and new-hire journeys", () => {
  beforeEach(() => {
    window.location.hash = "#/hr/onboarding";
  });

  it("renders the command center and a real plan-assignment form", async () => {
    const user = userEvent.setup();
    open("#/hr/onboarding");
    expect(screen.getByRole("heading", { name: "Onboarding command center" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View all 36" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Assign plan" }));
    expect(screen.getByRole("heading", { name: "Assign an approved template" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Preview assignment" }));
    expect(screen.getByText(/Onboarding plan assignment simulated/)).toBeInTheDocument();
  });

  it("completes a new-hire profile task through browser memory", async () => {
    const user = userEvent.setup();
    open("#/preboarding/tasks/OBT-DEMO-001");
    expect(screen.getByRole("heading", { name: "Confirm personal information" })).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: "Submit securely" }));
    expect(screen.getByRole("heading", { name: "Your preboarding checklist" })).toBeInTheDocument();
    expect(screen.getAllByText("Complete", { selector: ".pill" }).length).toBeGreaterThan(0);
  });

  it("enforces hiring-manager row scope on the seeded new-hire list", async () => {
    const user = userEvent.setup();
    open("#/hr/onboarding/new-hires");
    await user.selectOptions(screen.getByRole("combobox", { name: "View as demo persona" }), "USR-HM-001");
    expect(screen.getByText("1 of 1 in scope")).toBeInTheDocument();
    expect(screen.getByText("Maya Chen")).toBeInTheDocument();
    expect(screen.queryByText("Liam Patel")).not.toBeInTheDocument();
  });
});

describe("v2.0 growth and platform controls", () => {
  it("minimizes prospect identity for privacy review", async () => {
    const user = userEvent.setup();
    open("#/hr/talent/crm");
    await user.selectOptions(screen.getByRole("combobox", { name: "View as demo persona" }), "USR-PRV-001");
    expect(screen.getAllByText(/Prospect PRO-DEMO-/).length).toBeGreaterThan(0);
    expect(screen.queryByText("Aarav Mehta")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Draft outreach/ })).toBeDisabled();
  });

  it("renders the 46-object lifecycle extension without claiming a physical schema", async () => {
    const user = userEvent.setup();
    open("#/hr/platform/data");
    expect(screen.getByRole("heading", { name: "Platform control center" })).toBeInTheDocument();
    await user.selectOptions(screen.getByRole("combobox", { name: "View as demo persona" }), "USR-ADM-001");
    expect(screen.getByText("46", { selector: "strong" })).toBeInTheDocument();
    expect(screen.getByText("0", { selector: "strong" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "PreHire" })).toBeInTheDocument();
    expect(screen.getByText("Logical", { selector: ".pill" })).toBeInTheDocument();
  });
});
