# Recruitment System

An end-to-end recruitment and onboarding platform wireframe for a San Francisco–based company, designed around Salesforce as the future operational system of record. v2.1 extends the executable v1.9 recruitment model and v2.0 lifecycle design through full object-page coverage, candidate interview/offer response, onboarding programs/compliance/orientation/check-ins, a new-hire journey through day 90, events, referrals and agency partners. It is not a Salesforce org or production system.

## Public wireframe

[Open the Recruitment System wireframe](https://singhaditya21.github.io/Recruitment-System/)

This working tree is the v2.1 release candidate. It should be called the deployed v2.1 release only after the exact commit, CI/security and Pages workflow are verified. [View the source repository](https://github.com/singhaditya21/Recruitment-System).

- Candidate careers surface: `#/careers`
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
- Identity, integration, data and security control center: `#/hr/platform`
- 138-family object/page matrix: `#/hr/objects`
- All people, jobs, applications, interviews, offers, messages, policies and audit events are fictional seeded data.
- Every action is browser-memory simulation. There is no sign-in, upload, persistence, Salesforce connection or external write.

## Product documentation

- [Product Requirements Document](docs/PRD.md)
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

PRD v2.1 defines 13 personas, 25 screen contracts and 53 route declarations/51 functional destinations. All 92 core plus 46 lifecycle families resolve through four generated page contracts, producing 552 List/New/Detail/Edit page instances, 1,656 seeded rows and 2,208 interactive workspace-field contracts. The inherited 129-concept/2,350-field canonical recruitment model remains a separate normalized semantic layer. The combined 175 canonical-plus-lifecycle concepts are not physical Salesforce objects.

The lifecycle surface is densely seeded with 36 new hires, 8 onboarding templates, 8 lifecycle programs, 18 exceptions, 24 compliance cases, 72 IT/facilities/manager provisioning requests, 16 orientation sessions, 48 check-ins, 8 day-90 milestones, 6 new-hire documents, 120 prospects, 8 communities, 6 campaigns, 24 job-channel distributions, 8 internal opportunities, 12 career events, 24 referrals and 8 agency partners. Candidate/new-hire task completion, document completion, HRIS correction, exception resolution, provisioning delivery and new v2.1 interactions share browser memory and reset on refresh.

The 2,350 fields comprise 673 object-specific business fields and 1,677 governance/provenance fields. Proposed Salesforce/API names and persistence dispositions are review inputs only: the approved physical Salesforce object count remains zero until accountable architecture, security, scale, migration and metadata reviews are completed.

Development is intended to begin with a public GitHub Pages prototype that uses synthetic data only, followed by a native Salesforce Lightning HR workspace and an externally hosted candidate portal through a secure backend-for-frontend. Candidate documents remain in approved private object storage. GitHub Pages will not handle real authentication, candidate data, resumes, interview feedback, offers, or audit records.

Current repository state: the React/TypeScript/Vite wireframe, deterministic fixtures, Lightning-style internal shell, candidate experience, automated tests, visual evidence, CI and verified GitHub Pages deployment are present. Salesforce metadata, the candidate BFF, authentication, provider integrations, approved product/policy decisions and moderated usability evidence are not present. The wireframe cannot process or persist real candidate information.

## Run and verify v2.1

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
