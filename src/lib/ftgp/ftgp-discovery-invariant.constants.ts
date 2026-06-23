/** Domain invariant: entering UNDER_DISCOVERY atomically ensures one IN_PROGRESS profile. */
export const FTGP_UNDER_DISCOVERY_PROFILE_INVARIANT =
  "UNDER_DISCOVERY_REQUIRES_ONE_IN_PROGRESS_PROFILE" as const;

export type FtgpUnderDiscoveryProfileInvariant =
  typeof FTGP_UNDER_DISCOVERY_PROFILE_INVARIANT;

/** System sections written by audited transition plumbing — not client interview answers. */
export const FTGP_DISCOVERY_SYSTEM_ANSWER_SECTIONS = [
  "ftgp_lifecycle_audit",
  "org_intelligence",
] as const;

export const FTGP_DISCOVERY_CLIENT_ANSWER_SECTION = "client_discovery" as const;
