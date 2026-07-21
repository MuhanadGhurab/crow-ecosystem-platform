# Local PostgreSQL Readiness

| Field | Evidence |
|---|---|
| Database family | PostgreSQL |
| Validation endpoint | `127.0.0.1:55432` only |
| Credentials | Synthetic process-environment values only |
| Schema isolation | `ghv_validation_1b`, created and dropped by harness |
| Verdict | **PASS** |

The validated endpoint is local and ephemeral. It is not Preview, production, or a datastore-host selection. No connection string is stored in this repository.
