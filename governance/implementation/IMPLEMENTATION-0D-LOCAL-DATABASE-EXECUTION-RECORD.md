# IMPLEMENTATION-0D — Local Database Execution Record

| Field | Value |
|-------|-------|
| **Document ID** | GHV-IMP-0D-DB-EXEC |
| **Gate** | GHV.IMPLEMENTATION.0D · GHV.IMPLEMENTATION.0D-CLOSURE-01 |
| **Date** | 2026-07-22 |

## Path reconciliation

| Path | Reality |
|------|---------|
| Preferred local path | Disposable Docker PostgreSQL |
| Actual agent-local path | **Native loopback PostgreSQL** because Docker overlay failed in the agent VM (`docker run` overlay mount error) |
| Remote CI path | Ephemeral GitHub Actions PostgreSQL **service container** |

A native loopback service is **not** classified as an external/cloud database merely because it ran inside an agent VM.

## Local service facts

| Fact | Value |
|------|-------|
| PostgreSQL version | **16.14** (Ubuntu 16.14-0ubuntu0.24.04.1) |
| Loopback hostname | `127.0.0.1` |
| Listening | `127.0.0.1:5432` and `[::1]:5432` only |
| Synthetic database names | `ghuravia_local_dev` · `ghuravia_test_ci` |
| Synthetic credential treatment | Local-only `GHURAVIA_DATABASE_URL` in `.env.local` (not committed) · disposable credentials · not Production secrets |
| PostgreSQL service pre-existed | **YES** — operator/agent-environment owned native service |
| Gate-created database/schema | Databases `ghuravia_local_dev` / `ghuravia_test_ci` and migration schemas applied for Gate work |
| Cloud database used | **NO** |
| Production database used | **NO** |
| Real data used | **NO** |
| External network exposure | **NO** (loopback only) |

## Migration / validation results

| Step | Result |
|------|--------|
| Migrations `0000` · `0001` · `0002` | Applied on disposable local DBs |
| `npm run db:validate` | PASS (at Closure validation) |
| Integration tests | PASS against `ghuravia_test_ci` / configured test URL |
| `npm run db:reset` (when used) | Local confirm required · destructive local only |

## Cleanup result (CLOSURE-01)

After complete local CI (2026-07-22):

| Item | Result |
|------|--------|
| Gate-created synthetic contents | Dropped with databases |
| Databases dropped | `ghuravia_local_dev` · `ghuravia_test_ci` |
| Gate-created databases retained | **0** |
| Gate-created schemas retained | **0** |
| External database operations | **0** |
| Real data | **0** |
| Remaining service ownership | Native PostgreSQL **16.14** remains running as **operator-owned** environment service (loopback only) |
| Gate-created disposable volumes | **0** |
| Disposable claim | Databases dropped with evidence above; the operator-owned postgres *service* is not claimed disposable |

## Explicit non-claims

```text
Native loopback ≠ external database
Native loopback ≠ Production database
CI service container ≠ retained cloud database
Operator-owned postgres service may remain without violating Gate cleanup
when Gate-created databases/schemas are removed or reset
```
