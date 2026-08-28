# Recruitment System v2.2 — Deep-Journey Matrix

Status: synthetic wireframe release candidate. No authentication, database, API, Salesforce metadata, provider effect, approved physical schema or real data exists.

## Reconciled counts

| Dimension | Count | Definition |
| --- | ---: | --- |
| Personas | 13 | Candidate/accepted new hire plus 12 internal roles; manager/IT/agency are scoped review shells, not new authenticated identities |
| Screen contracts | 32 | 6 candidate, 15 internal, 8 new-hire and 3 role-portal contracts |
| Route declarations / functional destinations | 71 / 69 | Two redirects excluded from functional count |
| Routed object families / generated pages | 138 / 552 | List, New, Detail and Edit for 92 core plus 46 lifecycle families |
| Generated object rows / workspace fields | 1,656 / 2,208 | 12 rows and 16 fields per family |
| Canonical plus lifecycle concepts | 175 | 129 core atomic plus 46 lifecycle concepts; not physical objects |
| Approved physical objects | 0 | Production schema remains unapproved |

## Screen and route additions

| Screen | Routes | Purpose |
| --- | --- | --- |
| `UI-CAN-005` relationship tools | `/saved-jobs`, `/job-alerts`, `/events`, `/events/:eventId` | Saved jobs, candidate-controlled alerts and event registration/waitlist/cancellation |
| `UI-CAN-006` checks/tasks | `/my-tasks` | Candidate-safe assessment/reference/background/pre-adverse tasks, expiry, support and dispute |
| `UI-HR-014` regulated cases | `/hr/cases`, `/hr/cases/:caseId` | Assessment/reference/background/adverse queue and detail with human-review guardrail |
| `UI-HR-015` scaled operations | `/hr/high-volume`, `/hr/locales`, `/hr/recovery` | Cohort capacity/bounded bulk work, localized packs and failure recovery |
| `UI-MGR-001` manager portal | `/manager`, `/manager/new-hires/:newHireId` | Relationship-scoped readiness, goals and check-ins |
| `UI-IT-001` IT portal | `/it`, `/it/requests/:requestId` | Function-scoped fulfilment, least privilege, delivery and reconciliation |
| `UI-AGY-001` agency portal | `/agency`, `/agency/submissions`, `/agency/submissions/new`, `/agency/submissions/:submissionId` | Assignment scope, candidate notice, duplicates, ownership, fee and validation |

## Deep-journey data matrix

| Grain | Count | Core data points | State/failure coverage |
| --- | ---: | --- | --- |
| Candidate task | 6 | Kind, application, title, due/expiry, provider-safe state, next action, notice version | Ready, in progress, complete, expired, support, dispute |
| Screening case | 32 | Kind, candidate/application/job, owner/due, jurisdiction, consent, version, next action, restriction | Invited, in progress, review, clear, blocked, pre-adverse, dispute, closed |
| Saved job | 4 | Job/public ID, title, location/workplace, saved time | Open, closing soon, closed/remove/find similar |
| Job alert | 3 | Name, criteria, cadence, channel, locale, last result | Daily, weekly, paused/resume |
| Event registration | 36 | Event, attendee, state, accessibility route, authority, source | Registered, waitlisted, checked in, cancelled, no show |
| Referral reward | 24 | Referral, people/job, eligibility, milestone, amount, state, reason | Pending, approved, paid, denied, disputed |
| Agency submission | 32 | Agency/assignment, candidate/job, ownership window, fee, duplicate reference, next action | Draft, validation, accepted, duplicate, ownership review, withdrawn, expired |
| High-volume campaign | 8 | Model, jobs, applicants, stage, human capacity, automation boundary, exceptions, owner | Planning, open, paused, complete |
| Locale variant | 12 | Country, locale/language, worker type, notice/form/pay/signature packs | Approved demo, legal review, incomplete/block |
| Recovery scenario | 24 | Journey, failure, safe state, recovery, owner, attempts, idempotency key | Open, recovering, resolved, cancelled |

## Persona/data boundaries

| Persona/shell | Population | Visible | Mutate | Denied |
| --- | --- | --- | --- | --- |
| Candidate | Own relationship, applications and tasks | Candidate-safe status/notices/actions | Save/remove, alert pause/resume, event registration/cancel, task/support/dispute | Internal scores, reports, rationale, other people |
| Recruiter/coordinator | Assigned portfolios/cohorts | Operational candidate/job/case state | Owned coordination and case routing | Restricted provider evidence unless entitled |
| Integrity/privacy reviewer | Assigned purpose-bound cases | Restricted evidence and redress state | Human review/correction/dispute outcome | Unrelated operations |
| Hiring manager / manager portal | Effective direct-report relationship | Readiness, goals, agenda, buddy and check-ins | Manager commitments/support | Private forms, recruiting feedback, other teams |
| IT portal | IT-function requests | Worker-safe identity, effective date, bundle, dependency, delivery | Fulfil/retry/cancel preview | Recruiting/private forms/facilities/payroll |
| Agency portal | Current partner/assignment/owned submission | Scoped jobs, candidate-authorized submission, duplicate reference, ownership/fee | Draft/validate/withdraw/message | Other agencies/owners and implicit application creation |
| Auditor | Time/purpose/row/field-scoped evidence | Minimized immutable history | None | Universal identity/content access |

## Journey logic

1. Saved Job → optional alert/event relationship; none creates Application.
2. Event Registration → attendance/no-show/cancel; Prospect authority is separate and time-bounded.
3. Assessment/Reference/Background assignment → versioned candidate task → candidate action/expiry/support → provider-safe reconciliation → attributed human review.
4. Pre-adverse notice → response window → correction/dispute → paused decision → attributed outcome and candidate-safe communication.
5. High-volume cohort → eligibility snapshot → bounded invitation preview → capacity-aware coordination → human evidence → owned exceptions/reconciliation.
6. Agency assignment → candidate-authorized submission → validation/duplicate/ownership review → separate Application only after acceptance.
7. Manager/IT work derives from an approved pre-hire/plan and effective relationships; cancellation generates compensating/revocation previews.
8. Any expiry, stale version, duplicate, permission change, provider failure or cancellation retains the last safe state and an idempotent recovery path.

All fixtures are deterministic and fictional. State changes reset on refresh and demonstrate product logic only.
