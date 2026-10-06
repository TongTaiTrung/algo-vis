"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, MessageSquareQuote } from 'lucide-react';
import { StepCentroid, InputCentroid } from '@/lib/tracers/centroid';
import { CODE_CENTROID, MAPPINGS_CENTROID } from '@/lib/tracers/centroid-code';
import CodeBlock from '@/components/CodeBlock';
import { usePlayback } from '@/hooks/usePlayback';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface VisualizerProps {
  input: InputCentroid;
  steps: StepCentroid[];
}

export default function CentroidVisualizer({ input, steps }: VisualizerProps) {
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
      {/* Top Workspace */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        
        {/* The Canvas (Graph View) */}
        <div className="col-span-8 relative bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl flex flex-col">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#09090B] z-20 shrink-0">
            <h2 className="font-mono text-white/80 font-bold tracking-tight text-sm uppercase">CENTROID DECOMPOSITION GRAPH <span className="text-[10px] text-white/40 ml-2">(Scroll to Zoom, Drag to Pan)</span></h2>
            <div className="font-mono text-xs text-amber-400 font-bold">Step {currentIndex + 1} / {steps.length}</div>
          </div>
          
          <div className="flex-1 relative w-full h-full cursor-grab active:cursor-grabbing overflow-hidden bg-[#040405]">
            <TransformWrapper initialScale={1} minScale={0.2} maxScale={4} centerOnInit={true} wheel={{ step: 0.1 }}>
              <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "800px", height: "600px", position: "relative" }}>
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {/* Original Tree Edges */}
                  {input.edges?.map((edge, idx) => {
                    const fromNode = input.nodes?.find(n => String(n.id) === String(edge.u));
                    const toNode = input.nodes?.find(n => String(n.id) === String(edge.v));
                    if (!fromNode || !toNode) return null;
                    
                    const isRemoved = step.state.isRemoved[edge.u] || step.state.isRemoved[edge.v];
                    const isComparing = (step.state.currentNode === edge.u && step.state.comparingNode === edge.v) ||
                                        (step.state.currentNode === edge.v && step.state.comparingNode === edge.u);

                    return (
                      <motion.line 
                        key={`orig-${idx}`}
                        x1={`${fromNode.x}%`} 
                        y1={`${fromNode.y}%`} 
                        x2={`${toNode.x}%`} 
                        y2={`${toNode.y}%`} 
                        className={`transition-all duration-300 ${isComparing ? 'stroke-blue-400' : 'stroke-white/10'}`}
                        strokeWidth={isComparing ? 6 : 2}
                        initial={{ opacity: 1 }}
                        animate={{ opacity: isRemoved ? 0.05 : 1 }}
                      />
                    )
                  })}

                  {/* Centroid Tree Edges */}
                  {step.state.centroidTreeEdges?.map((edge, idx) => {
                    const fromNode = input.nodes?.find(n => String(n.id) === String(edge.p));
                    const toNode = input.nodes?.find(n => String(n.id) === String(edge.c));
                    if (!fromNode || !toNode) return null;
                    
                    const path = `M ${fromNode.x} ${fromNode.y} Q ${(fromNode.x + toNode.x)/2} ${(fromNode.y + toNode.y)/2 - 15} ${toNode.x} ${toNode.y}`;

                    return (
                      <svg key={`cd-${idx}`} width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 overflow-visible">
                        <motion.path
                          d={path}
                          fill="transparent"
                          className="stroke-amber-500/60 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]"
                          strokeWidth="0.8"
                          strokeDasharray="1.5 1.5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5 }}
                        />
                      </svg>
                    )
                  })}
                </svg>

                {/* Tree Nodes */}
                {input.nodes?.map(node => {
                  const isRemoved = step.state.isRemoved[node.id];
                  const isActive = step.state.activeComponent[node.id];
                  const isCurrent = step.state.currentNode === node.id;
                  const isComparing = step.state.comparingNode === node.id;
                  
                  const sz = step.state.sz[node.id];
                  const level = step.state.centroidLevels[node.id];

                  return (
                    <motion.div 
                      key={node.id}
                      layout
                      className={`absolute w-12 h-12 -ml-6 -mt-6 flex items-center justify-center font-mono font-bold border-2 backdrop-blur-xl shadow-lg transition-all duration-300 z-10
                        ${isRemoved ? 'bg-amber-500/20 border-amber-400 text-amber-400 shadow-amber-500/40 z-20 scale-110' : 
                          isCurrent ? 'bg-blue-500/30 border-blue-400 text-blue-300 shadow-[0_0_20px_rgba(96,165,250,0.6)] scale-125 z-30' : 
                          isComparing ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300 shadow-emerald-500/40 z-20' : 
                          isActive ? 'bg-white/10 border-white/40 text-white/80' : 
                          'bg-[#09090B] border-white/5 text-white/20'}`}
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    >
                      {node.id}
                      
                      {!isRemoved && sz > 0 && (
                        <motion.div 
                          key={sz}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute -top-6 w-12 text-center text-[10px] text-blue-200 bg-blue-900/80 px-1 py-0.5 border border-blue-500/50"
                        >
                          sz: {sz}
                        </motion.div>
                      )}

                      {isRemoved && (
                        <div className="absolute -bottom-6 w-12 text-center text-[10px] text-amber-900 font-black bg-amber-400 px-1 py-0.5 border border-amber-200 shadow-xl">
                          L: {level}
                        </div>
                      )}
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
                         key={step.phase + currentIndex}
                         initial={{ opacity: 0, y: 15 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -15 }}
                         transition={{ duration: 0.25, ease: "easeInOut" }}
                         className="font-sans text-[13.5px] text-white/90 leading-relaxed border-l-[3px] border-white/10 pl-3 m-0"
                      >
                         Phase [{step.phase}]: Đang thực hiện tìm Trọng tâm Cây (Centroid) để chia đôi quy mô cây con.
                      </motion.p>
                   </AnimatePresence>
                </div>
             </div>
          </div>

        </div>

        {/* The Dashboard (Code & Memory) */}
        <div className="col-span-4 flex flex-col gap-4 min-h-0">
          
          <div className="flex-[3] min-h-0">
            <CodeBlock 
              snippets={CODE_CENTROID} 
              mappings={MAPPINGS_CENTROID} 
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

            {step.state.currentTotal && (
              <div className="mt-auto bg-blue-500/10 border border-blue-500/30 p-3 flex justify-between items-center">
                 <span className="font-mono text-xs text-blue-200/60 uppercase">Nửa số Node (N/2)</span>
                 <span className="font-mono text-xl font-bold text-blue-400">{step.state.currentTotal / 2}</span>
              </div>
            )}
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
