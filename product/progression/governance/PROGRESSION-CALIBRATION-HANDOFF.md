# Progression Calibration Handoff

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-GOV-CAL-001 |
| **Version** | 0.3.0 |
| **Status** | HANDOFF PACKAGE · PENDING GHV.PROGRESSION.1D |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1C |
| **Handoff target** | GHV.PROGRESSION.1D — Final Progression Baseline Review and Lock |
| **Last updated** | 2026-07-21 |
| **Related** | [../formulas/PROGRESSION-FORMULA-REGISTRY.md](../formulas/PROGRESSION-FORMULA-REGISTRY.md) · [../calibration/README.md](../calibration/README.md) · [../simulation/SIMULATION-RUN-REGISTRY.md](../simulation/SIMULATION-RUN-REGISTRY.md) · [PROGRESSION-TECHNICAL-HANDOFF.md](./PROGRESSION-TECHNICAL-HANDOFF.md) |

## Purpose

Provide `GHV.PROGRESSION.1D` with accepted formula versions, conditions, mandatory findings, multi-seed / fairness / red-team evidence, and remaining real-user / technical gaps — **without** production implementation.

```text
CALIBRATION RECOMMENDED · PENDING 1D
NOT production calibrated
synthetic only
Product Code BLOCKED
```

## Accepted formula versions

| ID | Version | Notes |
|----|---------|-------|
| FRM-MAT-001 | **0.2.0** | Mission/Stage contexts; governed Rank skip; Fledgling reachable |
| FRM-MOM-002 | **0.2.0** | Alternative B ±2 promotion buffer · **WITH CONDITIONS** |
| FRM-XP-001 | **0.1.1** | Evidence XP once-per-approval |
| All other registered IDs | **0.1.0** | CALIBRATION RECOMMENDED · PENDING 1D |
| FRM-PRS-001 / POL-PRS-001 | 0.1.0 | **WITH CONDITIONS** (soft watch) |
| POL-TRU-001 | 0.1.0 | **WITH CONDITIONS** |
| POL-POP-001 | 0.1.0 | **WITH CONDITIONS** |

Rejected candidates: **none**.

## Conditions that must travel into 1D

1. **FRM-MOM-002** — monitor league bands in real pilot; do not equalize leagues.
2. **POL-TRU-001** — false-restriction / time-window calibration with Cohort E discipline.
3. **FRM-PRS-001 / POL-PRS-001** — Ascendant soft watch; Cohort B Ascendant **0%**; Apex/Obsidian **0** in ordinary first-year launch-realistic; panel feasibility.
4. **POL-POP-001** — validate population thresholds before authoritative public boards.

## Evidence package for 1D intake

| Item | Status |
|------|--------|
| Multi-seed population (25k; seeds 20260721–20260725) | COMPLETE — RUN-007 |
| Cohort B launch-realistic | RP **22.88%** · Ascendant **0%** · Fledgling 1309 |
| Counterfactual fairness | **10/10 PASS** — RUN-008 |
| Schedule fairness | Skill equal · mom Δ **4.33 ≤ 10** — RUN-009 |
| Integrity red-team | **20/20 PASS** — RUN-013 |
| Pay-to-win | all diffs **0** |
| Real-user calibration | **NOT RUN** |
| Usability validation | **NOT RUN** |
| Technical validation | **NOT RUN** |

## Mandatory findings

See [MANDATORY-CALIBRATION-FINDINGS.md](../calibration/MANDATORY-CALIBRATION-FINDINGS.md) — CAL-FND-001…007 dispositions accepted.

## Explicit non-claims

```text
NOT production calibrated
NOT FINAL
NOT PRODUCTION READY
NOT REAL-USER EVIDENCE
NO PRODUCT CODE IN THIS HANDOFF
Final Progression Baseline NOT LOCKED
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Initial calibration handoff from GHV.PROGRESSION.1B (pre-run placeholders) |
| 0.2.0 | 2026-07-21 | COMPLETE simulation results summary + calibration watches |
| 0.3.0 | 2026-07-21 | 1C PASS handoff → 1D with accepted versions, conditions, multi-seed, red-team PASS |
