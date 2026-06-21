# FTGP.0C — Controlled Migration Safety Review

**Branch:** `feat/first-tenant-golden-path`  
**Review HEAD:** `00bc8ef6540c2ab2cd3f547f1ef6e178781a8198`  
**Migration:** `20260621120000_ftgp_platform_internal_role_assignment`  
**Migration SHA-256:** `8f66dcd89ca5d353864630d088a0dfb2af415e039c472cd54f5bc4e4c58191ed`  
**Prior hash (invalidated):** `4868d172cc2b100e54970e83977e3d9f9212d06c916258aa70df2b66f3f7bd5e`  
**Review date:** 2026-06-21  
**Apply status:** **NOT APPLIED** — explicit operator authorization required for next task.

---

## Purpose

Introduce database-backed ProCrow internal platform roles via `platform_internal_role_assignments`, separate from Supabase metadata and tenant membership. FTGP.0B committed schema + enforcement; FTGP.0C validates that controlled apply to the **shared hosted Supabase database** (Preview + unchanged Production deployment `dpl_EJiL9z1NnfvneHCR72JfoGE5NXmh`) is safe **before** pushing the FTGP branch (Preview deploy would query the new table on every authenticated request).

---

## Exact database objects created

| Object | Name | Notes |
|--------|------|-------|
| **Enum** | `PlatformInternalRole` | `PLATFORM_ADMIN`, `IMPLEMENTER`, `SALES`, `AUDITOR_READONLY` |
| **Enum** | `PlatformInternalRoleAssignmentStatus` | `ACTIVE`, `REVOKED` |
| **Enum alteration** | `PlatformAccountAuditEventType` | Adds `platform_internal_role_granted`, `platform_internal_role_revoked` |
| **Table** | `platform_internal_role_assignments` | Empty at apply time; no backfill |
| **PK** | `platform_internal_role_assignments_pkey` | `id TEXT NOT NULL` |
| **Index** | `…_platformAccountId_status_idx` | `(platformAccountId, status)` |
| **Index** | `…_role_status_idx` | `(role, status)` |
| **Index** | `…_grantCorrelationId_idx` | `(grantCorrelationId)` |
| **Partial unique index** | `platform_internal_role_assignments_one_active_per_role` | `(platformAccountId, role) WHERE status = 'ACTIVE'` |
| **FK** | `…_platformAccountId_fkey` | → `platform_accounts(id)` **ON DELETE CASCADE** |
| **FK** | `…_grantedByPlatformAccountId_fkey` | → `platform_accounts(id)` **ON DELETE RESTRICT** |
| **FK** | `…_revokedByPlatformAccountId_fkey` | → `platform_accounts(id)` **ON DELETE SET NULL** |

**Column defaults:** `status DEFAULT 'ACTIVE'`, `grantedAt DEFAULT CURRENT_TIMESTAMP`, `createdAt DEFAULT CURRENT_TIMESTAMP`. No `UPDATE` backfill. No triggers.

**Prisma fidelity:** Model, enums, relations, and FK delete behaviors match migration SQL. Partial unique index exists **only in migration SQL** (not expressible as Prisma `@@unique`); enforced at PostgreSQL layer. No unrelated schema changes in this migration folder.

---

## Current Production compatibility

```text
CURRENT_PRODUCTION_CODE_COMPATIBLE_WITH_MIGRATED_SCHEMA=true
```

**Rationale:** Production deployment still runs pre-FTGP code. It does not query `platform_internal_role_assignments`. The migration is strictly additive:

- No `DROP` / `RENAME` / column nullability changes on existing tables
- No `TenantMembership` changes
- No request-ownership or legal-table changes
- No triggers on existing writes
- No row mutations on existing data
- New audit enum values are inert until FTGP code writes them

Applying this migration **before** deploying FTGP code leaves Production behavior unchanged.

---

## Code-before-migration behavior (critical)

FTGP code **must not** reach Preview/Production before the migration is applied.

`resolveAuthoritativeCrowAuth` always calls `listActiveInternalRolesForSupabaseUser` → `prisma.platformInternalRoleAssignment.findMany`. Without the table, Prisma raises **`P2021` (table does not exist)** on:

- `/account` layout and profile flows (`session.ts`)
- `/client` shell (`client-portal-shell.tsx`)
- `/admin` layout
- Public header session resolution (`public-header-auth.ts`)
- C3 post-auth landing (`c3-post-auth-landing.ts`)
- Client request access checks (`client-request-link.service.ts`)

There is **no** fail-closed fallback; errors propagate (correct security posture — no silent grant). Static/build paths do not query the table at build time.

**Required rollout order:**

```text
1. Controlled apply (shared DB) — all intended pending migrations
2. Schema verification (preflight + migrate status)
3. Push feat/first-tenant-golden-path
4. Preview deployment
5. Operator bootstrap + first IMPLEMENTER grant (separate authorized step)
6. Retained requester / candidate operator verification
```

**Do not push the FTGP branch until step 2 passes** — Vercel Preview would otherwise deploy code that hard-depends on a missing table.

---

## Active-assignment uniqueness

**Database layer:**

```sql
CREATE UNIQUE INDEX "platform_internal_role_assignments_one_active_per_role"
ON "platform_internal_role_assignments" ("platformAccountId", "role")
WHERE "status" = 'ACTIVE';
```

- Predicate uses quoted Prisma column names (`"status"`, `"platformAccountId"`, `"role"`).
- Multiple **REVOKED** historical rows per `(account, role)` are allowed.
- Only one **ACTIVE** row per `(account, role)`.

**Service layer** (`platform-internal-role.service.ts`):

- Pre-insert `findFirst` for active row
- Idempotent retry when `grantCorrelationId` matches existing active assignment
- `P2002` → `DUPLICATE_ACTIVE` on concurrent grant race

Concurrent grants cannot persist two ACTIVE rows; one transaction wins, the other gets a deterministic error or idempotent return.

---

## Foreign-key and deletion semantics

| FK | On delete | Effect |
|----|-----------|--------|
| Subject `platformAccountId` | **CASCADE** | Deleting a `PlatformAccount` **deletes** its assignment rows (including REVOKED history for that account) |
| Grantor `grantedByPlatformAccountId` | **RESTRICT** | Cannot delete a grantor account while assignment rows reference it as grantor |
| Revoker `revokedByPlatformAccountId` | **SET NULL** | Revoker account deletion nulls `revokedByPlatformAccountId`; assignment row preserved |

**Answers:**

- **Target account deleted:** assignment rows cascade away (audit events in `platform_account_audit_events` remain if already written).
- **Grantor deleted:** blocked while referenced (RESTRICT).
- **Revoker deleted:** assignment kept; revoker FK nulled.
- **Historical grants:** preserved in REVOKED rows until subject account deletion (CASCADE).
- **Security evidence:** audit events are separate rows; assignment table history can be lost on subject account CASCADE — acceptable only if account deletion is itself a controlled, rare operation.
- **Active assignments:** deleting an account with ACTIVE assignments is prevented indirectly only if grantor RESTRICT applies to other accounts; subject CASCADE will remove assignments.

No deletion semantics were changed during this review.

---

## Audit enum alteration

Migration executes:

```sql
ALTER TYPE "PlatformAccountAuditEventType" ADD VALUE 'platform_internal_role_granted';
ALTER TYPE "PlatformAccountAuditEventType" ADD VALUE 'platform_internal_role_revoked';
```

- Uses plain `ADD VALUE` (**not** `IF NOT EXISTS`, unlike some C3 migrations). Re-apply after partial success would fail on duplicate enum labels.
- Runs in migration transaction; PostgreSQL enum additions are committed with the migration.
- **Rollback classification:** `ROLLBACK_TABLE_REVERSIBLE_ENUM_FORWARD_FIX_REQUIRED`
  - Table + indexes: reversible via `DROP`
  - New enums (`PlatformInternalRole`, `PlatformInternalRoleAssignmentStatus`): droppable when unused
  - **Added audit enum values cannot be removed** without manual PostgreSQL catalog surgery; treat as forward-fix-only

---

## Existing-data preflight (shared hosted DB, read-only)

**Target fingerprint:** `0355c17692e2a90d` (masked Supabase pooler/direct — operator env files)

| Aggregate | Count |
|-----------|------:|
| `platform_accounts` | 11 |
| `tenant_memberships` | 3 |
| `platform_account_audit_events` | 139 |
| `platform_internal_role_assignments` | 0 (table absent) |

```text
existing internal assignments = 0
backfill required = false
```

**Object preflight:** FTGP table, enums, and partial index **do not exist** yet (expected).

**Historical drift note:** `_prisma_migrations` contains 2 rolled-back rows and 2 unfinished historical rows for early phase-5 migrations, superseded by successful apply records. **Blocking unfinished migrations: none.** `prisma migrate status` does not report failed migrations.

**`20260620120000_c3_password_recovery_audit`:** **Already applied** on shared DB (`password_recovery_requested` enum present).

---

## Pending migration inventory (shared hosted DB)

`prisma migrate status` (2026-06-21, read-only):

```text
Following migrations have not yet been applied:
  20260618120000_c3_legal_publication_lifecycle
  20260621120000_ftgp_platform_internal_role_assignment
```

**`20260618120000_c3_legal_publication_lifecycle`** is enum-only:

```sql
ALTER TYPE "LegalDocumentVersionStatus" ADD VALUE IF NOT EXISTS 'reviewed';
ALTER TYPE "LegalDocumentVersionStatus" ADD VALUE IF NOT EXISTS 'approved_for_publication';
```

Additive; no table changes. **`migrate deploy` applies pending migrations in chronological order** — both will run in one deploy unless history is reconciled.

⚠️ **`scripts/run-controlled-migration.ts` inventory guards** were outdated at FTGP.0C review time (expected only legacy C3 pending sets). **FTGP.0D hardened the wrapper** — see `FTGP_0D_DUAL_PENDING_RECONCILIATION.md` and `scripts/lib/controlled-migration-inventory.ts`. Use:

```bash
npm run db:migrate:controlled:check-preview
```

---

## Lock and performance analysis

Given current row counts (empty new table; small existing tables):

| Step | Lock / impact |
|------|----------------|
| `CREATE TYPE` (×2) | Lightweight catalog lock |
| `ALTER TYPE … ADD VALUE` (×2) | Brief enum commit; no table rewrite |
| `CREATE TABLE` | Metadata only; empty table |
| `CREATE INDEX` (×3) | Fast on empty table |
| Partial unique index | Fast on empty table |
| `ADD FOREIGN KEY` | Validates `platform_accounts` referential integrity (indexed PK lookup); no rewrite of parent table |

No existing large-table rewrite. No full-table scan on hot paths beyond FK validation against `platform_accounts` (11 rows). Expected duration: **seconds**. Low risk during normal traffic; prefer low-traffic window for enum alterations on shared Production backend.

---

## Backup / PITR verification

**Not verified in this review session.** Operator must confirm before apply:

- Recent Supabase backup or PITR window covers the apply window
- `MIGRATION_BACKUP_CHECKSUM` recorded (required by controlled apply)
- Pre-apply fingerprint matches `EXPECTED_DATABASE_FINGERPRINT` / `EXPECTED_DIRECT_DATABASE_FINGERPRINT`

If backup/PITR cannot be confirmed, classify apply risk as **elevated** and defer.

---

## Controlled apply mechanism (do not execute)

**Wrapper:** `npm run db:migrate:controlled` → `scripts/run-controlled-migration.ts`  
**CI:** `.github/workflows/database-migrate.yml` (`workflow_dispatch` only)

**Guards:**

- `DATABASE_ENVIRONMENT` + fingerprint match
- `APP_ENVIRONMENT` alignment (shared backend requires `--allow-shared-production-backend` + `BACKEND_ISOLATION=shared`)
- Apply requires `ALLOW_DATABASE_MIGRATION=true`, confirmation phrase, `MIGRATION_BACKUP_CHECKSUM`
- Does not deploy application code or mutate Supabase Auth metadata

**Future check-only example (secrets omitted):**

```bash
npm run db:migrate:controlled -- \
  --environment preview \
  --check-only \
  --allow-shared-production-backend \
  --expected-migration 20260621120000_ftgp_platform_internal_role_assignment
```

**Future apply example (after wrapper update + operator authorization):**

```bash
# Env: DATABASE_URL, DIRECT_URL, DATABASE_ENVIRONMENT=production,
#      APP_ENVIRONMENT=preview, BACKEND_ISOLATION=shared,
#      EXPECTED_DATABASE_FINGERPRINT, EXPECTED_DIRECT_DATABASE_FINGERPRINT,
#      ALLOW_DATABASE_MIGRATION=true,
#      MIGRATION_BACKUP_CHECKSUM=<from fresh backup>,
#      CONFIRMATION_PHRASE="APPLY PREVIEW DATABASE MIGRATIONS"

npm run db:migrate:controlled -- \
  --environment preview \
  --confirm "APPLY PREVIEW DATABASE MIGRATIONS" \
  --allow-shared-production-backend
```

**Note:** `migrate deploy` applies **all** pending migrations in order (legal publication lifecycle, then FTGP). Operator must authorize **both**, not FTGP alone.

---

## Post-apply verification plan (prepare only — not executed)

### Database

- [ ] `_prisma_migrations` records both pending migrations exactly once
- [ ] `platform_internal_role_assignments` exists; row count = 0
- [ ] Enums + partial unique index present
- [ ] FK constraints present
- [ ] `tenant_memberships` count unchanged (3)
- [ ] No legal/request ownership drift

**Commands:**

```bash
npm run ftgp-migration-preflight:hosted
npm run db:migrate:controlled -- --environment preview --check-only --allow-shared-production-backend
```

### Application regression

```bash
npm run ftgp-authority-boundaries:test
npm run c3-role-neutral-onboarding:test
npm run c3-legacy-metadata-authorization:verify
npm run c3-public-header-session:test
npm run c3-account:verify
npm run c3-auth-convergence:verify
npm run c3-10j:preserved-identity:verify
npm run c2-database-isolation:verify
npm run typecheck
npm run lint
npm run build
```

### Hosted identity (after Preview deploy)

- Retained requester unchanged (no internal role, no tenant membership)
- Candidate operator unchanged (no grant during migration)
- Stale metadata non-authoritative
- `/account` available; `/client` and `/admin` denied without DB authority

---

## Read-only verification helpers added

| Script | Purpose |
|--------|---------|
| `scripts/verify-ftgp-migration-sql.ts` | Static SQL/schema fidelity |
| `scripts/verify-ftgp-migration-preflight-hosted.ts` | Hosted aggregate preflight |

```bash
npm run ftgp-migration-sql:verify
npm run ftgp-migration-preflight:hosted
```

---

## Explicit no-apply statement

**FTGP.0C did not apply `20260621120000_ftgp_platform_internal_role_assignment`.**  
Shared hosted database unchanged. No Supabase metadata writes. No internal role grants. Retained requester and candidate operator unchanged. Branch not pushed.

---

## Review verdict

| Check | Result |
|-------|--------|
| Migration SQL additive & faithful | PASS |
| Production-compatible if migrated first | PASS |
| Code-before-migration safe | **FAIL** (P2021 — migration must precede deploy) |
| Uniqueness / FK / enum safety | PASS (enum rollback limited — documented) |
| FTGP objects absent pre-apply | PASS |
| Backfill required | NO |
| Single pending migration | **FAIL** — 2 pending (legal lifecycle + FTGP) |
| Controlled wrapper recognizes inventory | **PASS** (FTGP.0D — exact two-migration allowlist) |
| Legal lifecycle migration state | **TRULY_UNAPPLIED** (FTGP.0D read-only reconciliation) |
| Backup/PITR confirmed | **NOT VERIFIED** |

**Authorization recommendation (post FTGP.0D):**

```text
BLOCKED — BACKUP OR PITR EVIDENCE REQUIRED
```

After operator backup/PITR confirmation:

```text
READY — DUAL-PENDING INVENTORY RECONCILED; CONTROLLED APPLY MAY BE AUTHORIZED
```

The FTGP migration SQL is production-compatible and ready for controlled apply **together with** `20260618120000_c3_legal_publication_lifecycle` (TRULY_UNAPPLIED), after:

1. ~~Updating `run-controlled-migration.ts` pending inventory guards~~ ✓ FTGP.0D
2. Operator backup/PITR confirmation
3. Explicit authorization phrase

Then: migrate → verify → push → Preview deploy → bootstrap → grant.

---

## Safe rollout sequence (operator)

```text
Migration review (FTGP.0C) ✓
→ dual-pending reconciliation (FTGP.0D) ✓
→ operator backup + authorization
→ additive shared-DB migrate deploy (2 pending migrations)
→ database verification
→ push feat/first-tenant-golden-path
→ Preview deployment
→ authorize bootstrap
→ grant candidate operator IMPLEMENTER
→ verify operator/requester separation
```

---

## CLOUD.1B — PostgREST fail-closed hardening (2026-06-21)

Hosted default privileges grant full CRUD to `anon` and `authenticated` on new tables. The original migration SQL would have created an **exposed internal-authority table** (`SECURITY_INCOMPATIBLE_UNDER_CURRENT_DEFAULT_PRIVILEGES`).

**Corrective DDL (same migration folder, unapplied):**

```sql
ALTER TABLE "platform_internal_role_assignments" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "platform_internal_role_assignments" FROM anon, authenticated;
```

- No RLS policies (server-only via Prisma/direct Postgres)
- No JWT metadata policies
- Sequence: table uses `TEXT` PK — no separate sequence grant required

**Repinned SHA-256:** `8f66dcd89ca5d353864630d088a0dfb2af415e039c472cd54f5bc4e4c58191ed`

Controlled apply remains blocked until recovery evidence + Data API containment approval (see `CROW_EMERGENCY_EXPOSURE_CONTAINMENT.md`).
