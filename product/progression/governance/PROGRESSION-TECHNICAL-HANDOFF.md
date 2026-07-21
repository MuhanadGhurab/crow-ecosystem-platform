# Progression Technical Handoff (Future Tech Validation)

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-GOV-TECH-001 |
| **Version** | 1.1.0 |
| **Status** | ARCHITECTURE RECOMMENDED · FORMULA CANDIDATES DOCUMENTED |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1B (extends 1A handoff) |
| **Handoff target** | Future technical validation (not run in 1A/1B) |
| **Last updated** | 2026-07-21 |
| **Related docs** | [PROGRESSION-SIMULATION-HANDOFF.md](./PROGRESSION-SIMULATION-HANDOFF.md) · [PROGRESSION-CALIBRATION-HANDOFF.md](./PROGRESSION-CALIBRATION-HANDOFF.md) · [AUTOMATION-HUMAN-AUTHORITY-BOUNDARY.md](./AUTOMATION-HUMAN-AUTHORITY-BOUNDARY.md) · [PROGRESSION-DATA-MINIMIZATION.md](./PROGRESSION-DATA-MINIMIZATION.md) · [../architecture/PROGRESSION-LEDGER-MODEL.md](../architecture/PROGRESSION-LEDGER-MODEL.md) · [../architecture/PROGRESSION-DECISION-REGISTRY.md](../architecture/PROGRESSION-DECISION-REGISTRY.md) · [../architecture/PROGRESSION-STATE-REGISTRY.md](../architecture/PROGRESSION-STATE-REGISTRY.md) · [../events/PROGRESSION-EVENT-VALIDITY.md](../events/PROGRESSION-EVENT-VALIDITY.md) · [../formulas/PROGRESSION-FORMULA-REGISTRY.md](../formulas/PROGRESSION-FORMULA-REGISTRY.md) · [../README.md](../README.md) |
| **Limitations** | SIMULATION CANDIDATE formulas · CALIBRATION NOT RUN · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED |
| **Expert review** | N/A for architecture / candidates |
| **Formula** | SIMULATION CANDIDATE · PENDING 1C (all IDs 0.1.0) |
| **Change history** | 1.0.0 — GHV.PROGRESSION.1A conceptual handoff · 1.1.0 — GHV.PROGRESSION.1B formula-version and calculation constraints |

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

## Formula-era technical constraints (GHV.PROGRESSION.1B)

These constraints apply to **future** calculation engines. They do **not** authorize Product Code, schema, or runtime now.

### Formula versions (0.1.0)

| Requirement | Detail |
|-------------|--------|
| Registry | Exact **24** IDs in [PROGRESSION-FORMULA-REGISTRY.md](../formulas/PROGRESSION-FORMULA-REGISTRY.md) |
| Current version | All active candidates **0.1.0** |
| Status | `SIMULATION CANDIDATE · PENDING GHV.PROGRESSION.1C CALIBRATION` |
| Revisions | Must be logged in [FORMULA-REVISION-LOG.md](../formulas/FORMULA-REVISION-LOG.md) before any parameter change |

### Deterministic rounding

| Rule | Intent |
|------|--------|
| Per-formula rounding | Follow each formula doc (e.g., Maturity Index 1 decimal half-away-from-zero; Levels integer triangular) |
| No opportunistic rounding | Do not round mid-pipeline to “look nicer” |
| Comparison order | Apply documented rounding before eligibility comparisons |

### Caps

| Concern | Requirement |
|---------|-------------|
| Volume caps | Honor XP/Momentum component caps so grinding cannot dominate |
| Output clamps | Clamp weekly Momentum to 0–100; respect league and Rank hard gates |
| Plan caps | Access Plan must never appear as a progression multiplier |

### Idempotency

Duplicate source-records / idempotency keys must not double-apply standing effects. Duplicates may be rejected or attached without additional influence (see Event Registry).

### Reversal mathematics

| Requirement | Detail |
|-------------|--------|
| Exact negation | Reversed XP withdraws the **exact original** recognized amount |
| Local blast radius | Corrections follow [PROGRESSION-CORRECTION-MATHEMATICS.md](../formulas/PROGRESSION-CORRECTION-MATHEMATICS.md) — targeted reevaluation, not silent history erase |
| Audit retention | Reversals withdraw current influence and retain history |

### Effective-time behavior

| Concept | Intent |
|---------|--------|
| Event time | When the underlying activity / review occurred |
| Recorded time | When progression accepted the event |
| Effective time | When standing influence applies (policy-defined) |
| Reversal effective time | When withdrawn influence stops affecting current standing |
| Season cutovers | Momentum season boundaries must be deterministic and versioned |

### Recalculation boundaries

| Boundary | Rule |
|----------|------|
| Ledger isolation | Recalculating one system must not redefine another ledger’s meaning |
| Freshness overlays | Freshness does not silently rewrite historical Mastery records |
| Mandatory floors | Route-Proven floors cannot be satisfied by averaging alone |
| Payment boundary | Recalculation never introduces plan-based deltas |

### Formula version storage (future)

When implemented, every standing computation must record:

* Formula / policy / template ID
* Semantic version
* Input source-record pointers
* Computation timestamp / effective time
* Seed or reproducibility handle where stochastic generators are used (population tools only)

### Reproducibility

| Surface | Requirement |
|---------|-------------|
| Persona paths | Deterministic from recorded event streams |
| Population | Seed **20260721** replay must match recorded outputs |
| Analytical package | `analysis/progression-simulation/` is the reference non-runtime tool; **not** application code |

### Explainability source records

Every user-visible standing change must be able to cite:

* Formula ID + version
* Upstream source-record pointer(s)
* Validity state of contributing events
* Whether the result is provisional / appealable / under integrity review

---

## Explicit exclusions

| Excluded from this handoff | Reason |
|----------------------------|--------|
| Database schema | Technical validation NOT RUN; Product Code BLOCKED |
| API contracts / runtime services | Product Code BLOCKED |
| Production deployment | Publication / Implementation BLOCKED |
| Treating analytical scripts as runtime | Isolated under `analysis/` only |

---

## Suggested future validation order (non-binding)

1. Event ingress + validity + idempotency
2. Ledger non-overwrite isolation
3. Decision authority gates (automation vs human)
4. Reversal / correction / effective-time
5. Formula-version storage + deterministic engines (post-1C candidates)
6. Privacy / age / analytics minimization
7. Explainability surfaces
8. Only then: production calculation services

```text
ARCHITECTURE RECOMMENDED
FORMULAS = SIMULATION CANDIDATE · PENDING 1C
TECHNICAL VALIDATION NOT RUN
NO database schema · NO runtime implementation · Product Code BLOCKED
CALIBRATION NOT RUN
```
