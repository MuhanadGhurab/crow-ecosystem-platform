# Local Build Memory Audit

**Status:** CURRENT (MODEL.4)

## Finding

Local `npm run build` OOM at ~8GB heap on Windows dev environment (Next.js 15 webpack worker). **Vercel production build passes.**

## Contributing factors

- Large model-forge barrel exports (`src/lib/model-forge/index.ts`)
- Catalog import fan-out via tenant-composition registry
- Blueprint Studio client bundle includes graph + compiler paths
- Source-map pressure in local webpack workers

## Mitigations applied

- Graph rebuild in Studio uses `registerProvenance: false` to avoid duplicate work
- Scenario comparison builds graphs without provenance registration
- Golden fixtures isolated in `fixtures/` (test-only import path)
- Supported local command: `NODE_OPTIONS=--max-old-space-size=8192 npm run build`

## Not applied

No typecheck/lint disabling, no skipped production stages.
