import Link from "next/link";
import { routes } from "@/lib/routes";

export default function AccountRequestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="cc-page-title">Your requests</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Submit and track ERP implementation requests from your platform account.
          Requester access does not include tenant or ProCrow portals until a role is
          assigned.
        </p>
      </div>

      <div className="cc-glass-card !p-5">
        <h2 className="text-sm font-semibold text-slate-200">Start a new request</h2>
        <p className="mt-2 text-xs text-slate-500">
          Use the public intake form while signed in. Your account email is attached to
          the submission.
        </p>
        <Link
          href={routes.public.request}
          className="cc-btn-primary mt-4 inline-flex text-sm"
        >
          New ERP request
        </Link>
      </div>
    </div>
  );
}
