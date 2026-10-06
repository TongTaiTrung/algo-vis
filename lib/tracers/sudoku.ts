// Sudoku Solver Tracer with Scope Beam Constraints & Candidates Calculation

export interface InputSudoku {
  board: number[][];
}

export interface StateSudoku {
  board: number[][];
  initialBoard: number[][];
  row: number | null;
  col: number | null;
  num: number | null;
  isBacktracking: boolean;
  conflictCells: { r: number; c: number }[];
  usedNumbers: number[];
  validCandidates: number[];
}

export interface StepSudoku {
  stepId: number; phase: string; narrative: string; activeLine: number;
  callingLine?: number | number[];
  memory: Record<string, string | number>; state: StateSudoku;
}

export const PSEUDOCODE_SUDOKU = [
  "function solveSudoku(board):",
  "    for row = 0 to N-1:",
  "        for col = 0 to N-1:",
  "            if board[row][col] == 0:",
  "                for num = 1 to N:",
  "                    if isValid(board, row, col, num):",
  "                        board[row][col] = num",
  "                        if solveSudoku(board): return true",
  "                        board[row][col] = 0  // Backtrack",
  "                return false",
  "    return true"
];

function getSudokuScopeInfo(board: number[][], r: number, c: number): { used: number[]; candidates: number[]; conflicts: (num: number) => { r: number; c: number }[] } {
  const N = board.length;
  const sub = Math.sqrt(N);
  const usedSet = new Set<number>();

  // Row
  for (let col = 0; col < N; col++) {
    if (board[r][col] !== 0) usedSet.add(board[r][col]);
  }
  // Col
  for (let row = 0; row < N; row++) {
    if (board[row][c] !== 0) usedSet.add(board[row][c]);
  }
  // Subgrid
  const startR = Math.floor(r / sub) * sub;
  const startC = Math.floor(c / sub) * sub;
  for (let row = startR; row < startR + sub; row++) {
    for (let col = startC; col < startC + sub; col++) {
      if (board[row][col] !== 0) usedSet.add(board[row][col]);
    }
  }

  const used = Array.from(usedSet).sort((a, b) => a - b);
  const candidates: number[] = [];
  for (let num = 1; num <= N; num++) {
    if (!usedSet.has(num)) candidates.push(num);
  }

  const conflictsGetter = (num: number) => {
    const conflictCells: { r: number; c: number }[] = [];
    for (let col = 0; col < N; col++) {
      if (col !== c && board[r][col] === num) conflictCells.push({ r, c: col });
    }
    for (let row = 0; row < N; row++) {
      if (row !== r && board[row][c] === num) conflictCells.push({ r: row, c });
    }
    for (let row = startR; row < startR + sub; row++) {
      for (let col = startC; col < startC + sub; col++) {
        if ((row !== r || col !== c) && board[row][col] === num) {
          if (!conflictCells.some(cell => cell.r === row && cell.c === col)) {
            conflictCells.push({ r: row, c: col });
          }
        }
      }
    }
    return conflictCells;
  };

  return { used, candidates, conflicts: conflictsGetter };
}

export function generateTracesSudoku(input: InputSudoku): StepSudoku[] {
  const steps: StepSudoku[] = [];
  let stepId = 0;
  const N = input.board.length;

  const initialCopy = input.board.map(row => [...row]);
  const board = input.board.map(row => [...row]);

  const snap = (phase: string, narrative: string, activeLine: number, memory: Record<string, string | number>, st: StateSudoku, callingLine?: number | number[]) => {
    steps.push({
      stepId: stepId++, phase, narrative, activeLine, callingLine, memory: { ...memory },
      state: {
        board: st.board.map(row => [...row]),
        initialBoard: st.initialBoard,
        row: st.row, col: st.col, num: st.num,
        isBacktracking: st.isBacktracking,
        conflictCells: [...st.conflictCells],
        usedNumbers: [...st.usedNumbers],
        validCandidates: [...st.validCandidates]
      }
    });
  };

  const state: StateSudoku = {
    board, initialBoard: initialCopy, row: null, col: null, num: null, isBacktracking: false,
    conflictCells: [], usedNumbers: [], validCandidates: []
  };

  const mem: Record<string, string | number> = { N };
  const MAX_STEPS = 25000; // Tăng cực kỳ cao để mọi 9x9 cực khó đều qua trót lọt

  snap("Khởi tạo Sudoku Board", `Bắt đầu giải đố Sudoku kích thước ${N}x${N}. Hệ thống sẽ bật Tia quét 3 Chiều (Hàng, Cột, Sub-grid) và tính danh sách các Ứng Viên khả thi tốt nhất cho ô trống.`, 1, mem, state);

  function findBestCell(): { r: number; c: number; scope: ReturnType<typeof getSudokuScopeInfo> } | null {
    let minCandidates = N + 1;
    let best = null;
    for (let r = 0; r < N; r++) {
      if (!board[r]) continue;
      for (let c = 0; c < N; c++) {
        if (board[r][c] === 0) {
          const scope = getSudokuScopeInfo(board, r, c);
          if (scope.candidates.length < minCandidates) {
            minCandidates = scope.candidates.length;
            best = { r, c, scope };
            if (minCandidates <= 1) return best; // Tối ưu nhất
          }
        }
      }
    }
    return best;
  }

  function solve(): boolean {
    if (stepId >= MAX_STEPS) return false;

    const bestCell = findBestCell();
    if (!bestCell) return true; // Hoàn tất điền số

    const { r, c, scope } = bestCell;
    
    state.row = r; state.col = c;
    state.usedNumbers = scope.used;
    state.validCandidates = scope.candidates;
    
    mem['row'] = r; mem['col'] = c;
    mem['used_nums'] = scope.used.join(',');
    mem['candidates'] = scope.candidates.join(',');

    snap("Phân Tích Tia Quét Ràng Buộc", `Tìm ô trống có ít ứng viên nhất: Nhắm vào ô [${r}, ${c}]. Tia quét Scope Hàng ${r}, Cột ${c} và Khối Sub-grid đã bị chiếm bởi các số [${scope.used.join(', ')}]. Dãy số ứng viên khả thi: [${scope.candidates.join(', ')}].`, 4, mem, state);

    if (scope.candidates.length === 0) {
      snap("Bế tắc! (Không còn số hợp lệ)", `Ô [${r}, ${c}] không còn bất kỳ ứng viên nào hợp lệ để điền. Nhánh này hoàn toàn bế tắc, tiến hành Quay lui (Backtrack).`, 12, mem, state);
      state.row = null; state.col = null;
      return false;
    }

    for (let num = 1; num <= N; num++) {
      if (stepId >= MAX_STEPS) return false;

      state.num = num; state.isBacktracking = false;
      mem['trying_num'] = num;
      
      const conflicts = scope.conflicts(num);
      state.conflictCells = conflicts;

      state.board[r][c] = num;

      snap("Kiểm tra tính hợp lệ bằng isValid()", `Gọi hàm isValid(board, ${r}, ${c}, ${num}) để quét hàng, cột và khối subgrid...`, 15, mem, state, 6);

      if (conflicts.length === 0) {
        board[r][c] = num;
        snap("Điền số hợp lệ!", `Yếm thử số ${num} vào ô [${r}, ${c}]: Số ${num} KHÔNG BỊ XUNG ĐỘT! Đặt cố định ${num} và đệ quy tiến sang ô tiếp theo.`, 7, mem, state);

        if (solve()) return true;

        if (stepId < MAX_STEPS) {
          state.row = r; state.col = c; state.num = num; state.isBacktracking = true;
          board[r][c] = 0;
          state.board[r][c] = 0;
          state.conflictCells = [];
          mem['backtrack_cell'] = `[${r},${c}]`;
          snap("Backtrack! (Xóa số khôi phục ô trống)", `Đường đi phía sau bị bế tắc! Tiến hành Quay lui (Backtrack): Xóa số ${num} khỏi ô [${r}, ${c}], rút về ô trước đó.`, 9, mem, state);
          delete mem['backtrack_cell'];
        }
      } else {
        snap("Yếm Thử Số Thất Bại! (Collision)", `Yếm thử số ${num} vào ô [${r}, ${c}]: BỊ TRÙNG LẶP! Số ${num} đã có mặt ở ô màu đỏ trên hàng/cột/khối. Số ${num} bị loại bỏ.`, 15, mem, state, 6);
        state.board[r][c] = 0;
      }
    }

    state.conflictCells = [];
    state.num = null;
    return false;
  }

  const success = solve();
  state.row = null; state.col = null; state.num = null; state.conflictCells = []; state.usedNumbers = []; state.validCandidates = [];
  
  if (success) {
    snap("Hoàn tất giải Sudoku!", "Đã điền hoàn chỉnh bảng Sudoku thỏa mãn 100% ràng buộc Hàng, Cột và Khối!", 11, mem, state);
  } else if (stepId >= MAX_STEPS) {
    snap("Đạt giới hạn Step mô phỏng!", `Mô phỏng dừng tại giới hạn ${MAX_STEPS} bước để bảo vệ hệ thống. Cần thuật toán tối ưu hơn.`, 11, mem, state);
  } else {
    snap("Không tìm thấy lời giải hợp lệ!", "Không tồn tại cấu hình điền số thỏa mãn tất cả các ràng buộc trên bảng Sudoku này (Vô nghiệm).", 11, mem, state);
  }

  return steps;
}
