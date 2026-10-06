const fs = require('fs');
let code = fs.readFileSync('lib/tracers/dijkstra.ts', 'utf8');

// Replace remaining snap("...", line, m, st) with snap("...", "...", line, m, st)
code = code.replace(/snap\("Set source distance", 3, /g, 'snap("Set source distance", "Gán khoảng cách đỉnh nguồn = 0.", 3, ');
code = code.replace(/snap\("Enqueue source", 4, /g, 'snap("Enqueue source", "Đẩy đỉnh nguồn vào PQ.", 4, ');
code = code.replace(/snap\("Update shortest path", 10, /g, 'snap("Update shortest path", "Cập nhật đường đi ngắn nhất thành công.", 10, ');
code = code.replace(/snap\("Enqueue updated neighbor", 11, /g, 'snap("Enqueue updated neighbor", "Đẩy hàng xóm với khoảng cách mới vào PQ.", 11, ');
code = code.replace(/snap\("Path not better", 12, /g, 'snap("Path not better", "Khoảng cách tạm thời lớn hơn giá trị đã biết, không cập nhật.", 12, ');

fs.writeFileSync('lib/tracers/dijkstra.ts', code);
