import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "../App";

function open(hash: string) {
  window.location.hash = hash;
  return render(<App />);
}

describe("candidate prototype journeys", () => {
  beforeEach(() => { window.location.hash = "#/careers"; });

  it("filters fictional jobs and exposes an accessible empty recovery", async () => {
    const user = userEvent.setup();
    open("#/careers");
    const search = screen.getByRole("textbox", { name: "Search jobs" });
    await user.type(search, "no such role");
    expect(screen.getByText("No demo roles match those filters")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getAllByRole("article")).toHaveLength(3);
  });

  it("blocks review until the synthetic-answer declaration is confirmed", async () => {
    const user = userEvent.setup();
    open("#/apply/product-designer-remote-demo/profile");
    await user.click(screen.getByRole("button", { name: /Continue/ }));
    await user.click(screen.getByRole("button", { name: /Continue/ }));
    await user.click(screen.getByRole("button", { name: /Continue/ }));
    expect(screen.getByRole("alert")).toHaveTextContent("synthetic demonstration answers");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: /Continue/ }));
    expect(screen.getByRole("heading", { name: "Review the immutable snapshot" })).toBeInTheDocument();
  });
});

describe("HR prototype controls", () => {
  it("switches seeded personas and keeps list records populated", async () => {
    const user = userEvent.setup();
    open("#/hr/action-center");
    expect(screen.getByRole("table", { name: "Recently updated applications" })).toHaveTextContent("APP-DEMO-011");
    await user.selectOptions(screen.getByRole("combobox", { name: "View as demo persona" }), "USR-HM-001");
    expect(screen.getByRole("heading", { name: "Good morning, Marcus" })).toBeInTheDocument();
    expect(screen.getByText(/Hiring Manager · Requisition & decision/)).toBeInTheDocument();
  });

  it("explains why a governed transition is blocked", async () => {
    const user = userEvent.setup();
    open("#/hr/applications/APP-DEMO-001");
    await user.click(screen.getByRole("button", { name: "Review transition" }));
    const dialog = screen.getByRole("dialog", { name: "Move Interviews → Debrief?" });
    expect(within(dialog).getByText("1 required scorecard missing")).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Transition blocked" })).toBeDisabled();
  });

  it("shows a policy block for the unknown-jurisdiction scenario", async () => {
    const user = userEvent.setup();
    open("#/hr/jobs/JOB-DEMO-001");
    await user.selectOptions(screen.getByRole("combobox", { name: "Choose synthetic scenario" }), "SCN-012");
    expect(screen.getByRole("alert")).toHaveTextContent("Publication is blocked");
    expect(screen.getByRole("button", { name: "Publication blocked" })).toBeDisabled();
  });

  it("seeds restricted privacy operations without enabling execution", async () => {
    const user = userEvent.setup();
    open("#/hr/governance");
    await user.click(screen.getByRole("tab", { name: "Privacy requests" }));
    const table = screen.getByRole("table", { name: "Synthetic privacy requests" });
    expect(within(table).getByText("PRV-DEMO-014")).toBeInTheDocument();
    expect(within(table).getAllByRole("row")).toHaveLength(4);
  });
});
