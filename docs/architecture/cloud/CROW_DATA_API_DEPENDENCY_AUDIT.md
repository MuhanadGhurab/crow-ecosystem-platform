# Crow Data API Dependency Audit

**Phase:** CLOUD.1B  
**Branch:** `feat/first-tenant-golden-path`  
**Audit date:** 2026-06-21  
**Mode:** Read-only repository scan + safe external probe — **no hosted configuration changes**.

---

## 1. Executive summary

Crow's production application **does not use** Supabase PostgREST (`supabase.from`, `/rest/v1/`, RPC, Realtime, or Storage) for business data. All authoritative reads and writes go through **Next.js server routes / server actions + Prisma** against direct/pooled Postgres.

Supabase client usage is **Auth-only** (session cookies, OAuth, password flows, admin user provisioning in operator scripts).

**Recommended containment path:** **Path A** — remove `public` from Data API exposed schemas (preferred over full Data API disable; narrower blast radius; Auth remains on separate Auth API).

---

## 2. Repository scan counts

Verified by `npm run cloud-data-api-dependency:audit`:

| Metric | Count |
|--------|------:|
| `PRODUCTION_BUSINESS_DATA_API_DEPENDENCIES` | **0** |
| `BROWSER_BUSINESS_DATA_API_DEPENDENCIES` | **0** |
| `SERVER_ANON_KEY_DATA_API_DEPENDENCIES` | **0** |
| `SERVER_SERVICE_ROLE_DATA_API_DEPENDENCIES` | **0** |
| `AUTH_ONLY_SUPABASE_DEPENDENCIES` | **79** files |
| `PRISMA_DIRECT_DATABASE_DOMAINS` | **191** files |

Production business dependencies count **`src/` only**. Operator audit scripts and env validation are excluded from production reachability.

---

## 3. Supabase client usage (Auth-only)

| File | Runtime | Purpose | Key class |
|------|---------|---------|-----------|
| `src/lib/supabase/client.ts` | browser | `createBrowserClient` — Auth session | publishable |
| `src/lib/supabase/server.ts` | server | `createServerClient` — Auth session | publishable |
| `src/lib/supabase/middleware.ts` | server | Session refresh on edge middleware | publishable |
| `src/lib/supabase/route-handler.ts` | server | Auth in route handlers | publishable |
| `src/lib/actions/auth.ts` | server | sign-in, sign-up, OAuth, recovery | publishable / admin |
| `src/app/auth/callback/route.ts` | server | OAuth code exchange | publishable |

**Not present in `src/`:** `supabase.from(`, `supabase.rpc(`, `supabase.channel(`, `postgres_changes`, `supabase.storage.`, raw `/rest/v1/` fetch for business tables.

---

## 4. Business data access (Prisma / direct Postgres)

Domains include account registration (C3), legal consent, implementation requests, tenant membership, blueprint persistence, CyberCrow SOC, CEM workflows, billing, and platform admin services — all via `@/lib/db` / `prisma.*`.

**Authoritative authorization:** server-side services (`authoritative-crow-auth.ts`, `customer-access.service.ts`, `tenant-membership-access.service.ts`, `platform-internal-role.service.ts`) — not PostgREST or JWT metadata alone.

---

## 5. External PostgREST probe (safe)

Command: `npm run cloud-data-api-exposure:probe` (loads operator env; **does not log keys or response bodies**).

**Classification:** `DATA_API_PUBLIC_EXPOSURE_CONFIRMED`

| Table | HTTP status | Count header | Accessible |
|-------|-------------|--------------|------------|
| `implementation_requests` | 206 | present | yes |
| `tenant_memberships` | 206 | present | yes |
| `tenant_finance_entries` | 206 | present | yes |
| `cybercrow_audit_logs` | 206 | present | yes |
| `security_events` | 206 | present | yes |
| `platform_accounts` | 401 | absent | no |

C3 account tables with RLS + REVOKE deny anonymous aggregate reads. The remaining five tables confirm **hosted PostgREST exposure** despite zero application dependency.

---

## 6. Effect if public Data API removed

| Surface | Breakage |
|---------|----------|
| Supabase Auth (login, OAuth, recovery) | **None expected** — Auth API is separate from PostgREST schema exposure |
| `/login`, `/account`, marketing pages | **None** — Prisma-backed server rendering |
| Prisma server routes / actions | **None** — direct Postgres connection |
| Browser `supabase.from` | **None** — not used |
| Operator PostgREST probes | Expected denial after containment |

---

## 7. Explicit boundary (CLOUD.1B)

This audit **did not:**

- Change Supabase Dashboard settings
- Apply migrations or alter RLS/grants on hosted DB
- Modify Auth users or metadata
- Push or deploy

---

## Related documents

- `CROW_EMERGENCY_EXPOSURE_CONTAINMENT.md`
- `CROW_SUPABASE_SECURITY_AUDIT.md`
- `CROW_RLS_ACCESS_MODEL.md`
- `scripts/lib/cloud-data-api-dependency-scan.ts`
