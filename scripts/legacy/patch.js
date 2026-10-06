const fs = require('fs');

const path = 'app/page.tsx';
let code = fs.readFileSync(path, 'utf8');

// Insert a description banner inside the main content area, right before the visualizer wrapper
const target = `<div className="flex-1 min-h-0 relative">`;
const replacement = `
      {/* Algorithm Description Banner */}
      <div className="px-6 py-2.5 mb-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl flex items-center gap-3 shadow-lg shrink-0">
         <Sparkles className="text-amber-400 shrink-0" size={18} />
         <p className="text-xs font-sans text-white/80 leading-relaxed"><strong className="text-white font-bold">{activeMeta.name}:</strong> {activeMeta.desc}</p>
      </div>

      <div className="flex-1 min-h-0 relative">`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync(path, code);
  console.log("Patched page.tsx successfully");
} else {
  console.log("Could not find target in page.tsx");
}
