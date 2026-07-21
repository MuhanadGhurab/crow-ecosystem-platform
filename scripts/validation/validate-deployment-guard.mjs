import { readFile } from "node:fs/promises";
const v = JSON.parse(await readFile("vercel.json", "utf8"));
if (v?.git?.deploymentEnabled?.["feat/ghuravia-foundation"] !== false)
  throw new Error("Foundation branch deployment guard weakened");
console.log("Deployment guard preserved");
