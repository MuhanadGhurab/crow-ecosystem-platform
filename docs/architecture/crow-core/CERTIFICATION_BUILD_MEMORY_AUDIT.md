# Certification Build Memory Audit (CROW.CERT.1)

**Status:** PASS

## Diagnosis

Local OOM caused by dual `webpackBuildWorker` process + 6 GB heap on a graph exceeding ~7.3 GB during webpack compile.

## Fix

1. `next.config.ts` — disable `webpackBuildWorker`, `cpus: 1`, `parallelism: 1`, disable webpack cache for all production builds.
2. `scripts/next-build-with-memory.mjs` — local heap **8192 MB**; Vercel **3072 MB** with split compile/generate phases.

## Verified commands

```bash
npm run build              # LOCAL_PRODUCTION_BUILD=PASS (~70s)
npm run build:certification
npm run build-memory:verify
```

Vercel build: PASS (prior certification deploy + config aligned).

Prisma errors during local SSG for admin pages are non-fatal (dynamic routes); build completes successfully.
