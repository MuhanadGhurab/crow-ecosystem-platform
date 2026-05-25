# F11 — Organic browser E2E closure & operator sign-off

**Acceptance run date:** 25 May 2026  
**Environment:** Staging — `https://crow-ecosystem-platform.vercel.app` (`.env.staging`, Supabase pooler)  
**Synthetic company:** Najm Aviation Services  
**Industry:** Aviation  
**Tenant provisioning this run:** **NOT PROVISIONED** (explicit F11 policy)

## Decision

**PASSED**

| Phase | Result | Date |
|-------|--------|------|
| **F11A** — Automated staging regression + `onboarding:verify` | **PASSED** | 25 May 2026 |
| **F11B** — Browser operator sign-off (Platform Admin, Entra) | **PASSED** | 25 May 2026 |

F11A: automated staging regression, organic intake (API parity), discovery/blueprint chain (DB-backed), and `onboarding:verify` for reference `CROW-2026-ARAX9K` all pass.

F11B: Platform Admin browser flow manually validated for the organic **Najm Aviation Services** request on staging (`https://crow-ecosystem-platform.vercel.app`). Admin request detail, discovery/operator flow, and blueprint/readiness/go-live visibility verified. **Tenant provisioning was intentionally not performed** (explicit F11 policy). **F11 warnings are closed.**

| Option | Meaning | This run |
|--------|---------|----------|
| **A** | Full pass including browser E2E | **Selected** (F11A + F11B) |
| **B** | Pass with documented warnings | Superseded by F11B |
| **C** | Fail / block | Not applicable |

---

## F11B — Browser operator sign-off (manual)

**Sign-off:** **PASSED** (25 May 2026)

| Check | Result |
|-------|--------|
| Organic aviation request validated in browser | **Pass** — Najm Aviation Services on staging |
| Admin request detail verified | **Pass** — `/admin/requests` + request detail for `CROW-2026-ARAX9K` |
| Discovery / operator flow verified | **Pass** — Start Discovery, discovery summary, pipeline navigation |
| Blueprint / readiness / go-live visibility verified | **Pass** — Blueprint overview, readiness, go-live routes reachable |
| Tenant provisioning | **Not performed** — intentional per F11 policy |
| F11 warnings | **Closed** — F8 §18 operator checklist satisfied for this reference |

**Operator:** Platform Admin (Entra SSO). **Checklist:** [`F8_ORGANIC_REQUEST_E2E.md`](F8_ORGANIC_REQUEST_E2E.md) §18.

---

## Part 1 — Organic request (public intake)

| Check | Result |
|-------|--------|
| Submit via deployed `/request` wizard (browser) | **Partial (F11A)** — API parity used in automation; organic Najm request **validated in browser (F11B)** |
| Submit via same API as wizard | **Pass** — `POST /api/implementation-requests` with [`scripts/f11-najm-payload.json`](../../scripts/f11-najm-payload.json) |
| Reference format `CROW-{year}-{6-char}` | **Pass** — `CROW-2026-ARAX9K` |
| Request id (internal) | `cmplh0gtp0000i904v0wznrq4` |
| Initial status | `PENDING_REVIEW` → later `UNDER_DISCOVERY` / `BLUEPRINT_BUILD` (Part 2 script) |
| MEEM/Rimal lighthouse refs used | **No** — organic ref only |

**Payload notes:** Modules `hr`, `finance`, `bi` (Reports), `crm`, `procurement`; security `crow_shield`; F11 notes in API `notes` field (not shown on public wizard UI).

---

## Part 2 — Browser operator flow (Platform Admin)

| Step | Browser (Entra) — F11B | Automated substitute (F11A) |
|------|----------------------|-----------------------------|
| `/admin/overview` — Najm in operator console | **Pass** | Route in build; unauth → login redirect (F2/F10 pattern) |
| `/admin/requests` + request detail | **Pass** | Request exists in staging DB |
| Reference, company, industry, lifecycle, next-action, pipeline, checklist, `onboarding:verify` command | **Pass** | UI wired per F10; verified in browser (F11B) |
| **Start Discovery** (button) | **Pass** | [`scripts/f11-discovery-blueprint-staging.ts`](../../scripts/f11-discovery-blueprint-staging.ts) — DB-only equivalent (F11A) |
| Discovery summary + pipeline nav | **Pass** | Profile `cmplh2cnf0001vhroyporz0fy` COMPLETED |
| Aviation discovery content | **Pass** | `onboarding:verify` confirms `aviation` JSON pack; sector answer `aviation` |
| Organization model / org intelligence | **Pass** | Verified in operator flow (F11B); F11A had partial script-only sync |
| Generate blueprint (UI) | **Pass** | Blueprint `cmplh2euh0007vhrolkso3ll5` DRAFT via staging script (F11A) |
| Blueprint overview / readiness / go-live | **Pass** | Visibility verified in browser (F11B) |
| **Provision tenant** | **Not clicked / not run** (intentional) | **No tenant** linked to blueprint |

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
| 1 | Real organic request through `/request` | **Yes** — browser validated (F11B); API parity (F11A) |
| 2 | Reference captured | **Yes** — `CROW-2026-ARAX9K` |
| 3 | Admin finds request in operator UI | **Yes** (F11B) |
| 4 | Start Discovery works | **Yes** (script + browser F11B) |
| 5 | Aviation discovery content | **Yes** (pack + sector + browser) |
| 6 | Org intelligence available | **Yes** (F11B operator flow) |
| 7 | Blueprint tested or documented | **Yes** — DRAFT blueprint created |
| 8 | Readiness/go-live reachable | **Yes** (F11B visibility verified) |
| 9 | Tenant NOT provisioned | **Yes** |
| 10 | `onboarding:verify` passes | **Yes** (with `--expect-blueprint`) |
| 11 | MEEM regression | **Yes** |
| 12 | Rimal regression | **Yes** |
| 13 | typecheck/lint/build | **Yes** |
| 14 | Public mirror | **Yes** |
| 15 | F11 docs | **Yes** (this file) |
| 16 | PROJECT_STATUS / MILESTONES | **Yes** |

---

## Warnings (closed)

F11 warnings are **closed** as of F11B (25 May 2026).

| Former warning | Resolution |
|----------------|--------------|
| Manual browser checklist (F8 §18) | **Closed** — F11B Platform Admin sign-off passed |
| Intake path (API vs wizard) | **Closed** — organic Najm request validated in browser; API parity retained for automation |
| F9/F10 organic browser gap | **Closed** — operator flow verified end-to-end without tenant provision |

**Non-blocking note (unchanged):** `pipeline.service` imports fail under `tsx` (`server-only` guard). Staging script uses Prisma-only discovery + draft blueprint. Prefer UI **Start Discovery** + **Generate blueprint** for full org-intelligence sync when scripting.

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
