"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, MessageSquareQuote, Grid, Skull, ArrowDown, ArrowRight } from 'lucide-react';
import { StepGridPaths, InputGridPaths } from '@/lib/tracers/grid-paths';
import { CODE_GRID_PATHS, MAPPINGS_GRID_PATHS } from '@/lib/tracers/grid-paths-code';
import CodeBlock from '@/components/CodeBlock';
import { usePlayback } from '@/hooks/usePlayback';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface VisualizerProps {
  input: InputGridPaths;
  steps: StepGridPaths[];
}

export default function GridPathsVisualizer({ input, steps }: VisualizerProps) {
  const {
    currentIndex,
    isPlaying,
    playbackSpeed,
    stepForward,
    stepBackward,
    jumpTo,
    togglePlay,
    setPlaybackSpeed,
  } = usePlayback(steps.length, 600);

  const step = steps[currentIndex];
  if (!step) return null;

  return (
    <div className="h-full w-full flex flex-col gap-4 animate-[blurFadeIn_0.4s_ease-out]">
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        
        {/* Canvas */}
        <div className="col-span-8 relative bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl flex flex-col">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#09090B] z-20">
            <div className="flex items-center gap-2">
              <Grid size={18} className="text-violet-400" />
              <h2 className="font-mono text-white/80 font-bold tracking-tight text-sm">
                CSES: GRID PATHS I (2D DP WITH TRAPS)
              </h2>
            </div>
            <div className="font-mono text-xs text-violet-400 font-bold">
              Step {currentIndex + 1} / {steps.length}
            </div>
          </div>
          
          <div className="flex-1 relative w-full h-full cursor-grab active:cursor-grabbing overflow-hidden">
            <TransformWrapper initialScale={1} minScale={0.3} maxScale={4} centerOnInit={true} wheel={{ step: 0.1 }}>
              <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ minWidth: "100%", minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "30px" }}>
                <div className="inline-block border border-white/10 bg-[#09090B] p-5 shadow-2xl">
                  {/* Grid Header Columns */}
                  <div className="flex mb-2">
                    <div className="w-12 text-right pr-2 text-[10px] text-white/40 font-mono self-center">r \ c</div>
                    {Array.from({ length: input.n }).map((_, c) => (
                      <div key={c} className="w-16 m-1 flex items-center justify-center text-xs text-white/60 font-mono font-bold">
                        c={c}
                      </div>
                    ))}
                  </div>

                  {/* Grid Rows */}
                  {step.state.dp.map((row, r) => (
                    <div key={r} className="flex mb-2 items-center">
                      <div className="w-12 pr-2 text-right text-xs text-white/60 font-mono font-bold">
                        r={r}
                      </div>
                      {row.map((val, c) => {
                        const isTrap = input.grid[r][c] === '*';
                        const isCurrent = step.state.r === r && step.state.c === c;
                        const isWriting = step.state.writing?.r === r && step.state.writing?.c === c;
                        const isFromTop = step.state.fromTop?.r === r && step.state.fromTop?.c === c;
                        const isFromLeft = step.state.fromLeft?.r === r && step.state.fromLeft?.c === c;
                        const isStart = r === 0 && c === 0;
                        const isEnd = r === input.n - 1 && c === input.n - 1;

                        return (
                          <motion.div
                            key={c}
                            layout
                            className={`w-16 h-16 m-1 flex flex-col items-center justify-center font-mono relative transition-all border ${
                              isTrap ? 'bg-rose-950/40 border-rose-500/60 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]' :
                              isWriting ? 'bg-violet-500/30 border-violet-400 text-violet-300 shadow-[0_0_25px_rgba(139,92,246,0.6)] z-20 font-black scale-105' :
                              isFromTop ? 'bg-sky-500/25 border-sky-400 text-sky-200 shadow-[0_0_20px_rgba(56,189,248,0.5)] z-10' :
                              isFromLeft ? 'bg-amber-500/25 border-amber-400 text-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.5)] z-10' :
                              isCurrent ? 'bg-white/15 border-white/50 text-white font-bold ring-2 ring-violet-400/50' :
                              val > 0 ? 'bg-violet-500/10 border-violet-500/20 text-violet-200' :
                              'bg-[#09090B] border-white/5 text-white/30'
                            }`}
                          >
                            {/* Direction Arrows */}
                            {isFromTop && (
                              <ArrowDown size={12} className="absolute -bottom-2 text-sky-400" />
                            )}
                            {isFromLeft && (
                              <ArrowRight size={12} className="absolute -right-2 text-amber-400 animate-pulse" />
                            )}

                            {isTrap ? (
                              <>
                                <Skull size={18} className="text-rose-400 mb-0.5" />
                                <span className="text-[10px] uppercase font-bold tracking-wider">BẪY</span>
                              </>
                            ) : (
                              <>
                                <span className="text-sm font-bold">{val}</span>
                                {(isStart || isEnd) && (
                                  <span className={`text-[8px] font-sans font-bold px-1 uppercase tracking-wider ${
                                    isStart ? 'text-emerald-400 bg-emerald-500/20' : 'text-amber-400 bg-amber-500/20'
                                  }`}>
                                    {isStart ? 'Start' : 'End'}
                                  </span>
                                )}
                              </>
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

          {/* NARRATIVE PANEL */}
          <div className="bg-[#09090B] border-t border-violet-500/30 p-5 z-20 flex gap-4 items-start shrink-0 shadow-[0_-15px_30px_rgba(0,0,0,0.4)]">
             <div className="bg-violet-500/20 p-2.5 shrink-0 border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.3)] mt-1">
                <MessageSquareQuote size={20} className="text-violet-400" />
             </div>
             <div className="flex-1 overflow-hidden">
                <h4 className="text-violet-400 font-bold font-mono text-[11px] mb-1.5 uppercase tracking-widest">{step.phase}</h4>
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
              snippets={CODE_GRID_PATHS} 
              mappings={MAPPINGS_GRID_PATHS} 
              activeLine={step.activeLine}
            />
          </div>

          <div className="flex-[2] bg-white/5 backdrop-blur-md border border-white/10 p-4 overflow-y-auto flex flex-col shadow-xl">
            <h2 className="font-mono text-white/80 font-bold tracking-tight mb-4 text-sm">LOCAL MEMORY</h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {Object.entries(step.memory).map(([key, val]) => (
                <motion.div key={key} layout className="bg-[#09090B] p-2 border border-white/5 flex flex-col justify-center">
                  <span className="text-white/40 text-[10px] uppercase tracking-wider">{key}</span>
                  <span className="text-violet-400 font-mono text-sm font-bold truncate">{val}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Control Deck */}
      <div className="h-16 bg-white/5 backdrop-blur-md border border-white/10 px-6 flex items-center justify-between gap-6 shadow-2xl shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={stepBackward} disabled={currentIndex === 0} className="text-white/70 hover:text-white disabled:opacity-30 transition"><SkipBack size={20} /></button>
          <button onClick={togglePlay} className="text-violet-400 hover:text-violet-300 hover:scale-110 active:scale-95 transition-all">
            {isPlaying ? <Pause size={28} /> : <Play size={28} fill="currentColor" />}
          </button>
          <button onClick={stepForward} disabled={currentIndex === steps.length - 1} className="text-white/70 hover:text-white disabled:opacity-30 transition"><SkipForward size={20} /></button>
        </div>
        
        <div className="flex-1 flex items-center gap-4 px-8">
          <span className="font-mono text-xs text-white/40">Trace</span>
          <input type="range" min="0" max={steps.length - 1} value={currentIndex} onChange={(e) => jumpTo(parseInt(e.target.value))} className="flex-1 accent-violet-500 h-1 bg-white/10 appearance-none cursor-pointer" />
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
