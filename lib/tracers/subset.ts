export interface InputSubset {
  n: number;
}

export interface NodeSub {
  id: string;
  label: string;
  level: number;
  parent: string | null;
  status: 'visited' | 'active' | 'generating' | 'backtracked' | 'result';
}

export interface StateSubset {
  n: number;
  subset: number[];
  nodes: NodeSub[];
  edges: { u: string; v: string; label: string }[];
  currentNode: string;
  results: number[][]; 
}

export interface StepSubset {
  stepId: number;
  phase: string;
  narrative: string;
  activeLine: number;
  state: StateSubset;
}

export function generateTracesSubset(input: InputSubset): StepSubset[] {
  const steps: StepSubset[] = [];
  let stepId = 0;
  const { n } = input;
  
  const subset: number[] = [];
  const nodes: NodeSub[] = [{ id: 'root', label: '[]', level: 0, parent: null, status: 'active' }];
  const edges: { u: string; v: string; label: string }[] = [];
  const results: number[][] = [];
  
  const snap = (phase: string, narrative: string, line: number, nodeStatusMap: Record<string, NodeSub['status']>, currNode: string) => {
    const nextNodes = nodes.map(nd => ({ ...nd, status: nodeStatusMap[nd.id] || nd.status }));
    steps.push({
      stepId: stepId++, phase, narrative, activeLine: line,
      state: {
        n, subset: [...subset], nodes: nextNodes, edges: [...edges], currentNode: currNode,
        results: [...results]
      }
    });
  };

  const statusMap: Record<string, NodeSub['status']> = { 'root': 'active' };
  
  snap("Khởi tạo", `Bắt đầu sinh các tập con của tập {1..${n}}.`, 1, statusMap, 'root');

  function backtrack(last: number, parentId: string) {
    statusMap[parentId] = 'result';
    results.push([...subset]);
    snap("Ghi nhận Mọi Bước", `Tập con hiện tại hợp lệ. Đã thêm [${subset.join(', ')}] vào kết quả.`, 2, statusMap, parentId);
    
    for (let i = last + 1; i <= n; i++) {
        subset.push(i);
        
        const childId = `${parentId}-${i}`;
        nodes.push({ id: childId, label: 'Thêm ' + i, level: subset.length, parent: parentId, status: 'generating' });
        edges.push({ u: parentId, v: childId, label: String(i) });
        statusMap[childId] = 'generating';
        
        snap(`Thêm ${i}`, `Thử thêm phần tử ${i} vào tập con.`, 5, statusMap, childId);
        
        statusMap[childId] = 'active';
        snap(`Tiến tới nhánh ${i}`, `Gọi đệ quy generate(${i})`, 6, statusMap, childId);
        
        backtrack(i, childId);
        
        statusMap[childId] = 'backtracked';
        subset.pop();
        snap(`Quay lui khỏi nhánh ${i}`, `Giải phóng nhánh ${i}, để thử các phần tử lớn hơn tiếp theo.`, 7, statusMap, parentId);
    }
    statusMap[parentId] = 'visited';
  }

  backtrack(0, 'root');
  
  snap("Hoàn thành", `Đã tìm được toàn bộ ${results.length} cấu hình tập con của ${n}.`, 1, statusMap, 'root');

  return steps;
}
