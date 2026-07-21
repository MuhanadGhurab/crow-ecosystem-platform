# Provider Mock Adequacy Matrix

| Mock | Local implementation | Downstream limitation |
|---|---|---|
| identity, enterprise-sso, government-federation | **SUFFICIENT FOR LOCAL IMPLEMENTATION** | Real login/federation blocks Preview/public paths |
| email, mobile, notifications | **SUFFICIENT FOR LOCAL IMPLEMENTATION** | Deliverability still requires sandbox |
| payments | **SUFFICIENT FOR LOCAL IMPLEMENTATION** | Payment sandbox required for paid activation |
| object-storage, malware-scan, secret-scan | **SUFFICIENT FOR LOCAL IMPLEMENTATION** | Real isolation/scanner benchmark required for evidence activation |
| kms | **SUFFICIENT FOR LOCAL IMPLEMENTATION** | Cloud KMS required for Preview/launch |
| realtime, search, observability | **SUFFICIENT FOR LOCAL IMPLEMENTATION** | Scale, Live Sky, and production telemetry remain blocked |

No mock is **INSUFFICIENT** for the defined local boundary. Product Code remains blocked pending the separate GHV.IMPLEMENTATION.0A gate; mocks do not grant it.
