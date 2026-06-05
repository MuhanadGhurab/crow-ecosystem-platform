# M2.0 — Vercel Build OOM Optimization

**Date:** 29 May 2026  
**Trigger commit:** `93c3c9c` — M2 SAREA blueprint-to-experience mapping  
**Audience:** Internal delivery / engineering

---

## Root cause (Vercel log)

Production deployment on Vercel failed **after** database steps completed successfully:

| Step | Result |
|------|--------|
| `prisma generate` | Passed |
| Remote DB guard | Passed |
| `prisma migrate deploy` | Passed (no pending migrations) |
| `next build` | **Failed** — build worker exited with **SIGKILL** (Out of Memory) |

**Conclusion:** This was a **Next.js compile/memory** failure, not a migration or Prisma deploy problem.

---

## What was not the cause

- Pending or failed Prisma migrations
- Remote database connectivity during deploy
- M2 schema changes (M2 is advisory mapping; no new migration required for the mapping layer)
- Auth weakening or product behavior changes

---

## Memory optimization changes

### Next.js config (`next.config.ts`)

- `productionBrowserSourceMaps: false` — avoids shipping source maps in production builds
- `experimental.webpackMemoryOptimizations: true` — reduces peak webpack memory during compile
- `experimental.webpackBuildWorker: true` — isolates webpack work when compatible with the default config

### Build command (`package.json` + `scripts/next-build-with-memory.mjs`)

- `npm run build` now runs through `scripts/next-build-with-memory.mjs`
- Sets `NODE_OPTIONS=--max-old-space-size=6144` when not already set (Vercel-safe ceiling)
- Preserves `--use-system-ca` for Next CLI invocation
- Does **not** set `ignoreBuildErrors` or hide type failures

Vercel build command remains:

```text
node scripts/vercel-build-guard.mjs && npm run db:generate && npm run db:migrate:deploy && npm run build
```

The memory wrapper applies inside `npm run build` only.

---

## M2 import graph cleanup

### Problem pattern

M2 added `sarea-experience-mapping.service.ts`, which pulls Prisma, CyberCrow trust, SAREA materialization, and tenant services. Six SAREA studio routes and admin surfaces imported this module during the build graph, increasing compile memory.

### Fixes applied

| Change | Purpose |
|--------|---------|
| `sarea-experience-studio-loader.ts` | Single studio entry re-export; six SAREA pages import loader instead of the full service path |
| `sarea-experience-go-no-go.ts` | Lightweight Go/No-Go dependency builder (no Prisma chain) |
| `SareaExperienceGoNoGoDependency` type moved to contract | Client/Procrow panels import types from contract only |
| `export const dynamic = "force-dynamic"` on DB-backed M2 admin + SAREA pages | Avoids static analysis of heavy server snapshots at build time |
| Client components unchanged — contract/types only | No Prisma or mapping service in `"use client"` bundles |

### M2 behavior preserved

- SAREA mapping panels on admin tenant/request surfaces
- SAREA Studio blueprint experience summary on studio routes
- Tenant dashboard/modules SAREA advisory note
- ProCrow Go/No-Go SAREA dependency gate (`sarea-blueprint-experience-m2`)

---

## Verification

```bash
npm run build-memory:verify
npm run sarea-blueprint:verify
npm run cybercrow-trust:verify
npm run procrow:verify
npm run procrow-workbench:verify
npm run tenant-demo:verify
npm run access-gateway:verify
npm run typecheck
npm run lint
npm run build
npm run public:mirror-manifest
```

Verifier: `scripts/verify-vercel-build-memory-guard.ts` (`npm run build-memory:verify`)

---

## Vercel redeploy instruction

1. Commit and push M2.0 changes to `main` (after local verification is green).
2. In Vercel, redeploy the latest `main` deployment (or wait for auto-deploy from push).
3. Confirm build log shows: DB steps pass, then `next build` completes without SIGKILL.
4. Smoke: `/admin/go-no-go`, one SAREA studio route, one admin tenant with mapping panel.

---

## Remaining risks

- **Environment-specific OOM:** Local builds may pass on a machine with more RAM while Vercel still approaches limits on very large future diffs. Monitor build duration and memory after redeploy.
- **Studio loader is still server-heavy at runtime:** Build graph is leaner; runtime still loads the full mapping service when studio snapshots are requested — intentional for M2 fidelity.
- **webpackBuildWorker:** If a future custom webpack hook conflicts, disable only that flag — keep `webpackMemoryOptimizations` and source map disable.
- **Further growth:** Additional modules importing `sarea-experience-mapping.service` into many routes could regress compile memory; run `build-memory:verify` in CI or pre-deploy checks.

---

## Related docs

- M2 feature: [`M2_SAREA_BLUEPRINT_TO_EXPERIENCE_MAPPING.md`](M2_SAREA_BLUEPRINT_TO_EXPERIENCE_MAPPING.md)
- Milestones: [`MILESTONES.md`](MILESTONES.md) — M2.0 entry
- Status: [`PROJECT_STATUS.md`](PROJECT_STATUS.md)
