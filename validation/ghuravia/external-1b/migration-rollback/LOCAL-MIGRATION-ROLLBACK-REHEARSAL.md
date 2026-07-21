# Local Migration / Rollback Rehearsal

| Control | Evidence |
|---|---|
| Expand | `002_additive.sql` adds nullable data without removing old representation |
| Backfill | `backfill.sql` is repeatable and scoped to missing values |
| Contract | `004_contract.sql` enforces the new representation after backfill |
| Idempotent rerun | Every DDL statement uses `IF EXISTS` / `IF NOT EXISTS`; harness applies `001` twice |
| Interrupted handling | Harness rolls back a transaction and confirms no partial audit row remains |
| Reset | Harness drops `ghv_migration_validation` after assertions |
| Audit | Migration audit rows identify validation-only execution |
| Verdict | **PASS** |

Interrupted migration recovery is a production runbook concern still retained for implementation/operations; this rehearsal proves the local transaction safety concept only.
