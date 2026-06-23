/** Studio motion utilities — CSS-only; respects prefers-reduced-motion. */
export const studioMotion = {
  panelEnter: "studio-panel-enter motion-safe:animate-[studioFadeIn_220ms_ease-out]",
  tabTransition: "studio-tab-content motion-safe:transition-opacity motion-safe:duration-200",
  chipSelect: "motion-safe:transition-colors motion-safe:duration-150",
  connectorDraw: "studio-connector motion-safe:animate-[studioDraw_320ms_ease-out]",
  warningReveal: "studio-warning motion-safe:animate-[studioSlideUp_240ms_ease-out]",
  reducedMotion: "motion-reduce:transition-none motion-reduce:animate-none",
} as const;
