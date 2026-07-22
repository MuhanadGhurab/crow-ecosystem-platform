import type { MessageKey } from "../../../lib/localization/messages";

export const CROW_OPTIONS: Array<{ id: string; labelKey: MessageKey }> = [
  { id: "crow.classic", labelKey: "optCrowClassic" },
  { id: "crow.rounded", labelKey: "optCrowRounded" },
];

export const COLOR_OPTIONS: Array<{ id: string; labelKey: MessageKey }> = [
  { id: "color.ink_sand", labelKey: "optColorInkSand" },
  { id: "color.dusk_teal", labelKey: "optColorDuskTeal" },
  { id: "color.ember_slate", labelKey: "optColorEmberSlate" },
];

export const STYLE_OPTIONS: Array<{ id: string; labelKey: MessageKey }> = [
  { id: "style.calm", labelKey: "optStyleCalm" },
  { id: "style.alert", labelKey: "optStyleAlert" },
  { id: "style.playful", labelKey: "optStylePlayful" },
];

export const ACCESSORY_OPTIONS: Array<{
  id: string;
  labelKey: MessageKey;
  locked?: boolean;
}> = [
  { id: "accessory.none", labelKey: "optAccessoryNone" },
  { id: "accessory.pattern_soft", labelKey: "optAccessoryPattern" },
  {
    id: "accessory.locked_later",
    labelKey: "optAccessoryLocked",
    locked: true,
  },
];

export const HABITAT_OPTIONS: Array<{
  id: string;
  labelKey: MessageKey;
  locked?: boolean;
}> = [
  { id: "habitat.coastal_shelf", labelKey: "optHabitatCoastal" },
  { id: "habitat.mountain_roost", labelKey: "optHabitatMountain" },
  { id: "habitat.city_antenna", labelKey: "optHabitatCity" },
  { id: "habitat.desert_wadi", labelKey: "optHabitatDesert" },
  { id: "habitat.locked_later", labelKey: "optHabitatLocked", locked: true },
];

export const CHARACTER_OPTIONS: Array<{
  id: string;
  labelKey: MessageKey;
  locked?: boolean;
}> = [
  { id: "character.curious_scout", labelKey: "optCharacterCurious" },
  { id: "character.steady_builder", labelKey: "optCharacterSteady" },
  { id: "character.careful_guardian", labelKey: "optCharacterCareful" },
  {
    id: "character.locked_later",
    labelKey: "optCharacterLocked",
    locked: true,
  },
];

export const REGION_OPTIONS: Array<{ id: string; labelKey: MessageKey }> = [
  { id: "region.gulf", labelKey: "optRegionGulf" },
  { id: "region.levant", labelKey: "optRegionLevant" },
  { id: "region.north_africa", labelKey: "optRegionNorthAfrica" },
  { id: "region.wider_mena", labelKey: "optRegionWiderMena" },
  { id: "region.global_other", labelKey: "optRegionGlobal" },
  { id: "region.prefer_not", labelKey: "optRegionPreferNot" },
];

export const EXPERIENCE_OPTIONS: Array<{ id: string; labelKey: MessageKey }> = [
  { id: "exp.exploring", labelKey: "optExpExploring" },
  { id: "exp.early_career", labelKey: "optExpEarlyCareer" },
  { id: "exp.switching", labelKey: "optExpSwitching" },
  { id: "exp.building", labelKey: "optExpBuilding" },
  { id: "exp.prefer_not", labelKey: "optExpPreferNot" },
];

export const GOAL_OPTIONS: Array<{ id: string; labelKey: MessageKey }> = [
  { id: "goal.foundations", labelKey: "optGoalFoundations" },
  { id: "goal.confidence", labelKey: "optGoalConfidence" },
  { id: "goal.explore_horizons", labelKey: "optGoalExplore" },
  { id: "goal.community", labelKey: "optGoalCommunity" },
  { id: "goal.prefer_not", labelKey: "optGoalPreferNot" },
];
