# A1 — Architecture Simplification + Portal UX System Reset

**Date:** 6 Jun 2026  
**Branch:** `feat/m4c-tenant-invite-acceptance`  
**Scope:** Product architecture language, portal IA, and UX patterns — **no migrations, no auth weakening, no payments, no auto-provisioning.**

---

## Problem

Crow is functionally strong but the product surface feels fragmented: Public Website, Access Gateway, Client Portal, ProCrow, Business Portal / CEM, CyberCrow, SAREA, tenant invites, purchase-to-stock, Go/No-Go, and operator consoles compete for attention with inconsistent naming and dense panels.

A1 resets **what users see** and **how work is grouped** without removing M4C or other safety boundaries.

---

## Official product model

| Surface | Purpose | Not for |
|---------|---------|---------|
| **Public Website** | Learn Crow; pricing; request CTA | Operational ERP or operator work |
| **Access Gateway** | Choose the right workspace by role | Module operations |
| **Client Portal** | Request, discovery, blueprint/proposal, approval, onboarding | Day-to-day company operations |
| **ProCrow** | Prepare, govern, validate tenant runtime; workforce activation; Go/No-Go | Client self-service or employee ops |
| **Business Portal / CEM** | Modules, workflows, tasks, reports, purchase-to-stock | Client proposal review |
| **CyberCrow** | Review trust, identity, evidence, GRC, and risk readiness | Compliance certification claims, full SIEM substitute, formal audit-grade evidence, fully autonomous security ops |
| **SAREA** | Shape role-based experience inside RBAC | SAREA as permission source; SAREA instead of RBAC; fully autonomous personalization |
| **Tenant Workforce Activation** | Business Portal invites after runtime prep (M4C) | Client Portal onboarding |

**Core user flow (13 steps):** See `src/lib/constants/crow-simplified-lifecycle.ts`.

---

## Architecture by portal

### Public Website

- Marketing and explanation only
- Simple pricing / packages
- Authenticated request intake (`/request` requires sign-in)
- Homepage answers: What is Crow? Who is it for? What happens after request? Client vs Business Portal?

### Access Gateway (`/access`)

Three workspace cards:

1. **Client Portal** — Request, discovery, proposal, onboarding.
2. **Business Portal / CEM** — Run daily company operations (tenant membership required).
3. **ProCrow** — Prepare, govern, and validate tenants (platform staff only).

If Business Portal is unavailable: *“Business Portal access requires verified tenant membership.”*

### Client Portal (`/client/*`)

- Next action first
- Request, discovery, proposal, onboarding status
- Clear separation from Business Portal runtime
- No ProCrow/internal operator overload

### ProCrow (`/admin/*`)

Operator zones on tenant workbench:

1. Tenant overview  
2. Runtime preparation  
3. **Tenant workforce activation** (M4C Business Portal invites)  
4. CEM operating model  
5. CyberCrow trust readiness  
6. SAREA experience mapping  
7. Go/No-Go readiness  

M4C copy reframe (functionality unchanged):

| Old | New |
|-----|-----|
| Tenant invite link | Business Portal invite |
| Invite user | Activate tenant user |
| Send invite | Create invite link |
| Email delivery | Manual copy-link mode |

### Business Portal / CEM (`/[tenant]/*`)

- Operational dashboard: attention, workflows, tasks, modules, trust posture
- Purchase-to-stock: stage timeline and next actions above the fold; persistence in expandable section
- Module pages: purpose, linked workflow, records, next action, report output

### CyberCrow

**Safe wording:** “Review trust, identity, evidence, GRC, and risk readiness.”

**Do not claim:** compliance certification, full SIEM substitute, formal audit-grade evidence, or fully autonomous security ops.

### SAREA

**Safe wording:** “Shape role-based experience.”

**Always:** RBAC controls access. SAREA shapes experience.

**Do not claim:** SAREA as permission source, SAREA instead of RBAC, or fully autonomous personalization.

---

## Route ownership map

Canonical map: `src/lib/constants/crow-route-ownership.ts`

| Prefix | Owner | Access |
|--------|-------|--------|
| `/`, `/pricing`, `/modules`, … | public | Browse; `/request` needs account |
| `/login`, `/signup`, `/access` | auth | Authenticated portal selection |
| `/client` | client | Client role (+ staff preview) |
| `/admin` | procrow | Platform staff only |
| `/[tenant]` | business | Tenant membership or staff preview |
| `/tenant-invite/[token]` | invite | Valid token + matching email |
| `/sarea` | sarea | Studio / operator roles |
| `/[tenant]/cybercrow` | cybercrow | Tenant-scoped trust views |

---

## UX principles

Defined in `src/lib/constants/crow-ux-principles.ts`:

1. One screen, one primary job  
2. Show the next action first  
3. Progressive disclosure over dense panels  
4. Simple portal language  
5. Separate client from operator work  
6. Separate readiness from production launch  
7. Cards / tables / timelines  
8. Consistent status chips  
9. Helpful empty states  
10. Visible but calm safety notes  

Shared components (standardize usage, do not duplicate):

- `src/components/product/product-page-header.tsx`
- `src/components/product/product-section.tsx`
- `src/components/product/product-status-card.tsx`
- `src/components/product/product-next-action.tsx`
- `src/components/procrow/procrow-workbench-section.tsx`

---

## Verification

```bash
npm run architecture-simplification:verify
```

Also run the existing portal/M4C suite (see acceptance checklist in phase brief).

---

## Constraints (unchanged)

- No migrations or seeds in A1  
- No payment activation or auto-provisioning  
- M4C token security unchanged; manual copy-link only  
- ProCrow not exposed to clients  
- Business Portal not accessible without membership  
- No `platform_admin` from invite/signup  

---

## Recommended next

1. **M4C.1.1** — Invite acceptance operator smoke completion  
2. **M3.6** — Purchase-to-stock UX refinement (deeper module polish)

---

## Acceptance

A1 **PASSED** when architecture doc, constants, portal copy, ProCrow IA grouping, verifier, and validation commands are green without boundary regressions.
