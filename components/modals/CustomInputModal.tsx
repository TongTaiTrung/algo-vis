"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Zap, Cpu } from 'lucide-react';
import { TabType } from '@/types/algorithm';
import { ALGORITHM_CATALOG } from '@/constants/algorithms';
import { SAMPLE_TESTCASES } from '@/lib/parser/sample-testcases';
import { parseCPText } from '@/lib/parser/cp-parser';

interface CustomInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabType;
  onSubmitInput: (data: any) => void;
}

export default function CustomInputModal({
  isOpen,
  onClose,
  activeTab,
  onSubmitInput
}: CustomInputModalProps) {
  const [cpText, setCpText] = useState("");
  const activeMeta = ALGORITHM_CATALOG[activeTab];

  const handleApply = () => {
    try {
      const parsed = parseCPText(activeTab, cpText);
      onSubmitInput(parsed);
      onClose();
      setCpText("");
    } catch (e: any) {
      alert(e.message || "Lỗi phân tích cú pháp dữ liệu đầu vào");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl"
        >
          <motion.div 
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-3xl bg-zinc-950/95 backdrop-blur-3xl border border-emerald-500/30 shadow-2xl flex flex-col overflow-hidden relative"
          >
            <div className="p-5 sm:p-6 border-b border-white/10 flex flex-col gap-2 bg-emerald-900/10 shrink-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500/15 p-2.5 border border-emerald-500/30 text-emerald-400">
                    <Terminal size={22} />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-mono font-bold tracking-tight text-white">NHẬP DỮ LIỆU TÙY CHỈNH</h2>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">Dán dữ liệu kiểm thử theo đúng định dạng bài toán</p>
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95" 
                  title="Đóng cửa sổ"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex flex-col gap-5 overflow-y-auto custom-scrollbar">
              <div className="bg-amber-950/20 border border-amber-500/20 p-4 font-mono text-[11px] text-amber-200/90 leading-relaxed whitespace-pre-wrap bg-[url('/noise.png')] bg-repeat">
                <span className="font-bold text-amber-300 mb-2.5 block">ĐỊNH DẠNG ĐẦU VÀO YÊU CẦU CHO {activeMeta.name}:</span>
                {activeMeta.help}
              </div>

              <div className="flex gap-2.5 items-center flex-wrap -mt-1 mb-1">
                <span className="text-[10px] uppercase font-mono font-bold text-emerald-400/80 mr-1.5 flex items-center gap-1.5">
                  <Zap size={12} className="text-emerald-400" /> DATA MẪU:
                </span>
                {(SAMPLE_TESTCASES[activeTab] || []).map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCpText(sample.data)}
                    className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-300 hover:bg-emerald-500/20 active:scale-95 font-mono transition-all font-medium"
                  >
                    {sample.name}
                  </button>
                ))}
              </div>

              <textarea
                value={cpText}
                onChange={(e) => setCpText(e.target.value)}
                placeholder="Dán dữ liệu kiểm thử (test case) vào đây theo định dạng trên..."
                className="w-full h-72 bg-zinc-950 border border-emerald-500/30 p-5 font-mono text-sm text-emerald-300 placeholder:text-emerald-500/40 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all custom-scrollbar resize-none font-medium leading-relaxed tracking-wide shadow-inner"
                spellCheck={false}
              />
              <button
                onClick={handleApply}
                className="mt-1 w-full py-4 bg-emerald-600 hover:bg-emerald-500 border-t border-emerald-400/50 shadow-[0_4px_16px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_24px_rgba(16,185,129,0.4)] active:scale-[0.98] text-white font-bold font-sans tracking-widest transition-all uppercase flex justify-center items-center gap-2"
              >
                <Cpu size={18} />
                Nạp Dữ Liệu & Chạy Mô Phỏng
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
