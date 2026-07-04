import type { ReactNode } from "react";

import "@/styles/public-v2-bright.css";

import { PUBLIC_V2_BRIGHT_IDENTITY_MARKER } from "@/lib/public-v2/tokens";

type PublicSiteLayoutProps = {
  children: ReactNode;
  navigation: ReactNode;
  footer: ReactNode;
};

/** Bright public site shell — used by (public) layout and auth-adjacent entry layouts. */
export function PublicSiteLayout({ children, navigation, footer }: PublicSiteLayoutProps) {
  return (
    <div
      className={`public-v2-shell ${PUBLIC_V2_BRIGHT_IDENTITY_MARKER} relative min-h-screen overflow-x-hidden`}
      data-public-site="true"
    >
      <div className="pv2-ambient pointer-events-none absolute inset-0" aria-hidden />
      <a
        href="#public-site-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--pv2-surface)] focus:px-4 focus:py-2"
      >
        Skip to main content
      </a>
      {navigation}
      <main id="public-site-main" className="relative z-10">
        {children}
      </main>
      {footer}
    </div>
  );
}
