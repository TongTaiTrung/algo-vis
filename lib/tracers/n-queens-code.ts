export const CODE_NQUEENS = {
  cpp: `#include <vector>
#include <cmath>

using namespace std;

bool isValidPlacement(const vector<int>& queens, int row, int col) {
    for (int r = 0; r < row; r++) {
        int c = queens[r];
        if (c == col || abs(c - col) == abs(r - row)) {
            return false;
        }
    }
    return true;
}

void solveNQueens(int row, int n, vector<int>& queens, int& solutionsCount) {
    if (row == n) {
        solutionsCount++;
        return;
    }

    for (int col = 0; col < n; col++) {
        if (isValidPlacement(queens, row, col)) {
            queens[row] = col;
            solveNQueens(row + 1, n, queens, solutionsCount);
            queens[row] = -1; // Backtrack
        }
    }
}`,
  python: `def is_valid_placement(queens, row, col):
    for r in range(row):
        c = queens[r]
        if c == col or abs(c - col) == abs(r - row):
            return False
    return True

def solve_n_queens(row, n, queens, solutions_count):
    if row == n:
        solutions_count[0] += 1
        return

    for col in range(n):
        if is_valid_placement(queens, row, col):
            queens[row] = col
            solve_n_queens(row + 1, n, queens, solutions_count)
            queens[row] = -1  # Backtrack`,
  javascript: `function isValidPlacement(queens, row, col) {
    for (let r = 0; r < row; r++) {
        const c = queens[r];
        if (c === col || Math.abs(c - col) === Math.abs(r - row)) {
            return false;
        }
    }
    return true;
}

function solveNQueens(row, n, queens, state) {
    if (row === n) {
        state.solutionsCount++;
        return;
    }

    for (let col = 0; col < n; col++) {
        if (isValidPlacement(queens, row, col)) {
            queens[row] = col;
            solveNQueens(row + 1, n, queens, state);
            queens[row] = -1; // Backtrack
        }
    }
}`
};

export const MAPPINGS_NQUEENS = {
  cpp: {
    1: 16,
    2: 17,
    3: 18,
    4: 19,
    5: 22,
    6: 23,
    7: 24,
    8: 25,
    9: 26,
    15: [8, 9, 10]
  },
  python: {
    1: 8,
    2: 9,
    3: 10,
    4: 11,
    5: 13,
    6: 14,
    7: 15,
    8: 16,
    9: 17,
    15: [2, 3, 4]
  },
  javascript: {
    1: 10,
    2: 11,
    3: 12,
    4: 13,
    5: 15,
    6: 16,
    7: 17,
    8: 18,
    9: 19,
    15: [2, 3, 4]
  }
};
