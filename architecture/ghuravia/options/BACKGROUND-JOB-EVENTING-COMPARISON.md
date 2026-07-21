# Background Job and Eventing Comparison

| Field | Value |
|-------|-------|
| Status | ACTIVE |
| Owner | Founder (RAVEN) |
| Date | 2026-07-21 |
| Source Gate | GHV.ARCHITECTURE.1B |

| Option | Summary | Pros | Risks / Limits | Architecture 1B stance |
|--------|---------|------|----------------|-------------------------|
| Transactional outbox + local/worker jobs | Durable post-commit publication | Preserves integrity, easy extraction path | Requires event discipline | ACCEPTED |
| In-request side effects | Fire side effects inline | Minimal code at first glance | Retry ambiguity and dual-write risk | REJECTED FOR CONTROLLED LAUNCH |
| External broker from launch | Dedicated async platform | Strong long-term scaling pattern | Extra infra and ops too early | DEFERRED |
| Cron-only batch model | Time-based batch execution | Simple for some tasks | Weak fit for event-driven recalculation | DEFERRED |
