import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleHelp,
  ClipboardCheck,
  FileCheck2,
  FileSignature,
  Flag,
  Home,
  LockKeyhole,
  MessageCircleQuestion,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { flagshipNewHire, flagshipOnboardingTasks, newHireDocuments, newHireJourneyMilestones } from "../data/onboarding";
import { usePrototype } from "../prototype/PrototypeContext";
import { Pill, PrototypeBanner, ScreenId } from "./Common";

const newHireNav = [
  ["/preboarding", "Home", Home],
  ["/preboarding/tasks", "My tasks", ClipboardCheck],
  ["/preboarding/documents", "Documents", FileSignature],
  ["/preboarding/profile", "My information", UserRound],
  ["/preboarding/day-one", "Day one", CalendarDays],
  ["/preboarding/journey", "My journey", Flag],
  ["/preboarding/benefits", "Benefits", FileCheck2],
  ["/preboarding/learning", "Learning", Target],
  ["/preboarding/help", "Help", CircleHelp],
] as const;

export function PortalFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="new-hire-app">
      <PrototypeBanner />
      <header className="new-hire-header">
        <NavLink to="/preboarding" className="new-hire-brand"><span>H&P</span><div><strong>Harbor & Pine</strong><small>New-hire experience</small></div></NavLink>
        <nav aria-label="New-hire navigation">{newHireNav.map(([to, label, Icon]) => <NavLink end={to === "/preboarding"} to={to} key={to}><Icon size={15} />{label}</NavLink>)}</nav>
        <div className="new-hire-account"><span>MC</span><div><strong>Maya Chen</strong><small>Pre-hire · synthetic</small></div></div>
      </header>
      <main className="new-hire-main" id="main-content">{children}</main>
      <footer className="new-hire-footer"><span>Harbor & Pine Labs · synthetic wireframe</span><NavLink to="/preboarding/help">Privacy and support</NavLink><NavLink to="/careers">Candidate site</NavLink></footer>
    </div>
  );
}

function PortalProgress() {
  const { completedOnboardingTaskIds } = usePrototype();
  const complete = flagshipOnboardingTasks.filter((task) => completedOnboardingTaskIds.includes(task.id) || task.status === "Complete").length;
  const percent = Math.round((complete / flagshipOnboardingTasks.length) * 100);
  return <aside><Sparkles size={24} /><span>Plan progress</span><strong>{percent}%</strong><div className="progress-track"><i style={{ width: `${percent}%` }} /></div><small>{complete} of {flagshipOnboardingTasks.length} total tasks complete</small></aside>;
}

function HomeView() {
  const { completedOnboardingTaskIds } = usePrototype();
  const nextTask = flagshipOnboardingTasks.find((task) => task.ownerType === "New hire" && !completedOnboardingTaskIds.includes(task.id));
  return <>
    <section className="new-hire-welcome"><div><ScreenId>UI-NHR-001</ScreenId><span className="eyebrow">Your preboarding home</span><h1>Welcome to Harbor & Pine, Maya.</h1><p>Your first day is {flagshipNewHire.startDate}. Complete only the tasks assigned to you; internal corrections stay with our team.</p><div className="new-hire-welcome-actions"><NavLink className="primary-button" to={nextTask ? `/preboarding/tasks/${nextTask.id}` : "/preboarding/tasks"}>Continue next task <ArrowRight size={16} /></NavLink><NavLink className="secondary-button" to="/preboarding/help">Ask People Support</NavLink></div></div><PortalProgress /></section>
    <section className="new-hire-assurance" aria-label="New-hire assurance"><div><LockKeyhole size={18} /><span><strong>Private by design</strong>Internal hiring feedback is never shown.</span></div><div><CalendarDays size={18} /><span><strong>18 days to start</strong>Monday · remote orientation</span></div><div><CircleHelp size={18} /><span><strong>One support route</strong>Questions do not affect hiring decisions.</span></div></section>
    <div className="new-hire-grid"><section className="new-hire-tasks"><div className="section-heading split-heading"><div><span className="eyebrow">Assigned to you</span><h2>Finish before your first day</h2></div><NavLink to="/preboarding/tasks">View all</NavLink></div>{flagshipOnboardingTasks.filter((task) => task.ownerType === "New hire").slice(0, 3).map((task) => <PortalTaskCard task={task} key={task.id} />)}</section><DayOneSidebar /></div>
  </>;
}

function PortalTaskCard({ task }: { task: (typeof flagshipOnboardingTasks)[number] }) {
  const { completedOnboardingTaskIds } = usePrototype();
  const isComplete = completedOnboardingTaskIds.includes(task.id) || task.status === "Complete";
  const blocked = task.status === "Blocked";
  return <article className={isComplete ? "complete" : ""}><span className="task-icon">{task.category === "Document" ? <FileSignature size={20} /> : task.category === "Compliance" ? <ShieldCheck size={20} /> : <UserRound size={20} />}</span><div><small>{task.category} · due {task.due}</small><h3>{task.title}</h3><p>{task.description}</p></div>{isComplete ? <Pill tone="success"><CheckCircle2 size={13} /> Complete</Pill> : blocked ? <Pill tone="warning">We're resolving this</Pill> : <NavLink className="primary-button" to={`/preboarding/tasks/${task.id}`}>Open task</NavLink>}</article>;
}

function TaskList() {
  const assigned = flagshipOnboardingTasks.filter((task) => task.ownerType === "New hire");
  return <section className="portal-page"><div className="portal-page-heading"><div><ScreenId>UI-NHR-002</ScreenId><span className="eyebrow">My tasks</span><h1>Your preboarding checklist</h1><p>Only tasks assigned to you appear here. Internal HRIS and provisioning work remains with its accountable owner.</p></div><PortalProgress /></div><div className="new-hire-tasks standalone">{assigned.map((task) => <PortalTaskCard task={task} key={task.id} />)}</div></section>;
}

function TaskDetail({ id }: { id: string }) {
  const task = flagshipOnboardingTasks.find((row) => row.id === id && row.ownerType === "New hire");
  const { completedOnboardingTaskIds, completeOnboardingTask, announce } = usePrototype();
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(false);
  if (!task) return <section className="portal-page"><h1>Task not available</h1><NavLink to="/preboarding/tasks">Return to your tasks</NavLink></section>;
  const complete = completedOnboardingTaskIds.includes(task.id);
  const submit = (event: FormEvent) => { event.preventDefault(); completeOnboardingTask(task.id, `${task.title} completed in browser memory with a synthetic submission receipt.`); navigate("/preboarding/tasks"); };
  return <section className="portal-page portal-task-detail"><NavLink className="back-link" to="/preboarding/tasks"><ArrowLeft size={15} /> My tasks</NavLink><div className="portal-detail-card"><div className="portal-detail-title"><span className="task-icon"><ClipboardCheck size={22} /></span><div><ScreenId>UI-NHR-003</ScreenId><span className="eyebrow">{task.id} · {task.category}</span><h1>{task.title}</h1><p>{task.description}</p></div><Pill tone={complete ? "success" : "info"}>{complete ? "Complete" : `Due ${task.due}`}</Pill></div>{complete ? <div className="completion-receipt"><CheckCircle2 size={24} /><div><strong>Complete</strong><span>Synthetic receipt REC-{task.id} · saved in browser memory</span></div></div> : <form className="portal-form" onSubmit={submit}><fieldset><legend>Review and confirm</legend>{task.category === "Profile" && <><div className="form-grid"><label>Preferred name<input defaultValue="Maya" /></label><label>Personal email<input defaultValue="maya.chen@example.test" type="email" /></label><label>Phone<input defaultValue="+1 415 555 0136" /></label><label>Timezone<select defaultValue="America/Los_Angeles"><option>America/Los_Angeles</option><option>America/New_York</option></select></label></div><div className="field-assurance"><LockKeyhole size={16} />Bank, tax and work-authorization data are never collected on this profile screen.</div></>}{task.category === "Compliance" && <div className="form-grid"><label>Filing status<select><option>Select in secure form...</option><option>Single or married filing separately</option><option>Married filing jointly</option></select></label><label>Additional withholding<input placeholder="$0.00" inputMode="decimal" /></label><div className="field-assurance full"><LockKeyhole size={16} />Entered values are a non-persistent preview. Operations can see only completion state.</div></div>}{task.category === "Document" && <div className="document-preview"><FileSignature size={26} /><div><strong>Confidential information and inventions agreement</strong><span>US-CA v7 · checksum 4e91…c20a · synthetic</span></div><button type="button" className="secondary-button" onClick={() => announce("Accessible document preview opened with headings, signature fields, version and download alternatives.")}>Open accessible document</button></div>}<label className="checkbox-row"><input type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />I reviewed the information and understand this simulated submission.</label></fieldset><button disabled={!confirmed} className="primary-button" type="submit">{task.category === "Document" ? "Apply simulated signature" : "Submit securely"}</button></form>}</div></section>;
}

function DocumentCenter() {
  const { signedDocumentIds, completeDocument } = usePrototype();
  return <section className="portal-page"><div className="portal-page-heading simple"><div><ScreenId>UI-NHR-004</ScreenId><span className="eyebrow">Documents and forms</span><h1>Your document center</h1><p>Each item retains its version, completion evidence and retention context.</p></div><Pill tone="info">{signedDocumentIds.length}/{newHireDocuments.length} complete</Pill></div><div className="document-center-grid">{newHireDocuments.map((document) => { const complete = signedDocumentIds.includes(document.id) || document.status === "Complete"; return <article key={document.id}><span className="document-type-icon">{document.type === "E-signature" ? <FileSignature size={22} /> : <FileCheck2 size={22} />}</span><div><small>{document.id} · {document.type}</small><h2>{document.title}</h2><p>{document.description}</p><dl><div><dt>Version</dt><dd>{document.version}</dd></div><div><dt>Retention</dt><dd>{document.retention}</dd></div></dl></div>{complete ? <Pill tone="success">Complete</Pill> : document.status === "Blocked" ? <Pill tone="warning">Waiting on People Ops</Pill> : <button className="primary-button" onClick={() => completeDocument(document.id)}>Open and complete</button>}</article>; })}</div></section>;
}

function ProfileView() {
  const { announce } = usePrototype();
  const [saved, setSaved] = useState(false);
  const submit = (event: FormEvent) => { event.preventDefault(); setSaved(true); announce("Personal-information correction submitted in browser memory for People Ops review."); };
  return <section className="portal-page"><div className="portal-page-heading simple"><div><ScreenId>UI-NHR-005</ScreenId><span className="eyebrow">My information</span><h1>Review what will be transferred</h1><p>Recruiting history and evaluation data do not become part of your employee profile.</p></div>{saved && <Pill tone="success">Correction submitted</Pill>}</div><div className="profile-layout"><form className="panel portal-form" onSubmit={submit}><fieldset><legend>Personal and contact</legend><div className="form-grid"><label>Legal name<input defaultValue="Maya Lin Chen" /></label><label>Preferred name<input defaultValue="Maya" /></label><label>Personal email<input defaultValue="maya.chen@example.test" /></label><label>Phone<input defaultValue="+1 415 555 0136" /></label></div></fieldset><fieldset><legend>Home and shipping</legend><div className="form-grid"><label className="full">Address line<input defaultValue="482 Synthetic Avenue" /></label><label>City<input defaultValue="Oakland" /></label><label>State<select defaultValue="CA"><option>CA</option><option>NY</option><option>TX</option></select></label><label>Postal code<input defaultValue="94612" /></label><label>Country<select defaultValue="US"><option value="US">United States</option></select></label></div></fieldset><button className="primary-button" type="submit">Submit correction for review</button></form><aside className="panel privacy-explainer"><ShieldCheck size={24} /><h2>Data boundaries</h2><ul><li>Your candidate and employee identities remain linked but separate.</li><li>Bank, tax and eligibility evidence use restricted forms and storage.</li><li>Your manager sees readiness, not private form values.</li><li>Corrections create a versioned review event.</li></ul><NavLink to="/preboarding/help">Ask a privacy question</NavLink></aside></div></section>;
}

function DayOneSidebar() {
  return <aside className="new-hire-side"><section><CalendarDays size={22} /><span className="eyebrow">Day one</span><h2>Monday, September 15</h2><p>9:00 AM PT · Remote welcome with Marcus and your onboarding buddy.</p><ul><li>Welcome and team introductions</li><li>Equipment and account check</li><li>Product and design orientation</li></ul></section><section><ClipboardCheck size={22} /><span className="eyebrow">Your contacts</span><h2>People ready to help</h2><div className="new-hire-contact"><span>MJ</span><div><strong>Marcus Johnson</strong><small>Manager</small></div></div><div className="new-hire-contact"><span>PN</span><div><strong>Priya Nair</strong><small>People Operations</small></div></div></section></aside>;
}

function DayOneView() {
  const { announce } = usePrototype();
  const agenda = [["9:00 AM", "Welcome to Harbor & Pine", "Marcus Johnson + Product team"], ["10:00 AM", "Equipment and identity check", "IT onboarding"], ["11:00 AM", "Company orientation", "People Operations"], ["1:00 PM", "Product and customer context", "Avery Brooks · buddy"], ["3:00 PM", "First-week plan", "Marcus Johnson"]];
  return <section className="portal-page"><div className="portal-page-heading simple"><div><ScreenId>UI-NHR-006</ScreenId><span className="eyebrow">Day one</span><h1>Your first-day plan</h1><p>Monday, September 15 · Pacific Time · remote</p></div><button className="secondary-button" onClick={() => announce("Synthetic calendar package preview created with five accessible events and Pacific-time metadata.")}>Add synthetic calendar</button></div><div className="day-one-layout"><section className="panel day-one-agenda">{agenda.map(([time, title, owner]) => <article key={time}><time>{time}</time><span /><div><h2>{title}</h2><p>{owner}</p></div><Pill tone="info">Video</Pill></article>)}</section><DayOneSidebar /></div></section>;
}

function JourneyView() {
  const { announce } = usePrototype();
  const [pulse, setPulse] = useState<number | null>(null);
  return <section className="portal-page"><div className="portal-page-heading simple"><div><ScreenId>UI-NHR-008</ScreenId><span className="eyebrow">Your complete journey</span><h1>From accepted offer through day 90</h1><p>Tasks, learning, connections and goals remain visible after the first-day checklist is finished.</p></div><Pill tone="info">8 milestones</Pill></div><section className="journey-timeline panel">{newHireJourneyMilestones.map((milestone, index) => <article className={milestone.state.toLowerCase()} key={milestone.id}><span className="journey-index">{index + 1}</span><div><small>{milestone.timing} · {milestone.phase}</small><h2>{milestone.title}</h2><p>{milestone.evidence}</p><span>{milestone.owner}</span></div><Pill tone={milestone.state === "Complete" ? "success" : milestone.state === "Blocked" ? "warning" : milestone.state === "Active" ? "info" : "neutral"}>{milestone.state}</Pill></article>)}</section><div className="journey-support-grid"><section className="panel"><Target size={23} /><span className="eyebrow">30/60/90 goals</span><h2>Know what success means</h2><ul><li><strong>Day 30:</strong> Understand customers, team practices and the design system.</li><li><strong>Day 60:</strong> Own one scoped product problem with partner feedback.</li><li><strong>Day 90:</strong> Ship a measurable improvement and agree the growth plan.</li></ul><button className="secondary-button" onClick={() => announce("Goal check-in preview opened with private notes and manager-visible commitments separated.")}>Open goal check-in</button></section><section className="panel"><Sparkles size={23} /><span className="eyebrow">Learning and connection</span><h2>Your support network</h2><div className="new-hire-contact"><span>MJ</span><div><strong>Marcus Johnson</strong><small>Manager · weekly check-in</small></div></div><div className="new-hire-contact"><span>AB</span><div><strong>Avery Brooks</strong><small>Buddy · product orientation</small></div></div><div className="new-hire-contact"><span>PN</span><div><strong>Priya Nair</strong><small>People Operations</small></div></div><button className="secondary-button" onClick={() => announce("Learning path opened with three fictional modules and accessibility alternatives.")}>View learning path</button></section><section className="panel journey-pulse"><CircleHelp size={23} /><span className="eyebrow">Private experience pulse</span><h2>How supported do you feel?</h2><p>Your response is separated from hiring evidence and shown to managers only in aggregated, eligible groups.</p><div aria-label="New hire experience rating">{[1, 2, 3, 4, 5].map((rating) => <button aria-label={`Rate support ${rating} of 5`} aria-pressed={pulse === rating} onClick={() => setPulse(rating)} key={rating}>{rating}</button>)}</div>{pulse && <Pill tone="success">Rating {pulse}/5 saved in memory</Pill>}</section></div></section>;
}

function HelpView() {
  const { announce } = usePrototype();
  return <section className="portal-page"><div className="portal-page-heading simple"><div><ScreenId>UI-NHR-007</ScreenId><span className="eyebrow">Support and privacy</span><h1>How can we help?</h1><p>Questions and accommodation requests use separate, minimum-necessary support routes and never affect hiring decisions.</p></div></div><div className="help-card-grid"><article><MessageCircleQuestion size={24} /><h2>People Operations</h2><p>Start date, forms, policies or onboarding-plan questions.</p><button className="primary-button" onClick={() => announce("People Operations case SUP-DEMO-001 created in browser memory.")}>Start private request</button></article><article><LaptopIcon /><h2>Technology support</h2><p>Portal access, account setup, equipment or accessibility.</p><button className="secondary-button" onClick={() => announce("Technology support case ITS-DEMO-001 created in browser memory.")}>Get technology help</button></article><article><ShieldCheck size={24} /><h2>Privacy and data rights</h2><p>Understand, correct or request access to your pre-hire information.</p><button className="secondary-button" onClick={() => announce("Privacy request preview opened. No request was transmitted.")}>Review your rights</button></article></div></section>;
}

function LaptopIcon() { return <LockKeyhole size={24} />; }

export function NewHirePortal() {
  const location = useLocation();
  const { taskId } = useParams();
  const view = useMemo(() => {
    if (taskId) return <TaskDetail id={taskId} />;
    if (location.pathname.endsWith("/tasks")) return <TaskList />;
    if (location.pathname.endsWith("/documents")) return <DocumentCenter />;
    if (location.pathname.endsWith("/profile")) return <ProfileView />;
    if (location.pathname.endsWith("/day-one")) return <DayOneView />;
    if (location.pathname.endsWith("/journey")) return <JourneyView />;
    if (location.pathname.endsWith("/help")) return <HelpView />;
    return <HomeView />;
  }, [location.pathname, taskId]);
  return <PortalFrame>{view}</PortalFrame>;
}
