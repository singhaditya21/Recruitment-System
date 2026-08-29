import axe from "axe-core";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "../App";

async function expectNoAxeViolations(hash: string) {
  window.location.hash = hash;
  const { container, unmount } = render(<App />);
  const results = await axe.run(container);
  expect(
    results.violations.map(({ id, nodes }) => ({ id, nodes: nodes.length })),
  ).toEqual([]);
  unmount();
}

describe("automated WCAG baseline", () => {
  it("passes the candidate careers baseline", async () => {
    await expectNoAxeViolations("#/careers");
  });

  it("passes the HR action-center baseline", async () => {
    await expectNoAxeViolations("#/hr/action-center");
  });

  it("passes the operational application baseline", async () => {
    await expectNoAxeViolations("#/hr/applications/APP-DEMO-001");
  });

  it("passes the candidate control-center baseline", async () => {
    await expectNoAxeViolations("#/my-applications/APP-DEMO-001");
  });

  it("passes the dynamic analytics baseline", async () => {
    await expectNoAxeViolations("#/hr/analytics");
  });

  it("passes the object and data contract baseline", async () => {
    const user = userEvent.setup();
    window.location.hash = "#/hr/governance";
    const { container } = render(<App />);
    await user.selectOptions(
      screen.getByRole("combobox", { name: "View as demo persona" }),
      "USR-CFG-001",
    );
    await user.click(
      screen.getByRole("tab", { name: "Object & data contract" }),
    );
    const results = await axe.run(container);
    expect(
      results.violations.map(({ id, nodes }) => ({ id, nodes: nodes.length })),
    ).toEqual([]);
  });

  it("passes the routed object list/new/detail baselines", async () => {
    for (const hash of [
      "#/hr/objects/requisition",
      "#/hr/objects/requisition/new",
      "#/hr/objects/requisition/REC-007-001",
    ]) {
      await expectNoAxeViolations(hash);
    }
  });

  it("passes the governed reporting baseline", async () => {
    await expectNoAxeViolations("#/hr/reports");
  });

  it.each([
    "#/hr/candidates",
    "#/hr/candidates/new",
    "#/hr/jobs/new",
    "#/hr/applications/new",
  ])("passes the dense core baseline at %s", async (hash) => {
    await expectNoAxeViolations(hash);
  });

  it.each([
    "#/saved-jobs",
    "#/my-tasks",
    "#/hr/cases",
    "#/hr/talent/referrals",
    "#/hr/high-volume",
    "#/manager",
    "#/it",
    "#/agency",
  ])("passes the v2.2 deep-journey baseline at %s", async (hash) => {
    await expectNoAxeViolations(hash);
  });

  it.each([
    "#/sign-in",
    "#/my-tasks/CTK-004",
    "#/preboarding/benefits",
    "#/hr/events",
    "#/hr/high-volume/HVC-001",
    "#/referrer",
    "#/facilities",
    "#/manager/recruiting",
    "#/interviewer/IVP-DEMO-001",
    "#/admin",
    "#/admin/integrations/ICG-DEMO-001",
    "#/admin/imports/IMP-DEMO-001/correct",
  ])("passes the v3.0 full-system baseline at %s", async (hash) => {
    await expectNoAxeViolations(hash);
  });

  it.each([
    "#/demo",
    "#/demo/catalog",
    "#/demo/flows/candidate-attraction",
    "#/demo/evidence",
  ])("passes the v3.1 demo-journey baseline at %s", async (hash) => {
    await expectNoAxeViolations(hash);
  });

  it.each([
    "#/demo/workbench",
    "#/demo/workbench/uc-01",
    "#/demo/workbench/uc-10?tab=controls",
    "#/demo/control-center",
    "#/demo/handoffs",
    "#/demo/reports",
    "#/demo/scenarios",
  ])("passes the v3.2 connected-use-case baseline at %s", async (hash) => {
    await expectNoAxeViolations(hash);
  });
});
