# Formula Sensitivity Report

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-SIM-SENS-RPT-001 |
| **Version** | 0.1.0 |
| **Status** | SIMULATION CANDIDATE · PENDING GHV.PROGRESSION.1C CALIBRATION |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1B |
| **Run ID** | RUN-005 |
| **Seed** | 20260721 |
| **Output** | [../../analysis/progression-simulation/sensitivity-results.csv](../../analysis/progression-simulation/sensitivity-results.csv) |
| **Limitations** | SYNTHETIC · NOT CALIBRATION · NOT PRODUCT CODE |

## Parameters tested

| Parameter | Scales / variants |
|-----------|-------------------|
| XP values | −20%, −10%, baseline, +10%, +20% |
| Momentum thresholds | −10%, −5%, baseline, +5%, +10% (score-band shift proxy) |
| Mastery floors | 45/65/80 · **50/70/85 baseline** · 55/75/90 |
| Maturity / Breadth / Prestige shifts | Covered via persona classification stability notes + formula docs; detailed CSV focuses on XP / Momentum / Mastery floor sweeps executed by the analytical script |

## Classification-change rates (persona rows)

| Parameter | Changed rows | Total rows | Change rate |
|-----------|-------------:|-----------:|------------:|
| XP_SCALE (Flight Level) | 18 | 75 | **24.0%** |
| MOM_THRESHOLD_SHIFT (league) | 28 | 75 | **37.3%** |
| MASTERY_FLOORS (RP / state) | 10 | 45 | **22.2%** |

## Stability assessment

| Formula family | Assessment |
|----------------|------------|
| FRM-LVL-001 | Moderately sensitive near Level thresholds — expected for triangular curve |
| FRM-MOM-002 | **Most sensitive** — league bands respond strongly to ±10% threshold moves |
| FRM-MST-* | Moderate — floor moves can flip Route-Proven near CMI≈50 boundary |
| FRM-XP-001 anti-farming / plan-zero | Stable across pay-to-win |
| POL-PRS-001 rarity | Stable — no Obsidian; Ascendant remains uncommon in population |

## Affected personas (examples)

* XP −20%: PER-003/004/005/007/008/010 Level drops observed
* XP +20%: PER-001/002/011/012/014/015 Level rises near thresholds
* Momentum −10% shift: multiple Gold→Silver / Silver→Bronze flips
* Mastery floors upward: near-threshold RP personas may lose eligibility

## Recommended candidate versions

```text
All formulas remain v0.1.0
SIMULATION CANDIDATE — ADVANCE TO 1C
Do not retune solely for prettier distributions
Priority calibration questions for 1C:
  1) Momentum league band spacing
  2) Mastery floor proximity effects
  3) Synthetic RP density vs expected pilot density
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | RUN-005 documented |
