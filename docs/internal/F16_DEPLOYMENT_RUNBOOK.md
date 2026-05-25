# F16 — Deployment runbook (Vercel + Supabase)

**Audience:** Release operator  
**Scope:** Controlled production promotion — not feature development  
**No secrets** in this runbook.

---

## Preconditions

- F16 go/no-go matrix reviewed: [`F16_GO_NO_GO_MATRIX.md`](F16_GO_NO_GO_MATRIX.md)
- Environment governance complete: [`F16_PRODUCTION_ENVIRONMENT_GOVERNANCE.md`](F16_PRODUCTION_ENVIRONMENT_GOVERNANCE.md)
- Operator has Vercel + Supabase dashboard access (no passwords in tickets/chat)

---

## Pre-deploy checklist

| Step | Command / action | Pass criteria |
|------|------------------|---------------|
| 1 | `git status` | Clean or only intentional release commits |
| 2 | Confirm **no** `.env`, `.env.staging`, `.env.production` staged | `git diff --cached` empty for env files |
| 3 | `npm run typecheck` | Exit 0 |
| 4 | `npm run lint` | Exit 0 |
| 5 | `npm run build` | Exit 0 |
| 6 | `npm run public:mirror-manifest` | `docs/internal` in exclude list |
| 7 | `node --env-file=.env.staging scripts/validate-vercel-env.mjs` | No errors (warnings reviewed) |
| 8 | `npm run deploy:check:staging` or production-targeted check | No errors |
| 9 | Supabase **SQL** or Dashboard: migration status | `prisma migrate status` against prod `DIRECT_URL` — all applied |
| 10 | Vercel Production env vars | Match [`F16_PRODUCTION_ENVIRONMENT_GOVERNANCE.md`](F16_PRODUCTION_ENVIRONMENT_GOVERNANCE.md) |
| 11 | Supabase Auth URL config | Site URL + redirect URLs updated for prod host |
| 12 | Azure Entra redirect | `https://<ref>.supabase.co/auth/v1/callback` registered |

Optional local simulation:

```powershell
Set-Location D:\CYBERCROW
npm run simulate:vercel-build:staging
```

If simulate fails with Windows Prisma `EPERM` only: treat as **local tooling** issue if `npm run build` already passed (see [`F16_PRODUCTION_ENVIRONMENT_GOVERNANCE.md`](F16_PRODUCTION_ENVIRONMENT_GOVERNANCE.md)).

---

## Deploy procedure

### 1. Merge and push

- Merge release branch to `main` (or tagged release commit).
- Push to origin — Vercel production deployment triggers per project settings.

### 2. Monitor Vercel build

In Vercel deployment logs, confirm:

| Phase | Expected |
|-------|----------|
| Install | `npm install` / `postinstall` → `prisma generate` |
| Build | `next build` completes |
| Migrate (if configured) | `prisma migrate deploy` via `scripts/migrate-deploy.mjs` or build hook — **verify project docs** |
| Output | Production deployment **Ready** |

If build fails: **do not** promote; fix forward on a new commit.

### 3. Prisma migrate deploy (if not in build)

When running manually against production (use production `DIRECT_URL` locally — never log URL):

```powershell
Set-Location D:\CYBERCROW
npm run db:migrate:deploy
```

Only when `DIRECT_URL` in shell points at **production** session pooler and operator is authorized.

---

## Post-deploy smoke (minimum)

Use [`F16_HEALTH_SMOKE_CHECKLIST.md`](F16_HEALTH_SMOKE_CHECKLIST.md) for full matrix. Minimum bar:

| Check | URL / action | Expected |
|-------|--------------|----------|
| Health | `GET /api/health` | `ok: true`, `db: "ok"` (reduced JSON in prod) |
| Public home | `/` | 200, no error boundary |
| Public request | `/request` | Form loads; **do not** spam production intake |
| Login | `/login` | Auth UI loads |
| Admin gate | `/admin/overview` (logged out) | Redirect to `/login` |
| Admin (platform) | `/admin/overview` (logged in) | Command center loads |
| MEEM tenant | `/meem-global/dashboard` | Tenant dashboard (auth) |
| Rimal tenant | `/rimal-construction/dashboard` | Tenant dashboard (auth) |
| CyberCrow | `/meem-global/cybercrow/dashboard` | Advisory dashboard |
| SAREA studio | `/sarea/overview` | Platform staff only |
| Portal trap | `/portal` as platform staff | Redirect to `/admin/overview` unless `?preview=client` |

**Public intake POST:** Only run a safe test if using staging override email and ops approval — see [`PUBLIC_INTAKE_PROTECTION.md`](PUBLIC_INTAKE_PROTECTION.md).

Automated helpers (staging env file — run against **staging** before prod promotion):

```powershell
npm run meem:ids:staging
npm run sarea:meem-verify
npm run tenant:verify:rimal
npm run request:pipeline:verify
npm run request:e2e:dry
```

---

## Rollback procedure

### Application rollback (preferred)

1. Vercel → Deployments → select **previous successful** production deployment.
2. **Promote to Production** (instant rollback of app code + env snapshot tied to that deployment).
3. Re-run `GET /api/health` and admin login smoke.

This does **not** reverse database migrations.

### Database rollback policy

| Action | Policy |
|--------|--------|
| Revert app only | **Safe** — Vercel rollback |
| `prisma migrate reset` on production | **Forbidden** |
| Manual down-migration | Only with written plan + backup restore test |
| Restore from Supabase backup | Use Supabase PITR/backup when available — see [`F16_BACKUP_RESTORE_POSTURE.md`](F16_BACKUP_RESTORE_POSTURE.md) |

### When rollback is not enough

- Bad migration applied: stop traffic, restore DB from backup, redeploy last known-good app.
- Secret leak: rotate keys per [`SECRET_ROTATION.md`](SECRET_ROTATION.md), redeploy.

---

## Post-incident

- Record deployment ID, commit SHA, migration version, smoke results in internal release notes.
- Update [`PROJECT_STATUS.md`](PROJECT_STATUS.md) if production URL or milestone changes.

---

## Related

- [`VERCEL_CONNECT.md`](VERCEL_CONNECT.md)
- [`PRODUCTION_READINESS.md`](PRODUCTION_READINESS.md)
- [`RC1_STAGING_VALIDATION.md`](RC1_STAGING_VALIDATION.md)
