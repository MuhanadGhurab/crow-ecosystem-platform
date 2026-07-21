# Launch Graph Edge Matrix

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-GRAPH-EDGE-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED — PENDING 1D LOCK |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Related** | [LAUNCH-GRAPH-REGISTRY.md](./LAUNCH-GRAPH-REGISTRY.md) · [EDGE-TYPE-RULES.md](./EDGE-TYPE-RULES.md) · [GRAPH-INVARIANTS.md](./GRAPH-INVARIANTS.md) |
| **Limitations** | Conceptual; not exhaustive of every Stage→Stage RECOMMENDED edge |
| **Unresolved** | 1C Mission edges; EQUIVALENT recognition policy |
| **Change history** | 1.0.0 — LEARNING.1B |

Status values: `PROPOSED` · `REVIEWED` · `ARCHITECTURE RECOMMENDED` · `CONDITIONAL` · `DEFERRED`  
No edge is `LOCKED` until GHV.LEARNING.1D.

## Mandatory Nest → Route PREREQUISITE (representative set)

| Edge ID | Source | Target | Type | Mandatory | Rationale | User-facing reason | Source doc | Review |
|---------|--------|--------|------|-----------|-----------|-------------------|------------|--------|
| E-NST-OPR-01 | NST-CAP-001 | RT-OPR-001 | PREREQUISITE | Yes | Devices/OS basics for ops | Learn device basics before Cloud Ops | Nest bridge map | ARCHITECTURE RECOMMENDED |
| E-NST-OPR-02 | NST-CAP-005 | RT-OPR-001 | PREREQUISITE | Yes | Accounts/passwords | Secure account habits before cloud identity | Nest bridge map | ARCHITECTURE RECOMMENDED |
| E-NST-OPR-03 | NST-CAP-006 | RT-OPR-001 | PREREQUISITE | Yes | MFA | MFA before cloud access patterns | Nest bridge map | ARCHITECTURE RECOMMENDED |
| E-NST-OPR-04 | NST-CAP-007 | RT-OPR-001 | PREREQUISITE | Yes | Connectivity | Network basics before ops networking | Nest bridge map | ARCHITECTURE RECOMMENDED |
| E-NST-OPR-05 | NST-CAP-012 | RT-OPR-001 | PREREQUISITE | Yes | Troubleshooting | Guided troubleshooting before ops labs | Nest bridge map | ARCHITECTURE RECOMMENDED |
| E-NST-BLD-01 | NST-CAP-002 | RT-BLD-001 | PREREQUISITE | Yes | Apps/permissions | App permissions before delivery | Nest bridge map | ARCHITECTURE RECOMMENDED |
| E-NST-BLD-02 | NST-CAP-003 | RT-BLD-001 | PREREQUISITE | Yes | Browser/search | Browser literacy before web delivery | Nest bridge map | ARCHITECTURE RECOMMENDED |
| E-NST-BLD-03 | NST-CAP-004 | RT-BLD-001 | PREREQUISITE | Yes | Files/cloud | File hygiene before repos | Nest bridge map | ARCHITECTURE RECOMMENDED |
| E-NST-BLD-04 | NST-CAP-011 | RT-BLD-001 | PREREQUISITE | Yes | Collaboration | Collaboration before team delivery | Nest bridge map | ARCHITECTURE RECOMMENDED |
| E-NST-PRT-01 | NST-CAP-005 | RT-PRT-001 | PREREQUISITE | Yes | Accounts | Account safety before defensive ops | Nest bridge map | ARCHITECTURE RECOMMENDED |
| E-NST-PRT-02 | NST-CAP-006 | RT-PRT-001 | PREREQUISITE | Yes | MFA | MFA before security ops | Nest bridge map | ARCHITECTURE RECOMMENDED |
| E-NST-PRT-03 | NST-CAP-008 | RT-PRT-001 | PREREQUISITE | Yes | Privacy | Privacy before SOC workflows | Nest bridge map | ARCHITECTURE RECOMMENDED |
| E-NST-PRT-04 | NST-CAP-009 | RT-PRT-001 | PREREQUISITE | Yes | Scams/safety | Online safety before triage | Nest bridge map | ARCHITECTURE RECOMMENDED |
| E-NST-PRT-05 | NST-CAP-013 | RT-PRT-001 | PREREQUISITE | Yes | Digital identity | Identity hygiene before protect | Nest bridge map | ARCHITECTURE RECOMMENDED |
| E-NST-LED-01 | NST-CAP-011 | RT-LED-001 | PREREQUISITE | Yes | Collaboration | Collaboration before delivery leadership | Nest bridge map | ARCHITECTURE RECOMMENDED |
| E-NST-LED-02 | NST-CAP-010 | RT-LED-001 | PREREQUISITE | Yes | AI literacy | Responsible AI before LEAD tooling | Nest bridge map | ARCHITECTURE RECOMMENDED |
| E-NST-ANL-01 | NST-CAP-003 | RT-ANL-001 | PREREQUISITE | Yes | Search literacy | Search before data questions | Nest bridge map | CONDITIONAL |
| E-NST-ANL-02 | NST-CAP-004 | RT-ANL-001 | PREREQUISITE | Yes | Files | File basics before datasets | Nest bridge map | CONDITIONAL |
| E-NST-ANL-03 | NST-CAP-008 | RT-ANL-001 | PREREQUISITE | Yes | Privacy | Privacy before data handling | Nest bridge map | CONDITIONAL |

## Route Stage sequence PREREQUISITE (P0 + reserve)

| Edge ID | Source | Target | Type | Mandatory | Rationale | User-facing reason | Source doc | Review |
|---------|--------|--------|------|-----------|-----------|-------------------|------------|--------|
| E-OPR-S01-02 | RT-OPR-001-STG-01 | RT-OPR-001-STG-02 | PREREQUISITE | Yes | Sequential ops foundation | Finish Stage 1 before Stage 2 | RT-OPR-001 arch | ARCHITECTURE RECOMMENDED |
| E-OPR-S02-03 | RT-OPR-001-STG-02 | RT-OPR-001-STG-03 | PREREQUISITE | Yes | Sequential | Finish Stage 2 before Stage 3 | RT-OPR-001 arch | ARCHITECTURE RECOMMENDED |
| E-OPR-S03-04 | RT-OPR-001-STG-03 | RT-OPR-001-STG-04 | PREREQUISITE | Yes | Sequential | Finish Stage 3 before Stage 4 | RT-OPR-001 arch | ARCHITECTURE RECOMMENDED |
| E-OPR-S04-05 | RT-OPR-001-STG-04 | RT-OPR-001-STG-05 | PREREQUISITE | Yes | Sequential | Finish Stage 4 before Stage 5 | RT-OPR-001 arch | ARCHITECTURE RECOMMENDED |
| E-BLD-S01-02 | RT-BLD-001-STG-01 | RT-BLD-001-STG-02 | PREREQUISITE | Yes | Sequential | Finish Stage 1 before Stage 2 | RT-BLD-001 arch | ARCHITECTURE RECOMMENDED |
| E-BLD-S02-03 | RT-BLD-001-STG-02 | RT-BLD-001-STG-03 | PREREQUISITE | Yes | Sequential | Finish Stage 2 before Stage 3 | RT-BLD-001 arch | ARCHITECTURE RECOMMENDED |
| E-BLD-S03-04 | RT-BLD-001-STG-03 | RT-BLD-001-STG-04 | PREREQUISITE | Yes | Sequential | Finish Stage 3 before Stage 4 | RT-BLD-001 arch | ARCHITECTURE RECOMMENDED |
| E-BLD-S04-05 | RT-BLD-001-STG-04 | RT-BLD-001-STG-05 | PREREQUISITE | Yes | Sequential | Finish Stage 4 before Stage 5 | RT-BLD-001 arch | ARCHITECTURE RECOMMENDED |
| E-PRT-S01-02 | RT-PRT-001-STG-01 | RT-PRT-001-STG-02 | PREREQUISITE | Yes | Sequential | Finish Stage 1 before Stage 2 | RT-PRT-001 arch | ARCHITECTURE RECOMMENDED |
| E-PRT-S02-03 | RT-PRT-001-STG-02 | RT-PRT-001-STG-03 | PREREQUISITE | Yes | Sequential | Finish Stage 2 before Stage 3 | RT-PRT-001 arch | ARCHITECTURE RECOMMENDED |
| E-PRT-S03-04 | RT-PRT-001-STG-03 | RT-PRT-001-STG-04 | PREREQUISITE | Yes | Sequential | Finish Stage 3 before Stage 4 | RT-PRT-001 arch | ARCHITECTURE RECOMMENDED |
| E-PRT-S04-05 | RT-PRT-001-STG-04 | RT-PRT-001-STG-05 | PREREQUISITE | Yes | Sequential | Finish Stage 4 before Stage 5 | RT-PRT-001 arch | ARCHITECTURE RECOMMENDED |
| E-LED-S01-02 | RT-LED-001-STG-01 | RT-LED-001-STG-02 | PREREQUISITE | Yes | Sequential | Finish Stage 1 before Stage 2 | RT-LED-001 arch | ARCHITECTURE RECOMMENDED |
| E-LED-S02-03 | RT-LED-001-STG-02 | RT-LED-001-STG-03 | PREREQUISITE | Yes | Sequential | Finish Stage 2 before Stage 3 | RT-LED-001 arch | ARCHITECTURE RECOMMENDED |
| E-LED-S03-04 | RT-LED-001-STG-03 | RT-LED-001-STG-04 | PREREQUISITE | Yes | Sequential | Finish Stage 3 before Stage 4 | RT-LED-001 arch | ARCHITECTURE RECOMMENDED |
| E-LED-S04-05 | RT-LED-001-STG-04 | RT-LED-001-STG-05 | PREREQUISITE | Yes | Sequential | Finish Stage 4 before Stage 5 | RT-LED-001 arch | ARCHITECTURE RECOMMENDED |
| E-ANL-S01-02 | RT-ANL-001-STG-01 | RT-ANL-001-STG-02 | PREREQUISITE | Yes | Sequential | Finish Stage 1 before Stage 2 | RT-ANL-001 arch | CONDITIONAL |
| E-ANL-S02-03 | RT-ANL-001-STG-02 | RT-ANL-001-STG-03 | PREREQUISITE | Yes | Sequential | Finish Stage 2 before Stage 3 | RT-ANL-001 arch | CONDITIONAL |
| E-ANL-S03-04 | RT-ANL-001-STG-03 | RT-ANL-001-STG-04 | PREREQUISITE | Yes | Sequential | Finish Stage 3 before Stage 4 | RT-ANL-001 arch | CONDITIONAL |
| E-ANL-S04-05 | RT-ANL-001-STG-04 | RT-ANL-001-STG-05 | PREREQUISITE | Yes | Sequential | Finish Stage 4 before Stage 5 | RT-ANL-001 arch | CONDITIONAL |

## CXW / SEX / Bridge / Convergence

| Edge ID | Source | Target | Type | Mandatory | Rationale | User-facing reason | Source doc | Review |
|---------|--------|--------|------|-----------|-----------|-------------------|------------|--------|
| E-CXW-BLD | RT-BLD-001 | CXW-001 | PREREQUISITE | Yes | Source BUILD | Complete Web Delivery foundations first | CXW-001 arch | ARCHITECTURE RECOMMENDED |
| E-CXW-PRT | RT-PRT-001 | CXW-001 | PREREQUISITE | Yes | Source PROTECT (selected) | Complete Defensive Ops foundations first | CXW-001 arch | ARCHITECTURE RECOMMENDED |
| E-CXW-BRG | BRG-PRT-BLD-01 | CXW-001 | BRIDGE | Yes | App-sec gap | Complete Application-Security-for-Delivery Bridge | CXW-001 arch | ARCHITECTURE RECOMMENDED |
| E-CXW-LED | RT-LED-001-STG-04 | CXW-001-STG-04 | RECOMMENDED | No | Release-risk | LEAD risk/decision Stage strengthens release | CXW-001 arch | ARCHITECTURE RECOMMENDED |
| E-CXW-CNV-1 | RT-BLD-001 | CXW-001 | CONVERGENCE | Yes | Multidisciplinary outcome | Combine delivery + defensive practice | CXW-001 arch | ARCHITECTURE RECOMMENDED |
| E-CXW-CNV-2 | RT-PRT-001 | CXW-001 | CONVERGENCE | Yes | Multidisciplinary outcome | Combine delivery + defensive practice | CXW-001 arch | ARCHITECTURE RECOMMENDED |
| E-SEX-SRC | RT-OPR-001 | SEX-001 | SECURE_EXTENSION | Yes | Harden OPR | Extend Cloud Ops with secure operations | SEX-001 arch | ARCHITECTURE RECOMMENDED |
| E-SEX-PRV | RT-OPR-001 | SEX-001 | PREREQUISITE | Yes | Route-Proven preferred | Prefer Route-Proven Cloud Ops before extension | SEX-001 arch | ARCHITECTURE RECOMMENDED |
| E-SEX-PRT | RT-PRT-001-STG-01 | SEX-001 | RECOMMENDED | No | Selected protect concepts | Security context helps secure ops | SEX-001 arch | ARCHITECTURE RECOMMENDED |
| E-CXW-S01-02 | CXW-001-STG-01 | CXW-001-STG-02 | PREREQUISITE | Yes | Sequential | Finish Stage 1 before Stage 2 | CXW-001 arch | ARCHITECTURE RECOMMENDED |
| E-CXW-S02-03 | CXW-001-STG-02 | CXW-001-STG-03 | PREREQUISITE | Yes | Sequential | Finish Stage 2 before Stage 3 | CXW-001 arch | ARCHITECTURE RECOMMENDED |
| E-CXW-S03-04 | CXW-001-STG-03 | CXW-001-STG-04 | PREREQUISITE | Yes | Sequential | Finish Stage 3 before Stage 4 | CXW-001 arch | ARCHITECTURE RECOMMENDED |
| E-SEX-S01-02 | SEX-001-STG-01 | SEX-001-STG-02 | PREREQUISITE | Yes | Sequential | Finish Stage 1 before Stage 2 | SEX-001 arch | ARCHITECTURE RECOMMENDED |
| E-SEX-S02-03 | SEX-001-STG-02 | SEX-001-STG-03 | PREREQUISITE | Yes | Sequential | Finish Stage 2 before Stage 3 | SEX-001 arch | ARCHITECTURE RECOMMENDED |
| E-SEX-S03-04 | SEX-001-STG-03 | SEX-001-STG-04 | PREREQUISITE | Yes | Sequential | Finish Stage 3 before Stage 4 | SEX-001 arch | ARCHITECTURE RECOMMENDED |

## Bridge nodes (Nest + app-sec)

| Edge ID | Source | Target | Type | Mandatory | Rationale | User-facing reason | Source doc | Review |
|---------|--------|--------|------|-----------|-----------|-------------------|------------|--------|
| E-BRG-N-OPR | NST-CAP-012 | BRG-NST-OPR-01 | BRIDGE | Conditional | Gap recovery | Short Bridge if Nest troubleshooting weak | Nest bridge map | ARCHITECTURE RECOMMENDED |
| E-BRG-N-BLD | NST-CAP-004 | BRG-NST-BLD-01 | BRIDGE | Conditional | Gap recovery | Short Bridge if file/repo readiness weak | Nest bridge map | ARCHITECTURE RECOMMENDED |
| E-BRG-N-PRT | NST-CAP-009 | BRG-NST-PRT-01 | BRIDGE | Conditional | Gap recovery | Short Bridge if safety literacy weak | Nest bridge map | ARCHITECTURE RECOMMENDED |
| E-BRG-N-LED | NST-CAP-011 | BRG-NST-LED-01 | BRIDGE | Conditional | Gap recovery | Short Bridge if collaboration weak | Nest bridge map | ARCHITECTURE RECOMMENDED |
| E-BRG-N-ANL | NST-CAP-008 | BRG-NST-ANL-01 | BRIDGE | Conditional | Gap recovery | Short Bridge if privacy/data readiness weak | Nest bridge map | CONDITIONAL |
| E-BRG-N-CXW | NST-CAP-005 | BRG-NST-CXW-01 | BRIDGE | Conditional | Nest for CW | Nest readiness for Cross-Wing entry | Nest bridge map | ARCHITECTURE RECOMMENDED |
| E-BRG-N-SEX | NST-CAP-006 | BRG-NST-SEX-01 | BRIDGE | Conditional | Nest for SEX | Nest MFA before secure ops extension | Nest bridge map | ARCHITECTURE RECOMMENDED |
| E-BRG-APPSEC | RT-PRT-001 | BRG-PRT-BLD-01 | BRIDGE | Yes for CXW | App-sec gap | Focused Application-Security-for-Delivery | CXW-001 arch | ARCHITECTURE RECOMMENDED |

## Capstone / Evidence / Unlock / Remediation (summary edges)

| Edge ID | Source | Target | Type | Mandatory | Rationale | User-facing reason | Source doc | Review |
|---------|--------|--------|------|-----------|-----------|-------------------|------------|--------|
| E-EVD-OPR-1 | RT-OPR-001-EVD-01 | RT-OPR-001 | EVIDENCE_FOR | Yes | Practical evidence | Evidence supports Cloud Ops capability | Evidence map | ARCHITECTURE RECOMMENDED |
| E-EVD-OPR-C | RT-OPR-001-CAP-01 | RT-OPR-001 | EVIDENCE_FOR | Yes | Capstone | Capstone supports Route-Proven | Evidence map | ARCHITECTURE RECOMMENDED |
| E-EVD-BLD-1 | RT-BLD-001-EVD-01 | RT-BLD-001 | EVIDENCE_FOR | Yes | Practical evidence | Evidence supports Web Delivery | Evidence map | ARCHITECTURE RECOMMENDED |
| E-EVD-BLD-C | RT-BLD-001-CAP-01 | RT-BLD-001 | EVIDENCE_FOR | Yes | Capstone | Capstone supports Route-Proven | Evidence map | ARCHITECTURE RECOMMENDED |
| E-EVD-PRT-1 | RT-PRT-001-EVD-01 | RT-PRT-001 | EVIDENCE_FOR | Yes | Practical evidence | Evidence supports Defensive Ops | Evidence map | ARCHITECTURE RECOMMENDED |
| E-EVD-PRT-C | RT-PRT-001-CAP-01 | RT-PRT-001 | EVIDENCE_FOR | Yes | Capstone | Capstone supports Route-Proven | Evidence map | ARCHITECTURE RECOMMENDED |
| E-EVD-LED-1 | RT-LED-001-EVD-01 | RT-LED-001 | EVIDENCE_FOR | Yes | Practical evidence | Evidence supports Delivery & Risk | Evidence map | ARCHITECTURE RECOMMENDED |
| E-EVD-LED-C | RT-LED-001-CAP-01 | RT-LED-001 | EVIDENCE_FOR | Yes | Capstone | Capstone supports Route-Proven | Evidence map | ARCHITECTURE RECOMMENDED |
| E-EVD-ANL-1 | RT-ANL-001-EVD-01 | RT-ANL-001 | EVIDENCE_FOR | Yes | Practical evidence | Evidence supports Data Analysis | Evidence map | CONDITIONAL |
| E-EVD-ANL-C | RT-ANL-001-CAP-01 | RT-ANL-001 | EVIDENCE_FOR | Yes | Capstone | Capstone supports Route-Proven | Evidence map | CONDITIONAL |
| E-EVD-CXW-1 | CXW-001-EVD-01 | CXW-001 | EVIDENCE_FOR | Yes | Integrated evidence | Evidence supports Secure App Delivery | CXW arch | ARCHITECTURE RECOMMENDED |
| E-EVD-CXW-C | CXW-001-CAP-01 | CXW-001 | EVIDENCE_FOR | Yes | Capstone | Capstone supports Cross-Wing Proven | CXW arch | ARCHITECTURE RECOMMENDED |
| E-EVD-SEX-1 | SEX-001-EVD-01 | SEX-001 | EVIDENCE_FOR | Yes | Extension evidence | Evidence supports Secure Cloud Ops | SEX arch | ARCHITECTURE RECOMMENDED |
| E-EVD-SEX-C | SEX-001-CAP-01 | SEX-001 | EVIDENCE_FOR | Yes | Capstone | Capstone supports extension marker | SEX arch | ARCHITECTURE RECOMMENDED |
| E-ULK-OPR | RT-OPR-001 | ULK-OPR-001 | UNLOCKS | No | Next learning | Unlocks Secure Cloud Ops Extension eligibility | Unlock registry | ARCHITECTURE RECOMMENDED |
| E-ULK-BLD | RT-BLD-001 | ULK-BLD-001 | UNLOCKS | No | Next learning | Unlocks Cross-Wing eligibility path | Unlock registry | ARCHITECTURE RECOMMENDED |
| E-ULK-PRT | RT-PRT-001 | ULK-PRT-001 | UNLOCKS | No | Next learning | Unlocks Cross-Wing eligibility path | Unlock registry | ARCHITECTURE RECOMMENDED |
| E-RMD-NEST | RMD-NST-001 | NST-CAP-012 | REMEDIATES | Conditional | Nest gap | Micro-Mission remediates Nest weakness | Remediation arch | ARCHITECTURE RECOMMENDED |
| E-RMD-EVD | RMD-EVD-001 | RT-OPR-001-EVD-01 | REMEDIATES | Conditional | Evidence revision | Revise Evidence without full Route repeat | Remediation arch | ARCHITECTURE RECOMMENDED |

## Count reconciliation note

Authoritative type totals live in [LAUNCH-GRAPH-REGISTRY.md](./LAUNCH-GRAPH-REGISTRY.md) (129 edges). This matrix lists the governed launch skeleton; remaining PREREQUISITE/RECOMMENDED/EVIDENCE_FOR/UNLOCKS edges are enumerated in Route Stage tables, Evidence Anchor Registry, and Unlock Registry and are included in the registry totals.

## Acyclicity manual check (mandatory PREREQUISITE)

Order: Nest caps → Routes → Stage 01→05 → (optional Bridge) → CXW/SEX Stages → Capstones.  
No reverse mandatory edge from Route → Nest or Stage_n → Stage_(n−1).  
**Result: acyclic.**
