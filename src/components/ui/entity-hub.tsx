"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { EntityId } from "@/lib/entity-theme";
import { ENTITY_THEME } from "@/lib/entity-theme";

export type EntityHubLink = {
  href: string;
  entity: EntityId;
  label?: string;
};

interface EntityHubProps {
  links: EntityHubLink[];
  className?: string;
}

export function EntityHub({ links, className = "" }: EntityHubProps) {
  const pathname = usePathname();

  if (links.length < 2) return null;

  return (
    <nav
      className={`cc-entity-hub ${className}`}
      aria-label="Platform engines"
    >
      {links.map((link) => {
        const theme = ENTITY_THEME[link.entity];
        const label = link.label ?? theme.shortLabel;
        const active =
          pathname === link.href ||
          (link.href.length > 1 && pathname.startsWith(link.href));

        return (
          <Link
            key={link.href}
            href={link.href}
            data-entity={link.entity}
            className={
              active
                ? `cc-entity-hub-link cc-entity-hub-link--active cc-entity-hub-link--${link.entity}`
                : `cc-entity-hub-link cc-entity-hub-link--${link.entity}`
            }
            aria-current={active ? "page" : undefined}
          >
            <span className="cc-entity-hub-dot" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
