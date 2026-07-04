# Crow — AI Agent Entrypoint

**Status:** CANONICAL · **Authority:** Owner decisions + [`docs/crow/START-HERE.md`](docs/crow/START-HERE.md)

Crow is a **governed design-to-runtime service** that transforms organizational intent into an approved Operating Model, Enterprise Blueprint, and Operational Tenant.

## Read first

1. [`docs/crow/START-HERE.md`](docs/crow/START-HERE.md) — index, reading order, current milestone
2. [`docs/crow/00-CROW-CONSTITUTION.md`](docs/crow/00-CROW-CONSTITUTION.md) — product definition and authority boundaries
3. [`docs/crow/CURRENT-STATE.md`](docs/crow/CURRENT-STATE.md) — **verified implementation truth** (not aspirations)
4. [`docs/crow/GAP-LEDGER.md`](docs/crow/GAP-LEDGER.md) — design–implementation gaps

## Authority order

1. Explicit owner decisions in the active milestone
2. Crow Constitution (`docs/crow/00-CROW-CONSTITUTION.md`)
3. Authoritative domain documents (`docs/crow/01`–`11`)
4. Architecture Decision Records (`docs/crow/decisions/`)
5. Active milestone specification
6. Verified repository and database truth
7. Historical implementation reports (`docs/internal/`, `docs/architecture/crow-core/`)
8. Model assumptions — **lowest precedence**

When product direction and implementation disagree, record a gap in [`GAP-LEDGER.md`](docs/crow/GAP-LEDGER.md). Do not silently choose one.

## Protected boundaries (never violate without explicit owner authorization)

- **Payment status ≠ authority** — successful payment must not assign roles or membership
- **SAREA ≠ authority** — presentation only; never grants permission
- **CroAI ≠ authority** — advisory by default; no autonomous sensitive actions
- **Request ≠ tenant** — submitting a request does not provision a tenant
- **Discovery ≠ authority** — discovery sessions do not grant elevated access
- **Verification ≠ membership** — email/phone verification proves account control only
- **Passive browsing ≠ business records** — public exploration must not create client data

## Forbidden autonomous actions

- Deploy or promote Production without explicit owner authorization
- Merge unapproved pull requests or push to `main`
- Apply database migrations on shared hosted Postgres without controlled-migration workflow
- Modify hosted business data without operator authorization
- Implement payment processing, recurring billing, or CroAI runtime in documentation-only milestones
- Weaken authentication, authorization, or tenant isolation guards
- Claim owner acceptance — a Cursor report is not acceptance

## Milestone method

One milestone at a time. Before coding:

1. Verify repository path, branch, HEAD, and working tree
2. Read canonical docs for the domain
3. State scope: in-scope, out-of-scope, protected boundaries
4. Follow **Define → Design → Build → Certify → Promote**
5. Update `CURRENT-STATE.md` and `GAP-LEDGER.md` when implementation changes
6. Use [`docs/crow/milestones/MILESTONE-TEMPLATE.md`](docs/crow/milestones/MILESTONE-TEMPLATE.md)
7. Hand off with [`docs/crow/AI-HANDOFF-PROTOCOL.md`](docs/crow/AI-HANDOFF-PROTOCOL.md)

## Conflict reporting

If authoritative sources conflict, stop and report:

- conflicting sources
- intended product truth vs current implementation truth
- security or authority risk
- proposed resolution — do not rewrite canonical docs without reconciliation

## Specialist architecture docs

Deep domain references remain in `docs/architecture/crow-core/`. The `docs/crow/` layer is the **canonical governance index** — link to specialist docs; do not duplicate their full content.
