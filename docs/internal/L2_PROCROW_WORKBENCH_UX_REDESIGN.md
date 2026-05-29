# L2 — ProCrow Workbench UX Redesign

**Date:** 29 May 2026  
**Type:** Operator workbench UX — queue, requests list, request workspace, tenant readiness. **No** new platform capabilities.

---

## Workbench audit (pre-L2)

| Page | Issues | L2 response |
|------|--------|-------------|
| `/admin/queue` | Repeated safety copy, long footer links, weak “daily workbench” framing | Workbench header, summary-first, single safety note, context link grid |
| `/admin/requests` | Generic list cards, buried stage | `ProCrowRequestListCard` with stage + workspace CTA |
| `/admin/requests/[requestId]` | Flat stack of panels, duplicate queue strip, commercial buried | Workspace header, lifecycle, next action, blockers, sectioned layout, collapsible detail |
| `/admin/tenants/[tenantId]` | Header prose heavy, ProCrow/CEM split unclear | `ProCrowTenantWorkbenchHeader` with preparation vs runtime chips |

---

## Information architecture

Documented in `src/lib/constants/procrow-workbench-ia.ts`:

1. Operator queue — attention now  
2. Request workspace — one company end-to-end  
3. Tenant readiness — CEM prep without auto-provision  
4. Trust & experience — CyberCrow + SAREA  
5. Release / Go-No-Go — validation before demo/deploy  

Routes unchanged (`/admin/*`).

---

## Shared workbench components

| Component | Role |
|-----------|------|
| `procrow-workbench-page-header.tsx` | Purpose + status + back link |
| `procrow-workbench-section.tsx` | Titled section; optional collapse |
| `procrow-stage-summary-card.tsx` | Status chip grid cells |
| `procrow-next-action-card.tsx` | Primary CTA card |
| `procrow-blocker-list.tsx` | Advisory blockers |
| `procrow-context-link-grid.tsx` | Related routes |
| `procrow-request-lifecycle-panel.tsx` | Workflow strip for one request |
| `procrow-request-list-card.tsx` | Requests list row |
| `procrow-commercial-lifecycle-compact.tsx` | Commercial copy (no payments) |
| `procrow-tenant-workbench-header.tsx` | Tenant ProCrow vs CEM framing |

---

## Page results

### Queue

- Header: “What needs attention now”
- Summary strip → suggested next → priority highlights → stage browser
- One `ProCrowSafetyNote` at bottom

### Requests list

- Workbench header + context links
- Stage-oriented list cards with queue + workspace links

### Request detail

- Workspace header with stage summary grid
- Lifecycle panel, operator next action, blockers
- Sections: client interaction, blueprint/proposal, tenant framing, trust links
- Collapsible org/modules/operator tools
- Sidebar: commercial lifecycle + pricing

### Tenant detail

- Workbench header with ProCrow prepares / CEM operates chips
- Context links to go-no-go, queue, CEM, CyberCrow

---

## Commercial lifecycle & ProCrow/CEM

- Compact commercial panel on request workspace (L1 model, no checkout)
- Tenant header shows preparation controls vs CEM module list

---

## Progressive disclosure

- Request detail: org/contact, plan/modules, operator tools in collapsible sections
- Overview (L1): unchanged; workbench pages use single safety note pattern

---

## Verification

`npm run procrow-workbench:verify` — appended to `procrow:verify`.

---

## Validation (29 May 2026)

| Command | Result |
|---------|--------|
| `mock:verify` | Green |
| `typecheck` | Green |
| `lint` | Green |
| `build` | Green (non-fatal Prisma warning if `client_organization_request_links` absent locally) |
| `public:mirror-manifest` | Green |
| `product-ux:verify` | Green |
| `procrow-workbench:verify` | Green |
| `procrow:verify` (incl. workbench) | Green |
| `procrow-queue:verify` · `procrow-go-no-go:verify` · `procrow-operator:verify` | Green |
| `client-portal:verify` · `client-approval:verify` · `client-org:verify` · `client-notes:verify` | Green |

---

## Remaining gaps

- **L3** — Public + Client Portal UX refinement  
- **K1** — Tenant runtime demo rehearsal  
- Queue priority **lanes** (grouped critical/high) — deferred; cards improved only  
- Request workspace could add inline queue item match when derivable  

---

## Recommended next

**L3 — Public + Client Portal UX Refinement** or **K1 — Tenant Runtime Demo Rehearsal**

---

**Status:** **Passed** (29 May 2026)
