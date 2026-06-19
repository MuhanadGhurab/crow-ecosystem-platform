import Link from "next/link";
import { assertAuthCanaryRouteEnabled } from "@/lib/auth/c3-auth-canary";
import { signInCanary } from "@/app/auth-canary/actions";

export const dynamic = "force-dynamic";

export default async function AuthCanaryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  assertAuthCanaryRouteEnabled();
  const { error } = await searchParams;

  const errorMessage =
    error === "invalid"
      ? "Sign-in failed. Check credentials."
      : error === "missing"
        ? "Email and password are required."
        : null;

  return (
    <main className="mx-auto max-w-md space-y-6">
      <header>
        <p className="text-xs uppercase tracking-wider text-amber-400/90">C3.7D — Preview only</p>
        <h1 className="mt-2 text-xl font-semibold text-slate-100">Official Supabase SSR canary</h1>
        <p className="mt-2 text-sm text-slate-400">
          Server Action + <code className="text-slate-300">cookies()</code> — no route handler, no
          manual Set-Cookie.
        </p>
      </header>

      {errorMessage ? (
        <p className="rounded border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
          {errorMessage}
        </p>
      ) : null}

      <form action={signInCanary} className="space-y-4">
        <div>
          <label htmlFor="canary-email" className="mb-1 block text-sm text-slate-300">
            Email
          </label>
          <input
            id="canary-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="input-cc w-full"
          />
        </div>
        <div>
          <label htmlFor="canary-password" className="mb-1 block text-sm text-slate-300">
            Password
          </label>
          <input
            id="canary-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="input-cc w-full"
          />
        </div>
        <button type="submit" className="cc-btn-primary w-full">
          Sign in (Server Action)
        </button>
      </form>

      <p className="text-xs text-slate-600">
        Not linked to PlatformAccount, C3 registration, or tenant routing.
      </p>
    </main>
  );
}
