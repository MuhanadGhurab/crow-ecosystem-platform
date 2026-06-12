/**
 * Client Portal information architecture — primary task nav vs account/settings.
 * Aligns with A1 portal UX reset: requests, proposals, and onboarding first.
 */

import { routes } from "@/lib/routes";

export type ClientPortalNavItem = {
  href: string;
  label: string;
  description?: string;
};

/** Task-first surfaces — shown in the main portal chrome */
export const CLIENT_PORTAL_PRIMARY_NAV: readonly ClientPortalNavItem[] = [
  {
    href: routes.client.home,
    label: "Overview",
    description: "Next actions, journey, and account status",
  },
  {
    href: routes.client.requests,
    label: "Requests",
    description: "Enterprise requests, discovery, and blueprints",
  },
  {
    href: routes.client.proposals,
    label: "Proposals",
    description: "Commercial scope review and approval",
  },
  {
    href: routes.client.onboarding,
    label: "Onboarding",
    description: "Readiness checklist and go-live preparation",
  },
] as const;

/** Profile and configuration — secondary / overflow */
export const CLIENT_PORTAL_SECONDARY_NAV: readonly ClientPortalNavItem[] = [
  { href: routes.client.profile, label: "Profile", description: "Contact and sign-in details" },
  { href: routes.client.company, label: "Company", description: "Organization profile" },
  { href: routes.client.settings, label: "Settings", description: "Notifications and preferences" },
] as const;

export const CLIENT_PORTAL_UTILITY_LINKS = {
  workspaces: routes.access,
  newRequest: routes.public.request,
  legacyPortal: `${routes.portal.requests}?preview=client`,
  procrowConsole: routes.admin.overview,
} as const;

export function isClientPortalNavActive(href: string, pathname: string): boolean {
  const path = pathname.replace(/\/$/, "") || "/";

  if (href === routes.client.home) {
    return path === "/client";
  }

  if (href === routes.client.requests) {
    return path.startsWith("/client/requests") || path.startsWith("/client/blueprints");
  }

  return path === href || path.startsWith(`${href}/`);
}
