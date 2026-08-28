import { describe, expect, it } from "vitest";
import { analyticsApplications } from "../data/analytics";
import { analyticsRowsForRole, roleDataScopes } from "../data/access";
import { demoPersonas } from "../data/fixtures";
import {
  coreSeedSummary,
  seededApplications,
  seededAssignments,
  seededCandidates,
  seededInterviews,
  seededJobs,
} from "../data/coreRecords";
import { objectCatalog, objectCatalogSummary } from "../data/objectCatalog";
import {
  objectForSlug,
  objectListPath,
  objectSlug,
  objectWorkspaceSummary,
  seededObjectRecords,
} from "../data/objectWorkspace";
import {
  reportDeliveries,
  reportRestatements,
  reportSchedules,
  reportTargets,
  savedReportDefinitions,
} from "../data/reporting";
import { metricViews, safeRatio } from "../components/AnalyticsDashboard";

describe("v1.8 metric and filter contracts", () => {
  it("uses N/A for every zero-eligible denominator", () => {
    expect(safeRatio(0, 0)).toBeNull();
    const views = metricViews([]);
    for (const key of [
      "stage_sla_rate",
      "evidence_readiness",
      "schedule_confirmation",
      "offer_acceptance",
      "candidate_experience",
      "message_delivery",
      "automation_success",
      "privacy_sla",
      "handoff_reconciliation",
      "source_to_hire",
    ]) {
      expect(views[key].display, key).toBe("N/A");
      expect(views[key].available, key).toBe(false);
    }
  });

  it("populates all 600 supported global-filter combinations", () => {
    const windows = [7, 30, 90];
    const jobs = ["all", "JOB-DEMO-001", "JOB-DEMO-002", "JOB-DEMO-003"];
    const sources = ["all", "Careers site", "Referral", "Agency", "Sourced"];
    const stages = [
      "all",
      "Recruiter review",
      "Screening",
      "Scheduling",
      "Interviews",
      "Debrief",
      "Offer",
      "Hired",
      "Rejected",
      "Withdrawn",
    ];
    let tested = 0;
    let empty = 0;
    for (const windowDays of windows)
      for (const jobId of jobs)
        for (const source of sources)
          for (const stage of stages) {
            tested += 1;
            const rows = analyticsApplications.filter(
              (row) =>
                row.daysAgo < windowDays &&
                (jobId === "all" || row.jobId === jobId) &&
                (source === "all" || row.source === source) &&
                (stage === "all" || row.stage === stage),
            );
            if (!rows.length) empty += 1;
          }
    expect(tested).toBe(600);
    expect(empty).toBe(0);
  });

  it("defines a row and field scope for every internal persona", () => {
    expect(demoPersonas).toHaveLength(12);
    for (const persona of demoPersonas) {
      expect(roleDataScopes[persona.role], persona.role).toBeDefined();
      const rows = analyticsRowsForRole(persona.role, analyticsApplications);
      expect(rows.length, persona.role).toBeLessThanOrEqual(
        analyticsApplications.length,
      );
      if (!["Configuration Admin"].includes(persona.role))
        expect(rows.length, persona.role).toBeGreaterThan(0);
    }
  });
});

describe("v1.8 object workspace contract", () => {
  it("instantiates list, new, detail and edit contracts for all 92 families", () => {
    expect(objectWorkspaceSummary).toEqual({
      objectFamilies: 92,
      pageTemplates: 4,
      routedPageInstances: 368,
      seededRecords: 1104,
      logicalFields: 1472,
      businessFields: 552,
      governanceFields: 920,
    });
    expect(
      new Set(objectCatalog.map((object) => objectSlug(object.name))).size,
    ).toBe(92);
    for (const object of objectCatalog) {
      const base = objectListPath(object);
      expect(objectForSlug(base.split("/").at(-1))).toBe(object);
      expect(`${base}/new`).toMatch(/^\/hr\/objects\/[a-z0-9-]+\/new$/);
      expect(`${base}/REC-001`).toMatch(/\/REC-001$/);
      expect(`${base}/REC-001/edit`).toMatch(/\/REC-001\/edit$/);
      expect(
        seededObjectRecords.filter((record) => record.objectId === object.id),
      ).toHaveLength(12);
      expect(object.dataPoints).toHaveLength(16);
      expect(
        object.dataPoints.every((field) => field.readRoles.length > 0),
      ).toBe(true);
      expect(
        object.dataPoints.some(
          (field) =>
            field.category === "Business" && field.writeRoles.length > 0,
        ),
      ).toBe(true);
    }
  });

  it("reconciles the 920 legacy claim as governance metadata, not all business fields", () => {
    expect(objectCatalogSummary.governanceDataPoints).toBe(920);
    expect(objectCatalogSummary.businessDataPoints).toBe(552);
    expect(objectCatalogSummary.minimumDataPoints).toBe(1472);
  });
});

describe("v1.8 heavy core-data contract", () => {
  it("provides dense, unique and referentially complete core fixtures", () => {
    expect(coreSeedSummary).toEqual({
      jobs: 48,
      candidates: 320,
      applications: 640,
      interviews: 192,
      assignments: 160,
      total: 1360,
    });
    for (const records of [
      seededJobs,
      seededCandidates,
      seededApplications,
      seededInterviews,
      seededAssignments,
    ]) expect(new Set(records.map((record) => record.id)).size).toBe(records.length);
    const jobIds = new Set(seededJobs.map((record) => record.id));
    const candidateIds = new Set(seededCandidates.map((record) => record.id));
    const applicationIds = new Set(seededApplications.map((record) => record.id));
    const interviewIds = new Set(seededInterviews.map((record) => record.id));
    expect(seededApplications.every((record) => jobIds.has(record.jobId))).toBe(true);
    expect(seededApplications.every((record) => candidateIds.has(record.candidateId))).toBe(true);
    expect(seededInterviews.every((record) => applicationIds.has(record.applicationId))).toBe(true);
    expect(seededAssignments.every((record) => interviewIds.has(record.interviewId))).toBe(true);
    expect(seededCandidates.every((record) => record.email.endsWith("@example.test"))).toBe(true);
  });
});

describe("v1.8 reporting controls", () => {
  it("seeds reusable reports, schedules, delivery evidence, targets and restatements", () => {
    expect(savedReportDefinitions.length).toBeGreaterThanOrEqual(6);
    expect(reportSchedules.length).toBeGreaterThan(0);
    expect(reportDeliveries.length).toBeGreaterThan(0);
    expect(reportTargets.length).toBeGreaterThan(0);
    expect(reportRestatements.length).toBeGreaterThan(0);
    expect(
      savedReportDefinitions.every(
        (report) => report.roles.length > 0 && report.measures.length > 0,
      ),
    ).toBe(true);
  });
});
