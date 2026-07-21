# Data Ownership Architecture

| Field | Value |
|-------|-------|
| **Document ID** | GHV-ARCH-1C-DATA-OWN-001 |
| **Version** | 1.0.0 |
| **Status** | **DOMAIN ARCHITECTURE ACCEPTED** |
| **Owner** | Founder (RAVEN) |
| **Date** | 2026-07-21 |
| **Source Gate** | GHV.ARCHITECTURE.1C |

## 1. Ownership model

| Data class | Primary owner | Controller notes |
|------------|---------------|------------------|
| Account & activation | Identity domain | User subject; platform processor |
| Crow profile | Identity + user | User-directed public fields |
| Private legal identity | Identity (restricted) | Minimized collection |
| Learning progress | Learning domain | User benefit data |
| Progression events | Progression domain | Derived standing |
| Evidence metadata | Evidence domain | User-submitted |
| Evidence objects | Evidence domain (storage) | User content |
| Trust/moderation | Trust domain | Platform safety |
| Audit | Security/ops | Platform integrity |

## 2. Processor boundaries

Third-party adapters (IdP, email, storage, scanner) process data only under contract and least-scope credentials. Adapters do not own GHURAVIA domain records.

## 3. User rights (architectural hooks)

| Right | Mechanism |
|-------|-----------|
| Access | Authenticated reads scoped by AuthZ |
| Export | USER-DATA-EXPORT-ARCHITECTURE.md |
| Deletion | Cascading policy — **LEGAL VALIDATION REQUIRED** |
| Rectification | Profile + support path with audit |

## 4. Non-claims

```text
Legal basis for processing not defined here
Cross-border transfer rules not validated
```
