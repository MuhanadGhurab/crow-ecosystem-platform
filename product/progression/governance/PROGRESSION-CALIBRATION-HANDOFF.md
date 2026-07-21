# Progression Calibration Handoff

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-GOV-CAL-001 |
| **Version** | 0.4.0 |
| **Status** | HANDOFF PACKAGE · POST GHV.PROGRESSION.1D LOCK · VALIDATION DEBT REMAINS |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1D |
| **Handoff target** | Real-user / usability / technical validation · GHV.BASELINE-CORRECTION.1 (screen debt) · then GHV.ARCHITECTURE.1A |
| **Last updated** | 2026-07-21 |
| **Related** | [PROGRESSION-BASELINE-MANIFEST.md](./PROGRESSION-BASELINE-MANIFEST.md) · [FINAL-FORMULA-VERSION-REGISTRY.md](./FINAL-FORMULA-VERSION-REGISTRY.md) · [../formulas/PROGRESSION-FORMULA-REGISTRY.md](../formulas/PROGRESSION-FORMULA-REGISTRY.md) · [../calibration/README.md](../calibration/README.md) · [PROGRESSION-TECHNICAL-HANDOFF.md](./PROGRESSION-TECHNICAL-HANDOFF.md) |

## Purpose

Record that **GHV.PROGRESSION.1D PASS** locked the Progression Design Baseline, and carry remaining validation debt forward — **without** production implementation.

```text
LOCKED AS GOVERNED PROGRESSION DESIGN BASELINE v1.0.0
INTERNAL SYNTHETIC CALIBRATION COMPLETE
NOT production calibrated
NOT REAL-USER EVIDENCE
Product Code BLOCKED
```

## Lock outcome (1D)

| Item | Status |
|------|--------|
| Progression Design Baseline v1.0.0 | **LOCKED** |
| Internal Calibration Baseline v0.2.0 | Superseded into design lock (evidence retained) |
| Learning Design Baseline v1.0.0 | Unchanged |
| Change Freeze | Active |

## Accepted formula versions (locked)

| ID | Version | Notes |
|----|---------|-------|
| FRM-MAT-001 | **0.2.0** | LOCKED AS DESIGN BASELINE |
| FRM-MOM-002 | **0.2.0** | **LOCKED WITH VALIDATION CONDITIONS** |
| FRM-XP-001 | **0.1.1** | LOCKED AS DESIGN BASELINE |
| All other registered IDs | **0.1.0** | Per FINAL-FORMULA-VERSION-REGISTRY |
| FRM-PRS-001 / POL-PRS-001 | 0.1.0 | **LOCKED WITH VALIDATION CONDITIONS** |
| POL-TRU-001 | 0.1.0 | **LOCKED WITH VALIDATION CONDITIONS** |
| POL-POP-001 | 0.1.0 | **LOCKED WITH VALIDATION CONDITIONS** |

Authoritative version table: [FINAL-FORMULA-VERSION-REGISTRY.md](./FINAL-FORMULA-VERSION-REGISTRY.md).

## Conditions that remain after 1D

1. **FRM-MOM-002** — real-user League-boundary monitoring; usability; season review; buffer tech validation.
2. **POL-TRU-001** — moderation policy, FP testing, window calibration, staffing, age/legal.
3. **FRM-PRS-001 / POL-PRS-001** — panel staffing/consistency, rarity, CoI ops, Prestige usability.
4. **POL-POP-001** — small-population pilot, culture/privacy/minors, toxicity monitoring.

## Evidence retained

| Item | Status |
|------|--------|
| Multi-seed population (25k) | COMPLETE — RUN-007 |
| Cohort B launch-realistic | RP **22.88%** · Ascendant **0%** |
| Counterfactual fairness | **10/10 PASS** — RUN-008 |
| Schedule fairness | Skill equal · mom Δ **4.33 ≤ 10** — RUN-009 |
| Integrity red-team | **20/20 PASS** — RUN-013 |
| Pay-to-win | all diffs **0** |
| Real-user calibration | **NOT RUN** |
| Usability validation | **NOT RUN** |
| Technical validation | **NOT RUN** |

## Remaining external debt (non-progression formulas)

| Debt | Gate / path |
|------|-------------|
| Screen registry 90 vs authoritative 92 / 7 shells | **GHV.BASELINE-CORRECTION.1** (**Next**) · blocks **ARCHITECTURE.1A** |
| Real-user progression pilot | DEP-076 · NOT RUN |
| Technical validation | DEP-077 · NOT RUN · Product Code BLOCKED |

## Explicit non-claims

```text
NOT production calibrated
NOT REAL-USER EVIDENCE
NOT TECHNICALLY VALIDATED
NO PRODUCT CODE IN THIS HANDOFF
Screen counts NOT silently corrected here
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Initial calibration handoff from GHV.PROGRESSION.1B (pre-run placeholders) |
| 0.2.0 | 2026-07-21 | COMPLETE simulation results summary + calibration watches |
| 0.3.0 | 2026-07-21 | 1C PASS handoff → 1D with accepted versions, conditions, multi-seed, red-team PASS |
| 0.4.0 | 2026-07-21 | 1D PASS — design lock recorded; validation + screen-count debt carried forward |
