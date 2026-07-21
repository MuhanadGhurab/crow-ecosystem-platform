# Mandatory Calibration Closure

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-GOV-CAL-CLS-001 |
| **Version** | 1.0.0 |
| **Status** | LOCKED AS GOVERNED PROGRESSION DESIGN BASELINE |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1D §11 |
| **Last updated** | 2026-07-21 |
| **Findings closed** | CAL-FND-001…007 |
| **Related** | [../calibration/MANDATORY-CALIBRATION-FINDINGS.md](../calibration/MANDATORY-CALIBRATION-FINDINGS.md) · [FINAL-FORMULA-VERSION-REGISTRY.md](./FINAL-FORMULA-VERSION-REGISTRY.md) |

```text
LOCKED AS GOVERNED PROGRESSION DESIGN BASELINE
INTERNAL SYNTHETIC CALIBRATION COMPLETE

REAL-USER CALIBRATION: NOT RUN
USABILITY VALIDATION: NOT RUN
TECHNICAL VALIDATION: NOT RUN
PRODUCTION CALIBRATION: NOT RUN
IMPLEMENTATION: BLOCKED
PRODUCTION READINESS: BLOCKED
```

## Purpose

Record final dispositions for mandatory calibration findings under Gate §11. Closure is **synthetic design closure** — each finding retains real-world validation debt.

---

## CAL-FND-001 — Fledgling Population Gap

```text
Root cause:
Synthetic generator plus contextual observation design.

Action:
Mission and Stage contexts added.
Practical dimensions softened appropriately.
Governed Rank skipping documented.

Version:
FRM-MAT-001 v0.2.0

Result:
Resolved (synthetic).
Fledgling reached by 3,472 / 25,000 users.
Rank ordering monotonic.
Raven 0 (expected rarity).

Real-world debt:
Confirm context counting and Rank skip in technical validation and real-user pilot.
```

**Final disposition:** CLOSED AS RESOLVED (synthetic) · Design status LOCKED AS BASELINE

---

## CAL-FND-002 — Momentum Sensitivity

```text
Root cause:
Expected label sensitivity near League boundaries.

Action:
Promotion buffer ±2.
8 weeks / best 6 retained.

Version:
FRM-MOM-002 v0.2.0

Result:
Passed with real-user monitoring condition.
```

**Final disposition:** CLOSED WITH VALIDATION CONDITIONS · Design status LOCKED WITH VALIDATION CONDITIONS

---

## CAL-FND-003 — Route-Proven Density

```text
Root cause:
Architecture stress cohort was deliberately Evidence-heavy.

Results:
Stress Cohort A approximately 45.11%.
Launch-realistic Cohort B 22.88%.

Action:
Mandatory floors unchanged.
No quota tuning.

Result:
Explained and accepted.
```

**Final disposition:** CLOSED AS EXPLAINED · Design status LOCKED AS BASELINE (Mastery floors unchanged)

---

## CAL-FND-004 — Prestige Soft Warning

```text
Launch-realistic Cohort B:
Ascendant 0%.
Apex 0%.
Obsidian 0%.

Stress Cohort A:
Ascendant approximately 8.31%.

Action:
Thresholds retained.
Human review retained.
Panel staffing remains validation debt.
```

**Final disposition:** CLOSED WITH VALIDATION CONDITIONS (FRM-PRS-001 · POL-PRS-001)

---

## CAL-FND-005 — Evidence XP Semantics

```text
Version:
FRM-XP-001 v0.1.1

Action:
One recognition per valid approval clarified.
Mastery remains separate.
```

**Final disposition:** CLOSED AS CLARIFIED · Design status LOCKED AS BASELINE

---

## CAL-FND-006 — Momentum Shape

```text
Gold concentration:
Accepted synthetic distribution shape (Gold 7399 / 25000).

Diamond:
Rare (0 in multi-seed) but not declared unreachable.

Action:
No equal-population tuning.
```

**Final disposition:** CLOSED AS ACCEPTED SHAPE · monitoring via FRM-MOM-002 conditions

---

## CAL-FND-007 — Schedule Difference

```text
Matched schedule counterfactual:
Skill systems equal.
Momentum difference 4.33.
Allowed boundary ≤ 10.

Result:
PASS.
```

**Final disposition:** CLOSED AS PASS · real-user a11y / schedule debt remains NOT RUN

---

## Summary

| Finding | Disposition | Version / condition |
|---------|-------------|---------------------|
| CAL-FND-001 | Resolved (synthetic) | FRM-MAT-001 0.2.0 |
| CAL-FND-002 | WITH CONDITIONS | FRM-MOM-002 0.2.0 |
| CAL-FND-003 | Explained / floors unchanged | — |
| CAL-FND-004 | WITH CONDITIONS | FRM/POL-PRS 0.1.0 |
| CAL-FND-005 | Clarified | FRM-XP-001 0.1.1 |
| CAL-FND-006 | Accepted shape | No equalization |
| CAL-FND-007 | PASS | mom Δ 4.33 ≤ 10 |

REVISE AND RETEST remaining: **0**

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.PROGRESSION.1D §11 — mandatory finding closure |
