# Integrity Red-Team Simulation Report

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-SIM-RTM-RPT-001 |
| **Version** | 0.1.0 |
| **Status** | CALIBRATION RECOMMENDED · PENDING 1D |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1C |
| **Run ID** | RUN-013 |
| **Attacks** | **20** |
| **Result** | **20/20 PASS** |
| **Output** | [../../analysis/progression-simulation/integrity-red-team-results.csv](../../analysis/progression-simulation/integrity-red-team-results.csv) |
| **Template** | [../calibration/PROGRESSION-INTEGRITY-RED-TEAM.md](../calibration/PROGRESSION-INTEGRITY-RED-TEAM.md) |
| **Limitations** | Design-level analytical attacks · **NOT production calibrated** · **synthetic only** · NOT Product Code |

## Aggregate

| Metric | Value |
|--------|------:|
| Attacks executed | **20** |
| PASS | **20** |
| FAIL | **0** |
| Blocking integrity defect | **None** |

```text
Integrity red-team: 20/20 PASS
CALIBRATION RECOMMENDED · PENDING 1D
NOT production calibrated
synthetic only
```

## Results (CSV-confirmed)

| # | Attack | Affected | Result |
|---|--------|----------|--------|
| 1 | Duplicate Mission events | FRM-XP-001 | **PASS** |
| 2 | Duplicated Evidence approval | FRM-XP-001 / FRM-MST-002 | **PASS** |
| 3 | Evidence fragment farming | FRM-MST-002 | **PASS** |
| 4 | Improved-repeat farming | FRM-XP-001 | **PASS** |
| 5 | Deliberate remediation farming | FRM-XP-001 | **PASS** |
| 6 | Team passenger | FRM-MST-003 | **PASS** |
| 7 | Collusive Team verification | FRM-MST-002 | **PASS** |
| 8 | Reviewer collusion | POL-TRU-001 / Titles | **PASS** |
| 9 | Reciprocal Community ratings | FRM-XP-001 | **PASS** |
| 10 | Reaction farming | FRM-MST / Prestige | **PASS** |
| 11 | Automated activity | FRM-XP-001 | **PASS** |
| 12 | Account sharing | Identity / assurance | **PASS** |
| 13 | Season-timing manipulation | FRM-MOM-002 | **PASS** |
| 14 | Forged late-arriving event | POL-COR-001 / XP | **PASS** |
| 15 | Evidence revoked after Title | Titles / COR | **PASS** |
| 16 | Trust restriction overturned | POL-TRU-001 | **PASS** |
| 17 | Manual correction reversed | POL-COR-001 | **PASS** |
| 18 | Prestige panel conflict | FRM/POL-PRS | **PASS** |
| 19 | Merit farming | Merit boundary | **PASS** |
| 20 | Copied public artifact | FRM-MST-002 | **PASS** |

## Pay-to-win cross-check

Identical histories across Access Plans: **all diffs = 0** (RUN-006 + counterfactual plan arms). **PASS**.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | RUN-013 integrity red-team **20/20 PASS** under GHV.PROGRESSION.1C |
