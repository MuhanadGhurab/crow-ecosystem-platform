# I11 — Client Portal Checkpoint & Pause (no paid infra)

**Date:** 27 May 2026  
**Audience:** Internal delivery / engineering  
**Phase type:** Checkpoint, validation, documentation, pause-readiness — **not** feature expansion.

**Git baseline:** `55b5efd` — I10 on `main` (pushed).

---

## Executive summary

The **I-series Client / Proposal Portal** arc (**I1–I10**) is **complete** for the current staging/demo scope. The portal supports authenticated review, gated scope approval, onboarding visibility, organization linkage, and client feedback — with static guardrails and verifiers. **Production launch, live payments, tenant auto-provisioning, and legal/e-signature workflows are out of scope.**

**Pause recommendation:** **Pause the I-track** after I11 unless there is immediate demo pressure. **Primary resume:** **J1 — ProCrow Portal UX Unification**. **Alternative:** **I12 — Client Portal Manual Smoke Closure** if production/staging sign-in smoke is required before J1.

---

## I-series arc audit (I1–I10)

| Phase | Doc | Complete | Staging / demo | Future / open |
|-------|-----|----------|--------------|---------------|
| **I1** | [`I1_CROW_PORTAL_ARCHITECTURE_PROCROW_MODEL.md`](I1_CROW_PORTAL_ARCHITECTURE_PROCROW_MODEL.md) | Four-portal model, ProCrow control tower, team/RACI, maturity model | Architecture reference for all later I phases | Full ProCrow certification automation |
| **I2** | [`I2_CLIENT_PROPOSAL_PORTAL_AUTH_FLOW_DESIGN.md`](I2_CLIENT_PROPOSAL_PORTAL_AUTH_FLOW_DESIGN.md) | Auth boundaries, token trust gap, approval requires login | Design baseline for I3+ | Full SSO/Entra production matrix |
| **I3** | [`I3_CLIENT_PORTAL_DATA_CONTRACT_ROUTE_SKELETON.md`](I3_CLIENT_PORTAL_DATA_CONTRACT_ROUTE_SKELETON.md) | `/client/*` shell, data contract, token page sign-in notice | Mock + staging routes | Full CRM-style client admin |
| **I4** | [`I4_CLIENT_PROFILE_COMPANY_PROFILE_MVP.md`](I4_CLIENT_PROFILE_COMPANY_PROFILE_MVP.md) | Profile/company readiness, safe metadata edit | Demo completeness meters | Multi-org company editing |
| **I5** | [`I5_PROPOSAL_BLUEPRINT_AUTHENTICATED_REVIEW.md`](I5_PROPOSAL_BLUEPRINT_AUTHENTICATED_REVIEW.md) | Authenticated proposal/blueprint review (read-only) | `mock-bp-001` rehearsal | Rich diff/comment threads |
| **I6** | [`I6_SCOPE_APPROVAL_PROCROW_STATUS_SYNC.md`](I6_SCOPE_APPROVAL_PROCROW_STATUS_SYNC.md) | Server-side scope approval + ProCrow notification sync | Staging approval on linked proposal | Legal contract execution |
| **I7** | [`I7_ONBOARDING_TRACKER_MVP.md`](I7_ONBOARDING_TRACKER_MVP.md) | Client onboarding tracker (read-mostly) | Operator-controlled steps | Auto tenant provision |
| **I8** | [`I8_CLIENT_PORTAL_POLISH_DEMO_REHEARSAL.md`](I8_CLIENT_PORTAL_POLISH_DEMO_REHEARSAL.md) · [`I8_CLIENT_PORTAL_DEMO_PLAYBOOK.md`](I8_CLIENT_PORTAL_DEMO_PLAYBOOK.md) | Polish + ~10 min demo script | Primary demo path | Production marketing claims |
| **I9** | [`I9_CLIENT_ORGANIZATION_MEMBERSHIP_LINKAGE.md`](I9_CLIENT_ORGANIZATION_MEMBERSHIP_LINKAGE.md) | `canApproveScope` decision model; migration `20260527120000_client_org_membership` applied remotely | Read-only membership UI on company/settings | Admin verification tools, backfill |
| **I10** | [`I10_REQUEST_CHANGES_CLIENT_REVIEW_NOTES.md`](I10_REQUEST_CHANGES_CLIENT_REVIEW_NOTES.md) | Review notes + gated request-changes via `PlatformNotification` | Notification-only persistence | Dedicated notes table, auto status reversal |

**Manual testing still open (all I phases):** logged-in **owner / approver / email-only reviewer / platform staff** flows on a real staging deployment (I9.1 conditional pass; I10 notes/changes UI not fully smoke-tested in production session).

---

## Capability summary

| Capability | Status | Primary route(s) | Source of truth | Safety notes | ProCrow counterpart | Next improvement |
|------------|--------|------------------|-----------------|--------------|---------------------|------------------|
| Authenticated portal shell | **Complete** | `/client` | `client-portal` layout + `requireClientAccess` | Gated; no `platform_admin` from client | `/admin/overview` | J1 UX unification |
| Profile readiness | **Staging-ready** | `/client/profile` | `client-profile.service` | Session metadata only | Request detail context | Editable company linkage |
| Company readiness | **Staging-ready** | `/client/company` | `client-company` + org linkage (I9) | Read-only org context | Admin request | Verified org admin tools (I12 alt.) |
| Request history | **Staging-ready** | `/client/requests`, `/client/requests/[id]` | `client-request-link` | `clientCanAccessRequest` | `/admin/requests/[id]` | Richer timeline |
| Proposal review | **Staging-ready** | `/client/proposals`, `/client/proposals/[id]` | `client-review.service` | Read-only until approval panel | Same admin route | Version compare |
| Blueprint review | **Staging-ready** | `/client/blueprints/[id]` | `client-review.service` | Same linkage rules | Same | Blueprint-specific actions |
| Safe scope approval | **Staging-ready** | `/client/proposals/[id]` | `client-approval.service` + I9 decision | `canApproveScope`; server-side; no token approve | Notifications + admin detail | Manual prod smoke |
| Onboarding tracker | **Demo-only** | `/client/onboarding` | `client-onboarding` service | ProCrow-controlled; no auto provision | `/admin/tenants/[id]` | Checkpoint/pause banners |
| Review notes | **Staging-ready** | Proposal/blueprint/request detail | `client-review-notes.service` + notifications | Linked reviewers only | Admin feedback panel | Dedicated storage (future) |
| Request-changes | **Staging-ready** | Proposal detail (eligible users) | Same + `canApproveScope` + `SENT` | Does not reject project or activate payment | Admin feedback panel | Explicit proposal flag (future) |
| Org membership / linkage | **Staging-ready** | `/client/company`, `/client/settings` | `client-organization-link.service` | Email-only ≠ approver | Admin (read context) | ProCrow verification UI |
| Demo playbook | **Complete** | See I8 playbook | `I8_CLIENT_PORTAL_DEMO_PLAYBOOK.md` | Say “staging/mock” | Operator demo index | Keep in sync with J1 |
| Verification scripts | **Complete** | `npm run client-*:verify` | `scripts/verify-client-*.ts` | Static guardrails | N/A | CI wiring (optional) |

**Do not claim:** production go-live, live payments, e-signature, compliance certification, AI-reviewed approval, automatic tenant provisioning, or token-link authority.

---

## Security / trust checkpoint

### Authentication

| Rule | Status |
|------|--------|
| `/client` requires authenticated session | **Enforced** (`requireClientAccess`) |
| `/admin` requires platform staff | **Enforced** (existing admin gates) |
| `/proposal/[token]` is informational only | **Enforced** (no approve/notes/changes UI) |

### Authorization

| Rule | Status |
|------|--------|
| `clientCanAccessRequest` / linkage | **Enforced** |
| `ClientOrganizationAccessDecision` / `canApproveScope` | **Enforced** (I9) |
| Email-only contact → review access, not approval ownership | **Enforced** |
| Email-only → review notes yes, official request-changes no | **Enforced** (I10) |
| Organization membership model | **Schema + read-only UI** (I9); admin verification tools **future** |

### Approval

| Rule | Status |
|------|--------|
| Server-side approval mutations | **Yes** (`client-approval` actions) |
| Token does not authorize approval | **Yes** (unwired public UI) |
| No legal/e-signature language in client UI | **Verifier-checked** |
| No payment activation from client paths | **Verifier-checked** |

### Feedback (I10)

| Rule | Status |
|------|--------|
| Review notes for authenticated linked reviewers | **Yes** |
| Request-changes for verified owner/approver only | **Yes** (`canApproveScope`) |

### Onboarding

| Rule | Status |
|------|--------|
| ProCrow controls go/no-go and runtime readiness | **Documented** |
| No tenant auto-provision from client | **Enforced** |
| No production go-live from client approval | **Copy + verifiers** |

### Known risks / deferred

1. **Manual logged-in smoke** on staging/production (owner, reviewer, admin) — **open**.
2. **`approveProposalByToken`** remains in `commercial.service` / `commercial.ts` actions but is **not wired** on public token page — do not expose.
3. **ClientOrganization** membership needs **ProCrow admin verification** workflows (future; was listed as alternate I11 naming in I10 doc — defer to I12 or J1 sub-task).
4. **Notification-only** feedback persistence — admin inbox depends on `PlatformNotification` rows existing.

---

## Route map

| Route | Purpose | Maturity | Auth | Safety notes | Next improvement |
|-------|---------|----------|------|--------------|------------------|
| `/client` | Dashboard, next actions, trust strip | Staging-ready | Required | Staging disclaimers | J1 nav polish |
| `/client/profile` | Account + linking readiness | Staging-ready | Required | No approval here | — |
| `/client/company` | Org context + I9 membership read-only | Staging-ready | Required | No company DB writes | Admin verify |
| `/client/settings` | Settings + org access summary | Staging-ready | Required | Same | — |
| `/client/requests` | Request list | Staging-ready | Required | Linked only | Filters |
| `/client/requests/[requestId]` | Request detail + review materials | Staging-ready | Required | Notes; no approve here | — |
| `/client/proposals` | Proposal list | Staging-ready | Required | — | — |
| `/client/proposals/[proposalId]` | Proposal review + approval + feedback | Staging-ready | Required | Approval + I10 panels | Manual smoke |
| `/client/blueprints/[blueprintId]` | Blueprint review + feedback | Staging-ready | Required | Read-only review | — |
| `/client/onboarding` | Onboarding tracker | Demo-only | Required | Operator-controlled | Pause banners |
| `/proposal/[token]` | Public informational bridge | Staging-ready | **None** | Sign-in CTA only | — |
| `/admin/requests` | ProCrow request list | Staging-ready | Admin | — | — |
| `/admin/requests/[requestId]` | Operator detail + approval + feedback | Staging-ready | Admin | No auto provision | — |
| `/admin/overview` | Control tower entry | Staging-ready | Admin | — | J1 |
| `/admin/tenants/[tenantId]` | Tenant / go-live context | Staging-ready | Admin | Go-live operator-only | — |

---

## Verification script index

All scripts are registered in `package.json`.

| Script | Command | What it checks | When to run |
|--------|---------|----------------|-------------|
| Portal skeleton | `npm run client-portal:verify` | I3 contract, routes, token page has no token-approve UI, no service_role in client paths | After `/client` routing or layout changes |
| Profile / company | `npm run client-profile:verify` | I4 readiness surfaces, no approval mutations | After profile/company pages |
| Proposal review | `npm run client-review:verify` | I5 read-only review, public token safety | After review pages |
| Scope approval | `npm run client-approval:verify` | I6 server approval, `canApproveScope`, no payment/tenant provision | After approval service/UI |
| Onboarding tracker | `npm run client-onboarding:verify` | I7 tracker, no auto provision | After onboarding page |
| Demo polish | `npm run client-demo:verify` | I8 copy/guardrails for demo | Before demos |
| Organization linkage | `npm run client-org:verify` | I9 decision model, approval uses `canApproveScope` | After org/approval changes |
| Review notes | `npm run client-notes:verify` | I10 notes vs request-changes gating, token safety | After feedback feature changes |

**Recommended batch (I11 checkpoint):**

```bash
npm run mock:verify
npm run typecheck
npm run lint
npm run build
npm run public:mirror-manifest
npm run client-portal:verify
npm run client-profile:verify
npm run client-review:verify
npm run client-approval:verify
npm run client-onboarding:verify
npm run client-demo:verify
npm run client-org:verify
npm run client-notes:verify
```

---

## Manual smoke test checklist

Use on **staging** with real auth when possible. Record pass/fail in RC1 or a future I12 doc.

### Unauthenticated

- [ ] `/client` redirects to `/login`
- [ ] `/proposal/[valid-token]` shows informational content only
- [ ] No approve, reject, review-note, or request-changes controls on token page

### Owner / approver (verified `canApproveScope`)

- [ ] Login → `/client` loads
- [ ] Open `/client/proposals/[id]` for a `SENT` proposal
- [ ] Approve scope → success message; onboarding reflects change (mock or DB)
- [ ] Submit **request-changes** when eligible
- [ ] Submit **review note**
- [ ] Cannot access unrelated client requests

### Email-only reviewer

- [ ] Login → view linked request/proposal
- [ ] Submit **review note**
- [ ] **Cannot** approve scope
- [ ] **Cannot** submit official request-changes (note-only mode messaging)

### ProCrow / platform staff

- [ ] Login → `/admin/requests/[requestId]`
- [ ] See approval status and onboarding readiness
- [ ] See client review notes / request-changes in feedback panel
- [ ] No automatic tenant provisioning from client actions

### Public safety regression

- [ ] No public approve/reject
- [ ] No public request-changes
- [ ] Token link is not authority for scope decisions

---

## Remaining gaps (explicit)

| Gap | Severity | Suggested phase |
|-----|----------|-----------------|
| Manual logged-in UI smoke on staging | Medium | **I12** or before external demo |
| ProCrow org membership verification UI | Low–medium | I12 alt. or J1 |
| Dedicated client feedback storage | Low | Post-pause product decision |
| `approveProposalByToken` dead code cleanup | Low | Hygiene PR (no behavior change) |
| Onboarding “changes requested” banner automation | Low | Optional polish |

---

## Pause recommendation

| Option | When |
|--------|------|
| **Pause after I11** | Default — I-track goals met; verifiers green; docs complete |
| **J1 next** | When resuming ProCrow-wide UX consistency |
| **I12 next** | When staging credentials available and manual smoke must close before J1 |

---

## Recommended next phase

**Primary:** **J1 — ProCrow Portal UX Unification** — align admin/client/operator navigation and visual system without expanding client authority.

**Alternative:** **I12 — Client Portal Manual Smoke Closure** — execute checklist above on staging; file pass/fail in `RC1_STAGING_VALIDATION.md` or I12 doc.

**Not recommended now:** new client features, schema migrations, payments, or production launch claims.

---

## I11 acceptance

| # | Criterion | Status |
|---|-----------|--------|
| 1 | I1–I10 arc summarized | This doc |
| 2 | Capability summary | Above |
| 3 | Security/trust checkpoint | Above |
| 4 | Route map | Above |
| 5 | Verification index | Above |
| 6 | Manual smoke checklist | Above |
| 7 | Runbook | [`CLIENT_PORTAL_RUNBOOK.md`](CLIENT_PORTAL_RUNBOOK.md) |
| 8 | PROJECT_STATUS + MILESTONES | Updated in I11 pass |
| 9 | Validation commands | Run at I11 completion |
| 10 | No forbidden scope | Documentation only |
| 11 | No overclaims | Enforced in copy guidance |
| 12 | Clear pause / J1 / I12 recommendation | Above |

**I11 decision:** **PASSED** — validation batch green (27 May 2026).

### Validation results (I11)

| Command | Result |
|---------|--------|
| `npm run mock:verify` | PASSED |
| `npm run typecheck` | PASSED |
| `npm run lint` | PASSED |
| `npm run build` | PASSED |
| `npm run public:mirror-manifest` | PASSED |
| `npm run client-portal:verify` | PASSED |
| `npm run client-profile:verify` | PASSED |
| `npm run client-review:verify` | PASSED |
| `npm run client-approval:verify` | PASSED |
| `npm run client-onboarding:verify` | PASSED |
| `npm run client-demo:verify` | PASSED |
| `npm run client-org:verify` | PASSED |
| `npm run client-notes:verify` | PASSED |

No migrations, seeds, payments, or tenant provisioning were run.
