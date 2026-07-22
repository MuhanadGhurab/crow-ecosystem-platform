# Product code status

v0.3.0 ACTIVE WITH CONDITIONS — ACTIVATION UX AND ONBOARDING ENTRY HARDENED.

Authorized for local synthetic development under GHV-IMP-AUTH-001 (0A), GHV-IMP-AUTH-002 (0B), and GHV-IMP-AUTH-003 (0C). No deployment, real providers, or real users.

## Activation (0B + 0C)

```text
activation_complete =
  email_verified AND current_terms_accepted AND account_risk_status = acceptable
```

Mobile is not in the formula. Hardened screens: ACT-003, ACT-011, ACT-005, ACT-013, ACT-012, ACT-006. Handoff: ACT-007 (optional thin) → ONB-001 (handoff only).

See [ACTIVATION-RUNTIME.md](./ACTIVATION-RUNTIME.md) · [ACTIVATION-UX.md](./ACTIVATION-UX.md) · [ONBOARDING-ENTRY-HANDOFF.md](./ONBOARDING-ENTRY-HANDOFF.md).

## TypeScript reconciliation (Validation.1B ↔ Implementation)

| Field                      | Value                                                                   |
| -------------------------- | ----------------------------------------------------------------------- |
| Validation.1B candidate    | `typescript@7.0.2`                                                      |
| Implemented pin            | `typescript@6.0.3`                                                      |
| Architecture contradiction | **NO**                                                                  |
| Owner                      | Founder (RAVEN) · review at later Gate / Controlled Architecture Change |

## Dependency advisories

ADV-001 / ADV-002 remain **ACCEPT TEMPORARILY WITH OWNER**; ADV-003 **FIXED** (`sharp@0.35.3`) — see [IMPLEMENTATION-0C-DEPENDENCY-ADVISORY-REVIEW.md](../../governance/implementation/IMPLEMENTATION-0C-DEPENDENCY-ADVISORY-REVIEW.md).
