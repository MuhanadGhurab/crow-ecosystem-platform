# SPK-ARC-008 — Test Plan

| # | Test | Expected |
|---|------|----------|
| 1 | Clean synthetic content | `SCAN_PASSED`, `releaseAllowed=true` |
| 2 | Harmless malware test signature | `releaseAllowed=false` |
| 3 | Secret marker in content | `SCAN_FAILED`, no release |
| 4 | Scanner outage with failOpen=true | `SCAN_INCONCLUSIVE`, `releaseAllowed=false` |

**Safety:** No real malware. ASCII test signature `GHV-TEST-SIGNATURE-NOT-MALWARE-X5O!P%@AP` only.
