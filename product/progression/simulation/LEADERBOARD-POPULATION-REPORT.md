# Leaderboard Population Report

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-SIM-LDB-RPT-001 |
| **Version** | 0.1.0 |
| **Status** | CALIBRATION RECOMMENDED · PENDING 1D (WITH CONDITIONS) |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1C |
| **Run ID** | RUN-012 |
| **Policy** | POL-POP-001 **0.1.0** |
| **Related** | [../formulas/LEADERBOARD-POPULATION-POLICY.md](../formulas/LEADERBOARD-POPULATION-POLICY.md) · [MULTI-SEED-POPULATION-REPORT.md](./MULTI-SEED-POPULATION-REPORT.md) |
| **Limitations** | Synthetic eligibility flags only · UX opt-in **NOT RUN** · **NOT production calibrated** |

## Purpose

Confirm that synthetic population shapes support provisional board population rules without authorizing authoritative public rankings on undersized or stress-skewed mixes.

## Population context (n=25,000 multi-seed)

| League | Count | Share |
|--------|------:|------:|
| Gold | 7399 | 29.6% |
| Silver | 7380 | 29.5% |
| Bronze | 4127 | 16.5% |
| Iron | 3965 | 15.9% |
| Platinum | 2129 | 8.5% |
| Diamond | **0** | **0%** |

Diamond scarcity is **OK** (CAL-FND-006). Do not equalize leagues for cosmetic board fill.

## Cohort B (launch-realistic) board caution

| League | Count |
|--------|------:|
| Silver | 2014 |
| Iron | 1905 |
| Bronze | 1727 |
| Gold | 1617 |
| Platinum | 237 |
| Diamond | **0** |

Launch-realistic Gold/Platinum density is lower than Cohort A stress. Authoritative boards must apply POL-POP-001 minimum population / privacy cuts — small-N distortion risk remains **Open** (RISK-PRG-036).

## Eligibility flags (analytical)

Calibration population emits `ldb_mastery_eligible` / `ldb_momentum_eligible` for architecture stress. Eligibility ≠ published ranking. Provisional boards remain reversible; Prestige never auto-grants from board position.

## Red-team population game

Attack RTM-20 / integrity CSV attack 20 (tiny opt-in claiming authoritative rank) — **PASS** under POL-POP-001 posture.

## Disposition

```text
ADVANCE WITH CONDITIONS (POL-POP-001)
Validate population thresholds before authoritative public boards
CALIBRATION RECOMMENDED · PENDING 1D
NOT production calibrated
synthetic only
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Leaderboard population calibration notes under GHV.PROGRESSION.1C |
