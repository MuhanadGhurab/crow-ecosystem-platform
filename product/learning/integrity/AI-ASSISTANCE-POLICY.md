# AI Assistance Policy

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-AI-001 |
| **Version** | 1.0.0 |
| **Status** | BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Related** | [LEARNING-INTEGRITY-MODEL.md](./LEARNING-INTEGRITY-MODEL.md) · [MISSION-BLUEPRINT-STANDARD.md](../missions/MISSION-BLUEPRINT-STANDARD.md) · [EVIDENCE-BLUEPRINT-STANDARD.md](../evidence/EVIDENCE-BLUEPRINT-STANDARD.md) · [ASSESSMENT-ANCHOR-STANDARD.md](../assessments/ASSESSMENT-ANCHOR-STANDARD.md) |
| **Scope classification** | CONTROLLED LAUNCH |
| **Supporting sources** | SRC-001 · SRC-010 |
| **Expert review** | NOT RUN |
| **Pilot status** | NOT RUN |
| **Unresolved dependencies** | Disclosure UX; detection tooling Spike; calibration of REQUIRED_TO_BE_DEMONSTRATED Missions |
| **Limitations** | Policy categories only — no AI Product Code; no requirement to disclose private proprietary prompts unless necessary |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1C AI Assistance Policy |

## Purpose

Define **AI usage categories** and **general rules** for Missions, assessments, and Evidence (§22). Every Mission and Evidence Blueprint must declare an applicable category.

```text
Expert review: NOT RUN. Pilot: NOT RUN.
AI must not silently replace learner reasoning, practical execution, or reviewer authority.
```

---

## AI usage categories (§22)

Exact list:

```text
NOT_PERMITTED
PERMITTED_FOR_LEARNING
PERMITTED_WITH_DISCLOSURE
PERMITTED_FOR_EDITING_ONLY
PERMITTED_WITH_OUTPUT_VERIFICATION
REQUIRED_TO_BE_DEMONSTRATED
```

| Category | Meaning |
|----------|---------|
| **NOT_PERMITTED** | AI tools must not be used for the assessed work product |
| **PERMITTED_FOR_LEARNING** | AI may help study / explain; must not produce the submitted assessed artifact |
| **PERMITTED_WITH_DISCLOSURE** | AI may assist production if disclosed as required |
| **PERMITTED_FOR_EDITING_ONLY** | AI may improve language / formatting of learner-authored substance |
| **PERMITTED_WITH_OUTPUT_VERIFICATION** | AI output allowed only if learner verifies and can defend results |
| **REQUIRED_TO_BE_DEMONSTRATED** | Mission requires showing competent AI use under disclosure and verification |

---

## General rules (§22)

### AI may support

* Brainstorming.
* Explanation.
* Language improvement.
* Debugging assistance.
* Alternative examples.
* Review preparation.

### AI must not silently replace

* Learner reasoning.
* Practical execution.
* Evidence explanation.
* Security judgment.
* Risk acceptance.
* Final assessment.
* Reviewer authority.

### Disclosure (when required)

Where AI assistance is used, the learner may be required to state:

* Tool category.
* Purpose.
* Which portions were assisted.
* How output was verified.
* What decisions remained the learner’s own.

Do **not** require disclosure of private proprietary prompts unless necessary for integrity review.

---

## Binding rules

1. Every Mission Blueprint and Evidence Blueprint declares **one** applicable AI category (plus notes).
2. Undisclosed AI where disclosure is required → integrity path.
3. NOT_PERMITTED assessments remain rare and justified (e.g. specific integrity-sensitive demos).
4. REQUIRED_TO_BE_DEMONSTRATED is about **competent verified use**, not about outsourcing judgment.
5. Reviewers must not use AI to fabricate approval rationale without human accountability.

## Explicit non-goals

* No ban on all AI learning support.
* No XP for “AI prompts written.”
* No claim that disclosure equals correctness.
