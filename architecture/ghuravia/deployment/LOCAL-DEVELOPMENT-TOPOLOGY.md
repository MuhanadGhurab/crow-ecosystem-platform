# Local Development Topology

| Field | Value |
|-------|-------|
| Status | ACTIVE |
| Owner | Founder (RAVEN) |
| Date | 2026-07-21 |
| Source Gate | GHV.ARCHITECTURE.1B |

## Topology
- One local primary web application process.
- Synthetic/local-only spike harnesses for architecture validation.
- Relational datastore provider selection remains deferred.
- Optional later worker process only after extraction trigger.

## Guardrails
- No root `package.json` created by this decision set.
- No `src/`, `apps/`, `.env`, Prisma schema migrations, or Product Code introduced.
- Preview/production isolation requirements remain mandatory when real deployments begin.
