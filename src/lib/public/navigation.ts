import { publicRoutes } from "@/lib/public/routes";

export type PublicSiteNavLink = {
  label: string;
  href: string;
  description?: string;
};

export type PublicSiteNavMenu = {
  label: string;
  items: readonly PublicSiteNavLink[];
};

export const PUBLIC_SITE_NAV = {
  platform: {
    label: "Platform",
    items: [
      { label: "Platform Overview", href: publicRoutes.platform.overview, description: "One governed foundation" },
      { label: "CEM", href: publicRoutes.platform.cem, description: "Operational work engine" },
      { label: "CyberCrow", href: publicRoutes.platform.cybercrow, description: "Operational trust" },
      { label: "SAREA", href: publicRoutes.platform.sarea, description: "Permitted presentation" },
      { label: "ProCrow", href: publicRoutes.platform.procrow, description: "Lifecycle governance" },
    ],
  } satisfies PublicSiteNavMenu,
  howCrowWorks: {
    label: "How Crow Works",
    href: publicRoutes.howCrowWorks,
  },
  enterpriseBlueprint: {
    label: "Enterprise Blueprint",
    href: publicRoutes.enterpriseBlueprint,
  },
  solutions: {
    label: "Solutions",
    items: [
      { label: "Build a New Organization", href: publicRoutes.newOrganization },
      { label: "Transform an Existing Organization", href: publicRoutes.transformExisting },
      { label: "Industries", href: publicRoutes.industries },
    ],
  } satisfies PublicSiteNavMenu,
  security: {
    label: "Security",
    href: publicRoutes.security,
  },
  startDesigning: {
    label: "Start Designing",
    items: [
      { label: "Build a New Organization", href: publicRoutes.newOrganization },
      { label: "Transform an Existing Organization", href: publicRoutes.transformExisting },
      { label: "Discuss Your Organization", href: publicRoutes.request },
    ],
  } satisfies PublicSiteNavMenu,
  signIn: {
    label: "Sign In",
    href: publicRoutes.login,
  },
} as const;

export const PUBLIC_SITE_FOOTER_LINKS: readonly { href: string; label: string }[] = [
  { href: publicRoutes.howCrowWorks, label: "How Crow Works" },
  { href: publicRoutes.newOrganization, label: "Build New" },
  { href: publicRoutes.transformExisting, label: "Transform Existing" },
  { href: publicRoutes.enterpriseBlueprint, label: "Enterprise Blueprint" },
  { href: publicRoutes.platform.overview, label: "Platform" },
  { href: publicRoutes.platform.cem, label: "CEM" },
  { href: publicRoutes.platform.cybercrow, label: "CyberCrow" },
  { href: publicRoutes.platform.sarea, label: "SAREA" },
  { href: publicRoutes.security, label: "Security" },
  { href: publicRoutes.industries, label: "Industries" },
  { href: publicRoutes.request, label: "Discuss Your Organization" },
  { href: publicRoutes.login, label: "Sign In" },
];
