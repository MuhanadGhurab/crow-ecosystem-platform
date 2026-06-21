# FTGP.0D — Dual-Pending Migration Reconciliation

**Branch:** `feat/first-tenant-golden-path`  
**Task HEAD (pre-0D commits):** `1966882`  
**Review date:** 2026-06-18  
**Apply status:** **NOT APPLIED** — no migration apply, resolve, or mark during FTGP.0D.

---

## Purpose

Reconcile the discrepancy between prior project records (legal lifecycle migration described as schema-applied) and current Prisma inspection (legal lifecycle reported pending). Harden the controlled migration wrapper to enforce an exact two-migration inventory, add safety tests, rehearse schema/constraints on disposable local Postgres, and prepare the authorized apply plan.

---

## 1. Legal migration discrepancy — classification

**Migration:** `20260618120000_c3_legal_publication_lifecycle`  
**SQL SHA-256:** `07678643967a72ee8965e54681e69def4c50561b4774e24100f0fc925e30c1ab`

```sql
ALTER TYPE "LegalDocumentVersionStatus" ADD VALUE IF NOT EXISTS 'reviewed';
ALTER TYPE "LegalDocumentVersionStatus" ADD VALUE IF NOT EXISTS 'approved_for_publication';
```

### Read-only evidence (shared hosted Supabase, direct connection)

| Evidence | Result |
|----------|--------|
| `_prisma_migrations` row for legal migration | **Absent** |
| Migration checksum in history | **N/A** (no row) |
| `reviewed` enum label | **Absent** |
| `approved_for_publication` enum label | **Absent** |
| `LegalDocumentVersionStatus` total labels | **3** (pre-legal-lifecycle set only) |
| Direct database fingerprint | `0355c17692e2a90d` |
| Pooler fingerprint | `b7f801cfe5e30009` (host/port differ — expected on Supabase) |
| Project ref match (pooler ↔ direct) | **Yes** |
| Database name match (pooler ↔ direct) | **Yes** |
| Prior `20260620120000_c3_password_recovery_audit` | **Applied** (`password_recovery_requested` present) |

### Classification

```text
TRULY_UNAPPLIED
```

**Root cause of prior misreport:** Earlier notes assumed schema-applied status without verifying `_prisma_migrations` and live enum labels on the same direct database target. The legal lifecycle enum values were never added on the shared hosted database.

**Treatment:** Include in the normal two-migration controlled apply (not history reconciliation). Do **not** run `prisma migrate resolve` for this migration.

---

## 2. Database target agreement

| Target | Value |
|--------|-------|
| Shared Supabase project ref | `wbwn…urms` (masked) |
| Database | `postgres` / schema `public` |
| `APP_ENVIRONMENT` | `preview` |
| `DATABASE_ENVIRONMENT` | `production` |
| `BACKEND_ISOLATION` | `shared` |
| Direct fingerprint (controlled apply) | `0355c17692e2a90d` |
| Pooler/direct agreement | **Match** (same project ref + database; fingerprints differ by host/port only) |

---

## 3. Approved future migration inventory

Exact ordered allowlist (pinned in `scripts/lib/controlled-migration-inventory.ts`):

| Order | Migration | SQL SHA-256 | Risk | Apply mode |
|-------|-----------|-------------|------|------------|
| 1 | `20260618120000_c3_legal_publication_lifecycle` | `07678643967a72ee8965e54681e69def4c50561b4774e24100f0fc925e30c1ab` | `ENUM_ADDITION_LOW_RISK` | `schema_deploy` |
| 2 | `20260621120000_ftgp_platform_internal_role_assignment` | `8f66dcd89ca5d353864630d088a0dfb2af415e039c472cd54f5bc4e4c58191ed` | `SHARED_DATABASE_MIGRATION_SECURITY_AUTHORITY` | `schema_deploy` |

**Invalidated hash:** `4868d172cc2b100e54970e83977e3d9f9212d06c916258aa70df2b66f3f7bd5e` (pre–CLOUD.1B fail-closed hardening). Controlled wrapper rejects old pin.

**Hosted check-only (FTGP.0D):**

```text
EXPECTED_PENDING_MIGRATIONS=20260618120000_c3_legal_publication_lifecycle,20260621120000_ftgp_platform_internal_role_assignment
ACTUAL_PENDING_MIGRATIONS=20260618120000_c3_legal_publication_lifecycle,20260621120000_ftgp_platform_internal_role_assignment
APPLIED_MIGRATION_COUNT=21
FAILED_MIGRATION_COUNT=0
DIRECT_POOLER_TARGET_MATCH=true
BACKUP_REFERENCE_PRESENT=false
APPLY_AUTHORIZED=false
```

---

## 4. Wrapper hardening (FTGP.0D)

Updated:

- `scripts/lib/controlled-migration-inventory.ts` — pinned inventory, hash validation, pooler/direct agreement, backup reference gates, structured check report
- `scripts/run-controlled-migration.ts` — exact inventory enforcement; fails closed on unexpected/missing pending migrations, hash drift, failed history, target mismatch, missing backup (apply mode), wrong confirmation phrase
- `scripts/inspect-legal-lifecycle-migration-state.ts` — read-only legal migration classifier
- `npm run db:migrate:controlled:check-preview` — check-only against shared backend with env files loaded

**Fail-closed conditions enforced:**

- Unexpected pending migration
- Expected migration missing
- SQL hash differs from pinned inventory
- Pending order differs from approved order
- Failed/rolled-back blocking migration row
- Database fingerprint mismatch
- Pooler/direct project ref or database mismatch
- Backup reference absent (apply mode)
- Wrong confirmation phrase (apply mode)
- Shared-backend acknowledgment absent when required

---

## 5. Tests and local rehearsal

### Inventory safety tests

```bash
npm run ftgp-controlled-migration-inventory:test
```

Result: `PASS — CONTROLLED MIGRATION WRAPPER ENFORCES EXACT RECONCILED INVENTORY`

Covers: exact inventory pass, missing/extra/reordered pending, hash drift, failed history, pooler/direct mismatch, backup gate, check-only non-apply, confirmation phrase, no history-reconcile-only entries, documented code-before-migration gate.

### Disposable local rehearsal

```bash
npm run ftgp-dual-migration:rehearse-local
```

Result: `PASS — LOCAL DUAL-MIGRATION REHEARSAL (schema + constraints)`

**Note:** Full `migrate deploy` from empty vanilla Postgres (docker 5433) fails at legacy migration `20260519120000_phase5_hr_crm_phase6_notifications` (`tenants` FK ordering). This does **not** affect the shared hosted database (already at 21 applied migrations). Local rehearsal validates post-apply schema fidelity via `db push` on disposable docker Postgres, then exercises:

- Legal lifecycle enum values
- `PlatformInternalRole` enum
- Zero initial assignments
- Partial unique index behavior (migration-only index applied per migration SQL semantics)
- Foreign keys
- Duplicate ACTIVE assignment blocked

**History reconciliation rehearsal:** Not required — legal migration classified `TRULY_UNAPPLIED`.

---

## 6. Backup / PITR requirement

**Not verified in FTGP.0D.** Apply remains blocked until operator confirms in Supabase Dashboard and sets:

```text
MIGRATION_BACKUP_REFERENCE=<opaque operator-provided value>
MIGRATION_BACKUP_VERIFIED_AT=<ISO-8601 timestamp>
MIGRATION_RECOVERY_METHOD=BACKUP|PITR
```

Legacy `MIGRATION_BACKUP_CHECKSUM` remains accepted as an alternative reference. Check-only reports `BACKUP_REFERENCE_PRESENT=false` without blocking inventory validation.

---

## 7. Future authorized apply flow

### Normal two-migration apply (current classification)

Both migrations are genuinely unapplied on the shared hosted database.

```text
1. npm run db:migrate:controlled:check-preview
2. Operator reviews inventory + SQL hashes
3. Verify backup/PITR in Supabase Dashboard
4. Set MIGRATION_BACKUP_REFERENCE + MIGRATION_BACKUP_VERIFIED_AT + MIGRATION_RECOVERY_METHOD
5. ALLOW_DATABASE_MIGRATION=true
6. npm run db:migrate:controlled -- --environment preview --confirm "APPLY PREVIEW DATABASE MIGRATIONS" --allow-shared-production-backend
7. Schema verification (post-apply scripts)
8. Migration history verification
9. Application regression suite
10. Push feat/first-tenant-golden-path (only after step 7–9 pass)
11. Preview deploy → bootstrap → grant IMPLEMENTER (separate authorization)
```

**Do not** combine history reconciliation with new schema apply in a single opaque action.

### History reconciliation path

**Not required** for FTGP.0D. Would only apply if legal migration were reclassified `SCHEMA_APPLIED_HISTORY_MISSING` after proving exact schema equivalence.

---

## 8. Post-apply verification plan (future authorized run)

### Migration state

- Legal migration recorded exactly once in `_prisma_migrations`
- FTGP migration recorded exactly once
- No failed rows; no unexpected pending migrations

### Schema

- `reviewed`, `approved_for_publication` enum values present
- `PlatformInternalRole`, `PlatformInternalRoleAssignmentStatus` enums present
- `platform_internal_role_assignments` table, FKs, indexes, partial unique index present
- Zero initial internal role assignments

### Existing state unchanged

- PlatformAccount / TenantMembership / legal acceptance counts unchanged
- Request ownership unchanged; hosted v1.0 legal current; Legal v1.1 unpublished
- Retained requester unchanged; candidate operator unchanged (no grant during migration)

### Application regression

```bash
npm run ftgp-authority-boundaries:test
npm run ftgp-migration-sql:verify
npm run ftgp-migration-preflight:hosted
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

---

## 9. Platform account deletion note (non-blocker)

CASCADE on deletion of the subject `PlatformAccount` removes its assignment rows; audit events remain in `platform_account_audit_events`. Before Production release, decide whether internal operator accounts are deletable or should only be deactivated — platform-account retention policy item, not a blocker for this additive migration apply.

---

## 10. Explicit no-apply statement

**FTGP.0D did not apply, resolve, or mark any migration.**  
Shared hosted Supabase database unchanged. No Supabase Auth metadata writes. No internal role grants. Retained requester and candidate operator unchanged. Branch not pushed.

---

## Authorization recommendation

```text
BLOCKED — BACKUP OR PITR EVIDENCE REQUIRED
```

Inventory is reconciled and the controlled wrapper enforces the exact two-migration allowlist. Controlled apply may proceed **only after**:

1. Operator backup/PITR confirmation (`CROW_SUPABASE_PRO_FOUNDATION.md` §5)
2. **CLOUD.1B:** Data API containment path approved (`CROW_EMERGENCY_EXPOSURE_CONTAINMENT.md`)
3. FTGP migration fail-closed hash repinned (`8f66dcd89ca5d353864630d088a0dfb2af415e039c472cd54f5bc4e4c58191ed`)
4. Explicit authorization phrase

When all gates pass:

```text
READY — DUAL-PENDING INVENTORY RECONCILED; CONTROLLED APPLY MAY BE AUTHORIZED
```

**CLOUD.1B note:** Repository has **zero** business PostgREST dependencies — emergency removal of `public` from exposed schemas does not break Auth or Prisma routes.

---

## Related documents

- `CROW_SUPABASE_PRO_FOUNDATION.md` (CLOUD.0 Pro recovery gate)
- `FTGP_0C_CONTROLLED_MIGRATION_REVIEW.md` (updated for 0D supersession of wrapper gaps)
- `scripts/lib/controlled-migration-inventory.ts`
- `docs/architecture/cloud/CROW_SUPABASE_PRO_FOUNDATION.md`
- C2 controlled migration delivery docs
