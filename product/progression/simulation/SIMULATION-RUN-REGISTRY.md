# Simulation Run Registry

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-SIM-RUN-REG-001 |
| **Version** | 0.3.0 |
| **Status** | CALIBRATION RECOMMENDED · PENDING 1D |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1B → GHV.PROGRESSION.1C |
| **Last updated** | 2026-07-21 |
| **Runs (exact)** | **13** |
| **Completed** | **13** |
| **Limitations** | Synthetic only · **NOT production calibrated** · no Product Code |

## Registry

| Run ID | Title | Input dataset | User count | Formula versions | Random seed | Date | Output files | Warnings | Failures | Result | Reproducibility |
|--------|-------|---------------|------------|------------------|-------------|------|--------------|----------|----------|--------|-----------------|
| RUN-001 | Persona formula path simulation | persona-events.csv (PER-001…015) | 15 | all IDs **0.1.0** | n/a (deterministic) | 2026-07-21 | persona-results.csv · PERSONA-SIMULATION-REPORT.md | none | none | **COMPLETE — 15/15 PASS** | Re-run script → identical |
| RUN-002 | Eight-week Momentum season | persona weekly paths | 15 + scenario table | FRM-MOM-001/002 **0.1.0** | n/a | 2026-07-21 | MOMENTUM-SEASON-SIMULATION.md | soft a11y watch | none | **COMPLETE — PASS** | Deterministic |
| RUN-003 | Twelve-month progression | compressed persona year paths | 15 | multi-formula **0.1.0** | n/a | 2026-07-21 | TWELVE-MONTH-SIMULATION.md | synthetic RP density note | none | **COMPLETE — PASS** | Deterministic |
| RUN-004 | Synthetic population | population generator | **500** | multi-formula **0.1.0** | **20260721** | 2026-07-21 | population-results.csv · POPULATION-SIMULATION-REPORT.md | Ascendant 4.40% watch | none | **COMPLETE — PASS** | Seed replay identical |
| RUN-005 | Sensitivity analysis | persona sweeps | 15 | XP/MOM/MST **0.1.0** | 20260721 | 2026-07-21 | sensitivity-results.csv · FORMULA-SENSITIVITY-REPORT.md | MOM sensitivity high | none | **COMPLETE — PASS** | Deterministic |
| RUN-006 | Pay-to-win equivalence | identical histories × 5 plans | 5 plan labels | XP/MOM/MAT/MST/BRD/TRU/TTL/PRS **0.1.0** | n/a | 2026-07-21 | pay-to-win-results.txt · PAY-TO-WIN-EQUIVALENCE-TEST.md | none | none | **COMPLETE — all diffs = 0** | Deterministic |
| RUN-007 | Multi-seed calibration population | Cohorts A–F generator | **25,000** | MAT **0.2.0** · MOM-002 **0.2.0** · XP **0.1.1** · else **0.1.0** | **20260721–20260725** | 2026-07-21 | calibration-population-results.csv · calibration-seed-summary.csv · MULTI-SEED-POPULATION-REPORT.md · LAUNCH-REALISTIC-COHORT-REPORT.md | Cohort A stress ≠ launch KPI | none | **COMPLETE** | Seed replay identical |
| RUN-008 | Counterfactual fairness matrix | matched event spines | 10 arms | same as RUN-007 | n/a | 2026-07-21 | counterfactual-results.csv | none | none | **COMPLETE — 10/10 PASS** | Deterministic |
| RUN-009 | Schedule / accessibility fairness | schedule variants + a11y flags | matched spines | MOM-002 **0.2.0** | n/a | 2026-07-21 | schedule-fairness-results.csv · ACCESSIBILITY-SCHEDULE-REPORT.md | soft pilot a11y watch | none | **COMPLETE — PASS** (Skill equal; mom Δ 4.33 ≤ 10) | Deterministic |
| RUN-010 | Prestige multi-seed / cohort | RUN-007 Prestige slice | 25,000 / B=7500 | FRM/POL-PRS **0.1.0** | 20260721–20260725 | 2026-07-21 | prestige-seed-stats.csv · PRESTIGE-CALIBRATION-REPORT.md | B Ascendant 0%; A stress ~8% | none | **COMPLETE** | Seed replay |
| RUN-011 | Trust calibration distributions | RUN-007 Trust slice + RTM | Cohorts A/B/E | POL-TRU-001 **0.1.0** | multi-seed | 2026-07-21 | TRUST-CALIBRATION-REPORT.md | WITH CONDITIONS | none | **COMPLETE** | Deterministic |
| RUN-012 | Leaderboard population calibration | RUN-007 + POL-POP-001 | 25,000 | POL-POP-001 **0.1.0** | multi-seed | 2026-07-21 | LEADERBOARD-POPULATION-REPORT.md | WITH CONDITIONS | none | **COMPLETE** | Deterministic |
| RUN-013 | Integrity red-team | 20 fixed attacks | 20 | multi-formula 1C versions | n/a | 2026-07-21 | integrity-red-team-results.csv · RED-TEAM-SIMULATION-REPORT.md | none | none | **COMPLETE — 20/20 PASS** | Deterministic |

## Analytical package

```text
analysis/progression-simulation/
  README.md
  progression_simulation.py
  progression_calibration.py
  formula-inputs.csv
  persona-events.csv
  persona-results.csv
  population-results.csv
  sensitivity-results.csv
  pay-to-win-results.txt
  calibration-population-results.csv
  calibration-seed-summary.csv
  counterfactual-results.csv
  schedule-fairness-results.csv
  prestige-seed-stats.csv
  integrity-red-team-results.csv
  formula-version-comparison.csv
  simulation-summary.md
```

Marker on scripts:

```text
NON-RUNTIME ANALYSIS TOOL
NOT PRODUCT CODE
NOT APPROVED FOR PRODUCTION
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Placeholder PENDING runs |
| 0.2.0 | 2026-07-21 | All six 1B runs COMPLETE |
| 0.3.0 | 2026-07-21 | RUN-007…013 calibration runs COMPLETE under GHV.PROGRESSION.1C |
