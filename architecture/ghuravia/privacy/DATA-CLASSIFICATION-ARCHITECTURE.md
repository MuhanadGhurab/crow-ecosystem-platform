# Data Classification Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-PRIV-CLS-001 |
| **Version** | 1.0.0 |
| **Status** | **ACTIVE** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |

## Classification scale

| Class | Handling |
|-------|----------|
| PUBLIC | Publishable when intended |
| INTERNAL | Staff/ops |
| CONFIDENTIAL | User-sensitive |
| RESTRICTED | Identity, moderation, reviewer data |
| HIGHLY_RESTRICTED | Legal identity, Evidence objects, payment |
| PROHIBITED | Must not collect |

## Key mappings

| Category | Class | Public display |
|----------|-------|----------------|
| Crow handle/display | PUBLIC–CONFIDENTIAL | Yes (governed) |
| Private legal identity | HIGHLY_RESTRICTED | **Never** |
| Email/phone | CONFIDENTIAL–RESTRICTED | **Never** on profile |
| Age category | RESTRICTED | Not on minor public profile |
| Trust | RESTRICTED | **Non-public, non-numeric** |
| Evidence raw | HIGHLY_RESTRICTED | **Never** — sanitized derivatives only |
| Progression summary | CONFIDENTIAL | Opt-in public boards only |
| Audit | RESTRICTED | Never |

## Enforcement

Classification drives encryption, access control, export scope, and retention class. See SECURITY-CONTROL-MATRIX.md.

## Non-claims

Architectural classification only — not legal advice.
