# F9 — Blueprint generation & go-live bridge hardening

**Date:** 25 May 2026  
**Scope:** Discovery → blueprint → readiness → go-live → tenant provision (advisory gates, idempotent blueprint, admin UX, verify script).  
**Out of scope:** Public redesign, Stripe enforcement, SCIM/Entra, new ERP modules, fake AI/telemetry, schema changes, destructive resets, auto production provision.

---

## PART 1 — Audit (blueprint generation flow)

### Entry points

| Step | Service / route | Behavior |
|------|-----------------|----------|
| Admin **Start discovery** | `startDiscovery()` in `pipeline.service.ts` | `UNDER_DISCOVERY`, upsert `discovery_profile`, seed `sectorTemplateKey` answer from `resolveSectorTemplateKey(industry, modules)` |
| Discovery wizard | `discovery/[requestId]/*` pages, `discovery.service.ts` | Sections, org model, modules, security, experience |
| **Complete discovery** | `completeDiscovery()` action → `completeDiscoveryAndCreateBlueprint()` | Marks discovery `COMPLETED`, upserts `enterprise_blueprint` on `requestId` (unique), syncs `blueprint_module`, `syncBlueprintOrgModelFromDiscovery`, pricing refresh |
| Blueprint workspace | `blueprint/[blueprintId]/*` | Overview, CEM/CyberCrow/SAREA copy, pricing, identity, integrations, readiness, go-live |
| **Go live** | `provisionBlueprintTenant` action → `provisionTenantFromBlueprint()` | Org + tenant (unique slug), CEM seed, CyberCrow baseline, SAREA personas, subscription row |
| Readiness | `readiness.service.ts` | Grouped checks (CEM structure, CyberCrow, SAREA); optional `GO_LIVE_READINESS_GATE` env hard block |

### Inputs preserved into blueprint

- **Modules:** `getConfirmedModuleKeys(request modules, discovery answers)` → `blueprint_module` replace-all sync (idempotent content, not duplicate blueprints).
- **Sector / org intel:** `syncBlueprintOrgModelFromDiscovery` after completion; sector from discovery answer + org intelligence record.
- **Plan context:** `requestedPlans` on request; `resolveBlueprintPlanContext(blueprintId)` at readiness/go-live (advisory).
- **CEM/CyberCrow/SAREA copy:** Blueprint pages read discovery + blueprint modules; provision seeds from discovery profile.

### Incomplete discovery / org intel not accepted

- Discovery can complete while org intelligence is `DRAFT` — warnings only (F9 gate).
- Go-live readiness can fail if discovery status ≠ `COMPLETED` (existing grouped readiness).
- Best practice: accept org model before provision (documented on gate + go-live checklist).

### Blueprint already exists

- Prisma: `enterpriseBlueprint.requestId` is **unique** — second completion **updates** same row (F9: preserve non-DRAFT status if approved).
- UI: gate status `blueprint_exists`; complete button explains refresh behavior.

### MEEM / Rimal assumptions

- Lighthouse tenants `meem-global` and `rimal-construction` use seeded references; organic verify script rejects blueprint→MEEM tenant for non-MEEM references.
- No hardcoded IDs in F9 code paths; constants in `src/lib/constants/meem.ts` and `rimal.ts` for verify only.
- Re-provision: go-live page shows “already live”; action layer rejects duplicate blueprint→tenant link.

### Manual steps today

1. Public `/request` or admin-created request  
2. Admin **Start discovery**  
3. Discovery wizard + optional template apply + org intel accept  
4. Discovery **summary** → complete discovery  
5. Blueprint review (pricing, readiness)  
6. Go-live form (slug + plan) — explicit admin action  

### Duplicate / risk notes (mitigated in F9)

| Risk | Mitigation |
|------|------------|
| Duplicate blueprint per request | Unique `requestId` on `enterprise_blueprint` |
| Duplicate tenant per blueprint | Check `tenant.blueprintId` before provision; UI redirect if tenant exists |
| Duplicate slug | `ensureUniqueTenantSlug` in action layer + DB unique on `tenant.slug` + F9 pre-check in `provisionTenantFromBlueprint` |
| Re-send blueprint_ready email | Notify only when `priorBlueprint` was null |
| Downgrade APPROVED blueprint to DRAFT | F9 preserve status when already approved |

---

## PART 2 — Discovery completion gate

**Module:** `src/lib/services/discovery-completion-gate.service.ts`  
**UI:** `DiscoveryBlueprintGatePanel` on discovery summary; mirrored on blueprint readiness.

Statuses: `ready` | `needs_review` | `missing_data` | `blueprint_exists`.

Checks: request status, sector template, modules, plan (warning), org intelligence (warning), departments/roles/workflows, security package (warning).

**Policy:** Advisory — `completeDiscovery` does **not** hard-block on gate (existing pipeline behavior retained).

---

## PART 3 — Blueprint generation hardening

Changes in `completeDiscoveryAndCreateBlueprint`:

- Include existing blueprint before upsert; preserve status when already approved/non-draft.
- Do not reset `discoveryProfile.completedAt` if already set.
- Do not regress request status if already past `BLUEPRINT_BUILD`.
- Idempotent module sync (deleteMany + createMany).
- `blueprint_ready` notification only on first blueprint creation.

---

## PART 4 — Readiness UI

- Existing grouped readiness (modules, structure, RBAC, workflows, CyberCrow, SAREA, integrations).
- F9: discovery blueprint gate panel + link to discovery summary on readiness page.
- Subscription remains advisory via `GoLiveSubscriptionSection` / plan diff (unchanged).

---

## PART 5 — Go-live bridge

- **Provision scope** card: org name, suggested slug, industry/sector, enabled modules, plan (advisory), discovery gate warnings.
- **Pre-provision checklist** (static bullets) + link to discovery summary.
- Existing readiness link, subscription section, provision form with blockers/warnings.
- **Already live** path unchanged for provisioned blueprints.

---

## PART 6 — `request:e2e:verify` extensions

Optional flags (read-only):

- `--expect-blueprint`
- `--expect-tenant`
- `--expect-sector=<key>`
- `--expect-plan=<planKey>`

Additional checks: blueprint `requestId` match, tenant slug uniqueness count, sector/plan expectations.

---

## PART 7 — Second organic path

**Script-ready (construction sector example):**

```bash
# After browser steps 1–14 on /request with industry Construction:
npm run request:e2e:verify -- --reference=CROW-2026-XXXXXX \
  --expect-blueprint --expect-sector=construction --expect-plan=startup
# After go-live on staging (optional):
npm run request:e2e:verify -- --reference=CROW-2026-XXXXXX \
  --expect-blueprint --expect-tenant --expect-sector=construction
```

Full 18-step browser checklist: [`F8_ORGANIC_REQUEST_E2E.md`](F8_ORGANIC_REQUEST_E2E.md) (steps 15–16 = blueprint bridge).

**Manual browser test:** Not run in this F9 implementation pass — rely on scripts + staging smoke per PART 10.

---

## PART 8 — Admin request UX

`RequestPipelineLinks` on admin request detail: discovery, blueprint, readiness, go-live, tenant, **next action** hint. No layout redesign.

---

## PART 9 — Provisioning safety audit

| Control | Location |
|---------|----------|
| Link existing tenant (no re-provision) | `provisionBlueprintTenant` action + go-live UI |
| No second tenant for same blueprint | `provisionTenantFromBlueprint` throws if `tenant.blueprintId` set |
| Slug collision | `provisionTenantFromBlueprint` pre-check + `ensureUniqueTenantSlug` |
| Plan on tenant | `ensureTenantSubscriptionForPlan` in provision transaction |
| Idempotent CyberCrow/SAREA seeds | `seedCybercrowBaseline`, `seedSareaProfileDefaults` (existing services) |
| MEEM logistics audit samples | Only when logistics-related modules enabled (unchanged) |

---

## PART 10 — Regression commands

Run after F9 merge (staging DB / env as documented in RC1):

```bash
npm run meem:ids:staging
npm run sarea:meem-verify
npm run tenant:verify:rimal
npm run request:pipeline:verify
npm run request:e2e:dry
npm run notifications:digest:meem:dry
npm run public:mirror-manifest
npm run typecheck
npm run lint
npm run build
npm run simulate:vercel-build:staging
```

**Acceptance execution (25 May 2026):** All commands above exited **0**. Decision **PASSED WITH WARNINGS** — lighthouse refs use dedicated pipeline scripts (not `request:e2e:verify --reference=CROW-2026-MEEM`); browser organic checklist pending. Full table: [`F9_DEPLOYMENT_CHECKPOINT.md`](F9_DEPLOYMENT_CHECKPOINT.md).

---

## Acceptance (13 criteria)

| # | Criterion | Status |
|---|-----------|--------|
| 1 | F9 audit documented in this file | Done |
| 2 | Advisory discovery→blueprint gate with 4 statuses | Done |
| 3 | Blueprint upsert idempotent; no duplicate rows per request | Done |
| 4 | Readiness shows discovery completeness / gate | Done |
| 5 | Go-live shows provision scope + checklist + warnings | Done |
| 6 | `request:e2e:verify` optional expect flags | Done |
| 7 | Second organic path documented (script + F8 link) | Done |
| 8 | Admin request pipeline links + next action | Done |
| 9 | Provision safety: no duplicate blueprint tenant / slug checks | Done |
| 10 | MEEM/Rimal paths not altered; verify guards retained | Done |
| 11 | No Prisma schema migration | Done |
| 12 | Regression script list recorded (execution: operator) | Executed 25 May 2026 — [`F9_DEPLOYMENT_CHECKPOINT.md`](F9_DEPLOYMENT_CHECKPOINT.md) |
| 13 | `PROJECT_STATUS.md` + `MILESTONES.md` updated | Done |

---

*Prior phases: [`F8_ORGANIC_REQUEST_E2E.md`](F8_ORGANIC_REQUEST_E2E.md) · [`F7_PUBLIC_DISCOVERY_PIPELINE.md`](F7_PUBLIC_DISCOVERY_PIPELINE.md)*
