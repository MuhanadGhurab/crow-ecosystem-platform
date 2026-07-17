# Request Intake Audit

| Field | Value |
|-------|-------|
| **Title** | Client Request Intake — Current State Audit |
| **Status** | CANONICAL audit (CROW.REQUEST.1) |
| **Authority** | Verified repository evidence · Issue [#17](https://github.com/MuhanadGhurab/crow-ecosystem-platform/issues/17) |
| **Date** | 2026-07-18 |
| **Branch / HEAD** | `feat/first-tenant-golden-path` @ docs commit for CROW.REQUEST.1 |
| **Related** | [`REQUEST-INTAKE-MVP-PLAN.md`](REQUEST-INTAKE-MVP-PLAN.md), [`milestones/CROW-REQUEST-1.md`](../milestones/CROW-REQUEST-1.md), [`milestones/CROW-REQUEST-2.md`](../milestones/CROW-REQUEST-2.md) |

> **CROW.REQUEST.2 update (2026-07-18):** JourneyKind now persists on brief notes JSON. Client-process requires verified phone (constitution) while enrollment activation may remain email-only. Product status mapping added without DB enum migration. See CROW-REQUEST-2 milestone for implementation truth.

**Scope:** Read-only audit. No product code, migrations, hosted writes, or auth/authorization changes in this milestone.

---

## 1. Current route map

### Middleware / protection

| Layer | Path | Role |
|-------|------|------|
| Entry | `src/middleware.ts` | FTGP host gate → Supabase session refresh |
| Session gate | `src/lib/supabase/middleware.ts` | Unauthenticated users redirected to `/login` for non-public paths |
| Policy | `src/lib/public/public-access-policy.ts` | Canonical public vs gated prefixes |
| Helpers | `src/lib/auth/route-protection.ts` | `isPublicPath`, portal/platform/API helpers |

**Public (browse without sign-in):** `/`, `/request`, `/start`, `/new-organization`, `/transform-existing`, `/login`, `/signup`, `/register`, auth entry paths.

**Gated:** `/client/*`, `/portal/*`, `/account/*`, `/discovery/*`, `/blueprints/*`, `/admin/*`.

**API:** `POST /api/implementation-requests` is **not** a public API — session required. Legacy path returns **410** when disabled.

### Public journey / marketing

| Route | File | Behavior |
|-------|------|----------|
| `/request` | `src/app/(public)/request/page.tsx` | Explainer; logged-in users redirect to `/client/requests/new`; CTAs to signup/login with `next` |
| `/start` | `src/app/start/page.tsx` | Journey chooser (NEW vs TRANSFORM) |
| `/new-organization` | `src/app/(public)/new-organization/page.tsx` | Informational; signup handoff `journey=new` |
| `/transform-existing` | `src/app/(public)/transform-existing/page.tsx` | Informational; signup handoff `journey=transform` |
| `/login`, `/signup` | `src/app/login/page.tsx`, `src/app/signup/page.tsx` | Auth; support `next` / journey params |
| `/register/legal`, `/verify-email`, `/onboarding/verify-phone` | under `src/app/` | C3 legal / email / phone gates |

Journey URL builders (no DB writes): `src/lib/public/journey-handoff.ts` (`PublicJourneyKind` = `NEW` \| `TRANSFORM`).

### Authenticated client request

| Route | Gate | Behavior |
|-------|------|----------|
| `/client/*` | `requireClientAccess` + C3 human gate | Client portal shell |
| `/client/requests/new` | Above + `PlatformAccount` required | 5-step `ServiceRequestWizard` |
| `/client/requests`, `/client/requests/[id]`, `.../confirmation` | Client access + ownership | List / detail / post-submit |
| `/client/requests/[id]/discovery/*`, `.../blueprint/*` | Same | Downstream client views (out of MVP intake core) |
| `/portal/*` | `requireClientAccess` | Legacy parallel client surface |

### ProCrow / platform (handoff, not public intake)

| Route | Gate | Behavior |
|-------|------|----------|
| `/admin/requests` | `requirePlatformConsole` | Request queue |
| `/admin/queue` | Platform staff | Derived operator queue (read-only) |
| `/discovery/[requestId]/*` | Platform discovery permission | Operator discovery workspace |

### Submit surfaces

| Surface | Path | Status |
|---------|------|--------|
| **Canonical** | Server action `submitClientServiceRequestAction` → `src/lib/actions/client-service-request.ts` | Active |
| Legacy API | `POST /api/implementation-requests` | Disabled → 410 |
| Legacy action | `src/lib/actions/implementation-request.ts` | Throws (legacy guard) |
| Legacy public form component | `src/components/public/implementation-request-form.tsx` | Exists; **not mounted** on `/request` |

---

## 2. Current data model map

**Schema:** `prisma/schema.prisma`

### Request domain

| Model | Role |
|-------|------|
| `ImplementationRequest` | Canonical service request (`referenceCode`, org profile fields, `status`, `submittedByUserId`, brief in `notes` JSON) |
| `RequestContact` | Primary contact |
| `RequestedModule` / security / plan children | Intake selections |
| `DiscoveryProfile` (+ children) | Post-qualification discovery |
| `ClientOrganization` / `ClientOrganizationMember` / `ClientOrganizationRequestLink` | Client-org linkage (I9); not tenant membership |

**`ImplementationRequestStatus` (persisted):**

`DRAFT` · `PENDING_REVIEW` · `UNDER_DISCOVERY` · `BLUEPRINT_BUILD` · `TENANT_PROVISIONING` · `SECURITY_INIT` · `SAREA_INIT` · `GO_LIVE` · `APPROVED` · `REJECTED` · `CANCELLED`

**Not in schema:** `NEEDS_REVIEW`, `QUALIFIED`, `SUBMITTED`, `CONVERTED_TO_DISCOVERY` as enum values (product vocabulary differs; see §4).

### Brief types (application layer)

`src/lib/client-service-request/types.ts`:

- `OrganizationContextKind`: `NEW_BUSINESS` \| `EXISTING_ORGANIZATION` \| `MODERNIZATION` \| `NEW_DIVISION`
- Explicit authority contract: advisory; **does not** create Blueprint, provision tenant, grant authority, or complete Discovery
- Client acknowledgements: no tenant provisioning; ProCrow review expected
- **No `JourneyKind` field on the brief** (GAP-008)

### Account / verification / legal (C3)

| Model | Role |
|-------|------|
| `PlatformAccount` | Status machine; `emailVerifiedAt`, `phoneVerifiedAt` |
| Email/Phone challenge tables | OTP evidence |
| `AccountLegalAcceptance` | Append-only legal evidence |
| `LegalDocument` / versions | ToS, Privacy, AUP |
| `PlatformInternalRoleAssignment` | ProCrow staff — **must not** be granted by request submit |

### Tenant runtime (must remain decoupled)

`Organization` / `Tenant` / `TenantMembership` — operational tenant. Request submit must not create these.

---

## 3. Current auth / verification map

| Concern | Location | Behavior |
|---------|----------|----------|
| Session | `src/lib/auth/session.ts` | `getSessionUser`, `requireClientAccess`, `requireActivePlatformAccount` |
| C3 orchestration | `src/lib/account/c3-auth-orchestration.ts` | Legal → email → phone (if required) → ACTIVE |
| Phone policy | `src/lib/account/phone-verification-policy.ts` | Phone **not required by default** unless `CROW_PHONE_VERIFICATION_REQUIRED=true` and `onboardingGeneration >= 3` |
| Email OTP | `src/lib/account/email-verification.service.ts` | Challenge lifecycle; legal-before-finalize gate |
| Legal | `src/lib/actions/account-legal.ts`, `src/lib/legal/legal-acceptance.service.ts` | Mandatory acceptance; mutation guard |
| Client access authority | `src/lib/auth/customer-access.service.ts` | `submittedByUserId` or verified client-org member — **not** payment, **not** metadata role alone |
| Role-neutral onboarding | `src/lib/auth/c3-post-auth-landing.ts` | ACTIVE accounts do not auto-land as “client role” via metadata |

### Constitution vs implementation (critical)

Canonical [`04-IDENTITY-AUTHORITY-TRUST.md`](../04-IDENTITY-AUTHORITY-TRUST.md) requires **both** verified email **and** verified mobile for account activation.

**Current code default:** phone verification is **deferred** unless env policy enables it (`c3-email-only-onboarding` tests document this).

→ Design–implementation gap: treat as **owner decision** before claiming MVP complete against constitution.

---

## 4. Current request lifecycle map

```
Public browse (/start, /request, journey pages)
  → Signup/Login with next=/client/requests/new?journey=…
  → C3: legal → email → (phone if required) → ACTIVE
  → /client/requests/new wizard
  → Client-side draft only (localStorage, 7-day TTL)
  → submitClientServiceRequestAction
  → ImplementationRequest @ PENDING_REVIEW (+ contacts, notes brief)
  → Confirmation page
  → ProCrow admin review
  → adminStartDiscovery / FTGP transition → UNDER_DISCOVERY
```

| Stage | Persistence | Notes |
|-------|-------------|-------|
| Public journey choice | URL / handoff only | Not a business record |
| Wizard draft | Browser localStorage | `DRAFT` status unused at create |
| Submit | Postgres `ImplementationRequest` | Status `PENDING_REVIEW` immediately |
| Qualification | Admin actions + derived queue | No separate `QUALIFIED` status |

Authority preserved in brief contract: request ≠ tenant ≠ Blueprint ≠ Discovery complete.

---

## 5. Current ProCrow handoff map

| Piece | Status |
|-------|--------|
| Admin request list `/admin/requests` | Exists |
| Derived operator queue `/admin/queue` | Exists (read-only; UI status includes `needs_review`) |
| Status hint mapping | `PENDING_REVIEW` → “Intake — needs ProCrow review” |
| Start Discovery | `adminStartDiscovery` requires `PENDING_REVIEW` |
| FTGP review transition | Controlled `PENDING_REVIEW` → `UNDER_DISCOVERY` + audit |
| Field review flag | `requiresProcrowFieldReview` in brief — partial qualification signal |
| Dedicated “qualification outcome” model | Missing as first-class status (`QUALIFIED` / `DECLINED` as product terms) |

**ProCrow is not a Prisma model** — operator UI + services under `src/lib/procrow/` and admin actions.

---

## 6. Missing pieces

| Item | Notes |
|------|-------|
| Persist `JourneyKind` (NEW/TRANSFORM) on request brief | GAP-008; URL handoff exists, wizard unification incomplete |
| Constitution-aligned phone gate as default | Deferred by policy flag today |
| Server-persisted draft (`DRAFT` rows) | Enum exists; modern flow skips it |
| Product status vocabulary (`SUBMITTED`, `NEEDS_REVIEW`, `QUALIFIED`, …) | Map to existing enum or owner-approved schema change later |
| Explicit qualification decision notes UI as MVP package | Partial via admin reject / discovery start |
| Isolated Preview DB | GAP-004 — blocks safe hosted Preview validation |
| Docs drift (legacy public form descriptions) | Internal historical docs may still describe old path |

---

## 7. Partial pieces

| Item | Notes |
|------|-------|
| C3 account activation | Legal + email strong; phone optional by default |
| Client org membership (I9) | Models exist; primary access via `submittedByUserId` |
| Parallel discovery UIs | Client `/client/.../discovery` vs platform `/discovery/[id]` |
| Legacy ERP intake | Code retained but disabled |
| ProCrow field resolution | Partial; not full qualification queue MVP |
| FTGP work on PR #10 | Related request/discovery work — **must not** be casually merged |

---

## 8. Exists (usable foundation)

- Public `/request` explainer + gated continue
- Journey pages + signup/login handoff URLs
- C3 registration, legal evidence, email OTP
- Authenticated wizard + server action submit
- `ImplementationRequest` persistence with authority contract
- Admin review + discovery handoff path
- Derived ProCrow operator queue
- Strong public-access and FTGP authority tests
- Legacy public submit path disabled (correct for policy)

---

## 9. Unsafe / blocked while GAP-004 is open

Preview and Production share hosted Postgres fingerprint.

| Unsafe without owner auth | Why |
|---------------------------|-----|
| Hosted migrations (`db:migrate:deploy`, uncontrolled `db:push`) | Shared schema |
| Seed / backfill / hosted business-data scripts | Shared data |
| Exercising registration, legal accept, request submit against hosted Preview/Prod | Creates real account/request rows |
| Admin pipeline mutations on hosted DB | Status / discovery writes |
| Merging PR #10 as “request MVP” | Bundles FTGP beyond intake audit |

| Safer now | Why |
|-----------|-----|
| Docs / plans / Issue updates | No DB |
| Local Postgres + local-only coding later | Isolated |
| `db:generate`, typecheck, lint, build, public-* tests | No hosted write |
| Public UI-only changes that do not call write paths | Still avoid accidental hosted smoke of gated flows |

Mutation guard `assertC2DatabaseEnvironmentSafe()` reduces some misconfig risk but **does not** solve shared Preview/Production backends.

---

## 10. Tests already relevant

| Area | Examples |
|------|----------|
| Public access | `public-access-policy.test.ts`, `public-route-architecture.test.ts` |
| Authority | `ftgp-authority-boundaries.test.ts`, `c3-role-neutral-onboarding.test.ts` |
| Legal / email | `registration-legal-gate.test.ts`, `email-verification-legal-gate.test.ts` |
| Phone deferred | `c3-email-only-onboarding.test.ts` |
| Request brief | `client-service-request.test.ts` |
| ProCrow transition | `ftgp-procrow-review-transition.test.ts` |
| Shared DB awareness | `database-environment.shared-backend.test.ts` |

---

## 11. Audit conclusions

1. **Request Intake is not greenfield** — a substantial authenticated MVP already exists.
2. **Public browse vs gated submit** matches intended Crow policy.
3. **Largest authority/product gaps:** phone verification vs constitution; JourneyKind unification; qualification vocabulary/UX; GAP-004 for safe Preview certification.
4. **Do not** treat status rename or schema expansion as day-one coding without predictive design (Phase R1) and owner approval.
5. **PR #10 remains unrelated merge risk** — keep DRAFT; plan implementation milestones separately from FTGP merge.

See [`REQUEST-INTAKE-MVP-PLAN.md`](REQUEST-INTAKE-MVP-PLAN.md) for delivery phases and owner decisions.
