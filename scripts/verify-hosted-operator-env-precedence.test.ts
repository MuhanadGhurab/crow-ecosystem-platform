import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  isLocalhostDatabaseTarget,
  loadHostedOperatorEnv,
  parseEnvFile,
} from "./lib/hosted-operator-env";

function withCwd<T>(cwd: string, fn: () => T): T {
  const prior = process.cwd();
  process.chdir(cwd);
  try {
    return fn();
  } finally {
    process.chdir(prior);
  }
}

{
  const dir = mkdtempSync(join(tmpdir(), "crow-hosted-env-"));
  writeFileSync(
    join(dir, ".env.staging.runtime"),
    [
      "DIRECT_URL=postgresql://postgres:pass@db.wbwnsndcxrgyqwppurms.supabase.co:5432/postgres",
      "DATABASE_URL=postgresql://postgres.wbwnsndcxrgyqwppurms:pass@aws-0-eu-central-1.pooler.supabase.com:6543/postgres",
      "NEXT_PUBLIC_SUPABASE_URL=https://wbwnsndcxrgyqwppurms.supabase.co",
    ].join("\n")
  );
  writeFileSync(
    join(dir, ".env.preview.operator"),
    [
      "DIRECT_URL=postgresql://crow:crow_local_dev@127.0.0.1:5433/crow_ecosystem?schema=public",
      "DATABASE_URL=postgresql://crow:crow_local_dev@127.0.0.1:5433/crow_ecosystem?schema=public",
      "C3_GOOGLE_PROOF_EMAIL=proof@example.com",
    ].join("\n")
  );

  withCwd(dir, () => {
    const priorDirect = process.env.DIRECT_URL;
    const priorDb = process.env.DATABASE_URL;
    delete process.env.DIRECT_URL;
    delete process.env.DATABASE_URL;

    try {
      const result = loadHostedOperatorEnv({
        primaryEnvFile: ".env.staging.runtime",
        supplementalEnvFiles: [".env.preview.operator"],
        applyToProcessEnv: true,
      });
      assert.equal(result.targetClassification, "hosted");
      assert.ok(process.env.DIRECT_URL?.includes("wbwnsndcxrgyqwppurms"));
      assert.ok(!isLocalhostDatabaseTarget(process.env.DIRECT_URL ?? ""));
      assert.equal(process.env.C3_GOOGLE_PROOF_EMAIL, "proof@example.com");
    } finally {
      if (priorDirect === undefined) delete process.env.DIRECT_URL;
      else process.env.DIRECT_URL = priorDirect;
      if (priorDb === undefined) delete process.env.DATABASE_URL;
      else process.env.DATABASE_URL = priorDb;
    }
  });
}

{
  assert.ok(isLocalhostDatabaseTarget("postgresql://crow@127.0.0.1:5433/crow_ecosystem"));
  assert.ok(!isLocalhostDatabaseTarget("postgresql://postgres@db.wbwnsndcxrgyqwppurms.supabase.co:5432/postgres"));
}

{
  const parsed = parseEnvFile(join(process.cwd(), ".env.staging.runtime"));
  if (parsed.size > 0) {
    const direct = parsed.get("DIRECT_URL");
    if (direct) {
      assert.ok(!isLocalhostDatabaseTarget(direct), "staging.runtime must not target localhost");
    }
  }
}

console.log("PASS — HOSTED OPERATOR ENV PRECEDENCE ENFORCED");
