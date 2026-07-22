# Activation UX State Matrix

| Field           | Value                                                           |
| --------------- | --------------------------------------------------------------- |
| **Document ID** | GHV-DOC-ACT-UX-STATE-001                                        |
| **Gate**        | GHV.IMPLEMENTATION.0C                                           |
| **Version**     | 0.3.0                                                           |
| **Baseline**    | GHURAVIA Activation UX and Onboarding Entry Baseline **v0.3.0** |

## Screens in scope

```text
ACT-003 · ACT-011 · ACT-005 · ACT-013 · ACT-012 · ACT-006 · ACT-007 · ONB-001
```

| Screen ID | Route                         |
| --------- | ----------------------------- |
| ACT-003   | `/activation/email-pending`   |
| ACT-011   | `/activation/email-result`    |
| ACT-005   | `/activation/terms`           |
| ACT-013   | `/activation/account-risk`    |
| ACT-012   | `/activation/recovery`        |
| ACT-006   | `/activation/complete`        |
| ACT-007   | `/activation/mobile-optional` |
| ONB-001   | `/onboarding/entry`           |

## State matrix

| State                                 | UX treatment                                             |
| ------------------------------------- | -------------------------------------------------------- |
| initial loading                       | Localized loading announcement                           |
| authenticated loading                 | Progress shell + polite status                           |
| unauthorized                          | Session create CTA (local only)                          |
| session expired                       | Localized session message; clear private client fields   |
| database unavailable                  | Mapped INTERNAL / provider unavailable copy              |
| provider mock unavailable             | `errProviderUnavailable`                                 |
| empty / ready                         | Screen body + gates                                      |
| submitting                            | Disabled controls + submitting status                    |
| success                               | Status role; no raw API text                             |
| validation error                      | Error summary focus                                      |
| stale-version conflict                | Refresh resource; `errStaleVersion`; no silent re-accept |
| idempotency replay                    | Treated as success via resource refresh                  |
| idempotency conflict                  | Explained; no blind retry                                |
| invalid transition                    | Localized `errInvalidTransition`                         |
| challenge expired/consumed/superseded | Challenge / conflict mapping                             |
| attempt limit                         | Validation / conflict mapping                            |
| recovery available                    | ACT-012 CTA                                              |
| recovery unavailable                  | Lock copy without bypass                                 |
| already completed                     | Completed gate status / redirect                         |
| account suspended/closed              | Lock catalogue                                           |
| ACT-007 optional offer                | Skip/later and verify-deferred paths both reach ONB-001  |
| ONB-001 handoff                       | Deferred onboarding CTA only; no IDN forms               |

## Invariant

No screen renders raw `Error.message` from the server.

## Related

- [ACTIVATION-UX.md](./ACTIVATION-UX.md)
- [ACTIVATION-ERROR-CATALOGUE.md](./ACTIVATION-ERROR-CATALOGUE.md)
