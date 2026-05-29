# L1 — Product UX Simplification, Auth-Gated Request Flow & Commercial Lifecycle

**Date:** 29 May 2026  
**Type:** Design, routing, hierarchy, auth-flow, and usability — **not** a feature expansion phase.

**Constraints honored:** No paid infra, live payments, production launch, external APIs, destructive seeds, auto-provisioning, schema migrations, route-breaking refactors, auth weakening, or compliance/AI/legal overclaims.

---

## Product truth (four portals)

| Portal | Purpose |
|--------|---------|
| **Public site** | Help clients understand Crow — modules, industries, security, pricing. |
| **Client portal** | Signed-in clients request, review proposals/blueprints, approve scope, track onboarding. |
| **ProCrow** | Internal control tower — request-to-tenant, trust, experience, validation, deployment discipline. |
| **Tenant runtime / CEM** | Business operations — modules, workflows, tasks, reports. |

---

## UX audit (pre-L1)

- Public site: strong visuals but dense copy and multiple equal-weight CTAs.
- `/request`: allowed anonymous POST while promoting serious ERP intake.
- ProCrow admin: flat 14-item sidebar; overview stacked maps, stats, and engine blocks above the fold.
- Client portal: already had next-actions; needed clearer account-linked request wording.

---

## L1 deliverables

### Public site

- Hero and homepage CTAs clarified: browse freely; **sign in to submit**.
- Request page hero copy: account-linked submission.
- Lifecycle strip and header CTA labels tightened.

### Auth-gated request flow

- `/request` removed from `PUBLIC_PREFIXES` — middleware redirects to `/login?next=/request`.
- Request page server redirect when auth configured.
- `POST /api/implementation-requests` requires session (401 if missing); removed from public API allowlist.
- Server action throws if unauthenticated (when auth enabled).
- `submittedByUserId` set on authenticated submit.

### Client portal

- Dashboard header copy: requests linked to signed-in account.

### ProCrow navigation

- Grouped sidebar: Command · Customer flow · Tenant operations · Trust & experience · Release center.
- Routes and permissions unchanged.

### ProCrow overview

- Above the fold: priority next action, status cards, workflow strip, control tower dashboard.
- Commercial lifecycle card + tenant runtime framing.
- Secondary signals in collapsible **More platform signals** (includes control tower map).

### Workflow model

- `PROCROW_OPERATOR_WORKFLOW_STEPS` on overview, queue, and request detail.
- Operator guidance only — no automation.

### Commercial lifecycle

- `COMMERCIAL_LIFECYCLE_STEPS` — copy/model only; manual/deferred payments; no checkout.

### Tenant runtime / CEM relationship

- `ProCrowTenantRuntimeFraming` — ProCrow prepares; CEM operates.

### Route discipline

- Documented in `src/lib/constants/product-portal-routing.ts`.

### Verification

- `npm run product-ux:verify` — `scripts/verify-product-ux-simplification.ts`.

---

## Validation (29 May 2026)

| Command | Result |
|---------|--------|
| `npm run mock:verify` | Green |
| `npm run typecheck` | Green |
| `npm run lint` | Green |
| `npm run build` | Green (non-fatal Prisma warning: `client_organization_request_links` may be absent locally) |
| `npm run public:mirror-manifest` | Green |
| `npm run product-ux:verify` | Green |
| `npm run client-portal:verify` | Green |
| `npm run client-approval:verify` | Green |
| `npm run client-org:verify` | Green |
| `npm run client-notes:verify` | Green |
| `npm run procrow:verify` | Green (J1–J8) |
| `npm run procrow-go-no-go:verify` | Green |
| `npm run procrow-operator:verify` | Green |

**Not run:** migrations, destructive seeds, payments, auto-provision.

---

## Remaining gaps

- **L2** — deeper ProCrow workbench / per-page density reduction.
- **K1** — tenant runtime demo rehearsal.
- **J10** — manual browser smoke on ProCrow demo routes.
- Public pages (pricing/security) could receive another copy pass.
- Legacy anonymous intake path removed from API; dev `AUTH_DISABLED` still allows local unauthenticated testing.

---

## Recommended next

1. **L2 — ProCrow Workbench UX Redesign** (queue, request detail, tenant pages).
2. **K1 — Tenant Runtime Demo Rehearsal**.

---

**Status:** **Passed** (29 May 2026)
