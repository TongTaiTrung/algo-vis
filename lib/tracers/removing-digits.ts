export interface InputRemovingDigits {
  N: number;
}

export interface StateRemovingDigits {
  dp: number[];
  i: number;
  digits: number[];
  activeDigit: number | null;
  comparing: number[];
  writing: number | null;
  bestTransitions: (number | null)[]; // bestDigit for each index
  currentPath: number[]; // path from N to 0 reconstructed so far
}

export interface StepRemovingDigits {
  stepId: number;
  phase: string;
  narrative: string;
  activeLine: number;
  memory: Record<string, string | number>;
  state: StateRemovingDigits;
}

export const INF_VALUE = 999999;

export function generateTracesRemovingDigits(input: InputRemovingDigits): StepRemovingDigits[] {
  const steps: StepRemovingDigits[] = [];
  let stepId = 0;

  const N = Math.min(Math.max(input.N, 1), 100);

  const dp: number[] = Array(N + 1).fill(INF_VALUE);
  const bestTransitions: (number | null)[] = Array(N + 1).fill(null);

  const snap = (
    phase: string,
    narrative: string,
    activeLine: number,
    memory: Record<string, string | number>,
    currentState: StateRemovingDigits
  ) => {
    steps.push({
      stepId: stepId++,
      phase,
      narrative,
      activeLine,
      memory: { ...memory },
      state: {
        dp: [...currentState.dp],
        i: currentState.i,
        digits: [...currentState.digits],
        activeDigit: currentState.activeDigit,
        comparing: [...currentState.comparing],
        writing: currentState.writing,
        bestTransitions: [...currentState.bestTransitions],
        currentPath: [...currentState.currentPath]
      }
    });
  };

  const state: StateRemovingDigits = {
    dp,
    i: -1,
    digits: [],
    activeDigit: null,
    comparing: [],
    writing: null,
    bestTransitions,
    currentPath: []
  };

  const memory: Record<string, string | number> = { N };

  snap("Initialization", `Bắt đầu thuật toán CSES Removing Digits. Khởi tạo mảng dp độ dài ${N + 1} với tất cả giá trị ban đầu là vô cực (∞).`, 2, memory, state);

  dp[0] = 0;
  state.dp = [...dp];
  state.writing = 0;
  snap("Base Case", `Đưa số 0 về 0 cần 0 bước: dp[0] = 0.`, 3, memory, state);
  state.writing = null;

  for (let i = 1; i <= N; i++) {
    state.i = i;
    memory['i'] = i;

    // Extract unique non-zero digits
    const digits = Array.from(new Set(String(i).split('').map(Number).filter(d => d > 0)));
    state.digits = digits;
    state.activeDigit = null;
    memory['digits'] = `[${digits.join(', ')}]`;

    snap("Outer Loop - Number i", `Xét số hiện tại i = ${i}. Các chữ số khác không có thể trừ: [${digits.join(', ')}].`, 4, memory, state);

    for (const d of digits) {
      state.activeDigit = d;
      memory['digit'] = d;
      state.comparing = [i - d];

      snap("Inspect Digit", `Thử trừ chữ số d = ${d}: i - d = ${i} - ${d} = ${i - d}.`, 5, memory, state);

      if (dp[i - d] !== INF_VALUE) {
        const candidate = dp[i - d] + 1;
        const current = dp[i];
        if (candidate < current) {
          dp[i] = candidate;
          state.dp = [...dp];
          bestTransitions[i] = d;
          state.bestTransitions = [...bestTransitions];
          state.writing = i;
          memory[`dp[${i}]`] = candidate;

          snap("Update Minimum Steps", `Tìm thấy số bước ít hơn: dp[${i}] = min(${current === INF_VALUE ? '∞' : current}, dp[${i - d}] + 1) = ${candidate} (trừ chữ số ${d}).`, 7, memory, state);
          state.writing = null;
        } else {
          snap("Candidate Not Optimal", `Trừ chữ số ${d} cần ${candidate} bước, không tốt hơn giá trị hiện tại dp[${i}] = ${current}.`, 6, memory, state);
        }
      }

      state.comparing = [];
    }
  }

  // Reconstruct path from N down to 0
  const path: number[] = [N];
  let curr = N;
  while (curr > 0 && bestTransitions[curr] !== null) {
    const d = bestTransitions[curr]!;
    curr -= d;
    path.push(curr);
  }
  state.currentPath = path;
  state.i = N;
  state.activeDigit = null;
  state.comparing = [N];
  memory['result'] = dp[N];
  memory['path'] = path.join(' → ');

  snap("Completed", `Thuật toán hoàn tất! Số bước tối thiểu để đưa ${N} về 0 là ${dp[N]}. Chuỗi biến đổi tối ưu: ${path.join(' → ')}.`, 8, memory, state);

  return steps;
}
