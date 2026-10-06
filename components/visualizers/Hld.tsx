"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, MessageSquareQuote, GitMerge } from 'lucide-react';
import { StepHLD, InputHLD } from '@/lib/tracers/hld';
import { CODE_HLD, MAPPINGS_HLD } from '@/lib/tracers/hld-code';
import CodeBlock from '@/components/CodeBlock';
import { usePlayback } from '@/hooks/usePlayback';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface VisualizerProps { input: InputHLD; steps: StepHLD[]; }

// Mathematical Tree Layout Algorithm to guarantee ZERO crossing lines
function computeTreeLayout(N: number, parent: number[], depth: number[]) {
  const children: number[][] = Array(N).fill(0).map(() => []);
  parent.forEach((p, u) => {
    if (p !== -1) children[p].push(u);
  });

  const pos: { x: number; y: number }[] = Array(N).fill(0).map(() => ({ x: 0, y: 0 }));
  let leafCount = 0;

  function dfs(u: number): number {
    if (children[u].length === 0) {
      leafCount++;
      pos[u] = { x: leafCount * 110, y: depth[u] * 70 + 40 };
      return pos[u].x;
    }
    const childXs = children[u].map(v => dfs(v));
    const midX = (childXs[0] + childXs[childXs.length - 1]) / 2;
    pos[u] = { x: midX, y: depth[u] * 70 + 40 };
    return midX;
  }

  dfs(0);
  const minX = Math.min(...pos.map(p => p.x));
  const maxX = Math.max(...pos.map(p => p.x));
  const shiftX = 350 - (minX + maxX) / 2;

  return pos.map(p => ({ x: p.x + shiftX, y: p.y }));
}

export default function HldVisualizer({ input, steps }: VisualizerProps) {
  const { currentIndex, isPlaying, playbackSpeed, stepForward, stepBackward, jumpTo, togglePlay, setPlaybackSpeed } = usePlayback(steps.length, 400);
  const step = steps[currentIndex];
  if (!step) return null;

  const N = step.state.N;
  // Use the final step's parent and depth to construct a stable tree layout
  const finalState = steps[steps.length - 1].state;
  const nodes = computeTreeLayout(N, finalState.parent, finalState.depth);

  return (
    <div className="h-full w-full flex flex-col gap-4 animate-[blurFadeIn_0.4s_ease-out]">
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        
        {/* Canvas Area */}
        <div className="col-span-8 relative bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl flex flex-col">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#09090B] shrink-0 z-20">
             <h2 className="font-mono text-white/80 font-bold tracking-tight text-sm uppercase flex items-center gap-2">
               HEAVY-LIGHT DECOMPOSITION (HIERARCHICAL TREE & 1D SEGMENT) <GitMerge size={16} className="text-amber-400 animate-pulse" />
             </h2>
             <div className="font-mono text-xs text-amber-400 font-bold">Step {currentIndex + 1} / {steps.length}</div>
          </div>
          
          <div className="flex-1 relative w-full h-full cursor-grab active:cursor-grabbing overflow-hidden bg-[#040405] flex flex-col">
            <TransformWrapper initialScale={1} minScale={0.3} maxScale={4} centerOnInit={true} wheel={{ step: 0.1 }}>
              <TransformComponent 
                wrapperStyle={{ width: "100%", height: "100%" }} 
                contentStyle={{ minWidth: "100%", minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}
              >
                {/* Tree Visual */}
                <div className="relative w-[700px] h-[260px] border-b border-white/10 mb-4">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {step.state.parent.map((p, u) => {
                      if (p === -1) return null;
                      const uNode = nodes[u];
                      const pNode = nodes[p];
                      if (!pNode || !uNode) return null;
                      const isHeavy = step.state.heavyChild[p] === u;

                      return (
                        <line
                          key={u}
                          x1={pNode.x} y1={pNode.y} x2={uNode.x} y2={uNode.y}
                          stroke={isHeavy ? "#38BDF8" : "#4B5563"}
                          strokeWidth={isHeavy ? 4 : 1.5}
                          strokeDasharray={isHeavy ? "none" : "4 4"}
                        />
                      );
                    })}
                  </svg>

                  {nodes.map((n, id) => {
                    if (!n) return null;
                    const isQueryPath = step.state.queryPathNodes.includes(id);
                    const posId = step.state.pos[id];

                    let bgClass = "bg-[#09090B] border-white/20 text-white/70";
                    if (isQueryPath) bgClass = "bg-amber-500/40 border-amber-300 text-amber-100 font-black scale-110 shadow-[0_0_20px_rgba(251,191,36,0.8)] z-20";

                    return (
                      <motion.div
                        key={id}
                        style={{ left: n.x - 20, top: n.y - 20 }}
                        className={`absolute w-10 h-10 border-2 flex flex-col items-center justify-center font-mono text-xs transition-all ${bgClass}`}
                      >
                        <span className="font-bold">{id}</span>
                        <span className="text-[8px] text-cyan-400 font-bold">p:{posId}</span>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Segment Tree 1D Flattened Array */}
                <div className="w-full flex flex-col items-center">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">Flattened 1D Segment Tree Array (pos[u])</span>
                  <div className="flex gap-1.5 flex-wrap justify-center">
                    {finalState.segArray.map((nodeId, posIdx) => {
                      const isInSegment = step.state.queryPathSegments.some(seg => posIdx >= seg.l && posIdx <= seg.r);
                      
                      return (
                        <motion.div
                          key={posIdx}
                          className={`w-11 h-12 border-2 flex flex-col items-center justify-center font-mono text-xs ${
                            isInSegment ? 'bg-amber-500/40 border-amber-300 text-amber-100 font-bold scale-110 shadow-[0_0_20px_rgba(251,191,36,0.7)]' : 'bg-[#09090B] border-white/10 text-white/40'
                          }`}
                        >
                          <span className="text-[9px] opacity-40">pos:{posIdx}</span>
                          <span className="font-bold">u:{nodeId}</span>
                        </motion.div>
                      );
                    })}
                  </div>
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
              snippets={CODE_HLD} 
              mappings={MAPPINGS_HLD} 
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
