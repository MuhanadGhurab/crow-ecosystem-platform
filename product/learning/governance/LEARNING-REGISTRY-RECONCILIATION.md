# Learning Registry Reconciliation

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-GOV-REC-001 |
| **Version** | 1.0.0 |
| **Status** | LOCKED AS GOVERNED DESIGN BASELINE |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1D |
| **Last updated** | 2026-07-21 |
| **Related** | [LEARNING-PORTFOLIO-MANIFEST.md](./LEARNING-PORTFOLIO-MANIFEST.md) · [../graph/LAUNCH-GRAPH-REGISTRY.md](../graph/LAUNCH-GRAPH-REGISTRY.md) · [../missions/MISSION-BLUEPRINT-REGISTRY.md](../missions/MISSION-BLUEPRINT-REGISTRY.md) · [../assessments/ASSESSMENT-ANCHOR-REGISTRY.md](../assessments/ASSESSMENT-ANCHOR-REGISTRY.md) · [../evidence/EVIDENCE-ANCHOR-REGISTRY.md](../evidence/EVIDENCE-ANCHOR-REGISTRY.md) · [../capstones/CAPSTONE-BLUEPRINT-REGISTRY.md](../capstones/CAPSTONE-BLUEPRINT-REGISTRY.md) · [../evidence/EVIDENCE-RUBRIC-REGISTRY.md](../evidence/EVIDENCE-RUBRIC-REGISTRY.md) · [../evidence/EVIDENCE-CLASSIFICATION.md](../evidence/EVIDENCE-CLASSIFICATION.md) |
| **Limitations** | Manual reconciliation of design registries — not a runtime inventory; Expert Review NOT RUN; Pilot NOT RUN |
| **Expert review** | NOT RUN |
| **Pilot** | NOT RUN |
| **Technical validation** | NOT RUN |
| **Publication** | BLOCKED |
| **Implementation** | BLOCKED |
| **Change history** | 1.0.0 (2026-07-21) — GHV.LEARNING.1D Registry Reconciliation |

## Purpose

Reconcile expected GHV.LEARNING.1D portfolio totals against authoritative registries. No approximate totals. Architecture was not altered to force a count.

---

## Reconciliation table

| Registry / construct | Expected | Actual | Match | Discrepancy | Resolution | Primary source files |
|----------------------|--------:|-------:|-------|-------------|------------|----------------------|
| Learning Graph nodes | 166 | 166 | **MATCH** | None | — | `graph/LAUNCH-GRAPH-REGISTRY.md` |
| Learning Graph edges | 129 | 129 | **MATCH** | None | — | `graph/LAUNCH-GRAPH-REGISTRY.md` · `graph/LAUNCH-GRAPH-EDGE-MATRIX.md` |
| Mission Blueprints | 87 | 87 | **MATCH** | None | — | `missions/MISSION-BLUEPRINT-REGISTRY.md` · pack files |
| Assessment Anchors | 33 | 33 | **MATCH** | None | — | `assessments/ASSESSMENT-ANCHOR-REGISTRY.md` |
| Evidence Anchors | 24 | 24 | **MATCH** | None | — | `evidence/EVIDENCE-ANCHOR-REGISTRY.md` |
| Capstone Blueprints | 7 | 7 | **MATCH** | None | — | `capstones/CAPSTONE-BLUEPRINT-REGISTRY.md` |
| Evidence Rubric Packs | 7 | 7 | **MATCH** | None | — | `evidence/EVIDENCE-RUBRIC-REGISTRY.md` |
| Evidence Classes | 18 | 18 | **MATCH** | None | — | `evidence/EVIDENCE-CLASSIFICATION.md` |
| P0 Routes | 4 | 4 | **MATCH** | None | — | Manifest · Route architecture packs |
| Reserve Routes | 1 | 1 | **MATCH** | None | — | RT-ANL-001 reserve packs |
| Cross-Wing Routes | 1 | 1 | **MATCH** | None | — | CXW-001 packs |
| Secure Extensions | 1 | 1 | **MATCH** | None | — | SEX-001 packs |
| Bridges | 8 | 8 | **MATCH** | None | — | Graph BRIDGE nodes · Nest→Route/CXW/SEX + BRG-PRT-BLD-01 |
| Shared Capabilities (SHC) | 12 | 12 | **MATCH** | None | — | Graph CAPABILITY shared set |
| Nest Capabilities | 13 | 13 | **MATCH** | None | — | `nest/NEST-CAPABILITY-REGISTRY.md` |
| Unlocks | 9 | 9 | **MATCH** | None | — | Unlock registry / graph UNLOCK nodes |
| Team / Live Sky Mission Blueprints | 1 | 1 | **MATCH** | None | — | `missions/live/LAUNCH-TEAM-LIVE-SKY-BLUEPRINT.md` |

**Overall result:** ALL MATCH.

---

## Layer notes (not discrepancies)

These pairs are **both correct** and represent different design layers — do not “reconcile away” either total:

| Layer A | Count | Layer B | Count | Explanation |
|---------|------:|---------|------:|-------------|
| Graph `ASSESSMENT_ANCHOR` nodes (1B) | **7** | Assessment Anchor Registry blueprints (1C) | **33** | 1B graph holds one conceptual assessment node per Route/CXW/SEX; 1C expands Stage/construct assessment anchors. Different layers. |
| Mission Blueprints (1C) | **87** | Graph `MISSION_PLACEHOLDER` nodes (1B) | **33** | 1B placeholders are one-per-Stage architecture stubs; 1C Mission Blueprints expand full portfolio. Different layers. |

No architecture change was required to reconcile counts.

## Explicit non-claims

* Not Expert Approved · Not Pilot Validated · Not Publication Ready · Not Accredited · Not Certified.
* No XP · No numeric Mastery · No Product Code.
