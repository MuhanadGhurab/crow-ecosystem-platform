# Alpha Demo Backend Guard Plan

| Field | Value |
|-------|-------|
| **Title** | Guard adjustment + test + phase plan for Alpha Demo Backend |
| **Status** | CANONICAL plan (not implemented) |
| **Authority** | Owner decision — CROW.DEVFLOW.3 |
| **Date** | 2026-07-18 |
| **Mode definition** | [`CONTROLLED-ALPHA-DEMO-BACKEND-MODE.md`](CONTROLLED-ALPHA-DEMO-BACKEND-MODE.md) |
| **Milestone** | [`../milestones/CROW-DEVFLOW-3.md`](../milestones/CROW-DEVFLOW-3.md) |
| **Current guards** | `src/lib/runtime/preview-db-safety.ts` · `src/lib/runtime/crow-runtime-mode.ts` |

## Current behavior (must remain until implementation)

| Guard | Behavior today |
|-------|----------------|
| GAP-004A Preview DB-disabled | Vercel Preview + isolation unproven → **fail closed** (no DB read/write) |
| Runtime mode helpers | Default `alpha_development` + `demo_only`; `realCustomerDataAllowed=false` |
| Alpha banner | Visible classification notice |
| Blueprint Complete | Quarantined / off |
| Production deploy | GAP-015 guard + owner phrase |

**DEVFLOW.3 does not change this code.**

## Future guard adjustment (implementation later)

### Principles

1. Unsafe Preview DB access remains **blocked by default**
2. Alpha demo backend writes allowed **only** with explicit flags + allowlist
3. Production runtime **never** gets a “demo bypass” that weakens Production deploy/isolation claims
4. Local development stays safe (prefer local Postgres; shared sandbox only when explicitly opted in)
5. Missing flags → **fail closed**
6. Demo write ≠ commercial Production claim
7. No secret printing in status helpers

### Proposed helpers (future — e.g. `crow-demo-backend-guard.ts`)

| Helper | Intended behavior |
|--------|-------------------|
| `isAlphaDemoBackendEnabled()` | True only when activation rule is fully satisfied |
| `assertAlphaDemoWriteAllowed(action)` | Throws unless enabled + action on allowlist |
| `assertNotCommercialProductionWrite()` | Blocks commercial Production claims |
| `requireDemoRecordMarkers(payload)` | Ensures demo metadata present before write |
| `getAlphaDemoBackendStatus()` | Redacted status (flag names/values that are non-secret booleans only) |

### Interaction with `preview-db-safety`

| Case | Planned behavior |
|------|------------------|
| Preview + isolation unproven + demo flags **unset** | Keep DB-disabled fail-closed |
| Preview + isolation unproven + demo flags **set** | Future: allow **only** allowlisted demo writes; still block Blueprint/payment/tenant/migrations |
| `VERCEL_ENV=production` | Never treat as “alpha demo bypass” for Production deploy; live domain still not commercial claim without separate gates |
| Local (`VERCEL_ENV` unset/development) | May use local DB or explicit demo flags; still demo markers + allowlist |

Exact wiring is an **implementation** decision in DEVFLOW.4+ — plan only here.

## Test plan (for future implementation)

| # | Case | Expected |
|---|------|----------|
| 1 | Demo backend disabled by default | `isAlphaDemoBackendEnabled() === false` |
| 2 | Missing any required flag | Writes blocked |
| 3 | All alpha/demo flags set | Only allowlisted demo writes pass |
| 4 | Real customer data | Blocked |
| 5 | Payment | Blocked |
| 6 | Blueprint generation / Complete | Blocked |
| 7 | Tenant go-live | Blocked |
| 8 | Production runtime | No demo bypass of Production safety |
| 9 | Status helpers | No secrets printed |
| 10 | Migrations | Not run by demo write path |
| 11 | Records | Require demo markers |
| 12 | Existing `preview-db-safety` + `crow-runtime-mode` tests | Still PASS |

Suggested future script: `npm run crow-demo-backend-guard:test`

## Implementation phases

| Phase | Work | Owner gate |
|-------|------|------------|
| **A** | Runtime helper extension (`isAlphaDemoBackendEnabled`, status) | Implement only after owner authorizes DEVFLOW.4 |
| **B** | Demo write guard (`assertAlphaDemoWriteAllowed`) | Same |
| **C** | Limited demo request/Discovery persistence (migration-free JSON markers preferred) | Separate slice after B |
| **D** | UI warnings on demo write surfaces | With or after C |
| **E** | Tests / certification | Required before acceptance |
| **F** | Owner acceptance of enabled demo backend | Explicit phrase |

## Recommended first implementation slice

**CROW.DEVFLOW.4** — Implement alpha demo backend **runtime gate** and **demo-write guard** helpers + tests.

- Do **not** yet wire domain persistence (Request/Discovery hosted writes)
- Do **not** loosen Production deploy or Blueprint Complete
- Do **not** run migrations
- Keep Preview DB-disabled default until flags pass activation rule
- Certify fail-closed defaults with `ALPHA_DEMO_BACKEND_ENABLED_COUNT=0` unless owner sets flags in a controlled Preview/local env for proof

## Non-claims

- This plan does **not** enable hosted persistence
- This plan does **not** prove GAP-004 isolation
- This plan does **not** authorize Production deploy or `main` merge
- This plan does **not** authorize official Blueprint generation
