# C3.10I — Secure password recovery

Password recovery uses Supabase PKCE with Crow-controlled redirect validation. Production is unchanged until explicitly promoted.

## User flow

1. `/login` → **Forgot your password?** → `/forgot-password`
2. Submit email → generic confirmation (enumeration-safe)
3. Supabase sends recovery email → user clicks link
4. `/auth/callback?code=…&next=/reset-password` → exchange code → `/reset-password`
5. Set new password → session terminated → `/login?password-reset=1`
6. Security notification email (no password material)

## Redirect allowlist (Supabase Dashboard)

Add **exact** callback URLs per environment:

| Environment | Redirect URL pattern |
|-------------|---------------------|
| Local | `http://localhost:3000/auth/callback` |
| Preview | `https://<branch-preview-host>/auth/callback` |
| Production | `https://<production-host>/auth/callback` |

Site URL / additional redirects must include the same origins. Do **not** add wildcard external domains.

Crow resolves outbound recovery `redirectTo` from:

1. `NEXT_PUBLIC_SITE_URL` (preferred)
2. Forwarded host **only** when listed in `CROW_AUTH_REDIRECT_ORIGINS` (comma-separated origins)

Recovery destination is always:

```text
{trustedOrigin}/auth/callback?next=/reset-password
```

Only `/reset-password` is accepted as recovery `next`. External or malformed values are rejected.

## Rate limits

- Supabase provider limits (hosted)
- Per-IP and per-email-digest in-memory throttling (15-minute window, daily cap, 60s resend cooldown)
- Email digests use HMAC; raw emails are not stored in rate-limit buckets

## Account state

Password recovery does **not** modify legal acceptances, PlatformAccount generation/role, or tenant membership. Only the Supabase password credential changes.

## Verification

```bash
npm run c3-password-recovery:verify
```

## Operator proof (C3 closure resume)

Use the existing verified disposable requester (do not delete before proof):

1. Forgot password → hosted recovery email → set new password manually
2. Sign in with new password → `/account` hard reload → profile save → POST sign-out
3. Record `C3_MANUAL_BROWSER_SESSION_CERTIFIED=true` in gitignored `.env.staging`

Never send passwords, recovery links, or tokens to automation logs.
