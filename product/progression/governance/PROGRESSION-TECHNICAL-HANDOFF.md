# Progression Technical Handoff (Future Tech Validation)

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-GOV-TECH-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1A |
| **Handoff target** | Future technical validation (not run in 1A) |
| **Last updated** | 2026-07-21 |
| **Related docs** | [PROGRESSION-SIMULATION-HANDOFF.md](./PROGRESSION-SIMULATION-HANDOFF.md) · [AUTOMATION-HUMAN-AUTHORITY-BOUNDARY.md](./AUTOMATION-HUMAN-AUTHORITY-BOUNDARY.md) · [PROGRESSION-DATA-MINIMIZATION.md](./PROGRESSION-DATA-MINIMIZATION.md) · [../architecture/PROGRESSION-LEDGER-MODEL.md](../architecture/PROGRESSION-LEDGER-MODEL.md) · [../architecture/PROGRESSION-DECISION-REGISTRY.md](../architecture/PROGRESSION-DECISION-REGISTRY.md) · [../architecture/PROGRESSION-STATE-REGISTRY.md](../architecture/PROGRESSION-STATE-REGISTRY.md) · [../events/PROGRESSION-EVENT-VALIDITY.md](../events/PROGRESSION-EVENT-VALIDITY.md) · [../README.md](../README.md) |
| **Limitations** | FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Expert review** | N/A for architecture |
| **Formula** | PENDING |
| **Change history** | 1.0.0 — GHV.PROGRESSION.1A: conceptual technical handoff (no schema, no runtime) |

---

## Purpose

Provide a **conceptual technical validation checklist** for future engineering review. This document is architecture-facing only.

```text
NO database schema
NO runtime implementation
TECHNICAL VALIDATION NOT RUN
Product Code BLOCKED
```

---

## Conceptual surfaces for future validation

### 1. Conceptual ledgers

Validate that each ledger in [PROGRESSION-LEDGER-MODEL.md](../architecture/PROGRESSION-LEDGER-MODEL.md) remains a separate meaning boundary:

- Writes to one ledger must not silently redefine another ledger’s current state.
- Historical entries remain queryable after reversal/correction.
- Exact total of conceptual ledgers in 1A: **11**.

No table DDL, indexes, or storage mapping is specified here.

### 2. Event model

Validate that progression event types from the Event Registry can be ingested with:

| Concern | Architectural requirement |
|---------|---------------------------|
| Subject binding | Event tied to the correct Crow / learner subject |
| Source authority | Source class permitted for claimed effects |
| Source-record pointer | Reference to authoritative upstream record |
| Privacy classification | Carried with the event instance |
| Idempotency key | Present where registry requires it |

### 3. Validity

Validate lifecycle adherence per [PROGRESSION-EVENT-VALIDITY.md](../events/PROGRESSION-EVENT-VALIDITY.md):

`RECEIVED` → `VALIDATING` → `VALID` | `REJECTED` | `UNDER_INTEGRITY_REVIEW`, with `REVERSED` / `SUPERSEDED` as governed outcomes.

Only `VALID` influences current standing.

### 4. State machines

Validate that registered states (`ST-PRG-*` in [PROGRESSION-STATE-REGISTRY.md](../architecture/PROGRESSION-STATE-REGISTRY.md)) are the only standing vocabularies used for each system, and that transitions are driven by VALID events or governed decisions — not by payment.

### 5. Decisions

Validate that decision types (`DEC-PRG-*`, exact count **21**) honor:

- Required sources
- Automation vs human authority ([AUTOMATION-HUMAN-AUTHORITY-BOUNDARY.md](./AUTOMATION-HUMAN-AUTHORITY-BOUNDARY.md))
- Explainability, appealability, sensitivity, audit, reversibility
- Final formula dependency marked PENDING until 1B+

### 6. Idempotency

Validate that duplicate source-records / idempotency keys do not double-apply standing effects. Duplicates may be rejected or attached without additional influence.

### 7. Reversals

Validate that reversals:

- Withdraw current standing influence
- Retain history
- Emit explainable correction / integrity linkage
- Do not erase audit trails

### 8. Effective-time

Validate conceptual effective-time semantics:

| Concept | Intent |
|---------|--------|
| **Event time** | When the underlying activity / review occurred |
| **Recorded time** | When progression accepted the event |
| **Effective time** | When standing influence applies (may equal event time under policy) |
| **Reversal effective time** | When withdrawn influence stops affecting current standing |

Exact clock rules and season cutovers are FORMULA / policy PENDING for 1B+; 1A requires the concepts to exist.

### 9. Audit

Validate that sensitive decisions and standing changes retain auditable before/after, actor, reason, and source pointers without exposing private Evidence to unauthorized roles.

### 10. Privacy

Validate data minimization ([PROGRESSION-DATA-MINIMIZATION.md](./PROGRESSION-DATA-MINIMIZATION.md)): necessary metadata only; Evidence referenced; personal identity separate from Crow identity; analytics non-exposing.

### 11. Sensitive decisions

Validate that human-required decisions cannot be finalized by automation alone (sensitive Evidence, serious integrity, high-impact Titles, Prestige grant/permanent revoke, irreversible Trust, approved-appeal override, payment-as-Skill).

### 12. Explainability

Validate that user-visible standing changes can answer *what changed*, *which sources*, and *whether provisional / appealable / under review* — without inventing competence claims from XP or payment.

---

## Explicit exclusions

| Excluded from this handoff | Reason |
|----------------------------|--------|
| Database schema | Technical validation NOT RUN; Product Code BLOCKED |
| API contracts / runtime services | Product Code BLOCKED |
| Numeric formulas / thresholds | Owned by GHV.PROGRESSION.1B |
| Production deployment | Publication / Implementation BLOCKED |

---

## Suggested future validation order (non-binding)

1. Event ingress + validity + idempotency
2. Ledger non-overwrite isolation
3. Decision authority gates (automation vs human)
4. Reversal / correction / effective-time
5. Privacy / age / analytics minimization
6. Explainability surfaces
7. Only then: formula-backed calculation engines (post-1B)

```text
ARCHITECTURE RECOMMENDED
TECHNICAL VALIDATION NOT RUN
NO database schema · NO runtime implementation · Product Code BLOCKED
FORMULA PENDING · SIMULATION NOT RUN · CALIBRATION NOT RUN
```
