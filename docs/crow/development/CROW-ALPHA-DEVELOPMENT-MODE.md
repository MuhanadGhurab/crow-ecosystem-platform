# Crow Alpha Development Mode

| Field | Value |
|-------|-------|
| **Title** | Crow Alpha Development Mode — operating model |
| **Status** | CANONICAL strategy / policy |
| **Authority** | Owner decision — CROW.DEVFLOW.1 |
| **Date** | 2026-07-18 |
| **Milestone** | [`../milestones/CROW-DEVFLOW-1.md`](../milestones/CROW-DEVFLOW-1.md) |
| **Related** | [`FAST-REVIEW-WORKFLOW.md`](FAST-REVIEW-WORKFLOW.md) · [`DEMO-DATA-POLICY.md`](DEMO-DATA-POLICY.md) · [`../16-PRODUCTION-DEPLOYMENT-POLICY.md`](../16-PRODUCTION-DEPLOYMENT-POLICY.md) |

## Owner direction (recorded)

Crow is **not** currently a commercial Production system.

Current goal: fast development, live review, visible iteration, and feedback from friends/testers.

Constraints accepted by owner:

- No second paid Supabase project / dedicated Preview database **for now**
- Preview/Production isolation remains important **later** (commercialization)
- Isolation must **not** block current alpha/demo development when demo-data rules hold

## Runtime classification

| Term | Meaning |
|------|---------|
| **production-grade** | Isolated backends, proven Preview ≠ Production DB, customer-safe persistence, commercial claims allowed only after owner gates |
| **alpha development** | Fast build + live review mode; hosted URLs are development/demo channels, not commercial Production |
| **demo sandbox** | Shared or single Supabase (or other) backend used only for fake/demo/test data |
| **local-first** | Browser/local drafts and tests without claiming hosted production-safe persistence (e.g. Discovery D0–D7) |
| **commercial production** | Real customers, real data, payments, tenant go-live, official Blueprint outputs, production-grade isolation proven |

### Current Crow classification

**alpha development + demo sandbox**

**Not** commercial production.

| Channel | Role in Alpha Mode |
|---------|-------------------|
| Cursor | Build engine |
| GitHub | Control / history (`main` protected; PR #10 archive) |
| Vercel Preview / branch URLs | Live development review channel |
| Vercel Production domain | May exist as a live artifact — **do not treat as commercial Production** |
| Supabase (existing project) | Demo/dev sandbox data only |
| Production-grade DB isolation (GAP-004) | **Future commercialization gate** — not an alpha-dev blocker |

## What Alpha Mode allows

- Fast Cursor development on feature branches
- Vercel Preview / live demo review URLs
- Demo/test data in the existing Supabase project (when owner later enables controlled demo-backend mode)
- Sharing with friends/testers as **alpha/demo only**
- Local-first + (future) controlled demo-backend flows
- Iteration without waiting for a second database project

## What remains blocked (even in Alpha Mode)

| Blocked | Why |
|---------|-----|
| Real customer data | Demo policy |
| Commercial Production claim | Classification |
| Payment runtime | Commercial gate |
| Tenant go-live / provisioning | Authority gate |
| Official Blueprint generation | Authority gate |
| Production-grade hosted persistence claim | GAP-004 future gate |
| Migrations unless explicitly authorized | Safety |
| Production deploy unless separately authorized (`CROW.PRODUCTION.DEPLOY`) | GAP-015 |
| PR #10 merge | Archive policy |
| CroAI production / autonomous actions | Constitution |
| Platform roles / membership as go-live authority | Authority gate |

## Alpha UI requirement (implement in DEVFLOW.2)

Hosted alpha/demo environments must show a visible banner:

> Crow Alpha Development Environment — demo/test data only. Not production. Do not enter real customer or sensitive data.

## Controlled Alpha Demo Backend Mode (plan only — DEVFLOW.3)

Future explicit flags (not implemented in DEVFLOW.1):

| Variable | Intended meaning |
|----------|------------------|
| `CROW_RUNTIME_MODE=alpha_development` | Runtime is alpha, not commercial production |
| `CROW_DATA_CLASSIFICATION=demo_only` | Only demo/test data allowed |
| `ALLOW_SHARED_DEMO_BACKEND=true` | Selected demo/backend writes may proceed under alpha rules |

Even with those flags set, keep blocked: official Blueprint generation, tenant go-live, payment, CroAI production actions, real customer data, unauthorized migrations, unauthorized Production deploy.

See GAP-004A adjustment plan in [`../gaps/GAP-004A-PREVIEW-DB-DISABLED-SAFETY-MODE.md`](../gaps/GAP-004A-PREVIEW-DB-DISABLED-SAFETY-MODE.md).

## Relationship to existing policies

| Policy | Alpha Mode effect |
|--------|-------------------|
| GAP-004 | Reclassified as **future commercial / production-readiness gate** — does not block alpha/demo when demo rules hold |
| GAP-004A | Remains standing fail-closed Preview DB guard until controlled alpha demo-backend is explicitly authorized and implemented |
| GAP-015 | Remains useful — Production deploy guard + `main` protection |
| Discovery LOCAL-FIRST.ACCEPT.1 | Unchanged — local-first accepted; official hosted persistence claim still blocked |
| Production Deployment Policy | Live domain ≠ commercial Production claim under Alpha Mode |

## Counters (policy)

```
ALPHA_DEVELOPMENT_MODE_DEFINED_COUNT=1
GAP004_RECLASSIFIED_AS_FUTURE_PRODUCTION_GATE_COUNT=1
REAL_CUSTOMER_DATA_ALLOWED_COUNT=0
COMMERCIAL_PRODUCTION_CLAIM_COUNT=0
BLUEPRINT_GENERATION_ALLOWED_COUNT=0
PAYMENT_ENABLED_COUNT=0
CROAI_PRODUCTION_ACTION_ENABLED_COUNT=0
```
