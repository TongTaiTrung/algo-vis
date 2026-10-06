const fs = require('fs');
let code = fs.readFileSync('components/visualizers/SparseTable.tsx', 'utf-8');

const regex = /\/\* Array items row \*\/[\s\S]*?\{\/\* SECTION 2: Bảng Thưa Ma Trận st\[k\]\[i\] 2D \*\/\}/;

const replacement = `
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
                        className={\`w-12 h-14 flex flex-col items-center justify-center font-mono border-2 relative transition-all shrink-0 \${borderClass}\`}
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
                        const leftPos = \`calc(\${iv.start} * 3.5rem)\`;
                        const barWidth = \`calc(\${iv.length} * 3rem + \${iv.length - 1} * 0.5rem)\`;
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
                            className={\`absolute h-6 border flex items-center justify-center text-[10px] font-mono font-bold truncate rounded-sm overflow-hidden whitespace-nowrap px-2 shadow-lg \${barColor}\`}
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

            {/* SECTION 2: Bảng Thưa Ma Trận st[k][i] 2D */}`;

code = code.replace(regex, replacement);
fs.writeFileSync('components/visualizers/SparseTable.tsx', code, 'utf-8');
console.log("Patched successfully");
