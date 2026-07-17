import { fingerprintDatabaseUrl, maskDatabaseTarget } from "./database-fingerprint";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const base =
  "postgresql://postgres.secret:super-secret-password@db.abcdefghijklmnop.supabase.co:5432/postgres?schema=public";

const altPassword =
  "postgresql://postgres.secret:different-password@db.abcdefghijklmnop.supabase.co:5432/postgres?schema=public";

const altUser =
  "postgresql://postgres.otheruser:super-secret-password@db.abcdefghijklmnop.supabase.co:5432/postgres?schema=public";

const altHost =
  "postgresql://postgres.secret:super-secret-password@db.qrstuvwxyzabcdefghij.supabase.co:5432/postgres?schema=public";

const fp1 = fingerprintDatabaseUrl(base);
const fp2 = fingerprintDatabaseUrl(altPassword);
const fp3 = fingerprintDatabaseUrl(altUser);
const fp4 = fingerprintDatabaseUrl(altHost);

assert(fp1.targetHash === fp2.targetHash, "password change must not alter fingerprint");
assert(fp1.targetHash === fp3.targetHash, "username change must not alter fingerprint");
assert(fp1.targetHash !== fp4.targetHash, "host change must alter fingerprint");
assert(fp1.supabaseProjectRef === "abcdefghijklmnop", "supabase ref extracted");

const masked = maskDatabaseTarget(base);
assert(!masked.includes("super-secret"), "maskDatabaseTarget must not leak password");
assert(!masked.includes("postgres.secret"), "maskDatabaseTarget must not leak username");
assert(masked.includes(fp1.targetHash), "maskDatabaseTarget includes fingerprint hash");

console.log("database-fingerprint: OK");
