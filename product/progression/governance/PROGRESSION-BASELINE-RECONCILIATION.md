# Progression Baseline Reconciliation

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-GOV-REC-001 |
| **Version** | 1.0.0 |
| **Status** | LOCKED AS GOVERNED PROGRESSION DESIGN BASELINE |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1D §8 |
| **Last updated** | 2026-07-21 |
| **Related** | [PROGRESSION-BASELINE-MANIFEST.md](./PROGRESSION-BASELINE-MANIFEST.md) · [../formulas/PROGRESSION-FORMULA-REGISTRY.md](../formulas/PROGRESSION-FORMULA-REGISTRY.md) · [../architecture/PROGRESSION-SYSTEM-SEPARATION.md](../architecture/PROGRESSION-SYSTEM-SEPARATION.md) |
| **Overall result** | **ALL MATCH** |

```text
LOCKED AS GOVERNED PROGRESSION DESIGN BASELINE
INTERNAL SYNTHETIC CALIBRATION COMPLETE

REAL-USER CALIBRATION: NOT RUN
USABILITY VALIDATION: NOT RUN
TECHNICAL VALIDATION: NOT RUN
PRODUCTION CALIBRATION: NOT RUN
IMPLEMENTATION: BLOCKED
PRODUCTION READINESS: BLOCKED
```

## Purpose

Reconcile Gate §8 expected baseline totals against authoritative registries and simulation evidence. Architecture was not altered to force a count.

---

## Reconciliation table

| Item | Expected | Actual | Match | Discrepancy | Correction | Primary source |
|------|--------:|-------:|-------|-------------|------------|----------------|
| Progression systems (`PGS-*`) | 10 | 10 | **MATCH** | None | — | [PROGRESSION-SYSTEM-SEPARATION.md](../architecture/PROGRESSION-SYSTEM-SEPARATION.md) |
| Access Plan boundary | 1 | 1 | **MATCH** | None | — | System Separation (commercial outside progression) |
| Formula IDs (`FRM-*`) | 16 | 16 | **MATCH** | None | — | [PROGRESSION-FORMULA-REGISTRY.md](../formulas/PROGRESSION-FORMULA-REGISTRY.md) |
| Policy IDs (`POL-*`) | 6 | 6 | **MATCH** | None | — | Formula Registry |
| Template IDs (`TPL-*`) | 2 | 2 | **MATCH** | None | — | Formula Registry |
| Total formula/policy/template IDs | 24 | 24 | **MATCH** | None | — | Formula Registry |
| Progression events | 53 | 53 | **MATCH** | None | — | [PROGRESSION-EVENT-REGISTRY.md](../events/PROGRESSION-EVENT-REGISTRY.md) |
| Event-validity states | 7 | 7 | **MATCH** | None | — | [PROGRESSION-EVENT-VALIDITY.md](../events/PROGRESSION-EVENT-VALIDITY.md) |
| Conceptual ledgers | 11 | 11 | **MATCH** | None | — | [PROGRESSION-LEDGER-MODEL.md](../architecture/PROGRESSION-LEDGER-MODEL.md) |
| Progression states | 78 | 78 | **MATCH** | None | — | [PROGRESSION-STATE-REGISTRY.md](../architecture/PROGRESSION-STATE-REGISTRY.md) |
| Progression decisions | 21 | 21 | **MATCH** | None | — | [PROGRESSION-DECISION-REGISTRY.md](../architecture/PROGRESSION-DECISION-REGISTRY.md) |
| Architecture scenarios | 15 | 15 | **MATCH** | None | — | [PROGRESSION-ARCHITECTURE-SCENARIOS.md](../scenarios/PROGRESSION-ARCHITECTURE-SCENARIOS.md) |
| Simulation personas | 15 | 15 | **MATCH** | None | — | [SIMULATION-PERSONA-REGISTRY.md](../simulation/SIMULATION-PERSONA-REGISTRY.md) |
| Mandatory calibration findings | 7 | 7 | **MATCH** | None | — | [MANDATORY-CALIBRATION-FINDINGS.md](../calibration/MANDATORY-CALIBRATION-FINDINGS.md) |
| Calibration cohorts | 6 | 6 | **MATCH** | None | — | [CALIBRATION-COHORTS.md](../calibration/CALIBRATION-COHORTS.md) |
| Calibration seeds | 5 | 5 | **MATCH** | None | — | RUN-007 · seeds 20260721–20260725 |
| Users per seed | 5000 | 5000 | **MATCH** | None | — | MULTI-SEED-POPULATION-REPORT |
| Multi-seed users | 25000 | 25000 | **MATCH** | None | — | RUN-007 |
| Integrity red-team attacks | 20 | 20 | **MATCH** | None | — | RUN-013 · RED-TEAM-SIMULATION-REPORT |
| Counterfactual comparisons | 10 | 10 | **MATCH** | None | — | RUN-008 · COUNTERFACTUAL-FAIRNESS-TESTS |
| Achievement rules | 12 | 12 | **MATCH** | None | — | [ACHIEVEMENT-RULE-CATALOGUE.md](../formulas/ACHIEVEMENT-RULE-CATALOGUE.md) |
| Leaderboard formulas | 6 | 6 | **MATCH** | None | — | FRM-LDB-001…006 |

**Overall result:** ALL MATCH.

---

## External note (not a progression count discrepancy)

Screen-count baseline (**7** interface shells / **92** total screens vs registry claims of **90**) is a **pre-existing cross-baseline governance defect**. It is recorded in [CROSS-BASELINE-SCREEN-COUNT-DEFECT.md](./CROSS-BASELINE-SCREEN-COUNT-DEFECT.md) and does **not** alter progression inventory totals above. Screen counts were **not** modified in this Gate.

## Explicit non-claims

```text
NOT production calibrated · NOT real-user validated · NOT technically validated
IMPLEMENTATION: BLOCKED · PRODUCTION READINESS: BLOCKED
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.PROGRESSION.1D §8 — full baseline reconciliation ALL MATCH |
