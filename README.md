# Recruitment System

An end-to-end recruitment and onboarding platform wireframe for a San Francisco–based company, designed around Salesforce as the future operational system of record. v2.0 extends the executable v1.9 recruitment model through talent CRM, job distribution, accepted-candidate transition, onboarding, the new-hire experience, provisioning and production-control design. It is not a Salesforce org or production system.

## Public wireframe

[Open the Recruitment System wireframe](https://singhaditya21.github.io/Recruitment-System/)

This working tree is the v2.0 release candidate. It should be called the deployed v2.0 release only after the exact commit, CI/security and Pages workflow are verified. [View the source repository](https://github.com/singhaditya21/Recruitment-System).

- Candidate careers surface: `#/careers`
- Internal recruitment console: `#/hr/action-center`
- Dynamic analytics portfolio: `#/hr/analytics`
- Saved reports and builder: `#/hr/reports`
- Job collection and draft form: `#/hr/jobs`, `#/hr/jobs/new`
- Candidate identity collection and form: `#/hr/candidates`, `#/hr/candidates/new`
- Application collection and junction form: `#/hr/applications`, `#/hr/applications/new`
- Onboarding command center: `#/hr/onboarding`
- New-hire list/detail, templates, exceptions, provisioning and analytics: `#/hr/onboarding/*`
- Employer-branded new-hire portal: `#/preboarding`
- Talent CRM, campaigns, job distribution and internal mobility: `#/hr/talent`
- Identity, integration, data and security control center: `#/hr/platform`
- 92-family object/page matrix: `#/hr/objects`
- All people, jobs, applications, interviews, offers, messages, policies and audit events are fictional seeded data.
- Every action is browser-memory simulation. There is no sign-in, upload, persistence, Salesforce connection or external write.

## Product documentation

- [Product Requirements Document](docs/PRD.md)
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

PRD v2.0 defines 13 personas, 24 screen contracts, 49 route declarations/47 functional destinations, 92 reusable core navigation families and the 129-concept/2,350-field v1.9 canonical recruitment model. It adds 46 logical lifecycle objects—28 onboarding, 7 talent relationship, 3 internal mobility and 8 platform—with 186 object-specific key data points and 238 explicit lifecycle states. The combined 175 logical concepts are not 175 physical Salesforce objects.

The new surface is densely seeded with 36 new hires, 8 onboarding templates, 18 exceptions, 72 IT/facilities/manager provisioning requests, 6 new-hire documents, 120 prospects, 8 communities, 6 campaigns, 24 job-channel distributions and 8 internal opportunities. Candidate/new-hire task completion, document completion, HRIS correction, exception resolution and provisioning delivery share browser memory and reset on refresh.

The 2,350 fields comprise 673 object-specific business fields and 1,677 governance/provenance fields. Proposed Salesforce/API names and persistence dispositions are review inputs only: the approved physical Salesforce object count remains zero until accountable architecture, security, scale, migration and metadata reviews are completed.

Development is intended to begin with a public GitHub Pages prototype that uses synthetic data only, followed by a native Salesforce Lightning HR workspace and an externally hosted candidate portal through a secure backend-for-frontend. Candidate documents remain in approved private object storage. GitHub Pages will not handle real authentication, candidate data, resumes, interview feedback, offers, or audit records.

Current repository state: the React/TypeScript/Vite wireframe, deterministic fixtures, Lightning-style internal shell, candidate experience, automated tests, visual evidence, CI and verified GitHub Pages deployment are present. Salesforce metadata, the candidate BFF, authentication, provider integrations, approved product/policy decisions and moderated usability evidence are not present. The wireframe cannot process or persist real candidate information.

## Run and verify v2.0

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
