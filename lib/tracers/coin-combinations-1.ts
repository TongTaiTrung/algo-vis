export interface InputCoinCombinations1 {
  target: number;
  coins: number[];
}

export interface StateCoinCombinations1 {
  dp: number[];
  i: number;
  c: number | null;
  comparing: number[];
  writing: number | null;
}

export interface StepCoinCombinations1 {
  stepId: number;
  phase: string;
  narrative: string;
  activeLine: number;
  memory: Record<string, string | number>;
  state: StateCoinCombinations1;
}

export function generateTracesCoinCombinations1(input: InputCoinCombinations1): StepCoinCombinations1[] {
  const steps: StepCoinCombinations1[] = [];
  let stepId = 0;

  const MOD = 1000000007;
  const target = input.target;
  const coins = [...input.coins].sort((a, b) => a - b);

  const snap = (
    phase: string,
    narrative: string,
    activeLine: number,
    memory: Record<string, string | number>,
    currentState: StateCoinCombinations1
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
        c: currentState.c,
        comparing: [...currentState.comparing],
        writing: currentState.writing,
      }
    });
  };

  const dp: number[] = Array(target + 1).fill(0);
  const state: StateCoinCombinations1 = {
    dp,
    i: -1,
    c: null,
    comparing: [],
    writing: null,
  };

  const memory: Record<string, string | number> = {
    target,
    coins: `[${coins.join(', ')}]`
  };

  snap("Initialization", `Bắt đầu CSES Coin Combinations I (Thứ tự đồng xu quan trọng - Permutations). Khởi tạo mảng dp kích thước ${target + 1} toàn số 0.`, 2, memory, state);

  dp[0] = 1;
  state.dp = [...dp];
  state.writing = 0;
  snap("Base Case", `Đổi tổng bằng 0 có duy nhất 1 cách (không chọn đồng xu nào): dp[0] = 1.`, 3, memory, state);
  state.writing = null;

  for (let i = 1; i <= target; i++) {
    state.i = i;
    state.c = null;
    memory['i'] = i;
    snap("Outer Loop - Target Sum", `Vòng ngoài: Đang tính số cách tạo tổng i = ${i}. Vì vòng ngoài là tổng tiền tố nên thứ tự xuất hiện của các đồng xu được tính là các cách khác nhau.`, 4, memory, state);

    for (const c of coins) {
      state.c = c;
      memory['c'] = c;
      snap("Inner Loop - Check Coin", `Vòng trong: Xét đồng xu mệnh giá c = ${c}.`, 5, memory, state);

      if (i - c >= 0) {
        state.comparing = [i - c];
        snap("Valid Transition", `Kiểm tra i - c >= 0: ${i} - ${c} = ${i - c} >= 0. Lấy số cách từ dp[${i - c}] để cộng dồn vào dp[${i}].`, 6, memory, state);

        state.writing = i;
        const prevWays = dp[i];
        dp[i] = (dp[i] + dp[i - c]) % MOD;
        state.dp = [...dp];
        memory[`dp[${i}]`] = dp[i];
        snap("Update DP State", `dp[${i}] = (dp[${i}] + dp[${i - c}]) % MOD = (${prevWays} + ${dp[i - c]}) % MOD = ${dp[i]}.`, 7, memory, state);

        state.comparing = [];
        state.writing = null;
      } else {
        snap("Coin Exceeds Sum", `Đồng xu c = ${c} lớn hơn tổng i = ${i}, không thể chọn làm đồng xu cuối cùng.`, 6, memory, state);
      }
    }
  }

  state.i = target;
  state.c = null;
  state.comparing = [target];
  memory['result'] = dp[target];

  snap("Completed", `Thuật toán hoàn tất! Tổng số cách có tính thứ tự để tạo ra số tiền ${target} là ${dp[target]}.`, 8, memory, state);

  return steps;
}
