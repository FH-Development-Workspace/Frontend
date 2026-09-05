#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SNIPPET_ROOT = `  <script src="js/maintenance.js"></script>
  <script src="js/maintenance-preview.js"></script>
  <script src="js/maintenance-check.js"></script>`;
const SNIPPET_NESTED = `  <script src="../js/maintenance.js"></script>
  <script src="../js/maintenance-preview.js"></script>
  <script src="../js/maintenance-check.js"></script>`;

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules' || name === 'scripts') continue;
    const fp = path.join(dir, name);
    if (fs.statSync(fp).isDirectory()) walk(fp, out);
    else if (name.endsWith('.html')) out.push(fp);
  }
  return out;
}

function isExcluded(fp) {
  const rel = path.relative(ROOT, fp).replace(/\\/g, '/').toLowerCase();
  if (rel === 'pages/maintenance.html') return true;
  if (rel.startsWith('status/')) return true;
  if (rel.startsWith('tiktok/')) return true;
  return false;
}

let updated = 0;
for (const fp of walk(ROOT)) {
  if (isExcluded(fp)) continue;
  let html = fs.readFileSync(fp, 'utf8');
  if (html.includes('maintenance-check.js')) {
    if (!html.includes('maintenance-preview.js')) {
      html = html.replace(
        /(<script src="(\.\.\/)?js\/maintenance\.js"><\/script>\s*\n)/,
        '$1  <script src="$2js/maintenance-preview.js"></script>\n'
      );
      fs.writeFileSync(fp, html, 'utf8');
      updated++;
      console.log('added preview:', path.relative(ROOT, fp));
    }
    continue;
  }

  const nested = fp.includes(path.sep + 'pages' + path.sep) || fp.includes(path.sep + 'auth' + path.sep);
  const snippet = nested ? SNIPPET_NESTED : SNIPPET_ROOT;

  if (html.includes('<meta charset="UTF-8" />')) {
    html = html.replace('<meta charset="UTF-8" />', '<meta charset="UTF-8" />\n' + snippet);
  } else if (html.includes('<meta charset="UTF-8"/>')) {
    html = html.replace('<meta charset="UTF-8"/>', '<meta charset="UTF-8"/>\n' + snippet);
  } else {
    continue;
  }

  html = html.replace(/\n  <script src="(\.\.\/)?js\/config\.js"><\/script>\n  <script src="\1js\/maintenance\.js"><\/script>\n  <script src="\1js\/maintenance-check\.js"><\/script>/g,
    '\n' + snippet);

  fs.writeFileSync(fp, html, 'utf8');
  updated++;
  console.log('injected:', path.relative(ROOT, fp));
}
console.log(`Done. ${updated} file(s) updated.`);
