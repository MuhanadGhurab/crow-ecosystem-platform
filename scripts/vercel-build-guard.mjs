/**
 * Fail Vercel/CI builds early if DATABASE_URL points at localhost.
 * Usage: prepended to vercel.json buildCommand
 */
import "./assert-remote-database-url.mjs";

const url = process.env.DATABASE_URL ?? "";
console.log(`✓ Vercel build guard: DATABASE_URL host is remote (${url.includes("supabase") ? "supabase" : "ok"})`);
