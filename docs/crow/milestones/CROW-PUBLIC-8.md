# CROW.PUBLIC.8 — Homepage Signature Hero Redesign

| Field | Value |
|-------|-------|
| **Milestone** | CROW.PUBLIC.8 |
| **Branch** | `feat/first-tenant-golden-path` |
| **Status** | Deployed to certification — owner review pending |
| **Production** | Not deployed (not authorized) |
| **PR #10** | OPEN, DRAFT, unmerged |
| **Prior** | CROW.PUBLIC.7 semi-dark direction and amber journey CTAs **accepted**; homepage first impression **rejected** |

## Owner screenshot review

Owner reviewed certification homepage at `crow-ftgp-certification-nuezmrimn-muhanadghurabs-projects.vercel.app` (CROW.PUBLIC.7).

**NOT ACCEPTED** — homepage first impression is not strong enough.

**Accepted and preserved:**

- Semi-dark cyber/neon direction
- Public route architecture and browse/sign-in model
- Amber/orange journey CTAs (`pv2-btn-journey`)
- Seven-section homepage structure
- No scroll story, no flying Crow

**Rejected:**

- Generic dark SaaS hero card
- Large centered rounded rectangle boxing content
- Small cramped operating diagram with tiny labels
- Dead dark space in first viewport
- Weak visual moment / not premium or unique to Crow

## Hero redesign approach

**Option B (enhanced):** four-stage horizontal transformation canvas with **Operating Model visually dominant** in the center column.

### Composition changes

- Replaced `pv2-hero-panel` + nested `pv2-diagram-panel` with **full-width `pv2-signature-hero`**
- Layered semi-dark navy/teal/purple atmosphere + blueprint grid linework (not a single flat card)
- Left column: headline, trust pills, journey CTAs, insight bullets (desktop)
- Right column: large `PublicHeroTransformationVisual` integrated into hero canvas
- Section bridge gradient into “Crow Begins Differently” (`pv2-section-after-hero`)

### New component

`src/components/public-v2/public-hero-transformation-visual.tsx`

- Horizontal grid on md+: Intent → **Operating Model (2.15× width)** → Blueprint → Runtime
- Operating Model always shows People, Responsibilities, Workflows, Trust in readable 2×2 facet grid (`0.8125rem` min)
- Mobile: stacked stages with expanded operating model
- Flow summary strip + caption for active stage
- Interactive `aria-pressed` stage selection (content always visible; not hover-only)

### CTA treatment (preserved CROW.PUBLIC.7)

- Primary journey: `PUBLIC_V2_JOURNEY_CTA_CLASS` (amber)
- Transform: new `pv2-btn-transform` (purple outline / soft fill — readable secondary)
- Educational: `pv2-link` for See How Crow Works and Sign In

## Text containment fixes

- `min-w-0`, `overflow-wrap: anywhere` on hero stages, facets, captions
- Readable facet labels (no 10px cramped boxes)
- `text-wrap: balance` on signature headline
- No nested hero card collision

## Pages inspected

**Primary:** `/` (homepage hero + section flow)

**Secondary (no broad redesign):** `/start`, `/new-organization`, `/transform-existing`, `/enterprise-blueprint`, `/platform`, `/login`, `/signup` — no regressions found requiring changes in this milestone.

## What did NOT change

- Database schema, migrations, hosted business data
- Auth, OAuth, authorization, domain behavior
- Public access policy, route architecture, CTA destinations
- Client journey logic, blueprint compiler, tenant provisioning
- Production deployment, PR #10 merge

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

Added/updated:

- `signature hero avoids boxed card composition (CROW.PUBLIC.8)` in `public-route-architecture.test.ts`
- Hero four-stage check includes `public-hero-transformation-visual.tsx`

## Certification

| Item | Value |
|------|-------|
| Project | `crow-ftgp-certification` |
| Script | `npm run ftgp-certification-production:deploy` |
| Source commit | see git HEAD after push |
| Prior cert URL | `crow-ftgp-certification-nuezmrimn-muhanadghurabs-projects.vercel.app` |

See final report for deployment URL after this milestone deploy.

## Known limitations

- Owner visual acceptance not yet recorded for homepage hero
- Operating diagram component (`public-operating-diagram.tsx`) retained for reuse elsewhere; homepage uses hero-specific visual
- iPad two-column layout depends on md/lg breakpoints — verify on owner devices

## Owner review checklist

- [ ] First viewport feels premium, cinematic, and Crow-specific (not generic SaaS card)
- [ ] Operating Model is visually dominant with readable facets
- [ ] Four-stage flow understandable in 3–5 seconds
- [ ] Journey CTAs remain amber (not bright green)
- [ ] Transform CTA readable (purple secondary)
- [ ] No text clipping or horizontal overflow on laptop/mobile
- [ ] Hero transitions cleanly into “Crow Begins Differently”
- [ ] Seven homepage sections unchanged in structure

## Production

**Not authorized.** Proceed per [`CROW-PUBLIC-PROD-PLAN.md`](CROW-PUBLIC-PROD-PLAN.md) only after owner accepts public experience milestones.
