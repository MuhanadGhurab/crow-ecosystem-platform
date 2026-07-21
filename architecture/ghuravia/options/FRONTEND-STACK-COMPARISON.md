# Frontend Stack Comparison

| Field | Value |
|-------|-------|
| Status | ACTIVE |
| Owner | Founder (RAVEN) |
| Date | 2026-07-21 |
| Source Gate | GHV.ARCHITECTURE.1B |

| Option | Summary | Pros | Risks / Limits | Architecture 1B stance |
|--------|---------|------|----------------|-------------------------|
| Next.js App Router + React 19 + TypeScript | Integrated SSR/SSG, routing, metadata, server edges | Strong public-shell fit, SEO/public support, unified stack | P1 RTL/a11y evidence still open | ACCEPTED WITH CONDITIONS |
| Vite SPA-only | Fast client-only app shell | Simple dev flow, low ceremony | Weak public SEO/discoverability posture as sole frontend | REJECTED FOR CONTROLLED LAUNCH as sole frontend |
| Hybrid stitched tools | Separate tools for routing, SSR, build, metadata | Can be flexible | Higher integration and governance burden | DEFERRED |
| Other React meta-frameworks | Alternative web stacks | Possible future comparison | No P0 evidence, weaker repo-specific grounding | DEFERRED |

## Baseline version note
`next@16.2.10`, `react@19.2.8`, `typescript@7.0.2`, `Node 24.15.0`
