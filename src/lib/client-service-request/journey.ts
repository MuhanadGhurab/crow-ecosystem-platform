/**
 * CROW.REQUEST.2 — JourneyKind on the request brief (notes JSON; no migration).
 * Distinct from OrganizationContextKind (NEW_BUSINESS / …).
 */

export type RequestJourneyKind = "NEW" | "TRANSFORM";

export const REQUEST_JOURNEY_KIND_LABELS: Record<RequestJourneyKind, string> = {
  NEW: "Build a new organization",
  TRANSFORM: "Transform an existing organization",
};

export function isRequestJourneyKind(value: unknown): value is RequestJourneyKind {
  return value === "NEW" || value === "TRANSFORM";
}

export function parseRequestJourneyKind(raw: string | null | undefined): RequestJourneyKind | null {
  const v = raw?.trim().toLowerCase();
  if (v === "new") return "NEW";
  if (v === "transform") return "TRANSFORM";
  return null;
}
