const fs = require('fs');

// Fix tracer to include narrative
let tracer = fs.readFileSync('lib/tracers/dijkstra.ts', 'utf8');
tracer = tracer.replace(/export interface Step \{\n  stepId/g, 'export interface Step {\n  stepId: number;\n  narrative: string;');
tracer = tracer.replace(/  const snap = \(\n    phase: string,\n    activeLine/g, '  const snap = (\n    phase: string,\n    narrative: string,\n    activeLine');
tracer = tracer.replace(/      stepId: stepId\+\+,\n      phase,\n      activeLine/g, '      stepId: stepId++,\n      phase,\n      narrative,\n      activeLine');

// Add narratives to Dijkstra snaps
tracer = tracer.replace(/snap\("Initialization", 2, memory, state\);/g, 'snap("Initialization", "Khởi tạo mảng khoảng cách với vô cực, thêm đỉnh bắt đầu vào hàng đợi ưu tiên.", 2, memory, state);');
tracer = tracer.replace(/snap\("Dequeue Next Node", 4, memory, state\);/g, 'snap("Dequeue Next Node", "Lấy đỉnh có khoảng cách ngắn nhất hiện tại ra khỏi hàng đợi.", 4, memory, state);');
tracer = tracer.replace(/snap\("Skip visited node", 5, memory, state\);/g, 'snap("Skip visited node", "Đỉnh này đã được xử lý xong, bỏ qua để tối ưu thuật toán.", 5, memory, state);');
tracer = tracer.replace(/snap\("Mark Node Visited", 6, memory, state\);/g, 'snap("Mark Node Visited", "Đánh dấu đỉnh hiện tại đã duyệt xong (khoảng cách ngắn nhất đã được chốt).", 6, memory, state);');
tracer = tracer.replace(/snap\("Check Neighbor", 7, memory, state\);/g, 'snap("Check Neighbor", "Đang xét đường đi từ đỉnh hiện tại sang hàng xóm.", 7, memory, state);');
tracer = tracer.replace(/snap\("Calculate new distance", 8, memory, state\);/g, 'snap("Calculate new distance", "Tính khoảng cách tạm thời đến hàng xóm = khoảng cách hiện tại + trọng số cạnh.", 8, memory, state);');
tracer = tracer.replace(/snap\("Update shortest path", 9, memory, state\);/g, 'snap("Update shortest path", "Khoảng cách tạm thời nhỏ hơn khoảng cách đã biết. Cập nhật đường đi ngắn nhất!", 9, memory, state);');
tracer = tracer.replace(/snap\("Completed", 12, memory, state\);/g, 'snap("Completed", "Hàng đợi rỗng. Thuật toán Dijkstra kết thúc, mọi đường đi ngắn nhất đã được tìm thấy.", 12, memory, state);');

fs.writeFileSync('lib/tracers/dijkstra.ts', tracer);

// Fix component
let comp = fs.readFileSync('components/visualizers/Dijkstra.tsx', 'utf8');
comp = comp.replace(/Phase \[\{step\.phase\}\]: Thuật toán đang duyệt các hàng xóm kề đỉnh \{step\.state\.currentNode \?\? 'gốc'\} để cập nhật khoảng cách ngắn nhất\./g, '{step.narrative}');
comp = comp.replace(/key=\{step\.phase \+ currentIndex\}/g, 'key={step.narrative}');
fs.writeFileSync('components/visualizers/Dijkstra.tsx', comp);

console.log("Fixed Dijkstra");
