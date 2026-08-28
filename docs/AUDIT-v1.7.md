# Recruitment System v1.7 remediation audit

Audit date: August 28, 2026  
Scope: repository and synthetic GitHub Pages wireframe  
Formal closure rule: an `AUD-*` finding remains Open until its accountable reviewer accepts dated evidence or a valid time-bound exception. Implementation by the author alone is not formal closure.

## Answer first

v1.7 materially closes the quoted wireframe-contract gaps: all object families have routed New/Edit/Detail/List states; global analytics filter coverage moves from 130/600 populated to 600/600; zero denominators are N/A; role, row and field scopes are declared and applied; Data Readiness has one reconciled source/filter population; the logical dictionary is 1,472 fields rather than a misleading 920 total; and reporting now includes saved definitions, a builder, drill-through, schedules, delivery evidence, controlled aggregate export, targets and restatements.

The repository is still not production- or pilot-ready. Salesforce/BFF/IdP/provider services are absent; the API/event/Salesforce files are proposed contracts; security/privacy/operations documents are unexercised plans; manual accessibility, moderated usability and accountable legal/security/pilot evidence have not run. The 18 controlled findings therefore remain formally Open even where v1.7 supplies substantial remediation evidence.

## Quoted-gap disposition

| Gap | v1.7 disposition | Evidence | What still blocks production closure |
| --- | --- | --- | --- |
| 18 controlled findings: 3 Blocker, 10 High, 5 Medium | Formal register remains 18 Open under its existing closure rule | `artifacts/v0.9/audit-findings.json`; this audit | Accountable dated review, plus production evidence for each applicable finding |
| 470/600 filter combinations empty | Remediated for the supported synthetic matrix: 0/600 empty | 324-row cross-product fixture and enumeration test | Employer distributions, larger dimensions and production query validation |
| Zero-eligible denominator displays 0% | Remediated: N/A, neutral, `available=false` | `safeRatio`, `metricViews` contract tests | Production semantic layer/query parity and reporting QA |
| Personas affect navigation but not complete data visibility | Materially remediated in wireframe: population plus identity/contact/evidence/compensation/accommodation/privacy/integrity/export scopes; core and generic pages apply row/field checks | `src/data/access.ts`, role/data matrix, negative/contract tests | Server-side IdP/BFF/Salesforce OWD/sharing/FLS and cross-role negative evidence |
| Data Readiness mixes populations | Remediated in wireframe: dedicated object filters/source; cards/chart/table share filtered object rows | `DataReadinessSurface` | Physical metadata readiness and org reconciliation |
| Tests cover rendering, not formulas/permissions/combinations | Materially remediated: denominator, 600-combination, 12-role, 92-object/368-page/1,472-field and reporting contracts | `src/test/readiness.test.ts`; browser flows | Production API/event/authorization/formula/load/security tests |
| 920 claim is not a business dictionary | Corrected: 920 governance/provenance + 552 domain business = 1,472 logical fields | object catalogue, studio, matrix and PRD | Approved physical business-field dictionary and data-processing inventory |
| Reporting product missing | Remediated as memory-only wireframe contract | `ReportWorkspace`, seeded definitions/schedules/deliveries/targets/restatements | Production engine, recipient identity, distribution, storage, aggregation policy and audit |
| Major journeys remain previews | Partially remediated: core routes and 92-object CRUD semantics are interactive; failure/retry/cancel/recovery patterns are represented | application/interview/scorecard/decision/automation/object components | Complete production transactional services/providers and integration/fault evidence |
| No Salesforce/BFF/IdP/API/event implementation | Proposed contracts added; implementation remains absent by design | OpenAPI, AsyncAPI, Salesforce mapping and ADR | Technology/provider decisions, deployable services/metadata, environments and tests |
| Threat/privacy/SLO/observability/backup/incident/cutover evidence absent | Baseline plans added; exercised evidence remains absent | security/privacy/operations documents | Accountable reviews, selected stack, telemetry and completed drills |
| Manual accessibility/usability/legal/security/pilot evidence incomplete | Explicit evidence plan added; status remains not run | `PILOT-EVIDENCE-PLAN.md` | Actual representative sessions, defects/closure and dated approvals |
| Main unprotected/security automation limited | Repository automation materially improved; branch protection still to verify/enable | CODEOWNERS, Dependabot, CodeQL/dependency review, PR template, SECURITY.md | GitHub protection rules, required reviews/checks and successful workflow evidence |
| PRD traceability stale/mismatched | Remediated for v1.7 counts and `UI-HR-009/010`; old releases remain historical | PRD 1.6/15.15/16.4/22.9–22.10; `MATRIX-v1.7.md` | Accountable ballots remain unapproved and must not be silently changed |

## Layered maturity

| Layer | Current maturity | Reason |
| --- | --- | --- |
| Product/PRD | M3 — specified and internally reconciled | Deep requirements, matrices, acceptance and proposed decisions exist; accountable approvals remain open |
| Synthetic UX | M4 — implemented | Candidate/internal operational routes, 14 screen families and dynamic seeded states exist |
| Synthetic data/analytics/reporting | M4/M5 bounded | Exact filters, denominators, object/field/page counts and local automated evidence exist |
| Logical architecture/contracts | M3 — proposed | ADR, OpenAPI, AsyncAPI and Salesforce mapping exist but are not approved/deployed |
| Production application/data/integrations | M0 — absent | No Salesforce metadata/org, BFF, IdP, file/provider services or production data |
| Security/privacy/reliability operations | M2 — baseline planned | Threat/data/SLO/incident/cutover plans exist; no selected-stack validation or exercises |
| Human/legal/pilot assurance | M1 — planned | Evidence plan exists; sessions, approvals and pilot data do not |
| Repository governance | M3 — configured | CI/Pages/security/dependency/CODEOWNER controls exist; branch rule and successful release runs require verification |

## Remaining priority register

1. Obtain dated approval or amendment of the v1.7 PRD, role/data scopes, pilot boundary and open ballots.
2. Approve the 92-family logical-to-physical Salesforce map and complete atomic field, relationship, OWD/sharing/FLS, encryption, index, history, retention/archive and migration decisions.
3. Select and build the production host, BFF, external IdP, Salesforce app/package and private file boundary.
4. Convert the proposed OpenAPI/AsyncAPI contracts into purpose-built service implementations and schema/authorization/idempotency/concurrency tests.
5. Complete provider choices and end-to-end scheduling, messaging, e-signature, handoff, privacy execution and automation recovery integrations.
6. Validate formulas and reporting against employer baseline data, add small-cell/late-data/restatement policies and secure delivery/recipient controls.
7. Perform selected-stack threat/privacy review, SAST/DAST/penetration testing, access-negative testing and secret/logging validation.
8. Implement production telemetry and execute load/limit, dependency degradation, incident, backup/restore, cutover/rollback and privacy re-deletion exercises.
9. Run manual assistive-technology and moderated persona journeys; resolve findings and secure content/accessibility acceptance.
10. Obtain employment/legal/privacy approval for jurisdictions, notices, selection procedures, retention, accommodation, offers and providers.
11. Enable/verify main-branch protection with required PR review, required CI/security checks, conversation resolution and force-push/deletion prevention.
12. Run bounded nonproduction rehearsal and controlled pilot gates; record one approved outcome rather than inferring readiness from the wireframe.

## Readiness conclusion

- Synthetic wireframe contract: ready for stakeholder review after the exact v1.7 commit passes CI, browser tests and Pages verification.
- Production build start: not authorized until architecture, org/provider, access, data and accountable decisions close.
- Real-candidate pilot: blocked.
- Overall product production readiness: not a percentage; key required layers remain M0–M2, so a “100% ready” claim would be false.
