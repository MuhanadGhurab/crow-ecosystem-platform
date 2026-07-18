import { getPreviewDbDisabledReason } from "@/lib/runtime/preview-db-safety";

/**
 * CROW.GAP004.ALT2 — sober notice when Preview cannot use a hosted database.
 */
export function PreviewDbDisabledNotice({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const reason = getPreviewDbDisabledReason();

  return (
    <div
      role="status"
      className={
        className ??
        "rounded-md border border-amber-700/40 bg-amber-950/20 px-4 py-3 text-sm text-amber-100"
      }
    >
      <p className="font-medium text-amber-50">Preview database access is disabled</p>
      {!compact ? (
        <p className="mt-1 text-amber-100/90">
          Preview database access is disabled because this Preview environment is not isolated
          from Production. This Preview can show safe UI and local-first flows only. Hosted
          actions are blocked to protect Production data.
        </p>
      ) : null}
      <p className="mt-2 text-xs text-amber-200/80">{reason}</p>
      {!compact ? (
        <p className="mt-2 text-xs text-amber-200/70">
          Use local development for test data or Production for real client actions. This
          environment is UI/local-first only.
        </p>
      ) : null}
    </div>
  );
}
