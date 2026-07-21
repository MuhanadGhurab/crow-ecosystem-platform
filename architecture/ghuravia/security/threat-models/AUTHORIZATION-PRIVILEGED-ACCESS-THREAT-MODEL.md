# Threat Model — Authorization and Privileged Access

| Field | Value |
|-------|-------|
| **Document ID** | GHV-TM-1C-AUTHZ-001 |
| **Version** | 1.0.0 |
| **Status** | **ACTIVE** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Gate** | GHV.ARCHITECTURE.1C |
| **Evidence** | SPK-ARC-019, ADR-ARC-015 |

## Assets

Role assignments, policy definitions, privileged correction records, break-glass approvals.

## Actors

Compromised admin, rogue moderator, external attacker with stolen session.

## Threats and controls

| ID | Threat | Control | Residual |
|----|--------|---------|----------|
| T-AP-01 | Horizontal privilege escalation | Deny by default + ownership checks | Medium |
| T-AP-02 | Self-approval of Evidence | SoD reviewer ≠ submitter | Low (architecture) |
| T-AP-03 | Silent break-glass | Dual control required | Low (spike) |
| T-AP-04 | Audit tampering | Append-only ledger | Medium until WORM |
| T-AP-05 | Standing admin abuse | JIT elevation | Medium |

## Validation

SPK-ARC-019 PASS for dual control and audit prohibitions.
