"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Crown } from 'lucide-react';
import { StepNQueens, InputNQueens } from '@/lib/tracers/n-queens';
import { CODE_NQUEENS, MAPPINGS_NQUEENS } from '@/lib/tracers/n-queens-code';
import CodeBlock from '@/components/CodeBlock';
import { usePlayback } from '@/hooks/usePlayback';

interface VisualizerProps {
  input: InputNQueens;
  steps: StepNQueens[];
}

export default function NQueensVisualizer({ input, steps }: VisualizerProps) {
  const { currentIndex, isPlaying, playbackSpeed, stepForward, stepBackward, jumpTo, togglePlay, setPlaybackSpeed } = usePlayback(steps.length, 1200);
  const step = steps[currentIndex];
  if (!step) return null;

  const N = step.state.N;

  const gridCells = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      gridCells.push({ r, c });
    }
  }

  return (
    <div className="h-full w-full flex flex-col gap-4">
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        <div className="col-span-8 flex flex-col gap-4 min-h-0">
          <div className="flex-1 relative bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl flex flex-col items-center justify-center p-8 min-h-0">
             <div className="absolute top-0 left-0 right-0 p-4 border-b border-white/10 flex justify-between items-center bg-[#09090B] z-20">
               <h2 className="font-mono text-white/80 font-bold tracking-tight text-sm">CHESSBOARD / THREAT ZONES</h2>
               <div className="font-mono text-xs text-amber-400 font-bold">Step {currentIndex + 1} / {steps.length}</div>
             </div>

             <div className="relative mt-8 group" style={{ aspectRatio: '1/1', maxHeight: '100%', width: 'auto', minWidth: '400px' }}>
                <div className="absolute inset-0 grid border-2 border-white/20 overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.05)]" 
                     style={{ gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${N}, minmax(0, 1fr))` }}>
                  
                  {gridCells.map(({ r, c }) => {
                    const isDark = (r + c) % 2 === 1;
                    const isThreatened = step.state.threatenedSquares.some(sq => sq.r === r && sq.c === c);
                    
                    const hasQueen = step.state.queens[r] === c;
                    const isTrying = step.state.row === r && step.state.col === c;
                    const isAttackSource = step.state.conflicts.some(conf => conf.r === r && conf.c === c);
                    const isBacktracking = isTrying && step.state.isBacktracking;

                    let bgClass = isDark ? 'bg-[#09090BB0]' : 'bg-[#18181CA0]';
                    let borderClass = 'border-white/5';
                    
                    // if (isThreatened && !hasQueen) { bgClass = 'bg-rose-500/20'; } // Disabled per user request (lasers only)

                    if (isTrying) {
                       if (step.state.conflicts.length > 0) bgClass = 'bg-rose-600/60 shadow-inner shadow-rose-900 border-rose-400';
                       else bgClass = 'bg-blue-500/40 shadow-inner shadow-blue-900 border-blue-400';
                    }

                    if (isAttackSource) {
                       bgClass = 'bg-red-600/80 shadow-[0_0_30px_rgba(220,38,38,0.8)] z-10 border-red-400 scale-105 transition-transform';
                    }

                    return (
                      <div key={`${r}-${c}`} className={`relative flex items-center justify-center border transition-all duration-300 ${bgClass} ${borderClass}`}>
                        
                        {hasQueen && !isAttackSource && (
                           <motion.div layoutId={`Q-${r}`} className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)] z-10">
                              <Crown size={N > 6 ? 24 : 40} strokeWidth={2} />
                           </motion.div>
                        )}

                        {hasQueen && isAttackSource && (
                           <motion.div initial={{ scale: 1 }} animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.5 }} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,1)] z-20">
                              <Crown size={N > 6 ? 30 : 48} strokeWidth={3} />
                           </motion.div>
                        )}

                        {isTrying && !isBacktracking && (
                           <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={`${step.state.conflicts.length > 0 ? 'text-rose-300' : 'text-blue-200 animate-pulse'} z-20`}>
                              <Crown size={N > 6 ? 24 : 40} strokeWidth={step.state.conflicts.length > 0 ? 1.5 : 2.5} />
                              {step.state.conflicts.length > 0 && (
                                <div className="absolute inset-0 flex items-center justify-center text-red-500/80 text-4xl overflow-hidden pointer-events-none">
                                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute rotate-45 transform-origin-center h-1 w-full bg-red-500"></motion.div>
                                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -rotate-45 transform-origin-center h-1 w-full bg-red-500"></motion.div>
                                </div>
                              )}
                           </motion.div>
                        )}

                        <div className="absolute left-1 bottom-1 text-[8px] font-mono text-white/20 select-none hidden group-hover:block">{r},{c}</div>
                      </div>
                    )
                  })}

                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-30" viewBox={`0 0 ${N*100} ${N*100}`}>

                    {/* Threat Lasers for all placed queens */}
                    {step.state.queens.map((qCol, qRow) => {
                       if (qCol === -1) return null;
                       const qx = qCol * 100 + 50;
                       const qy = qRow * 100 + 50;
                       const ext = 2000;
                       return (
                         <g key={`laser-${qRow}`} className="opacity-30">
                           {/* Horizontal */}
                           <line x1={0} y1={qy} x2={N*100} y2={qy} stroke="#F43F5E" strokeWidth="2" strokeDasharray="5 5" />
                           {/* Vertical */}
                           <line x1={qx} y1={0} x2={qx} y2={N*100} stroke="#F43F5E" strokeWidth="2" strokeDasharray="5 5" />
                           {/* Main Diagonal */}
                           <line x1={qx - ext} y1={qy - ext} x2={qx + ext} y2={qy + ext} stroke="#F43F5E" strokeWidth="2" strokeDasharray="5 5" />
                           {/* Anti Diagonal */}
                           <line x1={qx - ext} y1={qy + ext} x2={qx + ext} y2={qy - ext} stroke="#F43F5E" strokeWidth="2" strokeDasharray="5 5" />
                         </g>
                       );
                    })}


                    {step.state.conflicts.map((conf, idx) => {
                      const tryR = step.state.row;
                      const tryC = step.state.col!;
                      const x1 = conf.c * 100 + 50;
                      const y1 = conf.r * 100 + 50;
                      const x2 = tryC * 100 + 50;
                      const y2 = tryR * 100 + 50;
                      
                      return (
                        <motion.line 
                          key={idx}
                          x1={x1} y1={y1} x2={x2} y2={y2}
                          stroke="rgb(239, 68, 68)" strokeWidth="6" strokeDasharray="15 10"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="drop-shadow-[0_0_8px_rgba(239,68,68,0.9)]"
                        />
                      )
                    })}
                  </svg>
                </div>
             </div>
          </div>

          <div className="h-32 bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl flex items-center px-8 relative overflow-hidden">
             <div className="absolute inset-0 " style={{ background: 'radial-gradient(ellipse at left, rgba(234, 179, 8, 0.05), transparent 70%)' }}></div>
             <div className="relative z-10 w-full">
               <h3 className="text-amber-400 font-mono text-sm tracking-widest uppercase mb-1 font-bold">Thuyết Minh Trực Tiếp (Narrative)</h3>
               <p className="font-mono text-sm text-white/80 leading-relaxed min-h-[40px] border-l-2 border-amber-500/50 pl-4 py-1">
                 {step.narrative || "Đang phân tích..."}
               </p>
             </div>
             <div className="ml-auto text-center shrink-0">
               <span className="font-mono text-xs text-white/40 uppercase block mb-1">Tổng Số Testcase Hợp Lệ</span>
               <AnimatePresence mode="popLayout">
                 <motion.div key={step.state.solutionsCount} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="font-mono text-4xl font-bold text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                   {step.state.solutionsCount}
                 </motion.div>
               </AnimatePresence>
             </div>
          </div>
        </div>

        <div className="col-span-4 flex flex-col gap-4 min-h-0">
          <div className="flex-[3] min-h-0">
            <CodeBlock 
              snippets={CODE_NQUEENS} 
              mappings={MAPPINGS_NQUEENS} 
              activeLine={step.activeLine}
              callingLine={(step as any).callingLine} 
            />
          </div>

          <div className="flex-[2] bg-white/5 backdrop-blur-md border border-white/10 p-4 overflow-y-auto flex flex-col shadow-xl">
            <h2 className="font-mono text-white/80 font-bold tracking-tight mb-4 text-sm">LOCAL MEMORY</h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {Object.entries(step.memory).map(([key, val]) => (
                <motion.div key={key} layout className="bg-[#09090B] p-2 border border-white/5 flex flex-col justify-center gap-1 shadow-inner px-3 py-2">
                  <span className="text-white/40 text-[10px] uppercase tracking-wider">{key}</span>
                  <span className="text-amber-400 font-mono text-[13px] font-bold truncate">{val}</span>
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
          <span className="font-mono text-xs text-white/40">Timeline</span>
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
