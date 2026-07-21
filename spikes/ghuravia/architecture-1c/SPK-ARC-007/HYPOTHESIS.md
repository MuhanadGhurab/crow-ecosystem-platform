# SPK-ARC-007 — Hypothesis

**Question:** Can Evidence upload use resumable chunks, short-lived tokens, quarantine isolation, and admin APIs that never expose storage credentials?

**Hypothesis:** A local filesystem object-store simulation with token-bound sequential uploads proves the direct-to-quarantine pattern before S3 adapter selection.

**Versions:** Node ≥20 / node:test
