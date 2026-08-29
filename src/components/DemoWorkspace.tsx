import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Boxes,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleDot,
  Database,
  FileClock,
  FileOutput,
  GitBranch,
  History,
  ListChecks,
  Mail,
  PanelBottomOpen,
  Play,
  RefreshCcw,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  UserRoundCog,
  UsersRound,
  X,
} from "lucide-react";
import {
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  businessUseCases,
  demoJourneySummary,
  demoPacks,
  getBusinessUseCase,
  journeyCatalog,
  type BusinessUseCase,
  type DemoStep,
} from "../data/demoJourneys";
import { useDemo } from "../prototype/DemoContext";
import { Pill, PrototypeBanner } from "./Common";

const demoTabs = [
  ["/demo", "Command center", Route],
  ["/demo/workbench", "v3.2 workbenches", Boxes],
  ["/demo/catalog", "84-journey catalogue", ListChecks],
  ["/demo/evidence", "Session evidence", History],
] as const;

export function DemoShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="demo-studio">
      <PrototypeBanner />
      <header className="demo-studio-header">
        <NavLink end className="demo-studio-brand" to="/demo">
          <span><GitBranch size={22} /></span>
          <span>
            <strong>Demo Journey Studio</strong>
            <small>Business use cases · data flows · guided handoffs</small>
          </span>
        </NavLink>
        <nav aria-label="Demo studio navigation">
          {demoTabs.map(([to, label, Icon]) => (
            <NavLink end={to === "/demo"} to={to} key={to}>
              <Icon size={15} /> {label}
            </NavLink>
          ))}
        </nav>
        <NavLink className="demo-exit" to="/hr/action-center">
          Exit to product <ArrowRight size={15} />
        </NavLink>
      </header>
      <main id="main-content" className="demo-studio-main">
        {children}
      </main>
      <footer className="demo-studio-footer">
        <ShieldCheck size={18} />
        <span>
          <strong>Presentation-safe synthetic environment</strong>
          Browser-memory fixtures only. No message, signature, identity,
          provider, database or external-system effect is executed.
        </span>
      </footer>
    </div>
  );
}

function DemoMetrics() {
  const metrics = [
    [String(demoJourneySummary.businessUseCases), "Business-use-case DFDs", GitBranch],
    [String(demoJourneySummary.journeyUnits), "Mapped journey units", Route],
    [String(demoJourneySummary.steps), "Guided handoff steps", ListChecks],
    [String(demoJourneySummary.demoPacks), "Audience demo packs", UsersRound],
    ["13", "Actor personas", UserRoundCog],
    ["0", "External writes", ShieldCheck],
  ] as const;
  return (
    <section className="demo-metric-grid" aria-label="Demo coverage summary">
      {metrics.map(([value, label, Icon]) => (
        <article key={label}>
          <Icon size={18} />
          <strong>{value}</strong>
          <span>{label}</span>
        </article>
      ))}
    </section>
  );
}

function CommandCenter() {
  const navigate = useNavigate();
  const { launchUseCase, activeUseCase, receipts } = useDemo();
  const [packId, setPackId] = useState<string>("executive");
  const selectedPack =
    demoPacks.find((pack) => pack.id === packId) ?? demoPacks[0];
  const selectedFlows = selectedPack.useCaseIds
    .map((id) => getBusinessUseCase(id))
    .filter((item): item is BusinessUseCase => Boolean(item));
  const start = (useCase: BusinessUseCase, variant: "happy" | "exception") => {
    launchUseCase(useCase.id, variant);
    navigate(useCase.steps[0].route);
  };
  return (
    <>
      <section className="demo-hero">
        <div>
          <span className="eyebrow">Deterministic demo operating layer</span>
          <h1>Show the business journey, the data movement and the proof.</h1>
          <p>
            Every use case starts from a known synthetic state, hands the same
            record across personas, records action receipts and exposes both
            the happy path and its controlled recovery path.
          </p>
          <div className="demo-hero-actions">
            <button
              className="demo-primary"
              onClick={() => start(selectedFlows[0], "happy")}
            >
              <Play size={16} /> Start {selectedPack.title}
            </button>
            <NavLink className="demo-secondary" to="/demo/catalog">
              Review all journeys <ArrowRight size={15} />
            </NavLink>
          </div>
        </div>
        <aside>
          <span className="eyebrow">Current session</span>
          <strong>{activeUseCase?.code ?? "No live journey"}</strong>
          <p>
            {activeUseCase?.title ??
              "Choose a demo pack or open a business data-flow diagram."}
          </p>
          <small>{receipts.length} synthetic action receipts recorded</small>
          {activeUseCase && (
            <NavLink to={`/demo/flows/${activeUseCase.id}`}>
              Open active data flow <ArrowRight size={14} />
            </NavLink>
          )}
        </aside>
      </section>
      <DemoMetrics />

      <section className="demo-section">
        <div className="demo-section-heading">
          <div>
            <span className="eyebrow">Audience-ready narratives</span>
            <h2>Eight demo packs</h2>
            <p>
              Select an audience pack, then launch its business flows in order
              or rehearse one flow independently.
            </p>
          </div>
          <label className="demo-select">
            <span>Selected pack</span>
            <select value={packId} onChange={(event) => setPackId(event.target.value)}>
              {demoPacks.map((pack) => (
                <option value={pack.id} key={pack.id}>{pack.title}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="demo-pack-grid">
          {demoPacks.map((pack) => (
            <button
              className={pack.id === selectedPack.id ? "selected" : ""}
              onClick={() => setPackId(pack.id)}
              key={pack.id}
            >
              <span>
                <strong>{pack.title}</strong>
                <small>{pack.audience} · {pack.duration}</small>
              </span>
              <p>{pack.purpose}</p>
              <em>{pack.useCaseIds.length} connected business flows</em>
            </button>
          ))}
        </div>
      </section>

      <section className="demo-section selected-demo-pack">
        <div className="demo-section-heading">
          <div>
            <span className="eyebrow">{selectedPack.audience}</span>
            <h2>{selectedPack.title}</h2>
            <p>{selectedPack.purpose} · target duration {selectedPack.duration}</p>
          </div>
          <Pill tone="info">{selectedFlows.length} flows</Pill>
        </div>
        <ol className="demo-run-order">
          {selectedFlows.map((useCase, index) => (
            <li key={useCase.id}>
              <span className="demo-order">{index + 1}</span>
              <div>
                <strong>{useCase.code} · {useCase.title}</strong>
                <small>{useCase.objective}</small>
                <span>{useCase.steps.length} handoffs · {useCase.journeyUnits.length} journey units</span>
              </div>
              <NavLink className="demo-secondary" to={`/demo/flows/${useCase.id}`}>
                View DFD
              </NavLink>
              <button className="demo-primary" onClick={() => start(useCase, "happy")}>
                Start
              </button>
            </li>
          ))}
        </ol>
      </section>

      <section className="demo-section">
        <div className="demo-section-heading">
          <div>
            <span className="eyebrow">Level-one data-flow catalogue</span>
            <h2>All business use cases</h2>
            <p>
              Each diagram identifies actors, processes, input/output data,
              stores, evidence, exceptions and the live wireframe destination.
            </p>
          </div>
        </div>
        <div className="flow-card-grid">
          {businessUseCases.map((useCase) => (
            <article key={useCase.id}>
              <header>
                <span>{useCase.code}</span>
                <Pill tone="success">Diagram ready</Pill>
              </header>
              <h3>{useCase.title}</h3>
              <p>{useCase.objective}</p>
              <dl>
                <div><dt>Journey units</dt><dd>{useCase.journeyUnits.length}</dd></div>
                <div><dt>Handoffs</dt><dd>{useCase.steps.length}</dd></div>
                <div><dt>Objects</dt><dd>{useCase.objects.length}</dd></div>
              </dl>
              <div>
                <NavLink to={`/demo/flows/${useCase.id}`}>Open data flow</NavLink>
                <button onClick={() => start(useCase, "exception")}>Rehearse exception</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function DataFlowRow({
  step,
  index,
  useCase,
}: {
  step: DemoStep;
  index: number;
  useCase: BusinessUseCase;
}) {
  const navigate = useNavigate();
  const { activeUseCaseId, demoStepIndex, completedStepIds, goToStep, demoVariant } = useDemo();
  const isActive = activeUseCaseId === useCase.id && demoStepIndex === index;
  const isComplete = completedStepIds.includes(step.id);
  const open = () => {
    const route = goToStep(index);
    if (route) navigate(route);
  };
  return (
    <article className={`dfd-flow-row ${isActive ? "active" : ""} ${isComplete ? "complete" : ""}`}>
      <div className="dfd-entity">
        <UsersRound size={18} />
        <span><small>External entity</small><strong>{step.actor}</strong></span>
      </div>
      <div className="dfd-arrow">
        <span>{step.dataIn}</span><ArrowRight size={18} />
      </div>
      <button className="dfd-process" onClick={open}>
        <span>{index + 1}.0</span>
        <strong>{step.process}</strong>
        <small>{step.instruction}</small>
        {isComplete && <CheckCircle2 size={18} />}
      </button>
      <div className="dfd-arrow">
        <span>{demoVariant === "happy" ? step.dataOut : step.exception}</span>
        <ArrowRight size={18} />
      </div>
      <div className="dfd-store">
        <Database size={18} />
        <span><small>Data store</small><strong>{step.store}</strong></span>
      </div>
    </article>
  );
}

function FlowDetail({ useCase }: { useCase: BusinessUseCase }) {
  const navigate = useNavigate();
  const {
    activeUseCaseId,
    demoVariant,
    launchUseCase,
    setDemoVariant,
    receipts,
  } = useDemo();
  const isActive = activeUseCaseId === useCase.id;
  const launch = (variant: "happy" | "exception") => {
    launchUseCase(useCase.id, variant);
    navigate(useCase.steps[0].route);
  };
  const flowReceipts = receipts.filter((receipt) => receipt.useCaseId === useCase.id);
  return (
    <>
      <NavLink className="demo-back" to="/demo">
        <ArrowLeft size={15} /> Demo command center
      </NavLink>
      <section className="flow-detail-hero">
        <div>
          <span className="eyebrow">{useCase.code} · {useCase.domain}</span>
          <h1>{useCase.title}</h1>
          <p>{useCase.objective}</p>
          <div className="flow-actor-list">
            {useCase.actors.map((actor) => <span key={actor}>{actor}</span>)}
          </div>
        </div>
        <aside>
          <span className="eyebrow">Demo contract</span>
          <dl>
            <div><dt>Audience</dt><dd>{useCase.audience}</dd></div>
            <div><dt>Duration</dt><dd>{useCase.duration}</dd></div>
            <div><dt>Scenario</dt><dd>{useCase.scenarioId}</dd></div>
            <div><dt>Journey units</dt><dd>{useCase.journeyUnits.length}</dd></div>
          </dl>
          <div className="flow-launch-actions">
            <button className="demo-primary" onClick={() => launch("happy")}>
              <Play size={15} /> Start happy path
            </button>
            <button className="demo-secondary" onClick={() => launch("exception")}>
              <AlertTriangle size={15} /> Start exception
            </button>
          </div>
        </aside>
      </section>

      <section className="demo-section dfd-section">
        <div className="demo-section-heading">
          <div>
            <span className="eyebrow">Business use case as a level-one data-flow diagram</span>
            <h2>Actor → process → governed data store</h2>
            <p>
              Select any process to hand the live demonstration to its actor
              and open the corresponding wireframe destination.
            </p>
          </div>
          <div className="demo-variant-toggle" aria-label="Data-flow variant">
            <button
              className={demoVariant === "happy" ? "active" : ""}
              onClick={() => setDemoVariant("happy")}
            >Happy path</button>
            <button
              className={demoVariant === "exception" ? "active" : ""}
              onClick={() => setDemoVariant("exception")}
            >Exception & recovery</button>
          </div>
        </div>
        <div className="dfd-legend" aria-label="Data-flow diagram legend">
          <span><UsersRound size={14} /> External entity</span>
          <span><CircleDot size={14} /> Business process</span>
          <span><Database size={14} /> Governed store</span>
          <span><ArrowRight size={14} /> Named data flow</span>
          <span><FileOutput size={14} /> Evidence receipt</span>
        </div>
        <figure className="dfd-canvas">
          <figcaption>{useCase.code} · {useCase.title}</figcaption>
          {useCase.steps.map((item, index) => (
            <DataFlowRow step={item} index={index} useCase={useCase} key={item.id} />
          ))}
          <div className="dfd-outcome">
            <CheckCircle2 size={22} />
            <span><small>Business outcome</small><strong>{useCase.outcome}</strong></span>
          </div>
        </figure>
      </section>

      <div className="flow-support-grid">
        <section className="demo-section">
          <div className="demo-section-heading compact">
            <div><span className="eyebrow">Scope</span><h2>{useCase.journeyUnits.length} journey units</h2></div>
          </div>
          <ol className="journey-unit-list">
            {useCase.journeyUnits.map((journey, index) => (
              <li key={journey.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><strong>{journey.title}</strong><small>{journey.actor} · {journey.outcome}</small></div>
                <NavLink to={journey.route}>Open</NavLink>
              </li>
            ))}
          </ol>
        </section>
        <section className="demo-section flow-contract-panel">
          <div className="demo-section-heading compact">
            <div><span className="eyebrow">Data contract</span><h2>Objects, stores and communication</h2></div>
          </div>
          <div className="flow-contract-block">
            <h3><Boxes size={16} /> Business objects</h3>
            <div>{useCase.objects.map((item) => <span key={item}>{item}</span>)}</div>
          </div>
          <div className="flow-contract-block">
            <h3><Database size={16} /> Governed stores</h3>
            <ul>{useCase.dataStores.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className="flow-contract-block communication-preview">
            <h3><Mail size={16} /> Synthetic communication previews</h3>
            <ul>{useCase.communications.map((item) => <li key={item}>{item}<small>Preview only · never sent</small></li>)}</ul>
          </div>
          <div className="flow-contract-block">
            <h3><History size={16} /> Current session evidence</h3>
            <strong>{flowReceipts.length} receipts</strong>
            <span>{isActive ? "This flow is active in presenter mode." : "Launch this flow to begin a deterministic evidence trail."}</span>
          </div>
        </section>
      </div>
    </>
  );
}

function JourneyCatalogue() {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("All domains");
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return journeyCatalog.filter((journey) => {
      const useCase = getBusinessUseCase(journey.useCaseId);
      const matchesDomain = domain === "All domains" || useCase?.domain === domain;
      const matchesQuery = !needle || `${journey.id} ${journey.title} ${journey.actor} ${journey.outcome} ${journey.useCaseTitle}`.toLowerCase().includes(needle);
      return matchesDomain && matchesQuery;
    });
  }, [domain, query]);
  return (
    <>
      <section className="catalogue-hero">
        <div><span className="eyebrow">Demo coverage matrix</span><h1>All 84 showcase journey units</h1><p>Every journey is mapped to a business-use-case DFD, actor, live route and visible business outcome.</p></div>
        <Pill tone="info">{visible.length} visible</Pill>
      </section>
      <section className="demo-section">
        <div className="catalogue-toolbar">
          <label><Search size={16} /><span className="sr-only">Search journeys</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search journey, actor, object or outcome" /></label>
          <label><span className="sr-only">Filter journey domain</span><select value={domain} onChange={(event) => setDomain(event.target.value)}><option>All domains</option>{businessUseCases.map((useCase) => <option key={useCase.domain}>{useCase.domain}</option>)}</select></label>
        </div>
        <div className="journey-catalogue-table" role="table" aria-label="Demo journey catalogue">
          <div className="journey-catalogue-head" role="row"><span role="columnheader">Journey</span><span role="columnheader">Actor</span><span role="columnheader">Business flow</span><span role="columnheader">Outcome</span><span role="columnheader">Wireframe</span></div>
          {visible.map((journey) => (
            <div role="row" key={journey.id}>
              <span role="cell"><strong>{journey.id}</strong><small>{journey.title}</small></span>
              <span role="cell">{journey.actor}</span>
              <span role="cell"><NavLink to={`/demo/flows/${journey.useCaseId}`}>{journey.useCaseTitle}</NavLink></span>
              <span role="cell">{journey.outcome}</span>
              <span role="cell"><NavLink className="catalogue-open" to={journey.route}>Open <ArrowRight size={13} /></NavLink></span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function EvidenceLedger() {
  const { receipts, activeUseCase, restartUseCase } = useDemo();
  const navigate = useNavigate();
  const restart = () => {
    const route = restartUseCase();
    if (route) navigate(route);
  };
  return (
    <>
      <section className="catalogue-hero">
        <div><span className="eyebrow">Browser-memory audit</span><h1>Demo session evidence ledger</h1><p>Each guided handoff records the actor, process, result, data store, variant and deterministic demo time.</p></div>
        <div className="evidence-actions">
          {activeUseCase && <button className="demo-secondary" onClick={restart}><RefreshCcw size={15} /> Restart active flow</button>}
          <Pill tone={receipts.length ? "success" : "neutral"}>{receipts.length} receipts</Pill>
        </div>
      </section>
      <section className="demo-section">
        {receipts.length === 0 ? (
          <div className="demo-empty-state"><FileClock size={30} /><h2>No demo receipts yet</h2><p>Start a business flow from the command center. The ledger will preserve each synthetic action and handoff for this browser session.</p><NavLink className="demo-primary" to="/demo">Choose a demo</NavLink></div>
        ) : (
          <div className="evidence-ledger" role="table" aria-label="Demo action receipts">
            <div role="row" className="evidence-ledger-head"><span role="columnheader">Receipt / time</span><span role="columnheader">Actor / step</span><span role="columnheader">Action</span><span role="columnheader">Outcome</span><span role="columnheader">Data store</span></div>
            {[...receipts].reverse().map((receipt) => (
              <div role="row" key={receipt.id}>
                <span role="cell"><strong>{receipt.id}</strong><small>{receipt.at}</small></span>
                <span role="cell"><strong>{receipt.actor}</strong><small>{receipt.stepId} · {receipt.useCaseId}</small></span>
                <span role="cell">{receipt.action}</span>
                <span role="cell"><Pill tone={receipt.variant === "happy" ? "success" : "warning"}>{receipt.variant}</Pill><small>{receipt.outcome}</small></span>
                <span role="cell">{receipt.dataStore}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export function DemoWorkspace() {
  const location = useLocation();
  const { useCaseId } = useParams();
  const selected = getBusinessUseCase(useCaseId);
  let content: React.ReactNode = <CommandCenter />;
  if (location.pathname === "/demo/catalog") content = <JourneyCatalogue />;
  else if (location.pathname === "/demo/evidence") content = <EvidenceLedger />;
  else if (location.pathname.startsWith("/demo/flows/"))
    content = selected ? (
      <FlowDetail useCase={selected} />
    ) : (
      <section className="demo-empty-state"><AlertTriangle size={30} /><h1>Business flow not found</h1><p>The flow identifier is stale or outside the deterministic catalogue.</p><NavLink className="demo-primary" to="/demo">Return to command center</NavLink></section>
    );
  return <DemoShell>{content}</DemoShell>;
}

export function DemoDock() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    activeUseCase,
    activeStep,
    demoStepIndex,
    demoVariant,
    completedStepIds,
    presenterOpen,
    setPresenterOpen,
    goToStep,
    completeCurrentStep,
    restartUseCase,
    closeDemo,
  } = useDemo();
  if (location.pathname.startsWith("/demo")) return null;
  if (!activeUseCase || !activeStep) {
    return (
      <NavLink className="demo-floating-launcher" to="/demo">
        <GitBranch size={17} /> Demo journeys
      </NavLink>
    );
  }
  const openStep = (index: number) => {
    const route = goToStep(index);
    if (route) navigate(route);
  };
  const completeAndContinue = () => {
    const route = completeCurrentStep();
    if (route) navigate(route);
    else navigate("/demo/evidence");
  };
  const restart = () => {
    const route = restartUseCase();
    if (route) navigate(route);
  };
  if (!presenterOpen) {
    return (
      <button className="demo-floating-launcher active" onClick={() => setPresenterOpen(true)}>
        <PanelBottomOpen size={17} /> {activeUseCase.code} · step {demoStepIndex + 1}
      </button>
    );
  }
  const progress = Math.round((completedStepIds.length / activeUseCase.steps.length) * 100);
  return (
    <aside className="demo-presenter-dock" aria-label="Guided demo presenter">
      <header>
        <span><Sparkles size={16} /><strong>{activeUseCase.code}</strong> {activeUseCase.title}</span>
        <div>
          <Pill tone={demoVariant === "happy" ? "success" : "warning"}>{demoVariant === "happy" ? "Happy path" : "Exception"}</Pill>
          <button aria-label="Collapse presenter" onClick={() => setPresenterOpen(false)}><ChevronDown size={17} /></button>
          <button aria-label="Close guided demo" onClick={closeDemo}><X size={17} /></button>
        </div>
      </header>
      <div className="demo-presenter-progress"><span style={{ width: `${progress}%` }} /></div>
      <div className="demo-presenter-body">
        <div className="demo-presenter-step">
          <span>Step {demoStepIndex + 1} of {activeUseCase.steps.length} · {activeStep.actor}</span>
          <strong>{activeStep.process}</strong>
          <p>{activeStep.instruction}</p>
        </div>
        <div className="demo-presenter-change">
          <span>{demoVariant === "happy" ? "Expected receipt" : "Exception and recovery"}</span>
          <strong>{demoVariant === "happy" ? activeStep.receipt : activeStep.exception}</strong>
          <small>{activeStep.dataIn} → {activeStep.dataOut} → {activeStep.store}</small>
        </div>
        <div className="demo-presenter-actions">
          <NavLink to={`/demo/flows/${activeUseCase.id}`}><GitBranch size={14} /> DFD</NavLink>
          <button onClick={restart}><RefreshCcw size={14} /> Reset</button>
          <button disabled={demoStepIndex === 0} onClick={() => openStep(demoStepIndex - 1)}><ArrowLeft size={14} /> Previous</button>
          <button onClick={() => openStep(demoStepIndex)}><BookOpenCheck size={14} /> Open step</button>
          <button className="demo-presenter-next" onClick={completeAndContinue}>
            <Check size={14} /> {demoStepIndex === activeUseCase.steps.length - 1 ? "Complete journey" : "Record & hand off"}
          </button>
        </div>
      </div>
    </aside>
  );
}
