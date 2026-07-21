# GHV.IMPLEMENTATION.0A Acceptance Criteria

1. Explicit gate authorization precedes all Product Code.
2. Product workspace preserves `contracts -> domain -> web` dependency direction.
3. Local PostgreSQL and migration ownership use the validated patterns.
4. Secrets are injected through process environment only; no `.env` is committed.
5. Provider ports default to mocks and preserve fail-closed / no-delivery invariants.
6. Preview and production deployment remain disabled.
7. Every Product change adds tests, typechecking, and CI-ready quality evidence.

Passing this acceptance list does not authorize Preview, paid activation, or controlled launch.
