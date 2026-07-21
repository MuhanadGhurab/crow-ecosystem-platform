# SPK-ARC-008 — Hypothesis

**Question:** Can the Evidence scanning pipeline fail-closed on malware markers, secret patterns, and scanner outage — never releasing for review on inconclusive results?

**Hypothesis:** A synthetic scanner pipeline with harmless test signatures proves fail-closed behavior regardless of a `failOpen` configuration flag.

**Versions:** Node ≥20 / node:test
