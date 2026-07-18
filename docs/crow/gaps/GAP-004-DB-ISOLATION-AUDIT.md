# GAP-004 — Preview/Production Database Isolation Audit

| Field | Value |
|-------|-------|
| **Title** | Preview / Production DB isolation — audit evidence |
| **Status** | AUDIT COMPLETE — isolation **not proven**; remediation pending owner decision |
| **Authority** | [`GAP-LEDGER.md`](../GAP-LEDGER.md) GAP-004 · CROW.GAP004.1 |
| **Date** | 2026-07-18 |
| **Branch / HEAD** | `feat/first-tenant-golden-path` @ `a210013` (start) |
| **Issue** | [#16](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/16) |
| **Milestone** | [`../milestones/CROW-GAP004-1.md`](../milestones/CROW-GAP004-1.md) |
| **Plan** | [`GAP-004-DB-ISOLATION-PLAN.md`](GAP-004-DB-ISOLATION-PLAN.md) |

**This audit did not change Vercel settings, env vars, databases, or apply migrations.**

---

## 1. Executive finding

| Finding | Evidence |
|---------|----------|
| **Isolation not proven** | C2.1 read-only audit classified hosted Preview credentials as shared with Production Supabase ref `wbwnsndcxrgyqwppurms` |
| **Build-time migrate risk mitigated in code** | `vercel.json` no longer runs `db:migrate:deploy` (C2.2) |
| **Shared-backend operating mode still documented** | FTGP / C3 runbooks use `DATABASE_ENVIRONMENT=production` + `BACKEND_ISOLATION=shared` for Preview-class work |
| **Dedicated Preview Postgres** | Not verified as provisioned / bound in this audit |
| **GAP-004 status** | Remains **open / blocked** for hosted persistence, Discovery hosted certify, and unconstrained Preview testing |

**Audit verdict:** Preview and Production database isolation is **not certified**. Engineering controls reduce accidental migrate-on-build risk, but **data plane sharing remains the primary residual risk**.

---

## 2. Current Vercel environments

| Item | Verified value |
|------|----------------|
| Team | `muhanadghurabs-projects` (`team_JsNIQlTitYCs1yjig631FnF5`) |
| Project | `crow-ecosystem-platform` (`prj_lsHQMiMZskg8CzRVd4EHfiAo8o7h`) |
| Framework | Next.js |
| Production domain (canonical) | `https://crow-ecosystem-platform.vercel.app` |
| Documented live Production deployment | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` (owner brief / CURRENT-STATE) |
| Additional domains | `*-muhanadghurabs-projects.vercel.app`, `*-git-main-*.vercel.app` |
| Secondary / non-authoritative project (historical) | `crow-ecosystem-platform-hsod` (C2.1 — not authoritative) |

### Environment classes (Vercel-native)

| `VERCEL_ENV` | Typical use |
|--------------|-------------|
| `production` | Production target / Production domain |
| `preview` | PR / branch Preview deployments |
| `development` | Vercel “Development” env (local link) |

**Not audited in this pass (by design):** live Vercel Environment Variable **values** (secrets). Binding must be confirmed by owner/operator dashboard review using the checklist in the plan doc — without pasting credentials into git.

---

## 3. Current `DATABASE_URL` / `DIRECT_URL` usage

| Consumer | Behavior |
|----------|----------|
| Runtime Prisma (`src/lib/db.ts`) | Prefers `DIRECT_URL` for datasource when set; otherwise default Prisma env |
| Vercel build | `vercel-build-guard.mjs` requires remote (non-localhost) `DATABASE_URL`; then `db:generate` only |
| Controlled migration | `scripts/run-controlled-migration.ts` — fingerprint + phrase + `ALLOW_DATABASE_MIGRATION` |
| Operator scripts | Many scripts load `.env.staging*` / `.env.preview*` / `.env.local` — must not be treated as isolated Preview unless fingerprints prove it |
| Health / warnings | `collectDatabaseEnvironmentWarnings()` can surface Preview/Production pairing mismatches |

### Documented Production / shared hosted project

| Field | Value |
|-------|-------|
| Supabase project ref (documented) | `wbwnsndcxrgyqwppurms` |
| C2.1 audit fingerprint (masked) | `0355c17692e2a90d` (see C2.1 evidence docs) |
| Pooler guidance | `DATABASE_URL` → transaction pooler (6543 / `pgbouncer`) |
| Direct guidance | `DIRECT_URL` → session pooler / direct (5432) — see `docs/internal/PRODUCTION_READINESS.md` |

---

## 4. Preview vs Production env var separation

### Intended model (C2.2)

| Variable | Production | Isolated Preview (target) |
|----------|------------|---------------------------|
| `DATABASE_URL` | Production pooler | **Different** Preview pooler |
| `DIRECT_URL` | Production direct | **Different** Preview direct |
| `DATABASE_ENVIRONMENT` | `production` | `preview` |
| `EXPECTED_DATABASE_FINGERPRINT` | Production hash | Preview hash |
| `BACKEND_ISOLATION` | `isolated` (preferred) | `isolated` |
| `ALLOW_DATABASE_MIGRATION` | **Never** on Vercel | **Never** on Vercel |

### Observed / documented interim model

| Pattern | Meaning |
|---------|---------|
| `APP_ENVIRONMENT` / `VERCEL_ENV=preview` + `DATABASE_ENVIRONMENT=production` | Explicit **shared production backend** pairing |
| `BACKEND_ISOLATION=shared` | Required acknowledgment for controlled checks against shared DB |
| `db:migrate:controlled:check-preview` with `--allow-shared-production-backend` | Check-only against shared backend — **not** isolation proof |

**Conclusion:** Code supports both isolated and shared pairings. Current operational evidence and historical audits indicate **shared** remains the real hosted posture until a dedicated Preview project is provisioned and bound.

---

## 5. Migration scripts inventory

| Script / npm | Role | Hosted risk |
|--------------|------|-------------|
| `db:migrate` (`prisma migrate dev`) | Local interactive | Local only if env is local |
| `db:migrate:deploy` (`migrate-deploy.mjs`) | Raw deploy wrapper | **High** if pointed at hosted URL |
| `db:migrate:controlled` | Fingerprint + phrase gate | Medium — intended path; still mutates if apply authorized |
| `db:migrate:controlled:check-preview` | Check-only shared acknowledgment | Low (check-only) |
| `db:migrate:baseline` | Resolve baseline | High if misused on hosted |
| `local:db:migrate` | Disposable local | Local |
| `simulate-vercel-build` | Build simulation | Must not reintroduce migrate |

---

## 6. Hosted-write / seed / backfill scripts (risk class)

Examples (not exhaustive): `db:seed:*`, `tenant:seed:*`, `blueprint-persistence:backfill`, `notifications:backfill`, CEM/SAREA/CyberCrow backfill seeds, FTGP operator scripts with env-file chains.

| Rule while GAP-004 open | Source |
|-------------------------|--------|
| No hosted business writes from agents/automation without owner authorization | `16-PRODUCTION-DEPLOYMENT-POLICY.md` §7 |
| Do not treat shared Preview/Production DB as a sandbox | Same |
| Discovery MVP D0–D6 remains local-first (no hosted Discovery persistence) | MVP-CERT.1 |

**This milestone did not run any hosted write or seed scripts.**

---

## 7. Prisma migrate / deploy behavior

### Application build (`vercel.json`)

```text
node scripts/vercel-build-guard.mjs && npm run db:generate && npm run build
```

- **Does:** Prisma generate + Next build  
- **Does not:** `migrate deploy`, `db push`, seed, backfill  

### Controlled delivery

- `run-controlled-migration.ts` requires environment alignment, fingerprints, confirmation phrase, and `ALLOW_DATABASE_MIGRATION=true` for apply  
- Phrases: `APPLY PREVIEW DATABASE MIGRATIONS` / `APPLY PRODUCTION DATABASE MIGRATIONS`

### Historical incident (mitigated in build)

C2.2 record: Preview builds previously ran `db:migrate:deploy`, applying schema (including C2) onto the shared hosted DB. Build migrate removed; **schema already present** on shared DB; isolation remains forward-fix.

---

## 8. Risk: Preview writing to Production DB

| Path | Likelihood while shared | Notes |
|------|-------------------------|-------|
| Build-time migrate | **Low now** | Removed from `vercel.json` |
| Runtime app writes (auth, requests, Discovery if hosted enabled) | **High** | Preview app would mutate Production data if URLs shared |
| Operator scripts with staging/preview env files | **High** | Easy to aim at shared ref |
| Controlled migrate apply with shared acknowledgment | **Medium** | Explicit phrase required; still Production-impacting |

---

## 9. Risk: Production using Preview DB

| Path | Likelihood | Notes |
|------|------------|-------|
| Mis-set Production `DATABASE_URL` to Preview project | Low if owner careful; **High impact** if happens | Would orphan Production data / break live |
| Fingerprint mismatch guards | Helps when configured | Fail closed for C2 mutations when misaligned |

---

## 10. Required owner decisions

1. **Authorize dedicated Preview Supabase project** (new ref ≠ `wbwnsndcxrgyqwppurms`)  
2. **Authorize Vercel Preview env binding** to Preview URLs + `DATABASE_ENVIRONMENT=preview` + Preview fingerprint  
3. **Confirm Production env** remains Production-only (`DATABASE_ENVIRONMENT=production`, Production fingerprint)  
4. **Decide interim shared mode end date** — stop documenting Preview→Production as normal  
5. **Authorize first controlled Preview migrate** only after isolation proven (check-only green on Preview fingerprint)  
6. **Do not** authorize Discovery hosted persistence, Blueprint drafting on hosted, or `main`/Production movement as part of this audit  

---

## 11. Recommended safe implementation path

See [`GAP-004-DB-ISOLATION-PLAN.md`](GAP-004-DB-ISOLATION-PLAN.md).

Summary order:

1. Owner provisions Preview Supabase  
2. Owner sets Vercel Preview env (no agent edits)  
3. Check-only controlled migrate against Preview  
4. Owner authorizes Preview migrate apply  
5. Re-audit fingerprint ≠ Production ref  
6. Only then consider hosted Discovery persistence / certify  

**Parallel (not substitute):** GAP-015 Production auto-deploy settings gate.

---

## 12. Evidence references

| Doc / artifact | Role |
|----------------|------|
| [`C2_1_PREVIEW_MIGRATION_READINESS.md`](../../architecture/crow-core/c2/C2_1_PREVIEW_MIGRATION_READINESS.md) | Isolation not proven |
| [`C2_1_PREVIEW_DATABASE_AUDIT.md`](../../architecture/crow-core/c2/C2_1_PREVIEW_DATABASE_AUDIT.md) | Shared ref evidence |
| [`C2_2_SHARED_DATABASE_INCIDENT_RECORD.md`](../../architecture/crow-core/c2/C2_2_SHARED_DATABASE_INCIDENT_RECORD.md) | Build migrate incident |
| [`C2_2_DATABASE_ENVIRONMENT_ISOLATION.md`](../../architecture/crow-core/c2/C2_2_DATABASE_ENVIRONMENT_ISOLATION.md) | Control model |
| [`C2_2_PREVIEW_DATABASE_SETUP_RUNBOOK.md`](../../architecture/crow-core/c2/C2_2_PREVIEW_DATABASE_SETUP_RUNBOOK.md) | Provisioning steps |
| [`16-PRODUCTION-DEPLOYMENT-POLICY.md`](../16-PRODUCTION-DEPLOYMENT-POLICY.md) §6–7 | Policy while GAP-004 open |
| `vercel.json` | Current buildCommand |
| `scripts/lib/database-environment.ts` | Alignment / shared pairing |

---

## 13. What this audit did **not** do

- Change Vercel project settings or env vars  
- Apply migrations  
- Write hosted business data  
- Deploy Production  
- Push `main`  
- Merge PR #10  
- Enable Discovery hosted persistence or Blueprint generation  
- Dump live secret values into the repository
