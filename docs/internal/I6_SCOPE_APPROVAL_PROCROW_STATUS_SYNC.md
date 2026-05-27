# I6 — Scope Approval + ProCrow Status Sync

**Date:** 27 May 2026  
**Status:** Passed  
**Constraint:** No paid infra · no migrations · no token-only approval · no legal/e-signature or payment claims

---

## Objective

Allow a **verified client** (authenticated + strong request ownership) to approve proposal scope on `/client/proposals/[proposalId]`, persist status on existing blueprint fields, notify ProCrow via `platform_notifications`, and surface status on client + admin surfaces. Request-changes deferred until a safe persistence path exists.

---

## Part 1 — Approval surface audit

| Area | Finding |
|------|---------|
| **Schema** | `EnterpriseBlueprint.proposalStatus`, `clientApprovedAt`, `proposalToken` already exist — **no migration** |
| **Legacy** | `approveProposalByToken` in `commercial.service.ts` + `clientApproveProposalAction` — **not** wired on `/proposal/[token]` |
| **Risk UI** | `ProposalClientActions` — must stay off public/client routes |
| **Access** | `clientCanAccessRequest` (email or submitter) for **review**; approval uses **strong ownership** only |
| **Notifications** | `prisma.platformNotification.create` with `eventType: "client_scope_approved"` |
| **Admin** | `/admin/requests/[requestId]` reads blueprint `proposalStatus` / `clientApprovedAt` |

---

## Part 2 — Data contract

**File:** `src/lib/client-portal/client-approval-contract.ts`

- `ClientApprovalAction`, `ClientApprovalEligibility`, `ClientApprovalResult`, `ClientApprovalBlockedReason`
- `MOCK_DEMO_STRONG_OWNERSHIP_EMAIL` (`client.demo@alnoor.test`) — documented mock exception
- `CLIENT_APPROVAL_DISCLAIMER` — not legal signature / not payment / not go-live

---

## Part 3 — Eligibility service

**File:** `src/lib/services/client-approval.service.ts`

- `getClientApprovalEligibility` — read-only; uses `clientCanAccessRequest` then `clientHasStrongRequestOwnership`
- **Strong ownership:** `submittedByUserId === user.id` OR mock demo email
- **Email-only:** review allowed, `canApprove: false`, `ownership_unverified`
- **States:** approvable when `proposalStatus` is `DRAFT` or `SENT`; blocked if `CLIENT_APPROVED` / `DECLINED`

---

## Part 4 — Server action

**File:** `src/lib/actions/client-approval.ts`

- `approveClientProposalScopeAction(proposalId)` — server-only, revalidates client + admin routes
- Calls `approveClientProposalScope` — updates blueprint, creates platform notification (non-blocking on notify failure)
- Mock path: `applyMockClientScopeApproval` in `src/lib/mock/blueprint.ts`
- Does **not:** assign roles, provision tenant, activate billing, change request status automatically

---

## Part 5 — Client approval UI

**Files:**

- `src/components/client-portal/client-proposal-approval-panel.tsx`
- `src/app/client/proposals/[proposalId]/page.tsx`

Button copy: **“Approve scope for ProCrow review”** with disclaimer. Shows precise blocked reasons when not eligible.

---

## Part 6 — Request changes

**Deferred.** Panel shows `CLIENT_APPROVAL_REQUEST_CHANGES_DEFERRED` — no fake message storage.

---

## Part 7 — Client status sync

| Surface | Change |
|---------|--------|
| `/client/proposals` | Approval state badges (`eligible` / `approved` / `blocked`) |
| `/client/proposals/[proposalId]` | Approval panel + eligibility |
| `/client/blueprints/[blueprintId]` | ProCrow notes when `CLIENT_APPROVED` |
| `/client/requests/[requestId]` | Review materials + proposal status from overrides |
| `client-review.service.ts` | `approvalState`, `approvalEligibility` on models |

---

## Part 8 — ProCrow / Admin status sync

**File:** `src/app/admin/requests/[requestId]/page.tsx`

- Banner when `proposalStatus === "CLIENT_APPROVED"` with timestamp when available
- Mock requests use `getMockProposalApprovalOverrides()`

---

## Part 9 — Audit / notification / evidence

- **Implemented:** `platformNotification` row on successful approval (`client_scope_approved`, severity from request split)
- **Not implemented:** separate CyberCrow evidence table write (no safe existing pattern required for I6 minimum)
- Notification failure does not roll back approval

---

## Part 10 — Public token hardening

**File:** `src/app/proposal/[token]/page.tsx`

- `ProposalTokenApprovalNotice` only — no `ProposalClientActions`, no `approveProposalByToken` import
- Verified by `npm run client-approval:verify`

---

## Part 11 — Security verification

**Script:** `scripts/verify-client-approval-flow.ts`  
**Command:** `npm run client-approval:verify`

Also run: `client-portal:verify`, `client-profile:verify`, `client-review:verify`

---

## Remaining gaps

1. **Request changes** — needs ProCrow-visible notes persistence
2. **Persistent ClientOrganization ownership** — production should not rely on submitter-only + mock demo email
3. **Request status** — approval does not auto-advance `ImplementationRequest.status` (intentional; ProCrow-owned)
4. **Onboarding steps** — dashboard steps not yet driven by `CLIENT_APPROVED` (addressed in I7)

## Documented warnings (follow-up, not I6 blockers)

### W1 — Legacy `approveProposalByToken`

`approveProposalByToken` (and related commercial actions) **still exists** as legacy/demo code in `commercial.service.ts` / `commercial` actions. This is **acceptable for I6** because it is **not wired** to the public `/proposal/[token]` route and client approval uses the authenticated server action instead.

**Follow-up:** Deprecate or hard-lock token-based approval (admin-only, feature flag, or removal) so it cannot be reintroduced on public or client surfaces by mistake.

### W2 — Production ownership model

I6 approval allows **strong linkage** via `submittedByUserId === authenticated user` plus a **documented mock demo exception** (`client.demo@alnoor.test`). Email-only linkage remains **review-only**, not approval.

**Follow-up:** Introduce a real **ClientOrganization / membership** model so production approval does not depend on submitter ID alone forever.

---

## Recommended next phase

**I7 — Onboarding Tracker MVP** — link approval to onboarding step completion and ProCrow provisioning checklist without auto-provisioning.

---

## Key files

| Artifact | Path |
|----------|------|
| Contract | `src/lib/client-portal/client-approval-contract.ts` |
| Service | `src/lib/services/client-approval.service.ts` |
| Action | `src/lib/actions/client-approval.ts` |
| UI | `src/components/client-portal/client-proposal-approval-panel.tsx` |
| Mock | `src/lib/mock/blueprint.ts` |
| Verify | `scripts/verify-client-approval-flow.ts` |
