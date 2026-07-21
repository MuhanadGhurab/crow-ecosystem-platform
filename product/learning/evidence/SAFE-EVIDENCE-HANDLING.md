# Safe Evidence Handling

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-EVD-SAFE-001 |
| **Version** | 1.0.0 |
| **Status** | BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Related** | [EVIDENCE-BLUEPRINT-STANDARD.md](./EVIDENCE-BLUEPRINT-STANDARD.md) · [EVIDENCE-CLASSIFICATION.md](./EVIDENCE-CLASSIFICATION.md) · [LEARNING-INTEGRITY-MODEL.md](../integrity/LEARNING-INTEGRITY-MODEL.md) · [REVIEWER-ROLE-MATRIX.md](./REVIEWER-ROLE-MATRIX.md) |
| **Scope classification** | CONTROLLED LAUNCH |
| **Supporting sources** | SRC-006 · SRC-016 · SRC-017 (privacy / security posture; non-endorsement) |
| **Expert review** | NOT RUN |
| **Pilot status** | NOT RUN |
| **Unresolved dependencies** | Secret/malware scanner Spike; retention periods; PDPL implementing guidance currency |
| **Limitations** | Handling policy architecture — no scanning Product Code in 1C; no claim of perfect prevention |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1C Safe Evidence Handling |

## Purpose

Define **prohibitions**, **controls**, and **privacy classes** for Evidence artifacts so learners and reviewers do not handle unnecessary sensitive or dangerous material (§24).

```text
Prefer synthetic data. Expert review: NOT RUN. Pilot: NOT RUN.
```

---

## Prohibitions — Evidence must not contain unnecessary

* Real customer data.
* Production credentials.
* Secrets.
* Private keys.
* Access tokens.
* Personal identifiers (beyond minimal account-bound platform IDs managed by the system).
* Real incident-sensitive data.
* Employer-confidential information.
* Malware.
* Unsafe executable payloads.
* Copyrighted proprietary material (wholesale dumps).

---

## Required controls

| Control | Direction |
|---------|-----------|
| **Redaction expectations** | Learners redact secrets, PII, customer marks before submit; reviewers verify |
| **Synthetic-data preference** | Seeded labs and synthetic cases preferred over real org data |
| **Secret scanning** | Conceptual requirement before accept — implementation PENDING ARCHITECTURE / Spike |
| **Malware scanning** | Conceptual requirement for uploads — implementation PENDING |
| **File-type controls** | Allowlist formats per Evidence class; block risky executables |
| **Quarantine** | Suspicious uploads isolated from reviewers until cleared |
| **Reviewer safety** | No requirement to execute untrusted binaries; text/config first |
| **Takedown** | Admin may remove / revoke on discovery of prohibited content |
| **Retention** | Direction only — minimize; learner export vs purge PENDING policy freeze |
| **User warnings** | Clear pre-submit warnings about prohibited content and consequences |

---

## Evidence privacy classes (§24)

Exact list:

```text
PUBLIC_PORTFOLIO
GHURAVIA_PRIVATE
REVIEWER_RESTRICTED
SENSITIVE_RESTRICTED
PROHIBITED
```

| Class | Meaning |
|-------|---------|
| **PUBLIC_PORTFOLIO** | Eligible for learner-controlled public showcase after redaction checks |
| **GHURAVIA_PRIVATE** | Visible to learner within product; not public by default |
| **REVIEWER_RESTRICTED** | Visible to assigned reviewers / mentors under need-to-know |
| **SENSITIVE_RESTRICTED** | Heightened controls; limited roles; no public portfolio |
| **PROHIBITED** | Must not be stored as Evidence; quarantine / delete / reject |

### Mapping guidance

| Evidence tendency | Default privacy class |
|-------------------|----------------------|
| Sanitized config / runbook samples | GHURAVIA_PRIVATE → optional PUBLIC_PORTFOLIO after review |
| Security triage / incident analysis | REVIEWER_RESTRICTED or SENSITIVE_RESTRICTED |
| Team contribution notes | GHURAVIA_PRIVATE / REVIEWER_RESTRICTED |
| Capstone public subset | PUBLIC_PORTFOLIO only for approved excerpts |
| Secrets / malware / real customer dumps | PROHIBITED |

---

## Binding rules

1. Privacy class is mandatory on every Evidence Blueprint.
2. Public portfolio never overrides PROHIBITED / SENSITIVE_RESTRICTED.
3. Discovery of prohibited content triggers integrity path and possible VOID / REVOKED.
4. No invasive device surveillance — scanning is of **submitted artifacts** and declared metadata.

## Explicit non-goals

* No requirement to upload production tenant exports.
* No offensive payload labs as Evidence.
* No claim that warnings alone equal compliance.
