import fs from "node:fs";
import path from "node:path";

const root = path.resolve("_site");

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

function decode(html) {
  return html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

const files = walk(root);
const raw = files.map((file) => fs.readFileSync(file, "utf8")).join("\n");
const text = decode(raw);
const expected = fs
  .readFileSync(new URL("./expected-urls.txt", import.meta.url), "utf8")
  .split(/\n/)
  .map((line) => line.trim())
  .filter(Boolean);
const phrases = fs
  .readFileSync(new URL("./required-phrases.txt", import.meta.url), "utf8")
  .split(/\n/)
  .map((line) => line.trim())
  .filter(Boolean);

let failed = 0;
function fail(message) {
  failed += 1;
  console.error(message);
}

for (const url of expected) {
  if (!raw.includes(url) && !raw.includes(url.replace(/&/g, "&amp;"))) {
    fail(`missing url ${url}`);
  }
}

for (const phrase of phrases) {
  if (!text.includes(phrase)) fail(`missing phrase ${phrase}`);
}

const found = new Set();
const re = /https?:\/\/[^\s"'<>]+/g;
for (const match of raw.matchAll(re)) {
  found.add(match[0].replace(/[),.;，。；、]+$/g, ""));
}

const allowPrefix = ["https://iforgotid.github.io", "http://www.w3.org/2000/svg"];
for (const url of found) {
  if (expected.includes(url)) continue;
  if (allowPrefix.some((prefix) => url.startsWith(prefix))) continue;
  fail(`unexpected url ${url}`);
}

if (!raw.includes('href="/ai-risk/briefs/"')) fail("archive link is missing the /ai-risk/ prefix");
if (raw.includes("/ai-risk/ai-risk")) fail("path prefix doubled");
if (!raw.includes('href="https://iforgotid.github.io/ai-risk/"')) fail("home canonical URL is wrong");
if (raw.includes("https://iforgotid.github.io/circular")) fail("canonical URL dropped the project path");

const index = decode(fs.readFileSync(path.join(root, "index.html"), "utf8"));
for (const bit of ["系统性", "低到中", "局部", "CoreWeave 及高杠杆新云", "关键警报信号", "最新简报"]) {
  if (!index.includes(bit)) fail(`homepage missing ${bit}`);
}

const circular = decode(fs.readFileSync(path.join(root, "circular/index.html"), "utf8"));
for (const bit of ["1085 亿美元", "1050 亿美元", "以后每周怎么追加", "供应商信用", "股权换算力"]) {
  if (!circular.includes(bit)) fail(`circular page missing ${bit}`);
}

const indicators = decode(fs.readFileSync(path.join(root, "indicators/index.html"), "utf8"));
for (const bit of ["CoreWeave 5 年期 CDS", "英伟达应收账款", "1140bp", "$3.03/小时", "316 亿美元"]) {
  if (!indicators.includes(bit)) fail(`indicators page missing ${bit}`);
}

if (failed) {
  console.error(`${failed} checks failed`);
  process.exit(1);
}

console.log(`ok: ${expected.length} urls, ${phrases.length} phrases, ${files.length} pages`);
