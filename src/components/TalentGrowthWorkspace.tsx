import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarRange,
  CheckCircle2,
  Filter,
  Globe2,
  Mail,
  Search,
  Send,
  Sparkles,
  Target,
  UserSearch,
  UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  internalOpportunities,
  jobDistributions,
  prospects,
  talentCampaigns,
  talentCommunities,
  talentSummary,
  type Prospect,
} from "../data/talentGrowth";
import { usePrototype } from "../prototype/PrototypeContext";
import { Pill } from "./Common";

const tabs = [
  ["/hr/talent", "Overview"],
  ["/hr/talent/crm", "Talent CRM"],
  ["/hr/talent/campaigns", "Campaigns"],
  ["/hr/talent/distribution", "Job distribution"],
  ["/hr/talent/mobility", "Internal mobility"],
] as const;

function TalentTabs({ role }: { role: string }) {
  const allowed = role === "Hiring Manager"
    ? tabs.filter(([to]) => to === "/hr/talent" || to.endsWith("/distribution") || to.endsWith("/mobility"))
    : role === "Configuration Admin"
      ? tabs.filter(([to]) => !to.endsWith("/crm"))
      : tabs;
  return <nav className="workspace-subnav" aria-label="Talent growth workspace views">{allowed.map(([to, label]) => <NavLink end={to === "/hr/talent"} to={to} key={to}>{label}</NavLink>)}</nav>;
}

function Overview() {
  return <div className="talent-overview"><section className="talent-hero panel"><div><span className="eyebrow">Relationship before requisition</span><h2>Build durable talent relationships without uncontrolled outreach.</h2><p>Prospects, communities, campaigns, distributions and internal opportunities retain purpose, authority, owner and outcome evidence.</p></div><NavLink className="primary-button" to="/hr/talent/crm">Open talent CRM <ArrowRight size={15} /></NavLink></section>
    <section className="onboarding-metrics"><article><UserSearch size={19} /><span><strong>{talentSummary.prospects}</strong>Seeded prospects</span><Pill tone="success">{talentSummary.contactable} contactable</Pill></article><article><Mail size={19} /><span><strong>{talentSummary.activeCampaigns}</strong>Active campaigns</span><Pill tone="info">Purpose scoped</Pill></article><article><Globe2 size={19} /><span><strong>{talentSummary.failedDistributions}</strong>Channel failures</span><Pill tone="danger">Reconcile</Pill></article><article><Sparkles size={19} /><span><strong>{talentSummary.internalApplicants}</strong>Internal applicants</span><Pill tone="info">{talentSummary.internalOpportunities} opportunities</Pill></article></section>
    <div className="analytics-grid-three"><section className="panel"><div className="panel-heading"><div><h2>Talent communities</h2><span>Owned audiences with bounded purpose</span></div></div><div className="community-list">{talentCommunities.slice(0, 5).map((community) => <NavLink to="/hr/talent/crm" key={community.id}><span><strong>{community.name}</strong><small>{community.purpose}</small></span><span><strong>{community.members}</strong><small>{community.active90Days} active</small></span></NavLink>)}</div></section><section className="panel"><div className="panel-heading"><div><h2>Campaign outcomes</h2><span>Delivery and conversion by campaign membership</span></div></div><div className="campaign-mini-list">{talentCampaigns.slice(0, 5).map((campaign) => <NavLink to="/hr/talent/campaigns" key={campaign.id}><span><strong>{campaign.name}</strong><small>{campaign.members} members · {campaign.channel}</small></span><Pill tone={campaign.status === "Running" ? "success" : campaign.status === "Scheduled" ? "info" : "neutral"}>{campaign.status}</Pill></NavLink>)}</div></section><section className="panel"><div className="panel-heading"><div><h2>Internal opportunity mix</h2><span>Roles, gigs, projects and mentorship</span></div></div><div className="bar-list compact">{["Role", "Gig", "Project", "Mentorship"].map((type) => { const count = internalOpportunities.filter((row) => row.type === type).length; return <div key={type}><span>{type}</span><div><i style={{ width: `${count * 38}%` }} /></div><strong>{count}</strong></div>; })}</div></section></div>
  </div>;
}

function toneForRelationship(value: Prospect["relationship"]) {
  return value === "Warm" ? "success" : value === "Engaged" ? "info" : value === "Do not contact" ? "danger" : "neutral";
}

function CrmWorkspace({ announce }: { announce: (message: string) => void }) {
  const { persona } = usePrototype();
  const [query, setQuery] = useState("");
  const [community, setCommunity] = useState("All");
  const [selectedId, setSelectedId] = useState(prospects[0].id);
  const visible = useMemo(() => prospects.filter((prospect) => `${prospect.name} ${prospect.headline} ${prospect.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase()) && (community === "All" || prospect.community === community)), [community, query]);
  const selected = prospects.find((prospect) => prospect.id === selectedId) ?? prospects[0];
  const contactBlocked = selected.consent === "Suppressed" || selected.consent === "Expired" || selected.consent === "Event only";
  const fullIdentity = persona.role === "Recruiter" || persona.role === "Recruiting Coordinator";
  const canAct = fullIdentity;
  const displayName = (prospect: Prospect) => fullIdentity ? prospect.name : `Prospect ${prospect.id}`;
  return <div className="crm-layout"><section className="panel crm-list"><div className="table-toolbar"><label><Search size={15} /><input placeholder="Search name, skill or headline..." value={query} onChange={(event) => setQuery(event.target.value)} /></label><label><Filter size={15} /><select value={community} onChange={(event) => setCommunity(event.target.value)}><option>All</option>{talentCommunities.map((row) => <option key={row.id}>{row.name}</option>)}</select></label><Pill tone="info">{visible.length}</Pill></div><div className="prospect-list">{visible.slice(0, 40).map((prospect) => <button className={selected.id === prospect.id ? "selected" : ""} onClick={() => setSelectedId(prospect.id)} key={prospect.id}><span className="candidate-avatar small">{fullIdentity ? prospect.initials : "ID"}</span><span><strong>{displayName(prospect)}</strong><small>{prospect.headline} · {fullIdentity ? prospect.location : "Location minimized"}</small><em>{prospect.skills.join(" · ")}</em></span><Pill tone={toneForRelationship(prospect.relationship)}>{prospect.relationship}</Pill></button>)}</div></section><aside className="panel prospect-detail"><div className="prospect-detail-head"><span className="candidate-avatar large">{fullIdentity ? selected.initials : "ID"}</span><div><small>{selected.id}</small><h2>{displayName(selected)}</h2><p>{selected.headline}</p></div></div><dl className="fact-list dense"><div><dt>Relationship</dt><dd>{selected.relationship}</dd></div><div><dt>Contact authority</dt><dd>{selected.consent}</dd></div><div><dt>Community</dt><dd>{selected.community}</dd></div><div><dt>Source</dt><dd>{selected.source}</dd></div><div><dt>Owner</dt><dd>{selected.owner}</dd></div><div><dt>Last touch</dt><dd>{selected.lastTouch}</dd></div></dl><div className={contactBlocked ? "contact-guard blocked" : "contact-guard"}>{contactBlocked ? <><Target size={20} /><span><strong>Outreach blocked</strong>This authority permits no general recruiting message.</span></> : <><CheckCircle2 size={20} /><span><strong>Purpose check passed</strong>Recruiting opportunity outreach is permitted.</span></>}</div><button disabled={contactBlocked || !canAct} className="primary-button" onClick={() => announce(`Message preview opened for ${selected.id}. No communication was sent.`)}><Send size={15} /> Draft outreach</button><button disabled={!canAct} className="secondary-button" onClick={() => announce(`Relationship note added to ${selected.id} in browser memory.`)}>Add relationship note</button></aside></div>;
}

function CampaignWorkspace({ announce }: { announce: (message: string) => void }) {
  const [selectedId, setSelectedId] = useState(talentCampaigns[0].id);
  const selected = talentCampaigns.find((campaign) => campaign.id === selectedId) ?? talentCampaigns[0];
  const engagement = selected.delivered ? Math.round((selected.engaged / selected.delivered) * 100) : null;
  const conversion = selected.engaged ? Math.round((selected.converted / selected.engaged) * 100) : null;
  return <div className="campaign-workspace"><section className="panel campaign-cards"><div className="panel-heading"><div><h2>Governed campaigns</h2><span>Eligibility snapshot, suppression and delivery evidence</span></div><button className="primary-button" onClick={() => announce("New campaign form opened in preview with audience and purpose gates.")}>New campaign</button></div>{talentCampaigns.map((campaign) => <button key={campaign.id} className={campaign.id === selected.id ? "selected" : ""} onClick={() => setSelectedId(campaign.id)}><span className="campaign-icon"><Mail size={19} /></span><span><strong>{campaign.name}</strong><small>{campaign.id} · {campaign.audience}</small></span><Pill tone={campaign.status === "Running" ? "success" : campaign.status === "Draft" ? "neutral" : "info"}>{campaign.status}</Pill></button>)}</section><section className="panel campaign-detail"><div className="panel-heading"><div><span className="eyebrow">{selected.id} · {selected.channel}</span><h2>{selected.name}</h2><span>{selected.owner} · {selected.purpose}</span></div><button className="secondary-button" onClick={() => announce(`Audience simulation ran for ${selected.id}; no membership changed.`)}>Simulate audience</button></div><section className="campaign-funnel"><article><strong>{selected.members}</strong><span>Eligible members</span></article><ArrowRight size={18} /><article><strong>{selected.delivered}</strong><span>Delivered</span></article><ArrowRight size={18} /><article><strong>{selected.engaged}</strong><span>Engaged</span></article><ArrowRight size={18} /><article><strong>{selected.converted}</strong><span>Applications</span></article></section><div className="detail-two-column"><div className="metric-detail"><span>Engagement</span><strong>{engagement === null ? "N/A" : `${engagement}%`}</strong><small>Engaged ÷ successfully delivered</small></div><div className="metric-detail"><span>Engaged-to-application</span><strong>{conversion === null ? "N/A" : `${conversion}%`}</strong><small>Applications ÷ engaged members</small></div></div><section className="campaign-guardrails"><h3>Execution guardrails</h3><ul><li>Re-check consent and suppression immediately before each send.</li><li>Quiet hours use the prospect timezone when known.</li><li>Paused and cancelled campaigns invalidate unsent effects.</li><li>Every provider callback reconciles to one campaign membership.</li></ul></section></section></div>;
}

function DistributionWorkspace({ announce }: { announce: (message: string) => void }) {
  const [status, setStatus] = useState("All");
  const rows = jobDistributions.filter((row) => status === "All" || row.status === status);
  return <section className="panel lifecycle-table-panel"><div className="panel-heading"><div><h2>Job distribution ledger</h2><span>One posting version × channel delivery with reconciliation evidence</span></div><button className="secondary-button" onClick={() => announce("Channel reconciliation preview completed; two failed synthetic postings need replay.")}><Globe2 size={15} /> Reconcile all</button></div><div className="table-toolbar"><label><Filter size={15} /><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option><option>Published</option><option>Pending</option><option>Failed</option><option>Expired</option></select></label><Pill tone="info">{rows.length} deliveries</Pill></div><div className="distribution-table" role="table"><div role="row"><span>Job and channel</span><span>Status</span><span>Applications</span><span>Quality</span><span>Spend</span><span>Reconciled</span></div>{rows.map((row) => <div role="row" key={row.id}><span><strong>{row.job}</strong><small>{row.channel} · {row.id} · {row.externalId}</small></span><span><Pill tone={row.status === "Published" ? "success" : row.status === "Failed" ? "danger" : row.status === "Pending" ? "warning" : "neutral"}>{row.status}</Pill></span><span><strong>{row.applications}</strong></span><span><strong>{row.qualified}</strong><small>qualified</small></span><span>{row.spend}</span><span>{row.lastReconciled}{row.status === "Failed" && <button className="text-button" onClick={() => announce(`${row.id} replay planned with the existing idempotency key.`)}>Plan replay</button>}</span></div>)}</div></section>;
}

function MobilityWorkspace({ announce }: { announce: (message: string) => void }) {
  const [type, setType] = useState("All");
  const visible = internalOpportunities.filter((opportunity) => type === "All" || opportunity.type === type);
  return <div className="mobility-workspace"><section className="mobility-hero panel"><div><span className="eyebrow">Employee opportunity marketplace</span><h2>Make mobility discoverable without surprising employees.</h2><p>Eligibility, profile visibility and manager-notification milestones are explicit for every role, gig, project and mentorship.</p></div><button className="primary-button" onClick={() => announce("New internal opportunity form opened in preview with visibility and mobility-policy gates.")}>Create opportunity</button></section><div className="table-toolbar"><label><Filter size={15} /><select value={type} onChange={(event) => setType(event.target.value)}><option>All</option><option>Role</option><option>Gig</option><option>Project</option><option>Mentorship</option></select></label><Pill tone="info">{visible.length} opportunities</Pill></div><section className="opportunity-grid">{visible.map((opportunity) => <article key={opportunity.id}><header><span className="opportunity-icon">{opportunity.type === "Role" ? <BriefcaseBusiness size={20} /> : <CalendarRange size={20} />}</span><Pill tone="info">{opportunity.type}</Pill></header><small>{opportunity.id} · {opportunity.department}</small><h2>{opportunity.title}</h2><p>{opportunity.location} · closes {opportunity.closes}</p><div className="skill-row">{opportunity.skills.map((skill) => <span key={skill}>{skill}</span>)}</div><dl><div><dt>Manager</dt><dd>{opportunity.manager}</dd></div><div><dt>Visibility</dt><dd>{opportunity.visibility}</dd></div><div><dt>Applicants</dt><dd>{opportunity.applicants}</dd></div></dl><div className="mobility-policy">{opportunity.mobilityPolicy}</div><button className="secondary-button" onClick={() => announce(`${opportunity.id} preview opened; no employee profile or application was exposed.`)}>Preview employee view</button></article>)}</section></div>;
}

export function TalentGrowthWorkspace({ announce }: { announce: (message: string) => void }) {
  const location = useLocation();
  const { persona } = usePrototype();
  const routePermission =
    location.pathname.endsWith("/crm")
      ? ["Recruiter", "Recruiting Coordinator", "Privacy & Legal", "Auditor"].includes(persona.role)
      : location.pathname.endsWith("/campaigns")
        ? ["Recruiter", "Recruiting Coordinator", "Configuration Admin", "Privacy & Legal", "Auditor"].includes(persona.role)
        : true;
  let view: React.ReactNode;
  if (!routePermission) view = <section className="panel access-denied"><Target size={28} /><div><h2>Talent data is outside this role's scope</h2><p>{persona.role} may use the allowed talent views in the navigation without receiving prospect identities or campaign membership.</p></div><NavLink className="primary-button" to="/hr/talent">Return to talent overview</NavLink></section>;
  else if (location.pathname.endsWith("/crm")) view = <CrmWorkspace announce={announce} />;
  else if (location.pathname.endsWith("/campaigns")) view = <CampaignWorkspace announce={announce} />;
  else if (location.pathname.endsWith("/distribution")) view = <DistributionWorkspace announce={announce} />;
  else if (location.pathname.endsWith("/mobility")) view = <MobilityWorkspace announce={announce} />;
  else view = <Overview />;
  return <><TalentTabs role={persona.role} />{view}<section className="simulation-footer"><UsersRound size={15} /><span>All prospects, memberships, campaign events, distribution records and employee profiles are fictional and browser-local.</span></section></>;
}
