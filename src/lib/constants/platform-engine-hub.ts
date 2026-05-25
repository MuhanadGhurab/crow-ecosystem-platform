import type { EntityHubLink } from "@/components/ui/entity-hub";
import { routes } from "@/lib/routes";

/** Live tenant used for platform-admin engine shortcuts (MEEM lighthouse). */
export const PLATFORM_LIVE_TENANT_SLUG =
  process.env.PLATFORM_LIVE_TENANT_SLUG?.trim() || "meem-global";

export type PlatformEngineHubOptions = {
  tenantSlug?: string;
  /** Show Crow Admin Console link (default true). */
  includeAdmin?: boolean;
};

/** CEM · CyberCrow · SAREA (+ optional Admin) — platform staff navigation. */
export function buildPlatformEngineHubLinks(
  options: PlatformEngineHubOptions = {}
): EntityHubLink[] {
  const slug = options.tenantSlug ?? PLATFORM_LIVE_TENANT_SLUG;
  const tenant = routes.tenant(slug);
  const links: EntityHubLink[] = [];

  if (options.includeAdmin !== false) {
    links.push({ href: routes.admin.overview, entity: "cem", label: "Admin" });
  }

  links.push(
    { href: tenant.dashboard, entity: "cem", label: "CEM" },
    { href: tenant.cybercrow.dashboard, entity: "cybercrow" },
    { href: routes.sarea.overview, entity: "sarea" }
  );

  return links;
}

export const PLATFORM_ENGINE_HUB = {
  cem: (slug = PLATFORM_LIVE_TENANT_SLUG) => routes.tenant(slug).dashboard,
  cybercrow: (slug = PLATFORM_LIVE_TENANT_SLUG) => routes.tenant(slug).cybercrow.dashboard,
  sarea: routes.sarea.overview,
  admin: routes.admin.overview,
} as const;
