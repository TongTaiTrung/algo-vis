const fs = require('fs');
let code = fs.readFileSync('components/visualizers/MoAlgorithm.tsx', 'utf-8');

code = code.replace(
  "export default function MoVisualizer({ input, steps, onUpdateInput }: VisualizerProps) {",
  `export default function MoVisualizer({ input, steps, onUpdateInput }: VisualizerProps) {
  const [newL, React_setNewL] = React.useState("");
  const [newR, React_setNewR] = React.useState("");

  const handleAddQuery = () => {
    const L = parseInt(newL);
    const R = parseInt(newR);
    if (!isNaN(L) && !isNaN(R) && L <= R && L >= 0 && R < input.arr.length) {
      if (onUpdateInput) {
        onUpdateInput({
          ...input,
          queries: [...input.queries, { L, R }]
        });
      }
      React_setNewL("");
      React_setNewR("");
    } else {
      alert(\`Vui lòng nhập L <= R và trong khoảng 0 đến \${input.arr.length - 1}\`);
    }
  };`
);

fs.writeFileSync('components/visualizers/MoAlgorithm.tsx', code, 'utf-8');
console.log("Patched Mo Component properly");
