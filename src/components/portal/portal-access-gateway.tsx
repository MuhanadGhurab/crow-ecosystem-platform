"use client";

import Link from "next/link";
import type { CrowPortalOption } from "@/lib/portal/portal-access-contract";
import { routes } from "@/lib/routes";

type Props = {
  availablePortals: CrowPortalOption[];
  unavailablePortals: CrowPortalOption[];
  recommendedNextAction: string;
  safetyNotes: readonly string[];
  signedOut?: boolean;
};

function stateLabel(state: CrowPortalOption["accessState"]): string {
  switch (state) {
    case "available":
      return "Available";
    case "requires_sign_in":
      return "Sign in required";
    case "pending":
      return "Pending access";
    case "unavailable":
      return "Not available";
    default:
      return state;
  }
}

function stateTone(state: CrowPortalOption["accessState"]): string {
  switch (state) {
    case "available":
      return "border-teal-500/30 bg-teal-500/10 text-teal-200";
    case "requires_sign_in":
      return "border-amber-500/30 bg-amber-500/10 text-amber-200";
    case "pending":
      return "border-cyan-500/30 bg-cyan-500/10 text-cyan-200";
    default:
      return "border-slate-600/40 bg-slate-800/40 text-slate-400";
  }
}

function PortalCard({ portal, signedOut }: { portal: CrowPortalOption; signedOut?: boolean }) {
  const canOpen = portal.accessState === "available";
  const signInHref =
    portal.kind === "client"
      ? routes.auth.loginWithNext(routes.client.home)
      : portal.kind === "business" && portal.tenantSlug
        ? routes.auth.loginWithNext(routes.tenant(portal.tenantSlug).dashboard)
        : routes.auth.loginWithNext(routes.access);

  return (
    <article
      className={`cc-glass-card flex flex-col gap-3 border p-5 ${
        canOpen ? "border-teal-500/25" : "border-white/10"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-semibold text-white">{portal.label}</h3>
          {portal.badge && (
            <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">{portal.badge}</p>
          )}
        </div>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${stateTone(portal.accessState)}`}
        >
          {stateLabel(portal.accessState)}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-slate-400">{portal.description}</p>
      {portal.tenantName && (
        <p className="text-xs text-slate-500">
          Workspace: <span className="text-slate-300">{portal.tenantName}</span>
        </p>
      )}
      {portal.reason && (
        <p className="text-xs text-slate-500">{portal.reason}</p>
      )}
      <div className="mt-auto pt-2">
        {canOpen ? (
          <Link href={portal.route} className="cc-btn-primary inline-flex text-sm">
            Open {portal.label.split(" — ")[0]} →
          </Link>
        ) : signedOut && portal.accessState === "requires_sign_in" ? (
          <Link href={signInHref} className="cc-btn-secondary inline-flex text-sm">
            Sign in →
          </Link>
        ) : portal.accessState === "requires_sign_in" ? (
          <Link href={routes.auth.loginWithNext(routes.access)} className="cc-btn-secondary inline-flex text-sm">
            Sign in →
          </Link>
        ) : (
          <span className="text-xs text-slate-600">Use another portal or contact your operator.</span>
        )}
      </div>
    </article>
  );
}

const WORKSPACE_ORDER: CrowPortalOption["kind"][] = ["client", "business", "procrow"];

function sortWorkspacePortals(portals: CrowPortalOption[]): CrowPortalOption[] {
  const byKind = new Map<CrowPortalOption["kind"], CrowPortalOption>();
  for (const p of portals) {
    if (!byKind.has(p.kind)) byKind.set(p.kind, p);
  }
  return WORKSPACE_ORDER.map((k) => byKind.get(k)).filter(Boolean) as CrowPortalOption[];
}

export function PortalAccessGateway({
  availablePortals,
  unavailablePortals,
  recommendedNextAction,
  safetyNotes,
  signedOut,
}: Props) {
  const allPortals = sortWorkspacePortals([...availablePortals, ...unavailablePortals]);

  return (
    <div className="space-y-8">
      <section className="cc-glass-card border-cyan-500/15 p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300/80">Next step</p>
        <p className="mt-2 text-sm text-slate-300">{recommendedNextAction}</p>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">
          Client Portal · Business Portal · ProCrow
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {allPortals.map((portal) => (
            <PortalCard key={portal.kind} portal={portal} signedOut={signedOut} />
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Safety notes</p>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-500">
          {safetyNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
