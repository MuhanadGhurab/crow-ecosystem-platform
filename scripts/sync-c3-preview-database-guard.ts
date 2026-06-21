/**
 * C3.10S — Configure branch Preview C2 database guard env (shared hosted backend).
 */
import { vercelEnvAdd } from "./lib/vercel-env-add-with-timeout";

/** Matches DATABASE_URL pooler host/port (runtime Prisma). */
const RUNTIME_POOLER_FINGERPRINT = "b7f801cfe5e30009";
/** Matches DIRECT_URL session port (backups / controlled migration). */
const DIRECT_FINGERPRINT = "0355c17692e2a90d";

const GUARD_FLAGS = [
  { name: "DATABASE_ENVIRONMENT", value: "production" },
  { name: "BACKEND_ISOLATION", value: "shared" },
  { name: "EXPECTED_DATABASE_FINGERPRINT", value: RUNTIME_POOLER_FINGERPRINT },
  { name: "EXPECTED_DIRECT_DATABASE_FINGERPRINT", value: DIRECT_FINGERPRINT },
] as const;

async function main() {
  for (const spec of GUARD_FLAGS) {
    console.log(`Setting Preview ${spec.name}=…`);
    await vercelEnvAdd(spec.name, spec.value, { target: "preview-branch" });
    console.log(`  ✓ ${spec.name}`);
  }
  console.log(
    "Preview database guard configured (shared production-class backend, pooler + direct fingerprints)."
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
