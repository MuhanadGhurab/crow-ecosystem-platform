# Simulation Run Registry

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-SIM-RUN-REG-001 |
| **Version** | 0.2.0 |
| **Status** | SIMULATION CANDIDATE · PENDING GHV.PROGRESSION.1C CALIBRATION |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1B |
| **Last updated** | 2026-07-21 |
| **Runs (exact)** | **6** |
| **Completed** | **6** |
| **Limitations** | SIMULATION CANDIDATE only · NOT CALIBRATED · NOT production · no Product Code |

## Registry

| Run ID | Title | Input dataset | User count | Formula versions | Random seed | Date | Output files | Warnings | Failures | Result | Reproducibility |
|--------|-------|---------------|------------|------------------|-------------|------|--------------|----------|----------|--------|-----------------|
| RUN-001 | Persona formula path simulation | persona-events.csv (PER-001…015) | 15 | all IDs **0.1.0** | n/a (deterministic) | 2026-07-21 | persona-results.csv · PERSONA-SIMULATION-REPORT.md | none | none | **COMPLETE — 15/15 PASS** | Re-run script → identical |
| RUN-002 | Eight-week Momentum season | persona weekly paths | 15 + scenario table | FRM-MOM-001/002 **0.1.0** | n/a | 2026-07-21 | MOMENTUM-SEASON-SIMULATION.md | soft a11y watch | none | **COMPLETE — PASS** | Deterministic |
| RUN-003 | Twelve-month progression | compressed persona year paths | 15 | multi-formula **0.1.0** | n/a | 2026-07-21 | TWELVE-MONTH-SIMULATION.md | synthetic RP density note | none | **COMPLETE — PASS** | Deterministic |
| RUN-004 | Synthetic population | population generator | **500** | multi-formula **0.1.0** | **20260721** | 2026-07-21 | population-results.csv · POPULATION-SIMULATION-REPORT.md | Ascendant 4.40% watch | none | **COMPLETE — PASS** | Seed replay identical |
| RUN-005 | Sensitivity analysis | persona sweeps | 15 | XP/MOM/MST **0.1.0** | 20260721 | 2026-07-21 | sensitivity-results.csv · FORMULA-SENSITIVITY-REPORT.md | MOM sensitivity high | none | **COMPLETE — PASS** | Deterministic |
| RUN-006 | Pay-to-win equivalence | identical histories × 5 plans | 5 plan labels | XP/MOM/MAT/MST/BRD/TRU/TTL/PRS **0.1.0** | n/a | 2026-07-21 | pay-to-win-results.txt · PAY-TO-WIN-EQUIVALENCE-TEST.md | none | none | **COMPLETE — all diffs = 0** | Deterministic |

## Analytical package

```text
analysis/progression-simulation/
  README.md
  progression_simulation.py
  formula-inputs.csv
  persona-events.csv
  persona-results.csv
  population-results.csv
  sensitivity-results.csv
  pay-to-win-results.txt
  simulation-summary.md
```

Marker on script:

```text
NON-RUNTIME ANALYSIS TOOL
NOT PRODUCT CODE
NOT APPROVED FOR PRODUCTION
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Placeholder PENDING runs |
| 0.2.0 | 2026-07-21 | All six runs COMPLETE |
