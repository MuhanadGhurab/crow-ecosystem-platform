# F9 deployment checkpoint — acceptance validation

**Phase:** F9 — Blueprint generation & go-live bridge hardening  
**Acceptance run date:** 25 May 2026  
**Environment:** Staging (`.env.staging`, Supabase pooler)  
**Operator:** Automated acceptance run (PowerShell, `D:\CYBERCROW`)

## Decision

**PASSED WITH WARNINGS**

All regression commands exited **0**. Staging MEEM/Rimal pipeline scripts confirm blueprint chains. Warnings are documented limitations, not F9 code regressions.

| Warning | Impact |
|---------|--------|
| `request:e2e:verify --reference=CROW-2026-MEEM` rejects lighthouse ref format (`CROW-2026-MEEM` ≠ 6-char suffix) | Use `request:pipeline:verify`, `discovery:verify:meem`, `discovery:verify:rimal` for lighthouse anchors |
| Browser organic E2E (F8 §18 steps) | **Pending** manual validation — not run in this acceptance |
| Prisma DLL EPERM on simulate | **Not observed** — `simulate:vercel-build:staging` passed end-to-end |

## Scope validated (no new features)

- `discovery-completion-gate.service.ts` + `DiscoveryBlueprintGatePanel` on discovery summary
- `completeDiscoveryAndCreateBlueprint` upsert on unique `requestId` (idempotent refresh)
- Blueprint readiness + go-live pages (F9 UX bridge)
- `RequestPipelineLinks` on admin request detail
- `verify-organic-request-e2e.ts` dry + `--expect-*` flags (organic ref format)

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
| 10 | `npm run build` | **0** | 49 routes; readiness + go-live present |
| 11 | `npm run simulate:vercel-build:staging` | **0** | prisma generate + migrate deploy + next build OK |

**Prisma lock note:** No `EPERM` on `query_engine-windows.dll.node` during simulate. If it appears on another machine, treat as Windows file-lock (dev server / IDE / antivirus), confirm `npm run build` passed, run `npm run warn:prisma-lock`.

## TASK 2 — F9 bridge code verification

| Artifact | Present | Staging evidence |
|----------|---------|------------------|
| `discovery-completion-gate.service.ts` | Yes | Wired in discovery summary via `evaluateDiscoveryBlueprintGate` |
| `discovery-blueprint-gate-panel.tsx` | Yes | Imported on `discovery/[requestId]/summary/page.tsx` |
| `completeDiscoveryAndCreateBlueprint` | Yes | Upsert on `requestId`; preserves non-DRAFT blueprint status |
| `readiness/page.tsx`, `go-live/page.tsx` | Yes | In production build route list |
| `request-pipeline-links.tsx` | Yes | Used on `admin/requests/[requestId]/page.tsx` |
| `verify-organic-request-e2e.ts` | Yes | `--expect-blueprint`, `--expect-tenant`, `--expect-sector=`, `--expect-plan=` |

## TASK 3 — Organic E2E (optional)

| Attempt | Result |
|---------|--------|
| `request:e2e:verify --reference=CROW-2026-MEEM --expect-blueprint --expect-tenant --expect-sector=logistics` | **Exit 1** — REF_PATTERN rejects lighthouse code (by design) |
| MEEM/Rimal via dedicated scripts | **Pass** — rows 1–4 above |

No new tenant provisioned. No new public request submitted.

**Manual follow-up:** F8 organic browser checklist when staging URL + admin session available.

## TASK 4 — Public / internal boundary

| Check | Result |
|-------|--------|
| Internal docs under `docs/internal/` | Yes (34 files) |
| Public mirror includes `docs/public` only (not `docs/internal`) | Yes — manifest excludes `docs/internal` |
| Live IDs in `docs/public/*` | **None** — grep `cmpi2`, `cmpldj`, `CROW-2026` clean |
| `.env` staged in git | **No** — working tree has no staged `.env` |

## Regression anchors (staging)

| Tenant | Slug | Reference | Blueprint | Status |
|--------|------|-----------|-----------|--------|
| MEEM | `meem-global` | `CROW-2026-MEEM` | `cmpi2w41q001pvhqs02qtao22` | `GO_LIVE` |
| Rimal | `rimal-construction` | `CROW-2026-RIMAL` | (pipeline verify) | `GO_LIVE` |

## Sign-off

F9 acceptance criteria for **automated staging regression and script-backed pipeline verification** are satisfied. Proceed to production promotion per [`PRODUCTION_READINESS.md`](PRODUCTION_READINESS.md) with manual organic browser pass tracked separately.

---

*Bridge spec: [`F9_BLUEPRINT_GO_LIVE_BRIDGE.md`](F9_BLUEPRINT_GO_LIVE_BRIDGE.md) · Prior: [`F8_ORGANIC_REQUEST_E2E.md`](F8_ORGANIC_REQUEST_E2E.md)*
