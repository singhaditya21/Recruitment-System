# Recruitment System

An end-to-end recruitment and onboarding platform wireframe for a San Francisco–based company, designed around Salesforce as the future operational system of record. v2.2 adds deep candidate relationship/check journeys, regulated cases, high-volume/campus operations, localized variants, failure recovery and separate manager/IT/agency portals to the v2.1 full-lifecycle surface. It is not a Salesforce org or production system.

## Public wireframe

[Open the Recruitment System wireframe](https://singhaditya21.github.io/Recruitment-System/)

This working tree is the v2.2 release candidate. It should be called the deployed v2.2 release only after the exact commit, CI/security and Pages workflow are verified. [View the source repository](https://github.com/singhaditya21/Recruitment-System).

- Candidate careers surface: `#/careers`
- Saved jobs, alerts and events: `#/saved-jobs`, `#/job-alerts`, `#/events`
- Candidate assessment/reference/background tasks: `#/my-tasks`
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
- Separate manager, IT and agency portals: `#/manager`, `#/it`, `#/agency`
- Identity, integration, data and security control center: `#/hr/platform`
- 138-family object/page matrix: `#/hr/objects`
- All people, jobs, applications, interviews, offers, messages, policies and audit events are fictional seeded data.
- Every action is browser-memory simulation. There is no sign-in, upload, persistence, Salesforce connection or external write.

## Product documentation

- [Product Requirements Document](docs/PRD.md)
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

PRD v2.2 defines 13 personas, 32 screen contracts and 71 route declarations/69 functional destinations. All 92 core plus 46 lifecycle families still resolve through 552 List/New/Detail/Edit page instances, 1,656 seeded rows and 2,208 interactive workspace-field contracts. The inherited 129-concept/2,350-field canonical recruitment model remains a separate normalized semantic layer. The combined 175 canonical-plus-lifecycle concepts are not physical Salesforce objects.

The v2.2 depth layer adds 6 candidate check tasks, 32 screening cases, 4 saved jobs, 3 alerts, 36 event registrations, 24 referral rewards, 32 agency submissions, 8 high-volume programs, 12 locale variants and 24 recovery scenarios to the existing dense recruitment/onboarding fixtures. All interactions share browser memory and reset on refresh.

The 2,350 fields comprise 673 object-specific business fields and 1,677 governance/provenance fields. Proposed Salesforce/API names and persistence dispositions are review inputs only: the approved physical Salesforce object count remains zero until accountable architecture, security, scale, migration and metadata reviews are completed.

Development is intended to begin with a public GitHub Pages prototype that uses synthetic data only, followed by a native Salesforce Lightning HR workspace and an externally hosted candidate portal through a secure backend-for-frontend. Candidate documents remain in approved private object storage. GitHub Pages will not handle real authentication, candidate data, resumes, interview feedback, offers, or audit records.

Current repository state: the React/TypeScript/Vite wireframe, deterministic fixtures, Lightning-style internal shell, candidate experience, automated tests, visual evidence, CI and verified GitHub Pages deployment are present. Salesforce metadata, the candidate BFF, authentication, provider integrations, approved product/policy decisions and moderated usability evidence are not present. The wireframe cannot process or persist real candidate information.

## Run and verify v2.2

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://127.0.0.1:5173/#/careers` for the candidate surface, `http://127.0.0.1:5173/#/hr/onboarding` for onboarding operations, `http://127.0.0.1:5173/#/preboarding` for the new-hire portal or `http://127.0.0.1:5173/#/hr/platform` for production-control design.

Run the complete local verification suite:

```bash
pnpm verify
pnpm test:e2e
```

All records, contacts and jobs are fictional. Inputs and simulated actions are memory-only and reset on refresh.
