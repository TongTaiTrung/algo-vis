"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, MessageSquareQuote } from 'lucide-react';
import { StepMo, InputMo } from '@/lib/tracers/mo-algorithm';
import { CODE_MO, MAPPINGS_MO } from '@/lib/tracers/mo-algorithm-code';
import CodeBlock from '@/components/CodeBlock';
import { usePlayback } from '@/hooks/usePlayback';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface VisualizerProps { input: InputMo; steps: StepMo[]; onUpdateInput?: (newData: any) => void; }

export default function MoVisualizer({ input, steps, onUpdateInput }: VisualizerProps) {
  const [newL, React_setNewL] = React.useState("");
  const [newR, React_setNewR] = React.useState("");

  const handleAddQuery = () => {
    const L = parseInt(newL);
    const R = parseInt(newR);
    if (!isNaN(L) && !isNaN(R) && L <= R && L >= 0 && R < input.arr.length) {
      if (onUpdateInput) {
        onUpdateInput({
          ...input,
          queries: [...input.queries, { L, R }]
        });
      }
      React_setNewL("");
      React_setNewR("");
    } else {
      alert(`Vui lòng nhập L <= R và trong khoảng 0 đến ${input.arr.length - 1}`);
    }
  };
  const { currentIndex, isPlaying, playbackSpeed, stepForward, stepBackward, jumpTo, togglePlay, setPlaybackSpeed } = usePlayback(steps.length, 600);
  const step = steps[currentIndex];
  if (!step) return null;

  return (
    <div className="h-full w-full flex flex-col gap-4 animate-[blurFadeIn_0.4s_ease-out]">
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        
        {/* The Canvas (Array & Queries View) */}
        <div className="col-span-8 relative bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl flex flex-col">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#09090B] z-20 shrink-0">
            <h2 className="font-mono text-white/80 font-bold tracking-tight text-sm uppercase">MO'S ALGORITHM (RANGE QUERIES) <span className="text-[10px] text-white/40 ml-2">(Scroll to Zoom)</span></h2>
            <div className="font-mono text-xs text-amber-400 font-bold">Step {currentIndex + 1} / {steps.length}</div>
          </div>
          
          <div className="flex-1 relative w-full h-full cursor-grab active:cursor-grabbing overflow-hidden bg-[#040405]">
            <TransformWrapper initialScale={1} minScale={0.3} maxScale={4} centerOnInit={true} wheel={{ step: 0.1 }}>
              <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ minWidth: "100%", minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px" }}>
                
                <div className="flex flex-col items-center justify-center gap-8">
                  <div className="flex gap-2">
                    {step.state.arr.map((val, idx) => {
                      const isL = step.state.currL === idx;
                      const isR = step.state.currR === idx;
                      const isInRange = idx >= step.state.currL && idx <= step.state.currR;

                      let bgClass = "bg-[#09090B] border-white/20 text-white/50";
                      if (isInRange) bgClass = "bg-amber-500/20 border-amber-400 text-amber-400 font-bold shadow-[0_0_15px_rgba(251,191,36,0.3)]";
                      
                      return (
                        <div key={idx} className="flex flex-col items-center">
                          <span className="text-[10px] font-mono text-white/30 mb-2">{idx}</span>
                          <motion.div layout className={`w-12 h-14 border-2 flex items-center justify-center font-mono text-lg transition-colors duration-300 ${bgClass}`}>
                            {val}
                          </motion.div>
                          
                          <div className="h-8 mt-2 relative w-full flex justify-center">
                            {isL && (
                              <motion.div layoutId="pointerL" className="absolute flex flex-col items-center text-blue-400 font-mono text-xs font-bold leading-none z-10">
                                <span>↑</span><span>L</span>
                              </motion.div>
                            )}
                            {isR && (
                              <motion.div layoutId="pointerR" className="absolute flex flex-col items-center text-emerald-400 font-mono text-xs font-bold leading-none z-10" style={{ marginTop: isL ? '1.8rem' : '0' }}>
                                <span>↑</span><span>R</span>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-6 items-start mt-6">
                    {/* Freq Array */}
                    <div className="bg-[#09090B] border border-white/10 p-4 flex flex-col gap-2">
                      <span className="text-[10px] uppercase font-mono text-white/40text-center block">Tần suất Freq[]</span>
                      <div className="flex gap-1.5 flex-wrap max-w-[400px]">
                        {Object.entries(step.state.freq).filter(([_, c]) => c > 0).map(([val, c]) => (
                          <div key={val} className="flex flex-col items-center">
                             <div className="w-8 h-8 border border-white/20 bg-white/5 flex items-center justify-center font-mono text-xs text-white/80">{val}</div>
                             <div className="text-[10px] font-mono text-amber-400 font-bold mt-1">x{c}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </TransformComponent>
            </TransformWrapper>
          </div>

          <div className="bg-[#09090B] border-t border-amber-500/30 p-5 z-20 flex gap-4 items-start shrink-0 shadow-[0_-15px_30px_rgba(0,0,0,0.4)]">
             <div className="bg-amber-500/20 p-2.5 shrink-0 border border-amber-500/30 mt-1">
                <MessageSquareQuote size={20} className="text-amber-400" />
             </div>
             <div className="flex-1 overflow-hidden">
                <h4 className="text-amber-400 font-bold font-mono text-[11px] mb-1.5 uppercase tracking-widest">{step.phase}</h4>
                <div className="min-h-[3rem] flex items-center">
                   <AnimatePresence mode="wait">
                      <motion.p key={step.stepId} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} className="font-sans text-[13.5px] text-white/90 leading-relaxed border-l-[3px] border-white/10 pl-3 m-0">
                         Truy vấn đoạn con tự động di chuyển L, R để tiết kiệm số phép tính. Lên lịch O((N+Q)√N).
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
              snippets={CODE_MO} 
              mappings={MAPPINGS_MO} 
              activeLine={step.activeLine}
              callingLine={(step as any).callingLine} 
            />
          </div>

          <div className="flex-[2] bg-white/5 backdrop-blur-md border border-white/10 p-4 overflow-y-auto flex flex-col shadow-xl">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-mono text-white/80 font-bold tracking-tight text-sm">QUERIES</h2>
              {onUpdateInput && (
                <div className="flex items-center gap-1">
                  <input type="number" value={newL} onChange={e => React_setNewL(e.target.value)} placeholder="L" className="w-9 h-5 bg-black/50 border border-white/10 text-white text-[10px] text-center font-mono" />
                  <input type="number" value={newR} onChange={e => React_setNewR(e.target.value)} placeholder="R" className="w-9 h-5 bg-black/50 border border-white/10 text-white text-[10px] text-center font-mono" />
                  <button onClick={handleAddQuery} className="h-5 px-1.5 bg-sky-500/20 text-sky-400 text-[10px] border border-sky-500/30">ADD</button>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1.5 mb-3 max-h-32 overflow-y-auto">
              {step.state.queries.map((q) => {
                const isActive = step.state.activeQueryId === q.id;
                return (
                  <div key={q.id} className={`p-1.5 flex justify-between items-center border transition-all ${isActive ? 'bg-amber-500/20 border-amber-500/40' : 'bg-[#09090B] border-white/10'}`}>
                    <span className={`font-mono text-[11px] font-bold ${isActive ? 'text-amber-400' : 'text-white/60'}`}>Query L:{q.L} R:{q.R}</span>
                    <span className="font-mono text-xs font-black text-emerald-400">{q.result !== undefined ? q.result : '?'}</span>
                  </div>
                )
              })}
            </div>

            <h2 className="font-mono text-white/80 font-bold tracking-tight mb-2 text-sm">LOCAL MEMORY</h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {Object.entries(step.memory).map(([key, val]) => (
                <div key={key} className="bg-[#09090B] p-2 border border-white/5 flex flex-col justify-center">
                  <span className="text-white/40 text-[10px] uppercase tracking-wider">{key}</span>
                  <span className="text-amber-400 font-mono text-sm font-bold truncate">{val}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto bg-blue-500/10 border border-blue-500/30 p-3 flex justify-between items-center">
               <span className="font-mono text-xs text-blue-200/60 uppercase">Distinct Elements</span>
               <span className="font-mono text-xl font-bold text-blue-400">{step.state.distinctCount}</span>
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
