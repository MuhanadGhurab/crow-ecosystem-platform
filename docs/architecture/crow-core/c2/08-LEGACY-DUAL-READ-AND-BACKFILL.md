# C2 — Legacy dual-read and backfill

## Dual-read

When a C2 version snapshot exists → use `c2_version` path (`blueprint-dual-read.service.ts`).

When no C2 version yet → `legacy_unversioned` via Path A adapter (existing normalized children / document adapter).

New Studio writes target C2 persistence when `tenantId` is resolved.

## Backfill

Command: `npm run blueprint-persistence:backfill` (defaults to `--dry-run`).

Modes: `--dry-run`, `--apply`, `--tenant`, `--blueprint`, `--limit`.

Backfill:

- Creates version 1 from legacy where tenant ownership is known
- Never invents approvals
- Idempotent
- Reports unresolved tenant ownership

**C2 must not run `--apply` against hosted databases.**
