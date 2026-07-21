# Threat Model — Evidence Upload

| Field | Value |
|-------|-------|
| **Document ID** | GHV-TM-1C-EVU-001 |
| **Version** | 1.0.0 |
| **Status** | **ACTIVE** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Gate** | GHV.ARCHITECTURE.1C |
| **Evidence** | SPK-ARC-007, SPK-ARC-008 |

## Assets

Upload tokens, quarantined objects, object metadata, storage credentials.

## Threats and controls

| ID | Threat | Control | Residual |
|----|--------|---------|----------|
| T-EU-01 | Unauthorized upload | Short-lived token + owner binding | Low (spike) |
| T-EU-02 | Token theft replay | Expiry + owner check on chunk | Low |
| T-EU-03 | Malware in Evidence | Quarantine + scanning | Medium until prod scanner |
| T-EU-04 | Secret exfil in file | Secret scanner fail-closed | Medium |
| T-EU-05 | Admin credential leak from app | Storage isolation | Low (spike) |
| T-EU-06 | Oversized/type abuse | Allowlist + size cap | Low |

## Fail-closed

Scanner outage → no review release (SPK-ARC-008).
