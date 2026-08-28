import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Download,
  FileBarChart2,
  History,
  LockKeyhole,
  Save,
  Settings2,
  ShieldCheck,
  Table2,
} from "lucide-react";
import { analyticsApplications } from "../data/analytics";
import {
  analyticsRowsForRole,
  roleDataScopes,
  visibleApplicationsForRole,
} from "../data/access";
import {
  reportDeliveries,
  reportRestatements,
  reportSchedules,
  reportTargets,
  savedReportDefinitions,
} from "../data/reporting";
import { usePrototype } from "../prototype/PrototypeContext";
import { ExplainPanel, Pill } from "./Common";

type BuilderDimension = "job" | "source" | "stage" | "owner";
type BuilderMeasure = "Applications" | "Reconciled hires" | "Average stage age";

export function ReportWorkspace() {
  const { persona, announce } = usePrototype();
  const [tab, setTab] = useState("Catalog");
  const [selectedReportId, setSelectedReportId] = useState("RPT-001");
  const [dimension, setDimension] = useState<BuilderDimension>("stage");
  const [measure, setMeasure] = useState<BuilderMeasure>("Applications");
  const [saved, setSaved] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const roleRows = useMemo(
    () => analyticsRowsForRole(persona.role, analyticsApplications),
    [persona.role],
  );
  const permittedReports = savedReportDefinitions.filter(
    (report) =>
      persona.role === "Auditor" || report.roles.includes(persona.role),
  );
  const selectedReport =
    permittedReports.find((report) => report.id === selectedReportId) ??
    permittedReports[0];
  const builderRows = useMemo(() => {
    const groups = new Map<string, typeof roleRows>();
    for (const row of roleRows)
      groups.set(String(row[dimension]), [
        ...(groups.get(String(row[dimension])) ?? []),
        row,
      ]);
    return [...groups.entries()]
      .map(([group, rows]) => ({
        group,
        value:
          measure === "Applications"
            ? rows.length
            : measure === "Reconciled hires"
              ? rows.filter(
                  (row) =>
                    row.stage === "Hired" && row.handoffState === "Reconciled",
                ).length
              : rows.length
                ? Number(
                    (
                      rows.reduce((sum, row) => sum + row.stageAgeDays, 0) /
                      rows.length
                    ).toFixed(1),
                  )
                : 0,
        denominator: rows.length,
      }))
      .sort((a, b) => b.value - a.value);
  }, [dimension, measure, roleRows]);
  const exportScope = roleDataScopes[persona.role]?.export ?? "none";
  const exportCsv = () => {
    if (exportScope === "none") return;
    const lines = [
      "group,value,eligible_population",
      ...builderRows.map((row) =>
        [row.group, row.value, row.denominator]
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(","),
      ),
    ];
    const url = URL.createObjectURL(
      new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `synthetic-${dimension}-${measure.toLowerCase().replace(/\s+/g, "-")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    announce(
      `Controlled ${exportScope} synthetic CSV exported with ${builderRows.length} aggregate rows and no direct contact fields.`,
    );
  };
  const tabs = [
    "Catalog",
    "Builder",
    "Schedules",
    "Delivery audit",
    "Targets & restatements",
  ];

  return (
    <div className="report-workspace">
      <section className="analytics-brief">
        <div>
          <span className="eyebrow">Governed reporting product</span>
          <h2>Build, save, distribute and restate synthetic reports</h2>
          <p>
            Role-scoped source rows, explicit denominators, recipient
            reauthorization and delivery evidence are part of the report
            contract.
          </p>
        </div>
        <div className="snapshot-status">
          <CheckCircle2 size={18} />
          <span>
            <strong>{roleRows.length} role-visible rows</strong>Application
            projection fixture
          </span>
        </div>
      </section>
      <div
        className="governance-tabs"
        role="tablist"
        aria-label="Reporting sections"
      >
        {tabs.map((item) => (
          <button
            role="tab"
            aria-selected={tab === item}
            className={tab === item ? "active" : ""}
            onClick={() => setTab(item)}
            key={item}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "Catalog" && (
        <div className="report-catalog-layout">
          <section className="panel report-list">
            <div className="panel-heading">
              <div>
                <FileBarChart2 size={18} />
                <h2>Saved report catalog</h2>
                <span>
                  {permittedReports.length} reports permitted for {persona.role}
                </span>
              </div>
              <Pill tone="success">Certified sources</Pill>
            </div>
            {permittedReports.map((report) => (
              <button
                key={report.id}
                aria-pressed={selectedReport?.id === report.id}
                className={selectedReport?.id === report.id ? "selected" : ""}
                onClick={() => setSelectedReportId(report.id)}
              >
                <FileBarChart2 size={18} />
                <span>
                  <strong>{report.name}</strong>
                  <small>
                    {report.id} · {report.owner}
                  </small>
                </span>
                <Pill
                  tone={report.status === "Certified" ? "success" : "warning"}
                >
                  {report.status}
                </Pill>
              </button>
            ))}
          </section>
          {selectedReport && (
            <section className="panel report-detail">
              <div className="panel-heading">
                <div>
                  <span className="eyebrow">{selectedReport.id}</span>
                  <h2>{selectedReport.name}</h2>
                </div>
                <Pill tone="info">{selectedReport.visibility}</Pill>
              </div>
              <p>{selectedReport.description}</p>
              <dl className="fact-list">
                <div>
                  <dt>Dataset</dt>
                  <dd>{selectedReport.dataset}</dd>
                </div>
                <div>
                  <dt>Dimensions</dt>
                  <dd>{selectedReport.dimensions.join(" · ")}</dd>
                </div>
                <div>
                  <dt>Measures</dt>
                  <dd>{selectedReport.measures.join(" · ")}</dd>
                </div>
                <div>
                  <dt>Freshness</dt>
                  <dd>{selectedReport.freshness}</dd>
                </div>
                <div>
                  <dt>Authorized roles</dt>
                  <dd>{selectedReport.roles.join(" · ")}</dd>
                </div>
              </dl>
              <h3>Authoritative-record drill-through</h3>
              <div className="report-drill-list">
                {visibleApplicationsForRole(persona.role)
                  .slice(0, 4)
                  .map((application) => (
                    <NavLink
                      to={`/hr/applications/${application.id}`}
                      key={application.id}
                    >
                      <span>
                        <strong>{application.id}</strong>
                        <small>
                          {application.job} · {application.stage}
                        </small>
                      </span>
                      <Table2 size={15} />
                    </NavLink>
                  ))}
              </div>
            </section>
          )}
        </div>
      )}

      {tab === "Builder" && (
        <div className="report-builder-grid">
          <section className="panel report-builder-controls">
            <div className="panel-heading">
              <div>
                <Settings2 size={18} />
                <h2>Custom report builder</h2>
                <span>One governed grain and one explicit aggregation</span>
              </div>
              <Pill tone="info">Preview</Pill>
            </div>
            <div className="builder-controls">
              <label>
                <span>Dataset</span>
                <select disabled>
                  <option>Application current-state projection</option>
                </select>
              </label>
              <label>
                <span>Group by</span>
                <select
                  value={dimension}
                  onChange={(event) =>
                    setDimension(event.target.value as BuilderDimension)
                  }
                >
                  <option value="stage">Stage</option>
                  <option value="job">Job</option>
                  <option value="source">Source</option>
                  <option value="owner">Owner</option>
                </select>
              </label>
              <label>
                <span>Measure</span>
                <select
                  value={measure}
                  onChange={(event) =>
                    setMeasure(event.target.value as BuilderMeasure)
                  }
                >
                  <option>Applications</option>
                  <option>Reconciled hires</option>
                  <option>Average stage age</option>
                </select>
              </label>
              <label>
                <span>Population</span>
                <input
                  value={roleDataScopes[persona.role]?.population ?? "No rows"}
                  readOnly
                />
              </label>
            </div>
            <button
              className="primary-button full-button"
              onClick={() => {
                setSaved(true);
                announce(
                  "Custom report definition saved in memory with its role scope and source contract.",
                );
              }}
            >
              <Save size={16} />{" "}
              {saved ? "Saved in memory" : "Save report definition"}
            </button>
          </section>
          <section className="panel report-preview">
            <div className="panel-heading">
              <div>
                <BarChart3 size={18} />
                <h2>
                  {measure} by {dimension}
                </h2>
                <span>
                  {roleRows.length} eligible role-visible application rows
                </span>
              </div>
              <Pill tone={builderRows.length ? "success" : "neutral"}>
                {builderRows.length ? `${builderRows.length} groups` : "N/A"}
              </Pill>
            </div>
            {builderRows.length ? (
              <div
                className="report-preview-table"
                role="table"
                aria-label={`${measure} by ${dimension} preview`}
              >
                <div role="row">
                  <span role="columnheader">{dimension}</span>
                  <span role="columnheader">{measure}</span>
                  <span role="columnheader">Eligible population</span>
                </div>
                {builderRows.map((row) => (
                  <div role="row" key={row.group}>
                    <strong role="cell">{row.group}</strong>
                    <span role="cell">{row.value}</span>
                    <span role="cell">{row.denominator}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="analytics-empty">
                No eligible rows. The report returns N/A rather than zero.
              </div>
            )}
            <div className="report-export-actions">
              <button
                className="secondary-button"
                disabled={exportScope === "none"}
                onClick={exportCsv}
              >
                <Download size={16} />{" "}
                {exportScope === "none"
                  ? "Export not permitted"
                  : `Export ${exportScope}`}
              </button>
              <button
                className="secondary-button"
                onClick={() => setScheduled(true)}
              >
                <CalendarClock size={16} />{" "}
                {scheduled ? "Schedule saved in memory" : "Preview schedule"}
              </button>
            </div>
          </section>
        </div>
      )}

      {tab === "Schedules" && (
        <section className="panel">
          <div className="panel-heading">
            <div>
              <CalendarClock size={18} />
              <h2>Schedules and subscriptions</h2>
              <span>Recipients are reauthorized at every delivery</span>
            </div>
            <Pill tone="warning">1 approval required</Pill>
          </div>
          <div className="schedule-list">
            {reportSchedules.map((schedule) => (
              <article key={schedule.id}>
                <CalendarClock size={18} />
                <div>
                  <strong>
                    {schedule.id} · {schedule.reportId}
                  </strong>
                  <span>
                    {schedule.cadence} · {schedule.audience}
                  </span>
                  <small>
                    {schedule.format} · next: {schedule.nextRun}
                  </small>
                </div>
                <Pill
                  tone={schedule.state === "Active" ? "success" : "warning"}
                >
                  {schedule.state}
                </Pill>
                <button
                  className="secondary-button"
                  onClick={() =>
                    announce(
                      `${schedule.id} schedule preview opened; no external subscription changed.`,
                    )
                  }
                >
                  Inspect
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === "Delivery audit" && (
        <section className="panel">
          <div className="panel-heading">
            <div>
              <ShieldCheck size={18} />
              <h2>Delivery, revocation and recipient audit</h2>
              <span>
                Every distribution attempt preserves a minimized outcome
              </span>
            </div>
            <Pill tone="info">{reportDeliveries.length} attempts</Pill>
          </div>
          <div
            className="delivery-table"
            role="table"
            aria-label="Synthetic report delivery audit"
          >
            <div role="row">
              <span role="columnheader">Delivery</span>
              <span role="columnheader">Report</span>
              <span role="columnheader">Recipient/channel</span>
              <span role="columnheader">Control</span>
              <span role="columnheader">Outcome</span>
            </div>
            {reportDeliveries.map((delivery) => (
              <div role="row" key={delivery.id}>
                <strong role="cell">
                  {delivery.id}
                  <small>{delivery.at}</small>
                </strong>
                <span role="cell">{delivery.reportId}</span>
                <span role="cell">
                  {delivery.recipient}
                  <small>{delivery.channel}</small>
                </span>
                <span role="cell">{delivery.watermark}</span>
                <span role="cell">
                  <Pill
                    tone={
                      delivery.state === "Delivered"
                        ? "success"
                        : delivery.state === "Revoked"
                          ? "warning"
                          : "neutral"
                    }
                  >
                    {delivery.state}
                  </Pill>
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "Targets & restatements" && (
        <div className="report-assurance-grid">
          <section className="panel">
            <div className="panel-heading">
              <div>
                <CheckCircle2 size={18} />
                <h2>Targets and guardrails</h2>
                <span>Targets remain provisional unless a baseline exists</span>
              </div>
            </div>
            <div className="target-list">
              {reportTargets.map((target) => (
                <article key={target.metric}>
                  <span>
                    <strong>{target.metric}</strong>
                    <small>
                      {target.type} · {target.owner}
                    </small>
                  </span>
                  <b>{target.target}</b>
                  <Pill
                    tone={target.status === "Normative" ? "success" : "warning"}
                  >
                    {target.status}
                  </Pill>
                </article>
              ))}
            </div>
          </section>
          <section className="panel">
            <div className="panel-heading">
              <div>
                <History size={18} />
                <h2>Restatement ledger</h2>
                <span>
                  Historical changes never silently overwrite published meaning
                </span>
              </div>
            </div>
            <div className="restatement-list">
              {reportRestatements.map((item) => (
                <article key={item.id}>
                  <History size={17} />
                  <div>
                    <strong>
                      {item.id} · {item.reportId} · {item.period}
                    </strong>
                    <span>{item.reason}</span>
                    <small>{item.effect}</small>
                  </div>
                  <Pill tone="info">{item.state}</Pill>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}

      {exportScope === "none" && (
        <ExplainPanel
          title="Export denied by role contract"
          source={`${persona.role} · field and distribution policy`}
        >
          This persona may use the reporting surface for its permitted work but
          cannot create a file. The denial happens before data packaging and is
          recorded as a safe control outcome.
        </ExplainPanel>
      )}
      <ExplainPanel
        title="Wireframe reporting boundary"
        source="RPT/SCH/DLV/RST v1.7 synthetic registries"
      >
        The catalog, builder, drill-through, schedule, subscription, controlled
        CSV, recipient reauthorization, delivery audit, target and restatement
        journeys are dynamic synthetic contracts. A live warehouse, delivery
        provider and production authorization service remain external
        implementation gates.
      </ExplainPanel>
    </div>
  );
}
