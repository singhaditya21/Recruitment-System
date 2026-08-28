# Recruitment System v1.7 coverage matrix

This is the countable wireframe contract as of August 28, 2026. It separates reusable templates from instantiated routes and separates business fields from shared governance metadata.

## Count ledger

| Dimension | Current count | Interpretation |
| --- | ---: | --- |
| Human personas | 13 | 1 candidate plus 12 internal roles |
| Canonical screen families | 14 | 4 candidate plus 10 internal families |
| Functional hash-route patterns | 24 | 5 candidate plus 19 internal patterns; redirects excluded |
| Logical object families | 92 | Governed object catalogue |
| Expanded business concepts | 111 | Slash-combined concepts expanded; not an additional physical schema |
| Object page templates | 4 | List, New, Detail and Edit |
| Routed object-page instances | 368 | 92 families × 4 templates |
| Seeded generic object records | 276 | 3 deterministic records per family |
| Logical field contracts | 1,472 | 552 domain-specific business fields plus 920 governance/provenance fields |
| Analytics application rows | 324 | Complete supported filter cross-product fixture |
| Global filter combinations | 600 | 3 windows × 4 job choices × 5 source choices × 10 stage choices; 600 populated |
| Dynamic dashboards | 11 | 10 application-operating views plus a separately sourced Data Readiness view |
| Saved reports | 6 | Certified/draft seeded definitions with role audiences |

The 368 object pages are not 368 separately designed screens. They are four accessible, metadata-driven page contracts instantiated for each of the 92 logical families.

## Screen and route matrix

| ID | Persona surface | Screen family | Route pattern(s) | Key states |
| --- | --- | --- | --- | --- |
| UI-CAN-001 | Candidate | Careers/search | `#/careers` | populated, filtered, empty, recovery |
| UI-CAN-002 | Candidate | Public job detail | `#/careers/jobs/:publicId` | available, policy-safe, not found, return |
| UI-CAN-003 | Candidate | Guided application | `#/apply/:publicId/*` | incomplete, validation blocked, review, simulated complete |
| UI-CAN-004 | Candidate | Candidate hub | `#/my-applications`, `#/my-applications/:id` | status, task, message, privacy/profile, recovery |
| UI-HR-001 | Internal | Action center | `#/hr/action-center` | owned queue, filtered, empty, escalation |
| UI-HR-002 | Internal | Job/opening | `#/hr/jobs`, `#/hr/jobs/:jobId` | list, readiness, blocked publication, preview |
| UI-HR-003 | Internal | Application cockpit | `#/hr/applications`, `#/hr/applications/:applicationId` | list, detail, blocked/ready transition, operational tabs |
| UI-HR-004 | Internal | Interview/scheduling | `#/hr/interviews`, `#/hr/interviews/:interviewId` | request, availability, confirmed, cancel/no-show recovery |
| UI-HR-005 | Internal | Scorecard/evidence | `#/hr/assignments`, `#/hr/assignments/:assignmentId` | assigned, blinded, validation, submitted |
| UI-HR-006 | Internal | Decision/offer/handoff | `#/hr/decisions`, `#/hr/decisions/:applicationId` | blocked, approval, supersession, handoff recovery |
| UI-HR-007 | Internal | Automation/integration | `#/hr/automations` | active, collision, failed, replay/reconciled |
| UI-HR-008 | Internal | Governance | `#/hr/governance` | privacy, policy, audit, object-data studio |
| UI-HR-009 | Internal | Analytics and reports | `#/hr/analytics`, `#/hr/reports` | filtered, N/A, drill-through, saved/scheduled/delivery evidence |
| UI-HR-010 | Internal | Object workspace | `#/hr/objects`, `#/hr/objects/:objectSlug`, `#/hr/objects/:objectSlug/new`, `#/hr/objects/:objectSlug/:recordId`, `#/hr/objects/:objectSlug/:recordId/edit` | matrix, scoped list, new, detail, edit, denial/not found |

## Persona and data-scope matrix

Navigation is only the first gate. Rows, identity, contact, evidence, compensation, accommodation, privacy, integrity and export use independent scope declarations.

| Persona | Authorized population | Identity | Contact | Decision evidence | Compensation | Privacy | Export |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Candidate | Own verified application only | own | own | candidate-safe status only | own offer only | own request | own portable copy |
| Recruiter | Owned/team-assigned requisitions and applications | full | full | summary | band | case status | governed |
| Recruiting Coordinator | Scheduling/communication work | full | full | none | none | none | aggregate only |
| Hiring Manager | Managed requisitions | full | masked | summary | band | none | aggregate only |
| Interviewer | Assigned sessions/scorecards only | masked | none | assigned only | none | none | none |
| Offer Approver | Current approval subjects only | masked | none | summary | full | none | none |
| Candidate Support | Owned recovery/communication cases | full | full | none | none | case status | none |
| Application Integrity Reviewer | Assigned integrity cases | masked | none | none | none | none | none |
| Configuration Admin | Configuration/impact projections | none | none | none | none | none | aggregate only |
| Platform Admin | Minimized platform troubleshooting facts | masked | none | none | none | case status | aggregate only |
| Privacy & Legal | Verified privacy/policy scopes | full | masked | summary | band | full | governed |
| HRIS Operator | Accepted-offer/handoff subjects | full | masked | none | full | none | none |
| Auditor | Approved read-only evidence scope | masked | none | summary | band | case status | governed |

## Object page contract

Every logical object family receives the same four-state contract:

| Page | Required behavior | Permission boundary | Seed/evidence |
| --- | --- | --- | --- |
| List | Role-scoped collection, total-vs-visible count, state/version/owner, empty recovery | Object read plus row predicate | Three records per family; narrowed roles see one or none |
| New | Required record name, permitted dynamic fields, state defaults, validation, cancel | Object create plus field write | Memory-only create and generated synthetic ID |
| Detail | Readable fields only, business/governance labels, state/version, history, relationships/commands | Object read, row predicate and field read | Values and immutable-looking history fixture |
| Edit | Current expected version, permitted fields only, validation, cancel/save | Object update plus row predicate and field write | Memory-only version increment and audit entry |

The wireframe proves route, state and permission semantics. It does not prove Salesforce object/field API names, sharing calculations, encryption, limits, transaction boundaries or production persistence.

## Current readiness statement

The synthetic wireframe layer is implementation-complete for the 92 × 4 object-page contract, supported analytics filter coverage, explicit N/A denominator behavior, role/row/field projection, and governed reporting previews. Production readiness is still blocked by accountable decisions, Salesforce/BFF/IdP and provider implementation, security/legal validation, operational exercises, manual accessibility/moderated usability, and pilot evidence.
