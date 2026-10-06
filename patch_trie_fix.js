const fs = require('fs');
let code = fs.readFileSync('components/visualizers/Trie.tsx', 'utf-8');

const oldStr = `<TransformComponent wrapperStyle={{ width: "100%", height: "100%", outline: 'none' }} contentStyle={{ minWidth: "100%", minHeight: "100%", display: "flex", justifyContent: "center", position: 'relative' }}>
                <svg className="absolute w-[800px] h-[800px] pointer-events-none z-0" overflow="visible">`;

const newStr = `<TransformComponent wrapperStyle={{ width: "100%", height: "100%", outline: 'none' }} contentStyle={{ minWidth: "100%", minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: 'relative' }}>
                <div className="relative w-[800px] h-[600px] shrink-0">
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" overflow="visible">`;

code = code.replace(oldStr, newStr);

const oldStrEnd = `</motion.div>
                  )
                })}
              </TransformComponent>`;

const newStrEnd = `</motion.div>
                  )
                })}
                </div>
              </TransformComponent>`;

code = code.replace(oldStrEnd, newStrEnd);

fs.writeFileSync('components/visualizers/Trie.tsx', code, 'utf-8');
console.log("Patched!");
