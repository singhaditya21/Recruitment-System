# Recruitment System v1.9 canonical data-model matrix

## Authoritative count ledger

| Contract | Count | Meaning |
| --- | ---: | --- |
| Navigation families | 92 | Existing List/New/Detail/Edit workspace groupings; not physical objects |
| Inherited atomic concepts | 111 | Every slash-combined v1.8 family expanded to an independently governed concept |
| Supporting control concepts | 18 | Missing submission, stage-event, access, identity-review, restricted-case, retention, quality and migration concepts |
| Total atomic concepts | 129 | Canonical design contracts with independent grain, kind, fields and disposition |
| Atomic field contracts | 2,350 | 673 object-specific business fields plus 1,677 governance/provenance fields |
| Structured relationships | 173 | Organization boundary plus explicit domain relationships and invariants |
| Executable transition contracts | 675 | Source, destination, command, permission, guard, side effect, communication, event, idempotency and recovery |
| Cross-object invariants | 15 | Blocker/high integrity rules with enforcement and test evidence |
| Domain-event definitions | 13 | Minimized, versioned event envelopes for consequential flows |
| Human role policies | 13 | Purpose, row relationship, field entitlement, denial, temporal, export and break-glass rules |
| Analytics contracts | 12 | Eight facts and four conformed dimensions |
| Reference datasets | 12 | Country, currency, timezone, locale, workplace, worker, job, source, reason, workflow, calendar and classification vocabularies |
| Data-quality rules | 15 | Completeness, uniqueness, validity, integrity, timeliness, projection, retention, scale and migration controls |
| Approved physical Salesforce objects | 0 | Every target/API name remains proposed until accountable physical-design approval |

## Domain reconciliation

| Domain | Inherited concepts | Supporting concepts | Total atomic concepts | Atomic fields |
| --- | ---: | ---: | ---: | ---: |
| Organization and access | 6 | 4 | 10 | 178 |
| Requisition, opening, posting and workflow | 16 | 1 | 17 | 308 |
| Candidate, identity and application | 9 | 4 | 13 | 244 |
| Files, source and deferred talent engagement | 11 | 0 | 11 | 195 |
| Screening and assessment | 8 | 0 | 8 | 142 |
| Interview and scheduling | 15 | 1 | 16 | 286 |
| Decision, approval, offer and hire | 15 | 3 | 18 | 329 |
| Work, automation and communication | 13 | 0 | 13 | 237 |
| Jurisdiction and selection-procedure governance | 4 | 0 | 4 | 76 |
| Experience, service recovery and integrity | 5 | 0 | 5 | 92 |
| Accommodation, privacy and lifecycle | 4 | 2 | 6 | 113 |
| Audit and integration | 5 | 3 | 8 | 150 |
| **Total** | **111** | **18** | **129** | **2,350** |

## Supporting-concept closure matrix

| Supporting concept | Navigation family | Gap closed |
| --- | --- | --- |
| HiringTeamMembership | Team | Effective-dated requisition responsibility and derived access |
| PostingChannel | JobPosting | Channel-specific publication/delivery state without making the channel canonical |
| ApplicationSubmission | ApplicationAttempt | Immutable submitted snapshot separated from mutable draft/attempt |
| ApplicationStageEvent | Application | Append-only transition history from which current stage is derived |
| ScorecardResponse | Scorecard | One anchored criterion response per scorecard version |
| ReferenceCheck | ContingencyCase | Consent-bound restricted reference workflow |
| BackgroundCheck | ContingencyCase | Policy/authorization/provider state separated from disposition |
| AdverseActionCase | ContingencyCase | Notice, waiting period, dispute, reassessment and final human action |
| RestrictedHRCase | AccommodationRequest | Restricted case evidence separated from routine logistics blockers |
| RetentionExecution | RetentionRule | Preview, dual approval, hold check, execution and provider reconciliation |
| AccessGrant | Permission | Effective user/resource/purpose entitlement |
| DelegationGrant | Permission | Time-bounded, scope-limited delegated authority |
| BreakGlassGrant | Permission | Incident-bound emergency access with expiry and independent review |
| CandidateIdentifier | CandidateIdentity | Normalized verified email/phone/subject lineage |
| CandidateDuplicateCase | CandidateIdentity | Human merge/split review; no automatic entity merge |
| DataQualityIssue | AuditEvent | Owned remediation record for failed stable quality rules |
| SchemaVersion | IntegrationSubscription | Explicit interface compatibility and effective version |
| MigrationMapping | IntegrationSubscription | Versioned source-to-target transformation and cutover traceability |

## Canonical runtime and projection matrix

| Canonical record | Count | Projection/consumer | Normalization rule |
| --- | ---: | --- | --- |
| Requisition + posting identity | 48 | Job list/detail/forms and careers projection | Compensation is numeric minor units plus currency; publication timestamp is typed |
| Candidate | 320 | Candidate list/detail/forms | Names remain on Candidate; identifiers and consent are separate records |
| CandidateIdentifier | 640 | Candidate contact projection and duplicate review | Email/phone normalized and verified; duplicates never auto-merge |
| Consent | 320 | Candidate notice projection | Purpose, notice version, choice and capture time are independent evidence |
| Application | 640 | Application list/detail/forms | Stores Candidate/Requisition IDs and attempt facts, not duplicate names/titles |
| ApplicationStageEvent | 640 | Current stage and stage-age projection | Current stage is folded from accepted aggregate-version events |
| RecruitingWorkItem | 640 | Next-action projection | Work state remains separate from application business state |
| InterviewSession | 192 | Interview workspace | Candidate/job names derive through Application; typed time/timezone retained |
| InterviewerAssignment | 160 | Assignment and scorecard workspace | Interviewer access is relationship and effective-window based |
| Canonical analytics cohort | 324 | Eleven dashboards and report builder | Every row references Application, source event and aggregate version |

## Relationship and integrity gates

| Gate | Required result |
| --- | --- |
| Organization boundary | Every persisted tenant concept references one active organization; cross-organization references fail |
| Application uniqueness | `(organization, candidate, requisition, attempt_number)` is unique |
| Application stage | Current stage equals the fold of accepted stage events in aggregate-version order |
| Offer integrity | At most one active offer per application |
| Opening integrity | At most one active reservation per application and opening |
| Hired integrity | Accepted offer, active reservation, cleared contingencies and acknowledged exact handoff are all required |
| Scorecard integrity | Submitted scorecard references one current assignment and pinned rubric version |
| Identity integrity | Duplicate signals create a human review case; no automatic merge |
| Version integrity | Used configuration versions are immutable and pinned |
| Integration integrity | A semantic idempotency key applies a business effect at most once |
| Privacy integrity | Restricted evidence is absent from general UI, analytics and event payloads |
| Deletion integrity | Retained evidence and held scope cannot cascade-delete |

## Role-policy completeness

Every one of the 13 human roles has all seven policy dimensions:

1. approved purpose;
2. record relationship;
3. field entitlement;
4. expressly denied categories;
5. effective-time rule;
6. export policy; and
7. break-glass rule.

The generic object workspace uses `organizationId`, `ownerUserId`, `assignedUserIds`, `assignedRoles`, purpose codes, effective dates and restricted entitlements. Deterministic role-name hashing is no longer a row-access mechanism.

## Analytics lineage completeness

| Analytical model | Grain | Canonical event source |
| --- | --- | --- |
| ApplicationFact | One submitted application attempt | ApplicationSubmitted, ApplicationStateChanged |
| ApplicationStageEventFact | One accepted stage transition | ApplicationStateChanged |
| InterviewSessionFact | One canonical session version | InterviewScheduled, AggregateStateChanged |
| ScorecardCompletionFact | One required assignment | ScorecardSubmitted |
| OfferEventFact | One offer lifecycle event | OfferStateChanged, OpeningReserved |
| CommunicationDeliveryFact | One message delivery attempt/result | AggregateStateChanged |
| AutomationExecutionFact | One automation action execution | AggregateStateChanged, IntegrationEffectReconciled |
| WorkItemSLAFact | One governed work-item lifecycle | AggregateStateChanged |
| RequisitionDimension | One effective requisition version | RequisitionApproved, JobPostingPublished |
| StageDimension | One effective stable stage mapping | AggregateStateChanged |
| SourceDimension | One governed acquisition source | ApplicationSubmitted |
| DateTimeDimension | One date/hour/calendar version | Governed reference data |

Every fact contract defines keys, measures, late-arrival behavior, restatement behavior and security. Every current dashboard fixture row points to a canonical application, stage event and aggregate version.

## Physical-disposition boundary

`CON-*` and proposed API names are solution-design outputs, not deployed metadata. One navigation family does not imply one object, and one atomic concept does not automatically imply one custom object. The accountable physical-design review may map a concept to:

- a Salesforce standard/platform construct;
- a private Salesforce custom object;
- Salesforce custom metadata;
- an external private file reference;
- an event stream and durable audit archive;
- a rebuildable BFF read model; or
- an embedded value object.

The approved physical count remains **0** because no Salesforce metadata, org review, standard-versus-custom decision, indexing/load proof, sharing/FLS validation, encryption decision or migration mapping has been approved or deployed.

## Acceptance evidence

| Evidence | Location |
| --- | --- |
| Canonical concept/field/relationship/transition/security/analytics contract | `src/data/canonicalDataModel.ts` |
| Normalized dense runtime and projection functions | `src/data/canonicalRuntime.ts` |
| Canonical analytics projection | `src/data/analytics.ts` |
| Relationship-backed row-access evaluator | `src/data/access.ts` |
| Interactive atomic model studio | `src/components/ObjectDataStudio.tsx` |
| Contract and invariant tests | `src/test/dataModel.test.ts` |
| Machine-readable summary | `artifacts/v1.9/readiness.json` and `artifacts/v1.9/data-model.json` |
| Requirement-by-requirement completion audit | `docs/AUDIT-v1.9.md` |

Passing this matrix proves a synthetic logical/runtime data-model release. It does not authorize real candidate data, a pilot, a Salesforce deployment, backend persistence, IdP use or provider writes.
