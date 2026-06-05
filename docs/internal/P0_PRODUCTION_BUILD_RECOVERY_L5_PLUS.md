# P0 — Production Build Recovery: L5+ Deployment Failure

**Last updated:** 5 Jun 2026  
**Audience:** Internal delivery / engineering  
**Status:** **PASSED** — production **Ready** on `847d492` (5 Jun 2026)

---

## Timeline

| Label | Commit | Message | Vercel production |
|-------|--------|---------|-------------------|
| Last good | `db4f875` | fix(readiness): clarify runtime preparation blockers | **Ready** (~7d before incident) |
| First bad | `f6d0085` | feat(portal): add role-based access gateway (L5) | **Error** — OOM during `next build` |
| L6 | `7a3b7e7` | feat(procrow): discovery-to-blueprint review | **Error** — OOM |
| L7 | `913ef19` | feat(pricing): advisory package templates | **Error** — OOM |
| M1 | `ed8de3d` | feat(cybercrow): tenant trust readiness | **Error** — OOM |
| M2 | `93c3c9c` | feat(sarea): blueprint-to-experience mapping | **Error** — OOM |
| M2.0 | `a506ae9` | fix(build): reduce Vercel memory after SAREA mapping | **Error** — OOM ~108s (6144 heap + webpack worker) |
| P0.1 | `c89ed1f` | fix(build): recover Vercel production after L5+ OOM | **Error** — OOM ~42s compile (4096 heap still over cgroup) |
| P0.2 | `847d492` | fix(build): lower Vercel heap and split compile/generate | **Ready** — compile ~34s + generate; total build ~2m |

---

## Root cause (from Vercel logs)

**Primary:** Next.js production compile exceeds Vercel standard builder memory (8 GB cgroup) → build worker **SIGKILL** / OOM.

**Not the cause:**

- TypeScript or ESLint failures (build reaches compile / static generation)
- Prisma migrate deploy (passes before `next build`)
- L5 server/client import boundary violations (audited — middleware stays Supabase-only; no Prisma in edge)
- Missing env vars on Vercel (DB guard and generate succeed)
- Auth weakening or ProCrow exposure regressions

**Why failure “starts” at L5:** L5 added portal access gateway + public header session CTA, increasing the server compile graph. L6–M2 added more server-only services and studio/admin surfaces. Cumulative webpack graph + static page generation pressure crossed the 8 GB limit; M2.0’s 6144 MB Node heap and `webpackBuildWorker: true` likely worsened peak RSS (two Node processes).

---

## L5 audit result

| File | Result |
|------|--------|
| `src/middleware.ts` | Lightweight Supabase session only — no Prisma |
| `src/components/public/public-header-nav.tsx` | Client — type-only imports from post-login |
| `src/components/public/public-header.tsx` | Server — `getSessionUser` + portal CTA |
| `src/lib/auth/post-login-redirect.ts` | Re-exports lite helpers; no full gateway snapshot in header path |
| `src/lib/services/portal-access.service.ts` | Full snapshot builder — **/access only** |
| `src/lib/portal/portal-access-lite.ts` | **New** — role/CTA/routing without gateway card builder |
| `src/app/access/page.tsx` | `force-dynamic` — session-aware gateway |

Auth boundaries preserved: ProCrow not exposed to clients; `/access` remains public sign-in gateway.

---

## Recovery fix (P0 + M2.0.1 + M2.0.2)

### Build / Vercel memory (M2.0.1 → M2.0.2)

- `next.config.ts`: `productionBrowserSourceMaps: false`, `webpackMemoryOptimizations`, `serverExternalPackages` for Prisma, `serverSourceMaps: false`, `preloadEntriesOnStart: false`
- On `VERCEL=1`: `experimental.cpus: 1`, `webpackBuildWorker: false`, `staticGenerationMaxConcurrency: 1`, webpack `cache: false`, `parallelism: 1`
- `scripts/next-build-with-memory.mjs`: **3072 MB** heap on Vercel (headroom for webpack native RSS), **6144 MB** locally; **split** `compile` then `generate` on Vercel

### L5 lite split (P0)

- `portal-access-lite.ts` — `countAvailablePortals`, `shouldRouteToAccessGateway`, `singlePortalRoute`, `getAuthenticatedPortalCta` (no `buildCrowAccessGatewaySnapshot`)
- `post-login-redirect.ts` — imports lite for gateway routing; re-exports CTA for header
- `portal-access.service.ts` — full snapshot for `/access` only

### M2.0 import graph (retained from `a506ae9`)

- `sarea-experience-studio-loader.ts`, `sarea-experience-go-no-go.ts`
- SAREA studio pages: loader + `force-dynamic`
- Go/No-Go: lightweight SAREA dependency module

---

## Files changed (this recovery)

| Path | Change |
|------|--------|
| `next.config.ts` | Vercel-aware memory + Prisma externalization |
| `scripts/next-build-with-memory.mjs` | Vercel 3072 heap + compile/generate split |
| `scripts/verify-vercel-build-memory-guard.ts` | Vercel config checks |
| `scripts/verify-access-gateway-portal-model.ts` | Lite split verifier |
| `scripts/verify-auth-landing-redirect.ts` | CTA checks include lite module |
| `src/lib/portal/portal-access-lite.ts` | **New** lightweight portal helpers |
| `src/lib/services/portal-access.service.ts` | Snapshot-only service |
| `src/lib/auth/post-login-redirect.ts` | Lite imports / re-exports |
| `src/app/access/page.tsx` | `force-dynamic` |
| `docs/internal/M2_0_VERCEL_BUILD_OOM_OPTIMIZATION.md` | M2.0.1 post-mortem |
| `docs/internal/P0_PRODUCTION_BUILD_RECOVERY_L5_PLUS.md` | This doc |
| `docs/internal/PROJECT_STATUS.md` | P0 status |
| `docs/internal/MILESTONES.md` | P0 milestone row |

---

## Local validation (5 Jun 2026)

| Command | Result |
|---------|--------|
| `npm run build-memory:verify` | PASS |
| `npm run access-gateway:verify` | PASS |
| `npm run auth-landing:verify` | PASS |
| `npm run sarea-blueprint:verify` | PASS |
| `npm run cybercrow-trust:verify` | PASS |
| `npm run pricing-packages:verify` | PASS |
| `npm run procrow-discovery:verify` | PASS |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `VERCEL=1 npm run build` | PASS (split compile ~20s + generate ~5s) |
| `npm run public:mirror-manifest` | PASS |

No migrations, seeds, payments, or tenant auto-provisioning were run.

---

## Vercel redeploy

**Production (`crow-ecosystem-platform`):** deployment `4942825955` / `crow-ecosystem-platform-mbd4n9za4` — **Ready** (~2m build, 5 Jun 2026).

Build log confirms split mode: `Compiled successfully in 34.3s` (compile), then generate phase; no OOM.

**Note:** Preview project `crow-ecosystem-platform-hsod` failed on `847d492` with `Cannot find module 'tailwindcss'` during compile — non-blocking for main production; investigate hsod install/settings separately if that env is needed.

Smoke after green:

- `/access`
- `/admin/go-no-go`
- `/sarea/overview`
- `/admin/tenants/[tenantId]`

---

## Remaining risks

1. **8 GB ceiling** — further feature growth may require Next.js upgrade, more aggressive code-splitting, or Vercel larger build machines.
2. **Static generation + DB** — local build logs Prisma table missing for some pages; Vercel production DB has migrations applied; watch for SSG paths that query DB at build time.
3. **Preview hsod** — tailwindcss missing on one failed preview deploy; main production unaffected.
4. **M3** — unblocked for planning; smoke recommended before large new compile-graph growth.

---

## P0 acceptance

| Criterion | Status |
|-----------|--------|
| Latest Vercel failure identified | Done — OOM/SIGKILL on `c89ed1f` (after P0.1) |
| First failing commit audited | Done — `f6d0085` / L5; no boundary bug |
| Fix without auth weakening | Done |
| Local build + verifiers | Done |
| No migrations/seeds/payments | Done |
| Production Vercel **Ready** | **Done** — `847d492` |
| Docs updated | Done |

**Decision:** P0 **PASSED** (5 Jun 2026).
