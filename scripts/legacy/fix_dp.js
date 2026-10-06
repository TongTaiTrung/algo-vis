const fs = require('fs');

// Fix tracer
let tracer = fs.readFileSync('lib/tracers/dp-knapsack.ts', 'utf8');
tracer = tracer.replace(/export interface StepDP \{\n  stepId: number;\n  phase: string;\n  activeLine/g, 'export interface StepDP {\n  stepId: number;\n  phase: string;\n  narrative: string;\n  activeLine');
tracer = tracer.replace(/  const snap = \(\n    phase: string,\n    activeLine/g, '  const snap = (\n    phase: string,\n    narrative: string,\n    activeLine');
tracer = tracer.replace(/      stepId: stepId\+\+,\n      phase,\n      activeLine/g, '      stepId: stepId++,\n      phase,\n      narrative,\n      activeLine');

tracer = tracer.replace(/snap\("Initialization", 2, memory, state\);/g, 'snap("Initialization", "Khởi tạo bảng DP toàn số 0. Kích thước (số đồ vật + 1) x (sức chứa + 1).", 2, memory, state);');
tracer = tracer.replace(/snap\("Outer Loop - Item", 3, memory, state\);/g, 'snap("Outer Loop - Item", `Bắt đầu xét đồ vật thứ ${i} có trọng lượng ${input.items[i-1].weight} và giá trị ${input.items[i-1].value}.`, 3, memory, state);');
tracer = tracer.replace(/snap\("Inner Loop - Capacity", 4, memory, state\);/g, 'snap("Inner Loop - Capacity", `Đang xét ba lô có mức sức chứa cụ thể là ${w}.`, 4, memory, state);');
tracer = tracer.replace(/snap\("Check Item Weight", 5, memory, state\);/g, 'snap("Check Item Weight", `Kiểm tra xem đồ vật đang xét (nặng ${itemW}) có nhét vừa ba lô (chứa ${w}) không.`, 5, memory, state);');
tracer = tracer.replace(/snap\("Calculate taking item", 6, memory, state\);/g, 'snap("Calculate taking item", "Trọng lượng thỏa mãn. Nếu CÓ lấy đồ vật này, cộng giá trị của nó vào giá trị tối ưu của phần không gian còn lại trong ba lô.", 6, memory, state);');
tracer = tracer.replace(/snap\("Calculate skipping item", 7, memory, state\);/g, 'snap("Calculate skipping item", "Tính cả trường hợp KHÔNG lấy đồ vật này (kế thừa giá trị trực tiếp từ ô phía trên).", 7, memory, state);');
tracer = tracer.replace(/snap\("Update cell with max", 8, memory, state\);/g, 'snap("Update cell with max", "Chọn giá trị lớn nhất giữa việc LẤY và KHÔNG LẤY để điền vào bảng.", 8, memory, state);');
tracer = tracer.replace(/snap\("Item too heavy, copy above", 10, memory, state\);/g, 'snap("Item too heavy, copy above", "Đồ vật quá nặng, không thể nhét vừa ba lô lúc này. Bắt buộc KHÔNG LẤY (chép xuống từ trên).", 10, memory, state);');
tracer = tracer.replace(/snap\("Completed", 11, memory, state\);/g, 'snap("Completed", "Bảng DP đã được lấp đầy. Kết quả tối ưu nằm ở ô góc dưới cùng bên phải.", 11, memory, state);');

fs.writeFileSync('lib/tracers/dp-knapsack.ts', tracer);

// Fix component
let comp = fs.readFileSync('components/visualizers/DPKnapsack.tsx', 'utf8');

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
  fs.writeFileSync('components/visualizers/DPKnapsack.tsx', comp);
  console.log("Fixed DPKnapsack");
} else {
  console.log("DPKnapsack already has Narrative Panel.");
}
