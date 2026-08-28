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
const v18 = JSON.parse(
  await readFile(
    new URL("../artifacts/v1.8/readiness.json", import.meta.url),
    "utf8",
  ),
);
const v18Routes = JSON.parse(
  await readFile(
    new URL("../artifacts/v1.8/routes.json", import.meta.url),
    "utf8",
  ),
);
const v18Trace = JSON.parse(
  await readFile(
    new URL("../artifacts/v1.8/traceability.json", import.meta.url),
    "utf8",
  ),
);
const v19 = JSON.parse(
  await readFile(
    new URL("../artifacts/v1.9/readiness.json", import.meta.url),
    "utf8",
  ),
);
const v19Model = JSON.parse(
  await readFile(
    new URL("../artifacts/v1.9/data-model.json", import.meta.url),
    "utf8",
  ),
);
const v20 = JSON.parse(
  await readFile(
    new URL("../artifacts/v2.0/readiness.json", import.meta.url),
    "utf8",
  ),
);
const v20Routes = JSON.parse(
  await readFile(
    new URL("../artifacts/v2.0/routes.json", import.meta.url),
    "utf8",
  ),
);
const v20Model = JSON.parse(
  await readFile(
    new URL("../artifacts/v2.0/data-model-extension.json", import.meta.url),
    "utf8",
  ),
);
const v21 = JSON.parse(
  await readFile(
    new URL("../artifacts/v2.1/readiness.json", import.meta.url),
    "utf8",
  ),
);
const v21Routes = JSON.parse(
  await readFile(
    new URL("../artifacts/v2.1/routes.json", import.meta.url),
    "utf8",
  ),
);
const v22 = JSON.parse(
  await readFile(
    new URL("../artifacts/v2.2/readiness.json", import.meta.url),
    "utf8",
  ),
);
const v22Routes = JSON.parse(
  await readFile(
    new URL("../artifacts/v2.2/routes.json", import.meta.url),
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
assert(
  v18Routes.screenFamilies.length === 14 &&
    v18Routes.functionalPatternCount === 29 &&
    v18Trace.rows.length === 14,
  "v1.8 screen, route and trace counts must reconcile",
);
assert(
  v18.syntheticContract.seededObjectRecords === 1104 &&
    v18.syntheticContract.seededCoreRecords === 1360 &&
    v18.syntheticContract.seededCorePlusGenericRecords === 2464,
  "v1.8 dense seed counts must reconcile",
);
assert(
  v18.syntheticContract.seededJobs === 48 &&
    v18.syntheticContract.seededCandidates === 320 &&
    v18.syntheticContract.seededApplications === 640 &&
    v18.syntheticContract.seededInterviews === 192 &&
    v18.syntheticContract.seededAssignments === 160,
  "v1.8 core seed families must reconcile",
);
assert(
  v18Trace.rows.every(({ screenId }) =>
    v18Routes.screenFamilies.some(({ id }) => id === screenId),
  ),
  "Every v1.8 screen family requires a current trace row",
);
assert(
  v18.formalFindings.open === 18 && v18.production.pilot === "blocked",
  "v1.8 must preserve formal finding and pilot gates",
);
assert(
  v19.version === "1.9.0" && v19.syntheticOnly === true,
  "v1.9 must identify the canonical contract as synthetic-only",
);
assert(
  v19.counts.navigationFamilies === 92 &&
    v19.counts.inheritedAtomicConcepts === 111 &&
    v19.counts.supportingConcepts === 18 &&
    v19.counts.atomicConcepts === 129,
  "v1.9 navigation, inherited and supporting concept counts must reconcile",
);
assert(
  v19.counts.atomicFields === 2350 &&
    v19.counts.businessFields === 673 &&
    v19.counts.governanceFields === 1677 &&
    v19.counts.businessFields + v19.counts.governanceFields ===
      v19.counts.atomicFields,
  "v1.9 atomic field composition must reconcile",
);
assert(
  v19.counts.relationships === 173 &&
    v19.counts.invariants === 15 &&
    v19.counts.transitions === 675 &&
    v19.counts.domainEvents === 13 &&
    v19.counts.humanRolePolicies === 13 &&
    v19.counts.analyticsContracts === 12 &&
    v19.counts.referenceDatasets === 12 &&
    v19.counts.dataQualityRules === 15,
  "v1.9 relationship, lifecycle, event, access, analytical and quality counts must reconcile",
);
assert(
  v19.runtime.canonicalRequisitions === 48 &&
    v19.runtime.canonicalCandidates === 320 &&
    v19.runtime.candidateIdentifiers === 640 &&
    v19.runtime.consentRecords === 320 &&
    v19.runtime.canonicalApplications === 640 &&
    v19.runtime.applicationStageEvents === 640 &&
    v19.runtime.workItems === 640 &&
    v19.runtime.interviewSessions === 192 &&
    v19.runtime.interviewerAssignments === 160 &&
    v19.runtime.analyticsRowsWithCanonicalLineage === 324 &&
    v19.runtime.supportedFilterCombinations === 600 &&
    v19.runtime.emptyFilterCombinations === 0,
  "v1.9 canonical runtime and analytics lineage counts must reconcile",
);
assert(
  v19.counts.physicalSalesforceObjectsApproved === 0 &&
    v19Model.physicalDisposition.approvedObjectCount === 0 &&
    v19.production.physicalSchemaApproved === false &&
    v19.production.pilot === "blocked",
  "v1.9 must not claim an approved physical schema or pilot",
);
assert(
  v19Model.authoritativeSources.includes(
    "src/data/canonicalDataModel.ts",
  ) &&
    v19Model.authoritativeSources.includes("src/data/canonicalRuntime.ts") &&
    v19Model.acceptanceEvidence.includes("src/test/dataModel.test.ts"),
  "v1.9 must identify its executable model, runtime and acceptance evidence",
);
assert(
  v20.version === "2.0.0" && v20.syntheticOnly === true,
  "v2.0 must identify the full-lifecycle wireframe as synthetic-only",
);
assert(
  v20.counts.personas === 13 &&
    v20.counts.screenContracts === 24 &&
    v20.counts.routeDeclarations === 49 &&
    v20.counts.functionalDestinations === 47 &&
    v20Routes.screenContracts.length === 24 &&
    v20Routes.routeDeclarationCount === 49,
  "v2.0 persona, screen and route counts must reconcile",
);
assert(
  v20.counts.coreAtomicConcepts === 129 &&
    v20.counts.lifecycleExtensionObjects === 46 &&
    v20.counts.combinedLogicalConcepts === 175 &&
    v20.counts.extensionKeyDataPoints === 186 &&
    v20.counts.extensionLifecycleStates === 238 &&
    v20Model.extension.objects === 46 &&
    v20Model.extension.objectNames.length === 46,
  "v2.0 lifecycle extension counts must reconcile",
);
assert(
  v20.seededWireframe.newHires === 36 &&
    v20.seededWireframe.onboardingTemplates === 8 &&
    v20.seededWireframe.onboardingExceptions === 18 &&
    v20.seededWireframe.provisioningRequests === 72 &&
    v20.seededWireframe.talentProspects === 120 &&
    v20.seededWireframe.jobDistributions === 24,
  "v2.0 onboarding and talent seed counts must reconcile",
);
assert(
  v20.counts.physicalObjectsApproved === 0 &&
    v20Model.physicalDisposition.approvedObjectCount === 0 &&
    v20.production.authentication === "not implemented" &&
    v20.production.pilot === "blocked",
  "v2.0 must preserve the physical, identity and pilot production gates",
);
assert(
  v21.version === "2.1.0" && v21.syntheticOnly === true,
  "v2.1 must identify the surface-complete wireframe as synthetic-only",
);
assert(
  v21.counts.personas === 13 &&
    v21.counts.screenContracts === 25 &&
    v21.counts.routeDeclarations === 53 &&
    v21.counts.functionalDestinations === 51 &&
    v21Routes.screenContracts.length === 25 &&
    v21Routes.routeDeclarationCount === 53,
  "v2.1 persona, screen and route counts must reconcile",
);
assert(
  v21.counts.coreNavigationFamilies === 92 &&
    v21.counts.lifecycleExtensionFamilies === 46 &&
    v21.counts.combinedRoutedObjectFamilies === 138 &&
    v21.counts.routedObjectPageInstances === 552 &&
    v21.counts.seededObjectRecords === 1656 &&
    v21.counts.workspaceFieldContracts === 2208,
  "v2.1 core plus lifecycle object-page coverage must reconcile",
);
assert(
  v21.seededWireframe.lifecyclePrograms === 8 &&
    v21.seededWireframe.complianceCases === 24 &&
    v21.seededWireframe.orientationSessions === 16 &&
    v21.seededWireframe.onboardingCheckIns === 48 &&
    v21.seededWireframe.careerEvents === 12 &&
    v21.seededWireframe.referrals === 24 &&
    v21.seededWireframe.agencyPartners === 8,
  "v2.1 program, onboarding-experience and talent-channel seeds must reconcile",
);
assert(
  v21.counts.physicalObjectsApproved === 0 &&
    v21.production.authentication === "not implemented" &&
    v21.production.pilot === "blocked",
  "v2.1 must preserve the physical, identity and pilot production gates",
);
assert(
  v22.version === "2.2.0" && v22.syntheticOnly === true,
  "v2.2 must identify the deep-journey wireframe as synthetic-only",
);
assert(
  v22.counts.personas === 13 &&
    v22.counts.screenContracts === 32 &&
    v22.counts.routeDeclarations === 71 &&
    v22.counts.functionalDestinations === 69 &&
    v22Routes.screenContracts.length === 32 &&
    v22Routes.routeDeclarationCount === 71 &&
    v22Routes.functionalDestinationCount === 69,
  "v2.2 persona, screen and route counts must reconcile",
);
assert(
  v22.counts.routedObjectFamilies === 138 &&
    v22.counts.routedObjectPageInstances === 552 &&
    v22.counts.seededObjectRecords === 1656 &&
    v22.counts.workspaceFieldContracts === 2208 &&
    v22.counts.physicalObjectsApproved === 0,
  "v2.2 must preserve the reconciled object and physical-schema boundaries",
);
assert(
  v22.deepJourneySeeds.candidateTasks === 6 &&
    v22.deepJourneySeeds.screeningCases === 32 &&
    v22.deepJourneySeeds.eventRegistrations === 36 &&
    v22.deepJourneySeeds.referralRewards === 24 &&
    v22.deepJourneySeeds.agencySubmissions === 32 &&
    v22.deepJourneySeeds.highVolumeCampaigns === 8 &&
    v22.deepJourneySeeds.localeVariants === 12 &&
    v22.deepJourneySeeds.recoveryScenarios === 24,
  "v2.2 deep-journey seed counts must reconcile",
);
assert(
  v22.production.authentication === "not implemented" &&
    v22.production.serverAuthorization === "not implemented" &&
    v22.production.persistence === "browser memory only" &&
    v22.production.pilot === "blocked",
  "v2.2 must retain every production identity, persistence and pilot gate",
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
  source.includes("/hr/candidates") &&
    source.includes("createCandidate") &&
    source.includes("createApplication") &&
    source.includes("createJob"),
  "The v1.8 core routes and mutation contracts must be present",
);
assert(
  source.includes("SRC-ANALYTICS-CANONICAL-v1.9") &&
    source.includes("SRC-CANONICAL-DATA-MODEL-v1.9"),
  "The v1.9 canonical analytics and data-readiness source contracts must be present",
);
assert(
  source.includes("canonicalDataModelSummary") &&
    source.includes("seededCanonicalCoreStore") &&
    source.includes("canReadObjectRecord") &&
    source.includes("sourceEventId") &&
    source.includes("aggregateVersion"),
  "The v1.9 canonical model, runtime, relationship access and event lineage must be present",
);
assert(
  source.includes("v2.2 deep lifecycle wireframe") &&
    source.includes("lifecycleObjectContracts") &&
    source.includes("newHireRecords") &&
    source.includes("talentCampaigns") &&
    source.includes("screeningCases") &&
    source.includes("agencySubmissions") &&
    source.includes("recoveryScenarios"),
  "The v2.2 release marker and deep-journey contracts must be visible in the wireframe",
);
const appSource = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");
assert(
  (appSource.match(/<Route\b/g) ?? []).length === 71,
  "The executable v2.2 route declaration count must remain 71",
);

console.log(
  "Artifact audit passed: v2.2 exposes 32 screen contracts and 71 routes across deep candidate, regulated-case, high-volume, localized, recovery and role-portal journeys while preserving zero production connections or approved physical objects.",
);
