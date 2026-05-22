"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ScrollChipNav } from "@/components/ui/scroll-chip-nav";

export type SubNavItem = { href: string; label: string };

interface ModuleSubNavProps {
  title: string;
  subtitle: string;
  items: SubNavItem[];
  variant?: "default" | "cybercrow" | "sarea";
}

export function ModuleSubNav({
  title,
  subtitle,
  items,
  variant = "default",
}: ModuleSubNavProps) {
  const pathname = usePathname();
  const panelClass =
    variant === "cybercrow"
      ? "cc-subnav-panel cc-subnav-panel--cybercrow cc-entity-cybercrow"
      : variant === "sarea"
        ? "cc-subnav-panel cc-subnav-panel--sarea cc-entity-sarea"
        : "cc-subnav-panel";

  const titleClass =
    variant === "cybercrow"
      ? "text-violet-400"
      : variant === "sarea"
        ? "text-rose-400"
        : "text-cyan-400";

  return (
    <div className={panelClass}>
      <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${titleClass}`}>{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-slate-400">{subtitle}</p>
      <ScrollChipNav className="mt-4 !px-0 !pb-0" aria-label={title}>
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? "cc-subnav-link-active" : "cc-subnav-link"}
            >
              {item.label}
            </Link>
          );
        })}
      </ScrollChipNav>
    </div>
  );
}
