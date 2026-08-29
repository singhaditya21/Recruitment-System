# Recruitment System

An end-to-end recruitment and onboarding platform wireframe for a San Francisco–based company, designed around Salesforce as the future operational system of record. v3.2 turns the complete recruitment and onboarding surface into 12 connected, action-level business demonstrations with shared state, trust controls and demo operations. It is not a Salesforce org or production system.

## Public wireframe

[Open the Recruitment System wireframe](https://singhaditya21.github.io/Recruitment-System/)

The last verified public v3.0 deployment came from application commit [`b768226`](https://github.com/singhaditya21/Recruitment-System/commit/b7682267a8b04b60f163b665cc9316a9cffd011c) through [PR #10](https://github.com/singhaditya21/Recruitment-System/pull/10). [View the source repository](https://github.com/singhaditya21/Recruitment-System).

- Candidate careers surface: `#/careers`
- Demo Journey Studio, 84-journey catalogue, business-use-case DFDs and evidence ledger: `#/demo`, `#/demo/catalog`, `#/demo/flows/*`, `#/demo/evidence`
- v3.2 connected use-case workbenches, causal analytics, handoffs, reports and scenarios: `#/demo/workbench`, `#/demo/control-center`, `#/demo/handoffs`, `#/demo/reports`, `#/demo/scenarios`
- Saved jobs, alerts and events: `#/saved-jobs`, `#/job-alerts`, `#/events`
- Candidate assessment/reference/background tasks: `#/my-tasks`
- Candidate account, support and privacy: `#/sign-in`, `#/account-recovery`, `#/support`, `#/privacy-requests`
- Internal recruitment console: `#/hr/action-center`
- Dynamic analytics portfolio: `#/hr/analytics`
- Saved reports and builder: `#/hr/reports`
- Job collection and draft form: `#/hr/jobs`, `#/hr/jobs/new`
- Candidate identity collection and form: `#/hr/candidates`, `#/hr/candidates/new`
- Application collection and junction form: `#/hr/applications`, `#/hr/applications/new`
- Onboarding command center: `#/hr/onboarding`
- New-hire list/detail, templates, programs, compliance, exceptions, provisioning, orientation/check-ins and analytics: `#/hr/onboarding/*`
- Employer-branded new-hire portal: `#/preboarding`
- Through-day-90 new-hire journey: `#/preboarding/journey`
- Talent CRM, campaigns, job distribution, mobility, events, referrals and agencies: `#/hr/talent`
- Assessment/background/adverse-action operations: `#/hr/cases`
- High-volume, country variants and recovery: `#/hr/high-volume`, `#/hr/locales`, `#/hr/recovery`
- Event and agency-assignment operations: `#/hr/events`, `#/hr/agency-assignments`
- Worker transitions: `#/hr/transitions`
- Separate manager, IT, facilities, agency, referrer, interviewer, buddy and mobility portals: `#/manager`, `#/it`, `#/facilities`, `#/agency`, `#/referrer`, `#/interviewer`, `#/buddy`, `#/mobility`
- Full administration control plane: `#/admin`
- Identity, integration, data and security control center: `#/hr/platform`
- 138-family object/page matrix: `#/hr/objects`
- All people, jobs, applications, interviews, offers, messages, policies and audit events are fictional seeded data.
- Every action is browser-memory simulation. There is no sign-in, upload, persistence, Salesforce connection or external write.

## Product documentation

- [Product Requirements Document](docs/PRD.md)
- [v3.2 use-case, screen, action, DFD and feature matrix](docs/USE-CASE-MATRIX-v3.2.md)
- [v3.2 connected wireframe completion audit](docs/AUDIT-v3.2.md)
- [v3.1 demo journey and business data-flow matrix](docs/MATRIX-v3.1.md)
- [v3.0 full-system screen, route, persona, data, object and interaction matrix](docs/MATRIX-v3.0.md)
- [v3.0 full-system wireframe audit](docs/AUDIT-v3.0.md)
- [v2.2 deep-journey persona, route, data and flow matrix](docs/MATRIX-v2.2.md)
- [v2.2 deep-journey and repository audit](docs/AUDIT-v2.2.md)
- [v2.1 surface, persona, object, journey and seed matrix](docs/MATRIX-v2.1.md)
- [v2.1 surface-completeness audit and remaining depth register](docs/AUDIT-v2.1.md)
- [v2.0 surface, persona, route, object and seed matrix](docs/MATRIX-v2.0.md)
- [v2.0 lifecycle data-model extension](docs/DATA-MODEL-v2.0.md)
- [v2.0 full-lifecycle completion audit](docs/AUDIT-v2.0.md)
- [v1.9 canonical data model](docs/DATA-MODEL-v1.9.md)
- [v1.9 authoritative count matrix](docs/MATRIX-v1.9.md)
- [v1.9 completion audit](docs/AUDIT-v1.9.md)
- [v1.8 role, screen, object and data matrix](docs/MATRIX-v1.8.md) (historical navigation/UI baseline)
- [v1.7 Remediation Audit](docs/AUDIT-v1.7.md)
- [v0.9 Executable Artifact and Synthetic Prototype Audit](docs/AUDIT-v0.9.md)
- [v0.8 Full Product and Delivery Audit](docs/AUDIT-v0.8.md)

## Recorded business-case demos

- [Complete 12-case video library](artifacts/v3.2/business-case-video-library/README.md) — 12 clearly numbered, self-contained folders with 36 categorized MP4 entries: narrated 1080p client demo, shorter executive cut and detailed evidence master per business case. The library totals 49.2 client-demo minutes, 32.4 executive-cut minutes, 120 embedded chapters and 474 sentence-level caption cues; see the [full media QA report](artifacts/v3.2/business-case-video-library/QA-REPORT.md).
- [Business Case 01 · client demonstration](artifacts/v3.2/videos/business-case-01-v2-client-demo.mp4) — 7:18, 1,920×1,080 narrated walkthrough with 21 embedded chapters and 71 sentence-level caption cues. It covers the opening brief, animated five-process DFD, controlled manager submission, independent Finance and Compensation approvals, recruiter configuration, two-opening reconciliation, publication, candidate projection, channel failure/recovery, causal analytics and the cross-persona handoff.
- [Business Case 01 · executive cut](artifacts/v3.2/videos/business-case-01-v2-executive-cut.mp4) — 3:16 client-summary cut with eight embedded chapters and remapped English captions.
- [Detailed evidence master](artifacts/v3.2/videos/business-case-01-v2-evidence-master.mp4), [full captions](artifacts/v3.2/videos/business-case-01-v2-full-captions.srt), [transcript](artifacts/v3.2/videos/business-case-01-v2-transcript.md) and [QA contact sheet](artifacts/v3.2/videos/business-case-01-v2-qa-contact-sheet.png).

The Business Case 01 recording can be regenerated on macOS with `pnpm record:business-case-01:v2`; `pnpm package:business-case-01:v2` derives its captioned executive and evidence cuts. `pnpm record:business-case-library` generates UC-02 through UC-12 and the categorized index from the executable PRD contract, while `pnpm validate:business-case-media` runs the complete library media audit. Like the wireframe, every recording uses fictional seeded data and creates no external effect.

PRD v3.1 defines 13 actor personas, 12 internal roles, 66 screen contracts and 160 route declarations/158 functional destinations. It adds 12 business-use-case DFDs, 84 mapped journey units, 61 guided persona/process handoffs and eight audience demo packs. All 92 core plus 46 lifecycle families still resolve through 552 List/New/Detail/Edit page instances, 1,656 seeded rows and 2,208 interactive workspace-field contracts. The inherited 129-concept/2,350-field canonical recruitment model remains a separate normalized semantic layer. The combined 175 canonical-plus-lifecycle concepts are not physical Salesforce objects.

PRD v3.2 implements 12 outcome-driven use cases and all 35 uniquely identified updates—15 P0, 12 P1 and 8 P2—inside the synthetic browser-memory wireframe. Six new screen contracts expose the connected portfolio/workbench, causal control center, handoff inbox, governed reporting and scenario/rehearsal operations. The executable contract is now 72 screen contracts and 166 route declarations/164 functional destinations.

The inherited v3.0 layer adds 336 deterministic records across candidate task detail, recruiting events, 48 cohorts, agency assignments, referrer/facilities/manager/interviewer/buddy/mobility portals, benefits, learning, worker transitions and administration. v3.1 adds deterministic launch/restart, happy/exception variants, shared-state handoffs, communication previews, a presenter rail and a session evidence ledger. All interactions share browser memory and reset on refresh.

The interaction audit covers 287 link declarations and 277 buttons with zero source defects. The production-build crawl opens 1,018 distinct rendered internal destinations with zero silent fallback, missing destination or browser error. Permission-denied routes are intentional, labeled destinations.

The v3.2 verification layer covers 319 link declarations, 313 buttons and 166 route declarations with zero source defects; 130 unit/component/contract/automated-accessibility tests; 73 desktop/mobile browser tests with one intentional duplicate-crawl skip; and an exhaustive 1,103-destination production-build crawl with zero route defects or browser errors. v3.2 adds 52 action-level DFD processes, 13 seeded P0 workbenches/78 workbench data fields, four country variants, nine prepared error/recovery states and three audience-duration runbooks.

The 2,350 fields comprise 673 object-specific business fields and 1,677 governance/provenance fields. Proposed Salesforce/API names and persistence dispositions are review inputs only: the approved physical Salesforce object count remains zero until accountable architecture, security, scale, migration and metadata reviews are completed.

Development is intended to begin with a public GitHub Pages prototype that uses synthetic data only, followed by a native Salesforce Lightning HR workspace and an externally hosted candidate portal through a secure backend-for-frontend. Candidate documents remain in approved private object storage. GitHub Pages will not handle real authentication, candidate data, resumes, interview feedback, offers, or audit records.

Current repository state: the React/TypeScript/Vite wireframe, deterministic fixtures, Lightning-style internal shell, candidate experience, automated tests, visual evidence, CI and verified GitHub Pages deployment are present. Salesforce metadata, the candidate BFF, authentication, provider integrations, approved product/policy decisions and moderated usability evidence are not present. The wireframe cannot process or persist real candidate information.

## Run and verify v3.2

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://127.0.0.1:5173/#/demo` for the Demo Journey Studio, `http://127.0.0.1:5173/#/careers` for the candidate surface, `http://127.0.0.1:5173/#/hr/onboarding` for onboarding operations, `http://127.0.0.1:5173/#/preboarding` for the new-hire portal or `http://127.0.0.1:5173/#/hr/platform` for production-control design.

Run the complete local verification suite:

```bash
pnpm verify
pnpm test:e2e
```

All records, contacts and jobs are fictional. Inputs and simulated actions are memory-only and reset on refresh.
