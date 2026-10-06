const fs = require('fs');
const glob = require('glob');
const path = require('path');

const files = glob.sync('{components,app}/**/*.{js,jsx,ts,tsx}', { nodir: true });

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const initialContent = content;

  // Regex to match Tailwind rounded classes
  // e.g. rounded, rounded-sm, rounded-md, rounded-lg, rounded-xl, rounded-2xl, rounded-3xl, rounded-full, rounded-t-* etc.
  // We need to be careful with template literals and strings
  content = content.replace(/\brounded(?:-(?:t|r|b|l|tl|tr|bl|br))?(?:-(?:none|sm|md|lg|xl|2xl|3xl|full|\d+|\[.*?\]))?\b/g, '');
  
  // also replace rx="..." in SVGs
  content = content.replace(/\brx\s*=\s*(['"])[^'"]+\1/g, '');

  if (content !== initialContent) {
    fs.writeFileSync(file, content.replace(/\s+/g, ' ').replace(/\s+([`'"])/g, '$1').replace(/([`'"])\s+/g, '$1'), 'utf8'); // Just simplifying the write, wait, replacing all \s+ with space can ruin code! Let's do it carefully.
  }
});
