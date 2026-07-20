# Screen-State Contract

| Field | Value |
|-------|-------|
| **Status** | LOCKED — Authoritative |
| **Version** | 1.0.0 |
| **Owner** | Founder (RAVEN) |
| **Last updated** | 2026-07-20 |
| **Source Gate** | GHV.FOUNDATION.1A |
| **Related** | [MASTER-SCREEN-REGISTRY.md](./MASTER-SCREEN-REGISTRY.md) · [ADAPTIVE-STATE-MATRIX.md](../ebux/ADAPTIVE-STATE-MATRIX.md) |

## Universal screen states

Every screen family must define behavior for:

| State | Meaning |
|-------|---------|
| loading | Data or auth in progress |
| empty | No items yet |
| locked | Visible but not actionable due to eligibility/entitlement/trust |
| error | Recoverable failure with guidance |
| offline | Connectivity degraded; drafts/resume rules apply |
| success | Primary action completed |

## Authorization rule

```text
Hidden UI is not authorization.
```

Server-side Authorization Engine decisions are authoritative. UI locking is presentation only.

## Transition rules

- Entry conditions must be explicit (assurance, entitlement, Nest readiness, Route capacity).
- Exit transitions must name the next screen ID or nav target.
- State-changing decisions must be auditable.
- Recommendations must not silently force navigation.

## Shells

| Shell | Used by |
|-------|---------|
| Public | PUB-* |
| Activation | ACT-* |
| Onboarding | ONB-* |
| Core Portal | SKY-*, WLD-*, LIV-*, COM-*, LOG-*, IDN-*, PRG-*, COM-* |
| Commercial | PAY-* |
| Trust/Account | TRU-* |
| Admin | ADM-* |
