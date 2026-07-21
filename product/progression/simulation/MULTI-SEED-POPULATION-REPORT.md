# Multi-Seed Population Report

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-SIM-MSP-RPT-001 |
| **Version** | 0.1.0 |
| **Status** | CALIBRATION RECOMMENDED · PENDING 1D |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1C |
| **Run ID** | RUN-007 |
| **Records** | **25,000** |
| **Seeds** | **20260721–20260725** (5,000 / seed) |
| **Formula versions** | FRM-MAT-001 **0.2.0** · FRM-MOM-002 **0.2.0** · FRM-XP-001 **0.1.1** · others **0.1.0** |
| **Outputs** | [../../analysis/progression-simulation/calibration-population-results.csv](../../analysis/progression-simulation/calibration-population-results.csv) · [../../analysis/progression-simulation/calibration-seed-summary.csv](../../analysis/progression-simulation/calibration-seed-summary.csv) |
| **Limitations** | **NOT production calibrated** · **synthetic only** · NOT a forecast · NOT Product Code |

## Purpose

Stress multi-seed synthetic population stability after 1C formula clarifications (Maturity context / Rank skip, Momentum promotion buffer, Evidence XP once-per-approval).

```text
CALIBRATION RECOMMENDED · PENDING 1D
NOT production calibrated
synthetic only
```

## Aggregate Maturity Ranks (n=25,000)

| Rank | Count |
|------|------:|
| Scout | 6131 |
| Hatchling | 5347 |
| Pathfinder | 5194 |
| **Fledgling** | **3472** |
| Specialist | 2822 |
| Vanguard | 2034 |
| **Raven** | **0** |

## Aggregate Momentum leagues (n=25,000)

| League | Count |
|--------|------:|
| Gold | 7399 |
| Silver | 7380 |
| Bronze | 4127 |
| Iron | 3965 |
| Platinum | 2129 |
| **Diamond** | **0** |

## Seed stability (per-seed n=5,000)

| Seed | Fledgling | Raven | Diamond | Ascendant nom. | RP % |
|------|----------:|------:|--------:|---------------:|-----:|
| 20260721 | 687 | 0 | 0 | 407 | 40.60 |
| 20260722 | 722 | 0 | 0 | 402 | 40.52 |
| 20260723 | 671 | 0 | 0 | 406 | 40.58 |
| 20260724 | 682 | 0 | 0 | 410 | 40.52 |
| 20260725 | 710 | 0 | 0 | 406 | 40.42 |

Per-seed Ascendant nomination averages ~8.1% because seeds mix Cohorts A–F (stress-heavy). **Do not** cite this as launch KPI — use Cohort B (see [LAUNCH-REALISTIC-COHORT-REPORT.md](./LAUNCH-REALISTIC-COHORT-REPORT.md)).

## Interpretation

1. **Fledgling reachable** after FRM-MAT-001 v0.2.0 (CAL-FND-001) — not force-populated.
2. **Raven = 0** and **Diamond = 0** across all seeds — rarity posture held.
3. Multi-seed rank/league shape is stable; no seed invert of band order.
4. Aggregate RP / Ascendant rates are **architecture-stress biased** (Cohort A dominant). Report launch rates only under Cohort B.

## Status

```text
RUN-007 COMPLETE
CALIBRATION RECOMMENDED · PENDING 1D
NOT production calibrated
synthetic only
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | RUN-007 multi-seed 25k evidence under GHV.PROGRESSION.1C |
