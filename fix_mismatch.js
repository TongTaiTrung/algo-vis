const fs = require('fs');
const files = [
  'components/visualizers/BinarySequence.tsx',
  'components/visualizers/Combination.tsx',
  'components/visualizers/Permutation.tsx'
];

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');

  // Replace `</div>\n ))} ` with `</motion.div>\n ))} ` when the block starts with `<motion.div layout transition=`
  
  // Let's just find the exact block:
  code = code.replace(/\{val !== null \? val : '-'\}(\s*)<\/div>/g, '{val !== null ? val : \'-\'}$1</motion.div>');

  fs.writeFileSync(file, code);
  console.log('Fixed mismatch in ' + file);
});
