"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, MessageSquareQuote } from 'lucide-react';
import { StepLIS, InputLIS } from '@/lib/tracers/dp-binary-search';
import { CODE_LIS, MAPPINGS_LIS } from '@/lib/tracers/dp-binary-search-code';
import CodeBlock from '@/components/CodeBlock';
import { usePlayback } from '@/hooks/usePlayback';

interface VisualizerProps { input: InputLIS; steps: StepLIS[]; }

export default function DpBsVisualizer({ input, steps }: VisualizerProps) {
  const { currentIndex, isPlaying, playbackSpeed, stepForward, stepBackward, jumpTo, togglePlay, setPlaybackSpeed } = usePlayback(steps.length, 600);
  const step = steps[currentIndex];
  if (!step) return null;

  return (
    <div className="h-full w-full flex flex-col gap-4 animate-[blurFadeIn_0.4s_ease-out]">
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        
        {/* Canvas Area */}
        <div className="col-span-8 relative bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl flex flex-col">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#09090B] z-10 shrink-0">
             <h2 className="font-mono text-white/80 font-bold tracking-tight text-sm">LIS DP + BINARY SEARCH: VÙNG GIẢ LẬP</h2>
             <div className="font-mono text-xs text-amber-400 font-bold">Step {currentIndex + 1} / {steps.length}</div>
          </div>
          
          <div className="flex-1 p-6 flex flex-col overflow-y-auto relative bg-[#040405]">
             <div className="mb-8 relative z-10">
               <h3 className="text-[10px] text-white/40 font-mono tracking-widest uppercase mb-2">Original Array (Mảng Gốc)</h3>
               <div className="flex gap-2 flex-wrap">
                 {step.state.arr.map((val, idx) => (
                   <motion.div key={idx} className={`w-12 h-12 flex flex-col items-center justify-center font-mono font-bold border-2 transition-all ${idx === step.state.currentIdx ? 'bg-amber-500/20 border-amber-400 text-amber-400 scale-110 shadow-[0_0_15px_rgba(251,191,36,0.5)]' : idx < step.state.currentIdx ? 'bg-white/10 border-white/20 text-white/60' : 'bg-[#09090B] border-white/10 text-white/30'}`}>
                     <span className="text-[10px] opacity-40 absolute -top-4">{idx}</span>
                     X={val}
                   </motion.div>
                 ))}
               </div>
             </div>

             <div className="relative border-t border-white/10 pt-8 flex-1 z-10">
               <div className="flex justify-between items-end mb-6">
                 <h3 className="text-[10px] text-white/40 font-mono tracking-widest uppercase">Tails Array Map (Cột mốc LIS)</h3>
                 <span className="font-mono text-sm text-emerald-400">Current LIS Length: <b>{step.state.tails.length}</b></span>
               </div>
               
               <div className="flex gap-3 relative min-h-[140px] overflow-x-auto pb-4 items-start">
                 <AnimatePresence>
                   {step.state.tails.map((val, idx) => {
                     const isL = step.state.bsL === idx;
                     const isR = step.state.bsR === idx;
                     const isMid = step.state.bsMid === idx;
                     const isTarget = step.state.insertPos === idx;

                     let highlightClasses = "bg-[#09090B] border-white/20 text-white/80";
                     if (isTarget) highlightClasses = "bg-emerald-500/20 border-emerald-400 text-emerald-400 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.5)] z-20";
                     else if (isMid) highlightClasses = "bg-blue-500/20 border-blue-400 text-blue-400 z-10";
                     
                     return (
                       <motion.div key={idx} layout initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className={`w-14 h-14 flex items-center justify-center font-mono font-bold text-lg border-2 relative transition-colors shrink-0 ${highlightClasses}`}>
                         <span className="text-[10px] opacity-40 absolute -top-5 text-white/60">idx:{idx}</span>
                         {val}

                         <div className="absolute top-16 w-full flex flex-col items-center gap-1">
                           {isL && <span className="text-[11px] text-amber-400 font-bold leading-none shrink-0 border border-amber-500/30 px-1 py-0.5 bg-amber-500/10">L↑</span>}
                           {isMid && <span className="text-[11px] text-blue-400 font-bold leading-none shrink-0 border border-blue-400/30 px-1 py-0.5 bg-blue-500/10 shadow-[0_0_10px_rgba(59,130,246,0.3)]">M↑</span>}
                           {isR && <span className="text-[11px] text-rose-400 font-bold leading-none shrink-0 border border-rose-500/30 px-1 py-0.5 bg-rose-500/10">R↑</span>}
                         </div>
                       </motion.div>
                     )
                   })}
                 </AnimatePresence>
                 {step.state.tails.length === 0 && <div className="text-white/20 font-mono text-sm self-center">Tails empty</div>}
               </div>
             </div>
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

        {/* Dashboard Tools */}
        <div className="col-span-4 flex flex-col gap-4 min-h-0">
          <div className="flex-[3] min-h-0">
            <CodeBlock 
              snippets={CODE_LIS} 
              mappings={MAPPINGS_LIS} 
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
                  <span className="text-amber-400 font-mono text-sm font-bold truncate">{val}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Control Deck */}
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
          <input type="range" min="50" max="1000" step="50" style={{ direction: 'rtl' }} value={playbackSpeed} onChange={(e) => setPlaybackSpeed(parseInt(e.target.value))} className="w-24 accent-amber-500 h-1 bg-white/10 appearance-none cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
