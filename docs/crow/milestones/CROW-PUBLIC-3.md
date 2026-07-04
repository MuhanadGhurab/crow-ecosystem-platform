# CROW.PUBLIC.3 — Public Experience Acceptance Fixes

| Field | Value |
|-------|-------|
| **Milestone** | CROW.PUBLIC.3 |
| **Branch** | `feat/first-tenant-golden-path` |
| **Status** | Deployed to certification — owner visual acceptance pending |
| **Production** | Not deployed (not authorized) |
| **PR #10** | OPEN, DRAFT, unmerged |
| **Prior milestone** | CROW.PUBLIC.2 (`118073a`) — owner NOT ACCEPTED YET |

## Owner feedback (not accepted at PUBLIC.2)

Owner confirmed bright direction is preferred over legacy dark, but certification review found:

1. Background too plain — site feels boring and dated
2. Design not inviting, appealing, or premium enough
3. Some blue/purple boxes without cohesive composition
4. Elements overlapping or sitting on top of each other
5. Visual consistency and rhythm weak
6. **Public pages incorrectly requiring sign-in to browse** — sign-in should only gate client process actions

This milestone is **targeted acceptance fixes**, not a new strategy or full redesign.

## Problems diagnosed (PUBLIC.2)

| Area | Diagnosis |
|------|-----------|
| Access | New canonical routes (`/platform`, `/start`, `/how-crow-works`, etc.) missing from `route-protection.ts` public prefixes — middleware treated them as tenant slugs and required auth |
| Background | Flat ivory base with isolated colored cards — no layered depth |
| Layout | Stagger `marginLeft` on begins-differently cards caused overlap on smaller viewports |
| `/start` | Double chrome — dark legacy `PublicHeader` in layout + bright `PublicSiteChrome` on page |
| CTAs | Journey cards mixed educational and conversion without clear separation |
| `/request` | Gated entire page; no public explanation of browse-vs-start model |

## Access model correction

### Public browsing (no sign-in)

Canonical paths registered in `src/lib/public/public-access-policy.ts` and wired into `src/lib/auth/route-protection.ts`:

- `/`, `/how-crow-works`, `/new-organization`, `/transform-existing`, `/enterprise-blueprint`
- `/platform`, `/platform/cem`, `/platform/cybercrow`, `/platform/sarea`, `/platform/procrow`
- `/security`, `/industries`, `/pricing`, `/case-studies`, `/start`, `/login`, `/signup`
- `/request` — **public explanation page** (Option A)

### Gated client process (sign-in required)

- `/client/*`, `/portal/*`, `/discovery/*`, onboarding, tenant runtime, ProCrow/admin/internal surfaces
- Actual Request creation workflow (logged-in redirect preserved)

### CTA model

| Type | Examples | Behavior |
|------|----------|----------|
| Educational | Explore journey, Learn How Crow Works, platform links | Public routes only |
| Conversion | Start Building New, Start Transforming, Continue to secure intake | `buildSignupHandoffUrl` or auth handoff |

Passive journey selection on `/start` creates **no** business records.

### `/request` decision — Option A

**Chosen:** Public explanation page with gated “Continue to secure client request” action.

**Why:** Safer — no Request persistence changes; logged-in users still redirect to `routes.client.requestNew`; copy clarifies browse vs start.

## Bright visual system improvements

`src/styles/public-v2-bright.css`:

- Layered ambient fields (`pv2-ambient`, `pv2-ambient-accent`)
- Blueprint grid texture (`pv2-blueprint-grid`)
- Section bands (`pv2-section-band`, `pv2-hero-panel`)
- Lifecycle gates, blueprint frames, platform orbit, access callout
- Interactive card lift (`pv2-card-interactive`)
- Stronger `pv2-h1` hierarchy
- `prefers-reduced-motion` covers new interactive classes

## Layout and overlap fixes

- Removed stagger `marginLeft` from begins-differently section
- Operating diagram min-heights increased for label clearance
- Section `band` prop (`none` | `muted` | `emphasis`) for rhythm
- `/start` layout uses single `PublicSiteChrome` (no dark duplicate header)
- Z-index layering on `public-site-layout` (grid behind content)

## Page improvements (summary)

| Route | Changes |
|-------|---------|
| `/` | Hero panel, section bands, journey split CTAs, foundation diagram retained |
| `/how-crow-works` | Lifecycle rail, commercial gate note, access callout |
| `/new-organization` | Founder path framing, conversion CTA separated |
| `/transform-existing` | Current → Target → Transition visual, public browse |
| `/enterprise-blueprint` | Blueprint frame variant, six domains |
| `/platform/*` | Platform orbit connected layout |
| `/security`, `/industries`, `/pricing` | Bands, interactive cards, scope-aware pricing copy |
| `/start` | Access callout, explore vs start CTAs per card |
| `/login`, `/signup` | Bright auth frame with blueprint ambient |
| `/request` | Public copy + secure continue; auth redirect for logged-in users unchanged |

## Protected boundaries (unchanged)

No changes to: schema, migrations, hosted business data, auth behavior, authorization, verification, Request/Discovery/Blueprint persistence, tenant provisioning, RBAC, commercial runtime, CroAI runtime.

## Tests

```bash
npm run typecheck
npm run lint
npm run build
npm run public-access-policy:test
npm run public-route-architecture:test
npm run public-v2-preview-readiness:test
```

New: `public-access-policy.test.ts` — middleware browse paths, reserved segments, gated prefixes, request/start layout.

Updated: `public-route-architecture.test.ts` — dark shell ban, stagger overlap ban, depth tokens, bundle containment.

## Certification deployment

| Field | Value |
|-------|-------|
| Project | `crow-ftgp-certification` |
| Script | `npm run ftgp-certification-production:deploy` |
| Commit | `b90ac88` |
| Deployment ID / host | `crow-ftgp-certification-kjx1z76b2-muhanadghurabs-projects.vercel.app` |

**Certification URLs (owner review):**

- https://crow-ftgp-certification-kjx1z76b2-muhanadghurabs-projects.vercel.app/
- https://crow-ftgp-certification-kjx1z76b2-muhanadghurabs-projects.vercel.app/how-crow-works
- https://crow-ftgp-certification-kjx1z76b2-muhanadghurabs-projects.vercel.app/start
- https://crow-ftgp-certification-kjx1z76b2-muhanadghurabs-projects.vercel.app/platform
- https://crow-ftgp-certification-kjx1z76b2-muhanadghurabs-projects.vercel.app/request

## Known limitations

- Auth form controls retain some legacy `cc-` styling inside bright frame
- `/register` route not visually refreshed (out of scope)
- Visual overlap cannot be fully automated — manual owner checklist required
- Unauthenticated HTTP integration tests not run against live certification host in CI

## Owner visual checklist

- [ ] Bright direction retained — no dark starfield on public routes
- [ ] Background has depth (grid, ambient mists) — not flat boring white
- [ ] Homepage feels inviting and premium — seven sections flow cleanly
- [ ] No overlapping cards, badges, or diagram labels
- [ ] Section spacing and rhythm consistent across pages
- [ ] Can browse `/platform`, `/start`, `/how-crow-works` without sign-in
- [ ] Sign-in only when starting client process (Start Building / Transform / secure request)
- [ ] Build New and Transform journeys clear with explore vs start CTAs
- [ ] Blueprint and platform pages feel connected, not isolated card grids
- [ ] Pricing is scope-aware — no fake SaaS tiers
- [ ] No story nav, Architect's Map, or flying Crow

## Next milestone options

- **CROW.PUBLIC.PROD** — Production promotion (explicit owner authorization only)
- **CROW.PUBLIC.4** — `/register` visual alignment or further owner polish if needed
