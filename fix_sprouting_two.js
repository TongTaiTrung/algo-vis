const fs = require('fs');

const files = [
  'components/visualizers/BinarySequence.tsx',
  'components/visualizers/Combination.tsx',
  'components/visualizers/Permutation.tsx',
  'components/visualizers/Subset.tsx'
];

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');

  // Strip layout="position" and layoutId={node.id} to avoid conflicts with explicit `x/y` animations
  code = code.replace(/\s*layout="position"\s*layoutId=\{node\.id\}/g, '');
  
  // Make Sequence Array animations more springy
  code = code.replace(/<motion\.div layout key=\{idx\}/g, '<motion.div layout transition={{ type: "spring", stiffness: 400, damping: 25 }} key={idx}');

  fs.writeFileSync(file, code);
  console.log(`Finalized polish for ${file}`);
});
