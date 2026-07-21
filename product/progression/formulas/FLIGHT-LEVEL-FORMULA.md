# Flight Level Formula

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-FRM-LVL-001 |
| **Version** | 0.1.0 |
| **Status** | SIMULATION CANDIDATE · PENDING GHV.PROGRESSION.1C CALIBRATION |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1B |
| **Last updated** | 2026-07-21 |
| **Formula ID** | FRM-LVL-001 |
| **Limitations** | SIMULATION CANDIDATE only · NOT CALIBRATED · NOT production · no Product Code |

## Formula ID

```text
FRM-LVL-001
```

## Progression system

Flight Level (lifetime activity milestone)

## Purpose

Map cumulative Flight XP to a Flight Level for cosmetic / presentation milestones only. It must **not** represent Skill, Maturity, or Mastery, and must not unlock Mastery, Titles, or Prestige directly.

## Inputs

* Lifetime cumulative Flight XP from `FRM-XP-001` after reversals.

## Prohibited inputs

* Payment / Access Plan.
* Mastery, Maturity, Trust, Momentum, popularity.

## Exact equation

```text
XP required for Level L =
100 × (L - 1) × L ÷ 2
```

Where:

```text
Level 1 begins at 0 XP.
```

### Examples

| Level | Required cumulative XP |
| ----: | ---------------------: |
|     1 |                      0 |
|     2 |                    100 |
|     3 |                    300 |
|     4 |                    600 |
|     5 |                  1,000 |
|    10 |                  4,500 |
|    20 |                 19,000 |
|    50 |                122,500 |

Current Level is the greatest integer `L ≥ 1` such that cumulative XP ≥ XP required for Level `L`.

## Output range

Integer Level ≥ 1.

## Rounding method

Exact triangular formula; no fractional Levels. Use integer arithmetic where possible: `100 * (L - 1) * L / 2`.

## Caps / floors / hard gates

* Floor: Level 1 at 0 XP.
* No upper Level cap in candidate (simulation must test late-curve meaning).
* Hard gate: Level unlocks cosmetic presentation only.

## Missing / provisional / reversal / freshness

| Behavior | Rule |
|----------|------|
| Missing XP | Treat as 0 → Level 1 |
| Provisional XP | Excluded (not in lifetime XP) |
| Reversal | Recalculate Level from corrected cumulative XP |
| Freshness | Levels do not decay with time |

## Validation questions (simulation)

* Advances too quickly for early learners?
* Becomes meaningless at higher Levels?
* Rewards activity volume excessively?
* Creates confusing overlap with Maturity Rank?

## Explainability text

“Flight Level tracks how much validated activity you have completed over time. It is not a Skill, Maturity, or Mastery grade.”

## Simulation scenarios

RUN-001; RUN-003; RUN-005

## Sensitivity range

Leading coefficient 80–120 instead of 100.

## Known risks

Confusion with Maturity Rank; pay-to-win attempts via volume if XP farming is possible (mitigated by validation and repeat factors).

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Initial triangular candidate under GHV.PROGRESSION.1B |
