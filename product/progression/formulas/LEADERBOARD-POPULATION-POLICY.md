# Leaderboard Population Policy

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-POL-POP-001 |
| **Version** | 0.1.0 |
| **Status** | SIMULATION CANDIDATE · PENDING GHV.PROGRESSION.1C CALIBRATION |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1B |
| **Last updated** | 2026-07-21 |
| **Policy ID** | POL-POP-001 |
| **Limitations** | SIMULATION CANDIDATE only · NOT CALIBRATED · NOT production · no Product Code |

## Policy ID

```text
POL-POP-001
```

## Purpose

Gate public ranked boards by eligible population size to prevent false prestige claims.

## Candidate rules

```text
Fewer than 20 eligible users:
No public ranked board.
Show personal progress or cohort summary only.

20–49 eligible users:
Route or cohort board allowed.
No broad global claim.

50–99 eligible users:
Broader board may be displayed with population context.

100 or more eligible users:
Global or regional board may be considered where privacy and policy permit.
```

## Additional rules

* Minor users use Crow identity.
* Opt-out supported.
* Low population must not produce “top expert” claims.
* Paid plans receive no multiplier.
* Suspicious standings remain provisional.
* Corrected source records update standings.
* Historical season standings remain archived.

## Explainability text

“Boards only appear as ranked public lists when enough eligible people have opted in. Small groups see personal progress instead.”

## Simulation scenarios

RUN-004 (population 500)

## Known risks

Premature global claims; minor privacy leaks; paid multipliers (prohibited).

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Initial population threshold policy under GHV.PROGRESSION.1B |
