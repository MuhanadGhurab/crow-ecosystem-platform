#!/usr/bin/env node
/**
 * Stop and remove Gate-created disposable PostgreSQL containers/volumes for GHURAVIA local validation.
 * Does not touch unrelated Docker resources.
 */
import { execSync } from "node:child_process";

const NAMES = ["ghuravia-ci-pg", "ghuravia-val-1b-pg", "ghuravia-0c-pg"];

function sh(cmd) {
  try {
    return execSync(cmd, { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

let removed = 0;
for (const name of NAMES) {
  const id = sh(`docker ps -aq --filter name=${name}`);
  if (!id) continue;
  for (const one of id.split(/\s+/).filter(Boolean)) {
    console.log(`Removing container matching ${name} (${one})`);
    sh(`docker rm -f ${one}`);
    removed += 1;
  }
}

const volumes = sh("docker volume ls -q")
  .split("\n")
  .map((v) => v.trim())
  .filter((v) => /ghuravia/i.test(v));
for (const vol of volumes) {
  console.log(`Removing volume ${vol}`);
  sh(`docker volume rm -f ${vol}`);
  removed += 1;
}

console.log(`db:cleanup complete — removed ${removed} Gate-related resources`);
