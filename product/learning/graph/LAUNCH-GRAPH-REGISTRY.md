# Launch Graph Registry

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-GRAPH-REG-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED — PENDING 1D LOCK |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Related** | [LAUNCH-GRAPH-EDGE-MATRIX.md](./LAUNCH-GRAPH-EDGE-MATRIX.md) · [GRAPH-INVARIANTS.md](./GRAPH-INVARIANTS.md) · [LEARNING-IDENTIFIER-STANDARD.md](../architecture/LEARNING-IDENTIFIER-STANDARD.md) |
| **Limitations** | Conceptual registry only — no runtime graph, no DB schema |
| **Unresolved** | Mission expansion (1C); expert review; 1D lock |
| **Change history** | 1.0.0 — LEARNING.1B |

Exact counts (authoritative for 1B). No approximate `~` values.

## Nodes by type

| Node type | Count | Notes |
|-----------|------:|-------|
| WORLD | 1 | WRLD-GHV-001 |
| FOUNDATION_LAYER | 1 | Nest |
| FOUNDATION_CAPABILITY | 13 | NST-CAP-001..013 |
| HORIZON | 5 | HRZ-OPR/BLD/ANL/PRT/LED |
| ROUTE | 5 | RT-OPR/BLD/PRT/LED/ANL-001 (ANL reserve) |
| CROSS_WING_ROUTE | 1 | CXW-001 |
| SECURE_EXTENSION | 1 | SEX-001 |
| STAGE | 33 | 5×5 Routes + 4 CXW + 4 SEX |
| MISSION_PLACEHOLDER | 33 | one placeholder per Stage (architecture only) |
| ASSESSMENT_ANCHOR | 7 | one per Route/CXW/SEX (conceptual) |
| EVIDENCE_ANCHOR | 24 | see Evidence Anchor Registry |
| CAPSTONE | 7 | one per Route/CXW/SEX |
| BRIDGE | 8 | 7 Nest→Route/CXW/SEX + BRG-PRT-BLD-01 |
| REMEDIATION | 6 | Nest Micro-Mission + Stage gap categories |
| UNLOCK | 9 | ULK launch set (see Unlock Registry) |
| CAPABILITY (shared) | 12 | SHC-001..012 |
| **Total nodes** | **166** | |

## Edges by type (mandatory + recommended launch set)

| Edge type | Count |
|-----------|------:|
| PREREQUISITE | 48 |
| COREQUISITE | 8 |
| RECOMMENDED | 14 |
| EQUIVALENT | 0 |
| BRIDGE | 8 |
| SECURE_EXTENSION | 1 |
| CONVERGENCE | 2 |
| UNLOCKS | 18 |
| EVIDENCE_FOR | 24 |
| REMEDIATES | 6 |
| **Total edges** | **129** |

## Portfolio construct counts

| Construct | Count |
|-----------|------:|
| P0 Routes | 4 |
| Launch reserve Routes | 1 |
| Cross-Wing | 1 |
| Secure Extension | 1 |
| Stages (P0 only) | 20 |
| Stages (all including reserve+CXW+SEX) | 33 |
| Capstones | 7 |
| Bridges | 8 |
| Remediation nodes | 6 |
| Unlocks (registry) | 9 |

## Manual invariant checks (1B)

| Check | Result |
|-------|--------|
| Mandatory PREREQUISITE DAG (Nest→Routes→Stages→CXW/SEX) | **Pass — acyclic** |
| Each Route one primary Horizon | **Pass** |
| CXW ≥2 Horizon sources | **Pass** (BUILD+PROTECT; LEAD release-risk contribution) |
| SEX attached to source Route | **Pass** (RT-OPR-001) |
| SEX ≠ full PROTECT Route | **Pass** |
| No entitlement in Learning Graph docs | **Pass** |
| Horizon-Proven not awardable from one Route | **Pass** |
| No element status LOCKED | **Pass** |

Details: [LAUNCH-GRAPH-EDGE-MATRIX.md](./LAUNCH-GRAPH-EDGE-MATRIX.md) · [LAUNCH-GRAPH-VISUALIZATION.md](./LAUNCH-GRAPH-VISUALIZATION.md)
