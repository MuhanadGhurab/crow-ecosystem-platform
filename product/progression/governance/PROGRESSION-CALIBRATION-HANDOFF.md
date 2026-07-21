# Progression Calibration Handoff

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-GOV-CAL-001 |
| **Version** | 0.2.0 |
| **Status** | HANDOFF PACKAGE · PENDING GHV.PROGRESSION.1C |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1B |
| **Handoff target** | GHV.PROGRESSION.1C — Integrity, Fairness and Calibration |
| **Last updated** | 2026-07-21 |
| **Related** | [../formulas/PROGRESSION-FORMULA-REGISTRY.md](../formulas/PROGRESSION-FORMULA-REGISTRY.md) · [../simulation/SIMULATION-PERSONA-REGISTRY.md](../simulation/SIMULATION-PERSONA-REGISTRY.md) · [../simulation/SIMULATION-RUN-REGISTRY.md](../simulation/SIMULATION-RUN-REGISTRY.md) · [PROGRESSION-SIMULATION-HANDOFF.md](./PROGRESSION-SIMULATION-HANDOFF.md) · [PROGRESSION-TECHNICAL-HANDOFF.md](./PROGRESSION-TECHNICAL-HANDOFF.md) |

## Purpose

Provide `GHV.PROGRESSION.1C` with everything required to calibrate, stress-test integrity/fairness, and decide revise-vs-advance — **without** production implementation.

## Package contents

| Item | Location / status |
|------|-------------------|
| Formula Registry | `formulas/PROGRESSION-FORMULA-REGISTRY.md` — **24** IDs at `0.1.0` |
| Candidate values | Per-formula docs under `formulas/` — all `SIMULATION CANDIDATE · PENDING GHV.PROGRESSION.1C CALIBRATION` |
| Simulation personas | `simulation/SIMULATION-PERSONAS.md` — exact **15** |
| Event histories | `analysis/progression-simulation/persona-events.csv` + persona reports |
| Population assumptions | RUN-004: **500** users · seed **20260721** |
| Simulation results | **COMPLETE** — RUN-001…RUN-006 (see SIMULATION-RUN-REGISTRY) |
| Sensitivity results | **COMPLETE** — RUN-005; Momentum most sensitive (37.3% league flips at ±10%) |
| Pay-to-win results | **COMPLETE** — RUN-006; **all diffs = 0** |
| Fairness warnings | Soft a11y / compressed-schedule watch (RUN-002); synthetic RP density note (RUN-003/004) |
| Anti-gaming failures | `SIMULATION-FAILURE-REGISTRY.md` — **0** formula failures |
| Unresolved Trust calibration | Time windows and signal weights remain candidates |
| Unresolved Prestige panel design | Quorum sizes and conflict rules remain candidates |
| Unresolved leaderboard population design | Threshold bands remain candidates |
| Unresolved accessibility concerns | Compressed-schedule Momentum fairness pending real a11y review |
| Production implementation | **None** — no Product Code · no database schema · no runtime |

## Simulation results summary (1B)

```text
Personas:                 15/15 PASS
Population:               500 users · seed 20260721
Pay-to-win:               all diffs = 0
Diamond rate:             0.00%
Raven Maturity rate:      0.00%
Ascendant nomination:     4.40%
Route-Proven rate:        38.60%
Formula failures:         0
Formula revisions:        0 (0.1.0 → 0.1.0 unchanged)
Recommendation:           ADVANCE TO 1C
```

## Exact counts for 1C intake

| Class | Count |
|------:|------|
| `FRM-*` formulas | 16 |
| `POL-*` policies | 6 |
| `TPL-*` templates | 2 |
| **Total formula/policy/template IDs** | **24** |
| Simulation personas | **15** |
| Completed simulation runs | **6** |
| Launch capability clusters (Breadth) | **12** |
| Provisional Achievement rules | **12** |

## Calibration watches (priority for 1C)

1. Momentum league band spacing (highest sensitivity).
2. Mastery floor proximity effects near CMI ≈ 50.
3. Synthetic Route-Proven density (38.60%) vs expected pilot density.
4. Trust time windows / false-restriction risk.
5. Prestige panel staffing feasibility.
6. Accessibility bias for compressed schedules / Live-only Evidence.
7. Do **not** treat simulation PASS as calibration.

## Explicit non-claims

```text
NOT CALIBRATED
NOT FINAL
NOT PRODUCTION READY
NOT REAL-USER EVIDENCE
NO PRODUCT CODE IN THIS HANDOFF
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Initial calibration handoff from GHV.PROGRESSION.1B (pre-run placeholders) |
| 0.2.0 | 2026-07-21 | COMPLETE simulation results summary + calibration watches |
