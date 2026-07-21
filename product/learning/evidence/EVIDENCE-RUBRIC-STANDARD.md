# Evidence Rubric Standard

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-EVD-RUB-STD-001 |
| **Version** | 1.0.0 |
| **Status** | BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Related** | [EVIDENCE-BLUEPRINT-STANDARD.md](./EVIDENCE-BLUEPRINT-STANDARD.md) · [EVIDENCE-CLASSIFICATION.md](./EVIDENCE-CLASSIFICATION.md) · [EVIDENCE-REVIEW-MODEL.md](./EVIDENCE-REVIEW-MODEL.md) · [ROUTE-PROVEN-STANDARD.md](../proven/ROUTE-PROVEN-STANDARD.md) |
| **Scope classification** | CONTROLLED LAUNCH (ANALYZE rubrics: CONDITIONAL / RESERVE) |
| **Supporting sources** | SRC-001 · SRC-002 · SRC-010 |
| **Expert review** | NOT RUN |
| **Pilot status** | NOT RUN |
| **Unresolved dependencies** | Per-Route rubric files; expert calibration; GHV.PROGRESSION.1 aggregation of levels into Mastery |
| **Limitations** | Dimension levels describe the Evidence item only — not final Mastery; not XP; EXCEPTIONAL not required for Route-Proven |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1C Evidence Rubric Standard |

## Purpose

Define the **common rubric architecture** (ten dimensions and five qualitative levels) for Evidence review under GHV.LEARNING.1C.

```text
Levels describe the Evidence item — not final Mastery.
EXCEPTIONAL must not be required for normal Route-Proven eligibility.
Aggregation pending GHV.PROGRESSION.1.
Expert review: NOT RUN. Pilot: NOT RUN.
```

---

## Rubric dimensions (§17)

Use common dimensions **where relevant**. Not every Evidence item requires all ten.

| # | Dimension | Focus |
|---|-----------|--------|
| 1 | **Correctness** | Accurate facts, configs, and claims within scope |
| 2 | **Completeness** | Required elements present |
| 3 | **Practical Function** | Artifact works / applies in the bounded scenario |
| 4 | **Reasoning** | Decisions and explanations are coherent |
| 5 | **Documentation** | Clear, usable records for another practitioner |
| 6 | **Safety and Security** | Defensive posture; no unsafe / prohibited content |
| 7 | **Evidence Integrity** | Authenticity, disclosure, seed binding |
| 8 | **Reproducibility** | Another reviewer can follow how the result was reached |
| 9 | **Communication** | Audience-appropriate clarity (incl. Arabic-first where required) |
| 10 | **Contextual Judgment** | Proportional choices under constraints |

---

## Performance levels (§17)

Exact qualitative levels:

```text
NOT_DEMONSTRATED
DEVELOPING
MEETS_STANDARD
STRONG
EXCEPTIONAL
```

| Level | Meaning (Evidence item) |
|-------|-------------------------|
| **NOT_DEMONSTRATED** | Required signal absent or unrelated |
| **DEVELOPING** | Partial progress; material gaps remain |
| **MEETS_STANDARD** | Satisfies governed standard for this dimension |
| **STRONG** | Clearly exceeds MEETS_STANDARD without requiring rarity |
| **EXCEPTIONAL** | Rare outstanding quality — **not** a Route-Proven gate |

### Binding clarifications

* These levels describe the **Evidence item**, not final Mastery levels.
* Final aggregation remains pending **GHV.PROGRESSION.1**.
* **EXCEPTIONAL must not be required** for normal Route-Proven eligibility.
* Typical Proven-oriented bar: dimensions applicable to the item reach **MEETS_STANDARD** (or governed equivalent), with integrity clear — details in Route rubric blueprints.

---

## Rubric authoring rules

1. Keep rubrics **short enough** for reviewers to use.
2. Avoid dozens of nearly identical criteria.
3. Select a **subset** of the ten dimensions per Evidence class / anchor.
4. P0 / CXW / SEX rubric packs: status `RUBRIC BLUEPRINT — PENDING EXPERT REVIEW`.
5. ANALYZE: `RESERVE RUBRIC BLUEPRINT` / Scope CONDITIONAL.
6. No numeric weights that invent Mastery formulas in 1C.

## Explicit non-goals

* No forced 10/10 EXCEPTIONAL culture.
* No employment grading language.
* No Product Code auto-scorer as Mastery authority.
