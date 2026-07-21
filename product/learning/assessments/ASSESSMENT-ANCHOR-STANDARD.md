# Assessment Anchor Standard

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-ASM-STD-001 |
| **Version** | 1.0.0 |
| **Status** | BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Related** | [MISSION-BLUEPRINT-STANDARD.md](../missions/MISSION-BLUEPRINT-STANDARD.md) · [EVIDENCE-BLUEPRINT-STANDARD.md](../evidence/EVIDENCE-BLUEPRINT-STANDARD.md) · [EVIDENCE-REVIEW-MODEL.md](../evidence/EVIDENCE-REVIEW-MODEL.md) · [ROUTE-PROVEN-STANDARD.md](../proven/ROUTE-PROVEN-STANDARD.md) · [AI-ASSISTANCE-POLICY.md](../integrity/AI-ASSISTANCE-POLICY.md) |
| **Scope classification** | CONTROLLED LAUNCH (RT-ANL-001 assessment anchors: CONDITIONAL) |
| **Supporting sources** | SRC-001 · SRC-002 · SRC-010 |
| **Expert review** | NOT RUN |
| **Pilot status** | NOT RUN |
| **Unresolved dependencies** | Numeric pass thresholds → GHV.PROGRESSION.1; reviewer staffing; pilot of ASM anchors |
| **Limitations** | Qualitative pass-state descriptions only — no numeric passing values; no “job ready” / professional certification language; no Product Code assessment engine |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1C Assessment Anchor Standard |

## Purpose

Define required fields, allowed **assessment forms**, and **result states** for Stage assessment anchors (`*-ASM-01` pattern) that feed Route-Proven eligibility without inventing Mastery math.

```text
No numeric passing values in this Gate.
No employment-style language (“job ready”, “professionally certified”).
Expert review: NOT RUN. Pilot: NOT RUN.
```

---

## Required assessment-anchor fields (§13)

| Field | Requirement |
|-------|-------------|
| **Assessment ID** | `<STAGE-ID>-ASM-01` (or governed extension) |
| **Related Stage** | Canonical Stage ID |
| **Capabilities assessed** | Observable capabilities (non-employment) |
| **Assessment purpose** | Formative checkpoint · Stage gate · Capstone feeder — stated explicitly |
| **Assessment form** | From allowed forms below |
| **Evidence used** | Linked artifacts / EVD contributions |
| **Allowed resources** | Notes, docs, tooling, references permitted |
| **Collaboration rules** | Solo / peer discussion / Team (with contribution rules) |
| **AI-assistance rules** | Category from AI Assistance Policy |
| **Integrity risks** | Known threats for this form |
| **Pass-state description** | Qualitative STANDARD_MET criteria — **no numeric cut-score** |
| **Revision or retry conditions** | When REVISION_REQUIRED / retry allowed |
| **Remediation link** | `RMD-*` or remediation Mission |
| **Reviewer type** | From Reviewer Role Matrix / Review Model |
| **Audit requirement** | What must be retained for audit |
| **Accessibility adjustments** | Allowed accommodations |
| **Unresolved numeric threshold dependency** | Explicit pointer to GHV.PROGRESSION.1 where thresholds remain open |

---

## Assessment forms (§13)

May include:

* Scenario response.
* Practical configuration.
* Code or automation artifact.
* Troubleshooting investigation.
* Analytical brief.
* Architecture decision.
* Risk assessment.
* Operational demonstration.
* Documentation package.
* Oral or recorded explanation **where accessible alternatives exist**.

**Avoid** overreliance on multiple-choice quizzes.

---

## Assessment result states (§14)

Exact governed list:

```text
NOT_STARTED
IN_PROGRESS
SUBMITTED
AUTOMATED_CHECK_PENDING
HUMAN_REVIEW_PENDING
REVISION_REQUIRED
STANDARD_MET
STANDARD_NOT_YET_MET
INTEGRITY_REVIEW
VOIDED
```

| State | Meaning |
|-------|---------|
| **NOT_STARTED** | Learner has not opened the assessment |
| **IN_PROGRESS** | Work underway; not submitted |
| **SUBMITTED** | Learner submitted; routing to checks |
| **AUTOMATED_CHECK_PENDING** | Machine checks queued / running |
| **HUMAN_REVIEW_PENDING** | Awaiting qualified / expert / dual review |
| **REVISION_REQUIRED** | Feedback issued; revise affected parts |
| **STANDARD_MET** | Qualitative standard satisfied for this anchor |
| **STANDARD_NOT_YET_MET** | Capability gap remains after review |
| **INTEGRITY_REVIEW** | Authenticity / policy review open |
| **VOIDED** | Attempt voided (integrity, admin, or policy) |

### Language prohibitions

Do **not** use:

* “Job ready”
* “Professionally certified”
* “Employable”
* Equivalent employment guarantees

Do **not** define numeric passing values during GHV.LEARNING.1C.

---

## Relationship to Route-Proven

Assessment anchors contribute to Route-Proven **qualitative** condition “all mandatory assessments meet their governed standard” ([ROUTE-PROVEN-STANDARD.md](../proven/ROUTE-PROVEN-STANDARD.md)). Completion of Stages alone is insufficient.

Automated checks may support review; they **must not** independently award sensitive Mastery (pending PROGRESSION.1).

## Explicit non-goals

* No runtime grader Product Code.
* No XP for quiz streaks.
* No accreditation claims.
