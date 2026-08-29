# UC-08 · Assessment or background check to governed outcome

> Synthetic browser-memory demonstration. No external effect.

## 00:00:00 · UC-08: Assessment or background check to governed outcome

Business Case 08 begins when a versioned assessment or screening task is assigned at an authorized stage. A correctable, human-reviewed outcome preserves notice, response windows and redress. The governed record is CTK-004. The accountable actors are Candidate, Recruiter, Screening Reviewer, Candidate Support. This demonstration uses synthetic browser-memory data and creates no database, provider, message or external-system effect.

## 00:00:27 · Dynamic data-flow diagram: 4 accountable processes

The action-level data-flow diagram defines 4 processes before product navigation. Every process identifies the actor, screen, action, input, output, business object, event, governed store, rule, denial and recovery. The highlighted path keeps each business grain and version distinct.

## 00:00:45 · Process walkthrough: Actor, action, evidence and downstream state

Process 1, Candidate: Review notice and consent. The action acknowledge current notice produces notice and consent receipt in the Regulated case ledger. Process 2, Screening Coordinator: Prepare provider request. The action validate minimum data and send preview produces prepared request and correlation key in the Integration ledger. Process 3, Candidate: Correct or dispute. The action submit protected response produces dispute and decision pause in the Regulated case ledger. Process 4, Screening Reviewer: Record governed outcome. The action review separated evidence produces human outcome and candidate-safe status in the Outcome ledger.

## 00:01:23 · Product wireframe: Open CASE-DEMO-001 in context

The actual product route is /hr/cases/CASE-DEMO-001. It presents regulated screening and adverse-action timeline in the surrounding recruitment or onboarding workspace. The screen remains a wireframe, but its identifiers, current state, navigation, data relationships and action boundaries match the business contract used by the connected workbench.

## 00:01:45 · Governed data: Inspect fields, scope and business grains

The seeded workbench follows record CASE-DEMO-001. Its governed fields are Notice version, BG-US-CA-v5 , acknowledged; Provider status, Report returned , review required; Response clock, 3 business days remaining; Dispute, Identity mismatch , open; Decision effect, Paused; Reviewer, Screening Ops West. Field classifications remain visible so the presenter can distinguish public, internal, confidential and restricted projections for the active persona.

## 00:02:14 · Happy-path action: Record governed human outcome

With Screening Reviewer selected, we perform record governed human outcome. The guard requires notice, consent, response clock, dispute and evidence separation all pass. The state changes from Decision paused to Cleared after human review, records ScreeningOutcomeRecorded, writes to the Regulated case ledger, and creates the handoff: Decision owner receives minimum outcome only.

## 00:02:35 · Controlled exception: Open candidate dispute

We now exercise the controlled exception: Open candidate dispute. The prepared failure is Candidate disputes an identity mismatch during protected window. Unsupported downstream work stops, successful prior evidence remains intact, and the state-change receipt assigns explicit recovery without hiding the failed attempt.

## 00:02:54 · Recovery and evidence: Resolve dispute and resume

The owned recovery is Resolve dispute and resume. It reuses the governed business context without duplicating completed effects. The new receipt preserves previous state, current state, actor, event and correlation key. The control center and handoff inbox then expose the same recovery through response-window compliance and correction turnaround and minimum-context next-actor work.

## 00:03:16 · UC-08 complete: A correctable, human-reviewed outcome preserves notice, response windows and redress.

Business Case 08 is complete. We demonstrated the level-two process contract, the actual product route, governed field projections, the primary state transition, a controlled exception, targeted recovery, causal dashboard evidence and the next-actor handoff. A correctable, human-reviewed outcome preserves notice, response windows and redress. Production identity, persistence, integrations and external delivery remain separate implementation gates.
