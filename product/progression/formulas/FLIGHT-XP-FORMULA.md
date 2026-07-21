# Flight XP Formula

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-FRM-XP-001 |
| **Version** | **0.1.1** |
| **Status** | CALIBRATION RECOMMENDED · PENDING 1D |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1B → clarified under GHV.PROGRESSION.1C |
| **Last updated** | 2026-07-21 |
| **Formula ID** | FRM-XP-001 |
| **Limitations** | CALIBRATION RECOMMENDED · **NOT production calibrated** · **synthetic only** · no Product Code |

## Formula ID

```text
FRM-XP-001
```

## Progression system

Flight XP (lifetime activity recognition)

## Purpose

Recognize validated learning and contribution events as lifetime Flight XP. XP is an activity milestone input to Flight Level only — not Skill, Maturity, Mastery, Trust, Titles, or Prestige.

## Inputs

* Validated progression events with Mission intensity or event class.
* Validation state (`VALID`, `PROVISIONAL`, `REJECTED`, `REVERSED`).
* Repeat classification (first valid / identical repeat / governed improved repeat).
* Remediation linkage to an original Mission gap (where applicable).

## Prohibited inputs

* Access Plan / paid-plan multiplier.
* Login, idle time, raw reactions.
* Repeated submission without governed improved-repeat classification.
* Events before source-event validation.
* Popularity or social metrics.

## Input ranges

| Input | Range |
|-------|-------|
| Intensity base XP | See intensity table |
| Event XP | See event table |
| Validation Factor | `1`, `0`, or negative exact original |
| Repeat Factor | `1`, `0`, or `0.25` |

## Exact equation

```text
Recognized XP =
Base Event Value
× Validation Factor
× Repeat Factor
```

### Candidate base recognition by Mission intensity

| Intensity | First valid completion XP |
| --------- | ------------------------: |
| LIGHT     |                        10 |
| STANDARD  |                        20 |
| DEEP      |                        35 |
| EXTENDED  |                        50 |

### Additional validated events

| Event                         | Candidate XP |
| ----------------------------- | -----------: |
| Stage completed               |           40 |
| Formative Evidence approved   |           30 |
| Practical Evidence approved   |           60 |
| Capstone approved             |          150 |
| Route-Proven granted          |          250 |
| Valid Team contribution       |        20–60 |
| Valid Live Sky contribution   |        20–60 |
| Approved reflection           |           10 |
| Approved service contribution |        20–60 |

### Evidence milestone XP — once per approval (v0.1.1 clarification)

```text
CAL-FND-005 clarification:

Evidence-related XP (formative / practical / capstone / Route-Proven grants as listed)
is activity recognition awarded once per successful approval event.

It is NOT Skill.
It is NOT Mastery.
It does NOT substitute for Capability or Route Mastery formulas.

Low Mission volume + high approved Evidence can yield relatively high XP
because milestone XP recognizes validated Evidence activity — expected.

Do not retune Evidence XP solely because PER-004 (or similar) looks “high XP.”
```

### Remediation

```text
Remediation XP =
50% of the original Mission base XP

Maximum:
one valid remediation recognition per original gap
```

### Validation Factor

```text
VALID = 1
PROVISIONAL = 0
REJECTED = 0
REVERSED = negative of the exact original recognized amount
```

### Repeat Factor

```text
First valid completion = 1
Identical repeat = 0
Governed improved repeat = 0.25
Maximum one improved-repeat recognition
```

## Output range

Non-negative lifetime cumulative XP after applying reversals (reversals post exact negatives). Lifetime XP does not decay.

## Rounding method

Round half away from zero to nearest integer XP unit after multiplication.

## Caps / floors

* One valid remediation recognition per original gap.
* Maximum one improved-repeat recognition per original completion.
* **Once-per-approval** for each Evidence milestone recognition (v0.1.1).
* Team / Live / service contribution XP capped within stated 20–60 band per valid event (exact mid-point selection is simulation-sensitive).

## Hard gates

* No XP before source-event validation.
* No plan multiplier; no paid-plan bonus.
* Revisions do not create repeated full XP.
* Double-counting the same approval event is prohibited (integrity red-team RTM-19).

## Missing-data / provisional / reversal / freshness

| Behavior | Rule |
|----------|------|
| Missing intensity / event class | Do not award; log incomplete event |
| Provisional | Validation Factor = 0 |
| Reversal | Negate exact original recognized XP amount |
| Freshness | Lifetime XP does not decay |

## Explainability text

“Flight XP recognizes validated Missions and related progress, including Evidence milestones once per approval. Paying for a plan, logging in, or repeating the same work does not multiply XP. XP is not Skill.”

## Simulation scenarios

PER-001…PER-015; RUN-001; RUN-003; RUN-006; CAL-FND-005

## Sensitivity range

Intensity table values ±25%; event XP table ±25%; remediation rate 40–60%.

## Known risks

Early learners may advance Flight Level quickly if Mission volume is high; Evidence-heavy portfolios may show high XP without high Mission count — **expected** under once-per-approval recognition; XP must not be confused with Mastery.

## Calibration status

```text
CALIBRATION RECOMMENDED · PENDING 1D
NOT production calibrated
synthetic only
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Initial candidate under GHV.PROGRESSION.1B |
| **0.1.1** | 2026-07-21 | **CAL-FND-005:** Evidence XP once-per-approval clarification; XP ≠ Skill; status → CALIBRATION RECOMMENDED · PENDING 1D |
