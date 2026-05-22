import {
  lifecycleIndexFromRequestStatus,
  PIPELINE_LIFECYCLE_LABELS,
} from "@/lib/pipeline-lifecycle";
import type { ImplementationRequestStatus } from "@/lib/types/platform";

type LifecycleStripProps = {
  status: ImplementationRequestStatus;
  className?: string;
  compact?: boolean;
};

export function LifecycleStrip({ status, className = "", compact = false }: LifecycleStripProps) {
  const activeIndex = lifecycleIndexFromRequestStatus(status);
  const terminal = activeIndex < 0;

  return (
    <nav
      className={`cc-pipeline-lifecycle ${compact ? "cc-pipeline-lifecycle--compact" : ""} ${className}`.trim()}
      aria-label="Implementation lifecycle"
    >
      <ol className="cc-pipeline-lifecycle-track">
        {PIPELINE_LIFECYCLE_LABELS.map((label, i) => {
          const done = !terminal && i < activeIndex;
          const active = !terminal && i === activeIndex;
          return (
            <li
              key={label}
              className={`cc-pipeline-lifecycle-step ${
                done ? "cc-pipeline-lifecycle-step--done" : ""
              } ${active ? "cc-pipeline-lifecycle-step--active" : ""} ${
                terminal ? "cc-pipeline-lifecycle-step--muted" : ""
              }`}
              title={label}
            >
              <span className="cc-pipeline-lifecycle-dot" aria-hidden />
              {!compact && <span className="cc-pipeline-lifecycle-label">{label}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
