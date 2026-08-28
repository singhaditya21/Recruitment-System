import { expect, test, type Page } from "@playwright/test";

const routeSamples = [
  "/sign-in", "/sign-in/magic-link", "/account-recovery", "/job-alerts/new", "/job-alerts/JAL-001", "/my-tasks/CTK-001", "/my-tasks/CTK-004", "/events/EVT-DEMO-001/ticket", "/support", "/privacy-requests",
  "/preboarding/benefits", "/preboarding/benefits/BEN-DEMO-001", "/preboarding/learning", "/preboarding/learning/LRN-DEMO-001", "/preboarding/country/LOC-001",
  "/hr/events", "/hr/events/REV-DEMO-001", "/hr/high-volume/HVC-001", "/hr/high-volume/HVC-001/planning", "/hr/high-volume/HVC-001/analytics", "/hr/high-volume/HVC-001/cohorts/COH-DEMO-001", "/hr/locales/LOC-001", "/hr/recovery/RCV-DEMO-001", "/hr/agency-assignments", "/hr/agency-assignments/AGA-DEMO-001", "/hr/transitions", "/hr/transitions/TRN-DEMO-001/impact",
  "/referrer", "/facilities", "/manager/recruiting", "/interviewer", "/buddy", "/mobility", "/agency/assignments",
  "/admin", "/admin/users", "/admin/notifications", "/admin/content", "/admin/integrations", "/admin/imports", "/admin/identity", "/admin/privacy-requests",
];

async function setPersona(page: Page, id: string) {
  const selector = page.getByLabel("View as demo persona");
  if (await selector.isVisible()) await selector.selectOption(id);
}

test("v3.0 route families render without redirect or browser error", async ({ page }) => {
  const browserErrors: string[] = [];
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") browserErrors.push(message.text()); });
  for (const route of routeSamples) {
    await page.goto(`/#${route}`, { waitUntil: "domcontentloaded" });
    await expect(page.locator("main#main-content")).toBeVisible();
    expect(new URL(page.url()).hash.slice(1)).toBe(route);
  }
  expect(browserErrors).toEqual([]);
});

test("candidate links retain semantic destinations and stale IDs fail safely", async ({ page }) => {
  await page.goto("/#/saved-jobs");
  const saved = page.locator(".saved-job-list a[href*='/careers/jobs/']");
  await expect(saved).toHaveCount(3);
  const targets = await saved.evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  expect(targets).toEqual(expect.arrayContaining(["#/careers/jobs/product-designer-remote-demo", "#/careers/jobs/data-platform-demo", "#/careers/jobs/recruiting-operations-demo"]));
  for (const target of targets) {
    await page.goto(`/${target}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Job unavailable" })).toHaveCount(0);
  }
  await page.goto("/#/careers/jobs/not-a-job");
  await expect(page.getByRole("heading", { name: "Job unavailable" })).toBeVisible();
  await page.goto("/#/apply/not-a-job/profile");
  await expect(page.getByRole("heading", { name: "Application link unavailable" })).toBeVisible();
});

test("candidate access, assessment and support actions produce visible state", async ({ page }) => {
  await page.goto("/#/sign-in");
  await page.getByRole("button", { name: "Send secure sign-in link" }).click();
  await page.getByRole("link", { name: "Open prepared magic link" }).click();
  await page.getByRole("checkbox", { name: /synthetic sign-in request/i }).check();
  await page.getByRole("button", { name: "Verify sign-in" }).click();
  await expect(page.getByText("Identity fixture verified")).toBeVisible();

  await page.goto("/#/my-tasks/CTK-004");
  await page.getByRole("button", { name: "Review notice and rights" }).click();
  await expect(page.getByText(/hiring decision remains paused/i)).toBeVisible();
  await page.getByRole("checkbox", { name: /reviewed the current notice/i }).check();
  await page.getByRole("button", { name: "Submit correction or dispute" }).click();
  await expect(page.getByText("Correction response submitted")).toBeVisible();

  await page.goto("/#/support/new?topic=Accessibility");
  await page.getByRole("button", { name: "Create private request" }).click();
  await expect(page.getByText("Support case SUP-MEM-001 created")).toBeVisible();
});

test("platform admin can test integration and prepare governed corrections", async ({ page }) => {
  await page.goto("/#/admin/integrations/ICG-DEMO-001");
  await setPersona(page, "USR-ADM-001");
  await page.getByRole("button", { name: "Test configuration" }).click();
  await expect(page.getByRole("button", { name: "Test passed" })).toBeVisible();
  await page.getByRole("link", { name: "Field mapping" }).click();
  await page.getByRole("button", { name: "Save inactive draft" }).click();
  await expect(page.getByText("Mapping draft saved", { exact: true })).toBeVisible();

  await page.goto("/#/admin/imports/IMP-DEMO-001/correct");
  await setPersona(page, "USR-ADM-001");
  await page.getByRole("button", { name: "Revalidate prepared corrections" }).click();
  await expect(page.getByRole("button", { name: /Validation passed/ })).toBeVisible();
});

test("keyboard skip action focuses the main region", async ({ page }) => {
  await page.goto("/#/careers");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main#main-content")).toBeFocused();
});

test("representative v3 surfaces reflow without horizontal page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  for (const route of ["/sign-in", "/my-tasks/CTK-004", "/preboarding/benefits", "/referrer", "/facilities", "/admin"]) {
    await page.goto(`/#${route}`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, route).toBeLessThanOrEqual(1);
  }
});

test("all rendered internal link destinations resolve without silent fallback", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chromium", "Exhaustive crawl runs once on desktop Chromium.");
  const roots = [
    "/careers", "/saved-jobs", "/job-alerts", "/events", "/my-applications", "/my-tasks", "/support", "/privacy-requests", "/preboarding",
    "/hr/action-center", "/hr/cases", "/hr/high-volume", "/hr/events", "/hr/locales", "/hr/recovery", "/hr/agency-assignments", "/hr/transitions",
    "/manager", "/manager/recruiting", "/it", "/facilities", "/agency", "/referrer", "/interviewer", "/buddy", "/mobility",
    "/admin", "/admin/users", "/admin/access-requests", "/admin/notifications", "/admin/content", "/admin/integrations", "/admin/imports", "/admin/identity", "/admin/privacy-requests",
  ];
  const queue = [...roots];
  const queued = new Set(queue);
  const visited = new Set<string>();
  const defects: { route: string; final?: string; error?: string }[] = [];
  const browserErrors: string[] = [];
  let activeRoute = "";
  page.on("pageerror", (error) => browserErrors.push(`${activeRoute}: ${error.message}`));
  page.on("console", (message) => { if (message.type() === "error") browserErrors.push(`${activeRoute}: ${message.text()}`); });
  while (queue.length) {
    const route = queue.shift()!;
    if (visited.has(route)) continue;
    visited.add(route);
    activeRoute = route;
    await page.goto(`/#${route}`, { waitUntil: "domcontentloaded" });
    if (route.startsWith("/admin")) await setPersona(page, "USR-ADM-001");
    const final = new URL(page.url()).hash.slice(1);
    if (final !== route) defects.push({ route, final });
    if (!(await page.locator("main#main-content").count())) defects.push({ route, error: "missing main destination" });
    const hrefs = await page.locator("a[href]").evaluateAll((links) => links.map((link) => link.getAttribute("href")).filter(Boolean) as string[]);
    for (const href of hrefs) {
      if (!href.startsWith("#/")) continue;
      const destination = href.slice(1);
      if (!queued.has(destination) && !visited.has(destination)) { queued.add(destination); queue.push(destination); }
    }
    if (visited.size > 2500) throw new Error("Link crawl exceeded bounded route inventory");
  }
  console.log(JSON.stringify({ visitedRoutes: visited.size, discoveredDestinations: queued.size, defects: defects.length, browserErrors: browserErrors.length }));
  expect(visited.size).toBeGreaterThanOrEqual(1000);
  expect(defects).toEqual([]);
  expect(browserErrors).toEqual([]);
});
