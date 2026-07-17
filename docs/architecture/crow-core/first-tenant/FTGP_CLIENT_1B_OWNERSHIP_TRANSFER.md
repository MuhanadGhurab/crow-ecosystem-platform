# FTGP.CLIENT.1B — First-Client Ownership Transfer

**Phase:** FTGP.CLIENT.1B  
**Date:** 2026-06-23  
**Branch:** `feat/first-tenant-golden-path`  
**Verdict:** `READY — DESIGNATED FIRST CLIENT NOW OWNS CANDIDATE 07; READY FOR MANUAL DIRECT-DISCOVERY TEST`

---

## Transfer summary

| Field | Value |
|-------|--------|
| Request fingerprint | `9439dd8cc806696e` |
| Transfer type | `ATOMIC_CANDIDATE_OWNER_TRANSFER` |
| Previous owner fingerprint | `876863fe8c15c5c3` |
| Final owner fingerprint | `faf26007ce4a55b9` |
| Correlation ID | `ftgp-first-client-ownership-transfer-authoritative-v1` |

## Schema-level mutations (authorized)

| Table | Operation | Count |
|-------|-----------|------:|
| `implementation_requests` | `submittedByUserId` UPDATE | 1 |
| `platform_account_audit_events` | INSERT (`ownership_assigned`) | 1 |
| `platform_account_audit_events` | INSERT (`ownership_released`) | 1 |

## Preservation

| Check | Result |
|-------|--------|
| Former PlatformAccount preserved | **true** |
| Former Auth user preserved | **true** |
| Internal role grants | **0** |
| Tenant membership grants | **0** |
| Discovery writes | **0** |
| Auth metadata changes | **0** |
| ProCrow authority | **unchanged** |

## Manual test URL

```text
https://crow-ftgp-certification-2y3bvxnn7-muhanadghurabs-projects.vercel.app/login
```

Expected post-login: `/client/requests/{requestId}/discovery` (not `/access` gateway).
