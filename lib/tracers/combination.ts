export interface InputCombination {
  n: number;
  c: number;
}

export interface NodeComb {
  id: string;
  label: string;
  level: number;
  parent: string | null;
  status: 'visited' | 'active' | 'generating' | 'backtracked' | 'result';
}

export interface StateCombination {
  n: number;
  c: number;
  sequence: (number | null)[];
  k: number;
  nodes: NodeComb[];
  edges: { u: string; v: string; label: string }[];
  currentNode: string;
  results: number[][]; 
}

export interface StepCombination {
  stepId: number;
  phase: string;
  narrative: string;
  activeLine: number;
  state: StateCombination;
}

export function generateTracesCombination(input: InputCombination): StepCombination[] {
  const steps: StepCombination[] = [];
  let stepId = 0;
  const { n, c } = input;
  
  const seq: (number | null)[] = Array(c).fill(null);
  const nodes: NodeComb[] = [{ id: 'root', label: 'root', level: 0, parent: null, status: 'active' }];
  const edges: { u: string; v: string; label: string }[] = [];
  const results: number[][] = [];
  
  const snap = (phase: string, narrative: string, line: number, nodeStatusMap: Record<string, NodeComb['status']>, currNode: string) => {
    const nextNodes = nodes.map(nd => ({ ...nd, status: nodeStatusMap[nd.id] || nd.status }));
    steps.push({
      stepId: stepId++, phase, narrative, activeLine: line,
      state: {
        n, c, sequence: [...seq], k: seq.filter(x => x !== null).length,
        nodes: nextNodes, edges: [...edges], currentNode: currNode,
        results: [...results]
      }
    });
  };

  const statusMap: Record<string, NodeComb['status']> = { 'root': 'active' };
  
  snap("Khởi tạo", `Bắt đầu sinh các tổ hợp chập ${c} của tập {1..${n}}.`, 1, statusMap, 'root');

  function backtrack(k: number, last: number, parentId: string) {
    if (k === c) {
      statusMap[parentId] = 'result';
      results.push([...(seq as number[])]);
      snap("Ghi nhận cấu hình", `Đã chọn đủ ${c} phần tử. Tổ hợp tìm được: [${seq.join(', ')}]`, 3, statusMap, parentId);
      return;
    }

    // Tối ưu nhánh cắt: nếu (n - i + 1) < (C - k) thì không đủ phần tử
    for (let i = last + 1; i <= n; i++) {
        seq[k] = i;
        
        const childId = `${parentId}-${i}`;
        nodes.push({ id: childId, label: String(i), level: k + 1, parent: parentId, status: 'generating' });
        edges.push({ u: parentId, v: childId, label: String(i) });
        statusMap[childId] = 'generating';
        
        snap(`Chọn ${i} tại bước ${k}`, `Thêm ${i} (lớn hơn ${last}) vào tổ hợp đang xây dựng.`, 6, statusMap, childId);
        
        statusMap[childId] = 'active';
        snap(`Tiến tới nhánh ${i}`, `Gọi đệ quy generate(${k+1}, ${i})`, 7, statusMap, childId);
        
        backtrack(k + 1, i, childId);
        
        statusMap[childId] = 'backtracked';
        seq[k] = null;
        snap(`Quay lui khỏi nhánh ${i}`, `Giải phóng nhánh nhánh ${i}, để thử các phần tử lớn hơn tiếp theo.`, 7, statusMap, parentId);
    }
    statusMap[parentId] = 'visited';
  }

  backtrack(0, 0, 'root');
  
  snap("Hoàn thành", `Đã tìm được toàn bộ ${results.length} cấu hình tổ hợp chập ${c} của ${n}.`, 1, statusMap, 'root');

  return steps;
}
