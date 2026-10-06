"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, MessageSquareQuote, Lock, AlertTriangle, Sparkles } from 'lucide-react';
import { StepSudoku, InputSudoku } from '@/lib/tracers/sudoku';
import { CODE_SUDOKU, MAPPINGS_SUDOKU } from '@/lib/tracers/sudoku-code';
import CodeBlock from '@/components/CodeBlock';
import { usePlayback } from '@/hooks/usePlayback';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface VisualizerProps { input: InputSudoku; steps: StepSudoku[]; }

export default function SudokuVisualizer({ input, steps }: VisualizerProps) {
  // Ultra-responsive playback default (250ms per step)
  const { currentIndex, isPlaying, playbackSpeed, stepForward, stepBackward, jumpTo, togglePlay, setPlaybackSpeed } = usePlayback(steps.length, 250);
  const step = steps[currentIndex];
  if (!step) return null;

  const N = step.state.board.length;
  const sub = Math.sqrt(N);

  // Snappy, ultra-fast spring variants for high-speed Sudoku step transitions
  const cellVariants = {
    idle: { scale: 1, x: 0, y: 0, rotate: 0 },
    active: { 
      scale: [0.92, 1.1, 1], 
      transition: { type: "spring", stiffness: 900, damping: 28 } 
    },
    shake: {
      // ULTRA-FAST 180ms SHAKE ON FAILED TRY
      x: [0, -7, 7, -4, 4, 0],
      transition: { duration: 0.18, ease: "linear" }
    },
    backtrack: {
      scale: [1.1, 0.95, 1],
      transition: { type: "spring", stiffness: 900, damping: 28 }
    },
    conflict: {
      scale: [1, 1.05, 1],
      transition: { repeat: Infinity, duration: 0.5, ease: "easeInOut", repeatType: "mirror" as const }
    }
  };

  return (
    <div className="h-full w-full flex flex-col gap-4 animate-[blurFadeIn_0.4s_ease-out]">
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        
        {/* Canvas Area */}
        <div className="col-span-8 relative bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl flex flex-col">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#09090B] shrink-0 z-20">
             <h2 className="font-mono text-white/80 font-bold tracking-tight text-sm uppercase flex items-center gap-2">
               SUDOKU FAST-RESPONSE ENGINE <Sparkles size={16} className="text-amber-400 animate-spin" />
             </h2>
             <div className="font-mono text-xs text-amber-400 font-bold">Step {currentIndex + 1} / {steps.length}</div>
          </div>
          
          <div className="flex-1 relative w-full h-full cursor-grab active:cursor-grabbing overflow-hidden bg-[#040405]">
            <TransformWrapper initialScale={1} minScale={0.3} maxScale={4} centerOnInit={true} wheel={{ step: 0.1 }}>
              <TransformComponent 
                wrapperStyle={{ width: "100%", height: "100%" }} 
                contentStyle={{ minWidth: "100%", minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px" }}
              >
                {/* Candidate Badge Banner */}
                {step.state.validCandidates.length > 0 && step.state.row !== null && (
                  <div className="mb-6 bg-gradient-to-r from-blue-950/60 via-indigo-900/60 to-blue-950/60 border border-blue-400/50 px-6 py-2 font-mono text-xs text-blue-200 flex items-center gap-3 shadow-[0_0_25px_rgba(59,130,246,0.35)] backdrop-blur-md">
                    <span className="text-white/60 uppercase text-[10px] font-bold tracking-widest">Tia Quét [{step.state.row},{step.state.col}] -&gt; Úng Viên Khả Thi:</span>
                    <div className="flex gap-1.5">
                      {step.state.validCandidates.map((cand) => (
                        <span 
                          key={cand}
                          className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 font-extrabold text-sm shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                        >
                          {cand}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* High-Contrast Sudoku Board with Fast Spring Motion Cells */}
                <div className="inline-block border-4 border-indigo-500/60 bg-[#09090B] p-3 shadow-[0_0_70px_rgba(99,102,241,0.35)] relative">
                  {step.state.board.map((row, r) => (
                    <div key={r} className="flex">
                      {row.map((val, c) => {
                        const isInitial = step.state.initialBoard[r][c] !== 0;
                        const isCurrentTarget = step.state.row === r && step.state.col === c;
                        const isConflict = step.state.conflictCells.some(cell => cell.r === r && cell.c === c);
                        const isBacktracking = isCurrentTarget && step.state.isBacktracking;

                        // Subgrid coordinates for alternating checkerboard pattern
                        const subR = Math.floor(r / sub);
                        const subC = Math.floor(c / sub);
                        const isEvenSubgrid = (subR + subC) % 2 === 0;

                        // Scope Beams (Row r, Col c, or Subgrid)
                        const isSameRow = step.state.row === r;
                        const isSameCol = step.state.col === c;
                        const isSameSubgrid = step.state.row !== null && step.state.col !== null &&
                          Math.floor(r / sub) === Math.floor(step.state.row / sub) &&
                          Math.floor(c / sub) === Math.floor(step.state.col / sub);
                        const isScoped = isSameRow || isSameCol || isSameSubgrid;

                        // Subgrid thick border styling
                        const borderBottom = (r + 1) % sub === 0 && r !== N - 1 ? "border-b-2 border-b-indigo-400/80" : "border-b border-b-white/10";
                        const borderRight = (c + 1) % sub === 0 && c !== N - 1 ? "border-r-2 border-r-indigo-400/80" : "border-r border-r-white/10";

                        // Base subgrid background contrast
                        let styleClasses = isEvenSubgrid ? "bg-[#0b0c10] text-white/80" : "bg-[#131520] text-white/90";
                        let animateState = "idle";

                        // State & Priority Determination
                        if (isInitial) {
                          styleClasses = "bg-[#181a28] text-cyan-300 font-black border-cyan-500/30 shadow-inner";
                        } else if (isCurrentTarget && isConflict) {
                          // FAILED TRY / COLLISION ERROR -> ULTRA FAST SHAKE
                          styleClasses = "bg-rose-500/40 border-2 border-rose-400 text-rose-100 font-black scale-110 z-30 shadow-[0_0_30px_rgba(244,63,94,0.9)]";
                          animateState = "shake";
                        } else if (isCurrentTarget) {
                          // ACTIVE TRY / BACKTRACKING
                          if (isBacktracking) {
                            styleClasses = "bg-rose-500/30 border-2 border-rose-400 text-rose-300 font-black scale-110 z-30 shadow-[0_0_25px_rgba(244,63,94,0.7)]";
                            animateState = "backtrack";
                          } else {
                            styleClasses = "bg-amber-500/40 border-2 border-amber-300 text-amber-200 font-black scale-110 z-30 shadow-[0_0_30px_rgba(251,191,36,0.9)]";
                            animateState = "active";
                          }
                        } else if (isConflict) {
                          // OPPONENT CONFLICT CELL
                          styleClasses = "bg-rose-500/30 border border-rose-500/80 text-rose-200 font-black z-20 shadow-[0_0_20px_rgba(244,63,94,0.6)]";
                          animateState = "conflict";
                        } else if (isScoped) {
                          // SCOPE BEAM HIGHLIGHT
                          styleClasses = "bg-indigo-500/20 text-indigo-100 border-indigo-500/30 font-semibold";
                        } else if (val !== 0) {
                          // SOLVED / FILLED DIGIT
                          styleClasses = "bg-emerald-500/15 text-emerald-300 font-bold border-emerald-500/30";
                        }

                        // Displayed digit (prioritize attempted number if cell is currently target)
                        const displayDigit = val !== 0 ? val : (isCurrentTarget && step.state.num ? step.state.num : "");

                        return (
                          <motion.div 
                            key={`${r}-${c}`}
                            variants={cellVariants}
                            animate={animateState}
                            className={`w-13 h-13 min-w-[50px] min-h-[50px] m-0.5 flex items-center justify-center font-mono text-xl transition-colors duration-100 border relative ${borderBottom} ${borderRight} ${styleClasses}`}
                          >
                            {isInitial && (
                              <Lock size={9} className="text-cyan-400/40 absolute top-1 left-1" />
                            )}
                            
                            {isCurrentTarget && isConflict && (
                              <AlertTriangle size={10} className="text-rose-400 absolute top-1 right-1" />
                            )}

                            {displayDigit !== "" && (
                              <motion.span
                                key={`${r}-${c}-${displayDigit}`}
                                initial={{ scale: 0.7, opacity: 0.3 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.08, ease: "easeOut" }}
                                className="font-black"
                              >
                                {displayDigit}
                              </motion.span>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </TransformComponent>
            </TransformWrapper>
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

        {/* Dashboard */}
        <div className="col-span-4 flex flex-col gap-4 min-h-0">
          <div className="flex-[3] min-h-0">
            <CodeBlock 
              snippets={CODE_SUDOKU} 
              mappings={MAPPINGS_SUDOKU} 
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
          <input 
            type="range" 
            min="20" 
            max="800" 
            step="20" 
            style={{ direction: 'rtl' }} 
            value={playbackSpeed} 
            onChange={(e) => setPlaybackSpeed(parseInt(e.target.value))} 
            className="w-24 accent-amber-500 h-1 bg-white/10 appearance-none cursor-pointer" 
          />
        </div>
      </div>
    </div>
  );
}
