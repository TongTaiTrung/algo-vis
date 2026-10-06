"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, MessageSquareQuote, RefreshCw } from 'lucide-react';
import { StepRerooting, InputRerooting } from '@/lib/tracers/rerooting';
import { CODE_REROOTING, MAPPINGS_REROOTING } from '@/lib/tracers/rerooting-code';
import CodeBlock from '@/components/CodeBlock';
import { usePlayback } from '@/hooks/usePlayback';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface VisualizerProps { input: InputRerooting; steps: StepRerooting[]; }

// Dynamic Tree Layout centered around current Active Root
function computeRerootingTreeLayout(N: number, edges: [number, number][], root: number) {
  if (N === 0) return [];
  const adj: number[][] = Array(N).fill(0).map(() => []);
  edges.forEach(([u, v]) => {
    if(adj[u]) adj[u].push(v);
    if(adj[v]) adj[v].push(u);
  });

  const pos: { x: number; y: number }[] = Array(N).fill(0).map(() => ({ x: 0, y: 0 }));
  const visited = new Set<number>();
  let leafCount = 0;

  function dfs(u: number, depth: number): number {
    visited.add(u);
    const children = (adj[u] || []).filter(v => !visited.has(v));
    
    if (children.length === 0) {
      leafCount++;
      pos[u] = { x: leafCount * 110, y: depth * 70 + 50 };
      return pos[u].x;
    }
    const childXs = children.map(v => dfs(v, depth + 1));
    const midX = (childXs[0] + childXs[childXs.length - 1]) / 2;
    pos[u] = { x: midX, y: depth * 70 + 50 };
    return midX;
  }

  dfs(root, 0);
  const minX = Math.min(...pos.map(p => p.x));
  const maxX = Math.max(...pos.map(p => p.x));
  const shiftX = isNaN(minX) ? 0 : 350 - (minX + maxX) / 2;

  return pos.map(p => ({ x: p.x + shiftX, y: p.y }));
}

export default function RerootingVisualizer({ input, steps }: VisualizerProps) {
  const { currentIndex, isPlaying, playbackSpeed, stepForward, stepBackward, jumpTo, togglePlay, setPlaybackSpeed } = usePlayback(steps.length, 400);
  const step = steps[currentIndex];
  if (!step) return null;

  const N = step.state.N;
  const nodes = computeRerootingTreeLayout(N, input.edges, step.state.root);

  return (
    <div className="h-full w-full flex flex-col gap-4 animate-[blurFadeIn_0.4s_ease-out]">
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        
        {/* Canvas Area */}
        <div className="col-span-8 relative bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl flex flex-col">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#09090B] shrink-0 z-20">
             <h2 className="font-mono text-white/80 font-bold tracking-tight text-sm uppercase flex items-center gap-2">
               TREE REROOTING DP (HIERARCHICAL TREE RE-ROOTING) <RefreshCw size={16} className="text-amber-400 animate-spin" />
             </h2>
             <div className="font-mono text-xs text-amber-400 font-bold">Step {currentIndex + 1} / {steps.length}</div>
          </div>
          
          <div className="flex-1 relative w-full h-full cursor-grab active:cursor-grabbing overflow-hidden bg-[#040405] flex flex-col">
            <TransformWrapper initialScale={1} minScale={0.3} maxScale={4} centerOnInit={true} wheel={{ step: 0.1 }}>
              <TransformComponent 
                wrapperStyle={{ width: "100%", height: "100%" }} 
                contentStyle={{ minWidth: "100%", minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}
              >
                <div className="relative w-[700px] h-[360px]">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {input.edges.map(([u, v], idx) => {
                      const uNode = nodes[u];
                      const vNode = nodes[v];
                      if (!uNode || !vNode) return null;
                      const isRootEdge = (u === step.state.root && v === step.state.activeNode) || (v === step.state.root && u === step.state.activeNode);

                      const pathD = `M ${uNode.x} ${uNode.y} L ${vNode.x} ${vNode.y}`;
                      
                      return (
                        <motion.path
                          key={idx}
                          initial={false}
                          animate={{ d: pathD }}
                          transition={{ type: "spring", stiffness: 250, damping: 28, mass: 1 }}
                          stroke={isRootEdge ? "#F59E0B" : "#38BDF8"}
                          strokeWidth={isRootEdge ? 4 : 2}
                          fill="transparent"
                        />
                      );
                    })}
                  </svg>

                  {/* Render Nodes with Framer Motion Springs */}
                  {nodes.map((n, id) => {
                    if (!n) return null;
                    const isRoot = id === step.state.root;
                    const isActive = id === step.state.activeNode;
                    const ansVal = step.state.ans[id];
                    const countVal = step.state.count[id];

                    let bgClass = "bg-[#09090B] border-white/20 text-white/70";
                    if (isRoot) bgClass = "bg-amber-500/40 border-amber-300 text-amber-100 font-black scale-110 shadow-[0_0_25px_rgba(251,191,36,0.8)] z-20";
                    else if (isActive) bgClass = "bg-blue-500/30 border-blue-400 text-blue-200 font-bold scale-105 z-10";

                    return (
                      <motion.div
                        key={id}
                        initial={false}
                        animate={{ x: n.x - 24, y: n.y - 24 }}
                        transition={{ type: "spring", stiffness: 250, damping: 28, mass: 1 }}
                        style={{ left: 0, top: 0 }}
                        className={`absolute w-12 h-12 border-2 flex flex-col items-center justify-center font-mono text-xs transition-colors duration-300 ${bgClass}`}
                      >
                        <span className="font-bold">{id}</span>
                        {ansVal > 0 && <span className="text-[9px] text-amber-300 font-extrabold">Ans:{ansVal}</span>}
                        {ansVal === 0 && <span className="text-[8px] text-white/40">c:{countVal}</span>}
                      </motion.div>
                    );
                  })}
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
              snippets={CODE_REROOTING} 
              mappings={MAPPINGS_REROOTING} 
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
