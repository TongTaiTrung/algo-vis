export interface InputDiceCombinations {
  N: number;
}

export interface StateDice {
  dp: number[];
  i: number;
  j: number;
  comparing: number[];
  writing: number | null;
}

export interface StepDice {
  stepId: number;
  phase: string;
  narrative: string;
  activeLine: number;
  memory: Record<string, string | number>;
  state: StateDice;
}

export const PSEUDOCODE_DICE = [
  "function DiceCombinations(N):",
  "    dp = array(N + 1, 0)",
  "    dp[0] = 1",
  "    for i from 1 to N:",
  "        for j from 1 to 6:",
  "            if i - j >= 0:",
  "                dp[i] = (dp[i] + dp[i - j]) % MOD",
  "    return dp[N]"
];

export function generateTracesDice(input: InputDiceCombinations): StepDice[] {
  const steps: StepDice[] = [];
  let stepId = 0;
  
  const MOD = 1000000007;
  const N = input.N;

  const snap = (
    phase: string,
    narrative: string,
    activeLine: number,
    memory: Record<string, string | number>,
    currentState: StateDice
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
        j: currentState.j,
        comparing: [...currentState.comparing],
        writing: currentState.writing
      }
    });
  };

  const dp: number[] = Array(N + 1).fill(0);
  
  const state: StateDice = {
    dp,
    i: -1,
    j: -1,
    comparing: [],
    writing: null,
  };

  const memory: Record<string, string | number> = { N };
  
  snap("Initialization", `Bắt đầu thuật toán, khởi tạo mảng DP độ dài ${N + 1} với tất cả giá trị ban đầu bằng 0.`, 2, memory, state);
  
  dp[0] = 1;
  state.dp = dp;
  state.writing = 0;
  snap("Base Case", `Gán đỉnh cơ sở dp[0] = 1 (Có 1 cách duy nhất để tạo ra tổng bằng 0 là không tung xúc xắc lần nào).`, 3, memory, state);
  state.writing = null;

  for (let i = 1; i <= N; i++) {
    state.i = i;
    memory['i'] = i;
    snap("Outer Loop - Target Sum", `Vòng lặp ngoài: Đang xét việc tính số cách tạo ra tổng tiền tố i = ${i}.`, 4, memory, state);

    for (let j = 1; j <= 6; j++) {
      state.j = j;
      memory['j'] = j;
      snap("Inner Loop - Dice Value", `Vòng lặp trong: Thử tung xúc xắc ra mặt có giá trị j = ${j}.`, 5, memory, state);
      
      snap("Check if valid throw", `Kiểm tra xem i - j (${i} - ${j}) có >= 0 (Tức là mặt j nhỏ hơn hoặc bằng tổng cần tạo hay không).`, 6, memory, state);
      if (i - j >= 0) {
        state.comparing = [i - j];
        state.writing = i;
        dp[i] = (dp[i] + dp[i - j]) % MOD;
        state.dp = dp;
        snap("Update DP with previous state", `Giá trị hợp lệ. Lấy trước kết quả từ dp[${i - j}] cộng dồn vào dp[${i}]. Ở bước này modulo 10^9+7 để tránh tràn số.`, 7, memory, state);
        state.comparing = [];
        state.writing = null;
      }
    }
  }

  state.comparing = [N];
  state.i = N;
  snap("Completed", `Thuật toán kết thúc! Tổng số cách để tung ra tổng ${N} là ${dp[N]}.`, 8, memory, state);

  return steps;
}
