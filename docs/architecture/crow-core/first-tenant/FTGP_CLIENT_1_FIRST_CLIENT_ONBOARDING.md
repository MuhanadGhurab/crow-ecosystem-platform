# FTGP.CLIENT.1 — First-Client Email Designation & Direct Discovery Routing

**Phase:** FTGP.CLIENT.1  
**Branch:** `feat/first-tenant-golden-path`  
**Candidate:** `FTGP-REQUEST-CANDIDATE-07` (`9439dd8cc806696e`)

---

## 1. Operator workflow

1. Copy `.env.ftgp-first-client.operator.example` → `.env.ftgp-first-client.operator` (gitignored).
2. Enter personal Gmail in `FTGP_FIRST_CLIENT_EMAIL` (never commit).
3. Run `npm run ftgp-first-client:designate` (zero writes).
4. If `NOT_ENROLLED` or `LEGAL_REQUIRED`: owner signs in on certification `/login`, accepts legal documents manually, rerun designate.
5. Set `FTGP_FIRST_CLIENT_OWNERSHIP_TRANSFER_AUTHORIZED=true` when ready.
6. Run `npm run ftgp-first-client:ownership:dry-run`.
7. Run `npm run ftgp-first-client:ownership:execute`.
8. Run `npm run ftgp-first-client:verify`.

---

## 2. Authority model

```text
operator Gmail (designation input only)
→ verified Google identity
→ PlatformAccount
→ submittedByUserId ownership
→ client routes
```

Runtime never reads operator email. No internal roles (`CLIENT`, `CUSTOMER`, `REQUESTER`) are granted.

---

## 3. Post-auth routing (client-only)

When an account has request ownership, zero internal roles, and zero tenant memberships:

| Condition | Destination |
|-----------|-------------|
| One `UNDER_DISCOVERY` request with `IN_PROGRESS` profile | `/client/requests/{id}/discovery` |
| Multiple owned requests | `/client/requests` |
| One owned request, other lifecycle | `/client/requests/{id}` |
| No owned requests | `/account` |

`/access` redirects client-only accounts to the canonical lifecycle destination (no multi-platform gateway).

---

## 4. Commands

| Command | Writes |
|---------|--------|
| `ftgp-first-client:designate` | 0 |
| `ftgp-first-client:ownership:dry-run` | 0 |
| `ftgp-first-client:ownership:execute` | ownership + audit |
| `ftgp-first-client:verify` | 0 |
| `ftgp-first-client:test` | 0 |

Artifact: `.ftgp-first-client-designation.local.json` (gitignored, fingerprints only).

---

## 5. Identity separation

Designated first client must not equal ProCrow owner-admin (`832287cbd374fb83`) or any account with active internal roles.

---

## 6. Discovery preservation

Ownership transfer does not mutate Discovery answers, profile completion, or Blueprint state.
