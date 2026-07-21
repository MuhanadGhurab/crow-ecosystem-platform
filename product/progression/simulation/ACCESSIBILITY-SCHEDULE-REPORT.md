# Accessibility / Schedule Fairness Report

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-SIM-A11Y-RPT-001 |
| **Version** | 0.1.0 |
| **Status** | CALIBRATION RECOMMENDED · PENDING 1D |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1C |
| **Run ID** | RUN-009 |
| **Outputs** | [../../analysis/progression-simulation/schedule-fairness-results.csv](../../analysis/progression-simulation/schedule-fairness-results.csv) · [../../analysis/progression-simulation/counterfactual-results.csv](../../analysis/progression-simulation/counterfactual-results.csv) |
| **Related** | [../calibration/COUNTERFACTUAL-FAIRNESS-TESTS.md](../calibration/COUNTERFACTUAL-FAIRNESS-TESTS.md) · CAL-FND-007 |
| **Limitations** | Synthetic matched arms only · real-user a11y **NOT RUN** · **NOT production calibrated** |

## Purpose

Verify that schedule shape and accessibility preference flags do not change Skill / Mastery standings when event content is matched (CAL-FND-007 · CFT-02 / CFT-05).

## Counterfactual schedule arm (matched spine)

| Comparison | Skill equal | Momentum delta | Allowed Δ | Result |
|------------|-------------|---------------:|----------:|--------|
| Distributed vs compressed | **Yes** | **4.33** | ≤ 10 | **PASS** |

```text
Schedule compressed vs distributed:
Skill EQUAL
mom delta 4.33 ≤ 10
PASS
```

## Schedule variants (same Evidence / Mission content)

| Schedule | Momentum score | League | Skill unchanged |
|----------|---------------:|--------|-----------------|
| distributed | 39.5 | Bronze | Yes |
| compressed | 43.8333 | Bronze | Yes |
| irregular | 37.5 | Bronze | Yes |
| offline_gap | 35.3333 | Bronze | Yes |

All fairness-vs-distributed checks: **league_steps = 0** · Skill unchanged · PASS.

## Accessibility / preference arms (from CFT matrix)

Matched AT / reduced-motion and related preference flags produce **no standing delta** on XP, Level, Mastery, RP, Trust, Titles, or Prestige eligibility (see counterfactual CSV).

## Momentum season alternatives (exploratory)

| Alt | Notes | Score |
|-----|-------|------:|
| A | 8 weeks / best 6 (base) | 48.3333 |
| B | + promotion buffer (±2) — **accepted FRM-MOM-002 v0.2.0** | 48.3333 |
| C | two-season demotion protection | 48.3333 |
| D | 10 weeks / best 8 | 45.625 |

## Disposition

```text
Schedule must not change Mastery — CONFIRMED (synthetic)
Soft a11y watch continues into real pilot
CALIBRATION RECOMMENDED · PENDING 1D
NOT production calibrated
synthetic only
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | RUN-009 schedule / a11y fairness PASS under GHV.PROGRESSION.1C |
