# F5 — Deployment checkpoint (SAREA + CyberCrow acceptance)

**Purpose:** Internal sign-off that **Phase F4/F5** operational work is accepted on staging: five-persona SAREA materialization for the MEEM lighthouse tenant, CyberCrow non-destructive workflows, CLI materialization scripts, and documented validation — **without** schema changes, billing enforcement, SCIM, or fake telemetry.

**Status:** **PASSED** (automated MEEM SAREA verify + documented acceptance matrix)  
**Date:** 25 May 2026  
**Environment:** Vercel staging + Supabase (Postgres pooler); scripts use `.env.staging` locally  
**Lighthouse tenant:** slug `meem-global` only (no hardcoded tenant UUIDs in this doc)  
**Operating mode:** Advisory-first — same boundaries as RC1/F2 (no hard billing, no usage blocking)

---

## 1. Checkpoint status

| Field | Value |
|-------|--------|
| Milestone | F5 — SAREA materialization + CyberCrow validation (builds on F4) |
| Result | **PASSED** — `npm run sarea:meem-verify` exit `0`; all five personas `tenant_backed` on `meem-global` |
| Schema | **No Prisma migrations** in F4/F5 |
| MEEM slug | `meem-global` |
| Primary evidence | [`F5_CYBERCROW_SAREA_VALIDATION.md`](F5_CYBERCROW_SAREA_VALIDATION.md) |

**Phase numbering note:** Repo completion docs name **F4** (CyberCrow + SAREA studio/runtime slice) and **F5** (materialization + MEEM acceptance). There is **no separate F3** internal doc; this checkpoint treats **F3–F5 acceptance** as the post–F2 operational track ending at F5 sign-off (F4 delivery + F5 validation).

---

## 2. What shipped (F4 → F5)

### F4 — Operational slice (retained in F5)

| Area | Shipped |
|------|---------|
| **SAREA studio** | Five-persona preview catalog (`executive`, `manager`, `frontline`, `analyst`, `tenant_admin`); `/sarea/preview`, `/sarea/role-mapping`; admin tenant **SAREA** tab |
| **SAREA runtime** | `/{tenant}/dashboard` with preview banner (tenant-backed vs recommended fallback); RBAC unchanged (presentation only) |
| **CyberCrow console** | Dashboard, identity, sessions, incidents, security-events, audit/risk/compliance/evidence/grc routes — DB-backed or honest empty |
| **Incident workflow** | `open` → `under_review` → `resolved` / `reopened`; audit log; **no delete** |
| **Security events** | Review / dismiss / escalate-once via payload fields; **no destructive deletes** |
| **Identity telemetry** | Summary surfaces from stored rows only — not live Entra/SIEM/AI |
| **Cleanup** | Removed unused mock console component; public preview mocks retained where referenced |

Detail: [`SAREA_COMPLETION.md`](SAREA_COMPLETION.md), [`CYBERCROW_COMPLETION.md`](CYBERCROW_COMPLETION.md).

### F5 — Materialization + acceptance

| Area | Shipped |
|------|---------|
| **Persona materialization** | `ensureTenantSareaPersonas` + seed paths; all five personas tenant-backed on MEEM after upgrade |
| **Services / UI** | `sarea-materialization.service.ts`; materialization panels on preview, role-mapping, admin SAREA tab |
| **MEEM provisioning** | Idempotent `prisma/seed-meem.ts` + `npm run sarea:meem-upgrade` |
| **CLI fix** | Scripts use `src/lib/prisma-script.ts` (`createScriptPrisma`) — no `server-only` / app `db` import in tsx ops |
| **Validation matrix** | Route + persona tables for MEEM CyberCrow + SAREA |

Detail: [`F5_CYBERCROW_SAREA_VALIDATION.md`](F5_CYBERCROW_SAREA_VALIDATION.md).

---

## 3. Key scripts (MEEM slug only)

| Command | Role |
|---------|------|
| `npm run sarea:meem-upgrade` | Ensures five persona profiles + layouts/widgets/nav/role maps for `meem-global` |
| `npm run sarea:meem-verify` | Read-only acceptance matrix; **must exit `0` before F5 sign-off** |
| `npx tsx prisma/seed-meem.ts` | Full or idempotent MEEM provision (includes persona ensure) |
| `npm run sarea:backfill-seed` | Non-MEEM tenants missing child rows (future / other tenants) |
| `npm run meem:ids:staging` | Resolves staging IDs for **local scripts only** — do not publish UUIDs in docs |

Implementation: `scripts/upgrade-meem-sarea.ts`, `scripts/verify-meem-sarea.ts`, `scripts/backfill-sarea-seed.ts` → `sarea-seed-core.ts` + **`prisma-script.ts`**.

---

## 4. Acceptance commands and results

### Automated — F5 gate (recorded)

| Command | Result | Notes |
|---------|--------|-------|
| `npm run sarea:meem-verify` | **PASS** | Exit `0` on 2026-05-25; all personas `tenant_backed` on `meem-global` |

Captured verify summary (tenant id omitted):

```text
SAREA verify — tenant: meem-global
… executive, manager, frontline, analyst, tenant_admin → tenant_backed (profile/layout/widgets/nav/role_maps present)
All five personas tenant-backed.
```

### Platform suite (recommended before promote / after pull)

Run from repo root; treat as **required for full F5 deployment hygiene** when cutting a staging build:

```powershell
cd D:\CYBERCROW
npm run typecheck
npm run lint
npm run build
npm run simulate:vercel-build:staging
npm run meem:ids:staging
npm run notifications:digest:meem:dry
npm run public:mirror-manifest
```

MEEM SAREA path (after env staging is valid):

```powershell
npm run sarea:meem-upgrade
npm run sarea:meem-verify
```

| Suite item | F5 checkpoint posture |
|------------|------------------------|
| `sarea:meem-verify` | **Executed — PASS** |
| `typecheck` / `lint` / `build` / `simulate:vercel-build:staging` | Listed in validation matrix; run on each staging promotion |
| `sarea:meem-upgrade` | Run when MEEM lacks profiles or after persona seed changes |

---

## 5. Routes validated (MEEM, slug-based)

| Route | F5 check |
|-------|----------|
| `/meem-global/dashboard` | SAREA runtime + preview banner |
| `/sarea/preview` | Per-persona materialization badges |
| `/sarea/role-mapping` | Mapping guidance + MEEM materialization panel |
| `/admin/tenants/{id}` (SAREA tab) | Materialization panel + profile counts |
| `/meem-global/cybercrow/dashboard` | Metrics + connection copy |
| `/meem-global/cybercrow/incidents` | Status workflow; no delete |
| `/meem-global/cybercrow/security-events` | Review/dismiss/escalate; no duplicate escalation |
| `/meem-global/cybercrow/identity` | Real rows or honest empty |
| `/meem-global/cybercrow/sessions` | Telemetry summary or empty |

---

## 6. Important fix — CLI Prisma boundary (F5)

| Fix | Why it mattered |
|-----|----------------|
| **`prisma-script.ts` + `sarea-seed-core.ts`** | `sarea:meem-upgrade` / `sarea:meem-verify` / backfill must run under `tsx` without importing Next.js `server-only` `db` |
| **Wiring in `scripts/*.ts`** | Materialization and verify are repeatable outside the dev server |

Without this, MEEM acceptance scripts failed at import time; F5 acceptance depends on clean CLI runs.

---

## 7. Advisory-only boundaries (unchanged)

F5 **does not** change RC1/F2 production posture:

| Capability | F5 posture |
|------------|------------|
| Stripe / billing enforcement | Not enforced |
| Runtime module blocking by plan | Not enforced |
| SCIM / Entra group sync | Not implemented |
| Fake security / AI / telemetry | Explicitly out of scope |
| Schema migrations | None in F4/F5 |
| Incident delete / destructive SOC | Not shipped |

---

## 8. Optional manual smoke (staging)

After automated verify passes, optional human checks on **staging URL** (platform staff session):

1. Open `/meem-global/dashboard` — confirm SAREA preview banner and nav for mapped role.
2. Open `/sarea/preview` — five cards; MEEM links show **tenant-backed** (not fallback) for all personas post-upgrade.
3. Open `/meem-global/cybercrow/incidents` — transition one incident through allowed statuses (no delete control).
4. Open `/meem-global/cybercrow/security-events` — review or dismiss an informational event; confirm escalate-once behavior.
5. Admin → tenant detail → **SAREA** tab — materialization counts match verify matrix.

Use `npm run meem:ids:staging` only in terminal for dynamic admin URLs — do not paste IDs into this checkpoint.

---

## 9. Remaining gaps / future work

| Item | Priority |
|------|----------|
| **Non-MEEM tenants** | Run `sarea:backfill-seed` or provision path for all five personas |
| **Role map automation** | Still manual studio / seed today |
| **Auth pipeline writers** | `LoginEvent` / `SessionEvent` at sign-in for richer identity views |
| **Live IdP session inventory** | When Entra integration matures |
| **External ticketing** | Incident sync |
| **Public intake** | Rate limit / Turnstile on Vercel (F1/F2 — see [`PUBLIC_INTAKE_PROTECTION.md`](PUBLIC_INTAKE_PROTECTION.md)) |
| **Production domain** | Custom domain + Entra redirect URIs when leaving staging |

---

## 10. Final F5 statement

**Crow Ecosystem Platform accepts F5:** MEEM lighthouse tenant (`meem-global`) has **all five SAREA personas tenant-backed**, CyberCrow F4 workflows remain validated on MEEM routes, and CLI materialization (`sarea:meem-upgrade`, `sarea:meem-verify`) runs via **`prisma-script`** without server boundary errors.

F5 is an **operational acceptance checkpoint** on top of RC1 staging — not production go-live. Next planning should use [`PROJECT_STATUS.md`](PROJECT_STATUS.md), [`MILESTONES.md`](MILESTONES.md), and production controls in [`PRODUCTION_READINESS.md`](PRODUCTION_READINESS.md) / [`F2_PRODUCTION_CONTROLS.md`](F2_PRODUCTION_CONTROLS.md).

---

## Related internal docs

| Topic | Document |
|-------|----------|
| F5 validation matrix | [`F5_CYBERCROW_SAREA_VALIDATION.md`](F5_CYBERCROW_SAREA_VALIDATION.md) |
| SAREA completion | [`SAREA_COMPLETION.md`](SAREA_COMPLETION.md) |
| CyberCrow completion | [`CYBERCROW_COMPLETION.md`](CYBERCROW_COMPLETION.md) |
| RC1 staging baseline | [`RC1_STAGING_VALIDATION.md`](RC1_STAGING_VALIDATION.md) |
| MEEM lighthouse | [`customers/MEEM_GLOBAL.md`](customers/MEEM_GLOBAL.md) |

---

*Internal only — no secrets, env values, or tenant UUIDs. Use slug `meem-global` and scripted verify output only.*
