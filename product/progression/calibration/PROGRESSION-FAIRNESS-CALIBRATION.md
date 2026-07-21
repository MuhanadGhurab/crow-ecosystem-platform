# Progression Fairness Calibration

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-CAL-FRN-001 |
| **Version** | 0.1.0 |
| **Status** | CALIBRATION RECOMMENDED · PENDING 1D |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1C |
| **Last updated** | 2026-07-21 |
| **Related** | [../fairness/PROGRESSION-FAIRNESS-ARCHITECTURE.md](../fairness/PROGRESSION-FAIRNESS-ARCHITECTURE.md) · [COUNTERFACTUAL-FAIRNESS-TESTS.md](./COUNTERFACTUAL-FAIRNESS-TESTS.md) · [CALIBRATION-COHORTS.md](./CALIBRATION-COHORTS.md) · [MANDATORY-CALIBRATION-FINDINGS.md](./MANDATORY-CALIBRATION-FINDINGS.md) |
| **Limitations** | Fairness calibration on **synthetic only** evidence · **NOT production calibrated** · usability NOT RUN · real-user NOT RUN |

## Purpose

Translate fairness architecture into **calibration judgments**: what synthetic evidence supports, what remains conditional, and what must not be “fixed” by cosmetic retunes.

```text
CALIBRATION RECOMMENDED · PENDING 1D
NOT production calibrated
synthetic only
```

---

## Fairness calibration outcomes

| Theme | Synthetic judgment | Action | Conditions into 1D / pilot |
|-------|--------------------|--------|----------------------------|
| Pay-to-win | RUN-006 all diffs = 0 | Hold | Permanent regression (Cohort D) |
| Speed ≠ Mastery | High-activity low-Evidence → no RP (PER-003) | Hold floors | None |
| Evidence-first progression | Low-activity high-Evidence → RP possible (PER-004) | Clarify XP once-per-approval | Explainability watch |
| Schedule / a11y | Unmatched PER-009 vs PER-010 insufficient | Require matched counterfactuals | Momentum soft watch; **schedule ≠ Mastery** |
| League equalization | Gold heavy / Diamond 0 | **Do not equalize** | Monitor Cohort B shape |
| Momentum band edges | ~37% label flips at ±10% | Alternative B ±2 buffer | **WITH CONDITIONS** — monitor bands in real pilot |
| Prestige rarity | Ascendant ~4.4% soft watch; Apex/Obsidian 0 | No cosmetic hike | **WITH CONDITIONS** — panel / PEI monitor |
| RP density | 38.6% = Cohort A | Floors unchanged | Cite Cohort B for launch narrative |
| Language / minors | Architecture rules intact; synthetic AR persona present | Keep privacy / age overlays | Cohort F real-user NOT RUN |
| Leaderboard opt-in | Population thresholds candidate | No forced public boards | **WITH CONDITIONS** on POL-POP-001 |

---

## Binding fairness statements for 1C

1. **Distribution shape is not discrimination** without a protected-factor counterfactual (CAL-PR-03, CAL-PR-07).
2. **Do not equalize leagues** to satisfy aesthetic fairness (CAL-FND-006, CAL-PR-04).
3. **Schedule must not change Mastery** (CAL-FND-007, CAL-PR-08).
4. **Soft watch ≠ threshold hike** for Ascendant nominees (CAL-FND-004, CAL-PR-14).
5. Accessibility preferences must not reduce standing (architecture F6/F7; CFT-05).

---

## Cohort reading for fairness claims

| Claim type | Allowed cohort basis |
|------------|----------------------|
| Stress / rarity pressure | COH-A |
| Launch-ordinary narrative | COH-B |
| Schedule / AT fairness | COH-C + matched CFT |
| Pay equivalence | COH-D |
| Integrity fairness | COH-E |
| Language / age / privacy | COH-F + matched CFT |

---

## Residual fairness risks (explicit)

| Risk | Status |
|------|--------|
| Real compressed-schedule learners | **NOT RUN** (real-user) |
| AT certification matrix | **NOT RUN** (usability / tech) |
| Reviewer bias on live Evidence | **synthetic only** watch |
| Leaderboard population bands | Candidate — WITH CONDITIONS |

## Verdict

```text
Fairness calibration: CALIBRATION RECOMMENDED
Advance to 1D with conditions on Momentum bands, Trust windows,
Prestige panel/PEI, and leaderboard population thresholds
NOT production calibrated
synthetic only
PENDING 1D
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Initial fairness calibration outcomes for GHV.PROGRESSION.1C |
