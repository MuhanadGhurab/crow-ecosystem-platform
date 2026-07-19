import {
  CROW_ALPHA_RUNTIME_SAFETY_NOTICE,
  getRuntimeSafetyNotice,
  shouldShowCrowAlphaRuntimeBanner,
} from "@/lib/runtime/crow-runtime-mode";
import Link from "next/link";
import { routes } from "@/lib/routes";

/**
 * CROW.DEVFLOW.2 — Visible Alpha Development / demo-data banner.
 *
 * Classification notice only. Does not enable hosted writes, Blueprint generation,
 * payment, or tenant go-live. Does not replace PreviewDbDisabledNotice.
 * CROW.DEVFLOW.5 — link to demo feedback (hosted write still fail-closed without flags).
 */
export function CrowAlphaRuntimeBanner({
  className,
}: {
  className?: string;
} = {}) {
  if (!shouldShowCrowAlphaRuntimeBanner()) return null;

  const notice = getRuntimeSafetyNotice();

  return (
    <div
      role="status"
      data-crow-alpha-runtime-banner="true"
      className={
        className ??
        "sticky top-0 z-50 border-b border-amber-500/35 bg-slate-950/95 px-3 py-2 text-center text-xs leading-snug text-amber-100/95 backdrop-blur sm:text-sm"
      }
    >
      <p className="font-medium text-amber-50">{CROW_ALPHA_RUNTIME_SAFETY_NOTICE}</p>
      <p className="mt-0.5 text-[11px] text-amber-200/75 sm:text-xs">
        Alpha Development · Demo/Test Data Only · Local-first Review · Not a commercial Production
        claim
        {" · "}
        <Link
          href={routes.alphaFeedback}
          className="underline decoration-amber-400/50 underline-offset-2 hover:text-amber-50"
          data-crow-alpha-feedback-link="true"
        >
          Send demo feedback
        </Link>
      </p>
      {notice !== CROW_ALPHA_RUNTIME_SAFETY_NOTICE ? (
        <p className="mt-1 text-[11px] text-amber-200/70">{notice}</p>
      ) : null}
    </div>
  );
}
