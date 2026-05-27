# I8 — Client portal polish & demo rehearsal

**Last updated:** 27 May 2026  
**Audience:** Internal delivery / demo operators  
**Constraint:** Staging / mock — **no schema migrations**, **no payments**, **no auto tenant provisioning**, **no production launch**, **no legal/e-signature**, **no compliance/customer/AI overclaims**.

**Related:** [`I8_CLIENT_PORTAL_DEMO_PLAYBOOK.md`](I8_CLIENT_PORTAL_DEMO_PLAYBOOK.md) · [`I6_SCOPE_APPROVAL_PROCROW_STATUS_SYNC.md`](I6_SCOPE_APPROVAL_PROCROW_STATUS_SYNC.md) · [`I7_ONBOARDING_TRACKER_MVP.md`](I7_ONBOARDING_TRACKER_MVP.md) · [`MILESTONES.md`](MILESTONES.md) · [`PROJECT_STATUS.md`](PROJECT_STATUS.md)

---

## Precheck (Part 0)

| Check | Result |
|-------|--------|
| **I7 on `main`** | Yes — `585006b` feat(client): add onboarding tracker MVP |
| **Branch** | `main` (I8 work local until commit) |
| **Forbidden scope** | No migrations, payments, auto-provision, or new auth providers in I8 |
| **Commit policy** | User requested **no automatic commit**; stage files individually (no `git add .`) |

---

## Client journey audit (Part 1)

| Route | Assessment |
|-------|------------|
| `/client` | **Polished** — shared header, trust strip, dashboard tiles, onboarding entry |
| `/client/profile` | **Polished** — header; security note corrected; no misleading “approval blocked” |
| `/client/company` | **Polished** — header; next-actions list; company read-only honest |
| `/client/requests` | **Polished** — header; list empty state |
| `/client/requests/[id]` | **Polished** — header; review badge user-facing; approval guide only |
| `/client/proposals` | **Polished** — header; scope-approval guide variant |
| `/client/proposals/[id]` | **Polished** — header; **only** surface with `ClientProposalApprovalPanel` |
| `/client/blueprints/[id]` | **Polished** — header; onboarding summary + proposal CTA |
| `/client/onboarding` | **Polished** — aligned layout with portal shell; empty state + trust note |
| `/client/settings` | **Polished** — shared header |
| `/proposal/[token]` | **Unchanged authority model** — informational + `ProposalTokenApprovalNotice` only |

---

## Home & dashboard (Part 2)

| Item | Result |
|------|--------|
| `ClientPortalPageHeader` | Used on `/client` |
| `ClientPortalTrustStrip` | Staging boundaries + demo path hint |
| Redundant compact approval blocker on home | **Removed** (trust strip covers policy) |

---

## Profile & company (Part 3)

| Item | Result |
|------|--------|
| Profile header / spacing | **Updated** |
| Approval messaging | Points to **linked proposal** when verified submitter — not “blocked until implemented” |
| Company page | Header + next actions; no false approval CTA |

---

## Requests (Part 4)

| Item | Result |
|------|--------|
| List page | Shared header |
| Detail page | Shared header; `RequestStatusBadge`; review materials card |
| Internal “I6” badge | **Replaced** with “Review” |
| `ClientPortalApprovalBlocked` | `variant="guide"` only — no approve action |

---

## Proposals & scope approval (Part 5)

| Item | Result |
|------|--------|
| List | Guide variant for how approval works |
| Detail | `ClientProposalApprovalPanel` retained |
| Server-side approval | **Unchanged** — `approveClientProposalScopeAction` + ownership in `client-approval.service.ts` |
| Legacy `approveProposalByToken` | Still exists; **not** wired on `/proposal/[token]` (carry-forward warning) |

---

## Blueprint (Part 6)

| Item | Result |
|------|--------|
| Detail header | Shared `ClientPortalPageHeader` |
| Onboarding summary | Retained from I7 |
| Overclaims | None added |

---

## Onboarding (Part 7)

| Item | Result |
|------|--------|
| Layout | Removed duplicate outer `max-w-4xl` wrapper; uses portal shell width |
| Auth | Uses `requireClientAccess` only (layout also gates) |
| Empty state | Clear CTAs to `/request` and `/client/requests` |
| Auto-provision | **None** |

---

## Public token route safety (Part 8)

| Item | Result |
|------|--------|
| `/proposal/[token]` | Renders pricing/modules + status messages |
| Approve/decline on token | **Not wired** — `ProposalTokenApprovalNotice` when `canAct` |
| `ProposalClientActions` / `approveProposalByToken` imports | **Absent** from page |

---

## Copy & trust components (Part 9)

| Component | Purpose |
|-----------|---------|
| `client-portal-page-header.tsx` | Consistent eyebrow/title/description/back link |
| `client-portal-trust-strip.tsx` | Staging boundaries on home |
| `client-portal-approval-blocked.tsx` | `guide` vs `blocked` variants |

---

## Demo playbook (Part 10)

| Item | Result |
|------|--------|
| Playbook | [`I8_CLIENT_PORTAL_DEMO_PLAYBOOK.md`](I8_CLIENT_PORTAL_DEMO_PLAYBOOK.md) — ~10 min, 10 beats + close |
| Demo identity | `client.demo@alnoor.test` · `mock-req-003` · `mock-bp-001` |

---

## Verification (Part 11)

| Script | Purpose |
|--------|---------|
| `npm run client-demo:verify` | I8 polish files, headers on routes, token safety, forbidden phrases |
| `npm run client-portal:verify` | I3 skeleton (regression) |
| `npm run client-profile:verify` | I4 profile (regression) |
| `npm run client-review:verify` | I5 review (regression) |
| `npm run client-approval:verify` | I6 approval (regression) |
| `npm run client-onboarding:verify` | I7 onboarding (regression) |

---

## Validation commands (Part 12)

Run locally before demo (record output in release notes):

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
```

| Command | Result (27 May 2026) |
|---------|------------------------|
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

---

## Scope guards (Part 13)

| Guard | I8 compliance |
|-------|----------------|
| Schema migrations | **None** |
| Payments / Stripe | **None** |
| Auto tenant provisioning | **None** |
| Production launch claims | **None** in new copy |
| Legal / e-signature | **None** |
| Compliance / AI / customer overclaims | Scanned in verifier |

---

## Remaining gaps (Part 14)

1. **`approveProposalByToken`** — deprecate or hard-lock (documented in I6).  
2. **Ownership** — `submittedByUserId` only; need `ClientOrganization` / membership (I6 warning).  
3. **Company/profile edit** — still read-only or partial; not in I8 scope.  
4. **Visual design system pass** — polish only; no full redesign.  
5. **E2E browser rehearsal** — optional manual pass with `ce-test-browser` if desired.

---

## Recommended next phase (Part 15)

**I9 — Client organization membership & linkage** (design + thin MVP): real org membership instead of email/`submittedByUserId` only — still no auto-provision.

Alternatives: **ProCrow operator queue polish** or **public request → client invite** flow design.

---

## Files touched (summary)

| Area | Paths |
|------|--------|
| Polish components | `client-portal-page-header.tsx`, `client-portal-trust-strip.tsx`, `client-portal-approval-blocked.tsx` |
| Client routes | `src/app/client/**/page.tsx` (home, profile, company, requests, proposals, blueprints, onboarding, settings) |
| Verify | `scripts/verify-client-portal-demo-polish.ts` |
| Docs | This file · demo playbook · `MILESTONES.md` · `PROJECT_STATUS.md` |
