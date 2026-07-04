/**
 * CROW.PUBLIC.7 — premium semi-dark cyber/neon public visual identity.
 * Scoped to `.public-v2-shell.public-v2-bright` only; does not affect global site tokens.
 * Not the legacy starfield / near-black Crow shell.
 */

/** Test and documentation marker — public shell class name (historical). */
export const PUBLIC_V2_BRIGHT_IDENTITY_MARKER = "public-v2-bright" as const;

/** Governed colorful / neon palette marker (CSS custom properties). */
export const PUBLIC_V2_COLORFUL_IDENTITY_MARKER = "pv2-colorful-identity" as const;

/** CROW.PUBLIC.7 — semi-dark premium identity (not legacy black shell). */
export const PUBLIC_V2_SEMI_DARK_IDENTITY_MARKER = "pv2-semi-dark-identity" as const;

/** Teal neon — intelligence, active work, system clarity */
export const publicV2Teal = "#2dd4bf";
/** Gold neon — trust, readiness, approval */
export const publicV2Gold = "#f5b942";
/** Structural blue accent on dark surfaces */
export const publicV2Navy = "#6b9fd4";
/** Purple neon — organization, Blueprint, SAREA */
export const publicV2Purple = "#a78bfa";
/** Yellow highlight */
export const publicV2Yellow = "#fcd34d";

export const publicV2Background = "#131a28";
export const publicV2Surface = "#1c2538";
export const publicV2SurfaceRaised = "#222d42";
export const publicV2TextPrimary = "#e8edf5";
export const publicV2TextSecondary = "#b8c2d4";
/** @deprecated use publicV2Teal — alias retained for tests */
export const publicV2Cyan = publicV2Teal;
/** @deprecated use publicV2Purple */
export const publicV2Violet = publicV2Purple;
/** @deprecated use publicV2Gold */
export const publicV2Amber = publicV2Gold;
export const publicV2Border = "rgba(148, 163, 184, 0.18)";
export const publicV2Shadow =
  "0 1px 2px rgba(0, 0, 0, 0.35), 0 12px 36px rgba(0, 0, 0, 0.28)";
/** Journey / conversion CTA class — muted amber on semi-dark shell (CROW.PUBLIC.7). */
export const PUBLIC_V2_JOURNEY_CTA_CLASS = "pv2-btn-journey" as const;
