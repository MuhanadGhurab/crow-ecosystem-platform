# RC1 — Staging validation checkpoint

**Purpose:** Historical record that Crow Ecosystem Platform reached **RC1** — a deployed staging build with end-to-end validation of auth, CEM Command Center, tenant runtime, advisory operations, and core admin surfaces.

**Status:** **PASSED**  
**Date:** 25 May 2026  
**Environment:** Vercel staging deployment + Supabase (Postgres pooler + Auth)  
**Operating mode:** Advisory-first — subscription intelligence and notifications are operational; **no hard billing or usage enforcement**

---

## 1. RC1 status

| Field | Value |
|-------|--------|
| Milestone | RC1 — Staging deploy & health validation |
| Result | Passed (user-confirmed on staging URL) |
| Database | Remote Postgres via pooler; migrations applied |
| Auth | Supabase session + role-aware post-login routing |
| Billing posture | Advisory / scaffold only |

---

## 2. What was validated

The following were exercised successfully on the **staging** deployment:

| Area | Validated |
|------|-----------|
| **Deploy** | Vercel build, env wiring, production build simulation |
| **Database** | Pooler connection, Prisma client generate, migrate deploy |
| **Auth** | Sign-in, callback, platform admin landing |
| **CEM Command Center** | `/admin/overview` and core admin navigation |
| **Admin notifications** | Notification inbox / advisory surfaces |
| **Tenant runtime** | MEEM lighthouse tenant dashboard and plan settings |
| **Blueprint** | Go-live and readiness-style blueprint pages |
| **CyberCrow** | Tenant audit / security advisory views |
| **SAREA** | Experience / studio surfaces (as wired for staging) |
| **Client portal** | Client path preserved; staff preview controlled (`?preview=client`) |
| **API security** | Public route hardening patch (webhook, redirects, payload limits, health) |

Internal smoke references (non-secret): use `npm run meem:ids:staging` for dynamic tenant/blueprint IDs in **local/staging scripts only** — do not publish those IDs in public docs.

---

## 3. Current architecture confirmed

RC1 confirms the platform shape described in internal architecture docs:

```text
Public marketing site
    → Login / auth routing (role-aware)
        → CEM Command Center (platform staff)
        → Tenant workspaces (e.g. MEEM lighthouse)
            → CyberCrow advisory operations
            → SAREA experience surfaces
        → Client portal (request contacts)
```

**Cross-cutting capabilities validated at staging:**

- Subscription-aware intelligence (advisory, not enforced)
- Notification inbox and digest **logging** / operations UI
- Discovery → blueprint → go-live pipeline surfaces
- Middleware + RBAC route protection for admin vs portal vs tenant paths

---

## 4. Important fixes that enabled RC1

These changes were required before staging was considered healthy:

| Fix | Why it mattered |
|-----|-----------------|
| **Vercel + pooler database setup** | Remote Postgres reachable from serverless; no local-only DB |
| **Prisma pinned to 6.19.3** | Consistent generate/migrate with schema; avoided broken 7.x drift |
| **Server/client MEEM resolver split** | Correct tenant resolution in App Router without client bundle leaks |
| **API route security patch** | Webhook verification, safe redirects, checkout auth gate, health minimization, request payload cap — see [`API_SECURITY.md`](API_SECURITY.md) |
| **Platform staff post-login redirect** | Platform admin lands on `/admin/overview`; portal preview explicit; clients unchanged — see auth routing in codebase (`post-login-redirect.ts`, middleware) |

Earlier milestone work (M1–M8, MEEM pipeline, CyberCrow slice) remains the functional base; RC1 is the **deployed staging proof** of that base.

---

## 5. Advisory-only boundaries (still not enforced)

RC1 **does not** claim production SaaS enforcement. The following remain **out of scope** for this checkpoint:

| Capability | RC1 posture |
|------------|-------------|
| Stripe billing enforcement | Not enforced — checkout/webhook scaffold may exist |
| Runtime module blocking by plan | Not enforced — advisory labels only |
| Usage hard limits / quotas | Not enforced |
| SCIM provisioning | Not implemented |
| Entra group sync | Not implemented |
| Scheduled digest **email send** | Logging/UI may work; live Resend send not required for RC1 |

Treat subscription and plan UI as **intelligence and ops narrative**, not billing truth.

---

## 6. Remaining warnings / future hardening

Non-blocking items for post-RC1 planning:

- **Public implementation request** — rate limiting and/or Turnstile on `/api/implementation-requests`
- **Stripe** — optional live webhook and charge testing when keys and policy allow
- **Notifications** — optional `deliveryStatus` / `inboxStatus` cleanup (already stabilized for staging)
- **Production domain** — custom domain and Entra redirect URIs when leaving staging
- **Health endpoint** — smoke `/api/health` after every deploy (minimal production response)
- **Secrets** — rotation and scope review when promoting beyond staging — see [`SECRET_ROTATION.md`](SECRET_ROTATION.md)

---

## 7. Final RC1 statement

**Crow Ecosystem Platform has reached RC1:** a deployed staging build with working authentication, CEM Command Center, MEEM tenant runtime, CyberCrow advisory operations, SAREA experience surfaces, subscription-aware intelligence, and notification/digest operations.

RC1 is a **stabilization checkpoint**, not a production go-live. Planning for **Phase F** (next phase) should start from this document and [`MILESTONES.md`](MILESTONES.md) before new feature work.

---

## Related internal docs

| Topic | Document |
|-------|----------|
| Milestone map | [`MILESTONES.md`](MILESTONES.md) |
| Current status | [`PROJECT_STATUS.md`](PROJECT_STATUS.md) |
| Advisory ops | [`ADVISORY_OPERATIONS.md`](ADVISORY_OPERATIONS.md) |
| API security | [`API_SECURITY.md`](API_SECURITY.md) |
| Vercel connect | [`VERCEL_CONNECT.md`](VERCEL_CONNECT.md) |
| MEEM lighthouse (internal) | [`customers/MEEM_GLOBAL.md`](customers/MEEM_GLOBAL.md) |

---

*Internal only — no secrets, env values, or customer-identifying deployment details beyond what is already in sanctioned customer docs.*
