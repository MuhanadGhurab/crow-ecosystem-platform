# Platform Migration and Exit Strategy

| Field | Value |
|-------|-------|
| Status | ACTIVE |
| Owner | Founder (RAVEN) |
| Date | 2026-07-21 |
| Source Gate | GHV.ARCHITECTURE.1B |

## Principles
- Preserve domain package boundaries even while running one primary web app.
- Treat the relational datastore as the source of truth; new systems derive from it.
- Prefer additive migrations and replayable event history.
- Extract only when a documented trigger is met.

## Expected migration paths
- Next.js Route Handlers -> dedicated Hono host if HTTP edge specialization is needed.
- Local/worker jobs -> external broker if async scale or isolation demands it.
- Process-local cache -> shared derivative cache if measured need appears.
- Relational adjacency -> hybrid read projection before any graph-store promotion.

## Exit strategy notes
- Shared contracts reduce UI/backend lock-in.
- Drizzle plus raw SQL preserves portability across PostgreSQL-family providers.
- Append-only progression events preserve replay ability during platform changes.
- Reversal cost is lowest when extraction follows existing module boundaries rather than rewrites them.
