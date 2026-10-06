"use client";

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, MessageSquareQuote } from 'lucide-react';
import { Step, InputType } from '@/lib/tracers/dijkstra';
import { CODE_DIJKSTRA, MAPPINGS_DIJKSTRA } from '@/lib/tracers/dijkstra-code';
import CodeBlock from '@/components/CodeBlock';
import { usePlayback } from '@/hooks/usePlayback';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface VisualizerProps {
  input: InputType;
  steps: Step[];
}

export default function DijkstraVisualizer({ input, steps }: VisualizerProps) {
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
  
  const uniqueEdges = useMemo(() => {
    if (!input || !input.edges) return [];
    return input.edges.filter(e => String(e.from) < String(e.to));
  }, [input]);

  if (!step) return null;

  return (
    <div className="h-full w-full flex flex-col gap-4 animate-[blurFadeIn_0.4s_ease-out]">
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        
        {/* The Canvas */}
        <div className="col-span-8 relative bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl flex flex-col">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#09090B] z-20 shrink-0">
            <h2 className="font-mono text-white/80 font-bold tracking-tight text-sm uppercase">DIJKSTRA SHORTEST PATH GRAPH <span className="text-[10px] text-white/40 ml-2">(Scroll to Zoom, Drag to Pan)</span></h2>
            <div className="font-mono text-xs text-amber-400 font-bold">Step {currentIndex + 1} / {steps.length}</div>
          </div>
          
          <div className="flex-1 relative w-full h-full cursor-grab active:cursor-grabbing overflow-hidden bg-[#040405]">
            <TransformWrapper initialScale={1} minScale={0.2} maxScale={4} centerOnInit={true} wheel={{ step: 0.1 }}>
              <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "800px", height: "600px", position: "relative" }}>
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {uniqueEdges.map((edge, idx) => {
                    const fromNode = input.nodes?.find(n => String(n.id) === String(edge.from));
                    const toNode = input.nodes?.find(n => String(n.id) === String(edge.to));
                    if (!fromNode || !toNode) return null;

                    const isActive = (String(step.state.currentNode) === String(edge.from) && String(step.state.currentNeighbor) === String(edge.to)) ||
                                     (String(step.state.currentNode) === String(edge.to) && String(step.state.currentNeighbor) === String(edge.from));
                    const isPath = (String(step.state.previous[edge.to]) === String(edge.from)) || (String(step.state.previous[edge.from]) === String(edge.to));

                    return (
                      <g key={idx}>
                        <line x1={`${fromNode.x}%`} y1={`${fromNode.y}%`} x2={`${toNode.x}%`} y2={`${toNode.y}%`} className={`${isActive ? 'stroke-amber-400' : isPath ? 'stroke-blue-500' : 'stroke-white/20'} transition-all duration-300`} strokeWidth={isActive ? 4 : isPath ? 3 : 1.5} />
                        <text x={`${(fromNode.x + toNode.x) / 2}%`} y={`${(fromNode.y + toNode.y) / 2}%`} className={`font-mono text-[10px] select-none transition-colors ${isActive ? 'fill-amber-400 font-bold' : 'fill-white/30'}`} textAnchor="middle" dy="-0.75rem">{edge.weight}</text>
                      </g>
                    )
                  })}
                </svg>

                {input.nodes?.map(node => {
                  const isCurrent = String(step.state.currentNode) === String(node.id);
                  const isNeighbor = String(step.state.currentNeighbor) === String(node.id);
                  const isVisited = step.state.visited[node.id];
                  const dist = step.state.distances[node.id];

                  return (
                    <motion.div key={node.id} layout className={`absolute w-12 h-12 -ml-6 -mt-6 flex items-center justify-center font-mono font-bold border-2 backdrop-blur-xl shadow-lg transition-colors z-10 ${isCurrent ? 'bg-amber-500/20 border-amber-400 text-amber-400 shadow-amber-500/30 font-black scale-110' : isNeighbor ? 'bg-blue-500/20 border-blue-400 text-blue-400 shadow-blue-500/30' : isVisited ? 'bg-zinc-800/80 border-white/30 text-white shadow-white/10' : 'bg-[#09090B] border-white/10 text-white/50'}`} style={{ left: `${node.x}%`, top: `${node.y}%` }}>
                      {node.id}
                      <div className="absolute -bottom-7 w-16 text-center text-[10px] text-white/50 bg-[#09090B] px-1 py-0.5 border border-white/10 flex justify-center items-center">
                        G: {dist === Infinity || dist === undefined ? '∞' : dist}
                      </div>
                    </motion.div>
                  )
                })}
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
              snippets={CODE_DIJKSTRA} 
              mappings={MAPPINGS_DIJKSTRA} 
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

            <h2 className="font-mono text-white/80 font-bold tracking-tight mb-2 flex mt-auto text-[10px] uppercase">Distance Array Map</h2>
            <div className="grid grid-cols-3 gap-2 pb-2">
              {Object.entries(step.state.distances).map(([node, dist]) => (
                <div key={node} className="bg-[#09090B] p-1.5 border border-white/5 text-center text-[10px] font-mono shadow-inner">
                  <span className="text-white/40">{node}:</span> <span className="text-white font-bold pl-1">{dist === Infinity ? '∞' : dist}</span>
                </div>
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
          <input type="range" min="100" max="1500" step="100" style={{ direction: 'rtl' }} value={playbackSpeed} onChange={(e) => setPlaybackSpeed(parseInt(e.target.value))} className="w-24 accent-amber-500 h-1 bg-white/10 appearance-none cursor-pointer" />
        </div>
      </div>
    </div>
  );
}
