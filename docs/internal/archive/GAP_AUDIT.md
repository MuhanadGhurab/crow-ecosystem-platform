# Crow Ecosystem — gap audit

**Last updated:** May 2026  
**Authoritative status:** [`PLATFORM_STATUS.md`](PLATFORM_STATUS.md)

Comparison of original platform spec vs **current Next.js implementation**.

---

## Complete or substantially implemented

| Area | Routes / capability | Status |
|------|---------------------|--------|
| **Public portal** | `/`, `/modules`, `/pricing`, `/security`, `/request` | Live |
| **Request API** | `POST /api/implementation-requests` | Live → `PENDING_REVIEW` |
| **Admin — core** | Requests list/detail, discovery hub, blueprints, tenants, grant access | Live |
| **Discovery — core** | Organization, modules, depts, branches, roles, workflows, security, summary | Live |
| **Blueprint** | Overview, approve, provision (go-live from overview) | Live |
| **Pipeline** | `pipeline.service.ts` — full chain + CyberCrow/SAREA/CEM init | Live |
| **Auth** | Supabase email, middleware, `crow_role`, tenant guards | Live |
| **CEM tenant** | Dashboard, modules, users, departments, roles, workflows | Live |
| **CyberCrow** | Seeded on provision; tenant dashboard summary | Partial (1 live page) |
| **SAREA** | Seeded on provision; studio overview + profiles | Partial (2 live pages) |
| **Database** | Full schema in `prisma/schema.prisma` | Applied via `db push` |
| **Membership** | `TenantMembership` + grant UI/CLI | Live |

---

## Partially implemented (shell routes exist)

| Area | Gap |
|------|-----|
| **Admin** | Domains, integrations, subscriptions, security baselines, audit — placeholders |
| **Discovery** | Identity, experience, integrations steps — placeholders |
| **Blueprint** | Dedicated cem/cybercrow/sarea/go-live pages — placeholders (logic on overview) |
| **CEM modules** | HR, CRM, sales, inventory, warehouse, logistics, finance, tasks, reports, branches, settings — placeholders |
| **CyberCrow console** | All sub-routes except dashboard — placeholders |
| **SAREA studio** | Layouts, role-mapping, rules, widgets, navigation, device-rules, preview — placeholders |
| **Public marketing** | About, services, clients, etc. — placeholders |

---

## Not started (spec / product gaps)

| # | Gap | Notes |
|---|-----|--------|
| 1 | **SAREA runtime engine** | Adaptive nav/widgets at request time, not just admin lists |
| 2 | **CyberCrow enforcement** | Policy middleware on CEM routes using baselines |
| 3 | **Invite-by-email** | Create Supabase user + membership in one flow |
| 4 | **Billing** | Stripe + subscription admin UI |
| 5 | **Email notifications** | Transactional mail on pipeline events |
| 6 | **Entra ID / SSO** | Enterprise IdP (Phase 2 doc mentioned; not built) |
| 7 | **`prisma migrate`** | Production migration workflow |
| 8 | **CI pipeline** | Automated build/smoke on push |

---

## Resolved since original audit

| Item | Resolution |
|------|------------|
| Authentication | Phase 2 — Supabase Auth |
| Discovery forms | Phase 1 — core steps |
| Blueprint editor | Phase 1 — overview + provision |
| CEM structure | Phase 4 — seed + list pages |
| SAREA data | Pipeline seed + studio read views (Phase 5 start) |
| Tenant operations | Phase 3 — admin hubs |
| Build verification | `npm run build` passes |

---

## Route counts (approximate)

| | Count |
|---|------|
| Total `page.tsx` routes | ~80 |
| Live (real data / forms) | ~32 |
| Placeholder shells | ~48 |

---

## Recommended focus

See prioritized backlog: [`ROADMAP.md`](ROADMAP.md).
