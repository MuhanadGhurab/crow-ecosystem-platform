"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CrowMark } from "@/components/public/brand/crow-mark";
import type { NavItem } from "@/components/ui/area-shell";
import { ShellNavLink } from "@/components/ui/shell-nav-link";
import type { EntityId } from "@/lib/entity-theme";

export function AreaShellMobileNav({
  nav,
  title,
  entity = "cem",
}: {
  nav: NavItem[];
  title: string;
  entity?: EntityId;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="cc-btn-secondary !min-h-[44px] !px-3 !py-2 lg:hidden"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="app-mobile-drawer"
      >
        Menu
      </button>

      {open && (
        <div
          id="app-mobile-drawer"
          className="cc-drawer-backdrop lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="App navigation"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <aside className="cc-drawer-panel">
            <div className="flex items-center justify-between border-b border-cyan-500/10 p-4">
              <CrowMark href="/" size="sm" showTagline={false} />
              <button
                type="button"
                className="cc-btn-secondary !min-h-[44px] !px-3 !py-2"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
            <p className="border-b border-cyan-500/10 px-4 py-3 font-display text-sm font-semibold text-white">
              {title}
            </p>
            <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
              {nav.map((item) => (
                <ShellNavLink key={item.href} href={item.href} label={item.label} entity={entity} />
              ))}
            </nav>
            <div className="border-t border-cyan-500/10 p-4">
              <Link
                href="/"
                className="text-sm text-cyan-400 hover:text-cyan-300"
                onClick={() => setOpen(false)}
              >
                ← Public site
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
