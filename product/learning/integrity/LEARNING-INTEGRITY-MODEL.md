# Learning Integrity Model

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-INTG-001 |
| **Version** | 1.0.0 |
| **Status** | BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Related** | [AI-ASSISTANCE-POLICY.md](./AI-ASSISTANCE-POLICY.md) · [SAFE-EVIDENCE-HANDLING.md](../evidence/SAFE-EVIDENCE-HANDLING.md) · [EVIDENCE-REVIEW-MODEL.md](../evidence/EVIDENCE-REVIEW-MODEL.md) · [EVIDENCE-REVISION-AND-APPEAL.md](../evidence/EVIDENCE-REVISION-AND-APPEAL.md) · [REVIEWER-ROLE-MATRIX.md](../evidence/REVIEWER-ROLE-MATRIX.md) |
| **Scope classification** | CONTROLLED LAUNCH |
| **Supporting sources** | SRC-001 · SRC-010 · SRC-016 |
| **Expert review** | NOT RUN |
| **Pilot status** | NOT RUN |
| **Unresolved dependencies** | Detection tooling Spike; consequence matrices by severity; rehab program design detail |
| **Limitations** | Integrity architecture only — **no invasive surveillance**; no Product Code proctoring suite in 1C |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1C Learning Integrity Model |

## Purpose

Address integrity **threats** and define prevention, education, detection signals, human review, false-positive protection, appeals, proportional consequences, and rehabilitation (§23) without designing invasive surveillance.

```text
Do not design invasive surveillance.
Expert review: NOT RUN. Pilot: NOT RUN.
```

---

## Threats addressed (§23)

* Plagiarism.
* Copied repositories.
* Copied configurations.
* Fabricated logs.
* Falsified screenshots.
* Impersonation.
* Unauthorized collaboration.
* AI-generated work without disclosure.
* Shared assessment answers.
* Tampered timestamps.
* Recycled public artifacts.
* Malicious files.
* Sensitive-data submission.

---

## Prevention

* Clear Mission / Evidence AI and collaboration policies.
* Seed-bound labs and unique scenario constraints where feasible.
* Pre-submit prohibited-content warnings ([SAFE-EVIDENCE-HANDLING.md](../evidence/SAFE-EVIDENCE-HANDLING.md)).
* Authenticity signal requirements (seed ID, commit range, disclosure).
* Separated integrity vs quality review.

## Learner education

* Orientation Missions cover integrity expectations.
* Examples of allowed vs disallowed collaboration / AI use.
* How to redact and use synthetic data.
* How appeals work (good-faith protected).

## Detection signals (non-invasive)

Signals may include (conceptual):

* Metadata / seed mismatches.
* Near-duplicate submissions across learners.
* Impossible timestamps / history rewrites.
* Undeclared AI stylistic anomalies **as a review tip only**, not sole proof.
* Secret / malware scan hits on uploads.
* Peer / reviewer reports.

**Out of scope:** continuous device monitoring, keystroke biometrics mandates, webcam proctoring as launch default.

## Human review

* INTEGRITY_REVIEW is distinct from rubric quality review.
* Capability excellence does not clear integrity failure.
* Reviewers document reasoning; no silent VOID without record.

## False-positive protection

* Single weak automated signal ≠ automatic guilt.
* Learners may explain and supply verification.
* Appeal path available ([EVIDENCE-REVISION-AND-APPEAL.md](../evidence/EVIDENCE-REVISION-AND-APPEAL.md)).
* Prefer least-harm interim holds over irreversible punishment when uncertain.

## Appeals

* Appeal reviewer ≠ original reviewer when separation required.
* Outcomes recorded as APPEAL_RESOLVED.
* Retaliation for good-faith appeals prohibited.

## Proportional consequences

| Severity (sketch) | Example direction |
|-------------------|-------------------|
| Low / first disclosure miss | Education + revise + disclose |
| Material plagiarism / fabrication | VOID attempt; remediation; possible trust hold (thresholds PENDING PROGRESSION.1) |
| Malware / harmful upload | Quarantine; takedown; elevated review |
| Impersonation / systemic fraud | Stronger sanctions via Change Control |

Exact numeric Trust impacts → **GHV.PROGRESSION.1**.

## Rehabilitation and remediation

* Remediation Missions / integrity education paths after proportional response.
* Opportunity to rebuild authenticity with supervised resubmission.
* No permanent “badge of shame” UX as pedagogy.

## Explicit non-goals

* No invasive surveillance design.
* No employment blacklisting product feature.
* No AI detector as sole authority.
