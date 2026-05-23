# Security policy

## Supported versions

| Version | Supported |
|---------|-----------|
| `main` (active development) | Yes |

## Reporting a vulnerability

**Do not** open public GitHub issues for security vulnerabilities.

Email the maintainer with:

- Description of the issue
- Steps to reproduce
- Impact assessment (tenant isolation, auth bypass, data exposure)

We will acknowledge within 7 days and work on remediation for confirmed issues.

## Public repository scope

This repository is a **curated public presentation**. It may not include all production deployment paths. Still report issues found in:

- Authentication and session handling
- Authorization / RBAC bypass
- Cross-tenant data leakage
- Secret exposure in committed files

## Before publishing (maintainers)

- [ ] `.env` is gitignored and never committed
- [ ] `.env.example` contains placeholders only
- [ ] No service role keys, Resend keys, or Stripe secrets in history
- [ ] Customer-specific docs (`docs/customers/`) excluded from public mirror
- [ ] Real request/blueprint IDs sanitized in public docs
- [ ] `AUTH_DISABLED` must not be `true` in production deployments

## Production hardening (private ops)

Full production checklist lives in private operational docs. Public readers should assume:

- `AUTH_DISABLED=false` in production
- `USE_MOCK_DATA=false` for go-live paths
- Microsoft Entra redirect URLs registered for production domain only
- Database URLs never point at `localhost` on cloud build hosts

See [`docs/internal/PUBLIC_GITHUB.md`](docs/internal/PUBLIC_GITHUB.md) for publish vs private split.
