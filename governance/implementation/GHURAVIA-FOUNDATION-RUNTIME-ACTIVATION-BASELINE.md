# GHURAVIA Foundation Runtime and Activation Slice Baseline

| Field | Value |
|-------|-------|
| **Baseline ID** | GHURAVIA-FOUNDATION-RUNTIME-ACTIVATION-BASELINE |
| **Version** | **v0.2.0** |
| **Status** | **ACTIVE — LIMITED ACTIVATION VERTICAL SLICE** |
| **Source Gate** | GHV.IMPLEMENTATION.0B |
| **Authorization** | GHV-IMP-AUTH-002 |
| **Date** | 2026-07-21 |

## Scope included

- Activation formula: email + terms + account risk (mobile excluded)
- Screens ACT-003, ACT-011, ACT-005, ACT-013, ACT-012, ACT-006
- Synthetic session, disposable Postgres, email mock mailbox, outbox worker
- Migration `0001_activation_runtime.sql`
- CI with ephemeral Postgres + `test:integration`

## Explicitly excluded

- ACT-007/008 mobile · other shells · real providers · Preview/Staging/Production
- Evidence · Trust · Progression · Live Sky · payments

## Predecessor

Product Code Bootstrap Baseline **v0.1.0** remains ACTIVE for 0A bootstrap roots. This baseline **extends** runtime/activation; it does not invalidate 0A.

## Non-claims

```text
NOT Production-proven
NOT legally approved terms/risk copy
NOT real email/SMS/IdP
NOT Preview/controlled-launch ready
Screen inventory unchanged: 92 ACTIVE / 7 shells
```
