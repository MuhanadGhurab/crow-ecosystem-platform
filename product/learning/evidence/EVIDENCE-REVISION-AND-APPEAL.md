# Evidence Revision and Appeal

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-EVD-REVAPP-001 |
| **Version** | 1.0.0 |
| **Status** | BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Related** | [EVIDENCE-REVIEW-MODEL.md](./EVIDENCE-REVIEW-MODEL.md) · [REVIEWER-ROLE-MATRIX.md](./REVIEWER-ROLE-MATRIX.md) · [EVIDENCE-BLUEPRINT-STANDARD.md](./EVIDENCE-BLUEPRINT-STANDARD.md) · [LEARNING-INTEGRITY-MODEL.md](../integrity/LEARNING-INTEGRITY-MODEL.md) · [REMEDIATION-ARCHITECTURE.md](../architecture/REMEDIATION-ARCHITECTURE.md) |
| **Scope classification** | CONTROLLED LAUNCH |
| **Supporting sources** | SRC-001 · SRC-010 |
| **Expert review** | NOT RUN |
| **Pilot status** | NOT RUN |
| **Unresolved dependencies** | Max retry counts per Evidence class; appeal SLA; PROGRESSION.1 interaction with revocation |
| **Limitations** | State machine architecture only — no workflow Product Code; no infinite retries |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1C Evidence Revision and Appeal |

## Purpose

Define Evidence **lifecycle states** and **revision / appeal rules** (§21).

```text
Expert review: NOT RUN. Pilot: NOT RUN.
Reviewers cannot silently alter learner artifacts.
```

---

## States (§21)

Exact governed list:

```text
SUBMITTED
CHECKING
UNDER_REVIEW
REVISION_REQUESTED
RESUBMITTED
APPROVED
NOT_APPROVED
INTEGRITY_REVIEW
REVOKED
APPEALED
APPEAL_RESOLVED
```

| State | Meaning |
|-------|---------|
| **SUBMITTED** | Learner submitted Evidence pack |
| **CHECKING** | Automated / intake checks running |
| **UNDER_REVIEW** | Human capability review in progress |
| **REVISION_REQUESTED** | Feedback issued; learner must revise |
| **RESUBMITTED** | Revised pack returned for review |
| **APPROVED** | Meets governed standard; integrity clear |
| **NOT_APPROVED** | Standard not met after governed attempts / review |
| **INTEGRITY_REVIEW** | Authenticity / policy review open |
| **REVOKED** | Prior approval withdrawn with documented reason |
| **APPEALED** | Appeal opened |
| **APPEAL_RESOLVED** | Appeal closed with recorded outcome |

---

## Rules (§21)

1. **Feedback must identify the gap** — actionable, dimension-linked where rubrics apply.
2. **Valid completed components remain preserved** — do not force full rewrite when only a part fails.
3. **Revise only affected parts** where possible.
4. **Retries must not become infinite ungoverned attempts** — caps and remediation triggers are required (exact numeric caps PENDING policy freeze / pilot).
5. **Repeated failure may trigger remediation** (`RMD-*` / remediation Missions).
6. **Reviewers cannot silently alter learner artifacts** — edits by staff require disclosure and audit.
7. **Appeal reviewers must not be the original reviewer** when separation is required.
8. **Evidence revocation requires documented reason and audit**.

---

## Flow sketch (non-runtime)

```text
SUBMITTED → CHECKING → UNDER_REVIEW
         ↘ INTEGRITY_REVIEW (if flagged)

UNDER_REVIEW → APPROVED
             → REVISION_REQUESTED → RESUBMITTED → UNDER_REVIEW
             → NOT_APPROVED
             → INTEGRITY_REVIEW

APPROVED → REVOKED (documented) → remediation / resubmit path

NOT_APPROVED / REVOKED / process dispute → APPEALED → APPEAL_RESOLVED
```

## Interaction with Route-Proven

Revocation or integrity failure may suspend Route-Proven eligibility pending re-evaluation ([ROUTE-PROVEN-STANDARD.md](../proven/ROUTE-PROVEN-STANDARD.md)).

## Explicit non-goals

* No silent admin edits.
* No subscription-paid APPROVED status.
* No “job ready” appeal outcomes.
