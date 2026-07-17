# CROW.REQUEST.2 — Local-First Request Intake Alignment and Certification

| Field | Value |
|-------|-------|
| **Status** | Complete — local-first alignment implemented and certified |
| **Date** | 2026-07-18 |
| **Branch** | `feat/first-tenant-golden-path` |
| **Issue** | [#17](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/17) |
| **Prior** | CROW.REQUEST.1 @ `120402b` |
| **main** | `e8cb812` (unchanged) |
| **PR #10** | OPEN · DRAFT · unmerged · untouched |
| **Production** | `dpl_QeDhnxzp9eowKNxAg5XmJW8vuhsz` (unchanged) |

## Owner decisions applied

1. **Phone:** Client-process requires email + phone (constitution). Enrollment activation may remain email-only (deferred). Real OTP only — no fake verification.
2. **Status:** Product-layer mapping; no DB enum migration.
3. **Server drafts:** Deferred — localStorage remains.
4. **JourneyKind:** Persisted in brief notes JSON — no migration.
5. **GAP-004:** Remains open — no hosted writes/migrations.
6. **PR #10:** Untouched.

## Implementation summary

| Area | Result |
|------|--------|
| JourneyKind | `journeyKind: NEW \| TRANSFORM` on brief; wizard URL + UI; required on validate; round-trip in notes JSON |
| Organization context | Labels/hints aligned with Build New / Transform via `org-context-labels.ts` |
| Phone gate | `isClientProcessPhoneVerificationRequired()` default true; `requireClientAccess` + submit enforce; verify-phone page reachable for ACTIVE email-only users missing phone |
| Legal/email | Unchanged C3 order; submit also requires `emailVerifiedAt` |
| Status mapping | `request-status-product-mapping.ts` — PENDING_REVIEW → NEEDS_REVIEW etc. |
| ProCrow queue | Intake titles/tags/hints use Submitted / Needs review / Qualification language |
| Authority | Static tests prove no tenant/membership/role/blueprint/payment on submit path |

## Constraints honored

- No Production deploy · no `main` push · no PR #10 merge
- UNAUTHORIZED_MIGRATION_COUNT=0 · HOSTED_BUSINESS_WRITE_COUNT=0
- TENANT_MEMBERSHIP_CREATED_BY_REQUEST_COUNT=0 · PLATFORM_ROLE_CREATED_BY_REQUEST_COUNT=0
- TENANT_PROVISIONED_BY_REQUEST_COUNT=0 · BLUEPRINT_CREATED_BY_REQUEST_COUNT=0 · PAYMENT_REQUIRED_FOR_REQUEST_COUNT=0

## Remaining work (not this milestone)

- Full ProCrow qualification outcome UX (CROW.PROCROW.1)
- Discovery handoff polish (CROW.DISCOVERY.1 / Phase R5)
- Hosted Preview certify after GAP-004
- Optional server DRAFT persistence (deferred)
- Optional DB status enum rename (not preferred)

## GAP status

| Gap | Status |
|-----|--------|
| GAP-004 | Open / blocked |
| GAP-008 | **Mitigated** — JourneyKind on brief |
| GAP-012 | Mitigated |
| GAP-015 | Open |

## Final verdict

**READY — REQUEST INTAKE LOCAL-FIRST ALIGNMENT IMPLEMENTED AND CERTIFIED**
