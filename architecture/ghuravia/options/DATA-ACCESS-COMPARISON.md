# Data Access Comparison

| Field | Value |
|-------|-------|
| Status | ACTIVE |
| Owner | Founder (RAVEN) |
| Date | 2026-07-21 |
| Source Gate | GHV.ARCHITECTURE.1B |

| Option | Summary | Pros | Risks / Limits | Architecture 1B stance |
|--------|---------|------|----------------|-------------------------|
| Drizzle ORM | Typed SQL-first access layer | Explicit SQL, light footprint, flexible exceptions | Requires SQL fluency | ACCEPTED WITH CONDITIONS |
| Prisma Client | Generated client and migrations | Strong DX in many cases | Heavier client and migration coupling for this phase | Evaluated, not selected for launch |
| Raw SQL everywhere | Full control | Maximum transparency and performance control | Higher repetition and inconsistency risk | ACCEPTED only for justified exceptions |
| Mixed ORM by module | Each domain chooses its own style | Local flexibility | High governance and maintenance cost | REJECTED FOR CONTROLLED LAUNCH |

## Baseline version note
`drizzle-orm@0.45.2`, `prisma client@7.9.0`
