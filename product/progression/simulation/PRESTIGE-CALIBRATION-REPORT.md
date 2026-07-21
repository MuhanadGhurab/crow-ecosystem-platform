# Prestige Calibration Report (Multi-Seed)

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-SIM-PRS-RPT-001 |
| **Version** | 0.1.0 |
| **Status** | CALIBRATION RECOMMENDED · PENDING 1D (WITH CONDITIONS) |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1C |
| **Run ID** | RUN-010 |
| **Outputs** | [../../analysis/progression-simulation/prestige-seed-stats.csv](../../analysis/progression-simulation/prestige-seed-stats.csv) · calibration population CSV |
| **Related** | CAL-FND-004 · FRM-PRS-001 · POL-PRS-001 |
| **Limitations** | Nomination eligibility only · human grant required · **NOT production calibrated** · **synthetic only** |

## Multi-seed Prestige (all cohorts mixed, per-seed n=5,000)

| Metric | Min | Max | Avg |
|--------|----:|----:|----:|
| Ascendant nomination count | 402 | 410 | 406.2 |
| Ascendant % | 8.04 | 8.20 | 8.124 |
| Apex total | **0** | **0** | **0** |
| Obsidian total | **0** | **0** | **0** |

Mixed-seed Ascendant ~8% is **architecture-stress biased** (Cohort A / C weight). Not a launch KPI.

## Cohort-conditioned Prestige

| Cohort | n | Ascendant | Apex | Obsidian | Read |
|--------|--:|----------:|-----:|---------:|------|
| **B launch-realistic** | 7500 | **0%** | **0** | **0** | Soft watch satisfied for ordinary first-year mix |
| A stress | 12500 | **8.31%** | 0 | 0 | Expected higher under stress — architecture probe |
| C experienced | 2500 | high by design | 0 | 0 | Experienced recognition population |

## Aggregate nominations (n=25,000)

| State | Count |
|-------|------:|
| NOT_ELIGIBLE | 22969 |
| ELIGIBLE_ASCENDANT_NOMINATION | 2031 |
| Apex / Obsidian | **0** |

## Calibration disposition (CAL-FND-004)

```text
SOFT WATCH — ADVANCE WITH CONDITIONS
Cohort B Ascendant = 0%
Apex / Obsidian = 0 in ordinary first-year launch-realistic
No cosmetic threshold hike
Panel staffing still Open (RISK-PRG-034)
CALIBRATION RECOMMENDED · PENDING 1D
NOT production calibrated
synthetic only
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Multi-seed Prestige + Cohort B/A contrast under GHV.PROGRESSION.1C |
