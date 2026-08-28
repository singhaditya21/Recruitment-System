# Incident response runbook — proposed

## Severity

- SEV-1: unauthorized disclosure/action, corrupted consequential truth, unrecoverable candidate commitment or broad outage.
- SEV-2: material journey/provider failure with bounded workaround or significant SLO burn.
- SEV-3: degraded nonconsequential function, delayed internal work or isolated recoverable fault.

## Response sequence

1. Acknowledge, assign incident commander and record start/correlation/deploy/configuration versions.
2. Classify affected candidates, jobs, records, providers, jurisdictions and commitments without copying sensitive payloads into the incident channel.
3. Contain with the narrowest kill switch: pause publication, submission, notifications, scheduling, offers, handoffs, exports or automation independently.
4. Preserve evidence and exact versions; do not “fix” canonical state by editing audit/event history.
5. Provide candidate-safe communication through Candidate Support when a promised action or deadline is affected.
6. Reconcile canonical records, provider projections, queues and checkpoints before restoring automation.
7. Restore in stages, monitor burn/replay/duplicates and obtain functional owner confirmation.
8. Complete security/privacy/legal notification assessment, root cause, corrective actions and dated closure.

Exercises required before pilot: cross-candidate authorization, duplicate submission, calendar divergence, message outage, superseded offer, failed handoff, privacy deletion/provider mismatch, credential compromise and restore/replay.
