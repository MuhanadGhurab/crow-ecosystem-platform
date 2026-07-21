# Final Architecture Condition Register

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARC-GOV-COND-001 |
| **Version** | 1.0.1 |
| **Status** | **ACTIVE** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1E · **Validation.1A disposition note added** |
| **Validation.1A @ 2026-07-21** | External items **RETAINED FOR VALIDATION.1B** · **0** falsely SATISFIED BY VALIDATION.1A · see [ARCHITECTURE-CONDITION-VALIDATION-RECONCILIATION.md](../../validation/ghuravia/external-1a/governance/ARCHITECTURE-CONDITION-VALIDATION-RECONCILIATION.md) |
| **Branch HEAD** | `6f01d1fd2b7f570e712037a5c4f035861a68063d` |

## Roll-up

| Metric | Count |
|--------|------:|
| Total conditions tracked | **32** |
| Blocking Architecture Design conditions | **0** |
| SATISFIED (architecture-level) | **11** |
| RETAINED FOR EXTERNAL VALIDATION | **8** |
| RETAINED FOR LEGAL | **4** |
| RETAINED FOR USER VALIDATION | **5** |
| RETAINED FOR IMPLEMENTATION | **3** |
| RETAINED FOR LAUNCH | **1** |

```text
All remaining conditions are NON-BLOCKING for Architecture Design Baseline lock
Product Code: BLOCKED
External validation: NOT COMPLETE
```

## Condition register

| ID | Condition | Origin gate | Disposition @ 1E | Validation.1A note | Notes |
|----|-----------|-------------|------------------|-------------------|-------|
| COND-001 | Route Handler deny-by-default maps to activation authority | 1B → 1C | **SATISFIED** | **Unchanged** | SPK-003 · ADR-015 |
| COND-002 | Transactional outbox compatible with audit append | 1B → 1C | **SATISFIED** | **Unchanged** | SPK-010/019 |
| COND-003 | Sensitive projection hygiene for HIGHLY_RESTRICTED fields | 1C | **RETAINED FOR IMPLEMENTATION** | **RETAINED** | ADR-006 |
| COND-004 | Session CSRF boundary in Product Code | 1C | **RETAINED FOR IMPLEMENTATION** | **RETAINED** | ADR-014 |
| COND-005 | Privileged Route Handler dual-control audit | 1C | **SATISFIED** | **Unchanged** | SPK-019 · ADR-022 |
| COND-006 | RTL / LTR island technical pattern | 1B → 1D | **SATISFIED** | **Unchanged** | SPK-002 · ADR-025 |
| COND-007 | Arabic typography / mixed-script user validation | 1D | **RETAINED FOR USER VALIDATION** | **NOT RUN · VALIDATION.1B** | ADR-025 |
| COND-008 | Accessibility manual / user review before controlled launch | 1D | **RETAINED FOR USER VALIDATION** | **NOT RUN · VALIDATION.1B** | SPK-017 · ADR-026 |
| COND-009 | IdP provider sandbox validation | 1C | **RETAINED FOR EXTERNAL VALIDATION** | **NOT AVAILABLE · VALIDATION.1B** | ADR-013 |
| COND-010 | Email deliverability provider test | 1C | **RETAINED FOR EXTERNAL VALIDATION** | **NOT AVAILABLE · VALIDATION.1B** | ADR-016 |
| COND-011 | Object storage provider selection + isolation proof | 1C | **RETAINED FOR EXTERNAL VALIDATION** | **NOT AVAILABLE · VALIDATION.1B** | ADR-020 · SPK-007 |
| COND-012 | Scanner vendor selection + detection benchmark | 1C | **RETAINED FOR EXTERNAL VALIDATION** | **NOT AVAILABLE · VALIDATION.1B** | ADR-021 · SPK-008 |
| COND-013 | Retention duration legal review | 1C | **RETAINED FOR LEGAL** | **NOT APPROVED · VALIDATION.1B** | ADR-017 |
| COND-014 | Minor age definition + parental consent legal review | 1C | **RETAINED FOR LEGAL** | **NOT APPROVED · VALIDATION.1B** | ADR-023 · SPK-025 |
| COND-015 | KMS / encryption provider selection | 1C | **RETAINED FOR EXTERNAL VALIDATION** | **NOT AVAILABLE · VALIDATION.1B** | ADR-018 |
| COND-016 | Realtime provider sandbox (Live Sky) | 1D | **RETAINED FOR EXTERNAL VALIDATION** | **NOT AVAILABLE · VALIDATION.1B** | ADR-030 · SPK-014/015 |
| COND-017 | Search provider / corpus quality at scale | 1D | **RETAINED FOR EXTERNAL VALIDATION** | **NOT AVAILABLE · VALIDATION.1B** | ADR-031 · SPK-016 |
| COND-018 | Notification provider deliverability sandbox | 1D | **RETAINED FOR EXTERNAL VALIDATION** | **NOT AVAILABLE · VALIDATION.1B** | ADR-032 · SPK-018 |
| COND-019 | Observability provider + cost validation | 1D | **RETAINED FOR EXTERNAL VALIDATION** | **NOT AVAILABLE · VALIDATION.1B** | ADR-034 · SPK-022 |
| COND-020 | DRAFT RPO/RTO operational DR drill | 1D | **RETAINED FOR LAUNCH** | **NOT RUN · VALIDATION.1B** | ADR-035 · SPK-020 |
| COND-021 | DRAFT Skyboard performance budget under load | 1D | **RETAINED FOR EXTERNAL VALIDATION** | **NOT AVAILABLE · VALIDATION.1B** | ADR-028 · SPK-023 |
| COND-022 | Preview/Production external infra proof | 1B → 1D | **RETAINED FOR EXTERNAL VALIDATION** | **NOT AVAILABLE · VALIDATION.1B** | ADR-036 · SPK-021 · TECH-018 |
| COND-023 | Saudi / Nafath official access verification | 1C → 1D | **RETAINED FOR LEGAL** | **NOT APPROVED · VALIDATION.1B** | ADR-038 |
| COND-024 | Session timeout usability validation | 1C | **RETAINED FOR USER VALIDATION** | **NOT RUN · VALIDATION.1B** | ADR-014 |
| COND-025 | Hono extraction / backend scale trigger | 1B | **RETAINED FOR IMPLEMENTATION** | **RETAINED** | ADR-003 |
| COND-026 | Production migration ownership | 1B | **RETAINED FOR IMPLEMENTATION** | **Rehearsal NOT AVAILABLE · VALIDATION.1B** | ADR-006/037 |
| COND-027 | Moderation operational SLAs and appeals UX | 1C | **RETAINED FOR USER VALIDATION** | **NOT RUN · VALIDATION.1B** | SPK-013 |
| COND-028 | Penetration testing | 1C | **RETAINED FOR EXTERNAL VALIDATION** | **NOT RUN · VALIDATION.1B** | Pre-production programme |
| COND-029 | Compliance certification (SOC2 etc.) | Programme | **RETAINED FOR LEGAL** | **NOT APPROVED · VALIDATION.1B** | Not claimed |
| COND-030 | Real-user calibration / usability | Programme | **RETAINED FOR USER VALIDATION** | **NOT RUN · VALIDATION.1B** | Not run |
| COND-031 | Production SLO establishment | 1D | **RETAINED FOR LAUNCH** | **RETAINED** | DRAFT targets only |
| COND-032 | Relational datastore host selection | 1B | **RETAINED FOR EXTERNAL VALIDATION** | **NOT AVAILABLE · VALIDATION.1B** | ADR-005 · TECH-018 |

## Disposition definitions

| Disposition | Meaning at 1E lock |
|-------------|-------------------|
| **SATISFIED** | Architecture design evidence closes the condition for baseline purposes |
| **RETAINED FOR EXTERNAL VALIDATION** | Provider, infra, security, or scale proof deferred to GHV.VALIDATION programme |
| **RETAINED FOR LEGAL** | Legal counsel or regulatory clearance required |
| **RETAINED FOR USER VALIDATION** | Real users, a11y, or UX studies required |
| **RETAINED FOR IMPLEMENTATION** | Closed during Product Code / implementation gates |
| **RETAINED FOR LAUNCH** | Closed before controlled launch / production |

## Explicit non-claims

Closing a condition as **SATISFIED** at architecture level does **not** authorize Product Code or claim production readiness.

## Related

- [ARCHITECTURE-1B-CONDITION-REVIEW.md](./ARCHITECTURE-1B-CONDITION-REVIEW.md)
- [ARCHITECTURE-1B-1C-CONDITION-REVIEW.md](./ARCHITECTURE-1B-1C-CONDITION-REVIEW.md)
- [FINAL-PROVIDER-DEFERRAL-REGISTER.md](./FINAL-PROVIDER-DEFERRAL-REGISTER.md)

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1E — final condition register |
| 1.0.1 | 2026-07-21 | GHV.VALIDATION.1A — Validation.1A disposition note column (historical @ 1E preserved) |
