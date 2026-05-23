# Resend — pipeline notifications (M2–M3)

Pipeline events (`request_received`, `discovery_started`, `blueprint_ready`, `tenant_provisioned`) are **always logged** to `platformNotification`. With **`RESEND_API_KEY`**, status becomes **`sent`** instead of **`skipped`**.

Required for **platform finish** ([`FINISH_PLATFORM.md`](FINISH_PLATFORM.md)) and MEEM E2E step 12 when you want real email, not only audit rows.

---

## 1. Create API key

1. Sign up at [resend.com](https://resend.com).
2. **API Keys** → **Create API Key** → copy `re_...`.
3. Add to `.env` (never commit):

```env
RESEND_API_KEY=re_xxxxxxxx
NOTIFICATION_FROM_EMAIL=Crow Ecosystem <onboarding@resend.dev>
```

Free tier: default sender `onboarding@resend.dev` works without a custom domain. You can only send to **verified** addresses until you add your own domain in Resend.

---

## 2. MEEM seed uses a demo address

`prisma/seed-meem.ts` sets contact `faisal@meem-logistics.demo` — Resend **will not** deliver there.

**Option A (recommended for local):** override delivery to your inbox:

```env
PIPELINE_NOTIFY_EMAIL_OVERRIDE=you@yourcompany.com
```

Audit rows still show the original recipient; Resend sends to the override.

**Option B:** Change the seed contact email to your verified address and re-run `npm run db:seed:meem` (only on fresh MEEM seed).

---

## 3. Optional platform copy

```env
PLATFORM_NOTIFY_EMAIL=ops@yourcompany.com
```

Sends an extra `request_received` to your ops inbox (must be a deliverable/verified address).

---

## 4. Verify

```powershell
npm run env:check
npm run test:resend
```

On Windows, `test:resend` and `smoke:phase1` use `--use-system-ca` so Node can reach `api.resend.com` (corporate TLS).

Expected: `✓ Resend API key accepted` and a test message to your override or `NOTIFICATION_TEST_EMAIL`.

Then trigger pipeline events (new request or `npm run smoke:phase1`) and check `/admin/audit` — status **`sent`**, not `skipped`.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Still `skipped` | Restart `npm run dev` after editing `.env` |
| `failed` in audit | Resend dashboard → Logs; often unverified recipient |
| 403 / invalid key | Regenerate key; no quotes/spaces in `.env` |
| MEEM E2E step 12 | Set `RESEND_API_KEY` + `PIPELINE_NOTIFY_EMAIL_OVERRIDE` |

---

## Related

- [`notification.service.ts`](../src/lib/services/notification.service.ts)
- [`PHASE4_MEEM_E2E.md`](PHASE4_MEEM_E2E.md)
- [`customers/MEEM_GLOBAL.md`](customers/MEEM_GLOBAL.md) § Audit & notifications
