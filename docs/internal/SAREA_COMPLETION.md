# SAREA operational completion (Phase F3)

Last updated: 2026-05-25

## Scope

Experience studio under `/sarea/*`, runtime on `/{tenant}/dashboard`, and admin tenant control room **SAREA** tab. No schema changes in this phase.

## Studio routes

| Route | Data source | Mode |
| --- | --- | --- |
| `/sarea/overview` | `getSareaStudioSummary`, profiles, role map count | DB-backed |
| `/sarea/profiles` | `listSareaExperienceProfiles` | DB-backed, name edit |
| `/sarea/role-mapping` | `listRoleExperienceMaps` | DB-backed, role slug edit; layout/nav/widgets read-only chain notes |
| `/sarea/layouts` | Layout list | DB-backed |
| `/sarea/navigation` | Navigation profiles | DB-backed |
| `/sarea/widgets` | Widget rules | DB-backed |
| `/sarea/rules` | Adaptive UI rules | DB-backed |
| `/sarea/device-rules` | Device rules | DB-backed, advisory breakpoints |
| `/sarea/preview` | Summary + MEEM preview links | DB-backed + cookie preview (platform staff) |

## Runtime (tenant dashboard)

- `getSareaRuntimeContext` drives nav keys, widgets, compact flag
- Persona indicator in dashboard hero (`profileName`, `personaKey`)
- Preview cookie: `sarea_preview_persona` — values `executive` | `manager` | `frontline` (platform staff only)
- API: `/api/sarea/preview?persona=…&redirect=/{tenant}/dashboard`

## MEEM lighthouse

- Preview hub: `/sarea/preview` with links to `/meem-global/dashboard`
- `SareaAcceptanceHub` on overview/preview (Discovery → Blueprint → Preview)
- IDs: `npm run meem:ids:staging` — never hardcode tenant/request/blueprint IDs in docs or tests
- Admin tab: `/admin/tenants/{tenantId}?tab=sarea`

## RBAC vs SAREA (copy)

- RBAC: who can access modules and actions (CEM roles / permissions)
- SAREA: how the console is presented (layouts, navigation density, widgets)
- Documented on overview, preview, role-mapping, admin SAREA tab, and `CybercrowConnectionPanel`

## Personas

| Persona | Live preview cookie | Notes |
| --- | --- | --- |
| Executive | Yes | Trust-oriented widgets |
| Manager | Yes | Workflow / ops emphasis |
| Frontline | Yes | Compact task-first |
| Analyst | Studio mapping only | Map via `personaKey` on profile |
| Tenant admin | Studio mapping only | Map `tenant_admin` role slug |

## Connection to CyberCrow

- Tenant dashboard: `CybercrowConnectionPanel`, `cybercrow_posture` widget when visible
- Analysts: CyberCrow console for posture; executives: SAREA-adapted trust summary widgets

## Future work

- Preview cookie support for analyst / tenant_admin personas
- Full responsive enforcement for device rules (not only compact JSON)
- Unmapped-role detection vs CEM role catalog (automated gap report)
- In-studio editors for layout ↔ navigation ↔ widget linkage
