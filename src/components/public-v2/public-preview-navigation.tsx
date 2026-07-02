"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { CrowMark } from "@/components/public/brand/crow-mark";
import { PUBLIC_V2_PRIMARY_NAV } from "@/lib/public-v2/navigation";
import { PUBLIC_V2_PREVIEW_HOME } from "@/lib/public-v2/routes";
import { PUBLIC_V2_MOTION_CLASS } from "@/lib/public-v2/motion";

type MenuKey = "platform" | "solutions" | "startDesigning";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      aria-hidden
      className={`transition-transform ${PUBLIC_V2_MOTION_CLASS.button} ${open ? "rotate-180" : ""}`}
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function NavDropdown({
  menuKey,
  label,
  items,
  openMenu,
  onToggle,
  onClose,
}: {
  menuKey: MenuKey;
  label: string;
  items: readonly { label: string; href: string; description?: string }[];
  openMenu: MenuKey | null;
  onToggle: (key: MenuKey) => void;
  onClose: () => void;
}) {
  const buttonId = useId();
  const panelId = useId();
  const open = openMenu === menuKey;

  return (
    <div className="relative" onMouseLeave={onClose}>
      <button
        type="button"
        id={buttonId}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={panelId}
        className={`flex min-h-[44px] items-center gap-1 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/[0.04] hover:text-white ${PUBLIC_V2_MOTION_CLASS.button}`}
        onClick={() => onToggle(menuKey)}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
      >
        {label}
        <Chevron open={open} />
      </button>
      {open ? (
        <div
          id={panelId}
          role="menu"
          aria-labelledby={buttonId}
          className={`absolute left-0 top-full z-50 mt-1 min-w-[240px] rounded-xl border border-white/[0.1] bg-[#0a0f1a]/95 p-2 shadow-xl backdrop-blur-sm ${PUBLIC_V2_MOTION_CLASS.panel}`}
        >
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              role="menuitem"
              className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.05]"
              onClick={onClose}
            >
              <span className="block text-sm font-medium text-slate-100">{item.label}</span>
              {item.description ? (
                <span className="mt-0.5 block text-xs text-slate-500">{item.description}</span>
              ) : null}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function PublicPreviewNavigation() {
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<MenuKey | "none">("none");
  const navRef = useRef<HTMLElement>(null);

  const closeMenus = useCallback(() => {
    setOpenMenu(null);
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) closeMenus();
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [closeMenus]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenus();
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeMenus]);

  const toggleMenu = (key: MenuKey) => {
    setOpenMenu((prev) => (prev === key ? null : key));
  };

  const toggleMobileAccordion = (key: MenuKey) => {
    setMobileAccordion((prev) => (prev === key ? "none" : key));
  };

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#04060c]/90 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <CrowMark href={PUBLIC_V2_PREVIEW_HOME} size="sm" showTagline={false} />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Public homepage preview">
          <NavDropdown
            menuKey="platform"
            label={PUBLIC_V2_PRIMARY_NAV.platform.label}
            items={PUBLIC_V2_PRIMARY_NAV.platform.items}
            openMenu={openMenu}
            onToggle={toggleMenu}
            onClose={closeMenus}
          />
          <Link
            href={PUBLIC_V2_PRIMARY_NAV.howCrowWorks.href}
            className={`min-h-[44px] rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/[0.04] hover:text-white ${PUBLIC_V2_MOTION_CLASS.button}`}
          >
            {PUBLIC_V2_PRIMARY_NAV.howCrowWorks.label}
          </Link>
          <Link
            href={PUBLIC_V2_PRIMARY_NAV.enterpriseBlueprint.href}
            className={`min-h-[44px] rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/[0.04] hover:text-white ${PUBLIC_V2_MOTION_CLASS.button}`}
          >
            {PUBLIC_V2_PRIMARY_NAV.enterpriseBlueprint.label}
          </Link>
          <NavDropdown
            menuKey="solutions"
            label={PUBLIC_V2_PRIMARY_NAV.solutions.label}
            items={PUBLIC_V2_PRIMARY_NAV.solutions.items}
            openMenu={openMenu}
            onToggle={toggleMenu}
            onClose={closeMenus}
          />
          <Link
            href={PUBLIC_V2_PRIMARY_NAV.security.href}
            className={`min-h-[44px] rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/[0.04] hover:text-white ${PUBLIC_V2_MOTION_CLASS.button}`}
          >
            {PUBLIC_V2_PRIMARY_NAV.security.label}
          </Link>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <NavDropdown
            menuKey="startDesigning"
            label={PUBLIC_V2_PRIMARY_NAV.startDesigning.label}
            items={PUBLIC_V2_PRIMARY_NAV.startDesigning.items}
            openMenu={openMenu}
            onToggle={toggleMenu}
            onClose={closeMenus}
          />
          <Link
            href={PUBLIC_V2_PRIMARY_NAV.signIn.href}
            className={`min-h-[44px] rounded-lg border border-white/[0.12] px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-cyan-500/30 hover:bg-white/[0.03] ${PUBLIC_V2_MOTION_CLASS.button}`}
          >
            {PUBLIC_V2_PRIMARY_NAV.signIn.label}
          </Link>
        </div>

        <button
          type="button"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-white/[0.1] text-slate-300 lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="public-v2-mobile-nav"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
            {mobileOpen ? (
              <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.5" />
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen ? (
        <nav
          id="public-v2-mobile-nav"
          className="border-t border-white/[0.06] px-4 py-4 lg:hidden"
          aria-label="Mobile preview navigation"
        >
          <div className="flex flex-col gap-1">
            <button
              type="button"
              className="flex min-h-[44px] w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-200"
              aria-expanded={mobileAccordion === "platform"}
              onClick={() => toggleMobileAccordion("platform")}
            >
              Platform
              <Chevron open={mobileAccordion === "platform"} />
            </button>
            {mobileAccordion === "platform"
              ? PUBLIC_V2_PRIMARY_NAV.platform.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="min-h-[44px] rounded-lg py-2 pl-6 pr-3 text-sm text-slate-400"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))
              : null}

            <Link
              href={PUBLIC_V2_PRIMARY_NAV.howCrowWorks.href}
              className="min-h-[44px] rounded-lg px-3 py-2 text-sm text-slate-200"
              onClick={() => setMobileOpen(false)}
            >
              How Crow Works
            </Link>
            <Link
              href={PUBLIC_V2_PRIMARY_NAV.enterpriseBlueprint.href}
              className="min-h-[44px] rounded-lg px-3 py-2 text-sm text-slate-200"
              onClick={() => setMobileOpen(false)}
            >
              Enterprise Blueprint
            </Link>

            <button
              type="button"
              className="flex min-h-[44px] w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-200"
              aria-expanded={mobileAccordion === "solutions"}
              onClick={() => toggleMobileAccordion("solutions")}
            >
              Solutions
              <Chevron open={mobileAccordion === "solutions"} />
            </button>
            {mobileAccordion === "solutions"
              ? PUBLIC_V2_PRIMARY_NAV.solutions.items.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="min-h-[44px] rounded-lg py-2 pl-6 pr-3 text-sm text-slate-400"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))
              : null}

            <Link
              href={PUBLIC_V2_PRIMARY_NAV.security.href}
              className="min-h-[44px] rounded-lg px-3 py-2 text-sm text-slate-200"
              onClick={() => setMobileOpen(false)}
            >
              Security
            </Link>
            <Link
              href={PUBLIC_V2_PRIMARY_NAV.signIn.href}
              className="min-h-[44px] rounded-lg px-3 py-2 text-sm text-slate-200"
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="#public-v2-journey-new"
              className="mt-2 min-h-[44px] rounded-lg bg-cyan-500/15 px-3 py-2 text-center text-sm font-medium text-cyan-100"
              onClick={() => setMobileOpen(false)}
            >
              Start Designing
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
