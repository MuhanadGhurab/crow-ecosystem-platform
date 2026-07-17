# Threat Model Notes (lightweight)

## Assets

- User accounts / sessions
- Application data in Postgres (Prisma)
- Deployment configuration

## Top threats (product-level)

1. Account takeover via weak session handling
2. Dependency compromise
3. Misconfigured public environment variables
4. Unauthorized admin actions

## Mitigations in motion

- Auth and role checks in application code
- Env examples without live secrets
- Security policy for private reports

This is a living note, not a formal STRIDE certification.
