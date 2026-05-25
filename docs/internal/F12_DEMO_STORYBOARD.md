# F12 — Demo storyboard (5–10 minutes)

**Audience:** Internal operators, portfolio demos, CV walkthroughs  
**Environment:** Staging (`https://crow-ecosystem-platform.vercel.app`) or local with Postgres + Entra  
**Last updated:** 25 May 2026

**Companion docs:** [`F12_DEMO_ROUTE_INDEX.md`](F12_DEMO_ROUTE_INDEX.md) · [`F12_OPERATOR_DEMO_PLAYBOOK.md`](F12_OPERATOR_DEMO_PLAYBOOK.md) · [`F12_SCREENSHOT_CHECKLIST.md`](F12_SCREENSHOT_CHECKLIST.md)

---

## Narrative spine (30 seconds)

Crow is an **adaptive enterprise orchestration platform**: Discovery understands the organization, Blueprint defines what to build, CEM runs operations, CyberCrow protects, and SAREA adapts the experience per role — on a governed path from first request to go-live.

```text
Discovery understands → Blueprint defines → CEM runs → CyberCrow protects → SAREA adapts
```

---

## Demo flow

| # | Step | Route | What to say | What it proves | What not to claim | Fallback |
|---|------|-------|-------------|----------------|-------------------|----------|
| 1 | **Public homepage** | `/` | “This is the public face of Crow — enterprise orchestration, not a single ERP module list. Prospects start here.” | Product positioning, three engines, lifecycle story | “Production SaaS with live billing enforcement” | Use `/architecture` if homepage is sparse |
| 2 | **Public request** | `/request` | “Every engagement starts with structured intake — modules, security posture, industry context — before we configure anything.” | Governed intake, reference code pattern | “Auto-provisions a tenant on submit” | Explain API parity if wizard not shown live |
| 3 | **Admin operator console** | `/admin/overview` | “Platform operators see pipeline buckets — what needs review, discovery, blueprint, or go-live — in one command center.” | Operator console, lifecycle visibility, lighthouse cards | “Fully automated provisioning without human gate” | Sign in as Platform Admin; if redirect, see playbook auth section |
| 4 | **Request detail** | `/admin/requests/{requestId}` | “For each request we show reference, industry, modules, next action, and links into discovery and blueprint.” | End-to-end traceability, human-readable status | “This row is MEEM-only magic” | Open from overview bucket or `/admin/requests`; use Najm ref lookup (step 12) |
| 5 | **Discovery & org intelligence** | `/discovery/{requestId}/summary` (and nav) | “Discovery captures sector-specific answers and org intelligence — aviation, construction, logistics templates exist.” | Sector templates, structured discovery, handoff to blueprint | “AI auto-writes the whole blueprint with no review” | Use MEEM or Najm request with completed discovery |
| 6 | **Blueprint overview** | `/blueprints/{blueprintId}/overview` | “The blueprint is the contract — modules, engines, commercial framing, readiness before go-live.” | Blueprint as contract, modular scope | “Customer is live in production because blueprint exists” | Open from request detail pipeline link |
| 7 | **Readiness / go-live** | `/blueprints/{blueprintId}/readiness` · `.../go-live` | “Readiness gates and go-live are explicit — provision only when intentional, with blockers visible.” | Advisory gates, no silent provision | “One-click production cutover for any visitor” | Show UI only; **do not click Provision** unless scripted |
| 8 | **MEEM live tenant** | `/meem-global/dashboard` | “MEEM is our logistics lighthouse — live tenant after go-live: CEM modules, workflows, operational density.” | Lighthouse tenant, logistics sector, modular ERP chain | “Only MEEM can use Crow” | `npm run meem:ids:staging` for URLs if env differs |
| 9 | **CyberCrow dashboard** | `/meem-global/cybercrow/dashboard` | “CyberCrow makes trust visible on the tenant — posture, events, audit narrative aligned to NCA framing.” | Security operations on tenant, not bolt-on | “Certified compliant / pen-tested production” | Use MEEM; mention advisory demo data where relevant |
| 10 | **SAREA preview** | `/sarea/preview` | “SAREA adapts layout and navigation by persona — RBAC controls access; SAREA controls experience.” | Persona packs, studio → runtime story | “SAREA replaces RBAC” | Preview buttons; optional `/meem-global/dashboard` with persona cookie |
| 11 | **Rimal second tenant** | `/rimal-construction/dashboard` · `.../cybercrow/dashboard` | “Rimal proves second-tenant onboarding — construction sector, isolation from MEEM, same platform engines.” | Multi-tenant repeatability, sector diversity | “Unlimited tenants self-serve without operator” | `npm run tenant:verify:rimal` before demo if staging cold |
| 12 | **Najm organic proof** | `/admin/requests` → ref `CROW-2026-ARAX9K` (lookup) | “Najm Aviation is organic intake — real request → operator → discovery → blueprint — **without** tenant provision in F11.” | Organic pipeline, aviation sector, operator sign-off (F11B) | “Najm is a paying live customer” | Resolve request via admin search or `npm run onboarding:verify -- --reference=CROW-2026-ARAX9K --expect-blueprint --expect-sector=aviation` |

**Timing guide:** Steps 1–2 (~2 min) · 3–7 (~4 min) · 8–11 (~3 min) · 12 (~1 min) = **~10 min**. Short demo: 1, 3, 6, 8, 9, 10 (~5 min).

---

## Proof matrix (what each pillar shows)

| Pillar | Primary steps | Evidence |
|--------|---------------|----------|
| Discovery understands | 2, 5, 12 | Templates, org intelligence, organic aviation |
| Blueprint defines | 6, 7, 12 | Overview, readiness, go-live bridge |
| CEM runs | 8, 11 | MEEM + Rimal dashboards |
| CyberCrow protects | 9, 11 | Tenant CyberCrow consoles |
| SAREA adapts | 10 | Preview + MEEM persona runtime |

---

## Roles & accounts

| Role | Needed for |
|------|------------|
| **Platform Admin** (Entra) | Steps 3–7, 12 |
| **Tenant user** (optional) | MEEM/Rimal tenant paths if not using admin preview |
| **Unauthenticated** | Steps 1–2 only |

---

## Public vs internal boundary

| Safe in external demo | Keep internal only |
|----------------------|-------------------|
| Reference codes `CROW-2026-*` (staging demo) | Prisma cuid IDs, blueprint/request UUIDs in slides |
| Slug `meem-global`, `rimal-construction` | Customer contracts, `.env`, API keys |
| “Validated on staging” lifecycle language | Full operator runbooks, seed scripts |
| Sector names (logistics, construction, aviation) | MEEM/Rimal/Najm commercial terms unless approved |

---

## Related checkpoints

- F11 organic browser sign-off — [`F11_ORGANIC_BROWSER_E2E_SIGNOFF.md`](F11_ORGANIC_BROWSER_E2E_SIGNOFF.md)
- F10 operator console — [`F10_TENANT_ONBOARDING_OPERATOR_CONSOLE.md`](F10_TENANT_ONBOARDING_OPERATOR_CONSOLE.md)
- F8 organic checklist — [`F8_ORGANIC_REQUEST_E2E.md`](F8_ORGANIC_REQUEST_E2E.md) §18
