# Platform Stack Baseline

| Field | Value |
|-------|-------|
| Version | 1.0.0 |
| Status | ACTIVE - CORE PLATFORM DECISIONS ACCEPTED · DOMAIN VALIDATION CONTINUES · PRODUCT CODE BLOCKED |
| Owner | Founder (RAVEN) |
| Date | 2026-07-21 |
| Source Gate | GHV.ARCHITECTURE.1B |

## Baseline
- Platform shape: modular monolith with explicit domain packages.
- Frontend: Next.js App Router `next@16.2.10` + React `19.2.8` + TypeScript `7.0.2`.
- Backend: TypeScript domain modules with Next.js Route Handlers initially.
- Data: PostgreSQL-family relational primary datastore.
- Data access: Drizzle ORM `0.45.2` by default, with justified raw SQL exceptions.
- Jobs and eventing: transactional outbox with local or worker post-commit jobs.
- Testing baseline: `node:test` for spikes, Vitest `4.1.10` later, Playwright later.
- Runtime baseline: Node `24.15.0`.

## Guardrails
- Product Code remains BLOCKED.
- P1-P3 domain validation is still open.
- Deferred technology decisions stay deferred until their gate triggers fire.
- No claim of full security, compliance, or accessibility closure is made here.
