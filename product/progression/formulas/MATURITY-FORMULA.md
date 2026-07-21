# Maturity Formula

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-FRM-MAT-001 |
| **Version** | 0.1.0 |
| **Status** | SIMULATION CANDIDATE · PENDING GHV.PROGRESSION.1C CALIBRATION |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1B |
| **Last updated** | 2026-07-21 |
| **Formula ID** | FRM-MAT-001 |
| **Limitations** | SIMULATION CANDIDATE only · NOT CALIBRATED · NOT production · no Product Code |

## Formula ID

```text
FRM-MAT-001
```

## Progression system

Maturity Rank

## Purpose

Compute a Maturity Index from nine qualitative dimensions and apply Rank gates from Hatchling through Raven. Rank is not employment seniority and is separate from Prestige.

## Inputs

* Nine dimension levels scored 0–4.
* Supporting Evidence / Route / Trust context for hard gates.

## Prohibited inputs

* Payment.
* Popularity.
* Flight XP as a substitute for dimension evidence.
* Ordinary inactivity as demotion cause.

## Dimension weights (total 100)

| Dimension                              |  Weight |
| -------------------------------------- | ------: |
| Digital independence                   |      10 |
| Learning independence                  |      10 |
| Practical execution                    |      15 |
| Documentation quality                  |      10 |
| Problem decomposition                  |      15 |
| Responsible judgment                   |      15 |
| Collaboration                          |      10 |
| Evidence ownership and self-correction |      10 |
| Unfamiliar-context adaptation          |       5 |
| **Total**                              | **100** |

### Dimension levels

```text
0 — Not observed
1 — Emerging
2 — Demonstrated with guidance
3 — Independent
4 — Consistently independent across contexts
```

## Exact equation

```text
Maturity Index =
Σ(Dimension Level ÷ 4 × Dimension Weight)
```

### Output

```text
0–100
```

## Rounding

Round half away from zero to 1 decimal for Index; Rank gates use the rounded Index.

## Candidate Rank gates

### Hatchling

Default entry Rank.

### Fledgling

```text
Maturity Index ≥ 20
At least 3 dimensions ≥ 1
At least 2 valid learning contexts
```

### Scout

```text
Maturity Index ≥ 35
At least 5 dimensions ≥ 1
At least 1 approved practical Evidence item
```

### Pathfinder

```text
Maturity Index ≥ 50
At least 5 dimensions ≥ 2
At least 1 Route-Proven record
```

### Specialist

```text
Maturity Index ≥ 65
At least 6 dimensions ≥ 2
At least 1 dimension ≥ 3
At least 2 independent practical or capstone contexts
```

### Vanguard

```text
Maturity Index ≥ 78
At least 7 dimensions ≥ 3
Verified multi-context or Team contribution
Trust Standing ≥ POSITIVE_STANDING
Human review where required
```

### Raven

```text
Maturity Index ≥ 90
All critical dimensions ≥ 3
At least 3 dimensions = 4
Integrated Evidence through CXW or governed equivalent
Trust Standing = ELEVATED_RESPONSIBILITY_ELIGIBLE
Human review required
```

## Rules

* No ordinary inactivity demotion.
* Experienced learners may advance through governed Evidence recognition.
* Rank does not equal employment seniority.
* Integrity concerns may suspend review without deleting valid history.
* Raven Maturity remains separate from Prestige.

## Missing / provisional / reversal / freshness

| Behavior | Rule |
|----------|------|
| Missing dimension | Level 0 (Not observed) |
| Provisional Evidence | Does not raise dimensions above observed |
| Reversal | Recalculate Index and re-check Rank gates |
| Freshness | Maturity may require refresh overlays via Mastery freshness where Evidence underpins dimensions |

## Explainability text

“Maturity Rank reflects how independently you learn and work across several habits — not how many XP points you have, and not a job title.”

## Simulation scenarios

PER-004; PER-005; PER-015; RUN-003

## Sensitivity range

Rank Index gates ±5; dimension weights ±2 with renormalization to 100.

## Known risks

Launch users reaching high Ranks too easily; artificial time-gating; confusion with Prestige.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Initial nine-dimension candidate under GHV.PROGRESSION.1B |
