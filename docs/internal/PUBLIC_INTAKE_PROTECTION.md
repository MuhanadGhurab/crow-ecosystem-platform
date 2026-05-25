# Public intake protection

Hardening for `/request` and `POST /api/implementation-requests` (Phase F1).

## Architecture

```text
Browser (/request)
  → POST /api/implementation-requests (primary)
  → submitImplementationRequest server action (fallback, same guards)
```

Shared guard: `src/lib/security/public-intake-guard.ts`

## Implemented controls

### Validation (`public-intake-schema.ts`)

- Organization name: 2–200 chars
- Module keys: enum from `CEM_MODULES`, max 20 items
- Security packages: enum from `SECURITY_PACKAGES`, max 10 items
- Email: Zod `.email()`, max 254
- Phone: max 40
- Notes: max 5000 (API only; form may omit)
- Production 400 responses: generic message (no field flatten leak)

### Payload size

- `Content-Length` > 256 KiB → `413`

### Honeypot

- Hidden field `companyWebsite` (bots often fill)
- Non-empty → `400` + abuse log (no success fake-out)

### Rate limiting (in-memory)

- **Policy:** 5 submissions per client IP per 10 minutes
- **Response:** `429` with `Retry-After` header, generic body
- **Scope:** Per Node server instance on Vercel (not global)
- **IP source:** `x-forwarded-for` (first hop), then `x-real-ip`
- If IP unknown: allow (logged implicitly by skipping limit key)

For production abuse at scale, add **Vercel Firewall** rule on path `/api/implementation-requests`.

### Cloudflare Turnstile (optional)

| Env | Role |
|-----|------|
| `TURNSTILE_ENABLED=true` | Server requires valid token |
| `TURNSTILE_SECRET_KEY` | siteverify API |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Renders widget on `/request` |

When `TURNSTILE_ENABLED` is not `true`, verification is **skipped** and a one-time console warning is logged (`turnstile_disabled`). Local development works without keys.

Widget: `src/components/public/turnstile-field.tsx`

## Recommended (not in repo)

### Vercel Firewall

In Vercel → Project → Firewall:

- Rate limit `POST /api/implementation-requests` per IP
- Optional: challenge or block high-risk countries if business allows

### Upstash Redis (future)

Replace in-memory bucket with shared counter for multi-instance consistency. No dependency added in F1.

## Abuse logging

Events prefixed `[public-intake]` in server logs:

- `honeypot_triggered`
- `rate_limited`
- `turnstile_missing` / `turnstile_failed` / `turnstile_disabled`
- `payload_too_large`
- `validation_failed`

No raw email addresses in abuse logs.

## Local testing

```powershell
# Without Turnstile (default)
npm run staging:dev

# With Turnstile — set in .env.staging:
# TURNSTILE_ENABLED=true
# NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
# TURNSTILE_SECRET_KEY=...
```

Use Cloudflare test keys from Turnstile docs for non-production environments.
