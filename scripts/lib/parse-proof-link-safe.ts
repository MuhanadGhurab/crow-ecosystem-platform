import { readFileSync } from "node:fs";
import { join } from "node:path";

const raw = readFileSync(join(process.cwd(), ".env.preview.proof-link"), "utf8");
for (const line of raw.split(/\r?\n/)) {
  const t = line.trim();
  if (!t || t.startsWith("#")) {
    console.log(JSON.stringify({ kind: "comment_or_blank" }));
    continue;
  }
  const eq = t.indexOf("=");
  if (eq > 0) {
    const key = t.slice(0, eq);
    const value = t.slice(eq + 1).replace(/^["']|["']$/g, "");
    let host = "(none)";
    let hasShare = false;
    let hasAutoBypass = false;
    try {
      const u = new URL(value);
      host = u.hostname;
      hasShare = u.searchParams.has("_vercel_share");
      hasAutoBypass = u.searchParams.has("x-vercel-protection-bypass");
    } catch {
      host = "parse_error";
    }
    console.log(JSON.stringify({ kind: "env", key, valueLen: value.length, host, hasShare, hasAutoBypass }));
  } else {
    console.log(
      JSON.stringify({ kind: "raw", rawLineLen: t.length, startsHttp: /^https?:\/\//i.test(t) })
    );
  }
}
