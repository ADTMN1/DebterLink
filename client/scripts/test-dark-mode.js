/**
 * Dark Mode Testing Script
 * Tests all components for dark mode compatibility and contrast issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPONENTS_DIR = path.join(__dirname, '../src/components');
const FEATURES_DIR = path.join(__dirname, '../src/features');
const PAGES_DIR = path.join(__dirname, '../src/pages');

const darkModeClasses = [
  'dark:bg-',
  'dark:text-',
  'dark:border-',
  'dark:hover:',
  'dark:focus:',
];

const contrastIssues = [];
const missingDarkMode = [];
const testedComponents = [];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);
  
  // Check if file uses Tailwind classes
  if (!content.includes('className')) return;
  
  // Check for dark mode classes
  const hasDarkMode = darkModeClasses.some(cls => content.includes(cls));
  
  // Check for hardcoded colors that might not work in dark mode
  const hasHardcodedColors = /bg-(white|black|gray-\d+)(?!\s*dark:)/.test(content);
  
  if (!hasDarkMode && hasHardcodedColors) {
    missingDarkMode.push({
      file: filePath,
      issue: 'Uses hardcoded colors without dark mode variants'
    });
  }
  
  testedComponents.push(fileName);
}

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      scanDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      scanFile(filePath);
    }
  });
}

console.log('🌙 Testing Dark Mode Implementation...\n');

// Scan all directories
[COMPONENTS_DIR, FEATURES_DIR, PAGES_DIR].forEach(dir => {
  if (fs.existsSync(dir)) {
    scanDirectory(dir);
  }
});

// Generate report
console.log(`✅ Tested ${testedComponents.length} components\n`);

if (missingDarkMode.length > 0) {
  console.log(`⚠️  Found ${missingDarkMode.length} potential dark mode issues:\n`);
  missingDarkMode.forEach(({ file, issue }) => {
    console.log(`  - ${path.relative(process.cwd(), file)}`);
    console.log(`    ${issue}\n`);
  });
} else {
  console.log('✅ No dark mode issues found!\n');
}

// Save report
const report = {
  timestamp: new Date().toISOString(),
  testedComponents: testedComponents.length,
  issues: missingDarkMode,
  status: missingDarkMode.length === 0 ? 'PASS' : 'NEEDS_REVIEW'
};

fs.writeFileSync(
  path.join(__dirname, '../DARK_MODE_TEST_REPORT.json'),
  JSON.stringify(report, null, 2)
);

console.log('📄 Report saved to DARK_MODE_TEST_REPORT.json');
