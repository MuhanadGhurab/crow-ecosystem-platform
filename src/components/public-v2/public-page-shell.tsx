import type { ReactNode } from "react";

import { CertificationEnvironmentLabel } from "@/components/public/certification-environment-label";

type PublicPageShellProps = {
  children: ReactNode;
  navigation: ReactNode;
};

export function PublicPageShell({ children, navigation }: PublicPageShellProps) {
  return (
    <div className="public-v2-shell relative min-h-screen bg-[#04060c] text-slate-200">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_480px_at_12%_-5%,rgba(34,211,238,0.08),transparent_55%),radial-gradient(700px_400px_at_88%_0%,rgba(139,92,246,0.06),transparent_50%)]"
        aria-hidden
      />
      <a
        href="#public-v2-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>
      {navigation}
      <main id="public-v2-main" className="relative z-10">
        {children}
      </main>
      <footer className="relative z-10 border-t border-white/[0.06] px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Crow public homepage preview — certification environment only.</p>
          <CertificationEnvironmentLabel />
        </div>
      </footer>
    </div>
  );
}
