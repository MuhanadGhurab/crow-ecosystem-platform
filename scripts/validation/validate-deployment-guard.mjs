import { readFile } from "node:fs/promises";

const v = JSON.parse(await readFile("vercel.json", "utf8"));
const foundation = v?.git?.deploymentEnabled?.["feat/ghuravia-foundation"];

if (foundation === false) {
  console.log("Deployment guard preserved (Preview locked)");
} else if (foundation === true) {
  // Controlled Preview: Git Preview deploys for the foundation branch only.
  // Production remains bound to the project's production branch (main), not this Gate.
  const auth = await readFile(
    "governance/implementation/GHV.IMPLEMENTATION.0G-AUTHORIZATION.md",
    "utf8",
  );
  if (
    !auth.includes("GHV-IMP-AUTH-007") ||
    !auth.includes("**GRANTED**") ||
    !auth.includes("controlled Preview")
  ) {
    throw new Error(
      "Foundation Preview deploy requires GHV-IMP-AUTH-007 GRANTED for controlled Preview",
    );
  }
  if (v?.git?.deploymentEnabled?.main === false) {
    throw new Error(
      "Deployment guard weakened: main must not be disabled by 0G Preview enablement",
    );
  }
  console.log(
    "Deployment guard: controlled Preview enabled under GHV-IMP-AUTH-007; Production not authorized from foundation branch",
  );
} else {
  throw new Error(
    "Foundation branch deploymentEnabled must be boolean true|false",
  );
}
