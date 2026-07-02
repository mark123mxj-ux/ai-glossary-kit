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

const vm = require("vm");
const context = { console, crypto };
context.globalThis = context;
vm.createContext(context);
for (const file of ["src/schema.js", "src/parser.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}

const sampleCard = [
  "Codex explanation before the card.",
  "",
  "Glossary Card",
  "```text",
  "词条：SDR",
  "英文全称：Sales Development Representative",
  "中文名：销售开发代表",
  "一句话解释：负责寻找、筛选并预约潜在客户的人。",
  "主题：Sales",
  "相关词：ICP, MQL, SQL",
  "标签：Sales, Growth",
  "来源工具：Codex",
  "备注：",
  "```"
].join("\n");
const parsed = context.AIGlossaryParser.parseGlossaryText(sampleCard);
if (parsed.terms.length !== 1) throw new Error("Parser failed to read a fenced glossary card.");
if (parsed.terms[0].term !== "SDR") throw new Error("Parser returned the wrong term.");
if (parsed.terms[0].notes.includes("```")) throw new Error("Parser leaked code fences into notes.");

const webHtml = fs.readFileSync(path.join(root, "web/index.html"), "utf8");
const popupHtml = fs.readFileSync(path.join(root, "extension/popup.html"), "utf8");

for (const asset of ["../src/schema.js", "../src/parser.js", "../src/storage.js", "../src/seed.js"]) {
  if (!webHtml.includes(asset)) throw new Error(`web/index.html does not include ${asset}`);
}

for (const asset of ["../src/schema.js", "../src/parser.js", "../src/storage.js", "../src/seed.js"]) {
  if (!popupHtml.includes(asset)) throw new Error(`popup.html does not include ${asset}`);
}

console.log("ai-glossary-kit check passed.");
