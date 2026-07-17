import { buildMeemGlobalReferenceDocument } from "../blueprint-studio/fixtures/meem-global-reference";
import { projectClientSafeBlueprint } from "./blueprint-projection.service";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const base = buildMeemGlobalReferenceDocument();
assert(base !== null, "Meem reference document available");
const ref = base!;

const withInternal = {
  ...ref,
  slices: [
    ...ref.slices,
    {
      id: "internal-1",
      type: "internal_notes",
      title: "Privileged operator notes",
      content: "Must not leak",
      marginPercent: 42,
    } as unknown as (typeof ref.slices)[number],
  ],
  assumptions: [...ref.assumptions, "internal margin guidance"],
};

const projected = projectClientSafeBlueprint(withInternal);
assert(projected.advisoryOnly === true, "client projection is advisory");
assert(
  !projected.slices.some((s) => (s as { type?: string }).type === "internal_notes"),
  "internal slices excluded"
);
assert(
  !projected.assumptions.some((a) => a.toLowerCase().includes("internal")),
  "internal assumptions filtered"
);
const serialized = JSON.stringify(projected);
assert(!serialized.includes("marginPercent"), "redacted keys absent from projection");

console.log("blueprint-runtime/projection: OK");
