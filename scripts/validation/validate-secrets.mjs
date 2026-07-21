import { execFileSync } from "node:child_process";

const tracked = execFileSync("git", ["ls-files"], { encoding: "utf8" }).split(
  "\n",
);
if (
  tracked.some((path) =>
    path
      .split("/")
      .some((segment) => segment === ".env" || segment.startsWith(".env.")),
  )
) {
  throw new Error("Tracked .env file");
}
console.log("No tracked environment files");
