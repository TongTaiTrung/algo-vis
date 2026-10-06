const fs = require('fs');

let comp = fs.readFileSync('components/visualizers/NQueens.tsx', 'utf8');
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
  fs.writeFileSync('components/visualizers/NQueens.tsx', comp);
}
