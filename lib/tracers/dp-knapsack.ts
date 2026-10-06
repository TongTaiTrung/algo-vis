export interface DPItem {
  weight: number;
  value: number;
}

export interface InputDP {
  items: DPItem[];
  capacity: number;
}

export interface StateDP {
  dp: number[][];
  r: number;
  c: number;
  comparing: { r: number; c: number }[];
  writing: { r: number; c: number } | null;
}

export interface StepDP {
  stepId: number;
  phase: string;
  narrative: string;
  activeLine: number;
  memory: Record<string, string | number>;
  state: StateDP;
}

export const PSEUDOCODE_DP = [
  "function Knapsack(items, W):",
  "    dp = matrix(items.length + 1, W + 1, 0)",
  "    for i from 1 to items.length:",
  "        for w from 1 to W:",
  "            if items[i].weight <= w:",
  "                take = dp[i-1][w-items[i].weight] + items[i].value",
  "                skip = dp[i-1][w]",
  "                dp[i][w] = max(take, skip)",
  "            else:",
  "                dp[i][w] = dp[i-1][w]",
  "    return dp[items.length][W]"
];

export function generateTracesDP(input: InputDP): StepDP[] {
  const steps: StepDP[] = [];
  let stepId = 0;

  const N = input.items.length;
  const W = input.capacity;

  const snap = (
    phase: string,
    narrative: string,
    activeLine: number,
    memory: Record<string, string | number>,
    currentState: StateDP
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
        comparing: [...currentState.comparing],
        writing: currentState.writing ? { ...currentState.writing } : null
      }
    });
  };

  const dp: number[][] = Array(N + 1).fill(0).map(() => Array(W + 1).fill(0));

  const state: StateDP = {
    dp,
    r: 0,
    c: 0,
    comparing: [],
    writing: null,
  };

  const memory: Record<string, string | number> = { W };

  snap("Initialization", "Khởi tạo bảng DP toàn số 0. Kích thước (số đồ vật + 1) x (sức chứa + 1).", 2, memory, state);

  for (let i = 1; i <= N; i++) {
    state.r = i;
    memory['i'] = i;
    memory['item_w'] = input.items[i-1].weight;
    memory['item_v'] = input.items[i-1].value;
    
    snap("Outer Loop - Item", `Bắt đầu xét đồ vật thứ ${i} có trọng lượng ${input.items[i-1].weight} và giá trị ${input.items[i-1].value}.`, 3, memory, state);

    for (let w = 1; w <= W; w++) {
      state.c = w;
      memory['w'] = w;
      snap("Inner Loop - Capacity", `Đang xét ba lô có mức sức chứa cụ thể là ${w}.`, 4, memory, state);

      const itemW = input.items[i - 1].weight;
      const itemV = input.items[i - 1].value;

      snap("Check Item Weight", `Kiểm tra xem đồ vật đang xét (nặng ${itemW}) có nhét vừa ba lô (chứa ${w}) không.`, 5, memory, state);

      if (itemW <= w) {
        state.comparing = [{ r: i - 1, c: w - itemW }, { r: i - 1, c: w }];
        
        const take = dp[i - 1][w - itemW] + itemV;
        memory['take'] = take;
        snap("Calculate taking item", "Trọng lượng thỏa mãn. Nếu CÓ lấy đồ vật này, cộng giá trị của nó vào giá trị tối ưu của phần không gian còn lại trong ba lô.", 6, memory, state);

        const skip = dp[i - 1][w];
        memory['skip'] = skip;
        snap("Calculate skipping item", "Tính cả trường hợp KHÔNG lấy đồ vật này (kế thừa giá trị trực tiếp từ ô phía trên).", 7, memory, state);

        state.writing = { r: i, c: w };
        dp[i][w] = Math.max(take, skip);
        state.dp[i][w] = dp[i][w];
        
        snap("Update cell with max", "Chọn giá trị lớn nhất giữa việc LẤY và KHÔNG LẤY để điền vào bảng.", 8, memory, state);
      } else {
        state.comparing = [{ r: i - 1, c: w }];
        const skip = dp[i - 1][w];
        
        state.writing = { r: i, c: w };
        dp[i][w] = skip;
        state.dp[i][w] = dp[i][w];
        
        snap("Item too heavy, copy above", "Đồ vật quá nặng, không thể nhét vừa ba lô lúc này. Bắt buộc KHÔNG LẤY (chép xuống từ trên).", 10, memory, state);
      }
      
      // Reset cell states for visual cleanup
      state.comparing = [];
      state.writing = null;
      delete memory['take'];
      delete memory['skip'];
    }
  }

  state.comparing = [{ r: N, c: W }];
  snap("Completed", "Bảng DP đã được lấp đầy. Kết quả tối ưu nằm ở ô góc dưới cùng bên phải.", 11, memory, state);

  return steps;
}
