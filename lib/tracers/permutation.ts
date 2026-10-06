export interface InputPermutation {
  n: number;
}

export interface NodePerm {
  id: string;
  label: string;
  level: number;
  parent: string | null;
  status: 'visited' | 'active' | 'generating' | 'backtracked' | 'result';
}

export interface StatePermutation {
  n: number;
  sequence: (number | null)[];
  used: boolean[];
  k: number;
  nodes: NodePerm[];
  edges: { u: string; v: string; label: string }[];
  currentNode: string;
  results: number[][]; 
}

export interface StepPermutation {
  stepId: number;
  phase: string;
  narrative: string;
  activeLine: number;
  state: StatePermutation;
}

export function generateTracesPermutation(input: InputPermutation): StepPermutation[] {
  const steps: StepPermutation[] = [];
  let stepId = 0;
  const { n } = input;
  
  const seq: (number | null)[] = Array(n).fill(null);
  const used: boolean[] = Array(n + 1).fill(false);
  const nodes: NodePerm[] = [{ id: 'root', label: 'root', level: 0, parent: null, status: 'active' }];
  const edges: { u: string; v: string; label: string }[] = [];
  const results: number[][] = [];
  
  const snap = (phase: string, narrative: string, line: number, nodeStatusMap: Record<string, NodePerm['status']>, currNode: string) => {
    const nextNodes = nodes.map(nd => ({ ...nd, status: nodeStatusMap[nd.id] || nd.status }));
    steps.push({
      stepId: stepId++, phase, narrative, activeLine: line,
      state: {
        n, sequence: [...seq], used: [...used], k: seq.filter(x => x !== null).length,
        nodes: nextNodes, edges: [...edges], currentNode: currNode,
        results: [...results]
      }
    });
  };

  const statusMap: Record<string, NodePerm['status']> = { 'root': 'active' };
  
  snap("Khởi tạo", `Bắt đầu sinh hoán vị của tập {1..n} với n=${n}.`, 1, statusMap, 'root');

  function backtrack(k: number, parentId: string) {
    if (k === n) {
      statusMap[parentId] = 'result';
      results.push([...(seq as number[])]);
      snap("Ghi nhận cấu hình", `Đã điền đủ ${n} phần tử. Hoán vị tìm được: [${seq.join(', ')}]`, 3, statusMap, parentId);
      return;
    }

    for (let i = 1; i <= n; i++) {
        snap(`Xét phần tử ${i} cho vị trí ${k}`, `Kiểm tra xem ${i} đã được dùng chưa (used[${i}] == ${used[i]})`, 5, statusMap, parentId);
        
        if (!used[i]) {
          used[i] = true;
          seq[k] = i;
          
          const childId = `${parentId}-${i}`;
          nodes.push({ id: childId, label: String(i), level: k + 1, parent: parentId, status: 'generating' });
          edges.push({ u: parentId, v: childId, label: String(i) });
          statusMap[childId] = 'generating';
          
          snap(`Chọn ${i} cho vị trí ${k}`, `Đánh dấu used[${i}] = true và gắn vào hoán vị.`, 7, statusMap, childId);
          
          statusMap[childId] = 'active';
          snap(`Tiến tới nhánh ${i}`, `Gọi đệ quy generate(${k+1})`, 9, statusMap, childId);
          
          backtrack(k + 1, childId);
          
          statusMap[childId] = 'backtracked';
          used[i] = false;
          seq[k] = null;
          snap(`Quay lui khỏi nhánh ${i}`, `Giải phóng nhánh ${i}, đặt used[${i}] = false để thử các giá trị khác.`, 10, statusMap, parentId);
        } else {
          snap(`Bỏ qua phần tử ${i}`, `Phần tử ${i} đã nằm trong hoán vị trước đó nên bỏ qua.`, 6, statusMap, parentId);
        }
    }
    statusMap[parentId] = 'visited';
  }

  backtrack(0, 'root');
  
  snap("Hoàn thành", `Đã tìm được toàn bộ ${results.length} hoán vị.`, 1, statusMap, 'root');

  return steps;
}
