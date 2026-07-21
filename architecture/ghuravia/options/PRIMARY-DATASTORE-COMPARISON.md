# Primary Datastore Comparison

| Field | Value |
|-------|-------|
| Status | ACTIVE |
| Owner | Founder (RAVEN) |
| Date | 2026-07-21 |
| Source Gate | GHV.ARCHITECTURE.1B |

| Option | Summary | Pros | Risks / Limits | Architecture 1B stance |
|--------|---------|------|----------------|-------------------------|
| PostgreSQL-family relational primary | Single transactional source of truth | Strong transactions, schema control, adjacency modeling | Provider still to choose | ACCEPTED |
| Graph database primary | Native graph traversals | Strong graph ergonomics | Additional primary store complexity, unneeded at launch | REJECTED FOR CONTROLLED LAUNCH as primary |
| Document database primary | Flexible schema | Good for some content use cases | Weaker fit for progression and formula history integrity | DEFERRED |
| Polyglot primary launch | Multiple sources of truth | Specialized per domain | High operational and governance cost | DEFERRED |

## Scope boundary
Object storage, cache, search, and analytics remain separate adjunct capabilities.
