const fs = require('fs');
let code = fs.readFileSync('components/visualizers/MoAlgorithm.tsx', 'utf-8');

const regex = /<h2 className="font-mono text-white\/80 font-bold tracking-tight mb-2 text-sm">QUERIES<\/h2>/;

const replacement = `<div className="flex justify-between items-center mb-2">
              <h2 className="font-mono text-white/80 font-bold tracking-tight text-sm">QUERIES</h2>
              {onUpdateInput && (
                <div className="flex items-center gap-1">
                  <input type="number" value={newL} onChange={e => React_setNewL(e.target.value)} placeholder="L" className="w-9 h-5 bg-black/50 border border-white/10 text-white text-[10px] text-center font-mono" />
                  <input type="number" value={newR} onChange={e => React_setNewR(e.target.value)} placeholder="R" className="w-9 h-5 bg-black/50 border border-white/10 text-white text-[10px] text-center font-mono" />
                  <button onClick={handleAddQuery} className="h-5 px-1.5 bg-sky-500/20 text-sky-400 text-[10px] border border-sky-500/30">ADD</button>
                </div>
              )}
            </div>`;

code = code.replace(regex, replacement);
fs.writeFileSync('components/visualizers/MoAlgorithm.tsx', code, 'utf-8');
console.log("Patched Mo UI");
