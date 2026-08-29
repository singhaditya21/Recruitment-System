import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "../App";
import {
  completeV32Backlog,
  globalP0Features,
  p0Features,
  p1Features,
  p2Features,
  wireframeUseCases,
} from "../data/useCaseWorkbench";

function open(hash: string) {
  window.location.hash = hash;
  return render(<App />);
}

describe("v3.2 connected use-case wireframe contracts", () => {
  it("reconciles all 35 update contracts and 12 use cases", () => {
    expect(wireframeUseCases).toHaveLength(12);
    expect(wireframeUseCases.reduce((count, useCase) => count + useCase.processes.length, 0)).toBe(52);
    expect(globalP0Features).toHaveLength(2);
    expect(p0Features).toHaveLength(13);
    expect(p1Features).toHaveLength(12);
    expect(p2Features).toHaveLength(8);
    expect(completeV32Backlog).toHaveLength(35);
    expect(new Set(completeV32Backlog.map((item) => item.id)).size).toBe(35);
    expect(wireframeUseCases.every((useCase) => useCase.processes.length >= 4)).toBe(true);
    expect(wireframeUseCases.flatMap((useCase) => useCase.processes).every((process) =>
      process.route && process.action && process.input && process.output && process.object &&
      process.event && process.store && process.guard && process.denial && process.recovery,
    )).toBe(true);
  });

  it("renders the complete use-case and backlog portfolio", () => {
    open("#/demo/workbench");
    expect(screen.getByRole("heading", { name: /Run all 12 recruitment and onboarding use cases/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Open connected workbench/i })).toHaveLength(12);
    expect(screen.getByText("12 P1 controls are live across every use case")).toBeInTheDocument();
    expect(screen.getByText("Eight P2 capabilities are ready")).toBeInTheDocument();
  });

  it("persists a P0 action across receipt, control-center and handoff views", async () => {
    const user = userEvent.setup();
    open("#/demo/workbench/uc-01");
    await user.click(screen.getByRole("button", { name: /Submit exact requisition version/i }));
    expect(screen.getByText("RequisitionSubmitted", { exact: true })).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Active persona"), "Finance Approver");
    await user.click(screen.getByRole("button", { name: /Record Finance approval/i }));
    await user.selectOptions(screen.getByLabelText("Active persona"), "Compensation Approver");
    await user.click(screen.getByRole("button", { name: /Record Compensation approval/i }));
    expect(screen.getByText("RequisitionApproved", { exact: true })).toBeInTheDocument();
    expect(screen.getByText(/RCT-V32-0003/)).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Control center" }));
    expect(screen.getByRole("table", { name: "Feature readiness drill-through" })).toHaveTextContent("complete");
    expect(screen.getByText("EVT-V32-0003", { exact: true })).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Handoffs" }));
    const recruiterHandoff = screen
      .getByText("Recruiter receives approved demand")
      .closest("article");
    expect(recruiterHandoff).not.toBeNull();
    await user.click(recruiterHandoff!.querySelector("button")!);
    expect(screen.getByText("Acknowledged")).toBeInTheDocument();
  });

  it("executes exception, recovery and state comparison", async () => {
    const user = userEvent.setup();
    open("#/demo/workbench/uc-08");
    await user.click(screen.getByRole("button", { name: /Open candidate dispute/i }));
    expect(screen.getByText("blocked", { exact: true })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Resolve dispute and resume/i }));
    expect(screen.getByText("recovered", { exact: true })).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "compare" }));
    expect(screen.getByText("Happy path versus exception and recovery")).toBeInTheDocument();
    expect(screen.getByText("No unsupported downstream action")).toBeInTheDocument();
  });

  it("exposes persona field controls, country variants and nine prepared recovery states", async () => {
    const user = userEvent.setup();
    open("#/demo/workbench/uc-10?tab=controls");
    await user.selectOptions(screen.getByLabelText("Inspect as persona"), "New Hire");
    expect(screen.getAllByText("Denied").length).toBeGreaterThan(0);
    await user.selectOptions(screen.getByLabelText("Jurisdiction pack"), "de");
    expect(screen.getByText("Blocked pending synthetic approval")).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Prepared state"), "provider");
    expect(screen.getByText(/Successful rows remain complete/i)).toBeInTheDocument();
  });

  it("creates governed report delivery previews and exposes all P2 runbooks", async () => {
    const user = userEvent.setup();
    open("#/demo/reports");
    await user.click(screen.getByRole("button", { name: "Save report" }));
    await user.click(screen.getByRole("button", { name: "Schedule preview" }));
    await user.click(screen.getByRole("button", { name: "Export preview" }));
    expect(screen.getAllByText("Preview only")).toHaveLength(3);

    await user.click(screen.getByRole("link", { name: "Scenarios" }));
    expect(screen.getByRole("heading", { name: "Runbooks, scenarios, rehearsal and evidence" })).toBeInTheDocument();
    expect(screen.getByText("8/8 P2 capabilities")).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Demo format"), "60");
    expect(screen.getAllByRole("link", { name: "Open" })).toHaveLength(12);
  });

  it("records checkpoints, bookmarks, rehearsal evidence and feedback", async () => {
    const user = userEvent.setup();
    open("#/demo/workbench/uc-11");
    await user.click(screen.getByRole("button", { name: "Bookmark" }));
    await user.click(screen.getByRole("button", { name: "Save checkpoint" }));
    expect(screen.getByText(/CHK-V32-001/)).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "feedback" }));
    await user.click(screen.getByRole("checkbox", { name: "Keyboard" }));
    await user.selectOptions(screen.getByLabelText("Rehearsal result"), "Pass");
    await user.type(screen.getByPlaceholderText(/Record a product observation/i), "Dependency explanation is clear.");
    await user.click(screen.getByRole("button", { name: "Record feedback" }));
    expect(screen.getByText("1 observations recorded for UC-11")).toBeInTheDocument();
  });
});
