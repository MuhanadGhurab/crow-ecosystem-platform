# I4 — Client Profile + Company Profile MVP (no paid infra)

**Status:** Passed (27 May 2026)  
**Prerequisite:** [I3 — Client Portal Data Contract & Route Skeleton](I3_CLIENT_PORTAL_DATA_CONTRACT_ROUTE_SKELETON.md)

---

## Objective

Deliver the first **useful** Client Portal MVP for profile readiness: authenticated users see account identity, profile/company completeness, missing fields, safe edit (user metadata only), and honest linking states — without approval actions, schema migrations, or paid infrastructure.

**Not in scope:** proposal/blueprint approval, reject/request-changes, token authorization, company field editing, payments, production launch.

---

## Part 1 — Profile / company surface audit

| Source | Available today | I4 use |
|--------|-----------------|--------|
| Supabase `user_metadata` | `full_name`, optional `phone`, `job_title`, `preferred_language` | Client profile summary + safe edit via session `updateUser` |
| Supabase auth | `email`, identities/provider | Account identity card |
| `ImplementationRequest` + `RequestContact` | org name, industry, band, country, contacts, modules, security packages | Company profile when linked |
| `client-request-link.service` | Email match + `submittedByUserId` | Ownership-safe company/request linkage |
| `ClientPortalCompanyProfile` (I3) | Completeness % + missing fields | Extended in I4 company summary |

**Cannot trust yet for approval:**

- Token links as authorization
- Email-only linkage as verified ownership (approval still blocked)
- Multi-user company accounts (no `ClientOrganization` table)

**Schema gap (future):** persistent `ClientAccount` ↔ company record, delegated reviewers, company edit with audit trail — documented in I2; not migrated in I4.

---

## Part 2 — Contract

**File:** `src/lib/client-portal/client-profile-contract.ts`

- `ClientProfileReadiness`, `ClientProfileSummary`
- `CompanyProfileReadiness`, `CompanyProfileSummary`
- `ClientAccountLinkState`, `CompanyLinkStatus`
- `ClientProfilePageModel`, `ClientCompanyPageModel`
- Edit blocked constants for dev bypass and company editing

I3 `client-portal-contract.ts` unchanged; company profile on dashboard still uses `ClientPortalCompanyProfile`.

---

## Part 3 — Service / adapter

**File:** `src/lib/services/client-profile.service.ts`

| Function | Purpose |
|----------|---------|
| `buildClientProfileSummary(user)` | Identity + completeness from metadata |
| `buildClientProfilePageModel(user)` | Full `/client/profile` model |
| `buildClientCompanyPageModel(user)` | Full `/client/company` model + request list |
| `buildClientProfileDashboardHints(user)` | Dashboard profile/company % tiles |

**Rules:**

- Read-only for request/company data (no Prisma writes)
- `listClientRequests` only after auth; same ownership as I3
- Mock mode uses `MOCK_CLIENT_REQUESTS` / pipeline mocks
- Staff → `staff_preview` link state; profile edit blocked for platform staff

**File:** `src/lib/actions/client-profile.ts`

- `updateClientProfileMetadata` — server action using **user session** `supabase.auth.updateUser` (not service role)
- Blocks platform staff and auth-disabled dev bypass
- Revalidates `/client/profile`, `/client`, `/client/settings`

---

## Part 4 — `/client/profile` UX

- Account link status banner
- Profile completeness card (progress + missing/complete lists)
- Account identity card (email, name, phone, title, language, sign-in method)
- Profile edit form (when allowed) or readiness-only message
- Security note: profile does not grant admin access
- Compact approval-blocked notice
- Next steps with links to company + requests

---

## Part 5 — `/client/company` UX

- Company completeness when linked
- Company summary (industry, band, region, contact, latest request)
- Selected modules + security requirements chips/lists
- Multi-request list when >1 linked request
- Unlinked state with submit-request CTA
- Company editing blocked with documented reason
- Approval blocked notice + next steps

---

## Part 6 — Settings & dashboard

**`/client/settings`:** account/security readiness, sign-in provider, link state, notification placeholder, privacy bullets, future settings list.

**`/client` dashboard:** profile % and company % summary cards; compact approval-blocked banner.

---

## Part 7 — Linking model (surfaced in UI)

| State | Meaning |
|-------|---------|
| `no_request_submitted` | Authenticated, no matching request |
| `request_submitted_unlinked` | Email may exist on a request but no match to this sign-in |
| `authenticated_linked` | At least one request linked |
| `procrow_verification_required` | Reserved for future verified ownership gate |
| `staff_preview` | Platform staff preview |

Company link: `not_linked` | `linked_via_contact_email` | `linked_via_submitted_by_user` | `staff_preview`

---

## Part 8 — ProCrow / Admin counterpart

| Client portal (I4) | ProCrow eventually sees |
|--------------------|-------------------------|
| Profile completeness % | Whether client account exists and contact fields are filled |
| Company completeness % | Request/company readiness during review |
| Missing field lists | Discovery follow-up prompts |
| Link state | Whether intake is tied to a signed-in user |
| Approval blocked | Internal proposal workflow unchanged |

No admin UI changes in I4 — documentation only.

---

## Part 9 — Security guardrails

- Login required (`requireClientAccess`)
- No approval mutations in profile service/actions
- No service role in client components or profile actions
- No `platform_admin` assignment from client profile routes
- Company data only via `listClientRequests` ownership path
- Copy does not claim production portal, compliance, or AI approval
- `client-profile:verify` + existing `client-portal:verify`

---

## Part 10 — Verification

```bash
npm run client-portal:verify
npm run client-profile:verify
```

Full validation suite per phase gate: `mock:verify`, `typecheck`, `lint`, `build`, `public:mirror-manifest`.

---

## Remaining gaps → I5

- Authenticated proposal/blueprint **review** (read-only + ownership)
- Verified ownership gate before any approve mutation
- Company profile editing with audit trail (likely schema)
- Notification preferences
- Multi-request company merge UX when one user has many orgs

**Recommended next:** **I5 — Proposal / Blueprint Authenticated Review**.
