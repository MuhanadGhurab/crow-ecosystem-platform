# SAREA operational completion (Phase F4 + F5)

Last updated: 2026-05-25

## Scope

Experience studio under `/sarea/*`, five-persona preview catalog, runtime on `/{tenant}/dashboard`, and admin tenant **SAREA** tab. No schema changes in F4/F5.

## Phase F5 (materialization + validation)

- **Services:** `sarea-seed.service.ts` (`ensureTenantSareaPersonas`, all five `SAREA_DEFAULT_PERSONA_KEYS`), `sarea-materialization.service.ts` (`getTenantPersonaMaterialization`)
- **Provisioning:** `provisionAndInitializeTenant` seeds all five personas by default
- **MEEM:** `seed-meem.ts` idempotent re-run ensures analyst + tenant_admin; discovery requirements added for analyst/admin
- **UI:** `/sarea/role-mapping`, `/sarea/preview`, admin tenant **SAREA** tab — materialization panel (tenant-backed / partial / not materialized / recommended fallback)
- **Dashboard preview banner:** Shows tenant-backed vs recommended fallback
- **Matrix:** `docs/internal/F5_CYBERCROW_SAREA_VALIDATION.md`
- **CLI:** `npm run sarea:meem-upgrade`

### F5 non-goals

Same as F4: no RBAC changes from SAREA, no destructive remapping, no preview granting access.

## Personas (F4)

| Persona | Preview cookie | Studio `personaKey` | Notes |
| --- | --- | --- | --- |
| Executive | Yes | `executive` | Trust-oriented widgets |
| Manager / Operations Manager | Yes | `manager` | Workflow / ops emphasis |
| Frontline | Yes | `frontline` | Compact task-first |
| CyberCrow Analyst | Yes (platform staff) | `analyst` | Security widgets; fallback if no profile |
| Tenant Admin | Yes (platform staff) | `tenant_admin` | CEM density; recommended mapping label |

Definitions: `src/lib/constants/sarea-personas.ts`  
API/cookie keys: `SAREA_PREVIEW_PERSONA_KEYS`

## Studio routes

| Route | Mode |
| --- | --- |
| `/sarea/preview` | Five persona cards + MEEM live preview links + RBAC vs SAREA callout |
| `/sarea/role-mapping` | Suggested slugs include `analyst`, `tenant_admin` |
| `/sarea/overview` | Unchanged DB-backed studio summary |

## Runtime (tenant dashboard)

- `getSareaRuntimeContext` — `previewRecommended: true` when analyst/tenant_admin use fallback profile
- MEEM dashboard: quick-switch links for all five persona keys (platform staff)
- Preview: `/api/sarea/preview?persona=…&redirect=/{tenant}/dashboard`

## Admin tenant tab

- **SAREA** tab copy references all five personas and analyst/admin as recommended mappings

## RBAC vs SAREA

- RBAC: permissions and module access (CEM)
- SAREA: presentation only (layouts, nav, widgets)
- Documented on preview hub, role-mapping, admin tab, connection panels

## Connection to CyberCrow

- Analysts: CyberCrow console for posture and workflows
- Tenant admins: users/roles/plan in CEM + CyberCrow monitoring
- Executives/managers: SAREA-adapted trust summaries

## Explicit non-goals (F4)

- Preview does not grant permissions
- No Entra group sync or live IdP-driven persona assignment

## Future work

- Role map automation from CEM provisioning (still manual studio today)
- Non-MEEM tenants: run `sarea:backfill-seed` or pipeline provision for all five personas
