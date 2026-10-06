"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, MessageSquareQuote, Zap } from 'lucide-react';
import { StepDinic, InputDinic } from '@/lib/tracers/dinic';
import { CODE_DINIC, MAPPINGS_DINIC } from '@/lib/tracers/dinic-code';
import CodeBlock from '@/components/CodeBlock';
import { usePlayback } from '@/hooks/usePlayback';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface VisualizerProps { input: InputDinic; steps: StepDinic[]; }

// Layered DAG Layout for Network Flow (Eliminates Edge Crossings)
function computeLayeredLayout(N: number, source: number, sink: number, edges: { u: number; v: number }[]) {
  const layers: number[][] = [];
  const visited = new Set<number>();
  
  // Layer 0: Source
  layers.push([source]);
  visited.add(source);

  // Layer 1 & 2: Intermediate nodes
  const remaining = Array.from({ length: N }).map((_, i) => i).filter(i => i !== source && i !== sink);
  const mid = Math.ceil(remaining.length / 2);
  const layer1 = remaining.slice(0, mid);
  const layer2 = remaining.slice(mid);

  if (layer1.length > 0) layers.push(layer1);
  if (layer2.length > 0) layers.push(layer2);
  
  // Final Layer: Sink
  layers.push([sink]);

  const positions: { x: number; y: number }[] = Array(N).fill(0).map(() => ({ x: 0, y: 0 }));
  const totalLayers = layers.length;

  layers.forEach((layerNodes, lIdx) => {
    const x = 90 + lIdx * (520 / (totalLayers - 1));
    const count = layerNodes.length;
    layerNodes.forEach((nodeId, idx) => {
      const y = 200 + (idx - (count - 1) / 2) * 110;
      positions[nodeId] = { x, y };
    });
  });

  return positions;
}

export default function DinicVisualizer({ input, steps }: VisualizerProps) {
  const { currentIndex, isPlaying, playbackSpeed, stepForward, stepBackward, jumpTo, togglePlay, setPlaybackSpeed } = usePlayback(steps.length, 300);
  const step = steps[currentIndex];
  if (!step) return null;

  const N = step.state.N;
  const nodes = computeLayeredLayout(N, step.state.source, step.state.sink, input.edges);

  return (
    <div className="h-full w-full flex flex-col gap-4 animate-[blurFadeIn_0.4s_ease-out]">
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        
        {/* Canvas Area */}
        <div className="col-span-8 relative bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl flex flex-col">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#09090B] shrink-0 z-20">
             <h2 className="font-mono text-white/80 font-bold tracking-tight text-sm uppercase flex items-center gap-2">
               DINIC LAYERED NETWORK FLOW (ZERO-CROSSING GRAPH) <Zap size={16} className="text-amber-400 animate-pulse" />
             </h2>
             <div className="font-mono text-xs text-amber-400 font-bold">Step {currentIndex + 1} / {steps.length}</div>
          </div>
          
          <div className="flex-1 relative w-full h-full cursor-grab active:cursor-grabbing overflow-hidden bg-[#040405]">
            <TransformWrapper initialScale={1} minScale={0.3} maxScale={4} centerOnInit={true} wheel={{ step: 0.1 }}>
              <TransformComponent 
                wrapperStyle={{ width: "100%", height: "100%" }} 
                contentStyle={{ minWidth: "100%", minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}
              >
                <div className="relative w-[700px] h-[400px]">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                      <marker id="arrow" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#38BDF8" />
                      </marker>
                      <marker id="arrow-active" viewBox="0 0 10 10" refX="24" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#F59E0B" />
                      </marker>
                    </defs>

                    {/* Render Edges */}
                    {step.state.edges.filter(e => e.cap > 0).map((edge, idx) => {
                      const uNode = nodes[edge.u];
                      const vNode = nodes[edge.v];
                      if (!uNode || !vNode) return null;

                      const isInActivePath = step.state.activePath.includes(edge.u) && step.state.activePath.includes(edge.v) && 
                                            step.state.activePath.indexOf(edge.v) === step.state.activePath.indexOf(edge.u) + 1;
                      const isFull = edge.flow === edge.cap;

                      let strokeColor = "#374151";
                      let strokeWidth = 2;
                      if (isInActivePath) { strokeColor = "#F59E0B"; strokeWidth = 4; }
                      else if (edge.flow > 0) { strokeColor = "#10B981"; strokeWidth = 3; }
                      else if (isFull) { strokeColor = "#EF4444"; strokeWidth = 2; }

                      const midX = (uNode.x + vNode.x) / 2;
                      const midY = (uNode.y + vNode.y) / 2;

                      return (
                        <g key={idx}>
                          <line 
                            x1={uNode.x} y1={uNode.y} x2={vNode.x} y2={vNode.y} 
                            stroke={strokeColor} 
                            strokeWidth={strokeWidth} 
                            markerEnd={isInActivePath ? "url(#arrow-active)" : "url(#arrow)"} 
                          />
                          <rect x={midX - 20} y={midY - 10} width="40" height="20" rx="0" fill="#09090B" stroke={strokeColor} strokeWidth="1.5" />
                          <text x={midX} y={midY + 4} textAnchor="middle" fill={isInActivePath ? "#F59E0B" : "#D1D5DB"} fontSize="10" fontFamily="monospace" fontWeight="bold">
                            {edge.flow}/{edge.cap}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {/* Render Nodes */}
                  {nodes.map((n, id) => {
                    const isSource = id === step.state.source;
                    const isSink = id === step.state.sink;
                    const isNodeActive = step.state.activeNode === id || step.state.activePath.includes(id);
                    const lvl = step.state.level[id];

                    let bgClass = "bg-[#09090B] border-white/20 text-white/70";
                    if (isSource) bgClass = "bg-blue-500/30 border-blue-400 text-blue-200 font-black shadow-[0_0_20px_rgba(96,165,250,0.6)]";
                    else if (isSink) bgClass = "bg-rose-500/30 border-rose-400 text-rose-200 font-black shadow-[0_0_20px_rgba(244,63,94,0.6)]";
                    else if (isNodeActive) bgClass = "bg-amber-500/40 border-amber-300 text-amber-100 font-black scale-110 shadow-[0_0_25px_rgba(251,191,36,0.8)] z-20";

                    return (
                      <motion.div
                        key={id}
                        style={{ left: n.x - 22, top: n.y - 22 }}
                        className={`absolute w-11 h-11 border-2 flex flex-col items-center justify-center font-mono text-sm transition-all ${bgClass}`}
                      >
                        <span className="font-bold">{id === step.state.source ? 'S' : id === step.state.sink ? 'T' : id}</span>
                        {lvl !== -1 && (
                          <span className="absolute -top-5 text-[9px] font-mono text-amber-400 font-extrabold bg-amber-500/20 px-1.5 py-0.5 border border-amber-500/30">L:{lvl}</span>
                        )}
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
              snippets={CODE_DINIC} 
              mappings={MAPPINGS_DINIC} 
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
            
            <div className="mt-auto bg-amber-500/10 border border-amber-500/30 p-3 flex justify-between items-center">
              <span className="font-mono text-xs text-amber-200/60 uppercase">Max Flow Result</span>
              <span className="font-mono text-xl font-bold text-amber-400">{step.state.maxFlow}</span>
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
