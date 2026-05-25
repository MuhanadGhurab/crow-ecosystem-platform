# F15.6 — Public surface security regression audit

**Date:** 25 May 2026  
**Prerequisite:** F15.5 homepage usability — **PASSED**  
**Audience:** Internal delivery / engineering  
**Scope:** Confirm F15.5 public copy/IA changes did not weaken routes, APIs, auth, redirects, or public/internal boundaries. **No new features, schema, UI redesign, or security tooling.**

---

## Audit scope

| Area | In scope |
|------|----------|
| Public marketing pages | `/`, `/request`, `/architecture`, `/security`, `/pricing`, `/industries`, related `(public)` routes |
| Public APIs | `GET /api/health`, `POST /api/implementation-requests` |
| Billing APIs | `POST /api/billing/webhook`, `POST /api/billing/checkout` |
| SAREA preview | `GET /api/sarea/preview` (redirect + cookie) |
| Auth | `/auth/callback`, `/auth/entra`, `/auth/signout`, middleware session gate |
| Protected surfaces | `/admin/*`, `/[tenant]/*`, `/portal/*`, `/sarea/*`, `/discovery/*`, `/blueprints/*` |
| Public mirror | `scripts/prepare-public-mirror.mjs` — `docs/internal` exclusion |
| Prior hardening | RC1 / F1 per [`API_SECURITY.md`](API_SECURITY.md) |

**Out of scope (unchanged):** Stripe paid enforcement, SCIM/Entra sync, new ERP modules, OpenAPI/Postman collection sync, live browser auth matrix on staging URL.

---

## Task 1 — Security audit method

**`/postman:security` equivalent:** No OpenAPI/Swagger spec or Postman collection exists in-repo. Audit executed as a **manual regression** against:

- [`API_SECURITY.md`](API_SECURITY.md)
- [`PUBLIC_INTAKE_PROTECTION.md`](PUBLIC_INTAKE_PROTECTION.md) (referenced)
- `src/lib/auth/route-protection.ts`, `src/lib/supabase/middleware.ts`
- API route handlers under `src/app/api/`
- F15.5 public copy in `src/lib/constants/homepage.ts` and `src/components/public/*`

### Manual audit summary (OWASP API Top 10–aligned)

| ID | Severity | Finding | Status |
|----|----------|---------|--------|
| SEC-R01 | — | No OpenAPI inventory; route matrix documented in `API_SECURITY.md` | **Accepted** (documented) |
| SEC-R02 | — | `POST /api/implementation-requests` intentionally public; guards unchanged | **Pass** |
| SEC-R03 | — | `POST /api/billing/webhook` public at middleware; `constructEvent` required | **Pass** |
| SEC-R04 | — | `POST /api/billing/checkout` session + `authorizeCheckout()` in handler | **Pass** |
| SEC-R05 | — | `GET /api/health` minimal JSON in production unless `HEALTH_DETAIL=verbose` | **Pass** |
| SEC-R06 | — | `GET /api/sarea/preview` not public; middleware requires platform session; `safeRedirectPath` on redirect param | **Pass** |
| SEC-R07 | — | Admin/tenant/portal paths redirect unauthenticated users to `/login` | **Pass** (code review) |
| SEC-R08 | Medium (ops) | In-memory intake rate limit (5/IP/10m) — per-instance on Vercel | **Accepted** (pre-existing) |
| SEC-R09 | Medium (ops) | Turnstile optional unless `TURNSTILE_ENABLED` + keys | **Accepted** (pre-existing) |

**Regression score (F15.6):** No **new** critical/high findings attributable to F15.5. Prior RC1/F1 controls remain in code.

---

## Task 2 — Public surface review

### Routes checked

| Route | Auth | Notes |
|-------|------|-------|
| `/` | Public | F15.5 copy only; no IDs/secrets in static content |
| `/request` | Public | Form uses `runPublicIntakeGuards` via API; reference code shown **after** successful submit only |
| `/architecture` | Public | Marketing content |
| `/security` | Public | Advisory positioning; no fake certification claims added in F15.5 |
| `/pricing` | Public | No bypass of auth for paid actions |
| `/industries` | Public | Marketing content |
| `GET /api/health` | Public | Production returns `{ ok, db, deployReady }` unless `HEALTH_DETAIL=verbose` |
| `POST /api/implementation-requests` | Public + guards | Zod, 256 KiB cap, honeypot, rate limit, optional Turnstile |

### F15.5 copy safety (`homepage.ts`)

- Trust bullets: staging validation wording, end-to-end **flow** support (not “production certified”).
- Explicit line: *“Honest scope: advisory visibility and workflow trust — not guaranteed compliance or autonomous AI detection.”*
- CyberCrow bullet: *“advisory visibility, not a SIEM replacement.”*
- No internal tenant IDs, blueprint IDs, or env secrets in homepage constants/components.

### CTAs

- Hero / lifecycle CTAs point to `/request`, `/architecture`, `/security` — all public prefixes in `PUBLIC_PREFIXES`.
- No links to `/admin/*` or tenant dashboards without auth.

**Result:** **Pass** — F15.5 did not expose internal data or weaken intake.

---

## Task 3 — Auth / route protection (code review)

Source: `src/lib/supabase/middleware.ts` + `route-protection.ts`.

| Scenario | Expected | Code |
|----------|----------|------|
| Unauthenticated `GET /admin/overview` | Redirect `/login?next=…` | `needsAuth` → no user → `redirectToLogin` |
| Unauthenticated `GET /admin/requests` | Redirect login | Same |
| Unauthenticated `GET /{tenant}/dashboard` | Redirect login | `tenantSlug` set → auth required |
| Platform staff `GET /admin/overview` | 200 (role check) | `canAccessPlatformPath` |
| Platform staff `GET /sarea/overview` | 200 | Platform prefix |
| Platform staff `GET /meem-global/dashboard` | 200 | Tenant path + `canAccessTenant` |
| Client `GET /portal/requests` | 200 | Portal prefix; client role allowed |
| Platform staff `GET /portal` (no `?preview=client`) | Redirect to `/admin/overview` | Portal branch anti-trap |

**Live browser matrix:** Not re-run on staging URL in this pass (same as RC1 note). Middleware logic unchanged since F15.5.

**Result:** **Pass** (static review).

---

## Task 4 — API security regression

| Control | Expected | Verified |
|---------|----------|----------|
| Webhook reaches handler without session | `isPublicApiPath` POST webhook | Yes — `route-protection.ts` |
| Webhook requires Stripe signature | `constructEvent` or 400 | Yes — `billing/webhook/route.ts` |
| SAREA preview blocks open redirects | `safeRedirectPath` | Yes — rejects `//`, schemes, `\` |
| SAREA preview not anonymously callable | Middleware auth on `/api/*` | Yes — not in `isPublicApiPath` |
| Checkout handler-authorized | Session + tenant/platform check | Yes — `authorizeCheckout()` |
| Health minimal in production | Reduced JSON | Yes — `health/route.ts` |
| Intake validation + abuse | `runPublicIntakeGuards` | Yes — unchanged; shared with server action |

**Result:** **Pass** — prior fixes intact; no F15.5 code touched API/auth layers.

---

## Task 5 — Validation commands

| Command | Result |
|---------|--------|
| `npm run typecheck` | **Pass** |
| `npm run lint` | **Pass** |
| `npm run build` | **Pass** (Next.js 15.5.18) |
| `npm run public:mirror-manifest` | **Pass** — `docs/internal` in `excludeAlways` |

**Optional:** `npm run simulate:vercel-build:staging` — **not run** (build already passed; Windows Prisma EPERM noted in prior phases if simulate is needed).

---

## Task 6 — Public / internal boundary

| Check | Result |
|-------|--------|
| `docs/internal/` excluded from public mirror | **Pass** |
| Public docs only under `docs/public/` in mirror include list | **Pass** |
| No secrets in F15.5 homepage/components grep | **Pass** |
| `GET /api/implementation-requests` | Platform staff only (not public) |

---

## Fixed issues

**None.** F15.6 is audit-only; no code regressions found.

---

## Accepted risks (unchanged)

1. **Intake rate limit** — in-memory per server instance; recommend Vercel Firewall + Turnstile in production ops.
2. **No OpenAPI** — security reviews remain manual + `API_SECURITY.md`.
3. **Staging trust copy** on homepage references staging validation — accurate, not a production compliance claim.
4. **Auth matrix** — not re-validated in browser this pass; rely on RC1 + unchanged middleware.

---

## Forbidden scope check

| Forbidden | Introduced in F15.6? |
|-----------|----------------------|
| New features | No |
| UI redesign | No |
| Schema changes | No |
| Stripe enforcement | No |
| SCIM / Entra sync | No |
| ERP modules | No |
| Security tooling overbuild | No |
| Secret exposure | No |

---

## Final decision

**F15.6 — PASSED** (25 May 2026)

All acceptance criteria met:

1. Security audit run (manual / `API_SECURITY.md` regression; no OpenAPI for Postman).
2. Public routes — no new exposure from F15.5.
3. Public request flow — guards unchanged.
4. Auth/route protection — middleware logic intact.
5. Prior API security fixes — intact.
6. Public/internal boundary — clean.
7. typecheck / lint / build — pass.
8. Public mirror manifest — pass.
9. No forbidden scope added.

**Recommended before F16:** Optional staging browser spot-check of admin redirect + one intake POST smoke; enable Turnstile + edge rate limit in production env; recapture `homepage-hero.png` (F15.5 cosmetic).
