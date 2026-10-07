"use client";

import React from 'react';
import { Sparkles, Maximize, Minimize, LayoutGrid, BookOpen, ChevronDown } from 'lucide-react';
import { TabType } from '@/types/algorithm';
import { ALGORITHM_CATALOG, CATEGORY_ITEMS, CATEGORY_STYLES } from '@/constants/algorithms';

interface AlgorithmBannerProps {
  activeTab: TabType;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenAlgoPicker: () => void;
}

export default function AlgorithmBanner({
  activeTab,
  isFullscreen,
  onToggleFullscreen,
  onOpenAlgoPicker
}: AlgorithmBannerProps) {
  const activeMeta = ALGORITHM_CATALOG[activeTab];
  const activeCatItem = CATEGORY_ITEMS.find(c => c.id === activeMeta.category) || CATEGORY_ITEMS[0];
  const activeCatStyle = CATEGORY_STYLES[activeMeta.category] || CATEGORY_STYLES.GRAPH;
  const ActiveCatIcon = activeCatItem.icon;

  return (
    <>
      {/* Algorithm Description Banner */}
      <div className="px-5 py-2.5 mb-3 bg-zinc-950/70 border border-white/10 backdrop-blur-xl flex items-center justify-between gap-4 shrink-0 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`p-1.5 shrink-0 ${activeCatStyle.badgeBg} ${activeCatStyle.badgeBorder} ${activeCatStyle.badgeText}`}>
            <Sparkles size={16} />
          </div>
          <div className="flex items-center gap-2 flex-wrap min-w-0 text-xs">
            <span className="font-bold text-white shrink-0">{activeMeta.name}</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold shrink-0 ${activeCatStyle.badgeBg} ${activeCatStyle.badgeBorder} ${activeCatStyle.badgeText}`}>
              <ActiveCatIcon size={11} />
              {activeCatItem.label}
            </span>
            {activeMeta.sourceBadge && (
              <span className="px-2 py-0.5 text-[10px] font-mono font-medium text-zinc-300 bg-white/5 border border-white/10 shrink-0">
                {activeMeta.sourceBadge}
              </span>
            )}
            <span className="text-zinc-600 hidden sm:inline">•</span>
            <span className="text-zinc-300 font-sans leading-relaxed">{activeMeta.desc}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-300 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 shrink-0 transition-all duration-200 active:scale-[0.98]"
            title={isFullscreen ? "Thu nhỏ (Thoát toàn màn hình)" : "Phóng to khung mô phỏng ra toàn màn hình"}
          >
            {isFullscreen ? <Minimize size={13} /> : <Maximize size={13} />}
            <span className="hidden sm:inline">{isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}</span>
          </button>

          <button
            onClick={onOpenAlgoPicker}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 shrink-0 transition-all duration-200 active:scale-[0.98]"
          >
            <LayoutGrid size={13} className="text-amber-400" />
            <span>Đổi thuật toán</span>
            <kbd className="text-[10px] font-mono text-zinc-400 bg-zinc-800 border border-white/10 px-1.5 py-0.5">⌘K</kbd>
          </button>
        </div>
      </div>

      {/* Khối Đề Bài Chi Tiết Expander */}
      {activeMeta.problemStatement && (
        <details className="group shrink-0 mt-[-4px] mb-3 relative z-40 bg-zinc-950/80 backdrop-blur-md border border-white/10 shadow-lg overflow-hidden transition-all duration-200 open:bg-zinc-900/90 open:border-blue-500/30">
          <summary className="px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-white/[0.04] transition-colors select-none">
            <div className="flex items-center gap-2.5">
              <div className="bg-blue-500/15 text-blue-400 p-1.5 border border-blue-500/25">
                <BookOpen size={14} />
              </div>
              <span className="font-sans text-xs font-semibold text-blue-300 tracking-wide uppercase">
                Chi Tiết Đề Bài
              </span>
            </div>
            <div className="text-zinc-400 group-hover:text-blue-300 transition-colors bg-zinc-800/80 p-1 border border-white/10">
              <ChevronDown size={14} className="transition-transform duration-200 group-open:-rotate-180" />
            </div>
          </summary>
          <div className="px-4 pb-4 pt-2.5 border-t border-white/10 text-xs text-zinc-200 font-sans leading-relaxed flex flex-col gap-3">
            <p>{activeMeta.problemStatement}</p>
            {activeMeta.stateDefinition && (
              <div className="bg-[#0f172a]/60 border-l-[3px] border-blue-500 py-3 px-4 flex flex-col gap-2 shadow-inner rounded-r-md mt-1">
                 <div className="flex items-center gap-1.5 font-bold text-blue-300 font-mono text-[10px] uppercase tracking-[0.1em] mb-0.5">
                    Trạng thái Quy Hoạch Động (DP State)
                 </div>
                 <p className="font-mono text-white/90 text-[13px]">{activeMeta.stateDefinition}</p>
                 {activeMeta.transitionFormula && (
                    <>
                      <div className="flex items-center gap-1.5 font-bold text-emerald-400 font-mono text-[10px] uppercase tracking-[0.1em] mt-1.5 mb-0.5">
                        Công thức chuyển trạng thái (Transition Formula)
                      </div>
                      <p className="font-mono text-emerald-200 text-[13px] font-semibold bg-emerald-900/30 p-2.5 border border-emerald-500/20 rounded-md">
                        {activeMeta.transitionFormula}
                      </p>
                    </>
                 )}
              </div>
            )}
          </div>
        </details>
      )}
    </>
  );
}
