# Testing Toolchain Comparison

| Field | Value |
|-------|-------|
| Status | ACTIVE |
| Owner | Founder (RAVEN) |
| Date | 2026-07-21 |
| Source Gate | GHV.ARCHITECTURE.1B |

| Option | Summary | Pros | Risks / Limits | Architecture 1B stance |
|--------|---------|------|----------------|-------------------------|
| `node:test` + future Vitest + future Playwright | Lightweight spikes, later broad coverage | Fast reproducibility, layered growth path | Browser and a11y coverage still later | ACCEPTED |
| Vitest for everything now | One tool earlier | Familiar DX | More framework than needed for P0 spikes | DEFERRED |
| Jest-centered stack | Mature ecosystem | Large ecosystem | Less aligned with current lightweight spike harness | DEFERRED |
| Browser-only validation | UI-level confidence | Good for UX paths | Misses core invariants and server-side ledger proofs | REJECTED FOR CONTROLLED LAUNCH |
