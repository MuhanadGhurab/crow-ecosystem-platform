# Learning Identifier Standard

| Field | Value |
|-------|-------|
| **Document ID** | GHV-LRN-ID-001 |
| **Version** | 1.0.0 |
| **Status** | ARCHITECTURE RECOMMENDED — PENDING 1D LOCK |
| **Owner** | Founder (RAVEN) |
| **Source Gate** | GHV.LEARNING.1B |
| **Last updated** | 2026-07-21 |
| **Related** | [ROUTE-ARCHITECTURE-STANDARD.md](./ROUTE-ARCHITECTURE-STANDARD.md) · [NODE-TYPE-REGISTRY.md](../graph/NODE-TYPE-REGISTRY.md) |
| **Source research** | GHV.LEARNING.1A portfolio |
| **Limitations** | Working titles remain non-final; Mission IDs are placeholders |
| **Unresolved** | Final display names (1D); Mission expansion (1C) |
| **Change history** | 1.0.0 — LEARNING.1B |

## Principle

Canonical IDs are stable and semantic. Display-name changes must not change IDs.

## Prefix map

| Construct | Pattern | Example |
|-----------|---------|---------|
| World | `WRLD-GHV-NNN` | WRLD-GHV-001 |
| Nest capability | `NST-CAP-NNN` | NST-CAP-001 |
| Horizon | `HRZ-{OPR\|BLD\|ANL\|PRT\|LED}` | HRZ-OPR |
| Route | `RT-{HRZ}-NNN` | RT-OPR-001 |
| Cross-Wing | `CXW-NNN` | CXW-001 |
| Secure Extension | `SEX-NNN` | SEX-001 |
| Stage | `{ROUTE\|CXW\|SEX}-STG-NN` | RT-OPR-001-STG-01 |
| Mission placeholder | `{STAGE}-MSN-NN` | RT-OPR-001-STG-01-MSN-01 |
| Evidence anchor | `{OWNER}-EVD-NN` | RT-OPR-001-EVD-01 |
| Capstone | `{OWNER}-CAP-NN` | RT-OPR-001-CAP-01 |
| Unlock | `ULK-{DOMAIN}-NNN` | ULK-OPR-001 |
| Bridge | `BRG-{SRC}-{TGT}-NN` | BRG-PRT-BLD-01 |
| Remediation | `RMD-{DOMAIN}-NNN` | RMD-NEST-001 |
| Shared capability | `SHC-NNN` | SHC-001 |

## Launch portfolio ID mapping (1A → 1B)

| 1A Candidate | Canonical ID | Working title |
|--------------|--------------|---------------|
| RC-OPR-001 | **RT-OPR-001** | Cloud Systems Operations Foundations |
| RC-BLD-001 | **RT-BLD-001** | Web Application Delivery Foundations |
| RC-PRT-001 | **RT-PRT-001** | Defensive Security Operations Foundations |
| RC-LED-001 | **RT-LED-001** | Technology Delivery & Risk Foundations |
| RC-ANL-001 | **RT-ANL-001** | Practical Data Analysis Foundations (reserve) |
| CXW-001 | **CXW-001** | Secure Application Delivery |
| SEX-001 | **SEX-001** | Secure Cloud Operations Extension |

Horizons: HRZ-OPR · HRZ-BLD · HRZ-ANL · HRZ-PRT · HRZ-LED  
World: WRLD-GHV-001  
Foundation layer: Nest (FOUNDATION_LAYER; capabilities NST-CAP-*)
