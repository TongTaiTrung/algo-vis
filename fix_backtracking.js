const fs = require('fs');

const files = [
  'components/visualizers/BinarySequence.tsx',
  'components/visualizers/Combination.tsx',
  'components/visualizers/Permutation.tsx',
  'components/visualizers/Subset.tsx'
];

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');

  // 1. Add MessageSquareQuote
  if (!code.includes('MessageSquareQuote')) {
    code = code.replace(/import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';/, "import { Play, Pause, SkipBack, SkipForward, MessageSquareQuote } from 'lucide-react';");
  }

  // 2. Add rounded-2xl to col-span-8
  code = code.replace(/className="col-span-8 relative bg-white\/5 backdrop-blur-md border border-white\/10 overflow-hidden shadow-2xl flex flex-col"/, 'className="col-span-8 relative bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col"');
  
  // 3. Inject Narrative Panel before Right Panel
  if (!code.includes('SOLID NARRATIVE EXPERT PANEL')) {
    const narrativePanel = `          {/* SOLID NARRATIVE EXPERT PANEL */}
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
          </div>
        </div>
        
        {/* Right Panel: Array state and Code */}`;
    code = code.replace(/        <\/div>\n\s*\{\/\* Right Panel: Array state and Code \*\/\}/, narrativePanel);
  }

  // 4. Update Right Panel col-span-4 min-h-0 and blocks
  code = code.replace(/<div className="col-span-4 flex flex-col gap-4">/, '<div className="col-span-4 flex flex-col gap-4 min-h-0">');
  
  // Right panel upper block styling (state/sequence)
  code = code.replace(/<div className="bg-white\/5 backdrop-blur-md border border-white\/10 overflow-hidden shadow-2xl p-4">/g, 
                      '<div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 overflow-hidden shadow-xl shrink-0">');
  // Right panel titles styling
  code = code.replace(/<h3 className="font-mono text-zinc-400 text-xs font-bold mb-3 uppercase">([^<]+)<\/h3>/g, 
                      '<h2 className="font-mono text-white/80 font-bold tracking-tight mb-4 text-sm uppercase">$1</h2>');
  code = code.replace(/<h3 className="font-mono text-zinc-400 text-xs font-bold mb-2 uppercase">([^<]+)<\/h3>/g, 
                      '<h2 className="font-mono text-white/80 font-bold tracking-tight mb-2 flex mt-4 text-[10px] uppercase">$1</h2>');
  code = code.replace(/border-white\/10 bg-white\/5 text-transparent/g, 'border-white/10 bg-[#09090B] text-transparent');
  code = code.replace(/rounded/g, 'rounded-lg'); // Standardizes rounded inner blocks if it fits, let's just leave the class strings or just replace border radii carefully

  // Update Code Block section: we replace the custom split block `Trace & Code` entirely
  const traceCodePattern = /<div className="flex-1 bg-white\/5 backdrop-blur-md border border-white\/10 overflow-hidden shadow-2xl flex flex-col">\s*<div className="p-3 border-b border-white\/10 bg-\[#09090B\]">\s*<h3 className="font-mono text-zinc-400 text-xs font-bold uppercase">Trace & Code<\/h3>\s*<\/div>\s*<div className="p-4 bg-zinc-900\/50 border-b border-white\/10 flex-shrink-0">\s*<div className="font-mono text-amber-400 text-sm font-bold mb-1">\{step\.phase\}<\/div>\s*<div className="text-zinc-300 text-sm leading-relaxed">\{step\.narrative\}<\/div>\s*<\/div>\s*<div className="flex-1 overflow-auto bg-\[#040405\] p-4 custom-scrollbar">\s*(<CodeBlock snippets=\{[A-Z_]+\} mappings=\{[A-Z_]+\} activeLine=\{step\.activeLine\} \/>)\s*<\/div>\s*<\/div>/;

  const standardCodeBlock = `<div className="flex-[2] bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 overflow-hidden flex flex-col shadow-xl">
            <h2 className="font-mono text-white/80 font-bold tracking-tight mb-4 text-sm">PSEUDOCODE</h2>
            <div className="flex-1 overflow-auto bg-[#040405] rounded-xl border border-white/5 p-4 custom-scrollbar">
              $1
            </div>
          </div>`;

  code = code.replace(traceCodePattern, standardCodeBlock);


  // 5. Replace Playback Controls entirely
  const controlDeckStandard = `{/* Control Deck */}
      <div className="h-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 flex items-center justify-between gap-6 shadow-2xl shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={stepBackward} disabled={currentIndex === 0} className="text-white/70 hover:text-white disabled:opacity-30 transition"><SkipBack size={20} /></button>
          <button onClick={togglePlay} className="text-amber-400 hover:text-amber-300 hover:scale-110 active:scale-95 transition-all">
            {isPlaying ? <Pause size={28} /> : <Play size={28} fill="currentColor" />}
          </button>
          <button onClick={stepForward} disabled={currentIndex === steps.length - 1} className="text-white/70 hover:text-white disabled:opacity-30 transition"><SkipForward size={20} /></button>
        </div>
        
        <div className="flex-1 flex items-center gap-4 px-8">
          <span className="font-mono text-xs text-white/40">Trace</span>
          <input type="range" min="0" max={steps.length - 1} value={currentIndex} onChange={(e) => jumpTo(parseInt(e.target.value))} className="flex-1 accent-amber-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
          <span className="font-mono text-xs text-white/40 w-12 text-right">{Math.round(((currentIndex + 1) / steps.length) * 100)}%</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-white/40 uppercase">Speed</span>
          <input type="range" min="50" max="1000" step="50" style={{ direction: 'rtl' }} value={playbackSpeed} onChange={(e) => setPlaybackSpeed(parseInt(e.target.value))} className="w-24 accent-amber-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
        </div>
      </div>`;

  const oldControlsRegex = /\{\/\* Playback Controls \*\/\}\s*<div className="bg-\[#09090B\].*?<\/div>(\s*<\/div>\s*\)[\s\S]*|)$/;
  // Actually, replacing everything from `{/* Playback Controls */}` down to just before the last few lines or the end is risky.
  // Better use indexOf and slice since that part is at the very end of the component return block!
  const pbIdx = code.indexOf('{/* Playback Controls */}');
  if (pbIdx !== -1) {
    code = code.slice(0, pbIdx) + controlDeckStandard + '\n    </div>\n  );\n}';
  }

  // Also fix `<div key={idx} className={"w-10 h-10 border-2 ..."` to be rounded
  code = code.replace(/className={`w-10 h-10 border-2/g, 'className={`w-10 h-10 rounded-lg border-2');

  fs.writeFileSync(file, code);
  console.log(`Processed ${file}`);
});
