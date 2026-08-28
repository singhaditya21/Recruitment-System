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
});
