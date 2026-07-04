import type { ReactNode } from "react";

import "@/styles/public-v2-bright.css";

import { PUBLIC_V2_BRIGHT_IDENTITY_MARKER } from "@/lib/public-v2/tokens";

type PublicSiteLayoutProps = {
  children: ReactNode;
  navigation: ReactNode;
  footer: ReactNode;
};

/** Bright public site shell — layered background, no overlap with fixed nav. */
export function PublicSiteLayout({ children, navigation, footer }: PublicSiteLayoutProps) {
  return (
    <div
      className={`public-v2-shell ${PUBLIC_V2_BRIGHT_IDENTITY_MARKER} pv2-page-canvas relative min-h-screen overflow-x-hidden`}
      data-public-site="true"
    >
      <div className="pv2-blueprint-grid pointer-events-none absolute inset-0 z-0" aria-hidden />
      <div className="pv2-ambient pointer-events-none absolute inset-0 z-0" aria-hidden />
      <div className="pv2-ambient-accent pointer-events-none absolute inset-0 z-0" aria-hidden />
      <a
        href="#public-site-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--pv2-surface)] focus:px-4 focus:py-2"
      >
        Skip to main content
      </a>
      <div className="relative z-20">{navigation}</div>
      <main id="public-site-main" className="relative z-10">
        {children}
      </main>
      <div className="relative z-20">{footer}</div>
    </div>
  );
}
