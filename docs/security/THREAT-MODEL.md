# Recruitment System threat model — proposed v1.7 baseline

This is a design baseline, not a completed security review. GitHub Pages contains fictional data and no network writes. Pilot/production remains blocked until owners validate the selected architecture and evidence.

## Assets and unacceptable outcomes

Protected assets include candidate identity/contact/files, accommodation and privacy facts, hiring evidence, decisions, compensation/offers, authentication material, audit evidence and integration credentials. Unacceptable outcomes include cross-candidate or cross-role disclosure, unauthorized employment action, tampered evidence/version history, silent provider divergence, public indexing of private content, uncontrolled export, unavailable candidate commitments and unrecoverable deletion/restore.

## Priority abuse cases and controls

| Threat | Required preventive controls | Required detection/recovery evidence |
| --- | --- | --- |
| Broken object/row/field authorization | Deny-by-default purpose policy; server-side subject/object/row/field checks; negative IDs return non-enumerating responses | Cross-role/cross-candidate tests, authorization decision logs, access review |
| Session takeover/recovery abuse | Approved IdP, MFA/phishing-resistant privileged access, short-lived sessions, reauthentication and secure recovery | IdP policy export, recovery tabletop, risky-session alerts |
| Resume/file malware or data leak | Type/size allow-list, quarantine, malware scan, private storage, signed retrieval, content-disposition, retention | Malicious fixtures, scan failure recovery, storage/access audit |
| Mass assignment or unsafe generic CRUD | Purpose-built commands, schema allow-list, expected version, state-transition guard | Contract/negative tests and rejected-field telemetry |
| Replay, duplicate or out-of-order integration | Signatures, timestamp/nonce window, idempotency key, aggregate version and checkpoint reconciliation | Replay/out-of-order fixtures, DLQ/replay audit |
| Hiring evidence or offer tampering | Immutable versions, separation of duties, human attribution, hash/fingerprint and approval bound to exact version | Version-diff, supersession and approval-negative tests |
| Injection/XSS/template abuse | Contextual encoding, CSP, schema validation, template preview/approval and no executable candidate content | SAST/DAST/CSP reports and malicious-content fixtures |
| Export/report disclosure | Aggregation threshold, recipient reauthorization, watermark/expiry/revocation, delivery audit and field suppression | Export matrix tests, denied-recipient and revocation evidence |
| Availability/provider failure | Timeouts, circuit breakers, retry budgets, safe manual fallback and candidate-safe delay communication | Fault injection, SLO alert, reconciliation and recovery drill |
| Retention/deletion/legal-hold conflict | Effective rules, scoped holds, provider/backups reconciliation and destruction evidence | Request/hold fixtures, restore then re-delete validation |
| Privileged configuration abuse | Separate admin roles, reviewed source-driven changes, simulation, two-person approval and drift detection | Change audit, break-glass review and rollback drill |
| Sensitive logging/observability | Structured allow-list, token/PII redaction, access controls and bounded retention | Log sampling, secret scan and deletion evidence |

## Verification mapping

- Unit/contract: formula denominators, state invariants, field allow-lists, permission decisions, idempotency and schema validation.
- Integration: IdP/BFF/Salesforce/provider negative access, signature/replay, failure/retry/cancel and reconciliation.
- Security: SAST, dependency/secret scan, IaC/metadata scan, DAST, authenticated authorization testing and targeted penetration test.
- Human: security/privacy/legal sign-off, role-access walkthrough, incident tabletop and candidate-support recovery exercise.

## Open decisions

IdP, BFF stack, hosting, encryption/key ownership, Salesforce editions/add-ons, file/email/calendar/e-sign/background providers, aggregation thresholds, retention schedule, SIEM/on-call and penetration-test scope remain unapproved.
