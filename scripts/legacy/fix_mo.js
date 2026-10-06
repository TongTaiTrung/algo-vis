const fs = require('fs');

let tracer = fs.readFileSync('lib/tracers/mo-algorithm.ts', 'utf8');
tracer = tracer.replace(/export interface StepMo \{\n  stepId: number;\n  phase: string;\n  activeLine/g, 'export interface StepMo {\n  stepId: number;\n  phase: string;\n  narrative: string;\n  activeLine');
tracer = tracer.replace(/  const snap = \(\n    phase: string,\n    activeLine/g, '  const snap = (\n    phase: string,\n    narrative: string,\n    activeLine');
tracer = tracer.replace(/      stepId: stepId\+\+,\n      phase,\n      activeLine/g, '      stepId: stepId++,\n      phase,\n      narrative,\n      activeLine');

// Add narratives
tracer = tracer.replace(/snap\("Initialization", 2, memory, state\);/g, 'snap("Initialization", "Khởi tạo mảng số lần xuất hiện (freq) trống và biến current_answer = 0.", 2, memory, state);');
tracer = tracer.replace(/snap\("Main Loop Queries", 3, memory, state\);/g, 'snap("Main Loop Queries", `Truy vấn đang xem: [${q.originalL}, ${q.originalR}]`, 3, memory, state);');
tracer = tracer.replace(/snap\("Add Right", 4, memory, state\);/g, 'snap("Add Right", "Mở rộng con trỏ R về bên phải, thêm phần tử vào tệp hiện tại.", 4, memory, state);');
tracer = tracer.replace(/snap\("Remove Right", 5, memory, state\);/g, 'snap("Remove Right", "Thu hẹp con trỏ R về bên trái, loại trừ phần tử khỏi tệp hiện tại.", 5, memory, state);');
tracer = tracer.replace(/snap\("Remove Left", 6, memory, state\);/g, 'snap("Remove Left", "Thu hẹp con trỏ L về bên phải, loại trừ phần tử khỏi tệp hiện tại.", 6, memory, state);');
tracer = tracer.replace(/snap\("Add Left", 7, memory, state\);/g, 'snap("Add Left", "Mở rộng con trỏ L về bên trái, thêm phần tử vào tệp hiện tại.", 7, memory, state);');
tracer = tracer.replace(/snap\("Store Answer", 8, memory, state\);/g, 'snap("Store Answer", "Đoạn [L, R] đã khớp hoàn toàn truy vấn, lưu lại kết quả hiện trường.", 8, memory, state);');
tracer = tracer.replace(/snap\("Completed", 9, memory, state\);/g, 'snap("Completed", "Tất cả các truy vấn đã được giải quyết nhanh gọn bằng kỹ thuật dịch trỏ Mo.", 9, memory, state);');
fs.writeFileSync('lib/tracers/mo-algorithm.ts', tracer);

let comp = fs.readFileSync('components/visualizers/MoAlgorithm.tsx', 'utf8');
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
  fs.writeFileSync('components/visualizers/MoAlgorithm.tsx', comp);
  console.log("Fixed MoAlgorithm");
}
