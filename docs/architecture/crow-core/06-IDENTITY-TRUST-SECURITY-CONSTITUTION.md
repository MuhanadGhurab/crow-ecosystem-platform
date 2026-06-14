# Identity, Trust & Security Constitution

Security spans **15 dimensions** beyond classical CIA:

1. Identification  
2. Authentication  
3. Authorization  
4. Accounting  
5. Authenticity  
6. Accountability  
7. Non-repudiation  
8. Privacy  
9. Cryptography  
10. Least privilege  
11. Separation of duties  
12. Session trust  
13. Evidence  
14. Assurance  
15. Resilience  

Contracts: `SecurityConstitution`, `SecuritySignal`, `SecurityControl` in `src/lib/crow-core/security/`.

## Actor separation

| Actor | May |
|-------|-----|
| Human | Full within RBAC |
| System | Automated policy enforcement |
| AI assistant | Advisory output only |
| Automation | Scheduled, pre-approved actions |

Government identity (Nafath, etc.) provides **identity assurance** — it does **not** grant Crow roles or tenant membership.

## CyberCrow non-claims

CyberCrow is **not** a SIEM, EDR, or autonomous SOC. It emits `SecuritySignal` → context → severity → recommended action → owner → evidence.

## RBAC

`Permission` and session checks remain the sole access gate. See `src/lib/portal/portal-access-contract.ts` and `requirePlatformConsole()` for ProCrow.
