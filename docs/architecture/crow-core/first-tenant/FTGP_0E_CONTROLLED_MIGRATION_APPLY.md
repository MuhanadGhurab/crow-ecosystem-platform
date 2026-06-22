# FTGP.0E — Controlled Dual-Migration Apply

**Phase:** CLOUD.1E  
**Branch:** `feat/first-tenant-golden-path` (not pushed)  
**Apply date:** 2026-06-22  
**Target project:** `wbwnsndcxrgyqwppurms`  
**Direct fingerprint:** `0355c17692e2a90d`  
**Production deployment (unchanged):** `dpl_EJiL9z1NnfvneHCR72JfoGE5NXmh`

---

## 1. Operator authorization

Controlled apply authorized with confirmation phrase `APPLY PREVIEW DATABASE MIGRATIONS` under shared-backend pairing:

```text
DATABASE_ENVIRONMENT=production
APP_ENVIRONMENT=preview
BACKEND_ISOLATION=shared
ALLOW_DATABASE_MIGRATION=true
```

Recovery evidence: `.env.migration.recovery` (`BACKUP`, verified `2026-06-22T00:27:34.783Z`).

---

## 2. Applied migration inventory

| Order | Migration | SHA-256 | Result |
|-------|-----------|---------|--------|
| 1 | `20260618120000_c3_legal_publication_lifecycle` | `07678643967a72ee8965e54681e69def4c50561b4774e24100f0fc925e30c1ab` | `APPLIED_ONCE_FINISHED` |
| 2 | `20260621120000_ftgp_platform_internal_role_assignment` | `8f66dcd89ca5d353864630d088a0dfb2af415e039c472cd54f5bc4e4c58191ed` | `APPLIED_ONCE_FINISHED` |

**Forbidden obsolete FTGP hash:** `4868d172cc2b100e54970e83977e3d9f9212d06c916258aa70df2b66f3f7bd5e` — not applied.

---

## 3. Apply command result

```bash
npm run db:migrate:controlled -- \
  --environment preview \
  --confirm "APPLY PREVIEW DATABASE MIGRATIONS" \
  --allow-shared-production-backend
```

**Result:** Both migrations applied successfully via controlled wrapper (`migrate-deploy.mjs`). Post-command `prisma migrate status`: **Database schema is up to date.**

---

## 4. Migration history verification

| Check | Result |
|-------|--------|
| Legal migration rows | 1 finished, 0 rolled back |
| FTGP migration rows | 1 finished, 0 rolled back |
| Failed migration count | 0 |
| Pending migration count | 0 |
| Applied migration count (finished) | 23 |
| Historical unfinished rows | 2 (non-blocking, pre-baseline) |

---

## 5. Legal schema verification

| Check | Result |
|-------|--------|
| `LegalDocumentVersionStatus` labels | 5 total; includes `reviewed`, `approved_for_publication` |
| Published v1.0 per document type | 1 each (TOS, Privacy, AUP) |
| Legal v1.1 published | 0 |
| Documents in reviewed/approved status | 0 |
| `account_legal_acceptances` | 33 (unchanged) |

Migration adds lifecycle capability only — **no publication authorized or performed**.

---

## 6. FTGP schema verification

| Check | Result |
|-------|--------|
| `PlatformInternalRole` enum | Present |
| `PlatformInternalRoleAssignmentStatus` enum | Present |
| `platform_internal_role_assignments` table | Present |
| Partial unique index | Present (ACTIVE predicate) |
| FK delete behaviors | subject CASCADE; grantor RESTRICT; revoker SET NULL |
| RLS enabled | true |
| RLS policies | 0 |
| anon/authenticated table privileges | none |
| Internal role assignment rows | 0 |

---

## 7. Existing-state preservation

| Metric | Pre-apply | Post-apply |
|--------|-----------|------------|
| `implementation_requests` | 7 | 7 |
| `tenant_memberships` | 3 | 3 |
| `platform_internal_role_assignments` | 0 | 0 |
| `platform_accounts` | 11 | 11 |
| `client_organization_members` | 0 | 0 |
| `platform_provider_identities` | 4 | 4 |

Retained Google requester (`ACTIVE_GOOGLE_REQUESTER`, `crow_role: none`, 0 tenant memberships) unchanged. No internal platform authority granted. No Auth metadata writes.

---

## 8. Containment and smoke

| Gate | Result |
|------|--------|
| `PUBLIC_SCHEMA_DATA_API_EXPOSURE_BLOCKED` | PASS (includes `platform_internal_role_assignments` 404) |
| `PUBLIC_SCHEMA_GRAPHQL_EXPOSURE_BLOCKED` | PASS |
| `SUPABASE_AUTH_UNAFFECTED` | PASS |
| `PRISMA_SERVER_ROUTES_UNAFFECTED` | PASS |

Production smoke (existing deployment, no redeploy): `/`, `/login`, `/login?recovery=1`, `/auth/callback`, `/account`, `/api/health` — all PASS.

---

## 9. Regression suite

All required verifiers passed post-apply, including:

- `npm run cloud-1e-post-apply:verify`
- `npm run ftgp-migration-preflight:hosted-post-apply`
- `npm run ftgp-controlled-migration-inventory:test`
- Full C3 / FTGP / cloud / C2 suite
- `npm run typecheck`, `npm run lint`, `npm run build`

---

## 10. Explicit boundaries honored

**Not performed:**

- Branch push
- Preview or Production deploy/promotion
- Legal v1.1 publication
- Auth user/metadata changes
- Platform Admin bootstrap
- Internal role grants
- TenantMembership creation
- Data API schema re-exposure
- RLS rollout / default-privilege hardening migrations

---

## 11. Apply manifest

Gitignored `.migration-apply-manifest` updated with `Apply executed: true`, `Apply verified: true`, authorization flags false for push/deploy/bootstrap.

---

## 12. Verdict

```text
PASSED — CONTROLLED DUAL MIGRATION APPLIED AND VERIFIED; BRANCH PUSH MAY BE CONSIDERED
```

**Next authorization (separate):** push `feat/first-tenant-golden-path`, Preview deploy, Platform Admin bootstrap, candidate `IMPLEMENTER` grant.

---

## Related documents

- `CROW_SUPABASE_PRO_FOUNDATION.md`
- `CROW_EMERGENCY_EXPOSURE_CONTAINMENT.md`
- `FTGP_0C_CONTROLLED_MIGRATION_REVIEW.md`
- `FTGP_0D_DUAL_PENDING_RECONCILIATION.md`
- `scripts/verify-cloud-1e-dual-migration-post-apply.ts`
