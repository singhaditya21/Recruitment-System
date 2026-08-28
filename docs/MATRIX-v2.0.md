# Recruitment System v2.0 — Authoritative Surface Matrix

Status: synthetic full-lifecycle wireframe contract. This ledger does not describe a deployed Salesforce org, production identity system, backend, provider integration or approved physical schema.

## Reconciled counts

| Dimension | v2.0 count | Meaning |
| --- | ---: | --- |
| Personas | 13 | One candidate/new hire plus 12 internal operating roles |
| Screen contracts | 24 | 4 candidate, 13 internal HR/platform and 7 new-hire contracts |
| Route declarations | 49 | Exact `Route` declarations in `src/App.tsx`, including two redirects |
| Functional destinations | 47 | Route declarations excluding root and wildcard redirects |
| Core navigation families | 92 | Inherited v1.9 reusable object-navigation families |
| Core atomic concepts | 129 | Inherited v1.9 authoritative recruitment concepts |
| Lifecycle extension objects | 46 | 28 onboarding, 7 talent relationship, 3 internal mobility, 8 platform |
| Combined logical concepts | 175 | Core atomic concepts plus lifecycle extension; not physical objects |
| Extension key data points | 186 | Four or more object-specific keys per extension object |
| Extension lifecycle states | 238 | Explicit state vocabulary across extension objects |
| Approved physical objects | 0 | No Salesforce/database schema approval exists |

## Personas and data scope

| Persona | Primary surface | Record scope | Restricted-data rule | Mutation scope |
| --- | --- | --- | --- | --- |
| Candidate / accepted new hire | Candidate + new-hire portals | Own identity, applications, pre-hire plan and assigned tasks | Never sees internal feedback, disposition rationale, other people or internal exceptions | Own permitted forms, preferences, tasks and support requests |
| Recruiter | Recruitment, onboarding, talent | Assigned recruiting portfolio and approved talent populations | No private tax/work-authorization values | Jobs, candidates, applications, assigned plans and approved outreach |
| Recruiting Coordinator | Scheduling, onboarding, talent | Coordination queues and supported populations | Candidate/new-hire safe fields only | Logistics, messages, plan operations and owned exceptions |
| Hiring Manager | Jobs, decisions, onboarding, mobility | Own requisitions/applications and new hires with effective manager relationship | Manager-safe readiness only; no private forms or HRIS payload | Own job input, decisions and manager tasks; not template/HRIS administration |
| Interviewer | Interviews and scorecards | Assigned sessions only and time bounded | Minimum-necessary candidate briefing; blinded peer feedback | Assigned scorecard evidence only |
| Offer Approver | Offers | Current assigned approval subjects | Immutable approved offer version; no unrelated candidate data | Approve, reject or send back current version |
| Candidate Support | Candidate/support/onboarding | Open support relationships | Safe status and support facts; no evaluation/worker payload | Support case and communication only |
| Application Integrity Reviewer | Restricted cases | Assigned integrity cases | Restricted evidence; no unrelated hiring records | Human review and redress outcome |
| Configuration Admin | Templates, automation, platform metadata | Versioned configuration | Does not inherit person/private form data | Draft/version/simulate approved configuration |
| Platform Admin | Platform operations | Connection, access and operational metadata | No business-content entitlement by role label | Platform configuration after approval; preview is read-only |
| Privacy & Legal | Governance, minimized CRM/platform evidence | Purpose-bound request/policy scope | Prospect identity minimized in the wireframe; no general operational access | Legal/privacy case decisions only |
| HRIS Operator | Handoff, onboarding, integration | Pending-worker and reconciliation population | Destination-required fields; no recruiting feedback | Correct, validate and safely replay worker transfer |
| Auditor | Evidence views | Time-, purpose-, row- and field-scoped evidence | Read-only and minimized; never universal | None |

The browser switcher demonstrates these rules. Production must enforce them at identity, service/API, Salesforce/database and provider layers.

## Screen contract matrix

| ID range | Count | Surface and capabilities |
| --- | ---: | --- |
| `UI-CAN-001`–`004` | 4 | Careers, job detail, guided application and candidate application hub |
| `UI-HR-001`–`010` | 10 | Action center, jobs, candidates, applications, interviews, scorecards/decisions, automation, governance, analytics, reports/object studio |
| `UI-HR-011` | 1 | Onboarding overview, new-hire list/detail, templates, exceptions, provisioning and progress analytics |
| `UI-HR-012` | 1 | Talent overview, CRM, campaigns, job distribution and internal mobility |
| `UI-HR-013` | 1 | Identity, integrations, data architecture and security readiness |
| `UI-NHR-001`–`007` | 7 | New-hire home, tasks, task/form detail, documents, profile, day one and help/privacy |

## v2 route matrix

| Surface | Routes | Key record/data grain |
| --- | --- | --- |
| New-hire portal | `/preboarding`; `/tasks`; `/tasks/:taskId`; `/documents`; `/profile`; `/day-one`; `/help` | One authenticated pre-hire, task, document/form or support context |
| Onboarding overview | `/hr/onboarding` | Active onboarding plan plus derived portfolio indicators |
| New hires | `/hr/onboarding/new-hires`; `/new-hires/:newHireId` | One pre-hire/onboarding plan per row; linked identity lineage on detail |
| Templates | `/hr/onboarding/templates` | Stable template identity plus immutable version/stage/task definitions |
| Exceptions | `/hr/onboarding/exceptions` | One owned exception per plan/problem occurrence |
| Provisioning | `/hr/onboarding/provisioning` | One request per new hire × target service/asset/access bundle |
| Onboarding analytics | `/hr/onboarding/analytics` | Plan, task, exception and provisioning grains with declared denominators |
| Talent growth | `/hr/talent`; `/hr/talent/:talentView` | Prospect/community/campaign/distribution/internal-opportunity views |
| Platform control | `/hr/platform`; `/hr/platform/:platformView` | Identity connection, integration, store, object or security gate |

The exact full 49-declaration list is machine-readable in `artifacts/v2.0/routes.json`.

## Lifecycle extension objects

| Domain | Count | Objects |
| --- | ---: | --- |
| Onboarding | 28 | `PreHire`, `PendingWorker`, `EmployeeConversion`, `OnboardingTemplate`, `OnboardingTemplateVersion`, `OnboardingPlan`, `OnboardingStage`, `OnboardingTaskDefinition`, `OnboardingTask`, `NewHirePortalAccount`, `PersonalInformationSubmission`, `DocumentPackage`, `DocumentSubmission`, `SignatureEnvelope`, `WorkAuthorizationCase`, `PayrollElection`, `BenefitsEnrollment`, `ProvisioningRequest`, `EquipmentRequest`, `AccountProvisioningRequest`, `FacilityAccessRequest`, `OrientationSession`, `BuddyAssignment`, `LearningAssignment`, `OnboardingException`, `StartDateChange`, `NoShowCase`, `OnboardingSurveyResponse` |
| Talent relationship | 7 | `Prospect`, `TalentCommunity`, `TalentCommunityMembership`, `TalentCampaign`, `CampaignMembership`, `CareerEvent`, `JobDistribution` |
| Internal mobility | 3 | `InternalOpportunity`, `EmployeeTalentProfile`, `InternalApplication` |
| Platform | 8 | `IdentityProviderConnection`, `ServiceIdentity`, `IntegrationConnection`, `ApiClient`, `DataStoreContract`, `EncryptionKeyReference`, `AccessReview`, `SecurityIncident` |

Every extension object has an explicit grain, authoritative parent, proposed system of record, at least four object-specific key data points, at least four lifecycle states and a restricted-data flag. See [DATA-MODEL-v2.0.md](DATA-MODEL-v2.0.md) and `src/data/lifecyclePlatform.ts`.

## Seed matrix

| Family | Count | Coverage purpose |
| --- | ---: | --- |
| New hires | 36 | Stage, location, manager, portal, HRIS and readiness diversity |
| Onboarding templates | 8 | Published/draft/retiring, worker/location/function variants |
| Flagship plan tasks | 8 | New hire, People Ops, manager and IT ownership with dependencies |
| Onboarding exceptions | 18 | Blocker/high/medium, HRIS/form/identity/start/access/manager drivers |
| Provisioning requests | 72 | IT, facilities and manager across queued/in-progress/blocked/ready/delivered |
| New-hire documents | 6 | E-sign, form, upload and acknowledgement states |
| Prospects | 120 | Relationship, consent, source, owner, skill and community diversity |
| Talent communities | 8 | Distinct purpose and ownership populations |
| Campaigns | 6 | Draft/scheduled/running/complete and zero-denominator reporting |
| Job distributions | 24 | External/internal/agency channels and publish/fail/pending/expiry states |
| Internal opportunities | 8 | Roles, gigs, projects and mentorship with visibility variants |

All names, employers, identifiers, contacts and providers are fictional. Candidate contact values use the reserved `example.test` domain. Seed volume supports wireframe search/filter/state coverage, not production load claims.
