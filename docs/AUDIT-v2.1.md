# Recruitment System v2.1 — Surface-Completeness Audit

Audit date: August 28, 2026  
Scope: local v2.1 synthetic wireframe release candidate  
Conclusion: v2.1 materially improves the wireframe into a broad recruitment-to-day-90 product review surface. It is not production ready, and “all objects have pages” is not equivalent to “all objects have bespoke end-to-end journeys.”

## Executive outcome

| Layer | Status | Evidence-backed conclusion |
| --- | --- | --- |
| Route and object reachability | Complete for the declared wireframe | 25 screen contracts, 53 route declarations/51 functional destinations; 138 object families each have List/New/Detail/Edit coverage |
| Seed density | Complete for synthetic review | 1,656 generated object rows plus dense core and lifecycle fixtures exercise collections, states and persona projections |
| Recruitment core | Substantial | First-class Job/Candidate/Application CRUD, candidate apply/hub, interview/decision/offer surfaces, analytics and reporting are inherited and extended |
| Candidate interview/offer self-service | Substantial new coverage | Confirmation, reschedule request, accommodation support and version-bound offer response with a synthetic receipt |
| Onboarding orchestration | Substantial | Programs, templates, tasks, exceptions, compliance, provisioning, orientation, check-ins and progress views are inspectable |
| New-hire experience | Substantial | Eight routes now span home/tasks/forms/documents/profile/day one/help and a continuous journey through day 90 |
| Talent attraction/ecosystem | Substantial | CRM, communities, campaigns, distribution, mobility, events, referrals and agency partners are represented |
| Complex-object journey depth | Partial | All families have generic CRUD, but several regulated, provider-backed and multi-party families lack bespoke stateful workflows |
| Production application | Not implemented | No authentication, server authorization, persistence, API/BFF, Salesforce metadata, provider integration or approved physical schema |
| Operational/legal assurance | Not evidenced | Manual accessibility/usability, threat/privacy approval, SLOs, recovery, legal content approval and pilot evidence remain open |

## What improved in v2.1

1. **Lifecycle objects are no longer catalogue-only.** All 46 lifecycle extension families join the 92 core families in the interactive object workspace. Each now exposes role-aware List, New, Detail and Edit states with deterministic records and field contracts.
2. **Candidate control extends beyond status.** The candidate hub exposes interview logistics, confirmation, reschedule and accommodation paths plus immutable-version offer review and a deliberate response confirmation.
3. **Onboarding is segmented by journey.** The program library distinguishes new hire, manager addendum, rehire, crossboarding, contingent, internship, relocation and offboarding rather than forcing one template onto every population.
4. **Compliance becomes owned operational work.** Twenty-four cases expose subject, requirement, jurisdiction, owner, due date, state and masked identity behavior instead of reducing compliance to a generic task checkbox.
5. **The experience continues after day one.** Sixteen orientation sessions, 48 check-ins and an eight-milestone new-hire journey add support network, learning, goals and 30/60/90 continuity.
6. **The attraction model now includes ecosystem actors.** Career events, referrals and agency partners sit alongside prospects, communities, campaigns and distribution.
7. **Claims and counts reconcile.** The release distinguishes 138 routed families, 175 canonical-plus-lifecycle concepts, 2,208 interactive workspace fields, the inherited 2,350-field canonical model and zero approved physical objects.

## Competitive design audit

| Real-world pattern | First-party benchmark | v2.1 response | Remaining gap |
| --- | --- | --- | --- |
| Structured interview plans, automation, self-scheduling and scorecards | [Greenhouse Interviewing and Decision Making](https://www.greenhouse.com/interviewing-decision-making) | Existing structured evidence plus candidate confirmation/reschedule/accommodation | Full multi-party reschedule/cancel/no-slot recovery and high-volume scheduling |
| Candidate engagement, high-volume, SMS, internal mobility, evergreen requisitions and job alerts | [Workday Talent Acquisition](https://www.workday.com/en-us/products/talent-management/talent-acquisition.html) | CRM, campaigns, mobility, events/referrals/agencies and distribution | Evergreen/campus flows, job alerts, saved jobs, SMS preference center and bulk operations |
| Personalized candidate-to-worker preboarding | [Workday preboarding and onboarding](https://doc.workday.com/admin-guide/en-us/human-capital-management/recruiting/onboarding-experience/concept--preboarding-and-onboarding.html?toc=3.14.7) | Separate PreHire identity, plan/program assignment and purpose-limited new-hire portal | Production identity binding, secure forms and HRIS correction proof |
| Personalized journeys, e-signatures, 30/60/90 plans, crossboarding/offboarding | [SAP SuccessFactors onboarding features](https://www.sap.com/products/hcm/employee-onboarding/features.html) | Program variants, forms/document/signature previews, day-90 journey | Bespoke crossboarding/offboarding/rehire experiences and country content packs |
| Attribute-driven workflows, provisioning and lifecycle automation | [Rippling workflows](https://www.rippling.com/en-GB/platform/workflows) and [identity lifecycle management](https://www.rippling.com/products/it/identity-access-management) | Population rules, provisioning requests, dependencies, exceptions and reconciliation designs | Production IGA/ITSM/service integration, access certification and deprovisioning execution |

The wireframe uses these patterns as coverage benchmarks only. It does not copy vendor UI, source code, trademarks, confidential configuration or customer data.

## Remaining wireframe backlog

### High — blocks a genuinely deep “full wireframe” claim

| ID | Gap | Required improvement |
| --- | --- | --- |
| WF-201 | Complex lifecycle objects use generated CRUD more often than purpose-built journeys | Create bespoke create/edit/detail and action flows for compliance, assessment, reference, background/adverse action, signature, pending worker, provisioning, no-show and start-date change |
| WF-202 | Assessment/reference/background candidate experience is fragmented | Add candidate-safe assignment, consent/notice, completion, status, expiry, dispute/redress and support journeys; keep vendor/internal evidence separated |
| WF-203 | Attraction conversion is shallow | Add saved jobs, alerts, event registration/attendance, referral submission/reward and agency submission/ownership/fee/duplicate logic |
| WF-204 | High-volume recruiting is not represented | Add evergreen requisitions, bulk invitation/scheduling with bounded controls, campus cohorts, hiring events, walk-in/QR flows and exception queues |
| WF-205 | Supporting operators are not distinct experiences | Add scoped shells for manager, buddy, IT, facilities, agency and referrer work rather than relying only on internal tabs/persona switching |
| WF-206 | Lifecycle variants stop at program cards | Build end-to-end rehire, crossboarding, contingent, internship, relocation and offboarding timelines including cancellations and compensating actions |

### Medium — important depth and trust improvements

| ID | Gap | Required improvement |
| --- | --- | --- |
| WF-207 | Geography is primarily English/US/California | Add locale, language, country, worker-type and work-location content/requirement variants without encoding legal conclusions into generic rules |
| WF-208 | New screens have limited destructive/failure-state coverage | Add expired offer, withdrawn reschedule, no available slot, duplicate referral, provider unavailable, abandoned form, stale version, concurrent edit, cancellation and retry states |
| WF-209 | Onboarding learning and experience are summaries | Add curriculum/session detail, enrollment, prerequisite, completion evidence, pulse-survey privacy/aggregation and safe escalation |
| WF-210 | Relationship and referral economics are thin | Add source ownership windows, duplicate credit, agency fee terms, payout eligibility, disputes, suppression and reconciliation |
| WF-211 | Visual accessibility evidence is automated-heavy | Complete keyboard-only, screen-reader, zoom/reflow, reduced-motion, high-contrast and moderated candidate/new-hire usability checks |
| WF-212 | Bundle size and visual regression coverage can improve | Split large workspace bundles and add deterministic screenshot baselines for all new desktop/mobile routes and critical states |

## Production blockers retained

The following are deliberately outside a GitHub Pages wireframe and remain blockers before any real data or pilot:

1. Approved physical Salesforce/database schema, API/event contracts and migration mapping.
2. Candidate, new-hire, workforce and service identity with server-side object/row/field/purpose authorization.
3. BFF/API, transactional persistence, private file/form storage, encryption, audit, backup and restore.
4. Certified HRIS, e-sign, background/assessment, calendar, communications, distribution, IGA/ITSM and facilities connections with retry/reconciliation.
5. Threat model, privacy flows/DPIA where required, abuse cases, penetration testing, secrets/key rotation and incident response.
6. SLOs, telemetry, alerts, reconciliation ownership, continuity, cutover, rollback and portability.
7. Manual accessibility, moderated usability, approved content/legal/policy decisions, training and bounded pilot evidence.

## Recommended v2.2 wireframe sequence

1. Bespoke assessment/reference/background/adverse-action and compliance journeys.
2. Events, job alerts, saved jobs, referrals and agency end-to-end conversion.
3. High-volume/campus/evergreen workflows and bounded bulk actions.
4. Separate manager/buddy/IT/facilities/agency/referrer portals.
5. Rehire/crossboarding/contingent/relocation/offboarding journey depth.
6. Multi-country/locale variants and exhaustive failure/recovery states.
7. Manual accessibility/usability and full visual-regression evidence.

## Evidence sources

- `src/data/objectCatalog.ts`, `src/data/onboarding.ts`, `src/data/talentGrowth.ts`, `src/data/lifecyclePlatform.ts`
- `src/components/CandidatePortal.tsx`, `src/components/NewHirePortal.tsx`, `src/components/OnboardingWorkspace.tsx`, `src/components/TalentGrowthWorkspace.tsx`, `src/components/ObjectWorkspace.tsx`
- `src/test/platformV2.test.tsx`, `src/test/readiness.test.ts`, `src/test/app.test.tsx`
- `artifacts/v2.1/readiness.json`, `artifacts/v2.1/routes.json`
- [MATRIX-v2.1.md](MATRIX-v2.1.md), [DATA-MODEL-v2.0.md](DATA-MODEL-v2.0.md), [PRD.md](PRD.md)

Local automated evidence is complete: `pnpm verify` passes the v2.1 artifact audit, TypeScript, 70 unit/component/contract/automated-accessibility tests and the production build; `pnpm test:e2e` passes 46 desktop/mobile Chromium journeys, including the candidate interview/offer center, through-day-90 journey, program/compliance/experience/talent workspaces and the 138-family object studio. The production build retains one bundle-size advisory. Commit, required GitHub checks and Pages deployment evidence are added only after each succeeds. Until then v2.1 remains a local release candidate and the existing public Pages build must not be assumed to contain these changes.
