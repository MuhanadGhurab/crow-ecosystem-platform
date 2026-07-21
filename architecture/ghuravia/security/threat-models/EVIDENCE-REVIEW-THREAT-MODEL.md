# Threat Model — Evidence Review

| Field | Value |
|-------|-------|
| **Document ID** | GHV-TM-1C-EVR-001 |
| **Version** | 1.0.0 |
| **Status** | **ACTIVE** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Gate** | GHV.ARCHITECTURE.1C |
| **Evidence** | SPK-ARC-007, SPK-ARC-009 |

## Assets

Released Evidence objects, reviewer notes, approval decisions.

## Threats and controls

| ID | Threat | Control | Residual |
|----|--------|---------|----------|
| T-ER-01 | Review before scan pass | `reviewAccess` gate | Low (spike) |
| T-ER-02 | Self-review | SoD policy | Medium |
| T-ER-03 | Leaked presigned URL | Short TTL + authz re-check | Medium |
| T-ER-04 | Reviewer downloads bulk | Rate limits + audit (future) | Medium |
| T-ER-05 | Approval without object | Server validates object ref | Low |

## Separation

Approval writes progression **event** with opaque `objectRef` only — never object body in ledger.
