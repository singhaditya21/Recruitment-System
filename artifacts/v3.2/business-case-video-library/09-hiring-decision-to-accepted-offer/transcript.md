# UC-09 · Hiring decision to accepted offer

> Synthetic browser-memory demonstration. No external effect.

## 00:00:00 · UC-09: Hiring decision to accepted offer

Business Case 09 begins when an authorized human decision selects the offer path. A version-bound candidate response reserves an opening and creates an eligible pre-hire handoff. The governed record is OFF-DEMO-001. The accountable actors are Recruiter, Hiring Manager, Offer Approver, Candidate, People Operations. This demonstration uses synthetic browser-memory data and creates no database, provider, message or external-system effect.

## 00:00:24 · Dynamic data-flow diagram: 4 accountable processes

The action-level data-flow diagram defines 4 processes before product navigation. Every process identifies the actor, screen, action, input, output, business object, event, governed store, rule, denial and recovery. The highlighted path keeps each business grain and version distinct.

## 00:00:43 · Process walkthrough: Actor, action, evidence and downstream state

Process 1, Recruiter: Compose versioned offer. The action build terms and contingencies produces validated offer draft in the Offer ledger. Process 2, Offer Approver: Approve exact version. The action approve, return or deny produces approval timeline in the Approval ledger. Process 3, Candidate: Respond to exact version. The action accept, decline or ask question produces version-bound response in the Offer ledger. Process 4, People Operations: Reserve and hand off. The action validate contingencies and create prehire produces opening reservation and prehire in the Handoff ledger.

## 00:01:17 · Product wireframe: Open OFF-DEMO-001 in context

The actual product route is /hr/decisions/APP-DEMO-001. It presents offer composer, version comparison and contingency board in the surrounding recruitment or onboarding workspace. The screen remains a wireframe, but its identifiers, current state, navigation, data relationships and action boundaries match the business contract used by the connected workbench.

## 00:01:40 · Governed data: Inspect fields, scope and business grains

The seeded workbench follows record OFF-DEMO-001. Its governed fields are Base salary, $182,000 USD; Equity, 8,500 RSUs , returned scenario 9,200; Start date, November 16, 2026; Offer version, v4 , 2 approvers; Opening, OPN-001 , reservable; Contingencies, Background review , pending. Field classifications remain visible so the presenter can distinguish public, internal, confidential and restricted projections for the active persona.

## 00:02:10 · Happy-path action: Approve and release offer v4

With Recruiter selected, we perform approve and release offer v4. The guard requires decision, pay policy, approvals, opening and contingencies are current. The state changes from Draft v4 to Released v4, records OfferReleased, writes to the Offer ledger, and creates the handoff: Candidate receives exact-version response task.

## 00:02:38 · Controlled exception: Simulate compensation return

We now exercise the controlled exception: Simulate compensation return. The prepared failure is Compensation approver returns equity term. Unsupported downstream work stops, successful prior evidence remains intact, and the state-change receipt assigns explicit recovery without hiding the failed attempt.

## 00:02:56 · Recovery and evidence: Revise and reapprove v5

The owned recovery is Revise and reapprove v5. It reuses the governed business context without duplicating completed effects. The new receipt preserves previous state, current state, actor, event and correlation key. The control center and handoff inbox then expose the same recovery through offer approval time, version churn and acceptance and minimum-context next-actor work.

## 00:03:18 · UC-09 complete: A version-bound candidate response reserves an opening and creates an eligible pre-hire handoff.

Business Case 09 is complete. We demonstrated the level-two process contract, the actual product route, governed field projections, the primary state transition, a controlled exception, targeted recovery, causal dashboard evidence and the next-actor handoff. A version-bound candidate response reserves an opening and creates an eligible pre-hire handoff. Production identity, persistence, integrations and external delivery remain separate implementation gates.
