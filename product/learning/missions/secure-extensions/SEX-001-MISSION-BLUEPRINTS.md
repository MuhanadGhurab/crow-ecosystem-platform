# SEX-001 — Secure Cloud Operations Extension Mission Blueprints

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-MSN-SEX-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE BLUEPRINT / BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Construct** | **SEX-001** Secure Cloud Operations Extension (`SECURE_EXTENSION`) |
| **Extends** | **RT-OPR-001** Cloud Systems Operations Foundations |
| **Related** | [SEX-001 architecture](../../secure-extensions/SEX-001-SECURE-CLOUD-OPERATIONS-ARCHITECTURE.md) · [CROSS-WING-VS-SECURE-EXTENSION.md](../../architecture/CROSS-WING-VS-SECURE-EXTENSION.md) · [CXW-001 missions](../cross-wing/CXW-001-MISSION-BLUEPRINTS.md) · [SEX-001 rubrics](../../evidence/rubrics/SEX-001-EVIDENCE-RUBRICS.md) · [SEX-001 Capstone](../../capstones/SEX-001-CAPSTONE-BLUEPRINT.md) · [EVIDENCE-ANCHOR-REGISTRY.md](../../evidence/EVIDENCE-ANCHOR-REGISTRY.md) · [RT-OPR-001](../../routes/architecture/RT-OPR-001-CLOUD-SYSTEMS-OPERATIONS.md) |
| **Limitations** | Blueprint only — no Product Codes; no XP; not LOCKED; narrower than Cross-Wing; full PROTECT **not** required |
| **Unresolved** | Host Stage gate precision; Trust/Mastery interaction (PROGRESSION.1); vendor pin with OPR; expert review; 1D lock |
| **Change history** | 1.0.0 (2026-07-21) — LEARNING.1C SEX Mission blueprints |
| **Expert review** | **NOT RUN** |
| **Pilot** | **NOT RUN** |

```text
Mission count: exactly 8
Status: ARCHITECTURE BLUEPRINT / BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW
Extends RT-OPR-001 — not a free-floating security course.
No Integration Mission. No XP. Defensive / secure-ops only.
Never final LOCKED in this Gate.
```

---

## Purpose

Blueprint SEX-001 Missions that **harden secure cloud operations** on the OPERATE host — smaller than CXW-001, attached to RT-OPR-001, and **not** a substitute for full RT-PRT-001.

| Rule | Posture |
|------|---------|
| Strengthens security of cloud operations | Yes — host remains OPERATE |
| Creates multidisciplinary Cross-Wing identity | **No** |
| Equals PROTECT Route / Mastery | **No** |
| Requires full PRT enrollment | **No** — optional RECOMMENDED identity/control snippets |
| Produces secure-ops Evidence | **Yes** — tied to host ops capability |

---

## Exact Mission count

| Metric | Value |
|--------|------:|
| **Total Missions** | **8** |
| Integration Mission | **0** (Extensions do not use CXW-style INTEGRATION Convergence) |
| Evidence anchors | **SEX-001-EVD-01…03** |
| Capstone | **SEX-001-CAP-01** (extension Capstone — not full PROTECT Mastery) |

---

## Overlap note vs CXW-001 (distinct)

| Dimension | SEX-001 | CXW-001 |
|-----------|---------|---------|
| Focus | Least privilege · IAM · secrets · hardening · monitoring · backup · resilience · secure change · escalation · runbooks on **ops host** | Threat-aware **app delivery** · Bridge build · seeded **app** finding · release decision |
| Size | Narrower Extension (8 Missions / 4 Stages) | Larger Cross-Wing (10 Missions incl. INT) |
| Evidence | Ops harden diffs / runbooks | Delivery plan / app remediation / release pack |
| Capstone | Harden the Ops Path | Secure Delivery Integration Studio |

No identical mandatory Stages, EVD IDs, or Capstone problem shapes.

---

## Mission index (8)

| # | Mission ID | Title | Stage affinity | Categories | Evidence |
|---|------------|-------|----------------|------------|----------|
| 1 | **SEX-001-MSN-01** | Least privilege for the workload | STG-01 | ORIENTATION · KNOWLEDGE · GUIDED_PRACTICE · LABORATORY · DOCUMENTATION | Feeds **EVD-01** |
| 2 | **SEX-001-MSN-02** | Identity & access hygiene (IAM) | STG-01 | GUIDED_PRACTICE · LABORATORY · DOCUMENTATION | Feeds **EVD-01** |
| 3 | **SEX-001-MSN-03** | Secrets handling | STG-02 | GUIDED_PRACTICE · LABORATORY · DOCUMENTATION | Feeds **EVD-02** |
| 4 | **SEX-001-MSN-04** | Configuration & exposure hardening | STG-02 | LABORATORY · INDEPENDENT_PRACTICE · DOCUMENTATION | **EVD-02** primary |
| 5 | **SEX-001-MSN-05** | Security-relevant monitoring | STG-03 | LABORATORY · ANALYSIS · DOCUMENTATION | Feeds **EVD-03** |
| 6 | **SEX-001-MSN-06** | Backup protection & resilience practice | STG-03 | LABORATORY · TROUBLESHOOTING · SCENARIO · DOCUMENTATION | Feeds **EVD-03** |
| 7 | **SEX-001-MSN-07** | Secure change discipline | STG-04 | SCENARIO · DOCUMENTATION · ASSESSMENT | Feeds **EVD-03** (SHC-012) |
| 8 | **SEX-001-MSN-08** | Escalation & secure runbooks | STG-04 | DOCUMENTATION · SCENARIO · EVIDENCE_PREPARATION · ASSESSMENT | **EVD-03** · Capstone eligibility |

Focus areas covered: least privilege · IAM · secrets · hardening · monitoring · backup protection · resilience · secure change · escalation · secure runbooks.

---

## Mission blueprints

### SEX-001-MSN-01 — Least privilege for the workload

| Field | Content |
|-------|---------|
| **Outcome** | Apply least-privilege roles in lab; tighten standing access; document privilege rationale for the workload. |
| **Artifact** | Role before/after (redacted) → **SEX-001-EVD-01** |
| **Remediation** | Lab IAM reset; Nest MFA/account Micro-Mission |
| **SHC** | Reinforce SHC-007 identity basics |
| **Safety** | Isolated lab tenant only |

### SEX-001-MSN-02 — Identity & access hygiene (IAM)

| Field | Content |
|-------|---------|
| **Outcome** | Document identity boundaries; remove unnecessary standing permissions; attest access review for seeded lab identities. |
| **Artifact** | IAM hygiene note → EVD-01 |
| **Remediation** | Access-matrix rewrite |
| **Not** | Full identity provider engineering career track |

### SEX-001-MSN-03 — Secrets handling

| Field | Content |
|-------|---------|
| **Outcome** | Store/rotate secrets correctly in lab pattern; remove secrets from configs/Evidence; attest handling. |
| **Artifact** | Secrets-handling attestation → **SEX-001-EVD-02** |
| **Remediation** | Secrets-redaction drill |
| **Safety** | Never real secrets in Evidence packs |

### SEX-001-MSN-04 — Configuration & exposure hardening

| Field | Content |
|-------|---------|
| **Outcome** | Harden exposure (network/config) with before/after proof on ops sample. |
| **Artifact** | Hardening diff (sanitized) — **EVD-02** primary |
| **Remediation** | Hardening checklist retry |
| **Distinct from CXW** | Infrastructure/ops config — not app feature secure-build Bridge |

### SEX-001-MSN-05 — Security-relevant monitoring

| Field | Content |
|-------|---------|
| **Outcome** | Enable/interpret security-relevant logs/audit signals for the lab workload; redact privacy-sensitive fields. |
| **Artifact** | Log/audit note → **SEX-001-EVD-03** |
| **Remediation** | Log-privacy remediation; monitoring checklist retry |
| **SHC** | SHC-006 privacy reinforce |

### SEX-001-MSN-06 — Backup protection & resilience practice

| Field | Content |
|-------|---------|
| **Outcome** | Protect backup path basics; recover from a seeded misconfig/fault within runbook bounds. |
| **Artifact** | Backup/recover note → EVD-03 |
| **Remediation** | Fault-pack retry |
| **Safety** | Lab fault seeds only; no unauthorized tenant disruption |

### SEX-001-MSN-07 — Secure change discipline

| Field | Content |
|-------|---------|
| **Outcome** | Practice secure change hygiene for an ops change (plan · risk note · rollback awareness) using SHC-012 reinforce. |
| **Artifact** | Change note excerpt → EVD-03 |
| **Remediation** | Change-note revision |
| **Not** | Full LED Route or CXW release Capstone |

### SEX-001-MSN-08 — Escalation & secure runbooks

| Field | Content |
|-------|---------|
| **Outcome** | Update secure ops runbook; practice escalation note for seeded incident/misconfig; assemble Extension Evidence pack. |
| **Artifact** | Secure runbook + escalation → **EVD-03**; Capstone eligibility |
| **Remediation** | Runbook revision cycle |
| **Unlock** | Path to **SEX-001-CAP-01** after Stages + EVD-01…03 — **extension eligibility**, **not** full PROTECT Mastery |

---

## Evidence anchors (SEX)

| ID | Title | Artifact class | Mission contribution |
|----|-------|----------------|----------------------|
| **SEX-001-EVD-01** | Least-privilege Evidence | Role/IAM before-after (redacted) + rationale | MSN-01…02 |
| **SEX-001-EVD-02** | Secrets & hardening Evidence | Secrets attestation · config harden diff | MSN-03…04 |
| **SEX-001-EVD-03** | Logging, resilience & runbook | Log/audit · backup/recover · secure runbook + escalation | MSN-05…08 |

**Capstone:** **SEX-001-CAP-01** Harden the Ops Path — extension Capstone on host. Extension marker / Crest awarding **deferred**. Does **not** award full PROTECT Mastery, CXW completion, XP, or professional title.

---

## Entry / eligibility reminders

| Field | Content |
|-------|---------|
| **Host** | RT-OPR-001 readiness per partial-entry policy |
| **Unlock** | **ULK-SEX-001** |
| **PROTECT** | Not required |
| **Nest** | Elevated Nest security caps as required by Nest Dependency Map |

---

## Safety / freshness / expert review

| Area | Posture |
|------|---------|
| **Safety** | Isolated labs; no unauthorized tenant scanning; no credential theft exercises; secrets never in Evidence |
| **Freshness** | Medium–High maintenance (console drift) — pin lab baselines; vendor UI = Fast |
| **Expert review** | **NOT RUN** — EXP-SEX · EXP-OPR · EXP-INT; blocks PUBLISHED |
| **Arabic-first** | High for checklists/runbooks; English for console identifiers where unavoidable |

---

## Explicit non-claims

- No Product Codes · No XP · No LOCKED  
- SEX ≠ Cross-Wing · SEX ≠ full PROTECT · SEX Capstone ≠ PROTECT Capstone  
- Expert review **NOT RUN** · Pilot **NOT RUN**  
