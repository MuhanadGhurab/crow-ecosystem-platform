# SEX-001 Capstone Blueprint — Harden the Ops Path

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-CAP-SEX-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE BLUEPRINT / BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Capstone ID** | **SEX-001-CAP-01** |
| **Working title** | Harden the Ops Path |
| **Concept link** | CAP-SEX-001 (1A) |
| **Extends** | **RT-OPR-001** (host) |
| **Related** | [CAPSTONE-BLUEPRINT-STANDARD.md](./CAPSTONE-BLUEPRINT-STANDARD.md) · [SEX-001 Mission blueprints](../missions/secure-extensions/SEX-001-MISSION-BLUEPRINTS.md) · [SEX-001 rubrics](../evidence/rubrics/SEX-001-EVIDENCE-RUBRICS.md) · [SEX-001 architecture](../secure-extensions/SEX-001-SECURE-CLOUD-OPERATIONS-ARCHITECTURE.md) · [CXW-001 Capstone](./CXW-001-CAPSTONE-BLUEPRINT.md) · [RT-OPR-001](../routes/architecture/RT-OPR-001-CLOUD-SYSTEMS-OPERATIONS.md) |
| **Limitations** | Blueprint — no full CMS scripts; no XP; Crest awarding deferred; not LOCKED; **not** full PROTECT Capstone |
| **Unresolved** | Host Stage gate precision; Trust interaction (PROGRESSION.1); expert review; pilot; 1D lock |
| **Change history** | 1.0.0 (2026-07-21) — LEARNING.1C SEX Capstone blueprint |
| **Expert review** | **NOT RUN** |
| **Pilot** | **NOT RUN** |

```text
Capstone: SEX-001-CAP-01 — harden cloud ops environment extending OPR
Integrity test: Gate §37 (below)
Distinct from CXW-001 Capstone.
No XP. Never LOCKED in this Gate.
```

---

## Problem

An operable cloud sample is **functional but over-privileged and under-logged**. The learner hardens the ops path: least privilege, secrets/config exposure, monitoring, backup/resilience awareness, and secure runbook/escalation — attached to **RT-OPR-001**, not as a standalone PROTECT career finale.

---

## Learner role (scenario only)

Cloud operator applying **secure configuration** — not SOC employment title, not penetration tester, not Cross-Wing delivery lead.

---

## Eligibility

| Requirement | Rule |
|-------------|------|
| Host | RT-OPR-001 readiness per SEX entry policy |
| Stages | SEX-001-STG-01…04 complete |
| Evidence | **SEX-001-EVD-01…03** accepted |
| Unlock | **ULK-SEX-001** path satisfied |
| PROTECT | **Not** required |

**Extension eligibility:** Capstone completion supports Extension outcome / future marker path — **does not** grant full PROTECT Mastery.

---

## Output shape (harden cloud ops env extending OPR)

| Artifact | Description |
|----------|-------------|
| Least-privilege notes | IAM/role before-after (redacted) + rationale |
| Secrets / hardening diffs | Secrets attestation + config/exposure harden proof |
| Logging / backup proof | Security-relevant monitoring + backup/resilience note |
| Secure runbook excerpt | Updated ops runbook for hardened path |
| Misconfig / escalation note | Seeded fault or misconfig escalation practice |

---

## Evidence & rubrics

| Anchor | Role in Capstone |
|--------|------------------|
| SEX-001-EVD-01 | Privilege reduction quality |
| SEX-001-EVD-02 | Secrets & hardening application |
| SEX-001-EVD-03 | Monitoring, resilience, runbook/escalation |

Rubrics: [SEX-001-EVIDENCE-RUBRICS.md](../evidence/rubrics/SEX-001-EVIDENCE-RUBRICS.md).

---

## Integrity test — Gate §37

```text
GHV.LEARNING.1C Integrity Test §37 — SEX-001 Capstone
Result in this Gate: DEFINED IN BLUEPRINT — EXPERT REVIEW NOT RUN — PILOT NOT RUN
```

| # | §37 check | Pass | Fail |
|---|-----------|------|------|
| **37.1** | Host binding | Pack is clearly on OPR-class cloud/ops lab sample | Free-floating “security course” artifacts with no host |
| **37.2** | Applied harden | Before/after privilege and/or config proof is substantive | Tip-sheet or unread CIS paste |
| **37.3** | Secrets integrity | No real secrets in Evidence; handling attestation present | Secret material in pack |
| **37.4** | Observability / resilience | Log/audit and backup or recover note tied to seed | Empty monitoring claims |
| **37.5** | Runbook / escalation | Secure runbook + escalation note for seeded event | Generic runbook unrelated to host |
| **37.6** | Extension boundary | Does **not** claim full PROTECT Mastery or CXW Integration | Marketed as PROTECT complete or CXW Capstone |
| **37.7** | Distinct from CXW (§36) | Problem shape is ops harden — not app release integration | App feature + release go/no-go submitted as SEX |
| **37.8** | Authorship & safety | Original; AI disclosed; lab-only; no unauthorized tenant scanning | Production claims / offensive steps |

**§37 aggregate rule:** Capstone **cannot** be marked complete if any of 37.1–37.8 fails. Remediation: revise Extension pack or governed new misconfig seed — preserve valid host Route Evidence.

---

## Review

| Field | Content |
|-------|---------|
| **Pattern** | Rubric on privilege reduction, applied hardening, observability, escalation clarity — not penetration skill |
| **Marker / Crest** | Awarding **deferred** |
| **Does not award** | Full PROTECT · CXW completion · XP · professional title |

---

## Privacy / safety / tooling

| Area | Posture |
|------|---------|
| **Privacy / safety** | Sandbox only; secrets never in Evidence; no unauthorized scanning |
| **Tooling** | CLOUD-SANDBOX prefer reuse of OPR sandbox; LOCAL-SAFE fallback |
| **Effort** | Medium |
| **Team** | Solo |

---

## Distinctions (explicit vs CXW)

| CXW-001-CAP-01 | SEX-001-CAP-01 |
|----------------|----------------|
| Integrate secure checks into **shipping an app change** | Harden an **operable cloud sample** |
| BUILD + PROTECT + Bridge + release risk | OPERATE host Extension |
| INTEGRATION verification mandatory | No Cross-Wing Integration Mission |
| Integrity **§36** | Integrity **§37** |

---

## Explicit non-claims

- No XP · No LOCKED · Expert review **NOT RUN** · Pilot **NOT RUN**  
- Completing SEX Capstone ≠ SOC employment ≠ PROTECT Route complete ≠ CXW  
