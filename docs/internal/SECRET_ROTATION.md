# Manual secret rotation

If `.env`, `.env.staging`, or any credential file was exposed (commit, screen share, paste):

1. Rotate **Supabase** service role and anon keys in the project dashboard.
2. Rotate **Stripe** webhook secret and API keys if billing env was exposed.
3. Rotate **Azure / Entra** app secrets if `AZURE_*` or `ENTRA_*` vars were exposed.
4. Rotate **Resend** `RESEND_API_KEY` if pipeline or digest email was exposed — advisories and digests log to Postgres regardless.
5. Update local `.env` / `.env.staging` only on trusted machines — never commit env files (see root `.gitignore`).
6. Redeploy or restart `npm run staging:local` after updating env files.

## Notification-related env (advisory only)

| Variable | Role |
|----------|------|
| `RESEND_API_KEY` | Pipeline email send; without it rows stay `deliveryStatus=skipped` |
| `NOTIFICATION_FROM_EMAIL` | Resend from address |
| `PIPELINE_NOTIFY_EMAIL_OVERRIDE` | Redirect all pipeline/digest sends (staging safety) |
| `PLATFORM_NOTIFY_EMAIL` / `PLATFORM_ADMIN_EMAIL` | Digest recipient fallback chain |
| `DATABASE_URL` / `DIRECT_URL` | Required for `platform_notifications` and MEEM live ID resolution |

After rotation, run `npm run notifications:check` and `npm run meem:ids:staging` on staging to confirm connectivity.

No automated rotation is implemented in-repo; treat exposure as incident response.

---

## F16 — Public / repo boundary (launch governance)

Confirm before production go-live (see [`F16_GO_NO_GO_MATRIX.md`](F16_GO_NO_GO_MATRIX.md)):

| Check | Expected |
|-------|----------|
| Root `.gitignore` | `.env`, `.env.staging`, `.env.production` ignored |
| Git index | No `.env*` staged (`git diff --cached`) |
| `.env.example` / `.env.production.example` | Placeholders only — no live keys |
| `docs/public` + public mirror | No `docs/internal`; no service role or DB URLs |
| `npm run public:mirror-manifest` | `docs/internal` in exclude list |
| Client bundles | No `SUPABASE_SERVICE_ROLE_KEY` under `NEXT_PUBLIC_*` |
| Screenshots (`docs/public/screenshots`) | No credentials, tenant IDs, or internal URLs |

Full env matrix: [`F16_PRODUCTION_ENVIRONMENT_GOVERNANCE.md`](F16_PRODUCTION_ENVIRONMENT_GOVERNANCE.md).
