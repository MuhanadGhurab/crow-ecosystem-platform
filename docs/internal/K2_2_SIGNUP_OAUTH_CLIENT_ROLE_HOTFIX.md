# K2.2 — Signup/OAuth client role propagation hotfix

**Status:** Implemented (post–K2.1 production smoke)  
**Scope:** Auth role assignment + ERP request intake — no migrations, payments, or tenant auto-provision.

## Production setup (required)

| Item | Requirement |
|------|-------------|
| `SUPABASE_SERVICE_ROLE_KEY` | server-only: set in Vercel server env (Project → Settings → Environment Variables). Must not use a NEXT_PUBLIC prefix. Required for `assignDefaultClientRoleOnSignUp` and intake role repair. |
| Email sign-up | In Supabase Dashboard → Authentication → Providers → Email: enable sign-ups if `/signup` offers email/password. |
| Redirect URLs | Supabase → Authentication → URL configuration: include production `https://<app>/auth/callback` (and preview URLs as needed). |
| Google OAuth | Provider enabled; `GOOGLE_SSO_ENABLED=true` in env when offered on login/signup. |

## Root cause (production smoke)

1. **Middleware** treated `POST /api/implementation-requests` as platform-only API → **403 Forbidden** for signed-in users without platform staff role (including OAuth users with no `crow_role`).
2. **`assignDefaultClientRoleOnSignUp`** no-oped when `SUPABASE_SERVICE_ROLE_KEY` was missing → OAuth users could open `/request` but could not submit.
3. **Email signup** surfaced generic errors; duplicate-email and disabled-signup cases were unclear.

## Fixes

- `isHandlerAuthorizedApiPath`: allow authenticated `POST /api/implementation-requests` (handler enforces auth + role).
- `ensureClientRoleForAuthenticatedIntake`: assign `client` only when no role; clear 503/403 messages when service role missing or assignment fails.
- OAuth callback: assign client on first sign-in; allow client-intent `?next=` without sign-out when role pending.
- Sign-up: improved Supabase error mapping; surface role-assignment failure when session is immediate.

## Verifier

```bash
npm run client-signup:verify
```
