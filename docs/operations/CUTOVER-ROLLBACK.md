# Cutover, rollback, backup and restore plan — proposed

## Entry requirements

Approved scope/owners; migrated-record inventory; access roster; training/support; provider readiness; reconciled dry run; load/security/accessibility evidence; backup/restore result; candidate communication; and signed go/no-go.

## Cutover

1. Freeze legacy/configuration changes and capture source counts/hashes.
2. Deploy validated metadata/services with exact versions and smoke/negative-access tests.
3. Migrate a bounded cohort; reconcile counts, relationships, states, files, permissions and audit references.
4. Enable named users and one approved job; keep external actions behind independent kill switches.
5. Observe SLOs, queue age, provider reconciliation and support contacts through the stabilization window.

## Rollback and continuity

Rollback triggers include integrity mismatch, unsafe authorization, missing audit attribution, provider divergence, candidate commitment failure or SLO/error-budget breach. Stop new mutations, preserve evidence, disable affected projections, return operators to the approved manual ledger, restore the last verified release/data point, reconcile every in-flight record and communicate affected candidate obligations. Never restore stale data without reapplying privacy deletions and legal holds.

## Required proof

Documented RPO/RTO by store, encrypted backup ownership, restore into isolated environment, permission revalidation, provider/file/checkpoint reconciliation, privacy re-deletion test, rollback time, data variance and accountable acceptance. None of this evidence exists yet.
