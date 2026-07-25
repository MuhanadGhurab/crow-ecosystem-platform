import type { WorldState } from "./types";
import { WORLD_DIMENSIONS } from "./types";

/** Deterministic FNV-1a 32-bit hex — isomorphic, no Node crypto. */
export function fnv1aHex(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function clampWorld(world: WorldState): WorldState {
  const next = { ...world };
  for (const dim of WORLD_DIMENSIONS) {
    const v = next[dim];
    next[dim] = Math.max(0, Math.min(100, Math.round(v)));
  }
  return next;
}

export function applyWorldDelta(
  world: WorldState,
  delta: Partial<WorldState>,
): WorldState {
  const next = { ...world };
  for (const dim of WORLD_DIMENSIONS) {
    if (delta[dim] !== undefined) {
      next[dim] = world[dim] + (delta[dim] as number);
    }
  }
  return clampWorld(next);
}

export function hashWorldState(world: WorldState): string {
  const ordered = WORLD_DIMENSIONS.map((d) => `${d}:${world[d]}`).join("|");
  return fnv1aHex(ordered);
}

export function bandLabel(value: number): "LOW" | "MODERATE" | "HIGH" {
  if (value < 34) return "LOW";
  if (value < 67) return "MODERATE";
  return "HIGH";
}
