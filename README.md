# Recruitment System

An end-to-end applicant tracking system for a San Francisco–based company, designed around Salesforce as the future operational system of record. The v1.3 GitHub Pages release is a public-safe, high-fidelity Lightning-style wireframe—not a Salesforce org.

## Public wireframe

[Open the Recruitment System wireframe](https://singhaditya21.github.io/Recruitment-System/)

- Candidate careers surface: `#/careers`
- Internal recruitment console: `#/hr/action-center`
- All people, jobs, applications, interviews, offers, messages, policies and audit events are fictional seeded data.
- Every action is browser-memory simulation. There is no sign-in, upload, persistence, Salesforce connection or external write.

## Product documentation

- [Product Requirements Document](docs/PRD.md)
- [v0.9 Executable Artifact and Synthetic Prototype Audit](docs/AUDIT-v0.9.md)
- [v0.8 Full Product and Delivery Audit](docs/AUDIT-v0.8.md)

PRD v1.3 reconciles the full product contract with the executable synthetic wireframe. The implementation covers 12 candidate/HR screen contracts, 12 internal persona views plus the candidate persona, 12 edge-case scenarios, seeded operational records at every product end, machine-readable transition/automation/interface/invariant/error registries, traceability, automated accessibility checks, desktop/mobile browser journeys, CI and GitHub Pages deployment.

Development is intended to begin with a public GitHub Pages prototype that uses synthetic data only, followed by a native Salesforce Lightning HR workspace and an externally hosted candidate portal through a secure backend-for-frontend. Candidate documents remain in approved private object storage. GitHub Pages will not handle real authentication, candidate data, resumes, interview feedback, offers, or audit records.

Current repository state: the React/TypeScript/Vite wireframe, deterministic fixtures, Lightning-style internal shell, candidate experience, automated tests, visual evidence and delivery workflows are present. Salesforce metadata, the candidate BFF, authentication, provider integrations, approved product/policy decisions and moderated usability evidence are not present. The wireframe cannot process or persist real candidate information.

## Run and verify v1.3

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
