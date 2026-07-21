# CXW-001 — Evidence Rubrics

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-RUB-CXW-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE BLUEPRINT / BLUEPRINT RECOMMENDED — PENDING EXPERT REVIEW |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1C |
| **Last updated** | 2026-07-21 |
| **Related** | [CXW-001 Mission blueprints](../../missions/cross-wing/CXW-001-MISSION-BLUEPRINTS.md) · [CXW-001 Capstone](../../capstones/CXW-001-CAPSTONE-BLUEPRINT.md) · [EVIDENCE-ANCHOR-REGISTRY.md](../EVIDENCE-ANCHOR-REGISTRY.md) · [CXW-001 architecture](../../cross-wing/CXW-001-SECURE-APPLICATION-DELIVERY-ARCHITECTURE.md) |
| **Limitations** | Qualitative rubrics — no XP weights; numeric cut scores → PROGRESSION.1; not LOCKED |
| **Unresolved** | Reviewer capacity model; bilingual rubric sheets; expert calibration; 1D lock |
| **Change history** | 1.0.0 (2026-07-21) — LEARNING.1C CXW Evidence rubrics |
| **Expert review** | **NOT RUN** |
| **Pilot** | **NOT RUN** |

```text
Dual rubric: delivery quality + secure practice depth + INTEGRATION verification.
No XP. Defensive only. Never LOCKED in this Gate.
```

---

## Rubric use

Apply to **CXW-001-EVD-01…03**, **CXW-001-INT-01**, and Capstone pack review. Ratings are qualitative bands pending PROGRESSION.1:

| Band | Meaning |
|------|---------|
| **Does not meet** | Missing required elements or unsafe/false assurance |
| **Needs revision** | Partial; remediation path clear |
| **Meets** | Proportionate, seed-bound, honest residual risk |
| **Exceeds (optional note)** | Clarity/integration strength — not a title or XP award |

---

## CXW-001-EVD-01 — Threat-aware delivery plan

| Criterion | Meets when |
|-----------|------------|
| Scope clarity | Feature/change scope is bounded and lab-marked |
| Threat / abuse cases | Feature-scoped; defensive; not generic paste |
| Trust / assets | Assets and trust implications named at feature scope |
| Proportionality | Requirements match change size — no policy dump |
| Safety / ethics | Lab-only; no live-target or offensive steps |
| Integrity | Scenario/feature seed cited; AI disclosure if used |

---

## CXW-001-EVD-02 — Secure build & remediation

| Criterion | Meets when |
|-----------|------------|
| Delivery delta | App/repo change is real and tied to the same seed as the plan |
| Bridge hygiene | Dependency/secrets/config checklist applied (Bridge reinforce) |
| Seeded finding | Unique finding seed; intake + triage present |
| Remediation | Proportionate fix or documented deferral with residual risk |
| Verification | Basic secure-check interpretation without false assurance |
| Integrity | Original commits/notes; no real secrets; AI disclosure |

---

## CXW-001-EVD-03 — Release & residual-risk pack

| Criterion | Meets when |
|-----------|------------|
| Go / no-go | Explicit decision |
| Residual risk | Honest; cites unresolved items |
| Release notes | Match what actually changed |
| Handoff | Ops-aware notes if present (OPR recommended, not required) |
| Stakeholder clarity | Decision understandable without heroics language |
| Integrity | Sandbox only; no PII/secrets |

---

## INTEGRATION verification criteria (CXW-001-INT-01)

**Mandatory.** Integration fails if the pack could be assembled from unrelated BUILD + PROTECT artifacts without reconciliation.

| # | Criterion | Pass signal | Fail signal |
|---|-----------|-------------|-------------|
| **I1** | Single change seed | Plan, delta, finding, and decision share one seed/ID | Mixed unrelated projects |
| **I2** | Delivery goals present | Scope, quality bar, and shipped delta stated | Security notes with no delivery artifact |
| **I3** | Security findings bound | Seeded finding affects or constrains the same delta | Checklist-only “secure” label |
| **I4** | Release risk reconciled | Go/no-go cites delivery + security residual risk (SHC-010 language) | Greenwash or missing decision |
| **I5** | Ops constraints considered | Deploy/handoff/telemetry limits noted **or** explicitly N/A with reason | Silent ignore when scenario required handoff |
| **I6** | Stakeholder decision | Explicit accept / defer / block with rationale | No decision owner or rubber stamp |
| **I7** | Not sequential browsing | Narrative shows trade-offs across domains | Topic list without cross-links |
| **I8** | Safety & integrity | Lab-only; AI disclosure; no offensive content | Live-target or secret leak |

```text
NOT PASSABLE by separate BUILD + PROTECT artifacts alone.
```

---

## Capstone application

Capstone review reuses EVD-01…03 criteria **plus** I1–I8 on the integrated studio pack. Capstone does not award XP or professional titles.

---

## Explicit non-claims

- No XP weights · No Product Codes · No LOCKED  
- Expert review **NOT RUN** · Pilot **NOT RUN**  
