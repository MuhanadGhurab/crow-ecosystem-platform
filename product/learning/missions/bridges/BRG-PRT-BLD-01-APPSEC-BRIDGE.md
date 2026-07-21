# BRG-PRT-BLD-01 — Application-Security-for-Delivery Bridge Missions

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-MSN-BRG-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE BLUEPRINT / BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Bridge ID** | **BRG-PRT-BLD-01** |
| **Working title** | Application-Security-for-Delivery |
| **Direction** | PROTECT concepts → BUILD delivery context |
| **Related** | [CXW-001 architecture](../../cross-wing/CXW-001-SECURE-APPLICATION-DELIVERY-ARCHITECTURE.md) · [CROSS-WING-VS-SECURE-EXTENSION.md](../../architecture/CROSS-WING-VS-SECURE-EXTENSION.md) · [RT-PRT-001](../../routes/architecture/RT-PRT-001-DEFENSIVE-SECURITY-OPERATIONS.md) · [RT-BLD-001](../../routes/architecture/RT-BLD-001-WEB-APPLICATION-DELIVERY.md) · [EVIDENCE-ANCHOR-REGISTRY.md](../../evidence/EVIDENCE-ANCHOR-REGISTRY.md) · [CONTENT-FRESHNESS-AND-LIFECYCLE.md](../../content/CONTENT-FRESHNESS-AND-LIFECYCLE.md) · [EXPERT-REVIEW-REQUIREMENTS.md](../../architecture/EXPERT-REVIEW-REQUIREMENTS.md) |
| **Limitations** | Blueprint only — no Product Codes; no XP / Mastery formulas; not LOCKED; not full Mission scripts for CMS; no realtime implementation |
| **Unresolved** | Expert security review; seed pack IDs; PROGRESSION.1 unlock numeric thresholds; 1D catalogue lock |
| **Change history** | 1.0.0 (2026-07-21) — LEARNING.1C Bridge Mission blueprints |
| **Expert review** | **NOT RUN** — required before PUBLISHED (AppSec + delivery) |
| **Pilot** | **NOT RUN** |

```text
Mission count: exactly 4 (Bridge Missions — smaller than a Route Stage arc)
Status: ARCHITECTURE BLUEPRINT / BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW
Never final LOCKED in this Gate.
No XP. Defensive only. No offensive exploitation.
```

---

## Purpose

Supply the focused **application-security-for-delivery** unit required by CXW-001 — without rewriting RT-PRT-001 (defensive ops) or RT-BLD-001 (web delivery).

| Includes | Excludes |
|----------|----------|
| Threat-aware feature notes in delivery context | Full AppSec career track |
| Defensive web-risk literacy | Red-team / offensive content |
| Trust boundaries · I/O handling · authn vs authz | Full RT-PRT-001 rewrite |
| Dependency / secrets / config hygiene in repo & pipeline | SEX-001 cloud hardening curriculum |
| Security testing **interpretation** (not tool mastery) | Live third-party targets |
| Remediation prioritization for seeded findings | Production tenant work |

**Authoritative teaching:** This Bridge owns the appsec-for-delivery unit. CXW Stages **reinforce** in Integration context — do not duplicate as a second full unit.

---

## Exact Mission count

| Metric | Value |
|--------|------:|
| **Bridge Missions** | **4** |
| Evidence checks (focused) | **1** |
| Capstone | None (Bridge feeds CXW Capstone, not its own) |

---

## Mission map (4)

| Mission ID | Title | Primary topics covered | Category mix | Feeds |
|------------|-------|------------------------|--------------|-------|
| **BRG-PRT-BLD-01-MSN-01** | App threat context & trust boundaries | App threat context · common web-risk categories (defensive) · trust boundaries | ORIENTATION · KNOWLEDGE · SCENARIO · DOCUMENTATION | Threat literacy for delivery |
| **BRG-PRT-BLD-01-MSN-02** | Safe I/O & access decisions | Input/output handling · authentication vs authorization | KNOWLEDGE · GUIDED_PRACTICE · SCENARIO · DOCUMENTATION | Secure-change checklist items |
| **BRG-PRT-BLD-01-MSN-03** | Dependencies, secrets & config hygiene | Dependency risk · secrets/config in repo & lab pipeline | GUIDED_PRACTICE · LABORATORY · INDEPENDENT_PRACTICE · DOCUMENTATION | Bridge checklist for CXW STG-02 |
| **BRG-PRT-BLD-01-MSN-04** | Testing interpretation, remediation & unlock | Security testing interpretation · remediation prioritization · Assessment · Evidence · CXW eligibility | ANALYSIS · ASSESSMENT · EVIDENCE_PREPARATION · REMEDIATION | **BRG-PRT-BLD-01-EVD-01** · **ULK-CXW-001** path |

Topic coverage rule: every required topic appears in exactly one primary Mission (reinforcement allowed in CXW; no second full Bridge unit).

---

## Mission blueprints

### BRG-PRT-BLD-01-MSN-01 — App threat context & trust boundaries

| Field | Content |
|-------|---------|
| **Outcome** | Learner frames a small app feature with defensive threat context, names common web-risk categories at feature scope, and maps trust boundaries (user · app · data · external services) without claiming SOC or AppSec engineer mastery. |
| **Learner role (scenario)** | Delivery contributor applying security-aware planning |
| **Activities (blueprint)** | Read defensive risk primer (OWASP-oriented categories, summarized); annotate a seeded feature brief with assets / abuse cases; draw a simple trust-boundary diagram; state lab safety posture |
| **Evidence potential** | Feature threat notes + trust-boundary sketch (formative; may feed later CXW-001-EVD-01) |
| **Remediation** | Rewrite threat notes with proportionality coach; Nest privacy/scam Micro-Mission if Nest-weak |
| **Safety** | Synthetic feature only; no live targets; no exploit steps |
| **Freshness** | Stable: threat-framing discipline · Slow: category taxonomy · Fast: example CVE/UI names (thin, pinned seeds) |
| **Expert review** | Required — EXP-PRT / EXP-CXW security content |

### BRG-PRT-BLD-01-MSN-02 — Safe I/O & access decisions

| Field | Content |
|-------|---------|
| **Outcome** | Learner distinguishes authentication from authorization, applies defensive input/output handling patterns on a lab app slice, and documents where trust is assumed vs verified. |
| **Learner role (scenario)** | Builder applying secure-handling checklist |
| **Activities (blueprint)** | Guided lab: validate/sanitize/encode patterns on seeded forms; map authn vs authz for two roles; record failure modes as defensive notes (not attack recipes) |
| **Evidence potential** | Annotated checklist + short decision note |
| **Remediation** | Guided I/O drill; authz matrix rewrite |
| **Safety** | Lab-only; fake credentials; no credential harvesting exercises |
| **Freshness** | Stable: authn vs authz · Slow: handling patterns · Vendor: framework helpers (examples non-lock) |
| **Expert review** | Required — AppSec practitioner |

### BRG-PRT-BLD-01-MSN-03 — Dependencies, secrets & config hygiene

| Field | Content |
|-------|---------|
| **Outcome** | Learner applies dependency-risk awareness and secrets/config hygiene in a delivery repo/lab pipeline context (allowlists, no secret commits, secure config checklist). |
| **Learner role (scenario)** | Contributor preparing a secure build change |
| **Activities (blueprint)** | Review seeded dependency report (interpret risk, do not chase all CVEs); remove/redact demo secrets; complete secure config checklist for lab app; commit hygiene attestation |
| **Evidence potential** | Bridge secure-build checklist excerpt (feeds CXW-001-EVD-02 shape) |
| **Remediation** | Secrets-redaction drill; LOCAL-SAFE lab reset; dependency-interpretation coach |
| **Safety** | Demo secrets only; never real keys in Evidence; no unauthorized scanning |
| **Freshness** | Fast: scanner UIs / CVE examples (pin lab seeds) · Slow: hygiene checklist structure |
| **Expert review** | Required — delivery + AppSec |

### BRG-PRT-BLD-01-MSN-04 — Testing interpretation, remediation & unlock

| Field | Content |
|-------|---------|
| **Outcome** | Learner interprets basic security-testing results, prioritizes remediation proportionately for a **seeded** finding, passes Bridge Assessment, submits the focused Evidence check, and becomes eligible for CXW-001 entry checks (still subject to Final Access Decision / PROGRESSION.1). |
| **Learner role (scenario)** | Contributor remediating a delivery-scoped finding |
| **Activities (blueprint)** | Intake seeded finding; classify severity vs delivery impact; propose/apply proportionate fix in lab; document residual risk; complete Assessment; assemble Evidence |
| **Assessment** | Short dual check: (1) interpretation accuracy · (2) remediation proportionality + residual-risk honesty |
| **Evidence (focused — one)** | See **BRG-PRT-BLD-01-EVD-01** below |
| **Remediation** | Seeded-finding retry with new seed; guided verification drill; Evidence revision |
| **Unlock on success** | Bridge complete → supports **ULK-CXW-001** learning eligibility (CXW entry checks remain); does **not** award XP, Product Code, PROTECT Mastery, or CXW Capstone |
| **Safety** | Seeded lab finding only; no live exploitation; AI-assist disclosure required |
| **Freshness** | Slow: prioritization method · Fast: tool output screenshots (pin versions) |
| **Expert review** | Required — blocking for PUBLISHED security content |

---

## Focused Evidence check

| ID | Title | Artifact class | Integrity | Review |
|----|-------|----------------|-----------|--------|
| **BRG-PRT-BLD-01-EVD-01** | AppSec-for-delivery Evidence check | Seeded finding intake + remediation note + Bridge checklist attestation (sanitized) | Unique finding seed; no real secrets; original notes; AI disclosure | Dual light rubric: interpretation + proportionate remediation |

**Rule:** Exactly **one** focused Evidence check for the Bridge. Passive completion ticks alone are not Evidence. Successful Evidence + Assessment feeds CXW eligibility — not CXW Capstone completion.

---

## Assessment + remediation + CXW eligibility (end of Bridge)

| Step | Rule |
|------|------|
| **1. Assessment** | MSN-04 Assessment must pass governed bar (numeric threshold → PROGRESSION.1) |
| **2. Evidence** | BRG-PRT-BLD-01-EVD-01 accepted (or revision path closed) |
| **3. Remediation** | On fail: REMEDIATION Micro-Mission / seeded retry — preserve valid prior Bridge Missions |
| **4. CXW eligibility** | Bridge success is **necessary** for CXW-001 STG-02+ path; not sufficient alone (requires RT-BLD-001 foundation readiness · selected RT-PRT-001 Stages · Nest rules · Final Access Decision) |
| **5. Non-awards** | No XP · no LOCKED catalogue claim · no professional title · no full PROTECT completion |

---

## Avoid duplication

| Construct | Bridge posture |
|-----------|----------------|
| **RT-BLD-001** | Do not re-teach full web delivery, a11y, or shipping Stages |
| **RT-PRT-001** | Do not re-teach full SOC triage / investigation arc |
| **CXW-001** | Reinforces Bridge in Integration; does not replace Bridge ownership |
| **SEX-001** | Not used — wrong host (OPERATE cloud hardening) |

---

## Freshness requirements

| Class | Bridge content | Cadence posture |
|-------|----------------|-----------------|
| **Stable** | Threat-framing · authn vs authz · residual-risk honesty | 18–24 months |
| **Slow-changing** | Defensive web-risk category structure · secure config checklist shape | ~12 months |
| **Fast** | Scanner UIs · CVE pattern examples · framework helper APIs | 3–6 months; keep thin; **pin lab seeds** |
| **Urgent** | Safety defect · exploitable guidance · secret-leak pattern in Evidence | Immediate UPDATE REQUIRED / unpublish |

Every Bridge Mission unit must carry: Owner · Reviewer · Sources · Version · last updated · review due · Affected IDs · Status (per CONTENT-FRESHNESS-AND-LIFECYCLE).

---

## Expert-review requirement (security content)

```text
Expert review: NOT RUN
Blocking for PUBLISHED Bridge Missions and Evidence check.
Domains: EXP-PRT · EXP-CXW · EXP-BLD (delivery half) · EXP-INT (Evidence integrity) · EXP-AR if localized
```

Security-critical content cannot self-APPROVE. Offensive or live-target content is a hard reject.

---

## Safety / Arabic-first / tooling

| Area | Posture |
|------|---------|
| **Safety** | Lab-only · defensive only · no live attacks · fake secrets · residual risk stated honestly |
| **Arabic-first** | High for narratives/checklists; English retained for code/tooling strings; RTL-aware docs |
| **Tooling classes** | LOCAL-SAFE · CONTAINERIZED · BROWSER-ONLY preview · optional free/open SAST/dependency scan tiers |
| **Avoid** | Live exploit targets · production tenants · proprietary IDE hard locks |

---

## Explicit non-claims

- No Product Codes · No XP · No Mastery formulas  
- Bridge ≠ full PROTECT · Bridge ≠ CXW Capstone  
- Expert review **NOT RUN** · Pilot **NOT RUN** · Never `LOCKED` in LEARNING.1C  
- Completing Bridge does not grant employment or certification  

---

## Unresolved

1. Numeric Assessment / Evidence thresholds (PROGRESSION.1)  
2. Seed pack catalogue IDs  
3. Dual-rubric reviewer capacity  
4. Exact packaging of Bridge before vs with CXW STG-02  
5. Final catalogue lock (1D)  
