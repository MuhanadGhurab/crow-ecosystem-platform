# CyberCrow Control Plane

CyberCrow provides **trust, risk, and evidence signals** to operators and tenants — advisory and actionable, not autonomous remediation.

## Signal flow

```
SecuritySignal → evaluation context → severity → recommended action → owner → evidence
```

Types in `src/lib/crow-core/security/` align with `src/lib/procrow/procrow-control-tower-contract.ts`.

## Evaluation points

- Login and session anomalies
- Permission elevation requests
- Blueprint material changes
- Integration credential scope
- Tenant quota abuse patterns

## Explicit non-claims

- Not a SIEM replacement
- Not an autonomous SOC
- Not silent tenant policy changes
- Not a substitute for RBAC or approval gates

## UX depth

Existing verifier: `cybercrow:verify`, `cybercrow-trust:verify`. Architecture Lab demonstrates security context panel with mock signals only.
