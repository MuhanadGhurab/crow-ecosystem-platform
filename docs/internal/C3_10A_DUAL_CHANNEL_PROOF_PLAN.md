# C3.10A — Dual-channel Preview proof plan (do not run yet)

Run only after Unifonic credentials, sender ID, and explicit live Preview authorization.

## Email/password path

1. Fresh account registration (when enabled)  
2. Legal acceptance (3 documents)  
3. Crow email OTP → email verified  
4. Enter phone → real SMS OTP  
5. Phone verified → ACTIVE generation 2  
6. Explicit sign-in  
7. `/account` loads  
8. Hard reload persists session  

## Google OAuth path

1. Google OAuth sign-in  
2. Verified provider-email evidence  
3. Legal acceptance (3 documents)  
4. Enter phone → real SMS OTP  
5. ACTIVE generation 2  
6. `/account` + hard reload  

## Verify both paths

- No automatic client role  
- No tenant membership  
- No admin / ProCrow / Business Portal access  
- Normal requester access only  

## C3.10B boundary

Use a **separate controlled test identity** for the live Preview proof. Do **not** use the product-owner designated Platform Owner email for disposable proof runs.

The designated owner account registers only after: live onboarding proof passes, legacy reset completes, generation-2 cutover is active, and registration opens for the controlled owner-enrollment window.

## Commands (when authorized)

```bash
npm run c3-dual-channel:hosted-live-verify
npm run c3-hosted-sms:verify
# future: c3-dual-channel:hosted-live-verify with live SMS flag
```
