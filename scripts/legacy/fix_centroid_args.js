const fs = require('fs');
let code = fs.readFileSync('lib/tracers/centroid.ts', 'utf8');

// The snap function has signature: snap(phase: string, narrative: string, activeLine: number, memory: Record<...>)
// The calls currently look like: snap("Phase Name", 2, m); or snap(`Phase ${v}`, 2, m);
// We will replace them by duplicating the phase string as the narrative string for now, or just providing a generic narrative string based on the phase.

code = code.replace(/snap\("DFS: Setup size", 2, m\);/g, 'snap("DFS: Setup size", "Duyệt DFS để set cứng size = 1 cho đỉnh hiện tại.", 2, m);');
code = code.replace(/snap\(`DFS: Add subtree \$\{v\} size`, 2, m\);/g, 'snap(`DFS: Add subtree ${v} size`, `Cộng dồn kích thước cây con ${v} vào cha.`, 2, m);');
code = code.replace(/snap\("Check node as potential centroid", 4, m\);/g, 'snap("Check node", "Kiểm tra đỉnh này xem có thỏa mãn điều kiện <= N/2 hay không.", 4, m);');
code = code.replace(/snap\(`Check if child \$\{v\} is heavy \(> \$\{total\}\/2\)`, 4, m\);/g, 'snap(`Check child ${v}`, `Xem nhánh ${v} có "nặng" hơn mức cho phép (> ${total}/2) hay không.`, 4, m);');
code = code.replace(/snap\(`Move to heavy child \$\{v\}`, 4, m\);/g, 'snap(`Move to heavy child ${v}`, `Cây con ${v} quá nặng, tiếp tục đẩy xuống xét ${v} làm Centroid thay thế.`, 4, m);');
code = code.replace(/snap\("Bắt đầu giải phân rã", 1, m\);/g, 'snap("Bắt đầu giải phân rã", "Bắt đầu hàm solve: Tìm trọng tâm cho thành phần liên thông hiện tại.", 1, m);');
code = code.replace(/snap\("Lấy tổng Kích thước Cây con đang xét", 3, m\);/g, 'snap("Lấy tổng Kích thước", "Lấy kích thước tổng của cả nhánh từ mảng size vừa được DFS.", 3, m);');
code = code.replace(/snap\(`Tìm thấy Trọng tâm \(Centroid\): \$\{centroid\}`, 4, m\);/g, 'snap(`Tìm thấy Trọng tâm`, `Xác nhận Trọng tâm (Centroid): ${centroid}.`, 4, m);');
code = code.replace(/snap\("Tách \(Remove\) Trọng tâm ra khỏi Cây", 5, m\);/g, 'snap("Tách (Remove) Trọng tâm", "Tách hủy đỉnh này bằng cờ isRemoved. Nó sẽ biến khỏi các cuộc tìm kiếm sau.", 5, m);');
code = code.replace(/snap\(`Nối \$\{centroid\} vào Trọng tâm cha là \$\{parentCentroid\}`, 8, m\);/g, 'snap(`Nối Centroid Tree`, `Tạo liên kết trong Cây Trọng Tâm (Centroid Tree).`, 8, m);');
code = code.replace(/snap\(`Chuẩn bị đệ quy vào nhánh \$\{v\}`, 11, m\);/g, 'snap(`Chuẩn bị đệ quy nhánh ${v}`, `Chuyển qua thành phần liên thông tiếp theo.`, 11, m);');
code = code.replace(/snap\("Khởi tạo cấu trúc Cây", 1, memory\);/g, 'snap("Khởi tạo", "Sẵn sàng phân rã.", 1, memory);');
code = code.replace(/snap\("Hoàn tất Phân Rã Trọng Tâm!", 11, memory\);/g, 'snap("Hoàn tất", "Đã phân rã toàn bộ.", 11, memory);');

fs.writeFileSync('lib/tracers/centroid.ts', code);
console.log("Fixed centroid.ts arguments");
