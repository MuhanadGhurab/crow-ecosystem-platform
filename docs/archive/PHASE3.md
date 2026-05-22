# Phase 3 — Tenant operations & polish

**Status:** Done · **Snapshot:** [`PLATFORM_STATUS.md`](PLATFORM_STATUS.md)

Phase 3 hardens multi-tenant operations and polishes the surfaces that already work from Phase 1–2.

## Delivered

| Area | What changed |
|------|----------------|
| **Tenant services** | `listTenants`, `getTenantById`, `getTenantWorkspaceSummary`, `assertTenantScope` |
| **Blueprint services** | `listEnterpriseBlueprints` |
| **Admin hubs** | Real pages for `/admin/tenants`, `/admin/blueprints`, `/admin/discovery` |
| **Tenant workspace** | Dashboard stats (CyberCrow + SAREA), real `/modules` and `/cybercrow/dashboard` |
| **Auth hardening** | `requireActionPlatformStaff()` on admin, discovery, and blueprint server actions |
| **UX** | Status badges on blueprint overview + tenant dashboard; loading shells; fixed “View tenants” dead link |
| **DB transactions** | Pipeline uses `DIRECT_URL` for interactive transactions (PgBouncer-safe) |

## Admin navigation (live)

- **Requests** — full intake list + detail + pipeline actions
- **Discovery** — active `UNDER_DISCOVERY` / `BLUEPRINT_BUILD` requests
- **Blueprints** — all enterprise blueprints with status
- **Tenants** — provisioned tenants with links to workspace + admin detail

Placeholder nav items (domains, integrations, audit, …) remain shells.

## Tenant scoping rules

- All tenant reads go through `getTenantBySlug` / `getTenantById` with `tenantId` on child queries.
- `getTenantWorkspaceSummary(tenantId)` scopes CyberCrow/SAREA counts by `tenantId`.
- Future CEM CRUD **must** include `where: { tenantId }` on every Prisma call.

## Smoke test

```powershell
npm run smoke:phase1
```

Then verify in the browser (signed in as platform admin):

1. `/admin/tenants` — lists smoke tenant
2. `/admin/blueprints` — shows blueprint
3. `/admin/discovery` — empty if no active discovery
4. `/{slug}/dashboard` — live stats

## Next

See [PHASE4.md](./PHASE4.md) for CEM identity and tenant membership (completed).
