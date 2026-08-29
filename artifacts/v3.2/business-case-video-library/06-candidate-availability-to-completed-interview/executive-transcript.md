# UC-06 · Candidate availability to completed interview · Executive cut

> Synthetic browser-memory demonstration. No external effect.

## UC-06: Candidate availability to completed interview

Business Case 06 begins when an application reaches an authorized interview-scheduling milestone. A versioned interview session completes with an eligible panel and due scorecards. The governed record is INT-DEMO-001. The accountable actors are Candidate, Coordinator, Interviewer, Hiring Manager, Candidate Support. This demonstration uses synthetic browser-memory data and creates no database, provider, message or external-system effect.

## Dynamic data-flow diagram: 4 accountable processes

The action-level data-flow diagram defines 4 processes before product navigation. Every process identifies the actor, screen, action, input, output, business object, event, governed store, rule, denial and recovery. The highlighted path keeps each business grain and version distinct.

## Product wireframe: Open INT-DEMO-001 in context

The actual product route is /hr/interviews/INT-DEMO-001. It presents visual interview scheduling and panel capacity in the surrounding recruitment or onboarding workspace. The screen remains a wireframe, but its identifiers, current state, navigation, data relationships and action boundaries match the business contract used by the connected workbench.

## Happy-path action: Confirm session and panel

With Recruiter selected, we perform confirm session and panel. The guard requires timezone, availability, workload, conflicts and accommodations reconcile. The state changes from Draft v2 to Confirmed v3, records InterviewScheduled, writes to the Scheduling ledger, and creates the handoff: Candidate and panel receive current invitation preview.

## Controlled exception: Simulate interviewer conflict

We now exercise the controlled exception: Simulate interviewer conflict. The prepared failure is Primary interviewer becomes unavailable on day of session. Unsupported downstream work stops, successful prior evidence remains intact, and the state-change receipt assigns explicit recovery without hiding the failed attempt.

## Recovery and evidence: Substitute eligible interviewer

The owned recovery is Substitute eligible interviewer. It reuses the governed business context without duplicating completed effects. The new receipt preserves previous state, current state, actor, event and correlation key. The control center and handoff inbox then expose the same recovery through time-to-schedule, reschedules and panel capacity and minimum-context next-actor work.

## UC-06 complete: A versioned interview session completes with an eligible panel and due scorecards.

Business Case 06 is complete. We demonstrated the level-two process contract, the actual product route, governed field projections, the primary state transition, a controlled exception, targeted recovery, causal dashboard evidence and the next-actor handoff. A versioned interview session completes with an eligible panel and due scorecards. Production identity, persistence, integrations and external delivery remain separate implementation gates.
