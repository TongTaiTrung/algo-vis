export interface InputMinimizingCoins {
  target: number;
  coins: number[];
}

export interface StateMinimizingCoins {
  dp: number[];
  i: number;
  c: number | null;
  comparing: number[];
  writing: number | null;
  lastBestCoin: number | null;
}

export interface StepMinimizingCoins {
  stepId: number;
  phase: string;
  narrative: string;
  activeLine: number;
  memory: Record<string, string | number>;
  state: StateMinimizingCoins;
}

export const INF_VALUE = 999999;

export function generateTracesMinimizingCoins(input: InputMinimizingCoins): StepMinimizingCoins[] {
  const steps: StepMinimizingCoins[] = [];
  let stepId = 0;

  const target = input.target;
  const coins = [...input.coins].sort((a, b) => a - b);

  const snap = (
    phase: string,
    narrative: string,
    activeLine: number,
    memory: Record<string, string | number>,
    currentState: StateMinimizingCoins
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
        lastBestCoin: currentState.lastBestCoin,
      }
    });
  };

  const dp: number[] = Array(target + 1).fill(INF_VALUE);
  const state: StateMinimizingCoins = {
    dp,
    i: -1,
    c: null,
    comparing: [],
    writing: null,
    lastBestCoin: null
  };

  const memory: Record<string, string | number> = {
    target,
    coins: `[${coins.join(', ')}]`
  };

  snap("Initialization", `Bắt đầu thuật toán CSES Minimizing Coins. Khởi tạo mảng dp có kích thước ${target + 1} với tất cả giá trị ban đầu là vô cực (∞).`, 2, memory, state);

  dp[0] = 0;
  state.dp = [...dp];
  state.writing = 0;
  snap("Base Case", `Đổi số tiền 0 cần đúng 0 đồng xu: gán dp[0] = 0.`, 3, memory, state);
  state.writing = null;

  for (let i = 1; i <= target; i++) {
    state.i = i;
    state.c = null;
    memory['i'] = i;
    snap("Outer Loop - Target", `Vòng lặp ngoài: Đang tìm số đồng xu tối thiểu để đổi lượng tiền i = ${i}.`, 4, memory, state);

    for (const c of coins) {
      state.c = c;
      memory['c'] = c;
      snap("Inner Loop - Check Coin", `Vòng lặp trong: Thử dùng đồng xu mệnh giá c = ${c}.`, 5, memory, state);

      if (i - c >= 0) {
        state.comparing = [i - c];
        snap("Valid Coin Candidate", `Kiểm tra hợp lệ: i - c = ${i} - ${c} = ${i - c} >= 0. Cần xem dp[${i - c}] có thể đổi được không.`, 6, memory, state);

        if (dp[i - c] !== INF_VALUE) {
          const cand = dp[i - c] + 1;
          const old = dp[i];
          if (cand < old) {
            dp[i] = cand;
            state.dp = [...dp];
            state.writing = i;
            state.lastBestCoin = c;
            memory[`dp[${i}]`] = cand;
            snap("Update DP Minimum", `Tìm thấy cách tốt hơn: dp[${i}] = min(${old === INF_VALUE ? '∞' : old}, dp[${i - c}] + 1) = ${cand} (dùng đồng xu mệnh giá ${c}).`, 7, memory, state);
            state.writing = null;
          } else {
            snap("Keep Current Value", `Phương án dùng đồng xu ${c} cho kết quả ${cand}, không tối ưu hơn giá trị hiện tại dp[${i}] = ${old}.`, 7, memory, state);
          }
        } else {
          snap("Unreachable State", `Trạng thái trước dp[${i - c}] là vô cực (không thể tạo được), nên không thể chuyển trạng thái bằng đồng xu ${c}.`, 6, memory, state);
        }
        state.comparing = [];
      } else {
        snap("Coin Too Large", `Đồng xu c = ${c} lớn hơn số tiền cần đổi i = ${i}, bỏ qua.`, 6, memory, state);
      }
    }
  }

  state.i = target;
  state.c = null;
  state.comparing = [target];
  const ans = dp[target] === INF_VALUE ? -1 : dp[target];
  memory['result'] = ans;

  snap("Completed", ans === -1 
    ? `Thuật toán hoàn tất! Không có cách nào để đổi được số tiền ${target} bằng các đồng xu đã cho (-1).` 
    : `Thuật toán hoàn tất! Số đồng xu tối thiểu cần dùng để tạo ra tổng ${target} là ${ans}.`, 8, memory, state);

  return steps;
}
