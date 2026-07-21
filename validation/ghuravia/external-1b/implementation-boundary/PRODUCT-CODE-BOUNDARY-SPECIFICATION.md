# Product Code Boundary Specification

Validation.1B artefacts are non-product harnesses only. They may validate local tooling, schema primitives, migrations, synthetic-secret injection, provider interfaces, and deployment guards.

They must not create product `apps/`, root `src/`, root `packages/`, root `package.json`, deployment workflows, providers, credentials, production settings, or user-facing features. Product Code authorization is **not granted by Validation.1B** and must be separately granted by GHV.IMPLEMENTATION.0A.
