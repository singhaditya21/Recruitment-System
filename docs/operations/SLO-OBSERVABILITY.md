# SLO, observability and capacity contract — proposed

No production telemetry exists. Targets below are acceptance candidates and must be baselined with selected providers and pilot volume.

| Journey/SLI | Proposed objective | Measurement and exclusions | Error-budget action |
| --- | --- | --- | --- |
| Public job availability | 99.9% monthly | policy-approved job projection returns usable content; planned maintenance excluded only if content remains available | freeze nonessential changes; activate cached safe projection |
| Application submission acknowledgement | 99.9% in 5 minutes | accepted attempt has canonical ID and candidate receipt; duplicate safely reconciled | pause acquisition if durable acknowledgement is uncertain |
| Candidate status freshness | 99% within 15 minutes | candidate-safe projection matches canonical allowed status | surface delay, reconcile, stop misleading notifications |
| Interview booking integrity | 99.5% exact session/calendar reconciliation | one canonical session/version and every required provider projection agrees | stop auto-confirmation, move to coordinator fallback |
| Message delivery evidence | 98% eligible messages within provider SLA | suppressed messages excluded; queued/failed remain visible | pause nonessential sends, own recovery queue |
| Offer approval integrity | 100% approval bound to exact current version | no superseded/unauthorized offer can be sent | hard stop and incident review |
| Hire handoff reconciliation | 100% attempted handoffs exactly acknowledged | not-ready excluded; failure never counts as hire | HRIS fallback, prevent completed-hire projection |
| Privacy request execution | 100% within approved legal/policy SLA | verified in-scope request through providers/backups/holds | privacy escalation and affected-action freeze |

Required signals: request/command/event correlation IDs; canonical and provider versions; latency; retries; idempotency conflicts; authorization denials; queue age; reconciliation lag; stale projections; suppressed actions; SLO burn; candidate commitment breaches; configuration version; deploy version; and redacted error class. Logs must exclude raw files, tokens, message bodies and unnecessary PII.

Alert ownership must map to Recruiting Operations, Candidate Support, Platform, HRIS, Privacy/Legal and Security. Every alert needs severity, acknowledgement target, candidate-impact query, safe fallback, escalation and closure evidence. Capacity validation covers expected and five-year volumes, Salesforce/API/async/storage limits, providers, report/export load and recovery backlogs.
