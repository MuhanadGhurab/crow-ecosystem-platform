# GAP-004 — Owner Execution Checklist (Phases 1–3)

| Field | Value |
|-------|-------|
| **Title** | Owner manual steps for Preview DB isolation |
| **Status** | ACTIVE checklist — infrastructure actions are **owner-only** |
| **Authority** | [`GAP-004-DB-ISOLATION-PLAN.md`](GAP-004-DB-ISOLATION-PLAN.md) · CROW.GAP004.2 |
| **Date** | 2026-07-18 |
| **Issue** | [#16](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/16) |
| **Evidence log** | [`GAP-004-ISOLATION-EVIDENCE.md`](GAP-004-ISOLATION-EVIDENCE.md) |

**Do not paste full `DATABASE_URL` / passwords into git, Issue comments, or chat.**

---

## Safety rules

| Allowed | Forbidden |
|---------|-----------|
| Create dedicated Preview Supabase project | Point Preview at Production ref `wbwnsndcxrgyqwppurms` |
| Bind **Vercel Preview** env only | Change Production env without separate authorization |
| Record redacted refs / fingerprints | Commit secrets or dump env files |
| Run `npm run db-isolation-env:check` locally | Run migrations before isolation proven |
| Keep Production unchanged | Copy Production data into Preview unless separately authorized |

---

## Phase 1 — Provision Preview database (owner)

| # | Action | Done? |
|---|--------|-------|
| 1.1 | Create Supabase project (e.g. `crow-ecosystem-preview`) | ☐ |
| 1.2 | Record project **ref** in password manager (not git) | ☐ |
| 1.3 | Confirm Preview ref ≠ `wbwnsndcxrgyqwppurms` | ☐ |
| 1.4 | Obtain Preview pooler URI → candidate `DATABASE_URL` | ☐ |
| 1.5 | Obtain Preview session/direct URI → candidate `DIRECT_URL` | ☐ |
| 1.6 | Do **not** copy Production business data | ☐ |

Reference: [`C2_2_PREVIEW_DATABASE_SETUP_RUNBOOK.md`](../../architecture/crow-core/c2/C2_2_PREVIEW_DATABASE_SETUP_RUNBOOK.md)

---

## Phase 2 — Bind Vercel Preview env (owner dashboard)

Project: `crow-ecosystem-platform` · Team: `muhanadghurabs-projects`

| # | Action | Done? |
|---|--------|-------|
| 2.1 | Open Vercel → Project → Settings → Environment Variables | ☐ |
| 2.2 | Set **Preview** `DATABASE_URL` to Preview pooler only | ☐ |
| 2.3 | Set **Preview** `DIRECT_URL` to Preview direct only | ☐ |
| 2.4 | Set **Preview** `DATABASE_ENVIRONMENT=preview` | ☐ |
| 2.5 | Set **Preview** `BACKEND_ISOLATION=isolated` | ☐ |
| 2.6 | Set **Preview** `EXPECTED_DATABASE_FINGERPRINT` (from Preview URL) | ☐ |
| 2.7 | Confirm **Production** scope still uses Production URLs only | ☐ |
| 2.8 | Confirm Production `DATABASE_ENVIRONMENT=production` | ☐ |
| 2.9 | Confirm Preview env does **not** contain Production ref | ☐ |
| 2.10 | Confirm Production env does **not** contain Preview ref | ☐ |
| 2.11 | Do **not** set `ALLOW_DATABASE_MIGRATION` on Vercel | ☐ |
| 2.12 | Do **not** change Production auto-deploy settings here (GAP-015) | ☐ |

---

## Phase 3 — Isolation proof (redacted)

### A. Repo build safety (agent-verifiable)

| # | Check | Expected |
|---|-------|----------|
| 3.A1 | `vercel.json` buildCommand | No `db:migrate:deploy` / `migrate deploy` |
| 3.A2 | Build steps | `vercel-build-guard` + `db:generate` + `build` only |

### B. Local operator env comparison (optional, redacted)

```bash
npm run db-isolation-env:check -- --production-env-file=.env.production.runtime --preview-env-file=.env.preview.operator
```

| # | Check | Expected for PASS |
|---|-------|-------------------|
| 3.B1 | Preview Supabase ref ≠ Production ref | Required |
| 3.B2 | Preview ref ≠ `wbwnsndcxrgyqwppurms` | Required |
| 3.B3 | Script exit code | `0` and `PREVIEW_DATABASE_ISOLATION_PROVEN_COUNT=1` |
| 3.B4 | No secrets in stdout | Required |

**Note:** Local operator files are **not** Vercel dashboard proof. After Vercel bind, re-run with Preview/Production URLs pulled into disposable local files (never commit) or paste **only** redacted fingerprints into [`GAP-004-ISOLATION-EVIDENCE.md`](GAP-004-ISOLATION-EVIDENCE.md).

### C. Vercel dashboard evidence (owner)

| # | Record in evidence doc (redacted) | Done? |
|---|-----------------------------------|-------|
| 3.C1 | Production masked ref + fingerprint | ☐ |
| 3.C2 | Preview masked ref + fingerprint | ☐ |
| 3.C3 | Statement: refs differ | ☐ |
| 3.C4 | Statement: Production env unchanged this milestone | ☐ |
| 3.C5 | Statement: no migrate run; no hosted business writes | ☐ |

---

## Phase 4 — Controlled Preview migrate readiness (do not apply yet)

Only after Phase 3 proven:

| Criterion | Status |
|-----------|--------|
| Isolation proven | Required before any Preview migrate |
| Target env = Preview only | Required |
| Phrase `APPLY PREVIEW DATABASE MIGRATIONS` | Owner-only |
| `ALLOW_DATABASE_MIGRATION=true` | Operator machine / GitHub Environment only — never Vercel |
| Production connection string not loaded | Required |
| Rollback / restore strategy documented | Required |
| Explicit owner authorization recorded | Required |

**CROW.GAP004.2 does not authorize migrate apply.**

---

## Sign-off

| Role | Name | Date | Result |
|------|------|------|--------|
| Owner | | | Isolation proven / still blocked |
| Agent package | CROW.GAP004.2 | 2026-07-18 | Checklist + evidence workflow prepared |
