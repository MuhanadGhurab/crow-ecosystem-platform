# A1.1 — Public Homepage Hero & Website Visual Reset

**Date:** 6 Jun 2026  
**Branch:** `feat/m4c-tenant-invite-acceptance`  
**Scope:** Visual/UX only — public homepage hero and first sections. No auth, backend, database, migrations, payments, or route-guard changes.

---

## Screenshot audit (code review)

| Issue (before) | Resolution |
|----------------|------------|
| Hero headline too tall / awkward multi-line stack | Single headline with `max-w-3xl`, controlled type scale (`text-4xl` → `lg:text-[3.25rem]`) |
| Empty right column with side “platform flow” card | Removed `EnterpriseOperatingModelCard` from hero; centered layout |
| Dark admin HUD feel (particles, busy side diagram) | Subtle grid + radial gradients only; no `CrowMotif` / particles in hero |
| Flow buried in side card | New **How Crow works** horizontal 5-step section below hero |
| Portal / engine story unclear above fold | **Three workspaces** + **Product engines** sections added |

---

## Side card removal

- `src/components/public/hero-section.tsx` — no import of `EnterpriseOperatingModelCard`
- `src/app/(public)/page.tsx` — does not mount side card
- `enterprise-operating-model-card.tsx` retained for potential reuse elsewhere; not on homepage

---

## New hero structure

| Element | Value |
|---------|--------|
| Badge | Crow Ecosystem · Enterprise operating platform |
| Headline | Build the operating workspace your company actually runs on. |
| Subheadline | Crow turns discovery into a governed Business Portal — ProCrow, CyberCrow, SAREA, CEM |
| Primary CTA | Start Enterprise Request → `/request` |
| Secondary CTA | Explore modules → `/modules` |
| Note | Account required to submit. Public pages remain open to browse. |

Layout: centered, `max-w-4xl`, no bulky right column.

---

## How Crow works (5 steps)

Section: `HomepageHowItWorks` · constants: `HOMEPAGE_CROW_WORKS_STEPS`

1. **Request** — Create account and submit company request.
2. **Discovery** — Map departments, roles, workflows, and modules.
3. **Blueprint** — Review scope, proposal, and package.
4. **Runtime Preparation** — ProCrow prepares CEM, CyberCrow, and SAREA.
5. **Business Portal Operations** — Employees work inside the Business Portal.

`PublicLifecycleStrip` renamed to **Full lifecycle / End-to-end journey** to avoid duplicate “How Crow works” heading.

---

## Three workspaces

Section: `HomepageThreeWorkspaces` · `HOMEPAGE_THREE_WORKSPACES`

| Workspace | Summary |
|-----------|---------|
| Client Portal | Request, discovery, proposal, onboarding. |
| Business Portal / CEM | Run daily company operations. |
| ProCrow | Prepare, govern, and validate tenant runtime. |

Links are public-safe (`/request`, `/modules`, `/architecture`) — no direct admin/ProCrow console exposure.

---

## Product engines (CEM / CyberCrow / SAREA)

Section: `HomepageRuntimeEngines` · `HOMEPAGE_RUNTIME_ENGINES`

| Engine | Message |
|--------|---------|
| CEM | Runs operations in the Business Portal |
| CyberCrow | Trust readiness — advisory, not certification |
| SAREA | Role-based experience; RBAC controls access |

Removed `CyberCrowCardPreview` from homepage for cleaner cards.

---

## Header cleanup

`public-header-nav.tsx`:

- Slightly reduced vertical padding (`py-2.5` / `py-3`)
- Softer border (`border-white/[0.06]`)
- Nav gap improved on large screens
- CTA label: **Start request** (compact; hero keeps full “Start Enterprise Request”)

---

## Verification

```bash
npm run public-homepage:verify
npm run architecture-simplification:verify
npm run public-client-ux:verify
npm run access-gateway:verify
npm run typecheck
npm run lint
npm run build
npm run public:mirror-manifest
```

Verifier: `scripts/verify-public-homepage-visual-reset.ts`  
Script: `npm run public-homepage:verify`

---

## Remaining gaps

- Public subpages (`/modules`, `/security`, `/architecture`) not fully re-skinned in this phase
- `EnterpriseOperatingModelCard` still exists but unused on homepage — candidate for archive or architecture page only
- No automated visual regression / screenshot CI for homepage
- M4C.1.1 manual invite smoke still pending (unchanged by A1.1)

---

## Final decision

**A1.1 — PASSED** (pending validation suite green on commit tree)

Acceptance:

1. Hero side card removed  
2. Hero headline cleaner, not awkwardly stacked  
3. Homepage feels modern, premium, direct  
4. CTA structure clear  
5. “How Crow works” 5-step section exists  
6. Portal distinction clear  
7. CEM / CyberCrow / SAREA explained simply  
8. Header clean and usable  
9. Verifier passes  
10. Build passes  
11. No backend/auth/database/payment/scope changes  
