# Technology Decision Summary

| Field | Value |
|-------|-------|
| Status | ACTIVE |
| Owner | Founder (RAVEN) |
| Date | 2026-07-21 |
| Source Gate | GHV.ARCHITECTURE.1B |

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-ARC-001 | Modular monolith with explicit domain packages | ACCEPTED |
| ADR-ARC-002 | Next.js App Router + React 19 + TypeScript | ACCEPTED WITH CONDITIONS |
| ADR-ARC-003 | TypeScript backend modules with Next.js Route Handlers initially | ACCEPTED WITH CONDITIONS |
| ADR-ARC-004 | Command-oriented HTTP mutations, natural GETs, in-process modules, outbox | ACCEPTED |
| ADR-ARC-005 | PostgreSQL-family relational primary datastore | ACCEPTED |
| ADR-ARC-006 | Drizzle default typed SQL with justified raw SQL exceptions | ACCEPTED WITH CONDITIONS |
| ADR-ARC-007 | Relational adjacency Learning Graph source of truth | ACCEPTED |
| ADR-ARC-008 | Append-only progression event ledger + formula versioning | ACCEPTED |
| ADR-ARC-009 | Transactional outbox + post-commit local/worker jobs | ACCEPTED |
| ADR-ARC-010 | No shared distributed cache required for controlled launch | ACCEPTED |
| ADR-ARC-011 | `node:test` for spikes, Vitest later, Playwright later | ACCEPTED |
| ADR-ARC-012 | TypeScript core language + shared contracts + schema validators | ACCEPTED |
