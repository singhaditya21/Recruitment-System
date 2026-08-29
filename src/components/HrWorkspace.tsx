import { useMemo, useState, type FormEvent } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
  Activity,
  AlertOctagon,
  AppWindow,
  ArrowRight,
  BarChart3,
  Bell,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleHelp,
  ClipboardCheck,
  Database,
  FileBarChart2,
  FileCheck2,
  FileText,
  Filter,
  Gauge,
  Grid3X3,
  Hand,
  History,
  Inbox,
  LayoutDashboard,
  Link2,
  ListChecks,
  LockKeyhole,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  PanelBottom,
  PauseCircle,
  Pencil,
  PlayCircle,
  Plus,
  RefreshCcw,
  Scale,
  Search,
  Send,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UsersRound,
  UserRoundCheck,
  Workflow,
  X,
  XCircle,
} from "lucide-react";
import {
  actionItems,
  applicationActivity,
  applicationDocuments,
  applicationMessages,
  applicationRecords,
  applicationTasks,
  auditEvents,
  automationRuleDetails,
  automationRuns,
  demoPersonas,
  offerApprovalSteps,
  personaOperatingModels,
  pipeline,
  privacyRequests,
  relatedApplications,
  scorecard,
  syntheticCandidate,
  type HrScreenKey,
} from "../data/fixtures";
import {
  ExplainPanel,
  Freshness,
  IntegrityNotice,
  Metric,
  Pill,
  PrototypeBanner,
  ScenarioControl,
  ScreenId,
} from "./Common";
import { usePrototype } from "../prototype/PrototypeContext";
import { useWireframe } from "../prototype/WireframeContext";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { ObjectDataStudio } from "./ObjectDataStudio";
import { ObjectWorkspace } from "./ObjectWorkspace";
import { ReportWorkspace } from "./ReportWorkspace";
import { OnboardingOperations } from "./OnboardingWorkspace";
import { TalentGrowthWorkspace } from "./TalentGrowthWorkspace";
import { PlatformControlWorkspace } from "./PlatformControlWorkspace";
import { RecruitmentDepthWorkspace } from "./RecruitmentDepthWorkspace";
import {
  displayCandidateForRole,
  roleDataScopes,
  canManageCoreRecord,
  visibleApplications,
  visibleAssignments,
  visibleCandidates,
  visibleInterviews,
  visibleJobs,
} from "../data/access";

type HrScreen = HrScreenKey;

const hrNav = [
  {
    to: "/hr/action-center",
    label: "Action center",
    screen: "actions" as const,
    icon: LayoutDashboard,
  },
  {
    to: "/hr/analytics",
    label: "Analytics",
    screen: "analytics" as const,
    icon: BarChart3,
  },
  {
    to: "/hr/reports",
    label: "Reports",
    screen: "reports" as const,
    icon: FileBarChart2,
  },
  {
    to: "/hr/objects",
    label: "Objects",
    screen: "objects" as const,
    icon: Database,
  },
  {
    to: "/hr/jobs",
    label: "Jobs",
    screen: "job" as const,
    icon: BriefcaseBusiness,
  },
  {
    to: "/hr/candidates",
    label: "Candidates",
    screen: "candidate" as const,
    icon: UsersRound,
  },
  {
    to: "/hr/applications",
    label: "Applications",
    screen: "application" as const,
    icon: UsersRound,
  },
  {
    to: "/hr/interviews",
    label: "Interviews",
    screen: "interview" as const,
    icon: CalendarDays,
  },
  {
    to: "/hr/assignments",
    label: "Scorecards",
    screen: "scorecard" as const,
    icon: ClipboardCheck,
  },
  {
    to: "/hr/decisions",
    label: "Offers & handoff",
    screen: "decision" as const,
    icon: FileCheck2,
  },
  {
    to: "/hr/onboarding",
    label: "Onboarding",
    screen: "onboarding" as const,
    icon: UserRoundCheck,
  },
  {
    to: "/hr/talent",
    label: "Talent growth",
    screen: "talent" as const,
    icon: UsersRound,
  },
  {
    to: "/hr/cases",
    label: "Assessment & checks",
    screen: "cases" as const,
    icon: ShieldAlert,
  },
  {
    to: "/hr/high-volume",
    label: "High-volume",
    screen: "high-volume" as const,
    icon: Workflow,
  },
  {
    to: "/hr/automations",
    label: "Automation ops",
    screen: "automations" as const,
    icon: Bot,
  },
  {
    to: "/hr/governance",
    label: "Governance",
    screen: "governance" as const,
    icon: ShieldCheck,
  },
  {
    to: "/hr/platform",
    label: "Platform controls",
    screen: "platform" as const,
    icon: Settings2,
  },
] as const;

const actionTargets: Record<string, string> = {
  "WORK-101": "/hr/applications/APP-DEMO-001",
  "WORK-102": "/hr/interviews/INT-DEMO-004",
  "WORK-103": "/hr/applications/APP-DEMO-009",
  "WORK-104": "/hr/decisions/APP-DEMO-011",
  "WORK-105": "/hr/decisions/APP-DEMO-001",
};

const actionApplicationIds: Record<string, string> = {
  "WORK-101": "APP-DEMO-001",
  "WORK-102": "APP-DEMO-004",
  "WORK-103": "APP-DEMO-009",
  "WORK-104": "APP-DEMO-011",
  "WORK-105": "APP-DEMO-001",
};

function workSubjectForRole(role: string, item: (typeof actionItems)[number]) {
  const application = applicationRecords.find(
    (record) => record.id === actionApplicationIds[item.id],
  );
  if (!application || !item.subject.includes(" · ")) return item.subject;
  const context = item.subject.split(" · ").slice(1).join(" · ");
  return `${displayCandidateForRole(role, application)} · ${context}`;
}

export function HrShell({
  title,
  eyebrow,
  screenId,
  screen,
  children,
  actions,
}: {
  title: string;
  eyebrow: string;
  screenId: string;
  screen: HrScreen;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [topPanel, setTopPanel] = useState<string | null>(null);
  const {
    personaId,
    persona,
    setPersonaId,
    notice,
    announce,
    clearNotice,
    jobRecords,
    applicationRecords: liveApplications,
    interviewRecords: liveInterviews,
  } = usePrototype();
  const operatingModel = personaOperatingModels[persona.id];
  const allowed = operatingModel.screens.includes(screen);
  const resolvedTitle = title.startsWith("Good morning")
    ? `Good morning, ${persona.name.split(" ")[0]}`
    : title;
  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const needle = query.toLowerCase();
    return [
      ...visibleApplications(persona.role, liveApplications).map((row) => ({
        label: displayCandidateForRole(persona.role, row),
        detail: `${row.job} · ${row.id}`,
        to: `/hr/applications/${row.id}`,
      })),
      ...visibleJobs(persona.role, jobRecords, liveApplications).map((row) => ({
        label: `${row.title} · ${row.id}`,
        detail: row.team,
        to: `/hr/jobs/${row.id}`,
      })),
      ...visibleInterviews(persona.role, liveInterviews, liveApplications).map((row) => ({
        label: displayCandidateForRole(persona.role, row),
        detail: `${row.type} · ${row.id}`,
        to: `/hr/interviews/${row.id}`,
      })),
    ]
      .filter((row) =>
        `${row.label} ${row.detail}`.toLowerCase().includes(needle),
      )
      .slice(0, 6);
  }, [jobRecords, liveApplications, liveInterviews, persona.role, query]);
  const toggle = (panel: string) =>
    setTopPanel((current) => (current === panel ? null : panel));
  return (
    <div className="hr-app lightning-replica">
      <PrototypeBanner />
      <header className="lightning-global-header">
        <button
          className="launcher-button"
          aria-label="Open app launcher"
          aria-expanded={topPanel === "launcher"}
          onClick={() => toggle("launcher")}
        >
          <Grid3X3 size={21} />
        </button>
        <NavLink
          to="/hr/action-center"
          className="lightning-cloud"
          aria-label="Recruitment home"
        >
          <span>R</span>
        </NavLink>
        <div className="global-search-wrap">
          <label className="global-search">
            <Search size={16} />
            <span className="sr-only">
              Search synthetic recruitment workspace
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search synthetic records..."
            />
          </label>
          {results.length > 0 && (
            <div
              className="search-results"
              role="listbox"
              aria-label="Synthetic record search results"
            >
              {results.map((result) => (
                <NavLink
                  role="option"
                  to={result.to}
                  key={result.to}
                  onClick={() => setQuery("")}
                >
                  <strong>{result.label}</strong>
                  <span>{result.detail}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>
        <div className="topbar-actions">
          <span className="fixture-status">
            <i /> Synthetic data ready
          </span>
          <button
            className="lightning-icon-button"
            aria-label="Help"
            aria-expanded={topPanel === "help"}
            onClick={() => toggle("help")}
          >
            <CircleHelp size={19} />
          </button>
          <button
            className="lightning-icon-button"
            aria-label="Setup"
            aria-expanded={topPanel === "setup"}
            onClick={() => toggle("setup")}
          >
            <Settings2 size={19} />
          </button>
          <button
            className="lightning-icon-button"
            aria-label="Notifications"
            aria-expanded={topPanel === "notifications"}
            onClick={() => toggle("notifications")}
          >
            <Bell size={19} />
            <span className="notification-count">3</span>
          </button>
          <div
            className="persona-avatar"
            title={`${persona.name} · ${persona.role}`}
          >
            {persona.initials}
          </div>
        </div>
        {topPanel && (
          <div
            className="top-popover"
            role="dialog"
            aria-label={`${topPanel} preview`}
          >
            <button
              className="modal-close"
              aria-label={`Close ${topPanel} preview`}
              onClick={() => setTopPanel(null)}
            >
              <X size={18} />
            </button>
            {topPanel === "launcher" ? (
              <>
                <strong>Talent lifecycle applications</strong>
                <NavLink to="/demo">Demo Journey Studio</NavLink>
                <NavLink to="/hr/action-center">
                  Talent Operations Console
                </NavLink>
                <NavLink to="/careers">Candidate site</NavLink>
                <NavLink to="/preboarding">New-hire portal</NavLink>
                <NavLink to="/manager">Manager portal</NavLink>
                <NavLink to="/it">IT fulfilment portal</NavLink>
                <NavLink to="/facilities">Facilities portal</NavLink>
                <NavLink to="/agency">Agency portal</NavLink>
                <NavLink to="/interviewer">Interviewer portal</NavLink>
                <NavLink to="/referrer">Referral portal</NavLink>
                <NavLink to="/buddy">Buddy portal</NavLink>
                <NavLink to="/mobility">Internal mobility</NavLink>
                <NavLink to="/admin">Administration</NavLink>
              </>
            ) : topPanel === "help" ? (
              <>
                <strong>Wireframe help</strong>
                <p>
                  Use scenario and persona controls to inspect coherent
                  synthetic operating states.
                </p>
              </>
            ) : topPanel === "setup" ? (
              <>
                <strong>Setup is preview-only</strong>
                <p>Configuration changes are memory-only on public GitHub Pages.</p>
                <NavLink to="/admin">Open administration wireframes</NavLink>
              </>
            ) : (
              <>
                <strong>3 owned demo alerts</strong>
                <p>Scorecard overdue · candidate waiting · integration review.</p>
                <NavLink to="/admin/notifications">Open notification center</NavLink>
              </>
            )}
          </div>
        )}
      </header>
      <section
        className="lightning-app-bar"
        aria-label="Recruitment application navigation"
      >
        <button
          className="mobile-menu"
          aria-label="Toggle navigation"
          aria-expanded={mobileMenu}
          onClick={() => setMobileMenu((open) => !open)}
        >
          <Menu size={20} />
        </button>
        <div className="app-identity">
          <span className="object-icon object-icon-recruitment">
            <AppWindow size={20} />
          </span>
          <div>
            <strong>Talent Lifecycle</strong>
            <small>Recruitment &amp; Onboarding Console</small>
          </div>
        </div>
        <nav
          className={`lightning-tabs ${mobileMenu ? "open" : ""}`}
          aria-label="Primary HR workspace"
        >
          {hrNav
            .filter((item) => operatingModel.screens.includes(item.screen))
            .map(({ to, label, icon: Icon }) => (
              <NavLink to={to} key={to} onClick={() => setMobileMenu(false)}>
                <Icon size={14} />
                {label}
              </NavLink>
            ))}
        </nav>
        <label className="persona-switcher">
          <span>View as</span>
          <select
            value={personaId}
            onChange={(event) => setPersonaId(event.target.value)}
            aria-label="View as demo persona"
          >
            {demoPersonas.map((item) => (
              <option value={item.id} key={item.id}>
                {item.name} · {item.role}
              </option>
            ))}
          </select>
        </label>
      </section>
      <div className="hr-shell">
        <main className="hr-main" id="main-content">
          <div className="lightning-breadcrumbs">
            <NavLink to="/hr/action-center">Talent Lifecycle</NavLink>
            <span>/</span>
            <span>{eyebrow}</span>
            <span className="wireframe-disclaimer">
              Synthetic wireframe · not a Salesforce org
            </span>
          </div>
          <div className="hr-page-heading">
            <div className="record-heading-main">
              <span className="object-icon">
                <AppWindow size={22} />
              </span>
              <div>
                <div className="heading-meta">
                  <span className="eyebrow">{eyebrow}</span>
                  <ScreenId>{screenId}</ScreenId>
                </div>
                <h1>{resolvedTitle}</h1>
                <span className="record-subtitle">
                  {persona.role} · {persona.access} · {persona.id}
                </span>
              </div>
            </div>
            {allowed && actions && (
              <div className="page-actions">{actions}</div>
            )}
          </div>
          {!allowed ? (
            <section className="panel access-denied" role="alert">
              <ShieldAlert size={28} />
              <div>
                <h2>Access denied safely</h2>
                <p>
                  {persona.role} does not have this workspace in the
                  least-privilege simulation.
                </p>
                <p>Current scope: {operatingModel.focus}.</p>
              </div>
              <NavLink className="primary-button" to="/hr/action-center">
                Return to allowed work
              </NavLink>
            </section>
          ) : (
            children
          )}
        </main>
        <footer
          className="lightning-utility-bar"
          aria-label="Workspace utilities"
        >
          <button
            onClick={() =>
              announce("Notes opened as a read-only fixture preview.")
            }
          >
            <PanelBottom size={15} /> Notes <span>2</span>
          </button>
          <button
            onClick={() =>
              announce("History is represented by the synthetic audit ledger.")
            }
          >
            <History size={15} /> History
          </button>
          <button
            onClick={() =>
              announce("Candidate Support preview opened. No message was sent.")
            }
          >
            <MessageSquareText size={15} /> Candidate Support <span>1</span>
          </button>
          <NavLink to="/hr/automations">
            <Activity size={15} /> Integration Health <i />
          </NavLink>
          <NavLink to="/careers">
            <Sparkles size={15} /> Candidate Site
          </NavLink>
        </footer>
      </div>
      {notice && (
        <div className="workspace-toast" role="status">
          <CheckCircle2 size={18} />
          <span>{notice}</span>
          <button aria-label="Dismiss notification" onClick={clearNotice}>
            <X size={17} />
          </button>
        </div>
      )}
    </div>
  );
}

function ActionCenter() {
  const [filter, setFilter] = useState("Needs me");
  const [selectedId, setSelectedId] = useState<string>(actionItems[0].id);
  const [compact, setCompact] = useState(false);
  const [savedView, setSavedView] = useState("My urgent work");
  const navigate = useNavigate();
  const {
    scenario,
    scenarioState,
    persona,
    resetPrototype,
    applicationRecords: liveApplications,
    interviewRecords: liveInterviews,
  } = usePrototype();
  const roleApplications = visibleApplications(persona.role, liveApplications);
  const roleInterviews = visibleInterviews(
    persona.role,
    liveInterviews,
    liveApplications,
  );
  const byRole: Record<string, string[]> = {
    Recruiter: ["WORK-101", "WORK-102", "WORK-103", "WORK-104", "WORK-105"],
    "Recruiting Coordinator": ["WORK-102", "WORK-103"],
    "Hiring Manager": ["WORK-101", "WORK-104"],
    Interviewer: ["WORK-101"],
    "Offer Approver": ["WORK-104"],
    "Candidate Support": ["WORK-102", "WORK-103"],
    "HRIS Operator": ["WORK-105"],
  };
  let roleItems = actionItems.filter((item) =>
    (byRole[persona.role] ?? actionItems.map((row) => row.id)).includes(
      item.id,
    ),
  );
  if (scenarioState.missingScorecards === 0)
    roleItems = roleItems.filter((item) => item.id !== "WORK-101");
  if (scenarioState.handoffState !== "Reconciliation failed")
    roleItems = roleItems.filter((item) => item.id !== "WORK-105");
  if (savedView === "Scheduling and communication")
    roleItems = roleItems.filter((item) =>
      ["WORK-102", "WORK-103"].includes(item.id),
    );
  if (savedView === "Approvals and handoff")
    roleItems = roleItems.filter((item) =>
      ["WORK-104", "WORK-105"].includes(item.id),
    );
  if (savedView === "SLA breaches")
    roleItems = roleItems.filter((item) => item.tone === "danger");
  if (filter === "Needs me")
    roleItems = roleItems.slice(
      0,
      Math.max(1, Math.ceil(roleItems.length / 2)),
    );
  const selected =
    roleItems.find((item) => item.id === selectedId) ??
    roleItems[0] ??
    actionItems[0];
  return (
    <HrShell
      title="Good morning, Alex"
      eyebrow="Action center"
      screenId="UI-HR-001"
      screen="actions"
      actions={
        <>
          <button className="secondary-button" onClick={resetPrototype}>
            <RefreshCcw size={16} /> Reset fixtures
          </button>
          <button
            className="primary-button"
            onClick={() => navigate(actionTargets[selected.id])}
          >
            <Inbox size={16} /> Triage next
          </button>
        </>
      }
    >
      <div className="workspace-intro">
        <div>
          <p>
            Start with owned work, its governing fact and a recoverable next
            action.
          </p>
          <strong>
            {personaOperatingModels[persona.id].queue} ·{" "}
            {personaOperatingModels[persona.id].focus}
          </strong>
        </div>
        <label className="saved-view">
          <span>Saved operational view</span>
          <select
            value={savedView}
            onChange={(event) => setSavedView(event.target.value)}
          >
            <option>My urgent work</option>
            <option>Scheduling and communication</option>
            <option>Approvals and handoff</option>
            <option>SLA breaches</option>
          </select>
        </label>
        <Freshness>Action projection · reconciled 3 min ago</Freshness>
      </div>
      <ScenarioControl />
      <section className="metric-grid" aria-label="Action center summary">
        <Metric
          value={String(roleItems.length)}
          label="Visible actions"
          detail={`${roleItems.filter((item) => item.tone === "danger").length} urgent`}
          tone="danger"
        />
        <Metric
          value={persona.role === "Recruiting Coordinator" ? "2" : "1"}
          label="Candidates waiting"
          detail="Oldest 18 hours"
          tone="warning"
        />
        <Metric
          value={String(scenarioState.missingScorecards)}
          label="Missing evidence"
          detail={
            scenarioState.missingScorecards
              ? "Decision blocker"
              : "Evidence complete"
          }
          tone={scenarioState.missingScorecards ? "info" : "success"}
        />
        <Metric
          value={
            scenarioState.handoffState === "Reconciliation failed" ? "1" : "0"
          }
          label="Failed handoffs"
          detail="Owned by HRIS queue"
          tone={
            scenarioState.handoffState === "Reconciliation failed"
              ? "danger"
              : "success"
          }
        />
      </section>
      <div className="action-layout">
        <section className="panel work-panel" aria-labelledby="work-heading">
          <div className="panel-heading">
            <div>
              <h2 id="work-heading">Priority work</h2>
              <span>Role-scoped governed work items</span>
            </div>
            <div className="segmented-control" aria-label="Work filter">
              {["Needs me", "My queue", "All visible"].map((item) => (
                <button
                  className={filter === item ? "active" : ""}
                  onClick={() => setFilter(item)}
                  key={item}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="work-list">
            {roleItems.map((item) => (
              <button
                className={`work-row ${selected.id === item.id ? "selected" : ""}`}
                key={item.id}
                onClick={() => setSelectedId(item.id)}
              >
                <span className={`work-signal signal-${item.tone}`} />
                <span className="work-main">
                  <span>
                    <Pill tone={item.tone}>{item.label}</Pill>
                    <small>{item.age}</small>
                  </span>
                  <strong>{workSubjectForRole(persona.role, item)}</strong>
                  <small>{item.owner}</small>
                </span>
                <ArrowRight size={17} />
              </button>
            ))}
          </div>
        </section>
        <aside className="panel work-detail" aria-label="Selected work details">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Selected work</span>
              <h2>{selected.id}</h2>
            </div>
            <Pill tone={selected.tone}>{selected.label}</Pill>
          </div>
          <h3>{workSubjectForRole(persona.role, selected)}</h3>
          <ExplainPanel source={selected.source}>{selected.why}</ExplainPanel>
          <dl className="fact-list">
            <div>
              <dt>Scenario</dt>
              <dd>
                {scenario.id} · {scenario.label}
              </dd>
            </div>
            <div>
              <dt>Owner</dt>
              <dd>{selected.owner}</dd>
            </div>
            <div>
              <dt>Age / due</dt>
              <dd>{selected.age}</dd>
            </div>
            <div>
              <dt>Role scope</dt>
              <dd>{persona.role}</dd>
            </div>
          </dl>
          <button
            className="primary-button full-button"
            onClick={() => navigate(actionTargets[selected.id])}
          >
            Open authoritative record <ArrowRight size={16} />
          </button>
        </aside>
      </div>
      <section className="panel pipeline-panel">
        <div className="panel-heading">
          <div>
            <h2>Pipeline pulse</h2>
            <span>
              {displayCandidateForRole(persona.role, applicationRecords[0])} is
              currently in {scenarioState.applicationStage}
            </span>
          </div>
          <Freshness>Application facts · 4 min ago</Freshness>
        </div>
        <div className="pipeline-bars">
          {pipeline.map((item, index) => (
            <div key={item.stage}>
              <div className="pipeline-label">
                <span>{item.stage}</span>
                <strong>
                  {item.stage === "Interview" &&
                  scenarioState.applicationStage !== "Interviews"
                    ? item.count - 1
                    : item.count}
                </strong>
                <small>{item.change}</small>
              </div>
              <div className="bar-track">
                <span style={{ width: `${100 - index * 15}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="home-record-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Recently updated applications</h2>
              <span>
                Role-scoped list view · {roleApplications.length} records
              </span>
            </div>
            <button
              className="text-button"
              aria-pressed={compact}
              onClick={() => setCompact((value) => !value)}
            >
              <Filter size={15} /> {compact ? "Show details" : "Compact list"}
            </button>
          </div>
          <div
            className={`lightning-data-table ${compact ? "compact-table" : ""}`}
            role="table"
            aria-label="Recently updated applications"
          >
            <div className="table-row table-head" role="row">
              <span role="columnheader">Application</span>
              <span role="columnheader">Candidate</span>
              <span role="columnheader">Job</span>
              <span role="columnheader">Stage</span>
              <span role="columnheader">Owner</span>
              <span role="columnheader">Updated</span>
            </div>
            {roleApplications.slice(0, 20).map((item) => (
              <div className="table-row" role="row" key={item.id}>
                <span role="cell" data-label="Application">
                  <NavLink to={`/hr/applications/${item.id}`}>
                    {item.id}
                  </NavLink>
                </span>
                <strong role="cell" data-label="Candidate">
                  {displayCandidateForRole(persona.role, item)}
                </strong>
                <span role="cell" data-label="Job">
                  {item.job}
                </span>
                <span role="cell" data-label="Stage">
                  <Pill tone={item.tone}>
                    {item.id === "APP-DEMO-001"
                      ? scenarioState.applicationStage
                      : item.stage}
                  </Pill>
                </span>
                <span role="cell" data-label="Owner">
                  {item.owner}
                </span>
                <span role="cell" data-label="Updated">
                  {item.updated}
                </span>
              </div>
            ))}
          </div>
        </section>
        <section className="panel today-panel">
          <div className="panel-heading">
            <div>
              <h2>Today's interviews</h2>
              <span>
                {roleInterviews.length} role-visible · candidate-timezone
                aware
              </span>
            </div>
            <CalendarDays size={18} />
          </div>
          {roleInterviews.slice(0, 12).map((item) => {
            const state =
              item.id === "INT-DEMO-001"
                ? scenarioState.interviewState
                : item.state;
            return (
              <div className="session-row" key={item.id}>
                <strong>{item.time.split(" · ").at(-1)}</strong>
                <div>
                  <NavLink to={`/hr/interviews/${item.id}`}>
                    {displayCandidateForRole(persona.role, item)}
                  </NavLink>
                  <small>
                    {item.type} · {item.interviewer}
                  </small>
                </div>
                <Pill
                  tone={
                    state === "Conflict"
                      ? "danger"
                      : state === "Complete"
                        ? "success"
                        : item.tone
                  }
                >
                  {state}
                </Pill>
              </div>
            );
          })}
        </section>
      </div>
    </HrShell>
  );
}

function RecordList({
  kind,
}: {
  kind:
    | "jobs"
    | "candidates"
    | "applications"
    | "interviews"
    | "assignments"
    | "decisions";
}) {
  const {
    scenarioState,
    persona,
    jobRecords,
    candidateRecords,
    applicationRecords: liveApplications,
    interviewRecords: liveInterviews,
    assignmentRecords: liveAssignments,
  } = usePrototype();
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("All states");
  const [page, setPage] = useState(1);
  const scopedApplications = visibleApplications(persona.role, liveApplications);
  const config = {
    jobs: {
      title: "Jobs & openings",
      eyebrow: "Jobs list",
      screenId: "UI-HR-002",
      screen: "job" as const,
      rows: visibleJobs(persona.role, jobRecords, liveApplications).map((item) => ({
        id: item.id,
        primary: item.title,
        secondary: item.team,
        state: item.status,
        to: `/hr/jobs/${item.id}`,
      })),
      newPath: "/hr/jobs/new",
      newLabel: "New job requisition",
      canCreate: canManageCoreRecord(persona.role, "job", "create"),
    },
    candidates: {
      title: "Candidates",
      eyebrow: "Candidate identity list",
      screenId: "UI-HR-003",
      screen: "candidate" as const,
      rows: visibleCandidates(persona.role, candidateRecords, liveApplications).map(
        (item) => ({
          id: item.id,
          primary: displayCandidateForRole(persona.role, {
            id: item.id,
            candidate: item.name,
          }),
          secondary: `${item.source} · ${item.location}`,
          state: item.status,
          to: `/hr/candidates/${item.id}`,
        }),
      ),
      newPath: "/hr/candidates/new",
      newLabel: "New candidate identity",
      canCreate: canManageCoreRecord(persona.role, "candidate", "create"),
    },
    applications: {
      title: "Applications",
      eyebrow: "Application list",
      screenId: "UI-HR-003",
      screen: "application" as const,
      rows: scopedApplications.map((item) => ({
        id: item.id,
        primary: displayCandidateForRole(persona.role, item),
        secondary: item.job,
        state:
          item.id === "APP-DEMO-001"
            ? scenarioState.applicationStage
            : item.stage,
        to: `/hr/applications/${item.id}`,
      })),
      newPath: "/hr/applications/new",
      newLabel: "New application",
      canCreate: canManageCoreRecord(persona.role, "application", "create"),
    },
    interviews: {
      title: "Interviews",
      eyebrow: "Interview list",
      screenId: "UI-HR-004",
      screen: "interview" as const,
      rows: visibleInterviews(persona.role, liveInterviews, liveApplications).map((item) => ({
        id: item.id,
        primary: displayCandidateForRole(persona.role, item),
        secondary: item.type,
        state:
          item.id === "INT-DEMO-001"
            ? scenarioState.interviewState
            : item.state,
        to: `/hr/interviews/${item.id}`,
      })),
      newPath: "",
      newLabel: "",
      canCreate: false,
    },
    assignments: {
      title: "Scorecards",
      eyebrow: "Assignment list",
      screenId: "UI-HR-005",
      screen: "scorecard" as const,
      rows: visibleAssignments(persona.role, liveAssignments, liveApplications).map((item) => ({
        id: item.id,
        primary: displayCandidateForRole(persona.role, item),
        secondary: item.interviewer,
        state:
          item.id === "ASN-DEMO-001" && scenarioState.missingScorecards === 0
            ? "Submitted"
            : item.state,
        to: `/hr/assignments/${item.id}`,
      })),
      newPath: "",
      newLabel: "",
      canCreate: false,
    },
    decisions: {
      title: "Offers & handoff",
      eyebrow: "Decision list",
      screenId: "UI-HR-006",
      screen: "decision" as const,
      rows: scopedApplications
        .filter(
          (item) =>
            ["APP-DEMO-001", "APP-DEMO-011"].includes(item.id) ||
            ["Offer", "Hired"].includes(item.stage),
        )
        .map((item) => ({
          id: item.id,
          primary: displayCandidateForRole(persona.role, item),
          secondary: item.job,
          state:
            item.id === "APP-DEMO-001"
              ? scenarioState.decisionState
              : "Offer approval",
          to: `/hr/decisions/${item.id}`,
        })),
      newPath: "",
      newLabel: "",
      canCreate: false,
    },
  }[kind];
  const states = ["All states", ...new Set(config.rows.map((row) => row.state))];
  const filteredRows = config.rows.filter((row) => {
    const matchesQuery = `${row.id} ${row.primary} ${row.secondary}`
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    const matchesState =
      stateFilter === "All states" || row.state === stateFilter;
    return matchesQuery && matchesState;
  });
  const pageSize = 20;
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pageRows = filteredRows.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );
  const downstreamCopy =
    kind === "interviews"
      ? "Interview records are generated from an application scheduling request after participants, timezone and availability are validated."
      : kind === "assignments"
        ? "Scorecard assignments are generated from an approved interview plan; they are never created as free-floating evidence."
        : kind === "decisions"
          ? "Decision, offer and handoff records are generated only after governed application readiness gates are satisfied."
          : null;
  return (
    <HrShell
      title={config.title}
      eyebrow={config.eyebrow}
      screenId={config.screenId}
      screen={config.screen}
      actions={
        config.canCreate ? (
          <NavLink className="primary-button" to={config.newPath}>
            <Plus size={16} /> {config.newLabel}
          </NavLink>
        ) : undefined
      }
    >
      <ScenarioControl />
      {downstreamCopy && (
        <ExplainPanel
          title="How this record is created"
          source="Workflow creation contract · v1.8"
        >
          {downstreamCopy}
        </ExplainPanel>
      )}
      <section className="panel record-list-panel">
        <div className="panel-heading">
          <div>
            <h2>{config.title}</h2>
            <span>
              {filteredRows.length} of {config.rows.length} role-visible
              synthetic records
            </span>
          </div>
          <Freshness>Canonical registry · now</Freshness>
        </div>
        <div className="collection-tools">
          <label className="global-search">
            <Search size={16} aria-hidden="true" />
            <span className="sr-only">Search {kind}</span>
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder={`Search ${kind} by ID or name`}
            />
          </label>
          <label>
            <span className="sr-only">Filter {kind} by state</span>
            <select
              aria-label={`Filter ${kind} by state`}
              value={stateFilter}
              onChange={(event) => {
                setStateFilter(event.target.value);
                setPage(1);
              }}
            >
              {states.map((state) => (
                <option key={state}>{state}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="record-list">
          {pageRows.map((row) => (
            <NavLink to={row.to} key={row.id}>
              <span className="object-icon">
                <AppWindow size={18} />
              </span>
              <div>
                <strong>{row.primary}</strong>
                <span>
                  {row.id} · {row.secondary}
                </span>
              </div>
              <Pill
                tone={
                  row.state.includes("Overdue") || row.state.includes("Blocked")
                    ? "danger"
                    : row.state.includes("Complete") ||
                        row.state.includes("Submitted")
                      ? "success"
                      : "info"
                }
              >
                {row.state}
              </Pill>
              <ArrowRight size={17} />
            </NavLink>
          ))}
        </div>
        {!pageRows.length && (
          <div className="empty-state" role="status">
            <Search size={28} />
            <h3>No role-visible records match</h3>
            <p>Clear the search or state filter; no data was changed.</p>
            <button
              className="secondary-button"
              onClick={() => {
                setQuery("");
                setStateFilter("All states");
              }}
            >
              Clear filters
            </button>
          </div>
        )}
        {filteredRows.length > pageSize && (
          <div className="collection-pagination" aria-label={`${kind} pagination`}>
            <button
              className="secondary-button"
              disabled={safePage === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </button>
            <span>
              Page {safePage} of {pageCount} · {pageRows.length} rows shown
            </span>
            <button
              className="secondary-button"
              disabled={safePage === pageCount}
              onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </HrShell>
  );
}

function MutationDenied({
  kind,
  returnTo,
}: {
  kind: string;
  returnTo: string;
}) {
  const { persona } = usePrototype();
  return (
    <section className="panel access-denied" role="alert">
      <LockKeyhole size={28} />
      <div>
        <h2>Mutation is not permitted</h2>
        <p>
          {persona.role} cannot create or edit this {kind}. The collection and
          fields remain scoped to the selected demonstration persona.
        </p>
      </div>
      <NavLink className="primary-button" to={returnTo}>
        Return to list
      </NavLink>
    </section>
  );
}

function JobForm({ mode, jobId }: { mode: "new" | "edit"; jobId?: string }) {
  const navigate = useNavigate();
  const { persona, jobRecords, createJob, updateJob } = usePrototype();
  const { featureStates } = useWireframe();
  const job = jobRecords.find((record) => record.id === jobId);
  const isBusinessCaseOne = job?.id === "JOB-DEMO-001";
  const publicationState = featureStates["WF-P0-04"];
  const [values, setValues] = useState(() => ({
    title: job?.title ?? "",
    publicId: job?.publicId ?? "",
    team: job?.team ?? "",
    location: job?.location ?? "",
    workplace: job?.workplace ?? "Remote",
    type: job?.type ?? "Full time",
    pay: job?.pay ?? "",
    status:
      isBusinessCaseOne && publicationState.status === "ready"
        ? "Approved"
        : job?.status ?? "Draft",
    summary: job?.summary ?? "",
    requirements: job?.requirements.join("\n") ?? "",
    owner: job?.owner ?? persona.name,
  }));
  const [error, setError] = useState("");
  const permitted = canManageCoreRecord(
    persona.role,
    "job",
    mode === "new" ? "create" : "edit",
  );
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!values.title.trim() || !values.team.trim() || !values.location.trim()) {
      setError("Title, team and location are required.");
      return;
    }
    const duplicate = jobRecords.some(
      (record) =>
        record.id !== job?.id &&
        record.title.toLowerCase() === values.title.trim().toLowerCase() &&
        record.team.toLowerCase() === values.team.trim().toLowerCase(),
    );
    if (duplicate) {
      setError("A synthetic job with this title and team already exists. Review the existing requisition first.");
      return;
    }
    const publicId =
      values.publicId.trim() ||
      `${values.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-memory`;
    const input = {
      title: values.title.trim(),
      publicId,
      team: values.team.trim(),
      location: values.location.trim(),
      workplace: values.workplace,
      type: values.type,
      pay: values.pay.trim() || "Compensation review pending",
      status: mode === "new" ? "Draft" : values.status,
      summary: values.summary.trim() || "Synthetic role summary pending structured content review.",
      requirements: values.requirements
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      owner: values.owner,
    };
    if (mode === "edit" && job) {
      updateJob(job.id, input);
      navigate(`/hr/jobs/${job.id}`);
    } else {
      const id = createJob(input);
      navigate(`/hr/jobs/${id}`);
    }
  };
  return (
    <HrShell
      title={mode === "new" ? "New job requisition" : `Edit ${job?.title ?? "job"}`}
      eyebrow="Job object-specific form"
      screenId="UI-HR-002"
      screen="job"
    >
      {!permitted || (mode === "edit" && !job) ? (
        <MutationDenied kind="job requisition" returnTo="/hr/jobs" />
      ) : (
        <form className="panel object-form" onSubmit={submit} noValidate>
          <div className="panel-heading">
            <div>
              <h2>{mode === "new" ? "Create a draft requisition" : "Edit permitted job fields"}</h2>
              <span>
                {mode === "new"
                  ? "New jobs always begin as Draft; approval and publication remain separate."
                  : isBusinessCaseOne
                    ? `${job?.id} · next Posting v7 · Policy v2`
                    : `${job?.id} · expected ${job?.version}`}
              </span>
            </div>
            <Pill tone="warning">Memory only</Pill>
          </div>
          {error && (
            <div className="error-summary" role="alert">
              <strong>Check the job form</strong>
              <span>{error}</span>
            </div>
          )}
          <div className="object-form-grid">
            <label>
              <span>Job title *</span>
              <input aria-label="Job title" value={values.title} onChange={(event) => setValues({ ...values, title: event.target.value })} />
            </label>
            <label>
              <span>Team *</span>
              <input aria-label="Team" value={values.team} onChange={(event) => setValues({ ...values, team: event.target.value })} />
            </label>
            <label>
              <span>Location *</span>
              <input aria-label="Job location" value={values.location} onChange={(event) => setValues({ ...values, location: event.target.value })} />
            </label>
            <label>
              <span>Workplace</span>
              <select aria-label="Workplace" value={values.workplace} onChange={(event) => setValues({ ...values, workplace: event.target.value })}>
                <option>Remote</option><option>Hybrid</option><option>On-site</option>
              </select>
            </label>
            <label>
              <span>Employment type</span>
              <select aria-label="Employment type" value={values.type} onChange={(event) => setValues({ ...values, type: event.target.value })}>
                <option>Full time</option><option>Part time</option><option>Contract</option>
              </select>
            </label>
            <label>
              <span>Compensation range</span>
              <input aria-label="Compensation range" value={values.pay} onChange={(event) => setValues({ ...values, pay: event.target.value })} />
            </label>
            <label>
              <span>Owner</span>
              <input aria-label="Job owner" value={values.owner} onChange={(event) => setValues({ ...values, owner: event.target.value })} />
            </label>
            {isBusinessCaseOne && (
              <label>
                <span>Approved openings</span>
                <input aria-label="Approved openings" readOnly value="2 · OPN-001 and OPN-002" />
              </label>
            )}
            {mode === "edit" && (
              <label>
                <span>Lifecycle state</span>
                <select aria-label="Job lifecycle state" value={values.status} disabled title="Lifecycle transitions use the governed approval and publication workflow" onChange={(event) => setValues({ ...values, status: event.target.value })}>
                  <option>Draft</option><option>Approved</option><option>Published</option><option>Paused</option><option>Closed</option>
                </select>
              </label>
            )}
            <label className="full-field">
              <span>Public URL slug</span>
              <input aria-label="Public URL slug" value={values.publicId} onChange={(event) => setValues({ ...values, publicId: event.target.value })} />
            </label>
            <label className="full-field">
              <span>Role summary</span>
              <textarea aria-label="Role summary" value={values.summary} onChange={(event) => setValues({ ...values, summary: event.target.value })} />
            </label>
            <label className="full-field">
              <span>Structured requirements · one per line</span>
              <textarea aria-label="Structured requirements" value={values.requirements} onChange={(event) => setValues({ ...values, requirements: event.target.value })} />
            </label>
          </div>
          <div className="object-form-actions">
            <NavLink className="secondary-button" to={job ? `/hr/jobs/${job.id}` : "/hr/jobs"}>Cancel</NavLink>
            <button className="primary-button" type="submit"><CheckCircle2 size={16} /> {mode === "new" ? "Create draft requisition" : "Save job changes"}</button>
          </div>
        </form>
      )}
    </HrShell>
  );
}

function JobWorkspace() {
  const { jobId, action } = useParams();
  const navigate = useNavigate();
  const { scenarioState, announce, persona, jobRecords, applicationRecords: liveApplications } = usePrototype();
  const { featureStates } = useWireframe();
  if (!jobId) return <RecordList kind="jobs" />;
  if (jobId === "new") return <JobForm mode="new" />;
  if (action === "edit") return <JobForm mode="edit" jobId={jobId} />;
  const job = jobRecords.find((item) => item.id === jobId);
  if (!job || !visibleJobs(persona.role, jobRecords, liveApplications).some((item) => item.id === job.id))
    return (
      <HrShell
        title="Job access denied"
        eyebrow={jobId}
        screenId="UI-HR-002"
        screen="job"
      >
        <section className="panel access-denied" role="alert">
          <ShieldAlert size={28} />
          <div>
            <h2>Row access denied safely</h2>
            <p>
              {persona.role} does not have this job in its authorized
              population.
            </p>
          </div>
          <NavLink className="primary-button" to="/hr/jobs">
            Return to visible jobs
          </NavLink>
        </section>
      </HrShell>
    );
  const policyBlocked =
    job.id === "JOB-DEMO-001" && scenarioState.policyBlocked;
  const publicationState = featureStates["WF-P0-04"];
  const isBusinessCaseOne = job.id === "JOB-DEMO-001";
  const publicationBlocked =
    isBusinessCaseOne && publicationState.status === "blocked";
  const effectiveStatus = isBusinessCaseOne
    ? ["complete", "recovered", "blocked"].includes(publicationState.status)
      ? "Published"
      : "Approved"
    : job.status;
  const effectiveVersion = isBusinessCaseOne
    ? effectiveStatus === "Published"
      ? "Posting v7 · Policy v2"
      : "Posting draft v7 · Policy v2"
    : job.version;
  const draftBlocked =
    job.status === "Draft" ||
    job.pay.toLowerCase().includes("pending") ||
    job.requirements.length < 2;
  const blocked = policyBlocked || draftBlocked || publicationBlocked;
  const reserved =
    job.id === "JOB-DEMO-001" ? scenarioState.openingReserved : 0;
  return (
    <HrShell
      title={job.title}
      eyebrow={`Job & opening workspace · ${job.id}`}
      screenId="UI-HR-002"
      screen="job"
      actions={
        <>
          {canManageCoreRecord(persona.role, "job", "edit") && (
            <NavLink className="secondary-button" to={`/hr/jobs/${job.id}/edit`}>
              <Pencil size={16} /> Edit
            </NavLink>
          )}
          <button
            className="secondary-button"
            disabled={effectiveStatus !== "Published"}
            onClick={() => navigate(`/careers/jobs/${job.publicId}`)}
          >
            {effectiveStatus === "Published"
              ? "Preview public job"
              : "Public preview unavailable"}
          </button>
          <button
            className="primary-button"
            disabled={blocked}
            onClick={() =>
              announce(`${job.title} publication previewed in memory.`)
            }
          >
            {blocked ? "Publication blocked" : "Preview publication"}
          </button>
        </>
      }
    >
      <div className="context-strip">
        <div>
          <span>Job ID</span>
          <strong>{job.id}</strong>
        </div>
        <div>
          <span>Openings</span>
          <strong>{isBusinessCaseOne ? 2 : 1} approved · {scenarioState.openingFilled} filled</strong>
        </div>
        <div>
          <span>Owner</span>
          <strong>{job.owner}</strong>
        </div>
        <div>
          <span>Effective plan</span>
          <strong>{effectiveVersion}</strong>
        </div>
        <Pill tone={effectiveStatus === "Published" ? "success" : "info"}>
          {effectiveStatus}
        </Pill>
        <Freshness>Reconciled 4 min ago</Freshness>
      </div>
      <ScenarioControl />
      {blocked ? (
        <div className="blocking-banner" role="alert">
          <ShieldAlert size={22} />
          <div>
            <strong>
              {publicationBlocked
                ? "Channel delivery requires reconciliation"
                : policyBlocked
                ? "Publication is blocked"
                : "Draft requires governed completion"}
            </strong>
            <span>
              {publicationBlocked
                ? "LinkedIn retained posting v6. Careers, Indeed and Agency remain delivered at v7 while a targeted retry is owned."
                : policyBlocked
                ? "Work location and candidate residence produce an unknown policy result. LEGAL-DEMO queue owns review."
                : "Complete structured content, compensation, opening approval and the publication workflow before a public projection exists."}
            </span>
          </div>
          <Pill tone="danger">{publicationBlocked ? "CHN-STALE" : policyBlocked ? "ERR-008" : "Draft"}</Pill>
        </div>
      ) : (
        <div className="success-banner">
          <CheckCircle2 size={20} />
          <div>
            <strong>Ready for publication</strong>
            <span>
              Required content, opening, policy and approval facts are current.
            </span>
          </div>
        </div>
      )}
      <div className="job-workspace-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Readiness</h2>
              <span>Derived from authoritative facts</span>
            </div>
            <strong className={`readiness-score ${blocked ? "blocked" : ""}`}>
              {publicationBlocked ? "92%" : policyBlocked ? "71%" : draftBlocked ? "62%" : "100%"}
            </strong>
          </div>
          <div className="readiness-list">
            {[
              ["Opening approved", !draftBlocked],
              ["Hiring team covered", true],
              ["Structured plan approved", true],
              ["Pay and content approved", !draftBlocked],
              ["Jurisdiction result known", !policyBlocked],
            ].map(([label, pass]) => (
              <div key={String(label)} className={pass ? "pass" : "fail"}>
                {pass ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                <span>{label}</span>
                <strong>{pass ? "Ready" : "Blocked"}</strong>
              </div>
            ))}
          </div>
          <ExplainPanel source={`${job.id} · Policy evaluation v12`}>
            Readiness is recalculated from opening, ownership, content, policy
            and approval records.
          </ExplainPanel>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Opening reconciliation</h2>
              <span>{isBusinessCaseOne ? "Two approved openings" : "One approved opening"}</span>
            </div>
            <Pill tone="success">Balanced</Pill>
          </div>
          <div className="opening-visual">
            <div>
              <strong>{isBusinessCaseOne ? 2 : 1}</strong>
              <span>Approved</span>
            </div>
            <ArrowRight size={20} />
            <div>
              <strong>{reserved}</strong>
              <span>Reserved</span>
            </div>
            <ArrowRight size={20} />
            <div>
              <strong>{scenarioState.openingFilled}</strong>
              <span>Filled</span>
            </div>
          </div>
          <dl className="fact-list">
            <div>
              <dt>Headcount reference</dt>
              <dd>HC-{job.id.slice(-3)}</dd>
            </div>
            <div>
              <dt>Budget approval</dt>
              <dd>Approved fixture · v2</dd>
            </div>
            <div>
              <dt>Reconciliation</dt>
              <dd>No variance</dd>
            </div>
          </dl>
        </section>
        <section className="panel wide-panel">
          <div className="panel-heading">
            <div>
              <h2>Structured hiring plan</h2>
              <span>Outcomes → competencies → evidence</span>
            </div>
            <button
              className="text-button"
              onClick={() => announce("Plan v1 versus v2 opened read-only.")}
            >
              Compare v1 to v2
            </button>
          </div>
          <div className="plan-grid">
            <div>
              <span className="plan-kicker">Outcome</span>
              <strong>{job.summary}</strong>
              <p>First 180 days · approved evidence target</p>
            </div>
            <div>
              <span className="plan-kicker">Competencies</span>
              <div className="chip-row">
                <Pill>Systems thinking</Pill>
                <Pill>Accessible practice</Pill>
                <Pill>Collaboration</Pill>
              </div>
            </div>
            <div>
              <span className="plan-kicker">Evidence</span>
              <strong>Structured interview + work evidence</strong>
              <p>Scorecard v4 · no model-generated ranking</p>
            </div>
          </div>
        </section>
      </div>
      <IntegrityNotice kind="human" />
    </HrShell>
  );
}

function CandidateForm({
  mode,
  candidateId,
}: {
  mode: "new" | "edit";
  candidateId?: string;
}) {
  const navigate = useNavigate();
  const {
    persona,
    candidateRecords,
    createCandidate,
    updateCandidate,
  } = usePrototype();
  const candidate = candidateRecords.find((record) => record.id === candidateId);
  const [values, setValues] = useState(() => ({
    name: candidate?.name ?? "",
    email: candidate?.email ?? "",
    phone: candidate?.phone ?? "",
    location: candidate?.location ?? "",
    timezone: candidate?.timezone ?? "America/Los_Angeles",
    source: candidate?.source ?? "Referral",
    consent: candidate?.consent ?? "Candidate notice v2 · acknowledged",
    status: candidate?.status ?? "Active",
    owner: candidate?.owner ?? persona.name,
  }));
  const [error, setError] = useState("");
  const permitted = canManageCoreRecord(
    persona.role,
    "candidate",
    mode === "new" ? "create" : "edit",
  );
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!values.name.trim() || !values.email.trim() || !values.source) {
      setError("Name, synthetic email and source are required.");
      return;
    }
    if (!values.email.toLowerCase().endsWith("@example.test")) {
      setError("Use only a reserved @example.test address in this public prototype.");
      return;
    }
    if (
      candidateRecords.some(
        (record) =>
          record.id !== candidate?.id &&
          record.email.toLowerCase() === values.email.trim().toLowerCase(),
      )
    ) {
      setError("A candidate identity with this synthetic email already exists. Open that identity to avoid a duplicate.");
      return;
    }
    const input = {
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone.trim(),
      location: values.location.trim(),
      timezone: values.timezone,
      source: values.source,
      consent: values.consent,
      status: values.status,
      owner: values.owner,
    };
    if (mode === "edit" && candidate) {
      updateCandidate(candidate.id, input);
      navigate(`/hr/candidates/${candidate.id}`);
    } else {
      const id = createCandidate(input);
      navigate(`/hr/candidates/${id}`);
    }
  };
  return (
    <HrShell
      title={mode === "new" ? "New candidate identity" : `Edit ${candidate?.name ?? "candidate"}`}
      eyebrow="Candidate object-specific form"
      screenId="UI-HR-003"
      screen="candidate"
    >
      {!permitted || (mode === "edit" && !candidate) ? (
        <MutationDenied kind="candidate identity" returnTo="/hr/candidates" />
      ) : (
        <form className="panel object-form" onSubmit={submit} noValidate>
          <div className="panel-heading">
            <div>
              <h2>{mode === "new" ? "Create a candidate identity" : "Edit identity and provenance"}</h2>
              <span>
                A candidate is a person record. This form never creates an
                application or submits the person to a job automatically.
              </span>
            </div>
            <Pill tone="warning">Synthetic identity only</Pill>
          </div>
          {error && (
            <div className="error-summary" role="alert">
              <strong>Check the candidate form</strong>
              <span>{error}</span>
            </div>
          )}
          <div className="object-form-grid">
            <label><span>Full name *</span><input aria-label="Candidate full name" value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} /></label>
            <label><span>Synthetic email *</span><input aria-label="Candidate synthetic email" type="email" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} /></label>
            <label><span>Phone</span><input aria-label="Candidate phone" value={values.phone} onChange={(event) => setValues({ ...values, phone: event.target.value })} /></label>
            <label><span>Location</span><input aria-label="Candidate location" value={values.location} onChange={(event) => setValues({ ...values, location: event.target.value })} /></label>
            <label><span>Timezone</span><select aria-label="Candidate timezone" value={values.timezone} onChange={(event) => setValues({ ...values, timezone: event.target.value })}><option>America/Los_Angeles</option><option>America/New_York</option><option>Europe/London</option><option>Asia/Kolkata</option></select></label>
            <label><span>Source *</span><select aria-label="Candidate source" value={values.source} onChange={(event) => setValues({ ...values, source: event.target.value })}><option>Referral</option><option>Careers site</option><option>Agency</option><option>Sourced</option><option>Manual import</option></select></label>
            <label><span>Notice / consent evidence</span><select aria-label="Candidate consent evidence" value={values.consent} onChange={(event) => setValues({ ...values, consent: event.target.value })}><option>Candidate notice v2 · acknowledged</option><option>Referral notice · pending</option><option>Manual import notice · pending</option></select></label>
            <label><span>Identity state</span><select aria-label="Candidate identity state" value={values.status} onChange={(event) => setValues({ ...values, status: event.target.value })}><option>Active</option><option>Restricted</option><option>Archived</option></select></label>
            <label><span>Owner</span><input aria-label="Candidate owner" value={values.owner} onChange={(event) => setValues({ ...values, owner: event.target.value })} /></label>
          </div>
          <div className="object-form-actions">
            <NavLink className="secondary-button" to={candidate ? `/hr/candidates/${candidate.id}` : "/hr/candidates"}>Cancel</NavLink>
            <button className="primary-button" type="submit"><CheckCircle2 size={16} /> {mode === "new" ? "Create candidate identity" : "Save candidate changes"}</button>
          </div>
        </form>
      )}
    </HrShell>
  );
}

function CandidateWorkspace() {
  const { candidateId, action } = useParams();
  const {
    persona,
    candidateRecords,
    applicationRecords: liveApplications,
  } = usePrototype();
  if (!candidateId) return <RecordList kind="candidates" />;
  if (candidateId === "new") return <CandidateForm mode="new" />;
  if (action === "edit")
    return <CandidateForm mode="edit" candidateId={candidateId} />;
  const candidate = candidateRecords.find((record) => record.id === candidateId);
  const scopedCandidates = visibleCandidates(
    persona.role,
    candidateRecords,
    liveApplications,
  );
  if (!candidate || !scopedCandidates.some((record) => record.id === candidate.id))
    return (
      <HrShell title="Candidate access denied" eyebrow={candidateId} screenId="UI-HR-003" screen="candidate">
        <section className="panel access-denied" role="alert">
          <ShieldAlert size={28} />
          <div><h2>Candidate row access denied safely</h2><p>{persona.role} cannot open this identity outside its authorized application population.</p></div>
          <NavLink className="primary-button" to="/hr/candidates">Return to visible candidates</NavLink>
        </section>
      </HrShell>
    );
  const scopedApplications = visibleApplications(persona.role, liveApplications).filter(
    (record) => record.candidateId === candidate.id,
  );
  const scope = roleDataScopes[persona.role];
  return (
    <HrShell
      title={displayCandidateForRole(persona.role, { id: candidate.id, candidate: candidate.name })}
      eyebrow={`Candidate identity workspace · ${candidate.id}`}
      screenId="UI-HR-003"
      screen="candidate"
      actions={
        canManageCoreRecord(persona.role, "candidate", "edit") ? (
          <>
            <NavLink className="secondary-button" to={`/hr/candidates/${candidate.id}/edit`}><Pencil size={16} /> Edit</NavLink>
            <NavLink className="primary-button" to="/hr/applications/new"><Plus size={16} /> Create application</NavLink>
          </>
        ) : undefined
      }
    >
      <div className="context-strip">
        <div><span>Candidate ID</span><strong>{candidate.id}</strong></div>
        <div><span>Identity state</span><strong>{candidate.status}</strong></div>
        <div><span>Source</span><strong>{candidate.source}</strong></div>
        <div><span>Owner</span><strong>{candidate.owner}</strong></div>
        <Freshness>{candidate.updated}</Freshness>
      </div>
      <div className="job-workspace-grid">
        <section className="panel">
          <div className="panel-heading"><div><h2>Identity & contact</h2><span>Field-level scope: {scope?.identity} identity · {scope?.contact} contact</span></div><Pill tone="info">Role scoped</Pill></div>
          <dl className="fact-list">
            <div><dt>Name</dt><dd>{displayCandidateForRole(persona.role, { id: candidate.id, candidate: candidate.name })}</dd></div>
            <div><dt>Email</dt><dd>{scope?.contact === "full" ? candidate.email : "Restricted"}</dd></div>
            <div><dt>Phone</dt><dd>{scope?.contact === "full" ? candidate.phone : "Restricted"}</dd></div>
            <div><dt>Location / timezone</dt><dd>{candidate.location} · {candidate.timezone}</dd></div>
          </dl>
        </section>
        <section className="panel">
          <div className="panel-heading"><div><h2>Purpose & provenance</h2><span>Separate from job consideration</span></div><Pill tone="success">{candidate.consent.includes("acknowledged") ? "Recorded" : "Pending"}</Pill></div>
          <dl className="fact-list"><div><dt>Source</dt><dd>{candidate.source}</dd></div><div><dt>Notice evidence</dt><dd>{candidate.consent}</dd></div><div><dt>Applications</dt><dd>{scopedApplications.length} role-visible link{scopedApplications.length === 1 ? "" : "s"}</dd></div></dl>
        </section>
        <section className="panel wide-panel">
          <div className="panel-heading"><div><h2>Applications</h2><span>One candidate may have multiple independent job considerations</span></div></div>
          <div className="record-list">
            {scopedApplications.map((record) => <NavLink to={`/hr/applications/${record.id}`} key={record.id}><span className="object-icon"><AppWindow size={18} /></span><div><strong>{record.job}</strong><span>{record.id} · {record.owner}</span></div><Pill tone={record.tone}>{record.stage}</Pill><ArrowRight size={17} /></NavLink>)}
            {!scopedApplications.length && <div className="empty-state"><UsersRound size={28} /><h3>No role-visible applications</h3><p>Create an application explicitly when there is a valid job consideration.</p></div>}
          </div>
        </section>
      </div>
      <IntegrityNotice kind="restricted" />
    </HrShell>
  );
}

function ApplicationForm({
  mode,
  applicationId,
}: {
  mode: "new" | "edit";
  applicationId?: string;
}) {
  const navigate = useNavigate();
  const {
    persona,
    candidateRecords,
    jobRecords,
    applicationRecords: liveApplications,
    createApplication,
    updateApplication,
  } = usePrototype();
  const application = liveApplications.find((record) => record.id === applicationId);
  const availableJobs = jobRecords.filter((record) => record.status !== "Closed");
  const [values, setValues] = useState(() => ({
    candidateId: application?.candidateId ?? candidateRecords[0]?.id ?? "",
    jobId: application?.jobId ?? availableJobs[0]?.id ?? "",
    stage: application?.stage ?? "Recruiter review",
    owner: application?.owner ?? persona.name,
    nextInternalAction:
      application?.nextInternalAction ?? "Complete structured recruiter review",
  }));
  const [error, setError] = useState("");
  const permitted = canManageCoreRecord(
    persona.role,
    "application",
    mode === "new" ? "create" : "edit",
  );
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!values.candidateId || !values.jobId || !values.owner.trim()) {
      setError("Candidate, job and owner are required.");
      return;
    }
    const duplicate = liveApplications.some(
      (record) =>
        record.id !== application?.id &&
        record.candidateId === values.candidateId &&
        record.jobId === values.jobId &&
        !["Rejected", "Withdrawn"].includes(record.stage),
    );
    if (duplicate) {
      setError("An active application already links this candidate and job. Open the existing record instead of creating a duplicate.");
      return;
    }
    const input = {
      ...values,
      owner: values.owner.trim(),
      nextInternalAction:
        values.nextInternalAction.trim() || "Complete the next governed stage action",
    };
    if (mode === "edit" && application) {
      updateApplication(application.id, input);
      navigate(`/hr/applications/${application.id}`);
    } else {
      const id = createApplication(input);
      navigate(`/hr/applications/${id}`);
    }
  };
  return (
    <HrShell
      title={mode === "new" ? "New application" : `Edit ${application?.id ?? "application"}`}
      eyebrow="Candidate-to-job junction form"
      screenId="UI-HR-003"
      screen="application"
    >
      {!permitted || (mode === "edit" && !application) ? (
        <MutationDenied kind="application" returnTo="/hr/applications" />
      ) : (
        <form className="panel object-form" onSubmit={submit} noValidate>
          <div className="panel-heading">
            <div>
              <h2>{mode === "new" ? "Link a candidate to a job" : "Edit application routing fields"}</h2>
              <span>Candidate identity and job requisition stay independent; this record represents the consideration.</span>
            </div>
            <Pill tone="warning">Duplicate protected</Pill>
          </div>
          {error && <div className="error-summary" role="alert"><strong>Check the application form</strong><span>{error}</span></div>}
          <div className="object-form-grid">
            <label>
              <span>Candidate *</span>
              <select aria-label="Application candidate" value={values.candidateId} disabled={mode === "edit"} title={mode === "edit" ? "Candidate binding is immutable after application creation" : undefined} onChange={(event) => setValues({ ...values, candidateId: event.target.value })}>
                {candidateRecords.filter((record) => record.status === "Active").map((record) => <option value={record.id} key={record.id}>{record.name} · {record.id}</option>)}
              </select>
            </label>
            <label>
              <span>Job requisition *</span>
              <select aria-label="Application job" value={values.jobId} disabled={mode === "edit"} title={mode === "edit" ? "Job binding is immutable after application creation" : undefined} onChange={(event) => setValues({ ...values, jobId: event.target.value })}>
                {availableJobs.map((record) => <option value={record.id} key={record.id}>{record.title} · {record.id} · {record.status}</option>)}
              </select>
            </label>
            <label>
              <span>Application stage</span>
              <select aria-label="Application stage" value={values.stage} disabled title="Stage changes use the governed transition action" onChange={(event) => setValues({ ...values, stage: event.target.value })}>
                {["Recruiter review", "Screening", "Scheduling", "Interviews", "Debrief", "Offer", "Hired", "Rejected", "Withdrawn"].map((stage) => <option key={stage}>{stage}</option>)}
              </select>
            </label>
            <label><span>Owner *</span><input aria-label="Application owner" value={values.owner} onChange={(event) => setValues({ ...values, owner: event.target.value })} /></label>
            <label className="full-field"><span>Next internal action</span><textarea aria-label="Application next action" value={values.nextInternalAction} onChange={(event) => setValues({ ...values, nextInternalAction: event.target.value })} /></label>
          </div>
          <ExplainPanel title="Creation boundary" source="Application invariant · v1.8">
            This creates only the synthetic application junction. Interview scheduling, scorecards, decisions, offers and handoff records are generated later by their governed workflow gates.
          </ExplainPanel>
          <div className="object-form-actions">
            <NavLink className="secondary-button" to={application ? `/hr/applications/${application.id}` : "/hr/applications"}>Cancel</NavLink>
            <button className="primary-button" type="submit"><CheckCircle2 size={16} /> {mode === "new" ? "Create application" : "Save application changes"}</button>
          </div>
        </form>
      )}
    </HrShell>
  );
}

function ApplicationWorkspace() {
  const { applicationId, action } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("Summary");
  const [preview, setPreview] = useState(false);
  const [draft, setDraft] = useState(
    "Your interview is complete. The team expects to share a process update by Aug 29.",
  );
  const [messageQueued, setMessageQueued] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const {
    scenarioState,
    announce,
    resolveScorecard,
    availabilitySubmitted,
    persona,
    applicationRecords: liveApplications,
    interviewRecords: liveInterviews,
  } = usePrototype();
  if (!applicationId) return <RecordList kind="applications" />;
  if (applicationId === "new") return <ApplicationForm mode="new" />;
  if (action === "edit")
    return <ApplicationForm mode="edit" applicationId={applicationId} />;

  const record = liveApplications.find((item) => item.id === applicationId);
  const scopedRecords = visibleApplications(persona.role, liveApplications);
  if (!record || !scopedRecords.some((item) => item.id === record.id))
    return (
      <HrShell
        title="Application access denied"
        eyebrow={applicationId}
        screenId="UI-HR-003"
        screen="application"
      >
        <section className="panel access-denied" role="alert">
          <ShieldAlert size={28} />
          <div>
            <h2>Row access denied safely</h2>
            <p>
              {persona.role} cannot open this application outside its authorized
              population.
            </p>
          </div>
          <NavLink className="primary-button" to="/hr/applications">
            Return to visible applications
          </NavLink>
        </section>
      </HrShell>
    );
  const recordIndex = scopedRecords.findIndex((item) => item.id === record.id);
  const previous = scopedRecords.at(recordIndex - 1);
  const next = scopedRecords.at(recordIndex + 1);
  const isMaya = record.id === "APP-DEMO-001";
  const stage = isMaya ? scenarioState.applicationStage : record.stage;
  const missing = isMaya ? scenarioState.missingScorecards : 0;
  const blocked = missing > 0;
  const standardStages = [
    "Submitted",
    "Recruiter review",
    "Screening",
    "Interviews",
    "Debrief",
    "Offer",
  ];
  const stages = standardStages.includes(stage)
    ? standardStages
    : [...standardStages.slice(0, 4), stage];
  const currentIndex = stages.indexOf(stage);
  const dataScope = roleDataScopes[persona.role];
  const tabs = [
    "Summary",
    ...(["Recruiter", "Recruiting Coordinator", "Hiring Manager"].includes(
      persona.role,
    )
      ? ["Interviews"]
      : []),
    ...(["Recruiter", "Recruiting Coordinator", "Candidate Support"].includes(
      persona.role,
    )
      ? ["Messages"]
      : []),
    ...([
      "Recruiter",
      "Hiring Manager",
      "Application Integrity Reviewer",
    ].includes(persona.role)
      ? ["Activity"]
      : []),
    ...(["Recruiter"].includes(persona.role) ? ["Documents & forms"] : []),
    ...([
      "Recruiter",
      "Recruiting Coordinator",
      "Hiring Manager",
      "Candidate Support",
    ].includes(persona.role)
      ? ["Tasks"]
      : []),
    ...(["Recruiter", "Hiring Manager"].includes(persona.role)
      ? ["Related applications"]
      : []),
  ];
  const relatedInterviews = liveInterviews.filter(
    (item) => item.applicationId === record.id,
  );
  const completeTask = (id: string) =>
    setCompletedTasks((items) => (items.includes(id) ? items : [...items, id]));

  return (
    <HrShell
      title={displayCandidateForRole(persona.role, record)}
      eyebrow={`Application workspace · ${record.id}`}
      screenId="UI-HR-003"
      screen="application"
      actions={
        <>
          <div
            className="record-navigation"
            aria-label="Application record navigation"
          >
            <button
              disabled={!previous}
              onClick={() =>
                previous && navigate(`/hr/applications/${previous.id}`)
              }
            >
              Previous
            </button>
            <span>
              {recordIndex + 1} of {scopedRecords.length}
            </span>
            <button
              disabled={!next}
              onClick={() => next && navigate(`/hr/applications/${next.id}`)}
            >
              Next
            </button>
          </div>
          {canManageCoreRecord(persona.role, "application", "edit") && (
            <NavLink
              className="secondary-button"
              to={`/hr/applications/${record.id}/edit`}
            >
              <Pencil size={16} /> Edit
            </NavLink>
          )}
          {tabs.includes("Messages") && (
            <button
              className="secondary-button"
              onClick={() => setTab("Messages")}
            >
              <MessageSquareText size={16} /> Message
            </button>
          )}
          {["Recruiter", "Hiring Manager"].includes(persona.role) && (
            <button className="primary-button" onClick={() => setPreview(true)}>
              Review transition
            </button>
          )}
        </>
      }
    >
      <div className="candidate-context operational-context">
        <div className="avatar large">
          {roleDataScopes[persona.role]?.identity === "full"
            ? record.initials
            : "ID"}
        </div>
        <div>
          <h2>{displayCandidateForRole(persona.role, record)}</h2>
          <span>
            {record.job} · {stage}
          </span>
          <div className="identity-line">
            {roleDataScopes[persona.role]?.contact === "full" ? (
              <a href="mailto:prototype@example.test">
                {isMaya
                  ? syntheticCandidate.email
                  : `${record.candidate.toLowerCase().replace(" ", ".")}@example.test`}
              </a>
            ) : (
              <span>Contact field restricted</span>
            )}
            <span>America/Los_Angeles · 10:24 AM local</span>
            <span>Source: Careers site · consent v2</span>
          </div>
        </div>
        <Pill tone={blocked ? "warning" : "success"}>
          {blocked ? "Decision blocked" : "Next gate ready"}
        </Pill>
        <div className="context-facts">
          <span>
            Owner <strong>{record.owner}</strong>
          </span>
          <span>
            Stage age <strong>{record.stageAge}</strong>
          </span>
          <span>
            Application <strong>{record.version}</strong>
          </span>
        </div>
      </div>
      <div
        className="workspace-tabs"
        role="tablist"
        aria-label="Application workspace sections"
      >
        {tabs.map((item) => (
          <button
            id={`application-tab-${item.replaceAll(" ", "-")}`}
            role="tab"
            aria-selected={tab === item}
            aria-controls="application-tabpanel"
            onClick={() => setTab(item)}
            key={item}
          >
            {item}
          </button>
        ))}
      </div>
      <div
        id="application-tabpanel"
        role="tabpanel"
        aria-labelledby={`application-tab-${tab.replaceAll(" ", "-")}`}
      >
        {tab === "Summary" && (
          <div className="application-workspace-grid">
            <section className="panel timeline-panel">
              <div className="panel-heading">
                <div>
                  <h2>Process timeline</h2>
                  <span>Primary stage plus typed parallel work</span>
                </div>
                <Freshness>Application {record.version}</Freshness>
              </div>
              <ol className="stage-timeline">
                {stages.map((label, index) => {
                  const state =
                    index < currentIndex
                      ? "complete"
                      : index === currentIndex
                        ? "current"
                        : index === currentIndex + 1 && blocked
                          ? "blocked"
                          : "future";
                  return (
                    <li className={state} key={label}>
                      <span className="timeline-dot">
                        {state === "complete" ? <Check size={13} /> : ""}
                      </span>
                      <div>
                        <strong>{label}</strong>
                        <small>
                          {state === "current"
                            ? "Current"
                            : state === "blocked"
                              ? "Blocked"
                              : state === "complete"
                                ? "Complete"
                                : "Not started"}
                        </small>
                      </div>
                    </li>
                  );
                })}
              </ol>
              <ExplainPanel source="Readiness calculation v18">
                {blocked
                  ? "Debrief cannot begin because one required scorecard is missing. The recovery owner and actions are explicit."
                  : `The ${stage} gate is coherent with current evidence.`}
              </ExplainPanel>
            </section>
            {dataScope?.decisionEvidence !== "none" ? (
              <section className="panel evidence-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Job-related evidence</h2>
                    <span>
                      {dataScope?.decisionEvidence} visibility for this role
                    </span>
                  </div>
                  <Pill tone="info">Plan v2</Pill>
                </div>
                {scorecard.map((item) => (
                  <div className="evidence-row" key={item.competency}>
                    <div>
                      <strong>{item.competency}</strong>
                      <Pill
                        tone={
                          item.rating.startsWith("Strong")
                            ? "success"
                            : "warning"
                        }
                      >
                        {item.rating}
                      </Pill>
                    </div>
                    <p>{item.evidence}</p>
                  </div>
                ))}
                {["Recruiter", "Hiring Manager"].includes(persona.role) && (
                  <NavLink
                    className="secondary-button full-button"
                    to={
                      isMaya
                        ? "/hr/assignments/ASN-DEMO-001"
                        : "/hr/assignments"
                    }
                  >
                    Open independent scorecards
                  </NavLink>
                )}
              </section>
            ) : (
              <section
                className="panel field-restriction"
                aria-label="Restricted job-related evidence"
              >
                <LockKeyhole size={24} />
                <h2>Job-related evidence is restricted</h2>
                <p>
                  {persona.role} receives process status and owned recovery
                  facts, not selection evidence.
                </p>
              </section>
            )}
            <aside className="panel parallel-panel">
              <div className="panel-heading">
                <h2>Parallel work</h2>
                <span>Purpose-filtered facts</span>
              </div>
              {dataScope?.decisionEvidence !== "none" && (
                <div className="parallel-item">
                  <ClipboardCheck size={19} />
                  <div>
                    <strong>
                      {missing
                        ? `${missing} scorecard missing`
                        : "Scorecards complete"}
                    </strong>
                    <span>
                      {missing
                        ? "Assigned evidence overdue"
                        : "Required evidence present"}
                    </span>
                  </div>
                  <Pill tone={missing ? "danger" : "success"}>
                    {missing ? "Blocker" : "Ready"}
                  </Pill>
                </div>
              )}
              <div className="parallel-item">
                <CalendarDays size={19} />
                <div>
                  <strong>
                    {availabilitySubmitted
                      ? "Availability submitted"
                      : "Sessions complete"}
                  </strong>
                  <span>
                    {availabilitySubmitted
                      ? "Candidate window · coordinator confirmation due"
                      : "2 of 2 · attendance known"}
                  </span>
                </div>
                <Pill tone={availabilitySubmitted ? "info" : "success"}>
                  {availabilitySubmitted ? "Action" : "Ready"}
                </Pill>
              </div>
              <div className="parallel-item">
                <ShieldCheck size={19} />
                <div>
                  <strong>Policy status</strong>
                  <span>Allowed · minimized projection</span>
                </div>
                <Pill tone="success">Ready</Pill>
              </div>
            </aside>
          </div>
        )}
        {tab === "Interviews" && (
          <section className="operational-panel">
            <div className="panel-heading">
              <div>
                <h2>Interview plan and sessions</h2>
                <span>
                  Schedule, attendance and evidence remain separate facts
                </span>
              </div>
              <Pill tone="info">Plan v2</Pill>
            </div>
            <div className="operational-cards">
              {(relatedInterviews.length
                ? relatedInterviews
                : liveInterviews.slice(0, 1)
              ).map((interview) => (
                <article key={interview.id}>
                  <div>
                    <CalendarDays size={20} />
                    <span>
                      <strong>{interview.type}</strong>
                      <small>{interview.time}</small>
                    </span>
                    <Pill
                      tone={
                        interview.state === "Complete"
                          ? "success"
                          : interview.tone
                      }
                    >
                      {interview.state}
                    </Pill>
                  </div>
                  <dl>
                    <div>
                      <dt>Interviewer</dt>
                      <dd>{interview.interviewer}</dd>
                    </div>
                    <div>
                      <dt>Feedback</dt>
                      <dd>
                        {missing
                          ? "1 required submission outstanding"
                          : "Complete"}
                      </dd>
                    </div>
                    <div>
                      <dt>Candidate timezone</dt>
                      <dd>America/Los_Angeles</dd>
                    </div>
                  </dl>
                  <NavLink
                    className="secondary-button"
                    to={`/hr/interviews/${interview.id}`}
                  >
                    Open coordination record
                  </NavLink>
                </article>
              ))}
            </div>
            <ExplainPanel source="Interview plan v2 · activity status model">
              Briefing, scheduling, attendance and feedback each keep their own
              lifecycle; none silently rewrites the application stage.
            </ExplainPanel>
          </section>
        )}
        {tab === "Messages" && (
          <div className="message-workspace">
            <section className="operational-panel">
              <div className="panel-heading">
                <div>
                  <h2>Candidate conversation</h2>
                  <span>Email thread, delivery and scheduled work</span>
                </div>
                <Pill tone="success">Preference eligible</Pill>
              </div>
              <div className="message-thread">
                {applicationMessages.map((message) => (
                  <article
                    className={`message-event ${message.direction}`}
                    key={message.id}
                  >
                    <div>
                      <Pill tone={message.tone}>
                        {message.channel} · {message.state}
                      </Pill>
                      <span>{message.time}</span>
                    </div>
                    <h3>{message.subject}</h3>
                    <p>{message.preview}</p>
                    <small>
                      {message.id} · candidate-visible · template and delivery
                      evidence retained
                    </small>
                  </article>
                ))}
              </div>
            </section>
            <aside className="operational-panel message-composer">
              <div className="panel-heading">
                <div>
                  <h2>Candidate-safe update</h2>
                  <span>Preview before queue</span>
                </div>
                <Pill tone="info">Template v4</Pill>
              </div>
              <label>
                <span>Purpose</span>
                <select defaultValue="Process update">
                  <option>Process update</option>
                  <option>Scheduling request</option>
                  <option>Service recovery</option>
                </select>
              </label>
              <label>
                <span>Send time</span>
                <select defaultValue="Tomorrow · 9:00 AM PT">
                  <option>Tomorrow · 9:00 AM PT</option>
                  <option>Send now in simulation</option>
                </select>
              </label>
              <label>
                <span>Message</span>
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                />
              </label>
              <div className="eligibility-check">
                <CheckCircle2 size={18} />
                <span>
                  <strong>Eligible to queue</strong>Email verified · purpose
                  allowed · quiet hours clear
                </span>
              </div>
              <button
                className="primary-button"
                disabled={draft.trim().length < 20 || messageQueued}
                onClick={() => {
                  setMessageQueued(true);
                  announce(
                    "Candidate-safe message queued in memory. No email was sent.",
                  );
                }}
              >
                <Send size={16} />{" "}
                {messageQueued ? "Queued in memory" : "Queue message preview"}
              </button>
            </aside>
          </div>
        )}
        {tab === "Activity" && (
          <section className="operational-panel">
            <div className="panel-heading">
              <div>
                <h2>Application activity</h2>
                <span>Job-consideration-specific event feed</span>
              </div>
              <Freshness>Canonical event order · now</Freshness>
            </div>
            <ol className="activity-feed">
              {applicationActivity.map((event) => (
                <li key={event.id}>
                  <span className={`activity-marker marker-${event.tone}`} />
                  <div>
                    <small>{event.time}</small>
                    <strong>{event.event}</strong>
                    <p>{event.detail}</p>
                    <span>
                      {event.actor} · {event.id}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}
        {tab === "Documents & forms" && (
          <section className="operational-panel">
            <div className="panel-heading">
              <div>
                <h2>Documents and forms</h2>
                <span>
                  Access-scoped metadata; binaries remain outside this prototype
                </span>
              </div>
              <Pill tone="success">3 clean fixtures</Pill>
            </div>
            <div className="document-list">
              {applicationDocuments.map((document) => (
                <article key={document.id}>
                  <FileText size={22} />
                  <div>
                    <strong>{document.name}</strong>
                    <span>
                      {document.category} · {document.version} · updated{" "}
                      {document.updated}
                    </span>
                    <small>
                      {document.id} · {document.access}
                    </small>
                  </div>
                  <Pill tone="success">{document.state}</Pill>
                  <button
                    className="secondary-button"
                    onClick={() =>
                      announce(
                        `${document.name} opened as metadata-only preview.`,
                      )
                    }
                  >
                    Preview
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}
        {tab === "Tasks" && (
          <section className="operational-panel">
            <div className="panel-heading">
              <div>
                <h2>Tasks and reminders</h2>
                <span>Owned work derived from authoritative records</span>
              </div>
              <Pill tone="info">
                {applicationTasks.length - completedTasks.length} open
              </Pill>
            </div>
            <div className="task-list">
              {applicationTasks.map((task) => {
                const done = completedTasks.includes(task.id);
                return (
                  <article key={task.id}>
                    <ListChecks size={20} />
                    <div>
                      <strong>{task.title}</strong>
                      <span>
                        {task.owner} · {task.due}
                      </span>
                      <small>Source: {task.source}</small>
                    </div>
                    <Pill tone={done ? "success" : task.tone}>
                      {done ? "Completed · demo" : task.state}
                    </Pill>
                    <button
                      className="secondary-button"
                      disabled={done || task.state === "Blocked"}
                      onClick={() => completeTask(task.id)}
                    >
                      {done
                        ? "Completed"
                        : task.state === "Blocked"
                          ? "Resolve source first"
                          : "Complete in demo"}
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        )}
        {tab === "Related applications" && (
          <section className="operational-panel">
            <div className="panel-heading">
              <div>
                <h2>Related applications</h2>
                <span>
                  One candidate identity; application truth stays job-specific
                </span>
              </div>
              <Pill tone="info">2 considerations</Pill>
            </div>
            <div className="related-list">
              {relatedApplications.map((application) => (
                <article key={application.id}>
                  <BriefcaseBusiness size={20} />
                  <div>
                    <strong>{application.job}</strong>
                    <span>
                      {application.id} · {application.relationship}
                    </span>
                    <small>{application.access}</small>
                  </div>
                  <Pill
                    tone={application.id === record.id ? "success" : "info"}
                  >
                    {application.stage}
                  </Pill>
                  {liveApplications.some(
                    (item) => item.id === application.id,
                  ) ? (
                    <NavLink
                      className="secondary-button"
                      to={`/hr/applications/${application.id}`}
                    >
                      Open application
                    </NavLink>
                  ) : (
                    <button
                      className="secondary-button"
                      onClick={() =>
                        announce(
                          "Related application is a read-only seeded candidate context.",
                        )
                      }
                    >
                      View context
                    </button>
                  )}
                </article>
              ))}
            </div>
            <IntegrityNotice kind="restricted" />
          </section>
        )}
      </div>
      {preview && (
        <div className="modal-scrim" role="presentation">
          <section
            className="transition-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="transition-title"
          >
            <button
              className="modal-close"
              aria-label="Close transition preview"
              onClick={() => setPreview(false)}
            >
              <XCircle size={20} />
            </button>
            <Pill tone={blocked ? "warning" : "success"}>
              TRN-005 · preview only
            </Pill>
            <h2 id="transition-title">
              {blocked
                ? "Move Interviews → Debrief?"
                : `Move ${stage} → next gate?`}
            </h2>
            <p>
              {blocked
                ? "This transition is blocked. Choose a governed recovery action."
                : "Required facts are present. This remains an in-memory preview."}
            </p>
            <div className="transition-checks">
              <div className="pass">
                <CheckCircle2 size={18} />
                <span>All sessions completed</span>
              </div>
              <div className={blocked ? "fail" : "pass"}>
                {blocked ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
                <span>
                  {blocked
                    ? "1 required scorecard missing"
                    : "Required scorecards complete"}
                </span>
              </div>
            </div>
            {blocked && (
              <div className="recovery-actions">
                <button
                  className="secondary-button"
                  onClick={() =>
                    announce(
                      "Synthetic reminder recorded; no message was sent.",
                    )
                  }
                >
                  Send reminder preview
                </button>
                <NavLink
                  className="secondary-button"
                  to="/hr/assignments/ASN-DEMO-001"
                >
                  Open assignment
                </NavLink>
                <button
                  className="secondary-button"
                  onClick={() => {
                    resolveScorecard(
                      "Governed waiver simulated with a preserved evidence gap and audit note.",
                    );
                    setPreview(false);
                  }}
                >
                  Simulate governed waiver
                </button>
              </div>
            )}
            <IntegrityNotice kind="simulation" />
            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() => setPreview(false)}
              >
                Close preview
              </button>
              <button
                className="primary-button"
                disabled={blocked}
                onClick={() => {
                  announce("Transition preview completed in memory.");
                  setPreview(false);
                }}
              >
                {blocked ? "Transition blocked" : "Simulate transition"}
              </button>
            </div>
          </section>
        </div>
      )}
    </HrShell>
  );
}

function InterviewWorkspace() {
  const { interviewId } = useParams();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [mode, setMode] = useState("Availability request");
  const [confirmed, setConfirmed] = useState(false);
  const [linkActive, setLinkActive] = useState(true);
  const {
    scenarioState,
    availabilitySubmitted,
    announce,
    persona,
    interviewRecords: liveInterviews,
    applicationRecords: liveApplications,
  } = usePrototype();
  if (!interviewId) return <RecordList kind="interviews" />;
  const interview = liveInterviews.find((item) => item.id === interviewId);
  if (
    !interview ||
    !visibleInterviews(persona.role, liveInterviews, liveApplications).some(
      (item) => item.id === interview.id,
    )
  )
    return (
      <HrShell
        title="Interview access denied"
        eyebrow={interviewId}
        screenId="UI-HR-004"
        screen="interview"
      >
        <section className="panel access-denied" role="alert">
          <ShieldAlert size={28} />
          <div>
            <h2>Assignment scope denied safely</h2>
            <p>{persona.role} is not assigned to this interview context.</p>
          </div>
          <NavLink className="primary-button" to="/hr/interviews">
            Return to visible interviews
          </NavLink>
        </section>
      </HrShell>
    );
  const rawState =
    interview.id === "INT-DEMO-001"
      ? scenarioState.interviewState
      : interview.state;
  const state = confirmed ? "Confirmed" : rawState;
  const needsAction = state !== "Complete" && state !== "Confirmed";
  const slots = [
    "Wed Aug 27 · 9:30 AM PT",
    "Thu Aug 28 · 9:30 AM PT",
    "Thu Aug 28 · 1:00 PM PT",
    "Fri Aug 29 · 11:00 AM PT",
  ];
  const confirm = () => {
    setConfirmed(true);
    setLinkActive(false);
    announce(
      `${selectedSlot} confirmed in memory. The active request is invalidated and projection reconciliation is queued.`,
    );
  };
  return (
    <HrShell
      title="Interview coordination"
      eyebrow={`${displayCandidateForRole(persona.role, interview)} · ${interview.id}`}
      screenId="UI-HR-004"
      screen="interview"
      actions={
        needsAction ? (
          <button
            className="primary-button"
            disabled={!selectedSlot}
            onClick={confirm}
          >
            Confirm demo slot
          </button>
        ) : (
          <Pill tone="success">{state}</Pill>
        )
      }
    >
      <div className={needsAction ? "blocking-banner" : "success-banner"}>
        {needsAction ? <CalendarDays size={22} /> : <CheckCircle2 size={22} />}
        <div>
          <strong>
            {needsAction
              ? "Scheduling action required"
              : "Session state reconciled"}
          </strong>
          <span>
            {needsAction
              ? `${displayCandidateForRole(persona.role, interview)} has no confirmed slot. ${availabilitySubmitted ? "Submitted candidate availability is ready for coordination." : "Candidate availability remains valid."}`
              : `${interview.type} is ${state.toLowerCase()}; evidence is tracked separately.`}
          </span>
        </div>
        <Pill tone={needsAction ? "warning" : "success"}>{state}</Pill>
      </div>
      <div
        className="schedule-mode"
        role="tablist"
        aria-label="Scheduling method"
      >
        {["Availability request", "Direct booking"].map((item) => (
          <button
            role="tab"
            aria-selected={mode === item}
            onClick={() => {
              setMode(item);
              setSelectedSlot(null);
            }}
            key={item}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="scheduling-contract-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>
                {mode === "Direct booking"
                  ? "Candidate booking slots"
                  : "Candidate availability"}
              </h2>
              <span>
                {mode === "Direct booking"
                  ? "Candidate chooses a confirmed one-event slot"
                  : "Coordinator compares candidate and resource availability"}
              </span>
            </div>
            <Pill tone={linkActive ? "info" : "neutral"}>
              {linkActive ? "1 active link" : "Link invalidated"}
            </Pill>
          </div>
          <div className="availability-grid">
            {slots.map((slot) => (
              <button
                className={selectedSlot === slot ? "selected" : ""}
                aria-pressed={selectedSlot === slot}
                onClick={() => setSelectedSlot(slot)}
                key={slot}
              >
                <strong>{slot}</strong>
                <span>
                  {selectedSlot === slot
                    ? "Selected"
                    : availabilitySubmitted
                      ? "Candidate available"
                      : "Prepared fixture"}
                </span>
              </button>
            ))}
          </div>
          <ExplainPanel source={`${mode} · request v3`}>
            {mode === "Direct booking"
              ? "Only one candidate/job/stage-specific booking link can be active. Booking invalidates the link and creates one canonical session version."
              : "Submitted availability is not a booking. A coordinator must confirm a slot that satisfies every hard constraint."}
          </ExplainPanel>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Scheduling contract</h2>
              <span>Hard and soft constraints are explicit</span>
            </div>
            <Pill tone="success">Validated</Pill>
          </div>
          <dl className="schedule-facts">
            <div>
              <dt>Candidate timezone</dt>
              <dd>America/Los_Angeles</dd>
            </div>
            <div>
              <dt>Minimum notice</dt>
              <dd>24 hours · hard</dd>
            </div>
            <div>
              <dt>Buffers</dt>
              <dd>15 minutes before/after · hard</dd>
            </div>
            <div>
              <dt>Booking window</dt>
              <dd>Aug 27–29 · excludes holiday</dd>
            </div>
            <div>
              <dt>Reschedule policy</dt>
              <dd>2 times · until 12h before</dd>
            </div>
            <div>
              <dt>Link expiry</dt>
              <dd>Aug 29 · 5:00 PM PT</dd>
            </div>
          </dl>
          <button
            className="secondary-button full-button"
            disabled={!linkActive}
            onClick={() => {
              setLinkActive(false);
              announce(
                "Active scheduling link invalidated in memory; the prior link can no longer be used.",
              );
            }}
          >
            Invalidate active link
          </button>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Participants and capacity</h2>
              <span>Qualified pool and load limits</span>
            </div>
            <Pill tone="success">Capacity available</Pill>
          </div>
          <div className="participant">
            <div className="avatar">
              {interview.interviewer
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </div>
            <div>
              <strong>{interview.interviewer}</strong>
              <span>Qualified interviewer · pool DESIGN-02</span>
            </div>
            <Pill tone="success">2/4 today</Pill>
          </div>
          <div className="participant">
            <div className="avatar">
              {roleDataScopes[persona.role]?.identity === "full"
                ? interview.candidate
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                : "ID"}
            </div>
            <div>
              <strong>
                {displayCandidateForRole(persona.role, interview)}
              </strong>
              <span>Candidate · synthetic contact</span>
            </div>
            <Pill tone={availabilitySubmitted ? "success" : "info"}>
              {availabilitySubmitted ? "Submitted" : "Requested"}
            </Pill>
          </div>
          <dl className="fact-list">
            <div>
              <dt>Format</dt>
              <dd>Video · 45 minutes</dd>
            </div>
            <div>
              <dt>Room/resource</dt>
              <dd>Video room · available</dd>
            </div>
            <div>
              <dt>Interviewer limit</dt>
              <dd>4 daily · 12 weekly</dd>
            </div>
          </dl>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Session lifecycle</h2>
              <span>Projection and recovery states</span>
            </div>
            <Freshness>Session v3 · now</Freshness>
          </div>
          <ol className="compact-lifecycle">
            {[
              ["Request created", true],
              [
                availabilitySubmitted
                  ? "Availability submitted"
                  : "Waiting on availability",
                true,
              ],
              [
                confirmed ? "Session confirmed" : "Coordinator confirmation",
                confirmed,
              ],
              ["Calendar projection reconciled", false],
            ].map(([label, done], index) => (
              <li
                className={
                  done
                    ? "done"
                    : index === 2 && !confirmed
                      ? "current"
                      : "future"
                }
                key={String(label)}
              >
                <span>{done ? <Check size={13} /> : index + 1}</span>
                <strong>{label}</strong>
              </li>
            ))}
          </ol>
          <button
            className="secondary-button full-button"
            onClick={() =>
              announce(
                "Cancellation and no-show recovery options opened in preview.",
              )
            }
          >
            Preview cancel / no-show recovery
          </button>
        </section>
      </div>
      <IntegrityNotice kind="simulation" />
    </HrShell>
  );
}

function ScorecardWorkspace() {
  const { assignmentId } = useParams();
  const {
    resolveScorecard,
    scorecardResolved,
    announce,
    persona,
    assignmentRecords: liveAssignments,
    applicationRecords: liveApplications,
  } = usePrototype();
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [briefingTab, setBriefingTab] = useState("Briefing");
  const [amendmentRequested, setAmendmentRequested] = useState(false);
  const [evidence, setEvidence] = useState<string[]>(
    scorecard.map((item) => item.evidence),
  );
  if (!assignmentId) return <RecordList kind="assignments" />;
  const assignment = liveAssignments.find((item) => item.id === assignmentId);
  if (
    !assignment ||
    !visibleAssignments(persona.role, liveAssignments, liveApplications).some(
      (item) => item.id === assignment.id,
    )
  )
    return (
      <HrShell
        title="Scorecard access denied"
        eyebrow={assignmentId}
        screenId="UI-HR-005"
        screen="scorecard"
      >
        <section className="panel access-denied" role="alert">
          <ShieldAlert size={28} />
          <div>
            <h2>Assignment access denied safely</h2>
            <p>
              {persona.role} is not the assigned evidence owner or an authorized
              reviewer.
            </p>
          </div>
          <NavLink className="primary-button" to="/hr/assignments">
            Return to visible scorecards
          </NavLink>
        </section>
      </HrShell>
    );
  const locked =
    submitted || (assignment.id === "ASN-DEMO-001" && scorecardResolved);
  const submit = () => {
    setSaved(true);
    setSubmitted(true);
    if (assignment.id === "ASN-DEMO-001") resolveScorecard();
  };
  return (
    <HrShell
      title="Structured scorecard"
      eyebrow={`Independent interviewer workspace · ${assignment.id}`}
      screenId="UI-HR-005"
      screen="scorecard"
      actions={
        <>
          <span className="autosave-state">
            <Check size={15} />{" "}
            {locked
              ? "Submitted in memory"
              : saved
                ? "Draft saved in memory"
                : "Fixture loaded"}
          </span>
          <button
            className="primary-button"
            disabled={
              locked || evidence.some((item) => item.trim().length < 20)
            }
            onClick={submit}
          >
            {locked ? "Submitted · demo" : "Submit scorecard"}
          </button>
        </>
      }
    >
      <div className="scorecard-brief">
        <div>
          <Pill tone="info">Assignment {assignment.id}</Pill>
          <h2>
            Evidence for {displayCandidateForRole(persona.role, assignment)}
          </h2>
          <p>
            Assess only approved competencies. Do not compare candidates or
            infer protected characteristics.
          </p>
        </div>
        <dl>
          <div>
            <dt>Role</dt>
            <dd>{assignment.job}</dd>
          </div>
          <div>
            <dt>Interviewer</dt>
            <dd>{assignment.interviewer}</dd>
          </div>
          <div>
            <dt>Due</dt>
            <dd>{assignment.due}</dd>
          </div>
        </dl>
      </div>
      <div className="interviewer-briefing">
        <div
          className="briefing-tabs"
          role="tablist"
          aria-label="Interviewer briefing sections"
        >
          {["Briefing", "Candidate context", "Feedback visibility"].map(
            (item) => (
              <button
                role="tab"
                aria-selected={briefingTab === item}
                onClick={() => setBriefingTab(item)}
                key={item}
              >
                {item}
              </button>
            ),
          )}
        </div>
        {briefingTab === "Briefing" && (
          <section>
            <div>
              <span className="eyebrow">Interview objective</span>
              <h2>Portfolio review · accessible systems thinking</h2>
              <p>
                Ask the three approved questions, capture observable evidence,
                and leave the hiring recommendation to the human debrief.
              </p>
            </div>
            <dl>
              <div>
                <dt>Duration</dt>
                <dd>45 minutes</dd>
              </div>
              <div>
                <dt>Your ownership</dt>
                <dd>Systems thinking + accessible design</dd>
              </div>
              <div>
                <dt>Instructions</dt>
                <dd>Do not ask about protected or accommodation information</dd>
              </div>
            </dl>
          </section>
        )}
        {briefingTab === "Candidate context" && (
          <section>
            <div>
              <span className="eyebrow">Minimum necessary context</span>
              <h2>{displayCandidateForRole(persona.role, assignment)}</h2>
              <p>
                Application v5 · synthetic résumé v2 · Senior Product Designer.
                Other applications and restricted notes are not shown.
              </p>
            </div>
            <button
              className="secondary-button"
              onClick={() =>
                announce("Synthetic résumé opened in briefing preview.")
              }
            >
              <FileText size={16} /> Preview résumé
            </button>
          </section>
        )}
        {briefingTab === "Feedback visibility" && (
          <section>
            <div>
              <span className="eyebrow">Independent evidence</span>
              <h2>Other feedback is hidden</h2>
              <p>
                You cannot see other interviewers’ ratings or evidence until
                your own scorecard is submitted. Private fields remain
                restricted afterward.
              </p>
            </div>
            <Pill tone={locked ? "success" : "warning"}>
              {locked
                ? "Submitted · eligible for debrief view"
                : "Blinded until submission"}
            </Pill>
          </section>
        )}
      </div>
      <IntegrityNotice kind="human" />
      <section className="panel scorecard-form">
        <div className="panel-heading">
          <div>
            <h2>Competency evidence</h2>
            <span>Scorecard v4 · independent until submission</span>
          </div>
          <Pill tone={locked ? "success" : "warning"}>
            {locked ? "Locked version" : "Draft"}
          </Pill>
        </div>
        {["Systems thinking", "Accessible design", "Collaboration"].map(
          (competency, groupIndex) => (
            <fieldset
              className="rating-block"
              key={competency}
              disabled={locked}
            >
              <legend>
                <span>{groupIndex + 1}</span>
                {competency}
              </legend>
              <p>
                {groupIndex === 0
                  ? "Connects user, operational and technical constraints into a coherent direction."
                  : groupIndex === 1
                    ? "Identifies barriers and designs robust keyboard, screen-reader and recovery behavior."
                    : "Builds shared understanding and resolves disagreement with evidence."}
              </p>
              <div className="rating-options">
                {[
                  "Insufficient evidence",
                  "Mixed evidence",
                  "Strong evidence",
                ].map((rating) => (
                  <label key={rating}>
                    <input
                      type="radio"
                      name={`rating-${groupIndex}`}
                      defaultChecked={
                        rating ===
                        (groupIndex === 2
                          ? "Mixed evidence"
                          : "Strong evidence")
                      }
                    />
                    <span>{rating}</span>
                  </label>
                ))}
              </div>
              <label className="evidence-input">
                <span>Human-entered evidence</span>
                <textarea
                  value={evidence[groupIndex]}
                  onChange={(event) =>
                    setEvidence((items) =>
                      items.map((item, index) =>
                        index === groupIndex ? event.target.value : item,
                      ),
                    )
                  }
                />
                <small>
                  Synthetic fixture text is prefilled; edit it before submitting
                  the demo.
                </small>
              </label>
            </fieldset>
          ),
        )}
        <div className="scorecard-actions">
          {locked ? (
            <button
              className="secondary-button"
              disabled={amendmentRequested}
              onClick={() => {
                setAmendmentRequested(true);
                announce(
                  "Amendment request created in memory. The submitted version remains unchanged.",
                );
              }}
            >
              {amendmentRequested
                ? "Amendment requested"
                : "Request attributed amendment"}
            </button>
          ) : (
            <button className="secondary-button" onClick={() => setSaved(true)}>
              Save demo draft
            </button>
          )}
          <span>
            {locked
              ? "Submitted evidence is preserved; corrections create a new attributed version."
              : "No network or persistent storage"}
          </span>
        </div>
      </section>
    </HrShell>
  );
}

function DecisionWorkspace() {
  const { applicationId } = useParams();
  const {
    scenarioState,
    announce,
    offerApproved,
    approveOffer,
    persona,
    applicationRecords: liveApplications,
  } = usePrototype();
  const [sentBack, setSentBack] = useState(false);
  const [versionsOpen, setVersionsOpen] = useState(false);
  if (!applicationId) return <RecordList kind="decisions" />;
  const record = liveApplications.find((item) => item.id === applicationId);
  if (
    !record ||
    !visibleApplications(persona.role, liveApplications).some(
      (item) => item.id === record.id,
    ) ||
    (!['APP-DEMO-001', 'APP-DEMO-011'].includes(record.id) &&
      !['Offer', 'Hired'].includes(record.stage))
  )
    return (
      <HrShell
        title="Decision access denied"
        eyebrow={applicationId}
        screenId="UI-HR-006"
        screen="decision"
      >
        <section className="panel access-denied" role="alert">
          <ShieldAlert size={28} />
          <div>
            <h2>Decision subject denied safely</h2>
            <p>
              {persona.role} is not authorized for this decision, offer, or
              handoff population.
            </p>
          </div>
          <NavLink className="primary-button" to="/hr/decisions">
            Return to visible decisions
          </NavLink>
        </section>
      </HrShell>
    );
  const isMaya = record.id === "APP-DEMO-001";
  const blocked = isMaya && scenarioState.decisionState === "Blocked";
  const closed = isMaya && scenarioState.decisionState === "Closed";
  const ready = isMaya && scenarioState.decisionState === "Ready for decision";
  const accepted = isMaya && scenarioState.offerState === "Accepted";
  const approval =
    record.id === "APP-DEMO-011" || record.stage === "Offer" ||
    scenarioState.offerState === "Pending approval";
  const approved = offerApproved && approval;
  const handoffFailed =
    accepted && scenarioState.handoffState === "Reconciliation failed";
  const flow = closed
    ? [
        ["Human decision", "Process closed", "success"],
        ["Offer approval", "Not started", "neutral"],
        ["Candidate response", "Not applicable", "neutral"],
        ["HR handoff", "Not started", "neutral"],
        ["Hired", "Not hired", "neutral"],
      ]
    : blocked
      ? [
          ["Human decision", "Blocked by governed fact", "danger"],
          ["Offer approval", "Not started", "neutral"],
          ["Candidate response", "Not started", "neutral"],
          ["HR handoff", "Not started", "neutral"],
          ["Hired", "Not started", "neutral"],
        ]
      : ready
        ? [
            ["Human decision", "Action required", "warning"],
            ["Offer approval", "Not started", "neutral"],
            ["Candidate response", "Not started", "neutral"],
            ["HR handoff", "Not started", "neutral"],
            ["Hired", "Not started", "neutral"],
          ]
        : approval
          ? [
              ["Human decision", "Complete", "success"],
              [
                "Offer approval",
                approved
                  ? "Approved v4"
                  : sentBack
                    ? "Sent back"
                    : "Action required",
                approved ? "success" : sentBack ? "danger" : "warning",
              ],
              [
                "Candidate response",
                approved ? "Candidate task available" : "Not started",
                approved ? "info" : "neutral",
              ],
              ["HR handoff", "Not started", "neutral"],
              ["Hired", "Not started", "neutral"],
            ]
          : [
              ["Human decision", "Complete", "success"],
              ["Offer approval", "Version 4 approved", "success"],
              ["Candidate response", "Accepted fixture", "success"],
              [
                "HR handoff",
                handoffFailed
                  ? "Reconciliation failed"
                  : "Pending acknowledgement",
                handoffFailed ? "danger" : "warning",
              ],
              ["Hired", "Blocked until ack", "neutral"],
            ];
  const blockerCopy = scenarioState.missingScorecards
    ? `${scenarioState.missingScorecards} required scorecard missing. Offer and opening reservation remain not started.`
    : scenarioState.policyBlocked
      ? "Policy applicability is unresolved. Regulated action remains blocked and owned."
      : "A governed integrity or event-reconciliation fact must be resolved before a human decision.";
  const canApprove = persona.role === "Offer Approver";
  const compensationScope =
    roleDataScopes[persona.role]?.compensation ?? "none";
  const salary = isMaya ? "$164,000 USD" : "$204,000 USD";
  const salaryBand = isMaya ? "$168,000–$196,000 USD" : "$184,000–$224,000 USD";
  const compensationValue =
    compensationScope === "full"
      ? `${salary} · inside band`
      : compensationScope === "band-only"
        ? `${salaryBand} band · exact amount restricted`
        : "Restricted by compensation policy";
  const approve = () => {
    setSentBack(false);
    approveOffer();
  };
  return (
    <HrShell
      title="Decision, offer & handoff"
      eyebrow={`${displayCandidateForRole(persona.role, record)} · ${record.id}`}
      screenId="UI-HR-006"
      screen="decision"
      actions={
        approval && !approved && canApprove ? (
          <>
            <button
              className="secondary-button"
              onClick={() => setSentBack(true)}
            >
              Send back with reason
            </button>
            <button className="primary-button" onClick={approve}>
              Approve current offer
            </button>
          </>
        ) : (
          <button
            className="primary-button"
            disabled={blocked || closed || approved || approval}
            onClick={() =>
              announce(
                ready
                  ? "Human decision preview opened; no outcome was recorded."
                  : "Next governed action preview opened.",
              )
            }
          >
            {closed
              ? "Application closed"
              : blocked
                ? "Decision blocked"
                : approved
                  ? "Offer approved · demo"
                  : approval
                    ? "Approval restricted"
                    : ready
                      ? "Preview human decision"
                      : "Preview next governed action"}
          </button>
        )
      }
    >
      <IntegrityNotice kind="human" />
      <div className="decision-flow" aria-label="Decision and handoff progress">
        {flow.map(([label, state, tone], index) => (
          <div className="decision-step" key={label}>
            <span className={`decision-dot dot-${tone}`}>
              {tone === "success" ? <Check size={15} /> : index + 1}
            </span>
            <div>
              <strong>{label}</strong>
              <small>{state}</small>
            </div>
            {index < 4 && <ArrowRight size={17} />}
          </div>
        ))}
      </div>
      {blocked && (
        <div className="blocking-banner" role="alert">
          <ClipboardCheck size={22} />
          <div>
            <strong>Decision is not ready</strong>
            <span>{blockerCopy}</span>
          </div>
          {scenarioState.missingScorecards > 0 && (
            <NavLink
              className="secondary-button"
              to="/hr/assignments/ASN-DEMO-001"
            >
              Resolve evidence
            </NavLink>
          )}
        </div>
      )}
      {sentBack && !approved && (
        <div className="blocking-banner" role="status">
          <AlertOctagon size={22} />
          <div>
            <strong>Offer sent back in memory</strong>
            <span>
              Compensation clarification is required. The immutable v4 approval
              attempt remains preserved.
            </span>
          </div>
          <button
            className="secondary-button"
            onClick={() => setSentBack(false)}
          >
            Return to approval
          </button>
        </div>
      )}
      {handoffFailed && (
        <div className="blocking-banner">
          <AlertOctagon size={22} />
          <div>
            <strong>Handoff delivery not acknowledged</strong>
            <span>
              The candidate remains Ready for Hire; offer acceptance is never
              equated with Hired.
            </span>
          </div>
          <Pill tone="danger">ERR-009</Pill>
        </div>
      )}
      {approval && (
        <section className="panel approval-workspace">
          <div className="panel-heading">
            <div>
              <h2>Version-bound approval route</h2>
              <span>Ordered policy · material change restarts approval</span>
            </div>
            <Pill tone={approved ? "success" : sentBack ? "danger" : "warning"}>
              {approved
                ? "Approved v4"
                : sentBack
                  ? "Sent back"
                  : "1 action required"}
            </Pill>
          </div>
          <div className="approval-steps">
            {offerApprovalSteps.map((step) => {
              const current = step.id === "APR-DEMO-042";
              const state =
                current && approved
                  ? "Approved"
                  : current && sentBack
                    ? "Sent back"
                    : step.state;
              const tone =
                current && approved
                  ? "success"
                  : current && sentBack
                    ? "danger"
                    : step.tone;
              return (
                <article key={step.id}>
                  <span className={`approval-index ${tone}`}>
                    {state === "Approved" ? (
                      <Check size={15} />
                    ) : (
                      step.id.slice(-1)
                    )}
                  </span>
                  <div>
                    <strong>
                      {step.role} · {step.approver}
                    </strong>
                    <p>{step.detail}</p>
                    <small>
                      {current && approved
                        ? "Approved now · synthetic evidence"
                        : step.time}{" "}
                      · {step.id}
                    </small>
                  </div>
                  <Pill tone={tone}>{state}</Pill>
                </article>
              );
            })}
          </div>
          <div className="approval-policy-facts">
            <span>
              <strong>Policy</strong>OFFER-APPROVAL-v2
            </span>
            <span>
              <strong>Subject fingerprint</strong>sha256:offer-v4…91ad
            </span>
            <span>
              <strong>Quorum</strong>All 3 ordered steps
            </span>
            <span>
              <strong>Escalation</strong>4h then Recruiting lead
            </span>
          </div>
        </section>
      )}
      <div className="decision-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Current offer</h2>
              <span>Immutable version lifecycle</span>
            </div>
            <Pill
              tone={
                accepted || approved
                  ? "success"
                  : approval
                    ? "warning"
                    : "neutral"
              }
            >
              {accepted
                ? "Accepted · demo"
                : approved
                  ? "Approved · candidate task ready"
                  : approval
                    ? "Approval required"
                    : "Not started"}
            </Pill>
          </div>
          <dl className="offer-facts">
            <div>
              <dt>Offer version</dt>
              <dd>
                {accepted || approval
                  ? "v4 · supersedes v3"
                  : "No version created"}
              </dd>
            </div>
            <div>
              <dt>Base salary</dt>
              <dd>
                {accepted || approval ? compensationValue : "Not available"}
              </dd>
            </div>
            <div>
              <dt>Opening reservation</dt>
              <dd>
                {scenarioState.openingReserved
                  ? "OPEN-DEMO-001 · active"
                  : "No reservation"}
              </dd>
            </div>
            <div>
              <dt>Candidate projection</dt>
              <dd>
                {approved
                  ? "Offer ready for review"
                  : accepted
                    ? "Offer accepted"
                    : "No offer action shown"}
              </dd>
            </div>
          </dl>
          <button
            className="secondary-button full-button"
            disabled={!accepted && !approval}
            onClick={() => setVersionsOpen((value) => !value)}
          >
            {versionsOpen
              ? "Hide version comparison"
              : "Compare superseded versions"}
          </button>
          {versionsOpen && (
            <div className="version-comparison">
              <div>
                <strong>v3 · superseded</strong>
                <span>
                  {compensationScope === "full"
                    ? isMaya
                      ? "$160,000 · Sep 15 start"
                      : "$198,000 · Sep 15 start"
                    : "Compensation changed · exact amount restricted"}
                </span>
              </div>
              <ArrowRight size={18} />
              <div>
                <strong>v4 · current</strong>
                <span>
                  {compensationScope === "full"
                    ? `${salary.replace(" USD", "")} · Sep 22 start`
                    : "Current approved band · Sep 22 start"}
                </span>
              </div>
              <small>
                Material fields changed; v3 approvals and response link are
                invalid.
              </small>
            </div>
          )}
        </section>
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Handoff integrity</h2>
              <span>TRN-010 → TRN-011</span>
            </div>
            <Pill
              tone={handoffFailed ? "danger" : accepted ? "warning" : "neutral"}
            >
              {handoffFailed
                ? "Needs reconciliation"
                : accepted
                  ? "Pending acknowledgement"
                  : "Not started"}
            </Pill>
          </div>
          <dl className="fact-list">
            <div>
              <dt>Payload hash</dt>
              <dd>{accepted ? "sha256:demo…7f21" : "Not generated"}</dd>
            </div>
            <div>
              <dt>Idempotency key</dt>
              <dd>{accepted ? "HAND-DEMO-01:v2:deliver" : "Not generated"}</dd>
            </div>
            <div>
              <dt>Destination</dt>
              <dd>HRIS fixture adapter</dd>
            </div>
            <div>
              <dt>Hire state</dt>
              <dd>
                <strong>Not Hired</strong>
              </dd>
            </div>
          </dl>
          <ExplainPanel source="Canonical handoff state · now">
            Hired becomes valid only after the destination acknowledges the
            exact handoff version.
          </ExplainPanel>
        </section>
      </div>
    </HrShell>
  );
}

function AutomationWorkspace() {
  const [paused, setPaused] = useState(false);
  const [simulated, setSimulated] = useState(false);
  const [selectedRuleId, setSelectedRuleId] = useState("AUT-015");
  const [replayed, setReplayed] = useState(false);
  const { announce } = usePrototype();
  const selectedRule =
    automationRuleDetails.find((rule) => rule.id === selectedRuleId) ??
    automationRuleDetails[0];
  return (
    <HrShell
      title="Workflow & automation operations"
      eyebrow="Simulation control plane"
      screenId="UI-HR-007"
      screen="automations"
      actions={
        <>
          <button
            className="secondary-button"
            onClick={() => setSimulated(true)}
          >
            <Gauge size={16} />{" "}
            {simulated ? "Simulation complete" : "Run impact simulation"}
          </button>
          <button
            className={paused ? "primary-button" : "danger-button"}
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? <PlayCircle size={16} /> : <PauseCircle size={16} />}
            {paused ? "Resume demo rules" : "Pause demo rules"}
          </button>
        </>
      }
    >
      <IntegrityNotice kind="simulation" />
      <section className="metric-grid">
        <Metric
          value={paused ? "Paused" : "14 active"}
          label="Pilot rules"
          detail="AUT-003 reserved"
          tone={paused ? "warning" : "success"}
        />
        <Metric value="23" label="Runs today" detail="Fixture ledger" />
        <Metric
          value="1"
          label="Collision predicted"
          detail="Message + stage move"
          tone="danger"
        />
        <Metric
          value="0"
          label="Unowned failures"
          detail="Operations queue"
          tone="success"
        />
      </section>
      {simulated && (
        <div className="simulation-result" role="status">
          <div>
            <CheckCircle2 size={22} />
            <span>
              <strong>Impact simulation complete</strong>23 fixture runs
              evaluated; no action executed.
            </span>
          </div>
          <div className="impact-counts">
            <span>
              <strong>20</strong>eligible
            </span>
            <span>
              <strong>2</strong>suppressed
            </span>
            <span>
              <strong>1</strong>collision
            </span>
          </div>
          <p>
            <strong>Collision:</strong> AUT-008 reminder and a manual
            service-recovery message target the same candidate within quiet
            hours. Keep the manual case; suppress the reminder.
          </p>
        </div>
      )}
      <div className="automation-workbench">
        <section className="panel rule-catalog">
          <div className="panel-heading">
            <div>
              <h2>Rule release catalog</h2>
              <span>Draft → simulate → approve → activate</span>
            </div>
            <Pill tone={paused ? "warning" : "success"}>
              {paused ? "Globally paused · demo" : "Release 1.5 active · demo"}
            </Pill>
          </div>
          <div className="rule-list">
            {automationRuleDetails.map((rule) => (
              <button
                className={`rule-row ${selectedRuleId === rule.id ? "selected" : ""}`}
                aria-pressed={selectedRuleId === rule.id}
                onClick={() => setSelectedRuleId(rule.id)}
                key={rule.id}
              >
                <Bot size={18} />
                <div>
                  <strong>
                    {rule.id} · {rule.name}
                  </strong>
                  <span>{rule.version} · owner: Ops demo</span>
                </div>
                <Pill tone={paused ? "warning" : rule.tone}>
                  {paused ? "Paused" : rule.state}
                </Pill>
                <ArrowRight size={17} />
              </button>
            ))}
          </div>
        </section>
        <section className="panel rule-detail">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Selected rule</span>
              <h2>
                {selectedRule.id} · {selectedRule.name}
              </h2>
            </div>
            <Pill tone={selectedRule.tone}>{selectedRule.state}</Pill>
          </div>
          <div className="eca-flow">
            <div>
              <span>When</span>
              <Workflow size={20} />
              <strong>{selectedRule.event}</strong>
            </div>
            <ArrowRight size={18} />
            <div>
              <span>If</span>
              <ShieldCheck size={20} />
              <strong>{selectedRule.condition}</strong>
            </div>
            <ArrowRight size={18} />
            <div>
              <span>Then</span>
              <Sparkles size={20} />
              <strong>{selectedRule.action}</strong>
            </div>
          </div>
          <dl className="rule-facts">
            <div>
              <dt>Delay / calendar</dt>
              <dd>{selectedRule.delay}</dd>
            </div>
            <div>
              <dt>Cancellation</dt>
              <dd>{selectedRule.cancel}</dd>
            </div>
            <div>
              <dt>Idempotency</dt>
              <dd>sourceId:{selectedRule.version}:semantic-event</dd>
            </div>
            <div>
              <dt>Release</dt>
              <dd>v1.5 · approved fixture manifest</dd>
            </div>
          </dl>
          <div className="version-diff">
            <span>
              <strong>{selectedRule.version}</strong>Current
            </span>
            <ArrowRight size={18} />
            <span>
              <strong>Next draft</strong>No unpublished changes
            </span>
          </div>
          <button
            className="secondary-button full-button"
            onClick={() =>
              announce(
                `${selectedRule.id} release diff opened read-only; no configuration was changed.`,
              )
            }
          >
            Preview version and affected fixtures
          </button>
        </section>
      </div>
      <section className="panel execution-ledger">
        <div className="panel-heading">
          <div>
            <h2>Execution and recovery ledger</h2>
            <span>Replay-safe runs, effects and ownership</span>
          </div>
          <Pill tone="info">All fixture runs</Pill>
        </div>
        <div className="run-list">
          {automationRuns.map((run) => (
            <div className="run-row" key={run.id}>
              <span className={`run-icon run-${run.tone}`}>
                {run.tone === "success" ? (
                  <Check size={16} />
                ) : run.tone === "danger" ? (
                  <AlertOctagon size={16} />
                ) : (
                  <Hand size={16} />
                )}
              </span>
              <div>
                <strong>{run.rule}</strong>
                <span>
                  {run.id} · {run.attempts}
                </span>
                <code>{run.key}</code>
              </div>
              <Pill
                tone={run.id === "RUN-404" && replayed ? "success" : run.tone}
              >
                {run.id === "RUN-404" && replayed
                  ? "Replayed · reconciled"
                  : run.state}
              </Pill>
              {run.id === "RUN-404" && (
                <button
                  className="secondary-button"
                  disabled={replayed}
                  onClick={() => {
                    setReplayed(true);
                    announce(
                      "Failed fixture replayed with the same idempotency key; one effect was reconciled.",
                    );
                  }}
                >
                  {replayed ? "Replay complete" : "Preview replay"}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </HrShell>
  );
}

function AnalyticsWorkspace() {
  const { persona, announce } = usePrototype();
  return (
    <HrShell
      title="Reporting & analytics"
      eyebrow={`${persona.role} · permission-filtered portfolio`}
      screenId="UI-HR-001"
      screen="analytics"
      actions={
        <button
          className="secondary-button"
          onClick={() =>
            announce(
              "Current dashboard report package prepared in memory; no export was created.",
            )
          }
        >
          <BarChart3 size={16} /> Preview report package
        </button>
      }
    >
      <IntegrityNotice kind="simulation" />
      <AnalyticsDashboard role={persona.role} announce={announce} />
    </HrShell>
  );
}

function ReportsWorkspace() {
  const { persona, announce } = usePrototype();
  return (
    <HrShell
      title="Reports & distribution"
      eyebrow={`${persona.role} · governed reporting`}
      screenId="UI-HR-009"
      screen="reports"
      actions={
        <button
          className="secondary-button"
          onClick={() =>
            announce(
              "Report source and distribution contracts opened; no external report was sent.",
            )
          }
        >
          <FileBarChart2 size={16} /> Reporting controls
        </button>
      }
    >
      <IntegrityNotice kind="simulation" />
      <ReportWorkspace />
    </HrShell>
  );
}

function ObjectsWorkspace() {
  const { persona } = usePrototype();
  return (
    <HrShell
      title="Object workspace"
      eyebrow={`${persona.role} · row and field scoped`}
      screenId="UI-HR-010"
      screen="objects"
    >
      <IntegrityNotice kind="simulation" />
      <ObjectWorkspace />
    </HrShell>
  );
}

function GovernanceWorkspace() {
  const [tab, setTab] = useState("Policy gates");
  const { announce } = usePrototype();
  const tabs = [
    "Policy gates",
    "Privacy requests",
    "Access",
    "Object & data contract",
    "Audit evidence",
  ];
  return (
    <HrShell
      title="Privacy, policy, security & audit"
      eyebrow="Restricted administration"
      screenId="UI-HR-008"
      screen="governance"
      actions={
        <button
          className="secondary-button"
          onClick={() =>
            announce("Evidence export prepared in memory; no file was created.")
          }
        >
          <History size={16} /> Export evidence preview
        </button>
      }
    >
      <IntegrityNotice kind="restricted" />
      <div
        className="governance-tabs"
        role="tablist"
        aria-label="Governance sections"
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
      {tab === "Policy gates" && (
        <div className="governance-grid">
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2>Jurisdiction evaluation</h2>
                <span>Publication gate · policy v2</span>
              </div>
              <Pill tone="danger">1 blocked</Pill>
            </div>
            <div className="policy-case">
              <span className="policy-icon">
                <Scale size={20} />
              </span>
              <div>
                <strong>CASE-DEMO-012 · unknown work location</strong>
                <p>
                  Job reach conflicts with the California-only synthetic pilot
                  rule.
                </p>
                <div className="chip-row">
                  <Pill tone="danger">ERR-008</Pill>
                  <Pill>Owner: Legal demo queue</Pill>
                </div>
              </div>
              <button
                className="secondary-button"
                onClick={() =>
                  announce(
                    "Policy facts opened read-only; no override is available.",
                  )
                }
              >
                Review facts
              </button>
            </div>
            <ExplainPanel source="Policy evaluation v12">
              Unknown applicability never defaults to allowed.
            </ExplainPanel>
          </section>
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2>Provider registry</h2>
                <span>All adapters disabled</span>
              </div>
              <Pill tone="success">No external calls</Pill>
            </div>
            {[
              ["Email", "Fixture renderer"],
              ["Calendar", "ICS preview adapter"],
              ["HRIS", "Handoff fixture adapter"],
            ].map(([purpose, provider]) => (
              <div className="provider-row" key={purpose}>
                <Link2 size={17} />
                <div>
                  <strong>{purpose}</strong>
                  <span>{provider}</span>
                </div>
                <Pill tone="neutral">Disabled</Pill>
              </div>
            ))}
          </section>
        </div>
      )}
      {tab === "Privacy requests" && (
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Privacy request fixtures</h2>
              <span>No real identity verification or execution</span>
            </div>
            <Pill tone="warning">3 active fixtures</Pill>
          </div>
          <div
            className="privacy-table"
            role="table"
            aria-label="Synthetic privacy requests"
          >
            <div className="privacy-row privacy-head" role="row">
              <span role="columnheader">Request</span>
              <span role="columnheader">Person</span>
              <span role="columnheader">Type</span>
              <span role="columnheader">Received</span>
              <span role="columnheader">Due</span>
              <span role="columnheader">Owner</span>
              <span role="columnheader">State</span>
            </div>
            {privacyRequests.map((item) => (
              <div className="privacy-row" role="row" key={item.id}>
                <strong role="cell" data-label="Request">
                  {item.id}
                </strong>
                <span role="cell" data-label="Person">
                  {item.person}
                </span>
                <span role="cell" data-label="Type">
                  {item.type}
                </span>
                <span role="cell" data-label="Received">
                  {item.received}
                </span>
                <span role="cell" data-label="Due">
                  {item.due}
                </span>
                <span role="cell" data-label="Owner">
                  {item.owner}
                </span>
                <span role="cell" data-label="State">
                  <Pill tone="warning">{item.state}</Pill>
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
      {tab === "Access" && (
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Negative-access demonstrations</h2>
              <span>Least-privilege fixtures</span>
            </div>
            <Pill tone="success">6 of 6 safe</Pill>
          </div>
          <div className="access-matrix">
            {[
              ["Recruiter", "Compensation approval", false],
              ["Interviewer", "Other scorecards", false],
              ["Support", "Application evidence", false],
              ["Approver", "Medical/accommodation", false],
              ["Candidate", "Internal stage/reason", false],
              ["Restricted admin", "Minimized audit event", true],
            ].map(([role, resource, allowed]) => (
              <div key={`${role}-${resource}`}>
                <span>{role}</span>
                <strong>{resource}</strong>
                <Pill tone={allowed ? "success" : "neutral"}>
                  {allowed ? "Allowed" : "Denied safely"}
                </Pill>
              </div>
            ))}
          </div>
        </section>
      )}
      {tab === "Object & data contract" && (
        <ObjectDataStudio announce={announce} />
      )}
      {tab === "Audit evidence" && (
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Minimized audit events</h2>
              <span>Generated fixture evidence</span>
            </div>
            <Freshness>Ledger snapshot · now</Freshness>
          </div>
          <div
            className="audit-table"
            role="table"
            aria-label="Audit fixture events"
          >
            <div role="row" className="audit-head">
              <span role="columnheader">Time</span>
              <span role="columnheader">Actor</span>
              <span role="columnheader">Event</span>
              <span role="columnheader">Outcome</span>
              <span role="columnheader">Reference</span>
            </div>
            {auditEvents.map((event) => (
              <div role="row" key={event.ref}>
                <span role="cell" data-label="Time">
                  {event.time}
                </span>
                <span role="cell" data-label="Actor">
                  {event.actor}
                </span>
                <span role="cell" data-label="Event">
                  {event.event}
                </span>
                <span role="cell" data-label="Outcome">
                  <Pill
                    tone={
                      event.outcome.includes("Denied") ? "neutral" : "success"
                    }
                  >
                    {event.outcome}
                  </Pill>
                </span>
                <code role="cell" data-label="Reference">
                  {event.ref}
                </code>
              </div>
            ))}
          </div>
        </section>
      )}
    </HrShell>
  );
}

function OnboardingWorkspace() {
  const { announce } = usePrototype();
  return (
    <HrShell
      title="Onboarding command center"
      eyebrow="Pre-hire, new-hire and worker transition"
      screenId="UI-HR-011"
      screen="onboarding"
      actions={
        <>
          <NavLink className="secondary-button" to="/preboarding">
            New-hire view
          </NavLink>
          <button
            className="primary-button"
            onClick={() =>
              announce(
                "Plan assignment preview opened. No onboarding plan was assigned.",
              )
            }
          >
            Assignment policy
          </button>
        </>
      }
    >
      <OnboardingOperations announce={announce} />
    </HrShell>
  );
}

function TalentWorkspace() {
  const { announce } = usePrototype();
  return (
    <HrShell
      title="Talent growth workspace"
      eyebrow="CRM, campaigns, distribution and mobility"
      screenId="UI-HR-012"
      screen="talent"
      actions={
        <button
          className="primary-button"
          onClick={() =>
            announce(
              "Create flow opened in preview with purpose, consent and audience gates.",
            )
          }
        >
          <Plus size={15} /> Create
        </button>
      }
    >
      <TalentGrowthWorkspace announce={announce} />
    </HrShell>
  );
}

function PlatformWorkspace() {
  const { announce } = usePrototype();
  return (
    <HrShell
      title="Platform control center"
      eyebrow="Identity, integrations, data and security"
      screenId="UI-HR-013"
      screen="platform"
      actions={
        <button
          className="secondary-button"
          onClick={() =>
            announce(
              "Evidence export preview opened. No production control was marked complete.",
            )
          }
        >
          <FileText size={15} /> Evidence pack
        </button>
      }
    >
      <PlatformControlWorkspace announce={announce} />
    </HrShell>
  );
}

function RecruitmentDepth({ screen }: { screen: "cases" | "high-volume" }) {
  const { announce } = usePrototype();
  return (
    <HrShell
      title={screen === "cases" ? "Assessment and screening operations" : "Scaled recruiting operations"}
      eyebrow={screen === "cases" ? "Assessment, reference, background and adverse action" : "Evergreen, campus, event and seasonal cohorts"}
      screenId={screen === "cases" ? "UI-HR-014" : "UI-HR-015"}
      screen={screen}
      actions={
        <button className="secondary-button" onClick={() => announce("Controlled workflow preview opened with version, population, owner and failure-state evidence.")}>
          <FileText size={15} /> Review contract
        </button>
      }
    >
      <RecruitmentDepthWorkspace />
    </HrShell>
  );
}

export function HrWorkspace({ screen }: { screen: HrScreen }) {
  if (screen === "actions") return <ActionCenter />;
  if (screen === "analytics") return <AnalyticsWorkspace />;
  if (screen === "reports") return <ReportsWorkspace />;
  if (screen === "objects") return <ObjectsWorkspace />;
  if (screen === "job") return <JobWorkspace />;
  if (screen === "candidate") return <CandidateWorkspace />;
  if (screen === "application") return <ApplicationWorkspace />;
  if (screen === "interview") return <InterviewWorkspace />;
  if (screen === "scorecard") return <ScorecardWorkspace />;
  if (screen === "decision") return <DecisionWorkspace />;
  if (screen === "onboarding") return <OnboardingWorkspace />;
  if (screen === "talent") return <TalentWorkspace />;
  if (screen === "cases") return <RecruitmentDepth screen="cases" />;
  if (screen === "high-volume") return <RecruitmentDepth screen="high-volume" />;
  if (screen === "platform") return <PlatformWorkspace />;
  if (screen === "automations") return <AutomationWorkspace />;
  return <GovernanceWorkspace />;
}
