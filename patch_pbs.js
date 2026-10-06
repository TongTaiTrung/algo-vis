const fs = require('fs');
let code = fs.readFileSync('components/visualizers/ParallelBs.tsx', 'utf-8');

code = code.replace(
  "export default function PbsVisualizer({ input, steps }: VisualizerProps) {",
  `export default function PbsVisualizer({ input, steps, onUpdateInput }: VisualizerProps) {
  const [newIdx, React_setNewIdx] = React.useState("");
  const [newReq, React_setNewReq] = React.useState("");

  const handleAddQuery = () => {
    const targetIdx = parseInt(newIdx);
    const req = parseInt(newReq);
    if (!isNaN(targetIdx) && !isNaN(req) && targetIdx >= 0 && targetIdx < input.arrSize) {
      if (onUpdateInput) {
        onUpdateInput({
          ...input,
          queries: [...input.queries, { targetIdx, req }]
        });
      }
      React_setNewIdx("");
      React_setNewReq("");
    } else {
      alert(\`Vui lòng nhập targetIdx (0 đến \${input.arrSize - 1}) và req hợp lệ.\`);
    }
  };`
);

const regex = /<span className="text-blue-400">Total: \{step.state.queries.length\} Queries<\/span>[\s\S]*?<\/div>/;

const replacement = `<div className="flex items-center gap-4">
                 <span className="text-blue-400">Total: {step.state.queries.length} Queries</span>
                 {onUpdateInput && (
                   <div className="flex items-center gap-1">
                     <input type="number" value={newIdx} onChange={e => React_setNewIdx(e.target.value)} placeholder="Idx" className="w-10 h-5 bg-black/50 border border-white/10 text-white text-[10px] text-center font-mono" />
                     <input type="number" value={newReq} onChange={e => React_setNewReq(e.target.value)} placeholder="Req" className="w-10 h-5 bg-black/50 border border-white/10 text-white text-[10px] text-center font-mono" />
                     <button onClick={handleAddQuery} className="h-5 px-1.5 bg-blue-500/20 text-blue-400 text-[10px] border border-blue-500/30 font-mono font-bold">ADD</button>
                   </div>
                 )}
               </div>
             </div>`;

code = code.replace(regex, replacement);
fs.writeFileSync('components/visualizers/ParallelBs.tsx', code, 'utf-8');
console.log("Patched Pbs UI");
