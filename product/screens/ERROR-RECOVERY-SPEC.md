# Error and Recovery Spec

| Field | Value |
|-------|-------|
| **Status** | LOCKED direction |
| **Version** | 1.0.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-20 |
| **Source Gate** | GHV.FOUNDATION.1A |

## Principles

- Every error state offers a next action: retry, save draft, return to Skyboard, or contact support.
- Auth/session failures route through session validation, not silent logout loops.
- Entitlement failures explain capacity vs readiness separately.
- Offline drafts must not claim server acceptance until sync succeeds.
