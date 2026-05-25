# F7 deployment checkpoint

**Phase:** F7 — Public request → Discovery pipeline hardening  
**Date:** 25 May 2026

## Scope delivered

- Pipeline audit in [`F7_PUBLIC_DISCOVERY_PIPELINE.md`](F7_PUBLIC_DISCOVERY_PIPELINE.md)
- Public intake error surfacing + client validation mirror
- Shared reference code generator; discovery sector bootstrap on `startDiscovery`
- Sector resolver default + industry dropdown (construction, aviation)
- Verify scripts: `request:pipeline:verify`, `discovery:verify:meem`, `discovery:verify:rimal`

## Validation commands

Run from repo root with `.env.staging` populated:

```bash
npm run typecheck
npm run lint
npm run build
npm run simulate:vercel-build:staging
npm run public:mirror-manifest
npm run meem:ids:staging
npm run tenant:verify:rimal
npm run request:pipeline:verify
```

## Regression anchors

| Tenant | Slug | Reference |
|--------|------|-----------|
| MEEM | `meem-global` | `CROW-2026-MEEM` |
| Rimal | `rimal-construction` | `CROW-2026-RIMAL` |

## Out of scope (unchanged)

- Public website redesign
- Stripe / billing enforcement / SCIM / Entra sync
- Schema migrations
- Blueprint engine rebuild

---

*Update PASS/FAIL lines below after running the gate.*

| Check | Result |
|-------|--------|
| typecheck | (pending) |
| lint | (pending) |
| build | (pending) |
| simulate:vercel-build:staging | (pending) |
| request:pipeline:verify | (pending) |
