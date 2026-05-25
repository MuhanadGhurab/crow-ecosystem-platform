# F17 — Cost-controlled auth & payment readiness

**Date:** 25 May 2026  
**Phase:** F17 — Cost-Controlled Auth & Payment Readiness  
**Audience:** Engineering, product, operations  
**Business rule:** Continue development **without new paid spend** unless explicitly approved.

**F17 does not:** activate live payments, enroll paid Apple Developer, open Saudi gateway merchant accounts, or enforce Stripe billing.

---

## Strategic roadmap context

| Phase | Focus |
|-------|--------|
| **F17** (this) | Auth + payment **planning** — zero-cost bias |
| **F18** | Google Sign-In + auth UX polish |
| **F19** | Saudi payment architecture (Mada / Apple Pay / BNPL readiness) |
| **F20** | SAREA advanced controls (no paid infra) |
| **F21** | CyberCrow evidence/GRC depth (no paid infra) |
| **F22** | Portfolio / public demo polish |
| **F23** | Production launch **only when budget/client exists** |

---

## Part 1 — Auth current state audit

### What already works

| Area | Implementation | Status |
|------|----------------|--------|
| **Login UI** | `src/app/login/page.tsx` — glass card, Entra panel, `SignInForm` | Production-quality baseline; F18 may refine layout only |
| **Email/password** | `signIn` server action → `signInWithPassword` | **Active** when Supabase configured |
| **Microsoft / Entra** | `/auth/entra` → `signInWithOAuth({ provider: "azure" })` | **Active** when `AZURE_SSO_ENABLED=true` + `NEXT_PUBLIC_AZURE_TENANT_ID` |
| **OAuth callback** | `/auth/callback` — `exchangeCodeForSession`, role gate | **Active** |
| **Role metadata** | `app_metadata.crow_role`, `tenant_slugs` | **Active** — not `user_metadata` (correct) |
| **No role** | OAuth users without `crow_role` signed out; client fallback if linked requests by email | **Active** — prevents silent platform admin |
| **Post-login routing** | `resolvePostLoginDestination` — platform → `/admin/overview`, client → portal, tenant → `/{slug}/dashboard` | **Active** |
| **Route protection** | `src/lib/supabase/middleware.ts` + `route-protection.ts` | **Active** |
| **Portal trap** | Platform staff on `/portal` → `/admin/overview` (unless `?preview=client`) | **Active** |
| **Auth disabled guard** | `AUTH_DISABLED` blocked in production (`assertAuthNotDisabledInProduction`) | **Active** |

### Auth providers — active vs config-only

| Provider | In code today | Runtime active when |
|----------|---------------|---------------------|
| Email/password | Yes | Supabase Auth + user exists |
| Microsoft (Azure) | Yes | Supabase Azure provider + Entra app + env flags |
| Google | **No** | — |
| Apple | **No** | — |
| Magic link | **No dedicated UI** | Callback comment supports code exchange; no `signInWithOtp` flow in app |

### What requires paid or external accounts

| Item | Cost risk | Notes |
|------|-----------|-------|
| **Apple Developer Program** | ~$99/year (org) | Required for Sign in with Apple in production |
| **Google OAuth** | **Free** (Google Cloud OAuth client) | No per-login fee; quota limits only |
| **Microsoft Entra** | Often **free tier** for SSO app registration | Enterprise features / P1 may cost — current path uses standard OAuth |
| **Supabase** | Free tier / existing project | Already in use — no F17 change |
| **Stripe live charges** | Transaction fees + account | Keys optional; checkout only if keys set |
| **Saudi gateways** (Moyasar, Tap, HyperPay, etc.) | Merchant fees, setup, KYC | **Deferred** |

### What can be added with no extra spending (now vs later)

| Capability | Cost | Phase |
|------------|------|-------|
| Google Sign-In (Supabase provider) | Free OAuth client | **F18** implement |
| Auth UX polish (spacing, hierarchy) | Dev time only | **F18** |
| Document Apple deferred | Free | **F17** (this doc) |
| Billing advisory labels | Free | **Now** (already largely true) |
| Payment architecture notes | Free | **F17** (this doc) |
| Saudi provider matrix | Free | **F17** / **F19** |

### What should wait

- Apple Sign-In button (unless dev account already owned and approved)
- Live Mada / Tabby / Tamara / Moyasar checkout
- Stripe enforcement / plan gates blocking modules
- SCIM / Entra group sync
- Production launch (F23 + budget)

**No auth behavior changes in F17** — audit and documentation only.

---

## Part 2 — Auth provider readiness matrix

| Provider | Current status | Cost risk | Setup complexity | Supabase support | Production readiness | Recommended phase | Env vars (names only) | Redirect / URL | Role metadata | Security notes |
|----------|----------------|-----------|------------------|------------------|----------------------|-------------------|------------------------|----------------|---------------|----------------|
| **Email/password** | **Live** | Low (Supabase included) | Low | Native | Ready | **Now** | `NEXT_PUBLIC_SUPABASE_*`, `DATABASE_URL` | App `/auth/callback` N/A | `crow_role` in `app_metadata` | Strong passwords; admin assigns roles |
| **Microsoft / Entra** | **Live** (flagged) | Low for basic OAuth app | Medium (Azure + Supabase) | `azure` provider | Ready when configured | **Now** | `AZURE_SSO_ENABLED`, `NEXT_PUBLIC_AZURE_TENANT_ID` | Azure → `https://<ref>.supabase.co/auth/v1/callback`; app `/auth/callback` | Same | Enterprise SSO path; secret in Supabase not `.env` |
| **Google** | **Not implemented** | **Free** | Low–medium | `google` provider | Ready after F18 setup | **F18** | Same Supabase public URL/anon; Google client ID/secret in **Supabase Dashboard** | Google → Supabase callback | **Must not** auto `platform_admin` | Default safe role or `no_role` + request link |
| **Apple** | **Not implemented** | **Paid** (Developer Program) | Medium–high | `apple` provider | Deferred | **F19+ or approved** | Apple Services ID, key, team ID in Supabase | Apple → Supabase callback | Same as Google | Hide or omit button until approved |
| **Enterprise SSO (SAML/OIDC custom)** | Future narrative only | Varies | High | Enterprise add-on | Future | **Post-F23** | TBD | IdP-specific | SCIM separate | Not SCIM in F17 |
| **Magic link** | Not exposed in UI | Low | Low | `signInWithOtp` | Optional later | **Deferred** | Same Supabase keys | Email link → `/auth/callback` | Same role rules | Phishing awareness |

---

## Part 3 — Google Sign-In readiness (F18)

### Prerequisites (no Crow spend)

1. **Google Cloud Console** — create OAuth 2.0 Client (Web application). **No fee** for standard OAuth.
2. **Supabase Dashboard** → Authentication → Providers → **Google** — enable; paste Client ID and Client Secret.
3. **Authorized redirect URI** (Google Console):

   `https://<project-ref>.supabase.co/auth/v1/callback`

   Not `https://your-app.vercel.app/auth/callback` as the only URI.

4. **Supabase URL configuration** — allow list must include:

   - `https://<production-host>/auth/callback`
   - `http://localhost:3000/auth/callback` (dev)

### Application work (F18 — not F17)

| Task | Detail |
|------|--------|
| Add provider button | e.g. `signInWithOAuth({ provider: 'google' })` mirroring `/auth/entra` pattern |
| Cookie `next` path | Reuse `OAUTH_NEXT_COOKIE` / `resolveOAuthNextPath` |
| Login layout | Primary card → **Enterprise** (Microsoft, then Google) → divider → email/password |
| Env | No new `NEXT_PUBLIC_*` secret for Google secret — **server-side in Supabase only** |

### Post-login and roles (critical)

Existing callback already:

- Exchanges code → session
- Reads `getCrowAuth` → `crow_role` from `app_metadata`
- If no role: sign out → `/login?error=no_role` (unless client with linked requests by email → `client`)

**F18 policy for new Google users:**

1. **Never** set `crow_role: platform_admin` from Google email domain alone.
2. Default: **no role** until platform admin sets `app_metadata` (or auto-`client` only when `countRequestsForEmail` > 0 — already implemented).
3. Optional future: admin tool “grant role after first Google login” — not F17/F18 scope unless trivial.

### UX plan (F18 — design quality rule)

- One **Sign in with Google** button, same visual weight as Microsoft (outline/glass, not garish).
- Mobile: stacked full-width buttons, 16–24px vertical rhythm.
- Errors: reuse `ERROR_MESSAGES` pattern on login page.
- Do **not** show Apple as active in F18.

---

## Part 4 — Apple Sign-In deferred plan

### Why deferred

- **Apple Developer Program** membership typically required for Sign in with Apple in production apps.
- Google covers consumer and many enterprise users; Apple is secondary for KSA enterprise buyers.
- Does not block F18 or current Entra + email path.

### When to revisit

- Customer contract requires Apple login on mobile/web.
- Organization already has **paid** Apple Developer account and approves ops time.
- After F18 Google is stable.

### Expected setup (future)

| Step | Notes |
|------|--------|
| Apple Developer | App ID, Services ID, Sign in with Apple key |
| Supabase | Enable Apple provider; configure secret + key id |
| Redirect | Same pattern: `https://<ref>.supabase.co/auth/v1/callback` |
| Role metadata | Same safe defaults as Google |

### UX placeholder policy

- **Do not** add a visible “Sign in with Apple” button in F17.
- If a disabled placeholder is ever shown: single line “Apple Sign-In — planned” in **internal docs only**, not public marketing.
- Public/login must not imply Apple Pay or Apple login is live.

---

## Part 5 — Current payment / billing state audit

### What exists in code

| Component | Location | Behavior today |
|-----------|----------|----------------|
| **Public pricing** | `/pricing` | Commercial **catalog** — SAR tiers, modules, comparison; **no checkout** |
| **Subscription tiers** | `SUBSCRIPTION_TIERS`, `pricing.service` | Estimates and display |
| **TenantSubscription** | Prisma model + admin UI | Records plan, optional Stripe IDs |
| **Billing alignment** | `subscription-billing-alignment.service.ts` | Modes: `internal`, `stripe_ready`, `stripe_active` |
| **Checkout API** | `POST /api/billing/checkout` | Creates Stripe Checkout **only if** keys configured + auth |
| **Webhook** | `POST /api/billing/webhook` | Verifies `stripe-signature`; updates subscription |
| **Billing status** | `GET /api/billing/status` | Reports `checkoutReady` when keys + package |
| **Admin subscriptions** | `/admin/subscriptions` | Lists tenants; shows Stripe banner when configured |
| **Tenant plan panels** | Admin + tenant settings | **Advisory** copy — contact platform admin |
| **Plan capabilities** | `plan-capabilities`, readiness services | Gating narrative; **not** hard payment blocks in RC1 |

### Advisory-only vs live

| Mode | When |
|------|------|
| **Internal** | Default — no Stripe keys |
| **Stripe-ready** | Keys present, customer id may exist, no active sub |
| **Stripe-active** | `stripeSubscriptionId` present |

**Enforcement:** Subscription readiness and go-live docs advise linking `TenantSubscription`; **modules are not blocked** by failed payment in current RC1/F16 posture.

### What could cost money

| Action | Risk |
|--------|------|
| Setting live `STRIPE_SECRET_KEY` (live mode) | Real charges on checkout |
| Stripe webhook endpoint on production URL | Live events |
| Creating Saudi merchant accounts | Setup fees, MDR, monthly minimums |
| Apple Pay / Mada via gateway | Transaction costs |

### What remains deferred (F17)

- Live checkout on public `/pricing`
- Mada / Tabby / Tamara buttons
- Automatic subscription enforcement
- Stripe as sole Saudi payment story

### Documentation gap

Code references `docs/internal/STRIPE_BILLING.md` — **file not present in repo**. Use [`M8_SAAS_CUSTOMER.md`](M8_SAAS_CUSTOMER.md) Stripe section + [`.env.production.example`](../.env.production.example) until a dedicated STRIPE_BILLING doc is authored (optional housekeeping, not F17 blocker).

---

## Part 6 — Saudi payment readiness matrix

**Status key:** **Now** = document/plan only · **Later** = F19+ design · **Deferred** = needs budget/merchant · **Research** = compare only

| Provider / method | Purpose | Saudi relevance | Business verification | Fees / cost risk | Integration complexity | SaaS subscription fit | Mada / Apple Pay / BNPL | Status |
|-------------------|---------|-------------------|----------------------|------------------|------------------------|----------------------|-------------------------|--------|
| **Mada** | Local debit dominance | **High** | Via acquirer/gateway | MDR | Medium (via gateway) | Yes (through PSP) | **Mada** native | **Deferred** |
| **Apple Pay** | Wallet checkout | High on iOS | Apple + gateway | MDR | Medium | One-off + sub via PSP | **Apple Pay** | **Deferred** |
| **STC Pay** | Local wallet | Medium | PSP-specific | MDR | Medium | Possible | Wallet | **Research** |
| **Visa / Mastercard** | International cards | High | Standard KYC | MDR | Low via any PSP | Yes | Via gateway | **Later** |
| **Tabby** | BNPL | High retail | Tabby merchant onboarding | BNPL fees | Medium | B2B SaaS less common | BNPL | **Deferred** |
| **Tamara** | BNPL | High | Tamara onboarding | BNPL fees | Medium | Same | BNPL | **Deferred** |
| **Stripe** | Global SaaS billing | Medium in KSA | Stripe account + KYC | % + FX | **Already scaffolded** | **Strong** for subscriptions | Cards; Mada varies by Stripe region | **Later** (keys exist, not enforced) |
| **Moyasar** | KSA-focused PSP | **High** | Saudi CR/docs | MDR | Medium | Good | Mada, cards, Apple Pay | **Deferred** |
| **Tap Payments** | GCC PSP | High | KYC | MDR | Medium | Good | Mada, Apple Pay | **Deferred** |
| **HyperPay** | Enterprise PSP | High | Enterprise sales | MDR | Medium–high | Good | Mada, 3DS | **Deferred** |
| **PayTabs** | Regional | Medium | KYC | MDR | Medium | Good | Cards/Mada | **Research** |

**F17 direction:** No live provider activation. Prefer **provider-agnostic** architecture in Part 7 before choosing one PSP in F19.

---

## Part 7 — Future payment architecture (documentation only)

No new live adapters in F17. Document target flow for F19+ implementation.

```
Pricing / plan selection (public or admin-assisted)
        ↓
Payment intent (tenant + planKey + amount SAR)
        ↓
PaymentProviderAdapter (interface)
        ├── StripeAdapter        (existing scaffold)
        ├── MoyasarAdapter       (future)
        ├── TapAdapter           (future)
        ├── TabbyAdapter         (future — BNPL)
        └── ManualInvoiceAdapter (enterprise deals, zero PSP)
        ↓
Checkout session OR hosted invoice URL
        ↓
Webhook / callback verification (signed)
        ↓
TenantSubscription + BillingRecord update
        ↓
Advisory / activation policy (no hard block until product decision)
        ↓
Audit log (platform audit)
```

### Boundaries to preserve

| Boundary | Rule |
|----------|------|
| **Advisory billing** | Default until leadership enables enforcement |
| **Tenant exists first** | Checkout post-provision (current model) |
| **Single active adapter** | Env flag `BILLING_PROVIDER=stripe|moyasar|manual` (future) |
| **No fake UI** | Public pages show catalog + “contact admin” / request proposal |
| **Webhook idempotency** | Required before any live provider |

### Existing code to extend (later)

- `src/lib/billing/env.ts` — provider detection
- `src/lib/services/billing.service.ts` — checkout creation
- `src/app/api/billing/webhook/route.ts` — signature verification pattern
- `subscription-billing-alignment.service.ts` — mode display

---

## Part 8 — Cost control governance

### Policy (mandatory until budget approval)

1. **No new paid service** without written approval (Supabase tier upgrade, Vercel Pro, Apple Developer, PSP merchant account, paid Turnstile tier, WAF add-ons).
2. **No Apple Developer** enrollment for Crow unless explicitly approved.
3. **No live payment provider** (Stripe live mode, Moyasar, Tap, Tabby) unless explicitly approved.
4. **No production database tier upgrade** unless approved.
5. **Prefer** free tiers, staging, demo data, and advisory billing.
6. **Stripe** remains **optional** — absence of keys is the default safe state.
7. **Document cost-risk** in phase plan before implementation (F18–F23).

### Cost-risk feature register

| Feature | Risk | Default |
|---------|------|---------|
| Stripe live keys | Charges | Off |
| Apple Sign-In | $99/yr + ops | Off |
| Google OAuth | Free | F18 after approval |
| Resend | Free tier limits | On if already configured |
| Turnstile | Free tier | Optional |
| Supabase Pro | Monthly $ | Stay on current plan |
| Vercel Pro | Monthly $ | Stay on current plan |

### Accidental paid usage prevention

| Control | Mechanism |
|---------|-----------|
| Missing Stripe keys | Checkout returns `not_configured` |
| No public pay buttons | Pricing links to `/request` |
| Env templates | `.env.production.example` documents optional Stripe |
| F16 go/no-go | No production launch without approval (F23) |
| This policy | Reference in PR checklist for auth/billing PRs |

---

## Part 9 — Login / payment UX planning

### Design quality rule (all auth/billing UI touches)

When F18+ touches login or pricing:

- **Styling:** dark enterprise, glass panels, cyan/violet/teal accents.
- **Spacing:** consistent `space-y-4` / `space-y-6`; mobile `min-h-[100dvh]`, `px-4 sm:px-6`.
- **Hierarchy:** `cc-page-title` → one-line subtitle → actions → secondary links.
- **Cards:** single primary `cc-glass-card`; avoid multiple competing panels.
- **Buttons:** `cc-btn-primary` for email submit; outline buttons for OAuth providers.
- **Empty/error:** `cc-alert-warning` / `cc-alert-error` — no raw stack traces.
- **No clutter:** no fake provider badges; no “Mada coming soon” on public site.

### Login — target layout (F18)

```
┌─────────────────────────────┐
│  Crow mark + Sign in        │
│  Short subtitle             │
│  [ Continue with Microsoft ]│  ← if entraEnabled
│  [ Continue with Google ]     │  ← F18 only
│  ─── or email & password ───│
│  email / password           │
│  [ Sign in ]                │
│  Track request · New request│
└─────────────────────────────┘
```

- **No Apple button** until approved.
- Entra ops panel: keep collapsible/secondary (`EntraOpsPanel` variant login) — do not dominate mobile.

### Pricing / payment UX (now and future)

| Surface | Copy / behavior |
|---------|-----------------|
| `/pricing` | Catalog, SAR bands, link to **request** / blueprint — not “Pay now” |
| Tenant plan settings | “Contact platform administrator” — already present |
| Admin subscriptions | Shows Stripe **alignment** only when keys set |
| Public | Never imply Mada/Tabby/Apple Pay checkout is available |

Internal-only phrase: “payment readiness planned” — **not** on public marketing in F17.

---

## Part 10 — Recommended F18 / F19 actions

### F18 (next)

| # | Action |
|---|--------|
| 1 | Enable Google in Supabase + Google Cloud OAuth client |
| 2 | Implement `signInWithOAuth({ provider: 'google' })` + login button |
| 3 | Verify role gate for new Google users (no auto admin) |
| 4 | Polish login spacing/hierarchy per Part 9 |
| 5 | Update `docs/internal/ENTRA_SSO.md` or add `GOOGLE_SSO.md` (sanitized, no secrets) |

### F19 (after F18)

| # | Action |
|---|--------|
| 1 | Finalize Saudi PSP shortlist (likely Moyasar/Tap vs Stripe KSA) |
| 2 | Define `PaymentProviderAdapter` interface in code (no live keys) |
| 3 | Map Mada / Apple Pay / BNPL to PSP capabilities |
| 4 | Enterprise manual invoice path for F23 deals |

---

## F17 acceptance checklist

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Auth current state audited | ✅ Part 1 |
| 2 | Auth provider matrix | ✅ Part 2 |
| 3 | Google readiness for F18 | ✅ Part 3 |
| 4 | Apple deferred | ✅ Part 4 |
| 5 | Billing/payment audited | ✅ Part 5 |
| 6 | Saudi payment matrix | ✅ Part 6 |
| 7 | Future payment architecture | ✅ Part 7 |
| 8 | Cost control governance | ✅ Part 8 |
| 9 | Login/payment UX guidance | ✅ Part 9 |
| 10 | typecheck/lint/build | Run in validation |
| 11 | public mirror | Run in validation |
| 12 | No paid services activated | ✅ No code/env changes in F17 |
| 13 | No forbidden scope | ✅ Docs only |

---

## Related documents

| Doc | Use |
|-----|-----|
| [`F16_AUTH_SUPABASE_GOVERNANCE.md`](F16_AUTH_SUPABASE_GOVERNANCE.md) | Redirect URLs, Entra |
| [`F16_PRODUCTION_ENVIRONMENT_GOVERNANCE.md`](F16_PRODUCTION_ENVIRONMENT_GOVERNANCE.md) | Env vars |
| [`ENTRA_SSO.md`](ENTRA_SSO.md) | Microsoft setup (if present) |
| [`M8_SAAS_CUSTOMER.md`](M8_SAAS_CUSTOMER.md) | Stripe scaffold |
| [`API_SECURITY.md`](API_SECURITY.md) | Billing routes |
