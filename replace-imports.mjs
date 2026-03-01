import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function getAllFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, dist, build, etc.
      if (!['node_modules', 'dist', 'build', '.next', 'extension_output', 'doc_build', '.git'].includes(file)) {
        getAllFiles(filePath, fileList);
      }
    } else if (stat.isFile() && /\.(ts|tsx|js|mjs|cjs)$/.test(file)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

console.log('Starting replacement of @sqaitech/ with @sqaitech/...\n');

const files = getAllFiles('.');
let totalReplacements = 0;
let filesUpdated = 0;

files.forEach(file => {
  try {
    const content = readFileSync(file, 'utf8');
    
    if (content.includes('@sqaitech/')) {
      const newContent = content.replace(/@midscene\//g, '@sqaitech/');
      const matches = (content.match(/@midscene\//g) || []).length;
      
      totalReplacements += matches;
      filesUpdated++;
      
      writeFileSync(file, newContent, 'utf8');
      console.log(`Updated: ${file} (${matches} replacements)`);
    }
  } catch (error) {
    console.warn(`Error processing ${file}:`, error.message);
  }
});

console.log('\n===============================================');
console.log('Replacement Complete!');
console.log('===============================================');
console.log(`Files Updated: ${filesUpdated}`);
console.log(`Total Replacements: ${totalReplacements}`);
console.log('===============================================');
