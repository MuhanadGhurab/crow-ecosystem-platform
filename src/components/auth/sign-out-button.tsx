"use client";

import { routes } from "@/lib/routes";

type SignOutButtonProps = {
  className?: string;
  label?: string;
};

/** POST-only sign-out — avoids Next.js RSC prefetch hitting GET /auth/signout. */
export function SignOutButton({
  className = "text-slate-500 hover:text-slate-300",
  label = "Sign out",
}: SignOutButtonProps) {
  return (
    <form action={routes.auth.signOut} method="post">
      <button type="submit" className={className}>
        {label}
      </button>
    </form>
  );
}
