import Link from "next/link";
import type { ReactNode } from "react";

import "@/styles/public-v2-bright.css";

import { PublicV2BrandMark } from "@/components/public-v2/public-v2-brand-mark";
import { PUBLIC_V2_BRIGHT_IDENTITY_MARKER, PUBLIC_V2_COLORFUL_IDENTITY_MARKER } from "@/lib/public-v2/tokens";

export function PublicAuthFrame({
  title,
  subtitle,
  note,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  note?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div
      className={`public-v2-shell ${PUBLIC_V2_BRIGHT_IDENTITY_MARKER} ${PUBLIC_V2_COLORFUL_IDENTITY_MARKER} relative flex min-h-[100dvh] flex-col overflow-x-hidden`}
      data-public-auth="true"
      data-pv2-colorful="true"
    >
      <div className="pv2-blueprint-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="pv2-ambient pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <PublicV2BrandMark href="/" />
          <div className="pv2-hero-panel mt-8 p-6 sm:p-8">
            <h1 className="pv2-h1 text-2xl">{title}</h1>
            {subtitle ? <p className="pv2-body mt-2">{subtitle}</p> : null}
            {note ? <p className="mt-2 text-xs text-[var(--pv2-text-muted)]">{note}</p> : null}
            <div className="pv2-auth-form mt-6">{children}</div>
            {footer ? <div className="mt-6 border-t border-[var(--pv2-border)] pt-5">{footer}</div> : null}
          </div>
          <p className="mt-6 text-center text-xs text-[var(--pv2-text-muted)]">
            <Link href="/how-crow-works" className="pv2-link">
              How Crow Works
            </Link>
            {" · "}
            <Link href="/start" className="pv2-link">
              Start Designing
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
