# CROW.PUBLIC.9 — Lock-In Current Public Design and Targeted Polish

| Field | Value |
|-------|-------|
| **Milestone** | CROW.PUBLIC.9 |
| **Branch** | `feat/first-tenant-golden-path` |
| **Status** | Deployed to certification — owner review pending |
| **Production** | Not deployed (not authorized) |
| **PR #10** | OPEN, DRAFT, unmerged |
| **Prior** | CROW.PUBLIC.8 signature hero **accepted in principle** as baseline |

## Owner decision

**APPROVED IN PRINCIPLE — LOCK DESIGN IN AND FIX THE REST.**

The semi-dark premium cyber/neon public identity, signature homepage hero, amber journey CTA, and purple transform CTA are the locked direction. This milestone is polish-only — no redesign, no route/access changes.

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
| Source commit | see git HEAD after push |

## Production

**Not authorized.**

## Owner review checklist

- [ ] Design direction unchanged (semi-dark, signature hero, amber/purple CTAs)
- [ ] No text clipping or escaping boxes on homepage hero
- [ ] iPad portrait and mobile layouts readable
- [ ] Auth login/signup contrast and input readability
- [ ] Public pages feel consistently polished
- [ ] No regression to white/gray or boxed generic hero
