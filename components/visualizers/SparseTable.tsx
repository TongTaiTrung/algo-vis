"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipBack, SkipForward, MessageSquareQuote, 
  Layers, Table, CheckCircle2, Split, Plus
} from 'lucide-react';
import { StepSparseTable, InputSparseTable } from '@/lib/tracers/sparse-table';
import { CODE_SPARSE_TABLE, MAPPINGS_SPARSE_TABLE } from '@/lib/tracers/sparse-table-code';
import CodeBlock from '@/components/CodeBlock';
import { usePlayback } from '@/hooks/usePlayback';

interface VisualizerProps {
  input: InputSparseTable;
  steps: StepSparseTable[];
  onUpdateInput?: (newData: InputSparseTable) => void;
}

export default function SparseTableVisualizer({ input, steps, onUpdateInput }: VisualizerProps) {
  const [newL, setNewL] = React.useState<string>("");
  const [newR, setNewR] = React.useState<string>("");

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
      setNewL("");
      setNewR("");
    } else {
      alert(`Vui lòng nhập L <= R và trong khoảng 0 đến ${input.arr.length - 1}`);
    }
  };

  const { 
    currentIndex, 
    isPlaying, 
    playbackSpeed, 
    stepForward, 
    stepBackward, 
    jumpTo, 
    togglePlay, 
    setPlaybackSpeed 
  } = usePlayback(steps.length, 650);

  const step = steps[currentIndex];
  if (!step) return null;

  const { state } = step;
  const n = state.arr.length;

  return (
    <div className="h-full w-full flex flex-col gap-4 animate-[blurFadeIn_0.4s_ease-out]">
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
        
        {/* Main Canvas Area */}
        <div className="col-span-8 relative bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#09090B] z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-sky-500/10 p-1.5 border border-sky-500/30 text-sky-400">
                <Table size={16} />
              </div>
              <h2 className="font-mono text-white/90 font-bold tracking-tight text-xs sm:text-sm">
                SPARSE TABLE (RMQ): BẢNG THƯA & PHỦ ĐOẠN O(1)
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 text-[10px] font-mono border ${
                state.phaseType.startsWith('QUERY') 
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' 
                  : state.phaseType === 'ALL_DONE'
                  ? 'border-purple-500/30 bg-purple-500/10 text-purple-400'
                  : 'border-sky-500/30 bg-sky-500/10 text-sky-400'
              }`}>
                {state.phaseType.startsWith('QUERY') ? 'TRUY VẤN RMQ' : state.phaseType === 'ALL_DONE' ? 'HOÀN THÀNH' : 'TIỀN XỬ LÝ'}
              </span>
              <div className="font-mono text-xs text-amber-400 font-bold">
                Bước {currentIndex + 1} / {steps.length}
              </div>
            </div>
          </div>
          
          {/* Visual Canvas Body */}
          <div className="flex-1 p-5 flex flex-col overflow-y-auto relative bg-[#040405] gap-6">
            
            {/* SECTION 1: Mảng Gốc & Trực Quan Phủ Đoạn Lũy Thừa 2 */}
            <div className="bg-[#09090B] border border-white/10 p-4 shrink-0 shadow-lg">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Layers size={14} className="text-sky-400" />
                  <h3 className="text-[11px] text-white/70 font-mono tracking-wider uppercase font-semibold">
                    Mảng Gốc A[] & Trực Quan Hóa Đoạn Phủ (Range Coverage)
                  </h3>
                </div>
                {state.currentQuery && (
                  <div className="text-xs font-mono text-emerald-400 flex items-center gap-2">
                    <span>Đang truy vấn RMQ: <b>[{state.currentQuery.L}, {state.currentQuery.R}]</b></span>
                    <span className="text-white/40">|</span>
                    <span>Độ dài len = <b>{state.currentQuery.len}</b></span>
                    <span className="text-white/40">|</span>
                    <span>k = ⌊log₂⌋ = <b>{state.currentQuery.k}</b> (2^{state.currentQuery.k} = {1 << state.currentQuery.k})</span>
                  </div>
                )}
              </div>

              {/* Scrollable Area for Array and Interval Bars */}
              <div className="overflow-x-auto pb-2 pt-1 flex flex-col">
                {/* Array items row */}
                <div className="flex gap-2 items-center justify-start min-w-max">
                  {state.arr.map((val, idx) => {
                    const isCurrentI = state.currentI === idx;
                    const isInLeft = state.activeIntervals.some(iv => 
                      iv.type === 'left' && idx >= iv.start && idx < iv.start + iv.length
                    );
                    const isInRight = state.activeIntervals.some(iv => 
                      iv.type === 'right' && idx >= iv.start && idx < iv.start + iv.length
                    );
                    const isInQuery = state.currentQuery && 
                      idx >= state.currentQuery.L && idx <= state.currentQuery.R;
                    const isOverlap = isInLeft && isInRight;

                    let borderClass = "border-white/15 bg-white/5 text-white/70";
                    if (isOverlap) {
                      borderClass = "border-amber-400 bg-amber-500/25 text-amber-300 font-black shadow-[0_0_12px_rgba(251,191,36,0.4)]";
                    } else if (isInLeft) {
                      borderClass = "border-sky-400 bg-sky-500/20 text-sky-300 font-bold shadow-[0_0_10px_rgba(56,189,248,0.3)]";
                    } else if (isInRight) {
                      borderClass = "border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-300 font-bold shadow-[0_0_10px_rgba(232,121,249,0.3)]";
                    } else if (isInQuery) {
                      borderClass = "border-emerald-500/50 bg-emerald-500/10 text-emerald-300";
                    } else if (isCurrentI) {
                      borderClass = "border-amber-400 bg-amber-500/15 text-amber-300 font-bold";
                    }

                    return (
                      <motion.div 
                        key={idx} 
                        className={`w-12 h-14 flex flex-col items-center justify-center font-mono border-2 relative transition-all shrink-0 ${borderClass}`}
                      >
                        <span className="text-[9px] text-white/40 absolute top-1 font-mono">
                          i={idx}
                        </span>
                        <span className="text-base font-bold mt-2">
                          {val}
                        </span>
                        {isOverlap && (
                          <span className="absolute -bottom-2 px-1 text-[8px] bg-amber-500 text-black font-extrabold uppercase z-10 shadow-md">
                            Trùng
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Interval Bars visualization */}
                {state.activeIntervals.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-2 relative min-w-max">
                    <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest flex items-center justify-between mb-1 sticky left-0 w-fit gap-6">
                      <span>Biểu đồ phủ đoạn nhị phân:</span>
                      {state.activeIntervals.some(i => i.type === 'left') && state.activeIntervals.some(i => i.type === 'right') && (
                        <span className="text-amber-400/90 text-[10px] font-sans">
                          Idempotent: min(st[k][L], st[k][R - 2^k + 1])
                        </span>
                      )}
                    </div>
                    
                    <div className="relative h-[84px] w-full">
                      {state.activeIntervals.map((iv, idx) => {
                        // Array cell: w-12 (3rem), gap-2 (0.5rem)
                        const leftPos = `calc(${iv.start} * 3.5rem)`;
                        const barWidth = `calc(${iv.length} * 3rem + ${iv.length - 1} * 0.5rem)`;
                        // Stacking: query bar on top, left bar in middle, right bar at bottom
                        let topPos = '0px';
                        if (iv.type === 'query') topPos = '0px';
                        else if (iv.type === 'left') topPos = '28px';
                        else if (iv.type === 'right') topPos = '56px';

                        let barColor = "bg-sky-500/30 border-sky-400 text-sky-300";
                        if (iv.type === 'right') {
                          barColor = "bg-fuchsia-500/30 border-fuchsia-400 text-fuchsia-300";
                        } else if (iv.type === 'query') {
                          barColor = "bg-emerald-500/25 border-emerald-400 text-emerald-300";
                        }

                        return (
                          <motion.div 
                            key={idx}
                            layout
                            className={`absolute h-6 border flex items-center justify-center text-[10px] font-mono font-bold truncate rounded-sm overflow-hidden whitespace-nowrap px-2 shadow-lg ${barColor}`}
                            style={{
                              left: leftPos,
                              width: barWidth,
                              top: topPos,
                            }}
                          >
                            {iv.label}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 2: Bảng Thưa Ma Trận st[k][i] 2D */}
            <div className="bg-[#09090B] border border-white/10 p-4 shrink-0 shadow-lg flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Split size={14} className="text-amber-400" />
                  <h3 className="text-[11px] text-white/70 font-mono tracking-wider uppercase font-semibold">
                    Ma Trận Bảng Thưa st[k][i] (Kích thước {state.maxK + 1} × {n})
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono">
                  <span className="flex items-center gap-1.5 text-sky-400">
                    <span className="w-2.5 h-2.5 border border-sky-400 bg-sky-500/30 inline-block"></span> Nửa trái
                  </span>
                  <span className="flex items-center gap-1.5 text-fuchsia-400">
                    <span className="w-2.5 h-2.5 border border-fuchsia-400 bg-fuchsia-500/30 inline-block"></span> Nửa phải
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <span className="w-2.5 h-2.5 border border-amber-400 bg-amber-500/30 inline-block"></span> Ô đang tính
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2.5 h-2.5 border border-emerald-400 bg-emerald-500/30 inline-block"></span> Ô RMQ
                  </span>
                </div>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto pb-2">
                <table className="w-full border-collapse font-mono text-center">
                  <thead>
                    <tr>
                      <th className="p-2 border border-white/10 bg-white/5 text-[10px] text-white/50 font-medium w-28 text-left">
                        Tầng k (2^k)
                      </th>
                      {Array.from({ length: n }).map((_, colIdx) => (
                        <th 
                          key={colIdx} 
                          className={`p-2 border border-white/10 text-[10px] font-medium min-w-[50px] ${
                            state.currentI === colIdx ? 'bg-amber-500/10 text-amber-400 font-bold' : 'bg-white/5 text-white/50'
                          }`}
                        >
                          i = {colIdx}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {state.table.map((row, kIdx) => {
                      const power = 1 << kIdx;
                      const isCurrentK = state.currentK === kIdx;

                      return (
                        <tr key={kIdx} className={isCurrentK ? "bg-white/[0.02]" : ""}>
                          {/* Row label */}
                          <td className={`p-2 border border-white/10 text-left font-mono text-xs ${
                            isCurrentK ? 'text-amber-400 font-bold bg-amber-500/10' : 'text-white/60 bg-white/5'
                          }`}>
                            <div className="flex flex-col">
                              <span>k = {kIdx}</span>
                              <span className="text-[9px] text-white/40">đoạn = {power}</span>
                            </div>
                          </td>

                          {/* Data cells */}
                          {row.map((cellVal, colIdx) => {
                            const isCellCurrent = state.currentK === kIdx && state.currentI === colIdx;
                            const isLeftSource = state.leftSource?.k === kIdx && state.leftSource?.i === colIdx;
                            const isRightSource = state.rightSource?.k === kIdx && state.rightSource?.i === colIdx;
                            const isQueryMatch = state.currentQuery && state.currentQuery.k === kIdx && 
                              (state.currentQuery.L === colIdx || (state.currentQuery.R - (1 << state.currentQuery.k) + 1) === colIdx);
                            const isOutOfRange = colIdx + power > n;

                            let cellStyle = "border-white/10 bg-[#09090B] text-white/70";

                            if (isOutOfRange) {
                              cellStyle = "border-white/5 bg-black/40 text-white/10 select-none";
                            } else if (isCellCurrent) {
                              cellStyle = "border-amber-400 bg-amber-500/25 text-amber-300 font-black shadow-[0_0_12px_rgba(251,191,36,0.4)] ring-1 ring-amber-400";
                            } else if (isLeftSource) {
                              cellStyle = "border-sky-400 bg-sky-500/20 text-sky-300 font-bold shadow-[0_0_8px_rgba(56,189,248,0.3)] ring-1 ring-sky-400";
                            } else if (isRightSource) {
                              cellStyle = "border-fuchsia-400 bg-fuchsia-500/20 text-fuchsia-300 font-bold shadow-[0_0_8px_rgba(232,121,249,0.3)] ring-1 ring-fuchsia-400";
                            } else if (isQueryMatch) {
                              cellStyle = "border-emerald-400 bg-emerald-500/20 text-emerald-300 font-bold shadow-[0_0_10px_rgba(16,185,129,0.4)] ring-1 ring-emerald-400";
                            } else if (cellVal !== null) {
                              cellStyle = "border-white/10 bg-white/5 text-white/90";
                            }

                            return (
                              <td 
                                key={colIdx} 
                                className={`p-2 border text-xs relative transition-all duration-200 ${cellStyle}`}
                              >
                                {isOutOfRange ? (
                                  <span className="text-white/15">—</span>
                                ) : cellVal !== null ? (
                                  <div className="flex flex-col items-center">
                                    <span className="font-bold">{cellVal}</span>
                                    {isLeftSource && (
                                      <span className="text-[8px] text-sky-400 font-mono leading-none mt-0.5">Trái</span>
                                    )}
                                    {isRightSource && (
                                      <span className="text-[8px] text-fuchsia-400 font-mono leading-none mt-0.5">Phải</span>
                                    )}
                                    {isQueryMatch && !isLeftSource && !isRightSource && (
                                      <span className="text-[8px] text-emerald-400 font-mono leading-none mt-0.5">RMQ</span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-white/20 font-mono text-[10px]">null</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 3: Danh Sách Truy Vấn RMQ (Queries Tracker) */}
            {input.queries.length > 0 && (
              <div className="bg-[#09090B] border border-white/10 p-4 shrink-0 shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <h3 className="text-[11px] text-white/70 font-mono tracking-wider uppercase font-semibold">
                      Danh Sách Truy Vấn RMQ ({input.queries.length} truy vấn)
                    </h3>
                  </div>
                  {onUpdateInput && (
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-1 rounded-sm">
                      <input 
                        type="number" 
                        value={newL} 
                        onChange={e => setNewL(e.target.value)} 
                        placeholder="L" 
                        className="w-12 h-6 bg-black/50 border border-white/10 text-white text-xs text-center font-mono focus:outline-none focus:border-amber-500/50" 
                      />
                      <span className="text-white/30 font-mono text-xs">-</span>
                      <input 
                        type="number" 
                        value={newR} 
                        onChange={e => setNewR(e.target.value)} 
                        placeholder="R" 
                        className="w-12 h-6 bg-black/50 border border-white/10 text-white text-xs text-center font-mono focus:outline-none focus:border-amber-500/50" 
                      />
                      <button 
                        onClick={handleAddQuery}
                        className="h-6 px-2 bg-sky-500/20 hover:bg-sky-500/40 border border-sky-500/50 text-sky-300 text-[10px] font-mono flex items-center gap-1 transition-colors"
                      >
                        <Plus size={12} /> THÊM
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                  {input.queries.map((q, qIdx) => {
                    const isCurrent = state.currentQueryIdx === qIdx;
                    const res = state.queryResults.find(r => r.queryIdx === qIdx);

                    let qStyle = "border-white/10 bg-white/5 text-white/60";
                    if (isCurrent) {
                      qStyle = "border-amber-400 bg-amber-500/15 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.3)]";
                    } else if (res) {
                      qStyle = "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
                    }

                    return (
                      <div 
                        key={qIdx} 
                        className={`p-2.5 border flex flex-col justify-between font-mono text-xs transition-all ${qStyle}`}
                      >
                        <div className="flex justify-between items-center text-[10px] text-white/40 mb-1">
                          <span>Q#{qIdx + 1}</span>
                          <span>len={q.R - q.L + 1}</span>
                        </div>
                        <div className="font-bold text-sm">
                          [{q.L}, {q.R}]
                        </div>
                        <div className="mt-1.5 pt-1.5 border-t border-white/5 flex justify-between items-center text-[11px]">
                          <span className="text-white/40">Min:</span>
                          <span className="font-bold text-emerald-400">
                            {res ? res.ans : isCurrent && state.currentQuery?.result !== undefined ? state.currentQuery.result : "Chờ..."}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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
              snippets={CODE_SPARSE_TABLE} 
              mappings={MAPPINGS_SPARSE_TABLE} 
              activeLine={step.activeLine}
              callingLine={(step as any).callingLine} 
            />
          </div>

          <div className="flex-[2] bg-white/5 backdrop-blur-md border border-white/10 p-4 overflow-y-auto flex flex-col shadow-xl">
            <h2 className="font-mono text-white/80 font-bold tracking-tight mb-4 text-sm">
              LOCAL MEMORY (BỘ NHỚ TRẠNG THÁI)
            </h2>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {Object.entries(step.memory).map(([key, val]) => (
                <motion.div 
                  key={key} 
                  layout 
                  className="bg-[#09090B] p-2 border border-white/5 flex flex-col justify-center"
                >
                  <span className="text-white/40 text-[10px] uppercase tracking-wider font-mono">
                    {key}
                  </span>
                  <span className="text-amber-400 font-mono text-sm font-bold truncate">
                    {val}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Control Deck */}
      <div className="h-16 bg-white/5 backdrop-blur-md border border-white/10 px-6 flex items-center justify-between gap-6 shadow-2xl shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={stepBackward} 
            disabled={currentIndex === 0} 
            className="text-white/70 hover:text-white disabled:opacity-30 transition-colors"
            title="Bước lùi"
          >
            <SkipBack size={20} />
          </button>
          <button 
            onClick={togglePlay} 
            className="text-blue-400 hover:text-blue-300 hover:scale-110 active:scale-95 transition-all"
            title={isPlaying ? "Tạm dừng" : "Phát mô phỏng"}
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} fill="currentColor" />}
          </button>
          <button 
            onClick={stepForward} 
            disabled={currentIndex === steps.length - 1} 
            className="text-white/70 hover:text-white disabled:opacity-30 transition-colors"
            title="Bước tới"
          >
            <SkipForward size={20} />
          </button>
        </div>
        <div className="flex-1 flex items-center gap-4 px-8">
          <span className="font-mono text-xs text-white/40">Tiến trình</span>
          <input 
            type="range" 
            min="0" 
            max={steps.length - 1} 
            value={currentIndex} 
            onChange={(e) => jumpTo(parseInt(e.target.value))} 
            className="flex-1 accent-blue-500 h-1 bg-white/10 appearance-none cursor-pointer" 
          />
          <span className="font-mono text-xs text-white/40 w-12 text-right">
            {Math.round(((currentIndex + 1) / steps.length) * 100)}%
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-white/40 uppercase">Tốc độ</span>
          <input 
            type="range" 
            min="50" 
            max="1200" 
            step="50" 
            style={{ direction: 'rtl' }} 
            value={playbackSpeed} 
            onChange={(e) => setPlaybackSpeed(parseInt(e.target.value))} 
            className="w-24 accent-amber-500 h-1 bg-white/10 appearance-none cursor-pointer" 
          />
        </div>
      </div>
    </div>
  );
}
