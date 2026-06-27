/** Friendly team-size ranges for normal client intake (CROW.DISCOVERY.2B). */

export type ClientTeamSizeRange =
  | "JUST_ME"
  | "TEAM_2_5"
  | "TEAM_6_15"
  | "TEAM_16_50"
  | "TEAM_51_200"
  | "TEAM_201_500"
  | "TEAM_500_PLUS"
  | "NOT_SURE";

export type ClientGrowthIntention =
  | "STAY_SAME"
  | "GROW_GRADUALLY"
  | "GROW_QUICKLY"
  | "NOT_SURE";

export const CLIENT_TEAM_SIZE_OPTIONS: ReadonlyArray<{
  key: ClientTeamSizeRange;
  label: string;
  mapsToCurrentScale: string;
}> = [
  { key: "JUST_ME", label: "Just me", mapsToCurrentScale: "SOLO" },
  { key: "TEAM_2_5", label: "2–5", mapsToCurrentScale: "MICRO" },
  { key: "TEAM_6_15", label: "6–15", mapsToCurrentScale: "SMALL_TEAM" },
  { key: "TEAM_16_50", label: "16–50", mapsToCurrentScale: "GROWING_ORGANIZATION" },
  { key: "TEAM_51_200", label: "51–200", mapsToCurrentScale: "GROWING_ORGANIZATION" },
  { key: "TEAM_201_500", label: "201–500", mapsToCurrentScale: "ENTERPRISE" },
  { key: "TEAM_500_PLUS", label: "500+", mapsToCurrentScale: "ENTERPRISE" },
  { key: "NOT_SURE", label: "Not sure yet", mapsToCurrentScale: "SMALL_TEAM" },
];

export const CLIENT_GROWTH_INTENTION_OPTIONS: ReadonlyArray<{
  key: ClientGrowthIntention;
  label: string;
  mapsToTargetScale: string;
}> = [
  { key: "STAY_SAME", label: "Stay approximately the same", mapsToTargetScale: "SMALL_TEAM" },
  { key: "GROW_GRADUALLY", label: "Grow gradually", mapsToTargetScale: "GROWING_ORGANIZATION" },
  { key: "GROW_QUICKLY", label: "Grow quickly", mapsToTargetScale: "MULTI_BRANCH" },
  { key: "NOT_SURE", label: "Not sure", mapsToTargetScale: "GROWING_ORGANIZATION" },
];

export function teamSizeToCurrentScale(range: ClientTeamSizeRange | null): string {
  return CLIENT_TEAM_SIZE_OPTIONS.find((o) => o.key === range)?.mapsToCurrentScale ?? "SMALL_TEAM";
}

export function growthToTargetScale(intention: ClientGrowthIntention | null): string {
  return CLIENT_GROWTH_INTENTION_OPTIONS.find((o) => o.key === intention)?.mapsToTargetScale ?? "GROWING_ORGANIZATION";
}
