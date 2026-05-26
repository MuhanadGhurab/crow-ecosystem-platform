# F5 — CYBERCROW + SAREA validation matrix (MEEM)

Last updated: 2026-05-25

## Scope

Phase F5 materializes five SAREA personas per tenant (when safe), improves role→SAREA mapping and preview accuracy, validates MEEM tenant dashboard + CyberCrow workflows, and documents acceptance without schema changes, billing, SCIM, or fake telemetry.

## MEEM tenant

- Slug: `meem-global` (staging IDs via `npm run meem:ids:staging` — not documented here)
- Materialization: `ensureTenantSareaPersonas` + `seedSareaProfileDefaults` (idempotent)
- Re-seed path: `prisma/seed-meem.ts` runs persona ensure + `upgradeLogisticsSareaForTenant`
- CLI: `npm run sarea:meem-upgrade` → `scripts/upgrade-meem-sarea.ts`

## Persona matrix

| Persona key | Display | Target role slugs | Dashboard purpose | Nav emphasis | Widgets / complexity | CyberCrow visibility | Materialization target |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `executive` | Executive | `executive`, `ceo` | Trust, posture summary | Short strategic nav | Low density, KPI/trust | Summary strip only (no triage) | Tenant-backed |
| `manager` | Manager | `manager`, `operations-manager` | Ops workflow | Modules + tasks | Medium density | Incidents list link | Tenant-backed |
| `frontline` | Frontline | `frontline`, `operator` | Task-first | Compact | High task density | Minimal | Tenant-backed |
| `analyst` | CyberCrow Analyst | `analyst`, `security-analyst` | Security triage | CyberCrow-first | Security widgets | Full console (incidents, events, identity) | Tenant-backed |
| `tenant_admin` | Tenant Admin | `tenant-admin` | CEM + governance | Users, roles, settings | Admin density | Monitoring + users/roles | Tenant-backed |

**RBAC vs SAREA:** Permissions come from CEM roles only. SAREA changes labels, layout, nav, and widgets — not access.

## Materialization states

| State | Meaning | Preview behavior |
| --- | --- | --- |
| `tenant_backed` | Profile + layouts + widgets + nav in DB | Runtime uses DB profile |
| `partial` | Profile exists; missing child rows | Run `sarea:backfill-seed` or `sarea:meem-upgrade` |
| `not_materialized` | No profile row | Executive/manager/frontline should not stay here on MEEM after upgrade |
| `recommended_fallback` | No profile; studio recommends mapping | Platform preview uses `SAREA_PREVIEW_FALLBACK` (analyst/tenant_admin only when not backed) |

## Routes validated (MEEM)

| Route | F5 check |
| --- | --- |
| `/meem-global/dashboard` | SAREA runtime + preview banner (tenant-backed vs fallback) |
| `/sarea/preview` | Per-persona materialization badges |
| `/sarea/role-mapping` | Mapping guidance + MEEM materialization panel |
| `/admin/tenants/{id}` SAREA tab | Materialization panel + profile counts |
| `/meem-global/cybercrow/dashboard` | Metrics + connection copy |
| `/meem-global/cybercrow/incidents` | Status workflow; no delete |
| `/meem-global/cybercrow/security-events` | Review/dismiss/escalate; no duplicate escalation |
| `/meem-global/cybercrow/identity` | Real rows or honest empty |
| `/meem-global/cybercrow/sessions` | Telemetry summary or empty |

## CyberCrow workflow (F4 retained, F5 validated)

- Incidents: `open` → `under_review` → `resolved` / `reopened`; audit log; `cybercrow.incidents.manage`
- Security events: reviewed / dismissed / escalate-once; payload review fields
- No incident delete, no destructive remapping, no fake AI

## CLI materialization path (F5 fix)

Upgrade, backfill, and verify scripts must not import the app `db` module (`server-only`). They use:

- `src/lib/prisma-script.ts` — `createScriptPrisma()` for tsx/seed/one-off ops
- `src/lib/services/sarea-seed-core.ts` — shared persona seed logic (no Next.js server boundary)

Wiring: `scripts/upgrade-meem-sarea.ts`, `scripts/backfill-sarea-seed.ts`, and `scripts/verify-meem-sarea.ts` all call the above. `npm run sarea:meem-upgrade` and `npm run sarea:meem-verify` run cleanly outside the Next.js server.

## F5 acceptance — MEEM verify (2026-05-25)

**Command:** `npm run sarea:meem-verify` (loads `.env.staging` per `package.json`)

**Exit code:** `0`

**Summary:** All five preview personas on tenant slug `meem-global` report `tenant_backed` (profile, layout, widgets, nav, role maps present). No `partial`, `not_materialized`, or `recommended_fallback` on MEEM for executive, manager, frontline, analyst, or tenant_admin.

**Captured stdout (tenant id omitted; slug only):**

```
SAREA verify — tenant: meem-global
persona | profile | layout | widgets | nav | role_maps | materialization | display_name
----------------------------------------------------------------------------------------------------
executive      | yes | yes |      10 | yes |         1 | tenant_backed      | MEEM Group CIO view
  expected roles: tenant-admin | mapped: tenant-admin
manager        | yes | yes |      10 | yes |         2 | tenant_backed      | Hub operations manager
  expected roles: manager,hub-manager | mapped: manager,hub-manager
frontline      | yes | yes |      10 | yes |         2 | tenant_backed      | Dispatcher mobile
  expected roles: employee,dispatcher | mapped: employee,dispatcher
analyst        | yes | yes |      10 | yes |         2 | tenant_backed      | CyberCrow analyst console
  expected roles: analyst,security-analyst | mapped: analyst,security-analyst
tenant_admin   | yes | yes |      10 | yes |         1 | tenant_backed      | Tenant administrator workspace
  expected roles: tenant-admin | mapped: tenant-admin

All five personas tenant-backed.
```

| Persona | Profile | Layout | Widgets | Nav | Role maps | Materialization | Display name (DB) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| executive | yes | yes | 10 | yes | 1 | tenant_backed | MEEM Group CIO view |
| manager | yes | yes | 10 | yes | 2 | tenant_backed | Hub operations manager |
| frontline | yes | yes | 10 | yes | 2 | tenant_backed | Dispatcher mobile |
| analyst | yes | yes | 10 | yes | 2 | tenant_backed | CyberCrow analyst console |
| tenant_admin | yes | yes | 10 | yes | 1 | tenant_backed | Tenant administrator workspace |

**Persona matrix status (F5):** executive, manager, frontline, analyst, and tenant_admin are all **tenant-backed** on MEEM (matches table above; analyst/tenant_admin no longer depend on studio `recommended_fallback` after upgrade/seed).

## Seeding

- `npm run sarea:meem-upgrade` — ensures all five persona parent profiles + default layouts/widgets/nav/maps for `meem-global`
- `npx tsx prisma/seed-meem.ts` — full provision or idempotent persona ensure on existing MEEM
- `npm run sarea:meem-verify` — read-only matrix; run after upgrade to confirm acceptance (see section above)

## Explicit non-goals (F5)

- Stripe, billing gates, SCIM, Entra group sync
- Public redesign, new ERP modules
- Fake security/AI/telemetry
- Schema migrations (unless future phase requires)
- Destructive SOC, incident deletion, role remapping automation

## Acceptance commands

```powershell
cd D:\CYBERCROW
npm run typecheck
npm run lint
npm run build
npm run simulate:vercel-build:staging
npm run meem:ids:staging
npm run notifications:digest:meem:dry
npm run public:mirror-manifest
```

MEEM SAREA materialization and acceptance:

```powershell
npm run sarea:meem-upgrade
npm run sarea:meem-verify
```
