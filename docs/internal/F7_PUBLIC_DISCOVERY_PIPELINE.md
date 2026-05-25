# F7 — Public request → Discovery pipeline hardening

**Date:** 25 May 2026  
**Prerequisites:** RC1 staging validation, F5 deployment checkpoint, F6 second-tenant (Rimal)  
**Audience:** Internal delivery / engineering

---

## Objective

Harden the reusable path from **public implementation request** through **admin review** into **Discovery** (profile, organizational intelligence, sector templates) and **blueprint handoff** — without public redesign, billing gates, or schema changes.

---

## Part 1 — Pipeline audit (end-to-end)

### 1. Public request form / API

| Step | Location | Notes |
|------|----------|--------|
| UI | `/request` → `ImplementationRequestForm` | 5-step wizard; industry from `DISCOVERY_INDUSTRY_OPTIONS` |
| API | `POST /api/implementation-requests` | Rate limit, honeypot, Turnstile, Zod (`public-intake-schema.ts`) |
| Fallback | `submitImplementationRequest` server action | Same validation path when API unreachable |

**Gaps found (F7):** Generic client error copy; no pre-submit Zod mirror. **Fixed:** `validatePublicIntakeClient`, `intakeHttpErrorMessage`, surfaced API validation/rate-limit messages.

### 2. Request persistence

| Step | Location | Notes |
|------|----------|--------|
| Service | `implementation-request.service.ts` | Creates `ImplementationRequest` with `PENDING_REVIEW` |
| Reference | `generateImplementationReferenceCode()` | `CROW-{year}-{6-char}` — shared helper (was inline) |

**Gaps:** Reference generator not centralized. **Fixed:** `src/lib/pipeline/reference-code.ts`.

### 3. Admin review

| Step | Location | Notes |
|------|----------|--------|
| List/detail | `/admin/requests`, `/admin/requests/[requestId]` | Platform staff only |
| Actions | `admin-pipeline.ts` | `adminStartDiscovery` / `adminRejectRequest` from `PENDING_REVIEW` only |
| UI | `request-admin-actions.tsx` | Start discovery → redirect to discovery org step |

**Gaps:** No `NEEDS_INFO` status in Prisma enum (out of F7 scope — document only). Reject requires `PENDING_REVIEW` (correct).

### 4. Discovery bootstrap

| Step | Location | Notes |
|------|----------|--------|
| Transition | `pipeline.service.ts` `startDiscovery` | `PENDING_REVIEW` → `UNDER_DISCOVERY`; upsert `DiscoveryProfile` |
| Sector seed | `startDiscovery` (F7) | Upserts `discoveryAnswer` `org_intelligence` / `sectorTemplateKey` from `resolveSectorTemplateKey` |
| Wizard | `/discovery/[requestId]/*` | Org model, departments, modules, etc. |

**Gaps:** Sector template answer not seeded at discovery start (relied on later org-intel run). **Fixed:** bootstrap answer on `startDiscovery`.

### 5. Organizational intelligence

| Step | Location | Notes |
|------|----------|--------|
| Resolver | `resolve-sector.ts` | Maps industry + module hints → `SectorTemplateKey` |
| Templates | `sector-template-data.ts` | logistics, construction, aviation, healthcare, retail |
| Service | `org-intelligence.service.ts` | Persists `OrgIntelligence` + discovery answers |
| UI | `organization-model-panel.tsx` | Growth plan narrative |

**Gaps:** Default sector was **logistics** (MEEM bias). **Fixed:** default `retail` when ambiguous. Public industry dropdown missing construction/aviation. **Fixed:** options in `DISCOVERY_INDUSTRY_OPTIONS`. Growth plan copy logistics-only. **Fixed:** sector-neutral wording.

**Remaining (documented, not F7 code):** `getDiscoveryTemplate()` JSON packs only cover logistics / retail / healthcare — construction/aviation use org-intelligence sector templates but not legacy discovery JSON packs.

### 6. Blueprint handoff (read-only validation)

| Step | Location | Notes |
|------|----------|--------|
| Complete discovery | `completeDiscoveryAndCreateBlueprint` in `pipeline.service.ts` | Not rebuilt in F7 |
| MEEM lighthouse | `lighthouse-pipeline.service.ts` | Filters by `MEEM_REFERENCE_CODE` constant (acceptable) |

**Gaps:** None blocking F7; blueprint engine unchanged per constraints.

### 7. MEEM-specific vs reusable

| Area | MEEM-specific? | Action |
|------|----------------|--------|
| `MEEM_REFERENCE_CODE`, `meem-global` slug | Lighthouse constants | Keep in `src/lib/constants/meem.ts` — not hardcoded DB ids |
| `lighthouse-pipeline.service.ts` | MEEM card only | Out of F7 — UI product choice |
| `meem-ops.service.ts` | MEEM tenant ops | Out of F7 |
| `resolve-sector` default | Was logistics | Generalized |
| Notification digest filters | Optional `--tenant=meem-global` | Script flag, not code path |
| Rimal seed | `CROW-2026-RIMAL`, construction | F6; verified in F7 scripts |

---

## Part 2 — Hardening applied (minimal diff)

1. **Public intake:** Client validation mirror + HTTP error parsing on wizard submit.
2. **Reference codes:** Shared `generateImplementationReferenceCode`.
3. **Discovery start:** Sector template answer seeded from request industry/modules.
4. **Sector resolver:** Neutral default; construction/aviation on public form.
5. **Org intelligence UI:** Non-logistics growth-plan copy.
6. **Verify scripts:** Read-only MEEM + Rimal chain checks.

**Not in scope:** `NEEDS_INFO` workflow, Stripe, SCIM, schema migrations, public marketing redesign, blueprint engine rewrite.

---

## Part 3 — Scripts (staging, idempotent read-only)

| Script | Command | Purpose |
|--------|---------|---------|
| Full pipeline | `npm run request:pipeline:verify` | MEEM + Rimal request → discovery → tenant slug |
| MEEM only | `npm run discovery:verify:meem` | `CROW-2026-MEEM` chain |
| Rimal only | `npm run discovery:verify:rimal` | `CROW-2026-RIMAL` construction chain |
| MEEM ids | `npm run meem:ids:staging` | Staging id map (regression) |
| Rimal tenant | `npm run tenant:verify:rimal` | Tenant materialization + SAREA (F6) |

**Synthetic public request (optional):** Prefer `npm run tenant:seed:rimal` / `tenant:seed:rimal:dry` for a full construction-sector chain rather than a new `request:seed:demo` that duplicates tenant seed. New organic requests use live `/request` → admin approve → discovery (reference from `generateImplementationReferenceCode`).

**Prisma pattern:** `npx tsx --env-file=.env.staging` + `createScriptPrisma()` / `run-with-script-prisma.mjs` (F5/F6).

---

## Part 4 — Validation gate

```bash
npm run typecheck
npm run lint
npm run build
npm run simulate:vercel-build:staging
npm run public:mirror-manifest
npm run meem:ids:staging
npm run tenant:verify:rimal
npm run request:pipeline:verify
```

Record results in [`F7_DEPLOYMENT_CHECKPOINT.md`](F7_DEPLOYMENT_CHECKPOINT.md).

---

## Part 5 — Acceptance (F7)

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Audit documented (reusable vs MEEM-specific) | This doc § Part 1 |
| 2 | Public → admin → discovery hardened or gaps documented | Part 2 + remaining §7 |
| 3 | Sector templates: construction + logistics paths | Resolver + Rimal verify |
| 4 | MEEM + Rimal regression | verify scripts + F6 scripts |
| 5 | New verify scripts | `request:pipeline:verify` |
| 6 | typecheck / lint / build | Checkpoint |
| 7 | No public redesign / forbidden features | Scope guard |

---

## Remaining gaps (post-F7)

1. **`NEEDS_INFO` request status** — not in schema; admin cannot mark “more info needed” without reject.
2. **Discovery JSON template packs** — construction/aviation not in `getDiscoveryTemplate()`; org-intelligence sector templates cover recommendations.
3. **Lighthouse admin card** — still MEEM-reference scoped by design.
4. **Live browser E2E** — RC1/F6 manual; not automated in F7.
5. **Organic request → discovery** — verify scripts assume seeded references; new requests need admin “Start discovery” once.

---

*F7 complements F6 (second tenant) and RC1 (staging health). Production readiness remains a separate Phase F option.*
