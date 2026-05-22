/** Entity color systems — CEM, CyberCrow, SAREA */

export type EntityId = "cem" | "cybercrow" | "sarea";

export const ENTITY_THEME: Record<
  EntityId,
  {
    label: string;
    shortLabel: string;
    accent: string;
    accentMuted: string;
    glow: string;
    badgeClass: string;
    shellClass: string;
    heroGradient: string;
    statAccents: readonly ("cyan" | "star" | "teal" | "violet" | "rose" | "amber")[];
  }
> = {
  cem: {
    label: "Crow Enterprise Manager",
    shortLabel: "CEM",
    accent: "#22d3ee",
    accentMuted: "#14b8a6",
    glow: "rgba(34, 211, 238, 0.35)",
    badgeClass: "cc-entity-badge cc-entity-badge--cem",
    shellClass: "cc-entity-cem",
    heroGradient: "cc-hero-cem",
    statAccents: ["cyan", "teal", "cyan"],
  },
  cybercrow: {
    label: "CyberCrow",
    shortLabel: "CyberCrow",
    accent: "#8b5cf6",
    accentMuted: "#6366f1",
    glow: "rgba(139, 92, 246, 0.35)",
    badgeClass: "cc-entity-badge cc-entity-badge--cybercrow",
    shellClass: "cc-entity-cybercrow",
    heroGradient: "cc-hero-cybercrow",
    statAccents: ["violet", "violet", "star"],
  },
  sarea: {
    label: "SAREA",
    shortLabel: "SAREA",
    accent: "#fb7185",
    accentMuted: "#fbbf24",
    glow: "rgba(251, 113, 133, 0.3)",
    badgeClass: "cc-entity-badge cc-entity-badge--sarea",
    shellClass: "cc-entity-sarea",
    heroGradient: "cc-hero-sarea",
    statAccents: ["rose", "amber", "rose"],
  },
};

export function entityFromPath(pathname: string): EntityId {
  if (pathname.startsWith("/sarea")) return "sarea";
  if (pathname.includes("/cybercrow")) return "cybercrow";
  return "cem";
}
