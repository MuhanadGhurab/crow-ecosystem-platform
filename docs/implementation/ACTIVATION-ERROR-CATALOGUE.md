# Activation Error Catalogue

| Category             | HTTP | When                                                       |
| -------------------- | ---- | ---------------------------------------------------------- |
| VALIDATION_ERROR     | 400  | Missing Idempotency-Key / expectedVersion / invalid token  |
| UNAUTHORIZED         | 401  | Missing or invalid synthetic session                       |
| FORBIDDEN            | 403  | Privileged correction missing authority/reason             |
| LOCAL_RUNTIME_ONLY   | 403  | Non-local mode or missing local secret                     |
| NOT_FOUND            | 404  | Aggregate missing                                          |
| CONFLICT             | 409  | Optimistic version mismatch / aggregate exists             |
| IDEMPOTENCY_CONFLICT | 409  | Same key, different payload fingerprint                    |
| INVALID_TRANSITION   | 409  | Illegal state transition or incomplete formula             |
| CHALLENGE_EXPIRED    | 410  | Email challenge past expiry                                |
| ACTIVATION_LOCKED    | 409  | Explainable lock blocks progression (surfaced in resource) |
| INTERNAL_ERROR       | 500  | Unexpected failure (fail closed)                           |

Explainable locks (Arabic-first) are returned on the activation resource (`locks[]`), not only as HTTP errors.
