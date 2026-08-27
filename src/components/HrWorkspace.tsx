import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Activity, AlertOctagon, AppWindow, ArrowRight, BarChart3, Bell, Bot, BriefcaseBusiness, CalendarDays, Check, CheckCircle2, ChevronDown, CircleHelp, CircleUserRound, ClipboardCheck, Clock3, FileCheck2, FileWarning, Filter, Gauge, Grid3X3, Hand, History, Inbox, LayoutDashboard, Link2, LockKeyhole, MailWarning, Menu, MessageSquareText, MoreHorizontal, PanelBottom, PauseCircle, PlayCircle, RefreshCcw, Scale, Search, Settings2, ShieldAlert, ShieldCheck, Sparkles, UserCheck, UsersRound, XCircle } from "lucide-react";
import { actionItems, auditEvents, automationRuns, demoPersonas, jobs, pipeline, privacyRequests, prototypeMeta, recentApplications, scorecard, todaySessions } from "../data/fixtures";
import { ExplainPanel, Freshness, IntegrityNotice, Metric, Pill, PrototypeBanner, ScenarioControl, ScreenId } from "./Common";
import { usePrototype } from "../prototype/PrototypeContext";

type HrScreen = "actions" | "job" | "application" | "interview" | "scorecard" | "decision" | "automations" | "governance";

const hrNav = [
  { to: "/hr/action-center", label: "Action center", icon: LayoutDashboard },
  { to: "/hr/jobs/JOB-DEMO-001", label: "Jobs & openings", icon: BriefcaseBusiness },
  { to: "/hr/applications/APP-DEMO-001", label: "Applications", icon: UsersRound },
  { to: "/hr/interviews/INT-DEMO-001", label: "Interviews", icon: CalendarDays },
  { to: "/hr/assignments/ASN-DEMO-001", label: "Scorecards", icon: ClipboardCheck },
  { to: "/hr/decisions/APP-DEMO-001", label: "Offers & handoff", icon: FileCheck2 },
  { to: "/hr/automations", label: "Automation ops", icon: Bot },
  { to: "/hr/governance", label: "Governance", icon: ShieldCheck },
] as const;

function HrShell({ title, eyebrow, screenId, children, actions }: { title: string; eyebrow: string; screenId: string; children: React.ReactNode; actions?: React.ReactNode }) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [personaId, setPersonaId] = useState<string>(demoPersonas[0].id);
  const persona = demoPersonas.find((item) => item.id === personaId) ?? demoPersonas[0];
  const resolvedTitle = title.startsWith("Good morning") ? `Good morning, ${persona.name.split(" ")[0]}` : title;
  return (
    <div className="hr-app lightning-replica">
      <PrototypeBanner />
      <header className="lightning-global-header">
        <button className="launcher-button" aria-label="Open app launcher"><Grid3X3 size={21} /></button>
        <NavLink to="/hr/action-center" className="lightning-cloud" aria-label="Recruitment home"><span>R</span></NavLink>
        <label className="global-search"><Search size={16} /><span className="sr-only">Search synthetic recruitment workspace</span><input placeholder="Search this list..." /></label>
        <div className="topbar-actions">
          <span className="fixture-status"><i /> Synthetic data online</span>
          <button className="lightning-icon-button" aria-label="Help"><CircleHelp size={19} /></button>
          <button className="lightning-icon-button" aria-label="Setup"><Settings2 size={19} /></button>
          <button className="lightning-icon-button" aria-label="Notifications"><Bell size={19} /><span className="notification-count">3</span></button>
          <div className="persona-avatar" title={`${persona.name} · ${persona.role}`}>{persona.initials}</div>
        </div>
      </header>
      <section className="lightning-app-bar" aria-label="Recruitment application navigation">
        <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setMobileMenu((open) => !open)}><Menu size={20} /></button>
        <div className="app-identity"><span className="object-icon object-icon-recruitment"><AppWindow size={20} /></span><div><strong>Recruitment</strong><small>Talent Operations Console</small></div></div>
        <nav className={`lightning-tabs ${mobileMenu ? "open" : ""}`} aria-label="Primary HR workspace">
          {hrNav.map(({ to, label }) => <NavLink to={to} key={to} onClick={() => setMobileMenu(false)}>{label.replace(" & openings", "").replace(" & handoff", "").replace(" ops", "")}<ChevronDown size={12} /></NavLink>)}
        </nav>
        <label className="persona-switcher"><span>View as</span><select value={personaId} onChange={(event) => setPersonaId(event.target.value)} aria-label="View as demo persona">{demoPersonas.map((item) => <option value={item.id} key={item.id}>{item.name} · {item.role}</option>)}</select></label>
      </section>
      <div className="hr-shell">
        <main className="hr-main" id="main-content">
          <div className="lightning-breadcrumbs"><NavLink to="/hr/action-center">Recruitment</NavLink><span>/</span><span>{eyebrow}</span><span className="wireframe-disclaimer">Synthetic wireframe · not a Salesforce org</span></div>
          <div className="hr-page-heading"><div className="record-heading-main"><span className="object-icon"><AppWindow size={22} /></span><div><div className="heading-meta"><span className="eyebrow">{eyebrow}</span><ScreenId>{screenId}</ScreenId></div><h1>{resolvedTitle}</h1><span className="record-subtitle">{persona.role} · {persona.access} · {persona.id}</span></div></div>{actions && <div className="page-actions">{actions}</div>}</div>
          {children}
        </main>
        <footer className="lightning-utility-bar" aria-label="Workspace utilities"><button><PanelBottom size={15} /> Notes <span>2</span></button><button><History size={15} /> History</button><button><MessageSquareText size={15} /> Candidate Support <span>1</span></button><button><Activity size={15} /> Integration Health <i /></button><NavLink to="/careers"><Sparkles size={15} /> Candidate Site</NavLink></footer>
      </div>
    </div>
  );
}

function ActionCenter() {
  const [filter, setFilter] = useState("Needs me");
  const [selected, setSelected] = useState<(typeof actionItems)[number]>(actionItems[0]);
  const { scenario } = usePrototype();
  return (
    <HrShell title="Good morning, Alex" eyebrow="Tuesday · August 25" screenId="UI-HR-001" actions={<><button className="secondary-button"><RefreshCcw size={16} /> Refresh fixtures</button><button className="primary-button"><Inbox size={16} /> Triage next</button></>}>
      <div className="workspace-intro"><p>Start with what needs action, why it matters and which fact owns the deadline.</p><Freshness>Action projection · reconciled 3 min ago</Freshness></div>
      <ScenarioControl />
      <section className="metric-grid" aria-label="Action center summary">
        <Metric value="7" label="Needs your action" detail="2 overdue" tone="danger" />
        <Metric value="4" label="Candidates waiting" detail="Oldest 18 hours" tone="warning" />
        <Metric value="2" label="Missing evidence" detail="Both decision blockers" tone="info" />
        <Metric value="1" label="Failed operation" detail="Owned by Ops queue" tone="danger" />
      </section>
      <div className="action-layout">
        <section className="panel work-panel" aria-labelledby="work-heading">
          <div className="panel-heading"><div><h2 id="work-heading">Priority work</h2><span>Governed work items, not an editable dashboard</span></div><div className="segmented-control" aria-label="Work filter">{["Needs me", "My queue", "All visible"].map((item) => <button className={filter === item ? "active" : ""} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div></div>
          <div className="work-list">{actionItems.map((item) => <button className={`work-row ${selected.id === item.id ? "selected" : ""}`} key={item.id} onClick={() => setSelected(item)}><span className={`work-signal signal-${item.tone}`} /><span className="work-main"><span><Pill tone={item.tone}>{item.label}</Pill><small>{item.age}</small></span><strong>{item.subject}</strong><small>{item.owner}</small></span><ArrowRight size={17} /></button>)}</div>
        </section>
        <aside className="panel work-detail" aria-label="Selected work details"><div className="panel-heading"><div><span className="eyebrow">Selected work</span><h2>{selected.id}</h2></div><Pill tone={selected.tone}>{selected.label}</Pill></div><h3>{selected.subject}</h3><ExplainPanel source={selected.source}>{selected.why}</ExplainPanel><dl className="fact-list"><div><dt>Scenario</dt><dd>{scenario.id} · {scenario.label}</dd></div><div><dt>Owner</dt><dd>{selected.owner}</dd></div><div><dt>Age / due</dt><dd>{selected.age}</dd></div><div><dt>Authorization</dt><dd>Recruiter demo role</dd></div></dl><button className="primary-button full-button">Open authoritative record <ArrowRight size={16} /></button></aside>
      </div>
      <section className="panel pipeline-panel"><div className="panel-heading"><div><h2>Pipeline pulse</h2><span>One authorized result set across count and list views</span></div><Freshness>Application facts · 4 min ago</Freshness></div><div className="pipeline-bars">{pipeline.map((item, index) => <div key={item.stage}><div className="pipeline-label"><span>{item.stage}</span><strong>{item.count}</strong><small>{item.change}</small></div><div className="bar-track"><span style={{ width: `${100 - index * 15}%` }} /></div></div>)}</div></section>
      <div className="home-record-grid"><section className="panel"><div className="panel-heading"><div><h2>Recently updated applications</h2><span>Seeded list view · 5 records</span></div><button className="text-button"><Filter size={15} /> List controls</button></div><div className="lightning-data-table" role="table" aria-label="Recently updated applications"><div className="table-row table-head" role="row"><span role="columnheader">Application</span><span role="columnheader">Candidate</span><span role="columnheader">Job</span><span role="columnheader">Stage</span><span role="columnheader">Owner</span><span role="columnheader">Updated</span></div>{recentApplications.map((item) => <div className="table-row" role="row" key={item.id}><span role="cell"><NavLink to={`/hr/applications/${item.id}`}>{item.id}</NavLink></span><strong role="cell">{item.candidate}</strong><span role="cell">{item.job}</span><span role="cell"><Pill tone={item.tone}>{item.stage}</Pill></span><span role="cell">{item.owner}</span><span role="cell">{item.updated}</span></div>)}</div></section><section className="panel today-panel"><div className="panel-heading"><div><h2>Today's interviews</h2><span>Candidate timezone aware</span></div><CalendarDays size={18} /></div>{todaySessions.map((item) => <div className="session-row" key={`${item.time}-${item.candidate}`}><strong>{item.time}</strong><div><span>{item.candidate}</span><small>{item.interview} · {item.interviewer}</small></div><Pill tone={item.state === "Conflict" ? "danger" : item.state === "Complete" ? "success" : "info"}>{item.state}</Pill></div>)}</section></div>
    </HrShell>
  );
}

function JobWorkspace() {
  const { scenario } = usePrototype();
  const blocked = scenario.id === "SCN-012";
  return (
    <HrShell title="Senior Product Designer" eyebrow="Job & opening workspace" screenId="UI-HR-002" actions={<><button className="secondary-button">Preview public job</button><button className="primary-button" disabled={blocked}>{blocked ? "Publication blocked" : "Publish version 3"}</button></>}>
      <div className="context-strip"><div><span>Job ID</span><strong>JOB-DEMO-001</strong></div><div><span>Openings</span><strong>1 approved · 0 filled</strong></div><div><span>Owner</span><strong>Alex Rivera</strong></div><div><span>Effective plan</span><strong>PLAN-DES-04 · v2</strong></div><Freshness>Reconciled 4 min ago</Freshness></div>
      <ScenarioControl />
      {blocked ? <div className="blocking-banner" role="alert"><ShieldAlert size={22} /><div><strong>Publication is blocked</strong><span>Work location and candidate residence produce an unknown policy result. LEGAL-DEMO queue owns review.</span></div><Pill tone="danger">ERR-008</Pill></div> : <div className="success-banner"><CheckCircle2 size={20} /><div><strong>Ready for publication</strong><span>Required content, opening, policy and approval facts are current.</span></div></div>}
      <div className="job-workspace-grid">
        <section className="panel"><div className="panel-heading"><div><h2>Readiness</h2><span>Derived from authoritative facts</span></div><strong className={`readiness-score ${blocked ? "blocked" : ""}`}>{blocked ? "71%" : "100%"}</strong></div><div className="readiness-list">{[["Opening approved", true], ["Hiring team covered", true], ["Structured plan approved", true], ["Pay and content approved", true], ["Jurisdiction result known", !blocked]].map(([label, pass]) => <div key={String(label)} className={pass ? "pass" : "fail"}>{pass ? <CheckCircle2 size={18} /> : <XCircle size={18} />}<span>{label}</span><strong>{pass ? "Ready" : "Blocked"}</strong></div>)}</div><ExplainPanel source="Job v7 · Policy evaluation v12">Readiness is recalculated from opening, ownership, content, policy and approval records. It cannot be edited directly.</ExplainPanel></section>
        <section className="panel"><div className="panel-heading"><div><h2>Opening reconciliation</h2><span>Exactly one approved opening</span></div><Pill tone="success">Balanced</Pill></div><div className="opening-visual"><div><strong>1</strong><span>Approved</span></div><ArrowRight size={20} /><div><strong>0</strong><span>Reserved</span></div><ArrowRight size={20} /><div><strong>0</strong><span>Filled</span></div></div><dl className="fact-list"><div><dt>Headcount reference</dt><dd>HC-DEMO-028</dd></div><div><dt>Budget approval</dt><dd>Approved fixture · v2</dd></div><div><dt>Reconciliation</dt><dd>No variance</dd></div></dl></section>
        <section className="panel wide-panel"><div className="panel-heading"><div><h2>Structured hiring plan</h2><span>Outcomes → competencies → evidence</span></div><button className="text-button">Compare v1 to v2</button></div><div className="plan-grid"><div><span className="plan-kicker">Outcome</span><strong>Unify a fragmented product workflow</strong><p>First 180 days · approved evidence target</p></div><div><span className="plan-kicker">Competencies</span><div className="chip-row"><Pill>Systems thinking</Pill><Pill>Accessible design</Pill><Pill>Collaboration</Pill></div></div><div><span className="plan-kicker">Evidence</span><strong>Portfolio review + structured interview</strong><p>Scorecard v4 · no model-generated ranking</p></div></div></section>
      </div>
      <IntegrityNotice kind="human" />
    </HrShell>
  );
}

function ApplicationWorkspace() {
  const [preview, setPreview] = useState(false);
  return (
    <HrShell title="Maya Chen" eyebrow="Application workspace · APP-DEMO-001" screenId="UI-HR-003" actions={<><button className="secondary-button"><MessageSquareText size={16} /> Message</button><button className="primary-button" onClick={() => setPreview(true)}>Review transition <ChevronDown size={16} /></button></>}>
      <div className="candidate-context"><div className="avatar large">MC</div><div><h2>Maya Chen</h2><span>Senior Product Designer · Interviews</span></div><Pill tone="warning">Decision blocked</Pill><div className="context-facts"><span>Owner <strong>Alex Rivera</strong></span><span>Stage age <strong>3 days</strong></span><span>Application <strong>v5</strong></span></div></div>
      <div className="application-workspace-grid">
        <section className="panel timeline-panel"><div className="panel-heading"><div><h2>Process timeline</h2><span>Primary stage plus typed parallel work</span></div><Freshness>Application v5</Freshness></div><ol className="stage-timeline">{[["Submitted", "Aug 12", "complete"], ["Recruiter review", "Aug 13", "complete"], ["Screening", "Aug 16", "complete"], ["Interviews", "Current", "current"], ["Debrief", "Blocked", "blocked"], ["Offer", "Not started", "future"]].map(([label, meta, state]) => <li className={state} key={label}><span className="timeline-dot">{state === "complete" ? <Check size={13} /> : ""}</span><div><strong>{label}</strong><small>{meta}</small></div></li>)}</ol><ExplainPanel source="Readiness calculation v18">Debrief cannot begin because one required scorecard is missing. An authorized waiver would preserve that evidence gap.</ExplainPanel></section>
        <section className="panel evidence-panel"><div className="panel-heading"><div><h2>Job-related evidence</h2><span>Minimum necessary for this role</span></div><Pill tone="info">Plan v2</Pill></div>{scorecard.map((item) => <div className="evidence-row" key={item.competency}><div><strong>{item.competency}</strong><Pill tone={item.rating.startsWith("Strong") ? "success" : "warning"}>{item.rating}</Pill></div><p>{item.evidence}</p></div>)}<button className="secondary-button full-button">Open independent scorecards</button></section>
        <aside className="panel parallel-panel"><div className="panel-heading"><h2>Parallel work</h2><span>3 active facts</span></div><div className="parallel-item"><ClipboardCheck size={19} /><div><strong>1 scorecard missing</strong><span>Jordan Lee · 6h overdue</span></div><Pill tone="danger">Blocker</Pill></div><div className="parallel-item"><CalendarDays size={19} /><div><strong>Sessions complete</strong><span>2 of 2 · attendance known</span></div><Pill tone="success">Ready</Pill></div><div className="parallel-item"><ShieldCheck size={19} /><div><strong>Policy clear</strong><span>California pilot · v2</span></div><Pill tone="success">Ready</Pill></div></aside>
      </div>
      {preview && <div className="modal-scrim" role="presentation"><section className="transition-modal" role="dialog" aria-modal="true" aria-labelledby="transition-title"><button className="modal-close" aria-label="Close transition preview" onClick={() => setPreview(false)}><XCircle size={20} /></button><Pill tone="warning">TRN-005 · preview only</Pill><h2 id="transition-title">Move Interviews → Debrief?</h2><p>This transition is currently blocked. The preview explains required facts without executing anything.</p><div className="transition-checks"><div className="pass"><CheckCircle2 size={18} /><span>All sessions completed</span></div><div className="fail"><XCircle size={18} /><span>1 required scorecard missing</span></div></div><IntegrityNotice kind="simulation" /><div className="modal-actions"><button className="secondary-button" onClick={() => setPreview(false)}>Close preview</button><button className="primary-button" disabled>Transition blocked</button></div></section></div>}
    </HrShell>
  );
}

function InterviewWorkspace() {
  const [rescheduled, setRescheduled] = useState(false);
  return (
    <HrShell title="Interview coordination" eyebrow="Maya Chen · Senior Product Designer" screenId="UI-HR-004" actions={<button className="primary-button" onClick={() => setRescheduled(true)}>{rescheduled ? "Rescheduled in memory" : "Resolve conflict"}</button>}>
      <div className="blocking-banner"><CalendarDays size={22} /><div><strong>{rescheduled ? "Conflict resolved in simulation" : "Interviewer conflict detected"}</strong><span>{rescheduled ? "The preview now uses Aug 28 at 9:30 AM Pacific; no calendar event was sent." : "Jordan Lee declined the Aug 27 session. Candidate availability remains valid in America/Los_Angeles."}</span></div><Pill tone={rescheduled ? "success" : "warning"}>{rescheduled ? "Preview ready" : "Action due"}</Pill></div>
      <div className="interview-grid"><section className="panel"><div className="panel-heading"><div><h2>Candidate availability</h2><span>Shown in candidate timezone</span></div><Pill tone="info">America/Los_Angeles</Pill></div><div className="availability-grid">{["Wed 27 · 9:30 AM", "Thu 28 · 9:30 AM", "Thu 28 · 1:00 PM", "Fri 29 · 11:00 AM"].map((slot, index) => <button className={rescheduled && index === 1 ? "selected" : index === 0 ? "conflict" : ""} key={slot}><strong>{slot}</strong><span>{index === 0 ? "Conflict" : index === 1 && rescheduled ? "Selected" : "Available"}</span></button>)}</div><ExplainPanel source="Availability v3 · candidate supplied">All times remain anchored to the candidate timezone. Calendar projection is generated only after explicit confirmation.</ExplainPanel></section><section className="panel"><div className="panel-heading"><div><h2>Participants & logistics</h2><span>Canonical session v4</span></div><Pill tone="warning">Draft change</Pill></div><div className="participant"><div className="avatar">JL</div><div><strong>Jordan Lee</strong><span>Interviewer · declined current time</span></div><Pill tone="danger">Conflict</Pill></div><div className="participant"><div className="avatar">MC</div><div><strong>Maya Chen</strong><span>Candidate · synthetic contact</span></div><Pill tone="success">Available</Pill></div><dl className="fact-list"><div><dt>Format</dt><dd>Video · 45 minutes</dd></div><div><dt>Candidate timezone</dt><dd>America/Los_Angeles</dd></div><div><dt>Projection</dt><dd>{rescheduled ? "Preview only" : "Old invite remains current"}</dd></div></dl></section></div>
      <IntegrityNotice kind="simulation" />
    </HrShell>
  );
}

function ScorecardWorkspace() {
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  return (
    <HrShell title="Structured scorecard" eyebrow="Independent interviewer workspace" screenId="UI-HR-005" actions={<><span className="autosave-state"><Check size={15} /> {saved ? "Saved in memory" : "Fixture loaded"}</span><button className="primary-button" onClick={() => { setSaved(true); setSubmitted(true); }}>{submitted ? "Submitted · demo" : "Submit scorecard"}</button></>}>
      <div className="scorecard-brief"><div><Pill tone="info">Assignment ASN-DEMO-001</Pill><h2>Evidence for Maya Chen</h2><p>Assess only the approved competencies. Do not compare candidates or infer protected characteristics.</p></div><dl><div><dt>Role</dt><dd>Senior Product Designer</dd></div><div><dt>Interview</dt><dd>Systems & collaboration</dd></div><div><dt>Due</dt><dd>Today · 4:00 PM</dd></div></dl></div>
      <IntegrityNotice kind="human" />
      <section className="panel scorecard-form"><div className="panel-heading"><div><h2>Competency evidence</h2><span>Scorecard v4 · independent until submission</span></div><Pill tone={submitted ? "success" : "warning"}>{submitted ? "Locked preview" : "Draft"}</Pill></div>{["Systems thinking", "Accessible design", "Collaboration"].map((competency, groupIndex) => <fieldset className="rating-block" key={competency} disabled={submitted}><legend><span>{groupIndex + 1}</span>{competency}</legend><p>{groupIndex === 0 ? "Connects user, operational and technical constraints into a coherent direction." : groupIndex === 1 ? "Identifies barriers and designs robust keyboard, screen-reader and recovery behavior." : "Builds shared understanding and resolves disagreement with evidence."}</p><div className="rating-options">{["Insufficient evidence", "Mixed evidence", "Strong evidence"].map((rating) => <label key={rating}><input type="radio" name={`rating-${groupIndex}`} defaultChecked={rating === (groupIndex === 2 ? "Mixed evidence" : "Strong evidence")} /><span>{rating}</span></label>)}</div><div className="fixture-note"><MessageSquareText size={16} /><span>Generated note:</span> {scorecard[groupIndex].evidence}</div></fieldset>)}<div className="scorecard-actions"><button className="secondary-button" disabled={submitted} onClick={() => setSaved(true)}>Save demo draft</button><span>No network or persistent storage</span></div></section>
    </HrShell>
  );
}

function DecisionWorkspace() {
  const { scenario } = usePrototype();
  const handoffFailed = scenario.id === "SCN-007";
  return (
    <HrShell title="Decision, offer & handoff" eyebrow="Maya Chen · APP-DEMO-001" screenId="UI-HR-006" actions={<button className="primary-button">Preview next governed action</button>}>
      <IntegrityNotice kind="human" />
      <div className="decision-flow" aria-label="Decision and handoff progress">{[["Human decision", "Complete", "success"], ["Offer approval", "Version 4 approved", "success"], ["Candidate response", "Accepted fixture", "success"], ["HR handoff", handoffFailed ? "Reconciliation failed" : "Acknowledgement due", handoffFailed ? "danger" : "warning"], ["Hired", "Blocked until ack", "neutral"]].map(([label, state, tone], index) => <div className="decision-step" key={label}><span className={`decision-dot dot-${tone}`}>{index < 3 ? <Check size={15} /> : index + 1}</span><div><strong>{label}</strong><small>{state}</small></div>{index < 4 && <ArrowRight size={17} />}</div>)}</div>
      {handoffFailed && <div className="blocking-banner"><AlertOctagon size={22} /><div><strong>Handoff delivery not acknowledged</strong><span>The candidate remains Ready for Hire. The prototype never equates offer acceptance with Hired.</span></div><Pill tone="danger">ERR-009</Pill></div>}
      <div className="decision-grid"><section className="panel"><div className="panel-heading"><div><h2>Current offer</h2><span>Immutable approved version</span></div><Pill tone="success">Accepted · demo</Pill></div><dl className="offer-facts"><div><dt>Offer version</dt><dd>v4 · supersedes v3</dd></div><div><dt>Base salary</dt><dd>$164,000 USD</dd></div><div><dt>Opening reservation</dt><dd>OPEN-DEMO-001 · active</dd></div><div><dt>Response evidence</dt><dd>Fixture accepted · Aug 24</dd></div></dl><button className="secondary-button full-button">Compare superseded versions</button></section><section className="panel"><div className="panel-heading"><div><h2>Handoff integrity</h2><span>TRN-010 → TRN-011</span></div><Pill tone={handoffFailed ? "danger" : "warning"}>{handoffFailed ? "Needs reconciliation" : "Pending acknowledgement"}</Pill></div><dl className="fact-list"><div><dt>Payload hash</dt><dd>sha256:demo…7f21</dd></div><div><dt>Idempotency key</dt><dd>HAND-DEMO-01:v2:deliver</dd></div><div><dt>Destination</dt><dd>HRIS fixture adapter</dd></div><div><dt>Hire state</dt><dd><strong>Not Hired</strong></dd></div></dl><ExplainPanel source="Handoff attempt 2 · fresh 1 min ago">Hired becomes valid only after the destination or approved manual process acknowledges the exact handoff version.</ExplainPanel></section></div>
    </HrShell>
  );
}

function AutomationWorkspace() {
  const [paused, setPaused] = useState(false);
  const [simulated, setSimulated] = useState(false);
  return (
    <HrShell title="Workflow & automation operations" eyebrow="Simulation control plane" screenId="UI-HR-007" actions={<><button className="secondary-button" onClick={() => setSimulated(true)}><Gauge size={16} /> {simulated ? "Simulation complete" : "Run impact simulation"}</button><button className={paused ? "primary-button" : "danger-button"} onClick={() => setPaused((value) => !value)}>{paused ? <PlayCircle size={16} /> : <PauseCircle size={16} />}{paused ? "Resume demo rules" : "Pause demo rules"}</button></>}>
      <IntegrityNotice kind="simulation" />
      <section className="metric-grid"><Metric value={paused ? "Paused" : "14 active"} label="Pilot rules" detail="AUT-003 reserved" tone={paused ? "warning" : "success"} /><Metric value="23" label="Runs today" detail="Fixture ledger" /><Metric value="1" label="Needs review" detail="No duplicate effect" tone="danger" /><Metric value="0" label="Unowned failures" detail="Operations queue" tone="success" /></section>
      {simulated && <div className="success-banner" role="status"><CheckCircle2 size={20} /><div><strong>Impact simulation complete</strong><span>23 fixture runs evaluated; 1 conflict and 2 suppressions predicted. No rule was executed.</span></div></div>}
      <div className="automation-layout"><section className="panel"><div className="panel-heading"><div><h2>Rule release</h2><span>Draft → simulate → approve → activate</span></div><Pill tone={paused ? "warning" : "success"}>{paused ? "Globally paused · demo" : "Release 0.9 active · demo"}</Pill></div><div className="rule-list">{[["AUT-001", "Application confirmation", "Active"], ["AUT-008", "Scorecard reminder", "Active"], ["AUT-010", "Opening reservation", "Active"], ["AUT-015", "Integration reconciliation", "Active"]].map(([id, name, state]) => <div className="rule-row" key={id}><Bot size={18} /><div><strong>{id} · {name}</strong><span>Version 0.9 · simulation owner: Ops demo</span></div><Pill tone={paused ? "warning" : "success"}>{paused ? "Paused" : state}</Pill><button className="icon-button" aria-label={`More options for ${id}`}><MoreHorizontal size={17} /></button></div>)}</div></section><section className="panel"><div className="panel-heading"><div><h2>Recent runs</h2><span>Replay-safe operation ledger</span></div><button className="text-button"><Filter size={15} /> Filter</button></div><div className="run-list">{automationRuns.map((run) => <div className="run-row" key={run.id}><span className={`run-icon run-${run.tone}`}>{run.tone === "success" ? <Check size={16} /> : run.tone === "danger" ? <AlertOctagon size={16} /> : <Hand size={16} />}</span><div><strong>{run.rule}</strong><span>{run.id} · {run.attempts}</span><code>{run.key}</code></div><Pill tone={run.tone}>{run.state}</Pill></div>)}</div></section></div>
    </HrShell>
  );
}

function GovernanceWorkspace() {
  const [tab, setTab] = useState("Policy gates");
  return (
    <HrShell title="Privacy, policy, security & audit" eyebrow="Restricted administration" screenId="UI-HR-008" actions={<button className="secondary-button"><History size={16} /> Export evidence preview</button>}>
      <IntegrityNotice kind="restricted" />
      <div className="governance-tabs" role="tablist" aria-label="Governance sections">{["Policy gates", "Privacy requests", "Access", "Audit evidence"].map((item) => <button role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => setTab(item)} key={item}>{item}</button>)}</div>
      {tab === "Policy gates" && <div className="governance-grid"><section className="panel"><div className="panel-heading"><div><h2>Jurisdiction evaluation</h2><span>Publication gate · policy v2</span></div><Pill tone="danger">1 blocked</Pill></div><div className="policy-case"><span className="policy-icon"><Scale size={20} /></span><div><strong>CASE-DEMO-012 · unknown work location</strong><p>Job reach conflicts with the California-only synthetic pilot rule. Publication and regulated action remain blocked.</p><div className="chip-row"><Pill tone="danger">ERR-008</Pill><Pill>Owner: Legal demo queue</Pill></div></div><button className="secondary-button">Review facts</button></div><ExplainPanel source="Policy evaluation v12">Unknown or conflicting applicability never defaults to “allowed.” The blocker is explicit and owned.</ExplainPanel></section><section className="panel"><div className="panel-heading"><div><h2>Provider registry</h2><span>All adapters disabled</span></div><Pill tone="success">No external calls</Pill></div>{[["Email", "Fixture renderer", "Disabled"], ["Calendar", "ICS preview adapter", "Disabled"], ["HRIS", "Handoff fixture adapter", "Disabled"]].map(([purpose, provider, state]) => <div className="provider-row" key={purpose}><Link2 size={17} /><div><strong>{purpose}</strong><span>{provider}</span></div><Pill tone="neutral">{state}</Pill></div>)}</section></div>}
      {tab === "Privacy requests" && <section className="panel"><div className="panel-heading"><div><h2>Privacy request fixtures</h2><span>No real identity verification or execution</span></div><Pill tone="warning">3 active fixtures</Pill></div><div className="privacy-table" role="table" aria-label="Synthetic privacy requests"><div className="privacy-row privacy-head" role="row"><span role="columnheader">Request</span><span role="columnheader">Person</span><span role="columnheader">Type</span><span role="columnheader">Received</span><span role="columnheader">Due</span><span role="columnheader">Owner</span><span role="columnheader">State</span></div>{privacyRequests.map((item) => <div className="privacy-row" role="row" key={item.id}><strong role="cell">{item.id}</strong><span role="cell">{item.person}</span><span role="cell">{item.type}</span><span role="cell">{item.received}</span><span role="cell">{item.due}</span><span role="cell">{item.owner}</span><span role="cell"><Pill tone="warning">{item.state}</Pill></span></div>)}</div><ExplainPanel source="Synthetic privacy ledger · Aug 27">Every request stays gated by identity evidence, scoped data mapping, legal-hold evaluation and an authorized human decision.</ExplainPanel></section>}
      {tab === "Access" && <section className="panel"><div className="panel-heading"><div><h2>Negative-access demonstrations</h2><span>SCN-011 · least-privilege fixtures</span></div><Pill tone="success">6 of 6 safe</Pill></div><div className="access-matrix">{[["Recruiter", "Compensation approval", false], ["Interviewer", "Other scorecards", false], ["Support", "Application evidence", false], ["Approver", "Medical/accommodation", false], ["Candidate", "Internal stage/reason", false], ["Restricted admin", "Minimized audit event", true]].map(([role, resource, allowed]) => <div key={`${role}-${resource}`}><span>{role}</span><strong>{resource}</strong><Pill tone={allowed ? "success" : "neutral"}>{allowed ? "Allowed" : "Denied safely"}</Pill></div>)}</div></section>}
      {tab === "Audit evidence" && <section className="panel"><div className="panel-heading"><div><h2>Minimized audit events</h2><span>Generated fixture evidence</span></div><Freshness>Ledger snapshot · now</Freshness></div><div className="audit-table" role="table" aria-label="Audit fixture events"><div role="row" className="audit-head"><span role="columnheader">Time</span><span role="columnheader">Actor</span><span role="columnheader">Event</span><span role="columnheader">Outcome</span><span role="columnheader">Reference</span></div>{auditEvents.map((event) => <div role="row" key={event.ref}><span role="cell">{event.time}</span><span role="cell">{event.actor}</span><span role="cell">{event.event}</span><span role="cell"><Pill tone={event.outcome.includes("Denied") ? "neutral" : "success"}>{event.outcome}</Pill></span><code role="cell">{event.ref}</code></div>)}</div></section>}
    </HrShell>
  );
}

export function HrWorkspace({ screen }: { screen: HrScreen }) {
  if (screen === "actions") return <ActionCenter />;
  if (screen === "job") return <JobWorkspace />;
  if (screen === "application") return <ApplicationWorkspace />;
  if (screen === "interview") return <InterviewWorkspace />;
  if (screen === "scorecard") return <ScorecardWorkspace />;
  if (screen === "decision") return <DecisionWorkspace />;
  if (screen === "automations") return <AutomationWorkspace />;
  return <GovernanceWorkspace />;
}
