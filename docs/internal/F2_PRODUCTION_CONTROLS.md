# Phase F2 — Production controls on deployed host

**Date:** 25 May 2026  
**Staging URL:** `https://crow-ecosystem-platform.vercel.app`  
**Scope:** Enable and validate public intake protection on Vercel — no new product features.

---

## 1. Vercel environment checklist

Set in **Vercel → Project → Settings → Environment Variables** (Preview + Production). Vercel does **not** load `.env.staging` from the repo.

### Required (must match pooler + auth)

| Variable | Notes |
|----------|--------|
| `DATABASE_URL` | Transaction pooler **6543** + `?pgbouncer=true` |
| `DIRECT_URL` | Session pooler **5432**, no `pgbouncer` |
| `NEXT_PUBLIC_SITE_URL` | **`https://crow-ecosystem-platform.vercel.app`** (use `https`, not `http`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Client auth |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only |
| `AUTH_DISABLED` | `false` or unset |
| `USE_MOCK_DATA` | `false` or unset |

### Turnstile (optional until keys exist)

| Variable | When |
|----------|------|
| `TURNSTILE_ENABLED` | `true` only when both keys below are set |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Server secret |

If keys are **not** available: leave `TURNSTILE_ENABLED` unset or `false`. Intake still uses Zod, payload cap, honeypot, and in-memory rate limit (per instance).

Preflight from repo:

```powershell
Set-Location D:\CYBERCROW
node --env-file=.env.staging scripts/f2-env-status.mjs
npm run validate:vercel-env
```

---

## 2. Supabase Auth URLs

**Supabase → Authentication → URL configuration**

| Setting | Value |
|---------|--------|
| Site URL | `https://crow-ecosystem-platform.vercel.app` |
| Redirect URLs | `https://crow-ecosystem-platform.vercel.app/auth/callback` |
| (local dev) | `http://localhost:3000/auth/callback` optional |

**Azure / Entra** redirect URI (App Registration):

```text
https://<project-ref>.supabase.co/auth/v1/callback
```

Not the Vercel host alone, and not `localhost` in production.

---

## 3. Redeploy

After changing env vars:

1. Vercel → **Deployments** → **Redeploy** latest production (or push to `main` if Git integration is enabled).
2. Wait for build: `vercel-build-guard` → `db:generate` → `db:migrate:deploy` → `next build`.
3. Confirm deployment URL matches `NEXT_PUBLIC_SITE_URL`.

Local simulate before push:

```powershell
npm run simulate:vercel-build:staging
```

---

## 4. Automated smoke (unauthenticated)

Replace base URL if using a custom domain.

```powershell
$base = "https://crow-ecosystem-platform.vercel.app"

# Health (production-minimal JSON)
Invoke-RestMethod "$base/api/health"

# Public pages
curl.exe -sS -o NUL -w "home: %{http_code}`n" "$base/"
curl.exe -sS -o NUL -w "request: %{http_code}`n" "$base/request"

# Admin blocked without session
curl.exe -sS -I "$base/admin/overview"
# Expect: 307 → /login?next=%2Fadmin%2Foverview

# List API requires platform staff
curl.exe -sS -o NUL -w "GET intake list: %{http_code}`n" "$base/api/implementation-requests"
# Expect: 403
```

POST test (use a clearly marked test org; delete from `/admin/requests` after sign-in):

```powershell
curl.exe -sS -X POST "$base/api/implementation-requests" `
  -H "Content-Type: application/json" `
  --data-binary "@scripts/f2-smoke-payload.json"
# Expect: 201 + referenceCode
```

---

## 5. Manual checks (authenticated)

| Step | Expected |
|------|----------|
| Sign in as platform staff | Lands on `/admin/overview` (not stuck on portal) |
| `/admin/requests` | Test submission visible (e.g. reference `CROW-2026-*`) |
| `/portal/requests` as client | Portal only; no admin nav |
| Unauthenticated `/admin/*` | Redirect to login |

---

## 6. Vercel Firewall (recommended, dashboard only)

Not in repo — configure in Vercel:

- Rate limit or challenge on `POST /api/implementation-requests`
- Optional: geo / bot rules for `/request`

See `PUBLIC_INTAKE_PROTECTION.md`.

---

## 7. F2 status summary

| Item | Status |
|------|--------|
| F1 code on `main` | Committed (`feat(security): harden public intake protection`) |
| Turnstile on Vercel | **Prepared, not active** (no keys in staging file) |
| `NEXT_PUBLIC_SITE_URL` in `.env.staging` | **`http://`** — fix to **`https://`** on Vercel |
| Deployed health | Verified `ok`, `db`, `deployReady` |
| Public intake POST | Verified `201` on deployed host |
| Admin route (unauth) | Verified `307` → login |
| Turnstile widget on `/request` | Hidden until site key env is set |

---

## Related

- `PRODUCTION_READINESS.md`
- `PUBLIC_INTAKE_PROTECTION.md`
- `API_SECURITY.md`
- `VERCEL_CONNECT.md`
- `RC1_STAGING_VALIDATION.md`
