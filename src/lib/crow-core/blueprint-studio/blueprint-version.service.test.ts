import {
  approveBlueprintVersionSnapshot,
  assertVersionMutable,
  clearBlueprintVersionStore,
  createBlueprintVersionSnapshot,
  listBlueprintVersions,
} from "./blueprint-version.service";
import { buildMeemGlobalReferenceDocument } from "./fixtures/meem-global-reference";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

clearBlueprintVersionStore();
const meemDocument = buildMeemGlobalReferenceDocument();
assert(meemDocument !== null, "Meem reference document available");

const document = {
  ...meemDocument!,
  ref: {
    ...meemDocument!.ref,
    status: "draft" as const,
    approvedAtIso: null,
  },
};

const v1 = createBlueprintVersionSnapshot(document, { versionId: "bvs-test-001" });
const v2 = createBlueprintVersionSnapshot(document, {
  parentVersionId: v1.id,
  versionId: "bvs-test-002",
});

assert(v1.contentHash.length === 64, "content hash is sha256 hex");
assert(v2.parentVersionId === v1.id, "parent version chain");
assert(listBlueprintVersions(document.ref.blueprintId).length === 2, "two versions stored");

const approved = approveBlueprintVersionSnapshot(v1.id);
assert(approved.ref.status === "approved", "approved status set");

let threw = false;
try {
  assertVersionMutable(approved);
} catch {
  threw = true;
}
assert(threw, "approved snapshot is immutable");

console.log("blueprint-studio/version: OK");
