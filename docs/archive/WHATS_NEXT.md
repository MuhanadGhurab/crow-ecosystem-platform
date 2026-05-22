# What’s next — CyberCrow platform

**Last updated:** May 2026  
**Status:** Phases 1–7 complete · Phase 8 partial (CI, readiness gate, templates, Entra, Stripe scaffold)

**DB paused?** See [`DEV_WITHOUT_DB.md`](DEV_WITHOUT_DB.md).

Use this doc to pick the next sprint. Everything should map to [`ARCHITECTURE_DIAGRAM.md`](ARCHITECTURE_DIAGRAM.md).

---

## Just shipped (ready to demo)

| Feature | Route / command |
|---------|-----------------|
| Tenant CEM role assign/remove | `/[tenant]/users` (tenant_admin + policy) |
| CyberCrow audit on role changes | `/[tenant]/cybercrow/audit-logs` (`ROLE_ASSIGNED`, `ROLE_REMOVED`, `POLICY_DENIED`) |
| Commercial proposal | `/proposal/[token]`, blueprint overview |
| Go-live readiness gate | `GO_LIVE_READINESS_GATE=true` in `.env` |
| Industry templates | Logistics, retail, healthcare on `/request` → discovery Apply |
| Entra ID / SSO | `/login` Microsoft button, `/auth/entra`, [`ENTRA_SSO.md`](ENTRA_SSO.md) |
| CI on GitHub | `.github/workflows/ci.yml` |

---

## Recommended order (Phase 8+)

| Priority | Item | Diagram | Effort | Notes |
|----------|------|---------|--------|-------|
| 1 | ~~Healthcare discovery template~~ | Layer 03 | S | **Done** — `healthcare.json` |
| 2 | ~~Entra ID / SSO~~ | Layer 09, step 10 | L | **Done** — [`ENTRA_SSO.md`](ENTRA_SSO.md) |
| 3 | **Stripe billing** | Layer 05 | L | Scaffold in `billing.service.ts` — wire Checkout UI + webhook when DB/keys ready |
| 4 | **Workflow runtime** | Layer 06 | L | Task execution beyond list view |
| 5 | **Weekly tenant health digest** | Step 13 | M | Reuse `notification.service.ts` + cron |
| 6 | **Public marketing CMS** | Layer 01 | L | Replace static shells with CMS or MDX |
| 7 | **Prisma migrate baseline** | Layer 10 | M | Move from `db push` to `migrate deploy` in prod |

**Effort:** S = small (days), M = medium (1–2 weeks), L = large (multi-week)

---

## Environment checklist (before prod demo)

```env
# Required
DATABASE_URL=...
DIRECT_URL=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Recommended
NEXT_PUBLIC_SITE_URL=https://your-domain.com
PLATFORM_NOTIFY_EMAIL=...
RESEND_API_KEY=...

# Optional gates
GO_LIVE_READINESS_GATE=true
GO_LIVE_READINESS_STRICT=false
```

**Scripts:** `npm run auth:bootstrap` · `npm run smoke:phase1` · `npm run dev`

---

## Policy matrix (CEM actions)

| Action | tenant_admin | tenant_user | platform staff |
|--------|--------------|-------------|----------------|
| `cem.users.invite` | ✓ | ✗ | ✓ |
| `cem.hr.write` | ✓ | ✓ | ✓ |
| `cem.crm.write` | ✓ | ✗ | ✓ |
| `cem.roles.manage` | ✓ | ✗ | ✓ |
| `cem.workflows.manage` | ✓ | ✗ | ✓ (reserved) |

Denials → `POLICY_DENIED` in CyberCrow audit.

---

## Doc index

| Doc | Purpose |
|-----|---------|
| [`PLATFORM_STATUS.md`](PLATFORM_STATUS.md) | What’s built vs shell |
| [`ROADMAP.md`](ROADMAP.md) | Phase history |
| [`PHASE7.md`](PHASE7.md) | Diagram alignment (complete) |
| [`PHASE8.md`](PHASE8.md) | CI, gate, templates |
| [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md) | Step-by-step demo |
