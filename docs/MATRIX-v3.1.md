# Recruitment System v3.1 — Demo Journey and Business Data-Flow Matrix

Status: synthetic demo-journey wireframe. No authentication, database, API, Salesforce metadata, provider effect, approved physical schema or real data exists.

## Reconciled inventory

| Dimension | Count | Contract |
| --- | ---: | --- |
| Actor personas | 13 | Candidate/accepted-new-hire plus 12 internal roles; external providers shown in a DFD are entities, not product personas |
| Internal roles | 12 | Existing least-privilege persona model remains unchanged |
| Product + demo screen contracts | 66 | 62 inherited product screens plus command center, journey catalogue, DFD detail and session evidence |
| Route declarations / functional destinations | 160 / 158 | Four demo routes added; root and catch-all remain redirects |
| Business-use-case DFDs | 12 | `DFD-01` through `DFD-12` |
| Showcase journey units | 84 | `JRN-001` through `JRN-084` |
| Guided actor/process handoffs | 61 | Five or six ordered steps per DFD |
| Audience demo packs | 8 | Executive, recruiter, candidate, onboarding, high-volume, ecosystem, partner and governance |
| Generic object families / CRUD pages | 138 / 552 | Existing complete object surface is unchanged |
| Logical concepts / approved physical objects | 175 / 0 | Logical data-flow references do not approve a database or Salesforce schema |

## Demo routes

| Screen | Route | Purpose |
| --- | --- | --- |
| `UI-DEMO-001` | `/demo` | Select audience pack, use case, happy/exception variant and deterministic launch |
| `UI-DEMO-002` | `/demo/catalog` | Search/filter all 84 journey units and open their DFD or live wireframe route |
| `UI-DEMO-003` | `/demo/flows/:useCaseId` | Inspect actor → named data flow → process → governed store → outcome and launch the guided journey |
| `UI-DEMO-004` | `/demo/evidence` | Inspect browser-memory action receipts for the current demo session |

The persistent presenter rail is a cross-cutting interaction layer, not another screen. It remains available on product routes while a demo is active and exposes the current actor, process, input/output movement, expected receipt, previous step, live step, next handoff, DFD and deterministic reset.

## Business-use-case data-flow matrix

| DFD | Business use case | Journey IDs | Units | Main actors | Primary logical stores | Demonstrated outcome |
| --- | --- | --- | ---: | --- | --- | --- |
| `DFD-01` | Candidate attraction, events and account access | `JRN-001–008` | 8 | Candidate, recruiting marketing, candidate identity | Public job projection; candidate relationship; consent/session ledger | Consented saved/alert/event relationship and recoverable session |
| `DFD-02` | Candidate application and self-service | `JRN-009–015` | 7 | Candidate, recruiter, coordinator, support | Candidate identity; application ledger; private documents | Submitted application with provenance and safe next actions |
| `DFD-03` | Assessments, references and regulated screening | `JRN-016–020` | 5 | Candidate, providers, integrity reviewer, privacy/legal | Candidate-task ledger; restricted evidence; human-decision audit | Versioned evidence, redress and attributed human outcome |
| `DFD-04` | Requisition, job, opening and publication | `JRN-021–025` | 5 | Hiring manager, recruiter, approver, distributor | Workforce demand; recruiting configuration; distribution ledger | Approved demand becomes a reconciled posting and opening |
| `DFD-05` | Candidate and application operations | `JRN-026–031` | 6 | Recruiter, coordinator, support, automation operator | Canonical candidate; application ledger; operational projection | Attributable stage, ownership, activity and recovery work |
| `DFD-06` | Interviews, decisions, offers and hire handoff | `JRN-032–037` | 6 | Candidate, coordinator, interviewer, manager, approver, HRIS | Scheduling; independent evidence; offer/handoff ledger | Accepted versioned offer becomes a linked pre-hire |
| `DFD-07` | Talent channels and recruiting at scale | `JRN-038–045` | 8 | Talent/campus, agency, referrer, employee, recruiter | Recruiting CRM; channel ownership; cohort operations | Governed channel relationships without automated candidate judgment |
| `DFD-08` | Accepted candidate through day 90 onboarding | `JRN-046–054` | 9 | New hire, People Ops, manager, HRIS, benefit/learning services | Onboarding plan; private documents; HRIS staging | Ready worker with continuous versioned milestone evidence |
| `DFD-09` | Manager, partner and fulfilment portals | `JRN-055–063` | 9 | Manager, IT, facilities, interviewer, buddy, agency, referrer, employee | Role-scoped work; provisioning; relationship/access ledger | Function-owned readiness reconciles under least privilege |
| `DFD-10` | Worker lifecycle transitions | `JRN-064–071` | 8 | People Ops, HRIS, manager, IT, facilities | Worker lifecycle; destination queues; audit archive | Effective change has impact, compensation and reconciliation evidence |
| `DFD-11` | Administration, identity and integration control | `JRN-072–079` | 8 | Platform/config admins, approver, privacy/legal, auditor | Identity control; configuration; audit archive | Privileged change is scoped, versioned, testable and reversible |
| `DFD-12` | Analytics, reporting, data readiness and recovery | `JRN-080–084` | 5 | Executive, recruiting ops, steward, automation operator, auditor | Semantic metrics; report delivery; recovery/audit | Explainable metrics, drill-through evidence and owned recovery |

## Audience-pack matrix

| Pack | Audience | Target duration | Ordered flow set |
| --- | --- | --- | --- |
| Executive overview | Leadership | 10–12 min | `DFD-04 → 05 → 06 → 08 → 12` |
| Recruiter workday | Recruiting teams | 25 min | `DFD-04 → 05 → 06` |
| Candidate experience | Candidates and product | 15 min | `DFD-01 → 02 → 03 → 06` |
| New-hire onboarding | HR and People Operations | 20 min | `DFD-08 → 09 → 10` |
| High-volume recruiting | Campus and volume teams | 15 min | `DFD-07 → 03 → 12` |
| Hiring ecosystem | Managers, IT and facilities | 15 min | `DFD-06 → 09 → 10` |
| Partner channels | Agencies, referrers and talent teams | 15 min | `DFD-07 → 09` |
| Governance and recovery | Security, legal, admin and audit | 20 min | `DFD-11 → 12 → 03` |

## Data-flow notation and behavior

Each DFD row is a level-one business interaction:

`external entity → named input data → business process → named output or exception → governed logical store`

Each process declares its actor, live route, facilitator instruction, data input, data output, logical store, expected evidence receipt and exception/recovery result. Selecting the process opens the corresponding wireframe route and preserves the active DFD in the presenter rail.

The diagrams are business use-case diagrams. They do not represent deployed network trust boundaries, Salesforce object metadata, API orchestration, physical databases or provider architecture.

## Demo-state and evidence contract

| Capability | Wireframe behavior |
| --- | --- |
| Deterministic launch | Resets product memory, selects the mapped `SCN-*` state, assigns the first internal persona when relevant and opens the first route |
| Persona handoff | The next process updates the internal demo persona when a role mapping exists; candidate/new-hire/partner portals remain their distinct shells |
| Shared state | Selected scorecard, offer, availability, document, provisioning and pending-worker steps update inherited browser-memory projections |
| Happy vs exception | Every DFD displays its expected output or its explicit exception/recovery path |
| Receipt | `DRE-*` captures DFD, step, actor, process, result, logical store, variant and deterministic demo time |
| Restart | Reloads the use-case fixture and returns to step one without an external effect |
| Communication preview | Every use case identifies relevant email/SMS/calendar/document-style previews and labels them unsent |

## Automated validation evidence

| Validation | Result |
| --- | ---: |
| Source-scanned buttons / links | 294 / 303 |
| Static interaction defects | 0 |
| Unit, component, contract and automated axe tests | 116 passed |
| Desktop/mobile browser tests | 67 passed, 1 intentional duplicate-crawl skip |
| Rendered internal destinations crawled | 1,056 |
| Silent redirects, missing-main destinations or browser errors | 0 |

## Feature-gap gate

The next feature backlog may be defined only after a selected demo pack is rehearsed. Each rehearsal must record audience, starting fixture, actor, trigger, steps, state changes, downstream objects, denial, exception, recovery, evidence, dashboard impact and reset result.

Findings are classified as:

1. presentation/navigation issue;
2. existing capability requiring stitching;
3. expected synthetic wireframe limitation;
4. missing wireframe screen, data, rule or interaction;
5. production-only implementation or approval requirement.

Only class 4 enters the next wireframe feature backlog. Database, API, real identity, provider, message, signature and Salesforce implementation remain class 5 until the product moves beyond the GitHub Pages wireframe.
