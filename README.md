# Recruitment System

An end-to-end applicant tracking system for a San Francisco–based company, designed around Salesforce as the future operational system of record. The v1.4 GitHub Pages release is a public-safe, high-fidelity Lightning-style semantic operating wireframe—not a Salesforce org.

## Public wireframe

[Open the Recruitment System wireframe](https://singhaditya21.github.io/Recruitment-System/)

Deployment is live over HTTPS from the repository's `main` branch. [View the source repository](https://github.com/singhaditya21/Recruitment-System).

- Candidate careers surface: `#/careers`
- Internal recruitment console: `#/hr/action-center`
- All people, jobs, applications, interviews, offers, messages, policies and audit events are fictional seeded data.
- Every action is browser-memory simulation. There is no sign-in, upload, persistence, Salesforce connection or external write.

## Product documentation

- [Product Requirements Document](docs/PRD.md)
- [v0.9 Executable Artifact and Synthetic Prototype Audit](docs/AUDIT-v0.9.md)
- [v0.8 Full Product and Delivery Audit](docs/AUDIT-v0.8.md)

PRD v1.4 reconciles the full product contract with an executable semantic wireframe. One canonical scenario snapshot now drives candidate-safe status, application stage, interviews, scorecard readiness, decision state, offer/handoff state and opening counts across routes. Route parameters resolve real seeded records; persona context persists and materially changes navigation, queues and least-privilege access; primary controls work, explain their preview behavior or are visibly disabled; the candidate hub and HR application/scorecard journeys include recoverable next actions. The implementation retains all 12 candidate/HR screen families, 13 personas, 12 scenarios, machine-readable contracts, automated accessibility tests, desktop/mobile browser journeys, CI and Pages deployment.

Development is intended to begin with a public GitHub Pages prototype that uses synthetic data only, followed by a native Salesforce Lightning HR workspace and an externally hosted candidate portal through a secure backend-for-frontend. Candidate documents remain in approved private object storage. GitHub Pages will not handle real authentication, candidate data, resumes, interview feedback, offers, or audit records.

Current repository state: the React/TypeScript/Vite wireframe, deterministic fixtures, Lightning-style internal shell, candidate experience, automated tests, visual evidence, CI and verified GitHub Pages deployment are present. Salesforce metadata, the candidate BFF, authentication, provider integrations, approved product/policy decisions and moderated usability evidence are not present. The wireframe cannot process or persist real candidate information.

## Run and verify v1.4

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
