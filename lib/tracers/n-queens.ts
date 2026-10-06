// N-Queens Problem Tracer with Full Threat Zone Calculation

export interface InputNQueens {
  N: number;
}

export interface StateNQueens {
  N: number;
  queens: number[]; // queens[row] = col index, or -1 if unplaced
  row: number;
  col: number | null;
  conflicts: { r: number; c: number }[];
  threatenedSquares: { r: number; c: number }[]; // ALL squares under attack by existing queens
  isBacktracking: boolean;
  solutionsCount: number;
}

export interface StepNQueens {
  stepId: number; phase: string; narrative: string; activeLine: number;
  callingLine?: number | number[];
  memory: Record<string, string | number>; state: StateNQueens;
}

export const PSEUDOCODE_NQUEENS = [
  "function solveNQueens(row):",
  "    if row == N:",
  "        solutionsCount++  // Found valid solution!",
  "        return",
  "    for col = 0 to N-1:",
  "        if isValidPlacement(row, col):",
  "            placeQueen(row, col)",
  "            solveNQueens(row + 1)",
  "            removeQueen(row, col)  // Backtrack"
];

// Calculate ALL squares on the chessboard that are currently attacked by queens placed at rows 0..activeRows-1
function getThreatenedSquares(queens: number[], N: number, activeRows: number): { r: number; c: number }[] {
  const threatened: { r: number; c: number }[] = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      let isAttacked = false;
      for (let qRow = 0; qRow < activeRows; qRow++) {
        const qCol = queens[qRow];
        if (qCol !== -1) {
          // Check row, column or diagonals
          if (r === qRow || c === qCol || Math.abs(r - qRow) === Math.abs(c - qCol)) {
            isAttacked = true;
            break;
          }
        }
      }
      if (isAttacked) {
        threatened.push({ r, c });
      }
    }
  }
  return threatened;
}

function isQueenValid(queens: number[], r: number, c: number): { valid: boolean; conflicts: { r: number; c: number }[] } {
  const conflicts: { r: number; c: number }[] = [];
  for (let i = 0; i < r; i++) {
    const qCol = queens[i];
    if (qCol === c || Math.abs(qCol - c) === Math.abs(i - r)) {
      conflicts.push({ r: i, c: qCol });
    }
  }
  return { valid: conflicts.length === 0, conflicts };
}

export function generateTracesNQueens(input: InputNQueens): StepNQueens[] {
  const steps: StepNQueens[] = [];
  let stepId = 0;
  const N = Math.min(8, Math.max(4, input.N));

  const queens = Array(N).fill(-1);

  const snap = (phase: string, narrative: string, activeLine: number, memory: Record<string, string | number>, st: StateNQueens, callingLine?: number | number[]) => {
    steps.push({
      stepId: stepId++, phase, narrative, activeLine, callingLine, memory: { ...memory },
      state: {
        N: st.N,
        queens: [...st.queens],
        row: st.row, col: st.col,
        conflicts: [...st.conflicts],
        threatenedSquares: [...st.threatenedSquares],
        isBacktracking: st.isBacktracking,
        solutionsCount: st.solutionsCount
      }
    });
  };

  const state: StateNQueens = {
    N, queens, row: 0, col: null, conflicts: [], threatenedSquares: [], isBacktracking: false, solutionsCount: 0
  };

  const mem: Record<string, string | number> = { N };
  const MAX_STEPS = 2500;
  const stopAtFirst = true; // Theo yêu cầu, dừng lại để giữ cấu hình ăn khớp hoàn chỉnh đẹp nhất sau lời giải đầu tiên!

  snap("Khởi tạo Bàn Cờ N-Queens", `Bắt đầu tìm cấu hình đặt ${N} Quân Hậu trên bàn cờ ${N}x${N}. Vùng đe dọa của các quân Hậu sẽ phủ tia đỏ toàn bộ bàn cờ.`, 1, mem, state);

  function solve(r: number): void {
    if (stepId >= MAX_STEPS) return;
    if (stopAtFirst && state.solutionsCount >= 1) return;

    if (r === N) {
      state.solutionsCount++;
      state.row = N - 1; state.col = null; state.conflicts = [];
      state.threatenedSquares = getThreatenedSquares(queens, N, N);
      mem['solutions'] = state.solutionsCount;
      snap("TÌM THẤY CẤU HÌNH HỢP LỆ! 🎉", `Hoàn tất đặt ${N} quân Hậu! Bàn cờ đạt trạng thái cân bằng tuyệt đối.`, 3, mem, state);
      return;
    }

    state.row = r;
    mem['current_row'] = r;
    state.threatenedSquares = getThreatenedSquares(queens, N, r);
    snap(`Tính Vùng Đe Dọa tại Hàng ${r}`, `Cập nhật Vùng đe dọa (Tia chiếu màu đỏ): ${r} quân Hậu ở các hàng trên đang kiểm soát ${state.threatenedSquares.length} ô trên bàn cờ. Chuẩn bị thử đặt Hậu vào Hàng ${r}...`, 5, mem, state);

    for (let c = 0; c < N; c++) {
      if (stepId >= MAX_STEPS) return;
      if (stopAtFirst && state.solutionsCount >= 1) return;

      state.col = c; state.isBacktracking = false;
      mem['try_col'] = c;

      const check = isQueenValid(queens, r, c);
      state.conflicts = check.conflicts;

      // Trace inside isValidPlacement with callingLine 6
      snap(`Kiểm tra an toàn: isValidPlacement(${r}, ${c})`, `Đang duyệt kiểm tra xung đột hàng dọc và 2 đường chéo với các quân hậu trước đó...`, 15, mem, state, 6);

      if (check.valid) {
        queens[r] = c;
        state.queens[r] = c;
        state.threatenedSquares = getThreatenedSquares(queens, N, r + 1);
        snap(`Đặt Hậu thành công tại (${r}, ${c})`, `Vị trí (${r}, ${c}) NẰM NGOÀI vùng đe dọa! Đặt Hậu an toàn và mở rộng thêm các tia chiếu đe dọa mới xuống các hàng bên dưới...`, 7, mem, state);

        solve(r + 1);
        
        if (stopAtFirst && state.solutionsCount >= 1) return;

        if (stepId < MAX_STEPS) {
          state.row = r; state.col = c; state.isBacktracking = true;
          queens[r] = -1;
          state.queens[r] = -1;
          state.conflicts = [];
          state.threatenedSquares = getThreatenedSquares(queens, N, r);
          snap(`Backtrack (Rút Hậu khỏi (${r}, ${c}))`, `Đã giải xong nhánh phía dưới. Rút Hậu tại (${r}, ${c}) ra, giải phóng các tia chiếu đe dọa để tiếp tục thử sang Cột ${c + 1}...`, 9, mem, state);
        }
      } else {
        snap(`Ô (${r}, ${c}) NẰM TRONG VÙNG ĐE DỌA!`, `Không thể đặt Hậu tại (${r}, ${c})! Ô này đang nằm trên tia chiếu tấn công của Hậu màu đỏ tại (${check.conflicts[0].r}, ${check.conflicts[0].c}). Thử sang cột bên phải...`, 15, mem, state, 6);
      }
    }

    state.conflicts = [];
  }

  solve(0);
  
  if (!stopAtFirst) {
    state.row = N; state.col = null; state.conflicts = [];
  }
  
  if (state.solutionsCount > 0) {
    snap(
      "Kết thúc Tìm kiếm N-Queens",
      `Hoàn tất quét toàn bộ bàn cờ N-Queens! Đã tìm ra lời giải hợp lệ cho bài toán.`,
      9, mem, state
    );
  } else if (stepId >= MAX_STEPS) {
    snap(
      "Đạt giới hạn số bước mô phỏng!",
      `Đã duyệt qua ${MAX_STEPS} bước mà chưa tìm thấy cấu hình hợp lệ tiếp theo. Tạm dừng để đảm bảo hiệu năng.`,
      9, mem, state
    );
  } else {
    snap(
      "Không tìm thấy lời giải!",
      `Không tồn tại cách xếp ${N} quân Hậu trên bàn cờ mà không đe dọa lẫn nhau.`,
      9, mem, state
    );
  }

  return steps;
}
