import { useMemo, useState } from "react";
import {
  Accessibility,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bookmark,
  BookmarkCheck,
  Boxes,
  CheckCircle2,
  ClipboardCheck,
  Database,
  FileDown,
  GitBranch,
  History,
  Inbox,
  LockKeyhole,
  Mail,
  Map,
  MessageSquareText,
  Play,
  Printer,
  RefreshCcw,
  RotateCcw,
  Save,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  UserRoundCog,
  UsersRound,
  XCircle,
} from "lucide-react";
import { NavLink, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  completeV32Backlog,
  countryVariants,
  errorScenarios,
  getP0Feature,
  getWireframeUseCase,
  globalP0Features,
  p0Features,
  p1Features,
  p2Features,
  runbooks,
  wireframeUseCases,
  type DataField,
  type P0Feature,
  type WireframeUseCase,
} from "../data/useCaseWorkbench";
import { useWireframe, type FeatureAction, type FeatureStatus } from "../prototype/WireframeContext";
import { Pill } from "./Common";
import { DemoShell } from "./DemoWorkspace";

const v32Tabs = [
  ["/demo/workbench", "Use cases", GitBranch],
  ["/demo/control-center", "Control center", BarChart3],
  ["/demo/handoffs", "Handoffs", Inbox],
  ["/demo/reports", "Reports", FileDown],
  ["/demo/scenarios", "Scenarios", SlidersHorizontal],
] as const;

const personas = [
  "Recruiter",
  "Hiring Manager",
  "Finance Approver",
  "Compensation Approver",
  "People Operations",
  "Screening Reviewer",
  "Interviewer",
  "Agency Partner",
  "IT Fulfilment",
  "New Hire",
];

function statusTone(status: FeatureStatus) {
  if (status === "complete" || status === "recovered") return "success" as const;
  if (status === "blocked") return "danger" as const;
  if (status === "cancelled") return "warning" as const;
  return "neutral" as const;
}

function V32Header() {
  const { events, handoffs, resetWireframe } = useWireframe();
  return (
    <section className="v32-topbar" aria-label="v3.2 wireframe navigation">
      <div>
        <span className="eyebrow">v3.2 connected-use-case release</span>
        <strong>Use Case–Screen–Action–DFD–Feature Workbench</strong>
      </div>
      <nav>
        {v32Tabs.map(([to, label, Icon]) => (
          <NavLink end={to === "/demo/workbench"} key={to} to={to}>
            <Icon size={14} /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="v32-session-summary">
        <span>{events.length} events</span>
        <span>{handoffs.filter((item) => item.status === "Open").length} open handoffs</span>
        <button onClick={resetWireframe}><RefreshCcw size={14} /> Reset v3.2</button>
      </div>
    </section>
  );
}

function CoverageStrip() {
  const { featureStates } = useWireframe();
  const completed = Object.values(featureStates).filter((item) => item.status === "complete" || item.status === "recovered").length;
  const blocked = Object.values(featureStates).filter((item) => item.status === "blocked").length;
  return (
    <section className="v32-coverage-strip" aria-label="v3.2 coverage">
      <article><strong>35</strong><span>Implemented backlog contracts</span></article>
      <article><strong>15</strong><span>P0 connected requirements</span></article>
      <article><strong>12</strong><span>P1 trust controls</span></article>
      <article><strong>8</strong><span>P2 demo tools</span></article>
      <article><strong>{completed}/13</strong><span>Use-case workbenches completed</span></article>
      <article><strong>{blocked}</strong><span>Active synthetic exceptions</span></article>
    </section>
  );
}

function WorkbenchOverview() {
  const { featureStates, bookmarks, toggleBookmark } = useWireframe();
  return (
    <>
      <section className="v32-hero">
        <div>
          <span className="eyebrow">From screen tour to connected operating story</span>
          <h1>Run all 12 recruitment and onboarding use cases as stateful demonstrations.</h1>
          <p>
            Actions now produce a versioned state diff, domain event, downstream
            handoff, audit receipt and metric consequence that remains visible
            across routes until deterministic reset.
          </p>
          <div>
            <NavLink className="demo-primary" to="/demo/workbench/uc-01"><Play size={16} /> Start full journey</NavLink>
            <NavLink className="demo-secondary" to="/demo/control-center">Open causal dashboard</NavLink>
          </div>
        </div>
        <aside>
          <span className="eyebrow">Foundation complete</span>
          {globalP0Features.map((feature) => (
            <div key={feature.id}><CheckCircle2 size={17} /><span><strong>{feature.id}</strong>{feature.title}</span></div>
          ))}
          <small>All state is synthetic and browser-memory-only.</small>
        </aside>
      </section>
      <CoverageStrip />

      <section className="demo-section">
        <div className="demo-section-heading">
          <div><span className="eyebrow">Outcome-driven portfolio</span><h2>12 connected use cases</h2><p>Open a use case to inspect its live workbench, level-two DFD, lineage, controls, comparison and evidence.</p></div>
          <Pill tone="success">48 action-level DFD processes</Pill>
        </div>
        <div className="v32-usecase-grid">
          {wireframeUseCases.map((useCase) => {
            const features = p0Features.filter((feature) => feature.useCaseIds.includes(useCase.id));
            const states = features.map((feature) => featureStates[feature.id]);
            const ready = states.filter((state) => state.status === "complete" || state.status === "recovered").length;
            const bookmarked = bookmarks.includes(useCase.id);
            return (
              <article key={useCase.id}>
                <header>
                  <span>{useCase.code}</span>
                  <button aria-label={`${bookmarked ? "Remove" : "Add"} ${useCase.code} bookmark`} onClick={() => toggleBookmark(useCase.id)}>
                    {bookmarked ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
                  </button>
                </header>
                <h3>{useCase.title}</h3>
                <p>{useCase.outcome}</p>
                <dl>
                  <div><dt>Record</dt><dd>{useCase.recordId}</dd></div>
                  <div><dt>DFD processes</dt><dd>{useCase.processes.length}</dd></div>
                  <div><dt>P0 workbenches</dt><dd>{ready}/{features.length}</dd></div>
                </dl>
                <div className="v32-card-progress"><span style={{ width: `${features.length ? (ready / features.length) * 100 : 0}%` }} /></div>
                <NavLink to={`/demo/workbench/${useCase.id}`}>Open connected workbench <ArrowRight size={14} /></NavLink>
              </article>
            );
          })}
        </div>
      </section>

      <section className="v32-backlog-coverage">
        <div className="demo-section">
          <span className="eyebrow">Operational depth and trust</span>
          <h2>12 P1 controls are live across every use case</h2>
          <ul>{p1Features.map((feature) => <li key={feature.id}><CheckCircle2 size={15} /><span><strong>{feature.id}</strong>{feature.title}<small>{feature.surface}</small></span></li>)}</ul>
        </div>
        <div className="demo-section">
          <span className="eyebrow">Demo facilitation</span>
          <h2>Eight P2 capabilities are ready</h2>
          <ul>{p2Features.map((feature) => <li key={feature.id}><CheckCircle2 size={15} /><span><strong>{feature.id}</strong>{feature.title}<small>{feature.surface}</small></span></li>)}</ul>
        </div>
      </section>
    </>
  );
}

function accessFor(field: DataField, persona: string) {
  if (field.classification === "Public") return { state: "Allowed", value: field.value };
  if (field.classification === "Internal" && !["Agency Partner", "New Hire"].includes(persona)) return { state: "Allowed", value: field.value };
  if (field.classification === "Confidential" && ["Recruiter", "Hiring Manager", "Finance Approver", "Compensation Approver", "People Operations", "Screening Reviewer"].includes(persona)) return { state: "Allowed", value: field.value };
  if (field.classification === "Restricted" && ["People Operations", "Screening Reviewer"].includes(persona)) return { state: "Purpose-bound", value: field.value };
  if (field.classification === "Internal") return { state: "Masked", value: "•••• restricted projection" };
  return { state: "Denied", value: "Not available for this persona and purpose" };
}

function FeatureWorkbench({ feature }: { feature: P0Feature }) {
  const { featureStates, executeFeature, events, selectedPersona } = useWireframe();
  const state = featureStates[feature.id];
  const latest = [...events].reverse().find((event) => event.featureId === feature.id);
  const run = (action: FeatureAction) => executeFeature(feature.id, action, `v3.2 ${action} action from ${feature.route}`);
  const requisitionPrimary = feature.id === "WF-P0-03"
    ? state.stateLabel === "Draft v3"
      ? { label: "Submit exact requisition version", persona: "Hiring Manager" }
      : state.stateLabel === "Submitted v3 · Finance review"
        ? { label: "Record Finance approval", persona: "Finance Approver" }
        : state.stateLabel === "Finance approved v3 · Compensation review"
          ? { label: "Record Compensation approval", persona: "Compensation Approver" }
          : { label: "Approved v4 recorded", persona: "" }
    : null;
  const primaryLabel = requisitionPrimary?.label ?? feature.primaryAction;
  const primaryDisabled = requisitionPrimary
    ? !requisitionPrimary.persona || selectedPersona !== requisitionPrimary.persona
    : false;
  const channelStatus = (channel: string) => {
    if (state.status === "ready") return "Prepared v7";
    if (state.status === "blocked" && channel === "LinkedIn") return "Stale v6 · retry owned";
    if (state.status === "blocked") return "Delivered v7 · retained";
    if (state.status === "recovered" && channel === "LinkedIn") return "Reconciled v7";
    return "Delivered v7";
  };
  return (
    <section className="v32-feature-workbench" aria-label={`${feature.id} ${feature.title}`}>
      <header>
        <div><span className="eyebrow">{feature.id} · {feature.recordId}</span><h2>{feature.title}</h2><p>{feature.talkTrack}</p></div>
        <div className="v32-current-state"><span>Current state · v{state.version}</span><Pill tone={statusTone(state.status)}>{state.status}</Pill><strong>{state.stateLabel}</strong><small>{state.updatedAt}</small></div>
      </header>
      <div className="v32-workbench-grid">
        <div className="v32-form-card">
          <div className="v32-panel-title"><ClipboardCheck size={17} /><span><strong>Seeded screen data</strong><small>{feature.route}</small></span><NavLink to={feature.route}>Open product route</NavLink></div>
          <div className="v32-field-grid">
            {feature.fields.map((field) => {
              const access = accessFor(field, selectedPersona);
              return (
                <label key={field.label}>
                  <span>{field.label}<small>{field.classification} · {access.state}</small></span>
                  <input readOnly value={access.value} aria-label={`${field.label} ${access.state}`} />
                </label>
              );
            })}
          </div>
          <label className="v32-reason"><span>Action reason</span><input defaultValue="Validated during deterministic product demonstration" /></label>
          <div className="v32-action-row">
            <button className="demo-primary" disabled={primaryDisabled} onClick={() => run("primary")}><CheckCircle2 size={15} /> {primaryLabel}</button>
            <button onClick={() => run("exception")}><AlertTriangle size={15} /> {feature.exceptionAction}</button>
            <button onClick={() => run("recover")}><RotateCcw size={15} /> {feature.recoveryAction}</button>
            <button onClick={() => run("cancel")}><XCircle size={15} /> {feature.cancelAction}</button>
          </div>
          {feature.id === "WF-P0-04" && <div className="v32-channel-ledger" role="table" aria-label="Publication channel delivery receipts"><div role="row"><span role="columnheader">Channel</span><span role="columnheader">Posting version</span><span role="columnheader">Delivery state</span><span role="columnheader">Receipt</span></div>{["Careers", "LinkedIn", "Indeed", "Agency"].map((channel, index) => <div role="row" key={channel}><span role="cell"><strong>{channel}</strong></span><span role="cell">{state.status === "blocked" && channel === "LinkedIn" ? "v6 → v7" : "v7"}</span><span role="cell"><Pill tone={channelStatus(channel).includes("Stale") ? "warning" : state.status === "ready" ? "info" : "success"}>{channelStatus(channel)}</Pill></span><span role="cell">{state.status === "ready" ? "Pending" : `DLV-00${index + 1}`}</span></div>)}</div>}
        </div>
        <aside className="v32-receipt-card">
          <div className="v32-panel-title"><History size={17} /><span><strong>State-change receipt</strong><small>WF-P1-02 · correlated and versioned</small></span></div>
          {latest ? (
            <>
              <strong>{latest.receiptId}</strong>
              <dl>
                <div><dt>Previous</dt><dd>{latest.previousState}</dd></div>
                <div><dt>Current</dt><dd>{latest.currentState}</dd></div>
                <div><dt>Event</dt><dd>{latest.eventName}</dd></div>
                <div><dt>Actor</dt><dd>{latest.actor}</dd></div>
                <div><dt>Correlation</dt><dd>{latest.correlationKey}</dd></div>
                <div><dt>Effect</dt><dd>{latest.downstreamEffect}</dd></div>
              </dl>
            </>
          ) : (
            <div className="v32-empty"><History size={24} /><strong>No action receipt yet</strong><span>Choose an action to create a shared version, event, handoff and KPI consequence.</span></div>
          )}
        </aside>
      </div>
      <div className="v32-feature-contracts">
        <article><ShieldCheck size={17} /><span><strong>Rule explanation</strong>{feature.guard}<small>Failure: {feature.exception}</small></span></article>
        <article><Database size={17} /><span><strong>Objects and store</strong>{feature.object}<small>{feature.store} · event {feature.event}</small></span></article>
        <article><Mail size={17} /><span><strong>Communication preview</strong>{feature.communication}<small>Suppression evaluated · preview only · never sent</small></span></article>
        <article><BarChart3 size={17} /><span><strong>Metric consequence</strong>{feature.metric}<small>MET-V32-01 · drill-through retains role scope</small></span></article>
      </div>
    </section>
  );
}

function LevelTwoDFD({ useCase }: { useCase: WireframeUseCase }) {
  const [expanded, setExpanded] = useState(useCase.processes[0]?.id);
  return (
    <section className="demo-section v32-dfd">
      <div className="demo-section-heading"><div><span className="eyebrow">WF-P0-02 · executable level-two DFD</span><h2>Actor → screen/action → object/event/store → downstream state</h2><p>Every process exposes its exact route, inputs, outputs, guard, denial and recovery.</p></div><Pill tone="info">{useCase.processes.length} processes</Pill></div>
      <div className="v32-dfd-canvas">
        {useCase.processes.map((process) => (
          <article className={expanded === process.id ? "expanded" : ""} key={process.id}>
            <button onClick={() => setExpanded(expanded === process.id ? "" : process.id)}>
              <span className="v32-process-id">{process.sequence}.0</span>
              <span><small>{process.actor}</small><strong>{process.title}</strong></span>
              <ArrowRight size={16} />
              <span><small>Output</small><strong>{process.output}</strong></span>
              <Database size={16} />
              <span><small>Store</small><strong>{process.store}</strong></span>
            </button>
            {expanded === process.id && (
              <div className="v32-process-detail">
                <dl>
                  <div><dt>Screen</dt><dd><NavLink to={process.route}>{process.route}</NavLink></dd></div>
                  <div><dt>Action</dt><dd>{process.action}</dd></div>
                  <div><dt>Input</dt><dd>{process.input}</dd></div>
                  <div><dt>Object</dt><dd>{process.object}</dd></div>
                  <div><dt>Event</dt><dd>{process.event}</dd></div>
                  <div><dt>Guard</dt><dd>{process.guard}</dd></div>
                  <div><dt>Denial</dt><dd>{process.denial}</dd></div>
                  <div><dt>Recovery</dt><dd>{process.recovery}</dd></div>
                </dl>
                {process.featureId && <NavLink className="demo-primary" to={`/demo/workbench/${useCase.id}?feature=${process.featureId}`}>Open {process.featureId} workbench</NavLink>}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function LineagePanel({ useCase }: { useCase: WireframeUseCase }) {
  const objects = [...new Set(useCase.processes.flatMap((process) => process.object.split(" + ")))].slice(0, 8);
  return (
    <section className="demo-section v32-lineage">
      <div className="demo-section-heading"><div><span className="eyebrow">WF-P1-01 · universal lineage</span><h2>Related business grains remain distinct</h2><p>The journey follows one business context without collapsing its objects or versions.</p></div></div>
      <div className="v32-lineage-track">
        {objects.map((object, index) => (
          <article key={object}><span>{String(index + 1).padStart(2, "0")}</span><Boxes size={19} /><strong>{object}</strong><small>{useCase.recordId}-{String(index + 1).padStart(2, "0")} · v{index + 1}</small>{index < objects.length - 1 && <ArrowRight size={17} />}</article>
        ))}
      </div>
    </section>
  );
}

function ControlPanel({ useCase, feature }: { useCase: WireframeUseCase; feature: P0Feature }) {
  const { selectedCountryId, setSelectedCountryId, selectedErrorId, setSelectedErrorId, selectedPersona, setSelectedPersona } = useWireframe();
  const country = countryVariants.find((item) => item.id === selectedCountryId) ?? countryVariants[0];
  const error = errorScenarios.find((item) => item.id === selectedErrorId) ?? errorScenarios[0];
  return (
    <section className="v32-control-grid">
      <article className="demo-section">
        <div className="v32-panel-title"><UserRoundCog size={17} /><span><strong>Persona data-scope inspector</strong><small>WF-P1-08 · row, field, purpose and action</small></span></div>
        <label><span>Inspect as persona</span><select value={selectedPersona} onChange={(event) => setSelectedPersona(event.target.value)}>{personas.map((persona) => <option key={persona}>{persona}</option>)}</select></label>
        <div className="v32-access-list">{feature.fields.map((field) => { const access = accessFor(field, selectedPersona); return <div key={field.label}><span><strong>{field.label}</strong><small>{field.classification}</small></span><Pill tone={access.state === "Allowed" || access.state === "Purpose-bound" ? "success" : access.state === "Masked" ? "warning" : "danger"}>{access.state}</Pill></div>; })}</div>
        <small>Purpose: demonstrate {useCase.code}. Effective window: current synthetic session.</small>
      </article>
      <article className="demo-section">
        <div className="v32-panel-title"><Map size={17} /><span><strong>Country and worker-type variant</strong><small>WF-P1-09 · effective policy comparison</small></span></div>
        <label><span>Jurisdiction pack</span><select value={selectedCountryId} onChange={(event) => setSelectedCountryId(event.target.value)}>{countryVariants.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
        <dl><div><dt>Notice and rules</dt><dd>{country.notice}</dd></div><div><dt>Worker types</dt><dd>{country.workerTypes}</dd></div><div><dt>Approval</dt><dd>{country.approval}</dd></div></dl>
      </article>
      <article className="demo-section">
        <div className="v32-panel-title"><AlertTriangle size={17} /><span><strong>Error and recovery laboratory</strong><small>WF-P1-10 · complete state family</small></span></div>
        <label><span>Prepared state</span><select value={selectedErrorId} onChange={(event) => setSelectedErrorId(event.target.value)}>{errorScenarios.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
        <div className="v32-error-preview"><Pill tone={selectedErrorId === "happy" ? "success" : "warning"}>{error.label}</Pill><p>{error.effect}</p><strong>Recovery action</strong><span>{feature.recoveryAction}</span></div>
      </article>
    </section>
  );
}

function ComparisonPanel({ feature }: { feature: P0Feature }) {
  return (
    <section className="demo-section">
      <div className="demo-section-heading"><div><span className="eyebrow">WF-P2-04 · side-by-side scenario comparison</span><h2>Happy path versus exception and recovery</h2></div></div>
      <div className="v32-comparison">
        <article><Pill tone="success">Happy path</Pill><h3>{feature.primaryAction}</h3><dl><div><dt>From</dt><dd>{feature.fromState}</dd></div><div><dt>To</dt><dd>{feature.toState}</dd></div><div><dt>Event</dt><dd>{feature.event}</dd></div><div><dt>Handoff</dt><dd>{feature.handoff}</dd></div></dl></article>
        <article><Pill tone="warning">Exception and recovery</Pill><h3>{feature.exceptionAction}</h3><dl><div><dt>Exception</dt><dd>{feature.exception}</dd></div><div><dt>Protected state</dt><dd>No unsupported downstream action</dd></div><div><dt>Recovery</dt><dd>{feature.recoveryAction}</dd></div><div><dt>Audit</dt><dd>Failure and recovery retain the same correlation key</dd></div></dl></article>
      </div>
    </section>
  );
}

function FeedbackPanel({ useCase }: { useCase: WireframeUseCase }) {
  const { addFeedback, feedback, rehearsal, updateRehearsal, selectedPersona } = useWireframe();
  const [category, setCategory] = useState("Product clarity");
  const [observation, setObservation] = useState("");
  const current = rehearsal[useCase.id];
  const submit = () => {
    if (!observation.trim()) return;
    addFeedback({ useCaseId: useCase.id, category, observation, persona: selectedPersona, screen: `/demo/workbench/${useCase.id}` });
    setObservation("");
  };
  return (
    <section className="v32-feedback-grid">
      <article className="demo-section">
        <div className="v32-panel-title"><Accessibility size={18} /><span><strong>Rehearsal and accessibility evidence</strong><small>WF-P1-12 · WF-P2-07</small></span></div>
        <div className="v32-checks">
          {(["keyboard", "screenReader", "mobile", "readability"] as const).map((key) => <label key={key}><input type="checkbox" checked={current[key]} onChange={(event) => updateRehearsal(useCase.id, { [key]: event.target.checked })} /> {key === "screenReader" ? "Screen reader" : `${key[0].toUpperCase()}${key.slice(1)}`}</label>)}
        </div>
        <label><span>Rehearsal result</span><select value={current.status} onChange={(event) => updateRehearsal(useCase.id, { status: event.target.value as typeof current.status })}><option>Not run</option><option>Pass</option><option>Fail</option></select></label>
        <label><span>Issue classification</span><select value={current.issueClass} onChange={(event) => updateRehearsal(useCase.id, { issueClass: event.target.value as typeof current.issueClass })}><option>None</option><option>Polish</option><option>Stitching</option><option>Wireframe gap</option><option>Production only</option></select></label>
      </article>
      <article className="demo-section">
        <div className="v32-panel-title"><MessageSquareText size={18} /><span><strong>Demo feedback capture</strong><small>WF-P2-08 · synthetic notes only</small></span></div>
        <label><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option>Product clarity</option><option>Journey depth</option><option>Data model</option><option>Accessibility</option><option>Demo pacing</option></select></label>
        <label><span>Observation</span><textarea value={observation} onChange={(event) => setObservation(event.target.value)} placeholder="Record a product observation without personal data" /></label>
        <button className="demo-primary" disabled={!observation.trim()} onClick={submit}><Send size={15} /> Record feedback</button>
        <small>{feedback.filter((item) => item.useCaseId === useCase.id).length} observations recorded for {useCase.code}</small>
      </article>
    </section>
  );
}

function UseCaseDetail({ useCase }: { useCase: WireframeUseCase }) {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { featureStates, bookmarks, toggleBookmark, checkpoints, saveCheckpoint, restoreCheckpoint, selectedPersona, setSelectedPersona } = useWireframe();
  const features = p0Features.filter((feature) => feature.useCaseIds.includes(useCase.id));
  const requested = getP0Feature(params.get("feature") ?? undefined);
  const feature = requested && requested.useCaseIds.includes(useCase.id) ? requested : features[0];
  const tab = params.get("tab") ?? "workbench";
  const setTab = (next: string) => { const updated = new URLSearchParams(params); updated.set("tab", next); setParams(updated); };
  const setFeature = (id: string) => { const updated = new URLSearchParams(params); updated.set("feature", id); updated.set("tab", "workbench"); setParams(updated); };
  const useCaseCheckpoints = checkpoints.filter((item) => item.useCaseId === useCase.id);
  const bookmarked = bookmarks.includes(useCase.id);
  if (!feature) return null;
  return (
    <>
      <section className="v32-usecase-hero">
        <NavLink to="/demo/workbench">← All use cases</NavLink>
        <div>
          <span className="eyebrow">{useCase.code} · {useCase.recordId}</span>
          <h1>{useCase.title}</h1>
          <p>{useCase.trigger} <strong>{useCase.outcome}</strong></p>
          <div className="flow-actor-list">{useCase.actors.map((actor) => <span key={actor}>{actor}</span>)}</div>
        </div>
        <aside>
          <button onClick={() => toggleBookmark(useCase.id)}>{bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />} {bookmarked ? "Bookmarked" : "Bookmark"}</button>
          <button onClick={() => saveCheckpoint(useCase.id, `${useCase.code} · ${feature.id}`)}><Save size={16} /> Save checkpoint</button>
          <button onClick={() => window.print()}><Printer size={16} /> Print DFD brief</button>
          <button onClick={() => navigate(`/demo/workbench/${useCase.id}?tab=dfd`)}><GitBranch size={16} /> Open DFD</button>
        </aside>
      </section>

      <section className="v32-usecase-toolbar">
        <label><span>P0 workbench</span><select value={feature.id} onChange={(event) => setFeature(event.target.value)}>{features.map((item) => <option value={item.id} key={item.id}>{item.id} · {item.title}</option>)}</select></label>
        <label><span>Active persona</span><select aria-label="Active persona" value={selectedPersona} onChange={(event) => setSelectedPersona(event.target.value)}>{personas.map((persona) => <option key={persona}>{persona}</option>)}</select></label>
        <div className="v32-tabs" role="tablist" aria-label="Use case views">
          {["workbench", "dfd", "lineage", "controls", "compare", "feedback"].map((item) => <button role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => setTab(item)} key={item}>{item}</button>)}
        </div>
      </section>

      {tab === "workbench" && <FeatureWorkbench feature={feature} />}
      {tab === "dfd" && <LevelTwoDFD useCase={useCase} />}
      {tab === "lineage" && <LineagePanel useCase={useCase} />}
      {tab === "controls" && <ControlPanel useCase={useCase} feature={feature} />}
      {tab === "compare" && <ComparisonPanel feature={feature} />}
      {tab === "feedback" && <FeedbackPanel useCase={useCase} />}

      <section className="v32-checkpoint-bar">
        <span><Save size={15} /><strong>Checkpoints</strong>{useCaseCheckpoints.length ? `${useCaseCheckpoints.length} saved` : "None saved yet"}</span>
        {useCaseCheckpoints.map((checkpoint) => <button key={checkpoint.id} onClick={() => restoreCheckpoint(checkpoint.id)}>{checkpoint.id} · {checkpoint.label} · {checkpoint.eventCount} events</button>)}
        <span><strong>Current P0 state</strong>{features.map((item) => <Pill key={item.id} tone={statusTone(featureStates[item.id].status)}>{item.id}: {featureStates[item.id].status}</Pill>)}</span>
      </section>
    </>
  );
}

function ControlCenter() {
  const { featureStates, events, handoffs } = useWireframe();
  const states = Object.values(featureStates);
  const complete = states.filter((item) => item.status === "complete" || item.status === "recovered").length;
  const blocked = states.filter((item) => item.status === "blocked").length;
  const denominator = states.length;
  const readiness = denominator ? Math.round((complete / denominator) * 100) : null;
  return (
    <>
      <section className="catalogue-hero"><div><span className="eyebrow">WF-P1-07 · causal analytics</span><h1>Connected state and reconciliation control center</h1><p>Every KPI derives from the same feature ledger and drills into the exact state-change receipt.</p></div><Pill tone="info">MET-V32-01 · current</Pill></section>
      <section className="v32-kpi-grid">
        <article><span>Substantive readiness</span><strong>{readiness === null ? "N/A" : `${readiness}%`}</strong><small>{complete}/{denominator} P0 workbenches complete</small></article>
        <article><span>Blocked workbenches</span><strong>{blocked}</strong><small>{blocked ? "Recovery owner required" : "No active exception"}</small></article>
        <article><span>Domain events</span><strong>{events.length}</strong><small>All events have correlation keys</small></article>
        <article><span>Open handoffs</span><strong>{handoffs.filter((item) => item.status === "Open").length}</strong><small>Across persona queues</small></article>
        <article><span>Restatements</span><strong>{events.filter((item) => item.outcome === "recovered").length}</strong><small>Recovery receipts update original journey</small></article>
      </section>
      <section className="demo-section">
        <div className="demo-section-heading"><div><span className="eyebrow">Drill-through and metric causality</span><h2>Feature state by use case</h2><p>Empty denominators render N/A; blocked and recovered states remain separate.</p></div></div>
        <div className="v32-state-table" role="table" aria-label="Feature readiness drill-through">
          <div role="row"><span role="columnheader">Feature</span><span role="columnheader">Record</span><span role="columnheader">Previous → current</span><span role="columnheader">Status</span><span role="columnheader">Last event</span><span role="columnheader">Drill-through</span></div>
          {p0Features.map((feature) => { const state = featureStates[feature.id]; return <div role="row" key={feature.id}><span role="cell"><strong>{feature.id}</strong><small>{feature.title}</small></span><span role="cell">{feature.recordId}</span><span role="cell">{state.previousStateLabel} → {state.stateLabel}</span><span role="cell"><Pill tone={statusTone(state.status)}>{state.status}</Pill></span><span role="cell">{state.lastEventId ?? "No event"}</span><span role="cell"><NavLink to={`/demo/workbench/${feature.useCaseIds[0]}?feature=${feature.id}`}>Open</NavLink></span></div>; })}
        </div>
      </section>
      <AuditTimeline />
    </>
  );
}

function AuditTimeline() {
  const { events } = useWireframe();
  return (
    <section className="demo-section">
      <div className="demo-section-heading"><div><span className="eyebrow">WF-P1-06 · complete audit timeline</span><h2>Actions, events, effects and restatements</h2></div><Pill tone={events.length ? "success" : "neutral"}>{events.length} events</Pill></div>
      {events.length ? <ol className="v32-audit-timeline">{[...events].reverse().map((event) => <li key={event.id}><span>{event.at}</span><div><strong>{event.eventName}</strong><small>{event.id} · {event.receiptId} · {event.actor}</small><p>{event.previousState} → {event.currentState}</p><em>{event.downstreamEffect}</em></div><NavLink to={`/demo/workbench/${event.useCaseId}?feature=${event.featureId}`}>Inspect</NavLink></li>)}</ol> : <div className="demo-empty-state"><History size={28} /><h2>No cross-route actions yet</h2><p>Execute any P0 workbench action to create a versioned audit event and causal metric update.</p><NavLink className="demo-primary" to="/demo/workbench/uc-01">Start UC-01</NavLink></div>}
    </section>
  );
}

function HandoffCenter() {
  const { handoffs, acknowledgeHandoff } = useWireframe();
  return (
    <>
      <section className="catalogue-hero"><div><span className="eyebrow">WF-P1-03 · cross-persona handoff inbox</span><h1>Exact work and minimum context for the next actor</h1><p>Each action creates a correlated handoff without exposing unrelated fields.</p></div><Pill tone={handoffs.some((item) => item.status === "Open") ? "warning" : "success"}>{handoffs.filter((item) => item.status === "Open").length} open</Pill></section>
      <section className="demo-section">
        {handoffs.length ? <div className="v32-handoff-grid">{[...handoffs].reverse().map((handoff) => <article key={handoff.id}><header><Pill tone={handoff.status === "Open" ? "warning" : "success"}>{handoff.status}</Pill><span>{handoff.createdAt}</span></header><strong>{handoff.subject}</strong><p>{handoff.from} → {handoff.to}</p><small>{handoff.recordId} · {handoff.context}</small><div><NavLink to={`/demo/workbench/${handoff.useCaseId}?feature=${handoff.featureId}`}>Open workbench</NavLink><button disabled={handoff.status === "Acknowledged"} onClick={() => acknowledgeHandoff(handoff.id)}><CheckCircle2 size={14} /> Acknowledge</button></div></article>)}</div> : <div className="demo-empty-state"><Inbox size={28} /><h2>No handoffs yet</h2><p>Complete or block a use-case action to generate the next actor’s work item.</p><NavLink className="demo-primary" to="/demo/workbench">Open use cases</NavLink></div>}
      </section>
    </>
  );
}

function ReportCenter() {
  const { createReport, savedReports, events, selectedPersona } = useWireframe();
  return (
    <>
      <section className="catalogue-hero"><div><span className="eyebrow">WF-P1-11 · governed reporting</span><h1>Save, schedule and export the reconciled scorecard</h1><p>Every delivery preview retains the metric version, current persona scope and source-event lineage.</p></div><Pill tone="info">Role scope · {selectedPersona}</Pill></section>
      <section className="v32-report-layout">
        <article className="demo-section">
          <h2>Recruitment and onboarding control scorecard</h2>
          <dl><div><dt>Metric version</dt><dd>MET-V32-01</dd></div><div><dt>Population</dt><dd>13 P0 use-case workbenches</dd></div><div><dt>Freshness</dt><dd>Browser session · {events.length} events</dd></div><div><dt>Security</dt><dd>{selectedPersona} projection</dd></div><div><dt>Zero denominator</dt><dd>N/A, never 0%</dd></div></dl>
          <div className="v32-action-row"><button className="demo-primary" onClick={() => createReport("Saved")}><Save size={15} /> Save report</button><button onClick={() => createReport("Scheduled preview")}><Mail size={15} /> Schedule preview</button><button onClick={() => createReport("Export preview")}><FileDown size={15} /> Export preview</button></div>
        </article>
        <article className="demo-section">
          <h2>Delivery audit</h2>
          {savedReports.length ? <ul className="v32-report-list">{[...savedReports].reverse().map((report) => <li key={report.id}><FileDown size={17} /><span><strong>{report.id} · {report.delivery}</strong><small>{report.metricVersion} · {report.roleScope} · {report.createdAt}</small></span><Pill tone="success">Preview only</Pill></li>)}</ul> : <div className="v32-empty"><FileDown size={24} /><strong>No saved delivery previews</strong><span>Create one without sending email or writing a file.</span></div>}
        </article>
      </section>
    </>
  );
}

function ScenarioLab() {
  const { selectedErrorId, setSelectedErrorId, rehearsal, updateRehearsal, bookmarks, checkpoints, feedback } = useWireframe();
  const [runbookId, setRunbookId] = useState("30");
  const runbook = runbooks.find((item) => item.id === runbookId) ?? runbooks[1];
  return (
    <>
      <section className="catalogue-hero"><div><span className="eyebrow">P2 demo operations</span><h1>Runbooks, scenarios, rehearsal and evidence</h1><p>Prepare a deterministic audience-specific demonstration, compare exceptions and record review evidence.</p></div><Pill tone="success">8/8 P2 capabilities</Pill></section>
      <section className="v32-scenario-layout">
        <article className="demo-section">
          <div className="v32-panel-title"><Play size={17} /><span><strong>10/30/60-minute runbooks</strong><small>WF-P2-01</small></span></div>
          <label><span>Demo format</span><select value={runbookId} onChange={(event) => setRunbookId(event.target.value)}>{runbooks.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
          <p>{runbook.guidance}</p>
          <ol className="v32-runbook-list">{runbook.useCaseIds.map((id, index) => { const useCase = getWireframeUseCase(id)!; return <li key={id}><span>{index + 1}</span><div><strong>{useCase.code} · {useCase.title}</strong><small>{index > 3 && runbook.id !== "60" ? "Optional if time is constrained" : useCase.recordId}</small></div><NavLink to={`/demo/workbench/${id}`}>Open</NavLink></li>; })}</ol>
        </article>
        <article className="demo-section">
          <div className="v32-panel-title"><AlertTriangle size={17} /><span><strong>Prepared scenario catalogue</strong><small>WF-P2-02 · WF-P1-10</small></span></div>
          <div className="v32-scenario-list">{errorScenarios.map((scenario) => <button className={selectedErrorId === scenario.id ? "active" : ""} onClick={() => setSelectedErrorId(scenario.id)} key={scenario.id}><span><strong>{scenario.label}</strong><small>{scenario.effect}</small></span>{selectedErrorId === scenario.id && <CheckCircle2 size={17} />}</button>)}</div>
        </article>
      </section>
      <section className="demo-section">
        <div className="demo-section-heading"><div><span className="eyebrow">Rehearsal status and evidence hooks</span><h2>All use cases</h2><p>Manual evidence remains explicit and is never inferred from automated rendering.</p></div></div>
        <div className="v32-rehearsal-table" role="table" aria-label="Use case rehearsal status">
          <div role="row"><span role="columnheader">Use case</span><span role="columnheader">Status</span><span role="columnheader">Issue class</span><span role="columnheader">Evidence</span><span role="columnheader">Workspace</span></div>
          {wireframeUseCases.map((useCase) => { const item = rehearsal[useCase.id]; const evidence = [item.keyboard, item.screenReader, item.mobile, item.readability].filter(Boolean).length; return <div role="row" key={useCase.id}><span role="cell"><strong>{useCase.code}</strong><small>{useCase.title}</small></span><span role="cell"><select aria-label={`${useCase.code} rehearsal status`} value={item.status} onChange={(event) => updateRehearsal(useCase.id, { status: event.target.value as typeof item.status })}><option>Not run</option><option>Pass</option><option>Fail</option></select></span><span role="cell">{item.issueClass}</span><span role="cell">{evidence}/4 manual checks</span><span role="cell"><NavLink to={`/demo/workbench/${useCase.id}?tab=feedback`}>Review</NavLink></span></div>; })}
        </div>
      </section>
      <section className="v32-evidence-summary"><article><BookmarkCheck size={20} /><strong>{bookmarks.length}</strong><span>Bookmarked use cases</span></article><article><Save size={20} /><strong>{checkpoints.length}</strong><span>Deterministic checkpoints</span></article><article><MessageSquareText size={20} /><strong>{feedback.length}</strong><span>Review observations</span></article><article><ClipboardCheck size={20} /><strong>{completeV32Backlog.length}/35</strong><span>Backlog contracts surfaced</span></article></section>
    </>
  );
}

export function WireframeV32() {
  const location = useLocation();
  const { useCaseId } = useParams();
  const selected = getWireframeUseCase(useCaseId);
  const content = useMemo(() => {
    if (location.pathname === "/demo/control-center") return <ControlCenter />;
    if (location.pathname === "/demo/handoffs") return <HandoffCenter />;
    if (location.pathname === "/demo/reports") return <ReportCenter />;
    if (location.pathname === "/demo/scenarios") return <ScenarioLab />;
    if (location.pathname.startsWith("/demo/workbench/") && selected) return <UseCaseDetail useCase={selected} />;
    if (location.pathname.startsWith("/demo/workbench/") && !selected) return <section className="demo-empty-state"><AlertTriangle size={28} /><h1>Use case not found</h1><p>The identifier is stale or outside the 12-use-case v3.2 catalogue.</p><NavLink className="demo-primary" to="/demo/workbench">Return to all use cases</NavLink></section>;
    return <WorkbenchOverview />;
  }, [location.pathname, selected]);
  return <DemoShell><V32Header />{content}</DemoShell>;
}
