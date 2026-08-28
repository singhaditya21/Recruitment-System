import { useMemo, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Bell, BriefcaseBusiness, Building2, CalendarDays, CheckCircle2, CircleHelp, Clock3, Copy, FileCheck2, FileText, Globe2, HeartHandshake, LockKeyhole, Mail, MapPin, MessageCircle, Save, Search, ShieldCheck, SlidersHorizontal, Star, UserRound } from "lucide-react";
import { applicationMessages, candidateApplications, syntheticCandidate } from "../data/fixtures";
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
  const { jobRecords } = usePrototype();
  const visibleJobs = useMemo(() => jobRecords.filter((job) => {
    if (job.status !== "Published") return false;
    const matchesQuery = `${job.title} ${job.team} ${job.location}`.toLowerCase().includes(query.toLowerCase());
    const matchesWorkplace = workplace === "All workplaces" || job.workplace === workplace;
    return matchesQuery && matchesWorkplace;
  }), [jobRecords, query, workplace]);

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
  const { jobRecords } = usePrototype();
  const publishedJobs = jobRecords.filter((item) => item.status === "Published");
  const job = publishedJobs.find((item) => item.publicId === publicId) ?? publishedJobs[0];
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
  const { jobRecords } = usePrototype();
  const publishedJobs = jobRecords.filter((item) => item.status === "Published");
  const job = publishedJobs.find((item) => item.publicId === publicId) ?? publishedJobs[0];
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
  const [slot, setSlot] = useState("Thu Aug 28 · 9:30 AM PT");
  const [hubTab, setHubTab] = useState("Applications");
  const [profileSaved, setProfileSaved] = useState(false);
  const [surveyScore, setSurveyScore] = useState<number | null>(null);
  const [preferredChannel, setPreferredChannel] = useState("Email");
  const [interviewResponse, setInterviewResponse] = useState<"Confirmed" | "Reschedule requested">("Confirmed");
  const [offerResponse, setOfferResponse] = useState<"None" | "Accepted" | "Declined">("None");
  const [offerConfirming, setOfferConfirming] = useState<"Accept" | "Decline" | null>(null);
  const { id } = useParams();
  const { scenarioState, availabilitySubmitted, shareAvailability, offerApproved, announce } = usePrototype();
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
  const candidateOfferReady = offerApproved && scenarioState.offerState === "Pending approval";
  return (
    <CandidateShell>
      <div className="candidate-page hub-page">
        <div className="hub-welcome"><div><ScreenId>UI-CAN-004</ScreenId><p className="eyebrow">Candidate hub</p><h1>Welcome back, Maya</h1><p>Safe status, the next action and nothing from internal evaluation.</p></div><ScenarioControl compact audience="candidate" /></div>
        <div className="candidate-hub-tabs" role="tablist" aria-label="Candidate hub sections">{["Applications", "Interviews & offer", "Profile & privacy", "Messages"].map((item) => <button role="tab" aria-selected={hubTab === item} onClick={() => setHubTab(item)} key={item}>{item === "Applications" ? <BriefcaseBusiness size={17} /> : item === "Interviews & offer" ? <CalendarDays size={17} /> : item === "Profile & privacy" ? <LockKeyhole size={17} /> : <Mail size={17} />}{item}</button>)}</div>
        {hubTab === "Applications" && <div role="tabpanel" aria-label="Applications">
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
              const offerReady = application.id === "APP-DEMO-001" && offerApproved && scenarioState.offerState === "Pending approval";
              return <article className="candidate-application" key={application.id}><div className="application-status-bar"><Pill tone={isWithdrawn ? "neutral" : offerReady ? "success" : application.tone}>{isWithdrawn ? "Withdrawn · simulated" : offerReady ? "Offer ready for review" : application.safeStatus}</Pill><span>{application.updated}</span></div><h3><NavLink to={`/my-applications/${application.id}`}>{application.jobTitle}</NavLink></h3><p>{isWithdrawn ? "This demo state shows that future optional work would be cancelled while history remains." : offerReady ? "Offer version 4 is approved and available through this candidate-safe task." : application.detail}</p><div className="next-action"><span>Next action</span><strong>{isWithdrawn ? "None" : offerReady ? "Review current synthetic offer" : availabilitySubmitted && needsAvailability ? "Availability shared · demo" : application.nextAction}</strong></div>{!isWithdrawn && !isClosed && needsAvailability && !availabilitySubmitted && <button className="primary-button" onClick={() => setAvailabilityOpen(true)}><CalendarDays size={16} /> Share demo availability</button>}{offerReady && <button className="primary-button" onClick={() => announce("Current offer version opened safely in preview. No document was downloaded or response recorded.")}><FileText size={16} /> Review synthetic offer</button>}{confirming === application.id ? <div className="inline-confirm" role="alert"><strong>Simulate withdrawal?</strong><span>This will change only this browser view.</span><div><button className="secondary-button" onClick={() => setConfirming(null)}>Keep active</button><button className="danger-button" onClick={() => { setWithdrawn(application.id); setConfirming(null); }}>Confirm demo withdrawal</button></div></div> : !isWithdrawn && !isClosed && <button className="text-button danger-text" onClick={() => setConfirming(application.id)}>Withdraw demo application</button>}</article>;
            })}</div>
          </section>
          <aside className="hub-aside"><div className="support-card"><CircleHelp size={24} /><h2>Need help?</h2><p>Questions about access, accommodations or the fictional process use a candidate-safe support path.</p><button className="secondary-button" onClick={() => announce("Support case preview opened with application-safe context only.")}>Preview support case</button></div><div className="privacy-card"><ShieldCheck size={21} /><div><strong>Your demo privacy controls</strong><span>No login, tracking, retention or external request is active.</span></div></div><div className="experience-card"><Star size={20} /><strong>Experience pulse</strong><span>Optional and separated from active hiring decisions.</span><div aria-label="Candidate experience rating">{[1, 2, 3, 4, 5].map((rating) => <button aria-label={`Rate ${rating} of 5`} aria-pressed={surveyScore === rating} onClick={() => setSurveyScore(rating)} key={rating}>{rating}</button>)}</div>{surveyScore && <small role="status">Rating {surveyScore}/5 saved in memory</small>}</div></aside>
        </div>
        </div>}
        {hubTab === "Interviews & offer" && <div className="candidate-control-grid interview-offer-center" role="tabpanel" aria-label="Interviews and offer"><section className="candidate-control-card"><div className="section-heading split-heading"><div><p className="eyebrow">Interview center</p><h2>Product design conversation</h2></div><Pill tone={interviewResponse === "Confirmed" ? "success" : "warning"}>{interviewResponse}</Pill></div><div className="candidate-interview-contract"><span><strong>When</strong>September 3 · 10:00–11:00 AM PT</span><span><strong>Format</strong>Video · accessible link available 15 minutes before</span><span><strong>People</strong>Marcus Johnson · Jordan Lee</span><span><strong>Focus</strong>Product thinking and collaboration</span><span><strong>Timezone</strong>America/Los_Angeles</span><span><strong>Support</strong>Accommodation and technology check available</span></div><div className="detail-action-strip"><button className="secondary-button" onClick={() => { setInterviewResponse("Reschedule requested"); announce("Reschedule request saved in browser memory; the original interview remains confirmed until a replacement reconciles."); }}>Request another time</button><button className="secondary-button" onClick={() => announce("Private accommodation support request opened without exposing details to interviewers.")}>Request support</button></div></section><section className="candidate-control-card"><div className="section-heading split-heading"><div><p className="eyebrow">Offer center</p><h2>Senior Product Designer · offer v4</h2></div><Pill tone={offerResponse === "Accepted" ? "success" : offerResponse === "Declined" ? "neutral" : candidateOfferReady ? "success" : "warning"}>{offerResponse !== "None" ? offerResponse : candidateOfferReady ? "Ready for response" : "Awaiting approval"}</Pill></div><p>Only the current approved version can receive a response. Compensation, contingencies and expiration are shown together.</p><dl className="offer-facts"><div><dt>Base salary</dt><dd>$168,000 USD</dd></div><div><dt>Workplace</dt><dd>California · remote</dd></div><div><dt>Start date</dt><dd>September 15, 2026</dd></div><div><dt>Expires</dt><dd>September 2 · 5:00 PM PT</dd></div><div><dt>Contingencies</dt><dd>Employment eligibility verification</dd></div><div><dt>Version</dt><dd>v4 · sha256:offer…91ad</dd></div></dl><button className="secondary-button" onClick={() => announce("Accessible offer v4 opened in preview with terms, notices and synthetic signature evidence.")}><FileText size={16} /> Review accessible offer</button>{candidateOfferReady && offerResponse === "None" && <div className="detail-action-strip"><button className="primary-button" onClick={() => setOfferConfirming("Accept")}>Accept offer</button><button className="secondary-button" onClick={() => setOfferConfirming("Decline")}>Decline offer</button></div>}{offerConfirming && <div className="inline-confirm" role="alert"><strong>{offerConfirming} current offer v4?</strong><span>This response changes browser memory only and retains the exact offer version.</span><div><button className="secondary-button" onClick={() => setOfferConfirming(null)}>Cancel</button><button className={offerConfirming === "Accept" ? "primary-button" : "danger-button"} onClick={() => { setOfferResponse(offerConfirming === "Accept" ? "Accepted" : "Declined"); announce(`Offer v4 ${offerConfirming.toLowerCase()} response reconciled in browser memory.`); setOfferConfirming(null); }}>Confirm {offerConfirming.toLowerCase()}</button></div></div>}{offerResponse !== "None" && <div className="completion-receipt"><CheckCircle2 size={22} /><div><strong>{offerResponse}</strong><span>Synthetic response receipt · offer v4 · memory only</span></div></div>}</section><section className="candidate-control-card"><CircleHelp size={23} /><h2>Know what happens next</h2><ol className="number-list"><li><span>1</span>Offer response is reconciled to v4</li><li><span>2</span>One approved opening is reserved</li><li><span>3</span>Any required contingency is completed with human review</li><li><span>4</span>A separate pre-hire identity and onboarding plan are created</li></ol><p>Accepting an offer never silently creates an employee record.</p></section></div>}
        {hubTab === "Profile & privacy" && <div className="candidate-control-grid" role="tabpanel" aria-label="Profile and privacy"><section className="candidate-control-card"><div className="section-heading split-heading"><div><p className="eyebrow">Reusable profile</p><h2>Contact and preferences</h2></div><Pill tone="info">Candidate controlled</Pill></div><div className="candidate-profile-form"><label><span>Name</span><input defaultValue={syntheticCandidate.name} /></label><label><span>Email</span><input defaultValue={syntheticCandidate.email} /></label><label><span>Phone</span><input defaultValue={syntheticCandidate.phone} /></label><label><span>Location</span><input defaultValue={syntheticCandidate.location} /></label><label><span>Preferred channel</span><select value={preferredChannel} onChange={(event) => setPreferredChannel(event.target.value)}><option>Email</option><option>Text messages disabled</option><option>Support-assisted contact</option></select></label><label><span>Preferred language</span><select defaultValue="English (US)"><option>English (US)</option></select></label></div><button className="primary-button" onClick={() => setProfileSaved(true)}><Save size={16} /> Save profile in memory</button>{profileSaved && <p className="inline-success" role="status"><CheckCircle2 size={16} /> Synthetic profile saved for this browser view.</p>}</section><section className="candidate-control-card"><div className="section-heading"><p className="eyebrow">Application documents</p><h2>Your current files</h2></div><div className="candidate-file-list"><div><FileCheck2 size={19} /><span><strong>{syntheticCandidate.resume}</strong><small>Resume v2 · clean generated fixture</small></span><button onClick={() => announce("Resume preview opened. No file left this synthetic browser session.")}>Preview</button></div><div><FileText size={19} /><span><strong>Application response snapshot</strong><small>Application v5 · submitted Aug 22</small></span><button onClick={() => announce("Immutable application snapshot opened in preview.")}>Preview</button></div></div></section><section className="candidate-control-card privacy-actions"><div className="section-heading"><p className="eyebrow">Data rights</p><h2>Privacy requests</h2></div><p>Identity verification and applicable retention/legal-hold checks would occur before any request is executed.</p><button className="secondary-button" onClick={() => announce("Data copy request preview created in memory.")}>Request a data copy</button><button className="secondary-button" onClick={() => announce("Correction request preview created in memory.")}>Request a correction</button><button className="secondary-button" onClick={() => announce("Deletion request preview created; no data was deleted.")}>Preview deletion request</button></section></div>}
        {hubTab === "Messages" && <div className="candidate-message-center" role="tabpanel" aria-label="Messages"><section><div className="section-heading split-heading"><div><p className="eyebrow">Candidate-safe thread</p><h2>Messages about this application</h2></div><Pill tone="success">Email verified · fixture</Pill></div><div className="candidate-thread">{applicationMessages.filter((message) => message.candidateVisible).map((message) => <article className={`candidate-thread-item ${message.direction}`} key={message.id}><div><Pill tone={message.tone}>{message.channel} · {message.state}</Pill><span>{message.time}</span></div><h3>{message.subject}</h3><p>{message.preview}</p><small>{message.id} · preference checked before send</small></article>)}</div></section><aside className="candidate-control-card"><Bell size={23} /><h2>Communication controls</h2><p>Current channel: <strong>{preferredChannel}</strong>. Routine messages respect preference, purpose, quiet hours and delivery state.</p><button className="secondary-button" onClick={() => setHubTab("Profile & privacy")}>Manage preferences</button><button className="secondary-button" onClick={() => announce("Candidate support reply composer opened in preview; nothing was sent.")}>Reply through support</button></aside></div>}
        {availabilityOpen && <div className="modal-scrim" role="presentation"><section className="transition-modal candidate-modal" role="dialog" aria-modal="true" aria-labelledby="availability-title"><h2 id="availability-title">Share synthetic availability</h2><p>This is an availability request, not a confirmed booking. Choose a prepared slot; the coordinator still owns confirmation.</p><div className="booking-contract"><span><strong>Window</strong>Aug 28–29</span><span><strong>Timezone</strong>America/Los_Angeles</span><span><strong>Link expires</strong>Aug 29 · 5:00 PM PT</span><span><strong>Rescheduling</strong>Up to 2 times</span></div><fieldset className="choice-group"><legend>Preferred interview time</legend>{["Thu Aug 28 · 9:30 AM PT", "Thu Aug 28 · 1:00 PM PT", "Fri Aug 29 · 11:00 AM PT"].map((item) => <label className={slot === item ? "selected" : ""} key={item}><input type="radio" name="candidate-slot" checked={slot === item} onChange={() => setSlot(item)} /><span><strong>{item}</strong><small>America/Los_Angeles</small></span></label>)}</fieldset><div className="modal-actions"><button className="secondary-button" onClick={() => setAvailabilityOpen(false)}>Cancel</button><button className="primary-button" onClick={() => { shareAvailability(); setAvailabilityOpen(false); }}>Save availability in demo</button></div></section></div>}
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
