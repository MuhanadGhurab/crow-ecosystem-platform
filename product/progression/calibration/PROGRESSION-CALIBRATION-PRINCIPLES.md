# Progression Calibration Principles — Gate §8 Lock

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-CAL-PRN-001 |
| **Version** | 0.1.0 |
| **Status** | CALIBRATION RECOMMENDED · PENDING 1D |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1C §8 |
| **Last updated** | 2026-07-21 |
| **Exact principle count** | **15** |
| **Limitations** | Principles bind calibration judgment · **NOT production calibrated** · **synthetic only** |

## Purpose

Lock the **fifteen** calibration principles from Gate §8. These principles govern how synthetic evidence, findings, and formula revisions are interpreted on the path to `GHV.PROGRESSION.1D`. They do **not** lock a production baseline.

```text
CALIBRATION RECOMMENDED · PENDING 1D
NOT production calibrated
synthetic only
Gate §8 principles LOCKED for 1C judgment
```

---

## Locked principles (exact 15)

| ID | Principle | Binding meaning |
|----|-----------|-----------------|
| **CAL-PR-01** | Synthetic is not production | Synthetic simulation and analytical scripts are **not** real-user calibration and **not** production lock evidence. |
| **CAL-PR-02** | No cosmetic retune | Do **not** retune formulas solely to beautify histograms, hit quotas, or remove soft-watch nominees. |
| **CAL-PR-03** | Shape ≠ fairness defect | League / Rank / Prestige **distribution shape** is not automatically a fairness defect. |
| **CAL-PR-04** | Do not equalize leagues | Do **not** equalize Momentum leagues (or Rank mixes) for appearance. Diamond rare/hard is acceptable. |
| **CAL-PR-05** | Name the cohort | Every rate citation must name its **cohort** (A–F). Stress density ≠ launch-realistic. |
| **CAL-PR-06** | Floors over quotas | Mastery / Prestige / Rank **floors and gates** are not adjusted merely to hit a target percentage. |
| **CAL-PR-07** | Matched counterfactuals | Fairness claims that compare schedules, language, age, or plan require **matched counterfactual** event histories. |
| **CAL-PR-08** | Schedule ≠ Mastery | Schedule shape, compression, or accommodation **must not** change Mastery / Route-Proven by itself. |
| **CAL-PR-09** | Labels vs scores | Discrete **label** sensitivity at band edges is expected; prefer **score stability** and governed transition buffers over floor thrash. |
| **CAL-PR-10** | Clarification before retune | Prefer **definition clarifications** (contexts, once-per-approval, hysteresis) over magnitude retunes when root cause is ambiguity or generator defect. |
| **CAL-PR-11** | XP ≠ Skill | Flight XP remains **activity recognition**. Evidence milestone XP is not Skill, Maturity, or Mastery. |
| **CAL-PR-12** | Reachability without forcing | Lower developmental Ranks (e.g. Fledgling) must be **reachable** when earned; do **not** force-populate Ranks. |
| **CAL-PR-13** | Governed Rank skip | When a higher Rank’s gates are **fully met**, governed skip to the highest fully-met Rank is allowed; intermediate dwell is not mandatory. |
| **CAL-PR-14** | Rarity soft watch ≠ hike | Soft watches on Ascendant (or similar) do **not** authorize threshold hikes solely to eliminate nominees. Apex/Obsidian remain **0** in ordinary first-year launch-realistic mixes. |
| **CAL-PR-15** | Payment never enters | Pay-to-win diffs must remain **0**. Payment / plan never enters progression equations; plan may affect entitlement/capacity only. |

---

## Enforcement posture

| Layer | Obligation |
|-------|------------|
| Findings (CAL-FND-*) | Must cite which principles apply |
| Formula revisions | Must state which principle authorizes the change |
| Acceptance matrix | WITH CONDITIONS rows must name monitoring obligations consistent with these principles |
| 1D lock | May not claim production calibration without superseding CAL-PR-01 with real-user evidence |

Violation of a locked principle is a **calibration process defect**, not a tunable preference.

## Relationship to architecture invariants

These principles **complement** `PROGRESSION-INVARIANTS.md` (payment / Evidence / standing separations). Invariants forbid illegal equivalences; calibration principles forbid illegal **interpretation and retuning** of synthetic evidence.

## Explicit non-claims

```text
Principles LOCKED for GHV.PROGRESSION.1C judgment
Final Progression Baseline NOT LOCKED
NOT production calibrated
synthetic only
PENDING 1D
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Lock 15 Gate §8 calibration principles under GHV.PROGRESSION.1C |
