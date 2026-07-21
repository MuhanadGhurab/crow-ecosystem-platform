# Progression Correction Mathematics

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-POL-COR-001 |
| **Version** | 0.1.0 |
| **Status** | SIMULATION CANDIDATE · PENDING GHV.PROGRESSION.1C CALIBRATION |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1B |
| **Last updated** | 2026-07-21 |
| **Policy ID** | POL-COR-001 |
| **Limitations** | SIMULATION CANDIDATE only · NOT CALIBRATED · NOT production · no Product Code |

## Policy ID

```text
POL-COR-001
```

## Purpose

Define exact correction and reversal mathematics so errors do not silently rewrite unrelated progression systems.

## Rules

### XP

A reversal posts:

```text
Negative of the exact original XP amount
```

### Momentum

Recalculate only the affected weekly and season records.

### Mastery

Remove or restore the affected Evidence contribution.

Recalculate only affected capabilities and Routes.

### Breadth

Recalculate only affected capability clusters, Horizons and integrations.

### Trust

Reverse only affected Trust signals and dependent restrictions.

### Titles and Prestige

Move to:

```text
REEVALUATION_REQUIRED
```

when an affected mandatory source changes.

### Leaderboards

Recalculate affected standings.

History remains auditable.

No correction may silently rewrite unrelated progression systems.

## Explainability text

“If a result was based on something later reversed, we correct only the systems that used that source — and we keep an audit history.”

## Simulation scenarios

PER-013; RUN-001 reversal cases

## Known risks

Silent cross-system rewrites; incomplete XP negation; Title/Prestige left active after source revoke.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Initial correction policy under GHV.PROGRESSION.1B |
