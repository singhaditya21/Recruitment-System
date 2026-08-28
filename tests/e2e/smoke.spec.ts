import { expect, test, type Page } from "@playwright/test";

async function openHrNavigation(page: Page, name: string) {
  const toggle = page.getByRole("button", { name: "Toggle navigation" });
  if (await toggle.isVisible()) await toggle.click();
  await page.getByRole("link", { name, exact: true }).click();
}

test("candidate can complete the synthetic application journey", async ({ page }) => {
  await page.goto("/#/careers");
  await expect(page.getByRole("heading", { name: /Meaningful work/ })).toBeVisible();
  await page.getByRole("link", { name: "Senior Product Designer", exact: true }).click();
  await page.getByRole("link", { name: /Start demo application/ }).click();
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /Continue/ }).click();
  await page.getByRole("button", { name: /Simulate submission/ }).click();
  await expect(page.getByRole("heading", { name: "Demo application complete" })).toBeVisible();
  await expect(page.getByText("No application was created")).toBeVisible();
});

test("HR user can inspect a blocked transition without executing it", async ({ page }) => {
  await page.goto("/#/hr/applications/APP-DEMO-001");
  await page.getByRole("button", { name: "Review transition" }).click();
  const dialog = page.getByRole("dialog", { name: "Move Interviews → Debrief?" });
  await expect(dialog.getByText("1 required scorecard missing")).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Transition blocked" })).toBeDisabled();
});

test("candidate careers reflows at a small viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/careers");
  await expect(page.getByRole("heading", { name: /Meaningful work/ })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Candidate navigation" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Search jobs" })).toBeVisible();
});

test("HR console keeps the Lightning shell and seeded records contained", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/hr/action-center");
  await expect(page.getByRole("heading", { name: "Good morning, Alex" })).toBeVisible();
  await expect(page.getByRole("table", { name: "Recently updated applications" })).toContainText("APP-DEMO-011");
  await expect(page.getByLabel("View as demo persona")).toHaveValue("USR-REC-001");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("route-bound search opens the requested application record", async ({ page }) => {
  await page.goto("/#/hr/action-center");
  await page.getByRole("textbox", { name: "Search synthetic recruitment workspace" }).fill("Noah");
  await page.getByRole("option", { name: /Noah Williams · APP-DEMO-004/ }).click();
  await expect(page.getByRole("heading", { name: "Noah Williams", level: 1 })).toBeVisible();
  await expect(page.getByText(/Recruiting Operations Partner · Scheduling/)).toBeVisible();
});

test("scorecard completion recalculates the shared application state", async ({ page }) => {
  await page.goto("/#/hr/assignments/ASN-DEMO-001");
  await page.getByRole("button", { name: "Submit scorecard" }).click();
  await openHrNavigation(page, "Applications");
  await page.getByRole("link", { name: /Maya Chen/ }).click();
  await expect(page.getByText("Scorecards complete")).toBeVisible();
  await expect(page.locator(".stage-timeline li.current")).toContainText("Debrief");
});

test("persona scope persists and changes the available workspace", async ({ page }) => {
  await page.goto("/#/hr/action-center");
  await page.getByLabel("View as demo persona").selectOption("USR-INT-001");
  await openHrNavigation(page, "Scorecards");
  await expect(page.getByLabel("View as demo persona")).toHaveValue("USR-INT-001");
  await expect(page.getByRole("heading", { name: "Scorecards", level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Governance" })).toHaveCount(0);
});

test("candidate availability remains safe and recoverable", async ({ page }) => {
  await page.goto("/#/my-applications/APP-DEMO-001");
  await page.getByRole("combobox", { name: "Choose synthetic scenario" }).selectOption("SCN-004");
  await expect(page.getByText(/Interview conflict/i)).toHaveCount(0);
  await page.getByRole("button", { name: "Share demo availability" }).click();
  await page.getByRole("button", { name: "Save availability in demo" }).click();
  await expect(page.getByText("Availability shared · demo")).toBeVisible();
  await page.evaluate(() => { window.location.hash = "#/hr/interviews/INT-DEMO-004"; });
  await expect(page.getByText("Submitted candidate availability is ready for coordination.")).toBeVisible();
});

test("application cockpit exposes functional messages, activity and documents", async ({ page }) => {
  await page.goto("/#/hr/applications/APP-DEMO-001");
  await page.getByRole("tab", { name: "Messages" }).click();
  await expect(page.getByRole("heading", { name: "Candidate conversation" })).toBeVisible();
  await page.getByRole("button", { name: "Queue message preview" }).click();
  await expect(page.getByRole("button", { name: "Queued in memory" })).toBeDisabled();
  await page.getByRole("tab", { name: "Activity" }).click();
  await expect(page.getByText("Decision readiness recalculated")).toBeVisible();
  await page.getByRole("tab", { name: "Documents & forms" }).click();
  await expect(page.getByText("application-response-snapshot.pdf")).toBeVisible();
});

test("candidate profile controls and message preferences remain candidate scoped", async ({ page }) => {
  await page.goto("/#/my-applications/APP-DEMO-001");
  await page.getByRole("tab", { name: "Profile & privacy" }).click();
  await page.getByLabel("Preferred channel").selectOption("Support-assisted contact");
  await page.getByRole("button", { name: "Save profile in memory" }).click();
  await expect(page.getByText("Synthetic profile saved for this browser view.")).toBeVisible();
  await page.getByRole("tab", { name: "Messages" }).click();
  await expect(page.getByText("Current channel:")).toContainText("Support-assisted contact");
});

test("interviewer briefing blinds peer feedback until scorecard submission", async ({ page }) => {
  await page.goto("/#/hr/assignments/ASN-DEMO-001");
  await page.getByRole("tab", { name: "Feedback visibility" }).click();
  await expect(page.getByText("Blinded until submission")).toBeVisible();
  await page.getByRole("button", { name: "Submit scorecard" }).click();
  await expect(page.getByText("Submitted · eligible for debrief view")).toBeVisible();
});

test("automation operator can inspect a collision and replay a failed fixture", async ({ page }) => {
  await page.goto("/#/hr/automations");
  await page.getByLabel("View as demo persona").selectOption("USR-CFG-001");
  await page.getByRole("button", { name: "Run impact simulation" }).click();
  await expect(page.getByText("1collision")).toBeVisible();
  await page.getByRole("button", { name: "Preview replay" }).click();
  await expect(page.getByText("Replayed · reconciled")).toBeVisible();
});

test("offer approval creates only the allow-listed candidate offer task", async ({ page }) => {
  await page.goto("/#/hr/action-center");
  await page.getByRole("combobox", { name: "Choose synthetic scenario" }).selectOption("SCN-006");
  await openHrNavigation(page, "Offers & handoff");
  await page.getByRole("link", { name: /Leila Haddad/ }).click();
  await page.getByRole("button", { name: "Approve current offer" }).click();
  await expect(page.locator(".pill", { hasText: "Approved v4" })).toBeVisible();
  await page.getByRole("link", { name: "Candidate Site" }).click();
  await page.getByRole("link", { name: "My applications" }).click();
  await expect(page.getByRole("button", { name: "Review synthetic offer" })).toBeVisible();
  await expect(page.getByText("Offer ready for review", { exact: true }).first()).toBeVisible();
});
