/**
 * Smoke-check public routes return HTML (dev server must be running).
 * Usage: node scripts/check-responsive-routes.mjs [baseUrl]
 */
async function resolveBase() {
  if (process.argv[2]) return process.argv[2];
  for (const port of [3000, 3004, 3001]) {
    try {
      const res = await fetch(`http://localhost:${port}/`, { method: "HEAD" });
      if (res.ok || res.status === 307 || res.status === 308) {
        return `http://localhost:${port}`;
      }
    } catch {
      /* try next port */
    }
  }
  return "http://localhost:3000";
}

const routes = [
  "/",
  "/request",
  "/security",
  "/pricing",
  "/modules",
  "/about",
  "/architecture",
  "/services",
  "/clients",
  "/industries",
  "/case-studies",
  "/login",
];

async function check(path, baseUrl) {
  const url = `${baseUrl}${path}`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    const ok = res.ok;
    const html = ok ? await res.text() : "";
    const hasCrow = html.includes("Crow") || html.includes("crow");
    return { path, status: res.status, ok, hasCrow };
  } catch (e) {
    return { path, status: 0, ok: false, error: String(e) };
  }
}

async function main() {
  const baseUrl = await resolveBase();
  console.log(`Checking ${baseUrl} ...\n`);
  let failed = 0;
  for (const path of routes) {
    const r = await check(path, baseUrl);
    const mark = r.ok && r.hasCrow !== false ? "OK" : "FAIL";
    if (mark === "FAIL") failed++;
    console.log(`${mark} ${path} → ${r.status}${r.error ? ` (${r.error})` : ""}`);
  }
  console.log(failed ? `\n${failed} route(s) failed` : "\nAll routes OK");
  process.exit(failed ? 1 : 0);
}

main();
