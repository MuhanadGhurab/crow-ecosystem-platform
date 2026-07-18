# GAP-004A — Preview DB-Disabled Safety Mode

| Field | Value |
|-------|-------|
| **Title** | No-cost alternate mitigation: Preview database access disabled |
| **Status** | **OWNER ACCEPTED** — standing no-cost mitigation (CROW.GAP004A.ACCEPT.1) · fail-closed implemented (CROW.GAP004.ALT2) |
| **Authority** | Owner acceptance 2026-07-18 · Issue [#16](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/16) |
| **Date** | 2026-07-18 |
| **Milestone** | [`../milestones/CROW-GAP004A-ACCEPT-1.md`](../milestones/CROW-GAP004A-ACCEPT-1.md) · [`../milestones/CROW-GAP004-ALT2.md`](../milestones/CROW-GAP004-ALT2.md) · plan [`../milestones/CROW-GAP004-ALT1.md`](../milestones/CROW-GAP004-ALT1.md) |
| **Related** | [`GAP-004-DB-ISOLATION-PLAN.md`](GAP-004-DB-ISOLATION-PLAN.md) · [`GAP-004-ISOLATION-EVIDENCE.md`](GAP-004-ISOLATION-EVIDENCE.md) |

## Relationship to GAP-004

| Gap | Meaning | Close condition |
|-----|---------|-----------------|
| **GAP-004** | Preview Postgres ≠ Production Postgres (isolation **proven**) | Dedicated Preview DB + evidence · `PREVIEW_DATABASE_ISOLATION_PROVEN_COUNT=1` |
| **GAP-004A** | Preview must not touch any hosted DB while isolation unproven | Fail-closed Preview DB-disabled mode certified |

**GAP-004A does not close GAP-004.** It is the **owner-accepted standing mitigation** (2026-07-18) for Production bleed risk under the **no-cost** constraint (no second paid Supabase project). True isolation remains a **future commercialization gate** (CROW.DEVFLOW.1) — not an alpha-dev blocker under demo-data rules.

---

## Owner constraints (recorded)

- Do **not** create a paid second Supabase project
- Do **not** require a paid Preview database
- Do **not** pause all development
- Production remains unchanged
- Local development and tests continue
- **CROW.DEVFLOW.1:** Alpha Development Mode + fast review; existing Supabase = demo/dev sandbox **conceptually**; production-grade isolation still future

---

## Alpha Mode adjustment plan (CROW.DEVFLOW.1 — docs only)

GAP-004A fail-closed Preview DB-disabled remains the **default safety guard** until a controlled Alpha Demo Backend Mode is owner-authorized and implemented (**CROW.DEVFLOW.3**).

### Future env flags (do not implement in DEVFLOW.1)

| Variable | Intended meaning |
|----------|------------------|
| `CROW_RUNTIME_MODE=alpha_development` | Runtime is alpha, not commercial production |
| `CROW_DATA_CLASSIFICATION=demo_only` | Only demo/test data allowed |
| `ALLOW_SHARED_DEMO_BACKEND=true` | Selected demo/backend writes may proceed under alpha rules |

### Rules if those flags are later explicitly set

- Demo/backend writes may be allowed for **selected** dev/demo flows only
- Still blocked: official Blueprint generation · tenant go-live/provisioning · payment · CroAI production actions · real customer data · migrations unless separately authorized · Production deploy unless separately authorized
- Does **not** prove GAP-004 isolation
- Does **not** authorize commercial Production claims

See [`../development/CROW-ALPHA-DEVELOPMENT-MODE.md`](../development/CROW-ALPHA-DEVELOPMENT-MODE.md).

**UI:** Alpha/demo banner planned in **CROW.DEVFLOW.2** (alongside or refining Preview DB-disabled notices).

---

## Core rule (fail closed)

```
IF VERCEL_ENV = preview
AND Preview database isolation is NOT proven
THEN
  block all database reads
  block all database writes
  block Prisma queries
  block migrations
  block hosted business mutations
ELSE IF isolation proven
THEN
  normal Preview-isolated DB path (future; out of GAP-004A)
```

**Default for current Crow:** isolation is **not** proven → Preview DB-disabled mode **on**.

---

## 1. Environment helpers (design)

Extend existing modules — prefer [`scripts/lib/database-environment.ts`](../../../scripts/lib/database-environment.ts) / [`src/lib/crow-core/database-environment.ts`](../../../src/lib/crow-core/database-environment.ts) over a parallel authority stack.

| Helper | Intended behavior |
|--------|-------------------|
| `isVercelPreview()` | `VERCEL_ENV === "preview"` (thin wrapper over / beside `resolveAppEnvironment()`) |
| `isProductionRuntime()` | `VERCEL_ENV === "production"` or app env production |
| `isPreviewDatabaseIsolationProven()` | Strict positive proof only: Preview DB ref ≠ known Production `wbwnsndcxrgyqwppurms`, fingerprints differ, `BACKEND_ISOLATION=isolated`, `DATABASE_ENVIRONMENT=preview`. **Fail closed** if any signal missing |
| `isPreviewDbDisabledMode()` | `isVercelPreview() && !isPreviewDatabaseIsolationProven()` **OR** explicit `PREVIEW_DB_DISABLED=true` |
| `assertPreviewDbAccessAllowed()` | Throws if Preview DB-disabled mode; never silently continues |
| `assertHostedBusinessWriteAllowed()` | Throws if Preview DB-disabled mode (and existing authority holds) |

**Explicit env (recommended for clarity):**

| Variable | Preview value | Notes |
|----------|---------------|-------|
| `PREVIEW_DB_DISABLED` | `true` | Owner-set while GAP-004 open |
| `DATABASE_URL` / `DIRECT_URL` | **Unset** on Preview | Preferred — no credential to Production |
| `DATABASE_ENVIRONMENT` | `preview` (or omit) | Must **not** pair preview app + production DB for writes |
| `BACKEND_ISOLATION` | `shared` or omit | Isolation still unproven; do not claim `isolated` falsely |

---

## 2. Preview DB-disabled behavior

When `isPreviewDbDisabledMode()`:

| Action | Required |
|--------|----------|
| DB reads | **Block** |
| DB writes | **Block** |
| Prisma client use | **Block** (lazy proxy / guard before query) |
| Migrations | **Block** (already no build migrate; reinforce in scripts) |
| Hosted Request submit | **Block** |
| Hosted Discovery persistence | **Block** |
| Blueprint creation / generation | **Block** |
| Tenant provisioning | **Block** |
| Membership / role creation | **Block** |
| Payment | **Block** |
| CroAI | **Block** |

**Enforcement layers (implementation order for next milestone):**

1. **Env** — no Preview `DATABASE_URL` (strongest)  
2. **`src/lib/db.ts`** — refuse to construct/use Prisma when Preview DB-disabled  
3. **Server actions / services** — `assertHostedBusinessWriteAllowed()` at mutation entry  
4. **UI** — disable submits + safety banner  
5. **Tests** — unit coverage for fail-closed helpers  

---

## 3. UI messaging

Preview surfaces (banner and/or blocked page):

- “Preview database access is disabled.”  
- “This environment is UI/local-first only.”  
- “Hosted actions are blocked to protect Production data.”  
- “Use local development for test data or Production for real client actions.”  

Tone: sober, operator-clear — not marketing.

---

## 4. Route behavior plan

| Route class | Preview DB-disabled behavior |
|-------------|------------------------------|
| Public informational (no DB) | **Render** — existing public browse policy |
| Auth pages that would write hosted account/DB | **Block** mutations; show safety message (or read-only explain) |
| Client Request submit (hosted) | **Disable** submit · blocked messaging |
| Discovery workspace | **Local-first only** (see §5) |
| Blueprint / admin / tenant / payments | **Blocked page** or disabled actions |
| Health that probes DB | Report DB **disabled / skipped** — do not query Production |

---

## 5. Discovery behavior plan

Discovery D0–D6 may continue on Preview **only** as local-first UI.

| Allowed | Forbidden |
|---------|-----------|
| localStorage drafts | Hosted Discovery writes |
| Local preview panels | Hosted Operating Model persistence |
| Adaptive fields | Blueprint generation |
| Operating Model draft preview | `completeDiscovery` (hosted) |
| ProCrow modeling review preview | Tenant / membership / role ops |
| Blueprint handoff **preview** (inert package) | Payment / CroAI |

Align with existing Discovery MVP local-first certification — Preview is another consumer of that mode, not a hosted Persistence unlock.

---

## 6. Forbidden actions (checklist)

- Read/write Production (or any hosted) DB from Preview while isolation unproven  
- Run migrations against hosted targets from Preview/build  
- Create Request / Discovery / Blueprint / tenant / role / payment / CroAI **records** on hosted DB  
- Claim GAP-004 “isolation proven”  
- Enable `CROW_ALLOW_DISCOVERY_BLUEPRINT_COMPLETE`  
- Deploy Production / push `main` / merge PR #10 as part of this path  

---

## 7. Evidence model

| Evidence | Expected while GAP-004A active |
|----------|--------------------------------|
| Preview DB isolation proven | **No** (`PREVIEW_DATABASE_ISOLATION_PROVEN_COUNT=0`) |
| Preview DB access intentionally disabled | **Yes** (env + code guards + UI) |
| Hosted business writes from Preview | **0** |
| Migrations from Preview/build | **0** |
| Production env changed | **0** |
| Production deploy | **0** |

Suggested counters for implement milestone:

- `PREVIEW_DB_DISABLED_MODE_ACTIVE_COUNT=1`  
- `PREVIEW_DATABASE_ISOLATION_PROVEN_COUNT=0`  
- `HOSTED_BUSINESS_WRITE_COUNT=0`  
- `UNAUTHORIZED_MIGRATION_COUNT=0`  

---

## 8. Implementation phases

| Phase | Work | Owner |
|-------|------|-------|
| **ALT1** | Plan + ledger + Issue #16 | Done |
| **ALT2** | Helpers + Prisma fail-closed + mutation asserts + tests | **Done** |
| **ALT3** | Broader UI banners / remaining route soft-fail polish | Optional |
| **ALT4** | Preview deploy smoke evidence (no DB) | Owner + agent |

### ALT2 code map

| Artifact | Path |
|----------|------|
| Helpers | `src/lib/runtime/preview-db-safety.ts` |
| Tests | `src/lib/runtime/preview-db-safety.test.ts` · `npm run preview-db-safety:test` |
| Prisma | `src/lib/db.ts` Proxy |
| Notice | `src/components/runtime/preview-db-disabled-notice.tsx` |
| Proven flag | `PREVIEW_DATABASE_ISOLATION_PROVEN=true` only with `DATABASE_ENVIRONMENT=preview` + `BACKEND_ISOLATION=isolated` + `VERCEL_ENV=preview` |

---

## 9. Exit / supersede

GAP-004A is **owner-accepted standing mitigation** (CROW.GAP004A.ACCEPT.1, 2026-07-18) while isolation unproven.

If owner later provisions a **free or already-paid** isolated Preview DB and isolation is proven:

1. Set isolation env correctly  
2. Set `PREVIEW_DB_DISABLED=false` only after proof  
3. Re-certify GAP-004 mitigated  
4. Retire Preview DB-disabled as default  

---

## Non-claims

- Does **not** prove Preview/Production DB isolation  
- Does **not** authorize hosted Discovery or Blueprint  
- Does **not** replace GAP-015 (Production auto-deploy settings)  
