# Recruitment System — v0.8 Full Product and Delivery Audit

| Field | Value |
| --- | --- |
| Audit version | v0.8 |
| Audit date | August 25, 2026 |
| Baseline | PRD draft v0.7 and the local `main` worktree |
| Audit state | Complete for document/repository evidence available on the audit date |
| Product implementation state | Not started |
| Launch-evidence state | No prototype or real-candidate gate evidenced |
| Scope | Product, journey, workflow, data, automation, Salesforce, integration, security, privacy/legal, accessibility, analytics, reliability, operations, delivery, and evidence readiness |

## 1. Executive outcome

v0.7 is a strong **specified design baseline**, not an implemented system. It defines the intended product, workflow, data model, controls, delivery packages, and evidence expectations more deeply than a typical early PRD. The full audit does not justify adding more recruiting features. It justifies closing the contracts that engineering, counsel, security, operations, and QA would otherwise have to invent during delivery.

The current maturity is:

| Layer | Current maturity | Audit conclusion |
| --- | --- | --- |
| Product scope and release boundary | `M2 — Specified` | P0/P1/P2 and a bounded proposed pilot exist; accountable approval is still missing |
| Journeys, workflow, automation and data logic | `M2 — Specified` | Strong conceptual coverage; canonical invariants, interface schemas and complete implementation traceability still need closure |
| Salesforce and integration architecture | `M2 — Specified` | Target patterns exist; org, licenses, physical dictionary, API contracts, capacity and release-version choices are open |
| Security, privacy, legal and accessibility | `M1/M2 — Proposed/Specified` | Controls are broad, but applicability, assurance levels, abuse cases, verification baseline and approved policy facts are missing |
| Analytics and success measurement | `M1 — Proposed` | Targets exist; stable metric IDs, exact formulas, exclusions, source mappings, quality thresholds and pilot evaluation rules do not |
| Operations and reliability | `M1 — Proposed` | Availability/RPO/RTO targets exist; service indicators, error budgets, dependency objectives, severities, escalation and cutover evidence do not |
| Implementation | `M0 — Absent` | Repository contains documentation only |
| Verification and pilot evidence | `M0 — Absent` | No code, metadata, environments, fixtures, tests, CI/CD, usability results, legal approvals, provider evidence or runbook exercises exist |

**Audit verdict:** v0.8 can be approved as a design-assurance baseline only after accountable owners accept or formally disposition its findings. A synthetic prototype can begin after the prototype blockers close. A real-candidate pilot remains blocked.

## 2. Audit method and maturity scale

The audit used four evidence types:

1. Repository inspection: tracked files, implementation artifacts, version state and diff hygiene.
2. Internal PRD consistency: requirements, priorities, journeys, states, transitions, automations, records, permissions, risks, decisions, work packages, gates and evidence references.
3. Current primary-source verification: regulator, standards-body, platform-vendor, search-platform and competitor documentation available on August 25, 2026.
4. Delivery challenge tests: “Can an engineer build it?”, “Can QA prove it?”, “Can an operator recover it?”, “Can counsel determine applicability?”, and “Can an approver know what decision they are accepting?”

Maturity is assessed per layer, not averaged into a misleading single score:

| Level | Meaning | Minimum proof |
| --- | --- | --- |
| `M0 — Absent` | No usable artifact or evidence | Nothing reviewable |
| `M1 — Proposed` | Direction exists but material choices or owners are open | Written proposal and dependencies |
| `M2 — Specified` | Build/test contract is defined and traceable | Approved-ready requirements, states, interfaces, controls and acceptance method |
| `M3 — Approved` | Accountable owners accepted the contract and residual risk | Dated approvals/decisions and funded/staffed plan |
| `M4 — Implemented` | Reproducible implementation exists in controlled environments | Source, metadata, CI/CD, environments and operational artifacts |
| `M5 — Evidenced` | Required tests and operating exercises pass | Reproducible evidence, reviewed exceptions and gate decision |
| `M6 — Operated` | Controlled real use meets objectives over time | Pilot/production metrics, incidents, access reviews and improvement decisions |

## 3. Full finding register

`Blocker` prevents the named release boundary. `High` must close before the affected build or pilot gate. `Medium` must be planned and close before its affected capability launches. Status is based only on repository/audit evidence, not verbal intent.

| ID | Severity | Finding | Why it matters | Required closure evidence | Status |
| --- | --- | --- | --- | --- | --- |
| `AUD-001` | Blocker | No implementation exists | A complete PRD can be mistaken for a working product | Clean-checkout build, application source, Salesforce metadata, CI/CD, fixtures and deployed synthetic prototype under `WP-01/02` | Open |
| `AUD-002` | Blocker | Employer, policy, named-owner, provider, Salesforce-org and budget decisions are unapproved | Real candidate data cannot be processed safely from proposed assumptions | Dated decision records for the applicable Phase 0/pilot `OD-*` set, accepting owners, funded plan and residual-risk register | Open |
| `AUD-003` | Blocker | Proposed U.S.-remote scope is broader than the California-focused launch policy | Candidate residence, work location and job reach can trigger different notice, pay, fair-chance, privacy and automated-decision duties | Approved jurisdiction/applicability register; P0 limited to approved locations; unknown/conflict publication block; counsel sign-off | Open |
| `AUD-004` | High | The 26 P0 product requirements are execution-mapped, but the 22 P0 Salesforce requirements are not | Platform work, evidence and dependencies can fall through the product-only traceability register | P0 `SFDC-*` execution register mapping architecture, work package, dependencies, tests and evidence owner | Open |
| `AUD-005` | High | Purpose-built APIs are described but exact operations, schemas, authorization, idempotency and error semantics are absent | Frontend, BFF and Salesforce teams could implement incompatible or unsafe contracts | Versioned OpenAPI/internal service contracts, operation registry, field classification, object/property authorization, error taxonomy and contract tests | Open |
| `AUD-006` | High | Domain events have an envelope model but no approved semantic event registry | Automations, integrations and metrics may assign different meaning to the same state change | Versioned event registry with producer, trigger, payload minimization, aggregate version, consumers, ordering, retention and reconciliation tests | Open |
| `AUD-007` | High | Security controls exist without an explicit threat/abuse-case model or adopted verification baseline | Important attacks can remain untested despite a long control list | Data-flow threat model; abuse-case register; OWASP ASVS 5.0/API Security mapping; penetration scope; owner-approved exceptions | Open |
| `AUD-008` | High | Candidate passwordless identity, recovery and internal authentication assurance are unapproved | Magic-link theft, enumeration, forwarding, session replay and weak recovery can expose candidate or privileged data | Identity risk assessment, assurance/session/recovery policy, phishing-resistant administrator authentication and negative tests | Open |
| `AUD-009` | High | Metrics have targets but not stable IDs, exact computational contracts or quality gates | Teams can report different “completion,” “time,” “integrity,” or SLA results from the same data | Metric dictionary with event/source facts, numerator/denominator, exclusions, windows, timezone, segments, freshness, reconciliation and owner | Open |
| `AUD-010` | High | Availability/performance/RPO/RTO are not decomposed into service indicators, error budgets or dependency objectives | A 99.9% statement cannot govern partial outages, stale data, missed messages or degraded providers | SLI/SLO catalogue, dependency objectives, measurement source, burn policy, capacity model, load profile and suspension thresholds | Open |
| `AUD-011` | High | Logical data points exist, but no approved physical field dictionary or processing/subprocessor inventory exists | Classification, purpose, retention, access, residency and deletion cannot be proven field by field | Physical Salesforce/BFF/file dictionary plus processing inventory, data flow, controller/processor roles, purpose, recipients and deletion verification | Open |
| `AUD-012` | High | Cutover, migration, rollback and manual-continuity behavior is not executable | Pilot launch or suspension could orphan active applicants and communications | Source mapping, dry-run, quarantine, delta cutover, rollback criteria, in-flight record treatment, communications, reconciliation and sign-off | Open |
| `AUD-013` | High | Operational severity, escalation and support contracts are incomplete | Candidate-facing harm may be handled inconsistently during offer, interview, privacy or access incidents | Severity matrix, response/restore/communication targets, on-call rota, escalation authority, support scripts and exercised runbooks | Open |
| `AUD-014` | Medium | Accessibility is a gate but not a route/component/assistive-technology test matrix | A global WCAG statement can miss application forms, dynamic errors, status changes, authentication and Salesforce custom UI | Per-screen WCAG mapping, keyboard/screen-reader/browser matrix, accessible error/recovery tests and evidence owner | Open |
| `AUD-015` | Medium | Candidate-safe status, notices, error messages, support scripts and offer/background content remain provisional | Correct logic can still create confusion, coercion or legal exposure through copy | Versioned content inventory, readability/localization review, legal/content approval and comprehension evidence | Open |
| `AUD-016` | Medium | Reporting/export controls do not fully specify scheduled delivery, external recipients, field-level filtering and revocation | A valid report can leak candidate or compensation data after export or via recurring email | Distribution policy, recipient authorization at generation/delivery, watermark/expiry, audit, revoke/stop, empty/partial-data handling and negative tests | Open |
| `AUD-017` | Medium | Public-job SEO does not yet define Indexing API ownership, expired-job timing and source/markup reconciliation | Closed or mismatched jobs can remain discoverable and create a poor or noncompliant candidate journey | Canonical URL/markup contract, publish/update/remove events, `validThrough`, Indexing API/sitemap reconciliation and Search Console monitoring | Open |
| `AUD-018` | Medium | Salesforce seasonal/API-version compatibility is not a controlled design input | Security and runtime defaults can change across releases; Spring ’26 restricts new Connected Apps and API v67 changes Apex access defaults | API-version pinning policy, ECA-only baseline, seasonal review checklist, regression org, release notes, static tests and owner sign-off | Open |

## 4. Internal consistency audit

### 4.1 Controls that passed the document audit

- All 41 `RS-*`, 24 `SFDC-*`, 39 `OD-*`, 15 `AUT-*`, 15 `TRN-*`, 12 `UI-*`, 12 `SCN-*`, 9 `WP-*` and 10 `EVD-*` identifier sets in v0.7 are contiguous.
- The P0 product execution register exactly matches all 26 P0 `RS-*` requirements.
- Product workflow separates candidate, application, opening, offer, contingency, handoff and hire states.
- The transition model separates candidate-safe status from internal state and requires typed prerequisites, audit and recovery.
- Automation is bounded by a finite P0 catalogue, idempotency, cancellation/suppression, replay, kill switch and a human-decision prohibition.
- Salesforce is consistently treated as operational truth; the browser boundary is consistently through public projection or an approved BFF.
- Pilot/prototype/production boundaries are explicit, and the repository truthfully says there is no implementation evidence.

### 4.2 Contradictions or ambiguity requiring v0.8 correction

| Area | v0.7 tension | v0.8 resolution |
| --- | --- | --- |
| Geography | Pilot proposes California locations plus authorized U.S.-remote roles, while section 11 is California-led and employer facts are unknown | Limit P0 publication/application to approved jurisdiction records; recommend California-only work locations/remote eligibility until expansion review |
| Scale | Pilot limits are 5 jobs/1,000 applications/25 users, while NFR targets are 100 jobs/100,000 records/100 users | Separate pilot load envelope, architecture design capacity and tested launch capacity; no claim passes without workload evidence |
| Metrics | Metric labels/targets exist, but exact starts, eligible populations, reopened records and exclusions are deferred | Assign `MET-*` IDs and require one computational contract per metric before dashboard acceptance |
| Interfaces | “Purpose-built operation” is repeated, but operations and errors are not enumerated | Add a P0 interface registry and require `ART-007` machine-readable schemas/contract tests |
| Platform traceability | Product P0 is mapped; Salesforce P0 is only listed | Add a 22-row P0 Salesforce execution register |
| Security | Controls are broad but verification references are generic | Adopt ASVS 5.0 plus API authorization/abuse requirements and a scoped threat model |
| Identity | Passwordless email is a proposed pilot method without assurance/session/recovery analysis | Treat method as proposed; approve assurance policy and test forwarding, replay, enumeration, recovery and deactivation |
| Operations | Availability and recovery targets exist but provider degradation and partial failure lack service indicators | Add service indicators, dependency modes, error-budget actions and severity/escalation contracts |
| Evidence | Evidence families are defined but all companion artifacts are missing | Extend the artifact register and make v0.9 an executable-artifact/prototype audit |

## 5. Current-source audit and product implications

The sources below are primary/first-party and were checked on August 25, 2026. They inform product controls; they are not legal advice or proof that a rule applies to the unknown employer.

| Current evidence | Audit implication |
| --- | --- |
| California’s completed CCPA regulations took effect January 1, 2026; risk-assessment compliance begins in 2026 and significant-decision ADMT obligations begin January 1, 2027, subject to business/applicability facts. [CPPA rulemaking status](https://cppa.ca.gov/regulations/ccpa_updates.html) | Keep employer/applicability facts, risk assessments, pre-use notices, rights and ADMT decisions in an effective-dated policy register; do not hardcode a universal rule |
| California employment automated-decision regulations took effect October 1, 2025 and include discrimination, disability-inquiry and four-year automated-decision record implications. [California CRD approval](https://calcivilrights.ca.gov/2025/06/30/civil-rights-council-secures-approval-for-regulations-to-protect-against-employment-discrimination-related-to-artificial-intelligence/) | Preserve the broad provider/rule inventory and P0 prohibition; add field-level evidence/retention and selection-procedure monitoring contracts |
| Colorado’s 2026 replacement law is scheduled for January 1, 2027 and rulemaking was active in August 2026. [Colorado Attorney General](https://coag.gov/ai/) | “U.S. remote” cannot be one policy value; approved state/location applicability and change monitoring are required before publication |
| NYC Local Law 144 requires a qualifying AEDT bias audit, public summary and notices, including advance notice under the rule. [NYC DCWP](https://www.nyc.gov/site/dca/about/automated-employment-decision-tools.page) | NYC candidates/jobs require a distinct applicability result even if autonomous decisions are prohibited; provider features must be inventoried before use |
| California job postings for employers with at least 15 employees must include the pay scale where the role may be filled in California, including remote roles under the Labor Commissioner’s interpretation. [California DIR](https://dir.ca.gov/dlse/california_equal_pay_act.htm) | Employer size and fill-location facts must block publication when unknown; public projection and syndicated copies must reconcile compensation content |
| Salesforce restricts new legacy Connected App creation from Spring ’26 and directs new integrations to External Client Apps. [Salesforce Spring ’26 guidance](https://help.salesforce.com/s/articleView?id=005228017&language=en_US&type=1) | Change the ECA pattern from a preference to the new-integration baseline; any legacy Connected App is an explicit exception/migration item |
| Salesforce retains platform/change events for 72 hours and warns replay IDs are not guaranteed unique. [Salesforce event durability](https://developer.salesforce.com/docs/platform/pub-sub-api/guide/event-message-durability.html) | Keep the durable integration ledger/checkpoint outside the event bus; identify platform events with the event ID and reconcile after retention expiry |
| Salesforce API v67 and later use user-mode Apex defaults, while earlier versions use system-mode defaults. [Salesforce Apex security](https://developer.salesforce.com/docs/platform/lwc/guide/apex-security) | Pin API versions, explicitly declare sharing/access mode and test both positive and negative authorization across seasonal upgrades |
| OWASP ASVS 5.0 is the latest stable verification standard and the API Top 10 emphasizes object/property/function authorization and resource abuse. [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) · [OWASP API Security](https://owasp.org/www-project-api-security/) | Adopt a traceable verification baseline instead of relying only on generic vulnerability names |
| NIST SP 800-63-4 is the current digital-identity guideline and emphasizes risk-based assurance, fraud, recovery, federation and continuous metrics. [NIST SP 800-63-4](https://www.nist.gov/publications/nist-sp-800-63-4-digital-identity-guidelines) | Create an identity risk/assurance contract for candidates, HR, administrators and integrations; do not equate passwordless email with a decided assurance level |
| WCAG 2.2 includes accessible authentication, focus, target-size and programmatic status-message requirements; W3C form guidance requires textual, discoverable error handling. [WCAG 2.2](https://www.w3.org/TR/WCAG22/) · [W3C error identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification) | Add route/component/assistive-technology coverage and dynamic error/status tests, especially application, authentication and Salesforce custom UI |
| Google’s current JobPosting guidance requires content/markup parity, canonical handling, accurate remote eligibility and timely expiration/removal; it recommends the Indexing API plus sitemap coverage. [Google JobPosting](https://developers.google.com/search/docs/appearance/structured-data/job-posting) | Add an indexed-job lifecycle, valid-through/remote-location rules, update/removal owner and reconciliation evidence |
| Current Greenhouse guidance continues to center kickoff, predetermined scorecards, assigned focus attributes, timely independent feedback and reporting data quality. [Greenhouse structured hiring](https://support.greenhouse.io/hc/en-us/articles/360039539772-Structured-hiring-guide) · [Greenhouse reporting](https://support.greenhouse.io/hc/en-us/articles/360039539892-Greenhouse-reporting-guide) | v0.7’s structured-plan design is directionally strong; v0.8 should make data-quality/metric contracts and version-change treatment testable rather than add more screens |
| Current Workable permission/report guidance shows the operational importance—and risk—of role-scoped reporting and scheduled external distribution. [Workable report access](https://help.workable.com/hc/en-us/articles/115011950867-Who-can-view-reports) · [Workable scheduled reports](https://help.workable.com/hc/en-us/articles/30248645797655-Automating-and-sending-recruiting-reports) | Treat report generation/delivery as a consequential export with field-level authorization, recipient validation, audit and revocation |

## 6. v0.8 remediation scope

v0.8 updates the PRD to add or strengthen:

- Stable metric identifiers and the required computational/quality contract.
- A complete P0 Salesforce execution/evidence register.
- Canonical cross-service invariants and one error/recovery vocabulary.
- A jurisdiction/applicability publication and processing gate, with a California-only pilot recommendation until expansion approval.
- Threat/abuse cases, identity assurance and adopted security-verification baselines.
- A P0 interface/operation registry and machine-readable contract requirement.
- Extended implementation artifact register for jurisdiction, data processing, service objectives, cutover, content/accessibility and audit findings.
- Tiered capacity and service-level indicators, dependency degradation, error-budget action and incident severity expectations.
- Explicit audit-finding disposition in PRD approval and launch gates.

v0.8 does **not** add sourcing CRM, AI matching, self-scheduling, integrated assessment/background/reference/e-signature, job-board syndication, advanced approvals, multilingual/multi-country, onboarding, or other P1/P2 functionality.

## 7. What the next audit should look like

The next audit should be v0.9, titled **Executable Artifact and Synthetic Prototype Audit**. It should not repeat the v0.8 document review. It should inspect actual artifacts and runnable behavior.

Minimum v0.9 audit inputs:

1. Approved v0.8 PRD, pilot charter and dated decisions for prototype scope.
2. `ART-001` traceability matrix populated with source links.
3. `ART-003/004/005/007/010/014/015/016/021` route, transition, automation, interface, test, fixture, audit, invariant/error and content/accessibility artifacts.
4. React/TypeScript/Vite prototype source, generated fixtures, unit/component/E2E/accessibility tests, CI and Pages deployment.
5. No secrets, PII, real job representations, write-capable production endpoints or authentication in the public prototype.
6. Usability results for the 12 screen contracts and 12 synthetic scenarios.
7. Resolved or explicitly deferred `AUD-004`, `AUD-005`, `AUD-009`, `AUD-014`, `AUD-015`, `AUD-017` and the prototype portion of `AUD-001`.

The v0.9 audit should answer:

- Does a clean checkout build, test and deploy reproducibly?
- Does every screen/action trace to a requirement, state/transition, fixture and test?
- Are loading/empty/error/permission/stale/retry/recovery states visible and understandable?
- Can candidate and HR users complete the P0 prototype tasks at the required accessibility/usability level?
- Does the prototype contain only synthetic data and remain incapable of processing real candidate information?
- Did implementation reveal a contradiction requiring a PRD decision, or can `WP-03` safely begin after its real-pilot blockers close?

The first real-candidate readiness audit should occur only after `WP-03`–`WP-07` exist. It must evaluate deployed nonproduction Salesforce/portal behavior, not screenshots or document claims.

## 8. Audit disposition

At creation, every `AUD-*` finding is `Open`. Closing a finding requires its required evidence, an accountable reviewer and a dated disposition. A time-bound exception records scope, residual risk, compensating control, owner and expiry. Editing the PRD alone cannot close `AUD-001`, `AUD-002`, or any implementation/evidence finding.
