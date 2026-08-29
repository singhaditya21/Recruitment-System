# UC-07 · Structured evidence to human hiring decision

> Synthetic browser-memory demonstration. No external effect.

## 00:00:00 · UC-07: Structured evidence to human hiring decision

Business Case 07 begins when required interview sessions complete and scorecard work becomes due. An authorized human records an attributed decision using independent, versioned evidence. The governed record is APP-DEMO-001. The accountable actors are Interviewer, Recruiter, Hiring Manager, Decision Owner. This demonstration uses synthetic browser-memory data and creates no database, provider, message or external-system effect.

## 00:00:26 · Dynamic data-flow diagram: 4 accountable processes

The action-level data-flow diagram defines 4 processes before product navigation. Every process identifies the actor, screen, action, input, output, business object, event, governed store, rule, denial and recovery. The highlighted path keeps each business grain and version distinct.

## 00:00:44 · Process walkthrough: Actor, action, evidence and downstream state

Process 1, Interviewer: Submit independent scorecard. The action rate rubric and cite evidence produces locked scorecard version in the Evidence ledger. Process 2, Recruiter: Inspect evidence coverage. The action reconcile competencies and missing work produces coverage map and blockers in the Decision ledger. Process 3, Hiring Manager: Run structured debrief. The action compare evidence and conflicts produces debrief conclusion without ranking in the Decision ledger. Process 4, Decision Owner: Record human decision. The action select outcome and rationale produces attributed decision and candidate-safe status in the Decision ledger.

## 00:01:22 · Product wireframe: Open DEB-DEMO-001 in context

The actual product route is /hr/decisions/APP-DEMO-001. It presents evidence coverage and structured debrief in the surrounding recruitment or onboarding workspace. The screen remains a wireframe, but its identifiers, current state, navigation, data relationships and action boundaries match the business contract used by the connected workbench.

## 00:01:43 · Governed data: Inspect fields, scope and business grains

The seeded workbench follows record DEB-DEMO-001. Its governed fields are Interview plan, IP-DEMO-004 , v3; Scorecards, 4/4 submitted and locked; Competency coverage, 6/6 covered; Conflict flags, 0 active; Debrief conclusion, Proceed to offer; Decision owner, Maya Chen. Field classifications remain visible so the presenter can distinguish public, internal, confidential and restricted projections for the active persona.

## 00:02:11 · Happy-path action: Record attributed human decision

With Hiring Manager selected, we perform record attributed human decision. The guard requires independent scorecards, competency coverage and authority are complete. The state changes from Ready for debrief to Human decision recorded, records HiringDecisionRecorded, writes to the Decision ledger, and creates the handoff: Offer owner receives authorized decision.

## 00:02:33 · Controlled exception: Simulate missing evidence

We now exercise the controlled exception: Simulate missing evidence. The prepared failure is System-design evidence missing; one scorecard amended late. Unsupported downstream work stops, successful prior evidence remains intact, and the state-change receipt assigns explicit recovery without hiding the failed attempt.

## 00:02:51 · Recovery and evidence: Collect amendment and reconvene

The owned recovery is Collect amendment and reconvene. It reuses the governed business context without duplicating completed effects. The new receipt preserves previous state, current state, actor, event and correlation key. The control center and handoff inbox then expose the same recovery through evidence completeness, debrief age and amendment rate and minimum-context next-actor work.

## 00:03:14 · UC-07 complete: An authorized human records an attributed decision using independent, versioned evidence.

Business Case 07 is complete. We demonstrated the level-two process contract, the actual product route, governed field projections, the primary state transition, a controlled exception, targeted recovery, causal dashboard evidence and the next-actor handoff. An authorized human records an attributed decision using independent, versioned evidence. Production identity, persistence, integrations and external delivery remain separate implementation gates.
