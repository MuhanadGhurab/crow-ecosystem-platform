/**
 * GHURAVIA IMPLEMENTATION-ENTRY VALIDATION HARNESS
 * NON-PRODUCT CODE
 * NOT APPROVED FOR RUNTIME OR PRODUCTION
 */

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

if (!process.env.GHV_VAL_1B_DATABASE_URL) throw new Error("GHV_VAL_1B_DATABASE_URL is required");
const client = new pg.Client({ connectionString: process.env.GHV_VAL_1B_DATABASE_URL });
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sql = await readFile(path.join(root, "sql", "001_validation_contract.sql"), "utf8");

await client.connect();
try {
  await client.query("DROP SCHEMA IF EXISTS ghv_validation_1b CASCADE");
  await client.query(sql);
  await client.query("SET search_path TO ghv_validation_1b");

  await client.query("INSERT INTO idempotency(key,response) VALUES($1,$2)", ["SYNTHETIC:idem-1", "ok"]);
  await assert.rejects(client.query("INSERT INTO idempotency(key,response) VALUES($1,$2)", ["SYNTHETIC:idem-1", "duplicate"]));
  await client.query("INSERT INTO activation(id,state) VALUES($1,'draft')", ["SYNTHETIC:a"]);
  const transition = await client.query("UPDATE activation SET state='active', version=version+1, updated_at=now() WHERE id=$1 AND state='draft' AND version=1", ["SYNTHETIC:a"]);
  assert.equal(transition.rowCount, 1);
  const stale = await client.query("UPDATE activation SET state='revoked' WHERE id=$1 AND version=1", ["SYNTHETIC:a"]);
  assert.equal(stale.rowCount, 0);

  await client.query("BEGIN");
  const event = await client.query("INSERT INTO domain_event(aggregate_id,event_type,payload) VALUES($1,$2,$3) RETURNING sequence", ["SYNTHETIC:a", "activated", { validation: true }]);
  await client.query("INSERT INTO derived_ledger(scope_id,total) VALUES($1,1) ON CONFLICT(scope_id) DO UPDATE SET total=derived_ledger.total+1,updated_at=now()", ["SYNTHETIC:scope"]);
  await client.query("INSERT INTO transactional_outbox(event_sequence) VALUES($1)", [event.rows[0].sequence]);
  await client.query("INSERT INTO audit_event(action,actor) VALUES($1,$2)", ["activation", "SYNTHETIC:operator"]);
  await client.query("COMMIT");
  assert.equal((await client.query("SELECT count(*)::int AS n FROM transactional_outbox")).rows[0].n, 1);
  await client.query("INSERT INTO derived_ledger(scope_id,total) VALUES('SYNTHETIC:other',7)");
  await client.query("UPDATE derived_ledger SET total=total+2 WHERE scope_id=$1", ["SYNTHETIC:scope"]);
  assert.equal((await client.query("SELECT total FROM derived_ledger WHERE scope_id='SYNTHETIC:other'")).rows[0].total, 7);

  await client.query("INSERT INTO learning_graph(parent_id,node_id,label) VALUES(NULL,'root',$1),('root','child',$2),('child','leaf',$3)", ["التعلّم", "مرحلة", "نهاية"]);
  const graph = await client.query("WITH RECURSIVE walk AS (SELECT node_id,parent_id,label,0 depth FROM learning_graph WHERE node_id='root' UNION ALL SELECT g.node_id,g.parent_id,g.label,w.depth+1 FROM learning_graph g JOIN walk w ON g.parent_id=w.node_id) SELECT * FROM walk ORDER BY depth");
  assert.equal(graph.rowCount, 3);
  assert.equal(graph.rows[0].label, "التعلّم");
  assert.ok((await client.query("SELECT updated_at FROM activation WHERE id=$1", ["SYNTHETIC:a"])).rows[0].updated_at instanceof Date);

  await client.query("BEGIN");
  await client.query("INSERT INTO audit_event(action,actor) VALUES('rollback','SYNTHETIC:operator')");
  await client.query("ROLLBACK");
  assert.equal((await client.query("SELECT count(*)::int AS n FROM audit_event WHERE action='rollback'")).rows[0].n, 0);
  await client.query("DROP SCHEMA ghv_validation_1b CASCADE");
  console.log("PASS local PostgreSQL contract; validation schema removed");
} finally {
  await client.end();
}
