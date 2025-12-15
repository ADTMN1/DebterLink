/**
 * Script to help identify components missing JSDoc documentation
 * Run: node scripts/add-component-docs.js
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const componentsDir = './src/components/ui';
const files = readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

console.log('Component Documentation Status\n');
console.log('=' .repeat(50));

let documented = 0;
let undocumented = 0;

files.forEach(file => {
  const filePath = join(componentsDir, file);
  const content = readFileSync(filePath, 'utf-8');
  
  const hasModuleDoc = content.includes('@module');
  const hasComponentDoc = content.includes('@component');
  const hasExample = content.includes('@example');
  
  const status = hasModuleDoc && hasComponentDoc ? '✅' : '❌';
  
  if (hasModuleDoc && hasComponentDoc) {
    documented++;
  } else {
    undocumented++;
    console.log(`${status} ${file}`);
    if (!hasModuleDoc) console.log('   Missing: @module');
    if (!hasComponentDoc) console.log('   Missing: @component');
    if (!hasExample) console.log('   Missing: @example');
  }
});

console.log('\n' + '='.repeat(50));
console.log(`Documented: ${documented}/${files.length}`);
console.log(`Undocumented: ${undocumented}/${files.length}`);
console.log(`Progress: ${Math.round((documented / files.length) * 100)}%`);
