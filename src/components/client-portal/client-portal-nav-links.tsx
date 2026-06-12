"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CLIENT_PORTAL_PRIMARY_NAV,
  CLIENT_PORTAL_SECONDARY_NAV,
  CLIENT_PORTAL_UTILITY_LINKS,
  isClientPortalNavActive,
} from "@/lib/constants/client-portal-nav";

function navLinkClass(active: boolean) {
  return active ? "cc-client-portal-nav-link cc-client-portal-nav-link-active" : "cc-client-portal-nav-link";
}

type Props = {
  staffConsolePreview: boolean;
};

export function ClientPortalNavLinks({ staffConsolePreview }: Props) {
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

  const secondaryActive = CLIENT_PORTAL_SECONDARY_NAV.some((item) =>
    isClientPortalNavActive(item.href, pathname)
  );

  return (
    <>
      <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex" aria-label="Client portal">
        {CLIENT_PORTAL_PRIMARY_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={navLinkClass(isClientPortalNavActive(item.href, pathname))}
            title={item.description}
          >
            {item.label}
          </Link>
        ))}
        <span className="mx-1 hidden h-4 w-px bg-white/10 xl:inline" aria-hidden />
        <details className="relative hidden xl:block">
          <summary
            className={`${navLinkClass(secondaryActive)} list-none cursor-pointer [&::-webkit-details-marker]:hidden`}
          >
            Account
          </summary>
          <div className="absolute left-1/2 top-[calc(100%+0.5rem)] z-50 min-w-[12rem] -translate-x-1/2 rounded-2xl border border-white/[0.1] bg-[#0c0c12]/95 p-1.5 shadow-xl backdrop-blur-xl">
            {CLIENT_PORTAL_SECONDARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-3 py-2 text-sm transition hover:bg-white/[0.06] ${
                  isClientPortalNavActive(item.href, pathname) ? "text-white" : "text-slate-400"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="my-1 border-t border-white/[0.06]" />
            <Link
              href={CLIENT_PORTAL_UTILITY_LINKS.workspaces}
              className="block rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              All workspaces
            </Link>
            <Link
              href={CLIENT_PORTAL_UTILITY_LINKS.legacyPortal}
              className="block rounded-xl px-3 py-2 text-sm text-slate-500 transition hover:bg-white/[0.06] hover:text-slate-300"
            >
              Legacy portal
            </Link>
          </div>
        </details>
      </nav>

      <div className="ml-auto flex items-center gap-1.5 lg:hidden">
        <Link href={CLIENT_PORTAL_UTILITY_LINKS.newRequest} className="cc-btn-client-portal-cta text-xs sm:text-sm">
          New request
        </Link>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.04] text-slate-300"
          aria-expanded={open}
          aria-controls="client-portal-mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {open ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div
          id="client-portal-mobile-nav"
          className="pointer-events-auto fixed inset-0 top-[4.5rem] z-40 overflow-y-auto border-t border-white/[0.06] bg-[#06060a]/95 p-4 backdrop-blur-xl lg:hidden"
        >
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Work</p>
          <div className="space-y-1">
            {CLIENT_PORTAL_PRIMARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-2xl border px-4 py-3 ${
                  isClientPortalNavActive(item.href, pathname)
                    ? "border-violet-500/30 bg-violet-500/10 text-white"
                    : "border-white/[0.06] bg-white/[0.02] text-slate-300"
                }`}
              >
                <span className="font-medium">{item.label}</span>
                {item.description && (
                  <span className="mt-0.5 block text-xs text-slate-500">{item.description}</span>
                )}
              </Link>
            ))}
          </div>
          <p className="mb-2 mt-6 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Account</p>
          <div className="space-y-1">
            {CLIENT_PORTAL_SECONDARY_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-2xl border px-4 py-3 ${
                  isClientPortalNavActive(item.href, pathname)
                    ? "border-white/20 bg-white/[0.06] text-white"
                    : "border-white/[0.06] bg-white/[0.02] text-slate-300"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-6 space-y-2 border-t border-white/[0.06] pt-4 text-sm">
            <Link href={CLIENT_PORTAL_UTILITY_LINKS.workspaces} className="block text-cyan-300/90">
              All workspaces
            </Link>
            {staffConsolePreview && (
              <Link href={CLIENT_PORTAL_UTILITY_LINKS.procrowConsole} className="block text-violet-300/90">
                ProCrow console
              </Link>
            )}
            <Link href={CLIENT_PORTAL_UTILITY_LINKS.legacyPortal} className="block text-slate-500">
              Legacy portal
            </Link>
          </div>
        </div>
      )}

      <Link
        href={CLIENT_PORTAL_UTILITY_LINKS.newRequest}
        className="cc-btn-client-portal-cta hidden sm:inline-flex lg:inline-flex"
      >
        New request
      </Link>
    </>
  );
}
