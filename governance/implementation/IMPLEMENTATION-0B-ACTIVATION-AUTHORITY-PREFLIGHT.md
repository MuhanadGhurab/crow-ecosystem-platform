# Implementation 0B — Activation Authority Preflight

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IMP-0B-AUTH-PREFLIGHT-001 |
| **Gate** | GHV.IMPLEMENTATION.0B |
| **Date** | 2026-07-21 |
| **Owner** | Founder (RAVEN) |
| **Starting HEAD** | `ca9fa84a056c9ba6bc03a1e9de6c082cbb82cd33` |

## Verdict

```text
PASS — ACTIVATION AUTHORITY AND REQUIRED GATES RECONCILED
```

## Authoritative sources reviewed

- [PRODUCT-CONSTITUTION.md](../constitution/PRODUCT-CONSTITUTION.md) — basic activation = email verified + current terms + acceptable risk
- [SCOPE-BASELINE.md](../scope/SCOPE-BASELINE.md) — same formula; mobile optional at launch
- [MASTER-USER-JOURNEY.md](../../product/journeys/MASTER-USER-JOURNEY.md) — ACT-003 → ACT-011 → ACT-005 → ACT-013 → ACT-006
- [MASTER-SCREEN-REGISTRY.md](../../product/screens/MASTER-SCREEN-REGISTRY.md) — ACT-007/008 optional after ACT-006
- [CAPABILITY-REGISTRY.md](../../product/CAPABILITY-REGISTRY.md)
- [ACTIVATION-STATE-ARCHITECTURE.md](../../architecture/ghuravia/identity/ACTIVATION-STATE-ARCHITECTURE.md)
- [IDENTITY-DOMAIN-ARCHITECTURE.md](../../architecture/ghuravia/identity/) (identity package)
- [IDENTITY-ACTIVATION-VALIDATION-PLAN.md](../../architecture/ghuravia/identity/IDENTITY-ACTIVATION-VALIDATION-PLAN.md)
- ADR-ARC-013 · ADR-ARC-014 · ADR-ARC-015 · **ADR-ARC-016** (email in formula; SMS adapter locked, not required)

## Reconciled activation formula

```text
activation_complete =
  email_verified
  AND current_terms_accepted
  AND account_risk_status = acceptable
```

### Required gates

| Gate | Mandatory | Screen | Notes |
|------|-----------|--------|-------|
| Account claimed | Yes (slice entry) | Synthetic claim (0B) | Replaces full ACT-001/002 for local slice |
| Email verified | Yes | ACT-003 / ACT-011 | Delivery ≠ verification |
| Terms accepted | Yes | ACT-005 | Versioned acceptance |
| Account risk acceptable | Yes | ACT-013 | After terms |
| Mobile verified | **No** | ACT-007 / ACT-008 | Optional after ACT-006; **out of formula** |
| Recovery | Guided only | ACT-012 | Cannot bypass required gates |
| Risk review / suspend / close | Architecture states | Domain only | No ACT-009 UI in 0B |

## Mobile verification disposition

```text
Is mobile verification mandatory for activation?
NO

Which authoritative document establishes it?
SCOPE-BASELINE · PRODUCT-CONSTITUTION · ACTIVATION-STATE-ARCHITECTURE · ADR-ARC-016

Which screen or flow represents it?
ACT-007 / ACT-008 — optional assurance after ACT-006

Is it independent from email verification?
Yes as optional assurance; it does not substitute for email_verified

Can either verification be bypassed by recovery?
NO
```

## Conflicts

```text
Authority conflicts:
0
```

No Product Code may invent a mandatory mobile gate or omit email/terms/risk.

## Delivery and payment invariants

```text
Email delivered ≠ Email verified
OTP delivered ≠ Mobile verified
Payment / commercial event ≠ Activation
```
