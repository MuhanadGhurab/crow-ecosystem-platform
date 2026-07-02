/** Controlled interaction motion durations (ms). Respects prefers-reduced-motion via globals.css. */

export const PUBLIC_V2_MOTION = {
  button: 140,
  tab: 210,
  panel: 260,
  diagram: 350,
  routeDraw: 520,
} as const;

export const PUBLIC_V2_MOTION_CLASS = {
  button: "duration-[140ms]",
  tab: "duration-[210ms]",
  panel: "duration-[260ms]",
  diagram: "duration-[350ms]",
  routeDraw: "duration-[520ms]",
} as const;
