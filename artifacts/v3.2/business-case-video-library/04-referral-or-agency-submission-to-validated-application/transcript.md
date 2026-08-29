# UC-04 · Referral or agency submission to validated application

> Synthetic browser-memory demonstration. No external effect.

## 00:00:00 · UC-04: Referral or agency submission to validated application

Business Case 04 begins when an employee or assigned agency proposes a candidate for a job. A permission-bound source relationship converts into a separate application only after validation. The governed record is SUB-DEMO-001. The accountable actors are Employee Referrer, Agency User, Candidate, Recruiter, Partner Administrator. This demonstration uses synthetic browser-memory data and creates no database, provider, message or external-system effect.

## 00:00:28 · Dynamic data-flow diagram: 4 accountable processes

The action-level data-flow diagram defines 4 processes before product navigation. Every process identifies the actor, screen, action, input, output, business object, event, governed store, rule, denial and recovery. The highlighted path keeps each business grain and version distinct.

## 00:00:45 · Process walkthrough: Actor, action, evidence and downstream state

Process 1, Partner: Capture authority and assignment. The action prepare submission produces submission in validation in the Partner ledger. Process 2, Recruiter: Validate duplicate and ownership. The action run privacy-safe validation produces accepted, returned or disputed relationship in the Ownership ledger. Process 3, Recruiter: Convert to application. The action create controlled application produces separate application with source lineage in the Application ledger. Process 4, Partner Administrator: Track fee or reward milestone. The action review eligibility and dispute produces approved, pending or disputed reward in the Reward ledger.

## 00:01:29 · Product wireframe: Open SUB-DEMO-001 in context

The actual product route is /hr/agency-assignments/AGA-DEMO-001. It presents referral and agency validation and conversion in the surrounding recruitment or onboarding workspace. The screen remains a wireframe, but its identifiers, current state, navigation, data relationships and action boundaries match the business contract used by the connected workbench.

## 00:01:46 · Governed data: Inspect fields, scope and business grains

The seeded workbench follows record SUB-DEMO-001. Its governed fields are Assignment, AGA-DEMO-001 , Active; Job scope, JOB-DEMO-001; Candidate permission, Recorded , expires Sep 12; Ownership window, 90 days; Duplicate result, Possible match , owner hidden; Fee policy, 18% on eligible start. Field classifications remain visible so the presenter can distinguish public, internal, confidential and restricted projections for the active persona.

## 00:02:15 · Happy-path action: Validate and convert submission

With Recruiter selected, we perform validate and convert submission. The guard requires assignment, candidate authority, duplicate and ownership windows pass. The state changes from In validation to Application created, records PartnerSubmissionConverted, writes to the Partner ledger, and creates the handoff: Recruiter receives APP-PARTNER-001.

## 00:02:35 · Controlled exception: Simulate ownership dispute

We now exercise the controlled exception: Simulate ownership dispute. The prepared failure is Existing ownership claim is privacy-protected and disputed. Unsupported downstream work stops, successful prior evidence remains intact, and the state-change receipt assigns explicit recovery without hiding the failed attempt.

## 00:02:54 · Recovery and evidence: Resolve scope and convert

The owned recovery is Resolve scope and convert. It reuses the governed business context without duplicating completed effects. The new receipt preserves previous state, current state, actor, event and correlation key. The control center and handoff inbox then expose the same recovery through partner conversion, returns and dispute age and minimum-context next-actor work.

## 00:03:16 · UC-04 complete: A permission-bound source relationship converts into a separate application only after validation.

Business Case 04 is complete. We demonstrated the level-two process contract, the actual product route, governed field projections, the primary state transition, a controlled exception, targeted recovery, causal dashboard evidence and the next-actor handoff. A permission-bound source relationship converts into a separate application only after validation. Production identity, persistence, integrations and external delivery remain separate implementation gates.
