import type { ReactNode } from "react";

import "@/styles/public-v2-bright.css";

import { CertificationEnvironmentLabel } from "@/components/public/certification-environment-label";
import { PUBLIC_V2_BRIGHT_IDENTITY_MARKER } from "@/lib/public-v2/tokens";

type PublicPageShellProps = {
  children: ReactNode;
  navigation: ReactNode;
};

export function PublicPageShell({ children, navigation }: PublicPageShellProps) {
  return (
    <div
      className={`public-v2-shell ${PUBLIC_V2_BRIGHT_IDENTITY_MARKER} relative min-h-screen overflow-x-hidden`}
      data-public-v2-identity={PUBLIC_V2_BRIGHT_IDENTITY_MARKER}
    >
      <div className="pv2-ambient pointer-events-none absolute inset-0" aria-hidden />
      <a
        href="#public-v2-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--pv2-surface)] focus:px-4 focus:py-2 focus:text-[var(--pv2-text-primary)]"
      >
        Skip to main content
      </a>
      {navigation}
      <main id="public-v2-main" className="relative z-10">
        {children}
      </main>
      <footer className="pv2-footer relative z-10 px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>Crow public homepage preview — certification environment only.</p>
          <CertificationEnvironmentLabel />
        </div>
      </footer>
    </div>
  );
}
