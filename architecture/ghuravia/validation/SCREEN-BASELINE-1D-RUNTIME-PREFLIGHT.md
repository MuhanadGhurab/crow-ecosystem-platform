# Screen Baseline — Architecture 1D Runtime Preflight

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1D-SCREEN-PREFLIGHT |
| **Version** | 1.0.0 |
| **Status** | **PASS** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1D |

## Verdict

```text
PASS — 92 ACTIVE GOVERNED SCREENS AVAILABLE FOR RUNTIME VALIDATION
```

## Inventory

| Check | Result |
|-------|--------|
| Active governed screens | **92** |
| Interface shells | **7** |
| Aliases counted | **0** |
| ACT-004 counted | **NO** |
| ACT-013 counted | **YES** |
| Duplicate canonical IDs | **0** |

## Runtime implications

* All 92 screens have a shell mapping for SPK-ARC-004.
* Historical aliases are not routable as active routes.
* Operator/admin surfaces remain separated from public/authenticated shells.
* Public and authenticated shells remain distinguishable.

## Related

* MASTER-SCREEN-REGISTRY v1.2.0
* CR-002-ACTIVE-SCREEN-VALIDATION.md
* SCREEN-BASELINE-1C-ACTIVATION-PREFLIGHT.md
