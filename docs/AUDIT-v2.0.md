# Recruitment System v2.0 — Full-Lifecycle Wireframe Audit

Audit date: August 28, 2026  
Scope: current local v2.0 release candidate  
Conclusion: the repository now supports the description **full recruitment and onboarding wireframe**. It does not support the description production recruitment/onboarding platform.

## Readiness outcome

| Layer | Status | Evidence |
| --- | --- | --- |
| Recruitment wireframe | Complete for synthetic review | Inherited candidate, HR, object, analytics, reports, core forms and canonical runtime |
| Candidate-to-new-hire transition | Complete for synthetic review | Separate Candidate/Application/PreHire/PendingWorker/Employee lineage and correction state |
| Onboarding operations | Complete for synthetic review | Overview, 36-record list/detail, 8 templates, plan assignment form, 18 exceptions, 72 provisioning requests, progress analytics |
| New-hire experience | Complete for synthetic review | Seven routes with tasks, forms, documents/signature, profile correction, day one and support |
| Talent growth | Complete for synthetic review | 120 prospects, 8 communities, 6 campaigns, 24 job distributions, 8 internal opportunities |
| Logical lifecycle model | Complete as proposed logical design | 46 extension objects, 186 key fields, 238 states, explicit grains and parents |
| Persona simulation | Substantially represented | Screen gates, manager new-hire row scope, minimized privacy/audit prospect identity, disabled mutations |
| Production identity/authorization | Blocker | No IdP, MFA, server session, object/row/field/purpose enforcement or negative API evidence |
| Production persistence/integration | Blocker | No Salesforce metadata, BFF/API, database, private file/form service or provider connection |
| Security/privacy/operations/pilot | Blocker | No approved threat/privacy flows, SLO/observability, recovery exercise, cutover/rollback, legal approval or pilot evidence |

## What the wireframe closes

- The accepted candidate no longer disappears into a generic “handoff.” Reviewers can follow identity through pre-hire, pending-worker correction and eventual employee conversion.
- Onboarding is no longer a single dashboard card. It has versioned templates, stages, task definitions/instances, owners, dependencies, forms, documents, provisioning and exceptions.
- New-hire work is separated from internal work. The portal exposes only assigned tasks and safe status; internal HRIS/provisioning details remain internal.
- Manager, IT and facilities work is visible as independently owned request grains, including blocked dependencies and delivery status.
- Progress analytics declares plan/exception grains and zero-denominator semantics rather than presenting unqualified percentages.
- Pre-application talent work now has prospect, community, campaign, membership, consent/suppression and delivery logic rather than a generic candidate list.
- Channel distribution is represented as a reconciled ledger with posting version, external ID, status, applications, qualified count, spend and retry.
- Internal mobility represents roles, gigs, projects and mentorship with eligibility/visibility and manager-notification policy.
- Identity, integration, persistence and security requirements are rendered as explicit control surfaces with honest “not implemented” states.

## Controlled limitations

1. All records are deterministic fictional fixtures and reset on refresh. There is no durable persistence.
2. The persona switcher is a review control, not authentication or production authorization.
3. Form and signature completion is simulated; no restricted value, file or provider receipt is stored.
4. HRIS, IGA, ITSM, e-signature, calendar and distribution connections are synthetic contracts only.
5. The 46-object extension is a logical decomposition. It is not an approved Salesforce schema and may map to fewer/more physical constructs.
6. No real email, calendar event, account, entitlement, badge, shipment, worker or employee is created.
7. Automated rendering/contract tests do not replace manual accessibility, moderated usability, security testing, legal approval or pilot evidence.
8. Existing `AUD-001`–`AUD-018` findings remain formally Open until their accountable reviewer closes them with dated evidence; wireframe remediation does not close production findings.

## Production blockers in required order

1. Approve object grains, physical dispositions, fields, relationships, retention and migration mapping for the core plus lifecycle extension.
2. Implement production candidate/new-hire/workforce/workload identity and server-side object/row/field/purpose authorization.
3. Implement Salesforce/BFF/database/private-document persistence with transaction, encryption, audit, backup and restore evidence.
4. Implement and certify HRIS, e-sign, IGA/ITSM/facilities, calendar, communication and distribution interface contracts with retry/reconciliation.
5. Complete threat model, privacy data flows/DPIA where required, abuse cases, penetration testing, secrets/key rotation and incident response.
6. Define SLOs, telemetry, alerts, reconciliation operations, support/on-call ownership, continuity, cutover, rollback and portability.
7. Complete manual accessibility/assistive-technology testing, moderated candidate/new-hire/admin usability, content/legal review and training.
8. Run a bounded nonproduction qualification and approved pilot with baseline, adoption, outcome and stop-condition evidence.

## Evidence sources

- `src/data/onboarding.ts`, `src/data/talentGrowth.ts`, `src/data/lifecyclePlatform.ts`
- `src/components/OnboardingWorkspace.tsx`, `src/components/NewHirePortal.tsx`, `src/components/TalentGrowthWorkspace.tsx`, `src/components/PlatformControlWorkspace.tsx`
- `src/test/platformV2.test.tsx`
- `artifacts/v2.0/readiness.json`, `routes.json`, `data-model-extension.json`
- [MATRIX-v2.0.md](MATRIX-v2.0.md), [DATA-MODEL-v2.0.md](DATA-MODEL-v2.0.md), [PRD.md](PRD.md)

Local verification is complete: `pnpm verify` passes the artifact audit, TypeScript, 67 unit/component/contract/automated-accessibility tests and the production build. The build emits the existing bundle-size advisory; code splitting remains a performance improvement, not a wireframe correctness failure. Commit, CI/security, browser/E2E and deployment evidence must be appended only after each action completes successfully.
