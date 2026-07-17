# CROW.PUBLIC.1B — Bright Public Visual Identity Reset

| Field | Value |
|-------|-------|
| **Milestone** | CROW.PUBLIC.1B |
| **Status** | Complete — pending owner **visual** acceptance |
| **Prior** | CROW.PUBLIC.1A technically delivered; **owner visual review rejected** |
| **Branch** | `feat/first-tenant-golden-path` |
| **Preview route** | `/preview/public-home` (bright redesign replaces 1A dark preview) |

## Owner rejection of PUBLIC.1A

**Reason:** Preview still felt too close to the old dark Crow interface (`#04060c` shell, slate/cyan glass cards, dark nav). Did not establish a distinct final public identity.

**Owner direction:** Brighter (not pure white), modern, unique, premium enterprise, subtle hover/click — not scroll-story, not flying Crow, not generic ERP.

## Bright design direction implemented

- Warm ivory/pearl base (`#f6f3ec`) with mist gradients
- Graphite typography on layered paper/card surfaces
- Cyan, violet, amber used sparingly for intelligence, structure, trust
- Scoped CSS: `src/styles/public-v2-bright.css`
- Tokens: `src/lib/public-v2/tokens.ts` (`PUBLIC_V2_BRIGHT_IDENTITY_MARKER`)
- Interactive operating diagram (click/tap stage selection)
- Unified product frame for Blueprint → SAREA → Runtime
- Preview-only bright navigation (`PublicV2BrandMark`)

## Protected boundaries (confirmed)

- Real `/` homepage unchanged
- Global public navigation unchanged
- Scroll-story frozen — not removed
- No auth, Request, Discovery, Blueprint, tenant, commercial, subscription, or CroAI changes
- No migrations or hosted business writes

## Files changed

**Created:** `src/styles/public-v2-bright.css`, `src/lib/public-v2/tokens.ts`, `src/components/public-v2/public-v2-brand-mark.tsx`

**Redesigned:** All `src/components/public-v2/*` section components, preview navigation, operating diagram

**Tests:** `src/lib/public-v2/public-v2-preview-readiness.test.ts` — bright identity marker check

## Verification gates

```bash
npm run public-v2-preview-readiness:test
npm run public-v2-bundle-containment:verify
npm run typecheck
npm run lint
npm run build
```

## Known limitations

- Hero CTAs still anchor to journey cards until `/new-organization` and `/transform-existing` ship
- Representative org is fictional static data
- Certification host may require Vercel SSO
- Owner visual acceptance not claimed by automated gates

## Owner visual checklist

- [ ] Immediately feels like a **new Crow** — not old dark style
- [ ] Bright, warm, premium enterprise — not plain white or cyberpunk
- [ ] Hero readable in one laptop viewport; operating model is central bridge
- [ ] Interactive diagram: hover/click without required animation
- [ ] Lifecycle, journeys, Blueprint→SAREA→Runtime feel product-led
- [ ] Governed foundation shows one coordinated system
- [ ] No flying Crow, scroll story, fake tenant, generic ERP modules
- [ ] Desktop, iPad, mobile responsive
- [ ] `prefers-reduced-motion` acceptable

## Next safe milestone

**CROW.PUBLIC.1C** — Owner visual acceptance record and promotion decision (or targeted revision list).

## Owner review status

**Pending visual acceptance**
