import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Database,
  Filter,
  LineChart,
  RotateCcw,
  ShieldCheck,
  Table2,
} from "lucide-react";
import {
  analyticsApplications,
  analyticsSource,
  dashboardCatalog,
  metricDefinitions,
  type AnalyticsApplication,
  type DashboardDefinition,
} from "../data/analytics";
import { analyticsRowsForRole, displayCandidateForRole } from "../data/access";
import {
  lifecycleTypes,
  objectCatalog,
  objectCatalogSummary,
  objectDomains,
} from "../data/objectCatalog";
import {
  atomicConcepts,
  canonicalDataModelSummary,
  relationshipContracts,
  transitionContracts,
} from "../data/canonicalDataModel";
import { ExplainPanel, Pill } from "./Common";

export type MetricView = {
  key: string;
  label: string;
  display: string;
  detail: string;
  tone: "success" | "warning" | "danger" | "info" | "neutral";
  numerator?: number;
  denominator?: number;
  available: boolean;
};

const terminalStages = new Set<AnalyticsApplication["stage"]>([
  "Hired",
  "Rejected",
  "Withdrawn",
]);
export const safeRatio = (
  numerator: number,
  denominator: number,
): number | null => (denominator > 0 ? numerator / denominator : null);
const percent = (value: number | null) =>
  value == null ? "N/A" : `${Math.round(value * 100)}%`;
const median = (values: number[]) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
};

function rateView(
  key: string,
  label: string,
  numerator: number,
  denominator: number,
  threshold: number | null,
  denominatorLabel: string,
  failureTone: MetricView["tone"] = "warning",
): MetricView {
  const value = safeRatio(numerator, denominator);
  return {
    key,
    label,
    display: percent(value),
    detail:
      value == null
        ? `No eligible ${denominatorLabel}`
        : `${numerator} of ${denominator} ${denominatorLabel}`,
    tone:
      value == null
        ? "neutral"
        : threshold == null
          ? "info"
          : value >= threshold
            ? "success"
            : failureTone,
    numerator,
    denominator,
    available: value != null,
  };
}

export function metricViews(
  rows: AnalyticsApplication[],
): Record<string, MetricView> {
  const active = rows.filter((row) => !terminalStages.has(row.stage));
  const withinSla = active.filter((row) => row.stageAgeDays <= row.slaDays);
  const evidenceEligible = rows.filter((row) => row.scorecardsRequired > 0);
  const evidenceComplete = evidenceEligible.filter(
    (row) => row.scorecardsSubmitted === row.scorecardsRequired,
  );
  const scheduleEligible = rows.filter(
    (row) => row.interviewState !== "Not required",
  );
  const scheduleConfirmed = scheduleEligible.filter((row) =>
    ["Confirmed", "Complete"].includes(row.interviewState),
  );
  const respondedOffers = rows.filter((row) =>
    ["Accepted", "Declined"].includes(row.offerState),
  );
  const acceptedOffers = respondedOffers.filter(
    (row) => row.offerState === "Accepted",
  );
  const messageEligible = rows.filter(
    (row) => row.messageState !== "Suppressed",
  );
  const deliveredMessages = messageEligible.filter(
    (row) => row.messageState === "Delivered",
  );
  const automationEligible = rows.filter((row) =>
    ["Succeeded", "Failed"].includes(row.automationState),
  );
  const automationSucceeded = automationEligible.filter(
    (row) => row.automationState === "Succeeded",
  );
  const privacyActive = rows.filter((row) => row.privacyState !== "None");
  const privacyOnTime = privacyActive.filter(
    (row) => row.privacyState !== "Overdue",
  );
  const handoffAttempted = rows.filter((row) =>
    ["Reconciled", "Failed"].includes(row.handoffState),
  );
  const handoffReconciled = handoffAttempted.filter(
    (row) => row.handoffState === "Reconciled",
  );
  const hires = rows.filter(
    (row) => row.stage === "Hired" && row.handoffState === "Reconciled",
  );
  const experienceEligible = rows.filter((row) => row.experienceEligible);
  const experienceResponses = experienceEligible.filter(
    (row): row is AnalyticsApplication & { experienceRating: number } =>
      row.experienceRating != null,
  );
  const averageExperience = experienceResponses.length
    ? experienceResponses.reduce((sum, row) => sum + row.experienceRating, 0) /
      experienceResponses.length
    : null;
  const medianStageAge = median(active.map((row) => row.stageAgeDays));
  const allObjects = objectCatalogSummary.families;
  const qualityCovered = objectCatalog.filter(
    (item) => item.dataQuality.length > 0 && item.relationships.length > 0,
  ).length;
  return {
    application_volume: {
      key: "application_volume",
      label: "Applications",
      display: String(rows.length),
      detail: rows.length
        ? "Filtered role-visible synthetic attempts"
        : "No role-visible rows match",
      tone: rows.length ? "info" : "neutral",
      numerator: rows.length,
      denominator: rows.length,
      available: rows.length > 0,
    },
    active_applications: {
      key: "active_applications",
      label: "Active applications",
      display: String(active.length),
      detail: rows.length
        ? `${rows.length - active.length} terminal in view`
        : "No filtered population",
      tone: rows.length ? "neutral" : "neutral",
      numerator: active.length,
      denominator: rows.length,
      available: rows.length > 0,
    },
    stage_sla_rate: rateView(
      "stage_sla_rate",
      "Within stage SLA",
      withinSla.length,
      active.length,
      0.8,
      "active applications",
    ),
    median_stage_age: {
      key: "median_stage_age",
      label: "Median stage age",
      display: medianStageAge == null ? "N/A" : `${medianStageAge.toFixed(1)}d`,
      detail:
        medianStageAge == null
          ? "No active applications"
          : `${active.length} active applications`,
      tone: "neutral",
      denominator: active.length,
      available: medianStageAge != null,
    },
    evidence_readiness: rateView(
      "evidence_readiness",
      "Evidence complete",
      evidenceComplete.length,
      evidenceEligible.length,
      0.75,
      "interview contexts",
    ),
    schedule_confirmation: rateView(
      "schedule_confirmation",
      "Sessions confirmed",
      scheduleConfirmed.length,
      scheduleEligible.length,
      0.8,
      "interview contexts",
    ),
    offer_acceptance: rateView(
      "offer_acceptance",
      "Offer acceptance",
      acceptedOffers.length,
      respondedOffers.length,
      0.8,
      "terminal offer responses",
    ),
    hires: {
      key: "hires",
      label: "Reconciled hires",
      display: String(hires.length),
      detail: rows.length
        ? "Exact handoff acknowledged"
        : "No filtered population",
      tone: hires.length ? "success" : "neutral",
      numerator: hires.length,
      denominator: rows.length,
      available: rows.length > 0,
    },
    candidate_experience: {
      key: "candidate_experience",
      label: "Candidate experience",
      display:
        averageExperience == null ? "N/A" : `${averageExperience.toFixed(1)}/5`,
      detail:
        averageExperience == null
          ? `0 of ${experienceEligible.length} eligible responses`
          : `${experienceResponses.length} responses of ${experienceEligible.length} eligible`,
      tone:
        averageExperience == null
          ? "neutral"
          : averageExperience >= 4
            ? "success"
            : "warning",
      numerator: experienceResponses.length,
      denominator: experienceEligible.length,
      available: averageExperience != null,
    },
    message_delivery: rateView(
      "message_delivery",
      "Message delivery",
      deliveredMessages.length,
      messageEligible.length,
      0.9,
      "eligible messages",
    ),
    automation_success: rateView(
      "automation_success",
      "Automation success",
      automationSucceeded.length,
      automationEligible.length,
      0.95,
      "eligible runs",
    ),
    privacy_sla: rateView(
      "privacy_sla",
      "Privacy cases on time",
      privacyOnTime.length,
      privacyActive.length,
      1,
      "active privacy cases",
      "danger",
    ),
    handoff_reconciliation: rateView(
      "handoff_reconciliation",
      "Handoffs reconciled",
      handoffReconciled.length,
      handoffAttempted.length,
      1,
      "attempted handoffs",
      "danger",
    ),
    source_to_hire: rateView(
      "source_to_hire",
      "Source-to-hire",
      hires.length,
      rows.length,
      null,
      "application attempts",
      "info",
    ),
    object_coverage: rateView(
      "object_coverage",
      "Object lifecycle coverage",
      objectCatalogSummary.lifecycleClassified,
      allObjects,
      1,
      "object families",
    ),
    data_group_coverage: rateView(
      "data_group_coverage",
      "DAT-group coverage",
      objectCatalogSummary.logicalDataGroups,
      48,
      1,
      "DAT groups",
    ),
    data_point_coverage: rateView(
      "data_point_coverage",
      "Logical field coverage",
      objectCatalog.filter((item) => item.dataPoints.length === 16).length,
      allObjects,
      1,
      "object families",
    ),
    quality_coverage: rateView(
      "quality_coverage",
      "Quality-rule coverage",
      qualityCovered,
      allObjects,
      1,
      "object families",
    ),
  };
}

type ApplicationBreakdown = Exclude<
  DashboardDefinition["primaryBreakdown"],
  "domain" | "lifecycleType"
>;

function breakdownFor(
  rows: AnalyticsApplication[],
  field: ApplicationBreakdown,
) {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const raw = row[field];
    const label =
      field === "experienceRating"
        ? raw == null
          ? "No response"
          : `${raw} of 5`
        : String(raw);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

function trendFor(rows: AnalyticsApplication[], windowDays: number) {
  const width = windowDays <= 7 ? 2 : windowDays <= 30 ? 4 : 6;
  const bucketDays = Math.ceil(windowDays / width);
  return Array.from({ length: width }, (_, index) => {
    const newest = (width - index - 1) * bucketDays;
    const oldest = newest + bucketDays;
    const bucket = rows.filter(
      (row) => row.daysAgo >= newest && row.daysAgo < oldest,
    );
    return {
      label: newest === 0 ? "Current" : `${newest}–${oldest - 1}d ago`,
      applications: bucket.length,
      hires: bucket.filter((row) => row.stage === "Hired").length,
    };
  });
}

function BarBreakdown({
  rows,
  title,
}: {
  rows: { label: string; value: number }[];
  title: string;
}) {
  const maximum = Math.max(1, ...rows.map((row) => row.value));
  return (
    <div className="analytics-bars" role="group" aria-label={title}>
      {rows.length ? (
        rows.map((row) => (
          <div className="analytics-bar-row" key={row.label}>
            <span>{row.label}</span>
            <div aria-hidden="true">
              <i
                style={{
                  width: `${Math.max(3, (row.value / maximum) * 100)}%`,
                }}
              />
            </div>
            <strong>{row.value}</strong>
          </div>
        ))
      ) : (
        <div className="analytics-empty">
          No rows match the current filters.
        </div>
      )}
    </div>
  );
}

function TrendColumns({ rows }: { rows: ReturnType<typeof trendFor> }) {
  const maximum = Math.max(1, ...rows.map((row) => row.applications));
  return (
    <div
      className="trend-columns"
      role="group"
      aria-label="Application and hire movement over the selected period"
    >
      {rows.map((row) => (
        <div className="trend-column" key={row.label}>
          <div className="trend-marks" aria-hidden="true">
            <i
              className="application-mark"
              style={{
                height: `${Math.max(6, (row.applications / maximum) * 100)}%`,
              }}
            />
            <i
              className="hire-mark"
              style={{ height: `${Math.max(3, (row.hires / maximum) * 100)}%` }}
            />
          </div>
          <strong>{row.applications}</strong>
          <span>{row.label}</span>
          <small>{row.hires} hires</small>
        </div>
      ))}
    </div>
  );
}

function DataReadinessSurface() {
  const [domain, setDomain] = useState("all");
  const [lifecycle, setLifecycle] = useState("all");
  const rows = useMemo(
    () =>
      objectCatalog.filter(
        (object) =>
          (domain === "all" || object.domain === domain) &&
          (lifecycle === "all" || object.lifecycleType === lifecycle),
      ),
    [domain, lifecycle],
  );
  const concepts = useMemo(() => {
    const familyIds = new Set(rows.map((object) => object.id));
    return atomicConcepts.filter((concept) => familyIds.has(concept.familyId));
  }, [rows]);
  const cards = useMemo(() => {
    const familyDenominator = rows.length;
    const conceptDenominator = concepts.length;
    return [
      rateView(
        "object_coverage",
        "Atomic decomposition complete",
        rows.filter((object) =>
          concepts.some((concept) => concept.familyId === object.id),
        ).length,
        familyDenominator,
        1,
        "filtered navigation families",
      ),
      {
        ...rateView(
          "data_group_coverage",
          "Atomic concepts in scope",
          concepts.length,
          canonicalDataModelSummary.atomicConcepts,
          null,
          "canonical atomic concepts",
        ),
        display: familyDenominator ? String(concepts.length) : "N/A",
        detail: familyDenominator
          ? `${concepts.length} concepts resolve from ${familyDenominator} filtered families`
          : "No filtered navigation families",
      },
      rateView(
        "data_point_coverage",
        "Atomic field contract complete",
        concepts.filter(
          (concept) =>
            concept.fields.filter((field) => field.category === "Governance")
              .length === 13 &&
            concept.fields.filter((field) => field.category === "Business")
              .length >= 3,
        ).length,
        conceptDenominator,
        1,
        "filtered atomic concepts",
      ),
      rateView(
        "quality_coverage",
        "Relationship + lifecycle complete",
        concepts.filter(
          (concept) =>
            relationshipContracts.some(
              (relationship) => relationship.from === concept.name,
            ) &&
            transitionContracts.some(
              (transition) => transition.concept === concept.name,
            ),
        ).length,
        conceptDenominator,
        1,
        "filtered atomic concepts",
      ),
    ];
  }, [concepts, rows]);
  const breakdown = useMemo(() => {
    const counts = new Map<string, number>();
    for (const concept of concepts)
      counts.set(concept.kind, (counts.get(concept.kind) ?? 0) + 1);
    return [...counts]
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [concepts]);
  const fieldCounts = useMemo(
    () => ({
      governance: concepts.reduce(
        (total, concept) =>
          total +
          concept.fields.filter((field) => field.category === "Governance")
            .length,
        0,
      ),
      business: concepts.reduce(
        (total, concept) =>
          total +
          concept.fields.filter((field) => field.category === "Business")
            .length,
        0,
      ),
    }),
    [concepts],
  );
  return (
    <>
      <section
        className="analytics-filter-bar"
        aria-label="Data readiness filters"
      >
        <div className="filter-heading">
          <Filter size={17} />
          <strong>Object filters</strong>
        </div>
        <label>
          <span>Domain</span>
          <select
            aria-label="Data readiness domain filter"
            value={domain}
            onChange={(event) => setDomain(event.target.value)}
          >
            <option value="all">All 12 domains</option>
            {objectDomains.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Lifecycle</span>
          <select
            aria-label="Data readiness lifecycle filter"
            value={lifecycle}
            onChange={(event) => setLifecycle(event.target.value)}
          >
            <option value="all">All lifecycle types</option>
            {lifecycleTypes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <button
          className="secondary-button"
          onClick={() => {
            setDomain("all");
            setLifecycle("all");
          }}
        >
          <RotateCcw size={15} /> Reset
        </button>
        <span className="analytics-result-count" role="status">
          {rows.length} of {objectCatalog.length} navigation families ·{" "}
          {concepts.length} of {canonicalDataModelSummary.atomicConcepts} atomic
          concepts
        </span>
      </section>
      <section
        className="analytics-metric-strip"
        aria-label="Object and data contract headline metrics"
      >
        {cards.map((metric) => (
          <article
            className={`analytics-metric metric-${metric.tone}`}
            key={metric.key}
          >
            <span>{metric.label}</span>
            <strong>{metric.display}</strong>
            <small>{metric.detail}</small>
          </article>
        ))}
      </section>
      <div className="analytics-chart-grid">
        <section className="panel analytics-chart">
          <div className="panel-heading">
            <div>
              <BarChart3 size={18} />
              <h2>Atomic concepts by model kind</h2>
              <span>Resolved from the same filtered family population</span>
            </div>
            <Pill tone="info">Reconciled</Pill>
          </div>
          <BarBreakdown
            rows={breakdown}
            title="Atomic concepts by model kind"
          />
        </section>
        <section className="panel analytics-chart">
          <div className="panel-heading">
            <div>
              <Database size={18} />
              <h2>Atomic field composition</h2>
              <span>
                Business fields are distinct from governance/provenance fields
              </span>
            </div>
            <Pill tone="success">
              {fieldCounts.governance + fieldCounts.business} in scope
            </Pill>
          </div>
          <BarBreakdown
            rows={[
              {
                label: "Governance/provenance",
                value: fieldCounts.governance,
              },
              {
                label: "Business",
                value: fieldCounts.business,
              },
            ]}
            title="Atomic field composition"
          />
        </section>
      </div>
      <section className="panel analytics-detail">
        <div className="panel-heading">
          <div>
            <Table2 size={18} />
            <h2>Filtered atomic-model readiness detail</h2>
            <span>Every concept resolves from the family filters above</span>
          </div>
          <Pill>{Math.min(20, concepts.length)} shown</Pill>
        </div>
        <div
          className="data-readiness-table"
          role="table"
          aria-label="Filtered atomic model readiness detail"
        >
          <div role="row">
            <span role="columnheader">Atomic concept</span>
            <span role="columnheader">Domain</span>
            <span role="columnheader">Kind / grain</span>
            <span role="columnheader">Fields</span>
            <span role="columnheader">Relationships</span>
            <span role="columnheader">Commands</span>
          </div>
          {concepts.slice(0, 20).map((concept) => {
            const family = objectCatalog.find(
              (object) => object.id === concept.familyId,
            );
            return (
            <div role="row" key={concept.id}>
              <strong role="cell">
                {concept.name}
                <small>{concept.id} · {concept.familyId}</small>
              </strong>
              <span role="cell">{family?.domain ?? "Unmapped"}</span>
              <span role="cell">
                {concept.kind}
                <small>{concept.grain}</small>
              </span>
              <span role="cell">
                {concept.fields.length}
                <small>
                  {
                    concept.fields.filter(
                      (field) => field.category === "Business",
                    ).length
                  }{" "}
                  business
                </small>
              </span>
              <span role="cell">
                {
                  relationshipContracts.filter(
                    (relationship) => relationship.from === concept.name,
                  ).length
                }
              </span>
              <span role="cell">
                {
                  transitionContracts.filter(
                    (transition) => transition.concept === concept.name,
                  ).length
                }
              </span>
            </div>
          )})}
        </div>
      </section>
      <div className="analytics-assurance-grid">
        <section className="panel metric-dictionary">
          <div className="panel-heading">
            <div>
              <Database size={18} />
              <h2>Metric definitions</h2>
              <span>Atomic concepts, not application analytics rows</span>
            </div>
            <Pill tone="success">Reconciled</Pill>
          </div>
          {[
            "object_coverage",
            "data_group_coverage",
            "data_point_coverage",
            "quality_coverage",
          ].map((key) => (
            <details key={key}>
              <summary>
                {metricDefinitions[key].label}
                <span>{metricDefinitions[key].grain}</span>
              </summary>
              <p>{metricDefinitions[key].definition}</p>
            </details>
          ))}
        </section>
        <section className="panel source-contract">
          <div className="panel-heading">
            <div>
              <ShieldCheck size={18} />
              <h2>Source and trust contract</h2>
              <span>SRC-CANONICAL-DATA-MODEL-v1.9</span>
            </div>
            <Pill tone="success">Dedicated object source</Pill>
          </div>
          <dl>
            <div>
              <dt>Source path</dt>
              <dd>
                <code>src/data/canonicalDataModel.ts</code>
              </dd>
            </div>
            <div>
              <dt>Grain</dt>
              <dd>One atomic logical concept resolved from one navigation family</dd>
            </div>
            <div>
              <dt>Freshness</dt>
              <dd>Repository build snapshot · v1.9</dd>
            </div>
            <div>
              <dt>Current predicates</dt>
              <dd>
                {domain} · {lifecycle}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </>
  );
}

export function AnalyticsDashboard({
  role,
  announce,
}: {
  role: string;
  announce: (message: string) => void;
}) {
  const permittedDashboards = useMemo(
    () =>
      role === "Auditor"
        ? dashboardCatalog
        : dashboardCatalog.filter((dashboard) =>
            dashboard.roles.includes(role),
          ),
    [role],
  );
  const [dashboardId, setDashboardId] = useState(
    permittedDashboards[0]?.id ?? "talent-overview",
  );
  const [windowDays, setWindowDays] = useState("30");
  const [jobId, setJobId] = useState("all");
  const [source, setSource] = useState("all");
  const [stage, setStage] = useState("all");
  useEffect(() => {
    if (!permittedDashboards.some((dashboard) => dashboard.id === dashboardId))
      setDashboardId(permittedDashboards[0]?.id ?? "talent-overview");
  }, [dashboardId, permittedDashboards]);
  const dashboard =
    permittedDashboards.find((item) => item.id === dashboardId) ??
    permittedDashboards[0] ??
    dashboardCatalog[0];
  const dayLimit = Number(windowDays);
  const roleRows = useMemo(
    () => analyticsRowsForRole(role, analyticsApplications),
    [role],
  );
  const filtered = useMemo(
    () =>
      roleRows.filter(
        (row) =>
          row.daysAgo < dayLimit &&
          (jobId === "all" || row.jobId === jobId) &&
          (source === "all" || row.source === source) &&
          (stage === "all" || row.stage === stage),
      ),
    [dayLimit, jobId, roleRows, source, stage],
  );
  const metrics = metricViews(filtered);
  const cards = dashboard.metricKeys.map((key) => metrics[key]);
  const breakdown = breakdownFor(
    filtered,
    dashboard.primaryBreakdown as ApplicationBreakdown,
  );
  const trend = trendFor(filtered, dayLimit);
  const resetFilters = () => {
    setWindowDays("30");
    setJobId("all");
    setSource("all");
    setStage("all");
  };

  const sharedHeader = (
    <>
      <section className="analytics-brief" aria-labelledby="analytics-question">
        <div>
          <span className="eyebrow">{dashboard.purpose}</span>
          <h2 id="analytics-question">{dashboard.question}</h2>
          <p>
            Permission- and row-filtered synthetic metrics. No dashboard changes
            candidate state or creates an employment recommendation.
          </p>
        </div>
        <div className="snapshot-status">
          <CheckCircle2 size={18} />
          <span>
            <strong>Ready fixture</strong>
            {dashboard.id === "data-readiness"
              ? "Canonical data-model snapshot · v1.9"
              : analyticsSource.freshness}
          </span>
        </div>
      </section>
      <section
        className="dashboard-switcher"
        aria-label="Permitted dashboard portfolio"
      >
        <label>
          <span>Dashboard</span>
          <select
            aria-label="Choose analytics dashboard"
            value={dashboard.id}
            onChange={(event) => setDashboardId(event.target.value)}
          >
            {permittedDashboards.map((item) => (
              <option value={item.id} key={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <div className="dashboard-pills">
          {permittedDashboards.map((item) => (
            <button
              className={item.id === dashboard.id ? "active" : ""}
              aria-pressed={item.id === dashboard.id}
              onClick={() => setDashboardId(item.id)}
              key={item.id}
            >
              {item.shortName}
            </button>
          ))}
        </div>
        <Pill tone="info">{permittedDashboards.length} permitted views</Pill>
      </section>
    </>
  );

  if (dashboard.id === "data-readiness")
    return (
      <div className="analytics-dashboard">
        {sharedHeader}
        <DataReadinessSurface />
        <ExplainPanel
          title="Reconciled data-readiness boundary"
          source="SRC-CANONICAL-DATA-MODEL-v1.9"
        >
          Every card, chart and row on this view is derived from the same
          filtered navigation-family population and its resolved atomic
          concepts. Application date, job, source and stage filters are
          intentionally absent.
        </ExplainPanel>
      </div>
    );

  return (
    <div className="analytics-dashboard">
      {sharedHeader}

      <section
        className="analytics-filter-bar"
        aria-label="Global analytics filters"
      >
        <div className="filter-heading">
          <Filter size={17} />
          <strong>Global filters</strong>
        </div>
        <label>
          <span>Window</span>
          <select
            aria-label="Analytics date window"
            value={windowDays}
            onChange={(event) => setWindowDays(event.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </label>
        <label>
          <span>Job</span>
          <select
            aria-label="Analytics job filter"
            value={jobId}
            onChange={(event) => setJobId(event.target.value)}
          >
            <option value="all">All jobs</option>
            <option value="JOB-DEMO-001">Senior Product Designer</option>
            <option value="JOB-DEMO-002">Recruiting Operations Partner</option>
            <option value="JOB-DEMO-003">Staff Data Platform Engineer</option>
          </select>
        </label>
        <label>
          <span>Source</span>
          <select
            aria-label="Analytics source filter"
            value={source}
            onChange={(event) => setSource(event.target.value)}
          >
            <option value="all">All sources</option>
            {["Careers site", "Referral", "Agency", "Sourced"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Stage</span>
          <select
            aria-label="Analytics stage filter"
            value={stage}
            onChange={(event) => setStage(event.target.value)}
          >
            <option value="all">All stages</option>
            {[
              "Recruiter review",
              "Screening",
              "Scheduling",
              "Interviews",
              "Debrief",
              "Offer",
              "Hired",
              "Rejected",
              "Withdrawn",
            ].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <button className="secondary-button" onClick={resetFilters}>
          <RotateCcw size={15} /> Reset
        </button>
        <span className="analytics-result-count" role="status">
          {filtered.length} of {roleRows.length} role-visible records
        </span>
      </section>

      <section
        className="analytics-metric-strip"
        aria-label={`${dashboard.name} headline metrics`}
      >
        {cards.map((metric) => (
          <article
            className={`analytics-metric metric-${metric.tone}`}
            key={metric.key}
          >
            <span>{metric.label}</span>
            <strong>{metric.display}</strong>
            <small>{metric.detail}</small>
          </article>
        ))}
      </section>

      <div className="analytics-chart-grid">
        <section className="panel analytics-chart">
          <div className="panel-heading">
            <div>
              <BarChart3 size={18} />
              <h2>{dashboard.name} breakdown</h2>
              <span>
                Count by{" "}
                {dashboard.primaryBreakdown
                  .replace(/([A-Z])/g, " $1")
                  .toLowerCase()}
              </span>
            </div>
            <Pill tone="info">Filtered</Pill>
          </div>
          <BarBreakdown
            rows={breakdown}
            title={`${dashboard.name} breakdown`}
          />
        </section>
        <section className="panel analytics-chart">
          <div className="panel-heading">
            <div>
              <LineChart size={18} />
              <h2>Movement over time</h2>
              <span>Applications with reconciled hires overlaid</span>
            </div>
            <div className="chart-legend">
              <span>
                <i className="legend-applications" />
                Applications
              </span>
              <span>
                <i className="legend-hires" />
                Hires
              </span>
            </div>
          </div>
          <TrendColumns rows={trend} />
        </section>
      </div>

      <section className="panel analytics-detail">
        <div className="panel-heading">
          <div>
            <Table2 size={18} />
            <h2>Filtered operational detail</h2>
            <span>Exact role-scoped synthetic lookup rows; newest first</span>
          </div>
          <Pill>{Math.min(10, filtered.length)} shown</Pill>
        </div>
        <div
          className="analytics-table"
          role="table"
          aria-label="Filtered synthetic analytics detail"
        >
          <div className="analytics-table-row analytics-table-head" role="row">
            <span role="columnheader">Application</span>
            <span role="columnheader">Job/source</span>
            <span role="columnheader">Stage</span>
            <span role="columnheader">Owner</span>
            <span role="columnheader">Age/SLA</span>
            <span role="columnheader">Operational state</span>
          </div>
          {[...filtered]
            .sort((a, b) => a.daysAgo - b.daysAgo)
            .slice(0, 10)
            .map((row) => (
              <div className="analytics-table-row" role="row" key={row.id}>
                <strong role="cell" data-label="Application">
                  {row.id}
                  <small>{displayCandidateForRole(role, row)}</small>
                </strong>
                <span role="cell" data-label="Job/source">
                  {row.job}
                  <small>{row.source}</small>
                </span>
                <span role="cell" data-label="Stage">
                  <Pill
                    tone={
                      terminalStages.has(row.stage)
                        ? "neutral"
                        : row.stageAgeDays > row.slaDays
                          ? "danger"
                          : "info"
                    }
                  >
                    {row.stage}
                  </Pill>
                </span>
                <span role="cell" data-label="Owner">
                  {row.owner}
                </span>
                <span role="cell" data-label="Age/SLA">
                  {row.stageAgeDays}d / {row.slaDays}d
                </span>
                <span role="cell" data-label="Operational state">
                  {row.messageState} · {row.automationState}
                </span>
              </div>
            ))}
        </div>
      </section>

      <div className="analytics-assurance-grid">
        <section className="panel metric-dictionary">
          <div className="panel-heading">
            <div>
              <Database size={18} />
              <h2>Metric definitions</h2>
              <span>Formula, population and grain for this view</span>
            </div>
            <Pill tone="success">Reconciled</Pill>
          </div>
          {dashboard.metricKeys.map((key) => (
            <details key={key}>
              <summary>
                {metricDefinitions[key].label}
                <span>{metricDefinitions[key].grain}</span>
              </summary>
              <p>{metricDefinitions[key].definition}</p>
            </details>
          ))}
        </section>
        <section className="panel source-contract">
          <div className="panel-heading">
            <div>
              <ShieldCheck size={18} />
              <h2>Source and trust contract</h2>
              <span>{analyticsSource.id}</span>
            </div>
            <Pill tone="success">Synthetic source</Pill>
          </div>
          <dl>
            <div>
              <dt>Source path</dt>
              <dd>
                <code>{analyticsSource.path}</code>
              </dd>
            </div>
            <div>
              <dt>Grain</dt>
              <dd>{analyticsSource.grain}</dd>
            </div>
            <div>
              <dt>Freshness</dt>
              <dd>{analyticsSource.freshness}</dd>
            </div>
            <div>
              <dt>Exclusions</dt>
              <dd>{analyticsSource.exclusions}</dd>
            </div>
            <div>
              <dt>Current predicates</dt>
              <dd>
                {windowDays} days · {jobId} · {source} · {stage}
              </dd>
            </div>
          </dl>
          <button
            className="secondary-button full-button"
            onClick={() =>
              announce(
                `${dashboard.name} source and metric package prepared in memory; no report or file was exported.`,
              )
            }
          >
            Preview report package
          </button>
        </section>
      </div>
      <ExplainPanel
        title="Evidence boundary"
        source="v1.7 synthetic analytics contract"
      >
        Displayed metrics, filters, empty denominators and row scopes are
        testable synthetic contracts. Physical warehouse facts, live identity
        enforcement and pilot outcomes remain separate gates and are never
        represented by a blended completion percentage.
      </ExplainPanel>
    </div>
  );
}
