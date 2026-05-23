# Role-based access control (RBAC)

**Phase 4 focus:** Platform `crow_role` (Supabase `app_metadata`) + tenant CEM role permissions (Postgres `roles` / `permissions`).

**Code:** `src/lib/auth/permissions.ts`, `src/lib/auth/roles.ts`, `src/lib/supabase/middleware.ts`, `src/lib/auth/session.ts`

---

## Layer 1 — Platform identity (`crow_role`)

| Role | Label | Route scope |
|------|-------|-------------|
| `platform_admin` | Platform Admin | Full platform + all tenants |
| `implementer` | Implementation | Same as admin (delivery / go-live) |
| `sales` | Sales | Requests, discovery read, blueprint read — **no** go-live, audit, SAREA studio |
| `auditor_readonly` | Auditor (read-only) | `/admin/audit`, blueprint read, tenant CyberCrow audit (when granted slug) |
| `client` | Client | `/portal/*` only |
| `tenant_admin` | Tenant Admin | Own `tenant_slugs` — full CEM/CyberCrow module set |
| `tenant_user` | Tenant User | Own slugs — limited writes (HR, logistics view, audit read) |

**Dev bypass:** `AUTH_DISABLED=true` + `AUTH_DEV_ROLE` (`sales`, `auditor_readonly`, `client`, `tenant_admin`, `tenant_user`, `implementer`).

---

## Layer 2 — Permission matrix

Permissions are string keys (e.g. `platform.blueprint.provision`, `cem.logistics.view`). See `Permission` in `permissions.ts`.

### Platform (selected)

| Permission | platform_admin | implementer | sales | auditor_readonly |
|------------|----------------|-------------|-------|------------------|
| `platform.requests.manage` | ✓ | ✓ | ✓ | — |
| `platform.discovery.write` | ✓ | ✓ | — | — |
| `platform.blueprint.provision` | ✓ | ✓ | — | — |
| `platform.audit.view` | ✓ | ✓ | — | ✓ |
| `platform.sarea.studio` | ✓ | ✓ | — | — |

### Tenant CEM slugs (Postgres)

| Slug | MEEM discovery name | Typical access |
|------|---------------------|----------------|
| `tenant-admin` | Executive / sponsor | Full module + CyberCrow |
| `hub-manager` | Hub Manager | Logistics, warehouse, sales, workflows |
| `dispatcher` | Dispatcher | Logistics, warehouse, workflows, audit read |
| `manager` | Manager | Ops modules + workflows |
| `employee` | Frontline | Dashboard + logistics view |
| `auditor-readonly` | Auditor | Dashboard + CyberCrow audit only |

Seeded on provision via `tenant-cem-seed.service.ts`; re-sync on MEEM ops: `syncMeemTenantRolePermissions("meem-global")`.

---

## Route guards

| Prefix | Guard |
|--------|--------|
| `/admin/*` | Middleware + layout: permission-filtered nav |
| `/portal/*` | Client or staff preview; blocks pure tenant roles in middleware |
| `/discovery/*` | `platform.discovery.view` (write actions need `platform.discovery.write`) |
| `/blueprints/*` | `platform.blueprint.view`; go-live needs `platform.blueprint.provision` |
| `/{slug}/*` | `canAccessTenant` + per-module path permissions |

Denied users redirect to `/unauthorized`.

---

## MEEM rehearsal roles

| Test as | Env | Entry |
|---------|-----|--------|
| Platform admin | `AUTH_DEV_ROLE=platform_admin` or Supabase metadata | `/admin/requests`, go-live, audit |
| Sales | `AUTH_DEV_ROLE=sales` | `/admin/requests` — no Audit / Go-live nav |
| Implementation | `AUTH_DEV_ROLE=implementer` | Full pipeline |
| Client | `AUTH_DEV_ROLE=client` | `/portal/requests/...` |
| Tenant dispatcher | `AUTH_DEV_ROLE=tenant_user` + `AUTH_DEV_TENANT_SLUG=meem-global` | `/meem-global/logistics` (no Users) |
| Auditor | `AUTH_DEV_ROLE=auditor_readonly` + tenant slug grant | `/admin/audit`, tenant audit logs |

---

## Related

- [`ROLES_AND_WORKFLOW.md`](ROLES_AND_WORKFLOW.md) — stakeholder personas
- [`customers/MEEM_GLOBAL.md`](customers/MEEM_GLOBAL.md) — live E2E checklist
- [`PHASE4_MEEM_E2E.md`](PHASE4_MEEM_E2E.md) — rehearsal script
