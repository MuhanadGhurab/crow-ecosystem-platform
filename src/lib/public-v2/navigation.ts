/** Preview-only navigation structure — scoped to public-v2 preview route. */

export type PublicV2NavLink = {
  label: string;
  href: string;
  description?: string;
};

export type PublicV2NavMenu = {
  label: string;
  items: readonly PublicV2NavLink[];
};

export const PUBLIC_V2_PRIMARY_NAV = {
  platform: {
    label: "Platform",
    items: [
      { label: "Platform Overview", href: "#public-v2-governed-foundation", description: "One governed foundation" },
      { label: "CEM", href: "#public-v2-governed-foundation", description: "Operational runtime" },
      { label: "CyberCrow", href: "#public-v2-governed-foundation", description: "Trust and evidence" },
      { label: "SAREA", href: "#public-v2-blueprint-to-workspace", description: "Permitted presentation" },
      { label: "ProCrow", href: "#public-v2-governed-foundation", description: "Lifecycle governance" },
    ],
  } satisfies PublicV2NavMenu,
  howCrowWorks: {
    label: "How Crow Works",
    href: "#public-v2-how-crow-works",
  },
  enterpriseBlueprint: {
    label: "Enterprise Blueprint",
    href: "#public-v2-blueprint-to-workspace",
  },
  solutions: {
    label: "Solutions",
    items: [
      { label: "Build a New Organization", href: "#public-v2-journey-new" },
      { label: "Transform an Existing Organization", href: "#public-v2-journey-transform" },
      { label: "Industries", href: "#public-v2-begins-differently" },
    ],
  } satisfies PublicV2NavMenu,
  security: {
    label: "Security",
    href: "#public-v2-governed-foundation",
  },
  startDesigning: {
    label: "Start Designing",
    items: [
      { label: "Build a New Organization", href: "#public-v2-journey-new" },
      { label: "Transform an Existing Organization", href: "#public-v2-journey-transform" },
      { label: "Discuss Your Organization", href: "/request" },
    ],
  } satisfies PublicV2NavMenu,
  signIn: {
    label: "Sign In",
    href: "/login",
  },
} as const;
