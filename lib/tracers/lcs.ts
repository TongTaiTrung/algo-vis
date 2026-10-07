export interface InputLcs {
  s1: string;
  s2: string;
}

export interface StepLcs {
  i: number;
  j: number;
  dp: number[][];
  lcsSoFar: string;
  phase: 'INIT' | 'CALC' | 'BACKTRACK_START' | 'BACKTRACK_STEP' | 'DONE';
  backtrackPoint?: {r: number, c: number};
  match?: boolean;
  activeLine: number;
  narrative: string;
  memory: Record<string, string | number>;
}

export function traceLcs(input: InputLcs): StepLcs[] {
  const steps: StepLcs[] = [];
  const { s1, s2 } = input;
  const n = s1.length;
  const m = s2.length;
  
  const cloneDP = (arr: number[][]) => arr.map(row => [...row]);

  const dp: number[][] = Array(n + 1).fill(0).map(() => Array(m + 1).fill(0));
  
  steps.push({
    i: -1,
    j: -1,
    dp: cloneDP(dp),
    lcsSoFar: "",
    phase: 'INIT',
    activeLine: 13,
    narrative: `Khởi tạo mảng DP kích thước ${n + 1} x ${m + 1} với độ dài ban đầu là 0. Hàng 0 và cột 0 đại diện cho chuỗi rỗng.`,
    memory: { 's1.length': n, 's2.length': m }
  });

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      let isMatch = s1[i - 1] === s2[j - 1];
      
      let narrative = `Đang so sánh s1[${i-1}]='${s1[i-1]}' và s2[${j-1}]='${s2[j-1]}'. `;
      if (isMatch) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        narrative += `Khớp! Tăng chiều dài dãy con chung từ chéo trái trên (dp[${i-1}][${j-1}]) lên 1 thành ${dp[i][j]}.`;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        narrative += `Không khớp. Chọn giá trị lớn nhất từ ô trên (dp[${i-1}][${j}]=${dp[i-1][j]}) hoặc ô trái (dp[${i}][${j-1}]=${dp[i][j-1]}) -> ${dp[i][j]}.`;
      }
      
      steps.push({
        i,
        j,
        dp: cloneDP(dp),
        lcsSoFar: "",
        phase: 'CALC',
        match: isMatch,
        activeLine: isMatch ? 18 : 20,
        narrative,
        memory: { 'i': i, 'j': j, [`s1[${i-1}]`]: s1[i-1], [`s2[${j-1}]`]: s2[j-1] }
      });
    }
  }

  // Backtracking to find LCS string
  steps.push({
    i: -1,
    j: -1,
    dp: cloneDP(dp),
    lcsSoFar: "",
    phase: 'BACKTRACK_START',
    activeLine: 26,
    narrative: `Bắt đầu truy vết từ ô dp[${n}][${m}] để tìm chuỗi LCS cuối cùng. Giá trị lớn nhất là ${dp[n][m]}.`,
    memory: { 'r': n, 'c': m }
  });

  let r = n, c = m;
  let lcsArr: string[] = [];
  
  while (r > 0 && c > 0) {
    if (s1[r - 1] === s2[c - 1]) {
        let charMatch = s1[r-1];
        steps.push({
            i: -1, j: -1, dp: cloneDP(dp), lcsSoFar: lcsArr.slice().reverse().join(''), phase: 'BACKTRACK_STEP', backtrackPoint: {r, c}, match: true,
            activeLine: 29, narrative: `s1[${r-1}] == s2[${c-1}] ('${charMatch}'). Thêm vào đầu LCS và lùi chéo.`, memory: { r, c, char: charMatch }
        });
        lcsArr.push(s1[r - 1]);
        r--;
        c--;
    } else if (dp[r - 1][c] > dp[r][c - 1]) {
        steps.push({
            i: -1, j: -1, dp: cloneDP(dp), lcsSoFar: lcsArr.slice().reverse().join(''), phase: 'BACKTRACK_STEP', backtrackPoint: {r, c}, match: false,
            activeLine: 32, narrative: `Ô trên (${dp[r-1][c]}) lớn hơn ô trái (${dp[r][c-1]}). Lùi lên trên (r--).`, memory: { r, c }
        });
        r--;
    } else {
        steps.push({
            i: -1, j: -1, dp: cloneDP(dp), lcsSoFar: lcsArr.slice().reverse().join(''), phase: 'BACKTRACK_STEP', backtrackPoint: {r, c}, match: false,
            activeLine: 34, narrative: `Ô trái (${dp[r][c-1]}) >= ô trên (${dp[r-1][c]}). Lùi sang trái (c--).`, memory: { r, c }
        });
        c--;
    }
  }

  steps.push({
    i: -1,
    j: -1,
    dp: cloneDP(dp),
    lcsSoFar: lcsArr.slice().reverse().join(''),
    phase: 'DONE',
    activeLine: 38,
    narrative: `Truy vết hoàn tất! Dãy con chung dài nhất (LCS) là: "${lcsArr.slice().reverse().join('')}"`,
    memory: { LCS: lcsArr.slice().reverse().join('') }
  });

  return steps;
}
