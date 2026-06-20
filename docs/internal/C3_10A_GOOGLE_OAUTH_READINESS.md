# C3.10A — Google OAuth readiness checklist (do not enable yet)

- [ ] Google Cloud OAuth client configured  
- [ ] Supabase Google provider enabled with matching client ID/secret  
- [ ] Preview callback URL matches current Preview deployment  
- [ ] Production callback URL preserved unchanged  
- [ ] Client secret stored in Vercel only (never in repo)  
- [ ] `email_verified` claim required before trusting provider email  
- [ ] Provider collision handling (one Supabase user ↔ one PlatformAccount)  
- [ ] Post-OAuth onboarding redirect (legal → phone; never skip phone)  
- [ ] Legal and phone verification cannot be bypassed via OAuth metadata  

Static checks: `npm run c3-dual-channel:verify` (OAuth/OTP boundary tests).

Enable Google OAuth on Preview only after separate product-owner authorization.
