# Stripe billing (Phase 8.4)

**Status:** Scaffold only — safe to develop without DB or Stripe keys.  
**Pricing source:** `estimatedMonthlySar` on `ImplementationRequest` via [`pricing.service.ts`](../src/lib/services/pricing.service.ts).

---

## Architecture (target)

```
Blueprint / request estimate (SAR)
        ↓
billing.service → Stripe Checkout (subscription mode)
        ↓
Webhook /api/billing/stripe/webhook → update subscription state (future Prisma fields)
```

---

## Environment (when ready)

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Optional price IDs (map tier → Stripe Price):

```env
STRIPE_PRICE_STARTUP=price_...
STRIPE_PRICE_GROWTH=price_...
STRIPE_PRICE_ENTERPRISE=price_...
```

Install SDK when implementing live Checkout:

```bash
npm install stripe
```

---

## Code (scaffold)

| File | Role |
|------|------|
| `src/lib/billing/env.ts` | `isStripeConfigured()`, env getters |
| `src/lib/billing/money.ts` | SAR → smallest currency unit for Stripe |
| `src/lib/services/billing.service.ts` | Checkout intent types + stub (no network until configured) |

UI and webhook route are **not** wired yet — add after DB + Stripe test keys are available.

---

## Implementation order (when DB is back)

1. Prisma: `Tenant.stripeCustomerId`, `stripeSubscriptionId`, status enum.
2. `POST /api/billing/checkout` — platform staff, blueprint/request id.
3. Stripe Checkout Session (mode `subscription`, `currency: sar`).
4. Webhook handler — `checkout.session.completed`, `customer.subscription.updated`.
5. Admin `/admin/subscriptions` — link to Stripe Customer Portal.

---

## Dev without Stripe

- `isStripeConfigured()` is `false` → `createSubscriptionCheckout` returns `{ ok: false, reason: "not_configured" }`.
- No charges, no API calls.

See also [`DEV_WITHOUT_DB.md`](DEV_WITHOUT_DB.md).
