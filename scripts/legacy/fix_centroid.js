const fs = require('fs');

let tracer = fs.readFileSync('lib/tracers/centroid.ts', 'utf8');
tracer = tracer.replace(/export interface StepCentroid \{\n  stepId: number;\n  phase: string;\n  activeLine/g, 'export interface StepCentroid {\n  stepId: number;\n  phase: string;\n  narrative: string;\n  activeLine');
tracer = tracer.replace(/  const snap = \(phase: string, activeLine: number/g, '  const snap = (phase: string, narrative: string, activeLine: number');
tracer = tracer.replace(/      stepId: stepId\+\+,\n      phase,\n      activeLine,/g, '      stepId: stepId++,\n      phase,\n      narrative,\n      activeLine,');

// Adjust snaps
tracer = tracer.replace(/snap\("Find Centroid Called", 2, /g, 'snap("Find Centroid Called", "Đang xử lý phân rã trên nhánh mới.", 2, ');
tracer = tracer.replace(/snap\("DFS Subtree Sizes", 3, /g, 'snap("DFS Subtree Sizes", "Duyệt DFS để tính số lượng đỉnh của từng cây con hiện tại.", 3, ');
tracer = tracer.replace(/snap\("Locating Centroid", 4, /g, 'snap("Locating Centroid", "Đang tìm kiếm trọng tâm (Centroid): Đỉnh mà mọi cây con đều xé ra có kích thước không vượt quá một nửa tổng số đỉnh nhánh.", 4, ');
tracer = tracer.replace(/snap\("Centroid Found", 5, /g, 'snap("Centroid Found", `Đỉnh Centroid đã được tìm thấy là đỉnh đang xét.`, 5, ');
tracer = tracer.replace(/snap\("Mark Centroid Processed", 6, /g, 'snap("Mark Centroid Processed", "Đánh dấu đỉnh Centroid hiện tại là đã xử lý xong và cắt bỏ khỏi cây ban đầu.", 6, ');
tracer = tracer.replace(/snap\("Process Neighbors", 7, /g, 'snap("Process Neighbors", "Tiếp tục gọi đệ quy phân rã cây Centroid cho các nhánh con còn lại chưa bị xóa.", 7, ');
tracer = tracer.replace(/snap\("Centroid Decomposition Complete", 9, /g, 'snap("Centroid Decomposition Complete", "Hoàn tất thuật toán. Kiến trúc Centroid Tree đã được dựng bề mặt.", 9, ');
fs.writeFileSync('lib/tracers/centroid.ts', tracer);

let comp = fs.readFileSync('components/visualizers/Centroid.tsx', 'utf8');
if (!comp.includes('MessageSquareQuote')) {
  comp = comp.replace(/import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';/, "import { Play, Pause, SkipBack, SkipForward, MessageSquareQuote } from 'lucide-react';");
  
  const target = `</div>\n\n        {/* Dashboard */}`;
  const panel = `</div>\n\n          {/* SOLID NARRATIVE EXPERT PANEL */}
          <div className="bg-[#09090B] border-t border-amber-500/30 p-5 z-20 flex gap-4 items-start shrink-0 shadow-[0_-15px_30px_rgba(0,0,0,0.4)]">
             <div className="bg-amber-500/20 p-2.5 rounded-full shrink-0 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.3)] mt-1">
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
          </div>\n        </div>\n\n        {/* Dashboard */}`;
          
  comp = comp.replace(target, panel);
  fs.writeFileSync('components/visualizers/Centroid.tsx', comp);
}
