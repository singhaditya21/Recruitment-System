import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const artifactDir = new URL("../artifacts/v0.9/", import.meta.url);

async function json(name) {
  return JSON.parse(await readFile(new URL(name, artifactDir), "utf8"));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertSeries(items, prefix, count) {
  const actual = items.map(({ id }) => id).sort();
  const expected = Array.from(
    { length: count },
    (_, index) => `${prefix}-${String(index + 1).padStart(3, "0")}`,
  );
  assert(
    JSON.stringify(actual) === JSON.stringify(expected),
    `${prefix} IDs are not contiguous: ${actual.join(", ")}`,
  );
}

async function sourceFiles(directory) {
  if (directory instanceof URL) directory = fileURLToPath(directory);
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await sourceFiles(path)));
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(path);
  }
  return files;
}

const [
  routes,
  transitions,
  automations,
  interfaces,
  scenarios,
  traceability,
  tests,
  content,
  registry,
  findings,
] = await Promise.all([
  json("routes.json"),
  json("transitions.json"),
  json("automations.json"),
  json("interfaces.json"),
  json("scenarios.json"),
  json("traceability.json"),
  json("test-catalog.json"),
  json("content-accessibility.json"),
  json("invariants-errors.json"),
  json("audit-findings.json"),
]);
const v17 = JSON.parse(
  await readFile(
    new URL("../artifacts/v1.7/readiness.json", import.meta.url),
    "utf8",
  ),
);
const v17Routes = JSON.parse(
  await readFile(
    new URL("../artifacts/v1.7/routes.json", import.meta.url),
    "utf8",
  ),
);
const v17Trace = JSON.parse(
  await readFile(
    new URL("../artifacts/v1.7/traceability.json", import.meta.url),
    "utf8",
  ),
);

assertSeries(
  routes.routes.filter(({ id }) => id.startsWith("UI-CAN")),
  "UI-CAN",
  4,
);
assertSeries(
  routes.routes.filter(({ id }) => id.startsWith("UI-HR")),
  "UI-HR",
  8,
);
assertSeries(transitions.transitions, "TRN", 15);
assertSeries(automations.rules, "AUT", 15);
assertSeries(interfaces.operations, "IFC", 15);
assertSeries(scenarios.scenarios, "SCN", 12);
assertSeries(registry.invariants, "INV", 15);
assertSeries(registry.errors, "ERR", 10);
assertSeries(findings.findings, "AUD", 18);

const routeIds = new Set(routes.routes.map(({ id }) => id));
const traceIds = new Set(traceability.rows.map(({ screenId }) => screenId));
const accessibilityIds = new Set(content.screens.map(({ id }) => id));
assert(
  routeIds.size === 12,
  "Expected 12 unique canonical screen-family contracts",
);
assert(
  [...routeIds].every((id) => traceIds.has(id)),
  "Every route must have an ART-001 trace row",
);
assert(
  [...routeIds].every((id) => accessibilityIds.has(id)),
  "Every route must have an ART-021 row",
);

const scenarioIds = new Set(scenarios.scenarios.map(({ id }) => id));
for (const route of routes.routes) {
  assert(
    route.requirements.length > 0,
    `${route.id} has no requirement mapping`,
  );
  assert(
    route.states.length >= 4,
    `${route.id} needs at least four visible state contracts`,
  );
  assert(
    route.scenarioIds.every((id) => scenarioIds.has(id)),
    `${route.id} references an unknown scenario`,
  );
}

const testIds = new Set(tests.tests.map(({ id }) => id));
for (const row of traceability.rows) {
  assert(
    row.tests.every((id) => testIds.has(id)),
    `${row.screenId} references an unknown test`,
  );
  assert(
    row.fixtures.every((id) => scenarioIds.has(id)),
    `${row.screenId} references an unknown fixture`,
  );
}

assert(
  interfaces.operations.every(
    ({ writes, prototype }) =>
      writes === false &&
      [
        "fixture-read",
        "memory-only",
        "simulation-only",
        "disabled-stub",
      ].includes(prototype),
  ),
  "Prototype interfaces must be non-writing local stubs",
);
assert(
  scenarios.syntheticOnly === true,
  "Fixture pack must declare syntheticOnly",
);
assert(
  tests.tests
    .filter(({ runner }) => runner === "human")
    .every(({ status }) => status === "not-run"),
  "Human evidence must not be claimed before it exists",
);
assert(
  content.manualAssistiveTechnologyStatus === "not-run",
  "Manual assistive-technology evidence must remain honest",
);
assert(
  findings.findings.every(({ status }) => status === "Open"),
  "No finding can close without accountable dated review",
);
assert(
  v17.syntheticContract.objectFamilies === 92,
  "v1.7 requires 92 logical object families",
);
assert(
  v17Routes.screenFamilies.length === 14 &&
    v17Routes.functionalPatternCount === 24,
  "v1.7 screen and route counts must reconcile",
);
assert(
  v17Trace.rows.length === 14 &&
    v17Trace.rows.every(({ screenId }) =>
      v17Routes.screenFamilies.some(({ id }) => id === screenId),
    ),
  "Every v1.7 screen family requires a current trace row",
);
assert(
  v17.syntheticContract.routedObjectPages === 368,
  "v1.7 requires four routed pages for every object family",
);
assert(
  v17.syntheticContract.businessFields +
    v17.syntheticContract.governanceFields ===
    v17.syntheticContract.logicalFields,
  "v1.7 field composition must reconcile",
);
assert(
  v17.syntheticContract.testedFilterCombinations === 600 &&
    v17.syntheticContract.emptyFilterCombinations === 0,
  "v1.7 supported filter matrix must be fully populated",
);
assert(
  v17.formalFindings.open === 18 && v17.production.pilot === "blocked",
  "v1.7 must preserve formal finding and pilot gates",
);

const sourcePaths = await sourceFiles(new URL("../src/", import.meta.url));
const source = (
  await Promise.all(sourcePaths.map((path) => readFile(path, "utf8")))
).join("\n");
const forbiddenRuntimePatterns = [
  [/(?<![A-Za-z])fetch\s*\(/, "fetch call"],
  [/XMLHttpRequest/, "XMLHttpRequest"],
  [/new\s+WebSocket/, "WebSocket"],
  [/localStorage\s*\./, "localStorage write/read"],
  [/sessionStorage\s*\./, "sessionStorage write/read"],
  [/@(gmail|yahoo|outlook|hotmail)\./i, "real email domain"],
];
for (const [pattern, label] of forbiddenRuntimePatterns)
  assert(
    !pattern.test(source),
    `Forbidden prototype capability found: ${label}`,
  );
assert(
  source.includes("example.test"),
  "Synthetic contact values must use the reserved .test domain",
);
assert(
  source.includes("No real jobs"),
  "A persistent synthetic-data notice is required",
);
assert(
  source.includes("/hr/analytics"),
  "The v1.6 analytics route must be present",
);
assert(
  source.includes("dashboardCatalog"),
  "The v1.6 dashboard catalogue must be present",
);
assert(
  source.includes("objectCatalog"),
  "The v1.6 logical object catalogue must be present",
);
assert(
  source.includes("/hr/reports"),
  "The v1.7 reporting route must be present",
);
assert(
  source.includes("/hr/objects"),
  "The v1.7 object workspace route must be present",
);
assert(
  source.includes("SRC-ANALYTICS-FIXTURE-v1.7"),
  "The v1.7 analytics source contract must be present",
);

console.log(
  "Artifact audit passed: 12 inherited executable route artifacts, 14 current screen families, 12 scenarios, 15 transitions, 15 automations, 15 interfaces, 15 invariants, 10 error classes, 18 formally open controlled findings, and the v1.7 92-object/368-page/1,472-field/600-filter contract.",
);
