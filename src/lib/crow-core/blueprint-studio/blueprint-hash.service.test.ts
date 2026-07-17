import { hashBlueprintDocument } from "./blueprint-hash.service";
import { buildMeemGlobalReferenceDocument } from "./fixtures/meem-global-reference";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const document = buildMeemGlobalReferenceDocument();
assert(document !== null, "Meem reference document available");

const h1 = hashBlueprintDocument(document!);
const h2 = hashBlueprintDocument(document!);
assert(h1 === h2, "hash is deterministic");
assert(h1.length === 64, "sha256 hex length");

console.log("blueprint-studio/hash: OK");
