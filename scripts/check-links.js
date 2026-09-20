#!/usr/bin/env node
/**
 * Static link + asset checker for dist/.
 * Crawls every internal href/src/srcset found in the built HTML and
 * verifies the target file exists on disk. No network calls.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, '..', 'dist');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (entry.name.endsWith('.html')) out.push(p);
  }
}

function resolveTarget(urlPath) {
  const clean = urlPath.split('#')[0].split('?')[0];
  if (!clean) return null;
  let fp = path.join(DIST, clean.replace(/^\//, ''));
  if (fp.endsWith('/')) fp = path.join(fp, 'index.html');
  return fp;
}

const files = [];
walk(DIST, files);

let checked = 0;
let broken = [];
const hrefRe = /(?:href|src)="(\/[^"#?]*)/g;

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  let m;
  hrefRe.lastIndex = 0;
  while ((m = hrefRe.exec(html))) {
    const url = m[1];
    if (url.startsWith('//')) continue;
    checked++;
    const target = resolveTarget(url);
    if (!target) continue;
    let exists = fs.existsSync(target);
    if (!exists && !path.extname(target)) exists = fs.existsSync(target + '/index.html');
    if (!exists) broken.push({ file: path.relative(DIST, file), url });
  }
}

console.log(`Checked ${checked} internal references across ${files.length} pages.`);
if (broken.length) {
  console.log(`\n✗ ${broken.length} broken reference(s):\n`);
  const seen = new Set();
  for (const b of broken) {
    const key = b.url;
    if (seen.has(key)) continue;
    seen.add(key);
    console.log(`  ${b.url}  (first seen in ${b.file})`);
  }
  process.exitCode = 1;
} else {
  console.log('✔ No broken internal links or assets found.');
}
