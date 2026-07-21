# Arabic Technical Review Packet

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-REV-AR-001 |
| **Version** | 1.0.0 |
| **Status** | READY FOR FUTURE REVIEW — REVIEW NOT RUN |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1D packet prep · EXP-AR |
| **Last updated** | 2026-07-21 |
| **Domain** | Arabic technical learning (cross-cutting) |
| **Related** | [EXPERT-REVIEW-MASTER-PLAN.md](./EXPERT-REVIEW-MASTER-PLAN.md) · [ARABIC-FIRST-LEARNING-FEASIBILITY.md](../research/ARABIC-FIRST-LEARNING-FEASIBILITY.md) |
| **Expert review** | **NOT RUN** |
| **Pilot** | **NOT RUN** |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1D Arabic Technical Review Packet |

## Overall status

```text
Status: READY FOR FUTURE REVIEW / REVIEW NOT RUN
Expert review: NOT RUN
Pilot: NOT RUN
Blocks PUBLISHED Arabic surfaces; blocks 1D if Arabic-first launch claimed without review
No XP · No Mastery numbers
```

---

## 1. Review objective

Assess Arabic-first technical learning readiness across launch surfaces: meaning parity with retained English technical terms, ID stability vs display names, glossary discipline, and localization maintainability — before PUBLISHED Arabic Missions / UI strings and before any 1D claim of Arabic-first launch readiness.

---

## 2. Reviewer qualifications (generic role quals)

| Qual | Requirement |
|------|-------------|
| Experience | Arabic technical content QA / localization for STEM or ICT learning |
| Bilingual judgment | Can verify critical meaning parity (not marketing translation only) |
| Terminology | Comfortable retaining English technical terms where pedagogically required |

**Roster:** not assigned. **Do not invent names.**

---

## 3. Documents to review (paths)

| Path | Why |
|------|-----|
| `product/learning/research/ARABIC-FIRST-LEARNING-FEASIBILITY.md` | Feasibility research |
| `product/learning/architecture/LEARNING-IDENTIFIER-STANDARD.md` | ID stability vs display names |
| `product/learning/content/CONTENT-PRODUCTION-HANDOFF.md` | Arabic content production needs |
| `product/learning/missions/MISSION-BLUEPRINT-REGISTRY.md` | Pack inventory for sampling |
| Sample Mission packs (P0): `missions/routes/RT-OPR-001-MISSION-BLUEPRINTS.md`, `RT-BLD-001-…`, `RT-PRT-001-…`, `RT-LED-001-…` | Horizon sampling |
| `missions/cross-wing/CXW-001-MISSION-BLUEPRINTS.md` · `missions/secure-extensions/SEX-001-MISSION-BLUEPRINTS.md` | Integrated constructs |
| `product/learning/architecture/EXPERT-REVIEW-REQUIREMENTS.md` | EXP-AR |

---

## 4. Review questions

1. Do blueprints preserve stable IDs while allowing Arabic display names?
2. Is English technical term retention explicit and consistent?
3. Any critical meaning loss risk in Arabic-first narrative fields?
4. Glossary / terminology process adequate for production handoff?
5. RTL / UI string risks noted for future production (even if UI not built)?
6. Sampling across Horizons sufficient to claim Arabic-first readiness?

---

## 5. Acceptance criteria

| # | Criterion |
|---|-----------|
| A1 | ID vs display-name discipline held |
| A2 | Critical meaning parity approach defined for production |
| A3 | English term retention rules clear |
| A4 | Sampling findings documented across P0 constructs |
| A5 | No claim of completed localization where only blueprints exist |
| A6 | Residual translation risks documented |

---

## 6. Critical risks

| Risk | Why critical |
|------|--------------|
| Claiming Arabic-first launch without review | 1D blocker |
| ID mutation for localization | Graph / traceability break |
| Agency lock-in / unmaintainable translation memory | COI / ops |

---

## 7. Conflict of interest (COI) prohibitions

* Disclose agency / vendor lock-in; prefer bilingual maintainability.
* Must not mandate a single TMS vendor for PASS.
* Author-only self-PASS prohibited.

---

## 8. Required Evidence (of the review itself)

* Sampling matrix (construct × findings)
* Terminology / ID discipline notes
* Severity-rated responses · COI disclosure
* Sign-off only after genuine review

---

## 9. Decision outcomes

| Outcome | Use when |
|---------|----------|
| **PASS** | Arabic-first launch claims allowable for reviewed scope |
| **REWORK** | Meaning / ID / glossary defects |
| **BLOCK** | Unreviewed Arabic-first claim attempted, or critical meaning failure |

**Current decision:** — (NOT RUN)

---

## 10. Change process

1. Sample → findings → outcome.
2. REWORK → update standards / blueprint language notes → re-sample.
3. BLOCK → no Arabic PUBLISHED surfaces; no Arabic-first 1D claim.
4. PASS → unlocks Arabic production path eligibility — not auto-LOCK.

---

## 11. Sign-off structure (blank — NOT RUN)

| Role | Name | Affiliation | Date | Outcome | Signature |
|------|------|-------------|------|---------|-----------|
| EXP-AR reviewer | — | — | — | — | — |
| Founder (RAVEN) | — | — | — | — | — |

```text
Sign-off status: NOT RUN — intentionally blank
Expert review: NOT RUN
```
