const fs = require('fs');
let code = fs.readFileSync('components/visualizers/MoAlgorithm.tsx', 'utf-8');

// Inside MoVisualizer we need local states:
// const [newL, setNewL] = React.useState<string>("");
// const [newR, setNewR] = React.useState<string>("");
code = code.replace(
  "export default function MoVisualizer({ input, steps }: VisualizerProps) {",
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

// We need to find a place to put the Add Query UI.
// MoAlgorithm has a list of queries on the right column ?
// Let's check where the Queries are rendered.
