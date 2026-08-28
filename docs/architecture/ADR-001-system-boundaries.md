# ADR-001 — Candidate, BFF, Salesforce and provider boundaries

- Status: Proposed; accountable approval required
- Date: August 28, 2026
- Scope: pilot/production architecture, not the GitHub Pages wireframe

## Decision

Salesforce is the operational recruitment system of record. Internal HR work is native Lightning. The external candidate portal authenticates through an approved external identity provider and calls a purpose-built backend-for-frontend (BFF). It never exposes generic Salesforce CRUD. Files use approved private object storage plus malware scanning; Salesforce holds governed metadata and references. Providers receive minimized commands and return signed delivery events that are reconciled before a business outcome is considered complete.

## Trust boundaries

1. Anonymous public job projection: sanitized, cached, versioned and fail-closed on unknown jurisdiction.
2. Candidate session: verified subject, own-resource authorization on every call, short-lived tokens and recoverable account access.
3. BFF: schema validation, rate limits, idempotency, purpose/row/field authorization, audit correlation and redaction.
4. Salesforce: canonical business records, state transitions, approvals, sharing/FLS and durable work ownership.
5. Private files: quarantined upload, malware result, controlled retrieval, retention/hold and deletion reconciliation.
6. Providers: allow-listed operations, signed ingress, replay defense, minimized payloads, retries and delivery checkpoints.
7. Analytics/reporting: governed projections, stable grains/denominators, role-safe aggregation, controlled export and restatement evidence.

## Consequences

- The wireframe’s generic object pages are a design contract, not authorization for a generic production API.
- Candidate-safe status is a projection and cannot expose internal evidence, reasons, integrity facts or peer feedback.
- Provider success does not become business truth until the canonical record and reconciliation checkpoint agree.
- Every consequential mutation requires actor, authority, expected version, idempotency key, policy/definition versions and audit correlation.

## Required closure evidence

Approved technology/provider choices; data-flow and threat-model review; OpenAPI/AsyncAPI contract tests; Salesforce object/FLS/sharing tests; identity negative tests; file/provider fault tests; load/limit results; and exercised cutover/rollback/restore runbooks.
