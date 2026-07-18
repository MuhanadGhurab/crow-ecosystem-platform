# GAP-004 — Preview/Production Database Isolation Plan

| Field | Value |
|-------|-------|
| **Title** | Safe implementation plan for DB isolation |
| **Status** | DECISION PLAN — **CROW.GAP004.3** recheck complete; isolation **still not proven** (Vercel DB URLs remain Production+Preview shared) |
| **Authority** | Owner decisions · [`GAP-004-DB-ISOLATION-AUDIT.md`](GAP-004-DB-ISOLATION-AUDIT.md) · [`GAP-004-OWNER-EXECUTION-CHECKLIST.md`](GAP-004-OWNER-EXECUTION-CHECKLIST.md) |
| **Date** | 2026-07-18 |
| **Milestone** | [`../milestones/CROW-GAP004-3.md`](../milestones/CROW-GAP004-3.md) · prior [`../milestones/CROW-GAP004-2.md`](../milestones/CROW-GAP004-2.md) · [`../milestones/CROW-GAP004-1.md`](../milestones/CROW-GAP004-1.md) |
| **Issue** | [#16](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/16) |
| **Evidence** | [`GAP-004-ISOLATION-EVIDENCE.md`](GAP-004-ISOLATION-EVIDENCE.md) |

**Agents must not execute provisioning, Vercel env edits, or hosted migrations without explicit owner authorization.**

---

## Goal

Prove **isolated** Preview and Production Postgres backends before:

- Hosted Discovery persistence  
- Hosted Blueprint drafting / Complete override  
- Treating Preview as a safe sandbox  
- `main` merge / Production movement that assumes Preview ≠ Production data  

---

## Non-goals (this plan)

- Enabling Discovery hosted writes  
- Enabling Blueprint generation  
- Changing Production auto-deploy settings (that is **GAP-015**)  
- Merging PR #10  
- Copying Production data into Preview  

---

## Target end-state

| Environment | Supabase project | `DATABASE_ENVIRONMENT` | `BACKEND_ISOLATION` | Fingerprint |
|-------------|------------------|------------------------|---------------------|-------------|
| Production | Existing (`wbwnsndcxrgyqwppurms` unless owner migrates) | `production` | `isolated` | Production hash |
| Preview | **New** dedicated project | `preview` | `isolated` | Preview hash ≠ Production |
| Local / CI | Disposable / CI DB | `local` / `ci` | n/a | Optional |

App alignment:

- `VERCEL_ENV=production` → Production DB only  
- `VERCEL_ENV=preview` → Preview DB only  
- Shared pairing (`preview` app + `production` DB) becomes **forbidden** except temporary disaster recovery with written owner exception  

---

## Phased path

### Phase 0 — Decision

- [x] Audit published (CROW.GAP004.1)  
- [x] Execution checklist + redacted checker (CROW.GAP004.2)  
- [x] Isolation recheck after claimed bind (CROW.GAP004.3) → **still blocked**  
- [ ] Owner accepts isolation plan  
- [ ] Owner names Preview project name / billing home  
- [ ] Owner confirms Production project remains `wbwnsndcxrgyqwppurms` (or documents change)

### Phase 1 — Provision Preview Supabase (owner)

- [ ] Create Supabase project (e.g. `crow-ecosystem-preview`) — **claimed; not verified via Preview DB URL**  
- [ ] Record project **ref** (password manager — not git)  
- [ ] Confirm ref ≠ Production  
- [ ] Obtain pooler + direct connection strings  

See [`GAP-004-OWNER-EXECUTION-CHECKLIST.md`](GAP-004-OWNER-EXECUTION-CHECKLIST.md).

Reference runbook: [`C2_2_PREVIEW_DATABASE_SETUP_RUNBOOK.md`](../../architecture/crow-core/c2/C2_2_PREVIEW_DATABASE_SETUP_RUNBOOK.md)

### Phase 2 — Bind Vercel Preview env (owner dashboard only)

- [ ] **Split** shared `DATABASE_URL` / `DIRECT_URL` so Preview is not Production+Preview  
- [ ] Preview `DATABASE_URL` / `DIRECT_URL` → Preview project only  
- [ ] `DATABASE_ENVIRONMENT=preview` · `BACKEND_ISOLATION=isolated`  
- [ ] Preview fingerprint secret set  
- [ ] Production scope unchanged  

**GAP004.3 finding:** CLI still shows `DATABASE_URL` / `DIRECT_URL` as **Production, Preview** (shared). Production `BACKEND_ISOLATION=shared`.

### Phase 3 — Prove isolation (read-only / check-only)

- [x] Repo `vercel.json` has no build migrate (verified)  
- [x] Local operator Preview vs Production compared (2026-07-18) → **shared** (`wbwnsndcxrgyqwppurms`)  
- [x] Vercel scope recheck (CROW.GAP004.3) → **still shared binding**  
- [ ] Vercel dashboard redacted evidence with differing refs  
- [ ] `npm run db-isolation-env:check` → `PREVIEW_DATABASE_ISOLATION_PROVEN_COUNT=1`  

Evidence log: [`GAP-004-ISOLATION-EVIDENCE.md`](GAP-004-ISOLATION-EVIDENCE.md)

**Exit criteria:** check succeeds; fingerprint/ref ≠ Production; no hosted mutation.

### Phase 4 — Controlled Preview schema apply (separate owner auth)

Only after Phase 3 proven — **not authorized in GAP004.2 / GAP004.3**.

1. Owner authorizes phrase `APPLY PREVIEW DATABASE MIGRATIONS`  
2. Apply via controlled wrapper / GitHub workflow_dispatch (not Vercel build)  
3. Record migration inventory outcome  
4. Smoke Preview deploy against Preview DB  

### Phase 5 — Decommission shared Preview posture

1. Remove / rotate any Preview env that still points at Production  
2. Update operator runbooks that still say `BACKEND_ISOLATION=shared` as default  
3. Mark GAP-004 **mitigated** or **closed** only after owner acceptance of isolation proof  
4. Then reconsider hosted Discovery persistence / certify  

### Parallel track — GAP-015

Do **not** wait forever on GAP-004 to ignore Production auto-deploy risk. Prefer:

1. GAP-004 isolation (data plane)  
2. GAP-015 auto-deploy settings (release plane)  

Both before treating `main` → Production as routine.

---

## Owner decision checklist

| # | Decision | Options |
|---|----------|---------|
| D1 | Provision dedicated Preview Supabase? | Yes / Defer (GAP-004 stays blocked) |
| D2 | Bind Vercel Preview env to Preview project? | Yes (owner dashboard) / Defer |
| D3 | End shared Preview→Production as normal mode? | Yes / Temporary exception (document expiry) |
| D4 | Authorize first Preview controlled migrate? | Only after D1–D3 proof |
| D5 | Authorize any Discovery hosted persistence? | **No** until GAP-004 mitigated |
| D6 | Change Vercel Production auto-deploy (GAP-015)? | Separate milestone |

---

## Acceptance criteria for “GAP-004 mitigated”

1. Preview Supabase project ref ≠ Production ref  
2. Vercel Preview `DATABASE_URL` / `DIRECT_URL` resolve to Preview project  
3. Vercel Production URLs resolve to Production project  
4. `DATABASE_ENVIRONMENT` matches `VERCEL_ENV` for both  
5. Fingerprints differ and match expected secrets  
6. Controlled Preview check-only passes without `--allow-shared-production-backend`  
7. Owner records acceptance in milestone / Issue #16  
8. Shared-backend acknowledgment path reserved for emergencies only  

---

## Rollback / failure handling

| Failure | Action |
|---------|--------|
| Preview env accidentally set to Production | Stop; revert Preview env; rotate credentials if leaked to logs |
| Preview migrate applied to wrong DB | Stop; treat as incident; do not “fix forward” without owner |
| Production pointed at Preview | Emergency: restore Production env; Instant Rollback if needed (owner) |

---

## Relationship to Discovery / Blueprint

| Work | Allowed before GAP-004 mitigated? |
|------|-----------------------------------|
| Discovery D0–D6 local-first | Yes (already certified package) |
| Discovery hosted persistence | **No** |
| Blueprint generation / Complete override | **No** |
| Hosted ProCrow approval writes | **No** (treat as hosted) |
| Local-only feature depth (Stages 4–7) | Yes, if owner prioritizes (does not close GAP-004) |
