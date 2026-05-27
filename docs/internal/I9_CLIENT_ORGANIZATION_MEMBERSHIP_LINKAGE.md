# I9 — Client organization membership & linkage

**Last updated:** 27 May 2026

## Phase goal

Move away from long-term `submittedByUserId`-only ownership assumptions and introduce a production-safe, read-only decision model for client organization membership.

I9 is intentionally constrained:

- No loosening access
- Email/contact-only linkage is review-only and never approval ownership (non-mock)
- Approval is strictly gated on `ClientOrganizationAccessDecision.canApproveScope`
- No token-only/public approval
- No `platform_admin` assignment from client flows in this phase
- No `service_role` in client-facing code
- Remote DB schema change approved (additive migration via Vercel deploy — see §6.1)
- No payments / no production launch claims

## 1. Current linkage audit (what we validated)

Key existing flows:

- `src/lib/services/client-request-link.service.ts`
  - Primary contact email matches were previously used to set `implementationRequest.submittedByUserId` (strong ownership path).
  - I9 hardening now ensures that in **non-mock** mode contact-email matches do **not** write `submittedByUserId`.

- `src/lib/services/client-approval.service.ts`
  - Client approval eligibility and the approval mutation were previously gated heavily on strong submitter ownership semantics (`submittedByUserId === user.id`) and/or mock demo strong ownership.
  - I9 refactors the approval gating so that eligibility + approval mutation rely on the decision model output: `canApproveScope`.

Outcome of the audit:

The previous architecture made it possible (in principle) for review-level email linkage to drift into approval ownership semantics via `submittedByUserId` writes. I9 fixes this by hardening contact-email writes and centralizing approval eligibility on the decision object.

## 2. Data contract (client-facing, read-only)

Added:

- `src/lib/client-portal/client-organization-contract.ts`

It defines:

- Roles, statuses, link sources, and access levels
- `ClientOrganizationAccessDecision` with `canApproveScope` as the single approval gate signal

Contract output is designed to be safe for client consumption and future DB backing, without forcing an immediate production backfill.

## 3. Linkage / membership decision service

Added:

- `src/lib/services/client-organization-link.service.ts`

Responsibilities:

- Derive a `ClientOrganizationAccessDecision` for a user + request ID
- Classify link sources (legacy strong submitter, mock demo strong ownership, linked organization without membership, etc.)
- Provide a strict `canApproveScope` decision that blocks approval unless the user is authorized via verified membership / correct role semantics

Key enforcement behavior:

- `platform_staff_preview` returns view-only access (no approval ownership)
- Non-mock email/contact-only access cannot approve because `submittedByUserId` is no longer written from contact-email matches outside mock mode
- Approval relies on decision `canApproveScope` (not on any direct `submittedByUserId` comparison inside the approval mutation)

## 4. Service integration result (approval hardening)

Updated:

- `src/lib/services/client-approval.service.ts`
- `src/lib/services/client-request-link.service.ts`

Hardening changes:

- `client-request-link.service.ts`
  - The `submittedByUserId` write from contact-email matching is now guarded by `if (isUseMockData())`
  - Non-mock mode: contact-email matches remain review-only

- `client-approval.service.ts`
  - Eligibility + approval mutation gating now uses:
    - `getClientOrganizationAccessDecisionForRequest(...).canApproveScope`
  - Legacy submitter fallback is only used when the submitter is truly the authenticated submitter (or explicitly scoped mock demo rules)

Copy update:

- `CLIENT_APPROVAL_BLOCKED_LABELS.ownership_unverified` now clarifies that approval requires verified organization ownership and that the account can review but not approve.

## 5. UI membership context (read-only)

Updated:

- `src/app/client/company/page.tsx`
- `src/app/client/settings/page.tsx`

Added read-only `ClientPortalStatusCard` blocks that surface membership context:

- membership status
- link source
- access level
- whether approval is allowed (`canApproveScope`)
- ProCrow verification notes (read-only)
- placeholders for future team-member/invitation features

No invites, no company editing actions, and no admin membership mutations were added in I9.

## 6. Schema / migration additions (tightly controlled)

Minimal Prisma models added to `prisma/schema.prisma`:

- `ClientOrganization`
- `ClientOrganizationMember`
- `ClientOrganizationRequestLink`

Prisma relation support:

- A back-relation field was added to `ImplementationRequest`:
  - `clientOrganizationRequestLinks ClientOrganizationRequestLink[]`

Migration file generated (create-only, no backfill):

- `prisma/migrations/20260527120000_client_org_membership/migration.sql`
  - creates the three tables listed above
  - only adds indexes / foreign keys where necessary for relations
  - no destructive operations
  - no data backfill / seeds

Migration application status:

- Migration file is create-only; remote application is coordinated through the normal Vercel production build (see §6.1).
- Local `prisma generate` does not apply DDL; use `prisma migrate dev` locally only when you intend to update a dev database.

### 6.1 Release / Vercel migration impact

I9 includes a Prisma migration:

- `prisma/migrations/20260527120000_client_org_membership/migration.sql`

Migration characteristics:

- **Additive / create-only** — creates `client_organizations`, `client_organization_members`, and `client_organization_request_links` only.
- **No backfill** — no `INSERT`, `UPDATE`, or `DELETE` data statements.
- **No destructive SQL** — no `ALTER TABLE` / `DROP` on existing application tables; only new tables, indexes, and foreign keys.

Vercel `main` deploy behavior (`vercel.json`):

- Build command runs: `node scripts/vercel-build-guard.mjs && npm run db:generate && npm run db:migrate:deploy && npm run build`
- **`npm run db:migrate:deploy`** executes `prisma migrate deploy` against the remote `DATABASE_URL` configured for the Vercel project (guarded against localhost).
- **Pushing to `main` may apply this migration to the remote database** on the next successful production/staging build if the migration is not already recorded in `_prisma_migrations`.

Operator decision:

- **Remote DB schema change for I9 is approved** (27 May 2026).
- After push, confirm the Vercel build completes, `migrate deploy` succeeds, and client portal smoke checks pass (see post-deploy checklist in commit notes).

## 7. ProCrow verification model (documented, read-only in this phase)

I9 does not implement admin mutations for ProCrow verification.

Instead:

- `client-organization-contract.ts` and `client-organization-link.service.ts` model the concept of ProCrow verification flags/requirements.
- The client UI shows verification notes as read-only guidance.

## 8. Security guardrails (explicit verifier expectations)

I9 security rules are enforced by both logic and the verifier script:

- Approval cannot be derived from non-mock contact-email matches
- Approval cannot be token-only / public-proposal-only
- Client UI/client components must not reference:
  - `service_role`
  - `platform_admin`
- No auto tenant provisioning or payments activation claims/behavior were added for the client portal path
- No legal/e-signature/compliance/AI overclaims were introduced in the client portal path

## 9. Verifier result (hard evidence)

Verifier:

- `scripts/verify-client-organization-linkage.ts`
- `package.json` script: `client-org:verify`

Result:

- `npm run client-org:verify` PASSED
- Additionally, the I9-required client verifiers in the track were run and passed:
  - `npm run client-portal:verify`
  - `npm run client-profile:verify`
  - `npm run client-review:verify`
  - `npm run client-approval:verify`
  - `npm run client-onboarding:verify`
  - `npm run client-demo:verify`

Core validation commands run:

- `npm run mock:verify`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run public:mirror-manifest`

Optional deeper checks run:

- `npm run request:pipeline:verify` (passed)
- `npm run erp:verify` (passed)
- `npm run runtime:verify` (passed)

## 10. Future schema gap analysis (what remains for I10+)

Not implemented in I9 (documented only in this phase):

- `ClientOrganizationInvitation`
  - purpose: track invitations and acceptance
  - risk: access mutation escalation if not carefully role-gated
  - priority: medium (needed for real multi-user onboarding)

- `ClientOrganizationProposalLink` / `ClientOrganizationBlueprintLink`
  - purpose: explicit organization-level visibility mapping
  - risk: mapping mistakes can leak access across organizations
  - priority: medium/high (depends on current request-link model coverage)

- `ClientApprovalRecord` / audit notes
  - purpose: keep an immutable approval/audit trail
  - risk: privacy and compliance responsibilities (audit data retention)
  - priority: low/medium (not needed to unblock client review/approval correctness)

- ProCrow admin verification workflow (read-only now)
  - purpose: allow trusted verification to move membership status to active/owner/approver
  - risk: admin mutation and approval ownership delegation correctness
  - priority: high (for production-grade membership)

## 11. Remaining gaps / known non-goals

What I9 intentionally does not do:

- No backfill / no seeds to populate membership tables
- No client invites
- No company editing
- No ProCrow admin verification mutation implementation
- No tenant provisioning, payments, or production launch claims

What is ready after I9:

- A coherent decision model for `canApproveScope`
- Hardening that prevents non-mock email/contact-only linkage from escalating to approval ownership
- Read-only membership context surfaced in the client portal UI
- A verifier that blocks drift into forbidden claims / forbidden role usage

## 12. Recommended next phase

Pick one path:

- **I10 — Client Portal Checkpoint & Pause**
  - lock the portal behavior and ensure no further access mutation until the membership backend is populated
- **I10 — Request Changes + Client Review Notes**
  - improve review notes UX while keeping approval strictly gated
- **J1 — ProCrow Portal UX Unification**
  - implement the admin/read-only surfaces for ProCrow verification with explicit ownership rules

## Final I9 decision

**PASSED** (Phase I9 constraints satisfied, verifier scripts passed, remote DB schema change approved for Vercel `db:migrate:deploy` on `main`.)

