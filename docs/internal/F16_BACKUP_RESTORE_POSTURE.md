# F16 — Backup & restore posture

**Scope:** Operational assumptions for production launch — **no new backup automation** in F16  
**Audience:** Release owner, DBA/ops

---

## Principles

1. **Production data is authoritative** — staging seeds and demo scripts do not define prod behavior.
2. **Destructive commands are staging-only** unless explicitly approved for a named environment.
3. **Application rollback ≠ database rollback** — Vercel redeploy does not undo migrations.
4. **Restore must be rehearsed** before first real customer data in production.

---

## Supabase backup expectation

| Capability | Expectation |
|------------|-------------|
| **Point-in-time recovery (PITR)** | Enable on **production** Supabase project per org policy (paid tier) |
| **Daily backups** | Confirm in Supabase Dashboard → Database → Backups |
| **Cross-region** | Document RPO/RTO targets in org runbook (not in app repo) |
| **Connection strings** | After restore to new project, update **all** Vercel env vars for that environment |

Crow Ecosystem does not implement in-app backup jobs in F16.

---

## Migration discipline

| Action | Production policy |
|--------|-------------------|
| `prisma migrate deploy` | **Yes** — via CI/build or controlled operator run |
| `prisma migrate dev` | **No** on production database |
| `prisma migrate reset` | **Forbidden** on production |
| `prisma db push` | **Avoid** on production; prefer versioned migrations |
| Manual SQL | Reviewed change; document in migration or ops log |

Before prod deploy: `npx prisma migrate status` against production `DIRECT_URL` (credentials not logged).

---

## Seed scripts (staging / demo only)

| Script / area | Production use |
|---------------|----------------|
| `prisma/seed-meem.ts`, `seed-rimal`, Najm staging payloads | **Staging/demo** unless written approval |
| `TENANT_OPS_SEED` | **Off** in production by default |
| `npm run meem:ids:staging` | Resolves IDs in **staging** DB only |
| F11 discovery blueprint staging | Staging validation |

**MEEM / Rimal / Najm** demo tenants validate product paths; they are not automatic production provisioning.

---

## Restore strategy (high level)

1. **Detect** incident (data corruption, bad migration, accidental delete).
2. **Stop** writes if needed (maintenance mode / pause deploys — org decision).
3. **Identify** recovery point (timestamp before incident).
4. **Restore** via Supabase backup/PITR to new or existing project per Supabase docs.
5. **Reconcile** env vars on Vercel to restored project if ref changed.
6. **Redeploy** last known-good application build.
7. **Smoke** per [`F16_HEALTH_SMOKE_CHECKLIST.md`](F16_HEALTH_SMOKE_CHECKLIST.md).
8. **Postmortem** and migration fix forward if schema drift caused incident.

**Test restore** on a **clone** project before relying on this path for customers.

---

## What F16 does not implement

- Automated backup scheduling in repo
- Cross-cloud backup replication
- Tenant-level export/restore UI
- Stripe billing data restore (future billing)

---

## Related

- [`F16_DEPLOYMENT_RUNBOOK.md`](F16_DEPLOYMENT_RUNBOOK.md) — Rollback section
- [`F16_GO_NO_GO_MATRIX.md`](F16_GO_NO_GO_MATRIX.md)
- [`SECRET_ROTATION.md`](SECRET_ROTATION.md) — After compromise
