const fs = require('fs');
const files = [
  'lib/tracers/dijkstra.ts',
  'lib/tracers/dp-knapsack.ts',
  'lib/tracers/mo-algorithm.ts',
  'lib/tracers/centroid.ts'
];

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  
  // Match `snap("...", 5, m, st)` and inject a generic narrative `snap("...", "...", 5, m, st)`
  // Be careful to only match 3-arg or 4-arg when signature expects 4 or 5. 
  // Actually, I can just find `snap("String", Number` and insert the string again as narrative for missing ones!
  
  // Regex: snap("phase text", 123,
  // Note: we might have match `snap( "Phase", 12, ...)`
  code = code.replace(/snap\(\s*(`[^`]+`|"[^"]+")\s*,\s*(\d+)/g, 'snap($1, $1, $2');
  
  // But wait! If I already added narratives in my previous scripts, they might now look like:
  // snap("Phase", "Narrative", 2...
  // So the regex `/snap\(\s*(`[^`]+`|"[^"]+")\s*,\s*(\d+)/g` will ONLY MATCH if the second argument is a NUMBER (`\d+`)!
  // If the second argument is already a string (the narrative I added), it won't match `(\d+)` because it's a string, not a number!
  // This is PERFECT!
  
  fs.writeFileSync(file, code);
  console.log(`Auto-fixed snap args in ${file}`);
});
