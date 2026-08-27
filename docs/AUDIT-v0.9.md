# Recruitment System v0.9 — Executable Artifact and Synthetic Prototype Audit

**Audit date:** August 25, 2026
**Audited release:** `0.9.0`
**Repository:** `singhaditya21/Recruitment-System`
**Scope:** executable product artifacts and public synthetic prototype only
**Prior baseline:** [v0.8 Full Product and Delivery Audit](AUDIT-v0.8.md)

## 1. Executive verdict

v0.9 converts the repository from a documentation-only baseline into a reproducible React/TypeScript/Vite synthetic prototype with deterministic fixture contracts, automated tests, browser smoke coverage, CI and GitHub Pages configuration.

The implemented prototype covers all 12 `UI-*` screen contracts and all 12 `SCN-*` scenarios across candidate and HR surfaces. Its machine-readable layer contains all 15 `TRN-*` transitions, 15 `AUT-*` rules, 15 `IFC-*` operations, 15 `INV-*` invariants, 10 `ERR-*` recovery classes, screen-to-requirement/fixture/test traceability, a content/accessibility matrix and the controlled 18-finding register. The UI visibly distinguishes fictional data, derived facts, human decisions, simulations, blocked states and source freshness.

Automated evidence passes locally:

- clean frozen-lockfile installation;
- machine-readable artifact audit;
- TypeScript compilation;
- 9 unit/component/automated-accessibility tests;
- production bundle build;
- 6 Playwright journeys across desktop and mobile Chromium;
- production dependency audit with no known vulnerabilities;
- whitespace/diff validation;
- visual inspection of candidate search, guided application, HR action center, restricted governance and small-screen careers layouts.

This is meaningful movement from `M0 — Absent` to `M4 — Implemented` for the **synthetic prototype layer**, with bounded `M5 — Evidenced` status for the automated checks that actually ran. It is not approval of product policy, usability, content, accessibility conformance, Salesforce architecture, security assurance, production hosting or a real-candidate pilot.

**Release verdict:** v0.9 is acceptable as an implemented synthetic prototype baseline. GitHub Pages deployment has been configured but not executed or remotely verified in this audit. `WP-02` cannot be called fully accepted until accountable product/design/content owners approve the experience and moderated usability plus manual assistive-technology testing pass. Real-candidate work remains blocked.

## 2. Audit boundary and method

The audit inspected actual repository artifacts and runnable behavior rather than accepting PRD prose as evidence. It used:

1. source and dependency inspection;
2. deterministic artifact reconciliation;
3. type, component and accessibility automation;
4. production build and desktop/mobile browser journeys;
5. capability and secret-pattern checks;
6. direct visual inspection at desktop and small-screen dimensions;
7. traceability review against the v0.8 screen/scenario/transition/automation contracts;
8. finding-by-finding disposition under the v0.8 evidence rule.

The audit did **not** perform moderated research, manual screen-reader testing, legal review, penetration testing, Salesforce deployment, provider integration, Pages deployment, load testing or operational exercises. Those items are not inferred from passing local tests.

## 3. Implemented release inventory

| Layer | Implemented v0.9 evidence | Audit conclusion |
| --- | --- | --- |
| Application | React 19, TypeScript, Vite, hash-routed candidate and HR surfaces | Runnable production bundle exists |
| Candidate UX | Careers/search, job detail, four-step guided application and candidate hub | All four `UI-CAN-*` contracts represented |
| HR UX | Action center, job/kickoff, application, interview, scorecard, decision/offer/handoff, automation ops and governance | All eight `UI-HR-*` contracts represented |
| Fixtures | Three fictional jobs, reserved `.test` contacts, applications, work, scorecards, automation runs and audit events | Deterministic and visibly fictional |
| Scenario laboratory | Runtime selector for `SCN-001`–`012`, reset-on-reload/memory model | Edge cases can be inspected without backend state |
| `ART-001` | `artifacts/v0.9/traceability.json` | All 12 screens map to requirements, route, component, fixtures and test IDs |
| `ART-003` | `artifacts/v0.9/routes.json` | 12 route/screen contracts with explicit state families |
| `ART-004` | `artifacts/v0.9/transitions.json` | All 15 governed transition contracts represented |
| `ART-005` | `artifacts/v0.9/automations.json` | All 15 rules represented; execution declared simulation-only |
| `ART-007` | `artifacts/v0.9/interfaces.json` | 15 non-writing fixture/memory/simulation/disabled operations |
| `ART-010` | `artifacts/v0.9/test-catalog.json` plus automated suites | Test families, gates and honest human-test status recorded |
| `ART-014` | `artifacts/v0.9/scenarios.json` and `src/data/fixtures.ts` | 12 seeded synthetic scenarios and reset contract |
| `ART-015` | `artifacts/v0.9/audit-findings.json` and this audit | 18 findings retained with movement and closure rule |
| `ART-016` | `artifacts/v0.9/invariants-errors.json` | 15 invariants and 10 recovery classes with prototype checks |
| `ART-021` | `artifacts/v0.9/content-accessibility.json` | All 12 screens mapped; manual evidence explicitly not run |
| Delivery | GitHub Actions verification and Pages workflows | Configuration exists; no remote run/deployment evidence yet |

## 4. Reproducibility and automated evidence

| Check | Observed result | Disposition |
| --- | --- | --- |
| `pnpm install --frozen-lockfile` | Lockfile current; installation succeeds | Pass |
| `pnpm audit:artifacts` | 12 routes, 12 scenarios, 15 transitions, 15 automations, 15 interfaces, 15 invariants, 10 errors and 18 findings reconcile | Pass |
| `pnpm typecheck` | TypeScript build graph exits successfully | Pass |
| `pnpm test` | 3 files, 9 tests passed | Pass |
| Automated accessibility | Candidate careers and HR action-center axe baselines pass; color contrast intentionally remains a manual/visual requirement | Pass for automated baseline only |
| `pnpm build` | 1,818 modules; HTML 0.71 kB, CSS 46.02 kB, JS 307.24 kB before compression; production build succeeds | Pass |
| `pnpm test:e2e` | 6 of 6 Playwright checks pass across desktop and Pixel 7 Chromium projects | Pass |
| `pnpm audit --prod` | No known production dependency vulnerabilities | Pass at audit time |
| Capability scan | No `fetch`, XHR, WebSocket, browser storage, consumer-email-domain or embedded key pattern in runtime source | Pass for inspected source |
| `git diff --check` | No whitespace errors | Pass |
| GitHub Actions | Workflow definitions exist but have not run from this unpushed working tree | Not evidenced |
| GitHub Pages | Build base/path and deployment workflow exist; no deployment URL was produced or tested | Not evidenced |

The build output is within a reasonable prototype envelope, but no v0.9 performance budget was approved. Bundle size is an observation, not an `SLO-*` pass.

## 5. Screen, state and journey audit

### 5.1 Candidate surface

- Careers search exposes pay, location, workplace and fictional-open-state data; filtering has an explicit empty state and reset action.
- Job detail includes process expectations, pay transparency, accommodation/support and privacy boundary copy.
- Guided application uses prepared read-only identity/resume fixtures, job-specific choices, a required synthetic-data declaration, validation summary, immutable review representation and memory-only success.
- Candidate hub presents candidate-safe status and next action while excluding internal stage, evaluation, rank and restricted reasoning. Withdrawal requires confirmation and changes in-memory state only.
- Candidate layouts reflow to a 390-pixel viewport without the inspected clipping or two-dimensional page scroll.

### 5.2 HR surface

- Action center answers what needs attention, age/due state, owner, why and source freshness without opening a report.
- Job readiness is derived from named facts and blocks publication under `SCN-012` when jurisdiction is unknown.
- Application context remains visible while evidence, parallel work and transition readiness are inspected. `TRN-005` preview explains why it is blocked and cannot execute.
- Interview coordination presents candidate timezone and an explicit conflict-recovery preview.
- Scorecard separates approved competencies, independent evidence and a human-only decision boundary.
- Decision/offer/handoff keeps accepted offer, opening reservation, handoff acknowledgement and Hired distinct. `SCN-007` remains not Hired on delivery failure.
- Automation operations distinguish simulation, active/paused, suppression, failure, owned review and replay-safe keys.
- Governance demonstrates policy blocking, disabled providers, least-privilege negative access and minimized audit evidence.

### 5.3 State coverage conclusion

The machine-readable route artifact specifies loading, empty, validation, stale, conflict, denied, blocked, partial/failure and recovery families across the 12 screens. v0.9 implements representative visible examples for each family across the shared surfaces; it does not create a unique screenshot or automated test for every screen-state Cartesian combination. Before pilot, each operation-specific error mapping requires direct contract and browser coverage.

## 6. Synthetic-data and safety boundary

The prototype materially enforces its public boundary:

- a persistent banner states that it contains no real jobs, people, authentication, uploads or external writes;
- the employer, users, roles and records are fictional;
- candidate contacts use the reserved `.test` domain;
- identity and resume data are read-only fixtures;
- candidate and HR actions mutate React memory only and reset on refresh;
- no browser storage, network request, WebSocket, authentication, upload or production endpoint exists in runtime source;
- interface artifacts mark every operation `writes: false` and identify fixture, memory, simulation or disabled behavior;
- `robots.txt` and HTML metadata request `noindex, nofollow`;
- provider rows are visibly disabled;
- production dependency audit reports no known vulnerabilities at audit time.

These controls make accidental persistence or external transmission through the implemented prototype unlikely. They do not prove the future BFF, Salesforce org, identity provider, file service or integrations are secure because none exists yet.

## 7. Traceability audit

All 12 route IDs occur exactly once in `ART-003`, `ART-001` and `ART-021`. Each route maps to at least one `RS-*` requirement, two deterministic scenarios and test identifiers. Every scenario reference resolves to the 12-item fixture pack. Every test reference resolves to `ART-010`. The artifact audit also enforces contiguous `TRN-*`, `AUT-*`, `IFC-*`, `INV-*`, `ERR-*` and `AUD-*` ID sets.

This is sufficient traceability for the synthetic UI prototype. It is not implementation traceability for Salesforce objects/fields, Apex/Flow, BFF operations, provider events, production metrics or release evidence because those components do not exist.

## 8. v0.8 finding disposition after v0.9

No finding is marked closed because no accountable reviewer supplied a dated acceptance or exception. “Improved” below means repository evidence materially reduced the gap.

| Finding | v0.9 movement | Status |
| --- | --- | --- |
| `AUD-001` No implementation | React source, fixture artifacts, tests, CI and Pages configuration now exist; Salesforce metadata and verified deployment do not | Open — materially improved |
| `AUD-002` Unapproved decisions | Prototype uses explicit fictional defaults, but no employer/provider/org/budget owner approval exists | Open — unchanged |
| `AUD-003` Jurisdiction mismatch | Unknown/conflict blocking is executable in `SCN-012`; counsel-approved applicability register remains absent | Open — improved |
| `AUD-004` Salesforce execution mapping | v0.8 specification mapping remains; no approved or implemented Salesforce trace exists | Open — specification only |
| `AUD-005` Exact APIs absent | Fifteen non-writing operation stubs exist; request/response schemas, authorization, idempotency/error examples and contract tests remain | Open — improved |
| `AUD-006` Event registry absent | No executable semantic event registry added | Open — unchanged |
| `AUD-007` Threat/verification baseline | Capability/secret/dependency checks exist; no reviewed threat model, ASVS/API mapping or penetration scope | Open — improved slightly |
| `AUD-008` Identity assurance | Prototype safely omits auth; production identity/recovery policy and tests remain | Open — unchanged for pilot |
| `AUD-009` Metric contracts | No executable metric dictionary or quality thresholds added | Open — unchanged |
| `AUD-010` Service objectives | Build behavior observed; no service indicators, load model or error-budget evidence | Open — unchanged |
| `AUD-011` Physical data/processing inventory | Synthetic fields exist; approved production field and processing inventories do not | Open — unchanged |
| `AUD-012` Cutover/rollback | No implementation artifact added | Open — unchanged |
| `AUD-013` Incident/support | Visible recovery states exist; severity/on-call/runbooks/exercises do not | Open — improved slightly |
| `AUD-014` Accessibility matrix | 12-screen matrix, automated baseline and desktop/mobile smoke pass; manual keyboard/AT/zoom and moderated evidence remain | Open — materially improved |
| `AUD-015` Content | Candidate-safe prototype copy exists; inventory, readability/legal approval and comprehension evidence remain | Open — materially improved |
| `AUD-016` Report/export controls | No production artifact added | Open — unchanged |
| `AUD-017` SEO lifecycle | Prototype is noindex and fictional; production canonical/index/update/remove reconciliation remains | Open — prototype risk controlled |
| `AUD-018` Salesforce version compatibility | Web build dependencies and CI runtime are pinned; Salesforce release/API evidence remains absent | Open — unchanged for Salesforce |

## 9. Maturity after v0.9

| Layer | v0.9 maturity | Reason |
| --- | --- | --- |
| Product requirements and workflow model | `M2 — Specified` | Detailed and traceable, but major owner decisions remain unapproved |
| Synthetic UX implementation | `M4 — Implemented` | Clean-build source and all 12 screen contracts exist |
| Automated prototype verification | `M5 — Evidenced` for checks run | Artifact, unit/component, axe baseline and browser smoke pass reproducibly |
| Prototype content/accessibility acceptance | `M2/M4 — Specified/Implemented` | Copy and matrix exist; accountable approval, manual AT and moderated evidence absent |
| Prototype deployment | `M2 — Specified` | Pages workflow exists; remote run and URL not evidenced |
| Salesforce/BFF/domain implementation | `M0 — Absent` | No DX project, metadata, BFF, auth or provider integration |
| Security/privacy/legal assurance | `M1/M2 — Proposed/Specified` | Synthetic boundary is strong; production assurance artifacts/approvals absent |
| Real-pilot verification and operations | `M0 — Absent` | No controlled environment, real integration, runbook exercise or approved pilot |

## 10. What remains before v0.9 prototype acceptance

1. Obtain dated `OD-02`, `OD-10` and `OD-28` prototype content/design/interaction decisions or document bounded exceptions.
2. Run moderated candidate and HR tasks across the PRD personas, including first-time, keyboard-only and small-screen participants; record completion, error/recovery comprehension and critical confusion.
3. Execute the `ART-021` manual matrix with current VoiceOver/Safari and the approved Windows screen-reader/browser combinations; include zoom/reflow, dynamic status and dialog focus.
4. Produce a versioned content inventory and complete product/content/accessibility approval.
5. Push the workflows, observe a clean CI run, deploy Pages, verify the public URL and confirm noindex/synthetic behavior after deployment.
6. Add direct automated coverage for the highest-risk representative states not yet browser-tested: stale posting, safe denial, message failure/retry, offer supersession and failed handoff.

## 11. Recommended next release and audit

The next release should be **v1.0 — Approved Prototype and Nonproduction Foundation**, not another PRD-only expansion and not a real-candidate launch.

Its audit should require two independently passable gates:

### Gate A — synthetic prototype acceptance

- the six items in section 10 complete;
- all prototype-relevant `AUD-014`, `AUD-015` and `AUD-017` evidence accepted;
- every high-risk `SCN-*` task has a reproducible browser test or documented manual rationale;
- Pages deployment is remotely verified and remains incapable of collecting real data.

### Gate B — pilot foundation readiness

- dated Phase 0 decisions and a bounded employer/jurisdiction/pilot charter;
- Salesforce DX project, controlled nonproduction org strategy and pinned seasonal/API baseline;
- approved ERD/field dictionary, permission model, threat model, identity design and processing inventory;
- machine-readable OpenAPI/event/domain contracts with authorization, version, idempotency and recovery tests;
- nonproduction BFF/auth skeleton and Salesforce metadata deployed without real candidate data;
- CI promotion, drift, secret, static-analysis and rollback controls;
- service/metric dictionaries, operational ownership and exercised synthetic failure paths.

Only after `WP-03`–`WP-07` are implemented and evidenced should a later audit assess first-real-candidate readiness. v1.0 must remain synthetic/nonproduction unless accountable legal, privacy, security, HR and platform gates independently authorize otherwise.

## 12. Audit disposition

v0.9 meets its executable-artifact objective and should become the baseline for prototype review. It does not close the real-pilot blockers, and it does not convert recommended PRD positions into approval. The repository should be reviewed, committed and pushed only after the owner accepts this implementation boundary and the CI/Pages effects.
