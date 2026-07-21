# Synthetic Population Simulation Report

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-SIM-POP-RPT-001 |
| **Version** | 0.1.0 |
| **Status** | SIMULATION CANDIDATE · PENDING GHV.PROGRESSION.1C CALIBRATION |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1B |
| **Run ID** | RUN-004 |
| **Users** | **500** |
| **Random seed** | **20260721** |
| **Output** | [../../analysis/progression-simulation/population-results.csv](../../analysis/progression-simulation/population-results.csv) |
| **Limitations** | ANALYTICAL ONLY · NOT A FORECAST · NOT REAL USERS · NOT CALIBRATED · NOT PRODUCT CODE |

## Assumptions (explicit)

1. Synthetic users vary by plan type, activity frequency, Evidence quality, Route participation, Team/Live contribution, inactivity, accessibility pattern, integrity concerns, and Arabic/English preference.
2. Plan type **never** enters progression equations — only Entitlement/concurrency differ conceptually.
3. RT-ANL-001 contributes **0** to launch Breadth/Mastery.
4. Distributions are for architecture stress-testing, not product KPIs.
5. Population generator is deterministic given seed `20260721`.

## Distributions (exact from RUN-004)

### Flight Level

| Level | Count |
|------:|------:|
| 1 | 14 |
| 2 | 105 |
| 3 | 158 |
| 4 | 124 |
| 5 | 96 |
| 6 | 3 |

### Momentum leagues

| League | Count |
|--------|------:|
| Iron | 58 |
| Bronze | 97 |
| Silver | 148 |
| Gold | 169 |
| Platinum | 28 |
| Diamond | **0** |

### Maturity Ranks

| Rank | Count |
|------|------:|
| Hatchling | 153 |
| Scout | 153 |
| Pathfinder | 100 |
| Specialist | 71 |
| Vanguard | 23 |
| Raven | **0** |

### Breadth descriptors

| Descriptor | Count |
|------------|------:|
| Focused | 115 |
| Expanding | 257 |
| Multi-Horizon | 104 |
| Integrated | 24 |
| Extensive | 0 |

### Trust states

| State | Count |
|-------|------:|
| UNESTABLISHED | 4 |
| NORMAL | 220 |
| POSITIVE_STANDING | 274 |
| ELEVATED_RESPONSIBILITY_ELIGIBLE | 2 |

### Route-Proven / Titles / Prestige

| Metric | Count / rate |
|--------|--------------|
| Route-Proven | 193 / **38.60%** |
| Title NOT_ELIGIBLE | 307 |
| STANDARD_TEMPLATE_ELIGIBLE_FOR_REVIEW | 134 |
| PROGRESS_VISIBLE | 57 |
| INTEGRATED_TEMPLATE_ELIGIBLE_FOR_REVIEW | 2 |
| Prestige NOT_ELIGIBLE | 478 |
| Ascendant nomination eligible | 22 / **4.40%** |
| Apex nomination eligible | **0** |
| Obsidian nomination eligible | **0** |

## Provisional distribution warnings (§38)

| Warning trigger | Observed | Investigate? |
|-----------------|----------|--------------|
| Diamond > 15% | 0.00% | No |
| Raven > 10% first year | 0.00% | No |
| Ascendant nomination > 5% | 4.40% | Borderline watch in 1C |
| Apex nomination > 1% | 0.00% | No |
| Obsidian eligibility in ordinary first-year mix | 0 | No |
| Paid outperform identical free | 0 diffs (RUN-006) | No |
| Low-activity high-Evidence blocked | Personas PASS | No |
| Compressed schedule systematically excluded | PER-010 Bronze (not excluded) | Soft watch |

## Status

```text
SIMULATION CANDIDATE — PENDING GHV.PROGRESSION.1C CALIBRATION
NOT A FORECAST
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | RUN-004 complete — 500 users · seed 20260721 |
