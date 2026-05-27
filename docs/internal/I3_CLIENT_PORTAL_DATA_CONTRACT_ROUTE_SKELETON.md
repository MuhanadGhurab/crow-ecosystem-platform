# I3 — Client Portal Data Contract & Route Skeleton (no paid infra)

**Status:** Passed (27 May 2026)  
**Prerequisite:** [I2 — Client / Proposal Portal Auth Flow Design](I2_CLIENT_PROPOSAL_PORTAL_AUTH_FLOW_DESIGN.md)

---

## Objective

Deliver a **safe skeleton** for the Client / Proposal Portal: typed data contract, read-only service adapter, authenticated `/client/*` routes, client-friendly shell, and guardrails so proposal/blueprint data is not exposed or approved via token alone.

**Not in scope:** full portal, schema migrations, payments, production launch, working approve/reject without ownership enforcement.

---

## Part 1 — Current surface review (reused)

| Area | Routes / modules | I3 use |
|------|------------------|--------|
| Public intake | `/request`, `/proposal/[token]` | Unchanged intake; token page copy + no token-only approve UI |
| Auth | `/login`, `/auth/callback`, `requireClientAccess`, middleware `isPortalPath` | Extended to `/client` |
| Legacy client | `/portal/*` | **Preserved**; shell links to legacy list |
| ProCrow | `/admin/requests`, `/admin/tenants/*` | Documented as counterparts; permissions unchanged |
| Linking | `client-request-link.service.ts`, `listClientRequests`, `clientCanAccessRequest` | Used for ownership checks on detail pages |
| Commercial (legacy) | `approveProposalByToken`, `ProposalClientActions` | **Not** wired on public token page in I3 |

---

## Part 2 — Data contract

**File:** `src/lib/client-portal/client-portal-contract.ts`

Defines:

- `ClientPortalUserRole`, `ClientPortalAccessLevel`, `ClientPortalAuthState`
- `ClientPortalCompanyProfile`, `ClientPortalRequestSummary`, `ClientPortalProposalSummary`, `ClientPortalBlueprintSummary`
- `ClientPortalOnboardingStep`, `ClientPortalDashboardSnapshot`
- `PROCROW_COUNTERPARTS` — ProCrow vs client responsibilities
- `CLIENT_PORTAL_APPROVAL_BLOCKED_REASON`, `CLIENT_PORTAL_TOKEN_LINK_NOTICE`

**File:** `src/lib/client-portal/onboarding-steps.ts` — rule-based onboarding timeline from request/proposal/blueprint status (no DB schema).

---

## Part 3 — Service / adapter

**File:** `src/lib/services/client-portal.service.ts`

- `buildClientPortalDashboardSnapshot(user)` — read-only aggregation
- `unauthenticatedClientPortalSnapshot()` — safe empty state
- `resolveClientPortalAuthState(user)` — unauthenticated / unlinked / linked / platform staff

**Rules enforced in code:**

- No approval mutations
- No service role in this module (linking remains in server-only link service)
- Staff users get `platform_staff` auth state; not treated as normal client on overview unless preview
- Mock mode uses `MOCK_CLIENT_REQUESTS` / pipeline mocks when DB link is unavailable

**Known gap (documented):** persistent `ClientAccount` ↔ `ImplementationRequest` linkage is email-based today; full company profile and multi-user roles need future schema (per I2).

---

## Part 4 — Route skeleton

| Route | Purpose |
|-------|---------|
| `/client` | Overview dashboard snapshot |
| `/client/profile` | Account placeholder |
| `/client/company` | Company profile placeholder / completeness |
| `/client/requests` | Request list (staff redirected unless `?preview=client`) |
| `/client/requests/[requestId]` | Request detail with ownership check |
| `/client/proposals` | Proposal list |
| `/client/proposals/[proposalId]` | Proposal detail; approval blocked |
| `/client/blueprints/[blueprintId]` | Blueprint detail; approval blocked |
| `/client/onboarding` | Onboarding step timeline |
| `/client/settings` | Settings placeholder |

**Auth:** `src/app/client/layout.tsx` calls `requireClientAccess`. `routes.client.*` in `src/lib/routes.ts`. `CLIENT_AREA_PREFIXES` includes `/client`.

---

## Part 5 — Layout / navigation

**Components:**

- `client-portal-shell.tsx` — nav: Overview, Profile, Company, Requests, Proposals, Onboarding, Settings
- `client-portal-status-card.tsx`, `client-portal-next-actions.tsx`
- `client-portal-approval-blocked.tsx` — disabled future approval copy

Design: client-facing language; status cards; mobile-readable; no dense admin jargon.

---

## Part 6 — Proposal / blueprint skeleton

- Client routes show title/status when `clientCanAccessRequest` passes
- `ClientPortalApprovalBlocked` on proposal and blueprint detail pages
- No working approve/reject buttons on `/client/*` in I3

---

## Part 7 — Public proposal token safety

**File:** `src/app/proposal/[token]/page.tsx`

When proposal is actionable (`SENT`), renders `ProposalTokenApprovalNotice` instead of `ProposalClientActions`.

Copy directs users to sign in to Client Portal. Token remains a **locator**, not authorization.

Legacy `approveProposalByToken` remains in codebase for admin/demo paths but is **not** exposed on the public token page.

---

## Part 8 — ProCrow / Admin counterparts

From `PROCROW_COUNTERPARTS` in contract:

| Client portal | ProCrow (admin) |
|---------------|-----------------|
| Submit request | Review intake |
| View linked requests | Discovery / blueprint authoring |
| Read proposal/blueprint (when linked) | Send proposal, set blueprint status |
| Onboarding visibility (skeleton) | Go-live readiness, tenant provisioning |
| Future scope approval (authenticated) | Internal approval gates |

Admin permissions and routes were **not** changed in I3.

---

## Part 9 — Security / trust guardrails

| Guardrail | I3 state |
|-----------|----------|
| No token-only approval on public page | Enforced (notice only) |
| No `platform_admin` from client signup | `ensureClientRole` sets `client` only |
| No service role in client components | Verified by `client-portal:verify` |
| Client routes auth-gated | `requireClientAccess` in layout |
| Cross-client data | `clientCanAccessRequest` on detail routes |
| Approval mutations | Deferred; blocked UI only |

---

## Part 10 — Verification

**Script:** `scripts/verify-client-portal-skeleton.ts`  
**Command:** `npm run client-portal:verify`

Checks contract, routes, service, layout auth, proposal page wiring, forbidden claims, dangerous patterns.

---

## Remaining gaps → recommended I4

1. **I4 — Client Profile + Company Profile MVP** — editable profile, company linkage, notification prefs stub
2. Schema for `ClientOrganization` membership and role assignments (reviewer vs approver)
3. Server actions for scope approval with audit log + `clientCanAccessRequest` + role check
4. Deprecate or gate `approveProposalByToken` behind explicit demo flag only
5. Blueprint list page or `?request=` handler on `/client/blueprints`

---

## Validation (I3 sign-off)

Run with repo standard suite:

```bash
npm run mock:verify
npm run typecheck
npm run lint
npm run build
npm run public:mirror-manifest
npm run client-portal:verify
```

No migrations, destructive seeds, payments, or external APIs.
