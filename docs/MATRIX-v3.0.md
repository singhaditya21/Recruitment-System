# Recruitment System v3.0 — Full-System Wireframe Matrix

Status: synthetic full-system interaction wireframe release candidate. No authentication, database, API, Salesforce metadata, provider effect, approved physical schema or real data exists.

## Reconciled inventory

| Dimension | Count | Definition |
| --- | ---: | --- |
| Actor personas | 13 | Candidate/accepted-new-hire identity plus 12 internal roles; portal shells are purpose-specific projections of those actors, not additional production identities |
| Internal roles | 12 | Recruiter, coordinator, hiring manager, interviewer, offer approver, candidate support, integrity reviewer, configuration admin, platform admin, privacy/legal, HRIS operator and auditor |
| Screen contracts | 62 | 12 candidate, 21 internal HR, 11 new-hire, 10 role-portal and 8 administration contracts |
| Route declarations / functional destinations | 156 / 154 | Root and catch-all redirects are excluded from the functional count |
| v3.0 route additions | 85 | Account, task/detail, support/privacy, onboarding depth, operations, portal and admin destinations added beyond v2.2 |
| Routed object families / generated CRUD pages | 138 / 552 | List, New, Detail and Edit contracts for 92 core plus 46 lifecycle families |
| Generated object rows / workspace fields | 1,656 / 2,208 | 12 deterministic rows and 16 inspectable field contracts per family |
| Canonical plus lifecycle concepts | 175 | 129 core atomic plus 46 lifecycle concepts; not physical objects |
| Additional v3.0 journey records | 336 | New deterministic account, event, cohort, portal, lifecycle and admin fixtures |
| Approved physical objects | 0 | Production schema remains intentionally unapproved |

The screen count is a durable interaction-contract count. Tabs, confirmation states, failure states, seeded record instances and the 552 generated object pages do not inflate it.

## Surface, screen and route matrix

| Surface | Screens | Main route families | New/detail/edit/action coverage |
| --- | ---: | --- | --- |
| Candidate/public | 12 | `/careers`, `/apply/*`, `/my-applications`, `/saved-jobs`, `/job-alerts`, `/events`, `/my-tasks`, `/support`, `/privacy-requests`, `/sign-in`, `/account-recovery` | Job detail; multi-step application; application detail; alert new/detail/edit; event detail/ticket/feedback; task detail; support new/detail/thread; privacy new/detail; magic-link expired/recovery |
| Internal HR/recruiting | 21 | `/hr/action-center`, `/hr/analytics`, `/hr/reports`, `/hr/jobs`, `/hr/candidates`, `/hr/applications`, `/hr/interviews`, `/hr/assignments`, `/hr/decisions`, `/hr/automations`, `/hr/governance`, `/hr/cases` | Core job/candidate/application List/New/Detail/Edit; route-bound interview/assignment/decision detail; operational actions with visible state, denial or receipt |
| Onboarding/talent operations | included in 21 HR | `/hr/onboarding/*`, `/hr/talent/*`, `/hr/events/*`, `/hr/high-volume/*`, `/hr/locales/*`, `/hr/recovery/*`, `/hr/agency-assignments/*`, `/hr/transitions/*` | New-hire detail; templates/programs/compliance/exceptions/provisioning/experience/analytics; event new/detail/edit/check-in; campaign planning/analytics/cohort; locale detail/edit; recovery detail; agency assignment new/detail/edit; transition new/detail/edit/impact |
| New hire | 11 | `/preboarding`, `/preboarding/tasks`, `/preboarding/documents`, `/preboarding/profile`, `/preboarding/day-one`, `/preboarding/journey`, `/preboarding/help`, `/preboarding/benefits`, `/preboarding/learning`, `/preboarding/country/:localeId` | Task/form detail, simulated signature/document action, profile correction, benefits detail/election, learning detail/progress, country-pack rendering, help/privacy |
| Manager | 2 | `/manager`, `/manager/recruiting/*` | Direct-report onboarding detail plus requisition, pipeline, interview-plan, debrief and decision work detail |
| IT | 1 | `/it`, `/it/requests/:requestId` | Function-scoped fulfilment detail, dependency, least-privilege delivery, retry and cancellation preview |
| Facilities | 1 | `/facilities`, `/facilities/requests/:requestId` | Site/desk/badge/access request detail and revocation/cancellation preview |
| Agency | 2 | `/agency/*` | Assignment list/detail plus submission list/new/detail, duplicate/ownership/fee and withdrawal states |
| Referrer | 1 | `/referrer`, `/referrer/new`, `/referrer/:id`, `/referrer/:id/dispute` | Candidate-permission submission, reward progress and dispute |
| Interviewer | 1 | `/interviewer`, `/interviewer/:id` | Assignment brief, conflict declaration, accessible logistics and versioned scorecard context |
| Buddy | 1 | `/buddy`, `/buddy/:id` | Purpose-limited onboarding goals, check-ins and escalation |
| Employee mobility | 1 | `/mobility`, `/mobility/:id`, `/mobility/:id/interest` | Opportunity detail, eligibility exception, privacy and expression-of-interest confirmation |
| Administration | 8 | `/admin`, `/admin/users/*`, `/admin/access-requests/*`, `/admin/notifications/*`, `/admin/content/*`, `/admin/integrations/*`, `/admin/imports/*`, `/admin/identity`, `/admin/privacy-requests/*` | User new/detail/edit; access decision; notification detail/deep-link; content new/detail/edit; integration detail/mapping/credentials; import new/detail/validate/correct; identity tabs; privacy execution detail |
| Generic object studio | 1 inherited internal contract | `/hr/objects`, `/hr/objects/:objectSlug`, `/hr/objects/:objectSlug/:recordId`, `/hr/objects/:objectSlug/:recordId/:action` | All 138 declared families receive role-aware List/New/Detail/Edit pages, safe not-found and access-denied states |

## Persona, role and data boundary matrix

| Actor/role | Population rule | Visible data | Allowed wireframe actions | Explicitly excluded |
| --- | --- | --- | --- | --- |
| Candidate / accepted new hire | Own relationship, applications, tasks, support/privacy cases and accepted-offer onboarding plan | Candidate-safe identity, job, status, notice, schedule, offer, form/document metadata and own submitted choices | Apply, save, configure alert, register/cancel, submit task/correction, request support/privacy, respond to offer, complete onboarding/election/learning previews | Internal ranking, peer feedback, provider report, hiring rationale, other people, destination credentials |
| Recruiter | Assigned portfolio, jobs and applications | Recruiting identity/evidence, pipeline, cases and operational work within scope | Create/edit core records, coordinate, communicate and route owned work | Broad platform credentials, unrelated privacy/restricted evidence |
| Recruiting coordinator | Assigned scheduling/communication population | Minimum candidate logistics, sessions, messages and work | Schedule, reconcile logistics, update allowed application fields | Hiring decision, compensation and unrelated evidence |
| Hiring manager | Effective requisition/team/direct-report relationship | Job outcomes, scoped candidate evidence, readiness and manager onboarding commitments | Requisition/edit, structured decision inputs, manager tasks and support | Private forms, restricted checks, other teams, admin controls |
| Interviewer | Assigned current interview | Minimum briefing, competency/rubric, logistics and own scorecard | Declare conflict, prepare and submit own structured evidence | Peer evidence before release, offer/compensation, unrelated candidates |
| Offer approver | Current version-bound approval assignment | Required terms, policy and approval context | Approve, reject or return current offer version | Candidate history unrelated to approval purpose |
| Candidate support | Candidate-authorized active support case | Minimized identity, issue and safe journey status | Thread, accessibility support, recovery routing | Hiring evidence, rank, restricted reports |
| Integrity reviewer | Assigned purpose-bound integrity/background/adverse case | Restricted case evidence and redress state | Review, correct, pause and record attributed outcome | Unrelated recruitment/employee populations |
| Configuration admin | Approved configuration/change assignment | Templates, rules, versions, simulations and safe aggregates | Draft, validate and activate simulated configuration | Standing candidate-content access or credential visibility |
| Platform admin | Owned platform work or time-bound incident grant | Metadata, queues, hashed/stable references and safe failure state | Users/access, identity policy, integrations, imports and reconciliation previews | Standing broad business-row, compensation or decision-evidence access |
| Privacy & Legal | Assigned purpose, jurisdiction or request | Minimum identity, consent, retention, legal hold, notice and execution state | Review policy, execute privacy workflow, manage restricted case | Unrelated recruiting work and unrestricted data browsing |
| HRIS operator | Approved pre-hire/pending-worker relationship | Identity linkage, effective dates, required handoff and destination receipts | Correct/replay/reconcile worker handoff and transitions | Recruiting evaluation outside handoff purpose |
| Auditor | Approved audit purpose, time and population | Minimized immutable evidence | Read-only inspection | Mutation, universal identity/content access |

Manager, IT, facilities, agency, referrer, interviewer, buddy and mobility shells are scoped experiences; they do not change the 13-actor identity count.

## Additional v3.0 data matrix

| Grain | Count | Minimum data points | Lifecycle/failure coverage |
| --- | ---: | --- | --- |
| Candidate task detail | 6 | Purpose, instructions, typed inputs, consent/notice, support, failure, recovery | Assessment, reference, background, pre-adverse, receipt and replacement |
| Recruiting event | 12 | Type, datetime, locale, capacity, registered/check-in/waitlist, owner, channel | Draft, ready, active, complete, blocked; create/edit/check-in/capacity recovery |
| High-volume cohort | 48 | Campaign, applications, capacity, ready, exceptions, owner, state, next action | Planning, capacity modelling, bounded invitation, cohort drill-through, conversion analytics |
| Agency assignment | 12 | Agency, job/openings, fee, dates, regions, submissions, owner, terms version | Draft, ready, active, blocked, complete; partner scope/edit/dispute |
| Referrer case | 16 | Candidate permission, relationship, job, status, reward, milestone, dispute | Submission, permission wait, progress, exclusion and dispute |
| Facilities request | 24 | New hire, site, item, due, dependency, status, access level, cancellation | Badge/desk/site provisioning, block, deliver, revoke/cancel |
| Manager recruiting item | 20 | Job, work type, candidate, due, blocker, evidence, status | Requisition, pipeline, interview plan, debrief and decision |
| Interviewer assignment | 12 | Candidate-safe identity, job, session/timezone, focus, conflict, scorecard version | Ready, active, blocked, complete; conflict and independent evidence |
| Buddy plan | 12 | New hire, buddy, start, location, goals, check-ins, status | Ready, active, blocked, complete; escalation |
| Mobility opportunity | 18 | Title/team/location, eligibility, interest state, visibility, skills, close date | Browse, eligibility review, consented interest and withdrawal-safe confirmation |
| Benefit election | 12 | Country, plan, coverage, effective date, deadline, status, evidence version | Draft, active, blocked and confirmed preview |
| Learning enrollment | 16 | Course/type, due, duration, accessibility, status, prerequisite | Not started through complete; prerequisite/recovery |
| Worker transition | 32 | Person, transition type, effective date, owner, affected systems, next action, failure | Rehire, crossboarding, relocation, contingent, offboarding, rescission, delay and no-show |
| Admin user | 20 | Identity, role, status, scope, last access, MFA, temporary expiry | Create/edit/review/revoke and orphan-access recovery |
| Notification | 24 | Category, priority, target, due, read state, minimized context | Read/unread and authorization-rechecked deep link |
| Content template | 24 | Channel, locale, audience, version, effective date, owner, variables | Draft, preview validation, approval/activation, delivery recovery |
| Integration configuration | 16 | Provider, direction, authentication state, mapping version, queue, reconciliation, failure | Test, mapping/credential draft, replay/reconcile |
| Import run | 12 | Type/file fixture, rows, valid/warnings/errors, owner, rollback | Stage, validate, correct, prepared commit, targeted rollback |
| **Total additional v3.0 records** | **336** | Deterministic and fictional | Browser-memory interaction contracts only |

The inherited deep fixtures remain: 48 jobs, 320 candidates, 640 applications, 192 interviews, 160 assignments, 1,656 generic object records and the v2.0–v2.2 lifecycle/regulated datasets.

## Object and page handling

“Job” is a first-class business object family. In the canonical model it projects related grains—Requisition, Position Opening, Job Posting and Job Posting Version—rather than collapsing all of them into one production record. The user-facing Job List/New/Detail/Edit experience remains a coherent workspace over those relationships.

| Object tier | Count | Page contract | Treatment |
| --- | ---: | --- | --- |
| Core navigation families | 92 | List/New/Detail/Edit | Metadata-driven object studio plus bespoke core Job/Candidate/Application pages |
| Lifecycle families | 46 | List/New/Detail/Edit | Metadata-driven object studio plus bespoke onboarding, provisioning, talent and transition journeys |
| Combined logical concepts | 175 | Semantic/data-contract layer | 129 canonical atomic concepts plus 46 lifecycle concepts; used to define grain, relationship and field contracts |
| Physical Salesforce/database objects | 0 approved | Not applicable | Proposed dispositions remain review inputs until architecture/security/scale/migration approval |

For complex work, v3.0 does not rely solely on generic CRUD: account recovery, adverse action, event check-in, cohort planning, locale approval, agency ownership, worker transition impact, access approval, integration mapping and import correction each have a bespoke journey.

## Interaction and route validation matrix

| Validation | Result | Meaning |
| --- | ---: | --- |
| Source files scanned | 18 | TSX interaction surfaces inspected by deterministic audit |
| Link declarations | 287 | Zero raw/empty/hash-only/fallback destinations found |
| Buttons | 277 | 245 handler-backed, 30 submit-backed, two intentionally disabled and labeled; zero unhandled enabled buttons |
| Route declarations | 156 | Exactly matches `src/App.tsx` and the route ledger |
| Production-build internal destinations opened | 1,018 | Every rendered internal href discovered from public, candidate, new-hire, internal, portal and privileged-admin roots |
| Route/browser defects | 0 | No silent fallback, missing `main` destination or browser error |
| Automated tests | 108 | Unit, component, contract and axe checks all pass |
| Browser journeys | 65 passed, 1 skipped | Desktop and mobile Chromium; exhaustive crawl runs once on desktop by design |
| Visual baselines | 8 | Candidate regulated task, benefits, event ops, cohort analytics, referrer, transitions, admin desktop and admin 320px |

Answer to “is every link clickable?”: every rendered internal link in the bounded synthetic application resolves to a real route in the built artifact. Permission-denied pages are intentional destinations, not broken links. Links that require a privileged population were crawled after selecting the platform-admin fixture. External production links do not exist in the wireframe.

## Remaining boundaries

The v3.0 wireframe contract is complete for the declared routes, interactions and synthetic journeys. The following are not claimed:

- manual screen-reader testing or moderated usability evidence;
- pixel-diff baselines for all 154 functional destinations;
- legally approved country, benefits, background or adverse-action content;
- real multi-user concurrency, authentication, storage, messaging, calendar, signature, screening, HRIS, ITSM or Salesforce behavior;
- an approved physical data model, production security evidence or pilot authorization.

Those are implementation, approval and human-evidence gates—not missing clickable wireframe links.
