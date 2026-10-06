"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipBack, SkipForward, MessageSquareQuote, 
  Search, Network, Key, Bookmark, Plus
} from 'lucide-react';
import { StepTrie, InputTrie, TrieNodeT, QueryTrie } from '@/lib/tracers/trie';
import { CODE_TRIE, MAPPINGS_TRIE } from '@/lib/tracers/trie-code';
import CodeBlock from '@/components/CodeBlock';
import { usePlayback } from '@/hooks/usePlayback';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface VisualizerProps {
  input: InputTrie;
  steps: StepTrie[];
  onUpdateInput?: (newData: InputTrie) => void;
}

export default function TrieVisualizer({ input, steps, onUpdateInput }: VisualizerProps) {
  const { currentIndex, isPlaying, playbackSpeed, stepForward, stepBackward, jumpTo, togglePlay, setPlaybackSpeed } = usePlayback(steps.length, 600);
  
  const [newType, setNewType] = React.useState<'SEARCH' | 'PREFIX'>('SEARCH');
  const [newWord, setNewWord] = React.useState<string>("");

  const step = steps[currentIndex];
  if (!step) return null;

  const { state } = step;

  // Calculate layout using DFS positioning
  const childrenMap: Record<number, number[]> = {};
  state.nodes.forEach(n => {
    childrenMap[n.id] = Object.values(n.children);
  });
  
  const pos: { x: number; y: number }[] = Array(state.nodes.length).fill(0).map(() => ({ x: 0, y: 0 }));
  let leafCount = 0;

  function dfs(id: number): number {
    const chs = childrenMap[id] || [];
    if (chs.length === 0) {
      leafCount++;
      pos[id] = { x: leafCount * 80, y: state.nodes[id].depth * 70 + 40 };
      return pos[id].x;
    }
    const childXs = chs.map(cId => dfs(cId));
    const midX = (childXs[0] + childXs[childXs.length - 1]) / 2;
    pos[id] = { x: midX, y: state.nodes[id].depth * 70 + 40 };
    return midX;
  }
  dfs(0);

  // Center the tree horizontally
  const minX = Math.min(...pos.map(p => p.x));
  const maxX = Math.max(...pos.map(p => p.x));
  const shiftX = 350 - (minX + maxX) / 2;

  const placedNodes = pos.map((p, i) => ({ ...state.nodes[i], x: p.x + shiftX, y: p.y }));

  const handleAddQuery = () => {
    const w = newWord.trim().toLowerCase();
    if (w.length > 0) {
      if (onUpdateInput) {
        onUpdateInput({
          ...input,
          queries: [...input.queries, { type: newType, word: w }]
        });
      }
      setNewWord("");
    }
  };

  return (
    <div className="h-full w-full flex flex-col gap-4 animate-[blurFadeIn_0.4s_ease-out]">
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        
        {/* Main Canvas Area */}
        <div className="col-span-8 relative bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#09090B] z-20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-fuchsia-500/10 p-1.5 border border-fuchsia-500/30 text-fuchsia-400">
                <Network size={16} />
              </div>
              <h2 className="font-mono text-white/90 font-bold tracking-tight text-xs sm:text-sm uppercase">
                TRIE (CÂY TIỀN TỐ)
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 text-[10px] font-mono border ${
                state.phaseType.includes('SEARCH') || state.phaseType === 'DONE'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' 
                  : 'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-400'
              }`}>
                {state.currentQueryIdx !== null ? `TRUY VẤN: ${input.queries[state.currentQueryIdx]?.type}` : 'THÊM TỪ'}
              </span>
              <div className="font-mono text-xs text-amber-400 font-bold">
                Bước {currentIndex + 1} / {steps.length}
              </div>
            </div>
          </div>
          
          {/* Active Word Array overlay */}
          {state.currentWord && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 bg-[#09090B]/80 backdrop-blur-xl px-4 py-2 border border-white/10 shadow-2xl rounded-sm">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest text-center">
                {state.currentQueryIdx !== null ? 'Target Word' : 'Inserting Word'}
              </span>
              <div className="flex gap-1.5">
                {state.currentWord.split('').map((c, i) => {
                  const isActive = state.activeCharIdx === i;
                  const isChecked = state.activeCharIdx !== null && i < state.activeCharIdx;
                  
                  let borderClass = "border-white/10 bg-white/5 text-white/60";
                  if (isActive) {
                    borderClass = "border-amber-400 bg-amber-500/20 text-amber-400 font-bold shadow-[0_0_10px_rgba(251,191,36,0.3)] ring-1 ring-amber-400 scale-110";
                  } else if (isChecked && state.phaseType !== 'SEARCH_FAIL' && state.phaseType !== 'INIT') {
                    borderClass = "border-sky-500/40 bg-sky-500/10 text-sky-400 font-bold";
                  }

                  return (
                    <div key={i} className={`w-10 h-10 flex items-center justify-center font-mono text-lg border transition-all ${borderClass}`}>
                      {c}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Visual Canvas Body (Trie Visualizer) */}
          <div className="flex-1 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden bg-[#040405] relative outline-none z-10">
            <TransformWrapper initialScale={1.2} minScale={0.3} maxScale={3} centerOnInit={true} wheel={{ step: 0.1 }}>
              <TransformComponent wrapperStyle={{ width: "100%", height: "100%", outline: 'none' }} contentStyle={{ minWidth: "100%", minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: 'relative' }}>
                <div className="relative w-[800px] h-[600px] shrink-0">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" overflow="visible">
                  {/* Edges */}
                  <AnimatePresence>
                    {placedNodes.map(node => {
                      return Object.entries(node.children).map(([char, childId]) => {
                        const child = placedNodes.find(n => n.id === childId);
                        if (!child) return null;
                        
                        const isHighlight = state.activeNode === childId || (state.activeNode === node.id && state.phaseType === 'SEARCH_FAIL');
                        
                        return (
                          <g key={`${node.id}-${childId}`}>
                            <motion.line
                              layout
                              x1={node.x} y1={node.y} x2={child.x} y2={child.y}
                              stroke={isHighlight ? "#38bdf8" : "rgba(255,255,255,0.15)"}
                              strokeWidth={isHighlight ? 3 : 1.5}
                              strokeDasharray={isHighlight && state.phaseType === 'SEARCH_FAIL' ? "4 4" : "0"}
                              className="transition-colors duration-300"
                            />
                            {/* Edge label */}
                            <motion.text
                              layout
                              x={(node.x + child.x) / 2} y={(node.y + child.y) / 2 - 8}
                              fill={isHighlight ? "#38bdf8" : "rgba(255,255,255,0.4)"}
                              fontSize="12"
                              fontFamily="monospace"
                              textAnchor="middle"
                              className="font-bold"
                            >
                              {char}
                            </motion.text>
                          </g>
                        );
                      });
                    })}
                  </AnimatePresence>
                </svg>

                  {/* Nodes */}
                  {placedNodes.map(node => {
                  const isActive = state.activeNode === node.id;
                  const isFail = isActive && state.phaseType === 'SEARCH_FAIL';
                  
                  let ring = "border-white/20 bg-[#09090B] text-white/80";
                  if (isFail) {
                    ring = "border-rose-500 bg-rose-500/20 text-rose-300 shadow-[0_0_15px_rgba(243,62,94,0.5)] ring-2 ring-rose-500 ring-offset-2 ring-offset-[#040405]";
                  } else if (isActive) {
                    ring = "border-amber-400 bg-amber-500/20 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.5)] ring-2 ring-amber-400 ring-offset-2 ring-offset-[#040405] scale-110";
                  } else if (node.isEndOfWord) {
                    ring = "border-emerald-500/60 bg-emerald-500/10 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.2)]";
                  }
                  
                  return (
                    <motion.div
                      layout
                      key={node.id}
                      className={`absolute rounded-full w-10 h-10 flex items-center justify-center font-mono font-bold text-lg border-2 z-10 transition-all duration-300 -ml-5 -mt-5 flex-col ${ring}`}
                      style={{ left: node.x, top: node.y }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: isActive ? 1.15 : 1, opacity: 1 }}
                    >
                      {node.id === 0 ? <Bookmark size={14} className="opacity-40" /> : node.char}
                      
                      {/* ID label */}
                      <span className="absolute -bottom-4 text-[9px] font-mono text-white/30 whitespace-nowrap">
                        id:{node.id}
                      </span>
                      
                      {/* EndOfWord Indicator */}
                      {node.isEndOfWord && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border border-[#040405]" />
                      )}
                    </motion.div>
                  )
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
              <h4 className="text-amber-400 font-bold font-mono text-[11px] mb-1.5 uppercase tracking-widest">
                {step.phase}
              </h4>
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

        {/* Dashboard Tools: CodeBlock & Local Memory */}
        <div className="col-span-4 flex flex-col gap-4 min-h-0">
          <div className="flex-[3] min-h-0">
            <CodeBlock 
              snippets={CODE_TRIE} 
              mappings={MAPPINGS_TRIE} 
              activeLine={step.activeLine}
            />
          </div>

          {/* Queries Status and Custom Input */}
          <div className="flex-[2] bg-white/5 backdrop-blur-md border border-white/10 p-4 overflow-y-auto flex flex-col shadow-xl">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-mono text-white/80 font-bold tracking-tight text-sm uppercase">
                TRUY VẤN
              </h2>
            </div>
            
            {onUpdateInput && (
              <div className="flex items-center gap-1.5 bg-[#09090B] p-2 border border-white/10 rounded-sm mb-3">
                <select 
                  value={newType} 
                  onChange={(e) => setNewType(e.target.value as 'SEARCH' | 'PREFIX')}
                  className="bg-white/5 border border-white/10 text-white text-[10px] font-mono h-6 px-1 focus:outline-none"
                >
                  <option value="SEARCH" className="bg-[#09090B]">SEARCH</option>
                  <option value="PREFIX" className="bg-[#09090B]">PREFIX</option>
                </select>
                <input 
                  type="text" 
                  value={newWord} 
                  onChange={e => setNewWord(e.target.value)} 
                  placeholder="word..." 
                  className="flex-1 min-w-0 h-6 bg-black/50 border border-white/10 text-white text-[10px] px-2 font-mono flex-shrink focus:outline-none focus:border-amber-500/50" 
                />
                <button 
                  onClick={handleAddQuery}
                  className="h-6 px-2 shrink-0 bg-sky-500/20 hover:bg-sky-500/40 border border-sky-500/50 text-sky-300 text-[10px] font-mono flex items-center gap-1 transition-colors"
                >
                  <Plus size={10} /> THÊM
                </button>
              </div>
            )}

            <div className="flex flex-col gap-1.5 mb-4 font-mono text-xs">
              {input.queries.map((q, qIdx) => {
                const isCurrent = state.currentQueryIdx === qIdx;
                const res = state.queryResults.find(r => r.word === q.word && r.type === q.type); // Simple matching logic

                let qStyle = "border-white/10 bg-[#09090B] text-white/60";
                let badge = "text-white/40";
                
                if (isCurrent) {
                  qStyle = "border-amber-400 bg-amber-500/10 text-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.3)]";
                  badge = "text-amber-400";
                } else if (res) {
                  qStyle = "border-emerald-500/30 bg-emerald-500/10 text-white/80";
                  badge = "text-emerald-400";
                }

                return (
                  <div key={qIdx} className={`p-2 border flex justify-between items-center transition-all ${qStyle}`}>
                    <span className="flex items-center gap-2">
                       <span className={`font-bold ${badge}`}>[{q.type}]</span> {q.word}
                    </span>
                    {res && (
                       <span className={`font-black ${res.result ? 'text-emerald-400' : 'text-rose-400'}`}>
                         {res.result ? 'True' : 'False'}
                       </span>
                    )}
                  </div>
                );
              })}
              {input.queries.length === 0 && <span className="text-white/30 text-[10px] italic">Chưa có truy vấn nào...</span>}
            </div>

            <h2 className="font-mono text-white/80 font-bold tracking-tight mb-2 text-sm mt-auto border-t border-white/5 pt-4">
              LOCAL MEMORY
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(step.memory).map(([key, val]) => (
                <div key={key} className="bg-[#09090B] p-2 border border-white/5 flex flex-col justify-center">
                  <span className="text-white/40 text-[10px] uppercase tracking-wider">{key}</span>
                  <span className="text-amber-400 font-mono text-sm font-bold truncate">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Control Deck */}
      <div className="h-16 bg-white/5 backdrop-blur-md border border-white/10 px-6 flex items-center justify-between gap-6 shadow-2xl shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={stepBackward} disabled={currentIndex === 0} className="text-white/70 hover:text-white disabled:opacity-30 transition-colors"><SkipBack size={20} /></button>
          <button onClick={togglePlay} className="text-blue-400 hover:text-blue-300 hover:scale-110 active:scale-95 transition-all">{isPlaying ? <Pause size={28} /> : <Play size={28} fill="currentColor" />}</button>
          <button onClick={stepForward} disabled={currentIndex === steps.length - 1} className="text-white/70 hover:text-white disabled:opacity-30 transition-colors"><SkipForward size={20} /></button>
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