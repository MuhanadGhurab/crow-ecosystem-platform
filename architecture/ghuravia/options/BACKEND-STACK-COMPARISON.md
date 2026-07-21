# Backend Stack Comparison

| Field | Value |
|-------|-------|
| Status | ACTIVE |
| Owner | Founder (RAVEN) |
| Date | 2026-07-21 |
| Source Gate | GHV.ARCHITECTURE.1B |

| Option | Summary | Pros | Risks / Limits | Architecture 1B stance |
|--------|---------|------|----------------|-------------------------|
| TypeScript domain modules + Next.js Route Handlers | Monolith-internal backend with HTTP edge inside primary web app | Low deploy count, explicit modules, founder-operable | Requires discipline to keep handlers thin | ACCEPTED WITH CONDITIONS |
| Hono dedicated host | Optional dedicated API runtime | Small surface, clear extraction path | Adds deployable and runtime before needed | DEFERRED unless extraction trigger fires |
| NestJS | Full framework API host | Rich patterns and ecosystem | Higher ceremony and launch complexity | REJECTED FOR CONTROLLED LAUNCH |
| Early service split | Separate backend deployables from launch | Strong isolation | Higher auth, tracing, deploy, and ops burden | DEFERRED |

## Evidence
`SPK-ARC-001`, `SPK-ARC-003`, `SPK-ARC-010`
