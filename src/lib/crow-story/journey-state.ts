/** CROW.STORY.P1A — URL-first journey persistence (no PII). */

import { CLIENT_SCOPED_STORAGE_VERSION } from "@/lib/client-state/scoped-storage";
import { routes } from "@/lib/routes";
import type { JourneyKind, JourneyUrlValue, CrowStorySession } from "./types";

export const CROW_STORY_STORAGE_KEY = `${CLIENT_SCOPED_STORAGE_VERSION}:story-journey` as const;

export function journeyKindToUrl(journey: JourneyKind): JourneyUrlValue {
  return journey === "NEW" ? "new" : "transform";
}

export function parseJourneyUrlParam(raw: string | null | undefined): JourneyKind | null {
  const v = raw?.trim().toLowerCase();
  if (v === "new") return "NEW";
  if (v === "transform") return "TRANSFORM";
  return null;
}

export function readCrowStorySession(): CrowStorySession | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CROW_STORY_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      journey?: JourneyKind | JourneyUrlValue | null;
      committed?: boolean;
      chapterIndex?: number;
    };
    if (parsed && typeof parsed === "object") {
      const j =
        parsed.journey === "NEW" || parsed.journey === "TRANSFORM"
          ? parsed.journey
          : parseJourneyUrlParam(typeof parsed.journey === "string" ? parsed.journey : null);
      return {
        journey: j,
        committed: Boolean(parsed.committed),
        chapterIndex: typeof parsed.chapterIndex === "number" ? parsed.chapterIndex : 0,
      };
    }
  } catch {
    return null;
  }
  return null;
}

export function writeCrowStorySession(session: CrowStorySession): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(CROW_STORY_STORAGE_KEY, JSON.stringify(session));
}

export function clearCrowStoryState(): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(CROW_STORY_STORAGE_KEY);
}

/** URL overrides session when valid. */
export function resolveJourneyState(urlParam: string | null | undefined): CrowStorySession {
  const fromUrl = parseJourneyUrlParam(urlParam);
  const session = readCrowStorySession();
  const journey = fromUrl ?? session?.journey ?? null;
  return {
    journey,
    committed: session?.committed ?? false,
    chapterIndex: session?.chapterIndex ?? 0,
  };
}

export function persistSoftJourney(journey: JourneyKind, chapterIndex = 0): void {
  const existing = readCrowStorySession();
  writeCrowStorySession({
    journey,
    committed: existing?.committed ?? false,
    chapterIndex,
  });
}

export function persistCommittedJourney(journey: JourneyKind, chapterIndex = 0): void {
  writeCrowStorySession({ journey, committed: true, chapterIndex });
}

export function resetJourneySelection(): void {
  clearCrowStoryState();
}

export function journeyLabel(journey: JourneyKind): string {
  return journey === "NEW" ? "Designing something new" : "Transforming an existing organization";
}

export function buildRequestDestinationWithJourney(journey: JourneyKind): string {
  const param = journeyKindToUrl(journey);
  return `${routes.client.requestNew}?journey=${param}`;
}

export function buildSignupHandoffUrl(journey: JourneyKind): string {
  const param = journeyKindToUrl(journey);
  const next = encodeURIComponent(buildRequestDestinationWithJourney(journey));
  return `${routes.auth.signup}?journey=${param}&next=${next}`;
}

export function buildLoginHandoffUrl(journey: JourneyKind): string {
  const param = journeyKindToUrl(journey);
  const next = encodeURIComponent(buildRequestDestinationWithJourney(journey));
  return `${routes.auth.login}?journey=${param}&next=${next}`;
}

export function buildStoryUrlWithJourney(journey: JourneyKind | null): string {
  if (!journey) return routes.story.architectsMap;
  return `${routes.story.architectsMap}?journey=${journeyKindToUrl(journey)}`;
}

export function defaultOrganizationContextForJourney(journey: JourneyKind): string {
  return journey === "NEW" ? "NEW_BUSINESS" : "EXISTING_ORGANIZATION";
}
