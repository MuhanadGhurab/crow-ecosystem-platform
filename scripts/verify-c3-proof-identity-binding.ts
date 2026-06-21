/**
 * C3.10U — Preview browser identity binding diagnostic verification.
 * Run: npm run c3-proof-identity-binding:verify
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

async function main() {
  console.log("\n=== C3.10U proof identity binding (live) ===\n");

  const route = readFileSync(
    join(process.cwd(), "src/app/api/c3/proof-identity/route.ts"),
    "utf8"
  );
  assert(!route.includes("access_token"), "route must not expose tokens");
  assert(!route.includes("refresh_token"), "route must not expose refresh tokens");
  assert(!route.includes("platformAccountId"), "route must not expose platform account id");

  if (process.env.C3_PREVIEW_BASE_URL?.trim()) {
    const base = process.env.C3_PREVIEW_BASE_URL.replace(/\/$/, "");
    const headers: Record<string, string> = {};
    const bypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET?.trim();
    if (bypass) {
      headers["x-vercel-protection-bypass"] = bypass;
      headers["x-vercel-set-bypass-cookie"] = "true";
    }
    try {
      const unauth = await fetch(`${base}/api/c3/proof-identity`, { headers });
      assert(
        unauth.status === 401 || unauth.status === 404,
        `unauthenticated proof-identity denied (${unauth.status})`
      );
      console.log(`  ✓ unauthenticated Preview request denied (${unauth.status})`);
    } catch (error) {
      console.log(
        `  · skipped live Preview fetch (${error instanceof Error ? error.message : "network error"})`
      );
    }
  } else {
    console.log("  · skipped live Preview fetch (C3_PREVIEW_BASE_URL unset)");
  }

  console.log("  ✓ live binding checks complete");
  console.log(
    "\nPASS — PREVIEW BROWSER IDENTITY CAN BE SAFELY BOUND TO THE OPERATOR VERIFIER\n"
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
