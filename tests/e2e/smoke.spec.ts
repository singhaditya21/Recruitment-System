import { expect, test } from "@playwright/test";

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
