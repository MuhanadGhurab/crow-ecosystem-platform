# Stripe billing (advisory only)

**Audience:** Engineering, operations  
**Status:** Scaffold present — **not live** unless `STRIPE_*` env vars are explicitly set and approved  
**Related:** [`F19_SAUDI_PAYMENT_ARCHITECTURE.md`](F19_SAUDI_PAYMENT_ARCHITECTURE.md) · [`F17_COST_CONTROLLED_AUTH_PAYMENT_READINESS.md`](F17_COST_CONTROLLED_AUTH_PAYMENT_READINESS.md) · [`M8_SAAS_CUSTOMER.md`](M8_SAAS_CUSTOMER.md)

---

## Policy

- **Default:** No Stripe keys in Vercel or local `.env` — billing stays **internal / advisory**.
- **No live charges** without written approval and test-mode validation first.
- Stripe is **one candidate** among Saudi PSPs (Moyasar, Tap, HyperPay, etc.) — not the only future path.
- **Never** commit secret keys. Use Vercel env UI or gitignored `.env.staging`.

---

## Environment variables (names only)

| Variable | Exposure | Purpose |
|----------|----------|---------|
| `STRIPE_SECRET_KEY` | Server only | API calls (`sk_test_` or `sk_live_`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Browser-safe | Publishable key only (`pk_test_` / `pk_live_`) |
| `STRIPE_WEBHOOK_SECRET` | Server only | Webhook signature verification (`whsec_`) |
| `STRIPE_PRICE_STARTUP` | Server only | Optional Price id for tier |
| `STRIPE_PRICE_GROWTH` | Server only | Optional Price id for tier |
| `STRIPE_PRICE_ENTERPRISE` | Server only | Optional Price id for tier |

See [`.env.example`](../../.env.example) and [`.env.production.example`](../../.env.production.example) (commented).

---

## Code map

| Piece | Path |
|-------|------|
| Config helpers | `src/lib/billing/env.ts` — `isStripeConfigured()` |
| Stripe SDK | `src/lib/billing/stripe-client.ts` |
| Checkout creation | `src/lib/services/billing.service.ts` → `createSubscriptionCheckout` |
| Checkout API | `POST /api/billing/checkout` (auth: platform staff or tenant admin) |
| Webhook | `POST /api/billing/webhook` — requires `stripe-signature` + `STRIPE_WEBHOOK_SECRET` |
| Status (read-only) | `GET /api/billing/status` — no secrets returned |
| Billing modes | `src/lib/services/subscription-billing-alignment.service.ts` |
| DB | `TenantSubscription` (`stripeCustomerId`, `stripeSubscriptionId`, `stripePriceId`), `BillingRecord` |

---

## When checkout is “ready”

`GET /api/billing/status` returns `checkoutReady: true` only when:

1. `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` are set, and  
2. The `stripe` npm package is installed.

`POST /api/billing/checkout` still returns **503** with `reason: not_configured` if keys are missing.

---

## Safe staging test (only with approval)

1. Use **Stripe test mode** keys (`sk_test_`, `pk_test_`).
2. Configure webhook endpoint in Stripe Dashboard → `https://<staging-host>/api/billing/webhook`.
3. Set `STRIPE_WEBHOOK_SECRET` on staging only.
4. Use admin-authenticated checkout for a **test tenant** — never public `/pricing`.
5. Confirm `TenantSubscription` and `BillingRecord` update via webhook.
6. **Do not** enable live keys on production without go/no-go per [`F16_GO_NO_GO_MATRIX.md`](F16_GO_NO_GO_MATRIX.md).

---

## What Crow does not do today

- Public “Pay now” on `/pricing`
- Mada / Apple Pay / Tabby / Tamara checkout
- Automatic module lockout on payment failure
- Subscription enforcement as hard gate (RC1/F16 advisory posture)

---

## Misconfiguration risk

| Risk | Mitigation |
|------|------------|
| Live keys on staging | Use test keys only; separate Stripe accounts |
| Webhook without secret | Route returns 503 if `STRIPE_WEBHOOK_SECRET` unset |
| Accidental checkout | Keys unset by default; checkout API requires auth |
| Secret in `NEXT_PUBLIC_*` | Only publishable key allowed client-side |

---

## Runbooks

| Task | Command / action |
|------|------------------|
| Check config | `GET /api/billing/status` (while logged in as staff if route protected) |
| List subscriptions | `/admin/subscriptions` |
| Align tenant billing | Admin tenant → Plan tab; `getTenantBillingAlignment` |

For Saudi PSP strategy and provider matrix, use **F19** — not this doc alone.
