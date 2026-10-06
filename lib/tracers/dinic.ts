// Dinic's Algorithm for Max Flow
export interface InputDinic {
  N: number;
  source: number;
  sink: number;
  edges: { u: number; v: number; cap: number }[];
}

export interface DinicEdge {
  u: number;
  v: number;
  cap: number;
  flow: number;
  revIdx: number;
}

export interface StateDinic {
  N: number;
  source: number;
  sink: number;
  edges: DinicEdge[];
  level: number[];
  activeNode: number | null;
  activePath: number[];
  maxFlow: number;
  phaseType: 'BFS_LEVEL' | 'DFS_AUGMENT' | 'COMPLETE';
}

export interface StepDinic {
  stepId: number; phase: string; narrative: string; activeLine: number;
  callingLine?: number | number[];
  memory: Record<string, string | number>; state: StateDinic;
}

export const PSEUDOCODE_DINIC = [
  "function Dinic(S, T):",
  "    maxFlow = 0",
  "    while BFS_BuildLevelGraph(S, T):",
  "        while flow = DFS_SendFlow(S, T, INF):",
  "            maxFlow += flow",
  "    return maxFlow"
];

export function generateTracesDinic(input: InputDinic): StepDinic[] {
  const steps: StepDinic[] = [];
  let stepId = 0;
  const { N, source, sink } = input;

  const edgeList: DinicEdge[] = [];
  const adj: number[][] = Array(N).fill(0).map(() => []);

  input.edges.forEach(({ u, v, cap }) => {
    const idx1 = edgeList.length;
    const idx2 = idx1 + 1;
    edgeList.push({ u, v, cap, flow: 0, revIdx: idx2 });
    edgeList.push({ u: v, v: u, cap: 0, flow: 0, revIdx: idx1 }); // residual back edge
    adj[u].push(idx1);
    adj[v].push(idx2);
  });

  const level = Array(N).fill(-1);
  let maxFlow = 0;

  const snap = (phase: string, narrative: string, activeLine: number, memory: Record<string, string | number>, st: Partial<StateDinic>, callingLine?: number | number[]) => {
    steps.push({
      stepId: stepId++, phase, narrative, activeLine, callingLine, memory: { ...memory },
      state: {
        N, source, sink,
        edges: edgeList.map(e => ({ ...e })),
        level: [...level],
        activeNode: st.activeNode ?? null,
        activePath: st.activePath ? [...st.activePath] : [],
        maxFlow,
        phaseType: st.phaseType ?? 'BFS_LEVEL'
      }
    });
  };

  const mem: Record<string, string | number> = { S: source, T: sink };
  snap("Khởi Tạo Thuật Toán Dinic", `Bắt đầu thuật toán Dinic tìm Luồng cực đại từ S = ${source} đến T = ${sink}. Đồ thị gồm ${N} đỉnh và ${input.edges.length} cạnh có hướng.`, 1, mem, { phaseType: 'BFS_LEVEL' });

  function bfs(): boolean {
    level.fill(-1);
    level[source] = 0;
    const q = [source];
    snap("BFS: Khởi tạo Level Graph", `while (bfs()): Bắt đầu chạy BFS từ nguồn S = ${source}. Gán level[${source}] = 0 và đẩy vào hàng đợi queue.`, 10, mem, { phaseType: 'BFS_LEVEL', activeNode: source }, 3);

    while (q.length > 0 && stepId < MAX_STEPS) {
      const u = q.shift()!;
      snap("BFS: Lấy đỉnh khỏi hàng đợi", `BFS dequeue đỉnh u = ${u} (tầng ${level[u]}). Chuẩn bị duyệt các cạnh kề u -> v còn dung lượng dư...`, 11, mem, { phaseType: 'BFS_LEVEL', activeNode: u }, 3);

      for (const eIdx of adj[u]) {
        const e = edgeList[eIdx];
        if (e.cap - e.flow > 0 && level[e.v] === -1) {
          level[e.v] = level[u] + 1;
          q.push(e.v);
          snap("BFS: Phân tầng & Thêm vào hàng đợi", `Cạnh ${u} -> ${e.v} còn dư (${e.cap - e.flow}). Phân tầng level[${e.v}] = ${level[e.v]} và đẩy ${e.v} vào queue!`, 12, mem, { phaseType: 'BFS_LEVEL', activeNode: e.v }, 3);
        }
      }
    }
    const reachedSink = level[sink] !== -1;
    snap("BFS: Hoàn tất đồ thị phân tầng", reachedSink ? `Đỉnh đích T = ${sink} đã được gán tầng (${level[sink]})! Tồn tại đường tăng luồng.` : `Không thể tìm đường tới đỉnh đích T = ${sink}. Đồ thị phân tầng kết thúc.`, 13, mem, { phaseType: 'BFS_LEVEL' }, 3);
    return reachedSink;
  }

  function dfs(u: number, pushed: number, path: number[]): number {
    if (pushed === 0 || u === sink) {
      snap("DFS: Kiểm tra điều kiện dừng", u === sink ? `Đã chạm đích T = ${sink}! Luồng gửi = ${pushed}.` : "Luồng còn lại = 0.", 20, mem, { activeNode: u, activePath: path, phaseType: 'DFS_AUGMENT' }, 4);
      return pushed;
    }

    for (const eIdx of adj[u]) {
      const e = edgeList[eIdx];
      if (level[e.v] === level[u] + 1 && e.cap - e.flow > 0) {
        path.push(e.v);
        snap("DFS Tìm Đường Tăng Luồng", `Thử đẩy luồng qua cạnh ${u} -> ${e.v} (Khả dụng: ${e.cap - e.flow}). Đệ quy gọi DFS(${e.v}, min(${pushed}, ${e.cap - e.flow}))...`, 21, mem, { activeNode: e.v, activePath: path, phaseType: 'DFS_AUGMENT' }, 4);
        
        const tr = dfs(e.v, Math.min(pushed, e.cap - e.flow), path);
        if (tr === 0) {
          path.pop();
          continue;
        }

        e.flow += tr;
        edgeList[e.revIdx].flow -= tr;
        snap("DFS: Tăng luồng thành công", `Cập nhật dòng luồng trên cạnh ${u} -> ${e.v} tăng thêm ${tr}. Cập nhật cạnh nghịch ${e.v} -> ${u}.`, 22, mem, { activeNode: u, activePath: path, phaseType: 'DFS_AUGMENT' }, 4);
        return tr;
      }
    }
    return 0;
  }

  const MAX_STEPS = 600;
  while (bfs() && stepId < MAX_STEPS) {
    snap("Đã dựng Level Graph thành công", `Level Graph sẵn sàng! Khoảng cách tới T là Level[${sink}] = ${level[sink]}. Bắt đầu vòng lặp DFS tăng luồng.`, 3, mem, { phaseType: 'BFS_LEVEL' });

    while (stepId < MAX_STEPS) {
      const path = [source];
      const pushed = dfs(source, Infinity, path);
      if (pushed === 0) break;

      maxFlow += pushed;
      mem['max_flow'] = maxFlow;
      snap("Tăng Luồng Thành Công! 🎉", `Tìm thấy đường tăng luồng hoàn chỉnh ${path.join(' -> ')} với lượng luồng bơm thêm = ${pushed}. Tổng Luồng hiện tại = ${maxFlow}.`, 5, mem, { activePath: path, phaseType: 'DFS_AUGMENT' });
    }
  }

  snap("Thuật Toán Dinic Hoàn Tất", `Không thể phân tầng BFS tới T nữa (Level Graph nghẽn). Kết quả Luồng Cực Đại (Max Flow) = ${maxFlow}.`, 6, mem, { phaseType: 'COMPLETE' });

  return steps;
}
