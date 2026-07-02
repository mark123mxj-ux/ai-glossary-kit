const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const requiredFiles = [
  "manifest.json",
  "src/schema.js",
  "src/parser.js",
  "src/storage.js",
  "src/seed.js",
  "web/index.html",
  "web/styles.css",
  "web/app.js",
  "extension/background.js",
  "extension/popup.html",
  "extension/popup.css",
  "extension/popup.js",
  "README.md",
  "LICENSE",
  "docs/card-protocol.md",
  "prompts/glossary-card-prompt.md"
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) {
  throw new Error(`Missing files:\n${missing.join("\n")}`);
}

JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

const jsFiles = requiredFiles.filter((file) => file.endsWith(".js"));
for (const file of jsFiles) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  new Function(source);
}

const webHtml = fs.readFileSync(path.join(root, "web/index.html"), "utf8");
const popupHtml = fs.readFileSync(path.join(root, "extension/popup.html"), "utf8");

for (const asset of ["../src/schema.js", "../src/parser.js", "../src/storage.js", "../src/seed.js"]) {
  if (!webHtml.includes(asset)) throw new Error(`web/index.html does not include ${asset}`);
}

for (const asset of ["../src/schema.js", "../src/parser.js", "../src/storage.js", "../src/seed.js"]) {
  if (!popupHtml.includes(asset)) throw new Error(`popup.html does not include ${asset}`);
}

console.log("ai-glossary-kit check passed.");
