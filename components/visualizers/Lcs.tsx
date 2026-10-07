"use client";

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, MessageSquareQuote } from 'lucide-react';
import { StepLcs, InputLcs } from '@/lib/tracers/lcs';
import { LCS_CODE, MAPPINGS_LCS } from '@/lib/tracers/lcs-code';
import CodeBlock from '@/components/CodeBlock';
import { usePlayback } from '@/hooks/usePlayback';

interface VisualizerProps { 
  input: InputLcs; 
  steps: StepLcs[]; 
}

export default function LcsVisualizer({ input, steps }: VisualizerProps) {
  const { currentIndex, isPlaying, playbackSpeed, stepForward, stepBackward, jumpTo, togglePlay, setPlaybackSpeed } = usePlayback(steps.length, 500);
  const step = steps[currentIndex];

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll the grid to the current cell being highlighted
    if (gridRef.current && step) {
      let r = step.i > -1 ? step.i : step.backtrackPoint?.r ?? -1;
      let c = step.j > -1 ? step.j : step.backtrackPoint?.c ?? -1;
      
      if (r !== -1 && c !== -1) {
         const cellId = `cell-${r}-${c}`;
         const el = document.getElementById(cellId);
         if (el) {
           el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
         }
      }
    }
  }, [currentIndex, step]);

  if (!step) return null;

  const n = input.s1.length;
  const m = input.s2.length;

  return (
    <div className="h-full w-full flex flex-col gap-4 animate-[blurFadeIn_0.4s_ease-out]">
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        
        {/* Canvas */}
        <div className="col-span-8 relative bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl flex flex-col items-center p-6">
           <div className="absolute top-4 left-4 font-mono text-white/50 text-xs tracking-widest font-bold">DP MATRIX STATE</div>
           <div className="absolute top-4 right-4 font-mono text-white/50 text-xs">Step {currentIndex + 1} / {steps.length}</div>
           
           <div className="flex-1 w-full flex items-center justify-center overflow-auto" ref={gridRef}>
              <div className="inline-block border border-white/10 bg-[#09090B] p-2 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                 <div className="flex">
                    <div className="w-[50px] h-[50px]" />
                    <div className="w-[50px] h-[50px] flex items-center justify-center font-mono font-bold text-white/30 text-lg border-b border-b-white/10">0</div>
                    {input.s2.split('').map((char, c) => (
                      <div key={c} className={`w-[50px] h-[50px] flex flex-col items-center justify-center font-mono font-bold text-lg border-b border-b-white/10 ${ (step.phase === 'CALC' && step.j === c + 1) || (step.phase.startsWith('BACKTRACK') && step.backtrackPoint?.c === c + 1) ? 'text-amber-400 bg-amber-500/10' : 'text-blue-300' }`}>
                          <span className="text-[10px] text-white/30 absolute mt-[-28px]">{c+1}</span>
                          {char}
                      </div>
                    ))}
                 </div>
                 
                 <div className="flex">
                    <div className="w-[50px] h-[50px] flex items-center justify-center font-mono font-bold text-white/30 text-lg border-r border-r-white/10">0</div>
                    {step.dp[0].map((val, c) => (
                      <div key={`0-${c}`} id={`cell-0-${c}`} className="w-[50px] h-[50px] border border-white/5 flex items-center justify-center font-mono text-white/50 bg-white/5">
                        {val}
                      </div>
                    ))}
                 </div>

                 {input.s1.split('').map((char, r) => (
                    <div className="flex" key={r}>
                       <div className={`relative w-[50px] h-[50px] flex items-center justify-center font-mono font-bold text-lg border-r border-r-white/10 ${ (step.phase === 'CALC' && step.i === r + 1) || (step.phase.startsWith('BACKTRACK') && step.backtrackPoint?.r === r + 1) ? 'text-amber-400 bg-amber-500/10' : 'text-emerald-300' }`}>
                          <span className="text-[10px] text-white/30 absolute left-1">{r+1}</span>
                          {char}
                       </div>
                       
                       {step.dp[r + 1].map((val, c) => {
                          const isTarget = step.phase === 'CALC' && step.i === r + 1 && step.j === c;
                          const isBacktrack = step.phase.startsWith('BACKTRACK') && step.backtrackPoint?.r === r+1 && step.backtrackPoint?.c === c;
                          
                          let bg = "bg-[#09090B]";
                          let text = "text-white/80";
                          let border = "border-white/10";
                          let shadow = "";

                          if (isTarget) {
                              bg = step.match ? "bg-emerald-500/20" : "bg-rose-500/20";
                              border = step.match ? "border-emerald-400 z-10 box-border" : "border-rose-400 z-10 box-border";
                              text = step.match ? "text-emerald-300" : "text-rose-300";
                              shadow = step.match ? "shadow-[0_0_20px_rgba(16,185,129,0.4)]" : "shadow-[0_0_20px_rgba(244,63,94,0.4)]";
                          } else if (isBacktrack) {
                              bg = step.match ? "bg-amber-500/40" : "bg-amber-500/20";
                              border = "border-amber-400 border-2 z-10 box-border";
                              text = "text-amber-200 font-extrabold";
                              shadow = "shadow-[0_0_20px_rgba(251,191,36,0.6)]";
                          } else if (c === 0) {
                              bg = "bg-white/5"; text = "text-white/50";
                          }

                          return (
                            <motion.div 
                              layout
                              id={`cell-${r+1}-${c}`}
                              key={`${r+1}-${c}`} 
                              className={`relative w-[50px] h-[50px] border flex items-center justify-center font-mono text-lg transition-colors duration-300 ${bg} ${border} ${text} ${shadow}`}
                            >
                               {val}
                               
                               {isTarget && step.match && c > 0 && (
                                   <div className="absolute inset-0 flex items-center justify-center -translate-x-[25px] -translate-y-[25px] pointer-events-none opacity-50">
                                      <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                                         <path d="M40 40 L10 10" stroke="#10b981" strokeWidth="3" strokeDasharray="4 4" />
                                      </svg>
                                   </div>
                               )}
                               
                               {isBacktrack && step.match && (
                                   <div className="absolute inset-0 border-[3px] border-amber-400 rounded-sm pointer-events-none opacity-80 z-20"></div>
                               )}
                            </motion.div>
                          );
                       })}
                    </div>
                 ))}
              </div>
           </div>
           
           <div className="absolute bottom-6 left-6 right-6 p-4 bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-transparent border border-emerald-500/30 rounded-xl backdrop-blur-md flex items-center gap-4">
              <span className="font-mono text-emerald-400/70 text-xs font-bold whitespace-nowrap uppercase">LCS_SO_FAR:</span>
              <div className="flex gap-2">
                 {step.lcsSoFar ? step.lcsSoFar.split('').map((char, idx) => (
                    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} key={idx} className="w-8 h-8 rounded-md bg-emerald-500/20 border border-emerald-400 flex items-center justify-center font-bold font-mono text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                       {char}
                    </motion.div>
                 )) : <span className="font-mono text-white/20 italic">Empty</span>}
              </div>
           </div>

           {/* NARRATIVE */}
           <div className="absolute bottom-28 left-6 right-6 bg-[#09090B]/90 border border-amber-500/30 p-5 rounded-xl flex gap-4 items-start shadow-xl">
             <div className="bg-amber-500/20 p-2.5 rounded-lg shrink-0 border border-amber-500/30 mt-1">
                <MessageSquareQuote size={20} className="text-amber-400" />
             </div>
             <div className="flex-1">
                <h4 className="text-amber-400 font-bold font-mono text-[11px] mb-1.5 uppercase tracking-widest">{step.phase}</h4>
                <AnimatePresence mode="wait">
                  <motion.p
                     key={step.narrative}
                     initial={{ opacity: 0, y: 15 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -15 }}
                     transition={{ duration: 0.25 }}
                     className="font-sans text-[14px] text-white/90 leading-relaxed border-l-[3px] border-white/10 pl-3 m-0"
                  >
                     {step.narrative}
                  </motion.p>
                </AnimatePresence>
             </div>
          </div>
        </div>

        {/* Dashboard */}
        <div className="col-span-4 flex flex-col gap-4 min-h-0">
          <div className="flex-[3] min-h-0">
            <CodeBlock 
              snippets={LCS_CODE} 
              mappings={MAPPINGS_LCS} 
              activeLine={step.activeLine}
            />
          </div>

          <div className="flex-[2] bg-white/5 backdrop-blur-md border border-white/10 p-4 overflow-y-auto flex flex-col shadow-xl">
            <h2 className="font-mono text-white/80 font-bold tracking-tight mb-4 text-sm">LOCAL MEMORY</h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {Object.entries(step.memory).map(([key, val]) => (
                <div key={key} className="bg-[#09090B] p-2 border border-white/5 flex flex-col justify-center overflow-hidden">
                  <span className="text-white/40 text-[10px] uppercase tracking-wider">{key}</span>
                  <span className="font-mono text-xl tracking-tight font-bold truncate text-blue-400">{val}</span>
                </div>
              ))}
            </div>
            {step.phase === 'DONE' && (
               <div className="mt-auto bg-emerald-500/10 border border-emerald-500/30 p-3 flex flex-col justify-center items-center rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <span className="font-mono text-xs text-emerald-200/60 uppercase mb-2">Final LCS Length</span>
                  <span className="font-mono text-4xl font-extrabold text-emerald-400">{step.dp[n][m]}</span>
               </div>
            )}
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
          <input type="range" min="50" max="1000" step="50" style={{ direction: 'rtl' }} value={playbackSpeed} onChange={(e) => setPlaybackSpeed(parseInt(e.target.value))} className="w-24 accent-amber-500 h-1 bg-white/10 appearance-none cursor-pointer" />
        </div>
      </div>
    </div>
  );
}