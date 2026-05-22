# Go-live provisioning pipeline

**Purpose:** Map the **real** Prisma-backed provision flow to product language. No frontend-only fake provision.

**Owner:** Muhanad (platform / pipeline).  
**Code:** `src/lib/services/pipeline.service.ts`, `src/lib/actions/blueprint.ts`, `src/lib/services/readiness.service.ts`

**UI:** `/blueprints/:id/readiness` → `/blueprints/:id/go-live`

---

## User story (operator)

1. Platform staff completes discovery and blueprint commercial approval.
2. Staff opens **Readiness** — grouped checks must pass (modules, org, RBAC, workflows, CyberCrow, SAREA, integrations).
3. Staff opens **Go-live**, confirms tenant slug (e.g. `meem-global`), submits **Approve blueprint & go live**.
4. System runs **one orchestrated provision** (Postgres transaction + follow-up seeds).
5. Request status advances through provisioning lifecycle; tenant is **LIVE** at `/{slug}/dashboard`.

---

## Pipeline steps (code order)

| Step | Product label | Function / transaction | DB / side effects |
|------|---------------|------------------------|-------------------|
| 0 | Readiness validation | `evaluateGroupedBlueprintReadiness` → `assertBlueprintReadyForProvision` (if `GO_LIVE_READINESS_GATE=true`) | Reads blueprint + discovery; UI always blocks CTA on blockers |
| 1 | Approve blueprint | `provisionTenantFromBlueprint` (inside `provisionAndInitializeTenant`) | `EnterpriseBlueprint.status` → `APPROVED`, `approvedAt` set |
| 2 | Create organization | same transaction | `Organization` row (legal/display name) |
| 3 | Create tenant | same transaction | `Tenant` slug, `planKey`, `blueprintId`, enabled `TenantModule` rows from `BlueprintModule` |
| 4 | Lifecycle: provisioning | same transaction | `ImplementationRequest.status` → `TENANT_PROVISIONING` |
| 5 | Seed CEM structure | `seedTenantCemFromDiscovery(tenantId, discoveryProfileId)` | Departments, branches, roles, workflows, profiles from discovery |
| 6 | Initialize CyberCrow | `initializeCyberCrow(tenantId)` | `seedCybercrowBaseline`, audit log `CYBERCROW_INITIALIZED`, status → `SECURITY_INIT` |
| 7 | Initialize SAREA | `initializeSarea(tenantId, personaKeys)` | Default personas `executive`, `manager`, `frontline` + `seedSareaProfileDefaults`, status → `SAREA_INIT` |
| 8 | Go live | `provisionAndInitializeTenant` tail | `ImplementationRequest.status` → `GO_LIVE`, optional `tenant_provisioned` email |
| 9 | Redirect | `provisionBlueprintTenant` action | `redirect(/:slug/dashboard)` |

All tenant rows are scoped by `tenantId` — **tenant isolation** is enforced at creation time.

---

## Readiness groups (pre-provision)

Evaluated in `readiness.service.ts` → `evaluateGroupedBlueprintReadiness`:

| Group | Validates |
|-------|-----------|
| **CEM modules** | ≥1 enabled `BlueprintModule` |
| **Organization structure** | Discovery departments (branches recommended) |
| **RBAC & roles** | Discovery or blueprint roles |
| **Workflows** | Discovery / blueprint / tenant workflows |
| **CyberCrow baseline** | Security package on request; post-provision: `CYBERCROW_INITIALIZED` |
| **SAREA mappings** | Experience requirements or blueprint SAREA profiles |
| **Integrations** | Recorded in discovery (recommended) |
| **Platform operations** | Infra env, optional smoke/support sign-offs |

---

## Environment flags

| Variable | Effect |
|----------|--------|
| `GO_LIVE_READINESS_GATE=true` | Server action throws if readiness blockers remain |
| `GO_LIVE_READINESS_STRICT=true` | Also requires manual performance/support sign-offs |

UI disables provision when `evaluatePreProvisionReadiness` returns blockers **regardless** of gate flag.

---

## MEEM lighthouse

Pre-seeded tenant: `meem-global` via `prisma/seed-meem.ts` (simulates full pipeline). For a **clean** go-live demo, use a **new slug** from the live blueprint or reset DB.

**Live IDs:** see [`customers/MEEM_GLOBAL.md`](customers/MEEM_GLOBAL.md).

---

## What go-live does *not* do

| Not automatic | Owner / phase |
|---------------|----------------|
| Supabase users for every employee | `auth:grant-tenant`, Entra invites |
| Stripe subscription | Phase 10 |
| Production Vercel deploy | Phase Cloud |
| SAREA persona acceptance | **MEEM (Omar)** — Phase 7 / M5 ([`SAREA_OMAR_SCOPE.md`](SAREA_OMAR_SCOPE.md)) |

---

## Related files

| File | Role |
|------|------|
| `src/lib/actions/blueprint.ts` | `provisionBlueprintTenant` server action |
| `src/components/blueprint/blueprint-provision-form.tsx` | Go-live form, blocker display |
| `src/lib/constants/readiness-groups.ts` | Group metadata |
| `src/lib/constants/go-live-checklist.ts` | Post-provision checklist keys |
| `docs/TEAM_OWNERSHIP.md` | Muhanad vs MEEM (Omar) |
| `docs/MILESTONES.md` | M1–M8 delivery map |

---

*Golden rule: Discovery understands · Blueprint defines · CEM runs · CyberCrow protects · SAREA adapts.*
