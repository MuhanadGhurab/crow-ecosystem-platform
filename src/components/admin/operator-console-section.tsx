import Link from "next/link";
import {
  BUCKET_ORDER,
  type OperatorConsoleSnapshot,
  type OperatorLifecycleCard,
} from "@/lib/services/operator-console.service";
import { OPERATOR_BUCKET_STYLES } from "@/lib/operator-onboarding-lifecycle";
import { routes } from "@/lib/routes";

function OperatorLifecycleCardRow({ card }: { card: OperatorLifecycleCard }) {
  return (
    <article className="rounded-cc-sm border border-white/10 bg-white/[0.02] p-4 transition hover:border-cyan-500/20">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-white">{card.organizationName}</p>
            {card.lighthouseTag && (
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-200">
                {card.lighthouseTag}
              </span>
            )}
          </div>
          <p className="font-mono text-xs text-slate-500">{card.referenceCode}</p>
          {card.industryLabel && (
            <p className="text-xs text-slate-500">
              {card.industryLabel}
              {card.planLabel ? ` · ${card.planLabel}` : ""}
            </p>
          )}
          {card.moduleLabels.length > 0 && (
            <p className="text-xs text-slate-600">
              {card.moduleLabels.slice(0, 4).join(", ")}
              {card.moduleLabels.length > 4 ? ` +${card.moduleLabels.length - 4}` : ""}
            </p>
          )}
        </div>
        <span
          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${OPERATOR_BUCKET_STYLES[card.bucket]}`}
        >
          {card.bucketLabel}
        </span>
      </div>
      <p className="mt-3 text-sm text-cyan-300">{card.nextAction}</p>
      <p className="mt-0.5 text-xs text-slate-500">{card.nextHint}</p>
      {card.warnings.length > 0 && (
        <ul className="mt-2 space-y-1 text-xs text-amber-200/90">
          {card.warnings.map((w) => (
            <li key={w}>⚠ {w}</li>
          ))}
        </ul>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href={routes.admin.request(card.requestId)} className="cc-btn-secondary !px-2 !py-1 text-xs">
          Request →
        </Link>
        {card.blueprintId && (
          <Link
            href={routes.blueprint(card.blueprintId).overview}
            className="cc-btn-secondary !px-2 !py-1 text-xs"
          >
            Blueprint →
          </Link>
        )}
        {card.tenantSlug && (
          <Link
            href={routes.tenant(card.tenantSlug).dashboard}
            className="cc-btn-primary !px-2 !py-1 text-xs"
          >
            Tenant →
          </Link>
        )}
      </div>
    </article>
  );
}

export function OperatorConsoleSection({ snapshot }: { snapshot: OperatorConsoleSnapshot }) {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">
            Operator onboarding console
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Lifecycle buckets from live requests — MEEM and Rimal appear as lighthouse references, not
            exclusive paths.
          </p>
        </div>
        <Link href={routes.admin.requests} className="text-sm text-cyan-400 hover:text-cyan-300">
          Full intake queue →
        </Link>
      </div>

      {!snapshot.live && (
        <p className="cc-alert-warning text-sm text-amber-100">
          Demo mode — lifecycle cards require a connected database.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {BUCKET_ORDER.map((bucket) => {
          const count = snapshot.buckets[bucket].length;
          return (
            <div
              key={bucket}
              className={`rounded-cc-sm border px-3 py-3 ${OPERATOR_BUCKET_STYLES[bucket]}`}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
                {snapshot.buckets[bucket][0]?.bucketLabel ?? bucket.replace(/_/g, " ")}
              </p>
              <p className="mt-1 font-display text-2xl font-bold tabular-nums">
                {snapshot.live ? count : "—"}
              </p>
            </div>
          );
        })}
      </div>

      {(snapshot.lighthouse.meem || snapshot.lighthouse.rimal) && (
        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
          {snapshot.lighthouse.meem && (
            <span>
              MEEM ref{" "}
              <code className="rounded bg-black/30 px-1 text-cyan-300">
                {snapshot.lighthouse.meem.referenceCode}
              </code>{" "}
              · tenant <code className="rounded bg-black/30 px-1">{snapshot.lighthouse.meem.tenantSlug}</code>
            </span>
          )}
          {snapshot.lighthouse.rimal && (
            <span>
              Rimal ref{" "}
              <code className="rounded bg-black/30 px-1 text-teal-300">
                {snapshot.lighthouse.rimal.referenceCode}
              </code>{" "}
              · tenant{" "}
              <code className="rounded bg-black/30 px-1">{snapshot.lighthouse.rimal.tenantSlug}</code>
            </span>
          )}
        </div>
      )}

      {snapshot.platformWarnings.length > 0 && (
        <ul className="cc-alert-warning space-y-1 text-sm text-amber-100">
          {snapshot.platformWarnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}

      {snapshot.lifecycleCards.length === 0 ? (
        <p className="cc-glass-card text-sm text-slate-500">
          No implementation requests in the database yet. Submit via{" "}
          <Link href="/request" className="text-cyan-400 hover:text-cyan-300">
            /request
          </Link>{" "}
          or seed MEEM/Rimal for staging baselines.
        </p>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {snapshot.lifecycleCards.slice(0, 12).map((card) => (
            <OperatorLifecycleCardRow key={card.requestId} card={card} />
          ))}
        </div>
      )}

      {snapshot.lifecycleCards.length > 12 && (
        <p className="text-center text-xs text-slate-500">
          Showing 12 most recently updated — open{" "}
          <Link href={routes.admin.requests} className="text-cyan-400">
            all requests
          </Link>{" "}
          for the full queue.
        </p>
      )}
    </section>
  );
}
