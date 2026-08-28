# Recruitment System v1.8 coverage matrix

This is the countable wireframe contract as of August 28, 2026. It separates reusable templates from route patterns, separates identity from job consideration, and separates user-created records from workflow-generated records.

## Count ledger

| Dimension | Current count | Interpretation |
| --- | ---: | --- |
| Human personas | 13 | 1 candidate plus 12 internal roles |
| Canonical screen families | 14 | 4 candidate plus 10 internal families; dedicated candidate routes remain part of `UI-HR-003` |
| Functional hash-route patterns | 29 | 5 candidate plus 24 internal patterns; redirects excluded |
| Logical object families | 92 | Governed object catalogue |
| Expanded business concepts | 111 | Slash-combined concepts expanded; not an additional physical schema |
| Object page templates | 4 | List, New, Detail and Edit |
| Routed generic object-page instances | 368 | 92 families × 4 templates |
| Seeded generic object records | 1,104 | 12 deterministic records per family |
| Seeded core records | 1,360 | 48 jobs + 320 candidates + 640 applications + 192 interviews + 160 scorecard assignments |
| Core-plus-generic seeded records | 2,464 | Does not include the separate analytics/reporting fixtures |
| Logical field contracts | 1,472 | 552 domain-specific business fields plus 920 governance/provenance fields |
| Analytics application rows | 324 | Complete supported filter cross-product fixture |
| Global filter combinations | 600 | 3 windows × 4 job choices × 5 source choices × 10 stage choices; 600 populated |
| Dynamic dashboards | 11 | 10 application-operating views plus separately sourced Data Readiness |
| Saved reports | 6 | Certified/draft seeded definitions with role audiences |

The 368 generic object pages are not 368 separately designed screens. They are four accessible metadata-driven contracts instantiated for every logical family. The job, candidate and application routes add domain-specific forms because these are high-frequency transactional journeys.

## Screen and route matrix

| ID | Persona surface | Screen family | Route pattern(s) | Key states |
| --- | --- | --- | --- | --- |
| `UI-CAN-001` | Candidate | Careers/search | `#/careers` | populated, filtered, empty, recovery; published jobs only |
| `UI-CAN-002` | Candidate | Public job detail | `#/careers/jobs/:publicId` | available, policy-safe, not found, return |
| `UI-CAN-003` | Candidate | Guided application | `#/apply/:publicId/*` | incomplete, validation blocked, review, simulated complete |
| `UI-CAN-004` | Candidate | Candidate hub | `#/my-applications`, `#/my-applications/:id` | status, task, message, privacy/profile, recovery |
| `UI-HR-001` | Internal | Action center | `#/hr/action-center` | role queue, paged dense projection, filtered, escalation |
| `UI-HR-002` | Internal | Job/opening | `#/hr/jobs`, `#/hr/jobs/:jobId`, `#/hr/jobs/:jobId/:action` | list/search/filter/page, new Draft, detail, edit, readiness, publish preview |
| `UI-HR-003` | Internal | Candidate/application | `#/hr/candidates`, `#/hr/candidates/:candidateId`, `#/hr/candidates/:candidateId/:action`, `#/hr/applications`, `#/hr/applications/:applicationId`, `#/hr/applications/:applicationId/:action` | identity list/new/detail/edit; application list/new/detail/edit; duplicate/reference validation; role denial |
| `UI-HR-004` | Internal | Interview/scheduling | `#/hr/interviews`, `#/hr/interviews/:interviewId` | generated from scheduling request, availability, confirmed, cancel/no-show recovery |
| `UI-HR-005` | Internal | Scorecard/evidence | `#/hr/assignments`, `#/hr/assignments/:assignmentId` | generated from approved interview plan, assigned, blinded, submitted |
| `UI-HR-006` | Internal | Decision/offer/handoff | `#/hr/decisions`, `#/hr/decisions/:applicationId` | readiness-generated subject, blocked, approval, supersession, handoff recovery |
| `UI-HR-007` | Internal | Automation/integration | `#/hr/automations` | active, collision, failed, replay/reconciled |
| `UI-HR-008` | Internal | Governance | `#/hr/governance` | privacy, policy, audit, object/data studio |
| `UI-HR-009` | Internal | Analytics/reports | `#/hr/analytics`, `#/hr/reports` | filtered, N/A, drill-through, saved/scheduled/delivery evidence |
| `UI-HR-010` | Internal | Generic object workspace | `#/hr/objects`, `#/hr/objects/:objectSlug`, `#/hr/objects/:objectSlug/:recordId`, `#/hr/objects/:objectSlug/:recordId/:action` | matrix, scoped list/new/detail/edit, denial/not found |

## Core record creation matrix

| Record | Entry point | Who may create in the wireframe | Result | Invariant |
| --- | --- | --- | --- | --- |
| Job/requisition | `#/hr/jobs/new` | Recruiter, Hiring Manager | One in-memory `JOB-MEM-*` in Draft | Creation does not publish; approval and publication remain separate governed actions |
| Candidate identity | `#/hr/candidates/new` | Recruiter | One in-memory `PER-MEM-*` with source and notice evidence | Creation does not create an application; only `@example.test` contact data is accepted |
| Application | `#/hr/applications/new` | Recruiter | One in-memory `APP-MEM-*` linking an existing candidate and non-closed job | Candidate/job references must exist; duplicate active candidate-job consideration is rejected |
| Interview | Application scheduling workflow | No free-floating create form | Generated scheduling/session record | Participants, availability, timezone and constraints must be valid |
| Scorecard assignment | Approved interview plan | No free-floating create form | Generated interviewer assignment | Evidence cannot exist without an interview and assigned owner |
| Decision/offer/handoff | Application readiness/approval workflows | No free-floating create form | Generated governed subject/version/work | Required evidence, approvals and opening facts gate each downstream record |

Edit authority is narrower than route visibility: Recruiter/Hiring Manager may edit permitted job content but not lifecycle/publication state; Recruiter may edit candidate identity/provenance; Recruiter/Recruiting Coordinator may edit permitted application ownership/next-action fields but not its immutable candidate/job binding or workflow-owned stage. Navigation is not authorization.

## Persona and data-scope matrix

| Persona | Core population | Identity/contact | Create/edit boundary |
| --- | --- | --- | --- |
| Candidate | Own verified application | own/own | Candidate-safe tasks only; no internal core forms |
| Recruiter | All seeded recruiting records in this review fixture | full/full | Create/edit job, candidate and application |
| Recruiting Coordinator | Scheduling/communication applications and linked people/jobs | full/full | Edit application logistics only; no job/candidate create |
| Hiring Manager | Managed requisitions and associated applications | full/masked | Create/edit job; no candidate/application create |
| Interviewer | Assigned sessions/scorecards | masked/none | No core create/edit |
| Offer Approver | Offer-stage subjects | masked/none | Approval actions only |
| Candidate Support | Assigned recovery/communication applications and identities | full/full | No core create/edit |
| Integrity reviewer | Assigned screening/integrity cases | masked/none | No core create/edit |
| Configuration/Platform admin | Configuration/platform/minimized diagnostic data | none or masked/none | No core create/edit |
| Privacy & Legal | Verified privacy/policy subset and linked identities | full/masked | No recruiting core create/edit |
| HRIS Operator | Offer/hired handoff subjects | full/masked | No recruiting core create/edit |
| Auditor | Approved read-only fixture population | masked/none | No create/edit |

## Dense-data behavior

- Jobs, candidates and applications provide search, state filtering, 20-row pagination, deterministic empty recovery and route-bound detail.
- Candidate-facing careers show only Published jobs; Draft, Approved, Paused and Closed internal records cannot appear in the public collection.
- IDs are unique within each seeded family. Every application resolves to an existing candidate and job; every interview resolves to an application; every assignment resolves to an interview.
- Generated names, emails and phone values are synthetic. Emails use the reserved `example.test` domain; inputs reject other domains in the public prototype.
- Memory-created records survive route navigation within the current React session and disappear on reset/refresh. No browser storage, API, Salesforce or provider write is introduced.

## Current readiness statement

The v1.8 synthetic wireframe now covers dense collection behavior and object-specific New/Detail/Edit journeys for the three core user-created records. It also makes downstream creation provenance explicit. Production readiness remains blocked by accountable decisions, approved physical data dictionary, Salesforce/BFF/IdP/provider implementation, server-side sharing/FLS, security/legal validation, operational exercises, manual accessibility/moderated usability and pilot evidence.
