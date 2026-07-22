# Activation UX

| Field           | Value                                                           |
| --------------- | --------------------------------------------------------------- |
| **Document ID** | GHV-DOC-ACT-UX-001                                              |
| **Gate**        | GHV.IMPLEMENTATION.0C                                           |
| **Baseline**    | GHURAVIA Activation UX and Onboarding Entry Baseline **v0.3.0** |

## Overview

Arabic-first activation shell with governed progress (email → terms → risk → complete), Explainable Locks, localized errors, and server-authoritative route guards. **Synthetic local session only** — no real providers.

## Activation formula (unchanged)

```text
activation_complete =
  email_verified
  AND current_terms_accepted
  AND account_risk_status = acceptable
```

Mobile verification is **OPTIONAL ASSURANCE** — not part of the formula.

## Screens and routes

| Screen ID | Route                         | Role                                  |
| --------- | ----------------------------- | ------------------------------------- |
| ACT-003   | `/activation/email-pending`   | Email verification pending            |
| ACT-011   | `/activation/email-result`    | Token confirmation                    |
| ACT-005   | `/activation/terms`           | Terms acceptance                      |
| ACT-013   | `/activation/account-risk`    | Account-risk disclosure               |
| ACT-012   | `/activation/recovery`        | Recovery / Explainable Locks          |
| ACT-006   | `/activation/complete`        | Activation complete                   |
| ACT-007   | `/activation/mobile-optional` | Thin optional mobile (skip → ONB-001) |
| ONB-001   | `/onboarding/entry`           | Onboarding entry handoff only         |

Route map: `apps/web/lib/activation-routes.ts`. Shared UI: `apps/web/app/activation/_components/`.

## UX patterns

- Progress list reflects gate completion (`data-done` on completed gates).
- Submitting states disable controls and announce status.
- Validation errors focus the error summary; success uses status roles — no raw API text.
- Recovery (ACT-012) never bypasses mandatory gates.
- ACT-007 skip/later must not block ONB-001.

## Deferred

Full onboarding (IDN · ONB-002 Set Origin · Nest / Horizon) → **GHV.IMPLEMENTATION.0D**.

## Related

- [ACTIVATION-UX-STATE-MATRIX.md](./ACTIVATION-UX-STATE-MATRIX.md)
- [ACTIVATION-LOCALIZATION.md](./ACTIVATION-LOCALIZATION.md)
- [ACTIVATION-ACCESSIBILITY.md](./ACTIVATION-ACCESSIBILITY.md)
- [ONBOARDING-ENTRY-HANDOFF.md](./ONBOARDING-ENTRY-HANDOFF.md)
