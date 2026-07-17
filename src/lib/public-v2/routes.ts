/** Public homepage v2 preview routes — certification-gated. */

export const PUBLIC_V2_PREVIEW_HOME = "/preview/public-home" as const;

export const PUBLIC_V2_SECTION_IDS = {
  hero: "public-v2-hero",
  beginsDifferently: "public-v2-begins-differently",
  howCrowWorks: "public-v2-how-crow-works",
  journeys: "public-v2-journeys",
  blueprintToWorkspace: "public-v2-blueprint-to-workspace",
  governedFoundation: "public-v2-governed-foundation",
  finalCta: "public-v2-final-cta",
  journeyNew: "public-v2-journey-new",
  journeyTransform: "public-v2-journey-transform",
} as const;

/** Canonical destinations — pending until dedicated pages ship. */
export const PUBLIC_V2_PENDING_DESTINATIONS = {
  newOrganization: "/new-organization",
  transformExisting: "/transform-existing",
} as const;

export function publicV2SectionHref(sectionId: string): string {
  return `${PUBLIC_V2_PREVIEW_HOME}#${sectionId}`;
}
