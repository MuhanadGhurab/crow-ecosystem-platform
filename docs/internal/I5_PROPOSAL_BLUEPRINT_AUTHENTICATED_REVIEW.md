# I5 — Proposal / Blueprint Authenticated Review (no paid infra)

**Status:** Passed (27 May 2026)  
**Prerequisite:** [I4 — Client Profile + Company Profile MVP](I4_CLIENT_PROFILE_COMPANY_PROFILE_MVP.md)

---

## Objective

Make **authenticated** proposal and blueprint review useful inside `/client` while keeping all approval actions blocked until verified ownership and audit (I6).

**In scope:** read-only review contract, review service, richer `/client/proposals`, `/client/proposals/[id]`, `/client/blueprints/[id]`, request detail integration, token-route safety checks, `client-review:verify`.

**Not in scope:** approve/reject/request-changes, token-only authorization, schema migrations, payments, production launch, ProCrow status mutation from client UI.

---

## Part 1 — Surface audit (before I5)

| Surface | Before I5 | After I5 |
|---------|-----------|----------|
| `/client/proposals` | Basic list from dashboard snapshot | Review service list + linkage copy + security notes |
| `/client/proposals/[id]` | Minimal status + blocked card | Full scope, modules, security, estimate, ProCrow counterpart |
| `/client/blueprints/[id]` | Module list only | Operating model, org structure summary, readiness gaps |
| `/client/requests/[id]` | Generic proposal/blueprint links | Linked status labels + profile/company readiness |
| `/proposal/[token]` | Pricing + `ProposalTokenApprovalNotice` | Unchanged — informational; no approve UI |
| `approveProposalByToken` | Exists in commercial service/actions | **Unwired** on public + client pages |

**Safely linked today:** requests where `clientCanAccessRequest` passes (email match or `submittedByUserId`).

**Token-only:** locates proposal content; does **not** authorize approval.

---

## Part 2 — Review contract

**File:** `src/lib/client-portal/client-review-contract.ts`

- `ClientReviewAccessState`
- `ClientProposalReviewSummary` / `ClientProposalReviewModel`
- `ClientBlueprintReviewModel`
- `ClientProposalsListModel`
- `ClientRequestReviewLinks`
- `CLIENT_REVIEW_APPROVAL_BLOCKED_REASON` (aligned with I3 portal constant)
- `CLIENT_REVIEW_SECURITY_NOTES`
- `CLIENT_REVIEW_PROCROW_COUNTERPARTS`

---

## Part 3 — Review service

**File:** `src/lib/services/client-review.service.ts`

| Function | Purpose |
|----------|---------|
| `buildClientProposalsListModel(user)` | Proposal summaries for linked requests only |
| `getClientProposalReviewModel(user, proposalId)` | Detail when access allowed (`clientCanAccessRequest`) |
| `getClientBlueprintReviewModel(user, blueprintId)` | Blueprint review with discovery dept/role/workflow names |
| `buildClientRequestReviewLinks(user, requestId)` | Request detail integration |

**Rules:**

- Read-only — no Prisma writes, no approval mutations
- `proposalId` === enterprise blueprint id (existing convention)
- Proposals hidden while `proposalStatus === DRAFT`
- Mock demo: `mock-bp-001` / `mock-req-003` via mock pipeline + `getMockProposalByToken`
- Staff → `platform_staff_preview` access label on pages

---

## Part 4–6 — Client routes

| Route | Highlights |
|-------|------------|
| `/client/proposals` | Authenticated linkage explanation, status badges, estimate range, empty/not-linked states |
| `/client/proposals/[proposalId]` | Scope, modules, security layer, advisory estimate, blueprint link, ProCrow status, approval blocked |
| `/client/blueprints/[blueprintId]` | Operating model, modules, departments/roles/workflows, missing inputs, proposal link |

**UI components:** `ClientReviewSecurityNotes`, `ClientReviewProcrowCounterpart`

---

## Part 7 — Request detail integration

**File:** `src/app/client/requests/[requestId]/page.tsx`

- Review materials card: proposal + blueprint status labels
- Profile/company completeness from I4 hints
- Links to review routes when proposal sent / blueprint exists

---

## Part 8 — Token route safety

**File:** `src/app/proposal/[token]/page.tsx`

- Uses `ProposalTokenApprovalNotice` (sign-in / Client Portal guidance)
- Does **not** import `ProposalClientActions` or `approveProposalByToken`
- `approveProposalByToken` remains in `commercial.service.ts` + `actions/commercial.ts` for legacy/demo only

---

## Part 9 — ProCrow / Admin counterpart

| Client view | ProCrow counterpart |
|-------------|---------------------|
| Proposal review | `/admin/requests` — commercial proposal preparation, send, status |
| Blueprint review | `/admin/blueprints` — readiness, modules, go-live checklist |

ProCrow still owns: proposal send, blueprint readiness, approval processing, tenant provisioning gates.

---

## Part 10 — Security guardrails

- `/client/proposals` and `/client/blueprints` require `requireClientAccess`
- Sensitive reads gated by `clientCanAccessRequest`
- No service role in client review components/services
- No `platform_admin` assignment from client routes
- Approval blocked copy references verified ownership + audit (I6)
- Verifier guards: no approval mutations, no token approve wiring, no overclaim phrases

---

## Part 11 — Verification

```bash
npm run client-review:verify
npm run client-portal:verify
npm run client-profile:verify
```

**Script:** `scripts/verify-client-proposal-review.ts`  
**npm:** `client-review:verify`

---

## Part 12 — Validation (27 May 2026)

| Command | Result |
|---------|--------|
| `npm run mock:verify` | Pass |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm run build` | Pass |
| `npm run public:mirror-manifest` | Pass |
| `npm run client-portal:verify` | Pass |
| `npm run client-profile:verify` | Pass |
| `npm run client-review:verify` | Pass |

---

## Remaining gaps (I6+)

- Verified ownership + approval audit trail before client approve/reject
- `ClientOrganization` / delegated reviewers (I2 schema gap)
- ProCrow ↔ client status sync on approval events
- Company profile editing beyond request-derived data
- No production launch / payments / external APIs

---

## Recommended next

**I6 — Scope Approval + ProCrow Status Sync** — wire guarded approval actions only after ownership verification and audit logging.
