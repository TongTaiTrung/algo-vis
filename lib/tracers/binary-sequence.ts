export interface InputBinarySequence {
  n: number;
}

export interface NodeBS {
  id: string;
  label: string;
  level: number;
  parent: string | null;
  status: 'visited' | 'active' | 'generating' | 'backtracked' | 'result';
}

export interface StateBinarySequence {
  n: number;
  sequence: (number | null)[];
  k: number;
  nodes: NodeBS[];
  edges: { u: string; v: string; label: string }[];
  currentNode: string;
  results: number[][]; // full paths added to results
}

export interface StepBinarySequence {
  stepId: number;
  phase: string;
  narrative: string;
  activeLine: number;
  state: StateBinarySequence;
}

export function generateTracesBinarySequence(input: InputBinarySequence): StepBinarySequence[] {
  const steps: StepBinarySequence[] = [];
  let stepId = 0;
  const { n } = input;
  
  const seq: (number | null)[] = Array(n).fill(null);
  const nodes: NodeBS[] = [{ id: 'root', label: 'root', level: 0, parent: null, status: 'active' }];
  const edges: { u: string; v: string; label: string }[] = [];
  const results: number[][] = [];
  
  const snap = (phase: string, narrative: string, line: number, nodeStatusMap: Record<string, NodeBS['status']>, currNode: string) => {
    const nextNodes = nodes.map(nd => ({ ...nd, status: nodeStatusMap[nd.id] || nd.status }));
    steps.push({
      stepId: stepId++, phase, narrative, activeLine: line,
      state: {
        n, sequence: [...seq], k: seq.filter(x => x !== null).length,
        nodes: nextNodes, edges: [...edges], currentNode: currNode,
        results: [...results]
      }
    });
  };

  const statusMap: Record<string, NodeBS['status']> = { 'root': 'active' };
  
  snap("Khởi tạo", `Bắt đầu sinh chuỗi nhị phân độ dài ${n}.`, 1, statusMap, 'root');

  function backtrack(k: number, parentId: string) {
    if (k === n) {
      statusMap[parentId] = 'result';
      results.push([...(seq as number[])]);
      snap("Ghi nhận cấu hình", `Đã điền đủ ${n} phần tử. Cấu hình tìm được: [${seq.join(', ')}]`, 3, statusMap, parentId);
      return;
    }

    for (const val of [0, 1]) {
      seq[k] = val;
      const childId = `${parentId}-${val}`;
      nodes.push({ id: childId, label: String(val), level: k + 1, parent: parentId, status: 'generating' });
      edges.push({ u: parentId, v: childId, label: String(val) });
      statusMap[childId] = 'generating';
      
      snap(`Thử chọn ${val} cho vị trí ${k}`, `Phân nhánh chọn phần tử thứ ${k} (0-indexed) là ${val}`, 6, statusMap, childId);
      
      statusMap[childId] = 'active';
      snap(`Tiến tới nhánh ${val}`, `Gọi đệ quy generate(${k+1})`, 7, statusMap, childId);
      
      backtrack(k + 1, childId);
      
      statusMap[childId] = 'backtracked';
      seq[k] = null;
      snap(`Quay lui khỏi nhánh ${val}`, `Hoàn thành xét nhánh ${val} ở vị trí ${k}. Rút lui (Backtrack)`, 7, statusMap, parentId);
    }
    statusMap[parentId] = 'visited';
  }

  backtrack(0, 'root');
  
  snap("Hoàn thành", `Đã tìm được toàn bộ ${results.length} chuỗi nhị phân.`, 1, statusMap, 'root');

  return steps;
}
