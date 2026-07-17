import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const DEPLOYMENT_ID = "dpl_BxDkM28qvy5GWocQynweFAd9ejyN";

async function main() {
  const token = JSON.parse(
    readFileSync(
      join(homedir(), "AppData", "Roaming", "xdg.data", "com.vercel.cli", "auth.json"),
      "utf8"
    )
  ).token as string;

  const res = await fetch(
    `https://api.vercel.com/v1/aliases/${encodeURIComponent(DEPLOYMENT_ID)}/protection-bypass`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ttl: 1209600 }),
    }
  );
  const payload = (await res.json()) as Record<string, unknown>;
  console.log(
    JSON.stringify({
      status: res.status,
      keys: Object.keys(payload),
      hasSecret: typeof payload.secret === "string",
      hasUrl: typeof payload.protectionBypassUrl === "string" || typeof payload.url === "string",
      error: payload.error ?? null,
    })
  );
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
