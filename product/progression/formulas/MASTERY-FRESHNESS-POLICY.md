# Mastery Freshness Policy

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-POL-FRS-001 |
| **Version** | 0.1.0 |
| **Status** | SIMULATION CANDIDATE · PENDING GHV.PROGRESSION.1C CALIBRATION |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1B |
| **Last updated** | 2026-07-21 |
| **Policy ID** | POL-FRS-001 |
| **Limitations** | SIMULATION CANDIDATE only · NOT CALIBRATED · NOT production · no Product Code |

## Policy ID

```text
POL-FRS-001
```

## Purpose

Apply freshness **overlays** without subtracting freshness directly from historical Mastery.

## Overlays

```text
CURRENT
REFRESH_RECOMMENDED
REEVALUATION_REQUIRED
HISTORICAL_ONLY
```

## Candidate review windows

| Capability type                   | Candidate review window    |
| --------------------------------- | -------------------------- |
| Stable foundation                 | 24 months                  |
| Slow-changing practice            | 12 months                  |
| Fast-changing technology          | 6 months                   |
| Regulation or standards dependent | On material edition change |

## Rules

* Historical Evidence remains.
* Current claims may require refresh.
* Subscription status has no effect.
* Refresh requests must identify the changed capability.
* Targeted Evidence is preferred over complete Route repetition.
* Intervals remain candidates pending `1C`.

## Explainability text

“Past Evidence stays in your history. When a skill area changes quickly, we may ask for a targeted refresh before a current claim.”

## Simulation scenarios

RUN-003 twelve-month; PER-008

## Known risks

Treating overlays as Mastery deletion; subscription-linked refresh (prohibited).

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Initial freshness overlay policy under GHV.PROGRESSION.1B |
