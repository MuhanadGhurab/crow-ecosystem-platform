# LINEAGE COLLISION HANDOFF AND ACCEPTANCE-TEST GRAMMAR

| Field | Value |
|-------|-------|
| **Document** | Collision Handoff & Acceptance-Test Grammar |
| **Gate** | GHV.CROW-IDENTITY.1C |
| **Starting HEAD** | `e098440661ba023a1e523a9cf7b4ae46e0533d27` |
| **Date** | 2026-07-23 |
| **Implementation authority** | **NONE** |
| **Status** | **LOCKED (design)** |
| **Critical pairs inventoried** | 60 |
| **Unresolved critical collisions** | **0** |

## Purpose

Close the 1B procedural gap: every governed critical collision pair must have explicit handoff and distinguishing acceptance-test grammar. Cosmetic differentiation is forbidden; capability ownership decides attribution.

## Shared grammar

```text
Given:
Evidence describing a specific activity

When:
The activity is evaluated against both Lineages

Then:
Only the Lineage whose protected capability center
owns the demonstrated outcome receives attribution

And:
The adjacent Lineage receives no attribution unless
separate Evidence demonstrates its own protected center
```

## Mastery attribution rule (all pairs)

Mastery credit follows the same protected-center ownership as Evidence attribution. Mastery formulas remain those locked under Progression Design Baseline v1.0.0 (`FRM-MST-*`); this Gate does not invent numbers.

## Pair records

### A1↔B2 — Pattern Seeker / Prototype Spark

| Field | Value |
|-------|-------|
| Pair key | A1↔B2 |
| Lineage A | CRW-ANL-01 — Pattern Seeker |
| Lineage B | CRW-BLD-02 — Prototype Spark |
| Protected center A | Analytics, statistics, anomaly recognition, prediction. |
| Protected center B | Prototyping, product experimentation, iterative validation. |
| Boundary distinction | B2 validates ideas by making; A1 reveals statistical patterns. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-ANL-01 and CRW-BLD-02; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Pattern Seeker and Prototype Spark from one artifact that only proves "B2 validates ideas by making; A1 reveals statistical patterns." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### A1↔L2 — Pattern Seeker / Mission Commander

| Field | Value |
|-------|-------|
| Pair key | A1↔L2 |
| Lineage A | CRW-ANL-01 — Pattern Seeker |
| Lineage B | CRW-LED-02 — Mission Commander |
| Protected center A | Analytics, statistics, anomaly recognition, prediction. |
| Protected center B | Project/program/mission command and accountable delivery. |
| Boundary distinction | A1 produces analytic insight; L2 directs delivery missions. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-ANL-01 and CRW-LED-02; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Pattern Seeker and Mission Commander from one artifact that only proves "A1 produces analytic insight; L2 directs delivery missions." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### A1↔O1 — Pattern Seeker / Rhythm Keeper

| Field | Value |
|-------|-------|
| Pair key | A1↔O1 |
| Lineage A | CRW-ANL-01 — Pattern Seeker |
| Lineage B | CRW-OPR-01 — Rhythm Keeper |
| Protected center A | Analytics, statistics, anomaly recognition, prediction. |
| Protected center B | Availability, performance, observability, and continuous reliability measurement. |
| Boundary distinction | A1 analyzes patterns; O1 operates service-health rhythm. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-ANL-01 and CRW-OPR-01; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Pattern Seeker and Rhythm Keeper from one artifact that only proves "A1 analyzes patterns; O1 operates service-health rhythm." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### A1↔P1 — Pattern Seeker / Azure Watcher

| Field | Value |
|-------|-------|
| Pair key | A1↔P1 |
| Lineage A | CRW-ANL-01 — Pattern Seeker |
| Lineage B | CRW-PRT-01 — Azure Watcher |
| Protected center A | Analytics, statistics, anomaly recognition, prediction. |
| Protected center B | Security monitoring, detection, defensive visibility. |
| Boundary distinction | A1 finds general patterns; P1 monitors defensive security signals. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-ANL-01 and CRW-PRT-01; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Pattern Seeker and Azure Watcher from one artifact that only proves "A1 finds general patterns; P1 monitors defensive security signals." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### A2↔B2 — Deep Observer / Prototype Spark

| Field | Value |
|-------|-------|
| Pair key | A2↔B2 |
| Lineage A | CRW-ANL-02 — Deep Observer |
| Lineage B | CRW-BLD-02 — Prototype Spark |
| Protected center A | Research, experimentation, root-cause/causal inquiry. |
| Protected center B | Prototyping, product experimentation, iterative validation. |
| Boundary distinction | B2 builds to learn; A2 investigates to understand causes. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-ANL-02 and CRW-BLD-02; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Deep Observer and Prototype Spark from one artifact that only proves "B2 builds to learn; A2 investigates to understand causes." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### A2↔B5 — Deep Observer / Silent Architect

| Field | Value |
|-------|-------|
| Pair key | A2↔B5 |
| Lineage A | CRW-ANL-02 — Deep Observer |
| Lineage B | CRW-BLD-05 — Silent Architect |
| Protected center A | Research, experimentation, root-cause/causal inquiry. |
| Protected center B | Software quality, implementation precision, performance, high-assurance design. |
| Boundary distinction | B5 improves implementation; A2 researches causes. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-ANL-02 and CRW-BLD-05; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Deep Observer and Silent Architect from one artifact that only proves "B5 improves implementation; A2 researches causes." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### A2↔L5 — Deep Observer / Horizon Pathfinder

| Field | Value |
|-------|-------|
| Pair key | A2↔L5 |
| Lineage A | CRW-ANL-02 — Deep Observer |
| Lineage B | CRW-LED-05 — Horizon Pathfinder |
| Protected center A | Research, experimentation, root-cause/causal inquiry. |
| Protected center B | Strategy, innovation, foresight, adaptive direction. |
| Boundary distinction | A2 explains causes; L5 chooses future direction. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-ANL-02 and CRW-LED-05; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Deep Observer and Horizon Pathfinder from one artifact that only proves "A2 explains causes; L5 chooses future direction." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### A2↔O4 — Deep Observer / Automation Conductor

| Field | Value |
|-------|-------|
| Pair key | A2↔O4 |
| Lineage A | CRW-ANL-02 — Deep Observer |
| Lineage B | CRW-OPR-04 — Automation Conductor |
| Protected center A | Research, experimentation, root-cause/causal inquiry. |
| Protected center B | Scripting, orchestration, IaC, and repeatable operations with human control. |
| Boundary distinction | O4 produces governed automation artifacts; A2 pursues causal research. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-ANL-02 and CRW-OPR-04; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Deep Observer and Automation Conductor from one artifact that only proves "O4 produces governed automation artifacts; A2 pursues causal research." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### A2↔P3 — Deep Observer / Trace Hunter

| Field | Value |
|-------|-------|
| Pair key | A2↔P3 |
| Lineage A | CRW-ANL-02 — Deep Observer |
| Lineage B | CRW-PRT-03 — Trace Hunter |
| Protected center A | Research, experimentation, root-cause/causal inquiry. |
| Protected center B | Threat hunting, investigation, forensic tracing. |
| Boundary distinction | A2 pursues causal meaning broadly; P3 pursues security-relevant traces. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-ANL-02 and CRW-PRT-03; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Deep Observer and Trace Hunter from one artifact that only proves "A2 pursues causal meaning broadly; P3 pursues security-relevant traces." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### A2↔P5 — Deep Observer / Crimson Validator

| Field | Value |
|-------|-------|
| Pair key | A2↔P5 |
| Lineage A | CRW-ANL-02 — Deep Observer |
| Lineage B | CRW-PRT-05 — Crimson Validator |
| Protected center A | Research, experimentation, root-cause/causal inquiry. |
| Protected center B | Authorized adversarial testing, validation, remediation retest. |
| Boundary distinction | A2 researches; P5 adversarially validates defenses under authorization. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-ANL-02 and CRW-PRT-05; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Deep Observer and Crimson Validator from one artifact that only proves "A2 researches; P5 adversarially validates defenses under authorization." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### A3↔B1 — Signal Cartographer / Framework Seeker

| Field | Value |
|-------|-------|
| Pair key | A3↔B1 |
| Lineage A | CRW-ANL-03 — Signal Cartographer |
| Lineage B | CRW-BLD-01 — Framework Seeker |
| Protected center A | Visualization, topology, digital twins, relational models. |
| Protected center B | Architecture, requirements, frameworks, structural tradeoffs. |
| Boundary distinction | B1 architects structure; A3 maps relational topology models. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-ANL-03 and CRW-BLD-01; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Signal Cartographer and Framework Seeker from one artifact that only proves "B1 architects structure; A3 maps relational topology models." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### A3↔L1 — Signal Cartographer / Formation Guide

| Field | Value |
|-------|-------|
| Pair key | A3↔L1 |
| Lineage A | CRW-ANL-03 — Signal Cartographer |
| Lineage B | CRW-LED-01 — Formation Guide |
| Protected center A | Visualization, topology, digital twins, relational models. |
| Protected center B | Mentoring, learning, enablement, community capability growth. |
| Boundary distinction | A3 produces navigable models; L1 develops people. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-ANL-03 and CRW-LED-01; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Signal Cartographer and Formation Guide from one artifact that only proves "A3 produces navigable models; L1 develops people." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### A3↔O2 — Signal Cartographer / Flow Navigator

| Field | Value |
|-------|-------|
| Pair key | A3↔O2 |
| Lineage A | CRW-ANL-03 — Signal Cartographer |
| Lineage B | CRW-OPR-02 — Flow Navigator |
| Protected center A | Visualization, topology, digital twins, relational models. |
| Protected center B | Routing, live path operations, connectivity, and traffic performance. |
| Boundary distinction | O2 changes live paths; A3 models/maps topology without operating traffic. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-ANL-03 and CRW-OPR-02; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Signal Cartographer and Flow Navigator from one artifact that only proves "O2 changes live paths; A3 models/maps topology without operating traffic." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### A3↔P2 — Signal Cartographer / Boundary Warden

| Field | Value |
|-------|-------|
| Pair key | A3↔P2 |
| Lineage A | CRW-ANL-03 — Signal Cartographer |
| Lineage B | CRW-PRT-02 — Boundary Warden |
| Protected center A | Visualization, topology, digital twins, relational models. |
| Protected center B | IAM, hardening, security architecture, least privilege. |
| Boundary distinction | A3 models topology; P2 protects authorized zones. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-ANL-03 and CRW-PRT-02; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Signal Cartographer and Boundary Warden from one artifact that only proves "A3 models topology; P2 protects authorized zones." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### A4↔B3 — Evidence Tracker / Systems Crafter

| Field | Value |
|-------|-------|
| Pair key | A4↔B3 |
| Lineage A | CRW-ANL-04 — Evidence Tracker |
| Lineage B | CRW-BLD-03 — Systems Crafter |
| Protected center A | Provenance, validation, traceability, data quality, evidence chain. |
| Protected center B | Infrastructure/system integration, cloud/hardware/embedded construction. |
| Boundary distinction | B3 integrates mechanisms; A4 establishes data provenance. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-ANL-04 and CRW-BLD-03; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Evidence Tracker and Systems Crafter from one artifact that only proves "B3 integrates mechanisms; A4 establishes data provenance." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### A4↔L4 — Evidence Tracker / Systems Governor

| Field | Value |
|-------|-------|
| Pair key | A4↔L4 |
| Lineage A | CRW-ANL-04 — Evidence Tracker |
| Lineage B | CRW-LED-04 — Systems Governor |
| Protected center A | Provenance, validation, traceability, data quality, evidence chain. |
| Protected center B | GRC, risk, compliance, quality assurance governance. |
| Boundary distinction | A4 establishes provenance/quality facts; L4 establishes controls/accountability. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-ANL-04 and CRW-LED-04; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Evidence Tracker and Systems Governor from one artifact that only proves "A4 establishes provenance/quality facts; L4 establishes controls/accountability." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### A4↔O3 — Evidence Tracker / Recovery Smith

| Field | Value |
|-------|-------|
| Pair key | A4↔O3 |
| Lineage A | CRW-ANL-04 — Evidence Tracker |
| Lineage B | CRW-OPR-03 — Recovery Smith |
| Protected center A | Provenance, validation, traceability, data quality, evidence chain. |
| Protected center B | Incident/problem diagnosis, failover, continuity restoration. |
| Boundary distinction | A4 proves data lineage; O3 restores services. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-ANL-04 and CRW-OPR-03; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Evidence Tracker and Recovery Smith from one artifact that only proves "A4 proves data lineage; O3 restores services." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### A4↔P3 — Evidence Tracker / Trace Hunter

| Field | Value |
|-------|-------|
| Pair key | A4↔P3 |
| Lineage A | CRW-ANL-04 — Evidence Tracker |
| Lineage B | CRW-PRT-03 — Trace Hunter |
| Protected center A | Provenance, validation, traceability, data quality, evidence chain. |
| Protected center B | Threat hunting, investigation, forensic tracing. |
| Boundary distinction | A4 validates provenance chains; P3 follows security-relevant traces. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-ANL-04 and CRW-PRT-03; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Evidence Tracker and Trace Hunter from one artifact that only proves "A4 validates provenance chains; P3 follows security-relevant traces." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### A5↔B4 — Insight Connector / Network Weaver

| Field | Value |
|-------|-------|
| Pair key | A5↔B4 |
| Lineage A | CRW-ANL-05 — Insight Connector |
| Lineage B | CRW-BLD-04 — Network Weaver |
| Protected center A | BI, synthesis, decision support, insight communication. |
| Protected center B | APIs, interfaces, distributed systems, integration contracts. |
| Boundary distinction | B4 connects systems; A5 synthesizes decision insight. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-ANL-05 and CRW-BLD-04; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Insight Connector and Network Weaver from one artifact that only proves "B4 connects systems; A5 synthesizes decision insight." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### A5↔L3 — Insight Connector / Quiet Coordinator

| Field | Value |
|-------|-------|
| Pair key | A5↔L3 |
| Lineage A | CRW-ANL-05 — Insight Connector |
| Lineage B | CRW-LED-03 — Quiet Coordinator |
| Protected center A | BI, synthesis, decision support, insight communication. |
| Protected center B | Product/service/stakeholder/cross-team coordination. |
| Boundary distinction | A5 produces decision insight; L3 aligns people/work. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-ANL-05 and CRW-LED-03; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Insight Connector and Quiet Coordinator from one artifact that only proves "A5 produces decision insight; L3 aligns people/work." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### A5↔O5 — Insight Connector / Service Steward

| Field | Value |
|-------|-------|
| Pair key | A5↔O5 |
| Lineage A | CRW-ANL-05 — Insight Connector |
| Lineage B | CRW-OPR-05 — Service Steward |
| Protected center A | BI, synthesis, decision support, insight communication. |
| Protected center B | ITSM, support quality, service acceptance, knowledge continuity. |
| Boundary distinction | A5 turns sources into insight; O5 closes service cases. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-ANL-05 and CRW-OPR-05; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Insight Connector and Service Steward from one artifact that only proves "A5 turns sources into insight; O5 closes service cases." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### A5↔P4 — Insight Connector / Crisis Guardian

| Field | Value |
|-------|-------|
| Pair key | A5↔P4 |
| Lineage A | CRW-ANL-05 — Insight Connector |
| Lineage B | CRW-PRT-04 — Crisis Guardian |
| Protected center A | BI, synthesis, decision support, insight communication. |
| Protected center B | Containment, incident response, cyber recovery, resilience. |
| Boundary distinction | A5 synthesizes for decisions; P4 contains cyber crisis. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-ANL-05 and CRW-PRT-04; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Insight Connector and Crisis Guardian from one artifact that only proves "A5 synthesizes for decisions; P4 contains cyber crisis." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### B1↔B3 — Framework Seeker / Systems Crafter

| Field | Value |
|-------|-------|
| Pair key | B1↔B3 |
| Lineage A | CRW-BLD-01 — Framework Seeker |
| Lineage B | CRW-BLD-03 — Systems Crafter |
| Protected center A | Architecture, requirements, frameworks, structural tradeoffs. |
| Protected center B | Infrastructure/system integration, cloud/hardware/embedded construction. |
| Boundary distinction | B3 builds practical systems; B1 structures architectural foundations. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-BLD-01 and CRW-BLD-03; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Framework Seeker and Systems Crafter from one artifact that only proves "B3 builds practical systems; B1 structures architectural foundations." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### B1↔B5 — Framework Seeker / Silent Architect

| Field | Value |
|-------|-------|
| Pair key | B1↔B5 |
| Lineage A | CRW-BLD-01 — Framework Seeker |
| Lineage B | CRW-BLD-05 — Silent Architect |
| Protected center A | Architecture, requirements, frameworks, structural tradeoffs. |
| Protected center B | Software quality, implementation precision, performance, high-assurance design. |
| Boundary distinction | B1 defines foundational structure; B5 refines implementation quality. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-BLD-01 and CRW-BLD-05; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Framework Seeker and Silent Architect from one artifact that only proves "B1 defines foundational structure; B5 refines implementation quality." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### B1↔L5 — Framework Seeker / Horizon Pathfinder

| Field | Value |
|-------|-------|
| Pair key | B1↔L5 |
| Lineage A | CRW-BLD-01 — Framework Seeker |
| Lineage B | CRW-LED-05 — Horizon Pathfinder |
| Protected center A | Architecture, requirements, frameworks, structural tradeoffs. |
| Protected center B | Strategy, innovation, foresight, adaptive direction. |
| Boundary distinction | B1 structures solutions; L5 chooses strategic direction. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-BLD-01 and CRW-LED-05; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Framework Seeker and Horizon Pathfinder from one artifact that only proves "B1 structures solutions; L5 chooses strategic direction." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### B1↔O4 — Framework Seeker / Automation Conductor

| Field | Value |
|-------|-------|
| Pair key | B1↔O4 |
| Lineage A | CRW-BLD-01 — Framework Seeker |
| Lineage B | CRW-OPR-04 — Automation Conductor |
| Protected center A | Architecture, requirements, frameworks, structural tradeoffs. |
| Protected center B | Scripting, orchestration, IaC, and repeatable operations with human control. |
| Boundary distinction | O4 executes repeatable operations; B1 defines architectural structure. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-BLD-01 and CRW-OPR-04; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Framework Seeker and Automation Conductor from one artifact that only proves "O4 executes repeatable operations; B1 defines architectural structure." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### B1↔P2 — Framework Seeker / Boundary Warden

| Field | Value |
|-------|-------|
| Pair key | B1↔P2 |
| Lineage A | CRW-BLD-01 — Framework Seeker |
| Lineage B | CRW-PRT-02 — Boundary Warden |
| Protected center A | Architecture, requirements, frameworks, structural tradeoffs. |
| Protected center B | IAM, hardening, security architecture, least privilege. |
| Boundary distinction | B1 designs systems generally; P2 designs security access boundaries. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-BLD-01 and CRW-PRT-02; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Framework Seeker and Boundary Warden from one artifact that only proves "B1 designs systems generally; P2 designs security access boundaries." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### B2↔L3 — Prototype Spark / Quiet Coordinator

| Field | Value |
|-------|-------|
| Pair key | B2↔L3 |
| Lineage A | CRW-BLD-02 — Prototype Spark |
| Lineage B | CRW-LED-03 — Quiet Coordinator |
| Protected center A | Prototyping, product experimentation, iterative validation. |
| Protected center B | Product/service/stakeholder/cross-team coordination. |
| Boundary distinction | B2 iterates artifacts; L3 aligns stakeholders/product work. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-BLD-02 and CRW-LED-03; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Prototype Spark and Quiet Coordinator from one artifact that only proves "B2 iterates artifacts; L3 aligns stakeholders/product work." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### B2↔O5 — Prototype Spark / Service Steward

| Field | Value |
|-------|-------|
| Pair key | B2↔O5 |
| Lineage A | CRW-BLD-02 — Prototype Spark |
| Lineage B | CRW-OPR-05 — Service Steward |
| Protected center A | Prototyping, product experimentation, iterative validation. |
| Protected center B | ITSM, support quality, service acceptance, knowledge continuity. |
| Boundary distinction | O5 supports live service; B2 prototypes to learn. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-BLD-02 and CRW-OPR-05; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Prototype Spark and Service Steward from one artifact that only proves "O5 supports live service; B2 prototypes to learn." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### B2↔P5 — Prototype Spark / Crimson Validator

| Field | Value |
|-------|-------|
| Pair key | B2↔P5 |
| Lineage A | CRW-BLD-02 — Prototype Spark |
| Lineage B | CRW-PRT-05 — Crimson Validator |
| Protected center A | Prototyping, product experimentation, iterative validation. |
| Protected center B | Authorized adversarial testing, validation, remediation retest. |
| Boundary distinction | B2 tests product hypotheses; P5 tests defenses adversarially under authorization. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-BLD-02 and CRW-PRT-05; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Prototype Spark and Crimson Validator from one artifact that only proves "B2 tests product hypotheses; P5 tests defenses adversarially under authorization." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### B3↔L2 — Systems Crafter / Mission Commander

| Field | Value |
|-------|-------|
| Pair key | B3↔L2 |
| Lineage A | CRW-BLD-03 — Systems Crafter |
| Lineage B | CRW-LED-02 — Mission Commander |
| Protected center A | Infrastructure/system integration, cloud/hardware/embedded construction. |
| Protected center B | Project/program/mission command and accountable delivery. |
| Boundary distinction | B3 delivers technical integration; L2 directs accountable mission delivery. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-BLD-03 and CRW-LED-02; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Systems Crafter and Mission Commander from one artifact that only proves "B3 delivers technical integration; L2 directs accountable mission delivery." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### B3↔O3 — Systems Crafter / Recovery Smith

| Field | Value |
|-------|-------|
| Pair key | B3↔O3 |
| Lineage A | CRW-BLD-03 — Systems Crafter |
| Lineage B | CRW-OPR-03 — Recovery Smith |
| Protected center A | Infrastructure/system integration, cloud/hardware/embedded construction. |
| Protected center B | Incident/problem diagnosis, failover, continuity restoration. |
| Boundary distinction | O3 restores after failure; B3 constructs/integrates systems. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-BLD-03 and CRW-OPR-03; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Systems Crafter and Recovery Smith from one artifact that only proves "O3 restores after failure; B3 constructs/integrates systems." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### B3↔P4 — Systems Crafter / Crisis Guardian

| Field | Value |
|-------|-------|
| Pair key | B3↔P4 |
| Lineage A | CRW-BLD-03 — Systems Crafter |
| Lineage B | CRW-PRT-04 — Crisis Guardian |
| Protected center A | Infrastructure/system integration, cloud/hardware/embedded construction. |
| Protected center B | Containment, incident response, cyber recovery, resilience. |
| Boundary distinction | B3 builds systems; P4 contains security crises. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-BLD-03 and CRW-PRT-04; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Systems Crafter and Crisis Guardian from one artifact that only proves "B3 builds systems; P4 contains security crises." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### B4↔L1 — Network Weaver / Formation Guide

| Field | Value |
|-------|-------|
| Pair key | B4↔L1 |
| Lineage A | CRW-BLD-04 — Network Weaver |
| Lineage B | CRW-LED-01 — Formation Guide |
| Protected center A | APIs, interfaces, distributed systems, integration contracts. |
| Protected center B | Mentoring, learning, enablement, community capability growth. |
| Boundary distinction | B4 builds technical interfaces; L1 grows people capability. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-BLD-04 and CRW-LED-01; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Network Weaver and Formation Guide from one artifact that only proves "B4 builds technical interfaces; L1 grows people capability." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### B4↔L3 — Network Weaver / Quiet Coordinator

| Field | Value |
|-------|-------|
| Pair key | B4↔L3 |
| Lineage A | CRW-BLD-04 — Network Weaver |
| Lineage B | CRW-LED-03 — Quiet Coordinator |
| Protected center A | APIs, interfaces, distributed systems, integration contracts. |
| Protected center B | Product/service/stakeholder/cross-team coordination. |
| Boundary distinction | B4 connects systems; L3 aligns human dependencies. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-BLD-04 and CRW-LED-03; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Network Weaver and Quiet Coordinator from one artifact that only proves "B4 connects systems; L3 aligns human dependencies." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### B4↔O2 — Network Weaver / Flow Navigator

| Field | Value |
|-------|-------|
| Pair key | B4↔O2 |
| Lineage A | CRW-BLD-04 — Network Weaver |
| Lineage B | CRW-OPR-02 — Flow Navigator |
| Protected center A | APIs, interfaces, distributed systems, integration contracts. |
| Protected center B | Routing, live path operations, connectivity, and traffic performance. |
| Boundary distinction | O2 operates movement on existing paths; B4 creates/integrates connection interfaces. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-BLD-04 and CRW-OPR-02; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Network Weaver and Flow Navigator from one artifact that only proves "O2 operates movement on existing paths; B4 creates/integrates connection interfaces." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### B4↔P1 — Network Weaver / Azure Watcher

| Field | Value |
|-------|-------|
| Pair key | B4↔P1 |
| Lineage A | CRW-BLD-04 — Network Weaver |
| Lineage B | CRW-PRT-01 — Azure Watcher |
| Protected center A | APIs, interfaces, distributed systems, integration contracts. |
| Protected center B | Security monitoring, detection, defensive visibility. |
| Boundary distinction | B4 creates technical connections; P1 maintains defensive detection. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-BLD-04 and CRW-PRT-01; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Network Weaver and Azure Watcher from one artifact that only proves "B4 creates technical connections; P1 maintains defensive detection." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### B5↔L4 — Silent Architect / Systems Governor

| Field | Value |
|-------|-------|
| Pair key | B5↔L4 |
| Lineage A | CRW-BLD-05 — Silent Architect |
| Lineage B | CRW-LED-04 — Systems Governor |
| Protected center A | Software quality, implementation precision, performance, high-assurance design. |
| Protected center B | GRC, risk, compliance, quality assurance governance. |
| Boundary distinction | B5 produces quality artifacts; L4 sets assurance governance. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-BLD-05 and CRW-LED-04; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Silent Architect and Systems Governor from one artifact that only proves "B5 produces quality artifacts; L4 sets assurance governance." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### B5↔O1 — Silent Architect / Rhythm Keeper

| Field | Value |
|-------|-------|
| Pair key | B5↔O1 |
| Lineage A | CRW-BLD-05 — Silent Architect |
| Lineage B | CRW-OPR-01 — Rhythm Keeper |
| Protected center A | Software quality, implementation precision, performance, high-assurance design. |
| Protected center B | Availability, performance, observability, and continuous reliability measurement. |
| Boundary distinction | O1 measures live reliability; B5 delivers high-assurance implementation quality. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-BLD-05 and CRW-OPR-01; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Silent Architect and Rhythm Keeper from one artifact that only proves "O1 measures live reliability; B5 delivers high-assurance implementation quality." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### B5↔P3 — Silent Architect / Trace Hunter

| Field | Value |
|-------|-------|
| Pair key | B5↔P3 |
| Lineage A | CRW-BLD-05 — Silent Architect |
| Lineage B | CRW-PRT-03 — Trace Hunter |
| Protected center A | Software quality, implementation precision, performance, high-assurance design. |
| Protected center B | Threat hunting, investigation, forensic tracing. |
| Boundary distinction | B5 hardens implementation quality; P3 follows security traces. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-BLD-05 and CRW-PRT-03; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Silent Architect and Trace Hunter from one artifact that only proves "B5 hardens implementation quality; P3 follows security traces." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### L1↔O5 — Formation Guide / Service Steward

| Field | Value |
|-------|-------|
| Pair key | L1↔O5 |
| Lineage A | CRW-LED-01 — Formation Guide |
| Lineage B | CRW-OPR-05 — Service Steward |
| Protected center A | Mentoring, learning, enablement, community capability growth. |
| Protected center B | ITSM, support quality, service acceptance, knowledge continuity. |
| Boundary distinction | O5 resolves service needs; L1 develops people and community capability. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-LED-01 and CRW-OPR-05; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Formation Guide and Service Steward from one artifact that only proves "O5 resolves service needs; L1 develops people and community capability." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### L1↔P5 — Formation Guide / Crimson Validator

| Field | Value |
|-------|-------|
| Pair key | L1↔P5 |
| Lineage A | CRW-LED-01 — Formation Guide |
| Lineage B | CRW-PRT-05 — Crimson Validator |
| Protected center A | Mentoring, learning, enablement, community capability growth. |
| Protected center B | Authorized adversarial testing, validation, remediation retest. |
| Boundary distinction | P5 validates defenses; L1 develops people. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-LED-01 and CRW-PRT-05; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Formation Guide and Crimson Validator from one artifact that only proves "P5 validates defenses; L1 develops people." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### L2↔L5 — Mission Commander / Horizon Pathfinder

| Field | Value |
|-------|-------|
| Pair key | L2↔L5 |
| Lineage A | CRW-LED-02 — Mission Commander |
| Lineage B | CRW-LED-05 — Horizon Pathfinder |
| Protected center A | Project/program/mission command and accountable delivery. |
| Protected center B | Strategy, innovation, foresight, adaptive direction. |
| Boundary distinction | L2 executes active objectives; L5 chooses/adapts future direction. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-LED-02 and CRW-LED-05; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Mission Commander and Horizon Pathfinder from one artifact that only proves "L2 executes active objectives; L5 chooses/adapts future direction." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### L2↔O1 — Mission Commander / Rhythm Keeper

| Field | Value |
|-------|-------|
| Pair key | L2↔O1 |
| Lineage A | CRW-LED-02 — Mission Commander |
| Lineage B | CRW-OPR-01 — Rhythm Keeper |
| Protected center A | Project/program/mission command and accountable delivery. |
| Protected center B | Availability, performance, observability, and continuous reliability measurement. |
| Boundary distinction | L2 directs delivery; O1 runs system health rhythm. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-LED-02 and CRW-OPR-01; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Mission Commander and Rhythm Keeper from one artifact that only proves "L2 directs delivery; O1 runs system health rhythm." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### L2↔P1 — Mission Commander / Azure Watcher

| Field | Value |
|-------|-------|
| Pair key | L2↔P1 |
| Lineage A | CRW-LED-02 — Mission Commander |
| Lineage B | CRW-PRT-01 — Azure Watcher |
| Protected center A | Project/program/mission command and accountable delivery. |
| Protected center B | Security monitoring, detection, defensive visibility. |
| Boundary distinction | P1 provides defensive awareness; L2 directs missions. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-LED-02 and CRW-PRT-01; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Mission Commander and Azure Watcher from one artifact that only proves "P1 provides defensive awareness; L2 directs missions." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### L3↔O1 — Quiet Coordinator / Rhythm Keeper

| Field | Value |
|-------|-------|
| Pair key | L3↔O1 |
| Lineage A | CRW-LED-03 — Quiet Coordinator |
| Lineage B | CRW-OPR-01 — Rhythm Keeper |
| Protected center A | Product/service/stakeholder/cross-team coordination. |
| Protected center B | Availability, performance, observability, and continuous reliability measurement. |
| Boundary distinction | O1 synchronizes technical health; L3 synchronizes people and dependencies. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-LED-03 and CRW-OPR-01; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Quiet Coordinator and Rhythm Keeper from one artifact that only proves "O1 synchronizes technical health; L3 synchronizes people and dependencies." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### L3↔O2 — Quiet Coordinator / Flow Navigator

| Field | Value |
|-------|-------|
| Pair key | L3↔O2 |
| Lineage A | CRW-LED-03 — Quiet Coordinator |
| Lineage B | CRW-OPR-02 — Flow Navigator |
| Protected center A | Product/service/stakeholder/cross-team coordination. |
| Protected center B | Routing, live path operations, connectivity, and traffic performance. |
| Boundary distinction | O2 moves technical traffic; L3 coordinates stakeholder dependencies. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-LED-03 and CRW-OPR-02; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Quiet Coordinator and Flow Navigator from one artifact that only proves "O2 moves technical traffic; L3 coordinates stakeholder dependencies." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### L3↔O5 — Quiet Coordinator / Service Steward

| Field | Value |
|-------|-------|
| Pair key | L3↔O5 |
| Lineage A | CRW-LED-03 — Quiet Coordinator |
| Lineage B | CRW-OPR-05 — Service Steward |
| Protected center A | Product/service/stakeholder/cross-team coordination. |
| Protected center B | ITSM, support quality, service acceptance, knowledge continuity. |
| Boundary distinction | O5 closes service cases; L3 aligns multi-stakeholder dependencies. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-LED-03 and CRW-OPR-05; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Quiet Coordinator and Service Steward from one artifact that only proves "O5 closes service cases; L3 aligns multi-stakeholder dependencies." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### L3↔P4 — Quiet Coordinator / Crisis Guardian

| Field | Value |
|-------|-------|
| Pair key | L3↔P4 |
| Lineage A | CRW-LED-03 — Quiet Coordinator |
| Lineage B | CRW-PRT-04 — Crisis Guardian |
| Protected center A | Product/service/stakeholder/cross-team coordination. |
| Protected center B | Containment, incident response, cyber recovery, resilience. |
| Boundary distinction | P4 drives secure containment; L3 coordinates dependencies without crisis command. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-LED-03 and CRW-PRT-04; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Quiet Coordinator and Crisis Guardian from one artifact that only proves "P4 drives secure containment; L3 coordinates dependencies without crisis command." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### L4↔O3 — Systems Governor / Recovery Smith

| Field | Value |
|-------|-------|
| Pair key | L4↔O3 |
| Lineage A | CRW-LED-04 — Systems Governor |
| Lineage B | CRW-OPR-03 — Recovery Smith |
| Protected center A | GRC, risk, compliance, quality assurance governance. |
| Protected center B | Incident/problem diagnosis, failover, continuity restoration. |
| Boundary distinction | O3 executes restoration; L4 governs risk/control obligations. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-LED-04 and CRW-OPR-03; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Systems Governor and Recovery Smith from one artifact that only proves "O3 executes restoration; L4 governs risk/control obligations." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### L4↔P2 — Systems Governor / Boundary Warden

| Field | Value |
|-------|-------|
| Pair key | L4↔P2 |
| Lineage A | CRW-LED-04 — Systems Governor |
| Lineage B | CRW-PRT-02 — Boundary Warden |
| Protected center A | GRC, risk, compliance, quality assurance governance. |
| Protected center B | IAM, hardening, security architecture, least privilege. |
| Boundary distinction | P2 enforces technical access boundaries; L4 governs risk/control obligations. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-LED-04 and CRW-PRT-02; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Systems Governor and Boundary Warden from one artifact that only proves "P2 enforces technical access boundaries; L4 governs risk/control obligations." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### L5↔O4 — Horizon Pathfinder / Automation Conductor

| Field | Value |
|-------|-------|
| Pair key | L5↔O4 |
| Lineage A | CRW-LED-05 — Horizon Pathfinder |
| Lineage B | CRW-OPR-04 — Automation Conductor |
| Protected center A | Strategy, innovation, foresight, adaptive direction. |
| Protected center B | Scripting, orchestration, IaC, and repeatable operations with human control. |
| Boundary distinction | O4 automates recurring work; L5 chooses transformation direction. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-LED-05 and CRW-OPR-04; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Horizon Pathfinder and Automation Conductor from one artifact that only proves "O4 automates recurring work; L5 chooses transformation direction." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### L5↔P3 — Horizon Pathfinder / Trace Hunter

| Field | Value |
|-------|-------|
| Pair key | L5↔P3 |
| Lineage A | CRW-LED-05 — Horizon Pathfinder |
| Lineage B | CRW-PRT-03 — Trace Hunter |
| Protected center A | Strategy, innovation, foresight, adaptive direction. |
| Protected center B | Threat hunting, investigation, forensic tracing. |
| Boundary distinction | P3 derives threat direction from traces; L5 chooses strategic futures. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-LED-05 and CRW-PRT-03; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Horizon Pathfinder and Trace Hunter from one artifact that only proves "P3 derives threat direction from traces; L5 chooses strategic futures." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### O1↔O3 — Rhythm Keeper / Recovery Smith

| Field | Value |
|-------|-------|
| Pair key | O1↔O3 |
| Lineage A | CRW-OPR-01 — Rhythm Keeper |
| Lineage B | CRW-OPR-03 — Recovery Smith |
| Protected center A | Availability, performance, observability, and continuous reliability measurement. |
| Protected center B | Incident/problem diagnosis, failover, continuity restoration. |
| Boundary distinction | O1 sustains/quantifies reliability continuously; O3 specializes in fault isolation and restoration. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-OPR-01 and CRW-OPR-03; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Rhythm Keeper and Recovery Smith from one artifact that only proves "O1 sustains/quantifies reliability continuously; O3 specializes in fault isolation and restoration." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### O1↔P1 — Rhythm Keeper / Azure Watcher

| Field | Value |
|-------|-------|
| Pair key | O1↔P1 |
| Lineage A | CRW-OPR-01 — Rhythm Keeper |
| Lineage B | CRW-PRT-01 — Azure Watcher |
| Protected center A | Availability, performance, observability, and continuous reliability measurement. |
| Protected center B | Security monitoring, detection, defensive visibility. |
| Boundary distinction | O1 observes general service health; P1 detects defensive security signals. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-OPR-01 and CRW-PRT-01; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Rhythm Keeper and Azure Watcher from one artifact that only proves "O1 observes general service health; P1 detects defensive security signals." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### O2↔P2 — Flow Navigator / Boundary Warden

| Field | Value |
|-------|-------|
| Pair key | O2↔P2 |
| Lineage A | CRW-OPR-02 — Flow Navigator |
| Lineage B | CRW-PRT-02 — Boundary Warden |
| Protected center A | Routing, live path operations, connectivity, and traffic performance. |
| Protected center B | IAM, hardening, security architecture, least privilege. |
| Boundary distinction | O2 handles flow; P2 decides and assures access boundaries. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-OPR-02 and CRW-PRT-02; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Flow Navigator and Boundary Warden from one artifact that only proves "O2 handles flow; P2 decides and assures access boundaries." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### O3↔O5 — Recovery Smith / Service Steward

| Field | Value |
|-------|-------|
| Pair key | O3↔O5 |
| Lineage A | CRW-OPR-03 — Recovery Smith |
| Lineage B | CRW-OPR-05 — Service Steward |
| Protected center A | Incident/problem diagnosis, failover, continuity restoration. |
| Protected center B | ITSM, support quality, service acceptance, knowledge continuity. |
| Boundary distinction | O5 handles service requests/experience; O3 restores technical continuity in failures. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-OPR-03 and CRW-OPR-05; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Recovery Smith and Service Steward from one artifact that only proves "O5 handles service requests/experience; O3 restores technical continuity in failures." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### O3↔P4 — Recovery Smith / Crisis Guardian

| Field | Value |
|-------|-------|
| Pair key | O3↔P4 |
| Lineage A | CRW-OPR-03 — Recovery Smith |
| Lineage B | CRW-PRT-04 — Crisis Guardian |
| Protected center A | Incident/problem diagnosis, failover, continuity restoration. |
| Protected center B | Containment, incident response, cyber recovery, resilience. |
| Boundary distinction | O3 restores technical service/continuity; P4 contains cyber harm and enables secure recovery. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-OPR-03 and CRW-PRT-04; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Recovery Smith and Crisis Guardian from one artifact that only proves "O3 restores technical service/continuity; P4 contains cyber harm and enables secure recovery." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### O4↔P5 — Automation Conductor / Crimson Validator

| Field | Value |
|-------|-------|
| Pair key | O4↔P5 |
| Lineage A | CRW-OPR-04 — Automation Conductor |
| Lineage B | CRW-PRT-05 — Crimson Validator |
| Protected center A | Scripting, orchestration, IaC, and repeatable operations with human control. |
| Protected center B | Authorized adversarial testing, validation, remediation retest. |
| Boundary distinction | O4 automates operations; P5 adversarially tests defenses under authorization. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-OPR-04 and CRW-PRT-05; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Automation Conductor and Crimson Validator from one artifact that only proves "O4 automates operations; P5 adversarially tests defenses under authorization." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

### O5↔P3 — Service Steward / Trace Hunter

| Field | Value |
|-------|-------|
| Pair key | O5↔P3 |
| Lineage A | CRW-OPR-05 — Service Steward |
| Lineage B | CRW-PRT-03 — Trace Hunter |
| Protected center A | ITSM, support quality, service acceptance, knowledge continuity. |
| Protected center B | Threat hunting, investigation, forensic tracing. |
| Boundary distinction | P3 pursues threat trails; O5 operates service cases. |
| Handoff A → B | When Evidence outcome is owned by B's protected center, close A attribution path and open B evaluation; do not dual-award from one outcome. |
| Handoff B → A | When Evidence outcome is owned by A's protected center, close B attribution path and open A evaluation; do not dual-award from one outcome. |
| Prohibited responsibility overlap | Claiming both Lineages from a single artifact that only demonstrates one protected center. |
| Evidence attribution rule | Attribute only to the Lineage whose protected center the demonstrated outcome satisfies; require separate Evidence for the other. |
| Mastery attribution rule | Same ownership rule as Evidence; cite FRM-MST-* only. |
| Distinguishing acceptance test | Given Evidence of an activity matching only one protected center; When evaluated against CRW-OPR-05 and CRW-PRT-03; Then only the owning Lineage receives attribution; And the other receives none. |
| Failure example | Awarding both Service Steward and Trace Hunter from one artifact that only proves "P3 pursues threat trails; O5 operates service cases." for a single center. |
| 1B status inherited | **RESOLVED** |
| 1C handoff status | **RESOLVED** |

## Closure count

| Metric | Value |
|--------|-------|
| Critical pairs with handoff grammar | 60 |
| Unresolved critical collisions | **0** |
