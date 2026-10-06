"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, MessageSquareQuote, BookOpen, ShoppingBag, Check } from 'lucide-react';
import { StepBookShop, InputBookShop } from '@/lib/tracers/book-shop';
import { CODE_BOOK_SHOP, MAPPINGS_BOOK_SHOP } from '@/lib/tracers/book-shop-code';
import CodeBlock from '@/components/CodeBlock';
import { usePlayback } from '@/hooks/usePlayback';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface VisualizerProps {
  input: InputBookShop;
  steps: StepBookShop[];
}

export default function BookShopVisualizer({ input, steps }: VisualizerProps) {
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
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        
        {/* Canvas */}
        <div className="col-span-8 relative bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl flex flex-col">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#09090B] z-20">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-amber-400" />
              <h2 className="font-mono text-white/80 font-bold tracking-tight text-sm">
                CSES: BOOK SHOP (0/1 KNAPSACK MATRIX)
              </h2>
            </div>
            <div className="font-mono text-xs text-amber-400 font-bold">
              Step {currentIndex + 1} / {steps.length}
            </div>
          </div>
          
          <div className="flex-1 relative w-full h-full flex flex-col overflow-hidden">
            
            {/* Book Catalog Bar */}
            <div className="bg-[#09090B]/90 border-b border-white/10 p-3 flex gap-3 overflow-x-auto shrink-0 z-10 items-center">
              <div className="flex items-center gap-1.5 text-xs font-mono text-white/40 uppercase mr-1 shrink-0">
                <ShoppingBag size={14} className="text-amber-400" />
                <span>Kho Sách:</span>
              </div>
              {input.prices.map((p, idx) => {
                const bookNum = idx + 1;
                const isCurrentBook = step.state.i === bookNum;
                const isSelectedFinal = step.state.selectedBooks.includes(bookNum);
                const pages = input.pages[idx];

                return (
                  <motion.div
                    key={idx}
                    animate={{ scale: isCurrentBook ? 1.05 : 1 }}
                    className={`px-3 py-1.5 border flex items-center gap-3 shrink-0 transition-all ${
                      isCurrentBook
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                        : isSelectedFinal
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                        : 'bg-white/5 border-white/10 text-white/70'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-mono font-bold text-xs flex items-center gap-1">
                        Sách #{bookNum}
                        {isSelectedFinal && <Check size={12} className="text-emerald-400" />}
                      </span>
                      <span className="text-[10px] font-mono opacity-80">
                        Giá: <strong className="text-amber-300">{p} xu</strong> | <strong className="text-sky-300">{pages} trang</strong>
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Matrix View */}
            <div className="flex-1 relative w-full h-full cursor-grab active:cursor-grabbing overflow-hidden">
              <TransformWrapper initialScale={1} minScale={0.2} maxScale={4} centerOnInit={true} wheel={{ step: 0.1 }}>
                <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ minWidth: "100%", minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "30px" }}>
                  <div className="inline-block border border-white/10 bg-[#09090B] p-4 shadow-2xl">
                    {/* Header: Budget w */}
                    <div className="flex mb-1">
                      <div className="w-28 text-right pr-4 text-[10px] text-white/40 font-mono self-center">
                        Ngân sách w →
                      </div>
                      {Array.from({ length: input.budget + 1 }).map((_, w) => (
                        <div key={w} className="w-12 m-0.5 flex items-center justify-center text-xs text-white/60 font-mono font-bold">
                          {w}
                        </div>
                      ))}
                    </div>

                    {/* Rows: Books */}
                    {step.state.dp.map((row, r) => (
                      <div key={r} className="flex mb-1 items-center">
                        <div className="w-28 pr-4 text-right flex flex-col justify-center">
                          {r === 0 ? (
                            <span className="text-[10px] text-white/40 font-mono">0 (Gốc)</span>
                          ) : (
                            <span className="text-[10px] text-amber-400/90 font-mono">
                              Sách #{r} <br />
                              <span className="text-[9px] text-white/40">g:{input.prices[r-1]} | t:{input.pages[r-1]}</span>
                            </span>
                          )}
                        </div>
                        {row.map((val, c) => {
                          const isComparing = step.state.comparing.some(cell => cell.r === r && cell.c === c);
                          const isWriting = step.state.writing?.r === r && step.state.writing?.c === c;
                          const isActiveRow = step.state.i === r;
                          const isActiveCol = step.state.w === c;
                          const isCurrentCell = isActiveRow && isActiveCol;

                          return (
                            <motion.div
                              layout key={c}
                              className={`w-12 h-12 m-0.5 flex items-center justify-center font-mono text-sm transition-colors cursor-default border ${
                                isWriting ? 'bg-amber-500/30 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.4)] z-10 font-bold scale-105' :
                                isComparing ? 'bg-sky-500/30 border-sky-400 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.4)] z-10 font-bold' :
                                isCurrentCell ? 'bg-white/10 border-white/40 text-white/80' :
                                val > 0 ? 'bg-amber-500/10 border-amber-500/20 text-amber-200' :
                                'bg-[#09090B] border-white/5 text-white/40'
                              }`}
                            >
                              {val}
                            </motion.div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </TransformComponent>
              </TransformWrapper>
            </div>

          </div>

          {/* NARRATIVE PANEL */}
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
              snippets={CODE_BOOK_SHOP} 
              mappings={MAPPINGS_BOOK_SHOP} 
              activeLine={step.activeLine}
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
