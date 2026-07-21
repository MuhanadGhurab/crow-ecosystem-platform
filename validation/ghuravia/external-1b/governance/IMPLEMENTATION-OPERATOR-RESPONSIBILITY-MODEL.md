# Implementation Operator Responsibility Model

| Operator responsibility | Boundary |
|---|---|
| Founder (RAVEN) | Owns gate evidence, local harness invocation, result review, and cleanup |
| Implementation operator | May act only after GHV.IMPLEMENTATION.0A; must preserve locked architecture and validation constraints |
| Security / legal / launch owners | Retain provider, compliance, pen-test, DR, and launch obligations |
| Deployment operator | Must not enable Preview or production while deployment blockers are open |

Operators must stop on missing synthetic-environment variables, failed validation, unexpected real data, non-redacted output, or any attempt to cross the local boundary.
