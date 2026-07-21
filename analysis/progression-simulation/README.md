# Progression Simulation Analysis Package

| Field | Value |
|-------|-------|
| **Status** | NON-RUNTIME ANALYSIS TOOL |
| **Source Gate** | GHV.PROGRESSION.1B |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-21 |
| **Seed** | 20260721 |
| **Dependencies** | Python 3 standard library only |

```text
NON-RUNTIME ANALYSIS TOOL
NOT PRODUCT CODE
NOT APPROVED FOR PRODUCTION
Do not import from application packages.
Do not connect to databases or networks.
```

## Purpose

Deterministic synthetic simulation of GHURAVIA progression candidate formulas for architecture testing and internal synthetic calibration only. Results are **not** real-user evidence and are **not** production-calibrated.

## Files

| File | Role |
|------|------|
| `progression_simulation.py` | Stdlib-only simulator |
| `formula-inputs.csv` | Candidate formula parameters |
| `persona-events.csv` | Deterministic persona event streams |
| `persona-results.csv` | Output — persona progression |
| `population-results.csv` | Output — 500 synthetic users |
| `sensitivity-results.csv` | Output — parameter sensitivity |
| `simulation-summary.md` | Output — run summary |

## Run — 1B simulation

```bash
python analysis/progression-simulation/progression_simulation.py
```

## Run — 1C calibration

```bash
python analysis/progression-simulation/progression_calibration.py
```

Produces 25,000 multi-seed cohort records plus counterfactual, red-team, schedule-fairness, and version-comparison CSVs.

```text
CALIBRATION RECOMMENDED · PENDING GHV.PROGRESSION.1D FINAL LOCK
REAL-USER VALIDATION NOT RUN
NOT PRODUCTION CALIBRATED
```

Default seed: `20260721`
