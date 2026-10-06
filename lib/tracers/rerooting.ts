// Tree Rerooting DP (2-Pass DP on Tree)
// Example: Sum of Distances in Tree (LeetCode 834)

export interface InputRerooting {
  N: number;
  edges: [number, number][];
}

export interface StateRerooting {
  N: number;
  root: number;
  count: number[]; // Subtree node counts
  dp: number[];    // Subtree sum of distances
  ans: number[];   // Final answer for every node as root
  activeNode: number | null;
  passType: 'PASS1_BOTTOM_UP' | 'PASS2_TOP_DOWN' | 'COMPLETE';
}

export interface StepRerooting {
  stepId: number; phase: string; narrative: string; activeLine: number;
  callingLine?: number | number[];
  memory: Record<string, string | number>; state: StateRerooting;
}

export const PSEUDOCODE_REROOTING = [
  "function TreeRerooting(Tree):",
  "    // Pass 1: Bottom-up DFS",
  "    dfs1_bottomUp(u=0, p=-1)",
  "    // Pass 2: Top-down Rerooting",
  "    dfs2_reroot(u=0, p=-1)"
];

export function generateTracesRerooting(input: InputRerooting): StepRerooting[] {
  const steps: StepRerooting[] = [];
  let stepId = 0;
  const N = input.N;

  const adj: number[][] = Array(N).fill(0).map(() => []);
  input.edges.forEach(([u, v]) => {
    adj[u].push(v);
    adj[v].push(u);
  });

  const count = Array(N).fill(1);
  const dp = Array(N).fill(0);
  const ans = Array(N).fill(0);

  const snap = (phase: string, narrative: string, activeLine: number, memory: Record<string, string | number>, st: Partial<StateRerooting>, callingLine?: number | number[]) => {
    steps.push({
      stepId: stepId++, phase, narrative, activeLine, callingLine, memory: { ...memory },
      state: {
        N,
        root: st.root ?? 0,
        count: [...count],
        dp: [...dp],
        ans: [...ans],
        activeNode: st.activeNode ?? null,
        passType: st.passType ?? 'PASS1_BOTTOM_UP'
      }
    });
  };

  const mem: Record<string, string | number> = { N };
  snap("Khởi Tạo Tree Rerooting DP", `Bắt đầu thuật toán 2-Pass Tree Rerooting DP (LeetCode 834 - Tổng khoảng cách tới mọi đỉnh).`, 1, mem, {});

  // Pass 1: Bottom-up
  function dfs1(u: number, p: number) {
    for (const v of adj[u]) {
      if (v !== p) {
        dfs1(v, u);
        count[u] += count[v];
        dp[u] += dp[v] + count[v];
      }
    }
    mem['u'] = u; mem['count_u'] = count[u]; mem['dp_u'] = dp[u];
    snap("Pass 1: Quy Hoạch Động Từ Lá Lên Gốc (Bottom-Up)", `Tính xong cây con u = ${u}: Count[${u}] = ${count[u]}, DP[${u}] = ${dp[u]}.`, 20, mem, { activeNode: u, passType: 'PASS1_BOTTOM_UP' }, 3);
  }

  dfs1(0, -1);
  ans[0] = dp[0];

  // Pass 2: Top-down Rerooting
  function dfs2(u: number, p: number) {
    for (const v of adj[u]) {
      if (v !== p) {
        ans[v] = ans[u] - count[v] + (N - count[v]);
        mem['reroot_from'] = u; mem['reroot_to'] = v; mem['ans_v'] = ans[v];
        snap("Pass 2: Đổi Gốc Cây (Top-Down Rerooting)", `Xoay gốc cây từ ${u} sang ${v}: Ans[${v}] = Ans[${u}] - Count[${v}] + (N - Count[${v}]) = ${ans[v]}.`, 21, mem, { root: v, activeNode: v, passType: 'PASS2_TOP_DOWN' }, 5);
        dfs2(v, u);
      }
    }
  }

  dfs2(0, -1);

  snap("Hoàn Tất Tree Rerooting DP", `Hoàn tất tính toán tổng khoảng cách Ans[u] cho TẤT CẢ các đỉnh làm gốc chỉ trong 2 lượt DFS O(N).`, 5, mem, { passType: 'COMPLETE' });

  return steps;
}
