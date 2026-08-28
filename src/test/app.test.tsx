import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import App from "../App";

function open(hash: string) {
  window.location.hash = hash;
  return render(<App />);
}

describe("candidate prototype journeys", () => {
  beforeEach(() => {
    window.location.hash = "#/careers";
  });

  it("filters fictional jobs and exposes an accessible empty recovery", async () => {
    const user = userEvent.setup();
    open("#/careers");
    const search = screen.getByRole("textbox", { name: "Search jobs" });
    await user.type(search, "no such role");
    expect(
      screen.getByText("No demo roles match those filters"),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getAllByRole("article")).toHaveLength(3);
  });

  it("blocks review until the synthetic-answer declaration is confirmed", async () => {
    const user = userEvent.setup();
    open("#/apply/product-designer-remote-demo/profile");
    await user.click(screen.getByRole("button", { name: /Continue/ }));
    await user.click(screen.getByRole("button", { name: /Continue/ }));
    await user.click(screen.getByRole("button", { name: /Continue/ }));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "synthetic demonstration answers",
    );
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: /Continue/ }));
    expect(
      screen.getByRole("heading", { name: "Review the immutable snapshot" }),
    ).toBeInTheDocument();
  });

  it("offers a candidate-safe availability task without exposing the internal conflict", async () => {
    const user = userEvent.setup();
    open("#/my-applications/APP-DEMO-001");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Choose synthetic scenario" }),
      "SCN-004",
    );
    expect(screen.queryByText(/Interview conflict/i)).not.toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Share demo availability" }),
    );
    const dialog = screen.getByRole("dialog", {
      name: "Share synthetic availability",
    });
    await user.click(
      within(dialog).getByRole("button", { name: "Save availability in demo" }),
    );
    expect(screen.getByText("Availability shared · demo")).toBeInTheDocument();
  });

  it("lets the candidate manage permitted profile and communication controls", async () => {
    const user = userEvent.setup();
    open("#/my-applications/APP-DEMO-001");
    await user.click(screen.getByRole("tab", { name: "Profile & privacy" }));
    expect(
      screen.getByRole("heading", { name: "Contact and preferences" }),
    ).toBeInTheDocument();
    await user.selectOptions(
      screen.getByLabelText("Preferred channel"),
      "Support-assisted contact",
    );
    await user.click(
      screen.getByRole("button", { name: "Save profile in memory" }),
    );
    expect(
      screen.getByText("Synthetic profile saved for this browser view."),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Messages" }));
    expect(
      screen.getByRole("heading", { name: "Messages about this application" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Support-assisted contact")).toBeInTheDocument();
  });
});

describe("HR prototype controls", () => {
  it("switches seeded personas and keeps list records populated", async () => {
    const user = userEvent.setup();
    open("#/hr/action-center");
    expect(
      screen.getByRole("table", { name: "Recently updated applications" }),
    ).toHaveTextContent("APP-DEMO-011");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "View as demo persona" }),
      "USR-HM-001",
    );
    expect(
      screen.getByRole("heading", { name: "Good morning, Marcus" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Hiring Manager · Requisition & decision/),
    ).toBeInTheDocument();
  });

  it("explains why a governed transition is blocked", async () => {
    const user = userEvent.setup();
    open("#/hr/applications/APP-DEMO-001");
    await user.click(screen.getByRole("button", { name: "Review transition" }));
    const dialog = screen.getByRole("dialog", {
      name: "Move Interviews → Debrief?",
    });
    expect(
      within(dialog).getByText("1 required scorecard missing"),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByRole("button", { name: "Transition blocked" }),
    ).toBeDisabled();
  });

  it("shows a policy block for the unknown-jurisdiction scenario", async () => {
    const user = userEvent.setup();
    open("#/hr/jobs/JOB-DEMO-001");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Choose synthetic scenario" }),
      "SCN-012",
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Publication is blocked",
    );
    expect(
      screen.getByRole("button", { name: "Publication blocked" }),
    ).toBeDisabled();
  });

  it("seeds restricted privacy operations without enabling execution", async () => {
    const user = userEvent.setup();
    open("#/hr/governance");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "View as demo persona" }),
      "USR-PRV-001",
    );
    await user.click(screen.getByRole("tab", { name: "Privacy requests" }));
    const table = screen.getByRole("table", {
      name: "Synthetic privacy requests",
    });
    expect(within(table).getByText("PRV-DEMO-014")).toBeInTheDocument();
    expect(within(table).getAllByRole("row")).toHaveLength(4);
  });

  it("binds application routes to the requested synthetic record", () => {
    open("#/hr/applications/APP-DEMO-004");
    expect(
      screen.getByRole("heading", { name: "Noah Williams", level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Recruiting Operations Partner · Scheduling/),
    ).toBeInTheDocument();
  });

  it("persists persona scope across workspace navigation", async () => {
    const user = userEvent.setup();
    open("#/hr/action-center");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "View as demo persona" }),
      "USR-INT-001",
    );
    await user.click(screen.getByRole("link", { name: "Scorecards" }));
    expect(
      screen.getByRole("combobox", { name: "View as demo persona" }),
    ).toHaveValue("USR-INT-001");
    expect(
      screen.getByRole("heading", { name: "Scorecards", level: 1 }),
    ).toBeInTheDocument();
  });

  it("recalculates application readiness after an in-memory scorecard submission", async () => {
    const user = userEvent.setup();
    open("#/hr/assignments/ASN-DEMO-001");
    await user.click(screen.getByRole("button", { name: "Submit scorecard" }));
    await user.click(screen.getByRole("link", { name: "Applications" }));
    await user.click(screen.getByRole("link", { name: /Maya Chen/ }));
    expect(screen.getByText("Scorecards complete")).toBeInTheDocument();
    expect(screen.getByText("Debrief").closest("li")).toHaveTextContent(
      "Current",
    );
  });

  it("turns application tabs into operational panels", async () => {
    const user = userEvent.setup();
    open("#/hr/applications/APP-DEMO-001");
    await user.click(screen.getByRole("tab", { name: "Messages" }));
    expect(
      screen.getByRole("heading", { name: "Candidate conversation" }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Queue message preview" }),
    );
    expect(
      screen.getByRole("button", { name: "Queued in memory" }),
    ).toBeDisabled();
    await user.click(screen.getByRole("tab", { name: "Activity" }));
    expect(
      screen.getByText("Decision readiness recalculated"),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Documents & forms" }));
    expect(
      screen.getByText("application-response-snapshot.pdf"),
    ).toBeInTheDocument();
  });

  it("exposes interviewer briefing and keeps other feedback blinded before submission", async () => {
    const user = userEvent.setup();
    open("#/hr/assignments/ASN-DEMO-001");
    await user.click(screen.getByRole("tab", { name: "Feedback visibility" }));
    expect(screen.getByText("Other feedback is hidden")).toBeInTheDocument();
    expect(screen.getByText("Blinded until submission")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Submit scorecard" }));
    expect(
      screen.getByText("Submitted · eligible for debrief view"),
    ).toBeInTheDocument();
  });

  it("simulates automation collisions and replay recovery for an authorized persona", async () => {
    const user = userEvent.setup();
    open("#/hr/automations");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "View as demo persona" }),
      "USR-CFG-001",
    );
    await user.click(
      screen.getByRole("button", { name: "Run impact simulation" }),
    );
    expect(screen.getByText("Collision:")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Preview replay" }));
    expect(screen.getByText("Replayed · reconciled")).toBeInTheDocument();
  });

  it("projects an approved immutable offer into a candidate-safe task", async () => {
    const user = userEvent.setup();
    open("#/hr/action-center");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Choose synthetic scenario" }),
      "SCN-006",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "View as demo persona" }),
      "USR-APR-001",
    );
    await user.click(screen.getByRole("link", { name: "Offers & handoff" }));
    await user.click(screen.getByRole("link", { name: /Leila H\./ }));
    await user.click(
      screen.getByRole("button", { name: "Approve current offer" }),
    );
    expect(
      screen.getByText("Approved v4", { selector: ".pill" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: "Candidate Site" }));
    await user.click(screen.getByRole("link", { name: "My applications" }));
    expect(
      screen.getByRole("button", { name: "Review synthetic offer" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Offer ready for review", { selector: ".pill" }),
    ).toBeInTheDocument();
  });

  it("filters the persona-aware analytics portfolio and reconciles visible metrics", async () => {
    const user = userEvent.setup();
    open("#/hr/analytics");
    expect(
      screen.getByRole("heading", { name: "Reporting & analytics", level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Is the recruiting portfolio moving safely and on time?",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/of \d+ role-visible records/)).toBeInTheDocument();
    await user.selectOptions(
      screen.getByLabelText("Analytics job filter"),
      "JOB-DEMO-003",
    );
    expect(
      screen.getByText(/of \d+ role-visible records/),
    ).not.toHaveTextContent("48 of 48");
    await user.selectOptions(
      screen.getByLabelText("Choose analytics dashboard"),
      "sourcing",
    );
    expect(
      screen.getByText(
        "Which approved sources create qualified progress without becoming a ranking signal?",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Metric definitions" }),
    ).toBeInTheDocument();
  });

  it("covers every logical object family in the interactive data contract", async () => {
    const user = userEvent.setup();
    open("#/hr/governance");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "View as demo persona" }),
      "USR-CFG-001",
    );
    await user.click(
      screen.getByRole("tab", { name: "Object & data contract" }),
    );
    expect(screen.getAllByText("92/92")).toHaveLength(3);
    expect(screen.getByText("48/48")).toBeInTheDocument();
    await user.type(
      screen.getByLabelText("Search object and data catalog"),
      "OBJ-022",
    );
    await user.click(screen.getByRole("option", { name: /OBJ-022/ }));
    expect(
      screen.getByRole("heading", { name: "Application" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("table", { name: "Application logical data points" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Exactly one Candidate and one Requisition"),
    ).toBeInTheDocument();
  });

  it("creates, details and edits a role-authorized logical object record", async () => {
    const user = userEvent.setup();
    open("#/hr/objects/requisition");
    expect(
      screen.getByRole("heading", { name: "Requisition records" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: "New Requisition" }));
    const name = screen.getByRole("textbox", { name: /Record name/ });
    await user.clear(name);
    await user.type(name, "Synthetic accessibility researcher requisition");
    await user.click(
      screen.getByRole("button", { name: "Create synthetic record" }),
    );
    expect(
      screen.getByRole("heading", {
        name: "Synthetic accessibility researcher requisition",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Field-level detail" }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("link", { name: "Edit permitted fields" }),
    );
    await user.clear(screen.getByRole("textbox", { name: /Record name/ }));
    await user.type(
      screen.getByRole("textbox", { name: /Record name/ }),
      "Synthetic accessibility lead requisition",
    );
    await user.click(
      screen.getByRole("button", { name: "Save permitted changes" }),
    );
    expect(
      screen.getByRole("heading", {
        name: "Synthetic accessibility lead requisition",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/v2 · Now · in-memory fixture/),
    ).toBeInTheDocument();
  });

  it("applies object access denial beyond navigation visibility", async () => {
    const user = userEvent.setup();
    open("#/hr/objects/candidate");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "View as demo persona" }),
      "USR-INT-001",
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Object access denied safely",
    );
  });

  it("exposes saved reports, a builder and controlled delivery evidence", async () => {
    const user = userEvent.setup();
    open("#/hr/reports");
    expect(
      screen.getByRole("heading", { name: "Saved report catalog" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Weekly talent operating review")).toHaveLength(
      2,
    );
    await user.click(screen.getByRole("tab", { name: "Builder" }));
    expect(
      screen.getByRole("heading", { name: "Custom report builder" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("table", { name: "Applications by stage preview" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Delivery audit" }));
    expect(screen.getByText("DLV-104")).toBeInTheDocument();
    expect(screen.getByText("Recipient denied")).toBeInTheDocument();
    await user.click(
      screen.getByRole("tab", { name: "Targets & restatements" }),
    );
    expect(screen.getByText(/RST-001 · RPT-001/)).toBeInTheDocument();
  });
});
