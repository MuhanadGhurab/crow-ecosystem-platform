# I7 — Onboarding Tracker MVP

**Status:** Passed (27 May 2026)  
**Audience:** Internal delivery / engineering  
**Depends on:** I6 scope approval + ProCrow status sync

---

## Objective

Deliver a **read-only, derived** onboarding visibility layer that connects client scope approval → ProCrow review → missing information → readiness steps → tenant runtime state — without auto-provisioning tenants, activating payments, or implying production launch.

---

## Onboarding audit (before I7)

| Surface | Prior state |
|---------|-------------|
| `/client/onboarding` | Basic page; limited step model |
| `onboarding-steps.ts` | Six steps derived from request status only |
| `client-portal.service` | Dashboard snapshot included legacy onboarding steps |
| `/client` home | No dedicated onboarding status tile |
| Request / proposal / blueprint | No unified onboarding tracker link |
| Admin request detail | Scope approval banner only; no onboarding readiness panel |

**Safe to derive from existing data:** request status, blueprint `proposalStatus` / `clientApprovedAt`, profile/company completeness (I4), tenant relation on blueprint when present.

**Not safe:** auto tenant creation, payment activation, production go-live claims, legal/e-signature wording.

---

## Contract

**File:** `src/lib/client-portal/client-onboarding-contract.ts`

- `ClientOnboardingStatus` — advisory statuses (`waiting_for_scope_approval`, `scope_approved`, `procrow_review`, `missing_information`, `provisioning_ready`, `tenant_pending`, `tenant_ready`, etc.)
- `ClientOnboardingStep` — key, label, status, owner (`client` \| `procrow` \| `system` \| `tenant_admin`), description, optional routes and blocked reasons
- `ClientOnboardingTracker` — overall status, steps, missing information, ProCrow/client next actions, tenant runtime state, approval summary, trust notes
- `ONBOARDING_PRODUCTION_GATED_NOTE` — shared copy that production remains F23-gated

Legacy `onboarding-steps.ts` remains for dashboard snapshot compatibility; I7 uses `client-onboarding-steps.ts` for the 12-step model.

---

## Service / adapter

**File:** `src/lib/services/client-onboarding.service.ts`

| Export | Purpose |
|--------|---------|
| `buildClientOnboardingTracker` | Full tracker for a request (access-gated via `clientCanAccessRequest`) |
| `buildClientOnboardingOverview` | Primary linked request for `/client/onboarding` |
| `buildClientOnboardingDashboardTile` | Compact tile for `/client` home |
| `buildClientOnboardingTrackerForAdmin` | ProCrow/admin read model (no client access gate) |

**Rules (derived, no writes):**

- No proposal / not sent → `procrow_review` or `not_started`
- Proposal not `CLIENT_APPROVED` → `waiting_for_scope_approval`
- Approved + incomplete profile/company → `missing_information`
- Approved + complete profile + blueprint in review → `provisioning_ready` / `procrow_review`
- Tenant exists, inactive → `tenant_pending`
- Tenant active → `tenant_ready` (still advisory; production gated)

**Data loading:** `listClientRequests` extended to include blueprint `clientApprovedAt` and `tenant { id, slug, isActive }`.

---

## `/client/onboarding`

**File:** `src/app/client/onboarding/page.tsx`

- Uses `buildClientOnboardingOverview` + `ClientOnboardingTrackerPanel`
- Timeline, current step, client/ProCrow next actions, missing information, tenant runtime state, trust notes
- Links to proposal, blueprint, profile, company, requests

**Components:**

- `client-onboarding-tracker-panel.tsx` — full tracker UI
- `client-onboarding-dashboard-tile.tsx` — home dashboard tile
- `client-onboarding-summary-card.tsx` — compact card on detail pages

---

## Dashboard integration

**File:** `src/app/client/page.tsx`

- Parallel fetch: `buildClientOnboardingDashboardTile`
- Shows status, current step, next action, link to `/client/onboarding`

---

## Request / proposal / blueprint integration

| Route | Integration |
|-------|-------------|
| `/client/requests/[requestId]` | `ClientOnboardingSummaryCard` + link to tracker |
| `/client/proposals/[proposalId]` | Onboarding summary after approval context |
| `/client/blueprints/[blueprintId]` | Onboarding summary for blueprint readiness |

---

## ProCrow / admin

**File:** `src/app/admin/requests/[requestId]/page.tsx`

- `buildClientOnboardingTrackerForAdmin` + `AdminOnboardingReadinessPanel`
- Surfaces overall status, current step, ProCrow next actions, missing information, tenant runtime (when known)
- Does **not** auto-provision tenant or change permissions

---

## Onboarding steps model (12 steps)

**File:** `src/lib/client-portal/client-onboarding-steps.ts`

1. Request submitted  
2. ProCrow review  
3. Discovery / blueprint readiness  
4. Proposal sent  
5. Client scope approval  
6. Profile / company information check  
7. ProCrow onboarding review  
8. CyberCrow trust readiness  
9. SAREA experience readiness  
10. Tenant runtime provisioning readiness  
11. Tenant runtime pending  
12. Tenant runtime ready  

Each step has owner, description, status, and related route where applicable.

---

## Trust / safety copy

- Scope approval does **not** activate production or payment.
- Tenant runtime provisioning remains **ProCrow-controlled** (no auto-create).
- CyberCrow / SAREA readiness are operational checks, not certifications.
- Production launch remains **F23-gated**.
- Onboarding tracker is **advisory** unless future persistence is explicitly approved.

---

## Verification

```bash
npm run client-onboarding:verify
```

Also run: `client-portal:verify`, `client-profile:verify`, `client-review:verify`, `client-approval:verify`.

---

## Documented warnings (carry-forward from I6)

1. **`approveProposalByToken`** — legacy/demo; not wired to `/proposal/[token]`; deprecate or harden later.  
2. **Ownership** — `submittedByUserId` is interim; future **ClientOrganization / membership** model required.

---

## Remaining gaps

- No persisted onboarding state table (derived only).
- Legacy six-step helper still on dashboard snapshot path.
- Admin list/overview does not yet show onboarding columns (request detail is sufficient for MVP).
- Request-changes workflow still deferred.
- Real multi-user client org membership not implemented.

---

## Recommended next phase

**I8 — Client Portal Polish & Demo Rehearsal** — tighten copy, demo paths (`mock-req-003`), and cross-link operator playbook.
