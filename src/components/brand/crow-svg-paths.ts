/**
 * Canonical Crow / CyberCrow armored profile geometry.
 * Side-profile crow facing right — angular overlapping plates, slit eye, hooked beak.
 * Single source for hero, loader, nav mark, and motion variants.
 */

export type CrowArmorPlateFill =
  | "highlight"
  | "mid"
  | "shadow"
  | "deep"
  | "beak"
  | "beakHighlight"
  | "eye";

export type CrowArmorPlate = {
  id: string;
  d: string;
  fill: CrowArmorPlateFill;
};

/** Layered armored plates (back → front paint order). */
export const CROW_ARMOR_PLATES: CrowArmorPlate[] = [
  {
    id: "neck-deep",
    d: "M 20 128 L 34 118 L 44 138 L 30 152 L 14 142 Z",
    fill: "deep",
  },
  {
    id: "neck-mid",
    d: "M 28 108 L 48 98 L 58 118 L 44 132 L 26 124 Z",
    fill: "shadow",
  },
  {
    id: "neck-plate",
    d: "M 36 92 L 54 86 L 64 104 L 50 118 L 34 110 Z",
    fill: "mid",
  },
  {
    id: "crown-back",
    d: "M 24 96 L 18 70 L 34 44 L 54 34 L 70 40 L 76 56 L 62 62 L 44 54 L 30 74 Z",
    fill: "deep",
  },
  {
    id: "crown-mid",
    d: "M 30 74 L 44 54 L 62 62 L 78 74 L 72 90 L 54 84 L 38 88 Z",
    fill: "shadow",
  },
  {
    id: "crown-highlight",
    d: "M 34 44 L 54 34 L 68 38 L 62 52 L 48 48 L 36 58 Z",
    fill: "highlight",
  },
  {
    id: "skull",
    d: "M 72 90 L 78 74 L 96 72 L 108 82 L 102 98 L 86 96 Z",
    fill: "mid",
  },
  {
    id: "cheek",
    d: "M 54 84 L 72 90 L 86 96 L 90 112 L 74 120 L 58 112 Z",
    fill: "shadow",
  },
  {
    id: "beak-body",
    d: "M 102 98 L 108 82 L 126 84 L 172 88 L 176 96 L 158 102 L 118 104 Z",
    fill: "beak",
  },
  {
    id: "beak-highlight",
    d: "M 108 82 L 126 84 L 170 86 L 164 82 L 124 78 L 110 76 Z",
    fill: "beakHighlight",
  },
  {
    id: "eye-slit",
    d: "M 86 76 L 104 74 L 106 78 L 88 80 Z",
    fill: "eye",
  },
];

/** Outer silhouette for outline / motion stroke (armored profile). */
export const CROW_MOTION_OUTLINE_PATH =
  "M 14 142 L 30 152 L 44 138 L 58 118 L 90 112 L 86 96 L 102 98 L 118 104 L 158 102 L 176 96 L 172 88 L 126 84 L 108 82 L 96 72 L 78 74 L 76 56 L 70 40 L 54 34 L 34 44 L 18 70 L 24 96 L 14 142 Z";

export const CROW_OUTLINE_PATH = CROW_MOTION_OUTLINE_PATH;

/** @deprecated Use CROW_ARMOR_PLATES — kept for import stability in tests. */
export const CROW_PROFILE_PATH = CROW_MOTION_OUTLINE_PATH;

/** @deprecated Armored mark uses plate stack, not separate beak path. */
export const CROW_BEAK_PATH = CROW_ARMOR_PLATES.find((p) => p.id === "beak-body")?.d ?? "";

/** @deprecated Armored mark uses plate stack, not separate crown path. */
export const CROW_CROWN_PATH = CROW_ARMOR_PLATES.find((p) => p.id === "crown-highlight")?.d ?? "";

/** Slit eye geometry (horizontal glowing bar). */
export const CROW_EYE_SLIT = CROW_ARMOR_PLATES.find((p) => p.id === "eye-slit")?.d ?? "";

/** @deprecated Circle eye replaced by slit — use CROW_EYE_SLIT. */
export const CROW_EYE = { cx: 95, cy: 77, r: 0 };

export const CROW_NETWORK_NODES: { cx: number; cy: number; r: number }[] = [
  { cx: 52, cy: 58, r: 2.2 },
  { cx: 78, cy: 48, r: 1.8 },
  { cx: 118, cy: 72, r: 2 },
  { cx: 148, cy: 90, r: 1.6 },
  { cx: 64, cy: 108, r: 1.8 },
];

export const CROW_NETWORK_LINES: [number, number, number, number][] = [
  [52, 58, 78, 48],
  [78, 48, 118, 72],
  [118, 72, 148, 90],
  [52, 58, 64, 108],
  [64, 108, 118, 72],
];

/** Shared SVG viewBox for hero network overlay and mark alignment. */
export const CROW_VIEWBOX = "0 0 200 180";

/** Network edge indices into {@link CROW_NETWORK_NODES} (pairs with CROW_NETWORK_LINES). */
export const CROW_NETWORK_EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [0, 4],
  [4, 2],
];
