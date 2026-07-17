# CROW.PUBLIC.PROD — Production Readiness Plan (Public Experience)

| Field | Value |
|-------|-------|
| **Milestone** | CROW.PUBLIC.PROD (planned — **deployed 2026-07-07**) |
| **Branch** | `feat/first-tenant-golden-path` |
| **Accepted certification URL** | https://crow-ftgp-certification-iipjrwhxd-muhanadghurabs-projects.vercel.app/ |
| **Accepted visual deploy commit** | `c51a60e` |
| **Branch documentation HEAD** | `e349449` (CROW.PUBLIC.10 acceptance); preflight `CROW-PUBLIC-PROD-PREFLIGHT` |
| **Owner acceptance** | CROW.PUBLIC.9 — **ACCEPTED** (CROW.PUBLIC.10, 2026-07-07, manual certification review) |
| **Production candidate** | **CROW.PUBLIC.9** — locked semi-dark public experience |
| **PR #10** | OPEN, DRAFT, unmerged — merge is separate from this plan |
| **Production** | **Not deployed** — explicit owner authorization required |

**Preflight:** [`CROW-PUBLIC-PROD-PREFLIGHT.md`](CROW-PUBLIC-PROD-PREFLIGHT.md) — repository clean, candidate verified, gates PASS (2026-07-07). Preflight does **not** authorize Production.

## Purpose

This plan defines the strict checklist and boundaries for promoting the **owner-accepted** semi-dark public experience (CROW.PUBLIC.9) from FTGP certification to Production. It does **not** authorize Production deployment by itself.

## Owner authorization required

Production public-experience promotion may proceed **only** when the owner issues explicit authorization using a phrase equivalent to:

> **AUTHORIZE CROW.PUBLIC.PROD — deploy accepted public experience to Production**

Until that phrase (or equivalent written owner decision recorded in milestone evidence), agents must **not**:

- Deploy Production
- Merge PR #10 (unless separately authorized)
- Push to `main`
- Change domain behavior (auth, Request persistence, middleware policy beyond static public route serving)

## Scope of promotion

**In scope:** Static public marketing surface, redirects, semi-dark CSS/shell (`public-v2-bright`), signature homepage hero, public browse access policy as accepted on certification at `c51a60e`.

**Out of scope (do not change during promotion):**

- Database schema and migrations
- Hosted business data writes
- Authentication, authorization, or verification behavior
- Request / Discovery / Blueprint persistence or workflows
- Tenant provisioning, membership, entitlements
- Commercial / payment runtime
- CroAI runtime
- ProCrow / admin / tenant runtime behavior

**Boundary rule:** Production promotion is a **deployment and routing promotion** of accepted UI and public-route policy — not a domain-behavior change milestone.

## Public routes to verify before Production

Unauthenticated browse must work on Production after promotion (same as certification):

| Route | Verify |
|-------|--------|
| `/` | Seven-section homepage; semi-dark shell; signature hero; no Architect's Map |
| `/how-crow-works` | Lifecycle rail; commercial gate note |
| `/new-organization` | Public browse; conversion CTA to signup handoff only |
| `/transform-existing` | Public browse; transformation map |
| `/enterprise-blueprint` | Six domains; blueprint frame |
| `/platform` | Platform orbit overview |
| `/platform/cem` | CEM page |
| `/platform/cybercrow` | CyberCrow page |
| `/platform/sarea` | SAREA page |
| `/platform/procrow` | ProCrow page |
| `/security` | Trust-focused; distinct from CyberCrow |
| `/industries` | Credible sectors; no fake clients |
| `/pricing` | Scope-aware commercial copy; no fake tiers |
| `/case-studies` | Honest deferred placeholder (if retained) |
| `/start` | Journey chooser; explore vs start CTAs |
| `/request` | Public explanation (Option A); see gated continuation below |
| `/login` | Semi-dark auth frame; OAuth unchanged |
| `/signup` | Semi-dark auth frame; journey handoff query params |

Source of truth: `src/lib/public/public-access-policy.ts`, `src/lib/public/routes.ts`.

## Legacy redirects to verify

| Legacy path | Expected target |
|-------------|-----------------|
| `/architecture` | `/how-crow-works` |
| `/modules` | `/platform/cem` |
| `/services` | `/how-crow-works` |
| `/clients` | `/industries` |
| `/loyalty-programs` | `/how-crow-works` |
| `/about` | `/platform` |
| `/experience/architects-map` | `/how-crow-works` |
| `/experience/architects-map/article` | `/how-crow-works` |

Certification-only: `/preview/public-home` → `/` on FTGP certification hosts (verify host gate still correct on Production — preview should not replace Production homepage).

## Auth-adjacent surfaces to verify

| Surface | Expected behavior |
|---------|-------------------|
| `/login`, `/signup` | Visual semi-dark frame only; Supabase OAuth and form flows unchanged |
| `/register` | **Known limitation** — not visually refreshed; verify no regression |
| `/onboarding/*` | Still gated; unchanged |
| `/client/*` | Requires auth |
| `/portal/*` | Requires auth |
| `/discovery/*` | Requires auth |
| `/admin/*`, `/account/*` | Requires auth |
| Tenant slug routes | Still resolve tenants; public reserved segments not mistaken for slugs |

## `/request` gated-continuation behavior

**Accepted model (Option A — CROW.PUBLIC.3):**

1. Unauthenticated visitor sees public explanation — browsing is open.
2. Copy states sign-in is required only to begin the secure client Request process.
3. "Continue to secure client request" (or equivalent CTA) routes to auth/signup handoff.
4. **Logged-in** user visiting `/request` redirects to client request creation (`routes.client.requestNew`) — unchanged.
5. No Request records created from public page views alone.

Verify on Production after promotion: public page loads without session; conversion action gates correctly; logged-in redirect preserved.

## Known limitations (carry forward)

- Auth form controls retain some legacy `cc-` styling inside semi-dark frame
- `/register` route not visually aligned with locked public identity
- Scroll-story code remains in repo; routes redirect away from nav
- Visual overlap checks are partially manual — re-run owner spot-check on Production URLs
- Certification visual accepted at `c51a60e`; documentation HEAD `7e3a49d` is docs-only
- Very narrow mobile widths (<360px) should be spot-checked on Production after promote

## Tests required before Production

All must pass with `FAILED_REQUIRED_GATE_COUNT=0`:

```bash
git diff --check
npm run typecheck
npm run lint
npm run build
npm run public-access-policy:test
npm run public-route-architecture:test
npm run public-v2-preview-readiness:test
```

Optional but recommended before merge/promotion:

```bash
npm run public-v2-bundle-containment:verify
npm run ftgp-certification-host-gate:test
```

Post-deploy smoke (manual or scripted):

- Unauthenticated GET on each public route in table above → 200 (or honest redirect)
- Unauthenticated GET on `/client/requests` → auth redirect
- Legacy redirect sample (`/modules`, `/architecture`) → correct target

## PR #10 merge considerations

PR #10 (`feat/first-tenant-golden-path` → `main`) contains FTGP foundation **and** the accepted public experience. Merge and Production promotion are **related but separate decisions**:

| Step | Authorization |
|------|----------------|
| Merge PR #10 to `main` | Explicit owner authorization for FTGP merge (not implied by PUBLIC.PROD) |
| Deploy Production from `main` | Explicit **CROW.PUBLIC.PROD** authorization |
| Deploy only public surface | Prefer promotion from commit `c51a60e` or later branch HEAD with no domain drift |

**Current hold:** PR #10 remains OPEN, DRAFT, UNMERGED until owner authorizes merge.

If Production is promoted before merge, use Vercel Production deploy from the feature branch commit only with owner approval — document the exact commit and rollback target.

## Preview / Production database isolation warning

**GAP-004 remains relevant:** Preview and Production may share the same hosted Postgres fingerprint (C2.1 BLOCKED). Public experience promotion is **static/UI** and does not require migrations, but:

- Do **not** run migrations as part of PUBLIC.PROD
- Do **not** assume Production deploy isolates data — verify C2.1 status before any schema-touching release
- Public promotion must not write hosted business data

## Rollback plan

If Production promotion causes unacceptable regression:

1. **Immediate:** Redeploy previous Production deployment via Vercel (record pre-promotion deployment ID before promote).
2. **Record:** Rollback commit/deployment ID in milestone evidence.
3. **Do not:** Run destructive DB operations or migration rollbacks as part of public UI rollback.
4. **Branch:** Feature branch `feat/first-tenant-golden-path` remains source of accepted experience for fix-forward.

Pre-promotion capture:

- Production deployment URL and deployment ID
- Git commit on Production before promote (`main` currently `a5620c3` — legacy public)
- Screenshot or checklist of legacy `/` for comparison

## Promotion procedure (when authorized)

1. Owner issues **AUTHORIZE CROW.PUBLIC.PROD** (recorded).
2. Confirm branch HEAD ≥ `c51a60e` with no unauthorized domain changes since CROW.PUBLIC.9 acceptance.
3. Run all required tests (section above).
4. Record pre-promotion Production deployment ID.
5. Deploy to Production per Vercel production workflow (project `crow-ecosystem-platform` or owner-specified).
6. Run public route smoke checks on Production URL.
7. Update `CURRENT-STATE.md`, `GAP-LEDGER.md`, and milestone evidence — do not claim owner re-acceptance unless owner reviews Production.

## Related documents

- [`CROW-PUBLIC-9.md`](CROW-PUBLIC-9.md) — locked design and polish evidence
- [`CROW-PUBLIC-10.md`](CROW-PUBLIC-10.md) — final owner acceptance record
- [`CROW-PUBLIC-3.md`](CROW-PUBLIC-3.md) — prior route/access acceptance evidence
- [`CROW-PUBLIC-2.md`](CROW-PUBLIC-2.md) — route disposition
- [`09-PUBLIC-EXPERIENCE.md`](../09-PUBLIC-EXPERIENCE.md) — canonical public direction
- [`10-IMPLEMENTATION-BOUNDARIES.md`](../10-IMPLEMENTATION-BOUNDARIES.md) — protected boundaries
