import { buildMeemGlobalReferenceDocument } from "../blueprint-studio/fixtures/meem-global-reference";
import {
  BLUEPRINT_SNAPSHOT_SCHEMA_VERSION,
  buildSnapshotEnvelope,
  validateSnapshotEnvelope,
} from "./snapshot-validation";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const document = buildMeemGlobalReferenceDocument();
assert(document !== null, "Meem reference document available");

const valid = validateSnapshotEnvelope(buildSnapshotEnvelope(document!));
assert(valid.ok === true, "valid envelope passes validation");

const badVersion = validateSnapshotEnvelope({
  schemaVersion: "0.0.0",
  document,
});
assert(badVersion.ok === false, "wrong schema version fails");

const missingDoc = validateSnapshotEnvelope({ schemaVersion: BLUEPRINT_SNAPSHOT_SCHEMA_VERSION });
assert(missingDoc.ok === false, "missing document fails");

console.log("blueprint-runtime/snapshot-validation: OK");
