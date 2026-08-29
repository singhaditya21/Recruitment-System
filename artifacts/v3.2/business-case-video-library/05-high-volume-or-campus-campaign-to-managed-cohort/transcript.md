# UC-05 · High-volume or campus campaign to managed cohort

> Synthetic browser-memory demonstration. No external effect.

## 00:00:00 · UC-05: High-volume or campus campaign to managed cohort

Business Case 05 begins when a bounded high-volume recruiting program is approved. A capacity-controlled cohort has explained membership, owned exceptions and reconciled evidence. The governed record is HVC-001. The accountable actors are Volume Recruiter, Coordinator, Event Staff, Candidate, Interviewer. This demonstration uses synthetic browser-memory data and creates no database, provider, message or external-system effect.

## 00:00:26 · Dynamic data-flow diagram: 5 accountable processes

The action-level data-flow diagram defines 5 processes before product navigation. Every process identifies the actor, screen, action, input, output, business object, event, governed store, rule, denial and recovery. The highlighted path keeps each business grain and version distinct.

## 00:00:47 · Process walkthrough: Actor, action, evidence and downstream state

Process 1, Volume Recruiter: Version the program. The action define population and owners produces program version in the Program ledger. Process 2, Coordinator: Plan human capacity. The action simulate capacity produces cohort capacity plan in the Planning ledger. Process 3, Coordinator: Preview bounded batch. The action explain selection and suppression produces selected, suppressed and exception rows in the Cohort ledger. Process 4, Coordinator: Confirm, cancel or retry. The action create bounded work produces invitations or tasks plus per-row receipts in the Execution ledger. Process 5, Volume Recruiter: Reconcile cohort outcome. The action inspect conversion and exceptions produces denominator-bound metrics and drill-through in the Analytics store.

## 00:01:35 · Product wireframe: Open BAT-DEMO-001 in context

The actual product route is /hr/high-volume/HVC-001/cohorts/COH-DEMO-001. It presents high-volume batch preview, undo and partial-failure board in the surrounding recruitment or onboarding workspace. The screen remains a wireframe, but its identifiers, current state, navigation, data relationships and action boundaries match the business contract used by the connected workbench.

## 00:01:58 · Governed data: Inspect fields, scope and business grains

The seeded workbench follows record BAT-DEMO-001. Its governed fields are Program, HVC-001 , Fall campus; Population snapshot, 110 candidates; Selected, 96; Suppressed, 14 , explained; Capacity, 12 sessions × 8; Idempotency key, BAT-HVC001-V05. Field classifications remain visible so the presenter can distinguish public, internal, confidential and restricted projections for the active persona.

## 00:02:27 · Happy-path action: Confirm bounded batch of 96

With Recruiter selected, we perform confirm bounded batch of 96. The guard requires every selected and suppressed row is explained; no ranking or disposition. The state changes from Previewed to 89 delivered · 7 recoverable, records BatchExecuted, writes to the Execution ledger, and creates the handoff: Event staff receives owned check-in work.

## 00:02:49 · Controlled exception: Simulate 7 delivery failures

We now exercise the controlled exception: Simulate 7 delivery failures. The prepared failure is Seven provider failures after 89 successful deliveries. Unsupported downstream work stops, successful prior evidence remains intact, and the state-change receipt assigns explicit recovery without hiding the failed attempt.

## 00:03:07 · Recovery and evidence: Retry failed rows idempotently

The owned recovery is Retry failed rows idempotently. It reuses the governed business context without duplicating completed effects. The new receipt preserves previous state, current state, actor, event and correlation key. The control center and handoff inbox then expose the same recovery through batch success, suppression, cancellation and duplicate prevention and minimum-context next-actor work.

## 00:03:30 · UC-05 complete: A capacity-controlled cohort has explained membership, owned exceptions and reconciled evidence.

Business Case 05 is complete. We demonstrated the level-two process contract, the actual product route, governed field projections, the primary state transition, a controlled exception, targeted recovery, causal dashboard evidence and the next-actor handoff. A capacity-controlled cohort has explained membership, owned exceptions and reconciled evidence. Production identity, persistence, integrations and external delivery remain separate implementation gates.
