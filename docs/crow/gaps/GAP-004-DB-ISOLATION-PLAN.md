# GAP-004 — Preview/Production Database Isolation Plan

| Field | Value |
|-------|-------|
| **Title** | Safe implementation plan for DB isolation |
| **Status** | DECISION PLAN — isolation **still not proven**; owner **no-cost** alternate **GAP-004A** (Preview DB-disabled) planned via CROW.GAP004.ALT1 |
| **Authority** | Owner decisions · [`GAP-004-DB-ISOLATION-AUDIT.md`](GAP-004-DB-ISOLATION-AUDIT.md) · [`GAP-004A-PREVIEW-DB-DISABLED-SAFETY-MODE.md`](GAP-004A-PREVIEW-DB-DISABLED-SAFETY-MODE.md) |
| **Date** | 2026-07-18 |
| **Milestone** | [`../milestones/CROW-GAP004-ALT1.md`](../milestones/CROW-GAP004-ALT1.md) · prior GAP004.1–3 |
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

Only after Phase 3 proven — **not authorized** while on GAP-004A path.

1. Owner authorizes phrase `APPLY PREVIEW DATABASE MIGRATIONS`  
2. Apply via controlled wrapper / GitHub workflow_dispatch (not Vercel build)  
3. Record migration inventory outcome  
4. Smoke Preview deploy against Preview DB  

### Alternate path — GAP-004A (no-cost; owner 2026-07-18)

When a paid second Supabase project is **not** authorized:

1. Keep GAP-004 **open / blocked** (isolation not proven)  
2. Adopt **Preview DB-disabled safety mode** — see [`GAP-004A-PREVIEW-DB-DISABLED-SAFETY-MODE.md`](GAP-004A-PREVIEW-DB-DISABLED-SAFETY-MODE.md)  
3. Plan packaged in CROW.GAP004.ALT1 · implement in ALT2+  
4. Preview may render public/local-first UI only; fail closed before any DB or hosted business mutation  
5. Hosted Discovery / Blueprint / tenant ops remain forbidden on Preview  

**This path mitigates bleed risk; it does not satisfy Phase 3 isolation proof.**

### Phase 5 — Decommission shared Preview posture

1. Remove / rotate any Preview env that still points at Production  
2. Update operator runbooks that still say `BACKEND_ISOLATION=shared` as default  
3. Mark GAP-004 **mitigated** only after isolation proof **or** accept GAP-004A as standing mitigation with GAP-004 remaining open  
4. Then reconsider hosted Discovery persistence / certify  

### Parallel track — GAP-015

Do **not** wait forever on GAP-004 to ignore Production auto-deploy risk. Prefer:

1. GAP-004 isolation **or** GAP-004A fail-closed (data plane)  
2. GAP-015 auto-deploy settings (release plane)  

Both before treating `main` → Production as routine.

---

## Owner decision checklist

| # | Decision | Options |
|---|----------|---------|
| D1 | Provision dedicated Preview Supabase? | Yes / **Defer (no-cost → GAP-004A)** ← owner chose |
| D2 | Bind Vercel Preview env to Preview project? | Yes / N/A while on GAP-004A (prefer **unset** Preview DB URLs) |
| D3 | End shared Preview→Production as normal mode? | Yes via isolation **or** via DB-disabled fail-closed |
| D4 | Authorize first Preview controlled migrate? | Only after isolation proof (not under GAP-004A) |
| D5 | Authorize any Discovery hosted persistence? | **No** until GAP-004 mitigated **or** separate owner exception |
| D6 | Change Vercel Production auto-deploy (GAP-015)? | Separate milestone |
| D7 | Authorize GAP-004A ALT2 implementation? | Pending owner “implement” |

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
