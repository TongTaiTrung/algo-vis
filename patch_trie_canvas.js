const fs = require('fs');
let code = fs.readFileSync('components/visualizers/Trie.tsx', 'utf-8');

const regex = /<TransformComponent[\\s\\S]*?>\\s*<svg className="absolute w-\\[800px\\] h-\\[800px\\] pointer-events-none z-0" overflow="visible">/;

const replacement = `<TransformComponent wrapperStyle={{ width: "100%", height: "100%", outline: 'none' }} contentStyle={{ minWidth: "100%", minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: 'relative' }}>
                <div className="relative w-[800px] h-[600px]">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" overflow="visible">`;

code = code.replace(regex, replacement);

const regexEnd = /<\/svg>[\s\S]*?{placedNodes\.map\(node => \{/;

const replacementEnd = `</svg>

                  {/* Nodes */}
                  {placedNodes.map(node => {`;

code = code.replace(regexEnd, replacementEnd);

const regexFinalEnd = /\{node\.isEndOfWord && \([\s\S]*?<\/motion\.div>\s*\)\s*\}\)\}\s*<\/TransformComponent>/;
const replacementFinalEnd = `{node.isEndOfWord && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border border-[#040405]" />
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </TransformComponent>`;

code = code.replace(regexFinalEnd, replacementFinalEnd);

fs.writeFileSync('components/visualizers/Trie.tsx', code, 'utf-8');
console.log("Patched Trie Canvas");
