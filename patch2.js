const fs = require('fs');
let code = fs.readFileSync('components/visualizers/SparseTable.tsx', 'utf-8');

const regex = /\{input\.queries\.length > 0 && \([\s\S]*?<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">/;

const replacement = `{input.queries.length > 0 && (
              <div className="bg-[#09090B] border border-white/10 p-4 shrink-0 shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <h3 className="text-[11px] text-white/70 font-mono tracking-wider uppercase font-semibold">
                      Danh Sách Truy Vấn RMQ ({input.queries.length} truy vấn)
                    </h3>
                  </div>
                  {onUpdateInput && (
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-1 rounded-sm">
                      <input 
                        type="number" 
                        value={newL} 
                        onChange={e => setNewL(e.target.value)} 
                        placeholder="L" 
                        className="w-12 h-6 bg-black/50 border border-white/10 text-white text-xs text-center font-mono focus:outline-none focus:border-amber-500/50" 
                      />
                      <span className="text-white/30 font-mono text-xs">-</span>
                      <input 
                        type="number" 
                        value={newR} 
                        onChange={e => setNewR(e.target.value)} 
                        placeholder="R" 
                        className="w-12 h-6 bg-black/50 border border-white/10 text-white text-xs text-center font-mono focus:outline-none focus:border-amber-500/50" 
                      />
                      <button 
                        onClick={handleAddQuery}
                        className="h-6 px-2 bg-sky-500/20 hover:bg-sky-500/40 border border-sky-500/50 text-sky-300 text-[10px] font-mono flex items-center gap-1 transition-colors"
                      >
                        <Plus size={12} /> THÊM
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">`;

code = code.replace(regex, replacement);
fs.writeFileSync('components/visualizers/SparseTable.tsx', code, 'utf-8');
console.log("Patched successfully");
