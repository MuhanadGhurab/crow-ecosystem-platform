# Eight-Week Momentum Season Simulation

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-SIM-MOM-RPT-001 |
| **Version** | 0.1.0 |
| **Status** | SIMULATION CANDIDATE · PENDING GHV.PROGRESSION.1C CALIBRATION |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1B |
| **Run ID** | RUN-002 |
| **Formulas** | FRM-MOM-001 / FRM-MOM-002 **v0.1.0** |
| **Season length** | 8 weeks |
| **Season score** | Average of best 6 weekly scores |
| **Placement rule** | ≥4 active weeks for final placement |
| **Limitations** | SYNTHETIC · NOT CALIBRATED · NOT PRODUCT CODE |

## Candidate league thresholds (v0.1.0)

| League | Season score |
|--------|-------------:|
| Iron | 0–29 |
| Bronze | 30–44 |
| Silver | 45–59 |
| Gold | 60–74 |
| Platinum | 75–87 |
| Diamond | 88–100 |

## Scenario outcomes (persona-backed)

| Scenario | Persona / proxy | Season league | Notes |
|----------|-----------------|---------------|-------|
| Consistent weekly learner | PER-002 | Gold | Steady validated progress across weeks |
| One-day-per-week learner | PER-010 pattern + PER-009 | Bronze–Gold | Not automatically excluded from high leagues; PER-009 reached Gold |
| Three-day-per-week learner | PER-002 | Gold | Balanced categories support engagement component |
| Burst learner | PER-003 | Silver | Volume without Evidence does not force Diamond |
| Missing two weeks (grace) | PER-008 return pattern | Gold | Best-six rule absorbs two low/absent weeks |
| Returning learner | PER-008 | Gold | Return/reflection recognized without requiring daily streak |
| Remediation-heavy | PER-013 path (partial) | Gold | Remediation does not dominate season alone |
| Paid user, no activity | PER-006 | Iron | Season score ≈ 0 |
| Free user, steady activity | PER-001 / PER-002 | Silver–Gold | Plan type unused |
| Compressed accessibility schedule | PER-010 | Bronze | Meaningful progress still counted; not collapsed |

## Required tests

| Test | Result |
|------|--------|
| One strong week cannot create final Diamond | **PASS** — no persona Diamond; burst PER-003 = Silver |
| Paid access alone creates no Momentum | **PASS** — PER-006 Iron / 0 |
| Missing one week does not cause collapse | **PASS** — best-six + grace weeks |
| Two grace weeks function | **PASS** — documented in FRM-MOM-002 and observed |
| One-day-per-week consistency not auto-excluded from high leagues | **PASS** — PER-009 Gold |
| Unhealthy raw activity volume does not dominate | **PASS** — category caps + meaningful-progress cap |

## Fairness / sensitivity notes for 1C

* Population Diamond rate = **0.00%** (under 15% warning).
* Momentum threshold ±10% shifts leagues for ~37% of persona sensitivity rows — **calibration priority**.
* Compressed-schedule users may land Bronze more often; do not treat as failure if meaningful weekly activity is present.

## Recommended candidate version

```text
FRM-MOM-001 / FRM-MOM-002 remain v0.1.0
ADVANCE TO 1C — no blocking revision
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | RUN-002 documented from persona season results |
