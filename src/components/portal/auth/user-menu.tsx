import Link from "next/link";
import { getCrowAuth, roleLabel } from "@/lib/auth/roles";
import { getSessionUser } from "@/lib/auth/session";
import { isAuthDisabled } from "@/lib/supabase/env";

export async function UserMenu() {
  if (isAuthDisabled()) {
    return (
      <span className="text-xs text-amber-400/90" title="AUTH_DISABLED=true">
        Auth bypass
      </span>
    );
  }

  const user = await getSessionUser();
  if (!user) {
    return (
      <Link href="/login" className="text-sm text-cyan-400 hover:text-cyan-300">
        Sign in
      </Link>
    );
  }

  const { role } = getCrowAuth(user);
  const label = user.email ?? roleLabel(role);

  return (
    <div className="flex max-w-full flex-wrap items-center justify-end gap-2 text-right sm:gap-3">
      <span
        className="max-w-[10rem] truncate text-xs text-slate-400 sm:max-w-[12rem] sm:text-sm"
        title={label}
      >
        {label}
      </span>
      <span className="shrink-0 rounded-cc-sm bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-300 sm:text-xs">
        {roleLabel(role)}
      </span>
      <form action="/auth/signout" method="post">
        <button
          type="submit"
          className="min-h-[44px] px-2 text-xs text-slate-500 hover:text-white sm:min-h-0 sm:text-sm"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
