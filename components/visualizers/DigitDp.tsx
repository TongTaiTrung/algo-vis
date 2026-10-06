"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, MessageSquareQuote } from 'lucide-react';
import { StepDigitDP, InputDigitDP } from '@/lib/tracers/digit-dp';
import { CODE_DIGIT_DP, MAPPINGS_DIGIT_DP } from '@/lib/tracers/digit-dp-code';
import CodeBlock from '@/components/CodeBlock';
import { usePlayback } from '@/hooks/usePlayback';

interface VisualizerProps { input: InputDigitDP; steps: StepDigitDP[]; }

export default function DigitDpVisualizer({ input, steps }: VisualizerProps) {
  const { currentIndex, isPlaying, playbackSpeed, stepForward, stepBackward, jumpTo, togglePlay, setPlaybackSpeed } = usePlayback(steps.length, 600);
  const step = steps[currentIndex];
  if (!step) return null;

  return (
    <div className="h-full w-full flex flex-col gap-4 animate-[blurFadeIn_0.4s_ease-out]">
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        
        {/* Canvas */}
        <div className="col-span-8 relative bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl flex flex-col">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#09090B] shrink-0">
             <h2 className="font-mono text-white/80 font-bold tracking-tight text-sm">DIGIT DP RECURSION STATE</h2>
             <div className="font-mono text-xs text-amber-400 font-bold">Step {currentIndex + 1} / {steps.length}</div>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto flex flex-col relative bg-[#040405]">
            
            <div className="flex items-center gap-12 mb-6 bg-[#09090B]/50 p-6 border border-white/10 shrink-0">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono text-white/40 mb-2 uppercase tracking-widest">Upper Bound (N)</span>
                <div className="flex gap-1 relative">
                  {step.state.digits.map((d, i) => {
                     const isTarget = i === step.state.pos;
                     const isTight = isTarget && step.state.isTight;
                     return (
                       <div key={i} className={`w-8 h-10 border flex items-center justify-center font-mono font-bold ${isTight ? 'border-rose-500 text-rose-400 bg-rose-500/10 shadow-[0_0_10px_rgba(244,63,94,0.3)]' : isTarget ? 'border-amber-400 text-amber-400 bg-amber-400/10 shadow-[0_0_10px_rgba(251,191,36,0.3)]' : 'border-white/10 text-white/40'}`}>
                         {d}
                         {isTight && <span className="absolute -bottom-6 text-[9px] text-rose-400 font-bold whitespace-nowrap">TIGHT BẬT</span>}
                       </div>
                     )
                  })}
                </div>
              </div>
              
              <div className="flex flex-col items-center ml-auto border-l border-white/10 pl-12">
                <span className="text-[10px] font-mono text-white/40 mb-2 uppercase tracking-widest">Tiền tố Đang Chắp Ghép</span>
                <div className="flex gap-1 min-h-[40px]">
                  {step.state.chosenDigits.map((d, i) => (
                    <div key={i} className="w-8 h-10 border border-emerald-500/40 text-emerald-400 bg-emerald-500/10 flex items-center justify-center font-mono font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">{d}</div>
                  ))}
                  {step.state.chosenDigit !== null && (
                    <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-8 h-10 border border-amber-500/80 text-amber-400 bg-amber-500/20 flex items-center justify-center font-mono font-bold shadow-[0_0_15px_rgba(251,191,36,0.5)] z-20">
                      {step.state.chosenDigit}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-6 flex-1 min-h-0">
               <div className="flex-1 border border-white/5 bg-[#09090B] p-4 flex flex-col">
                 <span className="text-[10px] font-mono text-white/40 mb-3 uppercase tracking-widest border-b border-white/10 pb-2">HÀM ĐỆ QUY (Call Stack)</span>
                 <div className="flex-1 overflow-y-auto space-y-1 pr-2">
                   <AnimatePresence>
                     {step.state.callStack.map((call, idx) => (
                       <motion.div key={idx} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={`font-mono text-[11px] p-2 border ${idx === step.state.callStack.length - 1 ? 'bg-blue-500/20 border-blue-500/40 text-blue-300 shadow-inner translate-x-1' : 'border-white/5 text-white/40'}`}>
                         <span className="text-white/20 mr-2">{'>'.repeat(idx)}</span>{call}
                       </motion.div>
                     ))}
                   </AnimatePresence>
                 </div>
               </div>

               <div className="flex-1 border border-white/5 bg-[#09090B] p-4 flex flex-col">
                 <span className="text-[10px] font-mono text-white/40 mb-3 uppercase tracking-widest border-b border-white/10 pb-2">BỘ NHỚ KHOẢNG (Memo Cache)</span>
                 <div className="flex-1 overflow-y-auto space-y-1.5 pr-2">
                   <AnimatePresence>
                     {Object.entries(step.state.memo).map(([key, val]) => (
                       <motion.div key={key} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-[11px] p-2 bg-emerald-500/5 border border-emerald-500/20 text-emerald-100 flex justify-between">
                         <span className="text-emerald-500/80">Key [{key}]</span>
                         <span className="text-emerald-400 font-bold">{val}</span>
                       </motion.div>
                     ))}
                     {Object.keys(step.state.memo).length === 0 && <span className="text-white/20 font-mono text-[10px]">Đang ghi nhận dữ liệu...</span>}
                   </AnimatePresence>
                 </div>
               </div>
            </div>
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
              snippets={CODE_DIGIT_DP} 
              mappings={MAPPINGS_DIGIT_DP} 
              activeLine={step.activeLine}
              callingLine={(step as any).callingLine} 
            />
          </div>

          <div className="flex-[2] bg-white/5 backdrop-blur-md border border-white/10 p-4 overflow-y-auto flex flex-col shadow-xl">
            <h2 className="font-mono text-white/80 font-bold tracking-tight mb-4 text-sm">LOCAL MEMORY</h2>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {Object.entries(step.memory).map(([key, val]) => (
                <motion.div key={key} layout className="bg-[#09090B] p-2 border border-white/5 flex flex-col justify-center overflow-hidden">
                  <span className="text-white/40 text-[10px] uppercase tracking-wider">{key}</span>
                  <span className={`font-mono text-xl tracking-tight font-bold truncate ${key === 'memo_hit' ? 'text-emerald-400' : 'text-blue-400'}`}>{val}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto bg-amber-500/10 border border-amber-500/30 p-3 flex justify-between items-center">
              <span className="font-mono text-xs text-amber-200/60 uppercase">Valid Targets</span>
              <span className="font-mono text-xl font-bold text-amber-400">{step.state.resultCount}</span>
            </div>
          </div>
        </div>
      </div>

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
