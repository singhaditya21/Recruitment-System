import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileSignature,
  Filter,
  Laptop,
  Link2,
  RefreshCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  UserRoundCheck,
  UsersRound,
  Workflow,
} from "lucide-react";
import { useMemo, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import {
  flagshipNewHire,
  flagshipOnboardingTasks,
  newHireRecords,
  onboardingExceptions,
  onboardingIdentityChain,
  onboardingSummary,
  onboardingTemplates,
  provisioningRequests,
  type NewHireRecord,
} from "../data/onboarding";
import { usePrototype } from "../prototype/PrototypeContext";
import { Pill } from "./Common";

const onboardingTabs = [
  ["/hr/onboarding", "Overview"],
  ["/hr/onboarding/new-hires", "New hires"],
  ["/hr/onboarding/templates", "Templates"],
  ["/hr/onboarding/exceptions", "Exceptions"],
  ["/hr/onboarding/provisioning", "Provisioning"],
  ["/hr/onboarding/analytics", "Progress analytics"],
] as const;

function toneForRisk(risk: NewHireRecord["risk"]) {
  return risk === "At risk" ? "danger" : risk === "Watch" ? "warning" : "success";
}

function WorkspaceTabs() {
  return (
    <nav className="workspace-subnav" aria-label="Onboarding workspace views">
      {onboardingTabs.map(([to, label]) => (
        <NavLink end={to === "/hr/onboarding"} to={to} key={to}>{label}</NavLink>
      ))}
    </nav>
  );
}

function Overview({ announce }: { announce: (message: string) => void }) {
  const { completedOnboardingTaskIds, pendingWorkerCorrected, correctPendingWorker, persona } = usePrototype();
  const canCorrect = persona.role === "HRIS Operator";
  const canAssign = ["Recruiter", "Recruiting Coordinator", "Configuration Admin"].includes(persona.role);
  const [assignOpen, setAssignOpen] = useState(false);
  const completed = flagshipOnboardingTasks.filter((task) => completedOnboardingTaskIds.includes(task.id)).length;
  const blocked = pendingWorkerCorrected ? 0 : 1;
  return (
    <div className="onboarding-operations">
      <section className="onboarding-hero panel">
        <div>
          <span className="eyebrow">Recruit-to-onboard control point</span>
          <h2>Offer accepted. Worker creation is not complete.</h2>
          <p>The candidate, pre-hire and pending-worker records remain separate until plan, HRIS mapping and required evidence reconcile.</p>
        </div>
        <div className="onboarding-hero-actions">
          <NavLink className="primary-button" to="/preboarding">Preview new-hire portal <ArrowRight size={15} /></NavLink>
          <button disabled={!canAssign} className="secondary-button" onClick={() => setAssignOpen((open) => !open)}><ClipboardCheck size={15} /> Assign plan</button>
          <button className="secondary-button" onClick={() => announce("Identity transition lineage opened in preview. No worker record was created.")}><Link2 size={15} /> Review lineage</button>
        </div>
      </section>

      {assignOpen && <form className="panel inline-create-form" onSubmit={(event) => { event.preventDefault(); setAssignOpen(false); announce("Onboarding plan assignment simulated in browser memory with a pinned template version and generated task preview."); }}>
        <div><span className="eyebrow">New onboarding plan</span><h2>Assign an approved template</h2><p>The effective template version is pinned; later edits do not change this plan.</p></div>
        <label>Accepted pre-hire<select defaultValue={flagshipNewHire.id}><option value={flagshipNewHire.id}>{flagshipNewHire.name} · {flagshipNewHire.preHireId}</option>{newHireRecords.slice(1, 7).map((hire) => <option key={hire.id} value={hire.id}>{hire.name} · {hire.preHireId}</option>)}</select></label>
        <label>Template version<select defaultValue="ONT-001-v5">{onboardingTemplates.filter((template) => template.status === "Published").map((template) => <option key={template.id} value={`${template.id}-v${template.version}`}>{template.name} · v{template.version}</option>)}</select></label>
        <label>Planned start date<input type="date" defaultValue="2026-09-15" /></label>
        <label>Plan owner<select defaultValue="Priya Nair"><option>Priya Nair</option><option>Alex Rivera</option><option>Owen Brooks</option></select></label>
        <div className="inline-form-summary"><strong>Preview outcome</strong><span>5 stages · 15 generated tasks · 4 external requests · 0 writes</span></div>
        <div className="detail-action-strip"><button className="primary-button" type="submit">Preview assignment</button><button className="secondary-button" type="button" onClick={() => setAssignOpen(false)}>Cancel</button></div>
      </form>}

      <section className="onboarding-metrics" aria-label="Onboarding status">
        <article><UsersRound size={19} /><span><strong>{onboardingSummary.activeNewHires}</strong>Active new hires</span><Pill tone="info">{onboardingSummary.starting14Days} start soon</Pill></article>
        <article><ClipboardCheck size={19} /><span><strong>{completed}/{flagshipOnboardingTasks.length}</strong>Maya's tasks</span><Pill tone={blocked ? "warning" : "success"}>{blocked ? `${blocked} blocked` : "Clear"}</Pill></article>
        <article><AlertTriangle size={19} /><span><strong>{onboardingSummary.atRisk}</strong>Plans at risk</span><Pill tone="danger">Needs owners</Pill></article>
        <article><Laptop size={19} /><span><strong>{onboardingSummary.blockedProvisioning}</strong>Blocked requests</span><Pill tone="warning">IT · facilities</Pill></article>
      </section>

      <div className="onboarding-layout">
        <section className="panel onboarding-record">
          <div className="panel-heading"><div><h2>{flagshipNewHire.name}</h2><span>{flagshipNewHire.role} · starts {flagshipNewHire.startDate}</span></div><Pill tone={pendingWorkerCorrected ? "success" : "warning"}>{pendingWorkerCorrected ? "HRIS validated" : flagshipNewHire.stage}</Pill></div>
          <div className="identity-chain" aria-label="Candidate to employee identity transition">
            {onboardingIdentityChain.map((node, index) => {
              const correctedNode = pendingWorkerCorrected && node.label === "Pending worker";
              return (
                <div className="identity-node" key={node.label}>
                  <span>{index + 1}</span>
                  <div><small>{node.label}</small><strong>{node.id}</strong><Pill tone={correctedNode ? "success" : node.tone}>{correctedNode ? "Validated for conversion" : node.state}</Pill></div>
                  {index < onboardingIdentityChain.length - 1 && <ArrowRight size={16} aria-hidden="true" />}
                </div>
              );
            })}
          </div>
          <div className="onboarding-facts">
            <div><span>Manager</span><strong>{flagshipNewHire.manager}</strong></div><div><span>Department</span><strong>{flagshipNewHire.department}</strong></div>
            <div><span>Location</span><strong>{flagshipNewHire.location}</strong></div><div><span>Plan</span><strong>{flagshipNewHire.plan}</strong></div>
          </div>
        </section>

        <aside className={`panel onboarding-blocker ${pendingWorkerCorrected ? "resolved" : ""}`}>
          {pendingWorkerCorrected ? <CheckCircle2 size={23} /> : <AlertTriangle size={23} />}
          <div><span className="eyebrow">Owned exception</span><h2>{pendingWorkerCorrected ? "Correction validated" : "Pending-worker correction"}</h2>
            <p>{pendingWorkerCorrected ? "The location mapping now passes the synthetic destination contract." : flagshipNewHire.blocker}</p>
            <dl><div><dt>Owner</dt><dd>Owen Brooks · HRIS</dd></div><div><dt>Attempt</dt><dd>{pendingWorkerCorrected ? "Ready for replay" : "2 · same idempotency key"}</dd></div><div><dt>Candidate view</dt><dd>No action needed</dd></div></dl>
            <button className="primary-button" disabled={pendingWorkerCorrected || !canCorrect} onClick={() => correctPendingWorker()}>{pendingWorkerCorrected ? "Resolved in memory" : canCorrect ? "Correct and revalidate" : "HRIS owner action"}</button>
          </div>
        </aside>
      </div>

      <section className="panel onboarding-list-preview">
        <div className="panel-heading"><div><h2>Starting soon</h2><span>Seeded across teams, locations and lifecycle risk</span></div><NavLink className="secondary-button" to="/hr/onboarding/new-hires">View all {newHireRecords.length}</NavLink></div>
        <div className="record-list-grid">
          {newHireRecords.slice(0, 6).map((hire) => <NavLink to={`/hr/onboarding/new-hires/${hire.id}`} key={hire.id} className="new-hire-card"><span className="candidate-avatar">{hire.initials}</span><div><strong>{hire.name}</strong><small>{hire.role} · {hire.startDateShort}</small><div className="mini-progress"><i style={{ width: `${hire.progress}%` }} /></div></div><Pill tone={toneForRisk(hire.risk)}>{hire.risk}</Pill></NavLink>)}
        </div>
      </section>
    </div>
  );
}

function NewHireList() {
  const { persona } = usePrototype();
  const [query, setQuery] = useState("");
  const [risk, setRisk] = useState("All");
  const scopedRecords = persona.role === "Hiring Manager" ? newHireRecords.filter((hire) => hire.manager === persona.name) : newHireRecords;
  const visible = useMemo(() => scopedRecords.filter((hire) => {
    const matchesQuery = `${hire.name} ${hire.role} ${hire.id} ${hire.manager}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (risk === "All" || hire.risk === risk);
  }), [query, risk, scopedRecords]);
  return (
    <section className="panel lifecycle-table-panel">
      <div className="table-toolbar"><label><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search new hires..." /></label><label><Filter size={15} /><select value={risk} onChange={(event) => setRisk(event.target.value)}><option>All</option><option>On track</option><option>Watch</option><option>At risk</option></select></label><Pill tone="info">{visible.length} of {scopedRecords.length} in scope</Pill></div>
      <div className="lifecycle-table" role="table" aria-label="Seeded new hires">
        <div className="lifecycle-table-head" role="row"><span>Name and role</span><span>Start</span><span>Plan progress</span><span>HRIS</span><span>Risk</span></div>
        {visible.map((hire) => <NavLink role="row" to={`/hr/onboarding/new-hires/${hire.id}`} key={hire.id}>
          <span role="cell"><span className="candidate-avatar small">{hire.initials}</span><span><strong>{hire.name}</strong><small>{hire.role} · {hire.id}</small></span></span>
          <span role="cell"><strong>{hire.startDateShort}</strong><small>{hire.location}</small></span>
          <span role="cell"><strong>{hire.progress}%</strong><span className="mini-progress"><i style={{ width: `${hire.progress}%` }} /></span></span>
          <span role="cell"><Pill tone={hire.hrisStatus === "Correction required" ? "danger" : hire.hrisStatus === "Worker created" || hire.hrisStatus === "Validated" ? "success" : "info"}>{hire.hrisStatus}</Pill></span>
          <span role="cell"><Pill tone={toneForRisk(hire.risk)}>{hire.risk}</Pill></span>
        </NavLink>)}
      </div>
    </section>
  );
}

function NewHireDetail({ id }: { id: string }) {
  const hire = newHireRecords.find((record) => record.id === id);
  const { completedOnboardingTaskIds, pendingWorkerCorrected, completeOnboardingTask, announce, persona } = usePrototype();
  if (!hire) return <section className="panel empty-state"><h2>New hire not found</h2><NavLink to="/hr/onboarding/new-hires">Return to new hires</NavLink></section>;
  if (persona.role === "Hiring Manager" && hire.manager !== persona.name) return <section className="panel access-denied"><AlertTriangle size={28} /><div><h2>New hire is outside your team</h2><p>Hiring managers receive only their effective manager relationship and minimum-necessary plan data.</p></div><NavLink className="primary-button" to="/hr/onboarding/new-hires">Return to scoped list</NavLink></section>;
  const isFlagship = hire.id === flagshipNewHire.id;
  const canUpdateTask = ["Recruiter", "Recruiting Coordinator", "HRIS Operator", "Configuration Admin"].includes(persona.role) || (persona.role === "Hiring Manager" && hire.manager === persona.name);
  const tasks = isFlagship ? flagshipOnboardingTasks : flagshipOnboardingTasks.slice(0, 6).map((task, index) => ({ ...task, id: `${hire.id}-T${index + 1}`, owner: task.ownerType === "New hire" ? hire.name : task.ownerType === "Manager" ? hire.manager : task.owner }));
  return (
    <div className="new-hire-detail">
      <section className="panel record-summary-banner"><span className="candidate-avatar large">{hire.initials}</span><div><span className="eyebrow">{hire.id} · {hire.stage}</span><h2>{hire.name}</h2><p>{hire.role} · {hire.department} · starts {hire.startDate}</p></div><div className="summary-progress"><strong>{hire.progress}%</strong><span>Plan progress</span><div className="mini-progress"><i style={{ width: `${hire.progress}%` }} /></div></div><Pill tone={toneForRisk(hire.risk)}>{hire.risk}</Pill></section>
      <div className="detail-two-column">
        <section className="panel"><div className="panel-heading"><div><h2>Identity and worker transition</h2><span>Linked identities; never an in-place candidate mutation</span></div><Pill tone={isFlagship && pendingWorkerCorrected ? "success" : hire.hrisStatus === "Correction required" ? "danger" : "info"}>{isFlagship && pendingWorkerCorrected ? "Validated" : hire.hrisStatus}</Pill></div>
          <dl className="fact-list dense"><div><dt>Candidate</dt><dd>{hire.candidateId}</dd></div><div><dt>Application</dt><dd>{hire.applicationId}</dd></div><div><dt>Pre-hire</dt><dd>{hire.preHireId}</dd></div><div><dt>Pending worker</dt><dd>{hire.pendingWorkerId}</dd></div><div><dt>Employee</dt><dd>{hire.employeeId ?? "Not created"}</dd></div><div><dt>Plan version</dt><dd>{hire.plan}</dd></div></dl>
        </section>
        <section className="panel"><div className="panel-heading"><div><h2>Accountable people</h2><span>Every task retains one owner and escalation route</span></div></div><dl className="fact-list dense"><div><dt>People Ops owner</dt><dd>{hire.owner}</dd></div><div><dt>Manager</dt><dd>{hire.manager}</dd></div><div><dt>Portal</dt><dd>{hire.portalStatus}</dd></div><div><dt>Location</dt><dd>{hire.location}</dd></div><div><dt>Documents</dt><dd>{hire.documentsSigned}/{hire.documentsTotal} complete</dd></div><div><dt>Blocker</dt><dd>{hire.blocker ?? "None"}</dd></div></dl></section>
      </div>
      <section className="panel onboarding-task-preview"><div className="panel-heading"><div><h2>Assigned plan tasks</h2><span>Dependencies, owners and evidence are explicit</span></div><Pill tone="info">{tasks.length} seeded tasks</Pill></div>
        <div role="table" aria-label="Assigned onboarding tasks" className="onboarding-task-table"><div role="row" className="onboarding-task-head"><span>Task</span><span>Owner</span><span>Due</span><span>Status / action</span></div>
          {tasks.map((task) => { const done = completedOnboardingTaskIds.includes(task.id) || task.status === "Complete"; const blocked = task.status === "Blocked" && !(isFlagship && pendingWorkerCorrected); return <div role="row" key={task.id}><span role="cell"><strong>{task.title}</strong><small>{task.id} · {task.category}{task.dependency ? ` · after ${task.dependency}` : ""}</small></span><span role="cell">{task.owner}<small>{task.ownerType}</small></span><span role="cell">{task.due}</span><span role="cell">{done ? <Pill tone="success">Complete</Pill> : blocked ? <Pill tone="danger">Blocked</Pill> : canUpdateTask ? <button className="text-button" onClick={() => completeOnboardingTask(task.id)}>Mark complete</button> : <Pill tone="neutral">Read only</Pill>}</span></div>; })}
        </div>
      </section>
      <section className="detail-action-strip"><button disabled={!canUpdateTask} className="secondary-button" onClick={() => announce("Start-date change preview opened with impact analysis across tasks and providers.")}>Change start date</button><button disabled={!canUpdateTask || persona.role === "Hiring Manager"} className="secondary-button" onClick={() => announce("Plan reassignment preview opened. Active task migration requires approval.")}>Reassign plan</button><button disabled={!canUpdateTask || persona.role === "Hiring Manager"} className="secondary-button" onClick={() => announce("Cancellation preview opened with account revocation and provider reconciliation steps.")}>Cancel onboarding</button></section>
    </div>
  );
}

function TemplateWorkspace() {
  const [selectedId, setSelectedId] = useState(onboardingTemplates[0].id);
  const [preview, setPreview] = useState(false);
  const [builderOpen, setBuilderOpen] = useState(false);
  const { announce, persona } = usePrototype();
  const canEdit = persona.role === "Configuration Admin";
  const selected = onboardingTemplates.find((template) => template.id === selectedId) ?? onboardingTemplates[0];
  return <div className="template-workspace"><section className="panel template-list"><div className="panel-heading"><div><h2>Versioned onboarding templates</h2><span>Population rules select approved versions at assignment time</span></div><button disabled={!canEdit} className="secondary-button" onClick={() => setBuilderOpen((open) => !open)}>New version</button></div>{onboardingTemplates.map((template) => <button key={template.id} className={template.id === selected.id ? "selected" : ""} onClick={() => setSelectedId(template.id)}><span><strong>{template.name}</strong><small>{template.id} · v{template.version} · {template.population}</small></span><Pill tone={template.status === "Published" ? "success" : template.status === "Draft" ? "info" : "warning"}>{template.status}</Pill></button>)}</section>
    <section className="panel template-builder"><div className="panel-heading"><div><span className="eyebrow">{selected.id} · immutable v{selected.version}</span><h2>{selected.name}</h2><span>{selected.owner} · {selected.activePlans} active plans · {selected.completionRate || "N/A"}% completion</span></div><button className="primary-button" onClick={() => setPreview((value) => !value)}><SlidersHorizontal size={15} /> {preview ? "Close preview" : "Preview assignment"}</button></div>
      {builderOpen && <form className="template-version-form" onSubmit={(event) => { event.preventDefault(); setBuilderOpen(false); announce(`${selected.id} draft v${selected.version + 1} created in browser memory with one added task definition.`); }}><div className="form-grid"><label>Version name<input defaultValue={`${selected.name} v${selected.version + 1}`} /></label><label>Population rule<input defaultValue={selected.population} /></label><label className="full">New task title<input defaultValue="Confirm role-specific security training" /></label><label>Owner selector<select defaultValue="New hire"><option>New hire</option><option>Manager</option><option>People Ops</option><option>IT queue</option></select></label><label>Due offset<input defaultValue="Start date + 5 days" /></label></div><div className="detail-action-strip"><button className="primary-button" type="submit">Save draft version</button><button className="secondary-button" type="button" onClick={() => setBuilderOpen(false)}>Cancel</button></div></form>}
      {preview && <div className="assignment-preview"><strong>Assignment simulation</strong><span>Maya Chen · California · remote · Product</span><Pill tone="success">Matches this template</Pill><small>No plan created; rule explanation is synthetic.</small></div>}
      <ol className="template-stage-list">{selected.stages.map((stage, index) => <li key={stage.name}><span>{index + 1}</span><div><div><strong>{stage.name}</strong><Pill tone="neutral">{stage.offset}</Pill></div><ul>{stage.tasks.map((task) => <li key={task}><CheckCircle2 size={14} />{task}</li>)}</ul></div></li>)}</ol>
    </section></div>;
}

function ExceptionWorkspace() {
  const { resolvedOnboardingExceptionIds, resolveOnboardingException, persona } = usePrototype();
  const canResolve = ["Recruiter", "Recruiting Coordinator", "HRIS Operator"].includes(persona.role);
  const [severity, setSeverity] = useState("All");
  const rows = onboardingExceptions.filter((exception) => !resolvedOnboardingExceptionIds.includes(exception.id) && (severity === "All" || exception.severity === severity));
  return <section className="panel lifecycle-table-panel"><div className="table-toolbar"><label><Filter size={15} /><select value={severity} onChange={(event) => setSeverity(event.target.value)}><option>All</option><option>Blocker</option><option>High</option><option>Medium</option></select></label><Pill tone="danger">{rows.length} open</Pill><span>{resolvedOnboardingExceptionIds.length} resolved this session</span></div><div className="exception-grid">{rows.map((exception) => <article key={exception.id}><div><Pill tone={exception.severity === "Blocker" ? "danger" : exception.severity === "High" ? "warning" : "info"}>{exception.severity}</Pill><small>{exception.id} · {exception.ageHours}h old</small></div><h3>{exception.type}</h3><NavLink to={`/hr/onboarding/new-hires/${exception.newHireId}`}>{exception.newHire}</NavLink><p>{exception.safeImpact}</p><dl><div><dt>Owner</dt><dd>{exception.owner}</dd></div><div><dt>Due</dt><dd>{exception.due}</dd></div><div><dt>Next</dt><dd>{exception.nextAction}</dd></div></dl><button disabled={!canResolve} className="secondary-button" onClick={() => resolveOnboardingException(exception.id)}>Resolve with evidence</button></article>)}</div></section>;
}

function ProvisioningWorkspace() {
  const { completedProvisioningIds, completeProvisioning, persona } = usePrototype();
  const canDeliver = ["Platform Admin", "HRIS Operator", "Recruiting Coordinator"].includes(persona.role);
  const [fn, setFn] = useState("All");
  const rows = provisioningRequests.filter((request) => fn === "All" || request.function === fn);
  const statuses = ["Queued", "In progress", "Blocked", "Ready", "Delivered"];
  return <div className="provisioning-workspace"><section className="onboarding-metrics"><article><Laptop size={19} /><span><strong>{provisioningRequests.filter((r) => r.function === "IT").length}</strong>IT requests</span></article><article><Building2 size={19} /><span><strong>{provisioningRequests.filter((r) => r.function === "Facilities").length}</strong>Facilities</span></article><article><UserRoundCheck size={19} /><span><strong>{provisioningRequests.filter((r) => r.function === "Manager").length}</strong>Manager-owned</span></article><article><AlertTriangle size={19} /><span><strong>{onboardingSummary.blockedProvisioning}</strong>Blocked</span></article></section><div className="table-toolbar"><label><Filter size={15} /><select value={fn} onChange={(event) => setFn(event.target.value)}><option>All</option><option>IT</option><option>Facilities</option><option>Manager</option></select></label><Pill tone="info">{rows.length} requests</Pill></div><section className="provisioning-board">{statuses.map((status) => <div key={status}><header><strong>{status}</strong><span>{rows.filter((request) => (completedProvisioningIds.includes(request.id) ? "Delivered" : request.status) === status).length}</span></header>{rows.filter((request) => (completedProvisioningIds.includes(request.id) ? "Delivered" : request.status) === status).slice(0, 8).map((request) => <article key={request.id}><small>{request.id} · {request.function}</small><h3>{request.item}</h3><NavLink to={`/hr/onboarding/new-hires/${request.newHireId}`}>{request.newHire}</NavLink><p>{request.owner} · due {request.due}</p>{request.status === "Blocked" && <Pill tone="danger">{request.dependency}</Pill>}{status === "Ready" && <button disabled={!canDeliver} className="text-button" onClick={() => completeProvisioning(request.id)}>Mark delivered</button>}</article>)}</div>)}</section></div>;
}

function AnalyticsWorkspace() {
  const riskCounts = ["On track", "Watch", "At risk"].map((risk) => ({ risk, count: newHireRecords.filter((record) => record.risk === risk).length }));
  const stageCounts = ["Transition", "Preboarding", "Day one", "First 30 days", "Complete"].map((stage) => ({ stage, count: newHireRecords.filter((record) => record.stage === stage).length }));
  const exceptionTypes = [...new Set(onboardingExceptions.map((exception) => exception.type))].map((type) => ({ type, count: onboardingExceptions.filter((exception) => exception.type === type).length })).sort((a, b) => b.count - a.count);
  return <div className="onboarding-analytics"><section className="analytics-definition-strip"><ShieldCheck size={19} /><div><strong>Metric contract</strong><span>Active plan grain · synthetic snapshot Aug 28 · cancelled plans excluded · zero denominators display N/A</span></div><Pill tone="success">Reconciled</Pill></section><section className="onboarding-metrics"><article><UsersRound size={19} /><span><strong>{onboardingSummary.activeNewHires}</strong>Active plans</span></article><article><BarChart3 size={19} /><span><strong>{onboardingSummary.averageProgress}%</strong>Average progress</span></article><article><AlertTriangle size={19} /><span><strong>{onboardingSummary.atRisk}</strong>At risk</span></article><article><Clock3 size={19} /><span><strong>2.4 days</strong>Median task delay</span></article></section><div className="analytics-grid-three"><section className="panel"><div className="panel-heading"><div><h2>Plan stage</h2><span>Current stage per active and completed plan</span></div></div><div className="bar-list">{stageCounts.map(({ stage, count }) => <div key={stage}><span>{stage}</span><div><i style={{ width: `${Math.max(8, count * 10)}%` }} /></div><strong>{count}</strong></div>)}</div></section><section className="panel"><div className="panel-heading"><div><h2>Readiness risk</h2><span>Derived from blockers, overdue work and start proximity</span></div></div><div className="donut-summary"><div className="css-donut"><strong>{Math.round((riskCounts[0].count / newHireRecords.length) * 100)}%</strong><span>on track</span></div><ul>{riskCounts.map(({ risk, count }) => <li key={risk}><Pill tone={toneForRisk(risk as NewHireRecord["risk"])}>{risk}</Pill><strong>{count}</strong></li>)}</ul></div></section><section className="panel"><div className="panel-heading"><div><h2>Exception drivers</h2><span>Open exception grain; one plan may have several</span></div></div><div className="bar-list compact">{exceptionTypes.slice(0, 6).map(({ type, count }) => <div key={type}><span>{type}</span><div><i style={{ width: `${count * 22}%` }} /></div><strong>{count}</strong></div>)}</div></section></div></div>;
}

export function OnboardingOperations({ announce }: { announce: (message: string) => void }) {
  const location = useLocation();
  const { newHireId } = useParams();
  let view: React.ReactNode;
  if (newHireId) view = <NewHireDetail id={newHireId} />;
  else if (location.pathname.endsWith("/new-hires")) view = <NewHireList />;
  else if (location.pathname.endsWith("/templates")) view = <TemplateWorkspace />;
  else if (location.pathname.endsWith("/exceptions")) view = <ExceptionWorkspace />;
  else if (location.pathname.endsWith("/provisioning")) view = <ProvisioningWorkspace />;
  else if (location.pathname.endsWith("/analytics")) view = <AnalyticsWorkspace />;
  else view = <Overview announce={announce} />;
  return <><WorkspaceTabs />{view}<section className="simulation-footer"><RefreshCcw size={15} /><span>All transitions update browser memory only. No HRIS, e-sign, ITSM, identity or facilities provider is connected.</span></section></>;
}
