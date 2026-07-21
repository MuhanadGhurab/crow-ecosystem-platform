# Progression Technical Handoff (Future Tech Validation)

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-GOV-TECH-001 |
| **Version** | 1.3.0 |
| **Status** | ARCHITECTURE RECOMMENDED · PROGRESSION DESIGN BASELINE LOCKED · TECHNICAL VALIDATION NOT RUN |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1D (extends 1A/1B/1C handoff) |
| **Handoff target** | Future technical validation (not run in 1A–1D) · blocked from ARCHITECTURE.1A until GHV.BASELINE-CORRECTION.1 |
| **Last updated** | 2026-07-21 |
| **Related docs** | [PROGRESSION-BASELINE-MANIFEST.md](./PROGRESSION-BASELINE-MANIFEST.md) · [FINAL-FORMULA-VERSION-REGISTRY.md](./FINAL-FORMULA-VERSION-REGISTRY.md) · [PROGRESSION-SIMULATION-HANDOFF.md](./PROGRESSION-SIMULATION-HANDOFF.md) · [PROGRESSION-CALIBRATION-HANDOFF.md](./PROGRESSION-CALIBRATION-HANDOFF.md) · [AUTOMATION-HUMAN-AUTHORITY-BOUNDARY.md](./AUTOMATION-HUMAN-AUTHORITY-BOUNDARY.md) · [PROGRESSION-DATA-MINIMIZATION.md](./PROGRESSION-DATA-MINIMIZATION.md) · [../architecture/PROGRESSION-LEDGER-MODEL.md](../architecture/PROGRESSION-LEDGER-MODEL.md) · [../architecture/PROGRESSION-DECISION-REGISTRY.md](../architecture/PROGRESSION-DECISION-REGISTRY.md) · [../architecture/PROGRESSION-STATE-REGISTRY.md](../architecture/PROGRESSION-STATE-REGISTRY.md) · [../events/PROGRESSION-EVENT-VALIDITY.md](../events/PROGRESSION-EVENT-VALIDITY.md) · [../formulas/PROGRESSION-FORMULA-REGISTRY.md](../formulas/PROGRESSION-FORMULA-REGISTRY.md) · [../README.md](../README.md) |
| **Limitations** | Design baseline locked · **NOT production calibrated** · TECHNICAL VALIDATION NOT RUN · Product Code BLOCKED · **no schema** · screen-count defect external |
| **Expert review** | N/A for architecture / design lock |
| **Formula** | LOCKED AS DESIGN BASELINE (MAT 0.2.0 · MOM-002 0.2.0 WITH CONDITIONS · XP 0.1.1 · else 0.1.0; TRU/PRS/POP WITH CONDITIONS) |
| **Change history** | 1.0.0 — GHV.PROGRESSION.1A · 1.1.0 — GHV.PROGRESSION.1B · 1.2.0 — GHV.PROGRESSION.1C · 1.3.0 — GHV.PROGRESSION.1D design lock + remaining debt |

---

## Purpose

Provide a **conceptual technical validation checklist** for future engineering review. Progression Design Baseline v1.0.0 is locked; this document remains architecture-facing only.

```text
LOCKED AS GOVERNED PROGRESSION DESIGN BASELINE v1.0.0
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

## Formula-era technical constraints (GHV.PROGRESSION.1B → 1D)

These constraints apply to **future** calculation engines. They do **not** authorize Product Code, schema, or runtime now.

```text
NO database schema
NO runtime implementation
TECHNICAL VALIDATION NOT RUN
Product Code BLOCKED
LOCKED AS GOVERNED PROGRESSION DESIGN BASELINE v1.0.0
```

### Formula versions (post-1D)

| Requirement | Detail |
|-------------|--------|
| Registry | Exact **24** IDs · versions authoritative in [FINAL-FORMULA-VERSION-REGISTRY.md](./FINAL-FORMULA-VERSION-REGISTRY.md) |
| Accepted versions | FRM-MAT-001 **0.2.0** · FRM-MOM-002 **0.2.0** · FRM-XP-001 **0.1.1** · all others **0.1.0** |
| Status | **LOCKED AS DESIGN BASELINE** · conditional locks MOM-002 · TRU · PRS · POL-POP · **NOT production calibrated** · **synthetic only** |
| Conditions | Real-user / usability / tech validation still **NOT RUN** |
| Revisions | Change Freeze: Controlled Change Request + FORMULA-REVISION-LOG before any parameter change |

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
| Momentum buffer | FRM-MOM-002 v0.2.0 Alternative B ±2 promotion/demotion hysteresis |

### Idempotency

Duplicate source-records / idempotency keys must not double-apply standing effects. Duplicates may be rejected or attached without additional influence (see Event Registry). Evidence XP is **once-per-approval** (FRM-XP-001 v0.1.1).

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
| Rank skip | Maturity Rank skip only when a higher Rank’s gates are **fully met** (FRM-MAT-001 v0.2.0) |

### Provisional standings

Leaderboard and Prestige nomination standings may be provisional/reversible. Prestige Class grant remains human-only. Public boards must honor POL-POP-001 population thresholds.

### Explanation sources

Standing changes must cite formula ID + version + source events (AR/EN explainability package). XP must never be explained as Skill.

### Privacy / human-decision boundaries

Data minimization and age-privacy architectures remain binding. Sensitive decisions (Prestige grant, serious Trust, high-impact Titles) cannot be finalized by automation alone.

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
| Population | Seeds **20260721–20260725** replay must match recorded calibration outputs |
| Analytical package | `analysis/progression-simulation/` is the reference non-runtime tool; **not** application code |

### Explainability source records

Every user-visible standing change must be able to cite:

* Formula ID + version
* Upstream source-record pointer(s)
* Validity state of contributing events
* Whether the result is provisional / appealable / under integrity review

### Cross-baseline technical sequencing debt

| Debt | Requirement |
|------|-------------|
| Screen registry | Authoritative **92 / 7 shells** vs listed **90** — **GHV.BASELINE-CORRECTION.1** before **ARCHITECTURE.1A** |
| Real-user pilot | NOT RUN — required before production confidence |
| Technical validation | NOT RUN — required before Product Code |

---

## Explicit exclusions

| Excluded from this handoff | Reason |
|----------------------------|--------|
| Database schema | Technical validation NOT RUN; Product Code BLOCKED |
| API contracts / runtime services | Product Code BLOCKED |
| Production deployment | Publication / Implementation BLOCKED |
| Treating analytical scripts as runtime | Isolated under `analysis/` only |
| Silent screen-count rewrite | External defect; BASELINE-CORRECTION.1 only |

---

## Suggested future validation order (non-binding)

1. **GHV.BASELINE-CORRECTION.1** — screen registry 92-screen reconciliation
2. Event ingress + validity + idempotency
3. Ledger non-overwrite isolation
4. Decision authority gates (automation vs human)
5. Reversal / correction / effective-time
6. Formula-version storage + deterministic engines (locked design versions)
7. Privacy / age / analytics minimization
8. Explainability surfaces
9. Only then: production calculation services

```text
PROGRESSION DESIGN BASELINE v1.0.0 LOCKED
TECHNICAL VALIDATION NOT RUN
NO database schema · NO runtime implementation · Product Code BLOCKED
REAL-USER CALIBRATION NOT RUN
ARCHITECTURE.1A BLOCKED UNTIL BASELINE-CORRECTION.1
```
