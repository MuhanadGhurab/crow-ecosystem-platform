# RT-BLD-001 Expert Review Packet

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-REV-BLD-001 |
| **Version** | 1.0.0 |
| **Status** | READY FOR FUTURE REVIEW — REVIEW NOT RUN |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1D packet prep · EXP-BLD |
| **Last updated** | 2026-07-21 |
| **Construct** | RT-BLD-001 — Web Application Delivery |
| **Related** | [EXPERT-REVIEW-MASTER-PLAN.md](./EXPERT-REVIEW-MASTER-PLAN.md) · [ACCESSIBILITY-REVIEW-PACKET.md](./ACCESSIBILITY-REVIEW-PACKET.md) |
| **Expert review** | **NOT RUN** |
| **Pilot** | **NOT RUN** |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1D RT-BLD-001 Expert Review Packet |

## Overall status

```text
Status: READY FOR FUTURE REVIEW / REVIEW NOT RUN
Expert review: NOT RUN
Pilot: NOT RUN
No XP · No Mastery numbers
```

---

## 1. Review objective

Assess whether RT-BLD-001 delivery Missions, Evidence (including accessibility Evidence), Capstone, and tooling assumptions match accessible web / software delivery practice — without permanent single-framework lock — before PUBLISHED BUILD content or 1D inclusion.

---

## 2. Reviewer qualifications (generic role quals)

| Qual | Requirement |
|------|-------------|
| Experience | Delivery engineer / web practitioner familiar with git, accessible UI basics, tests, sandbox deploy |
| Depth | Can judge Evidence authenticity for repo artifacts and UI a11y checks |
| Pedagogy | Distinguishes learning projects from employment-level “senior engineer” claims |
| Pairing | Prefer coordination with EXP-A11Y for EVD a11y path |

**Roster:** not assigned. **Do not invent names.**

---

## 3. Documents to review (paths)

| Path | Why |
|------|-----|
| `product/learning/routes/architecture/RT-BLD-001-WEB-APPLICATION-DELIVERY.md` | Route architecture |
| `product/learning/missions/routes/RT-BLD-001-MISSION-BLUEPRINTS.md` | Mission pack (14) |
| `product/learning/capstones/RT-BLD-001-CAPSTONE-BLUEPRINT.md` | Capstone |
| `product/learning/evidence/rubrics/RT-BLD-001-EVIDENCE-RUBRICS.md` | Rubrics |
| `product/learning/evidence/ROUTE-EVIDENCE-MAP.md` | Evidence map |
| `product/learning/missions/bridges/BRG-PRT-BLD-01-APPSEC-BRIDGE.md` | Bridge non-duplication vs base BUILD |
| `product/learning/cross-wing/CXW-001-SECURE-APPLICATION-DELIVERY-ARCHITECTURE.md` | CXW boundary |
| `product/learning/architecture/EXPERT-REVIEW-REQUIREMENTS.md` | EXP-BLD / EXP-A11Y |

---

## 4. Review questions

1. Do Missions reflect bounded web delivery practice (git, UI, tests, sandbox deploy) without title inflation?
2. Is framework choice portable (no permanent single-framework lock)?
3. Is accessibility Evidence structural (not decorative checklists only)?
4. Capstone feasible in stated intensity / tooling?
5. Clear separation from CXW and AppSec Bridge scope?
6. Rubrics usable without Mastery/XP formulas?
7. Seed / authorship authenticity path coherent for repo Evidence?

---

## 5. Acceptance criteria

| # | Criterion |
|---|-----------|
| A1 | Capability-bounded objectives; no senior-title inflation |
| A2 | Tooling path sandbox / local-safe feasible |
| A3 | A11y Evidence path is structural and reviewable |
| A4 | Non-duplication vs CXW / Bridge held |
| A5 | Capstone and rubrics feasible without inventing scoring math |
| A6 | No critical safety defects in deploy / secrets guidance |

---

## 6. Critical risks

| Risk | Why critical |
|------|--------------|
| A11y Evidence decorative only | Blocks 1D if BUILD a11y claimed |
| Single-framework lock | Portability / COI |
| CXW collapsed into base BUILD testing | Scope failure |
| Public deploy of learner secrets | Safety |

---

## 7. Conflict of interest (COI) prohibitions

* Disclose framework / hosting vendor ties; must not require permanent single-framework lock.
* Disclose overlay-widget vendor interests (defer structural a11y preference to EXP-A11Y).
* Author-only self-PASS prohibited without independent reviewer.

---

## 8. Required Evidence (of the review itself)

* Question responses with severity ratings
* Framework-portability and a11y-path findings
* Rework list if REWORK
* COI disclosure
* Sign-off only after genuine review

---

## 9. Decision outcomes

| Outcome | Use when |
|---------|----------|
| **PASS** | A1–A6 met |
| **REWORK** | Material defects; re-review before PUBLISHED |
| **BLOCK** | Critical a11y, safety, or feasibility failure |

**Current decision:** — (NOT RUN)

---

## 10. Change process

1. Record outcome against this packet.
2. REWORK → remediate → delta re-review (coordinate EXP-A11Y if a11y-related).
3. BLOCK → Change Control; no PUBLISHED BLD until cleared.
4. PASS → eligibility for pilot / later publication — not auto-LOCK.

---

## 11. Sign-off structure (blank — NOT RUN)

| Role | Name | Affiliation | Date | Outcome | Signature |
|------|------|-------------|------|---------|-----------|
| EXP-BLD reviewer | — | — | — | — | — |
| EXP-A11Y (if paired) | — | — | — | — | — |
| Founder (RAVEN) | — | — | — | — | — |

```text
Sign-off status: NOT RUN — intentionally blank
Expert review: NOT RUN
```
