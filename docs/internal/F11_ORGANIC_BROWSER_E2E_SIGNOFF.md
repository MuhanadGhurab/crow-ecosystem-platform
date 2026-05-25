# F11 — Organic browser E2E closure & operator sign-off

**Acceptance run date:** 25 May 2026  
**Environment:** Staging — `https://crow-ecosystem-platform.vercel.app` (`.env.staging`, Supabase pooler)  
**Synthetic company:** Najm Aviation Services  
**Industry:** Aviation  
**Tenant provisioning this run:** **NOT PROVISIONED** (explicit F11 policy)

## Decision

**PASSED WITH WARNINGS**

Automated staging regression, organic intake, discovery/blueprint chain (DB-backed), and `onboarding:verify` for reference `CROW-2026-ARAX9K` all pass. **Full browser operator sign-off with Platform Admin Entra login remains pending** — browse automation unavailable in this run; operator must complete F8 §18 checklist manually to clear the warning.

| Option | Meaning | This run |
|--------|---------|----------|
| **A** | Full pass including browser E2E | Not selected |
| **B** | **Pass with documented warnings** | **Selected** |
| **C** | Fail / block | Not applicable |

---

## Part 1 — Organic request (public intake)

| Check | Result |
|-------|--------|
| Submit via deployed `/request` wizard (browser) | **Not completed** — Cursor browse MCP `ENOENT` (no browser driver in agent environment) |
| Submit via same API as wizard | **Pass** — `POST /api/implementation-requests` with [`scripts/f11-najm-payload.json`](../../scripts/f11-najm-payload.json) |
| Reference format `CROW-{year}-{6-char}` | **Pass** — `CROW-2026-ARAX9K` |
| Request id (internal) | `cmplh0gtp0000i904v0wznrq4` |
| Initial status | `PENDING_REVIEW` → later `UNDER_DISCOVERY` / `BLUEPRINT_BUILD` (Part 2 script) |
| MEEM/Rimal lighthouse refs used | **No** — organic ref only |

**Payload notes:** Modules `hr`, `finance`, `bi` (Reports), `crm`, `procurement`; security `crow_shield`; F11 notes in API `notes` field (not shown on public wizard UI).

---

## Part 2 — Browser operator flow (Platform Admin)

| Step | Browser (Entra) | Automated substitute |
|------|-----------------|----------------------|
| `/admin/overview` — Najm in operator console | **Pending** | Route in build; unauth → login redirect (F2/F10 pattern) |
| `/admin/requests` + request detail | **Pending** | Request exists in staging DB |
| Reference, company, industry, lifecycle, next-action, pipeline, checklist, `onboarding:verify` command | **Pending** | UI wired per F10; not screenshot-verified |
| **Start Discovery** (button) | **Pending** | [`scripts/f11-discovery-blueprint-staging.ts`](../../scripts/f11-discovery-blueprint-staging.ts) — DB-only equivalent |
| Discovery summary + pipeline nav | **Pending** | Profile `cmplh2cnf0001vhroyporz0fy` COMPLETED |
| Aviation discovery content | **Partial** | `onboarding:verify` confirms `aviation` JSON pack; sector answer `aviation` |
| Organization model / org intelligence | **Partial** | Sector answer set; full `syncBlueprintOrgModelFromDiscovery` skipped (see below) |
| Generate blueprint (UI) | **Pending** | Blueprint `cmplh2euh0007vhrolkso3ll5` DRAFT via staging script |
| Blueprint overview / readiness / go-live | **Pending** | Routes exist; unauth HEAD → 307 login expected |
| **Provision tenant** | **Not clicked / not run** | **No tenant** linked to blueprint |

**CLI pipeline note:** `pipeline.service` imports fail under `tsx` (`server-only` guard). Staging script uses Prisma-only discovery + draft blueprint. Operator should run **Start Discovery** + **Generate blueprint** in UI once to run full org-intelligence sync and notifications.

---

## Part 3 — `onboarding:verify`

```bash
npm run onboarding:verify -- --reference=CROW-2026-ARAX9K --expect-blueprint --expect-sector=aviation
```

| Result | Detail |
|--------|--------|
| **Exit 0** | Organic request E2E verification **PASSED** |
| Sector | `aviation` matches `--expect-sector=aviation` |
| Discovery profile | COMPLETED |
| Blueprint | DRAFT, `requestId` matches |
| `--expect-tenant` | **Not used** (no provisioning) |

---

## Part 4 — Regression suite

| Command | Exit | Notes |
|---------|------|-------|
| `npm run meem:ids:staging` | **0** | `CROW-2026-MEEM`, `meem-global` |
| `npm run sarea:meem-verify` | **0** | Five personas tenant-backed |
| `npm run tenant:verify:rimal` | **0** | Rimal PASSED; isolation OK |
| `npm run request:pipeline:verify` | **0** | MEEM + Rimal chains OK |
| `npm run request:e2e:dry` | **0** | Five-sector packs + reference sample |
| `npm run request:e2e:verify` | **0** | Template packs (no `--reference`) |
| `npm run notifications:digest:meem:dry` | **0** | Dry-run digest OK |
| `npm run public:mirror-manifest` | **0** | 21 paths; excludes `docs/internal` |
| `npm run typecheck` | **0** | Clean |
| `npm run lint` | **0** | Clean |
| `npm run build` | **0** | 49 routes |
| `npm run simulate:vercel-build:staging` | **0** | generate + migrate deploy + build OK |

**Prisma EPERM:** Not observed this run. If simulate fails on Windows with `query_engine-windows.dll.node` locked: stop Node dev servers, re-run; **`npm run build` is the gate** (passed).

---

## Acceptance criteria mapping

| # | Criterion | Met? |
|---|-----------|------|
| 1 | Real organic request through `/request` | **Partial** — API parity only |
| 2 | Reference captured | **Yes** — `CROW-2026-ARAX9K` |
| 3 | Admin finds request in operator UI | **Pending** browser |
| 4 | Start Discovery works | **Yes** (script); browser pending |
| 5 | Aviation discovery content | **Yes** (pack + sector) |
| 6 | Org intelligence available | **Partial** (sector answer; full sync pending UI) |
| 7 | Blueprint tested or documented | **Yes** — DRAFT blueprint created |
| 8 | Readiness/go-live reachable | **Pending** browser; routes built |
| 9 | Tenant NOT provisioned | **Yes** |
| 10 | `onboarding:verify` passes | **Yes** (with `--expect-blueprint`) |
| 11 | MEEM regression | **Yes** |
| 12 | Rimal regression | **Yes** |
| 13 | typecheck/lint/build | **Yes** |
| 14 | Public mirror | **Yes** |
| 15 | F11 docs | **Yes** (this file) |
| 16 | PROJECT_STATUS / MILESTONES | **Yes** |

---

## Remaining warnings

1. **Manual browser checklist** — Complete [`F8_ORGANIC_REQUEST_E2E.md`](F8_ORGANIC_REQUEST_E2E.md) §18 as Platform Admin for `CROW-2026-ARAX9K` (or re-submit via `/request` UI and repeat).
2. **Intake path** — Document whether API-only submit is acceptable for sign-off or requires wizard screenshot.
3. **`pipeline.service` + tsx** — `onboard-tenant-from-blueprint.ts` and similar scripts fail with `server-only`; use UI actions or fix script import boundary.
4. **F9/F10 organic warning** — Can close to “automation + verify pass; browser pending” once operator signs F8 checklist.

---

## Internal IDs (staging only — do not publish)

| Artifact | Id |
|----------|-----|
| Implementation request | `cmplh0gtp0000i904v0wznrq4` |
| Discovery profile | `cmplh2cnf0001vhroyporz0fy` |
| Enterprise blueprint | `cmplh2euh0007vhrolkso3ll5` |

---

## Related docs

- [`F8_ORGANIC_REQUEST_E2E.md`](F8_ORGANIC_REQUEST_E2E.md) — Manual browser checklist  
- [`F10_TENANT_ONBOARDING_OPERATOR_CONSOLE.md`](F10_TENANT_ONBOARDING_OPERATOR_CONSOLE.md) — Operator UX  
- [`F10_DEPLOYMENT_CHECKPOINT.md`](F10_DEPLOYMENT_CHECKPOINT.md) — Prior acceptance pattern  
- [`MILESTONES.md`](MILESTONES.md) · [`PROJECT_STATUS.md`](PROJECT_STATUS.md)
