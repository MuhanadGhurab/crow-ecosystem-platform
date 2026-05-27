# I10 — Request changes + client review notes (no paid infra)

**Date:** 27 May 2026  
**Status:** Passed (static verification + implementation)  
**Depends on:** I9 (`canApproveScope`), I6 (scope approval), platform notification inbox

---

## Objective

Add a **client feedback and review coordination layer** so authenticated, linked clients can send review notes to ProCrow and (when verified) request changes — without weakening approval security, legal/e-signature claims, payments, or tenant auto-provisioning.

---

## Surface audit (Part 1)

| Surface | Before I10 | After I10 |
|---------|------------|-----------|
| `/client/proposals/[id]` | Scope approval panel only | Approval + **review feedback panel** |
| `/client/blueprints/[id]` | Read-only review | **Review feedback panel** |
| `/client/requests/[id]` | Review links only | **Review feedback panel** |
| `/client/onboarding` | Tracker only | Unchanged (notes visible on linked surfaces) |
| `/proposal/[token]` | Sign-in notice only | **Unchanged** — no feedback forms |
| `/admin/requests/[id]` | Scope-approved banner | **Client review feedback panel** + inbox link |

**Persistence:** Reuses `PlatformNotification` with event types `client_review_note` and `client_request_changes` (same pattern as `client_scope_approved`). Mock mode uses `src/lib/mock/client-review-notes.ts`. **No new Prisma migration.**

---

## Contract (Part 2)

`src/lib/client-portal/client-review-notes-contract.ts`

- Note types: `general_note`, `blueprint_question`, `scope_clarification`, `request_changes`, `onboarding_question`
- Eligibility: `ClientRequestChangesEligibility` with `canSubmitReviewNote`, `canRequestChanges`, `noteOnlyMode`, blocked reasons
- Copy/disclaimers: feedback does not activate production or payment; not legal signature

---

## Eligibility model (Part 3)

| Actor | Review note | Official request changes |
|-------|-------------|---------------------------|
| Linked authenticated client | Yes | Only if `canApproveScope` and proposal `SENT` |
| Email-only reviewer | Yes | No (`ownership_unverified`) |
| Platform staff preview | No | No |
| Public token visitor | No | No |

**Request-changes behavior:** Creates ProCrow notification only; **does not** mutate `proposalStatus` to rejected/cancelled.

---

## Service & actions (Parts 3–4)

- `src/lib/services/client-review-notes.service.ts` — eligibility, list, submit, request-changes, admin list
- `src/lib/actions/client-review-notes.ts` — server actions with revalidation

Gates: `clientCanAccessRequest`, `getClientOrganizationAccessDecisionForRequest`, staff preview block.

---

## UI (Part 5)

- `ClientReviewFeedbackPanel` — note form + optional request-changes button + submitted notes list
- `AdminClientReviewFeedbackPanel` — ProCrow view on admin request detail
- Approval panel: removed “coming soon”; points users to feedback section below

---

## ProCrow counterpart (Part 7)

- Admin request page shows feedback list with next-action hints
- Platform notification inbox titles for `client_review_note` / `client_request_changes`
- Deep link: `routes.admin.request(requestId)`

---

## Public token safety (Part 8)

`/proposal/[token]` — no `ClientReviewFeedbackPanel`, no approval, no request-changes. Verified by `client-notes:verify`.

---

## Verification

```bash
npm run client-notes:verify
```

Also run client track verifiers: `client-portal:verify`, `client-profile:verify`, `client-review:verify`, `client-approval:verify`, `client-onboarding:verify`, `client-demo:verify`, `client-org:verify`.

---

## Remaining gaps

- No dedicated “review notes” DB table (notification-only persistence)
- No client↔ProCrow threaded messaging UI
- No automatic onboarding step reversal on request-changes
- Manual logged-in UI smoke still open (same as I9.1)

---

## Recommended next phase

**Option A — I11 Client portal checkpoint & pause**  
**Option B — J1 ProCrow portal UX unification**  
**Option C — I11 Client organization admin verification tools**
