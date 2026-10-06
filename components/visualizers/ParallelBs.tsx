"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, MessageSquareQuote } from 'lucide-react';
import { StepPBS, InputPBS } from '@/lib/tracers/parallel-bs';
import { CODE_PBS, MAPPINGS_PBS } from '@/lib/tracers/parallel-bs-code';
import CodeBlock from '@/components/CodeBlock';
import { usePlayback } from '@/hooks/usePlayback';

interface VisualizerProps { input: InputPBS; steps: StepPBS[]; onUpdateInput?: (newData: any) => void; }

export default function PbsVisualizer({ input, steps, onUpdateInput }: VisualizerProps) {
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
      alert(`Vui lòng nhập targetIdx (0 đến ${input.arrSize - 1}) và req hợp lệ.`);
    }
  };
  const { currentIndex, isPlaying, playbackSpeed, stepForward, stepBackward, jumpTo, togglePlay, setPlaybackSpeed } = usePlayback(steps.length, 600);
  const step = steps[currentIndex];
  if (!step) return null;

  return (
    <div className="h-full w-full flex flex-col gap-4 animate-[blurFadeIn_0.4s_ease-out]">
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        
        {/* Canvas */}
        <div className="col-span-8 flex flex-col gap-4 min-h-0">
          
          <div className="flex-[4] relative bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#09090B] shrink-0">
               <h2 className="font-mono text-white/80 font-bold tracking-tight text-sm uppercase">Global Sub-Array Simulation</h2>
               <div className="font-mono text-[10px] text-amber-400 font-bold bg-amber-500/10 px-3 py-1 border border-amber-500/20">THỜI GIAN VŨ TRỤ (TIME) = {step.state.currentTime} / {input.updates.length}</div>
            </div>
            
            <div className="flex-1 p-6 flex flex-col items-center justify-center relative overflow-y-auto bg-[#040405]">
               <div className="flex gap-2 relative z-10 flex-wrap justify-center">
                 {step.state.arr.map((val, idx) => (
                   <div key={idx} className="flex flex-col items-center">
                     <span className="text-[10px] text-white/30 font-mono h-4">{idx}</span>
                     <motion.div layout className={`w-14 h-14 flex items-center justify-center font-mono font-bold text-lg border-2 ${val > 0 ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-[#09090B] border-white/10 text-white/50'}`}>
                       {val}
                     </motion.div>
                   </div>
                 ))}
               </div>
               
               {step.state.activeMid !== null && (
                 <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 bg-blue-500/20 border-2 border-blue-500/40 px-6 py-1.5 text-blue-300 font-mono font-bold text-xs shadow-[0_0_30px_rgba(59,130,246,0.3)] backdrop-blur-md">
                   ⚠️ MỐC KIỂM KÊ: Mid = {step.state.activeMid}
                 </motion.div>
               )}
            </div>

            {/* SOLID NARRATIVE EXPERT PANEL */}
            <div className="bg-[#09090B] border-t border-amber-500/30 p-5 z-20 flex gap-4 items-start shrink-0 shadow-[0_-15px_30px_rgba(0,0,0,0.4)]">
               <div className="bg-amber-500/20 p-2.5 shrink-0 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.3)] mt-1">
                  <MessageSquareQuote size={20} className="text-amber-400" />
               </div>
               <div className="flex-1 overflow-hidden">
                  <h4 className="text-amber-400 font-bold font-mono text-[11px] mb-1.5 uppercase tracking-widest">{step.phase}</h4>
                  <div className="min-h-[3rem] flex items-center">
                     <AnimatePresence mode="wait">
                        <motion.p
                           key={step.narrative}
                           initial={{ opacity: 0, y: 15 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, y: -15 }}
                           transition={{ duration: 0.25, ease: "easeInOut" }}
                           className="font-sans text-[13.5px] text-white/90 leading-relaxed border-l-[3px] border-white/10 pl-3 m-0"
                        >
                           {step.narrative}
                        </motion.p>
                     </AnimatePresence>
                  </div>
               </div>
            </div>
          </div>

          <div className="flex-[3] bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl flex flex-col overflow-hidden">
             <div className="px-4 py-2 bg-[#09090B] border-b border-white/10 font-mono text-[10px] text-white/50 tracking-widest uppercase flex justify-between">
               <span>Truy vấn (Quản lý giới hạn Binary Search)</span>
               <div className="flex items-center gap-4">
                 <span className="text-blue-400">Total: {step.state.queries.length} Queries</span>
                 {onUpdateInput && (
                   <div className="flex items-center gap-1">
                     <input type="number" value={newIdx} onChange={e => React_setNewIdx(e.target.value)} placeholder="Idx" className="w-10 h-5 bg-black/50 border border-white/10 text-white text-[10px] text-center font-mono" />
                     <input type="number" value={newReq} onChange={e => React_setNewReq(e.target.value)} placeholder="Req" className="w-10 h-5 bg-black/50 border border-white/10 text-white text-[10px] text-center font-mono" />
                     <button onClick={handleAddQuery} className="h-5 px-1.5 bg-blue-500/20 text-blue-400 text-[10px] border border-blue-500/30 font-mono font-bold">ADD</button>
                   </div>
                 )}
               </div>
             </div>
             <div className="flex gap-4 p-4 overflow-x-auto items-center flex-wrap h-full content-start">
               <AnimatePresence>
                 {step.state.queries.map((q) => {
                   const isChecking = step.state.queryCheckList.includes(q.id);
                   const isDone = q.ans !== null && q.L > q.R;
                   
                   let highlight = "bg-[#09090B] border-white/10 text-white/40";
                   if (isDone) highlight = "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 opacity-60 shadow-[0_0_10px_rgba(16,185,129,0.1)]";
                   else if (isChecking) highlight = "bg-amber-500/20 border-amber-400 text-amber-300 scale-105 z-10 shadow-[0_0_20px_rgba(251,191,36,0.5)]";

                   return (
                     <motion.div layout key={q.id} className={`w-40 p-3 border-2 flex flex-col gap-1.5 font-mono text-xs transition-colors ${highlight}`}>
                       <div className="flex justify-between border-b border-white/20 pb-1">
                         <span className="opacity-70 font-bold">Query {q.id}</span>
                         <span className="text-white bg-white/10 px-1">vt: {q.targetIdx}</span>
                       </div>
                       <div className="flex justify-between mt-1">
                         <span className="opacity-70">Target</span>
                         <span className="font-bold">{q.req}</span>
                       </div>
                       <div className="flex justify-between items-center bg-[#040405] p-1.5 border border-white/5">
                         {isDone ? <span className="font-bold text-emerald-400 text-center w-full">Ans: T={q.ans}</span> : (
                           <>
                             <span className="text-blue-300 font-bold opacity-70">Khoảng:</span>
                             <span className="font-bold text-blue-400">[{q.L}, {q.R}]</span>
                           </>
                         )}
                       </div>
                       {isChecking && (
                         <div className="mt-1 flex justify-between items-center text-[10px] text-amber-300 animate-pulse bg-amber-500/20 border border-amber-500/30 px-2 py-1">
                           <span>Real: {step.state.arr[q.targetIdx]}</span>
                           <span>{step.state.arr[q.targetIdx] >= q.req ? '>= (ĐỦ)' : '< (SAI)'}</span>
                         </div>
                       )}
                     </motion.div>
                   )
                 })}
               </AnimatePresence>
             </div>
          </div>
        </div>

        {/* Dashboard */}
        <div className="col-span-4 flex flex-col gap-4 min-h-0">
          <div className="flex-[3] min-h-0">
            <CodeBlock 
              snippets={CODE_PBS} 
              mappings={MAPPINGS_PBS} 
              activeLine={step.activeLine}
              callingLine={(step as any).callingLine} 
            />
          </div>

          <div className="flex-[2] bg-white/5 backdrop-blur-md border border-white/10 p-4 overflow-y-auto flex flex-col shadow-xl">
            <h2 className="font-mono text-white/80 font-bold tracking-tight mb-4 text-sm">LOCAL MEMORY</h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {Object.entries(step.memory).map(([key, val]) => (
                <motion.div key={key} layout className="bg-[#09090B] p-2 border border-white/5 flex flex-col justify-center">
                  <span className="text-white/40 text-[10px] uppercase tracking-wider">{key}</span>
                  <span className="text-blue-400 font-mono text-sm font-bold truncate">{val}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-16 bg-white/5 backdrop-blur-md border border-white/10 px-6 flex items-center justify-between gap-6 shadow-2xl shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={stepBackward} disabled={currentIndex === 0} className="text-white/70 hover:text-white disabled:opacity-30"><SkipBack size={20} /></button>
          <button onClick={togglePlay} className="text-blue-400 hover:text-blue-300 hover:scale-110 active:scale-95 transition-all">{isPlaying ? <Pause size={28} /> : <Play size={28} fill="currentColor" />}</button>
          <button onClick={stepForward} disabled={currentIndex === steps.length - 1} className="text-white/70 hover:text-white disabled:opacity-30"><SkipForward size={20} /></button>
        </div>
        <div className="flex-1 flex items-center gap-4 px-8">
          <span className="font-mono text-xs text-white/40">Trace</span>
          <input type="range" min="0" max={steps.length - 1} value={currentIndex} onChange={(e) => jumpTo(parseInt(e.target.value))} className="flex-1 accent-blue-500 h-1 bg-white/10 appearance-none cursor-pointer" />
          <span className="font-mono text-xs text-white/40 w-12 text-right">{Math.round(((currentIndex + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-white/40 uppercase">Speed</span>
          <input type="range" min="100" max="1500" step="100" style={{ direction: 'rtl' }} value={playbackSpeed} onChange={(e) => setPlaybackSpeed(parseInt(e.target.value))} className="w-24 accent-amber-500 h-1 bg-white/10 appearance-none cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
