import type { PublicJourneyKind } from "./types";

export type PublicJourneyDefinition = {
  kind: PublicJourneyKind;
  title: string;
  subtitle: string;
  steps: readonly string[];
  ctaLabel: string;
};

export const PUBLIC_JOURNEY_DEFINITIONS: Record<PublicJourneyKind, PublicJourneyDefinition> = {
  NEW: {
    kind: "NEW",
    title: "Build a New Organization",
    subtitle: "Start from intent and grow into a governed operating tenant.",
    steps: [
      "Idea",
      "Purpose",
      "Essential responsibilities",
      "Lean Work Personas",
      "Core workflows",
      "Growth triggers",
    ],
    ctaLabel: "Start with a new organization",
  },
  TRANSFORM: {
    kind: "TRANSFORM",
    title: "Transform an Existing Organization",
    subtitle: "Map what exists, reduce friction, and transition to a target operating model.",
    steps: [
      "Current Operating Map",
      "Friction and risk",
      "Target Operating Blueprint",
      "Transition Blueprint",
    ],
    ctaLabel: "Start with transformation",
  },
};

export const TRADITIONAL_SOFTWARE_POINTS = [
  "Often starts with applications or modules",
  "Commonly organizes access through broad role structures",
  "May provide similar navigation to large groups",
  "Configures security around the application",
  "Produces a configured software instance",
  "May distribute work across multiple tools",
] as const;

export const CROW_APPROACH_POINTS = [
  "Begins with organizational intent",
  "Combines authoritative roles with Work Personas",
  "Uses SAREA to adapt permitted presentation",
  "Embeds CyberCrow trust into operating design",
  "Produces an approved Enterprise Blueprint",
  "Connects operations under one governed foundation",
] as const;
