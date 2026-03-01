import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const extensions = ['.ts', '.tsx', '.js', '.mjs', '.cjs'];
const excludeDirs = ['node_modules', 'dist', '.nx', '.git'];

// Runtime identifiers to replace (order matters - more specific patterns first)
const replacements = [
  // Annotation types
  ['SQAI_DUMP_ANNOTATION', 'SQAI_DUMP_ANNOTATION'],
  // Script types  
  ['sqai_web_dump', 'sqai_web_dump'],
  // Window globals
  ['__SQAI_NEW_TAB_INTERCEPTOR_INITIALIZED__', '__SQAI_NEW_TAB_INTERCEPTOR_INITIALIZED__'],
  // Element inspector
  ['sqai_element_inspector', 'sqai_element_inspector'],
  // Agent names
  ['sqai_puppeteer_agent', 'sqai_puppeteer_agent'],
  // Temp file prefixes  
  ['sqai-dump-', 'sqai-dump-'],
  ['sqai-test-', 'sqai-test-'],
  ['sqai-puppeteer-endpoint', 'sqai-puppeteer-endpoint'],
  ['sqai-puppeteer-profile', 'sqai-puppeteer-profile'],
  // DOM/CSS IDs
  ['sqai-force-select-rendering', 'sqai-force-select-rendering'],
  // CLI names
  ['sqai-web', 'sqai-web'],
  // Directory names (in test expectations and code, not env vars)
  ["'sqai_run'", "'sqai_run'"],
  ['"sqai_run"', '"sqai_run"'],
  ['`sqai_run`', '`sqai_run`'],
  ['sqai_run/', 'sqai_run/'],
  ['/sqai_run', '/sqai_run'],
];

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!excludeDirs.includes(entry.name)) {
        yield* walk(path);
      }
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      yield path;
    }
  }
}

let filesChanged = 0;
let totalReplacements = 0;

console.log('Replacing runtime identifiers...\n');

for await (const file of walk('.')) {
  try {
    let content = await readFile(file, 'utf8');
    let changed = false;
    let fileReplacements = 0;
    
    for (const [oldStr, newStr] of replacements) {
      if (content.includes(oldStr)) {
        const count = (content.match(new RegExp(oldStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
        content = content.replaceAll(oldStr, newStr);
        changed = true;
        fileReplacements += count;
      }
    }
    
    if (changed) {
      await writeFile(file, content, 'utf8');
      filesChanged++;
      totalReplacements += fileReplacements;
      console.log(`✓ ${file} (${fileReplacements} replacements)`);
    }
  } catch (err) {
    console.error(`✗ ${file}: ${err.message}`);
  }
}

console.log(`\n✅ Complete: ${filesChanged} files changed, ${totalReplacements} total replacements`);
