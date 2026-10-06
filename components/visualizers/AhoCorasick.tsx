"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, MessageSquareQuote, Network } from 'lucide-react';
import { StepAhoCorasick, InputAhoCorasick, TrieNodeAC } from '@/lib/tracers/aho-corasick';
import { CODE_AHO_CORASICK, MAPPINGS_AHO_CORASICK } from '@/lib/tracers/aho-corasick-code';
import CodeBlock from '@/components/CodeBlock';
import { usePlayback } from '@/hooks/usePlayback';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface VisualizerProps { input: InputAhoCorasick; steps: StepAhoCorasick[]; }

// Clean Tree Layout for Trie Automaton
function computeTrieLayout(nodes: TrieNodeAC[]) {
  const depth: Record<number, number> = { 0: 0 };
  const parentMap: Record<number, number> = {};

  nodes.forEach(n => {
    Object.values(n.children).forEach(childId => {
      depth[childId] = (depth[n.id] || 0) + 1;
      parentMap[childId] = n.id;
    });
  });

  const childrenMap: Record<number, number[]> = {};
  nodes.forEach(n => {
    childrenMap[n.id] = Object.values(n.children);
  });

  const pos: { x: number; y: number }[] = Array(nodes.length).fill(0).map(() => ({ x: 0, y: 0 }));
  let leafCount = 0;

  function dfs(id: number): number {
    const chs = childrenMap[id] || [];
    if (chs.length === 0) {
      leafCount++;
      pos[id] = { x: leafCount * 110, y: depth[id] * 70 + 40 };
      return pos[id].x;
    }
    const childXs = chs.map(cId => dfs(cId));
    const midX = (childXs[0] + childXs[childXs.length - 1]) / 2;
    pos[id] = { x: midX, y: depth[id] * 70 + 40 };
    return midX;
  }

  dfs(0);
  const minX = Math.min(...pos.map(p => p.x));
  const maxX = Math.max(...pos.map(p => p.x));
  const shiftX = 350 - (minX + maxX) / 2;

  return pos.map((p, i) => ({ ...nodes[i], x: p.x + shiftX, y: p.y }));
}

export default function AhoCorasickVisualizer({ input, steps }: VisualizerProps) {
  const { currentIndex, isPlaying, playbackSpeed, stepForward, stepBackward, jumpTo, togglePlay, setPlaybackSpeed } = usePlayback(steps.length, 400);
  const step = steps[currentIndex];
  if (!step) return null;

  const nodes = computeTrieLayout(step.state.nodes);

  return (
    <div className="h-full w-full flex flex-col gap-4 animate-[blurFadeIn_0.4s_ease-out]">
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        
        {/* Canvas Area */}
        <div className="col-span-8 relative bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl flex flex-col">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#09090B] shrink-0 z-20">
             <h2 className="font-mono text-white/80 font-bold tracking-tight text-sm uppercase flex items-center gap-2">
               AHO-CORASICK AUTOMATON TRIE & FAIL LINKS <Network size={16} className="text-amber-400 animate-pulse" />
             </h2>
             <div className="font-mono text-xs text-amber-400 font-bold">Step {currentIndex + 1} / {steps.length}</div>
          </div>
          
          <div className="flex-1 relative w-full h-full cursor-grab active:cursor-grabbing overflow-hidden bg-[#040405] flex flex-col">
            <TransformWrapper initialScale={1} minScale={0.3} maxScale={4} centerOnInit={true} wheel={{ step: 0.1 }}>
              <TransformComponent 
                wrapperStyle={{ width: "100%", height: "100%" }} 
                contentStyle={{ minWidth: "100%", minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}
              >
                {/* Text Scanning Ribbon */}
                <div className="mb-6 flex flex-col items-center">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">Văn Bản Đang Quét (Text Stream)</span>
                  <div className="flex gap-1.5">
                    {step.state.text.split('').map((char, idx) => {
                      const isScanning = idx === step.state.charIdx;
                      return (
                        <div key={idx} className="flex flex-col items-center">
                          <span className="text-[9px] font-mono text-white/30 mb-1">{idx}</span>
                          <motion.div className={`w-10 h-12 border-2 flex items-center justify-center font-mono text-lg font-bold ${
                            isScanning ? 'bg-amber-500/30 border-amber-400 text-amber-200 scale-110 shadow-[0_0_15px_rgba(251,191,36,0.6)] z-10' :
                            idx < (step.state.charIdx ?? -1) ? 'bg-white/10 border-white/20 text-white/50' : 'bg-[#09090B] border-white/10 text-white/30'
                          }`}>
                            {char}
                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Trie Automaton Canvas */}
                <div className="relative w-[700px] h-[280px]">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                      <marker id="fail-arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#F43F5E" />
                      </marker>
                    </defs>

                    {/* Fail Links (Red Dashed Curved Arrows) */}
                    {nodes.map(n => {
                      if (n.fail === 0 && n.id === 0) return null;
                      const target = nodes.find(t => t.id === n.fail)!;
                      if (!target || !n) return null;
                      const isFailActive = step.state.failLinkActive?.from === n.id && step.state.failLinkActive?.to === target.id;

                      return (
                        <path
                          key={`fail-${n.id}`}
                          d={`M ${n.x} ${n.y} Q ${(n.x + target.x) / 2 + (n.id % 2 === 0 ? 40 : -40)} ${(n.y + target.y) / 2 - 30} ${target.x} ${target.y}`}
                          fill="none"
                          stroke={isFailActive ? "#F43F5E" : "#F43F5E50"}
                          strokeWidth={isFailActive ? 3 : 1.5}
                          strokeDasharray="4 4"
                          markerEnd="url(#fail-arrow)"
                        />
                      );
                    })}

                    {/* Trie Child Edges */}
                    {nodes.map(n => {
                      return Object.entries(n.children).map(([ch, childId]) => {
                        const childNode = nodes.find(t => t.id === childId)!;
                        if (!childNode || !n) return null;
                        return (
                          <g key={`trie-${n.id}-${childId}`}>
                            <line x1={n.x} y1={n.y} x2={childNode.x} y2={childNode.y} stroke="#38BDF8" strokeWidth={2.5} />
                            <rect x={(n.x + childNode.x) / 2 - 8} y={(n.y + childNode.y) / 2 - 10} width="16" height="16" rx="0" fill="#09090B" stroke="#38BDF8" strokeWidth="1" />
                            <text x={(n.x + childNode.x) / 2} y={(n.y + childNode.y) / 2 + 2} textAnchor="middle" fill="#38BDF8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                              {ch}
                            </text>
                          </g>
                        );
                      });
                    })}
                  </svg>

                  {/* Render Nodes */}
                  {nodes.map(n => {
                    const isActive = step.state.activeNode === n.id;
                    const hasOutput = n.output.length > 0;

                    let bgClass = "bg-[#09090B] border-white/20 text-white/70";
                    if (isActive) bgClass = "bg-amber-500/40 border-amber-300 text-amber-100 font-black scale-110 z-20 shadow-[0_0_20px_rgba(251,191,36,0.8)]";
                    else if (hasOutput) bgClass = "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold";

                    return (
                      <motion.div
                        key={n.id}
                        style={{ left: n.x - 20, top: n.y - 20 }}
                        className={`absolute w-10 h-10 border-2 flex flex-col items-center justify-center font-mono text-xs transition-all ${bgClass}`}
                      >
                        <span className="font-bold">{n.id === 0 ? 'R' : n.char}</span>
                        {hasOutput && (
                          <span className="absolute -bottom-5 text-[9px] text-emerald-400 font-extrabold bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/30 whitespace-nowrap">{n.output.join(',')}</span>
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
              snippets={CODE_AHO_CORASICK} 
              mappings={MAPPINGS_AHO_CORASICK} 
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

            <div className="mt-auto bg-emerald-500/10 border border-emerald-500/30 p-3 flex justify-between items-center">
              <span className="font-mono text-xs text-emerald-200/60 uppercase">Matches Found</span>
              <span className="font-mono text-xl font-bold text-emerald-400">{step.state.matchesFound.length}</span>
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
