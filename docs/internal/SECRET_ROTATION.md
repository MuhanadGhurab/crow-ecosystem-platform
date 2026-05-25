# Manual secret rotation

If `.env`, `.env.staging`, or any credential file was exposed (commit, screen share, paste):

1. Rotate **Supabase** service role and anon keys in the project dashboard.
2. Rotate **Stripe** webhook secret and API keys if billing env was exposed.
3. Rotate **Azure / Entra** app secrets if `AZURE_*` or `ENTRA_*` vars were exposed.
4. Update local `.env` / `.env.staging` only on trusted machines — never commit env files (see root `.gitignore`).
5. Redeploy or restart `npm run staging:local` after updating env files.

No automated rotation is implemented in-repo; treat exposure as incident response.
