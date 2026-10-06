// Range DP for Bracket / Brace Matching (LeetCode Classic)
// Finds the length of the longest valid bracket subsequence in S[i..j]

export interface InputBracketDP {
  s: string; // e.g. "([{})" or "(()[])"
}

export interface StateBracketDP {
  s: string;
  dp: number[][];             // dp[i][j] = max valid length in range [i..j]
  i: number | null;           // left index of range
  j: number | null;           // right index of range
  k: number | null;           // split point index
  comparingCells: { r: number; c: number }[];
  writingCell: { r: number; c: number } | null;
  matchedPair: boolean;
}

export interface StepBracketDP {
  stepId: number;
  phase: string;
  narrative: string;
  activeLine: number;
  memory: Record<string, string | number>;
  state: StateBracketDP;
}

export const PSEUDOCODE_BRACKET_DP = [
  "function LongestValidBraces(S):",
  "    n = S.length",
  "    dp = matrix(n, n, 0)",
  "    for len = 2 to n:",
  "        for i = 0 to n - len:",
  "            j = i + len - 1",
  "            if matches(S[i], S[j]):",
  "                dp[i][j] = dp[i+1][j-1] + 2",
  "            for k = i to j - 1:",
  "                dp[i][j] = max(dp[i][j], dp[i][k] + dp[k+1][j])",
  "    return dp[0][n-1]"
];

export function isMatch(a: string, b: string): boolean {
  return (a === '(' && b === ')') || (a === '[' && b === ']') || (a === '{' && b === '}');
}

export function generateTracesBracketDP(input: InputBracketDP): StepBracketDP[] {
  const steps: StepBracketDP[] = [];
  let stepId = 0;
  const s = input.s;
  const n = s.length;

  const snap = (phase: string, narrative: string, activeLine: number, memory: Record<string, string | number>, st: StateBracketDP) => {
    steps.push({
      stepId: stepId++, phase, narrative, activeLine, memory: { ...memory },
      state: {
        s: st.s,
        dp: st.dp.map(row => [...row]),
        i: st.i, j: st.j, k: st.k,
        comparingCells: [...st.comparingCells],
        writingCell: st.writingCell ? { ...st.writingCell } : null,
        matchedPair: st.matchedPair
      }
    });
  };

  const dp: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
  const state: StateBracketDP = {
    s, dp, i: null, j: null, k: null, comparingCells: [], writingCell: null, matchedPair: false
  };

  const mem: Record<string, string | number> = { N: n };
  snap("Khởi tạo Ma trận Range DP", "Bắt đầu thuật toán Quy Hoạch Động Ngoặc (Brace DP). Ta lập bảng DP kích thước N x N, trong đó dp[i][j] lưu độ dài chuỗi ngoặc hợp lệ dài nhất trong đoạn từ i đến j. Đường chéo chính (i == j) có giá trị = 0 do 1 ngoặc đứng lẻ không thể tự hợp lệ.", 2, mem, state);

  for (let len = 2; len <= n; len++) {
    mem['len'] = len;
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      state.i = i; state.j = j; state.k = null;
      mem['i'] = i; mem['j'] = j; mem['S[i]'] = s[i]; mem['S[j]'] = s[j];
      
      const matched = isMatch(s[i], s[j]);
      state.matchedPair = matched;

      if (matched) {
        state.comparingCells = len > 2 ? [{ r: i + 1, c: j - 1 }] : [];
        const innerVal = len > 2 ? dp[i + 1][j - 1] : 0;
        dp[i][j] = innerVal + 2;
        state.dp[i][j] = dp[i][j];
        state.writingCell = { r: i, c: j };

        snap("Ghép Đôi Ngoặc Thành Công!", `Hai đầu S[${i}] = '${s[i]}' và S[${j}] = '${s[j]}' KHỚP NHAU! Ta có một cặp ngoặc đóng mở hoàn chỉnh bao ngoài. Độ dài = (Bên trong dp[${i+1}][${j-1}] = ${innerVal}) + 2 = ${dp[i][j]}.`, 7, mem, state);
      } else {
        state.comparingCells = [];
        snap("Hai Đầu Ngoặc Không Khớp", `Xét đoạn [${i}..${j}]: S[${i}] = '${s[i]}' và S[${j}] = '${s[j]}' KHÔNG khớp nhau. Ta khởi tạo dp[${i}][${j}] = 0 và chuẩn bị thử mọi điểm cắt k ở giữa.`, 8, mem, state);
      }

      // Try split points k
      for (let k = i; k < j; k++) {
        state.k = k;
        mem['k'] = k;
        state.comparingCells = [{ r: i, c: k }, { r: k + 1, c: j }];
        
        const splitVal = dp[i][k] + dp[k + 1][j];
        const oldVal = dp[i][j];

        if (splitVal > oldVal) {
          dp[i][j] = splitVal;
          state.dp[i][j] = splitVal;
          state.writingCell = { r: i, c: j };
          mem['take_split'] = splitVal;
          snap("Cập Nhật Điểm Cắt k Tốt Hơn", `Thử cắt chuỗi ngoặc tại k = ${k}: Ghép đoạn trái [${i}..${k}] (dp=${dp[i][k]}) + đoạn phải [${k+1}..${j}] (dp=${dp[k+1][j]}) = ${splitVal}. Giá trị này TỐT HƠN kỷ lục cũ ${oldVal}! Cập nhật dp[${i}][${j}] = ${splitVal}.`, 10, mem, state);
          delete mem['take_split'];
        } else {
          snap("Thử Mốc Cắt k (Không Tốt Hơn)", `Thử cắt tại k = ${k}: Tổng hai đoạn [${i}..${k}] (${dp[i][k]}) + [${k+1}..${j}] (${dp[k+1][j]}) = ${splitVal}. Không vượt qua kỷ lục hiện tại (${oldVal}), giữ nguyên.`, 9, mem, state);
        }
      }

      state.comparingCells = [];
      state.writingCell = null;
      delete mem['k'];
    }
  }

  state.i = 0; state.j = n - 1; state.k = null;
  state.comparingCells = []; state.writingCell = { r: 0, c: n - 1 };
  mem['ans'] = dp[0][n - 1];
  snap("Hoàn Tất Quy Hoạch Động Ngoặc", `Thuật toán Range DP kết thúc! Ô trên cùng bên phải dp[0][${n-1}] = ${dp[0][n-1]} chính là độ dài chuỗi ngoặc đóng mở hợp lệ dài nhất nằm trong toàn bộ chuỗi S.`, 11, mem, state);

  return steps;
}
