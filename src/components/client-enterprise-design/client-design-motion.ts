/** Shared motion timing tokens for client enterprise design journey. */

export const CLIENT_DESIGN_MOTION = {
  microMs: 140,
  stepMs: 220,
  workflowMs: 340,
  micro: "140ms",
  step: "220ms",
  workflow: "340ms",
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;

export const CLIENT_DESIGN_MOTION_VARS = {
  "--cd-motion-micro": CLIENT_DESIGN_MOTION.micro,
  "--cd-motion-step": CLIENT_DESIGN_MOTION.step,
  "--cd-motion-workflow": CLIENT_DESIGN_MOTION.workflow,
  "--cd-motion-ease": CLIENT_DESIGN_MOTION.easing,
} as const;

export function clientDesignMotionStyle(): React.CSSProperties {
  return CLIENT_DESIGN_MOTION_VARS as unknown as React.CSSProperties;
}
