export interface InputCoinCombinations2 {
  target: number;
  coins: number[];
}

export interface StateCoinCombinations2 {
  dp: number[];
  c: number | null;
  coinIndex: number;
  i: number;
  comparing: number[];
  writing: number | null;
}

export interface StepCoinCombinations2 {
  stepId: number;
  phase: string;
  narrative: string;
  activeLine: number;
  memory: Record<string, string | number>;
  state: StateCoinCombinations2;
}

export function generateTracesCoinCombinations2(input: InputCoinCombinations2): StepCoinCombinations2[] {
  const steps: StepCoinCombinations2[] = [];
  let stepId = 0;

  const MOD = 1000000007;
  const target = input.target;
  const coins = [...input.coins].sort((a, b) => a - b);

  const snap = (
    phase: string,
    narrative: string,
    activeLine: number,
    memory: Record<string, string | number>,
    currentState: StateCoinCombinations2
  ) => {
    steps.push({
      stepId: stepId++,
      phase,
      narrative,
      activeLine,
      memory: { ...memory },
      state: {
        dp: [...currentState.dp],
        c: currentState.c,
        coinIndex: currentState.coinIndex,
        i: currentState.i,
        comparing: [...currentState.comparing],
        writing: currentState.writing,
      }
    });
  };

  const dp: number[] = Array(target + 1).fill(0);
  const state: StateCoinCombinations2 = {
    dp,
    c: null,
    coinIndex: -1,
    i: -1,
    comparing: [],
    writing: null,
  };

  const memory: Record<string, string | number> = {
    target,
    coins: `[${coins.join(', ')}]`
  };

  snap("Initialization", `Bắt đầu CSES Coin Combinations II (Tập hợp không xét thứ tự - Combinations). Khởi tạo mảng dp kích thước ${target + 1} toàn số 0.`, 2, memory, state);

  dp[0] = 1;
  state.dp = [...dp];
  state.writing = 0;
  snap("Base Case", `Đổi 0 đồng luôn có đúng 1 cách: dp[0] = 1.`, 3, memory, state);
  state.writing = null;

  for (let idx = 0; idx < coins.length; idx++) {
    const c = coins[idx];
    state.c = c;
    state.coinIndex = idx;
    memory['activeCoin'] = c;
    snap("Outer Loop - Coin Selection", `VÒNG NGOÀI: Cố định đồng xu c = ${c}. Mọi tổ hợp từ bước này chỉ được dùng đồng xu ${c} kết hợp với các đồng xu đã xét trước đó, đảm bảo KHÔNG bị trùng lặp thứ tự.`, 4, memory, state);

    for (let i = c; i <= target; i++) {
      state.i = i;
      memory['i'] = i;
      state.comparing = [i - c];
      snap("Inner Loop - Target i", `Vòng trong: Cập nhật dp[${i}] từ dp[${i - c}] bằng cách thêm vào 1 đồng xu mệnh giá ${c}.`, 5, memory, state);

      state.writing = i;
      const prevWays = dp[i];
      dp[i] = (dp[i] + dp[i - c]) % MOD;
      state.dp = [...dp];
      memory[`dp[${i}]`] = dp[i];
      snap("Update DP State", `dp[${i}] = (dp[${i}] + dp[${i - c}]) % MOD = (${prevWays} + ${dp[i - c]}) % MOD = ${dp[i]}.`, 6, memory, state);

      state.comparing = [];
      state.writing = null;
    }
  }

  state.c = null;
  state.i = target;
  state.comparing = [target];
  memory['result'] = dp[target];

  snap("Completed", `Thuật toán hoàn tất! Tổng số tổ hợp phân biệt (không quan tâm thứ tự) để tạo ra ${target} là ${dp[target]}.`, 7, memory, state);

  return steps;
}
