# SECURITY.md — GHURAVIA

## Supported versions

| Branch / surface | Supported |
|------------------|-----------|
| `main` (default) | Yes — after authorized merges |
| `feat/ghuravia-foundation` | Transition workspace — Product Code blocked |

## Reporting a vulnerability

**Do not** open public GitHub issues for security vulnerabilities.

Use **[GitHub Security Advisories](https://github.com/MuhanadGhurab/crow-ecosystem-platform/security/advisories/new)** on the connected repository, or contact maintainers via a **private** GitHub channel.

Include:

- Description of the issue
- Steps to reproduce
- Impact assessment (auth bypass, data exposure, secret leakage)

We will acknowledge within 7 days and work on remediation for confirmed issues.

## Transition safeguards

During the CyberCrow → GHURAVIA repository transition:

- Local `.env*` files must remain untracked
- No secret values in governance documents
- No Production or database changes without explicit owner authorization
- Legacy application code is recoverable only from the archive tag `cybercrow-final-snapshot-20260720`

## Before any Product Code lands

- [ ] `.env` is gitignored and never committed
- [ ] Example env files (if any) contain placeholders only
- [ ] No service role keys, payment keys, or API secrets in history of new commits
- [ ] Auth and tenant isolation designs reviewed in a dedicated security gate
