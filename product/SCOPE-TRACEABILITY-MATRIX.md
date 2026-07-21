# Scope Traceability Matrix

| Field | Value |
|-------|-------|
| **Status** | REVIEWED — GHV.LEARNING.1B (architecture links) |
| **Version** | 1.4.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-21 |
| **Source Gate** | GHV.LEARNING.1B |
| **Related** | [CAPABILITY-REGISTRY.md](./CAPABILITY-REGISTRY.md) · [LAUNCH-GRAPH-REGISTRY.md](./learning/graph/LAUNCH-GRAPH-REGISTRY.md) · [LAUNCH-ROUTE-PORTFOLIO-RECOMMENDATION.md](./learning/routes/LAUNCH-ROUTE-PORTFOLIO-RECOMMENDATION.md) |

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

Scope Baseline §3.8 unchanged. No silent Scope modification. No Change Request required for 1B architecture documentation.

## Gaps intentionally open

| Item | Status |
|------|--------|
| Exact Route lock | PENDING GHV.LEARNING.1D |
| Mission blueprints / rubrics | PENDING GHV.LEARNING.1C |
| Progression formulas | PENDING GHV.PROGRESSION.1 |
| Expert review | NOT RUN |
| Usability tests | NOT RUN |
| Product Code | BLOCKED |
| Runtime graph / DB schema | PENDING GHV.ARCHITECTURE.1 |
