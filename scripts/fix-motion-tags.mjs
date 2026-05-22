/**
 * Replace invalid <motion> / </motion> tags with semantic <div> in src/.
 */
import fs from "node:fs";
import path from "node:path";

const SRC = path.join(process.cwd(), "src");

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, name.name);
    if (name.isDirectory()) walk(p, files);
    else if (/\.(tsx|jsx)$/.test(name.name)) files.push(p);
  }
  return files;
}

let fixed = 0;
for (const file of walk(SRC)) {
  let text = fs.readFileSync(file, "utf8");
  const before = text;
  text = text.replace(/<motion(\s|>)/g, "<div$1");
  text = text.replace(/<\/motion>/g, "</div>");
  text = text.replace(/<motion\./g, "<motion.");
  if (text !== before) {
    fs.writeFileSync(file, text);
    console.log("Fixed:", path.relative(process.cwd(), file));
    fixed++;
  }
}

console.log(fixed ? `Done. ${fixed} file(s) updated.` : "No motion tags found.");
