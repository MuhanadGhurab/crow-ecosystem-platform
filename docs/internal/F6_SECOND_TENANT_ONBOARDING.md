# F6 — Second tenant onboarding hardening (Rimal Construction)

**Last updated:** 25 May 2026  
**Synthetic tenant:** Rimal Construction · slug `rimal-construction` · sector `construction`  
**Lighthouse (unchanged):** MEEM Holding Logistics · slug `meem-global`

---

## 1. Executive summary

Phase F6 validates that the Crow onboarding pipeline is **repeatable for a non-logistics sector** without breaking MEEM. Work delivered:

- Lifecycle audit (MEEM-specific vs reusable vs hardcoded)
- Idempotent staging scripts: `tenant:seed:rimal`, `tenant:seed:rimal:dry`, `tenant:verify:rimal`
- Construction sector path through discovery → org intelligence → blueprint → provisioning → CEM / CyberCrow / SAREA
- Service-level isolation checks (tenantId / slug), not UI-only
- MEEM regression path unchanged (`sarea:meem-verify`)

**No** public site redesign, Stripe, SCIM, Entra sync, new ERP modules, or fake telemetry were introduced.

---

## 2. Audit scope

| In scope | Out of scope |
|----------|----------------|
| Public request → admin → discovery → org intel → blueprint → pricing → provision → engines → dashboard | Stripe live billing |
| Second synthetic tenant (`rimal-construction`) | SCIM / Entra group sync |
| Staging scripts + verify | Customer one-off flows |
| Admin multi-tenant visibility | MEEM UI hub components refactor |

---

## 3. Lifecycle map (platform pipeline)

| Step | Primary services / routes | Status for F6 |
|------|---------------------------|---------------|
| Public request | `/request`, `implementation-request.service` | Reusable |
| Admin review | `/admin/requests`, status transitions | Reusable |
| Discovery | `/discovery/[id]/*`, `discovery.service`, `startDiscovery` | Reusable |
| Org intelligence | `org-intelligence.service`, sector templates DB + `sector-template-data.ts` | Reusable — **construction template exists** |
| Blueprint | `completeDiscoveryAndCreateBlueprint`, `/blueprints/[id]` | Reusable |
| Pricing | `commercial.service`, discovery answers | Reusable |
| Provisioning | `provisionAndInitializeTenant` in `pipeline.service` | Reusable |
| CEM seed | `tenant-cem-seed.service` | Reusable |
| CyberCrow | `cybercrow-seed.service`, baseline + evidence | Reusable |
| SAREA | `initializeSarea`, `ensureTenantSareaPersonas` | Reusable (5 personas) |
| Go-live / dashboard | `/[tenant]/dashboard` | Reusable |

---

## 4. MEEM-specific inventory

| Area | MEEM-specific | Notes |
|------|---------------|-------|
| `prisma/seed-meem.ts` | Yes | Reference `CROW-2026-MEEM`, logistics discovery copy, `enrichMeemGlobalOps` |
| `src/lib/constants/meem.ts` | Yes | Slug, modules, mock IDs |
| `upgradeLogisticsSareaForTenant` | Yes | Logistics widgets/nav — **not** called for Rimal |
| `meem-ops.service`, `meem-*-hub` UI | Yes | ERP hubs when slug = meem-global or logistics industry |
| `lighthouse-pipeline.service` | Yes | Snapshot tied to `MEEM_REFERENCE_CODE` (admin lighthouse card) |
| `seedLogisticsAuditSamples` | MEEM-biased trigger | Runs when `logistics` module enabled |
| Notifications digest filter | Convenience | MEEM quick filter on admin notifications — not blocking |

---

## 5. Reusable patterns (second tenant)

| Pattern | Location |
|---------|----------|
| Slug-based tenant lookup | All services filter by `tenantId` from session or slug param |
| Generic onboard CLI | `scripts/onboard-tenant-from-blueprint.ts` (pre-F6) |
| Sector templates | `prisma/seed-sector-templates.ts`, `org-intelligence/sector-template-data.ts` |
| Pipeline provision | `provisionAndInitializeTenant` |
| SAREA materialization | `ensureTenantSareaPersonas` + `sarea-seed-core` |
| Script Prisma | `src/lib/prisma-script.ts` (no `server-only`) |
| Tenant ops enrich | `enrichTenantFromBlueprint` (module-gated samples) |

---

## 6. Hardcoded / coupling gaps

| Gap | Risk | F6 mitigation |
|-----|------|----------------|
| `getLighthousePipelineSnapshot()` → MEEM ref only | Admin “lighthouse” card is MEEM-only | Documented; `/admin/tenants` lists all tenants |
| `LOGISTICS_OPS_MODULE_KEYS` auto-enriches ops on provision | Non-logistics tenants skip ops unless explicit | Rimal seed calls `enrichTenantFromBlueprint` explicitly |
| ERP sample data from `industry-packs/logistics.ts` only | Construction label but logistics-shaped samples | Acceptable for staging; no logistics **module** on Rimal |
| `showMeemErpHub` / Meem* hub components | Logistics copy on tenant routes if industry=logistics | Rimal uses `construction` industry — generic ERP pages |
| `PLATFORM_LIVE_TENANT_SLUG` default `meem-global` | Marketing/engine hub default | Env override; not tenant isolation issue |

---

## 7. Generalization applied in F6

- Added `src/lib/constants/rimal.ts` — slug/reference/modules (no DB ids)
- Added `prisma/seed-rimal.ts` — full pipeline mirror without MEEM ops/SAREA logistics upgrade
- Added `scripts/verify-rimal-tenant.ts` — sector, modules, SAREA, CyberCrow, CEM, MEEM isolation
- Construction org intelligence: `acceptOrgIntelligenceIntoDiscovery` with `sectorTemplateKey: construction`

**Not generalized (deferred):** lighthouse snapshot for arbitrary tenant; construction-specific ERP industry pack; admin notification filters.

---

## 8. Scripts

| Script | Command | Behavior |
|--------|---------|----------|
| Seed | `npm run tenant:seed:rimal` | Idempotent; `.env.staging` via `run-with-script-prisma.mjs`; logs ids |
| Dry run | `npm run tenant:seed:rimal:dry` | Prints planned actions only |
| Verify | `npm run tenant:verify:rimal` | Read-only; exit 1 on failure |
| Reset | — | **Not shipped** — destructive deletes excluded per F6 constraints |

**Prerequisites:** `npm run db:seed`, `npm run db:seed:sectors`

---

## 9. Discovery & org intelligence (Rimal)

- Industry: `construction` on implementation request + organization
- Sector template: `construction` (departments: Projects, Engineering, Procurement, Safety, etc.)
- Branches: Riyadh HQ, NEOM Site Yard
- Experience requirements: all five SAREA personas documented in discovery
- Security packages: `crow_shield`, `crow_sentinel`

---

## 10. Blueprint & provisioning (Rimal)

- Modules: `sales`, `finance`, `procurement`, `hr`, `tasks`, `reports`, `crm` — **no** `logistics` / `warehouse` / `inventory`
- Plan: `growth`
- Provisioning: `provisionAndInitializeTenant` with `SAREA_DEFAULT_PERSONA_KEYS`
- Post-provision: `ensureTenantSareaPersonas`, `enrichTenantFromBlueprint({ industryPack: "construction" })`
- Blueprint status: `APPROVED` / client approved (staging)

---

## 11. Isolation (service level)

Verification checks (see `scripts/verify-rimal-tenant.ts`):

- All `SareaExperienceProfile`, `CybercrowAuditLog`, `Department`, `Role`, `Incident` rows scoped by `tenantId`
- Rimal must not enable `logistics` module when MEEM does
- No “Rimal” strings on MEEM SAREA profile names
- MEEM `sarea:meem-verify` remains independent regression gate

**Tenant IDs are never hardcoded in scripts** — only slugs `rimal-construction` and `meem-global`.

---

## 12. Admin surfaces

| Route | Multi-tenant |
|-------|----------------|
| `/admin/overview` | Yes — `liveTenantCount`, CEM snapshot |
| `/admin/tenants` | Yes — `listTenantsWithHealth` |
| `/admin/tenants/[id]` | Yes — org intel sector, SAREA materialization panel, lifecycle card per tenant |

MEEM-only: lighthouse pipeline card on overview (by design).

---

## 13. CyberCrow & SAREA (Rimal routes)

| Route | Expectation |
|-------|-------------|
| `/rimal-construction/cybercrow/dashboard` | Baseline metrics or honest empty |
| `/rimal-construction/cybercrow/incidents` | Tenant-scoped incidents |
| `/rimal-construction/cybercrow/security-events` | Review actions |
| `/rimal-construction/cybercrow/identity` | Telemetry summary or empty |
| `/rimal-construction/sarea/*` | Five personas tenant-backed after seed |

No `upgradeLogisticsSareaForTenant` on Rimal — avoids MEEM logistics nav/widgets.

---

## 14. Validation commands (F6 gate)

Run from `D:\CYBERCROW` (PowerShell):

```powershell
npm run typecheck
npm run lint
npm run build
npm run simulate:vercel-build:staging
npm run public:mirror-manifest
npm run meem:ids:staging
npm run notifications:digest:meem:dry
npm run tenant:seed:rimal:dry
npm run tenant:seed:rimal
npm run tenant:verify:rimal
npm run sarea:meem-verify
```

**25 May 2026 run (PowerShell, staging DB):**

| Command | Result |
|---------|--------|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm run build` | Pass |
| `npm run simulate:vercel-build:staging` | Pass |
| `npm run public:mirror-manifest` | Pass |
| `npm run meem:ids:staging` | Pass (MEEM ref `CROW-2026-MEEM`, GO_LIVE) |
| `npm run notifications:digest:meem:dry` | Pass |
| `npm run tenant:seed:rimal:dry` | Pass |
| `npm run tenant:seed:rimal` | Pass — tenant `cmpldkfir0034vho0lnpvyg78`, ref `CROW-2026-RIMAL` |
| `npm run tenant:verify:rimal` | **PASSED** |
| `npm run sarea:meem-verify` | Pass — all five personas tenant-backed |

**Script infra:** `scripts/run-with-script-prisma.mjs` sets `CYBERCROW_SCRIPT_PRISMA=1` so pipeline services load without `server-only` throw in tsx (`src/lib/server-only-guard.ts`).

---

## 15. Acceptance matrix

| Criterion | Target | Result |
|-----------|--------|--------|
| Second tenant repeatable | `tenant:seed:rimal` idempotent | **Pass** (re-run path in seed) |
| Non-MEEM sector | `construction` template | **Pass** |
| Discovery / blueprint / provision | Full pipeline | **Pass** |
| CEM + CyberCrow + SAREA | Shells + personas | **Pass** (5/5 tenant-backed; 1 audit log; 8 depts / 5 roles) |
| MEEM unaffected | `sarea:meem-verify` pass | **Pass** |
| Isolation | `tenant:verify:rimal` pass | **Pass** |
| Builds pass | typecheck/lint/build/simulate | **Pass** |

---

## 16. Gaps & next steps

| Gap | Priority |
|-----|----------|
| Construction ERP industry pack (samples beyond logistics-shaped helpers) | P2 |
| Lighthouse pipeline card for non-MEEM reference codes | P2 |
| `tenant:reset:rimal` with soft-delete policy | P3 — only if product approves |
| Live browser smoke on `/rimal-construction/*` | P2 — manual or Playwright |
| E2E second-customer checklist in `PRODUCTION_READINESS.md` | P2 |

---

*F6 complements F5 (MEEM SAREA/CyberCrow validation) and RC1 (staging health).*
