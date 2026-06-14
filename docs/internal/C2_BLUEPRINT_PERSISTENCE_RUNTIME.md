# C2 — Blueprint persistence runtime

**Branch:** `feat/c2-blueprint-persistence-runtime` (stacked on `feat/c1-1-blueprint-persistence-gate`)  
**Verifier:** `npm run c2-blueprint-runtime:verify`  
**Architecture:** [`docs/architecture/crow-core/c2/`](../architecture/crow-core/c2/)

## Status

**PASSED — READY FOR PREVIEW MIGRATION REVIEW** (14 Jun 2026, local branch; uncommitted until PR #6).

| Area | State |
|------|--------|
| Additive migration #14 | `20260614120000_blueprint_versioning_traceability` — applied on isolated Postgres |
| Runtime + repositories | Implemented |
| Studio draft save (C2 path) | Partial — when `tenantId` resolved |
| Approval / review / ROI / SOW Studio actions | Repositories + services; UI wiring incremental |
| Hosted DB migration | **Not applied** |
| Backfill `--apply` | **Not run** |

## Isolated verification (14 Jun 2026)

Disposable Docker Postgres 16 (`crow-c2-verify`, port 5433). Because baseline migration `20260515150000_init_crow_ecosystem` is a stub and CI uses `db push`, verification used a **repo-aligned baseline**:

1. `prisma db push` from C1.1 schema at `e591344`
2. `prisma migrate resolve --applied` for migrations 1–13
3. `prisma migrate deploy` — C2 migration applied (14 total in history)
4. `npm run db:seed` — passed
5. `npm run smoke:phase1` — passed

**Not verified:** literal empty-DB `migrate deploy` from migration 1 (known stub-init gap; optional hygiene PR).

## Static validation (14 Jun 2026)

`prisma format/validate/generate`, `c2-blueprint-runtime:verify`, full verifier suite, `test:blueprint-studio`, `typecheck`, `lint`, `build`, `public:mirror-manifest` — all green.

## Gates

- C1.1: **APPROVE PATH C — READY FOR C2 MIGRATION IMPLEMENTATION**
- C2: **PASSED — READY FOR PREVIEW MIGRATION REVIEW**

## Commands

```bash
npm run c2-blueprint-runtime:verify
npm run blueprint-persistence:backfill -- --dry-run
```

## Stack

- PR #3 — C0 → main
- PR #4 — C1 → C0
- PR #5 — C1.1 → C1
- PR #6 — C2 → C1.1 (pending open)
