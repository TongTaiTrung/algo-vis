"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, LayoutList, X, Search, Clock, ArrowRight } from 'lucide-react';
import { TabType } from '@/types/algorithm';
import { ALGORITHM_CATALOG, CATEGORY_ITEMS, CATEGORY_STYLES } from '@/constants/algorithms';

interface AlgorithmPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabType;
  onSelectAlgo: (tab: TabType) => void;
}

export default function AlgorithmPickerModal({
  isOpen,
  onClose,
  activeTab,
  onSelectAlgo
}: AlgorithmPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [viewMode, setViewMode] = useState<'detailed' | 'compact'>('detailed');

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: Object.keys(ALGORITHM_CATALOG).length };
    Object.values(ALGORITHM_CATALOG).forEach(algo => {
      counts[algo.category] = (counts[algo.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredCatalog = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return Object.values(ALGORITHM_CATALOG).filter(algo => {
      const matchCat = selectedCategory === 'ALL' || algo.category === selectedCategory;
      if (!matchCat) return false;
      if (!q) return true;

      const matchName = algo.name.toLowerCase().includes(q);
      const matchDesc = algo.desc.toLowerCase().includes(q);
      const matchComplexity = algo.complexity.toLowerCase().includes(q);
      const matchBadge = algo.sourceBadge?.toLowerCase().includes(q) || false;
      const matchTags = algo.tags?.some(t => t.toLowerCase().includes(q)) || false;
      const matchKeywords = algo.keywords?.some(k => k.toLowerCase().includes(q)) || false;
      const matchCatLabel = CATEGORY_ITEMS.find(c => c.id === algo.category)?.label.toLowerCase().includes(q) || false;

      return matchName || matchDesc || matchComplexity || matchBadge || matchTags || matchKeywords || matchCatLabel;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl"
        >
          <motion.div 
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className="w-full max-w-6xl max-h-[89vh] bg-zinc-950/90 backdrop-blur-3xl ring-1 ring-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_24px_48px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden relative"
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-white/10 flex flex-col gap-4 bg-zinc-900/50 shrink-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-500/10 p-2.5 border border-amber-500/30 text-amber-400">
                    <LayoutGrid size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold tracking-tight text-white font-sans">
                        Danh Mục Thuật Toán
                      </h2>
                      <span className="text-[11px] font-mono font-medium text-blue-300 bg-blue-500/10 px-2 py-0.5 border border-blue-500/25">
                        {filteredCatalog.length} / {Object.keys(ALGORITHM_CATALOG).length}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 mt-0.5">
                      Bộ trực quan hóa 22 thuật toán thi đấu lập trình kinh điển từ ICPC, CSES & LeetCode Hard
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode(prev => prev === 'detailed' ? 'compact' : 'detailed')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors active:scale-95"
                    title={viewMode === 'detailed' ? 'Chuyển sang dạng lưới 3 cột thu gọn' : 'Chuyển sang dạng thẻ lớn 2 cột chi tiết'}
                  >
                    {viewMode === 'detailed' ? (
                      <>
                        <LayoutGrid size={14} className="text-blue-400" />
                        <span className="hidden sm:inline">2 Cột (Chi tiết)</span>
                      </>
                    ) : (
                      <>
                        <LayoutList size={14} className="text-amber-400" />
                        <span className="hidden sm:inline">3 Cột (Thu gọn)</span>
                      </>
                    )}
                  </button>

                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2.5 py-1.5 border border-white/10">
                    ESC để đóng
                  </span>
                  <button 
                    onClick={onClose}
                    className="p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all border border-white/10 active:scale-95"
                    title="Đóng cửa sổ"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search size={18} className="absolute left-3.5 top-3.5 text-zinc-400" />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Tìm theo tên (Dinic, Knapsack...), kỹ thuật (#Min-Heap, #Range DP), mã bài (CSES #1634), độ phức tạp (O(N))..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-zinc-400 focus:outline-none focus:border-blue-400 transition-all font-sans"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")} 
                    className="absolute right-3.5 top-3 text-zinc-400 hover:text-white p-0.5"
                    title="Xóa ô tìm kiếm"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Category Filter Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar -mx-1 px-1">
                {CATEGORY_ITEMS.map(cat => {
                  const Icon = cat.icon;
                  const count = categoryCounts[cat.id] || 0;
                  const isSelected = selectedCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs transition-all duration-200 shrink-0 font-medium active:scale-95 ${
                        isSelected 
                          ? 'bg-blue-500/15 text-blue-300 border border-blue-400/40 shadow-sm' 
                          : 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10'
                      }`}
                    >
                      <Icon size={13} className={isSelected ? 'text-blue-400' : 'text-zinc-400'} />
                      <span>{cat.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 font-mono ${
                        isSelected ? 'bg-blue-400/20 text-blue-200 border border-blue-400/30' : 'bg-zinc-800 text-zinc-400 border border-white/5'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid Algorithm Cards */}
            <div className={`flex-1 p-5 sm:p-6 overflow-y-auto grid ${viewMode === 'detailed' ? 'grid-cols-1 lg:grid-cols-2 gap-3' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3'} bg-zinc-950/40 custom-scrollbar auto-rows-max`}>
              {filteredCatalog.map(algo => {
                const isSelected = activeTab === algo.id;
                const catStyle = CATEGORY_STYLES[algo.category] || CATEGORY_STYLES.GRAPH;
                const CatItem = CATEGORY_ITEMS.find(c => c.id === algo.category);
                const CatIcon = CatItem?.icon || LayoutGrid;

                return (
                  <motion.div
                    key={algo.id}
                    whileHover={{ y: -2, transition: { duration: 0.12 } }}
                    onClick={() => {
                      onSelectAlgo(algo.id);
                      onClose();
                    }}
                    className={`group relative p-4 cursor-pointer transition-all duration-200 overflow-hidden active:scale-[0.98] ${
                      isSelected 
                        ? 'bg-blue-500/10 border border-blue-500/40 shadow-md' 
                        : `bg-zinc-900 border border-white/5 hover:border-white/10 hover:shadow-md`
                    }`}
                  >
                    {/* Accent top strip */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
                      style={{ background: isSelected ? '#60a5fa' : catStyle.accentBar }}
                    />

                    {/* Row 1: Icon + badges + complexity */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`p-1.5 shrink-0 ${catStyle.badgeBg} ${catStyle.badgeText} ${catStyle.badgeBorder}`}>
                          <CatIcon size={14} />
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 ${catStyle.badgeBg} ${catStyle.badgeText} ${catStyle.badgeBorder} shrink-0`}>
                          {CatItem?.label}
                        </span>
                        {algo.sourceBadge && (
                          <span className="text-[10px] font-mono text-zinc-300 bg-zinc-800 border border-white/10 px-2 py-0.5 shrink-0 truncate">
                            {algo.sourceBadge}
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 border border-amber-500/20 shrink-0 whitespace-nowrap">
                        <Clock size={10} className="opacity-80" />
                        {algo.complexity}
                      </span>
                    </div>

                    {/* Row 2: Title */}
                    <h3 className={`font-sans ${viewMode === 'detailed' ? 'text-[15px]' : 'text-sm'} font-bold text-zinc-100 group-hover:text-blue-300 transition-colors leading-tight mb-2`}>
                      {algo.name}
                    </h3>

                    {/* Row 3: Description */}
                    <p className={`text-xs text-zinc-400 group-hover:text-zinc-300 leading-relaxed font-sans transition-colors ${viewMode === 'compact' ? 'line-clamp-2' : ''} mb-3`}>
                      {algo.desc}
                    </p>

                    {/* Row 4: Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {algo.tags.slice(0, viewMode === 'compact' ? 2 : 3).map((tag, tIdx) => (
                        <span 
                          key={tIdx}
                          className="text-[10px] font-mono text-zinc-500 bg-zinc-800/80 px-2 py-0.5 border border-white/5 group-hover:text-zinc-400 group-hover:border-white/10 transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Row 5: Footer */}
                    <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 border border-emerald-500/25">
                          <span className="w-1.5 h-1.5 bg-emerald-400 animate-pulse" />
                          Đang xem
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400 transition-colors">
                          Nhấn để chọn
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-400 group-hover:text-blue-300 group-hover:translate-x-0.5 transition-all">
                        Mô phỏng <ArrowRight size={11} />
                      </span>
                    </div>
                  </motion.div>
                );
              })}

              {filteredCatalog.length === 0 && (
                <div className="col-span-full py-16 flex flex-col items-center justify-center text-center font-sans">
                  <div className="p-4 bg-zinc-900 border border-white/10 text-zinc-500 mb-4">
                    <Search size={32} className="opacity-80" />
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-200 mb-1.5">Không tìm thấy thuật toán nào</h4>
                  <p className="text-xs text-zinc-400 max-w-sm mb-5">
                    Không có thuật toán nào khớp với từ khóa "{searchQuery}" trong danh mục được chọn.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("ALL");
                    }}
                    className="px-4 py-2 text-xs font-medium text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 transition-all active:scale-95 shadow-sm"
                  >
                    Đặt lại bộ lọc & tìm kiếm
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
