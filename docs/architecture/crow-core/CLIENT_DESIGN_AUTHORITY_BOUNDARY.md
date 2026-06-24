# Client Design Authority Boundary

> **Status:** CURRENT — CROW.DISCOVERY.2

## Client design draft flags

```text
advisory: true
authoritative: false
provisionsTenant: false
grantsPermissions: false
createsBlueprint: false
```

## Who may write CLIENT_PROVIDED design answers

| Actor | Allowed |
| ----- | ------- |
| Authoritative request owner (verified client session) | Yes |
| Tenant member without request ownership | No |
| IMPLEMENTER | No |
| PLATFORM_ADMIN impersonating client | No |
| Metadata-only or email-only identity | No |

## Enforcement layers

1. `requireClientAccess` on client routes
2. `clientCanAccessRequestAuthoritative` in page service and persistence
3. `planDiscoveryAnswerWrite` with `provenance: "client_owner"`
4. `internal_actor_cannot_client_provide` when actor has internal roles
5. `actor_not_request_owner` when `submittedByUserId` mismatch

## ProCrow separation

- **Client selection** — `CLIENT_PROVIDED` Discovery answers in `client_enterprise_design` section
- **Crow recommendation** — `recommendationSnapshot` inside draft (recomputed on save, not overwriting client fields)
- **Internal reviewer note** — existing implementer Discovery mechanisms (separate section/provenance)

## Model Forge handoff

PLATFORM_ADMIN may open client design in Model Forge via `?clientDesignRequestId=`. Handoff is read-only: no Discovery writes, no Blueprint persistence, no authority grants.
