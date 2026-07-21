# Calibration Cohorts A–F

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-CAL-COH-001 |
| **Version** | 0.1.0 |
| **Status** | CALIBRATION RECOMMENDED · PENDING 1D |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1C |
| **Last updated** | 2026-07-21 |
| **Exact cohort count** | **6** (A–F) |
| **Limitations** | Cohort definitions for synthetic / pilot design · **NOT production calibrated** · **synthetic only** |

## Purpose

Define calibration cohorts so rates, watches, and fairness claims are never cited without a population story. **Cohort A stress density is not launch forecast.**

```text
CALIBRATION RECOMMENDED · PENDING 1D
NOT production calibrated
synthetic only
Name the cohort whenever citing a rate
```

---

## Cohort A — Stress density

| Field | Definition |
|-------|------------|
| **ID** | COH-A |
| **Name** | Stress density |
| **Intent** | Maximize Evidence / Route / contribution density to stress Mastery, Titles, and Prestige rarity under load |
| **Synthetic anchor** | RUN-004 primary mix that produced Route-Proven **38.60%** |
| **Expected use** | Upper-bound stress; anti-gaming and rarity pressure |
| **Forbidden use** | Launch KPI; “first-year RP will be ~39%” claims |
| **Linked findings** | CAL-FND-003 |

---

## Cohort B — Launch-realistic

| Field | Definition |
|-------|------------|
| **ID** | COH-B |
| **Name** | Launch-realistic first-year mix |
| **Intent** | Approximate ordinary first-year activity: many beginners, moderate Evidence, sparse Route-Proven, scarce Prestige |
| **Expected RP** | **Much lower** than Cohort A under unchanged Mastery floors |
| **Expected Prestige** | Ascendant uncommon; Apex / Obsidian **0** in ordinary first-year launch-realistic |
| **Expected use** | Primary narrative for soft watches and pilot design |
| **Linked findings** | CAL-FND-003 · CAL-FND-004 · CAL-FND-006 |

---

## Cohort C — Accessibility / compressed schedule

| Field | Definition |
|-------|------------|
| **ID** | COH-C |
| **Name** | Accessibility and compressed participation |
| **Intent** | Learners with compressed weekly schedules, AT use, reduced-motion, or intermittent attendance |
| **Synthetic anchors** | PER-010 and matched counterfactual variants |
| **Rules** | Schedule must not change Mastery; Momentum fairness monitored under CAL-FND-002 / CAL-FND-007 |
| **Expected use** | Fairness + a11y soft watch into real pilot |

---

## Cohort D — Pay-paired equivalence

| Field | Definition |
|-------|------------|
| **ID** | COH-D |
| **Name** | Pay-paired free vs paid |
| **Intent** | Identical event histories across Access Plan variants |
| **Required equality** | All progression diffs = **0** (RUN-006 posture) |
| **Expected use** | Permanent anti-pay-to-win regression; CAL-PR-15 |
| **Forbidden use** | Treating entitlement differences as Skill differences |

---

## Cohort E — Integrity / Trust stress

| Field | Definition |
|-------|------------|
| **ID** | COH-E |
| **Name** | Integrity and Trust stress |
| **Intent** | Active integrity holds, contested Evidence, remediation, Trust transitions |
| **Synthetic anchors** | PER-013 and integrity-flagged population slices |
| **Rules** | Trust remains non-numeric / non-public; valid historical Evidence not erased |
| **Expected use** | Trust / correction / anti-gaming calibration watches (WITH CONDITIONS on POL-TRU-001) |

---

## Cohort F — Arabic-first / minors / privacy-sensitive

| Field | Definition |
|-------|------------|
| **ID** | COH-F |
| **Name** | Arabic-first, minors, privacy-sensitive |
| **Intent** | Language-first learners, minors, privacy-safe leaderboard / Prestige exposure rules |
| **Synthetic anchors** | PER-009 and privacy-sensitive board rules |
| **Rules** | Language surface quality ≠ technical correctness unless assessed; minors excluded from unsafe Prestige / adult social pathways; matched counterfactuals vs adult / EN peers where fairness is claimed |
| **Expected use** | Explainability (AR/EN), privacy, age fairness |

---

## Citation rules

1. Every published rate must include `cohort=<ID>`.
2. Comparing A→B without restating floors is a process defect.
3. Fairness claims across C/D/F require [COUNTERFACTUAL-FAIRNESS-TESTS.md](./COUNTERFACTUAL-FAIRNESS-TESTS.md).
4. Cohort labels do not create Product Code or production telemetry schemas in 1C.

## Mapping to 1B runs

| 1B run | Default cohort reading |
|--------|------------------------|
| RUN-001 personas | Mixed illustrative; not a single cohort |
| RUN-004 population | **Cohort A** stress density (unless re-weighted) |
| RUN-005 sensitivity | Parameter stress; cohort-agnostic method |
| RUN-006 pay-to-win | **Cohort D** |

## Change history

| Version | Date | Change |
|---------|------|--------|
| 0.1.0 | 2026-07-21 | Define Cohorts A–F for GHV.PROGRESSION.1C |
