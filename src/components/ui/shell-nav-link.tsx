"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { EntityId } from "@/lib/entity-theme";

export function ShellNavLink({
  href,
  label,
  entity: _entity,
}: {
  href: string;
  label: string;
  entity?: EntityId;
}) {
  const pathname = usePathname();
  const active =
    pathname === href ||
    (href.length > 1 && pathname.startsWith(href) && href !== "/");

  return (
    <Link
      href={href}
      className={`whitespace-nowrap ${active ? "cc-nav-link-active" : "cc-nav-link"}`}
    >
      {label}
    </Link>
  );
}
