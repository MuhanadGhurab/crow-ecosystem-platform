"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CrowMark } from "@/components/public/brand/crow-mark";
import type { AuthenticatedPortalCta } from "@/lib/auth/post-login-redirect";
import { routes } from "@/lib/routes";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/modules", label: "Modules" },
  { href: "/architecture", label: "Architecture" },
  { href: "/security", label: "Security" },
  { href: "/pricing", label: "Pricing" },
  { href: "/services", label: "Services" },
  { href: "/request", label: "Request" },
];

export function PublicHeaderNav({ portalCta }: { portalCta: AuthenticatedPortalCta | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-cc-deep/90 backdrop-blur-xl">
      <div className="cc-safe-x mx-auto flex max-w-6xl items-center justify-between gap-4 py-2.5 sm:py-3">
        <CrowMark href="/" size="sm" />

        <div className="flex items-center gap-2 md:hidden">
          {portalCta ? (
            <Link
              href={portalCta.href}
              className="min-h-[44px] px-2 text-sm font-medium text-teal-300"
            >
              {portalCta.label}
            </Link>
          ) : (
            <Link href={routes.auth.login} className="min-h-[44px] px-2 text-sm font-medium text-slate-400">
              Sign in
            </Link>
          )}
          <button
            type="button"
            className="cc-btn-secondary !min-h-[44px] !px-3 !py-2"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="public-mobile-menu"
          >
            Menu
          </button>
        </div>

        <nav className="hidden items-center gap-1 md:flex lg:gap-1.5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                pathname === item.href
                  ? "cc-nav-link-active !inline-flex"
                  : "cc-nav-link !inline-flex"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {portalCta ? (
            <Link
              href={portalCta.href}
              className="min-h-[44px] inline-flex items-center text-sm font-medium text-teal-300 transition hover:text-teal-200"
            >
              {portalCta.label}
            </Link>
          ) : (
            <Link
              href={routes.auth.login}
              className="min-h-[44px] inline-flex items-center text-sm font-medium text-slate-400 transition hover:text-white"
            >
              Sign in
            </Link>
          )}
          <Link href={routes.public.request} className="cc-btn-primary !py-2 text-sm">
            Start request
          </Link>
        </div>
      </div>

      {open && (
        <div
          id="public-mobile-menu"
          className="cc-drawer-backdrop md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <aside className="cc-drawer-panel">
            <div className="flex items-center justify-between border-b border-cyan-500/10 p-4">
              <CrowMark size="sm" showTagline={false} />
              <button
                type="button"
                className="cc-btn-secondary !min-h-[44px]"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    pathname === item.href
                      ? "cc-nav-link-active !flex"
                      : "cc-nav-link !flex"
                  }
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2 border-t border-cyan-500/10 p-4">
              {portalCta && (
                <Link
                  href={portalCta.href}
                  className="cc-btn-secondary text-center"
                  onClick={() => setOpen(false)}
                >
                  {portalCta.label}
                </Link>
              )}
              <Link href={routes.public.request} className="cc-btn-primary text-center" onClick={() => setOpen(false)}>
                Start request
              </Link>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
