# Technical Validation Dependency Graph

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARC-VAL-DEP-GRAPH-001 |
| **Version** | 1.0.0 |
| **Status** | **VALIDATION PLAN** |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.ARCHITECTURE.1A §44 |
| **Last updated** | 2026-07-21 |
| **Related** | [TECHNICAL-SPIKE-REGISTRY.md](./TECHNICAL-SPIKE-REGISTRY.md) · [TECHNICAL-SPIKE-PRIORITY-MATRIX.md](./TECHNICAL-SPIKE-PRIORITY-MATRIX.md) |

```text
Technical Spikes Run = 0
Graph is Gate-level planning only
Acyclic at Gate level by construction
```

## Purpose

Show Gate-level dependencies among architecture programme stages, stack decisions, and spike clusters without creating circular evidence requirements.

## Gate-level programme (acyclic)

```mermaid
flowchart TD
  BC1[GHV.BASELINE-CORRECTION.1 PASS]
  A1A[GHV.ARCHITECTURE.1A Validation Plan LOCKED]
  A1B[GHV.ARCHITECTURE.1B Stack Decisions]
  A1C[GHV.ARCHITECTURE.1C Identity Security Data Evidence]
  A1D[GHV.ARCHITECTURE.1D Runtime Realtime Integration Ops]
  A1E[GHV.ARCHITECTURE.1E Spikes Reconciliation Baseline Lock]
  PC[Product Code Authorization]
  BC1 --> A1A
  A1A --> A1B
  A1B --> A1C
  A1C --> A1D
  A1D --> A1E
  A1E --> PC
```

## Spike clusters and decision dependencies

```mermaid
flowchart LR
  subgraph P0[P0 before stack lock]
    S001[SPK-ARC-001 Framework]
    S003[SPK-ARC-003 Auth activation]
    S005[SPK-ARC-005 Learning Graph]
    S010[SPK-ARC-010 Event idempotency]
    S011[SPK-ARC-011 Formula versions]
    S021[SPK-ARC-021 Env isolation]
  end

  subgraph Stack[1B stack decisions PENDING]
    STK[Candidate stack ADRs]
  end

  subgraph P1[P1 before implementation]
    S002[SPK-ARC-002 RTL]
    S004[SPK-ARC-004 92 routing]
    S006[SPK-ARC-006 Save resume]
    S007[SPK-ARC-007 Evidence storage]
    S009[SPK-ARC-009 Targeted recalc]
    S012[SPK-ARC-012 Webhooks]
    S013[SPK-ARC-013 Trust moderation]
    S019[SPK-ARC-019 Audit correction]
  end

  subgraph Later[P2 P3 launch and conditional]
    S008[SPK-ARC-008 Scanning]
    S014[SPK-ARC-014 Live channels]
    S015[SPK-ARC-015 Reconnect]
    S016[SPK-ARC-016 Arabic search]
    S017[SPK-ARC-017 A11y]
    S018[SPK-ARC-018 Notifications]
    S020[SPK-ARC-020 Backup]
    S022[SPK-ARC-022 Observability]
    S023[SPK-ARC-023 Skyboard perf]
    S024[SPK-ARC-024 Leaderboards]
    S025[SPK-ARC-025 Minor profile]
  end

  S001 --> STK
  S005 --> STK
  S021 --> STK
  STK --> S003
  STK --> S002
  STK --> S004
  STK --> S006
  STK --> S007
  S010 --> S009
  S011 --> S009
  S010 --> S012
  S010 --> S019
  S003 --> S013
  S007 --> S008
  S014 --> S015
  S013 --> S024
  S013 --> S025
  S021 --> S020
  S021 --> S022
  S004 --> S023
```

## Domain dependency notes

| Dependency class | Depends on | Feeds |
|------------------|------------|-------|
| **Identity** | SPK-ARC-001 · stack candidates | SPK-ARC-003 · 013 · 025 |
| **Data / Learning Graph** | SPK-ARC-005 · no graph-DB-by-name | Mission runtime · unlock engine |
| **Progression** | SPK-ARC-010 · 011 | SPK-ARC-009 · 012 · 019 · 020 |
| **Evidence / security** | SPK-ARC-007 | SPK-ARC-008 · 009 |
| **Live Sky** | stack + SPK-ARC-014 | SPK-ARC-015 |
| **Deployment** | SPK-ARC-021 · TECH-018 | Preview/prod ops · observability |
| **Security** | threat models (planned) | All sensitive ADRs |

## Circular-evidence resolution rules

If a circular evidence dependency appears:

1. **Split** the spike into a neutral prior harness and a dependent experiment.
2. Use a **temporary neutral harness** that does not presuppose the contested ADR.
3. **Defer** the decision to the next Gate with an explicit assumption ID.
4. Record a **minimal prior assumption** in the Architecture Assumption Register (not mitigated by plan alone).

## Explicit non-claims

```text
Graph ≠ executed validation
No spike evidence yet
No ACCEPTED stack
Product Code BLOCKED
```

## Change history

| Version | Date | Change |
|---------|------|--------|
| 1.0.0 | 2026-07-21 | GHV.ARCHITECTURE.1A §44 — Gate-level acyclic dependency graph |
