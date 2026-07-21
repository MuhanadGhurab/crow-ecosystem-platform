# GHV.PROGRESSION.1C — Calibration Package Index

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-CAL-IDX-001 |
| **Version** | 0.1.0 |
| **Status** | CALIBRATION RECOMMENDED · PENDING 1D |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1C |
| **Last updated** | 2026-07-21 |
| **Related** | [../governance/PROGRESSION-CALIBRATION-HANDOFF.md](../governance/PROGRESSION-CALIBRATION-HANDOFF.md) · [../formulas/PROGRESSION-FORMULA-REGISTRY.md](../formulas/PROGRESSION-FORMULA-REGISTRY.md) · [../simulation/](../simulation/) · [../README.md](../README.md) |
| **Limitations** | **NOT production calibrated** · **synthetic only** · real-user NOT RUN · usability NOT RUN · technical validation NOT RUN · Product Code BLOCKED |

## Package status

```text
CALIBRATION RECOMMENDED
PENDING 1D
NOT production calibrated
synthetic only
```

This package is the **integrity, fairness, and calibration** evidence set for `GHV.PROGRESSION.1C`. It consumes 1B simulation candidates, records mandatory findings, applies governed formula clarifications / buffers where required, and recommends advancement to `GHV.PROGRESSION.1D` (Final Progression Baseline Lock) — **without** claiming production calibration.

## Verdict (package-level)

| Item | Value |
|------|-------|
| Package verdict | **CALIBRATION RECOMMENDED — ADVANCE TO 1D** (with conditions on listed IDs) |
| Production calibration | **NOT** achieved |
| Evidence class | **synthetic only** |
| Next gate | `GHV.PROGRESSION.1D` |
| Product Code | **BLOCKED** |

## Document index

| # | File | Role |
|---|------|------|
| 1 | [README.md](./README.md) | This index — package status and links |
| 2 | [MANDATORY-CALIBRATION-FINDINGS.md](./MANDATORY-CALIBRATION-FINDINGS.md) | CAL-FND-001…007 dispositions |
| 3 | [PROGRESSION-CALIBRATION-PRINCIPLES.md](./PROGRESSION-CALIBRATION-PRINCIPLES.md) | Gate §8 — 15 locked calibration principles |
| 4 | [CALIBRATION-COHORTS.md](./CALIBRATION-COHORTS.md) | Cohorts A–F definitions |
| 5 | [COUNTERFACTUAL-FAIRNESS-TESTS.md](./COUNTERFACTUAL-FAIRNESS-TESTS.md) | Method + required equalities |
| 6 | [FORMULA-VERSION-COMPARISON.md](./FORMULA-VERSION-COMPARISON.md) | v0.1.0 → current changes for all 24 IDs |
| 7 | [PROGRESSION-INTEGRITY-RED-TEAM.md](./PROGRESSION-INTEGRITY-RED-TEAM.md) | 20-attack template (PASS pending script; CSV outputs) |
| 8 | [PROGRESSION-FAIRNESS-CALIBRATION.md](./PROGRESSION-FAIRNESS-CALIBRATION.md) | Fairness calibration outcomes |
| 9 | [PROGRESSION-EXPLAINABILITY-CALIBRATION.md](./PROGRESSION-EXPLAINABILITY-CALIBRATION.md) | Arabic + English sample explanations |
| 10 | [CALIBRATION-ACCEPTANCE-MATRIX.md](./CALIBRATION-ACCEPTANCE-MATRIX.md) | All 24 IDs — ADVANCE TO 1D / WITH CONDITIONS |
| 11 | [CALIBRATION-FINAL-RECOMMENDATION.md](./CALIBRATION-FINAL-RECOMMENDATION.md) | Founder-facing recommendation |
| 12 | [CALIBRATION-KNOWN-LIMITATIONS.md](./CALIBRATION-KNOWN-LIMITATIONS.md) | Explicit non-claims |

## Upstream inputs (1B)

| Input | Location / note |
|-------|-----------------|
| Formula registry (24 IDs) | `../formulas/PROGRESSION-FORMULA-REGISTRY.md` |
| Persona simulation | RUN-001 — 15/15 PASS |
| Population | RUN-004 — 500 users · seed `20260721` |
| Sensitivity | RUN-005 — Momentum league flips ~37.3% at ±10% |
| Pay-to-win | RUN-006 — all diffs = 0 |
| Calibration handoff | `../governance/PROGRESSION-CALIBRATION-HANDOFF.md` |
| Analytical simulator | `analysis/progression-simulation/` (**NOT Product Code**) |

## Formula revisions applied in 1C

| ID | From → To | Nature |
|----|-----------|--------|
| FRM-MAT-001 | 0.1.0 → **0.2.0** | Mission/Stage learning contexts; governed Rank skip; softened sim heuristic — Fledgling reachable |
| FRM-MOM-002 | 0.1.0 → **0.2.0** | Alternative B promotion buffer (±2); keep best-6 of 8w |
| FRM-XP-001 | 0.1.0 → **0.1.1** | Evidence XP once-per-approval clarification |
| All other IDs | 0.1.0 → 0.1.0 | Unchanged numerics; status → CALIBRATION RECOMMENDED · PENDING 1D |

## Mandatory findings summary

| Finding | Disposition headline |
|---------|----------------------|
| CAL-FND-001 | Generator / context defect → MAT v0.2.0 clarification |
| CAL-FND-002 | Momentum label sensitivity ~37% → MOM-002 v0.2.0 buffer; ADVANCE WITH CONDITIONS |
| CAL-FND-003 | 38.6% RP = Cohort A stress density; floors unchanged |
| CAL-FND-004 | Ascendant ~4.4% soft watch; no threshold hike for cosmetics |
| CAL-FND-005 | PER-004 XP from Evidence milestones → XP v0.1.1 clarify |
| CAL-FND-006 | Gold concentration = distribution shape; do not equalize |
| CAL-FND-007 | PER-009 vs PER-010 needs matched counterfactual; schedule ≠ Mastery |

## Explicit non-claims

```text
CALIBRATION RECOMMENDED · PENDING 1D
NOT production calibrated
synthetic only
real-user NOT RUN
usability NOT RUN
technical validation NOT RUN
NO Product Code
NO database schema
NO runtime implementation
Final Progression Baseline NOT LOCKED
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Initial GHV.PROGRESSION.1C calibration package index |
