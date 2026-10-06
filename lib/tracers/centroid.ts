export interface CNode {
  id: string;
  x: number;
  y: number;
}

export interface CEdge {
  u: string;
  v: string;
}

export interface InputCentroid {
  nodes: CNode[];
  edges: CEdge[];
}

export interface StateCentroid {
  sz: Record<string, number>;
  isRemoved: Record<string, boolean>;
  centroidTreeEdges: { p: string; c: string }[];
  activeComponent: Record<string, boolean>;
  currentNode: string | null;
  comparingNode: string | null;
  currentTotal: number | null;
  centroidLevels: Record<string, number>;
}

export interface StepCentroid {
  stepId: number;
  phase: string;
  narrative: string;
  activeLine: number;
  callingLine?: number | number[];
  memory: Record<string, string | number>;
  state: StateCentroid;
}

export const PSEUDOCODE_CENTROID = [
  "function solve(entry, parentCentroid, level):",
  "    get_sizes(entry, -1) // Tính quy mô (size) nhánh",
  "    total = sz[entry]",
  "    centroid = get_centroid(entry, -1, total)",
  "    is_removed[centroid] = true // Xóa trọng tâm khỏi cây gốc",
  "    centroid_levels[centroid] = level",
  "    if parentCentroid != -1:",
  "        centroid_tree.add_edge(parentCentroid, centroid)",
  "    for each neighbor v of centroid:",
  "        if not is_removed[v]:",
  "            solve(v, centroid, level + 1)"
];

export function generateTracesCentroid(input: InputCentroid): StepCentroid[] {
  const steps: StepCentroid[] = [];
  let stepId = 0;

  const adj: Record<string, string[]> = {};
  input.nodes.forEach(n => { adj[n.id] = []; });
  input.edges.forEach(e => {
    adj[e.u].push(e.v);
    adj[e.v].push(e.u);
  });

  const state: StateCentroid = {
    sz: {},
    isRemoved: {},
    centroidTreeEdges: [],
    activeComponent: {},
    currentNode: null,
    comparingNode: null,
    currentTotal: null,
    centroidLevels: {},
  };

  const snap = (phase: string, narrative: string, activeLine: number, memory: Record<string, string | number>, callingLine?: number | number[]) => {
    steps.push({
      stepId: stepId++,
      phase,
      narrative,
      activeLine,
      callingLine,
      memory: { ...memory },
      state: {
        sz: { ...state.sz },
        isRemoved: { ...state.isRemoved },
        centroidTreeEdges: [...state.centroidTreeEdges],
        activeComponent: { ...state.activeComponent },
        currentNode: state.currentNode,
        comparingNode: state.comparingNode,
        currentTotal: state.currentTotal,
        centroidLevels: { ...state.centroidLevels },
      }
    });
  };

  const memory: Record<string, string | number> = {};

  const get_active_component = (u: string, p: string) => {
    state.activeComponent[u] = true;
    for (const v of adj[u]) {
      if (v !== p && !state.isRemoved[v]) {
        get_active_component(v, u);
      }
    }
  };

  const get_sizes = (u: string, p: string, m: typeof memory) => {
    state.sz[u] = 1;
    state.currentNode = u;
    m['dfs_u'] = u;
    snap("DFS getSizes: Gán sz[u] = 1", `Đang chạy bên trong getSizes(${u}): Khởi tạo kích thước ban đầu = 1.`, 20, m, 2);

    for (const v of adj[u]) {
      if (v !== p && !state.isRemoved[v]) {
        get_sizes(v, u, m);
        state.sz[u] += state.sz[v];
        state.currentNode = u;
        m['dfs_u'] = u;
        snap(`DFS getSizes: Cộng dồn size con ${v}`, `Cộng dồn kích thước cây con ${v} vào sz[${u}]. Tổng hiện tại = ${state.sz[u]}.`, 21, m, 2);
      }
    }
  };

  const get_centroid = (u: string, p: string, total: number, m: typeof memory): string => {
    state.currentNode = u;
    m['search_u'] = u;
    snap("Check node getCentroid", `Đang chạy bên trong getCentroid(${u}): Kiểm tra xem có nhánh con nào vượt quá total/2 (${total / 2}) hay không.`, 22, m, 4);

    for (const v of adj[u]) {
      if (v !== p && !state.isRemoved[v]) {
        state.comparingNode = v;
        m['child_v'] = v;
        m['child_sz'] = state.sz[v];
        snap(`getCentroid: Kiểm tra nhánh con ${v}`, `Xem nhánh ${v} (size=${state.sz[v]}) có nặng hơn total/2 (${total / 2}) không.`, 22, m, 4);
        
        if (state.sz[v] > total / 2) {
          state.comparingNode = null;
          snap(`getCentroid: Di chuyển tới heavy child ${v}`, `Nhánh ${v} quá nặng (> ${total / 2}). Nhảy tiếp vào ${v}...`, 22, m, 4);
          return get_centroid(v, u, total, m);
        }
      }
    }
    state.comparingNode = null;
    snap(`getCentroid: Xác định trọng tâm`, `Không có nhánh con nào vượt quá nửa kích thước! Đỉnh ${u} chính là trọng tâm (Centroid).`, 23, m, 4);
    return u;
  };

  const solve = (entry: string, parentCentroid: string | null, level: number) => {
    state.activeComponent = {};
    get_active_component(entry, "");
    
    // Create isolated memory map for this recursion scope
    const m: typeof memory = { entry, parent: parentCentroid || "None", level };
    
    state.currentNode = entry;
    snap("Bắt đầu giải phân rã", "Bắt đầu hàm solve: Tìm trọng tâm cho thành phần liên thông hiện tại.", 1, m);

    // Xóa size ảo cũ
    for (const k of Object.keys(state.sz)) { state.sz[k] = 0; }

    get_sizes(entry, "", m);
    
    const total = state.sz[entry];
    state.currentTotal = total;
    m['total'] = total;
    snap("Lấy tổng Kích thước", "Lấy kích thước tổng của cả nhánh từ mảng size vừa được DFS.", 3, m);

    const centroid = get_centroid(entry, "", total, m);
    m['centroid'] = centroid;
    state.currentNode = centroid;
    snap(`Tìm thấy Trọng tâm`, `Xác nhận Trọng tâm (Centroid): ${centroid}.`, 4, m);

    state.isRemoved[centroid] = true;
    state.centroidLevels[centroid] = level;
    snap("Tách (Remove) Trọng tâm", "Tách hủy đỉnh này bằng cờ isRemoved. Nó sẽ biến khỏi các cuộc tìm kiếm sau.", 5, m);

    if (parentCentroid !== null) {
      state.centroidTreeEdges.push({ p: parentCentroid, c: centroid });
      snap(`Nối Centroid Tree`, `Tạo liên kết trong Cây Trọng Tâm (Centroid Tree).`, 8, m);
    }

    state.currentNode = null;
    state.currentTotal = null;
    state.activeComponent = {}; // Clear active component visualization during recursion loop transitions

    for (const v of adj[centroid]) {
      if (!state.isRemoved[v]) {
        m['next_v'] = v;
        snap(`Chuẩn bị đệ quy nhánh ${v}`, `Chuyển qua thành phần liên thông tiếp theo.`, 11, m);
        solve(v, centroid, level + 1);
      }
    }
  };

  snap("Khởi tạo", "Sẵn sàng phân rã.", 1, memory);
  solve(input.nodes[0].id, null, 0);
  
  state.currentNode = null;
  state.comparingNode = null;
  state.activeComponent = {};
  snap("Hoàn tất", "Đã phân rã toàn bộ.", 11, memory);

  return steps;
}
