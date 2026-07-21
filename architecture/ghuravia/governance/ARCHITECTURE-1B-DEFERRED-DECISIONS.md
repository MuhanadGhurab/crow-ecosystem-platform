# Architecture 1B Deferred Decisions

| Field | Value |
|-------|-------|
| Status | DEFERRED |
| Owner | Founder (RAVEN) |
| Date | 2026-07-21 |
| Source Gate | GHV.ARCHITECTURE.1B |

| Decision area | Current stance | Trigger to revisit |
|---------------|----------------|-------------------|
| Dedicated API host via Hono | DEFERRED | Extraction trigger from throughput, isolation, or runtime specialization |
| Graph database | DEFERRED | Relational adjacency no longer meets traversal or scale needs |
| External broker | DEFERRED | Outbox + local/worker jobs cease to meet reliability or throughput needs |
| Shared distributed cache | DEFERRED | Query/projection load justifies derivative shared caching |
| Provider choice for relational datastore | DEFERRED | Environment, cost, residency, and operator constraints are finalized |
| Realtime transport | DEFERRED | Architecture 1D opens Live Sky/realtime scope |
| Object storage provider | DEFERRED | Evidence-domain gate requires provider selection |
| Validator brand standard | DEFERRED | Product implementation requires a concrete schema-validator choice |
| Identity provider selection | DEFERRED | Identity-domain validation progresses beyond current core stack lock |
