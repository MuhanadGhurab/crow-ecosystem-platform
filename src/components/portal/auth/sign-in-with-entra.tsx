"use client";

import { useState } from "react";
import { OAUTH_NEXT_COOKIE } from "@/lib/auth/msal-config";
import { azureOAuthOptions } from "@/lib/auth/entra-sso";
import { createClient } from "@/lib/supabase/client";

function setOAuthNextCookie(nextPath: string) {
  const value = encodeURIComponent(
    nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/admin/overview"
  );
  const secure = typeof window !== "undefined" && window.location.protocol === "https:";
  document.cookie = `${OAUTH_NEXT_COOKIE}=${value}; path=/; max-age=600; SameSite=Lax${secure ? "; Secure" : ""}`;
}

export function SignInWithEntra({ nextPath }: { nextPath: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEntraSignIn() {
    setPending(true);
    setError(null);
    try {
      setOAuthNextCookie(nextPath);
      const supabase = createClient();
      const origin = window.location.origin;
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "azure",
        options: azureOAuthOptions(origin),
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

      setError("Could not start Microsoft sign-in.");
      setPending(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Microsoft sign-in failed.");
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleEntraSignIn}
        disabled={pending}
        className="cc-btn-microsoft disabled:opacity-50"
      >
        <span aria-hidden className="text-lg">
          ⊞
        </span>
        {pending ? "Redirecting to Microsoft…" : "Sign in with Microsoft (Entra ID)"}
      </button>
      {error && (
        <p className="rounded-cc-sm border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
