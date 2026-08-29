# UC-11 · Pre-hire to day-one readiness

> Synthetic browser-memory demonstration. No external effect.

## 00:00:00 · UC-11: Pre-hire to day-one readiness

Business Case 11 begins when a version-pinned onboarding plan generates cross-functional work. Day-one readiness is derived from reconciled new-hire, manager, IT and facilities evidence. The governed record is NHR-DEMO-001. The accountable actors are New Hire, People Operations, Manager, IT, Facilities. This demonstration uses synthetic browser-memory data and creates no database, provider, message or external-system effect.

## 00:00:25 · Dynamic data-flow diagram: 5 accountable processes

The action-level data-flow diagram defines 5 processes before product navigation. Every process identifies the actor, screen, action, input, output, business object, event, governed store, rule, denial and recovery. The highlighted path keeps each business grain and version distinct.

## 00:00:43 · Process walkthrough: Actor, action, evidence and downstream state

Process 1, People Operations: Generate dependency-aware plan. The action assign plan and owners produces cross-functional tasks and critical path in the Onboarding ledger. Process 2, New Hire: Complete private work. The action submit forms and documents produces completion or correction receipt in the Private evidence store. Process 3, Manager: Complete manager readiness. The action confirm agenda, goals and buddy produces manager readiness evidence in the Onboarding ledger. Process 4, IT and Facilities: Fulfil access and workplace. The action complete or retry requests produces provisioning and facilities receipts in the Fulfilment ledger. Process 5, People Operations: Reconcile critical path. The action inspect blockers and evidence produces ready or explicitly blocked projection in the Analytics store.

## 00:01:32 · Product wireframe: Open RDY-DEMO-001 in context

The actual product route is /hr/onboarding/analytics. It presents dependency-aware onboarding readiness in the surrounding recruitment or onboarding workspace. The screen remains a wireframe, but its identifiers, current state, navigation, data relationships and action boundaries match the business contract used by the connected workbench.

## 00:01:51 · Governed data: Inspect fields, scope and business grains

The seeded workbench follows record RDY-DEMO-001. Its governed fields are Plan, OBP-DEMO-001 , template v6; Critical tasks, 9 total , 7 reconciled; New-hire tasks, 4/4; Manager tasks, 2/2; IT/Facilities, 1/3 blocked; Day-one readiness, 78% , critical blocker. Field classifications remain visible so the presenter can distinguish public, internal, confidential and restricted projections for the active persona.

## 00:02:17 · Happy-path action: Recalculate day-one readiness

With People Operations selected, we perform recalculate day-one readiness. The guard requires every critical dependency has a current completion/effect receipt. The state changes from Blocked · 2 critical items to Ready · evidence reconciled, records DayOneReadinessCalculated, writes to the Onboarding evidence ledger, and creates the handoff: Manager and new hire see updated critical path.

## 00:02:40 · Controlled exception: Simulate IT fulfilment failure

We now exercise the controlled exception: Simulate IT fulfilment failure. The prepared failure is Laptop shipment and directory account are partially fulfilled. Unsupported downstream work stops, successful prior evidence remains intact, and the state-change receipt assigns explicit recovery without hiding the failed attempt.

## 00:02:59 · Recovery and evidence: Retry fulfilment and reconcile

The owned recovery is Retry fulfilment and reconcile. It reuses the governed business context without duplicating completed effects. The new receipt preserves previous state, current state, actor, event and correlation key. The control center and handoff inbox then expose the same recovery through critical-path readiness, overdue work and exception age and minimum-context next-actor work.

## 00:03:50 · UC-11 complete: Day-one readiness is derived from reconciled new-hire, manager, IT and facilities evidence.

Business Case 11 is complete. We demonstrated the level-two process contract, the actual product route, governed field projections, the primary state transition, a controlled exception, targeted recovery, causal dashboard evidence and the next-actor handoff. Day-one readiness is derived from reconciled new-hire, manager, IT and facilities evidence. Production identity, persistence, integrations and external delivery remain separate implementation gates.
