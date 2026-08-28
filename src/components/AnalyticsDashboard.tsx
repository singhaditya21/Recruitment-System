import { useEffect, useMemo, useState } from "react";
import { BarChart3, CheckCircle2, Database, Filter, LineChart, RotateCcw, ShieldCheck, Table2 } from "lucide-react";
import { analyticsApplications, analyticsSource, dashboardCatalog, metricDefinitions, type AnalyticsApplication, type DashboardDefinition } from "../data/analytics";
import { objectCatalog, objectCatalogSummary } from "../data/objectCatalog";
import { ExplainPanel, Pill } from "./Common";

type MetricView = { key: string; label: string; display: string; detail: string; tone: "success" | "warning" | "danger" | "info" | "neutral" };

const terminalStages = new Set<AnalyticsApplication["stage"]>(["Hired", "Rejected", "Withdrawn"]);
const ratio = (numerator: number, denominator: number) => denominator ? numerator / denominator : 0;
const percent = (value: number) => `${Math.round(value * 100)}%`;
const median = (values: number[]) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

function metricViews(rows: AnalyticsApplication[]): Record<string, MetricView> {
  const active = rows.filter((row) => !terminalStages.has(row.stage));
  const withinSla = active.filter((row) => row.stageAgeDays <= row.slaDays);
  const evidenceEligible = rows.filter((row) => row.scorecardsRequired > 0);
  const evidenceComplete = evidenceEligible.filter((row) => row.scorecardsSubmitted === row.scorecardsRequired);
  const scheduleEligible = rows.filter((row) => row.interviewState !== "Not required");
  const scheduleConfirmed = scheduleEligible.filter((row) => ["Confirmed", "Complete"].includes(row.interviewState));
  const respondedOffers = rows.filter((row) => ["Accepted", "Declined"].includes(row.offerState));
  const acceptedOffers = respondedOffers.filter((row) => row.offerState === "Accepted");
  const messageEligible = rows.filter((row) => row.messageState !== "Suppressed");
  const deliveredMessages = messageEligible.filter((row) => row.messageState === "Delivered");
  const automationEligible = rows.filter((row) => ["Succeeded", "Failed"].includes(row.automationState));
  const automationSucceeded = automationEligible.filter((row) => row.automationState === "Succeeded");
  const privacyActive = rows.filter((row) => row.privacyState !== "None");
  const privacyOnTime = privacyActive.filter((row) => row.privacyState !== "Overdue");
  const handoffAttempted = rows.filter((row) => ["Reconciled", "Failed"].includes(row.handoffState));
  const handoffReconciled = handoffAttempted.filter((row) => row.handoffState === "Reconciled");
  const hires = rows.filter((row) => row.stage === "Hired" && row.handoffState === "Reconciled");
  const averageExperience = rows.length ? rows.reduce((sum, row) => sum + row.experienceRating, 0) / rows.length : 0;
  const allObjects = objectCatalogSummary.families;
  const qualityCovered = objectCatalog.filter((item) => item.dataQuality.length > 0 && item.relationships.length > 0).length;
  return {
    application_volume: { key: "application_volume", label: "Applications", display: String(rows.length), detail: "Filtered synthetic attempts", tone: "info" },
    active_applications: { key: "active_applications", label: "Active applications", display: String(active.length), detail: `${rows.length - active.length} terminal in view`, tone: "neutral" },
    stage_sla_rate: { key: "stage_sla_rate", label: "Within stage SLA", display: percent(ratio(withinSla.length, active.length)), detail: `${withinSla.length} of ${active.length || 0} active`, tone: ratio(withinSla.length, active.length) >= .8 ? "success" : "warning" },
    median_stage_age: { key: "median_stage_age", label: "Median stage age", display: `${median(active.map((row) => row.stageAgeDays)).toFixed(1)}d`, detail: "Active applications", tone: "neutral" },
    evidence_readiness: { key: "evidence_readiness", label: "Evidence complete", display: percent(ratio(evidenceComplete.length, evidenceEligible.length)), detail: `${evidenceComplete.length} of ${evidenceEligible.length || 0} interview contexts`, tone: ratio(evidenceComplete.length, evidenceEligible.length) >= .75 ? "success" : "warning" },
    schedule_confirmation: { key: "schedule_confirmation", label: "Sessions confirmed", display: percent(ratio(scheduleConfirmed.length, scheduleEligible.length)), detail: `${scheduleConfirmed.length} of ${scheduleEligible.length || 0} interview contexts`, tone: ratio(scheduleConfirmed.length, scheduleEligible.length) >= .8 ? "success" : "warning" },
    offer_acceptance: { key: "offer_acceptance", label: "Offer acceptance", display: percent(ratio(acceptedOffers.length, respondedOffers.length)), detail: `${acceptedOffers.length} of ${respondedOffers.length || 0} responses`, tone: "success" },
    hires: { key: "hires", label: "Reconciled hires", display: String(hires.length), detail: "Exact handoff acknowledged", tone: "success" },
    candidate_experience: { key: "candidate_experience", label: "Candidate experience", display: `${averageExperience.toFixed(1)}/5`, detail: `${rows.length} synthetic responses`, tone: averageExperience >= 4 ? "success" : "warning" },
    message_delivery: { key: "message_delivery", label: "Message delivery", display: percent(ratio(deliveredMessages.length, messageEligible.length)), detail: `${deliveredMessages.length} of ${messageEligible.length || 0} eligible`, tone: ratio(deliveredMessages.length, messageEligible.length) >= .9 ? "success" : "warning" },
    automation_success: { key: "automation_success", label: "Automation success", display: percent(ratio(automationSucceeded.length, automationEligible.length)), detail: `${automationSucceeded.length} of ${automationEligible.length || 0} eligible runs`, tone: ratio(automationSucceeded.length, automationEligible.length) >= .95 ? "success" : "warning" },
    privacy_sla: { key: "privacy_sla", label: "Privacy cases on time", display: percent(ratio(privacyOnTime.length, privacyActive.length)), detail: `${privacyActive.length - privacyOnTime.length} overdue fixture`, tone: privacyActive.length === privacyOnTime.length ? "success" : "danger" },
    handoff_reconciliation: { key: "handoff_reconciliation", label: "Handoffs reconciled", display: percent(ratio(handoffReconciled.length, handoffAttempted.length)), detail: `${handoffReconciled.length} of ${handoffAttempted.length || 0} attempted`, tone: handoffAttempted.length === handoffReconciled.length ? "success" : "danger" },
    source_to_hire: { key: "source_to_hire", label: "Source-to-hire", display: percent(ratio(hires.length, rows.length)), detail: `${hires.length} reconciled hires`, tone: "info" },
    object_coverage: { key: "object_coverage", label: "Object lifecycle coverage", display: percent(ratio(objectCatalogSummary.lifecycleClassified, allObjects)), detail: `${objectCatalogSummary.lifecycleClassified} of ${allObjects} families`, tone: "success" },
    data_group_coverage: { key: "data_group_coverage", label: "DAT-group coverage", display: percent(ratio(objectCatalogSummary.logicalDataGroups, 48)), detail: `${objectCatalogSummary.logicalDataGroups} of 48 groups`, tone: "success" },
    data_point_coverage: { key: "data_point_coverage", label: "Minimum data-point coverage", display: percent(ratio(objectCatalog.filter((item) => item.dataPoints.length === 10).length, allObjects)), detail: `${objectCatalogSummary.minimumDataPoints} logical definitions`, tone: "success" },
    quality_coverage: { key: "quality_coverage", label: "Quality-rule coverage", display: percent(ratio(qualityCovered, allObjects)), detail: `${qualityCovered} of ${allObjects} families`, tone: "success" },
  };
}

function breakdownFor(rows: AnalyticsApplication[], field: DashboardDefinition["primaryBreakdown"]) {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const raw = row[field];
    const label = field === "experienceRating" ? `${raw} of 5` : String(raw);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

function trendFor(rows: AnalyticsApplication[], windowDays: number) {
  const width = windowDays <= 7 ? 2 : windowDays <= 30 ? 4 : 6;
  const bucketDays = Math.ceil(windowDays / width);
  return Array.from({ length: width }, (_, index) => {
    const newest = (width - index - 1) * bucketDays;
    const oldest = newest + bucketDays;
    const bucket = rows.filter((row) => row.daysAgo >= newest && row.daysAgo < oldest);
    return { label: newest === 0 ? "Current" : `${newest}–${oldest - 1}d ago`, applications: bucket.length, hires: bucket.filter((row) => row.stage === "Hired").length };
  });
}

function BarBreakdown({ rows, title }: { rows: { label: string; value: number }[]; title: string }) {
  const maximum = Math.max(1, ...rows.map((row) => row.value));
  return <div className="analytics-bars" role="img" aria-label={title}>{rows.length ? rows.map((row) => <div className="analytics-bar-row" key={row.label}><span>{row.label}</span><div><i style={{ width: `${Math.max(3, row.value / maximum * 100)}%` }} /></div><strong>{row.value}</strong></div>) : <div className="analytics-empty">No rows match the current filters.</div>}</div>;
}

function TrendColumns({ rows }: { rows: ReturnType<typeof trendFor> }) {
  const maximum = Math.max(1, ...rows.map((row) => row.applications));
  return <div className="trend-columns" role="img" aria-label="Application and hire movement over the selected period">{rows.map((row) => <div className="trend-column" key={row.label}><div className="trend-marks"><i className="application-mark" style={{ height: `${Math.max(6, row.applications / maximum * 100)}%` }} title={`${row.applications} applications`} /><i className="hire-mark" style={{ height: `${Math.max(3, row.hires / maximum * 100)}%` }} title={`${row.hires} hires`} /></div><strong>{row.applications}</strong><span>{row.label}</span></div>)}</div>;
}

export function AnalyticsDashboard({ role, announce }: { role: string; announce: (message: string) => void }) {
  const permittedDashboards = useMemo(() => role === "Auditor" ? dashboardCatalog : dashboardCatalog.filter((dashboard) => dashboard.roles.includes(role)), [role]);
  const [dashboardId, setDashboardId] = useState(permittedDashboards[0]?.id ?? "talent-overview");
  const [windowDays, setWindowDays] = useState("30");
  const [jobId, setJobId] = useState("all");
  const [source, setSource] = useState("all");
  const [stage, setStage] = useState("all");
  useEffect(() => {
    if (!permittedDashboards.some((dashboard) => dashboard.id === dashboardId)) setDashboardId(permittedDashboards[0]?.id ?? "talent-overview");
  }, [dashboardId, permittedDashboards]);
  const dashboard = permittedDashboards.find((item) => item.id === dashboardId) ?? permittedDashboards[0] ?? dashboardCatalog[0];
  const dayLimit = Number(windowDays);
  const filtered = useMemo(() => analyticsApplications.filter((row) => row.daysAgo < dayLimit && (jobId === "all" || row.jobId === jobId) && (source === "all" || row.source === source) && (stage === "all" || row.stage === stage)), [dayLimit, jobId, source, stage]);
  const metrics = metricViews(filtered);
  const cards = dashboard.metricKeys.map((key) => metrics[key]);
  const breakdown = breakdownFor(filtered, dashboard.primaryBreakdown);
  const trend = trendFor(filtered, dayLimit);
  const resetFilters = () => { setWindowDays("30"); setJobId("all"); setSource("all"); setStage("all"); };

  return <div className="analytics-dashboard">
    <section className="analytics-brief" aria-labelledby="analytics-question"><div><span className="eyebrow">{dashboard.purpose}</span><h2 id="analytics-question">{dashboard.question}</h2><p>Permission-filtered synthetic metrics. No dashboard changes candidate state or creates an employment recommendation.</p></div><div className="snapshot-status"><CheckCircle2 size={18} /><span><strong>Ready fixture</strong>{analyticsSource.freshness}</span></div></section>

    <section className="dashboard-switcher" aria-label="Permitted dashboard portfolio"><label><span>Dashboard</span><select aria-label="Choose analytics dashboard" value={dashboard.id} onChange={(event) => setDashboardId(event.target.value)}>{permittedDashboards.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label><div className="dashboard-pills">{permittedDashboards.map((item) => <button className={item.id === dashboard.id ? "active" : ""} aria-pressed={item.id === dashboard.id} onClick={() => setDashboardId(item.id)} key={item.id}>{item.shortName}</button>)}</div><Pill tone="info">{permittedDashboards.length} permitted views</Pill></section>

    <section className="analytics-filter-bar" aria-label="Global analytics filters"><div className="filter-heading"><Filter size={17} /><strong>Global filters</strong></div><label><span>Window</span><select aria-label="Analytics date window" value={windowDays} onChange={(event) => setWindowDays(event.target.value)}><option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option></select></label><label><span>Job</span><select aria-label="Analytics job filter" value={jobId} onChange={(event) => setJobId(event.target.value)}><option value="all">All jobs</option><option value="JOB-DEMO-001">Senior Product Designer</option><option value="JOB-DEMO-002">Recruiting Operations Partner</option><option value="JOB-DEMO-003">Staff Data Platform Engineer</option></select></label><label><span>Source</span><select aria-label="Analytics source filter" value={source} onChange={(event) => setSource(event.target.value)}><option value="all">All sources</option>{["Careers site", "Referral", "Agency", "Sourced"].map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Stage</span><select aria-label="Analytics stage filter" value={stage} onChange={(event) => setStage(event.target.value)}><option value="all">All stages</option>{["Recruiter review", "Screening", "Scheduling", "Interviews", "Debrief", "Offer", "Hired", "Rejected", "Withdrawn"].map((item) => <option key={item}>{item}</option>)}</select></label><button className="secondary-button" onClick={resetFilters}><RotateCcw size={15} /> Reset</button><span className="analytics-result-count" role="status">{filtered.length} of {analyticsApplications.length} records</span></section>

    <section className="analytics-metric-strip" aria-label={`${dashboard.name} headline metrics`}>{cards.map((metric) => <article className={`analytics-metric metric-${metric.tone}`} key={metric.key}><span>{metric.label}</span><strong>{metric.display}</strong><small>{metric.detail}</small></article>)}</section>

    <div className="analytics-chart-grid"><section className="panel analytics-chart"><div className="panel-heading"><div><BarChart3 size={18} /><h2>{dashboard.name} breakdown</h2><span>Count by {dashboard.primaryBreakdown.replace(/([A-Z])/g, " $1").toLowerCase()}</span></div><Pill tone="info">Filtered</Pill></div><BarBreakdown rows={breakdown} title={`${dashboard.name} breakdown`} /></section><section className="panel analytics-chart"><div className="panel-heading"><div><LineChart size={18} /><h2>Movement over time</h2><span>Applications with reconciled hires overlaid</span></div><div className="chart-legend"><span><i className="legend-applications" />Applications</span><span><i className="legend-hires" />Hires</span></div></div><TrendColumns rows={trend} /></section></div>

    <section className="panel analytics-detail"><div className="panel-heading"><div><Table2 size={18} /><h2>Filtered operational detail</h2><span>Exact synthetic lookup rows; newest first</span></div><Pill>{Math.min(10, filtered.length)} shown</Pill></div><div className="analytics-table" role="table" aria-label="Filtered synthetic analytics detail"><div className="analytics-table-row analytics-table-head" role="row"><span role="columnheader">Application</span><span role="columnheader">Job/source</span><span role="columnheader">Stage</span><span role="columnheader">Owner</span><span role="columnheader">Age/SLA</span><span role="columnheader">Operational state</span></div>{[...filtered].sort((a, b) => a.daysAgo - b.daysAgo).slice(0, 10).map((row) => <div className="analytics-table-row" role="row" key={row.id}><strong role="cell" data-label="Application">{row.id}<small>{row.candidate}</small></strong><span role="cell" data-label="Job/source">{row.job}<small>{row.source}</small></span><span role="cell" data-label="Stage"><Pill tone={terminalStages.has(row.stage) ? "neutral" : row.stageAgeDays > row.slaDays ? "danger" : "info"}>{row.stage}</Pill></span><span role="cell" data-label="Owner">{row.owner}</span><span role="cell" data-label="Age/SLA">{row.stageAgeDays}d / {row.slaDays}d</span><span role="cell" data-label="Operational state">{row.messageState} · {row.automationState}</span></div>)}</div></section>

    <div className="analytics-assurance-grid"><section className="panel metric-dictionary"><div className="panel-heading"><div><Database size={18} /><h2>Metric definitions</h2><span>Formula, population and grain for this view</span></div><Pill tone="success">Reconciled</Pill></div>{dashboard.metricKeys.map((key) => <details key={key}><summary>{metricDefinitions[key].label}<span>{metricDefinitions[key].grain}</span></summary><p>{metricDefinitions[key].definition}</p></details>)}</section><section className="panel source-contract"><div className="panel-heading"><div><ShieldCheck size={18} /><h2>Source and trust contract</h2><span>{analyticsSource.id}</span></div><Pill tone="success">Synthetic source</Pill></div><dl><div><dt>Source path</dt><dd><code>{analyticsSource.path}</code></dd></div><div><dt>Grain</dt><dd>{analyticsSource.grain}</dd></div><div><dt>Freshness</dt><dd>{analyticsSource.freshness}</dd></div><div><dt>Exclusions</dt><dd>{analyticsSource.exclusions}</dd></div><div><dt>Current predicates</dt><dd>{windowDays} days · {jobId} · {source} · {stage}</dd></div></dl><button className="secondary-button full-button" onClick={() => announce(`${dashboard.name} source and metric package prepared in memory; no report or file was exported.`)}>Preview report package</button></section></div>
    <ExplainPanel title="What 100% means here" source="v1.6 logical wireframe contract">Every contracted synthetic dashboard, object family, logical data group and minimum governance data point is represented and testable. Physical Salesforce fields, live data, identity enforcement and pilot evidence remain separate gates.</ExplainPanel>
  </div>;
}
