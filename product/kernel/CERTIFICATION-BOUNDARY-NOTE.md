# Certification Platform Boundary — Design Note

| Field | Value |
|-------|-------|
| **Status** | DESIGN NOTE ONLY — NO RUNTIME INTEGRATION |
| **Gate** | GHV.IMPLEMENTATION.0F |
| **Version** | 0.1.0 |

## Future contract (not implemented in 0F)

```text
Core Platform
→ signed Evidence Snapshot
→ Certification Platform
```

## Authority

| Concern | Authoritative system |
|---------|----------------------|
| Mission history | Core Platform |
| Evidence Signal provenance | Core Platform |
| Crowprint | Core Platform |
| Suggested Lineage | Core Platform |
| Flight Log | Core Platform |

The Certification Platform must **not** recalculate Crowprint or rewrite Core Mission history.

No cross-project runtime integration in GHV.IMPLEMENTATION.0F.
Do not modify the separate Certification application in this Gate.
