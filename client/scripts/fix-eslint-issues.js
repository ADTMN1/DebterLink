#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

const log = (msg, color = 'reset') => console.log(`${COLORS[color]}${msg}${COLORS.reset}`);

const fixes = {
  'unescaped-entities': (content) => {
    return content
      .replace(/(\w)'(\w)/g, '$1&apos;$2')
      .replace(/don't/gi, 'don&apos;t')
      .replace(/can't/gi, 'can&apos;t')
      .replace(/won't/gi, 'won&apos;t')
      .replace(/shouldn't/gi, 'shouldn&apos;t')
      .replace(/couldn't/gi, 'couldn&apos;t')
      .replace(/wouldn't/gi, 'wouldn&apos;t');
  },

  'localStorage-safety': (content) => {
    return content.replace(
      /localStorage\.(getItem|setItem|removeItem)\(/g,
      (match) => {
        const method = match.match(/\.(getItem|setItem|removeItem)/)[1];
        return `safeLocalStorage.${method}(`;
      }
    );
  },

  'impure-render': (content) => {
    const dateNowPattern = /const\s+(\w+)\s*=\s*Date\.now\(\)/g;
    content = content.replace(dateNowPattern, 'const [$1] = useState(() => Date.now())');
    
    const mathRandomPattern = /const\s+(\w+)\s*=\s*Math\.random\(\)/g;
    content = content.replace(mathRandomPattern, 'const [$1] = useState(() => Math.random())');
    
    return content;
  }
};

const safeLocalStorageUtil = `export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch {}
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {}
  }
};
`;

function processFile(filePath, fixType) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    
    if (fixes[fixType]) {
      content = fixes[fixType](content);
    }
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    log(`Error processing ${filePath}: ${error.message}`, 'red');
    return false;
  }
}

function findFiles(dir, pattern, results = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !['node_modules', 'dist', 'build'].includes(file)) {
      findFiles(filePath, pattern, results);
    } else if (pattern.test(file)) {
      results.push(filePath);
    }
  });
  
  return results;
}

function runPhase(phase) {
  log(`\n${'='.repeat(60)}`, 'blue');
  log(`Phase ${phase.id}: ${phase.name}`, 'blue');
  log('='.repeat(60), 'blue');
  
  phase.tasks.forEach(task => {
    log(`\n→ ${task.description}`, 'yellow');
    
    if (task.action === 'fix-files') {
      const files = findFiles(task.dir, task.pattern);
      log(`  Found ${files.length} files`, 'blue');
      
      let fixed = 0;
      files.forEach(file => {
        if (processFile(file, task.fixType)) {
          fixed++;
          log(`  ✓ Fixed: ${path.basename(file)}`, 'green');
        }
      });
      
      log(`  ${fixed}/${files.length} files modified`, fixed > 0 ? 'green' : 'yellow');
    } else if (task.action === 'create-util') {
      const utilPath = path.join(task.dir, task.filename);
      if (!fs.existsSync(utilPath)) {
        fs.writeFileSync(utilPath, task.content, 'utf8');
        log(`  ✓ Created: ${task.filename}`, 'green');
      } else {
        log(`  ⊘ Already exists: ${task.filename}`, 'yellow');
      }
    } else if (task.action === 'run-command') {
      try {
        execSync(task.command, { stdio: 'inherit' });
        log(`  ✓ Command executed`, 'green');
      } catch (error) {
        log(`  ✗ Command failed`, 'red');
      }
    }
  });
}

const phases = [
  {
    id: 1,
    name: 'Fix Unescaped Entities',
    tasks: [
      {
        description: 'Fix apostrophes and quotes in JSX',
        action: 'fix-files',
        dir: path.join(__dirname, '../src'),
        pattern: /\.(tsx|jsx)$/,
        fixType: 'unescaped-entities'
      }
    ]
  },
  {
    id: 2,
    name: 'Add localStorage Safety',
    tasks: [
      {
        description: 'Create safe localStorage utility',
        action: 'create-util',
        dir: path.join(__dirname, '../src/lib'),
        filename: 'safe-storage.ts',
        content: safeLocalStorageUtil
      },
      {
        description: 'Replace localStorage calls',
        action: 'fix-files',
        dir: path.join(__dirname, '../src'),
        pattern: /\.(ts|tsx)$/,
        fixType: 'localStorage-safety'
      }
    ]
  },
  {
    id: 3,
    name: 'Fix Impure Render Functions',
    tasks: [
      {
        description: 'Move Date.now() and Math.random() to useState',
        action: 'fix-files',
        dir: path.join(__dirname, '../src'),
        pattern: /\.(tsx|ts)$/,
        fixType: 'impure-render'
      }
    ]
  },
  {
    id: 4,
    name: 'Run ESLint Auto-fix',
    tasks: [
      {
        description: 'Run ESLint with --fix flag',
        action: 'run-command',
        command: 'npm run lint -- --fix'
      }
    ]
  }
];

function main() {
  const args = process.argv.slice(2);
  const phaseArg = args.find(arg => arg.startsWith('--phase='));
  
  log('\n🔧 ESLint Issue Fixer', 'blue');
  log('='.repeat(60), 'blue');
  
  if (phaseArg) {
    const phaseId = parseInt(phaseArg.split('=')[1]);
    const phase = phases.find(p => p.id === phaseId);
    
    if (phase) {
      runPhase(phase);
    } else {
      log(`Phase ${phaseId} not found`, 'red');
    }
  } else {
    log('\nAvailable phases:', 'yellow');
    phases.forEach(p => log(`  ${p.id}. ${p.name}`, 'blue'));
    log('\nUsage: node fix-eslint-issues.js --phase=<number>', 'yellow');
    log('   or: node fix-eslint-issues.js --all\n', 'yellow');
    
    if (args.includes('--all')) {
      phases.forEach(runPhase);
    }
  }
  
  log('\n✓ Done!\n', 'green');
}

main();
