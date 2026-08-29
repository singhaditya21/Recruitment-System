# UC-03 · Candidate application and identity resolution · Executive cut

> Synthetic browser-memory demonstration. No external effect.

## UC-03: Candidate application and identity resolution

Business Case 03 begins when a candidate starts a version-bound job application. A valid application is linked to the correct candidate identity with governed provenance. The governed record is APP-DEMO-001. The accountable actors are Candidate, Recruiter, Candidate Support, Privacy Reviewer. This demonstration uses synthetic browser-memory data and creates no database, provider, message or external-system effect.

## Dynamic data-flow diagram: 4 accountable processes

The action-level data-flow diagram defines 4 processes before product navigation. Every process identifies the actor, screen, action, input, output, business object, event, governed store, rule, denial and recovery. The highlighted path keeps each business grain and version distinct.

## Product wireframe: Open DUP-DEMO-001 in context

The actual product route is /hr/candidates/PER-DEMO-001. It presents candidate duplicate resolution and governed correction in the surrounding recruitment or onboarding workspace. The screen remains a wireframe, but its identifiers, current state, navigation, data relationships and action boundaries match the business contract used by the connected workbench.

## Happy-path action: Approve safe field-level match

With Recruiter selected, we perform approve safe field-level match. The guard requires minimum-necessary signals agree and restricted evidence stays separated. The state changes from Review required to Matched with provenance, records DuplicateResolved, writes to the Identity ledger, and creates the handoff: Recruiter receives corrected identity projection.

## Controlled exception: Simulate ambiguous match

We now exercise the controlled exception: Simulate ambiguous match. The prepared failure is Email matches but name and source ownership conflict. Unsupported downstream work stops, successful prior evidence remains intact, and the state-change receipt assigns explicit recovery without hiding the failed attempt.

## Recovery and evidence: Resolve with authoritative source

The owned recovery is Resolve with authoritative source. It reuses the governed business context without duplicating completed effects. The new receipt preserves previous state, current state, actor, event and correlation key. The control center and handoff inbox then expose the same recovery through duplicate-review accuracy and correction turnaround and minimum-context next-actor work.

## UC-03 complete: A valid application is linked to the correct candidate identity with governed provenance.

Business Case 03 is complete. We demonstrated the level-two process contract, the actual product route, governed field projections, the primary state transition, a controlled exception, targeted recovery, causal dashboard evidence and the next-actor handoff. A valid application is linked to the correct candidate identity with governed provenance. Production identity, persistence, integrations and external delivery remain separate implementation gates.
