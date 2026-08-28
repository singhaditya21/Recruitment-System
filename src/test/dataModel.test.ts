import { describe, expect, it } from "vitest";
import {
  analyticsContracts,
  assertCanonicalDataModel,
  atomicConcepts,
  canonicalDataModelSummary,
  dataQualityContracts,
  domainEventCatalog,
  invariantContracts,
  referenceDataContracts,
  relationshipContracts,
  roleSecurityPolicies,
  transitionContracts,
} from "../data/canonicalDataModel";
import {
  canonicalCoreSummary,
  createCanonicalApplication,
  createCanonicalCandidate,
  projectApplications,
  projectAssignments,
  projectCandidates,
  projectInterviews,
  projectJobs,
  seededCanonicalCoreStore,
  updateCanonicalApplication,
  validateCanonicalCoreStore,
} from "../data/canonicalRuntime";
import { analyticsApplications } from "../data/analytics";
import { canReadObjectRecord, fieldAccessForRole } from "../data/access";
import { objectCatalog } from "../data/objectCatalog";
import { seededObjectRecords } from "../data/objectWorkspace";

describe("v1.9 canonical design contract", () => {
  it("decomposes the inherited catalogue and adds every required control concept", () => {
    expect(canonicalDataModelSummary).toMatchObject({
      navigationFamilies: 92,
      inheritedAtomicConcepts: 111,
      supportingConcepts: 18,
      atomicConcepts: 129,
      invariants: 15,
      events: 13,
      rolePolicies: 13,
      analyticsContracts: 12,
      referenceDatasets: 12,
      qualityRules: 15,
      physicalObjectsApproved: 0,
    });
    expect(assertCanonicalDataModel()).toEqual([]);
    expect(new Set(atomicConcepts.map((concept) => concept.name)).size).toBe(
      atomicConcepts.length,
    );
    expect(
      [
        "ApplicationSubmission",
        "ApplicationStageEvent",
        "HiringTeamMembership",
        "CandidateIdentifier",
        "CandidateDuplicateCase",
        "AccessGrant",
        "DelegationGrant",
        "BreakGlassGrant",
        "RetentionExecution",
        "DataQualityIssue",
      ].every((name) => atomicConcepts.some((concept) => concept.name === name)),
    ).toBe(true);
  });

  it("provides an object-specific, typed and governed dictionary for every concept", () => {
    for (const concept of atomicConcepts) {
      expect(
        concept.fields.filter((field) => field.category === "Governance"),
        concept.name,
      ).toHaveLength(13);
      expect(
        concept.fields.filter((field) => field.category === "Business").length,
        concept.name,
      ).toBeGreaterThanOrEqual(3);
      expect(new Set(concept.fields.map((field) => field.key)).size).toBe(
        concept.fields.length,
      );
      for (const field of concept.fields) {
        expect(field.businessDefinition, `${concept.name}.${field.key}`).not.toBe("");
        expect(field.validation, `${concept.name}.${field.key}`).not.toBe("");
        expect(field.retentionClass, `${concept.name}.${field.key}`).not.toBe("");
        expect(field.salesforceField, `${concept.name}.${field.key}`).not.toBe("");
      }
    }
    const sensitiveFields = atomicConcepts.flatMap((concept) =>
      concept.fields.filter((field) => field.classification.includes("Restricted")),
    );
    expect(sensitiveFields.length).toBeGreaterThan(0);
    expect(
      sensitiveFields.every((field) => field.encryption === "Required"),
    ).toBe(true);
  });

  it("makes relationship, transition, event and invariant contracts executable", () => {
    const conceptNames = new Set(atomicConcepts.map((concept) => concept.name));
    expect(
      relationshipContracts.every(
        (relationship) =>
          conceptNames.has(relationship.from) &&
          conceptNames.has(relationship.to) &&
          relationship.temporalRule.length > 0 &&
          relationship.invariant.length > 0,
      ),
    ).toBe(true);
    expect(
      atomicConcepts.every(
        (concept) =>
          transitionContracts.some(
            (transition) => transition.concept === concept.name,
          ),
      ),
    ).toBe(true);
    expect(
      transitionContracts.every(
        (transition) =>
          transition.guard.length > 0 &&
          transition.idempotencyScope.length > 0 &&
          transition.failureRecovery.length > 0,
      ),
    ).toBe(true);
    expect(
      domainEventCatalog.every(
        (event) =>
          event.requiredFields.includes("aggregate_version") &&
          event.requiredFields.includes("correlation_id") &&
          event.requiredFields.includes("causation_id") &&
          event.requiredFields.includes("payload_hash"),
      ),
    ).toBe(true);
    expect(
      invariantContracts.some(
        (invariant) => invariant.name === "Hired proof chain",
      ),
    ).toBe(true);
  });

  it("defines purpose, row relationship, field and temporal policy for every persona", () => {
    expect(roleSecurityPolicies).toHaveLength(13);
    for (const policy of roleSecurityPolicies) {
      expect(policy.purposes.length, policy.role).toBeGreaterThan(0);
      expect(policy.rowRelationships.length, policy.role).toBeGreaterThan(0);
      expect(policy.fieldEntitlements.length, policy.role).toBeGreaterThan(0);
      expect(policy.temporalRule, policy.role).not.toBe("");
      expect(policy.breakGlass, policy.role).not.toBe("");
    }
    expect(
      analyticsContracts.every(
        (contract) =>
          contract.grain.length > 0 &&
          contract.lateArrivalRule.length > 0 &&
          contract.restatementRule.length > 0,
      ),
    ).toBe(true);
    expect(referenceDataContracts).toHaveLength(12);
    expect(dataQualityContracts).toHaveLength(15);
  });
});

describe("v1.9 canonical runtime and lineage", () => {
  it("normalizes every dense record and generates all UI records as projections", () => {
    expect(validateCanonicalCoreStore(seededCanonicalCoreStore)).toEqual([]);
    expect(canonicalCoreSummary).toMatchObject({
      requisitions: 48,
      candidates: 320,
      candidateIdentifiers: 640,
      consents: 320,
      applications: 640,
      applicationStageEvents: 640,
      workItems: 640,
      interviews: 192,
      assignments: 160,
      issues: 0,
    });
    expect(projectJobs(seededCanonicalCoreStore)).toHaveLength(48);
    expect(projectCandidates(seededCanonicalCoreStore)).toHaveLength(320);
    expect(projectApplications(seededCanonicalCoreStore)).toHaveLength(640);
    expect(projectInterviews(seededCanonicalCoreStore)).toHaveLength(192);
    expect(projectAssignments(seededCanonicalCoreStore)).toHaveLength(160);
  });

  it("derives every analytics row from a canonical application and stage event", () => {
    const applicationById = new Map(
      seededCanonicalCoreStore.applications.map((application) => [
        application.id,
        application,
      ]),
    );
    const eventById = new Map(
      seededCanonicalCoreStore.applicationStageEvents.map((event) => [
        event.id,
        event,
      ]),
    );
    expect(analyticsApplications).toHaveLength(324);
    for (const row of analyticsApplications) {
      const application = applicationById.get(row.applicationId);
      const event = eventById.get(row.sourceEventId);
      expect(application, row.id).toBeDefined();
      expect(event, row.id).toBeDefined();
      expect(event?.applicationId).toBe(application?.id);
      expect(row.aggregateVersion).toBe(event?.aggregateVersion);
      expect(row.restatementVersion).toBe(1);
    }
  });

  it("enforces relationship-backed row access rather than deterministic sampling", () => {
    const requisition = objectCatalog.find(
      (object) => object.name === "Requisition",
    );
    expect(requisition).toBeDefined();
    const record = seededObjectRecords.find(
      (row) => row.objectId === requisition?.id,
    );
    expect(record).toBeDefined();
    if (!requisition || !record) return;
    expect(
      canReadObjectRecord(
        "Recruiter",
        "USR-REC-001",
        requisition,
        record,
      ),
    ).toBe(true);
    expect(
      canReadObjectRecord(
        "Recruiter",
        "USR-REC-001",
        requisition,
        {
          ...record,
          security: { ...record.security, organizationId: "ORG-OTHER-001" },
        },
      ),
    ).toBe(false);
    expect(
      canReadObjectRecord(
        "Recruiter",
        "USR-REC-001",
        requisition,
        {
          ...record,
          security: {
            ...record.security,
            validTo: "2026-08-01T00:00:00.000Z",
          },
        },
      ),
    ).toBe(false);
  });

  it("keeps auditor access scoped, read-only and minimized at field level", () => {
    const requisition = objectCatalog.find(
      (object) => object.name === "Requisition",
    );
    expect(requisition).toBeDefined();
    if (!requisition) return;
    const businessField = requisition.dataPoints.find(
      (field) => field.category === "Business",
    );
    const governanceField = requisition.dataPoints.find(
      (field) => field.category === "Governance",
    );
    expect(businessField).toBeDefined();
    expect(governanceField).toBeDefined();
    if (!businessField || !governanceField) return;
    expect(fieldAccessForRole("Auditor", businessField)).toEqual({
      read: false,
      write: false,
    });
    expect(fieldAccessForRole("Auditor", governanceField)).toEqual({
      read: true,
      write: false,
    });
  });

  it("applies candidate uniqueness and append-only stage mutation rules", () => {
    const withCandidate = createCanonicalCandidate(
      seededCanonicalCoreStore,
      "PER-MEM-900",
      {
        name: "Synthetic Canonical Person",
        email: "canonical.person@example.test",
        phone: "+1 555 019000",
        location: "Pune, India",
        timezone: "Asia/Kolkata",
        source: "Careers site",
        consent: "Candidate notice v2 · acknowledged",
        status: "Active",
        owner: "Alex Rivera",
      },
    );
    expect(() =>
      createCanonicalCandidate(withCandidate, "PER-MEM-901", {
        name: "Duplicate Synthetic Person",
        email: "CANONICAL.PERSON@example.test",
        phone: "+1 555 019001",
        location: "Pune, India",
        timezone: "Asia/Kolkata",
        source: "Careers site",
        consent: "Candidate notice v2 · acknowledged",
        status: "Active",
        owner: "Alex Rivera",
      }),
    ).toThrow(/duplicate-review/i);
    const withApplication = createCanonicalApplication(
      withCandidate,
      "APP-MEM-900",
      {
        candidateId: "PER-MEM-900",
        jobId: "JOB-DEMO-001",
        stage: "Recruiter review",
        owner: "Alex Rivera",
        nextInternalAction: "Review the canonical submission",
      },
    );
    const updated = updateCanonicalApplication(
      withApplication,
      "APP-MEM-900",
      {
        candidateId: "PER-MEM-900",
        jobId: "JOB-DEMO-001",
        stage: "Screening",
        owner: "Alex Rivera",
        nextInternalAction: "Complete structured screening",
      },
    );
    expect(
      updated.applicationStageEvents.filter(
        (event) => event.applicationId === "APP-MEM-900",
      ),
    ).toHaveLength(2);
    expect(
      projectApplications(updated).find(
        (application) => application.id === "APP-MEM-900",
      )?.stage,
    ).toBe("Screening");
  });
});
