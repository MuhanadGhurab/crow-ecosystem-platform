# Production readiness (Phase F1)

Operational checklist for deploying Crow Ecosystem to Vercel + Supabase. No secrets in this document.

## RC1 status

Staging validation passed (see `RC1_STAGING_VALIDATION.md`). Phase F1 adds **public intake protection** and deployment hygiene — not new product features.

---

## Required environment variables (Vercel)

Set these in the **Vercel project → Settings → Environment Variables** for Preview and Production. Vercel does **not** read `.env.staging` from the repo automatically.

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Supabase **transaction** pooler (port **6543**, `?pgbouncer=true`) |
| `DIRECT_URL` | Supabase **session** pooler (port **5432**, no `pgbouncer`) |
| `NEXT_PUBLIC_SITE_URL` | Canonical deployed URL (e.g. `https://your-app.vercel.app`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon / publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only admin operations (never expose to client) |
| `AUTH_DISABLED` | Must be `false` or unset in production |
| `USE_MOCK_DATA` | Must be `false` or unset in production |

Validate locally before deploy:

```powershell
Set-Location D:\CYBERCROW
npm run validate:vercel-env
npm run env:check
```

Use staging env file for preflight:

```powershell
node --env-file=.env.staging scripts/validate-vercel-env.mjs
```

---

## Optional environment variables

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Pipeline notification email (Resend) |
| `NOTIFICATION_FROM_EMAIL` | From address for notifications |
| `PIPELINE_NOTIFY_EMAIL_OVERRIDE` | Route all pipeline emails to one inbox (staging) |
| `PLATFORM_NOTIFY_EMAIL` | Platform ops inbox |
| `TURNSTILE_ENABLED` | `true` to require Cloudflare Turnstile on `/request` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Turnstile site key (widget) |
| `TURNSTILE_SECRET_KEY` | Turnstile secret (server verify) |
| `STRIPE_*` | Billing (optional until live checkout) |
| `HEALTH_DETAIL` | `verbose` or `minimal` to override health JSON shape |

---

## Public intake protection (F1)

| Control | Status |
|---------|--------|
| Zod validation + max field lengths | **Implemented** |
| 256 KiB `Content-Length` cap | **Implemented** |
| Honeypot field (`companyWebsite`) | **Implemented** |
| In-memory rate limit (5 / IP / 10 min) | **Implemented** (per instance; not global on Vercel) |
| Cloudflare Turnstile | **Optional** (`TURNSTILE_ENABLED=true`) |
| Vercel Firewall / WAF | **Recommended** (configure in Vercel dashboard) |
| Upstash Redis rate limit | **Planned** (multi-instance consistency) |

Details: `PUBLIC_INTAKE_PROTECTION.md`, `API_SECURITY.md`.

---

## Health endpoint policy

`GET /api/health`

| Environment | Default response |
|-------------|------------------|
| `NODE_ENV !== production` | Full detail (auth, migrations, Stripe flags, …) |
| `NODE_ENV === production` | Reduced: `ok`, `db`, `deployReady` only |
| `HEALTH_DETAIL=verbose` | Full detail even in production |
| `HEALTH_DETAIL=minimal` | Reduced detail in non-production |

Staging smoke tests can set `HEALTH_DETAIL=verbose` on the Preview environment.

---

## Supabase Auth configuration

### Site URL and redirects

In Supabase Dashboard → **Authentication → URL configuration**:

| Setting | Value |
|---------|--------|
| **Site URL** | Deployed app URL (same as `NEXT_PUBLIC_SITE_URL`) |
| **Redirect URLs** | `https://<deployed-host>/auth/callback` |
| (development) | `http://localhost:3000/auth/callback` if needed locally |

### Microsoft / Azure (Entra ID)

Azure App Registration redirect URI must be the **Supabase** callback, not the Vercel app directly:

```text
https://<project-ref>.supabase.co/auth/v1/callback
```

Do not point Azure redirect to `localhost` or Vercel `/auth/callback` alone.

---

## Files that must never be committed

- `.env`, `.env.local`, `.env.staging`, `.env.production`
- Service role keys, database passwords, Stripe secrets, Turnstile secrets
- Screenshots containing credentials

`.env.example` is the template only (no real values).

---

## Public vs internal documentation

| Path | Audience |
|------|----------|
| `docs/public/` | Sanitized roadmap and product docs |
| `docs/internal/` | Operations, security, deploy runbooks |

Public mirror manifest excludes `docs/internal`:

```powershell
npm run public:mirror-manifest
```

---

## Post-deploy manual checklist

After promoting a Preview or Production deployment:

1. Open `/` — home loads, no console auth errors.
2. Open `/request` — wizard renders; Turnstile widget appears only if `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set.
3. Submit a **safe test request** (clearly marked test org name) — expect `201` and reference code.
4. Sign in as platform staff → `/admin/overview` (not stuck on `/portal/requests`).
5. Open `/admin/requests` — test request visible in queue.
6. `GET /api/health` — `ok: true`, `db: ok` when DB configured.
7. Open `/portal/requests` as **unauthenticated** user — redirected to login (not admin).
8. Confirm anonymous user cannot open `/admin/*`.
9. Optional: `npm run smoke:phase1` against deployed URL if scripted checks are configured.

---

## Windows: Prisma generate EPERM (F4)

On Windows, repeated `npm run simulate:vercel-build:staging` (or `db:generate`) can fail with **EPERM** when `query_engine-windows.dll.node` is locked by a running `node` process (e.g. `npm run dev`, Prisma Studio, or a stuck Next.js server).

**Workaround (do not skip generate in CI):**

1. Stop local dev servers (`Ctrl+C` in terminals running `next dev` or `prisma studio`).
2. Optional check: `npm run warn:prisma-lock` — warns if Node processes are still running.
3. If needed: `Get-Process node | Stop-Process -Force` in PowerShell (closes all Node processes).
4. Re-run `npm run simulate:vercel-build:staging`.

Vercel/Linux builds are unaffected. If `npm run build` succeeds but simulate fails only on `prisma generate` with EPERM, treat it as a **local environment** issue, not a code defect.

---

## Related internal docs

- `VERCEL_CONNECT.md` — pooler URLs and env wiring
- `API_SECURITY.md` — route auth and intake hardening
- `PUBLIC_INTAKE_PROTECTION.md` — rate limit and Turnstile operations
- `RC1_STAGING_VALIDATION.md` — staging sign-off
- `RESEND_SETUP.md` — notification email

---

## Explicitly out of scope (F1)

- Stripe payment enforcement
- Runtime capability blocking by plan
- SCIM / Entra group automation
- Scheduled digest emails
- Public marketing redesign
- Major schema changes
