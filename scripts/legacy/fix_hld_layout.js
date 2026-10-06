const fs = require('fs');

let comp = fs.readFileSync('components/visualizers/Hld.tsx', 'utf8');

// Replace standard nodes calculation with fetching the final state's parent and depth
const target = `  const N = step.state.N;
  const nodes = computeTreeLayout(N, step.state.parent, step.state.depth);`;

const replacement = `  const N = step.state.N;
  // Use the final step's parent and depth to construct a stable tree layout
  const finalState = steps[steps.length - 1].state;
  const nodes = computeTreeLayout(N, finalState.parent, finalState.depth);`;

comp = comp.replace(target, replacement);

fs.writeFileSync('components/visualizers/Hld.tsx', comp);
console.log("Fixed HLD Layout");
