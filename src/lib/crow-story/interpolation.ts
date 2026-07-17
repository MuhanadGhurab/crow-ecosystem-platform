/** CROW.STORY.VISUAL.1 — deterministic interpolation primitives (pure). */

export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t);
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  if (inMax === inMin) return outMin;
  const t = clamp((value - inMin) / (inMax - inMin));
  return lerp(outMin, outMax, t);
}

export function progressInRange(progress: number, start: number, end: number): number {
  return mapRange(progress, start, end, 0, 1);
}

export function applyEasing(t: number, curve: "easeOut" | "easeInOut" | "linear" = "easeOut"): number {
  const x = clamp(t);
  switch (curve) {
    case "linear":
      return x;
    case "easeInOut":
      return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
    case "easeOut":
    default:
      return 1 - Math.pow(1 - x, 3);
  }
}

export type Keyframe<T> = { at: number; value: T };

export function interpolateKeyframes(
  progress: number,
  keyframes: Keyframe<number>[],
  easing: "easeOut" | "easeInOut" | "linear" = "easeOut",
): number {
  if (keyframes.length === 0) return 0;
  if (keyframes.length === 1) return keyframes[0]!.value;
  const sorted = [...keyframes].sort((a, b) => a.at - b.at);
  if (progress <= sorted[0]!.at) return sorted[0]!.value;
  const last = sorted[sorted.length - 1]!;
  if (progress >= last.at) return last.value;
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i]!;
    const b = sorted[i + 1]!;
    if (progress >= a.at && progress <= b.at) {
      const local = mapRange(progress, a.at, b.at, 0, 1);
      return lerp(a.value, b.value, applyEasing(local, easing));
    }
  }
  return last.value;
}

export type Point2 = { x: number; y: number };

export function interpolatePosition(
  progress: number,
  keyframes: Keyframe<Point2>[],
  easing: "easeOut" | "easeInOut" | "linear" = "easeOut",
): Point2 {
  if (keyframes.length === 0) return { x: 0, y: 0 };
  if (keyframes.length === 1) return keyframes[0]!.value;
  const sorted = [...keyframes].sort((a, b) => a.at - b.at);
  if (progress <= sorted[0]!.at) return sorted[0]!.value;
  const last = sorted[sorted.length - 1]!;
  if (progress >= last.at) return last.value;
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i]!;
    const b = sorted[i + 1]!;
    if (progress >= a.at && progress <= b.at) {
      const local = applyEasing(mapRange(progress, a.at, b.at, 0, 1), easing);
      return { x: lerp(a.value.x, b.value.x, local), y: lerp(a.value.y, b.value.y, local) };
    }
  }
  return last.value;
}

/** Quadratic Bézier point sampling (t 0–1). */
export function quadraticBezierPoint(
  t: number,
  p0: Point2,
  p1: Point2,
  p2: Point2,
): Point2 {
  const u = clamp(t);
  const inv = 1 - u;
  return {
    x: inv * inv * p0.x + 2 * inv * u * p1.x + u * u * p2.x,
    y: inv * inv * p0.y + 2 * inv * u * p1.y + u * u * p2.y,
  };
}

/** Sample position along SVG path `d` by normalized length (approximate via segment lerp). */
export function sampleWorkflowPath(progress: number): Point2 {
  const t = clamp(progress);
  const points: Point2[] = [
    { x: 360, y: 520 },
    { x: 480, y: 460 },
    { x: 600, y: 420 },
    { x: 720, y: 400 },
    { x: 840, y: 380 },
  ];
  const seg = t * (points.length - 1);
  const i = Math.floor(seg);
  const f = seg - i;
  if (i >= points.length - 1) return points[points.length - 1]!;
  return {
    x: lerp(points[i]!.x, points[i + 1]!.x, f),
    y: lerp(points[i]!.y, points[i + 1]!.y, f),
  };
}

export const STORY_WORKFLOW_PATH_D =
  "M 360 520 L 480 460 L 600 420 L 720 400 L 840 380";
