# Progression Invariant Final Review

| Field | Value |
|-------|-------|
| **Document ID** | GHV-PRG-GOV-INV-REV-001 |
| **Version** | 1.0.0 |
| **Status** | LOCKED AS GOVERNED PROGRESSION DESIGN BASELINE |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.PROGRESSION.1D §12 |
| **Last updated** | 2026-07-21 |
| **Related** | [../architecture/PROGRESSION-INVARIANTS.md](../architecture/PROGRESSION-INVARIANTS.md) · [../simulation/PAY-TO-WIN-EQUIVALENCE-TEST.md](../simulation/PAY-TO-WIN-EQUIVALENCE-TEST.md) · [COUNTERFACTUAL-FAIRNESS-FINAL-REVIEW.md](./COUNTERFACTUAL-FAIRNESS-FINAL-REVIEW.md) |

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

Map Gate §12 permanent invariants to formula/policy anchors, synthetic tests, counterfactual evidence, correction behavior, and user explanation posture.

---

## Locked invariant statements

```text
Payment ≠ XP
Payment ≠ Momentum
Payment ≠ Maturity
Payment ≠ Mastery
Payment ≠ Breadth
Payment ≠ Trust
Payment ≠ Title
Payment ≠ Prestige

XP ≠ Skill
Momentum ≠ Mastery
Popularity ≠ Trust
Popularity ≠ Mastery
Completion ≠ Route-Proven
One Route-Proven ≠ Horizon-Proven
Founder status ≠ Prestige
Merit Access ≠ Progression
Inactivity ≠ Loss of Historical Learning
```

---

## Evidence map

| Invariant | Formula / policy | Synthetic test | Counterfactual evidence | Correction behavior | User explanation |
|-----------|------------------|----------------|-------------------------|---------------------|------------------|
| Payment ≠ XP | FRM-XP-001 · source authority | RUN-006 pay-to-win diffs = 0 | CFT plan arms · Skill equal | POL-COR-001 reverses invalid writes | XP copy: plan does not multiply XP |
| Payment ≠ Momentum | FRM-MOM-001/002 | RUN-006 | CFT plan arms | Season correction events | Momentum ≠ subscription |
| Payment ≠ Maturity | FRM-MAT-001 | RUN-006 | CFT plan arms | Rank corrections cite Evidence/contexts | Rank ≠ plan |
| Payment ≠ Mastery | FRM-MST-* | RUN-006 · red-team | CFT plan · schedule Mastery Δ=0 | Evidence revocation / POL-COR-001 | Mastery from Evidence |
| Payment ≠ Breadth | FRM-BRD-001 | RUN-006 | CFT plan | Breadth correction | Breadth not sold |
| Payment ≠ Trust | POL-TRU-001 | RUN-006 · RUN-011 | CFT plan | Trust workflow; no pay clear | Trust non-public; not purchasable |
| Payment ≠ Title | TPL-TTL-001/002 | RUN-006 | CFT plan | Title eligibility reverse | Titles not sold |
| Payment ≠ Prestige | FRM/POL-PRS | RUN-006 · RUN-010 | CFT plan | Human panel; revoke eligibility | Prestige not sold |
| XP ≠ Skill | FRM-XP-001 · FRM-MST-* | CAL-FND-005 · personas | Schedule Skill equal | XP correction ≠ Mastery rewrite | Explainability samples |
| Momentum ≠ Mastery | FRM-MOM-* · FRM-MST-* | CAL-FND-007 · RUN-009 | Mastery Δ=0 under schedule | Momentum season reset ≠ Mastery wipe | Momentum copy |
| Popularity ≠ Trust | POL-TRU-001 · anti-gaming | RUN-013 reaction farming | — | Trust from integrity signals | Popularity ≠ Trust |
| Popularity ≠ Mastery | FRM-MST-* · red-team | RUN-013 | — | Mastery Evidence-only | Popularity ≠ Mastery |
| Completion ≠ Route-Proven | FRM-MST-003 · Learning RP standard | Cohort B RP 22.88% | Evidence-matched CFT | RP reverse on Evidence revoke | Route-Proven copy |
| One RP ≠ Horizon-Proven | Learning HP deferred · breadth separation | Architecture scenarios | — | No HP award from single RP | Horizon-Proven deferred |
| Founder status ≠ Prestige | FRM/POL-PRS human authority | Prestige panel rules | — | Panel conflict red-team PASS | Prestige requires distinction criteria |
| Merit Access ≠ Progression | Merit boundary · Access Plan | RUN-006 Merit arm | CFT Merit vs paid | Entitlement only; no score write | Merit is access, not Rank |
| Inactivity ≠ loss of historical learning | Lifetime XP · Evidence retention · A19 | Architecture + POL-COR | — | Season Momentum may reset; Evidence/XP retained | Inactivity copy |

---

## Pay-to-win regression lock

| Evidence | Result |
|----------|--------|
| RUN-006 pay-to-win equivalence | **all diffs = 0** |
| Red-team Merit farming / plan abuse | Covered in 20/20 PASS |

Permanent: payment and Merit Access must never write progression merit values.

## Explicit non-claims

Synthetic invariant PASS does **not** mean production-enforced, bias-free, or fully fair under real users.

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.PROGRESSION.1D §12 — invariant final review |
