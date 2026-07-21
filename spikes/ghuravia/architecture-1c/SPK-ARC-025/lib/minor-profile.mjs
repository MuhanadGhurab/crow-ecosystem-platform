/**
 * GHURAVIA TECHNICAL SPIKE
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 *
 * Minor public profile: Crow identity + approved public artifacts only.
 */
export function createProfileProjection() {
  return {
    publicProfile(account) {
      const ageCategory = account.ageCategory; // e.g. MINOR | ADULT — not exact age
      const isMinor = ageCategory === 'MINOR';
      const crow = {
        crowHandle: account.crowHandle,
        crowDisplayName: account.crowDisplayName,
        publicAchievements: account.publicAchievements || [],
        approvedProgression: account.approvedProgression || [],
        sanitizedPublicEvidence: account.sanitizedPublicEvidence || [],
      };
      const prohibited = {
        exactAge: undefined,
        dateOfBirth: undefined,
        email: undefined,
        phone: undefined,
        legalName: undefined,
        preciseLocation: undefined,
        privateEvidence: undefined,
        trustSignals: undefined,
        moderationDetails: undefined,
        contactChannels: undefined,
        unrestrictedAdultContact: undefined,
      };
      if (!isMinor) {
        return {
          ...crow,
          // adults still must not leak private legal identity on public profile by default
          ...prohibited,
          ageCategory: undefined,
        };
      }
      // minors: stricter — no age category on public surface
      return { ...crow, ...prohibited, ageCategory: undefined, isMinorPublic: true };
    },
    assertNoPrivateLeak(publicView, privateAccount) {
      const leaks = [];
      const ban = [
        privateAccount.email,
        privateAccount.phone,
        privateAccount.legalName,
        privateAccount.dateOfBirth,
        privateAccount.exactAge != null ? String(privateAccount.exactAge) : null,
      ].filter(Boolean);
      const serialized = JSON.stringify(publicView);
      for (const b of ban) {
        if (serialized.includes(String(b))) leaks.push(b);
      }
      if (publicView.trustSignals != null) leaks.push('trustSignals');
      if (publicView.moderationDetails != null) leaks.push('moderationDetails');
      if (leaks.length) throw new Error(`PRIVATE_LEAK:${leaks.join(',')}`);
      return true;
    },
  };
}
