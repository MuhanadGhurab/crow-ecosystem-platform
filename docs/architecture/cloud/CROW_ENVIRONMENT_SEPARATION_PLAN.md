# Crow Environment Separation Plan

**Phase:** CLOUD.0  
**Branch:** `feat/first-tenant-golden-path`  
**Status:** Design / plan — not implemented in this audit.

---

## 1. Target topology

```
┌─────────────────────────────────────────────────────────────────┐
│ Production (canonical)                                          │
│  Supabase: wbwnsndcxrgyqwppurms                                 │
│  Vercel: Production branch                                      │
│  Data: real customer + platform data                            │
│  Auth: Production Auth users                                    │
│  Storage: Production buckets (future)                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Persistent Staging                                              │
│  Supabase: NEW dedicated project OR persistent branch         │
│  Vercel: staging / long-lived Preview alias                     │
│  Data: sanitized seed only                                      │
│  Auth: independent user pool                                    │
│  Use: Gen-2 auth, FTGP authority rehearsal, legal dry-runs      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Ephemeral PR / Preview                                          │
│  Supabase: Branch per PR (after migration chain fix)          │
│  Vercel: Preview deployment per PR                              │
│  Data: deterministic safe seed                                  │
│  Auth: branch-isolated                                          │
│  Lifetime: ≤ 14 days default; auto-delete on PR merge/close     │
└─────────────────────────────────────────────────────────────────┘
```

**Cutover rule:** After Wave 2, **no Vercel Preview** deployment may use Production database credentials (`DATABASE_ENVIRONMENT=production` with `APP_ENVIRONMENT=preview` shared-backend mode ends).

Current state (C2.2): Preview app on Vercel shares Production Supabase Postgres — documented incident class; separation is mandatory before FTGP authority activation on Preview.

---

## 2. Environment variable mapping

| Variable | Production | Persistent Staging | Ephemeral PR branch |
|----------|------------|--------------------|---------------------|
| `APP_ENVIRONMENT` | `production` | `staging` | `preview` |
| `DATABASE_ENVIRONMENT` | `production` | `staging` | `preview` |
| `BACKEND_ISOLATION` | `dedicated` | `dedicated` | `dedicated` |
| `DATABASE_URL` / `DIRECT_URL` | Production project | Staging project/branch | Branch connection strings |
| `NEXT_PUBLIC_SUPABASE_URL` | Production | Staging | Branch |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production | Staging | Branch |
| `SUPABASE_SERVICE_ROLE_KEY` | Production | Staging | Branch |
| `NEXT_PUBLIC_SITE_URL` | Production domain | Staging URL | Vercel Preview URL |
| `CROW_AUTH_REDIRECT_ORIGINS` | Production + staging allowlist | Staging + localhost | Preview URL(s) |
| `ACCOUNT_REGISTRATION_ENABLED` | policy-gated | `true` for Gen-2 tests | `true` with safe seed |
| `EMAIL_PROVIDER` | `resend` | `resend` or Mailpit proxy | in-memory / Mailpit |
| `EXPECTED_DATABASE_FINGERPRINT` | Production fingerprint | Staging fingerprint | Per-branch fingerprint |

Store secrets only in Vercel Environment Variables and gitignored local operator files — never in the repository.

---

## 3. Branch naming and GitHub integration

### Supabase Branching (after clean migration chain passes)

| Pattern | Purpose |
|---------|---------|
| `main` | Production database lineage (no branch — primary project) |
| `staging` | Persistent staging branch or separate project |
| `pr-<number>` | Ephemeral PR branch linked to GitHub PR |

**GitHub integration:** Enable Supabase GitHub integration only when:

1. Clean migration chain passes on disposable Postgres (§4).
2. CI runs `prisma migrate deploy` successfully in a test job.
3. Branch lifecycle automation is documented (§6).

**Vercel ↔ Supabase mapping:**

- Vercel Preview deployment for PR `#123` → Supabase branch `pr-123`.
- Inject branch-specific `DATABASE_URL`, Supabase URL, and anon key via Vercel Preview env or Supabase-Vercel integration.
- Production Vercel deployment → primary project only.

---

## 4. Clean migration chain remediation

### Problem

Greenfield `prisma migrate deploy` fails at `20260519120000_phase5_hr_crm_phase6_notifications` because `tenants` (and most core tables) were never created by any migration file. Init migration `20260515150000_init_crow_ecosystem` is a three-enum stub.

Hosted Production DB is **not broken** — it was populated via historical `db push` and migration history baselined.

### Remediation strategy (preserve hosted history)

**Do not** edit or delete migration folders already applied on hosted DB. **Do not** squash hosted history in place.

**Recommended approach — baseline replacement for new environments:**

| Step | Action |
|------|--------|
| A | Generate full baseline SQL from current `schema.prisma` using `prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script` |
| B | Create new migration folder e.g. `20260515140000_baseline_crow_ecosystem_full` **or** replace stub init in a **new major baseline branch** used only for greenfield/branching |
| C | Ensure baseline runs **before** phase5 FK migrations |
| D | For **existing hosted DB**: keep current history; optionally add no-op or verification migration only |
| E | Add CI job: disposable Postgres → `migrate deploy` full chain → PASS gate |
| F | Document operator path: existing DBs use `migrate deploy` for **pending only**; new branches use full chain |

**Alternative (interim for Supabase branches):**

1. Branch creation hook runs `prisma db push` on empty branch database.
2. Run `npm run db:migrate:baseline` to align history.
3. Run `migrate deploy` for migrations newer than baseline timestamp only.

This interim path is **acceptable only until** step A–E produces a true greenfield chain. Mark interim as technical debt with expiry milestone.

### Success criterion

```text
PASS — COMPLETE CROW MIGRATION CHAIN DEPLOYS ON A CLEAN POSTGRES DATABASE
```

**Current status:** **FAIL** (verified 2026-06-18 on disposable Postgres).

### Blocker

**Do not enable Supabase GitHub Branching** until success criterion passes.

---

## 5. Seed strategy

| Environment | Seed source | Rules |
|-------------|-------------|-------|
| Production | None (real data) | Migrations only; controlled apply |
| Persistent Staging | `prisma/seed.ts` + legal seed scripts | No Production copies; synthetic emails (`@crow.local`) |
| Ephemeral PR | Deterministic minimal seed | Idempotent; no PII; reset on branch recreate |

FTGP testing requires Platform Admin bootstrap **only on isolated staging**, never on shared Production Preview.

---

## 6. Branch lifecycle and cost controls

Supabase branch cost (verified via MCP `get_cost`): **~$0.01344/hour** (~$9.70/month if left running continuously).

| Rule | Default |
|------|---------|
| Max branch age | 14 days |
| Auto-delete | On PR merge/close via GitHub webhook / scheduled review |
| Naming | `pr-<n>` only; no ad-hoc permanent branches |
| Persistent staging | One branch or separate project — not per-PR |
| Monthly review | Operator lists branches; delete orphans |
| Pre-create checklist | Confirm PR needs database isolation |

---

## 7. Migration promotion workflow

```
Developer merges migration PR to feat/* or main
  → CI: greenfield migrate deploy test (gate)
  → Operator: backup verification (Production)
  → Controlled migration check-only (GitHub Actions workflow_dispatch)
  → Explicit PO authorization phrase
  → Controlled apply (single concurrency group per environment)
  → Post-apply verification scripts
  → Vercel deploy (no migrate in build)
```

Preview/PR branches: auto-apply migrations on branch create **after** chain fix — never against Production from Preview builds.

---

## 8. OAuth callback management

Each environment needs distinct callback URLs:

| Provider | Production | Staging / Preview |
|----------|------------|-------------------|
| Supabase Auth callback | `https://wbwnsndcxrgyqwppurms.supabase.co/auth/v1/callback` | Branch-specific Supabase URL |
| Google Cloud OAuth | Production authorized redirect URIs | Separate OAuth client or additional URIs per staging/preview |
| App redirect allowlist | `CROW_AUTH_REDIRECT_ORIGINS` + Supabase Dashboard URL config | Include Vercel Preview hosts temporarily; remove obsolete proof-window hosts |

Run `scripts/audit-supabase-redirect-urls.ts` with Management API token before each environment cutover.

---

## 9. Implementation order (cross-reference waves)

1. **Wave 1:** Backup/PITR verification → controlled dual migration on shared DB (unchanged target until staging exists).
2. **Wave 2:** Fix clean migration chain → create persistent staging → move Vercel Preview off Production DB.
3. **Wave 3+:** Platform services (SMTP, Storage, RLS hardening) per feature matrix.

See `CROW_CLOUD_FEATURE_ENABLEMENT_MATRIX.md` and foundation doc for Wave details.

---

## Related documents

- `CROW_SUPABASE_PRO_FOUNDATION.md`
- `docs/architecture/crow-core/c2/C2_2_DATABASE_ENVIRONMENT_ISOLATION.md`
- `docs/architecture/crow-core/c2/C2_2_PREVIEW_DATABASE_SETUP_RUNBOOK.md`
