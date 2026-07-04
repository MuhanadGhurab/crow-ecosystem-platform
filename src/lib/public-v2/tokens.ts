/**
 * CROW.PUBLIC.1B+5 — bright colorful public visual identity tokens.
 * Scoped to `.public-v2-shell.public-v2-bright` only; does not affect global site tokens.
 */

/** Test and documentation marker — bright identity active on public routes. */
export const PUBLIC_V2_BRIGHT_IDENTITY_MARKER = "public-v2-bright" as const;

/** CROW.PUBLIC.5 — governed colorful palette marker (CSS custom properties). */
export const PUBLIC_V2_COLORFUL_IDENTITY_MARKER = "pv2-colorful-identity" as const;

/** Teal — intelligence, active work, system clarity */
export const publicV2Teal = "#0d9488";
/** Gold — trust, readiness, approval, commercial confidence */
export const publicV2Gold = "#c9890a";
/** Dark blue — depth, enterprise foundation, navigation contrast */
export const publicV2Navy = "#1e3a5f";
/** Purple — organization, Blueprint, structure, SAREA */
export const publicV2Purple = "#7c3aed";
/** Yellow — selective highlight accents */
export const publicV2Yellow = "#ca8a04";

export const publicV2Background = "#f2ebe0";
export const publicV2Surface = "#fffcf7";
export const publicV2SurfaceRaised = "#fdf9f2";
export const publicV2TextPrimary = "#1a1814";
export const publicV2TextSecondary = "#44403c";
/** @deprecated use publicV2Teal — alias retained for tests */
export const publicV2Cyan = publicV2Teal;
/** @deprecated use publicV2Purple */
export const publicV2Violet = publicV2Purple;
/** @deprecated use publicV2Gold */
export const publicV2Amber = publicV2Gold;
export const publicV2Border = "#e0d6c8";
export const publicV2Shadow =
  "0 1px 2px rgba(30, 58, 95, 0.05), 0 8px 28px rgba(30, 58, 95, 0.08)";
export const publicV2Radius = "14px";
