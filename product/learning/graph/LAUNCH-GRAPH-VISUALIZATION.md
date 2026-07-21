# Launch Graph Visualization (Conceptual)

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-GRAPH-VIS-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED — PENDING 1D LOCK |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Related** | [LAUNCH-GRAPH-REGISTRY.md](./LAUNCH-GRAPH-REGISTRY.md) · [LAUNCH-GRAPH-EDGE-MATRIX.md](./LAUNCH-GRAPH-EDGE-MATRIX.md) |
| **Limitations** | Mermaid is conceptual display only — not executable validation |
| **Change history** | 1.0.0 — LEARNING.1B |

## Layer reminder

```text
Learning Graph  ≠  Progress Graph  ≠  Entitlement Graph
```

This diagram shows **Learning Graph** structure only. Plans, Merit, and concurrency slots are excluded.

## Portfolio overview

```mermaid
flowchart TB
  W[WRLD-GHV-001]
  N[Nest / FOUNDATION_LAYER]
  W --> N

  N --> OPR[RT-OPR-001 Cloud Ops]
  N --> BLD[RT-BLD-001 Web Delivery]
  N --> PRT[RT-PRT-001 Defensive Ops]
  N --> LED[RT-LED-001 Delivery and Risk]
  N -.->|CAPACITY CONDITIONAL| ANL[RT-ANL-001 Data Analysis RESERVE]

  OPR -->|SECURE_EXTENSION| SEX[SEX-001 Secure Cloud Ops]
  BLD -->|CONVERGENCE| CXW[CXW-001 Secure App Delivery]
  PRT -->|CONVERGENCE| CXW
  BRG[BRG-PRT-BLD-01 AppSec Bridge] -->|BRIDGE| CXW
  PRT --> BRG
  LED -.->|RECOMMENDED release-risk| CXW
```

## P0 Stage chains (simplified)

```mermaid
flowchart LR
  subgraph OPR[RT-OPR-001]
    O1[STG-01] --> O2[STG-02] --> O3[STG-03] --> O4[STG-04] --> O5[STG-05] --> OC[CAP-01]
  end
  subgraph BLD[RT-BLD-001]
    B1[STG-01] --> B2[STG-02] --> B3[STG-03] --> B4[STG-04] --> B5[STG-05] --> BC[CAP-01]
  end
  subgraph PRT[RT-PRT-001]
    P1[STG-01] --> P2[STG-02] --> P3[STG-03] --> P4[STG-04] --> P5[STG-05] --> PC[CAP-01]
  end
  subgraph LED[RT-LED-001]
    L1[STG-01] --> L2[STG-02] --> L3[STG-03] --> L4[STG-04] --> L5[STG-05] --> LC[CAP-01]
  end
```

## Cross-Wing and Secure Extension

```mermaid
flowchart TB
  BLD[RT-BLD-001 Proven path] --> CXW
  PRT[RT-PRT-001 Proven path] --> CXW
  BRG[BRG-PRT-BLD-01] --> CXW
  CXW[CXW-001] --> C1[STG-01] --> C2[STG-02] --> C3[STG-03 Integration] --> C4[STG-04 Release] --> CC[CAP-01]

  OPR[RT-OPR-001] -->|SECURE_EXTENSION| SEX
  SEX[SEX-001] --> S1[STG-01] --> S2[STG-02] --> S3[STG-03] --> S4[STG-04] --> SC[CAP-01]
```

## Graph layer separation (conceptual)

```mermaid
flowchart LR
  LG[Learning Graph\nwhat connects / prerequisites]
  PG[Progress Graph\nwhat user completed]
  EG[Entitlement Graph\nwhat user may activate]
  LG -.->|eligibility input| ACCESS[Final Access Decision]
  PG -.->|governed satisfaction| LG
  EG -.->|entitlement input| ACCESS
```

Exact counts: [LAUNCH-GRAPH-REGISTRY.md](./LAUNCH-GRAPH-REGISTRY.md).
