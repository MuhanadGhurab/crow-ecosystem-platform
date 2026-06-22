# Crow Supabase Pro Foundation

**Phase:** CLOUD.0 — Crow Cloud Foundation & Environment Separation  
**Branch:** `feat/first-tenant-golden-path`  
**Audit date:** 2026-06-18  
**Audit mode:** Read-only — no migrations applied, no Production promotion, no Auth metadata writes.

---

## Purpose

Document verified Supabase Pro platform posture for project `wbwnsndcxrgyqwppurms` (`supabase-aureolin-bucket`) and establish the recovery gate required before controlled dual-pending migration apply.

---

## 1. Verified platform facts

| Item | Status | Value |
|------|--------|-------|
| Organization | **Verified** | `muhanadghurab's projects` (`vercel_icfg_4NSnQrAYYxyi2QZCeq6pwmbr`) |
| Organization plan | **Verified** | **Pro** |
| Project reference | **Verified** | `wbwnsndcxrgyqwppurms` |
| Project name | **Verified** | `supabase-aureolin-bucket` |
| Project status | **Verified** | `ACTIVE_HEALTHY` |
| Database region | **Verified** | `eu-central-2` |
| Postgres engine | **Verified** | 17.6.1.121 (GA channel) |
| Database size (logical) | **Verified** | ~17 MB (`pg_database_size`) |
| Direct database fingerprint | **Verified** | `0355c17692e2a90d` |
| Pooler fingerprint | **Verified** | `b7f801cfe5e30009` (host/port differ — expected) |
| Pooler ↔ direct ref agreement | **Verified** | Same project ref and database name |
| Applied migrations (hosted) | **Verified** | 21 finished; 2 pending (see §4) |
| Failed migrations (blocking) | **Verified** | 0 |
| Edge Functions deployed | **Verified** | 0 |
| Storage buckets | **Verified** | 0 rows in `storage.buckets` |
| Installed extensions (active) | **Verified** | `plpgsql`, `pgcrypto`, `uuid-ossp`, `pg_stat_statements`, `supabase_vault` |

---

## 2. Unknown or unverified (do not assume)

| Item | Status | Operator action |
|------|--------|-----------------|
| Compute size (Micro/Small/Medium…) | **UNKNOWN** | Supabase Dashboard → Project Settings → Compute |
| Automatic backup schedule / last backup | **UNKNOWN** | Dashboard → Database → Backups |
| Backup retention window | **UNKNOWN** | Pro includes daily backups; confirm retention days |
| PITR enabled / recovery window | **UNKNOWN** | Dashboard → Database → Point in Time Recovery |
| Branching availability / current branches | **UNKNOWN** | MCP `list_branches` failed with permission error; verify Dashboard → Branching |
| Auth providers (Google, email, etc.) | **UNKNOWN** | Dashboard → Authentication → Providers |
| Custom SMTP configuration | **UNKNOWN** | Dashboard → Authentication → SMTP |
| CAPTCHA / Auth rate limits | **UNKNOWN** | Dashboard → Authentication → Attack Protection |
| Session timeout settings | **UNKNOWN** | Dashboard → Authentication → Sessions |
| Realtime publication config | **UNKNOWN** | Dashboard → Realtime; app uses Prisma primarily |
| Project members / access levels | **UNKNOWN** | Dashboard → Organization → Team; requires org admin review |
| Management API redirect allowlist | **UNKNOWN** | Set `SUPABASE_ACCESS_TOKEN` locally and run `scripts/audit-supabase-redirect-urls.ts` |

**Rule:** Record `UNKNOWN` until operator confirms in Dashboard or via fine-grained Management API token. Do not guess backup timestamps or PITR windows.

---

## 3. Pro plan implications (Crow)

Upgrading to **Pro** unlocks capabilities Crow will use in later waves, but CLOUD.0 does **not** enable them automatically:

| Pro capability | Crow relevance |
|----------------|----------------|
| Daily automatic backups | **Required** before shared-DB migration apply |
| Optional PITR add-on | Recommended before FTGP authority migration; billable beyond base Pro |
| Branching | Target for ephemeral PR environments **after** clean migration chain passes |
| Higher Auth MAU / email limits | Needed before Generation-2 public registration scale |
| Custom SMTP | Required before Production email verification at scale |
| Spend Cap | Does **not** cap PITR, branches, or read replicas — see cost doc |

---

## 4. Controlled migration inventory (shared hosted DB)

Approved pending inventory (exact allowlist enforced by `scripts/lib/controlled-migration-inventory.ts`):

| # | Migration | SHA-256 | Risk class |
|---|-----------|---------|------------|
| 1 | `20260618120000_c3_legal_publication_lifecycle` | `07678643967a72ee8965e54681e69def4c50561b4774e24100f0fc925e30c1ab` | ENUM addition (low) |
| 2 | `20260621120000_ftgp_platform_internal_role_assignment` | `8f66dcd89ca5d353864630d088a0dfb2af415e039c472cd54f5bc4e4c58191ed` | Security / authority |

**Gate re-run (2026-06-18):** All passed:

- `npm run db:migrate:controlled:check-preview` — exact inventory, hashes match, `BACKUP_REFERENCE_PRESENT=false`, `APPLY_AUTHORIZED=false`
- `npm run ftgp-controlled-migration-inventory:test` — PASS
- `npm run ftgp-migration-sql:verify` — PASS
- `npm run ftgp-migration-preflight:hosted` — PASS (0 existing internal role assignments)
- `npm run c2-database-isolation:verify` — PASS

**Apply authorization:** **Not issuable** until backup/PITR evidence is recorded (§5) **and** Data API containment path approved (CLOUD.1B).

**CLOUD.1B (2026-06-21):** FTGP migration SQL repinned after fail-closed hardening (`REVOKE` + RLS, no policies). Previous hash `4868d172…` **invalidated**. See `CROW_DATA_API_DEPENDENCY_AUDIT.md`.

---

## 5. Recovery gate (operator-only, gitignored)

**Pro plan context (CLOUD.0):** Organization plan **Pro** is verified. Pro includes **daily automatic backups** on the primary database; **PITR** is a separate paid add-on with its own recovery window — confirm both in Dashboard before apply. Spend Cap does **not** substitute for verifying backup completion or PITR coverage.

Before any controlled apply to the shared hosted database, operator must verify in Supabase Dashboard:

1. A **completed automatic backup** exists for project `wbwnsndcxrgyqwppurms`.
2. Backup **predates** migration execution time.
3. Backup belongs to the **correct project** (ref match).
4. Restore window is **valid** for rollback planning.
5. If PITR is enabled, note recovery window and prefer `MIGRATION_RECOVERY_METHOD=PITR` when appropriate.

Record **only** in gitignored operator configuration (copy from `.env.migration.recovery.example` → `.env.migration.recovery`):

```env
MIGRATION_BACKUP_REFERENCE=<opaque non-secret reference, e.g. dashboard backup id or operator ticket>
MIGRATION_BACKUP_VERIFIED_AT=<ISO-8601 timestamp>
MIGRATION_RECOVERY_METHOD=BACKUP|PITR
```

Validate with:

```bash
npm run migration-recovery:verify
```

Also create a **logical database dump outside the repository** (never under the repo):

```bash
npm run hosted-logical-dump:create
```

The script writes a manifest outside the repository (operator home backup directory) with SHA-256 and disposable-restore validation. Controlled wrapper reads recovery vars from `.env.migration.recovery` (supplemental to `.env.staging.runtime`). Check-only reports `BACKUP_REFERENCE_PRESENT=false` until operator attestation is recorded.

### CLOUD.1D recovery gate status (2026-06-22)

| Item | Result |
|------|--------|
| Hosted env | `.env.staging.runtime` (fingerprint `0355c17692e2a90d`) |
| Operator recovery file | `.env.migration.recovery` — **not present** |
| `npm run migration-recovery:verify` | `RECOVERY_EVIDENCE_VERIFIED=false` |
| Logical dump | **Created** — SHA-256 `9e22ce3ed69124050ccee33f730dedc00d1c060aee93a512124d8859b0b572f9`; validation `DISPOSABLE_RESTORE_PASSED` |
| Hosted env precedence | **Fixed** — localhost cannot override hosted `DIRECT_URL` |
| Data API containment re-check | **PASS** (CLOUD.1C posture unchanged) |
| Controlled check-only | Inventory + hashes **PASS**; `BACKUP_REFERENCE_PRESENT=false` |
| Apply authorization | **Not issuable** — recovery attestation required |

**Verdict:** `BLOCKED — BACKUP OR PITR EVIDENCE INVALID` (operator must populate `.env.migration.recovery` and re-run verify + check-only).

---

## 6. Clean migration chain status

**FAIL** — disposable Postgres cannot run the full repository migration chain.

```
Migration: 20260519120000_phase5_hr_crm_phase6_notifications
Error: relation "tenants" does not exist (SQLSTATE 42P01)
```

**Root cause:** `20260515150000_init_crow_ecosystem` is a **stub** (three enums only). No migration in the repository contains `CREATE TABLE "tenants"`. The shared hosted database was bootstrapped historically via **`db push` + baseline** (`scripts/baseline-migrations-from-push.mjs`), not a greenfield `migrate deploy`.

**Impact:**

- Supabase GitHub Branching must **not** be enabled until remediated.
- Ephemeral PR branches cannot rely on `migrate deploy` alone today.
- Shared hosted DB history remains valid; remediation must not rewrite applied migration files casually.

See remediation plan in `CROW_ENVIRONMENT_SEPARATION_PLAN.md` §4.

---

## 7. Hosted migration history notes (non-blocking)

Preflight reports **2 historical unfinished rows** (superseded):

- `20260519120000_phase5_hr_crm_phase6_notifications`
- `20260519180000_phase7_commercial_proposal`

These do **not** block apply (`blocking unfinished migrations: none`). They reflect early failed deploy attempts before baseline reconciliation on the shared database.

---

## 8. Current cloud services summary

| Service | Observed state |
|---------|----------------|
| PostgreSQL 17 | Active, ~17 MB |
| Supabase Auth | In use (11 platform accounts; app-integrated) |
| Storage | No buckets configured |
| Edge Functions | None deployed |
| Realtime | Not verified; not primary app path |
| Vault extension | Installed (`supabase_vault`) |
| Connection pooling | Supabase pooler in use (port 6543 / 5432) |

---

## 9. Explicit no-action statement (CLOUD.0)

This audit did **not**:

- Apply or resolve migrations
- Modify Supabase Auth metadata or providers
- Grant internal platform roles
- Publish Legal v1.1
- Deploy or promote Production
- Create Supabase branches
- Enable PITR or other paid add-ons

---

## 10. Recommended implementation waves

| Wave | Focus |
|------|-------|
| **1 — Recovery and migration readiness** | Verify backup/PITR; record recovery gate; controlled dual migration; hosted schema verification |
| **2 — Environment isolation** | Repair clean-baseline migration chain; persistent staging; safe seeds; move Vercel Preview off Production DB |
| **3 — Production-grade platform services** | Custom SMTP; Auth security controls; private Storage; RLS review; Edge Functions / Realtime where justified |
| **4 — FTGP authority activation** | Deploy authoritative internal-role code on isolated Preview/staging; bootstrap Platform Admin; grant candidate `IMPLEMENTER`; verify requester/operator separation |
| **5 — Request-to-review** | Customer implementation request; ownership; review queue; accept for Discovery; audit trail |
| **6 — Tenant lifecycle** | Discovery → Blueprint → Pricing → approval → Tenant Build → Tenant Admin → CyberCrow → SAREA → Go-Live |

---

## Related documents

- `CROW_ENVIRONMENT_SEPARATION_PLAN.md`
- `CROW_CLOUD_FEATURE_ENABLEMENT_MATRIX.md`
- `CROW_SUPABASE_SECURITY_AUDIT.md`
- `CROW_CLOUD_COST_GUARDRAILS.md`
- `docs/architecture/crow-core/first-tenant/FTGP_0D_DUAL_PENDING_RECONCILIATION.md`
