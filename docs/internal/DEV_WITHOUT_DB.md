# Developing when Supabase DB is paused or at quota

Use this when the free-tier project is **paused**, **unreachable**, or you want to avoid burning DB quota while coding.

---

## What still works

| Activity | Command / area |
|----------|----------------|
| TypeScript & JSX audit | `npm run typecheck`, `npm run audit:src` |
| Production build | `npm run build` (CI uses placeholder `DATABASE_URL`) |
| UI & components | Marketing pages, new forms, layout |
| Pure logic | `pricing.service.ts`, policies, billing helpers (no Prisma) |
| Stripe scaffold | `src/lib/billing/*` — env-only until keys + DB return |
| Docs | Any `docs/*.md` |

---

## What breaks without Postgres

Any route that calls **Prisma** at request time:

- `/admin/*` (overview, tenants, discovery, requests)
- `/[tenant]/*` workspaces
- `/discovery/[requestId]/*`
- `/blueprints/*` (loads blueprint from DB)
- `/request` submit, pipeline provision, smoke scripts

Build may log `Can't reach database server` during static generation for some `/sarea/*` routes; the build can still succeed.

---

## Safe local modes

### 1. Auth bypass (UI shell only)

In `.env` (never in production):

```env
AUTH_DISABLED=true
```

- Middleware skips Supabase session checks.
- `requirePlatformStaff()` / `requireTenantAccess()` return a dev user with `platform_admin` in `app_metadata`.
- **Prisma pages still fail** if they query the database.

Restart: `npm run dev`.

### 2. Local PostgreSQL (full app data, no Supabase DB quota)

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/crow_ecosystem?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/crow_ecosystem?schema=public"
```

Then:

```bash
npx prisma db push
npm run db:seed
```

Keep Supabase **Auth** URLs in `.env` if you still want Entra/email login; or use `AUTH_DISABLED=true` for data-only local work.

### 3. Resume Supabase when testing E2E

Dashboard → project → **Restore** / unpause. Wait ~1 minute, then retry `npm run dev` and admin routes.

---

## Recommended work while DB is down

1. **Stripe billing** — see [`STRIPE_BILLING.md`](STRIPE_BILLING.md) (scaffold, no live charges).
2. **Workflow runtime** — service + types; wire UI when DB is back.
3. **Marketing / CMS** — static or MDX pages.
4. **Admin “grant role” UI** — forms + server actions; test with DB later.

---

## Scripts that need a live DB

| Script | Needs |
|--------|--------|
| `npm run smoke:phase1` | Postgres |
| `npm run db:seed` | Postgres |
| `npm run auth:grant-tenant` | Postgres + Auth admin |
| `npm run auth:grant-role` | Auth admin API only |
| `npm run auth:list-users` | Auth admin API only |

Auth admin scripts may work if **Auth** is up but **Postgres** is paused (uncommon on paused free projects).

---

## Checklist before a demo day

- [ ] Supabase project restored
- [ ] `npm run typecheck && npm run build`
- [ ] Remove `AUTH_DISABLED` from `.env`
- [ ] Entra user has `crow_role` (`npm run auth:list-users`)
- [ ] Optional: `npm run smoke:phase1`
