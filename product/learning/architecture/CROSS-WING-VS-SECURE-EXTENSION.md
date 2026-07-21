# Cross-Wing vs Secure Extension

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-CW-SE-BOUND-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED — PENDING 1D LOCK |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Related** | [CXW-001 architecture](../cross-wing/CXW-001-SECURE-APPLICATION-DELIVERY-ARCHITECTURE.md) · [SEX-001 architecture](../secure-extensions/SEX-001-SECURE-CLOUD-OPERATIONS-ARCHITECTURE.md) · [SHARED-CAPABILITY-REGISTRY.md](./SHARED-CAPABILITY-REGISTRY.md) · [LEARNING-IDENTIFIER-STANDARD.md](./LEARNING-IDENTIFIER-STANDARD.md) · [LAUNCH-CROSS-WING-STUDY.md](../cross-wing/LAUNCH-CROSS-WING-STUDY.md) · [LAUNCH-SECURE-EXTENSION-STUDY.md](../secure-extensions/LAUNCH-SECURE-EXTENSION-STUDY.md) |
| **Limitations** | Boundary lock for architecture — not Product Codes; not final catalogue LOCKED; no XP formulas |
| **Unresolved** | Extension marker / Crest awarding; professional-title pathway (later Gates); 1D lock |
| **Change history** | 1.0.0 (2026-07-21) — LEARNING.1B boundary lock |

```text
Boundary status: ARCHITECTURE RECOMMENDED — PENDING 1D LOCK
Never final LOCKED in this Gate.
```

---

## Purpose

Lock the distinction between **Cross-Wing Routes** and **Secure Extensions** so launch constructs **CXW-001** and **SEX-001** cannot collapse into each other, into a full PROTECT Route, or into duplicated mandatory Stages.

---

## Locked distinction

### Cross-Wing Route

| Property | Rule |
|----------|------|
| Scope | Combines **two or more** capability domains / Horizons |
| Outcome | Produces a **new integrated** real-world capability |
| Practice | Independent **Integration Missions** (`INTEGRATION` / `CONVERGENCE`) |
| Capstone | Independent Capstone (`CXW-*-CAP-01`) |
| Evidence | Substantial Evidence **across** source domains |
| Title path | May support a professional title **later** (not awarded in 1B) |
| Launch example | **CXW-001** Secure Application Delivery (BUILD + PROTECT + required Bridge; LEAD release-risk where genuine) |

### Secure Extension

| Property | Rule |
|----------|------|
| Scope | **Hardens or secures** an existing source capability |
| Outcome | Narrower than a Cross-Wing; tied to host Route |
| Practice | Extension Stages on host tasks — **no** multi-Horizon Integration Mission |
| Capstone | Capstone **extension** on host (`SEX-*-CAP-01`) |
| Evidence | Focused secure-practice Evidence **tied to the source capability** |
| Marker | May award an extension marker or Crest **later** (awarding deferred) |
| PROTECT | **Does not** substitute for a complete PROTECT Route |
| Launch example | **SEX-001** Secure Cloud Operations Extension (extends **RT-OPR-001**) |

### Quick contrast

| Dimension | Cross-Wing (CXW) | Secure Extension (SEX) |
|-----------|------------------|------------------------|
| Primary question | “Can the learner **integrate** domains into one capability?” | “Can the learner **secure** the host capability in practice?” |
| Horizon count | ≥2 sources | 1 host (+ optional security snippets) |
| Graph type | `CROSS_WING_ROUTE` + `CONVERGENCE` / `BRIDGE` | `SECURE_EXTENSION` attachment |
| Size | Larger integrative arc | Smaller depth layer |
| Launch pairing | CXW-001 | SEX-001 |

---

## Shared foundations (no duplicate full units)

Where foundational security or ops knowledge is shared:

1. Reference **one authoritative** Nest cap, Route Stage, or **SHC-*** entry.  
2. **Reinforce** contextually inside CXW or SEX.  
3. **Do not** copy the entire learning unit into both constructs.

| Shared foundation | Authoritative reference | CXW-001 reinforce | SEX-001 reinforce |
|-------------------|-------------------------|-------------------|-------------------|
| Documentation | SHC-001 / RT-LED-001-STG-02 | Release / plan notes | Secure runbooks |
| Version control | SHC-002 / RT-BLD-001 | Secure build commits | Config-as-code light |
| Privacy | SHC-006 / Nest | Demo data / Evidence | Lab-log redaction |
| Identity basics | SHC-007 / Nest + OPR STG-01 | Delivery IAM awareness | Least privilege STG-01 |
| Evidence integrity | SHC-008 | Integrated pack | Extension pack |
| Risk awareness | SHC-010 / RT-LED-001 | Release residual risk | Misconfig rationale |
| Change management | SHC-012 / RT-OPR-001-STG-05 | Handoff notes | Secure change / STG-04 |
| Appsec-for-delivery | **BRG-PRT-BLD-01** | STG-02 secure build | **Not used** (wrong host) |

---

## Duplication test — Stages

| CXW-001 Stage | Intent | SEX-001 Stage | Intent | Functionally identical? |
|---------------|--------|---------------|--------|-------------------------|
| **CXW-001-STG-01** Threat-aware planning | Feature-scoped threat/abuse planning for **app delivery** | **SEX-001-STG-01** Least privilege & identity | IAM/least privilege on **cloud ops host** | **No** |
| **CXW-001-STG-02** Secure build via Bridge | Bridge-backed secure **build/change** of an app | **SEX-001-STG-02** Secrets & hardening | Secrets + **infrastructure/config** harden | **No** |
| **CXW-001-STG-03** Security verification | Seeded **application** finding + verification | **SEX-001-STG-03** Logging, backup & resilience | Ops logs, backup, seeded **misconfig/fault** | **No** |
| **CXW-001-STG-04** Release decision & handoff | Go/no-go + residual risk + delivery handoff | **SEX-001-STG-04** Secure runbooks & escalation | Ops runbook + escalation on host | **No** |

**Result:** No mandatory Stage pair is functionally identical.

---

## Duplication test — Evidence anchors

| CXW Evidence | Proves | SEX Evidence | Proves | Identical? |
|--------------|--------|--------------|--------|------------|
| **CXW-001-EVD-01** Threat-aware delivery plan | App feature threat/abuse plan | **SEX-001-EVD-01** Least-privilege Evidence | IAM before/after on ops host | **No** |
| **CXW-001-EVD-02** Secure build & remediation | Repo delta + Bridge checklist + seeded **app** finding | **SEX-001-EVD-02** Secrets & hardening | Secrets attestation + harden **config** diff | **No** |
| **CXW-001-EVD-03** Release & residual-risk pack | Release decision + handoff | **SEX-001-EVD-03** Logging, resilience & runbook | Logs/backup + secure runbook/escalation | **No** |

**Result:** No mandatory Evidence anchor is functionally identical.

---

## Duplication test — Capstones

| Capstone | Problem shape | Identical? |
|----------|---------------|------------|
| **CXW-001-CAP-01** Secure Delivery Integration Studio | Integrate secure checks into **shipping an app change** | |
| **SEX-001-CAP-01** Harden the Ops Path | Harden an **operable cloud sample** (over-privileged / under-logged) | **No** |

---

## Forbidden collapses

| Collapse | Rule |
|----------|------|
| SEX marketed as Cross-Wing | Forbidden |
| CXW marketed as “PROTECT complete” | Forbidden |
| SEX marketed as full PROTECT Route | Forbidden |
| Host Route embeds full SEX curriculum | Forbidden — attachment only |
| BUILD Route embeds full CXW secure SDLC | Forbidden — source + Bridge pattern |
| Identical mandatory Stages/EVD/Capstone across CXW and SEX | Forbidden |

---

## Launch portfolio posture

| Construct | Status (1B) |
|-----------|-------------|
| **CXW-001** | Challenge **VALID WITH REQUIRED BRIDGE** · Status **ARCHITECTURE RECOMMENDED — WITH REQUIRED BRIDGE** · Stages **4** |
| **SEX-001** | Status **ARCHITECTURE RECOMMENDED** · Stages **4** |
| Boundary doc | **ARCHITECTURE RECOMMENDED — PENDING 1D LOCK** |

Together they cover **delivery security integration** (CXW) and **operations security depth** (SEX) without a single PROTECT-only story.

---

## Explicit non-claims

- No Product Codes  
- No XP / Prestige / Trust formulas  
- No employment, certification, or placement promises  
- Completing SEX ≠ SOC employment; completing CXW ≠ dual job titles  
- Never final `LOCKED` until GHV.LEARNING.1D  
