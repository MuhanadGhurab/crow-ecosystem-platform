# External Validation Condition Register

| Field | Value |
|-------|-------|
| **Gate ID** | GHV.VALIDATION.1A |
| **Document ID** | GHV-VAL-1A-COND-001 |
| **Date** | 2026-07-21 |
| **Owner** | Founder (RAVEN) |
| **Branch HEAD** | `6845688c0fd97680075f1d83ae1cd87b5a2d1352` |
| **Imported from** | [FINAL-ARCHITECTURE-CONDITION-REGISTER.md](../../architecture/ghuravia/governance/FINAL-ARCHITECTURE-CONDITION-REGISTER.md) v1.0.0 |

## Roll-up @ Validation.1A workspace open

| Metric | Count |
|--------|------:|
| Total conditions | **32** |
| Architecture SATISFIED (unchanged) | **4** |
| Validation.1A SATISFIED (new external proof) | **0** |
| NOT AVAILABLE (external / infra / provider) | **13** |
| NOT AVAILABLE / IN REVIEW (legal) | **4** |
| NOT RUN (user validation) | **5** |
| RETAINED (implementation) | **3** |
| RETAINED FOR LAUNCH | **2** |
| **BLOCKING Product Code Authorization** | **13** |

```text
Architecture Design Baseline: LOCKED v1.0.0
Blocking Architecture Design conditions @ 1E: 0
Blocking Product Code Authorization @ Validation.1A open: 13 (external/infra/provider set)
Product Code: BLOCKED
Implementation Authorization: NOT GRANTED
```

## Disposition key @ Validation.1A

| Validation.1A result | Meaning |
|---------------------|---------|
| **SATISFIED (architecture)** | Closed at architecture design level; unchanged @ 1A |
| **NOT AVAILABLE** | External proof cannot be collected — credentials, sandbox, or Preview absent |
| **NOT AVAILABLE / IN REVIEW** | Legal or regulatory clearance not obtained |
| **NOT RUN** | User, a11y, or UX study not executed |
| **RETAINED** | Remains for Implementation or Launch gate |
| **BLOCKING** | Must close (or accept documented residual risk under governance) before Product Code Authorization |

## Condition register

| ID | Condition | Architecture @ 1E | Validation.1A result | Blocking Product Code? | Notes |
|----|-----------|-------------------|----------------------|:----------------------:|-------|
| COND-001 | Route Handler deny-by-default maps to activation authority | **SATISFIED** | **SATISFIED (architecture)** | No | SPK-003 · ADR-015 — design evidence sufficient |
| COND-002 | Transactional outbox compatible with audit append | **SATISFIED** | **SATISFIED (architecture)** | No | SPK-010/019 |
| COND-003 | Sensitive projection hygiene for HIGHLY_RESTRICTED fields | RETAINED FOR IMPLEMENTATION | **RETAINED** | No* | ADR-006 — closes in Product Code gate |
| COND-004 | Session CSRF boundary in Product Code | RETAINED FOR IMPLEMENTATION | **RETAINED** | No* | ADR-014 |
| COND-005 | Privileged Route Handler dual-control audit | **SATISFIED** | **SATISFIED (architecture)** | No | SPK-019 · ADR-022 |
| COND-006 | RTL / LTR island technical pattern | **SATISFIED** | **SATISFIED (architecture)** | No | SPK-002 · ADR-025 |
| COND-007 | Arabic typography / mixed-script user validation | RETAINED FOR USER VALIDATION | **NOT RUN** | No | ADR-025 — user study required |
| COND-008 | Accessibility manual / user review before controlled launch | RETAINED FOR USER VALIDATION | **NOT RUN** | No | SPK-017 · ADR-026 |
| COND-009 | IdP provider sandbox validation | RETAINED FOR EXTERNAL VALIDATION | **NOT AVAILABLE** | **YES** | Credentials/sandbox absent · ADR-013 |
| COND-010 | Email deliverability provider test | RETAINED FOR EXTERNAL VALIDATION | **NOT AVAILABLE** | **YES** | ADR-016 |
| COND-011 | Object storage provider selection + isolation proof | RETAINED FOR EXTERNAL VALIDATION | **NOT AVAILABLE** | **YES** | ADR-020 · SPK-007 |
| COND-012 | Scanner vendor selection + detection benchmark | RETAINED FOR EXTERNAL VALIDATION | **NOT AVAILABLE** | **YES** | ADR-021 · SPK-008 |
| COND-013 | Retention duration legal review | RETAINED FOR LEGAL | **NOT AVAILABLE / IN REVIEW** | No** | ADR-017 — legal counsel |
| COND-014 | Minor age definition + parental consent legal review | RETAINED FOR LEGAL | **NOT AVAILABLE / IN REVIEW** | No** | ADR-023 · SPK-025 |
| COND-015 | KMS / encryption provider selection | RETAINED FOR EXTERNAL VALIDATION | **NOT AVAILABLE** | **YES** | ADR-018 |
| COND-016 | Realtime provider sandbox (Live Sky) | RETAINED FOR EXTERNAL VALIDATION | **NOT AVAILABLE** | **YES** | ADR-030 · SPK-014/015 |
| COND-017 | Search provider / corpus quality at scale | RETAINED FOR EXTERNAL VALIDATION | **NOT AVAILABLE** | **YES** | ADR-031 · SPK-016 |
| COND-018 | Notification provider deliverability sandbox | RETAINED FOR EXTERNAL VALIDATION | **NOT AVAILABLE** | **YES** | ADR-032 · SPK-018 |
| COND-019 | Observability provider + cost validation | RETAINED FOR EXTERNAL VALIDATION | **NOT AVAILABLE** | **YES** | ADR-034 · SPK-022 |
| COND-020 | DRAFT RPO/RTO operational DR drill | RETAINED FOR LAUNCH | **RETAINED** | No | ADR-035 · SPK-020 — launch gate |
| COND-021 | DRAFT Skyboard performance budget under load | RETAINED FOR EXTERNAL VALIDATION | **NOT AVAILABLE** | **YES** | ADR-028 · SPK-023 |
| COND-022 | Preview/Production external infra proof | RETAINED FOR EXTERNAL VALIDATION | **NOT AVAILABLE** | **YES** | ADR-036 · SPK-021 · Preview NOT ESTABLISHED · TECH-018 OPEN |
| COND-023 | Saudi / Nafath official access verification | RETAINED FOR LEGAL | **NOT AVAILABLE / IN REVIEW** | No** | ADR-038 |
| COND-024 | Session timeout usability validation | RETAINED FOR USER VALIDATION | **NOT RUN** | No | ADR-014 |
| COND-025 | Hono extraction / backend scale trigger | RETAINED FOR IMPLEMENTATION | **RETAINED** | No* | ADR-003 |
| COND-026 | Production migration ownership | RETAINED FOR IMPLEMENTATION | **RETAINED** | No* | ADR-006/037 |
| COND-027 | Moderation operational SLAs and appeals UX | RETAINED FOR USER VALIDATION | **NOT RUN** | No | SPK-013 |
| COND-028 | Penetration testing | RETAINED FOR EXTERNAL VALIDATION | **NOT AVAILABLE** | **YES** | Pre-production programme |
| COND-029 | Compliance certification (SOC2 etc.) | RETAINED FOR LEGAL | **NOT AVAILABLE / IN REVIEW** | No** | Not claimed |
| COND-030 | Real-user calibration / usability | RETAINED FOR USER VALIDATION | **NOT RUN** | No | Programme-level |
| COND-031 | Production SLO establishment | RETAINED FOR LAUNCH | **RETAINED** | No | DRAFT targets only |
| COND-032 | Relational datastore host selection | RETAINED FOR EXTERNAL VALIDATION | **NOT AVAILABLE** | **YES** | ADR-005 · Preview DATABASE_URL/DIRECT_URL **ABSENT** |

\* RETAINED FOR IMPLEMENTATION conditions block Product Code **implementation completeness** but are expected to close during governed implementation — not external validation sandboxes.

\** Legal conditions may block **controlled launch** or specific features; classified separately from provider/Preview **Product Code Authorization** blockers unless governance escalates.

## Blocking Product Code Authorization set

The following conditions are **BLOCKING Product Code Authorization** @ Validation.1A workspace open (no external proof available):

```text
COND-009  IdP sandbox
COND-010  Email deliverability
COND-011  Object storage isolation
COND-012  Scanner benchmark
COND-015  KMS / encryption provider
COND-016  Realtime sandbox
COND-017  Search at scale
COND-018  Notification deliverability
COND-019  Observability + cost
COND-021  Skyboard load budget
COND-022  Preview/Production infra proof
COND-028  Penetration testing
COND-032  Relational datastore host
```

## Category summary

| Category | IDs | Validation.1A state |
|----------|-----|---------------------|
| **Architecture SATISFIED** | 001, 002, 005, 006 | Unchanged — design-level closure stands |
| **EXTERNAL → NOT AVAILABLE** | 009–012, 015–019, 021, 022, 028, 032 | No sandbox / Preview / hosted proof |
| **LEGAL → NOT AVAILABLE / IN REVIEW** | 013, 014, 023, 029 | Counsel / regulatory clearance pending |
| **USER → NOT RUN** | 007, 008, 024, 027, 030 | No user studies scheduled |
| **IMPLEMENTATION → RETAINED** | 003, 004, 025, 026 | Product Code gate |
| **LAUNCH → RETAINED** | 020, 031 | Controlled launch gate |

## Explicit non-claims

```text
Architecture SATISFIED ≠ external validation SATISFIED
NOT AVAILABLE ≠ waived — conditions remain open
This register does NOT authorize Product Code or Implementation
```

## Related

- [PROVIDER-ACCESS-MATRIX.md](./PROVIDER-ACCESS-MATRIX.md)
- [ENVIRONMENT-AVAILABILITY-MATRIX.md](./ENVIRONMENT-AVAILABILITY-MATRIX.md)
- [VALIDATION-EVIDENCE-INDEX.md](./VALIDATION-EVIDENCE-INDEX.md)

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | Initial Validation.1A mapping imported from architecture final register |
