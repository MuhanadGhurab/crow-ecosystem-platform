import Link from "next/link";
import type { ReactNode } from "react";
import { CrowMarkSvg } from "@/components/brand/crow-mark-svg";
import { LocalVisualPreviewBanner } from "@/components/auth/local-visual-preview-banner";

export type AuthShellProps = {
  title: string;
  subtitle?: string;
  note?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Wider panel for legal review */
  wide?: boolean;
  /** Show Mailpit hint on verification step (local dev only) */
  mailpitHint?: boolean;
};

export function AuthShell({
  title,
  subtitle,
  note,
  children,
  footer,
  wide = false,
  mailpitHint = false,
}: AuthShellProps) {
  return (
    <div className="cc-starfield cc-noise flex min-h-[100dvh] flex-col">
      <LocalVisualPreviewBanner />
      <div className="flex flex-1 items-stretch justify-center px-4 py-8 sm:px-6 sm:py-12">
        <div
          className={`relative z-10 grid w-full max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-12 ${
            wide ? "max-w-6xl" : ""
          }`}
        >
          <aside className="hidden flex-col justify-center lg:flex">
            <Link href="/" className="inline-flex w-fit" aria-label="Crow home">
              <CrowMarkSvg variant="primary" className="h-16 w-16" labeled />
            </Link>
            <p className="mt-8 max-w-sm text-lg font-medium leading-snug text-slate-100">
              One platform account for implementation requests, client portals, and
              governed ERP delivery.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
              Crow connects discovery, architecture, and tenant operations with
              least-privilege access from day one.
            </p>
          </aside>

          <div
            className={`cc-glass-card mx-auto w-full !p-6 sm:!p-8 ${
              wide ? "max-w-2xl lg:max-w-none" : "max-w-md lg:max-w-none"
            }`}
          >
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <CrowMarkSvg variant="primary" className="h-10 w-10" />
              <span className="text-sm font-semibold tracking-wide text-slate-300">Crow</span>
            </div>

            <h1 className="cc-page-title">{title}</h1>
            {subtitle ? (
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{subtitle}</p>
            ) : null}
            {note ? <p className="mt-2 text-xs text-slate-600">{note}</p> : null}

            {mailpitHint ? (
              <p className="mt-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-2 text-xs text-slate-400">
                Local development: open{" "}
                <a
                  href="http://127.0.0.1:8025"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-cyan-400 hover:text-cyan-300"
                >
                  Mailpit inbox
                </a>{" "}
                to read your verification code. Codes are never shown in application logs.
              </p>
            ) : null}

            <div className="mt-6">{children}</div>
            {footer ? <div className="mt-6 border-t border-cyan-500/10 pt-5">{footer}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
