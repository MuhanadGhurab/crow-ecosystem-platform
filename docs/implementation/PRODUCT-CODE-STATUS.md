# Product code status

v0.2.0 ACTIVE — LIMITED FOUNDATION RUNTIME + ACTIVATION VERTICAL SLICE.

Authorized only for local synthetic development under GHV-IMP-AUTH-001 (0A) and GHV-IMP-AUTH-002 (0B). No deployment, real providers, or real users.

## Activation (0B)

```text
activation_complete =
  email_verified AND current_terms_accepted AND account_risk_status = acceptable
```

Mobile is not in the formula. Screens: ACT-003, ACT-011, ACT-005, ACT-013, ACT-012, ACT-006.

See [ACTIVATION-RUNTIME.md](./ACTIVATION-RUNTIME.md).

## TypeScript reconciliation (Validation.1B ↔ Implementation)

| Field                      | Value                                                                   |
| -------------------------- | ----------------------------------------------------------------------- |
| Validation.1B candidate    | `typescript@7.0.2`                                                      |
| Implemented pin            | `typescript@6.0.3`                                                      |
| Architecture contradiction | **NO**                                                                  |
| Owner                      | Founder (RAVEN) · review at later Gate / Controlled Architecture Change |

## Dependency advisories

ADV-001 / ADV-002 / ADV-003 remain **ACCEPT TEMPORARILY WITH OWNER** — see [IMPLEMENTATION-0B-DEPENDENCY-ADVISORY-REVIEW.md](../../governance/implementation/IMPLEMENTATION-0B-DEPENDENCY-ADVISORY-REVIEW.md).
