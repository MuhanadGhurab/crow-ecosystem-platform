# Momentum Formula

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-FRM-MOM-001 |
| **Version** | 0.1.0 |
| **Status** | SIMULATION CANDIDATE · PENDING GHV.PROGRESSION.1C CALIBRATION |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1B |
| **Last updated** | 2026-07-21 |
| **Formula IDs** | FRM-MOM-001 · FRM-MOM-002 |
| **Limitations** | SIMULATION CANDIDATE only · NOT CALIBRATED · NOT production · no Product Code |

## Formula IDs

```text
FRM-MOM-001     Weekly Momentum
FRM-MOM-002     Season Momentum
```

## Progression system

Momentum (weekly + season leagues)

## Purpose

Score meaningful recent activity without requiring daily streaks, without paid multipliers, and without treating Momentum as Mastery.

---

# FRM-MOM-001 — Weekly Momentum

## Exact equation

```text
Weekly Momentum =
Meaningful Progress
+ Cross-Week Consistency
+ Balanced Engagement
+ Recovery and Reflection
```

### Meaningful Progress — 0 to 40

Recognize validated progress such as:

* Mission completion.
* Stage progress.
* assessment progress.
* Evidence progress.
* capstone progress.

Use caps so raw volume cannot dominate.

### Cross-Week Consistency — 0 to 25

```text
25:
Current week and previous week both contain meaningful validated activity.

15:
Current week contains meaningful activity but previous week does not.

0:
No meaningful activity in the current week.
```

### Balanced Engagement — 0 to 20

```text
20:
At least two distinct valid progression-source categories.

10:
One valid progression-source category.

0:
No valid category.
```

Valid categories may include:

* Learning.
* Evidence or assessment.
* remediation or reflection.
* Team or community contribution.
* Live Sky contribution.

### Recovery and Reflection — 0 to 15

Recognize:

* Valid return after inactivity.
* reflection.
* remediation.
* recovery planning.

Do not reward intentional inactivity or deliberate failure.

### Weekly score range

```text
0–100
```

No daily streak is required.

## Prohibited inputs

* Paid-plan multiplier.
* XP multiplier into Momentum.
* Unlimited grinding without caps.
* Intentional inactivity farming for Recovery points.

## Rounding

Sum component integers; clamp to 0–100.

---

# FRM-MOM-002 — Season Momentum

## Candidate season duration

```text
8 weeks
```

## Exact equation

```text
Season Momentum Score =
Average of the learner’s best 6 weekly scores
```

## Requirements

* At least four active weeks for a final placement.
* First two active weeks may produce provisional placement.
* Two low or absent weeks may act as grace weeks.
* Missing a single week does not cause collapse.
* No paid-plan multiplier.
* No XP multiplier.
* No unlimited grinding benefit.

## Candidate league thresholds

| League   | Season score |
| -------- | -----------: |
| Iron     |         0–29 |
| Bronze   |        30–44 |
| Silver   |        45–59 |
| Gold     |        60–74 |
| Platinum |        75–87 |
| Diamond  |       88–100 |

## Simulation tests

* Diamond excessively common?
* Consistent one-day-per-week learners unfairly blocked?
* Compressed schedules disadvantaged?
* One intense week distorting the season?
* Remediation / return over-rewarded?

All thresholds remain candidates pending `1C`.

## Explainability text

“Your Momentum reflects meaningful activity across recent weeks. It does not require a daily streak, and two lower-activity weeks are excluded from your final season result.”

## Simulation scenarios

RUN-002; PER-002; PER-008; PER-010

## Sensitivity range

Best-N weeks 5–7; season length 6–10; league cut-points ±5.

## Known risks

Grace-week gaming; Diamond inflation; compressed-schedule fairness.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Initial weekly + season candidates under GHV.PROGRESSION.1B |
