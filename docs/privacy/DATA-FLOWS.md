# Privacy data-flow and purpose register — proposed

| Flow | Minimum data | Purpose | Recipients | Prohibited propagation | Lifecycle requirement |
| --- | --- | --- | --- | --- | --- |
| Public job discovery | approved job content, location, pay, policy versions | Inform potential applicants | public CDN/browser | internal headcount/evidence/policy notes | unpublish and cache/index reconciliation |
| Candidate account/session | identifier, verified channel, session/security facts | Authenticate and recover own access | IdP, BFF | hiring evidence, integrity/accommodation | account/session policy and security retention |
| Application attempt | identity reference, job answers, consent, immutable attempt version | Submit for one requisition | BFF, Salesforce, file service | other applications or unrelated talent purpose | application schedule, correction and withdrawal |
| Resume/file | binary, type/size/hash/scan result, parent/purpose | Candidate-supplied evidence | private storage, scanner, authorized evaluator | public job projection, analytics payload | quarantine, hold/deletion/provider reconciliation |
| Scheduling | availability, timezone, constraints, session participants | Arrange one interview | calendar/provider and assigned coordinators | peer feedback, compensation, integrity facts | expire availability; retain necessary session evidence |
| Evaluation/decision | structured evidence, approved rubric/version, attribution | Human hiring decision | assigned evaluators/decision owners | candidate-experience survey, accommodation identity | immutable consequential evidence schedule |
| Offer/e-signature | approved offer version, compensation, recipient, response | Make and record employment offer | approver, candidate, e-sign provider | broad dashboards, interviewers | supersession, expiry, response and provider reconciliation |
| Handoff | accepted offer reference, minimum worker/onboarding payload | Create/reconcile downstream hire | HRIS/onboarding owner | rejected candidates, raw evidence | checkpoint, correction/cancel and archival |
| Privacy/accommodation | verified request, minimum scope/status/logistics | Execute rights or safe access | restricted privacy/support operators | routine hiring evaluators and analytics | request SLA, hold, deletion and proof |
| Reporting/export | authorized dimensions/measures, suppression state, provenance | Govern operations and assurance | role-approved audience | raw contact/files/restricted notes unless explicitly approved | expiry, revocation, delivery audit, restatement |

Each production field must map to a purpose, source, classification, readable/writable roles, retention/hold behavior, export rule and downstream recipients. The v1.7 logical dictionary supplies these properties as a review scaffold; it is not yet the approved physical processing inventory.
