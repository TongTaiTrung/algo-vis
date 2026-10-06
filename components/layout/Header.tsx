"use client";

import React from 'react';
import { Cpu, ChevronDown, Command, FileText, Clock } from 'lucide-react';
import { TabType } from '@/types/algorithm';
import { ALGORITHM_CATALOG, CATEGORY_ITEMS, CATEGORY_STYLES } from '@/constants/algorithms';

interface HeaderProps {
  activeTab: TabType;
  onOpenAlgoPicker: () => void;
  onOpenCustomInput: () => void;
}

export default function Header({ activeTab, onOpenAlgoPicker, onOpenCustomInput }: HeaderProps) {
  const activeMeta = ALGORITHM_CATALOG[activeTab];
  const activeCatItem = CATEGORY_ITEMS.find(c => c.id === activeMeta.category) || CATEGORY_ITEMS[0];
  const activeCatStyle = CATEGORY_STYLES[activeMeta.category] || CATEGORY_STYLES.GRAPH;
  const ActiveCatIcon = activeCatItem.icon;

  return (
    <header className="h-16 bg-zinc-950/80 shadow-[0_8px_32px_rgba(0,0,0,0.36)] border border-white/10 backdrop-blur-xl px-3 sm:px-3 flex items-center justify-between shrink-0 mb-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/10 p-2 border border-blue-500/25 text-blue-400 shadow-sm">
            <Cpu size={20} />
          </div>
          <div>
            <h1 className="font-mono text-sm font-bold tracking-wider text-white">3T ALGO VIS</h1>
            <p className="text-[11px] text-zinc-300 font-sans">Bộ sưu tập 22 thuật toán thi đấu</p>
          </div>
        </div>
      </div>

      {/* Algorithm Picker Launcher Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenAlgoPicker}
          className="group flex items-center gap-3 bg-zinc-900/80 hover:bg-zinc-850 border border-white/10 hover:border-blue-400/40 px-3.5 py-2 transition-all duration-200 active:scale-[0.98] shadow-sm"
          title="Nhấn Cmd+K hoặc Ctrl+K để mở danh mục thuật toán"
        >
          <div className={`p-1.5 ${activeCatStyle.badgeBg} ${activeCatStyle.badgeBorder} ${activeCatStyle.badgeText} transition-transform duration-200 group-hover:scale-105`}>
            <ActiveCatIcon size={16} />
          </div>
          <div className="flex flex-col items-start text-left max-w-[180px] sm:max-w-[240px]">
            <span className="text-[10px] font-sans font-medium text-zinc-400 uppercase tracking-wider leading-none">
              Mô Phỏng Đang Xem
            </span>
            <span className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors truncate w-full mt-0.5">
              {activeMeta.name}
            </span>
          </div>
          <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono font-medium text-amber-300 bg-amber-500/10 px-2 py-0.5 border border-amber-500/20 ml-1">
            <Clock size={10} className="opacity-80" />
            {activeMeta.complexity}
          </span>
          <ChevronDown size={14} className="text-zinc-400 group-hover:text-white transition-colors" />
          <div className="hidden sm:flex items-center gap-1 bg-zinc-800 text-zinc-300 border border-white/10 px-1.5 py-0.5 text-[10px] font-mono ml-1">
            <Command size={10} /> K
          </div>
        </button>

        <button
          onClick={onOpenCustomInput}
          className="group flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-400/50 px-3.5 py-2 transition-all duration-200 active:scale-[0.98] shadow-sm"
        >
          <FileText size={16} className="text-emerald-400 group-hover:scale-110 transition-transform duration-200" />
          <div className="flex flex-col items-start text-left">
            <span className="text-[10px] font-sans font-medium text-emerald-400/80 uppercase tracking-wider leading-none">Dữ Liệu Tùy Chỉnh</span>
            <span className="text-xs font-mono font-bold text-emerald-300 group-hover:text-emerald-200 transition-colors mt-0.5">
              Nhập Dữ Liệu
            </span>
          </div>
        </button>
      </div>
    </header>
  );
}
