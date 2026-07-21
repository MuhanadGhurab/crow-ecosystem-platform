# Scope Traceability Matrix

| Field | Value |
|-------|-------|
| **Status** | REVIEWED — GHV.LEARNING.1D (Learning Design Baseline v1.0.0 locked) |
| **Version** | 1.6.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-21 |
| **Source Gate** | GHV.LEARNING.1D |
| **Related** | [CAPABILITY-REGISTRY.md](./CAPABILITY-REGISTRY.md) · [LEARNING-PORTFOLIO-MANIFEST.md](./learning/governance/LEARNING-PORTFOLIO-MANIFEST.md) · [MISSION-BLUEPRINT-REGISTRY.md](./learning/missions/MISSION-BLUEPRINT-REGISTRY.md) · [LAUNCH-GRAPH-REGISTRY.md](./learning/graph/LAUNCH-GRAPH-REGISTRY.md) |

## Traceability chain

```text
Product Pillar
→ User Type
→ Journey Phase
→ Screen or State
→ Wireframe
→ Capability
→ Route
→ Stage
→ Mission Blueprint
→ Assessment
→ Evidence
→ Capstone
→ Route-Proven Condition
→ Domain / Requirement / Test / Runtime Evidence (future Gates)
```

At 1D: Progression numeric requirement remains placeholder; engineering tests uncreated; runtime Evidence uncreated.

## Learning design baseline (1D) — authoritative

| Capability / theme | Artifact | Status |
|--------------------|----------|--------|
| Portfolio manifest | [LEARNING-PORTFOLIO-MANIFEST.md](./learning/governance/LEARNING-PORTFOLIO-MANIFEST.md) | **ACTIVE — LOCKED AS DESIGN BASELINE v1.0.0** |
| Design status model | [LEARNING-DESIGN-STATUS-MODEL.md](./learning/governance/LEARNING-DESIGN-STATUS-MODEL.md) | LOCKED vocabulary |
| Registry reconciliation | [LEARNING-REGISTRY-RECONCILIATION.md](./learning/governance/LEARNING-REGISTRY-RECONCILIATION.md) | Exact totals MATCH |
| Design freeze | [LEARNING-DESIGN-FREEZE-POLICY.md](./learning/governance/LEARNING-DESIGN-FREEZE-POLICY.md) | ACTIVE |
| Publication readiness | [PUBLICATION-READINESS-MATRIX.md](./learning/governance/PUBLICATION-READINESS-MATRIX.md) | Publication BLOCKED |
| Expert Review packets | [review/EXPERT-REVIEW-MASTER-PLAN.md](./learning/review/EXPERT-REVIEW-MASTER-PLAN.md) | READY — **NOT RUN** |
| Pilot packets | [pilots/LEARNING-PILOT-MASTER-PLAN.md](./learning/pilots/LEARNING-PILOT-MASTER-PLAN.md) | READY — **NOT RUN** |
| Handoff | [LEARNING-HANDOFF-PACKAGE.md](./learning/governance/LEARNING-HANDOFF-PACKAGE.md) | → PROGRESSION.1 / ARCHITECTURE.1 |

## Learning research links (1A)

| Capability / theme | Research artifact | Status |
|--------------------|-------------------|--------|
| Nest | [NEST-DEPENDENCY-MAP.md](./learning/nest/NEST-DEPENDENCY-MAP.md) | Mapped · design baseline |
| Horizons | Role matrix + candidates | Covered · awarding deferred |
| Route selection | Portfolio recommendation + scorecard | Superseded for authority by Manifest |
| Cross-Wing | [LAUNCH-CROSS-WING-STUDY.md](./learning/cross-wing/LAUNCH-CROSS-WING-STUDY.md) | CXW-001 locked (design) |
| Secure Extensions | [LAUNCH-SECURE-EXTENSION-STUDY.md](./learning/secure-extensions/LAUNCH-SECURE-EXTENSION-STUDY.md) | SEX-001 locked (design) |
| Content lifecycle | [CONTENT-FRESHNESS-AND-LIFECYCLE.md](./learning/content/CONTENT-FRESHNESS-AND-LIFECYCLE.md) | Defined |
| Expert review | Expert packets | **NOT RUN** |

## Learning architecture links (1B)

| Capability / theme | Architecture artifact | Status |
|--------------------|----------------------|--------|
| Canonical IDs | [LEARNING-IDENTIFIER-STANDARD.md](./learning/architecture/LEARNING-IDENTIFIER-STANDARD.md) | Defined · frozen |
| Learning Graph | [LAUNCH-GRAPH-REGISTRY.md](./learning/graph/LAUNCH-GRAPH-REGISTRY.md) | LOCKED AS DESIGN BASELINE (166/129 conceptual) |
| P0 Routes | `routes/architecture/RT-*-001-*.md` | **LOCKED AS DESIGN BASELINE** |
| ANALYZE reserve | [RT-ANL-001-PRACTICAL-DATA-ANALYSIS.md](./learning/routes/architecture/RT-ANL-001-PRACTICAL-DATA-ANALYSIS.md) | **LOCKED AS RESERVE DESIGN BASELINE** |
| Shared capabilities | SHC-001..012 | Locked (design) |
| Nest capabilities | NST-CAP-001..013 | Thresholds unchanged |
| Cross-Wing architecture | CXW-001 | VALID WITH REQUIRED BRIDGE · locked (design) |
| Secure Extension architecture | SEX-001 | Locked (design) |
| Route-Proven | [ROUTE-PROVEN-STANDARD.md](./learning/proven/ROUTE-PROVEN-STANDARD.md) | LOCKED AT QUALITATIVE DESIGN LEVEL |
| Horizon-Proven | [HORIZON-PROVEN-STANDARD.md](./learning/proven/HORIZON-PROVEN-STANDARD.md) | FOUNDATION MODEL LOCKED · AWARDING DEFERRED |

## Learning blueprint links (1C → locked in 1D)

| Capability / theme | Blueprint artifact | Status |
|--------------------|-------------------|--------|
| Mission Registry | [MISSION-BLUEPRINT-REGISTRY.md](./learning/missions/MISSION-BLUEPRINT-REGISTRY.md) | **87** LOCKED AS DESIGN BASELINE |
| Assessment anchors | [ASSESSMENT-ANCHOR-REGISTRY.md](./learning/assessments/ASSESSMENT-ANCHOR-REGISTRY.md) | **33** LOCKED AS ASSESSMENT DESIGN BASELINE |
| Evidence rubrics | [EVIDENCE-RUBRIC-REGISTRY.md](./learning/evidence/EVIDENCE-RUBRIC-REGISTRY.md) | **7** packs locked (design) |
| Capstones | [CAPSTONE-BLUEPRINT-REGISTRY.md](./learning/capstones/CAPSTONE-BLUEPRINT-REGISTRY.md) | **7** locked (design) |
| AppSec Bridge | [BRG-PRT-BLD-01-APPSEC-BRIDGE.md](./learning/missions/bridges/BRG-PRT-BLD-01-APPSEC-BRIDGE.md) | LOCKED AS DESIGN BASELINE · mandatory for CXW |
| Live Sky | [LAUNCH-TEAM-LIVE-SKY-BLUEPRINT.md](./learning/missions/live/LAUNCH-TEAM-LIVE-SKY-BLUEPRINT.md) | LOCKED AS DESIGN BLUEPRINT · tech NOT RUN |
| AI / Integrity | `learning/integrity/` | Defined |
| Route-Proven trace | [ROUTE-PROVEN-TRACEABILITY.md](./learning/proven/ROUTE-PROVEN-TRACEABILITY.md) | Qualitative complete |
| CXW / SEX boundary | [CROSS-WING-SECURE-EXTENSION-FINAL-BOUNDARY.md](./learning/governance/CROSS-WING-SECURE-EXTENSION-FINAL-BOUNDARY.md) | 0 duplicated mandatory Stages/Evidence/capstones |

Scope Baseline §3.8 unchanged. No silent Scope modification. No Change Request required for 1D design-baseline lock documentation.

## Gaps intentionally open

| Item | Status |
|------|--------|
| Expert Review | **NOT RUN** |
| Learning Pilot | **NOT RUN** |
| Publication | **BLOCKED** |
| Implementation / Product Code | **BLOCKED** |
| Full lesson content | NOT STARTED (drafting may be sequenced later under freeze) |
| Progression formulas | PENDING GHV.PROGRESSION.1 |
| Usability tests | NOT RUN |
| Runtime graph / DB schema | PENDING GHV.ARCHITECTURE.1 |
| Numeric Mastery / XP | NOT DEFINED (correct) |
