import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  CloudCog,
  Database,
  Fingerprint,
  KeyRound,
  LockKeyhole,
  RefreshCcw,
  Search,
  ServerCog,
  ShieldAlert,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  dataStores,
  identityConnections,
  integrationConnections,
  lifecycleModelSummary,
  lifecycleObjectContracts,
  platformRisks,
} from "../data/lifecyclePlatform";
import { Pill } from "./Common";

const tabs = [
  ["/hr/platform", "Control center"],
  ["/hr/platform/identity", "Identity"],
  ["/hr/platform/integrations", "Integrations"],
  ["/hr/platform/data", "Data architecture"],
  ["/hr/platform/security", "Security readiness"],
] as const;

function PlatformTabs() {
  return <nav className="workspace-subnav" aria-label="Platform control views">{tabs.map(([to, label]) => <NavLink end={to === "/hr/platform"} to={to} key={to}>{label}</NavLink>)}</nav>;
}

function ControlCenter() {
  const degraded = integrationConnections.filter((connection) => connection.status === "Degraded").length;
  return <div className="platform-overview"><section className="platform-boundary panel"><ShieldAlert size={30} /><div><span className="eyebrow">Production boundary</span><h2>This is an implementable control design—not production infrastructure.</h2><p>The wireframe makes identity, persistence, integration and security contracts reviewable while keeping every real connection, credential, store and approval explicitly unimplemented.</p></div><Pill tone="warning">6 production gates open</Pill></section><section className="onboarding-metrics"><article><Fingerprint size={19} /><span><strong>{identityConnections.length}</strong>Identity boundaries</span><Pill tone="warning">1 rotation due</Pill></article><article><CloudCog size={19} /><span><strong>{integrationConnections.length}</strong>Integration contracts</span><Pill tone="danger">{degraded} degraded</Pill></article><article><Boxes size={19} /><span><strong>{lifecycleModelSummary.objects}</strong>Lifecycle objects</span><Pill tone="info">{lifecycleModelSummary.keyDataPoints} key fields</Pill></article><article><Database size={19} /><span><strong>{dataStores.length}</strong>Proposed stores</span><Pill tone="warning">0 approved</Pill></article></section><div className="platform-control-grid"><NavLink to="/hr/platform/identity" className="panel"><Fingerprint size={24} /><h2>Identity and access</h2><p>Separate workforce, candidate, new-hire and workload identities with server-side authorization.</p><span>Review trust boundaries →</span></NavLink><NavLink to="/hr/platform/integrations" className="panel"><Workflow size={24} /><h2>Integration operations</h2><p>Schema versions, idempotency, retries, reconciliation and accountable recovery.</p><span>Review provider contracts →</span></NavLink><NavLink to="/hr/platform/data" className="panel"><Database size={24} /><h2>Persistence and objects</h2><p>Logical object grain, restricted data, store boundaries, backup and lineage.</p><span>Review lifecycle model →</span></NavLink><NavLink to="/hr/platform/security" className="panel"><ShieldCheck size={24} /><h2>Security readiness</h2><p>Threat model, SLO, observability, incident, recovery and release gates.</p><span>Review open controls →</span></NavLink></div></div>;
}

function IdentityWorkspace({ announce }: { announce: (message: string) => void }) {
  return <div className="identity-workspace"><section className="panel identity-map"><div className="panel-heading"><div><h2>Identity-domain separation</h2><span>One person can have linked identities without sharing every claim or session</span></div><Pill tone="warning">Proposed</Pill></div><div className="identity-domain-flow">{[["Candidate", "Candidate IdP", "Career and application"], ["Accepted pre-hire", "New-hire IdP", "Onboarding only"], ["Employee", "Workforce IdP", "Employee systems"], ["Integration service", "Workload identity", "Approved API scopes"]].map(([subject, provider, scope], index) => <article key={subject}><span>{index + 1}</span><div><strong>{subject}</strong><small>{provider}</small><p>{scope}</p></div>{index < 3 && <i />}</article>)}</div><div className="control-note"><LockKeyhole size={18} /><span><strong>Transition rule</strong>Offer acceptance creates a pre-hire identity binding. Employee creation expires new-hire sessions and establishes a workforce link; it never copies credentials.</span></div></section><section className="panel"><div className="panel-heading"><div><h2>Connection inventory</h2><span>Certificates and secrets are opaque references only</span></div><button className="secondary-button" onClick={() => announce("Identity health simulation completed; no provider was contacted.")}><RefreshCcw size={15} /> Run health simulation</button></div><div className="connection-list">{identityConnections.map((connection) => <article key={connection.id}><span className="connection-icon"><KeyRound size={20} /></span><div><small>{connection.id} · {connection.protocol}</small><h3>{connection.name}</h3><p>{connection.population}</p><span>{connection.assurance}</span></div><Pill tone={connection.status === "Active" ? "success" : connection.status === "Rotation due" ? "danger" : "warning"}>{connection.status}</Pill><small>{connection.lastCheck}</small></article>)}</div></section><section className="panel access-enforcement"><div className="panel-heading"><div><h2>Authorization evaluation</h2><span>Every service request must pass all layers</span></div></div><ol>{["Authenticated subject and current session assurance", "Role and permission for object action", "Row relationship and effective-time scope", "Field classification and restricted entitlement", "Purpose, jurisdiction and policy evaluation", "Audit event with decision and correlation ID"].map((item, index) => <li key={item}><span>{index + 1}</span><strong>{item}</strong><CheckCircle2 size={17} /></li>)}</ol></section></div>;
}

function IntegrationWorkspace({ announce }: { announce: (message: string) => void }) {
  const [selectedId, setSelectedId] = useState<string>(integrationConnections[0].id);
  const selected = integrationConnections.find((connection) => connection.id === selectedId) ?? integrationConnections[0];
  return <div className="integration-workspace"><section className="panel integration-list"><div className="panel-heading"><div><h2>Connection health</h2><span>Synthetic status with realistic recovery contracts</span></div><Pill tone="info">{integrationConnections.length} connections</Pill></div>{integrationConnections.map((connection) => <button className={selected.id === connection.id ? "selected" : ""} onClick={() => setSelectedId(connection.id)} key={connection.id}><span className="connection-icon"><ServerCog size={19} /></span><span><strong>{connection.name}</strong><small>{connection.provider} · {connection.schema}</small></span><Pill tone={connection.status === "Healthy" ? "success" : "danger"}>{connection.status}</Pill><small>{connection.queue} queued</small></button>)}</section><section className="panel integration-detail"><div className="panel-heading"><div><span className="eyebrow">{selected.id} · {selected.direction}</span><h2>{selected.name}</h2><span>{selected.provider} · contract {selected.schema}</span></div><Pill tone={selected.status === "Healthy" ? "success" : "danger"}>{selected.status}</Pill></div><dl className="fact-list dense"><div><dt>Last success</dt><dd>{selected.lastSuccess}</dd></div><div><dt>Queue depth</dt><dd>{selected.queue} events</dd></div><div><dt>Retry contract</dt><dd>{selected.retry}</dd></div><div><dt>Credential</dt><dd>Vault reference · not present</dd></div><div><dt>Observability</dt><dd>Correlation, latency, retries, reconciliation</dd></div><div><dt>Owner</dt><dd>Integration operations</dd></div></dl><section className="integration-sequence"><h3>Recovery sequence</h3>{["Validate schema and aggregate version", "Reserve idempotency key", "Attempt provider effect", "Record provider acknowledgement", "Reconcile destination state", "Escalate owned exception if unresolved"].map((step, index) => <div key={step}><span>{index + 1}</span><strong>{step}</strong></div>)}</section><div className="detail-action-strip"><button className="primary-button" onClick={() => announce(`${selected.id} replay preview created with the same synthetic idempotency key.`)}>Preview safe replay</button><button className="secondary-button" onClick={() => announce(`${selected.id} reconciliation report opened in memory.`)}>View reconciliation</button><button className="secondary-button" onClick={() => announce(`${selected.id} pause impact simulated; no provider subscription changed.`)}>Simulate pause</button></div></section></div>;
}

function DataWorkspace() {
  const [domain, setDomain] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(lifecycleObjectContracts[0].id);
  const visible = useMemo(() => lifecycleObjectContracts.filter((object) => (domain === "All" || object.domain === domain) && `${object.name} ${object.grain} ${object.keyFields.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [domain, query]);
  const selected = lifecycleObjectContracts.find((object) => object.id === selectedId) ?? lifecycleObjectContracts[0];
  return <div className="data-architecture-workspace"><section className="onboarding-metrics"><article><Boxes size={19} /><span><strong>{lifecycleModelSummary.objects}</strong>Extension objects</span><Pill tone="info">Logical</Pill></article><article><ClipboardIcon /><span><strong>{lifecycleModelSummary.keyDataPoints}</strong>Key data points</span><Pill tone="info">Plus governance fields</Pill></article><article><Workflow size={19} /><span><strong>{lifecycleModelSummary.lifecycleStates}</strong>Lifecycle states</span><Pill tone="success">Explicit</Pill></article><article><Database size={19} /><span><strong>0</strong>Physical objects approved</span><Pill tone="warning">Architecture gate</Pill></article></section><section className="panel store-contracts"><div className="panel-heading"><div><h2>Proposed persistence boundaries</h2><span>Logical disposition; no database, org or storage service exists</span></div></div><div>{dataStores.map((store) => <article key={store.id}><Database size={20} /><span><small>{store.id} · {store.status}</small><strong>{store.name}</strong><p>{store.purpose}</p></span><span><small>{store.classes}</small><strong>{store.recovery}</strong><small>{store.region}</small></span></article>)}</div></section><div className="model-browser"><section className="panel model-object-list"><div className="table-toolbar"><label><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search lifecycle objects..." /></label><select value={domain} onChange={(event) => setDomain(event.target.value)}><option>All</option><option>Onboarding</option><option>Talent relationship</option><option>Internal mobility</option><option>Platform</option></select></div><div>{visible.map((object) => <button className={selected.id === object.id ? "selected" : ""} onClick={() => setSelectedId(object.id)} key={object.id}><span><strong>{object.name}</strong><small>{object.id} · {object.domain}</small></span>{object.restricted && <LockKeyhole size={15} />}</button>)}</div></section><aside className="panel model-object-detail"><span className="eyebrow">{selected.id} · {selected.domain}</span><h2>{selected.name}</h2><Pill tone={selected.restricted ? "warning" : "info"}>{selected.restricted ? "Restricted fields" : "Standard control"}</Pill><dl><div><dt>Grain</dt><dd>{selected.grain}</dd></div><div><dt>Authoritative parent</dt><dd>{selected.parent}</dd></div><div><dt>Proposed system of record</dt><dd>{selected.systemOfRecord}</dd></div></dl><h3>Object-specific key fields</h3><ul className="field-contract-list">{selected.keyFields.map((field) => <li key={field}><code>{field}</code><span>Type and physical API name require approval</span></li>)}</ul><h3>Lifecycle vocabulary</h3><div className="state-chip-row">{selected.states.map((state) => <span key={state}>{state}</span>)}</div></aside></div></div>;
}

function ClipboardIcon() { return <Boxes size={19} />; }

function SecurityWorkspace({ announce }: { announce: (message: string) => void }) {
  return <div className="security-workspace"><section className="platform-boundary panel"><ShieldAlert size={30} /><div><span className="eyebrow">Release gate</span><h2>Wireframe complete does not mean production ready.</h2><p>All six controls below require accountable approval and executable evidence before any real candidate or employee data may enter the platform.</p></div><Pill tone="danger">Production blocked</Pill></section><section className="security-gate-grid">{platformRisks.map((risk) => <article className="panel" key={risk.id}><div><ShieldAlert size={21} /><Pill tone="danger">{risk.state}</Pill></div><small>{risk.id} · {risk.owner}</small><h2>{risk.control}</h2><p>{risk.gate}</p><button className="secondary-button" onClick={() => announce(`${risk.id} evidence checklist opened. No control was marked complete.`)}>Open evidence checklist</button></article>)}</section><section className="panel security-coverage-matrix"><div className="panel-heading"><div><h2>Required assurance evidence</h2><span>Evidence must come from the deployed non-production or production stack</span></div></div><div>{[["Prevent", "Threat model · secure design · SAST/DAST · dependency and secret scanning"], ["Protect", "MFA · authorization tests · encryption · key rotation · provider allowlists"], ["Detect", "Business and security events · SLOs · alerts · anomaly and access monitoring"], ["Respond", "Incident roles · containment · notification · forensic and legal-hold workflows"], ["Recover", "Backup verification · restore exercise · reconciliation · cutover and rollback"], ["Assure", "Accessibility · privacy/legal · penetration test · pilot and executive risk acceptance"]].map(([stage, evidence], index) => <article key={stage}><span>{index + 1}</span><strong>{stage}</strong><p>{evidence}</p></article>)}</div></section></div>;
}

export function PlatformControlWorkspace({ announce }: { announce: (message: string) => void }) {
  const location = useLocation();
  let view: React.ReactNode;
  if (location.pathname.endsWith("/identity")) view = <IdentityWorkspace announce={announce} />;
  else if (location.pathname.endsWith("/integrations")) view = <IntegrationWorkspace announce={announce} />;
  else if (location.pathname.endsWith("/data")) view = <DataWorkspace />;
  else if (location.pathname.endsWith("/security")) view = <SecurityWorkspace announce={announce} />;
  else view = <ControlCenter />;
  return <><PlatformTabs />{view}<section className="simulation-footer"><ShieldCheck size={15} /><span>Connection health, credentials, stores and controls are synthetic design contracts. No production infrastructure exists in this repository.</span></section></>;
}
