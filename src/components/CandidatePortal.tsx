import { useMemo, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Building2, CalendarDays, CheckCircle2, CircleHelp, Clock3, Copy, FileCheck2, Globe2, HeartHandshake, MessageCircle, MapPin, Search, ShieldCheck, SlidersHorizontal, UserRound } from "lucide-react";
import { candidateApplications, jobs, syntheticCandidate } from "../data/fixtures";
import { Freshness, Pill, PrototypeBanner, ScenarioControl, ScreenId, Stepper } from "./Common";
import { usePrototype } from "../prototype/PrototypeContext";

type CandidateScreen = "careers" | "job" | "apply" | "hub";

function CandidateShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="candidate-app">
      <PrototypeBanner />
      <header className="candidate-header">
        <NavLink className="brand" to="/careers" aria-label="Harbor and Pine Labs careers">
          <span className="brand-mark">H<span>&</span>P</span>
          <span><strong>Harbor & Pine</strong><small>Careers · fictional employer</small></span>
        </NavLink>
        <nav aria-label="Candidate navigation">
          <NavLink to="/careers">Open roles</NavLink>
          <NavLink to="/my-applications">My applications</NavLink>
          <a href="#candidate-support">Candidate support</a>
        </nav>
        <NavLink className="candidate-account" to="/my-applications"><UserRound size={17} aria-hidden="true" /> Maya <span>Demo</span></NavLink>
      </header>
      <main id="main-content" className="candidate-main">{children}</main>
      <footer className="candidate-footer" id="candidate-support">
        <div><strong>Harbor & Pine Labs</strong><span>Fictional employer for synthetic prototype testing.</span></div>
        <nav aria-label="Footer"><a href="#privacy">Privacy preview</a><a href="mailto:prototype@example.test">Accessibility support</a><a href="mailto:prototype@example.test">Contact demo support</a></nav>
      </footer>
    </div>
  );
}

function CareersScreen() {
  const [query, setQuery] = useState("");
  const [workplace, setWorkplace] = useState("All workplaces");
  const visibleJobs = useMemo(() => jobs.filter((job) => {
    const matchesQuery = `${job.title} ${job.team} ${job.location}`.toLowerCase().includes(query.toLowerCase());
    const matchesWorkplace = workplace === "All workplaces" || job.workplace === workplace;
    return matchesQuery && matchesWorkplace;
  }), [query, workplace]);

  return (
    <CandidateShell>
      <section className="career-hero">
        <div className="career-hero-copy">
          <ScreenId>UI-CAN-001</ScreenId>
          <p className="eyebrow">Build tools people can trust</p>
          <h1>Meaningful work.<br /><em>Room to grow.</em></h1>
          <p className="hero-lede">Explore fictional roles in a candidate journey designed for clarity, accessibility and honest next steps.</p>
          <div className="hero-proof">
            <span><ShieldCheck size={18} aria-hidden="true" /> Pay shown up front</span>
            <span><HeartHandshake size={18} aria-hidden="true" /> Accommodation support</span>
            <span><Globe2 size={18} aria-hidden="true" /> Location-aware process</span>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-card art-card-main"><span>Candidate promise</span><strong>Know where you stand.</strong><small>Clear status · clear next action</small></div>
          <div className="art-card art-card-mini"><CheckCircle2 size={20} /><span>Accessible by design</span></div>
        </div>
      </section>

      <section className="job-discovery" aria-labelledby="open-roles-heading">
        <div className="section-heading split-heading">
          <div><p className="eyebrow">Fictional openings</p><h2 id="open-roles-heading">Find your next chapter</h2></div>
          <Freshness>Public projection fixture · generated Aug 25</Freshness>
        </div>
        <div className="search-panel">
          <label className="search-field"><Search size={19} aria-hidden="true" /><span className="sr-only">Search jobs</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by role, team or location" /></label>
          <label className="select-field"><SlidersHorizontal size={18} aria-hidden="true" /><span className="sr-only">Workplace</span><select value={workplace} onChange={(event) => setWorkplace(event.target.value)}><option>All workplaces</option><option>Remote</option><option>Hybrid</option></select></label>
          <span className="result-count" aria-live="polite">{visibleJobs.length} role{visibleJobs.length === 1 ? "" : "s"}</span>
        </div>
        {visibleJobs.length ? (
          <div className="job-list">
            {visibleJobs.map((job) => (
              <article className="job-card" key={job.id}>
                <div className="job-icon"><BriefcaseBusiness size={22} aria-hidden="true" /></div>
                <div className="job-card-copy">
                  <div className="job-card-title"><h3><NavLink to={`/careers/jobs/${job.publicId}`}>{job.title}</NavLink></h3><Pill tone="success">Open · demo</Pill></div>
                  <p>{job.summary}</p>
                  <div className="job-meta"><span><Building2 size={15} />{job.team}</span><span><MapPin size={15} />{job.location}</span><span><Clock3 size={15} />{job.type}</span></div>
                </div>
                <div className="job-card-action"><strong>{job.pay}</strong><span>{job.posted}</span><NavLink className="circle-link" to={`/careers/jobs/${job.publicId}`} aria-label={`View ${job.title}`}><ArrowRight size={18} /></NavLink></div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state" role="status"><Search size={28} /><h3>No demo roles match those filters</h3><p>Clear the search or choose another workplace. Your filters are not saved.</p><button className="secondary-button" onClick={() => { setQuery(""); setWorkplace("All workplaces"); }}>Clear filters</button></div>
        )}
      </section>
      <ScenarioControl compact audience="candidate" />
    </CandidateShell>
  );
}

function JobScreen() {
  const { publicId } = useParams();
  const job = jobs.find((item) => item.publicId === publicId) ?? jobs[0];
  const navigate = useNavigate();
  return (
    <CandidateShell>
      <div className="candidate-page narrow-page">
        <button className="text-button back-button" onClick={() => navigate("/careers")}><ArrowLeft size={16} /> All open roles</button>
        <div className="job-detail-grid">
          <article className="job-detail">
            <ScreenId>UI-CAN-002</ScreenId>
            <div className="job-detail-heading"><Pill tone="success">Open · fictional role</Pill><Freshness>{job.version}</Freshness></div>
            <h1>{job.title}</h1>
            <p className="job-detail-lede">{job.summary}</p>
            <div className="job-facts"><span><MapPin size={17} />{job.location}</span><span><BriefcaseBusiness size={17} />{job.type}</span><span><Building2 size={17} />{job.team}</span></div>
            <section><h2>What you’ll shape</h2><p>You will partner with a fictional product team to turn complex operational needs into calm, inclusive experiences. This description exists only to exercise the prototype.</p></section>
            <section><h2>What helps you thrive</h2><ul className="check-list">{job.requirements.map((item) => <li key={item}><CheckCircle2 size={17} />{item}</li>)}</ul></section>
            <section><h2>How the demo process works</h2><ol className="number-list"><li><span>1</span>Structured application</li><li><span>2</span>Recruiter conversation</li><li><span>3</span>Two focused interviews</li><li><span>4</span>Human decision and feedback</li></ol></section>
            <section className="candidate-notice" id="privacy"><ShieldCheck size={22} /><div><h2>Your information in this prototype</h2><p>Only pre-generated synthetic values are available. Nothing is uploaded, authenticated, transmitted or retained after refresh.</p></div></section>
          </article>
          <aside className="apply-card">
            <span className="eyebrow">Pay transparency</span><strong className="salary">{job.pay}</strong><p>Illustrative base salary. This is not a real vacancy or offer.</p>
            <NavLink className="primary-button full-button" to={`/apply/${job.publicId}/profile`}>Start demo application <ArrowRight size={17} /></NavLink>
            <button className="secondary-button full-button" onClick={() => navigator.clipboard?.writeText(window.location.href)}><Copy size={16} /> Copy demo link</button>
            <div className="support-link"><CircleHelp size={18} /><span>Need an accommodation?<a href="mailto:prototype@example.test"> Preview support route</a></span></div>
          </aside>
        </div>
      </div>
    </CandidateShell>
  );
}

function ApplyScreen() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [workMode, setWorkMode] = useState("remote");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { publicId } = useParams();
  const job = jobs.find((item) => item.publicId === publicId) ?? jobs[0];
  const steps = ["Profile", "Experience", "Declarations", "Review"];

  const next = () => {
    if (step === 2 && !confirmed) {
      setError("Confirm that these are synthetic demonstration answers before review.");
      return;
    }
    setError("");
    if (step < 3) setStep((value) => value + 1);
    else setSubmitted(true);
  };

  if (submitted) return (
    <CandidateShell>
      <div className="completion-card" role="status">
        <div className="completion-icon"><CheckCircle2 size={34} /></div>
        <ScreenId>UI-CAN-003 · confirmation</ScreenId>
        <h1>Demo application complete</h1>
        <p>No application was created. This confirmation shows the candidate-safe outcome that a real submission would produce.</p>
        <div className="confirmation-reference"><span>Simulation reference</span><strong>SIM-APP-09001</strong><small>Memory only · disappears on refresh</small></div>
        <button className="primary-button" onClick={() => navigate("/my-applications")}>View synthetic candidate hub <ArrowRight size={17} /></button>
      </div>
    </CandidateShell>
  );

  return (
    <CandidateShell>
      <div className="candidate-page application-page">
        <div className="application-topline"><button className="text-button" onClick={() => navigate(`/careers/jobs/${job.publicId}`)}><ArrowLeft size={16} /> Back to role</button><span>{job.title}</span><Freshness>{job.version}</Freshness></div>
        <ScreenId>UI-CAN-003</ScreenId>
        <h1>Your demo application</h1>
        <p className="page-lede">Use the prepared fictional candidate to test a focused, recoverable application flow.</p>
        <Stepper steps={steps} current={step} />
        {error && <div className="error-summary" role="alert"><strong>Check this step</strong><span>{error}</span></div>}
        <section className="application-card" aria-labelledby="application-step-heading">
          {step === 0 && <>
            <div className="card-heading"><div><p className="eyebrow">Step 1 of 4</p><h2 id="application-step-heading">Confirm the synthetic profile</h2></div><Pill tone="info">Read-only fixture</Pill></div>
            <p>Real personal information cannot be entered in this public prototype.</p>
            <dl className="profile-grid"><div><dt>Name</dt><dd>{syntheticCandidate.name}</dd></div><div><dt>Email</dt><dd>{syntheticCandidate.email}</dd></div><div><dt>Location</dt><dd>{syntheticCandidate.location}</dd></div><div><dt>Experience</dt><dd>{syntheticCandidate.experience}</dd></div></dl>
            <div className="file-row"><FileCheck2 size={22} /><div><strong>{syntheticCandidate.resume}</strong><span>Generated PDF fixture · scan state: clean</span></div><Pill tone="success">Ready</Pill></div>
          </>}
          {step === 1 && <>
            <div className="card-heading"><div><p className="eyebrow">Step 2 of 4</p><h2 id="application-step-heading">Role-specific experience</h2></div><Pill tone="neutral">No essay fields</Pill></div>
            <fieldset className="choice-group"><legend>Which fictional work arrangement should this scenario use?</legend>{[["remote", "Remote in California"], ["hybrid", "Hybrid in San Francisco"], ["support", "I need location support"]].map(([value, label]) => <label className={workMode === value ? "selected" : ""} key={value}><input type="radio" name="work-mode" value={value} checked={workMode === value} onChange={() => setWorkMode(value)} /><span><strong>{label}</strong><small>Predefined demonstration answer</small></span></label>)}</fieldset>
            <div className="answer-preview"><span>Fixture response</span><p>Maya led a fictional design-systems program across four product teams and documented accessibility outcomes.</p></div>
          </>}
          {step === 2 && <>
            <div className="card-heading"><div><p className="eyebrow">Step 3 of 4</p><h2 id="application-step-heading">Notices and declarations</h2></div><Pill tone="warning">Policy v2</Pill></div>
            <div className="notice-stack"><div><ShieldCheck size={19} /><p><strong>Privacy notice preview</strong><span>A real flow would record the exact notice and policy version shown at collection.</span></p></div><div><HeartHandshake size={19} /><p><strong>Voluntary support</strong><span>Accommodation requests would use a restricted route separate from hiring evaluation.</span></p></div></div>
            <label className="confirm-check"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} /><span>I confirm these are synthetic demonstration answers and contain no real personal information.</span></label>
          </>}
          {step === 3 && <>
            <div className="card-heading"><div><p className="eyebrow">Step 4 of 4</p><h2 id="application-step-heading">Review the immutable snapshot</h2></div><Pill tone="success">Ready to simulate</Pill></div>
            <dl className="review-list"><div><dt>Candidate fixture</dt><dd>{syntheticCandidate.name} · {syntheticCandidate.email}</dd></div><div><dt>Role</dt><dd>{job.title} · {job.version}</dd></div><div><dt>Work arrangement</dt><dd>{workMode === "remote" ? "Remote in California" : workMode === "hybrid" ? "Hybrid in San Francisco" : "Location support requested"}</dd></div><div><dt>Notice evidence</dt><dd>Candidate notice v2 · confirmed</dd></div></dl>
            <div className="simulation-callout"><BeakerIcon /><span><strong>No real submission</strong>This button changes only in-memory UI state.</span></div>
          </>}
          <div className="application-actions"><button className="secondary-button" disabled={step === 0} onClick={() => setStep((value) => value - 1)}>Previous</button><button className="primary-button" onClick={next}>{step === 3 ? "Simulate submission" : "Continue"}<ArrowRight size={17} /></button></div>
        </section>
      </div>
    </CandidateShell>
  );
}

function BeakerIcon() { return <div className="mini-beaker" aria-hidden="true">SIM</div>; }

function HubScreen() {
  const [withdrawn, setWithdrawn] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [availabilitySent, setAvailabilitySent] = useState(false);
  const [slot, setSlot] = useState("Thu Aug 28 · 9:30 AM PT");
  const { id } = useParams();
  const { scenarioState } = usePrototype();
  const applications = candidateApplications.map((application) => application.id === "APP-DEMO-001" ? {
    ...application,
    safeStatus: scenarioState.candidateStatus,
    detail: scenarioState.candidateDetail,
    nextAction: scenarioState.candidateNextAction,
    tone: scenarioState.offerState === "Accepted" ? "success" as const : scenarioState.decisionState === "Closed" ? "neutral" as const : scenarioState.policyBlocked ? "info" as const : "warning" as const,
  } : application);
  const selectedApplication = applications.find((application) => application.id === id);
  const stageRank: Record<string, number> = { Submitted: 0, Withdrawn: 0, "Recruiter review": 1, Screening: 2, Interviews: 3, Debrief: 4, Closed: 4, Offer: 5, Handoff: 6 };
  const currentRank = stageRank[scenarioState.applicationStage] ?? 1;
  return (
    <CandidateShell>
      <div className="candidate-page hub-page">
        <div className="hub-welcome"><div><ScreenId>UI-CAN-004</ScreenId><p className="eyebrow">Candidate hub</p><h1>Welcome back, Maya</h1><p>Safe status, the next action and nothing from internal evaluation.</p></div><ScenarioControl compact audience="candidate" /></div>
        {selectedApplication && <section className="candidate-detail-panel" aria-labelledby="candidate-detail-heading">
          <div><NavLink className="text-button" to="/my-applications"><ArrowLeft size={16} /> All applications</NavLink><p className="eyebrow">Application {selectedApplication.id}</p><h2 id="candidate-detail-heading">{selectedApplication.jobTitle}</h2><Pill tone={selectedApplication.tone}>{selectedApplication.safeStatus}</Pill></div>
          <div className="candidate-timeline"><span className="complete">Applied</span><span className={currentRank <= 1 ? "current" : "complete"}>Team review</span><span className={currentRank < 3 ? "future" : currentRank === 3 ? "current" : "complete"}>Interview</span><span className={scenarioState.offerState === "Accepted" ? "complete" : scenarioState.offerState === "Pending approval" ? "current" : "future"}>Offer</span></div>
          <div className="candidate-message"><MessageCircle size={19} /><div><strong>Latest process update</strong><p>{selectedApplication.detail}</p><small>Today · synthetic message fixture</small></div></div>
        </section>}
        <div className="hub-grid">
          <section aria-labelledby="applications-heading"><div className="section-heading split-heading"><div><h2 id="applications-heading">Your synthetic applications</h2><p>Only records scoped to this demo candidate appear.</p></div><Pill tone="info">2 fixtures</Pill></div>
            <div className="application-list">{applications.map((application) => {
              const isWithdrawn = withdrawn === application.id;
              const isClosed = application.id === "APP-DEMO-001" && scenarioState.decisionState === "Closed";
              const needsAvailability = application.id === "APP-DEMO-001" && application.nextAction.startsWith("Share");
              return <article className="candidate-application" key={application.id}><div className="application-status-bar"><Pill tone={isWithdrawn ? "neutral" : application.tone}>{isWithdrawn ? "Withdrawn · simulated" : application.safeStatus}</Pill><span>{application.updated}</span></div><h3><NavLink to={`/my-applications/${application.id}`}>{application.jobTitle}</NavLink></h3><p>{isWithdrawn ? "This demo state shows that future optional work would be cancelled while history remains." : application.detail}</p><div className="next-action"><span>Next action</span><strong>{isWithdrawn ? "None" : availabilitySent && needsAvailability ? "Availability shared · demo" : application.nextAction}</strong></div>{!isWithdrawn && !isClosed && needsAvailability && <button className="primary-button" onClick={() => setAvailabilityOpen(true)}><CalendarDays size={16} /> Share demo availability</button>}{confirming === application.id ? <div className="inline-confirm" role="alert"><strong>Simulate withdrawal?</strong><span>This will change only this browser view.</span><div><button className="secondary-button" onClick={() => setConfirming(null)}>Keep active</button><button className="danger-button" onClick={() => { setWithdrawn(application.id); setConfirming(null); }}>Confirm demo withdrawal</button></div></div> : !isWithdrawn && !isClosed && <button className="text-button danger-text" onClick={() => setConfirming(application.id)}>Withdraw demo application</button>}</article>;
            })}</div>
          </section>
          <aside className="hub-aside"><div className="support-card"><CircleHelp size={24} /><h2>Need help?</h2><p>Questions about access, accommodations or the fictional process use a candidate-safe support path.</p><a href="mailto:prototype@example.test" className="secondary-button">Preview support</a></div><div className="privacy-card"><ShieldCheck size={21} /><div><strong>Your demo privacy controls</strong><span>No login, tracking, retention or external request is active.</span></div></div></aside>
        </div>
        {availabilityOpen && <div className="modal-scrim" role="presentation"><section className="transition-modal candidate-modal" role="dialog" aria-modal="true" aria-labelledby="availability-title"><h2 id="availability-title">Share synthetic availability</h2><p>Choose one prepared slot. No calendar or message will be sent.</p><fieldset className="choice-group"><legend>Preferred interview time</legend>{["Thu Aug 28 · 9:30 AM PT", "Thu Aug 28 · 1:00 PM PT", "Fri Aug 29 · 11:00 AM PT"].map((item) => <label className={slot === item ? "selected" : ""} key={item}><input type="radio" name="candidate-slot" checked={slot === item} onChange={() => setSlot(item)} /><span><strong>{item}</strong><small>America/Los_Angeles</small></span></label>)}</fieldset><div className="modal-actions"><button className="secondary-button" onClick={() => setAvailabilityOpen(false)}>Cancel</button><button className="primary-button" onClick={() => { setAvailabilitySent(true); setAvailabilityOpen(false); }}>Save availability in demo</button></div></section></div>}
      </div>
    </CandidateShell>
  );
}

export function CandidatePortal({ screen }: { screen: CandidateScreen }) {
  if (screen === "careers") return <CareersScreen />;
  if (screen === "job") return <JobScreen />;
  if (screen === "apply") return <ApplyScreen />;
  return <HubScreen />;
}
