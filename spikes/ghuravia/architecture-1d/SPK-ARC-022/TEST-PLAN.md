# SPK-ARC-022 — Test Plan

| # | Test | Expected |
|---|------|----------|
| 1 | Primary acceptance path | Verdict PASS WITH CONDITIONS |
| 2 | Locked separation assertion | No cross-domain mutation |
| 3 | AuthZ / privacy boundary | Deny by default where applicable |
| 4 | Degraded mode (if applicable) | Graceful fallback documented |
| 5 | Cleanup | No committed secrets or production data |

**Environment:** Local synthetic fixtures only.
