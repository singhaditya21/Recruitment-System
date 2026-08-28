# Recruitment System v2.1 — Authoritative Surface Matrix

Status: synthetic surface-complete recruitment and onboarding wireframe release candidate. This ledger does not describe a deployed Salesforce org, production identity system, backend, provider integration or approved physical schema.

## Reconciled counts

| Dimension | v2.1 count | Meaning |
| --- | ---: | --- |
| Personas | 13 | One candidate/accepted new hire plus 12 internal operating roles |
| Screen contracts | 25 | 4 candidate, 13 internal HR/platform and 8 new-hire contracts |
| Route declarations | 53 | Exact `Route` declarations in `src/App.tsx`, including two redirects |
| Functional destinations | 51 | Route declarations excluding root and wildcard redirects |
| Routed object families | 138 | 92 core recruitment plus all 46 lifecycle-extension families |
| Generated object pages | 552 | List, New, Detail and Edit for each routed family |
| Generated object records | 1,656 | 12 deterministic records for each routed family |
| Workspace field contracts | 2,208 | 828 business plus 1,380 governance/provenance fields |
| Core atomic concepts | 129 | Inherited v1.9 authoritative recruitment concepts |
| Lifecycle extension objects | 46 | 28 onboarding, 7 talent relationship, 3 internal mobility and 8 platform |
| Combined canonical + lifecycle concepts | 175 | 129 plus 46; not a physical-schema count |
| Approved physical objects | 0 | No Salesforce/database schema approval exists |

The 2,208 workspace-field count is the uniform interactive page contract. The inherited 2,350-field v1.9 canonical model remains the deeper normalized recruitment model. They are different semantic layers and must not be added together or represented as an approved schema.

## Personas, populations and data points

| Persona | Primary population | Minimum necessary data | Restricted data excluded or masked | Mutation boundary |
| --- | --- | --- | --- | --- |
| Candidate / accepted new hire | Own applications, interview/offer, pre-hire plan and assigned tasks | Candidate-safe status, schedule, current offer, own profile/documents/tasks/journey | Internal feedback, disposition, other people, internal exceptions, private employee operations | Own application, availability/reschedule, offer response, forms/tasks and support |
| Recruiter | Assigned jobs, candidates, applications, talent populations and plans | Identity/contact, application evidence, funnel, outreach authority, plan state | Private tax/work authorization and unrelated restricted cases | Recruiting records, approved outreach and assigned plan work |
| Recruiting Coordinator | Supported logistics and onboarding populations | Schedule, contact, safe status, tasks, exceptions and sessions | Evaluation outside coordination need; private worker values | Logistics, messages, orientation and owned exceptions |
| Hiring Manager | Own openings/applications and effective reports/new hires | Role criteria, candidate briefing, decision evidence, manager tasks/goals/check-ins | Private forms, compensation outside approval, HRIS payload and unrelated people | Own job input, decisions and manager readiness work |
| Interviewer | Time-bounded assigned sessions | Minimum candidate briefing, agenda, rubric and own evidence | Peer feedback until policy permits, offer, compliance and unrelated records | Own scorecard evidence only |
| Offer Approver | Assigned current offer versions | Version, compensation, conditions, approvals and evidence | Other candidates and superseded action rights | Approve, reject or return current version |
| Candidate Support | Open candidate/new-hire support relationships | Candidate-safe status, communication, accessibility/accommodation routing | Hiring evidence, worker payload, legal/private case content | Support case and safe communication |
| Application Integrity Reviewer | Assigned integrity/redress cases | Case evidence, policy version, reason and review history | Unrelated recruitment and onboarding data | Human review and redress outcome |
| Configuration Admin | Templates, programs, rules and metadata | Version, populations, stages/tasks, dependencies and impact | Person/private submissions | Draft/version/simulate approved configuration |
| Platform Admin | Connections, access and operational metadata | Connection state, schema/version, service identity and incident evidence | Business content unless separately entitled | Approved platform configuration preview |
| Privacy & Legal | Purpose-bound request/policy/compliance population | Notice/consent, retention, restriction, compliance evidence and audit | General operations; identity masked where purpose permits | Legal/privacy/compliance case decision |
| HRIS Operator | Pending workers, conversion and reconciliation | Destination-required identity/employment fields, validation and provider state | Recruiting feedback and prospect data | Correct, validate, replay and reconcile transfer |
| Auditor | Time-, purpose-, row- and field-scoped evidence | Immutable/minimized events, versions, decisions and access evidence | Direct identity/contact and private payload unless explicitly approved | None |

Production authorization must combine persona, organization, object, row relationship, field/data group, purpose and effective time. The browser switcher is only an inspectable policy simulation.

## Screen contracts

| ID range | Count | Surface |
| --- | ---: | --- |
| `UI-CAN-001`–`004` | 4 | Careers, job detail, guided application and candidate hub with application/interview/offer/profile/message views |
| `UI-HR-001`–`010` | 10 | Action center, jobs, candidates, applications, interviews, scorecards/decisions, automation, governance, analytics and reports/object studio |
| `UI-HR-011` | 1 | Onboarding overview, new hires, templates, programs, exceptions, compliance, provisioning, orientation/check-ins and analytics |
| `UI-HR-012` | 1 | Talent CRM, communities/campaigns, distribution, mobility, events, referrals and agencies |
| `UI-HR-013` | 1 | Identity, integrations, data architecture and security readiness |
| `UI-NHR-001`–`008` | 8 | Home, tasks, task/form detail, documents, profile, day one, help/privacy and through-day-90 journey |

## Route additions over v2.0

| Route | Grain and purpose |
| --- | --- |
| `/preboarding/journey` | One pre-hire’s milestone, support, learning, goal and 30/60/90 check-in projection |
| `/hr/onboarding/programs` | Lifecycle program/version/population library and simulated builder |
| `/hr/onboarding/compliance` | One owned compliance case per subject/requirement occurrence |
| `/hr/onboarding/experience` | Orientation-session and check-in operating views |

Events, referrals and partner views use the inherited `/hr/talent/:talentView` route pattern. Exact routes and screen IDs are machine-readable in `artifacts/v2.1/routes.json`.

## Object/page and data-point matrix

| Domain | Families | Pages | Seeded rows | Business fields | Governance fields | Total fields |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Core recruitment/navigation | 92 | 368 | 1,104 | 552 | 920 | 1,472 |
| Lifecycle extension | 46 | 184 | 552 | 276 | 460 | 736 |
| Total | 138 | 552 | 1,656 | 828 | 1,380 | 2,208 |

Every family includes lifecycle/state, owner, organization/row scope, classification, retention, provenance/source, last update, quality status and role visibility plus six domain-specific business attributes. First-class forms remain deeper for Job, Candidate and Application; complex lifecycle families receive generated forms and are explicitly tracked for bespoke workflow depth.

## Recruitment-to-onboarding journey coverage

| Journey | Current v2.1 coverage | Depth |
| --- | --- | --- |
| Workforce request, requisition, opening and job | Dense lists/details plus first-class New/Edit Job and generic related-object pages | First-class core; approval/publishing still previewed |
| Attraction, CRM and distribution | Prospects, communities, campaigns, channels, events, referrals, agencies and mobility | Operational workspaces; registration/reward/agency submission still preview-level |
| Candidate and application | First-class List/New/Detail/Edit, guided apply, hub, privacy and communication | First-class synthetic |
| Assessment, reference and background | Declared objects, data and generic CRUD pages; status visible in application/governance areas | Metadata-driven; needs bespoke candidate/internal journeys |
| Interview and decision | Scheduling/availability, assignments, evidence, readiness, candidate confirmation/reschedule/accommodation | Substantial; high-volume scheduling and full cancellation chains remain |
| Offer | Version/approval data plus candidate preview, accept/decline confirmation and receipt | Substantial; e-sign/provider/revision recovery remain simulated |
| Transition | Candidate/Application/PreHire/PendingWorker/Employee lineage, correction and replay views | Substantial synthetic |
| Plan/program/task | Templates, versions, stages, tasks, eight program types, assignment and builder preview | Substantial synthetic |
| Forms, documents and compliance | New-hire tasks/documents/signature preview plus 24-case compliance ledger | Substantial; country-specific and provider failure depth remains |
| Provisioning and readiness | 72 manager/IT/facilities requests, exceptions and analytics | Substantial; separate fulfilment personas/portals remain |
| Orientation and first 90 days | 16 sessions, 48 check-ins and eight new-hire milestones | First-class wireframe baseline |
| Rehire, crossboarding, contingent, internship, relocation, offboarding | Program variants and all extension-object CRUD pages | Program-level baseline; bespoke journeys remain |

## Deterministic seed matrix

| Family | Count |
| --- | ---: |
| Core jobs / candidates / applications / interviews / assignments | 48 / 320 / 640 / 192 / 160 |
| Generated object records | 1,656 |
| New hires / templates / flagship tasks | 36 / 8 / 8 |
| Exceptions / provisioning requests / new-hire documents | 18 / 72 / 6 |
| Lifecycle programs / compliance cases / orientation sessions / check-ins | 8 / 24 / 16 / 48 |
| New-hire journey milestones | 8 |
| Prospects / communities / campaigns / distributions / internal opportunities | 120 / 8 / 6 / 24 / 8 |
| Career events / referrals / agency partners | 12 / 24 / 8 |

All names, employers, contacts, identifiers and providers are fictional. Inputs and actions reset on refresh; seed volume supports state and navigation review, not production scale or performance claims.
