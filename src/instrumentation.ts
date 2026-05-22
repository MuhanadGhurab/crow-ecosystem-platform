export async function register() {
  const { assertAuthNotDisabledInProduction } = await import("@/lib/supabase/env");
  assertAuthNotDisabledInProduction();
}
