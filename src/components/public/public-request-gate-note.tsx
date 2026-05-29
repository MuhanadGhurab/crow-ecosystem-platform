import Link from "next/link";
import { PUBLIC_ACCOUNT_REQUEST_NOTE } from "@/lib/constants/public-client-ux";
import { routes } from "@/lib/routes";

export function PublicRequestGateNote({ compact }: { compact?: boolean }) {
  return (
    <p
      className={`rounded-lg border border-cyan-500/20 bg-cyan-500/5 text-slate-300 ${
        compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"
      }`}
    >
      {PUBLIC_ACCOUNT_REQUEST_NOTE}{" "}
      <Link href={routes.auth.loginWithNext(routes.public.request)} className="text-cyan-400 hover:text-cyan-300">
        Sign in to request →
      </Link>
    </p>
  );
}
