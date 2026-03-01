import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const extensions = ['.ts', '.tsx', '.js', '.mjs', '.cjs'];
const excludeDirs = ['node_modules', 'dist', '.nx', '.git'];

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
let replacements = 0;

console.log('Replacing @sqaitech/ with @sqaitech/ in all source files...\n');

for await (const file of walk('.')) {
  try {
    const content = await readFile(file, 'utf8');
    if (content.includes('@sqaitech/')) {
      const newContent = content.replaceAll('@sqaitech/', '@sqaitech/');
      const count = (content.match(/@midscene\//g) || []).length;
      await writeFile(file, newContent, 'utf8');
      filesChanged++;
      replacements += count;
      console.log(`✓ ${file} (${count} replacements)`);
    }
  } catch (err) {
    console.error(`✗ ${file}: ${err.message}`);
  }
}

console.log(`\n✅ Complete: ${filesChanged} files changed, ${replacements} total replacements`);
