# SEX-001 — Evidence Rubrics

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-RUB-SEX-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE BLUEPRINT / BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Related** | [SEX-001 Mission blueprints](../../missions/secure-extensions/SEX-001-MISSION-BLUEPRINTS.md) · [SEX-001 Capstone](../../capstones/SEX-001-CAPSTONE-BLUEPRINT.md) · [EVIDENCE-ANCHOR-REGISTRY.md](../EVIDENCE-ANCHOR-REGISTRY.md) · [SEX-001 architecture](../../secure-extensions/SEX-001-SECURE-CLOUD-OPERATIONS-ARCHITECTURE.md) · [CXW rubrics](./CXW-001-EVIDENCE-RUBRICS.md) |
| **Limitations** | Qualitative rubrics — no XP; numeric cut scores → PROGRESSION.1; not LOCKED; not full PROTECT Mastery rubric |
| **Unresolved** | Vendor-specific checklist pins; expert calibration; 1D lock |
| **Change history** | 1.0.0 (2026-07-21) — LEARNING.1C SEX Evidence rubrics |
| **Expert review** | **NOT RUN** |
| **Pilot** | **NOT RUN** |

```text
Rubric focus: applied secure-ops controls on RT-OPR-001 host.
Distinct from CXW delivery-integration rubrics.
No XP. Never LOCKED in this Gate.
```

---

## Rubric use

Apply to **SEX-001-EVD-01…03** and **SEX-001-CAP-01**. Qualitative bands:

| Band | Meaning |
|------|---------|
| **Does not meet** | Tip-sheet only, unsafe, or production claims |
| **Needs revision** | Partial applied control; remediation clear |
| **Meets** | Applied before/after proof; redacted; host-tied |
| **Exceeds (optional note)** | Clarity of rationale — not a Crest/XP award |

---

## SEX-001-EVD-01 — Least-privilege Evidence

| Criterion | Meets when |
|-----------|------------|
| Host tie | Workload/lab identity is on OPR-class host sample |
| Privilege reduction | Before/after shows tightened standing access |
| Rationale | Least-privilege reasoning is specific, not slogans |
| IAM hygiene | Unnecessary permissions removed or justified |
| Integrity | Lab tenant seed; redacted identifiers; no production claims |
| Safety | Isolated lab only |

---

## SEX-001-EVD-02 — Secrets & hardening Evidence

| Criterion | Meets when |
|-----------|------------|
| Secrets handling | Attestation shows store/rotate/redact pattern |
| No secret leakage | Evidence pack contains **no** real secrets |
| Hardening diff | Config/exposure before/after is substantive |
| Applied controls | Not a copied CIS dump without application |
| Integrity | Seed-bound; AI disclosure if used |
| Distinct from CXW | Ops/infra harden — not app feature Bridge checklist alone |

---

## SEX-001-EVD-03 — Logging, resilience & runbook

| Criterion | Meets when |
|-----------|------------|
| Monitoring | Security-relevant log/audit note present and redacted |
| Backup / resilience | Backup protection and/or recover note for seeded fault |
| Secure runbook | Runbook excerpt updated for the host path |
| Escalation | Escalation note for seeded incident/misconfig is clear |
| Change hygiene | Secure change awareness present (SHC-012 reinforce) |
| Integrity | Unique misconfig/fault seed; lab-marked |

---

## Extension Capstone eligibility (not full PROTECT Mastery)

| Check | Rule |
|-------|------|
| Stages | SEX STG-01…04 complete |
| Evidence | EVD-01…03 accepted |
| Capstone pack | Meets Harden-the-Ops-Path shape |
| Awards | Extension Capstone completion path only |
| **Does not award** | Full RT-PRT-001 Mastery · CXW completion · XP · professional title · Crest (awarding deferred) |

---

## Distinguisher vs CXW rubrics

| If Evidence shows… | Route to |
|--------------------|----------|
| App feature threat plan + seeded **app** finding + release go/no-go | **CXW** rubrics |
| IAM/secrets/config diffs + ops logs/runbooks on **cloud host** | **SEX** rubrics |
| Both pasted without host clarity | Reject / split — do not double-count identical mandatory anchors |

---

## Explicit non-claims

- No XP weights · No Product Codes · No LOCKED  
- SEX Evidence ≠ PROTECT Capstone · ≠ CXW Integration  
- Expert review **NOT RUN** · Pilot **NOT RUN**  
