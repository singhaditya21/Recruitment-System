# UC-02 · Talent campaign or event to consented applicant

> Synthetic browser-memory demonstration. No external effect.

## 00:00:00 · UC-02: Talent campaign or event to consented applicant

Business Case 02 begins when talent marketing defines an audience or recruiting event. A consented application retains its campaign, event and source-touch lineage. The governed record is CAM-DEMO-001. The accountable actors are Talent Marketer, Campus Recruiter, Candidate, Recruiting Coordinator. This demonstration uses synthetic browser-memory data and creates no database, provider, message or external-system effect.

## 00:00:24 · Dynamic data-flow diagram: 4 accountable processes

The action-level data-flow diagram defines 4 processes before product navigation. Every process identifies the actor, screen, action, input, output, business object, event, governed store, rule, denial and recovery. The highlighted path keeps each business grain and version distinct.

## 00:00:41 · Process walkthrough: Actor, action, evidence and downstream state

Process 1, Talent Marketer: Build eligible audience. The action apply segment rules produces eligible and suppressed population snapshot in the Recruiting CRM. Process 2, Campus Recruiter: Configure event and campaign. The action bind event to campaign produces versioned event invitation in the Campaign ledger. Process 3, Candidate: Register with consent. The action register or join waitlist produces registration or waitlist position in the Relationship ledger. Process 4, Candidate: Start attributed application. The action follow source-bound job link produces draft application with immutable source touch in the Application ledger.

## 00:01:19 · Product wireframe: Open AUD-DEMO-001 in context

The actual product route is /hr/talent/campaigns. It presents audience, consent and source-attribution builder in the surrounding recruitment or onboarding workspace. The screen remains a wireframe, but its identifiers, current state, navigation, data relationships and action boundaries match the business contract used by the connected workbench.

## 00:01:41 · Governed data: Inspect fields, scope and business grains

The seeded workbench follows record AUD-DEMO-001. Its governed fields are Community, Design leaders — Bay Area; Population, 215 prospects; Eligible, 184; Suppressed, 27 , consent/retention; Event, EVT-DEMO-001; Source token, SRC-CAM-2026-08-PD. Field classifications remain visible so the presenter can distinguish public, internal, confidential and restricted projections for the active persona.

## 00:02:08 · Happy-path action: Activate eligible audience snapshot

With Recruiter selected, we perform activate eligible audience snapshot. The guard requires purpose, consent, suppression and effective-date rules pass per row. The state changes from Draft population to Activated · 184 eligible, records AudienceActivated, writes to the Recruiting CRM, and creates the handoff: Event team receives consented audience.

## 00:02:26 · Controlled exception: Expire consent for selected rows

We now exercise the controlled exception: Expire consent for selected rows. The prepared failure is 27 records suppressed; 4 have expired authority. Unsupported downstream work stops, successful prior evidence remains intact, and the state-change receipt assigns explicit recovery without hiding the failed attempt.

## 00:02:45 · Recovery and evidence: Re-evaluate suppression

The owned recovery is Re-evaluate suppression. It reuses the governed business context without duplicating completed effects. The new receipt preserves previous state, current state, actor, event and correlation key. The control center and handoff inbox then expose the same recovery through eligible, suppressed and attributed conversion rates and minimum-context next-actor work.

## 00:03:07 · UC-02 complete: A consented application retains its campaign, event and source-touch lineage.

Business Case 02 is complete. We demonstrated the level-two process contract, the actual product route, governed field projections, the primary state transition, a controlled exception, targeted recovery, causal dashboard evidence and the next-actor handoff. A consented application retains its campaign, event and source-touch lineage. Production identity, persistence, integrations and external delivery remain separate implementation gates.
