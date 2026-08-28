import { expect, test, type Page } from "@playwright/test";

async function openHrNavigation(page: Page, name: string) {
  const toggle = page.getByRole("button", { name: "Toggle navigation" });
  if (await toggle.isVisible()) await toggle.click();
  await page.getByRole("link", { name, exact: true }).click();
}

test("candidate can complete the synthetic application journey", async ({
  page,
}) => {
  await page.goto("/#/careers");
  await expect(
    page.getByRole("heading", { name: /Meaningful work/ }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Senior Product Designer", exact: true })
    .click();
  await page.getByRole("link", { name: /Start demo application/ }).click();
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByRole("button", { name: /Simulate submission/ }).click();
  await expect(
    page.getByRole("heading", { name: "Demo application complete" }),
  ).toBeVisible();
  await expect(page.getByText("No application was created")).toBeVisible();
});

test("HR user can inspect a blocked transition without executing it", async ({
  page,
}) => {
  await page.goto("/#/hr/applications/APP-DEMO-001");
  await page.getByRole("button", { name: "Review transition" }).click();
  const dialog = page.getByRole("dialog", {
    name: "Move Interviews → Debrief?",
  });
  await expect(dialog.getByText("1 required scorecard missing")).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Transition blocked" }),
  ).toBeDisabled();
});

test("candidate careers reflows at a small viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/careers");
  await expect(
    page.getByRole("heading", { name: /Meaningful work/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Candidate navigation" }),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Search jobs" }),
  ).toBeVisible();
});

test("HR console keeps the Lightning shell and seeded records contained", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/hr/action-center");
  await expect(
    page.getByRole("heading", { name: "Good morning, Alex" }),
  ).toBeVisible();
  await expect(
    page.getByRole("table", { name: "Recently updated applications" }),
  ).toContainText("APP-DEMO-011");
  await expect(page.getByLabel("View as demo persona")).toHaveValue(
    "USR-REC-001",
  );
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test("route-bound search opens the requested application record", async ({
  page,
}) => {
  await page.goto("/#/hr/action-center");
  await page
    .getByRole("textbox", { name: "Search synthetic recruitment workspace" })
    .fill("Noah");
  await page
    .getByRole("option", {
      name: /Noah Williams Recruiting Operations Partner · APP-DEMO-004/,
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "Noah Williams", level: 1 }),
  ).toBeVisible();
  await expect(
    page.getByText(/Recruiting Operations Partner · Scheduling/),
  ).toBeVisible();
});

test("scorecard completion recalculates the shared application state", async ({
  page,
}) => {
  await page.goto("/#/hr/assignments/ASN-DEMO-001");
  await page.getByRole("button", { name: "Submit scorecard" }).click();
  await openHrNavigation(page, "Applications");
  await page.getByRole("link", { name: /Maya Chen/ }).click();
  await expect(page.getByText("Scorecards complete")).toBeVisible();
  await expect(page.locator(".stage-timeline li.current")).toContainText(
    "Debrief",
  );
});

test("persona scope persists and changes the available workspace", async ({
  page,
}) => {
  await page.goto("/#/hr/action-center");
  await page.getByLabel("View as demo persona").selectOption("USR-INT-001");
  await openHrNavigation(page, "Scorecards");
  await expect(page.getByLabel("View as demo persona")).toHaveValue(
    "USR-INT-001",
  );
  await expect(
    page.getByRole("heading", { name: "Scorecards", level: 1 }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Governance" })).toHaveCount(0);
});

test("candidate availability remains safe and recoverable", async ({
  page,
}) => {
  await page.goto("/#/my-applications/APP-DEMO-001");
  await page
    .getByRole("combobox", { name: "Choose synthetic scenario" })
    .selectOption("SCN-004");
  await expect(page.getByText(/Interview conflict/i)).toHaveCount(0);
  await page.getByRole("button", { name: "Share demo availability" }).click();
  await page.getByRole("button", { name: "Save availability in demo" }).click();
  await expect(page.getByText("Availability shared · demo")).toBeVisible();
  await page.evaluate(() => {
    window.location.hash = "#/hr/interviews/INT-DEMO-004";
  });
  await expect(
    page.getByText(
      "Submitted candidate availability is ready for coordination.",
    ),
  ).toBeVisible();
});

test("application cockpit exposes functional messages, activity and documents", async ({
  page,
}) => {
  await page.goto("/#/hr/applications/APP-DEMO-001");
  await page.getByRole("tab", { name: "Messages" }).click();
  await expect(
    page.getByRole("heading", { name: "Candidate conversation" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Queue message preview" }).click();
  await expect(
    page.getByRole("button", { name: "Queued in memory" }),
  ).toBeDisabled();
  await page.getByRole("tab", { name: "Activity" }).click();
  await expect(page.getByText("Decision readiness recalculated")).toBeVisible();
  await page.getByRole("tab", { name: "Documents & forms" }).click();
  await expect(
    page.getByText("application-response-snapshot.pdf"),
  ).toBeVisible();
});

test("candidate profile controls and message preferences remain candidate scoped", async ({
  page,
}) => {
  await page.goto("/#/my-applications/APP-DEMO-001");
  await page.getByRole("tab", { name: "Profile & privacy" }).click();
  await page
    .getByLabel("Preferred channel")
    .selectOption("Support-assisted contact");
  await page.getByRole("button", { name: "Save profile in memory" }).click();
  await expect(
    page.getByText("Synthetic profile saved for this browser view."),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Messages" }).click();
  await expect(page.getByText("Current channel:")).toContainText(
    "Support-assisted contact",
  );
});

test("interviewer briefing blinds peer feedback until scorecard submission", async ({
  page,
}) => {
  await page.goto("/#/hr/assignments/ASN-DEMO-001");
  await page.getByRole("tab", { name: "Feedback visibility" }).click();
  await expect(page.getByText("Blinded until submission")).toBeVisible();
  await page.getByRole("button", { name: "Submit scorecard" }).click();
  await expect(
    page.getByText("Submitted · eligible for debrief view"),
  ).toBeVisible();
});

test("automation operator can inspect a collision and replay a failed fixture", async ({
  page,
}) => {
  await page.goto("/#/hr/automations");
  await page.getByLabel("View as demo persona").selectOption("USR-CFG-001");
  await page.getByRole("button", { name: "Run impact simulation" }).click();
  await expect(page.getByText("1collision")).toBeVisible();
  await page.getByRole("button", { name: "Preview replay" }).click();
  await expect(page.getByText("Replayed · reconciled")).toBeVisible();
});

test("offer approval creates only the allow-listed candidate offer task", async ({
  page,
}) => {
  await page.goto("/#/hr/action-center");
  await page
    .getByRole("combobox", { name: "Choose synthetic scenario" })
    .selectOption("SCN-006");
  await page.getByLabel("View as demo persona").selectOption("USR-APR-001");
  await openHrNavigation(page, "Offers & handoff");
  await page.getByRole("link", { name: /Leila H\./ }).click();
  await page.getByRole("button", { name: "Approve current offer" }).click();
  await expect(page.locator(".pill", { hasText: "Approved v4" })).toBeVisible();
  await page.getByRole("link", { name: "Candidate Site" }).click();
  await page.getByRole("link", { name: "My applications" }).click();
  await expect(
    page.getByRole("button", { name: "Review synthetic offer" }),
  ).toBeVisible();
  await expect(
    page.getByText("Offer ready for review", { exact: true }).first(),
  ).toBeVisible();
});

test("analytics portfolio filters seeded metrics and preserves provenance", async ({
  page,
}) => {
  await page.goto("/#/hr/analytics");
  await expect(
    page.getByRole("heading", { name: "Reporting & analytics", level: 1 }),
  ).toBeVisible();
  await page.getByLabel("Analytics job filter").selectOption("JOB-DEMO-003");
  await page.getByLabel("Choose analytics dashboard").selectOption("sourcing");
  await expect(
    page.getByText(
      "Which approved sources create qualified progress without becoming a ranking signal?",
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Metric definitions" }),
  ).toBeVisible();
  await expect(page.getByText("SRC-ANALYTICS-FIXTURE-v1.7")).toBeVisible();
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test("object data studio covers all logical families and data groups", async ({
  page,
}) => {
  await page.goto("/#/hr/governance");
  await page.getByLabel("View as demo persona").selectOption("USR-CFG-001");
  await page.getByRole("tab", { name: "Object & data contract" }).click();
  await expect(page.getByText("92/92").first()).toBeVisible();
  await expect(page.getByText("48/48")).toBeVisible();
  await page.getByLabel("Search object and data catalog").fill("OBJ-022");
  await page.getByRole("option", { name: /OBJ-022/ }).click();
  await expect(
    page.getByRole("heading", { name: "Application" }),
  ).toBeVisible();
  await expect(
    page.getByRole("table", { name: "Application logical data points" }),
  ).toBeVisible();
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test("object workspace executes new, detail and edit states", async ({
  page,
}) => {
  await page.goto("/#/hr/objects/requisition");
  await page.getByRole("link", { name: "New Requisition" }).click();
  await page
    .getByRole("textbox", { name: /Record name/ })
    .fill("Synthetic research requisition");
  await page.getByRole("button", { name: "Create synthetic record" }).click();
  await expect(
    page.getByRole("heading", { name: "Synthetic research requisition" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Edit permitted fields" }).click();
  await page
    .getByRole("textbox", { name: /Record name/ })
    .fill("Synthetic research lead requisition");
  await page.getByRole("button", { name: "Save permitted changes" }).click();
  await expect(
    page.getByRole("heading", { name: "Synthetic research lead requisition" }),
  ).toBeVisible();
});

test("report workspace exposes governed builder and delivery evidence", async ({
  page,
}) => {
  await page.goto("/#/hr/reports");
  await expect(
    page.getByRole("heading", { name: "Saved report catalog" }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Builder" }).click();
  await expect(
    page.getByRole("table", { name: "Applications by stage preview" }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Delivery audit" }).click();
  await expect(page.getByText("Recipient denied")).toBeVisible();
});

test("data readiness uses its own reconciled object filters", async ({
  page,
}) => {
  await page.goto("/#/hr/analytics");
  await page.getByLabel("View as demo persona").selectOption("USR-CFG-001");
  await page
    .getByLabel("Choose analytics dashboard")
    .selectOption("data-readiness");
  await expect(
    page.getByRole("region", { name: "Global analytics filters" }),
  ).toHaveCount(0);
  await page
    .getByLabel("Data readiness domain filter")
    .selectOption("Candidate, identity and application");
  await expect(page.locator(".analytics-result-count")).toContainText(
    "object families",
  );
  await expect(
    page.getByRole("table", { name: "Filtered object readiness detail" }),
  ).toContainText("Candidate");
});

test("recruiter creates separate job, candidate and application records", async ({
  page,
}) => {
  await page.goto("/#/hr/jobs/new");
  await page.getByLabel("Job title").fill("Synthetic Reliability Lead");
  await page.getByLabel("Team").fill("Platform Reliability");
  await page.getByLabel("Job location").fill("United States · Remote");
  await page.getByRole("button", { name: "Create draft requisition" }).click();
  await expect(page.getByText("Draft", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/JOB-MEM-001/).first()).toBeVisible();

  await openHrNavigation(page, "Candidates");
  await page.getByRole("link", { name: "New candidate identity" }).click();
  await page.getByLabel("Candidate full name").fill("Synthetic Flow Person");
  await page
    .getByLabel("Candidate synthetic email")
    .fill("synthetic.flow.person@example.test");
  await page.getByRole("button", { name: "Create candidate identity" }).click();
  await expect(page.getByText("No role-visible applications")).toBeVisible();
  await page.getByRole("link", { name: "Create application" }).click();
  await page.getByLabel("Application candidate").selectOption("PER-MEM-001");
  await page.getByLabel("Application job").selectOption("JOB-MEM-001");
  await page.getByRole("button", { name: "Create application" }).click();
  await expect(page.getByText(/APP-MEM-001/).first()).toBeVisible();
  await expect(page.getByText(/Synthetic Reliability Lead · Recruiter review/)).toBeVisible();
});

test("heavy candidate list remains searchable and contained on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/hr/candidates");
  await expect(page.getByText("Page 1 of 16 · 20 rows shown")).toBeVisible();
  await page.getByRole("textbox", { name: "Search candidates" }).fill("PER-SEED-315");
  await expect(page.getByText(/PER-SEED-315/)).toBeVisible();
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test("persona mutation permissions deny candidate creation safely", async ({
  page,
}) => {
  await page.goto("/#/hr/candidates/new");
  await page.getByLabel("View as demo persona").selectOption("USR-COO-001");
  await expect(
    page.getByRole("heading", { name: "Mutation is not permitted" }),
  ).toBeVisible();
  await expect(page.getByLabel("Candidate full name")).toHaveCount(0);
});
