# Client Portal — operator runbook

**Audience:** Engineers and demo operators  
**Mode:** Staging / mock — **not** production launch  
**Arc:** I1–I10 complete · checkpoint **I11**

**Deep reference:** [`I11_CLIENT_PORTAL_CHECKPOINT_PAUSE.md`](I11_CLIENT_PORTAL_CHECKPOINT_PAUSE.md)  
**Demo script (~10 min):** [`I8_CLIENT_PORTAL_DEMO_PLAYBOOK.md`](I8_CLIENT_PORTAL_DEMO_PLAYBOOK.md)

---

## What the portal does (today)

- Authenticated **Client Portal** at `/client` for linked buyers
- **Profile** and **company** readiness (no scope approval on those pages)
- **Proposal / blueprint review** and **gated scope approval** on proposal detail (verified owner/approver)
- **Onboarding tracker** (visibility only — ProCrow controls provisioning)
- **Review notes** for linked reviewers; **request-changes** only for `canApproveScope` on `SENT` proposals
- **Public** `/proposal/[token]` is informational — sign in for any authoritative action

---

## What it does **not** do

- Legal e-signature or contract execution
- Live payments or billing activation
- Automatic tenant provisioning or production go-live
- Token-link approval or feedback
- Compliance certification or AI-reviewed approval claims

---

## Quick verify (before demo or resume)

```bash
npm run mock:verify
npm run typecheck
npm run lint
npm run client-portal:verify
npm run client-profile:verify
npm run client-review:verify
npm run client-approval:verify
npm run client-onboarding:verify
npm run client-demo:verify
npm run client-org:verify
npm run client-notes:verify
```

Full build (optional): `npm run build` · `npm run public:mirror-manifest`

---

## Demo path (mock)

| Step | Route | Proof |
|------|-------|-------|
| 1 | `/login` | Authenticated client |
| 2 | `/client` | Dashboard + trust strip |
| 3 | `/client/profile` · `/client/company` | Readiness |
| 4 | `/client/requests/mock-req-003` | Linked request |
| 5 | `/client/proposals/mock-bp-001` | Review + approval + feedback |
| 6 | `/client/onboarding` | Tracker (operator-controlled) |
| 7 | `/proposal/[token]` | Informational only — no actions |

**Demo user (mock):** `client.demo@alnoor.test` · **Request:** `mock-req-003` · **Blueprint:** `mock-bp-001`

Say **“staging / mock”** at the start of any walkthrough.

---

## Routes to spot-check

| Area | Routes |
|------|--------|
| Client | `/client`, `/client/profile`, `/client/company`, `/client/settings`, `/client/requests`, `/client/proposals`, `/client/onboarding` |
| Detail | `/client/requests/[requestId]`, `/client/proposals/[proposalId]`, `/client/blueprints/[blueprintId]` |
| Public | `/proposal/[token]` — must have **no** approve/notes/changes |
| ProCrow | `/admin/requests`, `/admin/requests/[requestId]` |

---

## Security guardrails (do not regress)

1. `/client` requires login.
2. Public token does not approve scope or submit feedback.
3. Approval uses server actions gated by **`canApproveScope`** (I9).
4. Email-only reviewers: notes OK; no approval; no official request-changes.
5. No `service_role` in client-facing code paths.
6. No client route assigns `platform_admin`.
7. No tenant auto-provision or payment activation from client flows.

Verifiers enforce these statically — run the `client-*:verify` batch after client changes.

---

## Manual smoke (still open)

Logged-in flows on **real staging** (owner, email-only reviewer, platform staff) are **not** fully closed in automation. Use the checklist in [`I11_CLIENT_PORTAL_CHECKPOINT_PAUSE.md`](I11_CLIENT_PORTAL_CHECKPOINT_PAUSE.md#manual-smoke-test-checklist) before external demos.

---

## After I11 — what’s next

| Priority | Phase | Why |
|----------|-------|-----|
| **Primary** | **J1 — ProCrow Portal UX Unification** | Resume with operator-wide UX, not new client authority |
| **Alternative** | **I12 — Manual Smoke Closure** | Close staging sign-in checklist |
| **Pause** | None until demo pressure | I-track checkpoint complete |

---

## Phase docs index (I1–I11)

| Phase | Document |
|-------|----------|
| I1 | [`I1_CROW_PORTAL_ARCHITECTURE_PROCROW_MODEL.md`](I1_CROW_PORTAL_ARCHITECTURE_PROCROW_MODEL.md) |
| I2 | [`I2_CLIENT_PROPOSAL_PORTAL_AUTH_FLOW_DESIGN.md`](I2_CLIENT_PROPOSAL_PORTAL_AUTH_FLOW_DESIGN.md) |
| I3 | [`I3_CLIENT_PORTAL_DATA_CONTRACT_ROUTE_SKELETON.md`](I3_CLIENT_PORTAL_DATA_CONTRACT_ROUTE_SKELETON.md) |
| I4 | [`I4_CLIENT_PROFILE_COMPANY_PROFILE_MVP.md`](I4_CLIENT_PROFILE_COMPANY_PROFILE_MVP.md) |
| I5 | [`I5_PROPOSAL_BLUEPRINT_AUTHENTICATED_REVIEW.md`](I5_PROPOSAL_BLUEPRINT_AUTHENTICATED_REVIEW.md) |
| I6 | [`I6_SCOPE_APPROVAL_PROCROW_STATUS_SYNC.md`](I6_SCOPE_APPROVAL_PROCROW_STATUS_SYNC.md) |
| I7 | [`I7_ONBOARDING_TRACKER_MVP.md`](I7_ONBOARDING_TRACKER_MVP.md) |
| I8 | [`I8_CLIENT_PORTAL_POLISH_DEMO_REHEARSAL.md`](I8_CLIENT_PORTAL_POLISH_DEMO_REHEARSAL.md) |
| I9 | [`I9_CLIENT_ORGANIZATION_MEMBERSHIP_LINKAGE.md`](I9_CLIENT_ORGANIZATION_MEMBERSHIP_LINKAGE.md) |
| I10 | [`I10_REQUEST_CHANGES_CLIENT_REVIEW_NOTES.md`](I10_REQUEST_CHANGES_CLIENT_REVIEW_NOTES.md) |
| I11 | [`I11_CLIENT_PORTAL_CHECKPOINT_PAUSE.md`](I11_CLIENT_PORTAL_CHECKPOINT_PAUSE.md) |
