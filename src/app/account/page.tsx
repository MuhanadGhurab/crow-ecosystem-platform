import Link from "next/link";
import { routes } from "@/lib/routes";

export default function AccountHomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="cc-page-title">Account Home</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Manage your profile, review legal agreements, and track implementation
          requests. Your account starts with least-privilege requester access until
          a tenant or platform role is assigned.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href={routes.account.profile}
          className="cc-glass-card block !p-5 transition hover:border-cyan-500/30"
        >
          <h2 className="text-sm font-semibold text-slate-200">Profile</h2>
          <p className="mt-1 text-xs text-slate-500">Update display name and contact details.</p>
        </Link>
        <Link
          href={routes.account.requests}
          className="cc-glass-card block !p-5 transition hover:border-cyan-500/30"
        >
          <h2 className="text-sm font-semibold text-slate-200">Requests</h2>
          <p className="mt-1 text-xs text-slate-500">View and create ERP implementation requests.</p>
        </Link>
        <Link
          href={routes.account.legal}
          className="cc-glass-card block !p-5 transition hover:border-cyan-500/30"
        >
          <h2 className="text-sm font-semibold text-slate-200">Legal</h2>
          <p className="mt-1 text-xs text-slate-500">Review accepted agreements and consent history.</p>
        </Link>
        <Link
          href={routes.public.request}
          className="cc-glass-card block !p-5 transition hover:border-cyan-500/30"
        >
          <h2 className="text-sm font-semibold text-slate-200">New request</h2>
          <p className="mt-1 text-xs text-slate-500">Start a new implementation request.</p>
        </Link>
      </div>
    </div>
  );
}
