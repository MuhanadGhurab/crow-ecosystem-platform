"use server";

import { redirect } from "next/navigation";
import { isC3AuthCanaryEnabled } from "@/lib/auth/c3-auth-canary";
import { createClient } from "@/lib/supabase/server";

function denyCanary(): never {
  redirect("/auth-canary");
}

export async function signInCanary(formData: FormData): Promise<void> {
  if (!isC3AuthCanaryEnabled()) {
    denyCanary();
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/auth-canary?error=missing");
  }

  const supabase = await createClient();
  const result = await supabase.auth.signInWithPassword({ email, password });

  if (result.error || !result.data.session) {
    redirect("/auth-canary?error=invalid");
  }

  redirect("/auth-canary/landing");
}

export async function signOutCanary(): Promise<void> {
  if (!isC3AuthCanaryEnabled()) {
    denyCanary();
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth-canary");
}
