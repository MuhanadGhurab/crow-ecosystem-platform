# Pay-to-Win Equivalence Test

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-SIM-P2W-RPT-001 |
| **Version** | 0.1.0 |
| **Status** | SIMULATION CANDIDATE · PENDING GHV.PROGRESSION.1C CALIBRATION |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1B |
| **Run ID** | RUN-006 |
| **Output** | [../../analysis/progression-simulation/pay-to-win-results.txt](../../analysis/progression-simulation/pay-to-win-results.txt) |
| **Limitations** | SYNTHETIC · NOT PRODUCT CODE |

## Method

Identical valid event histories were evaluated under five Access Plan labels:

* Open Flight
* Flight Pass
* Wing Pass
* Expedition Pass
* Merit Grant

Plan labels are metadata only. No plan multiplier exists in any progression formula.

## Shared history outcomes (identical across plans)

| Metric | Value |
|--------|------:|
| XP | 520 |
| Momentum season score | 45.8333 |
| Maturity Index | 55.0 |
| Mastery (proxy CMI) | 76.0 |
| Breadth Index | 16.25 |
| Trust state | NORMAL |
| Title eligibility | PROGRESS_VISIBLE |
| Prestige | NOT_ELIGIBLE |

## Exact differences vs Open Flight baseline

| Plan | XP | Momentum | Maturity | Mastery | Breadth | Trust | Titles | Prestige |
|------|---:|---------:|---------:|--------:|--------:|------:|-------:|---------:|
| Open Flight | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Flight Pass | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Wing Pass | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Expedition | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| Merit Route | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Verdict

```text
All differences = 0
PASS
```

Only Entitlement and concurrency may differ in product architecture; they do **not** enter these formulas.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | RUN-006 PASS |
