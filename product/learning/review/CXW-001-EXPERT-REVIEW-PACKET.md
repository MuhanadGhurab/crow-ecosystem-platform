# CXW-001 Expert Review Packet

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-REV-CXW-001 |
| **Version** | 1.0.0 |
| **Status** | READY FOR FUTURE REVIEW — REVIEW NOT RUN |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1D packet prep · EXP-CXW |
| **Last updated** | 2026-07-21 |
| **Construct** | CXW-001 — Secure Application Delivery (+ Bridge BRG-PRT-BLD-01) |
| **Related** | [EXPERT-REVIEW-MASTER-PLAN.md](./EXPERT-REVIEW-MASTER-PLAN.md) · Bridge packet scope below |
| **Expert review** | **NOT RUN** |
| **Pilot** | **NOT RUN** |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1D CXW-001 Expert Review Packet |

## Overall status

```text
Status: READY FOR FUTURE REVIEW / REVIEW NOT RUN
Expert review: NOT RUN
Pilot: NOT RUN
Includes Bridge: BRG-PRT-BLD-01
No XP · No Mastery numbers
```

---

## 1. Review objective

Assess whether CXW-001 integrated secure-application-delivery Missions, Integration Mission, Capstone, Evidence, and **AppSec Bridge BRG-PRT-BLD-01** form a coherent cross-wing path that does **not** collapse into base BUILD testing, full PROTECT Route, or SEX — before PUBLISHED CXW / Bridge content or 1D CXW inclusion.

---

## 2. Reviewer qualifications (generic role quals)

| Qual | Requirement |
|------|-------------|
| Experience | AppSec-aware delivery practitioner **or** paired AppSec + delivery reviewers |
| Integration judgment | Can verify semantic coherence across BUILD + PROTECT + LED release-risk contributions |
| Safety | Defensive AppSec only; rejects offensive exploit labs as CXW core |

**Roster:** not assigned. **Do not invent names.** Prefer paired reviewers if one person lacks both halves.

---

## 3. Documents to review (paths)

| Path | Why |
|------|-----|
| `product/learning/cross-wing/CXW-001-SECURE-APPLICATION-DELIVERY-ARCHITECTURE.md` | CXW architecture |
| `product/learning/cross-wing/LAUNCH-CROSS-WING-STUDY.md` | Launch study context |
| `product/learning/missions/cross-wing/CXW-001-MISSION-BLUEPRINTS.md` | CXW Missions (10, incl. INT-01) |
| `product/learning/missions/bridges/BRG-PRT-BLD-01-APPSEC-BRIDGE.md` | **Bridge BRG-PRT-BLD-01** (4 Missions) |
| `product/learning/capstones/CXW-001-CAPSTONE-BLUEPRINT.md` | Capstone |
| `product/learning/evidence/rubrics/CXW-001-EVIDENCE-RUBRICS.md` | Rubrics |
| `product/learning/architecture/CROSS-WING-VS-SECURE-EXTENSION.md` | CXW vs SEX |
| `product/learning/routes/architecture/RT-BLD-001-WEB-APPLICATION-DELIVERY.md` | Source Route BLD |
| `product/learning/routes/architecture/RT-PRT-001-DEFENSIVE-SECURITY-OPERATIONS.md` | Source Route PRT |
| `product/learning/architecture/EXPERT-REVIEW-REQUIREMENTS.md` | EXP-CXW |

### Bridge-specific scope (BRG-PRT-BLD-01)

Review must explicitly answer: Does the Bridge teach AppSec-aware delivery practices that **feed** CXW without duplicating full PRT SOC path or collapsing into base BLD unit tests alone?

---

## 4. Review questions

1. Is CXW an integrated outcome (not a third full Route clone)?
2. Does INT-01 Integration Mission remain distinct and necessary?
3. Bridge BRG-PRT-BLD-01: coherent feed into CXW; non-duplication vs PRT/BLD?
4. Evidence EVD path reviewable and seed-bound?
5. Capstone integrates delivery + security concerns without offensive labs?
6. Clear separation from SEX (secure cloud ops extension)?
7. LED release-risk contribution bounded?
8. Rubrics usable without Mastery/XP math?

---

## 5. Acceptance criteria

| # | Criterion |
|---|-----------|
| A1 | Semantic coherence of CXW integrated outcome |
| A2 | Bridge BRG-PRT-BLD-01 non-duplicating and CXW-feeding |
| A3 | INT-01 distinct; Capstone integration feasible |
| A4 | Defensive-only; no offensive / live-target drift |
| A5 | CXW ≠ SEX; CXW ≠ base BLD testing alone |
| A6 | Evidence / rubrics integrity-aligned without scoring math invention |

---

## 6. Critical risks

| Risk | Why critical |
|------|--------------|
| Collapse into SEX or base BUILD | Scope BLOCK for 1D CXW |
| Bridge duplicates full PRT | Wasted / confusing path |
| Offensive AppSec labs | Hard safety BLOCK |
| Integration Evidence fails | Blocks PUBLISHED CXW |

---

## 7. Conflict of interest (COI) prohibitions

* Must not collapse CXW into SEX or into base BUILD testing alone for commercial simplicity.
* Disclose AppSec-tool vendor ties; no mandatory single-scanner lock.
* Paired reviewers: disclose if both employed by same vendor sales org.
* Author-only self-PASS prohibited.

---

## 8. Required Evidence (of the review itself)

* Integration / Bridge coherence answers
* CXW-vs-SEX and CXW-vs-BLD/PRT boundary notes
* Unsafe-content scan for Bridge + CXW
* Severity-rated responses · COI disclosure
* Sign-off only after genuine review

---

## 9. Decision outcomes

| Outcome | Use when |
|---------|----------|
| **PASS** | A1–A6 met for CXW **and** Bridge |
| **REWORK** | Material integration / Bridge defects |
| **BLOCK** | Safety failure or irreducible scope collapse |

**Current decision:** — (NOT RUN)

---

## 10. Change process

1. Record single packet outcome covering CXW + Bridge (or note split findings).
2. REWORK → remediate architecture/Missions → re-review integration deltas.
3. BLOCK → Change Control; no PUBLISHED CXW/Bridge; blocks 1D CXW inclusion.
4. PASS → pilot eligibility — not auto-LOCK.

---

## 11. Sign-off structure (blank — NOT RUN)

| Role | Name | Affiliation | Date | Outcome | Signature |
|------|------|-------------|------|---------|-----------|
| EXP-CXW reviewer (delivery) | — | — | — | — | — |
| EXP-CXW reviewer (AppSec) | — | — | — | — | — |
| Bridge-focused reviewer (if separate) | — | — | — | — | — |
| Founder (RAVEN) | — | — | — | — | — |

```text
Sign-off status: NOT RUN — intentionally blank
Expert review: NOT RUN
Bridge BRG-PRT-BLD-01 included in scope — also NOT RUN
```
