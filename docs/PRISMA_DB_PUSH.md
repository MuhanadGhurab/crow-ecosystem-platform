# Prisma `db push` — how CYBERCROW syncs Postgres

**Purpose:** Plain-language guide for syncing `prisma/schema.prisma` to PostgreSQL without rewriting migrations. Use with local Postgres ([`LOCAL_POSTGRES_SETUP.md`](LOCAL_POSTGRES_SETUP.md)) or Supabase.

---

## What `db push` does

`prisma db push` reads **`prisma/schema.prisma`** and makes the database match it:

- Creates missing **tables**, **columns**, **enums**, and **indexes**
- Alters columns when the schema changed (dev-friendly; can prompt or use `--accept-data-loss` in risky cases)
- Does **not** run **`npm run db:seed`** — seed is a separate step
- Regenerates the Prisma Client by default after a successful push

For CYBERCROW today that means roughly **74 models** → **74 `public` tables** (implementation requests, discovery, blueprints, tenants, CEM, CyberCrow, SAREA, notifications, etc.) — everything Phase 3+ needs to **persist** data instead of mocks.

---

## What it does *not* do

| Not included | Use instead |
|--------------|-------------|
| Demo / catalog rows | `npm run db:seed` |
| MEEM lighthouse tenant | `npm run db:seed:meem` |
| Production migration history | `npm run db:migrate:deploy` |
| Supabase Auth users | `npm run auth:bootstrap` |

---

## `db push` vs `migrate deploy`

| | **`prisma db push`** | **`prisma migrate deploy`** |
|--|----------------------|-----------------------------|
| **Input** | Current `schema.prisma` | SQL files in `prisma/migrations/` |
| **History** | No `_prisma_migrations` rows required | Records each applied migration |
| **Best for** | Local dev, Supabase sandbox, “make DB match schema now” | CI/production, audited schema changes |
| **CYBERCROW** | Fast Phase 3 setup on `crow_ecosystem` | Use when you rely on migration files only |

**Note:** If you previously used `db push`, `npm run db:status` may report migrations as “not yet applied” even when tables exist. That is normal when schema was synced via push instead of `migrate deploy`. For a fresh local DB, `db push` alone is enough to start the app; use `migrate deploy` when you want migration history aligned with production.

---

## Environment variables

Prisma loads **`.env`** from the project root.

| Variable | Used for |
|----------|----------|
| `DATABASE_URL` | Runtime (Next.js / Prisma Client); Supabase often uses pooler **:6543** |
| `DIRECT_URL` | **`db push`**, `migrate`, Studio — must reach Postgres on **:5432** (local or Supabase session pooler) |

**Local:** both URLs should be identical (no pooler):

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/crow_ecosystem?schema=public"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/crow_ecosystem?schema=public"
```

**Supabase:** `DATABASE_URL` = transaction pooler `:6543`; `DIRECT_URL` = `:5432` (see [`.env.example`](../.env.example)).

---

## Standard bootstrap sequence

Run from repo root after `.env` has a valid `DATABASE_URL` / `DIRECT_URL` (local `localhost:5432` or Supabase pooler). Stop on the first failure.

| Step | Command | What it does |
|------|---------|--------------|
| 1 | `npm run db:validate` | Checks `prisma/schema.prisma` syntax and relations (no DB connection). |
| 2 | `npm run db:generate` | Generates `@prisma/client` from the schema. |
| 3 | `npm run db:push` | Syncs Postgres tables/indexes to match the schema (`DIRECT_URL`). |
| 4 | `npm run db:tables` | Prints `public_table_count` (expect **74** after push). |
| 5 | `npm run db:seed` | Inserts base catalog (plans, permissions) — required before MEEM. |
| 6 (optional) | `npm run db:seed:meem` | Lighthouse MEEM tenant (`meem-global`) — only after step 5 succeeds. |

```bash
npm run db:validate
npm run db:generate
npm run db:push
npm run db:tables
npm run db:seed
npm run db:seed:meem   # optional; idempotent if CROW-2026-MEEM already exists
```

Local Postgres setup: [`LOCAL_POSTGRES_SETUP.md`](LOCAL_POSTGRES_SETUP.md). Windows push without editing `.env`: `npm run db:push:local` (see [Commands](#commands-copy-paste) below).

---

## Commands (copy-paste)

From repo root (`d:\CYBERCROW`):

### A) Using `.env` (local or Supabase URLs already set)

```bash
npm run db:validate
npm run db:generate
npm run db:push
npm run db:tables
npm run db:seed
```

Optional MEEM data after base seed:

```bash
npm run db:seed:meem
```

### B) Local Postgres without editing `.env` (Windows)

```powershell
$env:CROW_LOCAL_PG_PASSWORD = "your-postgres-password"
npm run db:push:local
npm run db:seed
```

`db:push:local` sets `DATABASE_URL` and `DIRECT_URL` to `localhost:5432/crow_ecosystem` for that shell only.

### C) Check migration history (optional)

```bash
npm run db:status
```

---

## Expected output

### `npm run db:validate`

```text
The schema at prisma\schema.prisma is valid 🚀
```

### `npm run db:push`

**First run** (empty database):

```text
🚀  Your database is now in sync with your Prisma schema. Done in Xms
✔ Generated Prisma Client ...
```

**Already synced:**

```text
The database is already in sync with the Prisma schema.
✔ Generated Prisma Client ...
```

### `npm run db:tables`

```text
public_table_count=74
```

(Count should match the number of `model` entries in `schema.prisma`.)

### Health check (app running)

```bash
curl http://localhost:3000/api/health
```

With a reachable DB: `"db":"ok"`.

---

## What this unlocks in CYBERCROW

After push + seed:

- **Discovery** — save discovery profiles to Postgres
- **Implementation requests** — `POST /api/implementation-requests` persists
- **Blueprints & commercial** — live blueprint/pricing data
- **Admin queue** — real pipeline list (not only `USE_MOCK_DATA`)
- **MEEM lighthouse** — `db:seed:meem` tenant routes
- **`GET /api/health`** — `db: "ok"` when `DATABASE_URL` works

Phase 3 exit criteria in [`PHASES.md`](PHASES.md) depend on this data layer being live.

---

## npm scripts reference

| Script | Command |
|--------|---------|
| `db:validate` | `prisma validate` |
| `db:generate` | `prisma generate` |
| `db:push` | `prisma db push` (uses `.env`) |
| `db:push:local` | `scripts/db-push-local.ps1` (localhost only) |
| `db:status` | `prisma migrate status` |
| `db:tables` | Count `public` tables via Prisma |
| `db:seed` | Base demo seed |
| `db:migrate` | `prisma migrate dev` |
| `db:migrate:deploy` | `prisma migrate deploy` (production-style) |

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Can't reach database server` | Start Postgres ([`LOCAL_POSTGRES_SETUP.md`](LOCAL_POSTGRES_SETUP.md)); confirm `Test-NetConnection localhost -Port 5432` |
| Push hangs / fails on Supabase | Use `DIRECT_URL` on port **5432**; unpause project in dashboard |
| `db:status` shows unapplied migrations | Expected if you only used `db push`; use `migrate deploy` to align history, or keep using push for local dev |
| Wrong database | Check which host `db push` prints (`localhost` vs `pooler.supabase.com`) |

---

## Related docs

- [`LOCAL_POSTGRES_SETUP.md`](LOCAL_POSTGRES_SETUP.md) — pgAdmin, `crow_ecosystem`, local push section
- [`BASELINE.md`](BASELINE.md) — verification gate, UI-only vs full stack
- [`DEV_WITHOUT_DB.md`](DEV_WITHOUT_DB.md) — mocks without Postgres
