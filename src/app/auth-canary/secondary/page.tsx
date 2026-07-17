import { cookies } from "next/headers";
import Link from "next/link";
import { assertAuthCanaryRouteEnabled } from "@/lib/auth/c3-auth-canary";
import { createClient } from "@/lib/supabase/server";
import { listSupabaseAuthCookieNames } from "@/lib/supabase/auth-cookie-names";

export const dynamic = "force-dynamic";

export default async function AuthCanarySecondaryPage() {
  assertAuthCanaryRouteEnabled();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const cookieStore = await cookies();
  const authCookieNames = listSupabaseAuthCookieNames(cookieStore.getAll());

  return (
    <main className="mx-auto max-w-md space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-slate-100">Canary secondary</h1>
        <p className="mt-2 text-sm text-slate-400">Independent server-side validation.</p>
      </header>

      <dl className="space-y-2 rounded border border-slate-700/60 bg-slate-900/50 p-4 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-slate-400">Authenticated</dt>
          <dd className="font-medium text-slate-100">{user ? "Yes" : "No"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-400">Session cookie detected</dt>
          <dd className="font-medium text-slate-100">{authCookieNames.length > 0 ? "Yes" : "No"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-slate-400">Server identity validated</dt>
          <dd className="font-medium text-slate-100">{user ? "Yes" : "No"}</dd>
        </div>
      </dl>

      <nav className="flex flex-col gap-2 text-sm">
        <Link href="/auth-canary/landing" prefetch={false} className="text-cyan-400 hover:text-cyan-300">
          Back to landing
        </Link>
        <Link href="/auth-canary/secondary" prefetch={false} className="text-cyan-400 hover:text-cyan-300">
          Reload this page
        </Link>
      </nav>
    </main>
  );
}
