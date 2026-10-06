export const CODE_GRID_PATHS = {
  cpp: `#include <vector>
#include <string>

using namespace std;

int gridPaths(int n, const vector<string>& grid) {
    const int MOD = 1e9 + 7;
    vector<vector<int>> dp(n, vector<int>(n, 0));
    if (grid[0][0] == '.') dp[0][0] = 1;

    for (int r = 0; r < n; r++) {
        for (int c = 0; c < n; c++) {
            if (grid[r][c] == '*') {
                dp[r][c] = 0;
                continue;
            }
            if (r > 0) dp[r][c] = (dp[r][c] + dp[r - 1][c]) % MOD;
            if (c > 0) dp[r][c] = (dp[r][c] + dp[r][c - 1]) % MOD;
        }
    }
    return dp[n - 1][n - 1];
}`,
  python: `def grid_paths(n, grid):
    MOD = 10**9 + 7
    dp = [[0] * n for _ in range(n)]
    if grid[0][0] == '.':
        dp[0][0] = 1

    for r in range(n):
        for c in range(n):
            if grid[r][c] == '*':
                dp[r][c] = 0
                continue
            if r > 0:
                dp[r][c] = (dp[r][c] + dp[r - 1][c]) % MOD
            if c > 0:
                dp[r][c] = (dp[r][c] + dp[r][c - 1]) % MOD

    return dp[n - 1][n - 1]`,
  javascript: `function gridPaths(n, grid) {
    const MOD = 1e9 + 7;
    const dp = Array.from({ length: n }, () => new Array(n).fill(0));
    if (grid[0][0] === '.') dp[0][0] = 1;

    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            if (grid[r][c] === '*') {
                dp[r][c] = 0;
                continue;
            }
            if (r > 0) dp[r][c] = (dp[r][c] + dp[r - 1][c]) % MOD;
            if (c > 0) dp[r][c] = (dp[r][c] + dp[r][c - 1]) % MOD;
        }
    }
    return dp[n - 1][n - 1];
}`
};

export const MAPPINGS_GRID_PATHS = {
  cpp: {
    1: 6,
    2: 8,
    3: 9,
    4: 11,
    5: 12,
    6: 13,
    7: 17,
    8: 18,
    9: 21
  },
  python: {
    1: 1,
    2: 3,
    3: 4,
    4: 7,
    5: 8,
    6: 9,
    7: 12,
    8: 14,
    9: 16
  },
  javascript: {
    1: 1,
    2: 3,
    3: 4,
    4: 6,
    5: 7,
    6: 8,
    7: 12,
    8: 13,
    9: 16
  }
};
