import Link from "next/link";
import type { CrowPortalOption } from "@/lib/portal/portal-access-contract";
import { routes } from "@/lib/routes";

function PortalCard({ option, signedOut }: { option: CrowPortalOption; signedOut: boolean }) {
  const actionable = option.accessState === "available";
  const tone =
    option.accessState === "available"
      ? "border-teal-500/30 bg-teal-500/5"
      : option.accessState === "pending"
        ? "border-amber-500/25 bg-amber-950/10"
        : "border-slate-700/80 bg-slate-900/40 opacity-90";

  return (
    <article className={`rounded-xl border p-5 ${tone}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-white">{option.label}</h2>
        {option.badge && (
          <span className="rounded-full border border-slate-600/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            {option.badge}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-slate-400">{option.description}</p>
      {option.reason && (
        <p className="mt-3 text-xs text-slate-500">{option.reason}</p>
      )}
      <div className="mt-4">
        {actionable ? (
          <Link href={option.route} className="cc-btn-primary text-sm">
            Open {option.label} →
          </Link>
        ) : signedOut && option.kind !== "procrow" ? (
          <div className="flex flex-wrap gap-2">
            <Link href={routes.auth.login} className="cc-btn-secondary text-sm">
              Sign in
            </Link>
            {option.kind === "client" && (
              <Link href={routes.auth.signupWithNext(routes.public.request)} className="cc-btn-primary text-sm">
                Create account
              </Link>
            )}
          </div>
        ) : (
          <span className="text-xs text-slate-500">
            {option.accessState === "unavailable"
              ? "Not available for your account"
              : option.accessState === "pending"
                ? "Pending workspace linkage"
                : "Sign in required"}
          </span>
        )}
      </div>
    </article>
  );
}

type Props = {
  availablePortals: CrowPortalOption[];
  unavailablePortals: CrowPortalOption[];
  recommendedNextAction: string;
  safetyNotes: readonly string[];
  signedOut: boolean;
};

export function PortalAccessGateway({
  availablePortals,
  unavailablePortals,
  recommendedNextAction,
  safetyNotes,
  signedOut,
}: Props) {
  const showUnavailable = signedOut || unavailablePortals.some((p) => p.accessState !== "unavailable");

  return (
    <div className="space-y-8">
      <p className="text-sm text-slate-300">{recommendedNextAction}</p>

      {availablePortals.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-400/90">
            Your portals
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {availablePortals.map((option) => (
              <PortalCard key={option.kind} option={option} signedOut={signedOut} />
            ))}
          </div>
        </section>
      )}

      {showUnavailable && unavailablePortals.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            {signedOut ? "Portal overview" : "Other portals"}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {unavailablePortals
              .filter((p) => signedOut || p.kind !== "procrow" || p.accessState !== "unavailable")
              .filter((p) => signedOut || !availablePortals.some((a) => a.kind === p.kind))
              .map((option) => (
                <PortalCard key={`${option.kind}-off`} option={option} signedOut={signedOut} />
              ))}
          </div>
        </section>
      )}

      <section className="cc-glass-card text-xs text-slate-500">
        <p className="font-medium uppercase tracking-wide text-slate-400">Safety notes</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          {safetyNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
