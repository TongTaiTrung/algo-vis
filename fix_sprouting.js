const fs = require('fs');

const files = [
  'components/visualizers/BinarySequence.tsx',
  'components/visualizers/Combination.tsx',
  'components/visualizers/Permutation.tsx',
  'components/visualizers/Subset.tsx'
];

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');

  // Change style={{ left: pos.x, top: pos.y }} to use Framer Motion's x and y
  // We need the parent position!
  // The mapping has `layout.get(node.id)`. We can also get `layout.get(node.parent)`.

  const target = `                  const pos = layout.get(node.id);
                  if (!pos) return null;`;
  
  const replacement = `                  const pos = layout.get(node.id);
                  const parentPos = layout.get(node.parent || 'root') || { x: 600, y: 40 }; // Fallback to root or top-center
                  if (!pos) return null;`;

  code = code.replace(target, replacement);

  // Replace initial / animate / transition
  const animTarget = `                      style={{ left: pos.x, top: pos.y }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.8 }}`;

  const animReplacement = `                      style={{ left: 0, top: 0 }}
                      initial={{ x: parentPos.x, y: parentPos.y, scale: 0, opacity: 0 }}
                      animate={{ x: pos.x, y: pos.y, scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 450, damping: 25, mass: 0.8 }}`;

  code = code.replace(animTarget, animReplacement);

  // Also fix lines to animate from parent to child seamlessly
  const edgeTarget = `<motion.line x1={u.x} y1={u.y} x2={v.x} y2={v.y} stroke="rgba(255,255,255,0.2)" strokeWidth={2} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.8 }} />`;
  
  // Wait, if node x, y updates, the line should also tween!
  // To tween line coordinates in Framer Motion, we can animate x1, y1, x2, y2 directly!
  const edgeReplacement = `<motion.line 
                          initial={{ x1: u.x, y1: u.y, x2: u.x, y2: u.y }} 
                          animate={{ x1: u.x, y1: u.y, x2: v.x, y2: v.y }} 
                          stroke="rgba(255,255,255,0.2)" strokeWidth={2} 
                          transition={{ type: "spring", stiffness: 450, damping: 25, mass: 0.8 }} 
                        />`;

  code = code.replace(edgeTarget, edgeReplacement);

  // Fix text appearing
  const textTarget = `<text x={(u.x + v.x)/2} y={(u.y + v.y)/2 - 5} fill="rgba(255,255,255,0.5)" fontSize="12" textAnchor="middle">{edge.label}</text>`;
  const textReplacement = `<motion.text 
                          initial={{ opacity: 0, x: u.x, y: u.y }} 
                          animate={{ opacity: 1, x: (u.x + v.x)/2, y: (u.y + v.y)/2 - 5 }} 
                          transition={{ type: "spring", stiffness: 450, damping: 25, mass: 0.8, delay: 0.05 }}
                          fill="rgba(255,255,255,0.5)" fontSize="12" textAnchor="middle"
                        >
                          {edge.label}
                        </motion.text>`;
  
  code = code.replace(textTarget, textReplacement);

  fs.writeFileSync(file, code);
  console.log(`Updated sprouting animation for ${file}`);
});
