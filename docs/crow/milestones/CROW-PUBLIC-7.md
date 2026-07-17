# CROW.PUBLIC.7 — Journey CTA Color Tuning and Final Semi-Dark Polish

| Field | Value |
|-------|-------|
| **Milestone** | CROW.PUBLIC.7 |
| **Branch** | `feat/first-tenant-golden-path` |
| **Status** | Deployed to certification — owner review pending |
| **Production** | Not deployed (not authorized) |
| **PR #10** | OPEN, DRAFT, unmerged |
| **Prior** | Semi-dark cyber/neon direction **accepted** (commit `4ed070b`) |

## Owner decision

**VISUAL DIRECTION ACCEPTED** with one required adjustment: journey/conversion CTAs were too bright green / glowing white. All other semi-dark identity choices stand.

## Required fix

Journey/conversion CTAs (Build New, Start Building, Start Transforming, signup handoffs, secure request begin) now use **`pv2-btn-journey`** — muted amber/orange gradient, warm shadow, no neon-teal glow, accessible dark text.

Educational CTAs (Start Designing, How Crow Works, See lifecycle) use **`pv2-btn-secondary`** instead of bright primary.

## Small polish review

- Removed neon-teal glow from hero panel shadow
- Toned down `pv2-btn-primary` (utility teal, non-neon) and secondary hover glow
- Auth submit button matches journey amber on semi-dark card
- Journey card step badges use gold accent instead of bright `#0e7490`
- Button `max-width: 100%` + `text-wrap: balance` on journey/primary buttons

## Pages inspected

`/`, `/start`, `/new-organization`, `/transform-existing`, `/request`, `/pricing`, `/login`, `/signup`, `/enterprise-blueprint`, `/platform` (via shared shell/CSS/components).

## What did NOT change

- Route architecture, public access model, client journey model, auth behavior
- Database, migrations, hosted data, Production deployment

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

Added: journey CTA amber class check (`PUBLIC_V2_JOURNEY_CTA_CLASS`).

## Certification

| Item | Value |
|------|-------|
| Project | `crow-ftgp-certification` |
| Script | `npm run ftgp-certification-production:deploy` |
| Source commit | `cfbab22` (visual); docs HEAD `3255c29` |
| Deployment host | `crow-ftgp-certification-nuezmrimn-muhanadghurabs-projects.vercel.app` |

https://crow-ftgp-certification-nuezmrimn-muhanadghurabs-projects.vercel.app/

## Production

**Not authorized.** After owner accepts CROW.PUBLIC.7, proceed per [`CROW-PUBLIC-PROD-PLAN.md`](CROW-PUBLIC-PROD-PLAN.md).
