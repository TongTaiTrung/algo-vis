export interface InputBookShop {
  budget: number; // x
  prices: number[]; // h
  pages: number[]; // s
}

export interface StateBookShop {
  dp: number[][];
  i: number;
  w: number;
  comparing: { r: number; c: number }[];
  writing: { r: number; c: number } | null;
  decision: 'skip' | 'take' | null;
  selectedBooks: number[];
}

export interface StepBookShop {
  stepId: number;
  phase: string;
  narrative: string;
  activeLine: number;
  memory: Record<string, string | number>;
  state: StateBookShop;
}

export function generateTracesBookShop(input: InputBookShop): StepBookShop[] {
  const steps: StepBookShop[] = [];
  let stepId = 0;

  const n = input.prices.length;
  const budget = input.budget;
  const prices = input.prices;
  const pages = input.pages;

  const snap = (
    phase: string,
    narrative: string,
    activeLine: number,
    memory: Record<string, string | number>,
    currentState: StateBookShop
  ) => {
    steps.push({
      stepId: stepId++,
      phase,
      narrative,
      activeLine,
      memory: { ...memory },
      state: {
        dp: currentState.dp.map(row => [...row]),
        i: currentState.i,
        w: currentState.w,
        comparing: [...currentState.comparing],
        writing: currentState.writing ? { ...currentState.writing } : null,
        decision: currentState.decision,
        selectedBooks: [...currentState.selectedBooks]
      }
    });
  };

  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(budget + 1).fill(0));

  const state: StateBookShop = {
    dp,
    i: 0,
    w: 0,
    comparing: [],
    writing: null,
    decision: null,
    selectedBooks: []
  };

  const memory: Record<string, string | number> = {
    budget,
    bookCount: n
  };

  snap("Initialization", `Bắt đầu CSES Book Shop (0/1 Knapsack tối đa số trang sách với ngân sách ${budget}). Khởi tạo bảng dp kích thước (${n + 1}) x (${budget + 1}) toàn 0.`, 2, memory, state);

  for (let i = 1; i <= n; i++) {
    const bookPrice = prices[i - 1];
    const bookPages = pages[i - 1];
    state.i = i;
    memory['book'] = i;
    memory['price'] = bookPrice;
    memory['pages'] = bookPages;

    snap("Outer Loop - Consider Book", `Vòng lặp ngoài: Đang xét cuốn sách #${i} có giá = ${bookPrice} xu và số trang = ${bookPages} trang.`, 3, memory, state);

    for (let w = 0; w <= budget; w++) {
      state.w = w;
      memory['budget'] = w;

      const skipVal = dp[i - 1][w];
      state.comparing = [{ r: i - 1, c: w }];
      state.decision = 'skip';

      snap("Evaluate Skip Option", `Ngân sách w = ${w}: Nếu KHÔNG MUA cuốn sách #${i}, số trang tối đa bằng dp[${i-1}][${w}] = ${skipVal}.`, 5, memory, state);

      let finalVal = skipVal;
      let decision: 'skip' | 'take' = 'skip';

      if (w >= bookPrice) {
        const takeVal = dp[i - 1][w - bookPrice] + bookPages;
        state.comparing = [{ r: i - 1, c: w }, { r: i - 1, c: w - bookPrice }];
        snap("Evaluate Take Option", `Ngân sách đủ (${w} >= ${bookPrice}): Nếu MUA cuốn sách #${i}, ta có: dp[${i-1}][${w - bookPrice}] + ${bookPages} = ${dp[i-1][w - bookPrice]} + ${bookPages} = ${takeVal} trang.`, 6, memory, state);

        if (takeVal > skipVal) {
          finalVal = takeVal;
          decision = 'take';
        }
      } else {
        snap("Budget Insufficient", `Ngân sách w = ${w} không đủ mua sách #${i} (giá ${bookPrice}), bắt buộc phải bỏ qua.`, 5, memory, state);
      }

      dp[i][w] = finalVal;
      state.dp = dp.map(row => [...row]);
      state.writing = { r: i, c: w };
      state.decision = decision;
      memory[`dp[${i}][${w}]`] = finalVal;

      snap("Update DP Cell", `Cập nhật ô dp[${i}][${w}] = ${finalVal} (${decision === 'take' ? `MUA sách #${i}` : `BỎ QUA sách #${i}`}).`, 7, memory, state);

      state.comparing = [];
      state.writing = null;
      state.decision = null;
    }
  }

  // Backtrack to find chosen books
  const chosen: number[] = [];
  let curW = budget;
  for (let i = n; i >= 1; i--) {
    if (dp[i][curW] !== dp[i - 1][curW]) {
      chosen.push(i);
      curW -= prices[i - 1];
    }
  }
  chosen.reverse();
  state.selectedBooks = chosen;
  state.i = n;
  state.w = budget;
  state.writing = { r: n, c: budget };
  memory['maxPages'] = dp[n][budget];
  memory['boughtBooks'] = chosen.join(', ');

  snap("Completed", `Thuật toán hoàn tất! Số trang sách tối đa có thể mua được là ${dp[n][budget]} trang. Các cuốn sách được chọn: #${chosen.join(', #')}.`, 8, memory, state);

  return steps;
}
