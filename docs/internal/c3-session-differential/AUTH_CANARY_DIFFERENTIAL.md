# Auth Canary A/B Differential (C3.7D)

Preview: https://crow-ecosystem-platform-bho2um0r2-muhanadghurabs-projects.vercel.app

| Signal | Path A — /auth-canary (Server Action) | Path B — /login/submit (Route Handler) |
| --- | --- | --- |
| Sign-in succeeded | true | true |
| Cookie names after sign-in | sb-wbwnsndcxrgyqwppurms-auth-token | sb-wbwnsndcxrgyqwppurms-auth-token |
| Cookie count | 1 | 1 |
| Server identity / landing OK | true | true |
| Hard reload OK | true | true |
| Final path after reload | /auth-canary/landing | /client |

## Classification

**Both paths pass — prior failure likely E2E isolation or deployment state**
