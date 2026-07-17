# CROW.PUBLIC.6 — Targeted Colorful Experience Fixes

| Field | Value |
|-------|-------|
| **Milestone** | CROW.PUBLIC.6 |
| **Branch** | `feat/first-tenant-golden-path` |
| **Status** | Deployed to certification — owner visual review pending |
| **Production** | Not deployed (not authorized) |
| **PR #10** | OPEN, DRAFT, unmerged |
| **Prior** | CROW.PUBLIC.5 colorful direction retained; CROW.PUBLIC.3/4 access model unchanged |

## Owner feedback (not accepted yet)

After CROW.PUBLIC.5 certification review, owner requested targeted fixes while **keeping** the colorful Crow identity:

1. Architecture diagram overlap / collision
2. Login and signup contrast (white-on-white, dark-on-dark inputs)
3. Stronger hero sections
4. Stronger, consistent button system
5. Clearer client journey presentation
6. Page-by-page polish and consistency
7. Governed use of additional color (no noise / childish overload)

## Issues fixed

### Diagram overlap and layout

- `public-foundation-diagram.tsx` — replaced absolute orbit positioning with CSS grid (`pv2-foundation-grid`); mobile uses stacked cards only
- `public-hero-section.tsx` — removed nested `pv2-hero-panel` around homepage operating diagram; uses `pv2-diagram-panel` with z-index discipline
- `public-operating-diagram.tsx` — nested operating elements hidden below `lg` to prevent stage crowding
- `public-canonical-pages-part2.tsx` — platform page uses compact foundation orbit variant

### Auth contrast

- `public-auth-frame.tsx` — `pv2-auth-form` wrapper
- `public-v2-bright.css` — scoped overrides for `[data-public-auth="true"]`: labels, `input-cc`, placeholders, OAuth buttons, links, errors on bright card

### Hero sections and page moods

- `public-content-page.tsx` — `pv2-page-hero` + `PublicPageMood` per page
- Page-level mood classes: teal, purple, navy, platform, security, pricing, start

### Button system

- Added `pv2-btn-teal`, `pv2-btn-purple`, `pv2-btn-quiet` with accessible focus states
- Existing primary/secondary/gold buttons retained; strengthened focus rings

### Client journey

- `public-client-journey-steps.tsx` — 10-phase journey rail
- Integrated on `/how-crow-works`, `/start`, `/request` with browse vs secure-process highlights

## Pages touched

`/`, `/how-crow-works`, `/new-organization`, `/transform-existing`, `/enterprise-blueprint`, `/platform`, `/platform/*`, `/security`, `/industries`, `/pricing`, `/start`, `/request`, `/login`, `/signup` (via shared CSS/shell).

## What did NOT change

- `public-access-policy.ts` / `route-protection.ts`
- Auth, OAuth, verification, Request/Discovery/Blueprint/tenant/commercial behavior
- Database, migrations, hosted business data
- Production deployment or PR #10 merge state

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

New static checks (PUBLIC.6): foundation grid (no `left-0`/`top-1/2` overlap pattern), auth contrast CSS, page hero/journey tokens, diagram panel collision guard.

## Manual diagram inspection checklist

- [ ] Homepage operating diagram — no stage overlap at 1280 / 1024 / 768 / 390 widths
- [ ] Homepage foundation diagram — grid nodes readable, no text collision
- [ ] Platform page orbit + link cards — no vertical collision
- [ ] Lifecycle rail — connectors only at `lg+`
- [ ] Auth login/signup — placeholder and typed text readable on bright card

## Certification deployment

| Item | Value |
|------|-------|
| Project | `crow-ftgp-certification` |
| Script | `npm run ftgp-certification-production:deploy` |
| Branch | `feat/first-tenant-golden-path` |
| Deployment host | `crow-ftgp-certification-q7lf00zi1-muhanadghurabs-projects.vercel.app` |
| Source commit | `d41ffac` |

Certification URL:

https://crow-ftgp-certification-q7lf00zi1-muhanadghurabs-projects.vercel.app/

## Known limitations

- Live browser visual QA on certification host not automated in CI
- Some journey pages use mood + hero panel only (no bespoke illustration per page)
- Legacy `cc-` form class names remain inside auth forms; contrast fixed via CSS scope only

## Owner review checklist

- [ ] No diagram nodes stacked on each other (desktop + mobile)
- [ ] Login/signup/register text and inputs readable
- [ ] Hero sections feel purposeful per page
- [ ] Primary CTAs feel confident; educational CTAs lighter but visible
- [ ] Client journey clear: browse public → sign in for secure process
- [ ] Colorful but not noisy; no revert to plain gray or legacy dark shell
- [ ] Public browse still works without sign-in

## Production

**Not authorized.** After owner accepts CROW.PUBLIC.6 on certification, proceed per [`CROW-PUBLIC-PROD-PLAN.md`](CROW-PUBLIC-PROD-PLAN.md).
