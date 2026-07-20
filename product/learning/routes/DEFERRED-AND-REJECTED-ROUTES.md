# Deferred and Rejected Routes

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-ROUTE-DEF-001 |
| **Version** | 1.0.0 |
| **Status** | RESEARCH BASELINE |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1A |
| **Last updated** | 2026-07-21 |
| **Review date** | 2027-01-21 |
| **Related** | [ROUTE-CANDIDATE-REGISTER.md](./ROUTE-CANDIDATE-REGISTER.md) · [ROUTE-SELECTION-SCORECARD.md](./ROUTE-SELECTION-SCORECARD.md) · [LEARNING-RESEARCH-METHODOLOGY.md](../research/LEARNING-RESEARCH-METHODOLOGY.md) |
| **Limitations** | Re-entry requires new scorecard pass; market demand alone is insufficient |
| **Unresolved** | Lab capacity roadmap; ANALYZE advanced Track design |
| **Change history** | 1.0.0 — GHV.LEARNING.1A |

## Purpose

Capture Route candidates scored **DEFERRED** or **REJECTED** under GHV.LEARNING.1A so they are not silently revived without triggers. Status values here are research outcomes only — never `LOCKED`.

## Deferred

### RC-BLD-003 — Mobile App Foundations

| Field | Content |
|-------|---------|
| **Recommendation** | DEFERRED |
| **Score / band** | **56** / Weak |
| **Primary reasons** | High lab and operational cost (emulators, images, possible device farm); content-maintenance burden High; accessibility barrier from toolchain setup; weaker Evidence portability vs web delivery |
| **Future trigger** | Dedicated mobile lab budget + managed emulator fleet + RTL mobile a11y pilot passed; OR partner-hosted device cloud with cost caps |
| **Preferred alternatives** | **RC-BLD-001** Web Application Delivery Foundations (launch); **RC-BLD-002** Automation & Scripting Foundations (alt). Mobile may later appear as post-launch specialist Track fed by BLD-001 Evidence |
| **Re-score required** | Yes — full 100-point model before any launch discussion |

### RC-ANL-002 — Data Engineering Foundations

| Field | Content |
|-------|---------|
| **Recommendation** | DEFERRED |
| **Score / band** | **63** / Weak |
| **Primary reasons** | Too advanced for foundational launch catalogue; heavy prerequisites (analysis + scripting + cloud); High content-maintenance and operational cost; risks premature specialization vs portfolio shape target |
| **Future trigger** | Launch of **RC-ANL-001** with measured completers + stable scripting path (**RC-BLD-002**) + affordable pipeline sandbox; founder-capacity statement for advanced ANALYZE Track |
| **Preferred alternatives** | **RC-ANL-001** Practical Data Analysis Foundations (launch alternative); pipeline topics as Missions inside Secure Extension / advanced Track later — not a parallel launch Route |
| **Re-score required** | Yes |

## Rejected

### RC-LED-003 — Cyber Risk Governance Foundations

| Field | Content |
|-------|---------|
| **Recommendation** | REJECTED |
| **Score / band** | **61** / Weak |
| **Primary reasons** | Structural catalogue overlap with **PROTECT** (RC-PRT-001/002) and **LEAD** delivery/risk (**RC-LED-001**); dilutes Horizon clarity; weaker distinct Evidence vs combining governance Missions into existing Routes; Arabic feasibility and Community fit scored low relative to duplication cost |
| **Future trigger** | Only if LEAD launch set still lacks governance Evidence **after** RC-LED-001 Missions are designed — then consider a thin Mission pack or Secure Extension, not a duplicate Route. Full Route revival requires explicit anti-overlap design review |
| **Preferred alternatives** | **RC-LED-001** Technology Delivery & Risk Foundations (launch); fold CSF-level control mapping into **RC-PRT-001** / **RC-PRT-002** Evidence where needed; optional post-launch GRC Track distinct from foundations |
| **Re-score required** | Yes — and mandatory overlap analysis vs live catalogue |

## Not in this file (by design)

| Status | Examples | Where tracked |
|--------|----------|---------------|
| RECOMMENDED POST-LAUNCH | RC-OPR-003, RC-PRT-003, RC-LED-002 | Scorecard |
| RESEARCH FURTHER | RC-ANL-003 | Scorecard (freshness/safety/Arabic pilots) |
| Launch / alternatives | RC-OPR-001, RC-BLD-001, RC-PRT-001, RC-LED-001, alts | Scorecard |

## Summary counts

| Outcome | Count | IDs |
|---------|-------|-----|
| DEFERRED | 2 | RC-BLD-003 · RC-ANL-002 |
| REJECTED | 1 | RC-LED-003 |
| **Total captured here** | **3** | — |

## Explicit non-claims

No Product Codes. No `LOCKED` status. No certification promises. Deferred ≠ scheduled. Rejected ≠ forever banned from research — revival needs triggers + re-score.
