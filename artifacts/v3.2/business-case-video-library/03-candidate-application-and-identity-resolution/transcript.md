# UC-03 · Candidate application and identity resolution

> Synthetic browser-memory demonstration. No external effect.

## 00:00:00 · UC-03: Candidate application and identity resolution

Business Case 03 begins when a candidate starts a version-bound job application. A valid application is linked to the correct candidate identity with governed provenance. The governed record is APP-DEMO-001. The accountable actors are Candidate, Recruiter, Candidate Support, Privacy Reviewer. This demonstration uses synthetic browser-memory data and creates no database, provider, message or external-system effect.

## 00:00:35 · Dynamic data-flow diagram: 4 accountable processes

The action-level data-flow diagram defines 4 processes before product navigation. Every process identifies the actor, screen, action, input, output, business object, event, governed store, rule, denial and recovery. The highlighted path keeps each business grain and version distinct.

## 00:00:52 · Process walkthrough: Actor, action, evidence and downstream state

Process 1, Candidate: Create recoverable draft. The action save profile and consent produces versioned application draft in the Application ledger. Process 2, Identity Reviewer: Resolve possible duplicate. The action compare provenance and propose match produces safe match, new identity or review case in the Identity ledger. Process 3, Candidate: Submit exact versions. The action validate and submit produces immutable application attempt in the Application ledger. Process 4, Candidate Support: Correct or withdraw. The action request governed change produces correction or withdrawal work item in the Case ledger.

## 00:01:34 · Product wireframe: Open DUP-DEMO-001 in context

The actual product route is /hr/candidates/PER-DEMO-001. It presents candidate duplicate resolution and governed correction in the surrounding recruitment or onboarding workspace. The screen remains a wireframe, but its identifiers, current state, navigation, data relationships and action boundaries match the business contract used by the connected workbench.

## 00:01:55 · Governed data: Inspect fields, scope and business grains

The seeded workbench follows record DUP-DEMO-001. Its governed fields are Identity A, PER-DEMO-001 , Jordan Lee; Identity B, PER-DUP-004 , J. Lee; Match signals, Verified email, phone suffix; Applications, 3 retained separately; Consent sources, Direct and event registration; Proposed resolution, Link aliases; preserve source records. Field classifications remain visible so the presenter can distinguish public, internal, confidential and restricted projections for the active persona.

## 00:02:28 · Happy-path action: Approve safe field-level match

With Recruiter selected, we perform approve safe field-level match. The guard requires minimum-necessary signals agree and restricted evidence stays separated. The state changes from Review required to Matched with provenance, records DuplicateResolved, writes to the Identity ledger, and creates the handoff: Recruiter receives corrected identity projection.

## 00:02:48 · Controlled exception: Simulate ambiguous match

We now exercise the controlled exception: Simulate ambiguous match. The prepared failure is Email matches but name and source ownership conflict. Unsupported downstream work stops, successful prior evidence remains intact, and the state-change receipt assigns explicit recovery without hiding the failed attempt.

## 00:03:10 · Recovery and evidence: Resolve with authoritative source

The owned recovery is Resolve with authoritative source. It reuses the governed business context without duplicating completed effects. The new receipt preserves previous state, current state, actor, event and correlation key. The control center and handoff inbox then expose the same recovery through duplicate-review accuracy and correction turnaround and minimum-context next-actor work.

## 00:03:32 · UC-03 complete: A valid application is linked to the correct candidate identity with governed provenance.

Business Case 03 is complete. We demonstrated the level-two process contract, the actual product route, governed field projections, the primary state transition, a controlled exception, targeted recovery, causal dashboard evidence and the next-actor handoff. A valid application is linked to the correct candidate identity with governed provenance. Production identity, persistence, integrations and external delivery remain separate implementation gates.
