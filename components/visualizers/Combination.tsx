"use client";

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, MessageSquareQuote } from 'lucide-react';
import { StepCombination, InputCombination, NodeComb } from '@/lib/tracers/combination';
import { CODE_COMBINATION, MAPPINGS_COMBINATION } from '@/lib/tracers/combination-code';
import CodeBlock from '@/components/CodeBlock';
import { usePlayback } from '@/hooks/usePlayback';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface VisualizerProps {
 input: InputCombination;
 steps: StepCombination[];
}

function getTreeLayout(nodes: NodeComb[]) {
 const layout = new Map<string, { x: number, y: number }>();
 const width = 1200;
 
 const queue: { id: string, left: number, right: number }[] = [];
 queue.push({ id: 'root', left: 0, right: width });
 layout.set('root', { x: width / 2, y: 40 });

 while (queue.length > 0) {
 const { id, left, right } = queue.shift()!;
 const node = nodes.find(n => n.id === id);
 if (!node) continue;
 
 const children = nodes.filter(n => n.parent === id).sort((a,b) => Number(a.label) - Number(b.label));
 if (children.length >= 1) {
 const step = (right - left) / children.length;
 children.forEach((child, idx) => {
 const cl = left + idx * step;
 const cr = left + (idx + 1) * step;
 const cx = (cl + cr) / 2;
 const cy = 40 + child.level * 80;
 layout.set(child.id, { x: cx, y: cy });
 queue.push({ id: child.id, left: cl, right: cr });
 });
 }
 }
 return layout;
}

export default function CombinationVisualizer({ input, steps }: VisualizerProps) {
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
 
 const layout = useMemo(() => getTreeLayout(step?.state.nodes || []), [step?.state.nodes]);

 if (!step) return null;

 return (
 <div className="h-full w-full flex flex-col gap-4 animate-[blurFadeIn_0.4s_ease-out]">
 <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
 
 {/* State Space Tree View */}
 <div className="col-span-8 relative bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl flex flex-col">
 <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#09090B] z-20 shrink-0">
 <h2 className="font-mono text-white/80 font-bold tracking-tight text-sm uppercase">STATE SPACE TREE <span className="text-[10px] text-white/40 ml-2">(Scroll to Zoom)</span></h2>
 <div className="font-mono text-xs text-amber-400 font-bold">Step {currentIndex + 1} / {steps.length}</div>
 </div>
 
 <div className="flex-1 relative w-full h-full cursor-grab active:cursor-grabbing overflow-hidden bg-[#040405]">
 <TransformWrapper initialScale={0.8} minScale={0.2} maxScale={4} centerOnInit={true} wheel={{ step: 0.1 }}>
 <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "1200px", height: "500px", position: "relative" }}>
 
 {/* Edges */}
 <svg className="absolute inset-0 w-full h-full pointer-events-none">
 {step.state.edges.map((edge, idx) => {
 const u = layout.get(edge.u);
 const v = layout.get(edge.v);
 if (!u || !v) return null;
 return (
 <motion.g key={'edge-'+idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
 <motion.line 
                          initial={{ x1: u.x, y1: u.y, x2: u.x, y2: u.y }} 
                          animate={{ x1: u.x, y1: u.y, x2: v.x, y2: v.y }} 
                          stroke="rgba(255,255,255,0.2)" strokeWidth={2} 
                          transition={{ type: "spring", stiffness: 450, damping: 25, mass: 0.8 }} 
                        />
 <motion.text 
                          initial={{ opacity: 0, x: u.x, y: u.y }} 
                          animate={{ opacity: 1, x: (u.x + v.x)/2, y: (u.y + v.y)/2 - 5 }} 
                          transition={{ type: "spring", stiffness: 450, damping: 25, mass: 0.8, delay: 0.05 }}
                          fill="rgba(255,255,255,0.5)" fontSize="12" textAnchor="middle"
                        >
                          {edge.label}
                        </motion.text>
 </motion.g>
 );
 })}
 </svg>

 {/* Nodes */}
 {step.state.nodes.map(node => {
 const pos = layout.get(node.id);
 if (!pos) return null;
 
 let bg = "bg-zinc-800 border-zinc-600";
 let text = "text-zinc-300";
 if (node.id === step.state.currentNode) {
 bg = "bg-amber-500/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]";
 text = "text-amber-400 font-bold";
 } else if (node.status === 'result') {
 bg = "bg-emerald-500/20 border-emerald-500";
 text = "text-emerald-400";
 } else if (node.status === 'visited') {
 bg = "bg-zinc-800/50 border-zinc-700/50";
 text = "text-zinc-500";
 }

 return (
 <motion.div
 key={node.id}
 className={`absolute w-8 h-8 -ml-4 -mt-4 border-2 flex items-center justify-center text-xs ${bg} ${text}`}
 style={{ left: pos.x, top: pos.y }}
 initial={{ scale: 0, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.8 }}
 >
 {node.label === 'root' ? 'R' : node.label}
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
 
 {/* Right Panel: Array state and Code */}
 <div className="col-span-4 flex flex-col gap-4 min-h-0">
 <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 overflow-hidden shadow-xl shrink-0">
 <h2 className="font-mono text-white/80 font-bold tracking-tight mb-4 text-sm uppercase">Tổ Hợp Đang Chọn</h2>
 <div className="flex gap-2 flex-wrap mb-4">
 {step.state.sequence.map((val, idx) => (
 <motion.div layout transition={{ type: "spring", stiffness: 400, damping: 25 }} key={idx} className={`w-10 h-10 border-2 flex items-center justify-center text-lg font-mono font-bold
 ${val !== null ? 'border-amber-500/50 bg-amber-500/10 text-amber-400' : 'border-white/10 bg-[#09090B] text-transparent'}`}
 >
 {val !== null ? val : '-'}
 </motion.div>
 ))}
 </div>
 
 <div className="mt-4 border-t border-white/10 pt-4">
 <h2 className="font-mono text-white/80 font-bold tracking-tight mb-2 flex mt-4 text-[10px] uppercase">Kết Quả Đã Lưu ({step.state.results.length})</h2>
 <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar">
 {step.state.results.map((res, i) => (
 <div key={i} className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono ">
 [{res.join(', ')}]
 </div>
 ))}
 </div>
 </div>
 </div>
 
 <div className="flex-[2] bg-white/5 backdrop-blur-md border border-white/10 p-4 overflow-hidden flex flex-col shadow-xl">
 <h2 className="font-mono text-white/80 font-bold tracking-tight mb-4 text-sm">PSEUDOCODE</h2>
 <div className="flex-1 overflow-auto bg-[#040405] border border-white/5 p-4 custom-scrollbar">
 <CodeBlock snippets={CODE_COMBINATION} mappings={MAPPINGS_COMBINATION} activeLine={step.activeLine} />
 </div>
 </div>
 </div>
 </div>
 
 {/* Control Deck */}
 <div className="h-16 bg-white/5 backdrop-blur-md border border-white/10 px-6 flex items-center justify-between gap-6 shadow-2xl shrink-0">
 <div className="flex items-center gap-4">
 <button onClick={stepBackward} disabled={currentIndex === 0} className="text-white/70 hover:text-white disabled:opacity-30 transition"><SkipBack size={20} /></button>
 <button onClick={togglePlay} className="text-amber-400 hover:text-amber-300 hover:scale-110 active:scale-95 transition-all">
 {isPlaying ? <Pause size={28} /> : <Play size={28} fill="currentColor" />}
 </button>
 <button onClick={stepForward} disabled={currentIndex === steps.length - 1} className="text-white/70 hover:text-white disabled:opacity-30 transition"><SkipForward size={20} /></button>
 </div>
 
 <div className="flex-1 flex items-center gap-4 px-8">
 <span className="font-mono text-xs text-white/40">Trace</span>
 <input type="range" min="0" max={steps.length - 1} value={currentIndex} onChange={(e) => jumpTo(parseInt(e.target.value))} className="flex-1 accent-amber-500 h-1 bg-white/10 appearance-none cursor-pointer" />
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