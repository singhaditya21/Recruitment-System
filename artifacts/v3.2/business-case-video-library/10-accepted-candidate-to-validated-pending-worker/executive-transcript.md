# UC-10 · Accepted candidate to validated pending worker · Executive cut

> Synthetic browser-memory demonstration. No external effect.

## UC-10: Accepted candidate to validated pending worker

Business Case 10 begins when an accepted application becomes eligible for controlled onboarding handoff. Candidate, application, PreHire and PendingWorker remain linked, correctable and reconciled. The governed record is NHR-DEMO-001. The accountable actors are People Operations, HRIS Operator, Configuration Admin, New Hire. This demonstration uses synthetic browser-memory data and creates no database, provider, message or external-system effect.

## Dynamic data-flow diagram: 4 accountable processes

The action-level data-flow diagram defines 4 processes before product navigation. Every process identifies the actor, screen, action, input, output, business object, event, governed store, rule, denial and recovery. The highlighted path keeps each business grain and version distinct.

## Product wireframe: Open PWH-DEMO-001 in context

The actual product route is /hr/onboarding/new-hires/NHR-DEMO-001. It presents prehire and pendingworker mapping and reconciliation in the surrounding recruitment or onboarding workspace. The screen remains a wireframe, but its identifiers, current state, navigation, data relationships and action boundaries match the business contract used by the connected workbench.

## Happy-path action: Stage and reconcile worker

With People Operations selected, we perform stage and reconcile worker. The guard requires identity lineage, mapping version, required fields and idempotency pass. The state changes from Staged with 1 error to Reconciled, records PendingWorkerReconciled, writes to the HRIS staging ledger, and creates the handoff: New hire receives purpose-limited invitation.

## Controlled exception: Simulate location-code rejection

We now exercise the controlled exception: Simulate location-code rejection. The prepared failure is Destination rejects SF-CA-HYBRID location code. Unsupported downstream work stops, successful prior evidence remains intact, and the state-change receipt assigns explicit recovery without hiding the failed attempt.

## Recovery and evidence: Correct mapping and replay

The owned recovery is Correct mapping and replay. It reuses the governed business context without duplicating completed effects. The new receipt preserves previous state, current state, actor, event and correlation key. The control center and handoff inbox then expose the same recovery through first-pass validation, retries and reconciliation age and minimum-context next-actor work.

## UC-10 complete: Candidate, application, PreHire and PendingWorker remain linked, correctable and reconciled.

Business Case 10 is complete. We demonstrated the level-two process contract, the actual product route, governed field projections, the primary state transition, a controlled exception, targeted recovery, causal dashboard evidence and the next-actor handoff. Candidate, application, PreHire and PendingWorker remain linked, correctable and reconciled. Production identity, persistence, integrations and external delivery remain separate implementation gates.
