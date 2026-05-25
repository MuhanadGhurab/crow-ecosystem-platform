# F12 — Screenshot checklist

**Purpose:** Capture portfolio-ready visuals for README, CV, and talks.  
**Rule:** Dark theme, no secrets in DevTools, no real customer PII, no internal cuid IDs in filenames or captions.

**Storage:** [`docs/public/assets/screenshots/`](../public/assets/screenshots/)  
**Capture guide:** [`docs/public/assets/screenshots/README.md`](../public/assets/screenshots/README.md)

**Do not** auto-generate screenshots in CI unless existing tooling is explicitly run by an operator.

---

## Pre-capture

- [ ] Staging or local with `AUTH_DISABLED` + `USE_MOCK_DATA` chosen intentionally
- [ ] Platform Admin session for admin/blueprint shots
- [ ] Window 1440×900 or 1920×1080, browser zoom 100%
- [ ] Hide bookmarks bar; close unrelated tabs
- [ ] Confirm no `.env` values visible on screen

---

## Shots

| # | Suggested filename | Route | What it proves | Public-safe |
|---|-------------------|-------|----------------|-------------|
| 1 | `homepage-hero.png` | `/` | Public positioning, three engines | **Yes** |
| 2 | `public-request.png` | `/request` | Governed intake | **Yes** |
| 3 | `architecture.png` | `/architecture` | Lifecycle + surfaces (if `/` is light) | **Yes** |
| 4 | `admin-operator-console.png` | `/admin/overview` | Pipeline buckets, operator command center | **Yes** (no internal IDs in crop) |
| 5 | `admin-request-detail.png` | `/admin/requests/{requestId}` | Reference, next action, pipeline links | **Yes** — blur/crop if internal id in URL |
| 6 | `discovery-summary.png` | `/discovery/{requestId}/summary` | Sector discovery, handoff | **Yes** |
| 7 | `blueprint-overview.png` | `/blueprints/{blueprintId}/overview` | Blueprint contract | **Yes** |
| 8 | `blueprint-readiness.png` | `/blueprints/{blueprintId}/readiness` | Readiness gates | **Yes** |
| 9 | `blueprint-go-live.png` | `/blueprints/{blueprintId}/go-live` | Go-live bridge (no provision clicked) | **Yes** |
| 10 | `meem-dashboard.png` | `/meem-global/dashboard` | Lighthouse CEM runtime | **Yes** (slug is public-safe) |
| 11 | `cybercrow-dashboard.png` | `/meem-global/cybercrow/dashboard` | Trust orchestration on tenant | **Yes** |
| 12 | `sarea-preview.png` | `/sarea/preview` | Persona / adaptive UX | **Yes** |
| 13 | `rimal-dashboard.png` | `/rimal-construction/dashboard` | Second tenant, construction | **Yes** |
| 14 | `admin-notifications.png` | `/admin/notifications` | Operator notification inbox | **Yes** |
| 15 | `najm-request-detail.png` | `/admin/requests/{requestId}` for `CROW-2026-ARAX9K` | Organic aviation pipeline (optional) | **Yes** — caption as “staging validation”, not customer endorsement |

---

## Caption templates (public)

| Shot | Caption |
|------|---------|
| Homepage | Crow Ecosystem — adaptive enterprise orchestration platform |
| Request | Structured implementation request intake |
| Admin overview | Platform operator console with onboarding pipeline buckets |
| Blueprint readiness | Readiness gates before go-live |
| MEEM dashboard | CEM tenant workspace (logistics lighthouse scenario) |
| CyberCrow | Security and trust orchestration on the tenant |
| SAREA preview | Role-adaptive experience preview |

---

## Public-safe vs internal-only

| Public-safe | Internal-only (do not publish) |
|-------------|-------------------------------|
| Slugs `meem-global`, `rimal-construction` | Full URL with `{requestId}` / `{blueprintId}` cuid |
| Reference `CROW-2026-*` on staging | Database connection strings, Supabase keys |
| Sector labels (logistics, construction, aviation) | Najm/MEEM/Rimal contract or pricing |
| “Staging validation” wording | Operator runbook screenshots with CLI output |

---

## After capture

- [ ] Optimize PNG/WebP (reasonable file size)
- [ ] Embed in root [`README.md`](../../README.md) per screenshots README
- [ ] Update [`F12_DEMO_STORYBOARD.md`](F12_DEMO_STORYBOARD.md) if routes changed
- [ ] Check [`npm run public:mirror-manifest`](../../package.json) still excludes `docs/internal`

---

## Related

- [`F12_DEMO_ROUTE_INDEX.md`](F12_DEMO_ROUTE_INDEX.md)
- [`F12_OPERATOR_DEMO_PLAYBOOK.md`](F12_OPERATOR_DEMO_PLAYBOOK.md)
