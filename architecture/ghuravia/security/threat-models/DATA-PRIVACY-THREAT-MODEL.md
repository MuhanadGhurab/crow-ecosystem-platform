# Threat Model — Data Privacy

| Field | Value |
|-------|-------|
| **Document ID** | GHV-TM-1C-PRIV-001 |
| **Version** | 1.0.0 |
| **Status** | **ACTIVE** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Gate** | GHV.ARCHITECTURE.1C |
| **Evidence** | SPK-ARC-013, SPK-ARC-025 |

## Assets

Private legal identity, age category, Trust signals, moderation cases, telemetry.

## Threats and controls

| ID | Threat | Control | Residual |
|----|--------|---------|----------|
| T-DP-01 | Public profile leaks PII | Projection + leak assertion | Low (spike) |
| T-DP-02 | Trust score published | Non-numeric prohibition | Low (spike) |
| T-DP-03 | Moderator sees excess identity | Scoped moderator view | Medium |
| T-DP-04 | Cross-border unlawful transfer | **LEGAL VALIDATION REQUIRED** | Unknown |
| T-DP-05 | Minor exact age exposure | ageCategory only; banned fields | Low (spike) |

## Separation

Crow Identity ≠ Private Legal Identity enforced at projection layer.

## Non-claims

Not legal advice. Residency compliance not validated.
