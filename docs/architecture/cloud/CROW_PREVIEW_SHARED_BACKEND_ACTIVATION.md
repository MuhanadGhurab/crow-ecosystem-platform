# Crow Preview Shared-Backend Activation (CLOUD.1F)

**Phase:** CLOUD.1F  
**Branch:** `feat/first-tenant-golden-path`  
**Date:** 2026-06-22  
**Verdict (CLOUD.1F):** `BLOCKED — PREVIEW IS PUBLIC WHILE USING SHARED PRODUCTION BACKEND`  
**Superseded by CLOUD.1G:** Preview protection enabled — see `CROW_PREVIEW_PROTECTION_AND_ALIAS_RECONCILIATION.md`

---

## 1. Deployment record

| Field | Value |
|-------|-------|
| Deployment ID | `dpl_28xNJNkpdHPX7qyUVZXZqKupQEq2` |
| Preview URL | `https://crow-ecosystem-platform-8xcd7np22-muhanadghurabs-projects.vercel.app` |
| Branch alias | `https://crow-ecosystem-platform-git-feat-2491ce-muhanadghurabs-projects.vercel.app` |
| Source branch | `feat/first-tenant-golden-path` |
| Local HEAD pushed | `57cf590547cf955d65d7abc33a660113d25974ee` |
| Build status | **READY** |
| Production alias | **Unchanged** (`https://crow-ecosystem-platform.vercel.app` → `dpl_8NeFiYQ4TSumt9kQSMGfv1WTiDM4`) |
| Production deployment (live alias) | `dpl_8NeFiYQ4TSumt9kQSMGfv1WTiDM4` (see CLOUD.1G alias reconciliation) |

Vercel build command (verified): `node scripts/vercel-build-guard.mjs && npm run db:generate && npm run build` — **no** `prisma migrate deploy`, seed, bootstrap, or role-grant scripts.

---

## 2. Shared Production backend classification

| Setting | Expected | Verified |
|---------|----------|----------|
| `APP_ENVIRONMENT` | `preview` | yes (operator `.env.staging.runtime` / Preview pull) |
| `DATABASE_ENVIRONMENT` | `production` | yes |
| `BACKEND_ISOLATION` | `shared` | yes |
| Supabase project | `wbwnsndcxrgyqwppurms` | yes |
| Database fingerprint | `0355c17692e2a90d` | yes |
| `ALLOW_DATABASE_MIGRATION` on Preview | absent / false | yes (no migration apply on deploy) |
| Bootstrap / role-grant authorization on Preview | absent | yes |

**Transitional risk:** Preview runtime reads and writes the **same hosted Postgres** as Production until persistent Staging is provisioned and Preview credentials are repointed.

---

## 3. Deployment protection

**Updated CLOUD.1G:** Operator enabled Vercel Authentication for Preview.

```text
PREVIEW_DEPLOYMENT_PROTECTED=true
PREVIEW_PUBLIC_APPLICATION_ACCESS=false
```

See `CROW_PREVIEW_PROTECTION_AND_ALIAS_RECONCILIATION.md` for full CLOUD.1G verification.

### CLOUD.1F baseline (pre-protection)

```text
PREVIEW_DEPLOYMENT_PROTECTED=false
```

Unauthenticated routes returned **200** before operator enabled protection.

---

## 4. Automatic mutation audit

| Check | Result |
|-------|--------|
| `AUTOMATIC_DATABASE_MIGRATION_ON_DEPLOY` | **false** |
| `AUTOMATIC_INTERNAL_ROLE_BOOTSTRAP` | **false** |
| `AUTOMATIC_TENANT_PROVISIONING` | **false** |

`postinstall` runs `prisma generate` only. Controlled migration wrapper is manual / CI `workflow_dispatch` only.

---

## 5. Runtime verification (Preview + hosted DB)

### Unauthenticated route smoke (Preview)

| Route | Status | Behavior |
|-------|--------|----------|
| `/` | 200 | Marketing loads |
| `/login` | 200 | Login initializes |
| `/login?recovery=1` | 200 | Recovery initializes |
| `/auth/callback` | 307 | Redirect to login (no session) |
| `/account` | 307 | Redirect to login |
| `/client` | 307 | Redirect to login |
| `/admin` | 307 | Redirect to login |
| `/api/health` | 200 | `ok=true`, `db=ok` |

No server errors (5xx). No business rows created by smoke.

### FTGP role table runtime

```text
FTGP_ROLE_TABLE_RUNTIME_QUERY=PASS
PRISMA_P2021_ABSENT=true
```

Empty `platform_internal_role_assignments` resolves to **no internal authority**; Prisma queries succeed against migrated schema.

### Metadata-only authority denial

```text
METADATA_ONLY_CLIENT_AUTHORITY=DENIED
METADATA_ONLY_INTERNAL_AUTHORITY=DENIED
METADATA_ONLY_TENANT_AUTHORITY=DENIED
```

Legacy Supabase `crow_role` metadata cannot authorize ProCrow, client portal, or tenant access without DB-backed assignments / ownership / membership.

### Retained requester (DB census — no browser session)

- Classification: `ACTIVE_GOOGLE_REQUESTER`
- `PlatformAccount`: ACTIVE, legal acceptances current
- `TenantMemberships`: 0
- Internal platform roles: 0
- Request ownership preserved (no mutation during activation)

Authenticated Preview session proof was **not** run (public Preview + shared Production backend).

### Candidate operator pre-grant (DB census)

- ACTIVE account with current legal acceptances
- Zero request ownership, client membership, tenant membership, internal roles
- Metadata-only `implementer` **denied** without `PlatformInternalRoleAssignment`

No role grant performed during CLOUD.1F.

---

## 6. Database preservation (post-Preview deploy)

Re-verified via `npm run cloud-1e-post-apply:verify`:

| Metric | Count |
|--------|------:|
| `implementation_requests` | 7 |
| `tenant_memberships` | 3 |
| `platform_accounts` | 11 |
| `client_organization_members` | 0 |
| `platform_provider_identities` | 4 |
| Internal platform role assignments | 0 |
| Applied migrations | 23 |
| Pending migrations | 0 |
| Failed migrations | 0 |

Legal v1.1 remains **unpublished**. Data API containment **PASS** (including `platform_internal_role_assignments` → 404).

---

## 7. Data API containment (unchanged)

```text
PUBLIC_SCHEMA_DATA_API_EXPOSURE_BLOCKED=PASS
PUBLIC_SCHEMA_GRAPHQL_EXPOSURE_BLOCKED=PASS
SUPABASE_AUTH_UNAFFECTED=PASS
PRISMA_SERVER_ROUTES_UNAFFECTED=PASS
```

---

## 8. Known limitations and next steps

1. **Public Preview + shared Production DB** — treat Preview as a production-connected surface until isolation exists.
2. **No authenticated Preview session proof** in CLOUD.1F due to protection gap.
3. **Persistent Staging** — required after greenfield migration-chain remediation; Preview must not use Production credentials long term.
4. **Separate authorization required for:**
   - Platform Admin bootstrap
   - First `IMPLEMENTER` grant to candidate operator
   - Merge to `main` / Production promotion
   - RLS / grants hardening batch

---

## Related documents

- `CROW_EMERGENCY_EXPOSURE_CONTAINMENT.md` (CLOUD.1C / 1E)
- `FTGP_0E_CONTROLLED_MIGRATION_APPLY.md`
- `CROW_ENVIRONMENT_SEPARATION_PLAN.md`
- `CROW_PREVIEW_PROTECTION_AND_ALIAS_RECONCILIATION.md` (CLOUD.1G)
- `scripts/verify-cloud-1f-preview-activation.ts`
- `scripts/verify-cloud-1g-preview-protection.ts`
