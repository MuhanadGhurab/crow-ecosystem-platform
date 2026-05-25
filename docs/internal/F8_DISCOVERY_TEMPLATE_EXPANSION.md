# F8 — Discovery template expansion & organic request E2E

**Date:** 25 May 2026  
**Prerequisites:** F7 public→discovery pipeline, F6 Rimal second tenant  
**Audience:** Internal delivery / engineering

---

## Part 1 — Audit

### 1.1 Legacy discovery template packs (JSON)

| Location | Industries | Role |
|----------|------------|------|
| `src/lib/discovery-templates/*.json` | logistics, retail, healthcare, **construction** (F8), **aviation** (F8) | Wizard “Apply template” seeds departments, roles, workflows, modules, security, experience |
| `src/lib/constants/industry-templates.ts` | Maps `DiscoveryIndustryKey` → JSON pack via `getDiscoveryTemplate()` | Used by discovery UI apply action |

**Pre-F8 gap (documented in F7):** Only logistics, retail, healthcare had JSON packs. Construction and aviation had org-intelligence models only — discovery “Apply template” returned null for those industries.

**Post-F8:** All five sector keys have JSON packs aligned with org-intelligence themes (not byte-identical; JSON is wizard seed, org-intel is recommendation engine).

### 1.2 Org intelligence sector templates (TypeScript)

| Location | Sectors |
|----------|---------|
| `src/lib/org-intelligence/sector-template-data.ts` | logistics, construction, aviation, healthcare, retail |
| `getSectorTemplateModel(key)` | Departments, positions, workflows, SAREA profiles, CyberCrow posture |
| `src/lib/org-intelligence/apply-plan-depth.ts` | Applies plan depth caps using `recommendedPriority` |

### 1.3 `sectorTemplateKey` flow

```
Public /request (industry field)
  → ImplementationRequest.industry
  → adminStartDiscovery / startDiscovery
      → discoveryAnswer org_intelligence / sectorTemplateKey
      → resolveSectorTemplateKey({ industry, moduleKeys })
  → org-intelligence run / organization model panel
      → OrgIntelligence.sectorTemplateKey persisted
```

**Resolver:** `src/lib/org-intelligence/resolve-sector.ts`  
**Default when ambiguous:** `retail` (F7 — avoids MEEM logistics bias).

### 1.4 Logistics assumptions (unchanged)

- MEEM lighthouse remains `logistics` sector + `meem-global` tenant.
- `resolveSectorTemplateKey` still maps logistics aliases and `logistics` module to logistics.
- F8 does not change MEEM constants or seed references.

### 1.5 How Rimal / aviation work today

| Path | Reference | Industry | Sector | Tenant | Notes |
|------|-----------|----------|--------|--------|-------|
| Rimal seed (F6) | `CROW-2026-RIMAL` | construction | construction | `rimal-construction` | Full chain; verify via `discovery:verify:rimal` |
| MEEM lighthouse | `CROW-2026-MEEM` | (logistics implied) | logistics | `meem-global` | Not aviation |
| Organic aviation | User-submitted | aviation | aviation | After blueprint provision | Requires JSON pack + org-intel (F8) |

**Aviation:** No dedicated lighthouse tenant in F8 — sector templates support discovery for new requests. Rimal proves construction isolation; MEEM proves logistics.

### 1.6 Org intelligence vs legacy JSON

| Concern | Legacy JSON | Org intelligence |
|---------|-------------|------------------|
| Trigger | User clicks “Apply template” in discovery wizard | Auto recommendations + growth plan narrative |
| Content | Flat lists (departments, roles, workflows, module keys) | Rich model (positions, SAREA personas, CyberCrow flags) |
| Construction / aviation | **Added in F8** | Already present; **expanded** in F8 (HSE, equipment, OCC, shift handover) |

Both should agree on **sector key**; they need not duplicate every department name.

---

## Part 2 — Template pack expansion (F8)

| Industry | JSON pack | Highlights |
|----------|-----------|------------|
| construction | `construction.json` | Projects, HSE, procurement, equipment; CyberCrow + SAREA in experience |
| aviation | `aviation.json` | Ops control, ground ops, MRO, safety/compliance, shift handover |
| logistics | `logistics.json` | (existing) fleet, warehouse, dispatch |
| healthcare | `healthcare.json` | (existing) clinical ops, compliance |
| retail | `retail.json` | (existing) stores, merchandising |

---

## Part 3 — Org intelligence alignment (F8)

Construction and aviation models gained:

- `recommendedPriority` on departments (consistent with logistics)
- Equipment / HSE / CyberCrow analyst (construction)
- Duty manager, ramp supervisor, shift handover workflow, extra SAREA profiles (aviation)

Plan-depth and catalog labels unchanged in behavior; five keys remain in `SECTOR_TEMPLATE_KEYS`.

---

## Part 4 — E2E scripts (staging, read-only)

| Command | DB | Purpose |
|---------|-----|---------|
| `npm run request:e2e:dry` | No | All five JSON packs + org-intel models + reference format + retail default |
| `npm run request:e2e:verify` | Optional | Dry checks + chain verify with `--reference=CROW-YYYY-XXXXXX` |
| `npm run request:e2e:organic` | Same as verify | Alias for organic reference checks |

**Existing regression (unchanged):**

- `npm run request:pipeline:verify` — MEEM + Rimal seeded chains
- `npm run discovery:verify:meem` / `discovery:verify:rimal`

**Prisma pattern:** `npx tsx --env-file=.env.staging` + `createScriptPrisma()`.

---

## Part 5 — Manual checklist

See [`F8_ORGANIC_REQUEST_E2E.md`](F8_ORGANIC_REQUEST_E2E.md) — 18-step browser path from `/request` through admin, discovery, blueprint.

---

## Part 6–7 — UX (minor)

- Public form: industry hint (construction/aviation), success “what happens next”, reference code panel (existing).
- Admin list: industry label on queue cards; detail uses `industryLabel()`.

---

## Part 8 — Blueprint / provision bridge

| Step | Automated in F8? | Notes |
|------|------------------|-------|
| Public submit | Yes (existing API) | `CROW-{year}-{6char}` reference |
| Admin PENDING_REVIEW | Manual | Platform staff |
| Start discovery | Manual CTA | `adminStartDiscovery` → `UNDER_DISCOVERY` |
| Discovery wizard + org intel | Manual + templates | Sector seeded at start (F7) |
| Complete discovery → blueprint | Existing `pipeline.service` | Not modified in F8 |
| Tenant provision / go-live | Manual / separate seeds | MEEM/Rimal use dedicated seeds; organic tenants need provision workflow |

**Honest gap:** F8 does not add a one-click “provision tenant from organic request” script. Use admin discovery completion then existing blueprint/provision paths documented in F6/F7.

---

## Part 9 — Regression gate

```bash
npm run typecheck
npm run lint
npm run build
npm run simulate:vercel-build:staging
npm run public:mirror-manifest
npm run meem:ids:staging
npm run sarea:meem-verify
npm run tenant:verify:rimal
npm run request:pipeline:verify
npm run request:e2e:dry
```

Record results in deployment notes or agent session; optional `F8_DEPLOYMENT_CHECKPOINT.md` if needed.

---

## Part 10 — Acceptance (F8)

| # | Criterion | Evidence |
|---|-----------|----------|
| 1 | Audit documented (legacy vs org-intel, sector flow) | This doc § Part 1 |
| 2 | Construction + aviation JSON discovery packs | `construction.json`, `aviation.json` |
| 3 | Logistics, healthcare, retail packs retained | Existing JSON |
| 4 | Org-intelligence aligned for five sectors | `sector-template-data.ts` F8 deltas |
| 5 | Neutral sector default retail | `resolve-sector.ts` + e2e dry |
| 6 | MEEM + Rimal regression preserved | `request:pipeline:verify` |
| 7 | Organic E2E scripts (dry + optional reference) | `request:e2e:*` |
| 8 | 18-step manual organic checklist | `F8_ORGANIC_REQUEST_E2E.md` |
| 9 | Minor public + admin UX only | Form + admin list/detail |
| 10 | Blueprint bridge documented | § Part 8 |
| 11 | No forbidden scope (redesign, Stripe, SCIM, schema) | Scope guard |
| 12 | typecheck / lint / build / staging verify | § Part 9 |

---

## Remaining gaps (post-F8)

1. **`NEEDS_INFO` request status** — still not in schema (F7/F8 out of scope).
2. **Automated browser E2E** — manual checklist only.
3. **Dedicated aviation lighthouse tenant** — not required for F8 acceptance.
4. **Organic tenant auto-provision** — manual after blueprint.

---

*F8 completes template coverage for all public industry options and documents the organic pipeline end-to-end.*
