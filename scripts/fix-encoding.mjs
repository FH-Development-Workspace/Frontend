#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const REPLACEMENTS = [
  ['ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â', '—'],
  ['Ã¢â€ â€™', '→'],
  ['ÃƒÂ¢Ã¢â‚¬Â Ã‚Â', '← '],
  ['ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦', '…'],
  ['Ã¢â‚¬Â¦', '…'],
  ['Ãƒâ€šÃ‚Â©', '©'],
  ['Ã‚Â©', '©'],
  ['ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å"', '–'],
  ['ÃƒÂ¢Ã…â€œÃ¢â‚¬Å"', '✓'],
  ['ÃƒÂ¢Ã…â€œÃ‚Â¨', '✨'],
  ['ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ‚Â', '🔍'],
  ['ÃƒÂ°Ã…Â¸Ã‚ÂÃ‚Âª', ''],
  ['ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢', '•'],
  ['Ã¢â‚¬â€œ', '–'],
  ['Ã¢â‚¬â„¢', "'"],
  ['Ã¢â‚¬Å"', '"'],
  ['Ã¢â‚¬Â', '—'],
  ['â€™', "'"],
  ['â€œ', '"'],
  ['â€', '—'],
  ['Â©', '©'],
  ['â†‘', '↑'],
];

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules') continue;
    const fp = path.join(dir, name);
    if (fs.statSync(fp).isDirectory()) walk(fp, out);
    else if (name.endsWith('.html')) out.push(fp);
  }
  return out;
}

function fixContent(raw) {
  let text = raw;
  for (const [from, to] of REPLACEMENTS) {
    text = text.split(from).join(to);
  }
  // Clean corrupted HTML comments (box-drawing mojibake)
  text = text.replace(/<!--[\s\S]*?-->/g, (comment) => {
    if (/[Ãâ][\s\S]*?-->/.test(comment) || comment.includes('â”') || comment.includes('Ã¢â€')) {
      return '<!-- section -->';
    }
    return comment;
  });
  // Password placeholder blobs
  text = text.replace(/placeholder="(?:•\s*){4,}"/g, 'placeholder="Enter your password"');
  text = text.replace(/placeholder="(?:•){4,}"/g, 'placeholder="Enter your password"');
  // Cookie banner text damaged by prior cleanup
  text = text.replace(
    /We use cookies<a href/g,
    'We use cookies to improve your experience. By continuing, you agree to our <a href'
  );
  text = text.replace(/—\u009d/g, '—');
  text = text.replace(/—"/g, '—');
  text = text.replace(/Start a Project [^<]+/g, 'Start a Project →');
  text = text.replace(/Start a Custom Project [^<]+/g, 'Start a Custom Project →');
  text = text.replace(/Name A[^<]+Z<\/option>/g, 'Name A–Z</option>');
  text = text.replace(/↑[^<]*18%/g, '↑ 18%');
  text = text.replace(/↑[^<]*24%/g, '↑ 24%');
  text = text.replace(/Ã¢[^<]*18%/g, '↑ 18%');
  text = text.replace(/Ã¢[^<]*24%/g, '↑ 24%');
  text = text.replace(/<script>\s*const posts =[\s\S]*?<\/script>\s*/g, '');
  text = text.replace(/<script>\s*const downloads =[\s\S]*?<\/script>\s*/g, '');
  return text;
}

let changed = 0;
for (const fp of walk(ROOT)) {
  const raw = fs.readFileSync(fp, 'utf8');
  const fixed = fixContent(raw);
  if (fixed !== raw) {
    fs.writeFileSync(fp, fixed, 'utf8');
    changed++;
    console.log('fixed:', path.relative(ROOT, fp));
  }
}
console.log(`Done. ${changed} file(s) updated.`);
