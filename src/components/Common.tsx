import {
  AlertTriangle,
  Beaker,
  Check,
  ChevronRight,
  Clock3,
  Database,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { usePrototype } from "../prototype/PrototypeContext";
import { resolveScenarioState, type Tone } from "../data/fixtures";

export function PrototypeBanner() {
  return (
    <div className="prototype-banner" role="status">
      <span>
        <Beaker size={15} aria-hidden="true" /> Synthetic prototype
      </span>
      <span>
        No real jobs, people, authentication, uploads or external writes.
      </span>
      <span className="banner-release">v1.7 object + reporting contract</span>
    </div>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

export function Freshness({
  children = "Fixture snapshot · 3 min ago",
}: {
  children?: React.ReactNode;
}) {
  return (
    <span className="freshness">
      <Clock3 size={13} aria-hidden="true" /> {children}
    </span>
  );
}

export function ScenarioControl({
  compact = false,
  audience = "internal",
}: {
  compact?: boolean;
  audience?: "candidate" | "internal";
}) {
  const { scenario, scenarioState, scenarios, setScenarioId, resetPrototype } =
    usePrototype();
  const safeLabel = (id: string) => resolveScenarioState(id).candidateLabel;
  return (
    <section
      className={`scenario-control ${compact ? "compact" : ""}`}
      aria-labelledby="scenario-heading"
    >
      <div className="scenario-icon">
        <Sparkles size={18} aria-hidden="true" />
      </div>
      <div className="scenario-copy">
        <span className="eyebrow" id="scenario-heading">
          {audience === "candidate"
            ? "Candidate-safe demo state"
            : "Scenario laboratory"}
        </span>
        <strong>
          {audience === "candidate"
            ? scenarioState.candidateLabel
            : `${scenario.id} · ${scenario.label}`}
        </strong>
        {!compact && (
          <p>
            {audience === "candidate"
              ? "Changes only the safe status a candidate may see. Internal evaluation remains hidden."
              : scenario.expected}
          </p>
        )}
      </div>
      <label className="scenario-select">
        <span className="sr-only">Choose synthetic scenario</span>
        <select
          value={scenario.id}
          onChange={(event) => setScenarioId(event.target.value)}
        >
          {scenarios.map((item) => (
            <option value={item.id} key={item.id}>
              {audience === "candidate"
                ? safeLabel(item.id)
                : `${item.id} · ${item.label}`}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        className="icon-button"
        onClick={resetPrototype}
        aria-label="Reset prototype state"
        title="Reset prototype state"
      >
        <RefreshCcw size={16} aria-hidden="true" />
      </button>
    </section>
  );
}

export function ExplainPanel({
  title = "Why this is here",
  children,
  source,
}: {
  title?: string;
  children: React.ReactNode;
  source?: string;
}) {
  return (
    <div className="explain-panel" role="note">
      <div className="explain-icon">
        <Database size={16} aria-hidden="true" />
      </div>
      <div>
        <strong>{title}</strong>
        <p>{children}</p>
        {source && <Freshness>{source}</Freshness>}
      </div>
    </div>
  );
}

export function IntegrityNotice({
  kind = "human",
}: {
  kind?: "human" | "simulation" | "restricted";
}) {
  const copy = {
    human: {
      icon: ShieldCheck,
      title: "Human decision required",
      text: "The system can explain readiness and blockers. It cannot rank, select or reject a person.",
    },
    simulation: {
      icon: Beaker,
      title: "Simulation only",
      text: "This action previews expected records and side effects. It cannot call a live service.",
    },
    restricted: {
      icon: AlertTriangle,
      title: "Restricted workspace",
      text: "Prototype roles demonstrate least-privilege boundaries; no authentication or real access is implemented.",
    },
  }[kind];
  const Icon = copy.icon;
  return (
    <div className={`integrity-notice integrity-${kind}`}>
      <Icon size={18} aria-hidden="true" />
      <div>
        <strong>{copy.title}</strong>
        <span>{copy.text}</span>
      </div>
    </div>
  );
}

export function Stepper({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <ol className="stepper" aria-label="Application progress">
      {steps.map((step, index) => (
        <li
          className={
            index < current ? "complete" : index === current ? "current" : ""
          }
          key={step}
          aria-current={index === current ? "step" : undefined}
        >
          <span className="step-number">
            {index < current ? (
              <Check size={14} aria-hidden="true" />
            ) : (
              index + 1
            )}
          </span>
          <span>{step}</span>
          {index < steps.length - 1 && (
            <ChevronRight size={14} aria-hidden="true" />
          )}
        </li>
      ))}
    </ol>
  );
}

export function Metric({
  value,
  label,
  detail,
  tone = "neutral",
}: {
  value: string;
  label: string;
  detail?: string;
  tone?: Tone;
}) {
  return (
    <div className={`metric metric-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </div>
  );
}

export function ScreenId({ children }: { children: React.ReactNode }) {
  return <span className="screen-id">{children}</span>;
}
