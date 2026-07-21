# Scope Traceability Matrix

| Field | Value |
|-------|-------|
| **Status** | REVIEWED — GHV.LEARNING.1C (Mission/Evidence/Capstone blueprints) |
| **Version** | 1.5.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-21 |
| **Source Gate** | GHV.LEARNING.1C |
| **Related** | [CAPABILITY-REGISTRY.md](./CAPABILITY-REGISTRY.md) · [MISSION-BLUEPRINT-REGISTRY.md](./learning/missions/MISSION-BLUEPRINT-REGISTRY.md) · [LAUNCH-GRAPH-REGISTRY.md](./learning/graph/LAUNCH-GRAPH-REGISTRY.md) |

## Traceability chain

```text
Product Pillar
→ User Type
→ Journey Phase
→ Screen or State
→ Wireframe
→ Capability
→ Learning research / Route candidate
→ Route / Stage architecture
→ Conceptual Learning Graph
→ Domain
→ Requirement
→ Test
→ Evidence
```

## Learning research links (1A)

| Capability / theme | Research artifact | Status |
|--------------------|-------------------|--------|
| Nest | [NEST-DEPENDENCY-MAP.md](./learning/nest/NEST-DEPENDENCY-MAP.md) | Mapped |
| Horizons | Role matrix + candidates | Covered |
| Route selection | Portfolio recommendation + scorecard | RECOMMENDED — NOT YET LOCKED |
| Cross-Wing | [LAUNCH-CROSS-WING-STUDY.md](./learning/cross-wing/LAUNCH-CROSS-WING-STUDY.md) | CXW-001 recommended |
| Secure Extensions | [LAUNCH-SECURE-EXTENSION-STUDY.md](./learning/secure-extensions/LAUNCH-SECURE-EXTENSION-STUDY.md) | SEX-001 recommended |
| Missions / Evidence / Capstones | Evidence matrix + capstone concepts | Conceptual |
| Content lifecycle | [CONTENT-FRESHNESS-AND-LIFECYCLE.md](./learning/content/CONTENT-FRESHNESS-AND-LIFECYCLE.md) | Defined |
| Expert review | DEP-031 / Expert-review requirements | NOT RUN |

## Learning architecture links (1B)

| Capability / theme | Architecture artifact | Status |
|--------------------|----------------------|--------|
| Canonical IDs | [LEARNING-IDENTIFIER-STANDARD.md](./learning/architecture/LEARNING-IDENTIFIER-STANDARD.md) | Defined |
| Learning Graph | [LAUNCH-GRAPH-REGISTRY.md](./learning/graph/LAUNCH-GRAPH-REGISTRY.md) | CONCEPTUAL ARCHITECTURE COMPLETE (166 nodes / 129 edges) |
| P0 Routes | `routes/architecture/RT-*-001-*.md` | ARCHITECTURE RECOMMENDED — PENDING 1D LOCK |
| ANALYZE reserve | [RT-ANL-001-PRACTICAL-DATA-ANALYSIS.md](./learning/routes/architecture/RT-ANL-001-PRACTICAL-DATA-ANALYSIS.md) | LAUNCH RESERVE — CAPACITY CONDITIONAL |
| Shared capabilities | [SHARED-CAPABILITY-REGISTRY.md](./learning/architecture/SHARED-CAPABILITY-REGISTRY.md) | SHC-001..012 |
| Nest capabilities | [NEST-CAPABILITY-REGISTRY.md](./learning/nest/NEST-CAPABILITY-REGISTRY.md) | NST-CAP-001..013; thresholds unchanged |
| Cross-Wing architecture | [CXW-001-SECURE-APPLICATION-DELIVERY-ARCHITECTURE.md](./learning/cross-wing/CXW-001-SECURE-APPLICATION-DELIVERY-ARCHITECTURE.md) | VALID WITH REQUIRED BRIDGE |
| Secure Extension architecture | [SEX-001-SECURE-CLOUD-OPERATIONS-ARCHITECTURE.md](./learning/secure-extensions/SEX-001-SECURE-CLOUD-OPERATIONS-ARCHITECTURE.md) | ARCHITECTURE RECOMMENDED |
| Evidence anchors | [EVIDENCE-ANCHOR-REGISTRY.md](./learning/evidence/EVIDENCE-ANCHOR-REGISTRY.md) | 24 anchors + 7 capstones |
| Route-Proven | [ROUTE-PROVEN-STANDARD.md](./learning/proven/ROUTE-PROVEN-STANDARD.md) | QUALITATIVE STANDARD DEFINED |
| Horizon-Proven | [HORIZON-PROVEN-STANDARD.md](./learning/proven/HORIZON-PROVEN-STANDARD.md) | AWARDING DEFERRED |
| Eligibility overlay | [LEARNING-ELIGIBILITY-OVERLAY.md](./learning/architecture/LEARNING-ELIGIBILITY-OVERLAY.md) | Learning eligibility only (no plans) |

Scope Baseline §3.8 unchanged. No silent Scope modification. No Change Request required for 1C blueprint documentation.

## Learning blueprint links (1C)

| Capability / theme | Blueprint artifact | Status |
|--------------------|-------------------|--------|
| Mission Standard | [MISSION-BLUEPRINT-STANDARD.md](./learning/missions/MISSION-BLUEPRINT-STANDARD.md) | BLUEPRINT RECOMMENDED |
| Mission Registry | [MISSION-BLUEPRINT-REGISTRY.md](./learning/missions/MISSION-BLUEPRINT-REGISTRY.md) | **87** Mission Blueprints |
| Assessment anchors | [ASSESSMENT-ANCHOR-REGISTRY.md](./learning/assessments/ASSESSMENT-ANCHOR-REGISTRY.md) | **33** |
| Evidence rubrics | [EVIDENCE-RUBRIC-REGISTRY.md](./learning/evidence/EVIDENCE-RUBRIC-REGISTRY.md) | **7** packs |
| Capstones | [CAPSTONE-BLUEPRINT-REGISTRY.md](./learning/capstones/CAPSTONE-BLUEPRINT-REGISTRY.md) | **7** |
| AppSec Bridge | [BRG-PRT-BLD-01-APPSEC-BRIDGE.md](./learning/missions/bridges/BRG-PRT-BLD-01-APPSEC-BRIDGE.md) | BLUEPRINTED |
| CXW Integration | CXW-001-INT-01 in CXW Mission pack | BLUEPRINT COMPLETE |
| Live Sky | [LAUNCH-TEAM-LIVE-SKY-BLUEPRINT.md](./learning/missions/live/LAUNCH-TEAM-LIVE-SKY-BLUEPRINT.md) | TECH VALIDATION PENDING |
| AI / Integrity | `learning/integrity/` | Defined |
| Route-Proven trace | [ROUTE-PROVEN-TRACEABILITY.md](./learning/proven/ROUTE-PROVEN-TRACEABILITY.md) | Qualitative complete |
| Expert review | EXPERT-REVIEW-REQUIREMENTS | **NOT RUN** |
| Learning pilot | LEARNING-PILOT-REQUIREMENTS | **NOT RUN** |

## Gaps intentionally open

| Item | Status |
|------|--------|
| Exact Route lock | PENDING GHV.LEARNING.1D |
| Full lesson content | NOT STARTED |
| Progression formulas | PENDING GHV.PROGRESSION.1 |
| Expert review | NOT RUN |
| Learning pilot | NOT RUN |
| Usability tests | NOT RUN |
| Product Code | BLOCKED |
| Runtime graph / DB schema | PENDING GHV.ARCHITECTURE.1 |
