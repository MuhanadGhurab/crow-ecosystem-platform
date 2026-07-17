/**
 * CROW.PUBLIC.2 — public-safe journey URL builders (no state writes, no crow-story UI).
 */

import { routes } from "@/lib/routes";

import { publicRoutes } from "./routes";

export type PublicJourneyKind = "NEW" | "TRANSFORM";

export function journeyKindToUrlParam(journey: PublicJourneyKind): "new" | "transform" {
  return journey === "NEW" ? "new" : "transform";
}

export function buildRequestDestinationWithJourney(journey: PublicJourneyKind): string {
  const param = journeyKindToUrlParam(journey);
  return `${routes.client.requestNew}?journey=${param}`;
}

export function buildSignupHandoffUrl(journey: PublicJourneyKind): string {
  const param = journeyKindToUrlParam(journey);
  const next = encodeURIComponent(buildRequestDestinationWithJourney(journey));
  return `${routes.auth.signup}?journey=${param}&next=${next}`;
}

export function buildLoginHandoffUrl(journey: PublicJourneyKind): string {
  const param = journeyKindToUrlParam(journey);
  const next = encodeURIComponent(buildRequestDestinationWithJourney(journey));
  return `${routes.auth.login}?journey=${param}&next=${next}`;
}

export const PUBLIC_JOURNEY_PAGES: Record<
  PublicJourneyKind,
  { title: string; path: string; signupUrl: string }
> = {
  NEW: {
    title: "Build a New Organization",
    path: publicRoutes.newOrganization,
    signupUrl: buildSignupHandoffUrl("NEW"),
  },
  TRANSFORM: {
    title: "Transform an Existing Organization",
    path: publicRoutes.transformExisting,
    signupUrl: buildSignupHandoffUrl("TRANSFORM"),
  },
};
