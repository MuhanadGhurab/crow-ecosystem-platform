import { buildMeemGlobalReferenceDocument } from "../blueprint-studio/fixtures/meem-global-reference";
import { buildSnapshotEnvelope } from "./snapshot-validation";
import { hashBlueprintSnapshotDocument, hashSnapshotEnvelope } from "./snapshot-hash";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const document = buildMeemGlobalReferenceDocument();
assert(document !== null, "Meem reference document available");

const envelope = buildSnapshotEnvelope(document!);
const h1 = hashSnapshotEnvelope(envelope);
const h2 = hashSnapshotEnvelope(envelope);
assert(h1 === h2, "snapshot hash is deterministic");
assert(h1.length === 64, "sha256 hex length");

const docHash = hashBlueprintSnapshotDocument(document!);
assert(docHash === h1, "document helper matches envelope hash");

const mutated = buildSnapshotEnvelope({
  ...document!,
  assumptions: [...document!.assumptions, "extra-assumption"],
});
assert(hashSnapshotEnvelope(mutated) !== h1, "material content change alters hash");

console.log("blueprint-runtime/snapshot-hash: OK");
