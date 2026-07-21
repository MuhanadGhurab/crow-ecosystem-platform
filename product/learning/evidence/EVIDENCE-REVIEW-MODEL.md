# Evidence Review Model

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-EVD-REV-001 |
| **Version** | 1.0.0 |
| **Status** | BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Related** | [REVIEWER-ROLE-MATRIX.md](./REVIEWER-ROLE-MATRIX.md) · [EVIDENCE-RUBRIC-STANDARD.md](./EVIDENCE-RUBRIC-STANDARD.md) · [EVIDENCE-REVISION-AND-APPEAL.md](./EVIDENCE-REVISION-AND-APPEAL.md) · [LEARNING-INTEGRITY-MODEL.md](../integrity/LEARNING-INTEGRITY-MODEL.md) · [ROUTE-PROVEN-STANDARD.md](../proven/ROUTE-PROVEN-STANDARD.md) |
| **Scope classification** | CONTROLLED LAUNCH |
| **Supporting sources** | SRC-001 · SRC-010 |
| **Expert review** | NOT RUN |
| **Pilot status** | NOT RUN |
| **Unresolved dependencies** | Reviewer / expert staffing; dual-review trigger policy detail; automation Spike |
| **Limitations** | Method definitions only — no runtime review workflow Product Code; no Mastery awarding engine |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1C Evidence Review Model |

## Purpose

Define governed **Evidence review methods** and binding rules for what each method may and may not conclude (§19).

```text
Expert review: NOT RUN. Pilot: NOT RUN.
Automated validation may not independently award sensitive Mastery.
```

---

## Review methods (§19)

```text
AUTOMATED_VALIDATION
STRUCTURED_SELF_CHECK
PEER_FEEDBACK
QUALIFIED_REVIEWER
EXPERT_REVIEW
DUAL_REVIEW
INTEGRITY_REVIEW
```

---

## AUTOMATED_VALIDATION

**May verify:**

* File presence.
* Formatting.
* Test execution signals.
* Reproducibility signals.
* Metadata completeness.
* Safe static checks.

**Must not:**

* Independently award sensitive Mastery.
* Alone grant Route-Proven.
* Override integrity findings.

---

## STRUCTURED_SELF_CHECK

* Helps preparation and gap spotting.
* **Is not** final approval.
* May be required before submit; does not replace qualified review where mandated.

---

## PEER_FEEDBACK

* May provide developmental comments.
* **Does not** independently grant Route-Proven.
* Must follow conflict and privacy rules ([REVIEWER-ROLE-MATRIX.md](./REVIEWER-ROLE-MATRIX.md)).

---

## QUALIFIED_REVIEWER

* Reviews Evidence against an **approved rubric**.
* Primary path for most practical / Capstone Evidence at launch architecture level.
* Records STANDARD_MET / gaps with actionable feedback.

---

## EXPERT_REVIEW

* Required for **specialized or high-impact** Evidence.
* Staffing remains an unresolved dependency (NOT RUN).
* Does not imply content is PUBLISHED.

---

## DUAL_REVIEW

* Required where **conflict**, **Prestige implications**, or **sensitive decisions** justify it.
* Two independent capability reviews (or governed separation of roles).
* Disagreement escalates per role matrix — no silent average without record.

---

## INTEGRITY_REVIEW

* **Separate** from capability-quality review.
* Addresses authenticity, disclosure, collusion, tampering, prohibited content.
* May VOID or block approval regardless of rubric quality scores.

---

## Composition rules

| Outcome sought | Minimum method set (typical) |
|----------------|------------------------------|
| Formative practice | STRUCTURED_SELF_CHECK (± PEER_FEEDBACK) |
| Required Stage Evidence | AUTOMATED_VALIDATION (where applicable) + QUALIFIED_REVIEWER |
| Capstone / high-impact | QUALIFIED_REVIEWER + EXPERT_REVIEW when required + INTEGRITY_REVIEW if flagged |
| Prestige / conflict-sensitive | DUAL_REVIEW + INTEGRITY_REVIEW as needed |
| Proven eligibility | Human approval path clear; integrity clear; no peer-only Proven |

## Explicit non-goals

* No invasive surveillance tooling design.
* No peer-voted Mastery.
* No LOCKED “expert approved catalogue” claim while expert review is NOT RUN.
