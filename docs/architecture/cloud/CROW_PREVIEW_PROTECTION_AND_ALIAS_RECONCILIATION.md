# Crow Preview Protection & Production Alias Reconciliation (CLOUD.1G)

**Phase:** CLOUD.1G  
**Date:** 2026-06-22  
**Branch:** `feat/first-tenant-golden-path` @ `57cf590`  
**Verdict:** `PASSED — PREVIEW PROTECTED; PRODUCTION ALIAS RECONCILED; AUTHENTICATED BOUNDARIES VERIFIED`

---

## 1. Preview deployment protection

Operator enabled **Vercel Authentication** for Preview deployments on project `crow-ecosystem-platform`.

| Field | Value |
|-------|-------|
| Deployment ID | `dpl_28xNJNkpdHPX7qyUVZXZqKupQEq2` |
| Target | Preview |
| Status | READY |
| Source branch | `feat/first-tenant-golden-path` |
| Source commit | `57cf590547cf955d65d7abc33a660113d25974ee` |
| Preview URL | `https://crow-ecosystem-platform-8xcd7np22-muhanadghurabs-projects.vercel.app` |
| Branch alias | `https://crow-ecosystem-platform-git-feat-2491ce-muhanadghurabs-projects.vercel.app` |
| Shared Supabase project | `wbwnsndcxrgyqwppurms` |
| Database fingerprint | `0355c17692e2a90d` |

### Protection method

Vercel Authentication (team-gated Preview access). Unauthenticated HTTP clients receive **401** before the Crow application executes.

### Protection verification (unauthenticated)

Both Preview hostnames verified on `/`, `/login`, `/account`, `/client`, `/admin`, `/api/health`:

```text
PREVIEW_DEPLOYMENT_PROTECTED=true
PREVIEW_PUBLIC_APPLICATION_ACCESS=false
```

Verifier: `npm run cloud-1f-preview:verify` and `npm run cloud-1g-preview:verify`.

---

## 2. Protected Preview authenticated test access

```text
PROTECTED_PREVIEW_TEST_ACCESS=VERCEL_AUTHENTICATED_BROWSER
```

| Method | Status |
|--------|--------|
| Operator Vercel CLI session (`npx vercel curl`) | **Used** — route smoke without Crow session |
| Operator Vercel-authenticated browser | **Available** — required for retained Google requester session proof |
| `x-vercel-protection-bypass` automation header | **Not used** — redirect loops under Vercel Authentication |

No bypass secret, cookie, or token is recorded in this document.

---

## 3. Production alias reconciliation

### Current canonical alias

`https://crow-ecosystem-platform.vercel.app` → **`dpl_8NeFiYQ4TSumt9kQSMGfv1WTiDM4`**

### Previously documented Production deployment (stale record)

Controlled records through CLOUD.1E cited **`dpl_EJiL9z1NnfvneHCR72JfoGE5NXmh`** as “Production deployment unchanged.” That deployment exists and is READY, but it is **not** the live alias target.

### Deployment comparison

| Field | `dpl_8NeFiYQ4TSumt9kQSMGfv1WTiDM4` (live alias) | `dpl_EJiL9z1NnfvneHCR72JfoGE5NXmh` (newer, not aliased) |
|-------|--------------------------------------------------|----------------------------------------------------------|
| Target | Production | Production |
| Status | READY | READY |
| Created (UTC) | 2026-06-13T15:35:21Z | 2026-06-20T23:55:43Z |
| Creator | team member (sanitized) | team member (sanitized) |
| Aliases (live) | `crow-ecosystem-platform.vercel.app`, git-main alias | listed in inspect JSON but **not** serving canonical origin |
| Current Production alias target | **yes** | **no** |
| Promoted manually | unknown | unknown (deployed; rolled back per C3.10S) |

### Classification

```text
PRODUCTION_ALIAS_UNCHANGED_RECORD_WAS_STALE
```

**Explanation:** The canonical Production alias has remained on `dpl_8NeFi` since the **C3.10S authorized rollback** documented in `docs/internal/C3_10S_PRODUCTION_RESOLVER_INCIDENT.md`. Deployment `dpl_EJi` was a failed Production release (post-auth resolver / C2 database guard mismatch) and was **not** promoted as the lasting alias target. CLOUD.1E records incorrectly treated `dpl_EJi` as the active Production deployment ID.

No alias change, rollback, promotion, or redeploy was performed during CLOUD.1G.

---

## 4. Source-control boundaries

| Check | Result |
|-------|--------|
| `origin/main` SHA | `a5620c3` |
| `origin/feat/first-tenant-golden-path` SHA | `57cf590` |
| FTGP commit on `main` | **no** |
| Vercel Production Branch | `main` (git-main alias on live deployment) |
| FTGP feature code in Production | **no** |

```text
FTGP_FEATURE_COMMIT_IN_PRODUCTION=false
```

Live Production deployment predates FTGP branch work and serves `main`-line code from Jun 13 rollback baseline.

---

## 5. Authenticated authority boundary proof

### Retained requester (read-only)

```text
RETAINED_REQUESTER_ROLE_NEUTRAL=PASS
```

- DB census: `ACTIVE_GOOGLE_REQUESTER`, legal current, ownership preserved, `TenantMemberships=0`, internal roles `0`
- Protected Preview route denial (no Crow session): `/admin`, `/client`, `/account` → 307 → `/login`
- No forms submitted; no mutations

### Candidate operator pre-grant

```text
CANDIDATE_PRE_GRANT_INTERNAL_AUTHORITY=DENIED
```

- DB census: ACTIVE, legal current, zero ownership / client / tenant / internal roles
- Metadata-only `implementer` denied without assignment row
- No grant performed

### Metadata-only authority denial

```text
METADATA_ONLY_CLIENT_AUTHORITY=DENIED
METADATA_ONLY_INTERNAL_AUTHORITY=DENIED
METADATA_ONLY_TENANT_AUTHORITY=DENIED
```

### FTGP internal-role table runtime

```text
FTGP_ROLE_TABLE_RUNTIME_QUERY=PASS
PRISMA_P2021_ABSENT=true
INTERNAL_ASSIGNMENTS=0
```

Empty `platform_internal_role_assignments` queries succeed on Preview-connected shared DB; no assignment created for testing.

---

## 6. Database preservation (unchanged)

| Metric | Count |
|--------|------:|
| `implementation_requests` | 7 |
| `tenant_memberships` | 3 |
| `platform_accounts` | 11 |
| `client_organization_members` | 0 |
| `platform_provider_identities` | 4 |
| Internal platform role assignments | 0 |
| Applied migrations | 23 |
| Pending / failed migrations | 0 |

No internal-role grant audit event, ownership mutation, tenant mutation, legal-document mutation, or Auth metadata mutation during CLOUD.1G.

---

## 7. Data API containment (recheck)

```text
PUBLIC_SCHEMA_DATA_API_EXPOSURE_BLOCKED=PASS
PUBLIC_SCHEMA_GRAPHQL_EXPOSURE_BLOCKED=PASS
SUPABASE_AUTH_UNAFFECTED=PASS
PRISMA_SERVER_ROUTES_UNAFFECTED=PASS
```

---

## 8. Production runtime smoke (read-only)

Against `https://crow-ecosystem-platform.vercel.app` (alias → `dpl_8NeFi`):

| Route | Result |
|-------|--------|
| `/` | 200 |
| `/login` | 200 |
| `/login?recovery=1` | 200 |
| `/auth/callback` | 200 |
| `/account` | 200 |
| `/api/health` | 200 |

Production was **not** modified during CLOUD.1G.

---

## 9. Explicit non-actions

CLOUD.1G did **not** authorize or perform:

- merge to `main`
- Production promotion or alias change
- Vercel environment variable changes
- database migrations
- Platform Admin bootstrap or internal role grant
- TenantMembership creation
- Data API / RLS / grants changes
- disabling Preview protection

---

## 10. Shared-backend limitation

Preview remains on **shared Production Postgres** (`BACKEND_ISOLATION=shared`). Deployment protection reduces public surface area but does **not** isolate data. Persistent Staging remains required before treating Preview as safe for unconstrained operator testing.

---

## Related documents

- `CROW_PREVIEW_SHARED_BACKEND_ACTIVATION.md` (CLOUD.1F baseline)
- `CROW_EMERGENCY_EXPOSURE_CONTAINMENT.md`
- `docs/architecture/crow-core/first-tenant/FTGP_0F_PLATFORM_ADMIN_BOOTSTRAP_READINESS.md` (CLOUD.1H)
- `docs/internal/C3_10S_PRODUCTION_RESOLVER_INCIDENT.md`
- `scripts/verify-cloud-1f-preview-activation.ts`
- `scripts/verify-cloud-1g-preview-protection.ts`
- `scripts/verify-cloud-1h-protected-authenticated-session.ts`
- `scripts/lib/vercel-curl-head.ts`

---

## 11. CLOUD.1H — Authenticated session proof & bootstrap readiness

**Date:** 2026-06-22  
**Verdict:** `BLOCKED — DEDICATED PLATFORM ADMIN TARGET REQUIRED`

### Protected access (recheck)

| Check | Result |
|-------|--------|
| `PREVIEW_REMAINS_PUBLICLY_BLOCKED` | **PASS** |
| `VERCEL_PROTECTED_BROWSER_ACCESS` | **PASS** (operator Vercel CLI session) |

### Authenticated boundaries (operator-certified)

| Check | Result |
|-------|--------|
| Retained requester session | `/account`; internal + tenant authority **denied** |
| Candidate pre-grant session | `/account`; internal authority **denied**; no auto-assignment |
| Session separation | **PASS** |
| DB baseline pre/post | **unchanged** |

Certification: `C3_MANUAL_BROWSER_SESSION_CERTIFIED` (no cookies stored in repository).

### Dedicated Platform Admin target

```text
DEDICATED_PLATFORM_ADMIN_TARGET=AMBIGUOUS
```

More than one eligible account after excluding requester and IMPLEMENTER candidate. Operator must designate `PLATFORM_INTERNAL_ROLE_BOOTSTRAP_TARGET_ACCOUNT_ID` before bootstrap dry-run or execute.

### Bootstrap readiness

| Check | Result |
|-------|--------|
| Implementation audit | **PASS** |
| Dry-run (zero writes) | **skipped** (target not `READY`) |
| Security gate suite (§12) | **PASS** |

Verifier: `npm run cloud-1h-preview:verify`

