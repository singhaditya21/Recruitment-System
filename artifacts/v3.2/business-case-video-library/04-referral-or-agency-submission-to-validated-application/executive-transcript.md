# UC-04 · Referral or agency submission to validated application · Executive cut

> Synthetic browser-memory demonstration. No external effect.

## UC-04: Referral or agency submission to validated application

Business Case 04 begins when an employee or assigned agency proposes a candidate for a job. A permission-bound source relationship converts into a separate application only after validation. The governed record is SUB-DEMO-001. The accountable actors are Employee Referrer, Agency User, Candidate, Recruiter, Partner Administrator. This demonstration uses synthetic browser-memory data and creates no database, provider, message or external-system effect.

## Dynamic data-flow diagram: 4 accountable processes

The action-level data-flow diagram defines 4 processes before product navigation. Every process identifies the actor, screen, action, input, output, business object, event, governed store, rule, denial and recovery. The highlighted path keeps each business grain and version distinct.

## Product wireframe: Open SUB-DEMO-001 in context

The actual product route is /hr/agency-assignments/AGA-DEMO-001. It presents referral and agency validation and conversion in the surrounding recruitment or onboarding workspace. The screen remains a wireframe, but its identifiers, current state, navigation, data relationships and action boundaries match the business contract used by the connected workbench.

## Happy-path action: Validate and convert submission

With Recruiter selected, we perform validate and convert submission. The guard requires assignment, candidate authority, duplicate and ownership windows pass. The state changes from In validation to Application created, records PartnerSubmissionConverted, writes to the Partner ledger, and creates the handoff: Recruiter receives APP-PARTNER-001.

## Controlled exception: Simulate ownership dispute

We now exercise the controlled exception: Simulate ownership dispute. The prepared failure is Existing ownership claim is privacy-protected and disputed. Unsupported downstream work stops, successful prior evidence remains intact, and the state-change receipt assigns explicit recovery without hiding the failed attempt.

## Recovery and evidence: Resolve scope and convert

The owned recovery is Resolve scope and convert. It reuses the governed business context without duplicating completed effects. The new receipt preserves previous state, current state, actor, event and correlation key. The control center and handoff inbox then expose the same recovery through partner conversion, returns and dispute age and minimum-context next-actor work.

## UC-04 complete: A permission-bound source relationship converts into a separate application only after validation.

Business Case 04 is complete. We demonstrated the level-two process contract, the actual product route, governed field projections, the primary state transition, a controlled exception, targeted recovery, causal dashboard evidence and the next-actor handoff. A permission-bound source relationship converts into a separate application only after validation. Production identity, persistence, integrations and external delivery remain separate implementation gates.
