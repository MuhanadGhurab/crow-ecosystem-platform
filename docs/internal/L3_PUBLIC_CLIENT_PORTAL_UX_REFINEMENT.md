# L3 — Public + Client Portal UX Refinement

**Date:** 29 May 2026  
**Scope:** UX clarity, copy refinement, flow polish on public site and Client Portal. **No** feature expansion, payments, migrations, auth weakening, or auto-provisioning.

**Prerequisites:** L1 (auth-gated `/request`, commercial lifecycle) · L2 (ProCrow workbench)

---

## Part 1 — Public UX audit (summary)

| Route | Clear | Confusing / dense | Action taken |
|-------|-------|-------------------|--------------|
| `/` | Hero engines, how-it-works | Abstract “intelligent operations” framing | Client-facing hero + account gate note on CTA band |
| `/about` | Platform story | Minor overlap with homepage | **Stay** — light touch deferred |
| `/modules` | Module grid | Runtime vs ProCrow prep unclear | `PUBLIC_MODULES_INTRO` + gate note |
| `/industries` | Sector cards | Instant-deploy risk | Readiness-pack copy + gate note |
| `/architecture` | Technical map | N/A for L3 | **Stay** |
| `/security` | Packages | Dense NCA blocks | Header + existing NOT_CLAIMS kept |
| `/pricing` | Tiers | Checkout ambiguity | `CommercialLifecycleMini` + honesty constants |
| `/services` | Add-ons | Overlap with modules extras | **Stay** |
| `/request` | Form | Anonymous path implied | Auth redirect + signed-in hero journey |
| `/login` | Form | Generic sign-in copy | Account-first request purpose |

**Repeated copy reduced:** commercial lifecycle centralized in `commercial-lifecycle-mini.tsx` + `public-client-ux.ts`.

**CTA discipline:** Primary = **Start Enterprise Request**; secondary = explore modules / pricing / security; sign-in path explicit via `PublicRequestGateNote`.

---

## Part 2 — Homepage

- Hero headline/subhead/explainer updated in `homepage.ts` — map company before tenant runtime.
- Hero CTAs: primary request, secondary modules + industries; sign-in note.
- How-it-works title reframed for signed-in request → runtime path.
- Trust proof line no longer implies anonymous public request.
- Bottom CTA band includes `PublicRequestGateNote`.

---

## Part 3 — Nav / CTAs

- `public-header.tsx`: desktop + mobile **Start Enterprise Request** (was mixed “Request access”).
- Browse routes remain public; `/request` auth-gated (L1 unchanged).

---

## Part 4 — Pricing

- `CommercialLifecycleMini` + `PRICING_COMMERCIAL_HONESTY` on pricing page.
- Advisory catalog, setup after scope approval, subscription after runtime ready, 30-day onboarding support (not “free month”), no live checkout.

---

## Part 5 — Modules / industries

- Modules: CEM operational areas, ProCrow prep, runtime in Tenant Runtime / CEM, connection via workflows/tasks/CyberCrow/SAREA.
- Industries: sector templates as readiness packs, not instant production deploy.

---

## Part 6 — Security

- Page header: trust posture, evidence, GRC advisory — not SIEM/certification.
- Existing `NOT_CLAIMS` block retained (no autonomous AI SOC, no legal audit guarantee).

---

## Part 7 — Request page

- `RequestPageHero`: signed-in submission, Client Portal linkage, 6-step journey sidebar.
- Unauthenticated users redirect to `/login?next=/request` (L1).

---

## Part 8 — Login

- `LOGIN_CLIENT_PURPOSE` + `LOGIN_INTERNAL_NOTE` on login page.
- Footer link: **Sign in to submit request**.

---

## Part 9 — Client dashboard (`/client`)

- `ClientNextActionPanel` — status-first next step with continue CTA.
- `ClientJourneySummary` — scannable journey steps.
- `CommercialLifecycleMini` variant client.
- `CLIENT_PORTAL_PURPOSE` in page header.

---

## Part 10 — Client request / proposal / blueprint

- Request detail: pipeline status card before review materials.
- Proposals list: no payment/e-signature claims.
- Blueprint/proposal guardrails unchanged (L1/L5/L6).

---

## Part 11 — Client onboarding

- Description clarifies ProCrow-owned provisioning, F23-gated runtime, no auto go-live.

---

## Part 12 — Shared components

| Component | Role |
|-----------|------|
| `public-request-gate-note.tsx` | Account-required request messaging |
| `commercial-lifecycle-mini.tsx` | Public/client commercial honesty |
| `client-journey-summary.tsx` | Client journey strip |
| `client-next-action-panel.tsx` | Primary next action |
| `public-client-ux.ts` | Central copy constants |

---

## Part 13 — Routing / auth confirmation

| Surface | Gate |
|---------|------|
| Public browse (`/`, `/about`, `/modules`, …) | Public |
| `/request` | Authenticated (redirect if not) |
| `POST /api/implementation-requests` | Authenticated (401 if not) |
| `/client/*` | Client access |
| `/admin/*` | Platform console roles |
| Token proposal route | Informational only — no public approval |

---

## Part 14 — Verification

- `scripts/verify-public-client-ux-refinement.ts`
- `npm run public-client-ux:verify`
- L1 `product-ux:verify` remains required

---

## Part 15 — Validation batch

Documented in commit/PR notes — run:

`mock:verify`, `typecheck`, `lint`, `build`, `public:mirror-manifest`, `product-ux:verify`, `public-client-ux:verify`, client/procrow verifiers per L3 spec.

---

## Remaining gaps

- `/about` and `/services` could use the same CTA gate note (low priority).
- Public header “Sign in” could become “Sign in to request” globally (cosmetic).
- Deeper request form field grouping deferred (not required for L3 acceptance).

---

## Recommended next phase

**K1 — Tenant Runtime Demo Rehearsal** or **L4 — Tenant Runtime / CEM Usability Pass**

---

## L3 decision

**PASSED** when validation batch is green and this doc reflects shipped files.
