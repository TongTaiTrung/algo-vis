"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, MessageSquareQuote, TrendingDown } from 'lucide-react';
import { StepCHT, InputCHT } from '@/lib/tracers/cht';
import { CODE_CHT, MAPPINGS_CHT } from '@/lib/tracers/cht-code';
import CodeBlock from '@/components/CodeBlock';
import { usePlayback } from '@/hooks/usePlayback';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface VisualizerProps { input: InputCHT; steps: StepCHT[]; }

export default function ChtVisualizer({ input, steps }: VisualizerProps) {
  const { currentIndex, isPlaying, playbackSpeed, stepForward, stepBackward, jumpTo, togglePlay, setPlaybackSpeed } = usePlayback(steps.length, 400);
  const step = steps[currentIndex];
  if (!step) return null;

  return (
    <div className="h-full w-full flex flex-col gap-4 animate-[blurFadeIn_0.4s_ease-out]">
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        
        {/* Canvas Area */}
        <div className="col-span-8 relative bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl flex flex-col">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#09090B] shrink-0 z-20">
             <h2 className="font-mono text-white/80 font-bold tracking-tight text-sm uppercase flex items-center gap-2">
               CONVEX HULL TRICK (PRISTINE 2D LOWER ENVELOPE) <TrendingDown size={16} className="text-amber-400 animate-pulse" />
             </h2>
             <div className="font-mono text-xs text-amber-400 font-bold">Step {currentIndex + 1} / {steps.length}</div>
          </div>
          
          <div className="flex-1 relative w-full h-full cursor-grab active:cursor-grabbing overflow-hidden bg-[#040405] flex flex-col">
            <TransformWrapper initialScale={1} minScale={0.3} maxScale={4} centerOnInit={true} wheel={{ step: 0.1 }}>
              <TransformComponent 
                wrapperStyle={{ width: "100%", height: "100%" }} 
                contentStyle={{ minWidth: "100%", minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}
              >
                {/* 2D Coordinate System Canvas */}
                <div className="relative w-[650px] h-[340px] bg-[#09090B] border-2 border-white/10 overflow-hidden shadow-2xl">
                  {/* Axis Grid Lines */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-[1.5px] bg-white/20" />
                  <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-white/20" />
                  <span className="absolute left-1/2 top-2 text-[9px] font-mono text-white/30 ml-1">+Y</span>
                  <span className="absolute right-2 top-1/2 text-[9px] font-mono text-white/30 -mt-4">+X</span>

                  <svg className="absolute inset-0 w-full h-full">
                    {/* Render Hull Lines */}
                    {step.state.hullLines.map((line) => {
                      const isActive = step.state.activeLine?.id === line.id;
                      const x1 = -12, y1 = line.m * x1 + line.c;
                      const x2 = 12, y2 = line.m * x2 + line.c;

                      const cx1 = 325 + x1 * 22, cy1 = 170 - y1 * 8;
                      const cx2 = 325 + x2 * 22, cy2 = 170 - y2 * 8;

                      return (
                        <g key={line.id}>
                          <line
                            x1={cx1} y1={cy1} x2={cx2} y2={cy2}
                            stroke={isActive ? "#F59E0B" : "#10B981"}
                            strokeWidth={isActive ? 3.5 : 2}
                            strokeOpacity={isActive ? 1 : 0.7}
                          />
                          <text x={cx2 - 70} y={cy2 - 8} fill={isActive ? "#F59E0B" : "#10B981"} fontSize="11" fontFamily="monospace" fontWeight="bold">
                            y={line.m}x+{line.c}
                          </text>
                        </g>
                      );
                    })}

                    {/* Query vertical line x = q */}
                    {step.state.queryX !== null && (
                      <g>
                        <line
                          x1={325 + step.state.queryX * 22} y1={0}
                          x2={325 + step.state.queryX * 22} y2={340}
                          stroke="#60A5FA" strokeWidth="2.5" strokeDasharray="5 5"
                        />
                        {step.state.bestY !== null && (
                          <g>
                            <circle
                              cx={325 + step.state.queryX * 22}
                              cy={170 - step.state.bestY * 8}
                              r="7"
                              fill="#F59E0B"
                              stroke="#FFFFFF" strokeWidth="2.5"
                            />
                            <text
                              x={325 + step.state.queryX * 22 + 12}
                              cy={170 - step.state.bestY * 8 + 4}
                              fill="#F59E0B" fontSize="11" fontFamily="monospace" fontWeight="bold"
                            >
                              Min Y = {step.state.bestY}
                            </text>
                          </g>
                        )}
                      </g>
                    )}
                  </svg>
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
              snippets={CODE_CHT} 
              mappings={MAPPINGS_CHT} 
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
