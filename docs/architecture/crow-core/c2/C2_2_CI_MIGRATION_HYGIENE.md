# C2.2 — CI migration hygiene

**Scope:** Honest documentation of migration-chain vs `db push` divergence; no CI behavior change in C2.2

## Current state

| Path | Behavior |
|------|----------|
| Vercel build (post-C2.2) | `db:generate` + `build` only — **no migrate** |
| Local staging host | May still invoke migrate intentionally via `staging-host.mjs` |
| Controlled apply | `npm run db:migrate:controlled` or GitHub `database-migrate.yml` |
| Legacy CI / local | Some flows may use `prisma db push` for speed on disposable DBs |

## Problem

`db push` synchronizes schema from `schema.prisma` without enforcing the ordered `prisma/migrations/*` history. This can hide:

- Missing migration folders in repo
- Drift between migration SQL and schema
- False confidence that Preview/Production received identical DDL via the same path

## C2.2 position

- **Do not** reintroduce migrate into Vercel builds
- **Do not** add new Prisma migrations in C2.2
- Document divergence; defer baseline reset to **C2.H**

## C2.H cross-reference

See [C2_H_MIGRATION_BASELINE_HYGIENE_PROPOSAL.md](./C2_H_MIGRATION_BASELINE_HYGIENE_PROPOSAL.md) for:

- Squash / baseline migration ADR (future)
- CI job design: `migrate deploy` on ephemeral Postgres with full migration chain
- Retiring `db push` for environments that mirror Production

## Recommended future CI job (design only)

```yaml
# Not implemented in C2.2 — reference for C2.H
# - Spin up ephemeral Postgres
# - npm run db:migrate:controlled -- --environment ci --check-only
# - npm run test / verify suite against migrated schema
```

## Verifier hooks

`npm run c2-database-isolation:verify` asserts build configs exclude migrate, push, resolve, seed, and backfill apply patterns.
