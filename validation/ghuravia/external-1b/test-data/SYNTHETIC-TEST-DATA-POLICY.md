# Synthetic Test Data Policy

All validation fixtures must carry a `SYNTHETIC:` marker or an equivalent documented test marker. They must use `example.com` / `example.org` domains, non-routable sample addresses, and only synthetic process-environment credentials.

## Permitted fixtures

- Emails: `SYNTHETIC:user@example.com`.
- Phones: disabled placeholders or `+1555…` numbers only.
- Payments: fake tokens such as `SYNTHETIC:payment-token`; no card, bank, wallet, or processor data.
- Evidence: fabricated metadata, hashes, filenames, and scanner outcomes; never uploaded user material.
- Minors: synthetic roles and age bands only; no real names, identities, accounts, contact data, or parental records.

## Prohibited-data locks

Never copy production exports, support tickets, screenshots containing personal data, authentication tokens, government identifiers, real payment data, real user identities, or real evidence. Fixtures violating this policy must be deleted, reported, and replaced before execution.
