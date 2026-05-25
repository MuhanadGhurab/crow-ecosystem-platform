# F10 deployment checkpoint — acceptance validation

**Phase:** F10 — Tenant onboarding UX & admin operator console  
**Acceptance run date:** 25 May 2026  
**Environment:** Staging (`.env.staging`, Supabase pooler)  
**Operator:** Automated acceptance run (PowerShell, `D:\CYBERCROW`)

## Decision

**PASSED WITH WARNINGS** (Option B)

All staging regression commands exited **0**. Operator console components build and wire correctly. Warnings are documented limitations, not F10 regressions.

| Option | Meaning | This run |
|--------|---------|----------|
| **A** | Full pass, no follow-ups | Not selected — organic ref + browser checklist pending |
| **B** | **Pass with documented warnings** | **Selected** |
| **C** | Fail / block promotion | Not applicable |

| Warning | Impact |
|---------|--------|
| No staging row with organic ref `CROW-2026-{6-char}` | `onboarding:verify -- --reference=...` not run against live organic row; use `request:pipeline:verify` for MEEM/Rimal |
| `onboarding:verify --reference=CROW-2026-MEEM` | **Exit 1** by design — lighthouse code ≠ 6-char suffix (same as F9) |
| F8 §18 browser organic checklist | **Pending** manual validation |
| `warn:prisma-lock` | Node processes running — advisory only; simulate + build passed without EPERM |

## Scope validated (no new features)

- Operator lifecycle buckets on `/admin/overview`
- Request detail next-action + pipeline bridge
- `OnboardingPipelineContext` on discovery summary, blueprint readiness/go-live
- Human lifecycle labels (TS-only, no schema)
- `npm run onboarding:verify` script alias
- No Stripe/SCIM/gates/public redesign changes in this acceptance

## TASK 1 — Staging regression (exit codes)

| # | Command | Exit | Key output |
|---|---------|------|------------|
| 1 | `npm run meem:ids:staging` | **0** | `CROW-2026-MEEM`, blueprint `cmpi2w41q001pvhqs02qtao22`, status `GO_LIVE` |
| 2 | `npm run sarea:meem-verify` | **0** | All five personas tenant-backed |
| 3 | `npm run tenant:verify:rimal` | **0** | Rimal verify PASSED; isolation vs MEEM OK |
| 4 | `npm run request:pipeline:verify` | **0** | MEEM + Rimal pipeline PASSED |
| 5 | `npm run request:e2e:dry` | **0** | Template packs + org-intel + reference sample OK |
| 6 | `npm run notifications:digest:meem:dry` | **0** | 3 advisories in window (dry-run) |
| 7 | `npm run public:mirror-manifest` | **0** | 21 include paths; excludes `docs/internal` |
| 8 | `npm run typecheck` | **0** | Clean |
| 9 | `npm run lint` | **0** | Clean |
| 10 | `npm run build` | **0** | 49 routes; operator + pipeline routes present |
| 11 | `npm run simulate:vercel-build:staging` | **0** | prisma generate + migrate deploy + next build OK |

**Prisma / EPERM note:** No `EPERM` on `query_engine-windows.dll.node` during this run. `npm run warn:prisma-lock` reported running Node processes (Windows lock advisory). If simulate fails elsewhere: stop dev servers, re-run simulate; **`npm run build` is the gate** — passed here.

## TASK 2 — `onboarding:verify`

| Attempt | Result |
|---------|--------|
| Staging query for `CROW-{year}-{6-char}` refs (excluding MEEM/Rimal) | **None found** — pending organic reference from live `/request` submit |
| `npm run onboarding:verify -- --reference=CROW-2026-MEEM` | **Exit 1** — `FAIL: Reference does not match CROW-{year}-{6-char}` (expected) |
| MEEM/Rimal pipeline | **Pass** — `request:pipeline:verify`, `discovery:verify:meem`, `discovery:verify:rimal` (via pipeline + tenant scripts) |

**Known (F9):** Lighthouse references `CROW-2026-MEEM` / `CROW-2026-RIMAL` are not organic verify targets. Organic format sample from dry run: `CROW-2026-FY3JSR`.

## TASK 3 — Operator UI smoke (build / grep)

| Route / artifact | In `npm run build` output | Wired |
|------------------|---------------------------|-------|
| `/admin/overview` | Yes | `getOperatorConsoleSnapshot`, `OperatorConsoleSection` |
| `/admin/requests`, `/admin/requests/[requestId]` | Yes | `OperatorNextActionPanel`, pipeline links |
| `/discovery/[requestId]/summary` | Yes | `OnboardingPipelineContext` in layout |
| `/blueprints/[blueprintId]/readiness` | Yes | `OnboardingPipelineContext` |
| `/blueprints/[blueprintId]/go-live` | Yes | `OnboardingPipelineContext` |
| `/admin/tenants`, `/admin/tenants/[tenantId]` | Yes | — |
| `/[tenant]/dashboard` (`meem-global`, `rimal-construction`) | Yes | Tenant segment routes |

| Module | Path |
|--------|------|
| `operator-console.service` | `src/lib/services/operator-console.service.ts` |
| `OperatorConsoleSection` | `src/components/admin/operator-console-section.tsx` |
| `OperatorNextActionPanel` | `src/components/admin/operator-next-action-panel.tsx` |
| `OnboardingPipelineContext` | `src/components/admin/onboarding-pipeline-context.tsx` |

Browser smoke not required — build route table + grep confirm F10 surfaces.

## TASK 4 — Public / internal boundary

| Check | Result |
|-------|--------|
| Internal docs under `docs/internal/` | Yes |
| Public mirror includes `docs/public` only | Yes — manifest excludes `docs/internal` |
| Live IDs in `docs/public/*` | **None** — grep clean |
| `.env` / `.env.staging` in git status | **Not staged** (untracked/modified local only if present) |

## Regression anchors (staging)

| Tenant | Slug | Reference | Status |
|--------|------|-----------|--------|
| MEEM | `meem-global` | `CROW-2026-MEEM` | `GO_LIVE` |
| Rimal | `rimal-construction` | `CROW-2026-RIMAL` | `GO_LIVE` |

## F10 acceptance criteria (13)

| # | Criterion | Result |
|---|-----------|--------|
| 1 | Operator console on overview | **Pass** |
| 2 | No schema change | **Pass** |
| 3 | Request detail next action | **Pass** |
| 4 | Pipeline map | **Pass** |
| 5 | Cross-stage navigation | **Pass** |
| 6 | Human lifecycle labels | **Pass** |
| 7 | MEEM + Rimal visible | **Pass** |
| 8 | No public redesign | **Pass** |
| 9 | No auto provision | **Pass** |
| 10 | E2E checklist UI | **Pass** (build) |
| 11 | `onboarding:verify` script | **Pass** (alias; organic row pending) |
| 12 | Reuse existing services | **Pass** |
| 13 | Regression path documented | **Pass** |

## Sign-off

F10 acceptance criteria for **automated staging regression, operator console wiring, and script-backed pipeline verification** are satisfied under **PASSED WITH WARNINGS**. Proceed per [`PRODUCTION_READINESS.md`](PRODUCTION_READINESS.md) with manual F8 browser checklist and first organic `onboarding:verify` row tracked separately.

---

*Spec: [`F10_TENANT_ONBOARDING_OPERATOR_CONSOLE.md`](F10_TENANT_ONBOARDING_OPERATOR_CONSOLE.md) · Prior: [`F9_DEPLOYMENT_CHECKPOINT.md`](F9_DEPLOYMENT_CHECKPOINT.md)*
