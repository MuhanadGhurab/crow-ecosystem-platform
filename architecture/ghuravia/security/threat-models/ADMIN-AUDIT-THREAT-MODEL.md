# Threat Model — Admin and Audit

| Field | Value |
|-------|-------|
| **Document ID** | GHV-TM-1C-ADM-001 |
| **Version** | 1.0.0 |
| **Status** | **ACTIVE** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Gate** | GHV.ARCHITECTURE.1C |
| **Evidence** | SPK-ARC-019 |

## Assets

Audit ledger, admin configuration, privileged correction queue.

## Threats and controls

| ID | Threat | Control | Residual |
|----|--------|---------|----------|
| T-AA-01 | Audit log injection | Schema validation; no secrets | Low (spike) |
| T-AA-02 | Evidence body in audit | Rejected at append | Low (spike) |
| T-AA-03 | Break-glass without approver | Dual control enforcement | Low (spike) |
| T-AA-04 | Audit read by learner | AuthZ deny | Medium |
| T-AA-05 | Irreversible correction | Reversal audit path | Low (spike) |

## Post-action review

Privileged corrections flagged `PENDING_POST_ACTION_REVIEW`.
