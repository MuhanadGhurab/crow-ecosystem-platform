# Tenant Resilience & Load Management

Multi-tenant operations require **quotas, abuse detection, and graceful degradation** — not silent failure.

## Types (`src/lib/crow-core/resilience/`)

- `TenantQuota`: API, AI, storage, concurrent workflows
- `AbuseSignal`: rate spikes, credential stuffing patterns, invite abuse
- `DegradationPolicy`: throttle → queue → read-only → maintenance message

## Responses

| Level | Behavior |
|-------|----------|
| Warn | Operator notification |
| Throttle | Slow non-critical paths |
| Defer | Queue background AI |
| Read-only | Protect data integrity |
| Block | Stop abusive tenant slice |

## Principles

- Degradation is visible to operators (ProCrow), not invisible to tenants
- No "invisible tenant change" — all policy shifts require traceability
- C8 implements enforcement; C0 defines contracts only
