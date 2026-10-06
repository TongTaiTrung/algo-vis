const fs = require('fs');

const files = [
  'components/visualizers/DPKnapsack.tsx', 
  'components/visualizers/MoAlgorithm.tsx', 
  'components/visualizers/Centroid.tsx', 
  'components/visualizers/NQueens.tsx'
];

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  if (code.includes("import { motion } from 'framer-motion';")) {
    code = code.replace("import { motion } from 'framer-motion';", "import { motion, AnimatePresence } from 'framer-motion';");
    fs.writeFileSync(file, code);
    console.log(`Added AnimatePresence to ${file}`);
  }
});
