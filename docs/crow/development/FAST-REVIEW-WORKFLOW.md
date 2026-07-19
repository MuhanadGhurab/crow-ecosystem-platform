# Crow Fast Review Workflow

| Field | Value |
|-------|-------|
| **Title** | Alpha Development Mode — fast review workflow |
| **Status** | CANONICAL workflow |
| **Authority** | Owner decision — CROW.DEVFLOW.1 |
| **Date** | 2026-07-18 |
| **Related** | [`CROW-ALPHA-DEVELOPMENT-MODE.md`](CROW-ALPHA-DEVELOPMENT-MODE.md) · [`DEMO-DATA-POLICY.md`](DEMO-DATA-POLICY.md) · [`PORTABLE-ALPHA-DEVELOPMENT-WORKFLOW.md`](PORTABLE-ALPHA-DEVELOPMENT-WORKFLOW.md) |

## Purpose

Move fast during Crow Alpha Development Mode without pretending the system is commercial production-ready.

## Workflow

```
1. Cursor builds on feature branch
2. Required tests / gates run locally
3. Push to feature branch (not main)
4. Vercel Preview / branch deployment updates
5. Owner reviews live Preview URL
6. Friends/testers review Preview link (alpha/demo only)
7. Feedback → next Cursor milestone
8. main merge only when owner wants a stable checkpoint
9. Production deploy remains separate and intentional (CROW.PRODUCTION.DEPLOY)
```

## Branch strategy

| Item | Rule |
|------|------|
| Default work branch | `feat/first-tenant-golden-path` or smaller focused branches |
| `main` | Remains **protected**; merge only as owner checkpoint |
| PR #10 | **OPEN · DRAFT · CONFLICTING · archive / reference only** — never merge as monolith |
| Production push | **Never** from agent without `CROW.PRODUCTION.DEPLOY` |

## Review channel

| Channel | Use |
|---------|-----|
| Vercel Preview / branch URL | **Primary** fast review for owner + friends/testers |
| Local `npm run dev` | Developer iteration |
| Vercel Production domain | May exist; **not** a commercial Production claim under Alpha Mode |
| Shared Supabase | Demo/dev sandbox only — see [`DEMO-DATA-POLICY.md`](DEMO-DATA-POLICY.md) |

## Feedback loop

1. Use `/alpha-feedback` (or banner link) for demo/test notes when Preview has alpha demo backend flags set — see [`DEMO-FEEDBACK-PILOT.md`](DEMO-FEEDBACK-PILOT.md)
2. Convert into a scoped milestone (one domain when possible)
3. Implement on feature branch
4. Re-preview
5. Do **not** escalate to commercial Production gates casually

### Preview feedback activation (CROW.DEVFLOW.5B)

| Step | Status |
|------|--------|
| Preview flags (`CROW_RUNTIME_MODE`, `CROW_DATA_CLASSIFICATION`, `ALLOW_SHARED_DEMO_BACKEND`) on `feat/first-tenant-golden-path` | Done |
| Production env for those flags | Unchanged |
| Preview `DATABASE_URL` / `DIRECT_URL` for FTGP | **Still missing** (CLI verify 5B) — Preview build fails |
| Submit + verify `alpha_demo_feedback` on Preview | **Blocked** — add DB URLs on correct Vercel project + branch |

Exact owner steps: [`../milestones/CROW-DEVFLOW-5B.md`](../milestones/CROW-DEVFLOW-5B.md).

## What this workflow does not authorize

- Merging PR #10
- Official Production deploy / Instant Promote / domain change
- Hosted persistence **claim** as production-safe (GAP-004 still open)
- Real customer data
- Payment enablement
- Tenant go-live
- Official Blueprint generation
- Migrations without separate owner authorization
- Changing Vercel or GitHub protection settings without owner authorization
- Request / Discovery hosted persistence (not part of DEVFLOW.5)
- Copying Production DB URLs to Preview without explicit owner authorization

## Recommended next implementation milestone

**Resume CROW.DEVFLOW.5B** after Preview FTGP `DATABASE_URL`/`DIRECT_URL` appear in Vercel · then **CROW.DISCOVERY.TRACKS.1** or optional admin demo-feedback list.

**Done:** **CROW.DEVFLOW.5** (pilot) · **CROW.DEVFLOW.5A/5B** (Preview flags; E2E still blocked — DB URL not on FTGP Preview) · **CROW.DEVFLOW.4** · **CROW.DEVFLOW.2** · PORTABLE.1 · **CROW.DEVFLOW.3**.
