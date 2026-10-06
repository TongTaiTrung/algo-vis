// Heavy-Light Decomposition (HLD) Tracer

export interface InputHLD {
  N: number;
  edges: [number, number][];
  queryPath: [number, number];
}

export interface StateHLD {
  N: number;
  parent: number[];
  depth: number[];
  heavyChild: number[];
  head: number[];
  pos: number[];
  segArray: number[];
  queryPathNodes: number[];
  queryPathSegments: { l: number; r: number }[];
  activeNode: number | null;
}

export interface StepHLD {
  stepId: number; phase: string; narrative: string; activeLine: number;
  callingLine?: number | number[];
  memory: Record<string, string | number>; state: StateHLD;
}

export const PSEUDOCODE_HLD = [
  "function HLD_Decompose(u):",
  "    dfs1_findHeavyChild(root)",
  "    dfs2_buildChains(root, root)",
  "function queryPath(u, v):",
  "    while head[u] != head[v]:",
  "        if depth[head[u]] < depth[head[v]]: swap(u, v)",
  "        segQuery(pos[head[u]], pos[u])",
  "        u = parent[head[u]]",
  "    segQuery(pos[u], pos[v])"
];

export function generateTracesHLD(input: InputHLD): StepHLD[] {
  const steps: StepHLD[] = [];
  let stepId = 0;
  const N = input.N;

  const adj: number[][] = Array(N).fill(0).map(() => []);
  input.edges.forEach(([u, v]) => {
    adj[u].push(v);
    adj[v].push(u);
  });

  const parent = Array(N).fill(-1);
  const depth = Array(N).fill(0);
  const subtreeSize = Array(N).fill(1);
  const heavyChild = Array(N).fill(-1);
  const head = Array(N).fill(0);
  const pos = Array(N).fill(0);
  let curPos = 0;

  const snap = (phase: string, narrative: string, activeLine: number, memory: Record<string, string | number>, st: Partial<StateHLD>, callingLine?: number | number[]) => {
    steps.push({
      stepId: stepId++, phase, narrative, activeLine, callingLine, memory: { ...memory },
      state: {
        N,
        parent: [...parent],
        depth: [...depth],
        heavyChild: [...heavyChild],
        head: [...head],
        pos: [...pos],
        segArray: Array.from({ length: N }).map((_, i) => pos.indexOf(i)),
        queryPathNodes: st.queryPathNodes ? [...st.queryPathNodes] : [],
        queryPathSegments: st.queryPathSegments ? [...st.queryPathSegments] : [],
        activeNode: st.activeNode ?? null
      }
    });
  };

  const mem: Record<string, string | number> = { N };
  snap("Khởi Tạo HLD", `Bắt đầu Phân Rã Cây Nặng - Nhẹ (Heavy-Light Decomposition) trên Cây ${N} đỉnh.`, 1, mem, {});

  // DFS 1: Calculate sizes, depths, and heavy children
  function dfs1(u: number, p: number, d: number) {
    parent[u] = p;
    depth[u] = d;
    let maxSub = 0;
    for (const v of adj[u]) {
      if (v !== p) {
        dfs1(v, u, d + 1);
        subtreeSize[u] += subtreeSize[v];
        if (subtreeSize[v] > maxSub) {
          maxSub = subtreeSize[v];
          heavyChild[u] = v;
        }
      }
    }
  }

  snap("DFS 1: Đang duyệt tìm cạnh nặng", "dfs1_findHeavyChild(0): Bắt đầu DFS từ root để tính kích thước cây con và tìm Heavy Child.", 20, mem, {}, 2);
  dfs1(0, -1, 0);
  snap("DFS 1: Xác Định Cạnh Nặng (Heavy Edges)", `Đã tính toán kích thước cây con và chọn Cạnh Nặng (Heavy Child) có subtree lớn nhất cho mỗi đỉnh. Cạnh Nặng sẽ nối chuỗi liên tiếp.`, 2, mem, {});

  // DFS 2: Build Heavy Chains and Segment Tree positions
  function dfs2(u: number, h: number) {
    head[u] = h;
    pos[u] = curPos++;
    
    if (heavyChild[u] !== -1) {
      dfs2(heavyChild[u], h); // Continue heavy chain
    }
    for (const v of adj[u]) {
      if (v !== parent[u] && v !== heavyChild[u]) {
        dfs2(v, v); // Start new light chain
      }
    }
  }

  snap("DFS 2: Đang xây dựng chuỗi heavy chains", "dfs2_buildChains(0, 0): Trải phẳng chuỗi nặng để xếp liên tiếp trên mảng Segment Tree.", 22, mem, {}, 3);
  dfs2(0, 0);
  snap("DFS 2: Trải Phẳng Thành Chuỗi 1D", `Đã đánh số vị trí pos[u] trải phẳng mảng 1D cho Segment Tree. Các chuỗi Nặng (Heavy Chains) được xếp liên tiếp trên mảng!`, 3, mem, {});

  // Query Path
  const [startU, startV] = input.queryPath;
  let u = startU;
  let v = startV;
  const pathNodes: number[] = [];
  const pathSegments: { l: number; r: number }[] = [];

  mem['query_u'] = startU; mem['query_v'] = startV;
  snap(`Truy Vấn Đường Đi Tree Path (${startU} -> ${startV})`, `Bắt đầu nhảy trên các đầu chuỗi Head[u] để biến đổi đường đi Cây thành các đoạn 1D trên Segment Tree...`, 4, mem, { queryPathNodes: pathNodes, queryPathSegments: pathSegments });

  while (head[u] !== head[v]) {
    if (depth[head[u]] < depth[head[v]]) {
      const tmp = u; u = v; v = tmp;
    }
    const hU = head[u];
    const l = Math.min(pos[hU], pos[u]);
    const r = Math.max(pos[hU], pos[u]);
    pathSegments.push({ l, r });
    pathNodes.push(u);

    snap("Nhảy Qua Chuỗi Heavy Chain", `Nhảy từ ${u} lên Head[${u}] = ${hU}. Truy vấn đoạn Segment Tree [pos:${l}..pos:${r}] trong O(log N).`, 7, mem, { activeNode: u, queryPathNodes: pathNodes, queryPathSegments: pathSegments });
    u = parent[hU];
  }

  const l = Math.min(pos[u], pos[v]);
  const r = Math.max(pos[u], pos[v]);
  pathSegments.push({ l, r });
  pathNodes.push(u); pathNodes.push(v);

  snap("Gặp Cùng Chuỗi Chain - Hoàn Tất", `Cả 2 đỉnh đã về chung một chuỗi Head[${head[u]}]. Truy vấn đoạn cuối cùng trên Segment Tree [pos:${l}..pos:${r}].`, 9, mem, { queryPathNodes: pathNodes, queryPathSegments: pathSegments });

  return steps;
}
