# CROW.PUBLIC.9 — Lock-In Current Public Design and Targeted Polish

| Field | Value |
|-------|-------|
| **Milestone** | CROW.PUBLIC.9 |
| **Branch** | `feat/first-tenant-golden-path` |
| **Status** | **ACCEPTED on certification** (CROW.PUBLIC.10, 2026-07-07) |
| **Production** | Not deployed (not authorized) |
| **PR #10** | OPEN, DRAFT, unmerged |
| **Prior** | CROW.PUBLIC.8 signature hero — baseline for lock-in |

## Owner decision

**ACCEPTED — CURRENT PUBLIC DESIGN IS LOCKED AS THE FINAL PUBLIC EXPERIENCE CANDIDATE** (CROW.PUBLIC.10, manual certification review, 2026-07-07).

Accepted elements:

- Semi-dark cyber/neon public identity
- Signature homepage hero and Operating Model visual
- Amber journey CTA (`pv2-btn-journey`)
- Purple transform CTA (`pv2-btn-transform`)
- Public route architecture and browse/sign-in model
- Text containment polish

**Production deployment is still not authorized.** PR #10 remains open, draft, and unmerged.

Prior milestone note: **APPROVED IN PRINCIPLE — LOCK DESIGN IN AND FIX THE REST** (pre-polish, CROW.PUBLIC.9 implementation).

## Issues addressed

| Area | Fix |
|------|-----|
| Text escaping boxes | Extended `min-w-0` / `overflow-wrap` to hero stages, facets, trust pills, buttons, dropdown items |
| Hero diagram crowding (iPad) | Horizontal transformation canvas deferred to `lg` (1024px+); stacked layout below |
| Side stage overflow | Removed duplicate descriptions in horizontal grid; details in caption |
| Facet labels | Responsive font sizing + hyphens on narrower laptop widths |
| Journey/transform CTAs | `max-width: 100%`, `text-wrap: balance`, full-width on mobile |
| Trust pills | Balance wrapping and line-height |
| Foundation diagram | Label size 10px → 11px, node containment |
| Lifecycle chips | Teal token on semi-dark (removed `#0e7490`) |
| Auth frame | `min-w-0`, balanced title, input width 100% |
| Page heroes | `text-balance` on canonical content pages |
| Nav dropdowns | `min-w-0` on menu item text |

## Design lock marker

- `PUBLIC_V2_LOCKED_PUBLIC_DESIGN_MARKER` in `tokens.ts`
- `data-pv2-locked-design="true"` on public site layout and auth frame

## Pages reviewed

`/`, `/how-crow-works`, `/new-organization`, `/transform-existing`, `/enterprise-blueprint`, `/platform`, `/platform/cem`, `/platform/cybercrow`, `/platform/sarea`, `/platform/procrow`, `/security`, `/industries`, `/pricing`, `/start`, `/request`, `/login`, `/signup`

Shared shell, CSS, and content templates apply polish globally; no page-specific redesign.

## What did NOT change

- Route architecture, public access model, auth behavior
- CTA destinations, copy strategy, color direction
- Hero structural concept (`pv2-signature-hero`, `PublicHeroTransformationVisual`)
- Database, migrations, hosted data, Production

## Tests

```bash
git diff --check
npm run typecheck
npm run lint
npm run build
npm run public-access-policy:test
npm run public-route-architecture:test
npm run public-v2-preview-readiness:test
```

Added: `locked public design marker and polish containment (CROW.PUBLIC.9)`.

## Certification

| Item | Value |
|------|-------|
| Project | `crow-ftgp-certification` |
| Script | `npm run ftgp-certification-production:deploy` |
| **Accepted visual deploy commit** | `c51a60e` |
| **Branch documentation HEAD** | `7e3a49d` (docs-only after visual deploy) |
| Deployment host | `crow-ftgp-certification-iipjrwhxd-muhanadghurabs-projects.vercel.app` |

**Accepted certification URL:**

https://crow-ftgp-certification-iipjrwhxd-muhanadghurabs-projects.vercel.app/

## Production

**Not authorized.** See [`CROW-PUBLIC-PROD-PLAN.md`](CROW-PUBLIC-PROD-PLAN.md) — requires explicit owner authorization phrase.

## Owner review checklist

- [x] Design direction unchanged (semi-dark, signature hero, amber/purple CTAs)
- [x] No text clipping or escaping boxes on homepage hero
- [x] iPad portrait and mobile layouts readable
- [x] Auth login/signup contrast and input readability
- [x] Public pages feel consistently polished
- [x] No regression to white/gray or boxed generic hero

Acceptance recorded in CROW.PUBLIC.10 (2026-07-07).
