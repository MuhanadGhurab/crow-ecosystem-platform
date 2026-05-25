"use client";

import { useState } from "react";
import { setOAuthNextCookie } from "@/lib/auth/oauth-next-cookie.client";
import { googleOAuthOptions } from "@/lib/auth/google-sso";
import { createClient } from "@/lib/supabase/client";

export function SignInWithGoogle({ nextPath }: { nextPath?: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogleSignIn() {
    setPending(true);
    setError(null);
    try {
      setOAuthNextCookie(nextPath);
      const supabase = createClient();
      const origin = window.location.origin;
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: googleOAuthOptions(origin),
      });

      if (oauthError) {
        setError(oauthError.message);
        setPending(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setError("Could not start Google sign-in.");
      setPending(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={pending}
        className="cc-btn-oauth disabled:opacity-50"
        aria-busy={pending}
      >
        <span
          aria-hidden
          className="flex h-5 w-5 items-center justify-center rounded-sm bg-white text-xs font-bold text-slate-800"
        >
          G
        </span>
        {pending ? "Redirecting to Google…" : "Continue with Google"}
      </button>
      {error && <p className="cc-alert-error">{error}</p>}
    </div>
  );
}
