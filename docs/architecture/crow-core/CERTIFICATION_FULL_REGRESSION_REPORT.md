# Certification Full Regression Report (CROW.CERT.1)

**Status:** PASS · **FAILED_REQUIRED_GATE_COUNT=0** · **SKIPPED_REQUIRED_GATE_COUNT=0**

## Executed gates (all PASS)

| Gate | Result |
|------|--------|
| business-field-catalog:test | PASS |
| business-field-search-relevance:test | PASS |
| uat-readiness:test | PASS |
| certification-release-readiness:test | PASS |
| client-service-request:test | PASS |
| client-quick-intake:test | PASS |
| client-loading-feedback:test | PASS |
| client-enterprise-design:* | PASS |
| blueprint-1b-migration:verify | PASS |
| blueprint-engine-design:test | PASS |
| blueprint-engine-1b:containment:test | PASS |
| model-forge:1–4 | PASS |
| tenant-composition:test | PASS |
| ftgp-first-client:* | PASS |
| procrow-owner-admin:* | PASS |
| procrow-access-card:test | PASS |
| metadata-crow-role-classification:test | PASS |
| ftgp-authority-boundaries:test | PASS |
| ftgp-discovery-readiness:test | PASS |
| cloud-data-api-containment:verify | PASS |
| cloud-1e-post-apply:verify | PASS |
| request-baseline-invariants:verify | PASS |
| typecheck | PASS |
| lint | PASS |
| build-memory:verify | PASS |
| npm run build | PASS |

## Not applicable (with evidence)

| Gate | Reason |
|------|--------|
| client-enterprise-design-persistence:test | Script not defined in `package.json`; persistence covered by `client-enterprise-design:test` + route verify |

## Physical device

`OWNER_PHYSICAL_DEVICE_TEST_REQUIRED` — not a code gap; owner iPad test pending.
