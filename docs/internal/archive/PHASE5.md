# Phase 5 — SAREA studio, tenant modules & invites

**Status:** Done (May 2026) — CRM inline edit completed in Phase 6  
**Snapshot:** [`PLATFORM_STATUS.md`](PLATFORM_STATUS.md)

---

## Delivered

### SAREA Experience Studio

| Route | Capability |
|-------|------------|
| `/sarea/overview` | Studio metrics |
| `/sarea/profiles` | All experience profiles |
| `/sarea/layouts` | List + inline edit layout names |
| `/sarea/role-mapping` | List + edit role slug maps |
| `/sarea/widgets` | List + edit widget visibility |
| `/sarea/rules` | List + edit adaptive rule keys |
| `/sarea/device-rules` | List + edit device types |
| `/sarea/navigation` | Read navigation JSON configs |
| `/sarea/preview` | Aggregate studio preview |

- **`sarea-seed.service.ts`** — default layouts, widgets, role maps, nav, device, adaptive rules on provision
- **`npm run sarea:backfill-seed`** — backfill for tenants provisioned before full SAREA seed

### Tenant ERP modules (MVP)

| Route | Capability |
|-------|------------|
| `/[tenant]/hr` | List, add, inline-edit employees (`HrEmployee`) |
| `/[tenant]/crm` | Accounts + contacts CRUD (`CrmAccount`, `CrmContact`) |

Services: `hr.service.ts`, `crm.service.ts` — all queries scoped by `tenantId`.

### Invite by email

- **`inviteAndGrantTenantAccess()`** — Supabase `inviteUserByEmail` + membership + `app_metadata`
- **Admin** `/admin/tenants/[id]` — checkbox “Invite by email if user does not exist”
- **Tenant** `/[tenant]/users` — “Invite user” form for tenant admins

### Blueprint sub-routes

| Route | Capability |
|-------|------------|
| `/blueprints/[id]/cem` | CEM counts + link to tenant structure |
| `/blueprints/[id]/cybercrow` | Security summary + link to console |
| `/blueprints/[id]/sarea` | Persona list + link to studio |
| `/blueprints/[id]/go-live` | Provision form or live tenant link |

---

## Schema additions

- `hr_employees` — tenant-scoped HR records
- `crm_accounts`, `crm_contacts` — tenant-scoped CRM

Apply: `npx prisma db push`

---

## Verify

```powershell
npm run typecheck
npm run build
npm run sarea:backfill-seed   # existing tenants missing SAREA children
```

**Browser (platform admin):**

1. `/sarea/layouts` — edit a layout name
2. `/admin/tenants/[id]` — invite new email with checkbox
3. `/{slug}/hr` — add employee
4. `/{slug}/crm` — create account + contact
5. `/blueprints/[id]/go-live` — provision or open tenant

**Browser (tenant admin):**

1. `/{slug}/users` — send invite

---

## Next (Phase 6)

See [`ROADMAP.md`](ROADMAP.md): migrations, email notifications, admin shells, CyberCrow sub-modules, SAREA runtime.
