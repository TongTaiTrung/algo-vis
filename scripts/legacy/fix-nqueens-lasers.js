const fs = require('fs');
let content = fs.readFileSync('components/visualizers/NQueens.tsx', 'utf-8');

const laserLogic = `

                    {/* Threat Lasers for all placed queens */}
                    {step.state.queens.map((qCol, qRow) => {
                       if (qCol === -1) return null;
                       const qx = qCol * 100 + 50;
                       const qy = qRow * 100 + 50;
                       const ext = 2000;
                       return (
                         <g key={\`laser-\${qRow}\`} className="opacity-30">
                           {/* Horizontal */}
                           <line x1={0} y1={qy} x2={N*100} y2={qy} stroke="#F43F5E" strokeWidth="2" strokeDasharray="5 5" />
                           {/* Vertical */}
                           <line x1={qx} y1={0} x2={qx} y2={N*100} stroke="#F43F5E" strokeWidth="2" strokeDasharray="5 5" />
                           {/* Main Diagonal */}
                           <line x1={qx - ext} y1={qy - ext} x2={qx + ext} y2={qy + ext} stroke="#F43F5E" strokeWidth="2" strokeDasharray="5 5" />
                           {/* Anti Diagonal */}
                           <line x1={qx - ext} y1={qy + ext} x2={qx + ext} y2={qy - ext} stroke="#F43F5E" strokeWidth="2" strokeDasharray="5 5" />
                         </g>
                       );
                    })}

`;

if (!content.includes('Threat Lasers')) {
    content = content.replace(
        /<svg className="absolute inset-0 w-full h-full pointer-events-none z-30"[^>]*>/,
        (match) => match + laserLogic
    );
    fs.writeFileSync('components/visualizers/NQueens.tsx', content, 'utf-8');
}
