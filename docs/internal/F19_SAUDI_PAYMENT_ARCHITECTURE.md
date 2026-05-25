# F19 — Saudi payment architecture: Mada / Apple Pay / Tabby readiness

**Date:** 25 May 2026  
**Phase:** F19 — Saudi Payment Architecture (Mada / Apple Pay / Tabby Readiness)  
**Audience:** Engineering, product, operations, leadership  
**Business rule:** Continue development **without new paid spend** — no live payments, no merchant accounts, no checkout that can charge users.

**Prerequisites:** F17 (cost-controlled auth & payment readiness) **passed** · F18 (Google Sign-In) **passed**

**F19 does not:** activate Mada, Apple Pay, Tabby, Tamara, live Stripe, payment gates, subscription auto-activation, merchant onboarding, or paid PSP accounts.

---

## Strategic roadmap context

| Phase | Focus |
|-------|--------|
| F17 ✅ | Auth + payment planning, cost policy |
| F18 ✅ | Google Sign-In + auth UX |
| **F19** (this) | Saudi PSP matrix + provider-agnostic architecture + safety model |
| F20 | SAREA advanced controls (no paid infra) |
| F21 | CyberCrow evidence/GRC depth |
| F22 | Portfolio / public demo polish |
| F23 | Production launch **only when budget/client exists** |

---

## Part 1 — Current payment / billing audit

### Code and routes reviewed (25 May 2026)

| Surface | Location | Today |
|---------|----------|--------|
| Public pricing catalog | `src/app/(public)/pricing/page.tsx` | SAR tiers, modules, market comparison — **no checkout**; CTA → `/request` |
| Subscription tiers | `SUBSCRIPTION_TIERS`, `pricing.service` | Estimates for intake/blueprint |
| Prisma models | `TenantSubscription`, `BillingRecord`, `SubscriptionPlan` | Plan linkage, optional Stripe IDs, invoice periods |
| Plan capabilities | `plan-capabilities.ts`, readiness services | **Advisory** tier matrix — not payment enforcement |
| Checkout API | `POST /api/billing/checkout` | Stripe session **only if** keys + package + authorized user |
| Webhook | `POST /api/billing/webhook` | Stripe signature verification; updates subscription + billing record |
| Billing status | `GET /api/billing/status` | Read-only flags — **no secrets** |
| Admin subscriptions | `/admin/subscriptions` | Catalog + tenant subs; amber/teal Stripe banner |
| Tenant plan page | `/[tenant]/settings/plan` | Read-only; “contact platform administrator” |
| Tenant plan panel | `tenant-plan-self-service-panel.tsx` | Explicit: checkout managed by admin |
| Billing alignment | `subscription-billing-alignment.service.ts` | `internal` \| `stripe_ready` \| `stripe_active` |
| Route protection | `route-protection.ts` | Checkout POST allowed when auth rules pass |
| Stripe env | `src/lib/billing/env.ts`, `stripe-client.ts` | Optional until keys set |

### Advisory-only vs inactive vs dangerous

| Category | Items |
|----------|--------|
| **Advisory-only (safe default)** | Plan capabilities, go-live subscription guidance, tenant plan copy, public pricing without pay buttons, `internal` billing mode |
| **Inactive until keys** | Stripe checkout API, webhook handler, `checkoutReady` status |
| **Could charge if misconfigured** | Setting **live** `STRIPE_SECRET_KEY` + publishable key + calling `POST /api/billing/checkout` with real card |
| **Safe to keep** | Stripe scaffold behind `isStripeConfigured()`, webhook 503 without secret, checkout 503 without keys |
| **Should remain disabled** | All `STRIPE_*` in production/staging until approval; no webhook URL on prod without secret rotation plan |

### Documentation state

| Doc | Status |
|-----|--------|
| [`F17_COST_CONTROLLED_AUTH_PAYMENT_READINESS.md`](F17_COST_CONTROLLED_AUTH_PAYMENT_READINESS.md) | Payment audit + Saudi matrix (F17 scope) |
| [`STRIPE_BILLING.md`](STRIPE_BILLING.md) | **Created in F19** — fills gap referenced in code |
| [`M8_SAAS_CUSTOMER.md`](M8_SAAS_CUSTOMER.md) | Customer lifecycle + optional Stripe |
| [`.env.production.example`](../../.env.production.example) | Stripe vars commented |
| Missing runbook | Live Saudi PSP onboarding — **deferred to F23+** |

**Do not activate checkout** as part of F19 validation.

---

## Part 2 — Saudi payment provider matrix

**Legend — recommended Crow status:**

| Status | Meaning |
|--------|---------|
| **Document now** | Architecture and policy only (F19) |
| **Candidate provider** | Shortlist when budget exists |
| **Research later** | Compare fees/KYC before selection |
| **Defer** | No work until client/budget |
| **Do not use now** | Out of scope for current phase |

| Provider / method | Saudi relevance | Methods | SaaS / subscription fit | KYC / business (typical) | Fee / cost risk | Integration complexity | Webhooks | Refunds / cancel | Production readiness | Crow status |
|-------------------|-----------------|---------|-------------------------|--------------------------|-----------------|------------------------|----------|------------------|----------------------|-------------|
| **Mada** | **Very high** (local debit) | Debit via acquirer | Yes via PSP | Acquirer + CR | MDR | Medium (via gateway) | Via PSP | PSP rules | High when gateway live | **Defer** — document now |
| **Apple Pay** | High (iOS/Safari wallet) | Wallet token | Via PSP subscription | Apple + PSP | MDR | Medium | Via PSP | PSP | High with right PSP | **Defer** |
| **STC Pay** | Medium | Wallet | Possible | PSP merchant | MDR | Medium | Varies | Varies | Medium | **Research later** |
| **Visa / Mastercard** | High | Credit/debit | Strong | Standard | MDR + intl | Low via any PSP | Yes | Yes | High | **Candidate** (via any PSP) |
| **Tabby** | High (BNPL retail) | Installments | Weak for B2B SaaS | Tabby merchant | BNPL fees | Medium | Yes | BNPL policy | Medium for retail | **Defer** |
| **Tamara** | High (BNPL) | Installments | Weak for B2B SaaS | Tamara onboarding | BNPL fees | Medium | Yes | BNPL policy | Medium | **Defer** |
| **Moyasar** | **High** (KSA-native) | Mada, cards, Apple Pay | Good | Saudi CR, docs | MDR | Medium | Yes | Yes | High in KSA | **Candidate provider** |
| **Tap Payments** | High (GCC) | Mada, cards, wallets | Good | KYC | MDR | Medium | Yes | Yes | High | **Candidate provider** |
| **HyperPay** | High (enterprise) | Mada, 3DS, enterprise | Good | Enterprise sales | MDR | Medium–high | Yes | Yes | High | **Research later** |
| **PayTabs** | Medium | Cards, regional | Good | KYC | MDR | Medium | Yes | Yes | Medium | **Research later** |
| **Stripe** | Medium in KSA | Cards; Mada varies by region/account | **Strong** for subscriptions | Stripe KYC | % + FX | **Already scaffolded** | Yes | Yes | High globally | **Candidate** — keys optional, not enforced |
| **Manual invoice / bank transfer** | **Very high** (B2B enterprise) | Wire, PO, contract | **Best for pilots** | Contract only | Low direct fees | **Low** | N/A / manual | Contractual | **Always available** | **Document now** — **default safest** |

### F19 default recommendation

1. **Manual invoice / bank transfer** remains the **safest** path for demos, pilots, and enterprise deals.  
2. **Provider-agnostic adapter layer** is designed now (Part 3) — implementation later.  
3. **Live gateways** (Moyasar, Tap, Stripe live, BNPL) **deferred** until budget and client approval.  
4. Compare **at least 2–3** PSPs before lock-in (Moyasar vs Tap vs Stripe for subscription + Mada).

---

## Part 3 — Provider-agnostic payment architecture

**Status:** Documented only — **no live adapters** in F19.

### Target flow

```
Plan selection (catalog / blueprint / admin-assisted)
        ↓
Payment intent or invoice request
  (tenantId, planKey, amountSar, period, metadata)
        ↓
PaymentProviderAdapter (interface — future)
        ↓
Hosted checkout URL OR manual invoice record
        ↓
Provider webhook / callback (signature verified)
        ↓
BillingRecord + TenantSubscription update
        ↓
Activation policy (advisory default — no auto feature lock)
        ↓
Platform audit log + optional notification
```

### Planned adapter interface (TypeScript sketch — not implemented)

```typescript
// Future: src/lib/billing/payment-provider.types.ts (F20+ implementation)

type PaymentProviderId =
  | "manual"
  | "stripe"
  | "moyasar"
  | "tap"
  | "hyperpay"
  | "tabby"
  | "tamara";

interface PaymentProviderAdapter {
  readonly id: PaymentProviderId;
  createCheckoutSession(input: CheckoutSessionInput): Promise<CheckoutSessionResult>;
  verifyWebhook(request: Request): Promise<VerifiedWebhookEvent>;
  parsePaymentEvent(event: VerifiedWebhookEvent): PaymentEvent | null;
  refundPayment?(input: RefundInput): Promise<RefundResult>;
  getProviderStatus(): ProviderHealth;
  mapPaymentMethod(providerMethod: string): CrowPaymentMethod; // mada | apple_pay | card | bnpl | wire
  mapSubscriptionStatus(providerStatus: string): CrowSubscriptionStatus;
}
```

### Potential adapters

| Adapter | Role | F19 |
|---------|------|-----|
| `ManualInvoiceAdapter` | Record pending/paid without PSP | **Document** |
| `StripeAdapter` | Wrap existing `billing.service` + webhook | **Document** (scaffold exists) |
| `MoyasarAdapter` | KSA checkout + Mada | **Defer** |
| `TapAdapter` | GCC + Mada | **Defer** |
| `HyperPayAdapter` | Enterprise 3DS | **Defer** |
| `TabbyAdapter` / `TamaraAdapter` | BNPL — only if product requires | **Defer** |

### Configuration boundary (future)

| Env (future) | Purpose |
|--------------|---------|
| `BILLING_PROVIDER=manual\|stripe\|moyasar\|...` | Single active adapter |
| `BILLING_MODE=advisory\|enforced` | Whether payment blocks modules |
| Provider-specific secrets | **Server only** — never `NEXT_PUBLIC_*` except publishable keys |

### Existing code to extend (later)

- `src/lib/billing/env.ts` — multi-provider detection  
- `src/lib/services/billing.service.ts` — delegate to adapter  
- `src/app/api/billing/webhook/route.ts` — router per provider + shared idempotency  
- `subscription-billing-alignment.service.ts` — display provider + mode  

---

## Part 4 — Payment safety model

### Mandatory rules

| # | Rule |
|---|------|
| 1 | No payment method may **auto-activate** tenant features until an explicit product policy exists. |
| 2 | No live checkout unless provider env is **configured and approved** in writing. |
| 3 | All webhooks must **verify signatures** (Stripe: `constructEvent`; others: provider-specific). |
| 4 | Subscription state changes must be **auditable** (platform audit + DB records). |
| 5 | Failed payments must **not delete** tenant data or modules. |
| 6 | Payment errors must **not expose** API keys, webhook secrets, or raw provider payloads to users. |
| 7 | **Test** and **live** modes must be visibly separated in ops docs and env naming. |
| 8 | Stripe/payment secrets remain **unset** unless approved. |
| 9 | Only **publishable** keys belong in `NEXT_PUBLIC_*`. |
| 10 | **Manual invoice** is the safest default for demos and early pilots. |

### Additional controls

- Checkout API requires **authenticated** platform staff or tenant admin — not anonymous public.  
- Public `/pricing` must not expose provider logos or disabled pay buttons (confusing UX).  
- Webhook endpoint returns **503** when secret missing (current Stripe behavior).  
- Idempotency keys for webhook processing — **required before any live provider**.  

---

## Part 5 — Pricing / payment UX policy

### Current public UX (verified)

| Page | Behavior |
|------|----------|
| `/pricing` | Catalog + comparison; CTA **Start implementation request** → `/request` |
| `/request` | Enterprise intake — not payment |
| Tenant `/settings/plan` | Read-only; contact administrator |
| Admin subscriptions | Operational view; Stripe banner informational only |

### Copy policy (must show)

- Request proposal / start enterprise request  
- Contact platform administrator for plan changes  
- Commercial terms finalize after discovery and blueprint  
- Billing is **advisory** in this environment  
- Live checkout **not enabled** (one line — see pricing footer)  

### Must NOT show

- Pay with Mada / Apple Pay / Tabby / Tamara  
- Pay now  
- Fake or disabled provider buttons  
- Unlicensed provider logos  

### Recommended CTAs (unchanged)

- **Start implementation request** (`/request`)  
- **Request proposal** (sales narrative)  
- **Talk to platform administrator** (tenant plan)  

### F19 UX change

- Added a single advisory line on `/pricing` footer (payment readiness; no live checkout).  
- No new payment UI components.

---

## Part 6 — Saudi operational notes (internal)

**Not legal advice. Not a compliance certification.**

| Topic | Operational note |
|-------|------------------|
| Merchant onboarding | Saudi CR, bank account, PSP contract, MDR negotiation — weeks to months |
| VAT | 15% VAT on invoices — align with `pricing.service` VAT fields; ZATCA e-invoicing may apply for production billing |
| Refunds / cancellation | Define in contract; map to `BillingRecord.status` and PSP refund APIs |
| Subscription renewal | Monthly SAR + renewal reminders; dunning policy before hard suspension |
| Disputes | Ops playbook: who owns chargeback response (finance + platform admin) |
| Data / privacy | Minimize card data in Crow DB — prefer hosted checkout; PCI scope stays with PSP |
| Audit trail | `BillingRecord`, subscription changes, platform audit for admin billing views |
| Access control | Platform staff + finance role for billing records — not all tenant users |
| Mada / local methods | Typically via **PSP**, not direct Mada API in app |
| BNPL (Tabby/Tamara) | Retail-heavy; confirm product fit before any B2B SaaS integration |

---

## Part 7 — Cost control policy extension (F17 → F19)

Extends [`F17_COST_CONTROLLED_AUTH_PAYMENT_READINESS.md`](F17_COST_CONTROLLED_AUTH_PAYMENT_READINESS.md) Part 8.

### Payment-specific rules (mandatory until budget approval)

| # | Rule |
|---|------|
| 1 | **No gateway merchant account** (Moyasar, Tap, HyperPay, PayTabs, Tabby, Tamara) without written approval. |
| 2 | **No paid Apple Developer** account for Apple Pay merchant identity unless approved (separate from Sign in with Apple). |
| 3 | **No BNPL provider activation** without product + finance approval. |
| 4 | **No Stripe live keys** in Vercel production without go/no-go ([`F16_GO_NO_GO_MATRIX.md`](F16_GO_NO_GO_MATRIX.md)). |
| 5 | **No paid production billing features** until client/budget exists (align F23). |
| 6 | **No provider lock-in** before comparing at least **2–3** options (e.g. Moyasar, Tap, Stripe). |
| 7 | **Manual invoice** is acceptable for demos, pilots, and enterprise proposals. |
| 8 | **No fake checkout UI** that implies payments work. |
| 9 | **Document cost-risk** before enabling any `BILLING_PROVIDER` env in staging. |

### Cost-risk register (payment)

| Item | Risk | F19 default |
|------|------|-------------|
| Stripe live keys | Real charges | Off |
| Stripe test keys on shared staging | Test charges / confusion | Only with approval |
| Moyasar / Tap merchant | MDR + setup | Off |
| Tabby / Tamara | BNPL fees + wrong product fit | Off |
| Apple Pay merchant setup | Apple + PSP fees | Off |
| Webhook on public URL without WAF | Abuse | Secret required; monitor |

---

## Part 8 — Recommended future phases

| Phase | Payment work (when approved) |
|-------|------------------------------|
| F20–F22 | None required — stay advisory |
| F23 pre-launch | Select PSP; test mode; webhook idempotency; enforcement policy decision |
| Post-F23 | Implement chosen `PaymentProviderAdapter`; Mada/Apple Pay via PSP hosted page |
| Optional parallel | Stripe test mode for global customers if Stripe chosen |

---

## Part 9 — Validation (F19)

Commands run for F19 sign-off:

```powershell
Set-Location D:\CYBERCROW
npm run typecheck
npm run lint
npm run build
npm run public:mirror-manifest
```

**Not run:** migrations, seeds, payment webhooks, live payment env configuration.

---

## F19 acceptance criteria

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Current billing/payment audit documented | ✅ Part 1 |
| 2 | Saudi payment provider matrix exists | ✅ Part 2 |
| 3 | Provider-agnostic architecture documented | ✅ Part 3 |
| 4 | Payment safety model documented | ✅ Part 4 |
| 5 | Pricing/payment UX policy clear | ✅ Part 5 |
| 6 | Saudi operational notes documented | ✅ Part 6 |
| 7 | Cost-control payment rules documented | ✅ Part 7 |
| 8 | STRIPE_BILLING.md gap addressed | ✅ [`STRIPE_BILLING.md`](STRIPE_BILLING.md) |
| 9 | typecheck / lint / build pass | ✅ (see validation log below) |
| 10 | public mirror passes | ✅ (see validation log below) |
| 11 | No live payment services activated | ✅ |
| 12 | No paid services activated | ✅ |
| 13 | No forbidden scope added | ✅ |

---

## F19 acceptance decision

**PASSED** — documentation and UX policy only; no live payment activation; validation commands green.

**Owner sign-off:** Engineering (Muhanad) — 25 May 2026

---

## Related files (F19 touch)

| File | Change |
|------|--------|
| `docs/internal/F19_SAUDI_PAYMENT_ARCHITECTURE.md` | Created (this doc) |
| `docs/internal/STRIPE_BILLING.md` | Created |
| `docs/internal/PROJECT_STATUS.md` | F19 current track |
| `docs/internal/MILESTONES.md` | F19 milestone row + section |
| `src/app/(public)/pricing/page.tsx` | Advisory footer line (no payment buttons) |
