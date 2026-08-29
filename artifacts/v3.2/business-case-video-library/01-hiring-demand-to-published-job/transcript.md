# Hiring demand to published job · client demonstration

Synthetic browser-memory product demonstration. No external system is changed.

## 00:00:00 · Business Case 01: Hiring demand to published job

Business Case One follows one controlled hiring need from manager-owned demand to a candidate-visible job. Requisition R E Q Demo zero zero one creates two approved openings for a Senior Product Designer. Finance and Compensation independently approve the exact version. Recruiting configures job J O B Demo zero zero one, publishes posting version seven, reconciles four delivery channels and proves the result in analytics and the handoff inbox. Every person and action is synthetic, browser-memory only, and creates no external effect.

## 00:00:33 · Dynamic data-flow diagram: One governed record across five processes

The level-two data-flow diagram establishes the contract before we touch the interface. Each highlighted process names its actor, product route, action, input, output, business object, event, governed store, rule, denial and recovery. The moving token shows the record progressing without collapsing requisition, job, opening, posting and delivery into one mutable object.

## 00:00:55 · Process 1 of 5: Capture governed demand

The hiring manager records workforce plan, position, location, two openings, target date and justification. The output is versioned requisition draft three in the workforce demand ledger. Unavailable or duplicate headcount returns to a safe draft.

## 00:01:10 · Process 2 of 5: Submit the exact version

Submission binds the current justification, budget reference, level and compensation evidence to requisition version three. Missing or stale evidence blocks the submission with field-level repair guidance and preserves earlier history.

## 00:01:24 · Process 3 of 5: Approve with separation of duties

Finance approves headcount and budget. Compensation then approves the band. Neither approver can silently bypass the other or approve a changed version. The final output is attributed requisition version four.

## 00:01:36 · Process 4 of 5: Configure the job and openings

Recruiting converts approved demand into one Senior Product Designer job and two separate opening records. Candidate content, hiring plan and policy readiness must reconcile to the same approved demand before publication.

## 00:01:49 · Process 5 of 5: Publish and reconcile

Posting version seven is immutable and each destination receives its own delivery receipt. A stale channel is retried without duplicating successful deliveries. The public page, events, analytics and handoffs remain traceable to approved demand.

## 00:02:03 · Hiring Manager: Create controlled workforce demand

We begin on the actual manager recruiting route. The record identity is R E Q Demo zero zero one and its state is Draft version three. The manager can see the FY twenty-seven workforce plan, Senior Product Designer position, California remote location, two named openings, November sixteenth target start, current headcount reference and business justification. The boundary panel makes the control explicit: this actor submits demand but cannot self-approve Finance or Compensation evidence.

## 00:02:33 · Exact-version submission: Submit requisition version three

The connected requisition workbench repeats the authoritative data and displays each field classification. With Hiring Manager selected, the budget and compensation evidence is visible only for this approved purpose. The manager submits the exact version. The receipt records Draft version three to Submitted version three, the Requisition Submitted event, the actor, correlation key and Finance handoff.

## 00:02:57 · Finance approval: Approve headcount and budget evidence

The persona changes to Finance Approver. The workbench preserves the same requisition and version while limiting the decision to current headcount and budget evidence. Recording Finance approval creates an attributed event and moves the same version to Compensation review; it does not publish a job or overwrite the manager submission.

## 00:03:18 · Compensation approval: Approve the band and release demand

Compensation Approver now reviews the one hundred sixty-eight to one hundred ninety-six thousand dollar band against the same version. The final approval creates requisition version four and hands minimum context to Recruiting. Three separate receipts now prove submission, Finance approval and Compensation approval.

## 00:03:35 · Recruiter configuration: Configure job and two openings

The recruiter opens the actual job edit route. Senior Product Designer, Product and Research, California remote, full-time employment, compensation, owner, URL slug, role summary and structured requirements are editable within role scope. Lifecycle state remains governed and cannot be changed in this form. Two approved openings, O P N zero zero one and zero zero two, are visible as separate seats. Saving returns to the readiness workspace.

## 00:04:01 · Publication readiness: Verify the pre-publication state

The job is Approved, not already Published. The effective plan is posting draft version seven, and opening reconciliation shows two approved, zero reserved and zero filled. The Golden Path scenario removes unrelated scorecard noise. Readiness reaches one hundred percent because opening, team, plan, pay, content and jurisdiction facts are current.

## 00:04:23 · Publication preparation: Inspect every object and destination

The publication workbench keeps every grain explicit: approved requisition version four; job J O B Demo zero zero one; openings O P N zero zero one and zero zero two; English United States posting P S T Demo zero zero one; immutable posting version seven; and Careers, LinkedIn, Indeed and Agency destinations. Before release, every channel is prepared but has no delivery receipt.

## 00:04:46 · Publication action: Publish posting version seven

The recruiter publishes version seven. The workbench becomes Published and reconciled, the Job Posting Version Published event is recorded, and four delivery receipts appear. The actual job record now changes from Approved to Published, with two openings and posting version seven preserved. No external job board is contacted.

## 00:05:05 · Candidate-facing outcome: Verify the public projection

We follow the public-preview action into the employer-branded careers experience. Candidates see Senior Product Designer, the correct location, employment type, team, compensation range, structured requirements, process expectations and private support route. Internal approvals, budget evidence and channel operations remain absent. This is the candidate-safe projection of the same published record.

## 00:05:28 · Controlled exception: Detect a stale LinkedIn delivery

Back in the publication workbench, we simulate a channel mismatch. Careers, Indeed and Agency retain successful version-seven receipts, while LinkedIn is isolated at stale version six. The state becomes blocked for reconciliation, an owned failure receipt is created, and unsupported downstream action stops without withdrawing the valid public page.

## 00:05:50 · Targeted recovery: Retry only the failed destination

The recruiter reconciles only the failed channel. LinkedIn advances from version six to version seven using the existing business context; successful destinations are not duplicated. A recovery event and restatement receipt retain the failure history while returning the publication to a reconciled state.

## 00:06:08 · Causal analytics: Drill from the metric to the exact receipt

The control center derives readiness, blocked work, events, handoffs and restatements from the same browser-memory ledger. The Business Case One rows show the approval sequence, publication failure and recovery rather than decorative sample numbers. We drill to the exact feature record, previous and current state, latest event and correlated audit timeline.

## 00:06:29 · Cross-persona handoff: Acknowledge the next actor’s work

The handoff inbox shows Finance, Compensation, Recruiting, recovery and candidate-facing work with minimum context. Each card retains actor, destination, record, event and correlation key. We acknowledge the current recruiter handoff, producing a visible completed state without fabricating email or workflow-provider delivery.

## 00:06:49 · Business Case 01 complete: Approved demand to reconciled public job

Business Case One is complete. One manager-owned requisition became approved version four through independent Finance and Compensation decisions. Recruiting configured one Senior Product Designer job and two openings, published immutable posting version seven, proved the candidate-facing page, recovered one stale channel, reconciled analytics and acknowledged the next-actor handoff. Production identity, persistence, APIs and real delivery remain separate implementation gates.
