# F18 — Auth validation checklist

**Phase:** F18 — Google Sign-In integration & auth UX polish  
**Use when:** enabling Google on staging/production or after auth UX changes.

---

## Supabase Dashboard

- [ ] Google provider **enabled**
- [ ] Google Client ID and Client Secret saved (not in git)
- [ ] **Site URL** matches deployed app (HTTPS in production)
- [ ] **Redirect URLs** include `https://<host>/auth/callback` (and dev URL if used)
- [ ] Azure provider still configured if Microsoft login is required
- [ ] Email provider still enabled if email/password is required

---

## Google Cloud Console

- [ ] OAuth client type: Web application
- [ ] Authorized redirect URI = `https://<PROJECT_REF>.supabase.co/auth/v1/callback` (exact match)
- [ ] OAuth consent screen configured
- [ ] Scopes limited to openid / email / profile (via Supabase)

---

## Application environment

- [ ] `NEXT_PUBLIC_SUPABASE_URL` set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` or publishable key set
- [ ] `GOOGLE_SSO_ENABLED=true` where Google button should appear
- [ ] `AZURE_SSO_ENABLED=true` + `NEXT_PUBLIC_AZURE_TENANT_ID` if Microsoft required
- [ ] `NEXT_PUBLIC_SITE_URL` is HTTPS on production (see `validate:vercel-env` warnings)
- [ ] No Google Client Secret in `.env` or Vercel (Supabase only)

---

## Automated validation (repo)

Run from repo root:

```powershell
Set-Location D:\CYBERCROW
npm run typecheck
npm run lint
npm run build
npm run public:mirror-manifest
npm run validate:vercel-env
```

Optional staging simulate (Windows Prisma EPERM may fail — not an app regression if `build` passed):

```powershell
npm run simulate:vercel-build:staging
```

---

## Manual sign-in matrix

| Method | Expected | Pass? |
|--------|----------|-------|
| Email/password (user with `crow_role`) | Lands on role-appropriate home | |
| Email/password (invalid) | Inline error, no crash | |
| Microsoft / Entra | Redirect to Microsoft → `/auth/callback` → role-based destination | |
| Google | Redirect to Google → `/auth/callback` → role-based destination | |
| Google, `GOOGLE_SSO_ENABLED` not true | Button hidden or `google_not_configured` if hitting `/auth/google` | |
| Google user, no `crow_role`, no linked requests | `/login?error=no_role`, signed out | |
| Google user, no role, email matches portal requests | Client portal path (existing auto-link) | |
| Platform admin (`crow_role: platform_admin`) | `/admin/overview` (or valid `next`) | |
| Protected `/admin/overview` without session | Redirect to login | |
| Portal `/portal/requests` as client | Works for client role / linked email | |

---

## Regression guards

- [ ] Microsoft button label: **Continue with Microsoft**
- [ ] Google button label: **Continue with Google**
- [ ] No Apple button on login
- [ ] No payment / Mada / Tabby buttons on login
- [ ] Login footer: role-based + RBAC/SAREA copy present
- [ ] OAuth errors show user-safe messages (no stack traces, no secrets)

---

## UX / screenshot (optional)

- [ ] Login page visually polished (glass card, spacing, mobile)
- [ ] Recapture login screenshot if portfolio needs update — see [`F12_SCREENSHOT_CHECKLIST.md`](F12_SCREENSHOT_CHECKLIST.md)

---

## F18 pass criteria

F18 is **PASSED** when this checklist is complete for the target environment, automated commands pass, and no forbidden scope (Apple, live payments, auto platform_admin) was introduced.
