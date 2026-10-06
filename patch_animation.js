const fs = require('fs');

const files = [
  'components/visualizers/BinarySequence.tsx',
  'components/visualizers/Combination.tsx',
  'components/visualizers/Permutation.tsx',
  'components/visualizers/Subset.tsx'
];

const springTransition = `transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.8 }}`;

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');

  // Convert <g> and <line> in SVG to motion elements
  code = code.replace(/<g key=\{'edge-'\+idx\}>/g, '<motion.g key={\'edge-\'+idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>');
  code = code.replace(/<\/g>/g, '</motion.g>');
  
  // Make lines draw smoothly.
  code = code.replace(
    /<line x1=\{u\.x\} y1=\{u\.y\} x2=\{v\.x\} y2=\{v\.y\} stroke="rgba\(255,255,255,0\.2\)" strokeWidth=\{2\} \/>/g,
    `<motion.line x1={u.x} y1={u.y} x2={v.x} y2={v.y} stroke="rgba(255,255,255,0.2)" strokeWidth={2} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} ${springTransition} />`
  );

  // Add layout to motion.div of nodes if missing
  // Original is: <motion.div\n                      key={node.id}
  // Let's replace the whole block dynamically
  
  if (!code.includes('layoutId={node.id}')) {
     code = code.replace(/key=\{node\.id\}/g, 'key={node.id}\n                      layout="position"\n                      layoutId={node.id}');
  }
  
  // Update node transition to standard macOS spring
  code = code.replace(/transition=\{\{ type: "spring", stiffness: 300, damping: 20 \}\}/g, springTransition);
  
  // Replace {val} block animations:
  // <div key={idx} className={`w-10 h-10 border-2 flex items-center justify-center text-lg font-mono font-bold
  // to <motion.div layout transition={...}
  code = code.replace(/<div key=\{idx\} className=\{`w-10 h-10/g, '<motion.div layout key={idx} className={`w-10 h-10');
  code = code.replace(/\{val !== null \? val : '-'\}\n                <\/div>/g, '{val !== null ? val : \'-\'}\n                </motion.div>');

  fs.writeFileSync(file, code);
  console.log(`Patched ${file}`);
});
