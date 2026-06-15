# C2.H — Migration baseline and CI Postgres hygiene (proposal)

**Track:** C2.H (follow-up — **not** part of C2 functional migration or C2.1 gate)  
**Purpose:** Document disposable-environment workaround and recommend durable baseline strategy.

---

## Disposable test workaround (C2 local gate)

Observed working sequence for isolated Docker Postgres:

1. `prisma db push` — apply C1.1-era schema baseline without full migration history on empty DB.
2. `prisma migrate resolve --applied` for each of the **13** pre-C2 migrations (`C1_MIGRATION_BASELINE`).
3. `prisma migrate deploy` — apply only migration #14 (`20260614120000_blueprint_versioning_traceability`).

**Why:** Empty CI/disposable databases lack production migration history; ordered `migrate deploy` from zero fails without baseline or seed migrations.

**C2.1 does not repair** hosted Preview/Production history using this workaround.

---

## Hosted Preview finding

Preview/staging hosted database has **full 14-migration history** including C2—likely from Vercel `buildCommand`:

```json
"buildCommand": "... npm run db:migrate:deploy && npm run build"
```

This conflates **deployment** with **gated migration review**.

---

## Recommendations (C2.H scope)

| Item | Proposal |
|------|----------|
| Stub init migration | Add documented empty or minimal init migration for greenfield deploys |
| CI Postgres | Use `db push` + resolve in CI only; never on hosted Preview/Production |
| Preview builds | Consider `migrate deploy` only when `DATABASE_URL` is Preview-isolated; or use build guard to skip migrate on PR previews |
| Baseline doc | Single source of truth for migration count (13 + C2) |
| `migrate resolve` | Operator-only, change-record required; never in agent gates |

---

## Separation from C2 / C2.1

| Phase | Scope |
|-------|--------|
| C2 | Additive migration #14 + runtime |
| C2.1 | Read-only Preview readiness |
| C2.H | History hygiene, CI, baseline — **future PR** |

Do not mix C2.H into PR #6 or C2.1 branch unless Preview readiness is impossible without it (current blocker is **isolation**, not missing baseline stubs).
