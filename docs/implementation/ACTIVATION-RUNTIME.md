# Activation Runtime

| Field             | Value                                                            |
| ----------------- | ---------------------------------------------------------------- |
| **Gate**          | GHV.IMPLEMENTATION.0B                                            |
| **Baseline**      | GHURAVIA Foundation Runtime and Activation Slice Baseline v0.2.0 |
| **Authorization** | GHV-IMP-AUTH-002                                                 |

## Formula (authoritative)

```text
activation_complete =
  email_verified
  AND current_terms_accepted
  AND account_risk_status = acceptable
```

Mobile verification is **not** part of this formula (ACT-007/008 optional after ACT-006).

## Screen path map

| ID      | Path                        |
| ------- | --------------------------- |
| ACT-003 | `/activation/email-pending` |
| ACT-011 | `/activation/email-result`  |
| ACT-005 | `/activation/terms`         |
| ACT-013 | `/activation/account-risk`  |
| ACT-012 | `/activation/recovery`      |
| ACT-006 | `/activation/complete`      |

## Commands

| HTTP                                          | Domain command                           |
| --------------------------------------------- | ---------------------------------------- |
| `POST /api/local/synthetic-session`           | Claim synthetic account + session cookie |
| `GET /api/activation`                         | Query activation resource                |
| `POST /api/activation/commands/request-email` | REQUEST_EMAIL_VERIFICATION               |
| `POST /api/activation/commands/confirm-email` | CONFIRM_EMAIL_VERIFICATION               |
| `POST /api/activation/commands/accept-terms`  | ACCEPT_TERMS                             |
| `POST /api/activation/commands/accept-risk`   | ACCEPT_ACCOUNT_RISK                      |
| `POST /api/activation/commands/activate`      | ACTIVATE                                 |
| `POST /api/activation/commands/recover`       | BEGIN_ACTIVATION_RECOVERY                |
| `POST /api/activation/commands/resend`        | REQUEST_REPLACEMENT_VERIFICATION         |
| `GET /api/local/mock-mailbox`                 | Local mock mailbox (session-gated)       |

All mutating commands require `Idempotency-Key` and `expectedVersion`.

## Persistence

- Migration `0000_foundation.sql` + `0001_activation_runtime.sql`
- Tables: aggregates, audit, outbox, verification_challenges (token **hash** only), command_receipts
- Transaction: load → version → receipt → domain → persist → audit → outbox → receipt → commit

## Invariants

- Delivery ≠ verification
- Payment ≠ activation
- Recovery cannot skip gates
- Synthetic / local / mocks only — no deploy
