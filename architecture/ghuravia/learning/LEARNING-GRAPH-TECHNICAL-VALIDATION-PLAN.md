# Learning Graph Technical Validation Plan

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1A-LRN-GPH-001 |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN · NOT RUN · DECISION PENDING** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §20 |
| **Last updated** | 2026-07-21 |
| **Related spikes** | SPK-ARC-005 · SPK-ARC-009 |
| **Related baselines** | Learning Design Baseline v1.0.0 · LAUNCH-GRAPH-REGISTRY (166/129) · NODE-TYPE-REGISTRY · EDGE-TYPE-RULES · GRAPH-INVARIANTS (25) |

```text
VALIDATION PLAN
NOT RUN
DECISION PENDING
NO runtime graph · NO schema · NO Product Code
DO NOT select a graph database by name in 1A
A model called “graph” ≠ requirement to buy a graph DB
```

## 1. Purpose

Validate that future technical representation can faithfully host the locked conceptual Learning Graph without collapsing Entitlement into educational structure.

## 2. Authoritative inventory to represent

| Construct | Count | Authority |
|-----------|------:|-----------|
| Conceptual nodes | **166** | LAUNCH-GRAPH-REGISTRY |
| Conceptual edges | **129** | LAUNCH-GRAPH-REGISTRY |
| Node types | **16** | NODE-TYPE-REGISTRY |
| Edge types | **10** | EDGE-TYPE-RULES (exhaustive launch set) |
| Graph invariants | **25** | GRAPH-INVARIANTS |

### Ten edge types (exhaustive at launch)

```text
PREREQUISITE · COREQUISITE · RECOMMENDED · EQUIVALENT · BRIDGE
SECURE_EXTENSION · CONVERGENCE · UNLOCKS · EVIDENCE_FOR · REMEDIATES
```

### Sixteen node types (registry)

WORLD · FOUNDATION_LAYER · FOUNDATION_CAPABILITY · HORIZON · ROUTE · CROSS_WING_ROUTE · SECURE_EXTENSION · STAGE · MISSION_PLACEHOLDER · ASSESSMENT_ANCHOR · EVIDENCE_ANCHOR · CAPSTONE · BRIDGE · REMEDIATION · UNLOCK · CAPABILITY (shared)

## 3. Technical needs to validate later

| Need | Why | Spike |
|------|-----|-------|
| Node / edge versioning | Publish without breaking Evidence refs | SPK-ARC-005 |
| Prerequisite acyclicity | Invariant 1 — mandatory PREREQUISITE DAG | SPK-ARC-005 |
| Conditional availability | Capacity / reserve Routes | SPK-ARC-005 |
| Bridges / remediation / SEX / CXW | Structural correctness | SPK-ARC-005 |
| Unlocks | ULK set ≠ entitlement | SPK-ARC-005 |
| Deprecated content | Invariant 22 historical Evidence | SPK-ARC-005 |
| Draft vs published graph | Authoring workflow | SPK-ARC-005 |
| Explainable locks | Invariant 17 | SPK-ARC-005 |
| Learner-specific eligibility evaluation | Overlay separate from catalogue | SPK-ARC-005 · 009 |

## 4. Representation candidates (evaluate — do not select)

| Candidate | Hypothesis | Benefit | Risk | Validation method | Pass | Reject |
|-----------|------------|---------|------|-------------------|------|--------|
| **Relational** | Nodes/edges as tables + constraints | Strong integrity, migrations, familiar ops | Complex recursive queries | SPK-ARC-005 cycle checks + eligibility queries | Invariants enforceable; eligibility correct | Cannot express versioning/history without undue complexity |
| **Document** | Catalogue documents + edge arrays | Authoring ergonomics | Weak referential integrity; easy entitlement bleed | SPK-ARC-005 | Versioned publish works | Broken DAG enforcement |
| **Graph store (generic)** | Native traversal | Traversal DX | Ops/lock-in; overkill for 166 nodes | SPK-ARC-005 | Clear superiority vs relational at launch scale | Selected “because it’s a graph” without evidence |
| **Hybrid** | Relational truth + derived projection | Best of integrity + read models | Dual-write complexity | SPK-ARC-005 | Single source of truth clear | Dual sources diverge silently |

**Decision status:** **DECISION PENDING** (Architecture 1B+ with spike evidence). Launch-scale size (166/129) must be weighed; graph store is **not** presumed.

## 5. Hard separations

* Learning Graph edges must not encode payment plans or subscription tiers (Invariants 18–20).
* Entitlement Graph remains separate (GRAPH-LAYER-SEPARATION).
* Progress must not rewrite prerequisites (Invariant 21).

## 6. Limitations

```text
CONCEPTUAL VALIDATION PLAN · NO RUNTIME DATA · SPIKES NOT RUN
Expert review of graph tooling NOT RUN
```

## 7. Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §20 — learning graph technical validation plan |
