"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, MessageSquareQuote } from 'lucide-react';
import { StepDP, InputDP } from '@/lib/tracers/dp-knapsack';
import { CODE_DP, MAPPINGS_DP } from '@/lib/tracers/dp-knapsack-code';
import CodeBlock from '@/components/CodeBlock';
import { usePlayback } from '@/hooks/usePlayback';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface VisualizerProps {
  input: InputDP;
  steps: StepDP[];
}

export default function DPKnapsackVisualizer({ input, steps }: VisualizerProps) {
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
        
        {/* The Canvas (Matrix View) */}
        <div className="col-span-8 relative bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl flex flex-col">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#09090B] z-20">
            <h2 className="font-mono text-white/80 font-bold tracking-tight text-sm">CANVAS / DP MATRIX <span className="text-[10px] text-white/40 ml-2">(Scroll to Zoom, Drag to Pan)</span></h2>
            <div className="font-mono text-xs text-amber-400 font-bold">Step {currentIndex + 1} / {steps.length}</div>
          </div>
          
          <div className="flex-1 relative w-full h-full cursor-grab active:cursor-grabbing overflow-hidden">
            <TransformWrapper initialScale={1} minScale={0.2} maxScale={4} centerOnInit={true} wheel={{ step: 0.1 }}>
              <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ minWidth: "100%", minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px" }}>
                <div className="inline-block border border-white/10 bg-[#09090B] p-4 shadow-2xl">
                  {/* Header Row: Capacity */}
                  <div className="flex mb-1">
                    <div className="w-24 text-right pr-4 text-[10px] text-white/40 font-mono self-center">Capacity →</div>
                    {Array.from({ length: input.capacity + 1 }).map((_, w) => (
                      <div key={w} className="w-12 m-0.5 flex items-center justify-center text-xs text-white/60 font-mono font-bold">{w}</div>
                    ))}
                  </div>
                  
                  {/* Matrix Rows */}
                  {step.state.dp.map((row, r) => (
                    <div key={r} className="flex mb-1">
                      <div className="w-24 pr-4 text-right flex flex-col justify-center">
                        {r === 0 ? (
                          <span className="text-[10px] text-white/40 font-mono">0 (Base)</span>
                        ) : (
                          <span className="text-[10px] text-emerald-400/80 font-mono">
                            Item {r} <br /> v:{input.items[r-1].value} w:{input.items[r-1].weight}
                          </span>
                        )}
                      </div>
                      {row.map((val, c) => {
                        const isComparing = step.state.comparing.some(cell => cell.r === r && cell.c === c);
                        const isWriting = step.state.writing?.r === r && step.state.writing?.c === c;
                        const isActiveRow = step.state.r === r;
                        const isActiveCol = step.state.c === c;
                        const isCurrentLoopCell = isActiveRow && isActiveCol;
                        
                        return (
                          <motion.div 
                            layout key={c}
                            className={`w-12 h-12 m-0.5 flex items-center justify-center font-mono text-sm transition-colors cursor-default border ${
                              isWriting ? 'bg-amber-500/30 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.4)] z-10 font-bold' :
                              isComparing ? 'bg-blue-500/30 border-blue-400 text-blue-300 shadow-[0_0_15px_rgba(96,165,250,0.4)] z-10 font-bold' :
                              isCurrentLoopCell ? 'bg-white/10 border-white/40 text-white/80' :
                              val > 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200' :
                              'bg-[#09090B] border-white/5 text-white/40'
                            }`}
                          >
                            {val}
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
              snippets={CODE_DP} 
              mappings={MAPPINGS_DP} 
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
          <button onClick={stepBackward} disabled={currentIndex === 0} className="text-white/70 hover:text-white disabled:opacity-30 transition"><SkipBack size={20} /></button>
          <button onClick={togglePlay} className="text-blue-400 hover:text-blue-300 hover:scale-110 active:scale-95 transition-all">
            {isPlaying ? <Pause size={28} /> : <Play size={28} fill="currentColor" />}
          </button>
          <button onClick={stepForward} disabled={currentIndex === steps.length - 1} className="text-white/70 hover:text-white disabled:opacity-30 transition"><SkipForward size={20} /></button>
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
