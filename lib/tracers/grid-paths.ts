export interface InputGridPaths {
  n: number;
  grid: string[];
}

export interface StateGridPaths {
  dp: number[][];
  r: number;
  c: number;
  grid: string[];
  fromTop: { r: number; c: number } | null;
  fromLeft: { r: number; c: number } | null;
  writing: { r: number; c: number } | null;
  isTrap: boolean;
}

export interface StepGridPaths {
  stepId: number;
  phase: string;
  narrative: string;
  activeLine: number;
  memory: Record<string, string | number>;
  state: StateGridPaths;
}

export function generateTracesGridPaths(input: InputGridPaths): StepGridPaths[] {
  const steps: StepGridPaths[] = [];
  let stepId = 0;

  const MOD = 1000000007;
  const n = input.n;
  const grid = input.grid;

  const snap = (
    phase: string,
    narrative: string,
    activeLine: number,
    memory: Record<string, string | number>,
    currentState: StateGridPaths
  ) => {
    steps.push({
      stepId: stepId++,
      phase,
      narrative,
      activeLine,
      memory: { ...memory },
      state: {
        dp: currentState.dp.map(row => [...row]),
        r: currentState.r,
        c: currentState.c,
        grid: [...currentState.grid],
        fromTop: currentState.fromTop ? { ...currentState.fromTop } : null,
        fromLeft: currentState.fromLeft ? { ...currentState.fromLeft } : null,
        writing: currentState.writing ? { ...currentState.writing } : null,
        isTrap: currentState.isTrap,
      }
    });
  };

  const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  const state: StateGridPaths = {
    dp,
    r: -1,
    c: -1,
    grid,
    fromTop: null,
    fromLeft: null,
    writing: null,
    isTrap: false
  };

  const memory: Record<string, string | number> = { n };

  snap("Initialization", `Bắt đầu CSES Grid Paths I. Khởi tạo bảng dp kích thước ${n}x${n} toàn số 0.`, 2, memory, state);

  if (grid[0][0] === '*') {
    snap("Trap at Start", `Ô xuất phát (0, 0) là bẫy '*', không thể di chuyển đi đâu: dp[0][0] = 0.`, 3, memory, state);
  } else {
    dp[0][0] = 1;
    state.dp = dp.map(row => [...row]);
    state.writing = { r: 0, c: 0 };
    snap("Base Case", `Ô xuất phát (0, 0) an toàn: có đúng 1 cách xuất phát dp[0][0] = 1.`, 3, memory, state);
    state.writing = null;
  }

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (r === 0 && c === 0) continue;

      state.r = r;
      state.c = c;
      state.fromTop = null;
      state.fromLeft = null;
      memory['row'] = r;
      memory['col'] = c;

      if (grid[r][c] === '*') {
        state.isTrap = true;
        dp[r][c] = 0;
        state.dp = dp.map(row => [...row]);
        state.writing = { r, c };
        snap("Cell is Trap", `Ô (${r}, ${c}) là bẫy '*', không thể bước vào: dp[${r}][${c}] = 0.`, 6, memory, state);
        state.writing = null;
        state.isTrap = false;
        continue;
      }

      state.isTrap = false;
      let topWays = 0;
      let leftWays = 0;

      if (r > 0) {
        state.fromTop = { r: r - 1, c };
        topWays = dp[r - 1][c];
      }
      if (c > 0) {
        state.fromLeft = { r, c: c - 1 };
        leftWays = dp[r][c - 1];
      }

      snap("Inspect Predecessors", `Đang tính ô (${r}, ${c}): có thể đi từ ô trên (${r > 0 ? `${r-1}, ${c}` : 'ngoài lưới'}) và ô trái (${c > 0 ? `${r}, ${c-1}` : 'ngoài lưới'}).`, 5, memory, state);

      dp[r][c] = (topWays + leftWays) % MOD;
      state.dp = dp.map(row => [...row]);
      state.writing = { r, c };
      memory[`dp[${r}][${c}]`] = dp[r][c];

      snap("Update Path Count", `dp[${r}][${c}] = (dp[trên] + dp[trái]) % MOD = (${topWays} + ${leftWays}) % MOD = ${dp[r][c]}.`, 7, memory, state);

      state.writing = null;
      state.fromTop = null;
      state.fromLeft = null;
    }
  }

  state.r = n - 1;
  state.c = n - 1;
  state.writing = { r: n - 1, c: n - 1 };
  memory['result'] = dp[n - 1][n - 1];

  snap("Completed", `Thuật toán hoàn tất! Tổng số đường đi an toàn từ (0, 0) đến (${n-1}, ${n-1}) là ${dp[n - 1][n - 1]}.`, 9, memory, state);

  return steps;
}
