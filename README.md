# Recruitment System

An end-to-end applicant tracking system for a San Francisco–based company, designed around Salesforce as the future operational system of record. The v1.7 GitHub Pages release is a public-safe, high-fidelity Lightning-style operational, object, analytics and reporting wireframe—not a Salesforce org.

## Public wireframe

[Open the Recruitment System wireframe](https://singhaditya21.github.io/Recruitment-System/)

Deployment is live over HTTPS from the repository's `main` branch. [View the source repository](https://github.com/singhaditya21/Recruitment-System).

- Candidate careers surface: `#/careers`
- Internal recruitment console: `#/hr/action-center`
- Dynamic analytics portfolio: `#/hr/analytics`
- Saved reports and builder: `#/hr/reports`
- 92-family object/page matrix: `#/hr/objects`
- All people, jobs, applications, interviews, offers, messages, policies and audit events are fictional seeded data.
- Every action is browser-memory simulation. There is no sign-in, upload, persistence, Salesforce connection or external write.

## Product documentation

- [Product Requirements Document](docs/PRD.md)
- [v1.7 role, screen, object and data matrix](docs/MATRIX-v1.7.md)
- [v1.7 Remediation Audit](docs/AUDIT-v1.7.md)
- [v0.9 Executable Artifact and Synthetic Prototype Audit](docs/AUDIT-v0.9.md)
- [v0.8 Full Product and Delivery Audit](docs/AUDIT-v0.8.md)

PRD v1.7 reconciles the full product contract with an executable role/data/object/page/reporting model. The wireframe has 13 personas, 14 canonical screen families, 24 functional route patterns and reusable List/New/Detail/Edit pages for all 92 logical object families—368 routed instances backed by 276 seeded records. The logical dictionary now distinguishes 552 domain-specific business fields from the original 920 shared governance/provenance fields, for 1,472 total contracts. Eleven dashboards run over a 324-row fixture that populates all 600 supported date/job/source/stage filter combinations and returns N/A for zero-eligible denominators. Saved reports, a builder, drill-through, scheduling, delivery evidence, controlled aggregate export, targets and restatements are included as memory-only previews.

Development is intended to begin with a public GitHub Pages prototype that uses synthetic data only, followed by a native Salesforce Lightning HR workspace and an externally hosted candidate portal through a secure backend-for-frontend. Candidate documents remain in approved private object storage. GitHub Pages will not handle real authentication, candidate data, resumes, interview feedback, offers, or audit records.

Current repository state: the React/TypeScript/Vite wireframe, deterministic fixtures, Lightning-style internal shell, candidate experience, automated tests, visual evidence, CI and verified GitHub Pages deployment are present. Salesforce metadata, the candidate BFF, authentication, provider integrations, approved product/policy decisions and moderated usability evidence are not present. The wireframe cannot process or persist real candidate information.

## Run and verify v1.7

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://127.0.0.1:5173/#/careers` for the candidate surface or `http://127.0.0.1:5173/#/hr/action-center` for the HR workspace.

Run the complete local verification suite:

```bash
pnpm verify
pnpm test:e2e
```

All records, contacts and jobs are fictional. Inputs and simulated actions are memory-only and reset on refresh.
