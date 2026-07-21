# Threat Model — Progression Correction

| Field | Value |
|-------|-------|
| **Document ID** | GHV-TM-1C-PRC-001 |
| **Version** | 1.0.0 |
| **Status** | **ACTIVE** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Gate** | GHV.ARCHITECTURE.1C |
| **Evidence** | SPK-ARC-009, SPK-ARC-019 |

## Assets

Progression events, capability mastery, route eligibility, formula versions.

## Threats and controls

| ID | Threat | Control | Residual |
|----|--------|---------|----------|
| T-PC-01 | Direct ledger tamper | Append-only + server writes | Medium |
| T-PC-02 | Duplicate approval XP | Idempotent approve | Low (spike) |
| T-PC-03 | Revoke without recalc | Targeted recalc on revoke | Low (spike) |
| T-PC-04 | Privileged silent fix | Audit + reason + dual control | Low (spike) |
| T-PC-05 | Raw Evidence in ledger | Object ref only | Low (spike) |

## Locked rule

```text
Raw Evidence Object ↛ Progression Ledger
```
