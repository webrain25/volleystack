const fs = require('fs');
const path = require('path');
const pagesDir = path.join(process.cwd(), 'src/pages');

const replacements = {
  'bg-white': 'bg-bg-primary',
  'dark:bg-[\\#0a0a0a]': '',
  'dark:bg-[#0a0a0a]': '',
  'bg-gray-50': 'bg-surface',
  'dark:bg-gray-900/50': 'bg-surface-hover',
  'dark:bg-gray-900': '',
  'dark:bg-gray-950': '',
  'bg-gray-100': 'bg-surface-hover',
  'dark:bg-gray-800': '',
  'dark:bg-black': '',
  'border-gray-200': 'border-border',
  'dark:border-[#262626]': '',
  'dark:border-gray-700': '',
  'border-gray-100': 'border-border/50',
  'border-gray-300': 'border-border',
  'text-gray-900': 'text-white',
  'dark:text-gray-100': '',
  'dark:text-white': '',
  'text-gray-700': 'text-text-primary',
  'text-gray-600': 'text-text-secondary',
  'text-gray-500': 'text-text-tertiary',
  'text-gray-400': 'text-text-tertiary',
  'dark:text-gray-400': '',
  'dark:text-gray-300': '',
  'dark:text-gray-200': '',
  'dark:text-gray-500': '',
  'text-primary-600': 'text-brand-blue',
  'text-primary-500': 'text-brand-blue-bright',
  'bg-primary-50': 'bg-brand-blue/10',
  'border-primary-100': 'border-brand-blue/20',
  'dark:text-primary-500': '',
  'dark:text-primary-400': '',
  'hover:text-primary-700': 'hover:text-brand-blue-bright',
  'hover:bg-gray-50': 'hover:bg-surface-hover',
  'bg-amber-50': 'bg-warning/10',
  'text-amber-600': 'text-warning',
  'border-amber-200': 'border-warning/20',
  'dark:bg-amber-950/20': '',
  'dark:border-amber-900/50': '',
  'text-emerald-600': 'text-success',
  'bg-emerald-50': 'bg-success/10',
  'border-emerald-100': 'border-success/20',
  'dark:text-emerald-500': '',
  'dark:bg-emerald-950/20': '',
  'dark:border-emerald-900/50': '',
  'text-red-600': 'text-danger',
  'bg-red-50': 'bg-danger/10',
  'border-red-200': 'border-danger/20',
};

const processDir = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') && !['Dashboard.tsx', 'Team.tsx', 'Login.tsx', 'Register.tsx'].includes(file)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Add framer-motion if not imported
      if (!content.includes('framer-motion')) {
        content = `import { motion } from 'framer-motion';\n` + content;
      }
      
      for (const [find, replace] of Object.entries(replacements)) {
        const regex = new RegExp(find.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&'), 'g');
        content = content.replace(regex, replace);
      }
      
      content = content.replace(/\\s{2,}/g, ' ');
      fs.writeFileSync(fullPath, content);
      console.log('Updated ' + file);
    }
  }
};
processDir(pagesDir);
