"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CrowMark } from "@/components/public/brand/crow-mark";
import type { AuthenticatedPortalCta } from "@/lib/auth/post-login-redirect";
import { routes } from "@/lib/routes";

/** Primary links — kept short like No Hesi's top bar */
const PRIMARY_NAV = [
  { href: "/about", label: "About" },
  { href: "/modules", label: "Modules" },
  { href: "/pricing", label: "Pricing" },
  { href: "/request", label: "Request" },
] as const;

/** Secondary links — desktop xl+ or mobile drawer */
const MORE_NAV = [
  { href: "/architecture", label: "Architecture" },
  { href: "/security", label: "Security" },
  { href: "/services", label: "Services" },
] as const;

const ALL_NAV = [...PRIMARY_NAV, ...MORE_NAV];

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M5 20c0-3.314 3.134-6 7-6s7 2.686 7 6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 opacity-80">
      <rect x="3" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function navLinkClass(active: boolean) {
  return active ? "cc-public-nav-link cc-public-nav-link-active" : "cc-public-nav-link";
}

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

  const clientPortalHref = portalCta?.href ?? routes.auth.loginWithNext(routes.client.home);

  return (
    <header className="cc-public-nav-float">
      <div className="cc-public-nav-shell">
        <div className="cc-public-nav-logo-wrap">
          <CrowMark href="/" size="sm" showTagline={false} />
        </div>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex" aria-label="Primary">
          {PRIMARY_NAV.map((item) => (
            <Link key={item.href} href={item.href} className={navLinkClass(pathname === item.href)}>
              {item.label}
            </Link>
          ))}
          <span className="mx-1 hidden h-4 w-px bg-white/10 xl:inline" aria-hidden />
          {MORE_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${navLinkClass(pathname === item.href)} hidden xl:inline-flex`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
          <div className="hidden items-center gap-1 md:flex">
            {portalCta ? (
              <Link href={portalCta.href} className="cc-btn-login-pill">
                <GridIcon />
                {portalCta.label}
              </Link>
            ) : (
              <>
                <Link href={clientPortalHref} className="cc-btn-client-portal">
                  <GridIcon />
                  Client Portal
                </Link>
                <Link href={routes.auth.login} className="cc-btn-login-pill">
                  <UserIcon />
                  Sign in
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 md:hidden">
            {!portalCta && (
              <Link href={routes.auth.login} className="cc-btn-login-pill !min-h-[40px] !px-3 !text-xs">
                <UserIcon />
                Sign in
              </Link>
            )}
            {portalCta && (
              <Link href={portalCta.href} className="cc-btn-client-portal !text-xs">
                {portalCta.label}
              </Link>
            )}
            <button
              type="button"
              className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-3 text-sm font-medium text-slate-300"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="public-mobile-menu"
            >
              Menu
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div
          id="public-mobile-menu"
          className="cc-drawer-backdrop lg:hidden"
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
            <div className="flex items-center justify-between border-b border-white/10 p-4">
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
              {ALL_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    pathname === item.href ? "cc-nav-link-active !flex" : "cc-nav-link !flex"
                  }
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2 border-t border-white/10 p-4">
              {portalCta ? (
                <Link
                  href={portalCta.href}
                  className="cc-btn-login-pill justify-center"
                  onClick={() => setOpen(false)}
                >
                  <GridIcon />
                  {portalCta.label}
                </Link>
              ) : (
                <Link
                  href={clientPortalHref}
                  className="cc-btn-client-portal justify-center border border-cyan-500/20"
                  onClick={() => setOpen(false)}
                >
                  <GridIcon />
                  Client Portal
                </Link>
              )}
              <Link
                href={routes.public.request}
                className="cc-btn-primary text-center"
                onClick={() => setOpen(false)}
              >
                Start request
              </Link>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
