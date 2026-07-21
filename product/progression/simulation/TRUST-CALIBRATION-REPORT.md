# Trust Calibration Report

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-SIM-TRU-RPT-001 |
| **Version** | 0.1.0 |
| **Status** | CALIBRATION RECOMMENDED · PENDING 1D (WITH CONDITIONS) |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1C |
| **Run ID** | RUN-011 |
| **Policy** | POL-TRU-001 **0.1.0** |
| **Related** | [../formulas/TRUST-TRANSITION-POLICY.md](../formulas/TRUST-TRANSITION-POLICY.md) · Cohort E · integrity red-team |
| **Limitations** | Synthetic signal labels only · moderation pilot **NOT RUN** · **NOT production calibrated** |

## Purpose

Record Trust-state distributions under multi-seed calibration and confirm false-positive / farming protections at design-test level (no public numeric Trust score).

## Trust states by cohort (RUN-007)

### Cohort B (launch-realistic, n=7500)

| State | Count |
|-------|------:|
| POSITIVE_STANDING | 4161 |
| NORMAL | 2501 |
| UNESTABLISHED | 838 |
| ELEVATED_RESPONSIBILITY_ELIGIBLE | 0 |

### Cohort A (stress, n=12500)

| State | Count |
|-------|------:|
| POSITIVE_STANDING | 6995 |
| NORMAL | 4570 |
| UNESTABLISHED | 597 |
| ELEVATED_RESPONSIBILITY_ELIGIBLE | 338 |

### Cohort E (adversarial integrity, n=750)

| State | Count |
|-------|------:|
| NORMAL | 372 |
| POSITIVE_STANDING | 312 |
| UNESTABLISHED | 66 |

Adversarial cohort does **not** produce Route-Proven (RP **0%**) — integrity holds block Skill elevation from compromised paths.

## Integrity / false-positive checks (design level)

| Check | Evidence | Result |
|-------|----------|--------|
| Popularity ≠ Trust elevation | Red-team RTM / CSV attacks on reactions | **PASS** |
| Restriction then restore | integrity-red-team attack 16 | **PASS** |
| Reviewer collusion hold | attack 8 | **PASS** |
| No public numeric Trust | Policy invariant | Held |

## Conditions into 1D

1. Time-window / signal-weight calibration against false-restriction risk remains **WITH CONDITIONS**.
2. Real moderation pilot required before production Trust automation confidence.
3. Risks RISK-PRG-030 / RISK-PRG-031 remain **Open**.

```text
CALIBRATION RECOMMENDED · PENDING 1D
WITH CONDITIONS (POL-TRU-001)
NOT production calibrated
synthetic only
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Trust cohort distributions + FP notes under GHV.PROGRESSION.1C |
