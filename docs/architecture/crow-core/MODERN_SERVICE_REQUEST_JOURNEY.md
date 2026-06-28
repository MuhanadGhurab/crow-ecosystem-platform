# Modern Service Request Journey (CROW.REQUEST.2)

## Lifecycle

```text
Authenticated client
→ /client/requests/new (canonical wizard)
→ Submit Request Brief
→ /client/requests/{id}/confirmation
→ Optional Discovery (/client/requests/{id}/discovery/design)
→ ProCrow review → Model Forge → Blueprint
```

Public marketing entry `/request` explains the process and preserves `next=/client/requests/new` through signup/login. It does not create requests directly.

## Five client decisions

1. Business field (universal catalog + custom fallback)
2. Business purpose
3. Team size and growth intention
4. Guidance preference (configuration mode)
5. Review and explicit submit

Preliminary Crow understanding is shown before submit; it is advisory only.

## Side effects on submit

Creates exactly one `ImplementationRequest` with `submittedByUserId`. Does **not** create Discovery answers, Blueprint rows, tenants, memberships, or authority grants.

## Legacy routes

`POST /api/implementation-requests` and `submitImplementationRequest` return 410 / throw — use the canonical wizard instead.
