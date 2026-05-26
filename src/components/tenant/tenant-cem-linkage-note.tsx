import Link from "next/link";
import { routes } from "@/lib/routes";

type TenantCemLinkageNoteProps = {
  slug: string;
  cybercrowInitialized: boolean;
  compact?: boolean;
};

/** Concise CEM ↔ CyberCrow ↔ SAREA relationship — avoid banner spam. */
export function TenantCemLinkageNote({
  slug,
  cybercrowInitialized,
  compact = false,
}: TenantCemLinkageNoteProps) {
  const r = routes.tenant(slug);

  if (compact) {
    return (
      <p className="text-xs text-slate-500">
        CEM runs operations ·{" "}
        <Link href={r.cybercrow.dashboard} className="text-violet-400 hover:text-violet-300">
          CyberCrow
        </Link>{" "}
        protects workflow trust ·{" "}
        <Link href={routes.sarea.profiles} className="text-rose-400 hover:text-rose-300">
          SAREA
        </Link>{" "}
        adapts role experience. RBAC controls access; SAREA controls presentation.
      </p>
    );
  }

  return (
    <section className="cc-glass-card border-white/5 !py-4">
      <p className="text-sm text-slate-400">
        <span className="font-medium text-cyan-300">CEM</span> coordinates workflows and tasks.{" "}
        <span className="font-medium text-violet-300">CyberCrow</span> records trust and audit
        context for sensitive operational changes.{" "}
        <span className="font-medium text-rose-300">SAREA</span> shapes what each role sees — it
        does not grant permissions.
      </p>
      <div className="mt-3 flex flex-wrap gap-4 text-xs">
        <Link
          href={cybercrowInitialized ? r.cybercrow.auditLogs : r.cybercrow.dashboard}
          className="text-violet-400 hover:text-violet-300"
        >
          {cybercrowInitialized
            ? "Review workflow trust in CyberCrow →"
            : "Set up CyberCrow →"}
        </Link>
        <Link href={routes.sarea.profiles} className="text-rose-400 hover:text-rose-300">
          Preview role experience in SAREA →
        </Link>
      </div>
    </section>
  );
}
