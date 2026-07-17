"use client";

import type { ReactNode } from "react";

type StudioShellProps = {
  title: string;
  subtitle?: string;
  toolbar?: ReactNode;
  modeSwitcher?: ReactNode;
  catalog?: ReactNode;
  main: ReactNode;
  inspector?: ReactNode;
  footer?: ReactNode;
};

export function StudioShell({ title, subtitle, toolbar, modeSwitcher, catalog, main, inspector, footer }: StudioShellProps) {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col gap-3">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-white/60">{subtitle}</p> : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {modeSwitcher}
          {toolbar}
        </div>
      </header>
      <div className="grid flex-1 gap-3 lg:grid-cols-[minmax(220px,260px)_1fr_minmax(240px,300px)]">
        {catalog ? <aside className="studio-panel-rail hidden lg:block">{catalog}</aside> : null}
        <section className="studio-panel-main min-h-[420px] overflow-hidden rounded-xl border border-white/10 bg-[#0d1117]/80 backdrop-blur-sm">
          {main}
        </section>
        {inspector ? <aside className="studio-panel-inspector hidden lg:block">{inspector}</aside> : null}
      </div>
      {footer ? <footer className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-sm">{footer}</footer> : null}
    </div>
  );
}
